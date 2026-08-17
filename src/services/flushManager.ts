import { getPendingTransactions, removeSyncedTransaction, getPendingCount, registerOfflineBeforeUnloadGuard, OfflineTransactionEntry } from './offlineStorage'
import { verifyPayloadIntegrity } from '../utils/cryptoHasher'

export interface FlushStatusState {
  isOnline: boolean
  isFlushing: boolean
  pendingCount: number
  lastFlushTime: string | null
  lastError: string | null
}

export type StatusListener = (status: FlushStatusState) => void

export class FlushManager {
  private isOnline: boolean
  private isFlushing: boolean = false
  private pendingCount: number = 0
  private lastFlushTime: string | null = null
  private lastError: string | null = null
  private listeners: Set<StatusListener> = new Set()
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null
  private bookId: string
  private baseUrl: string

  constructor(bookId: string = '', baseUrl: string = 'http://localhost:8080') {
    this.bookId = bookId
    this.baseUrl = baseUrl
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    this.initListeners()
  }

  public setCompanyBookId(bookId: string) {
    this.bookId = bookId
  }

  /**
   * Helper function for calculating exponential backoff retry delay in ms.
   * 1s -> 2s -> 4s -> 8s -> 16s -> max 30s
   */
  public static calculateBackoffDelay(retryCount: number): number {
    const base = 1000
    const delay = base * Math.pow(2, Math.max(0, retryCount))
    return Math.min(30000, delay)
  }

  private initListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true))
      window.addEventListener('offline', () => this.handleNetworkChange(false))
      registerOfflineBeforeUnloadGuard(() => this.pendingCount)
    }
    this.refreshPendingCount()
  }

  public startBackgroundPolling(intervalMs: number = 15000) {
    if (this.healthCheckTimer) return
    this.healthCheckTimer = setInterval(async () => {
      if (this.isOnline && !this.isFlushing) {
        const healthy = await this.checkServerHealth()
        if (healthy && this.pendingCount > 0) {
          await this.flushPendingQueue()
        }
      }
    }, intervalMs)
  }

  public stopBackgroundPolling() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = null
    }
  }

  private handleNetworkChange(onlineStatus: boolean) {
    this.isOnline = onlineStatus
    this.notify()
    if (onlineStatus) {
      this.flushPendingQueue()
    }
  }

  public async checkServerHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/company-books/${this.bookId}/health`, { method: 'GET' })
      return res.ok
    } catch {
      return false
    }
  }

  public async refreshPendingCount(): Promise<number> {
    this.pendingCount = await getPendingCount()
    this.notify()
    return this.pendingCount
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    listener(this.getStatus())
    return () => {
      this.listeners.delete(listener)
    }
  }

  public getStatus(): FlushStatusState {
    return {
      isOnline: this.isOnline,
      isFlushing: this.isFlushing,
      pendingCount: this.pendingCount,
      lastFlushTime: this.lastFlushTime,
      lastError: this.lastError,
    }
  }

  private notify() {
    const state = this.getStatus()
    this.listeners.forEach(fn => fn(state))
  }

  /**
   * Main flush queue engine. Iterates over pending IndexedDB items, verifies payload SHA-256 integrity,
   * posts to REST backend with original X-Idempotency-Key, and handles retry backoff on server errors.
   */
  public async flushPendingQueue(): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isFlushing) {
      return { syncedCount: 0, failedCount: 0 }
    }

    this.isFlushing = true
    this.lastError = null
    this.notify()

    let syncedCount = 0
    let failedCount = 0

    if (!this.bookId || this.bookId.trim() === '') {
      console.warn('[FlushManager] Cannot flush queue: No companyBookId configured. Fail-closed.')
      this.lastError = 'Missing companyBookId: Fail-closed'
      this.isFlushing = false
      this.notify()
      return { syncedCount: 0, failedCount: 0 }
    }

    try {
      const pendingItems: OfflineTransactionEntry[] = await getPendingTransactions()
      this.pendingCount = pendingItems.length
      this.notify()

      for (const entry of pendingItems) {
        // Step 1: Web Crypto SHA-256 Integrity Verification
        const isValidIntegrity = await verifyPayloadIntegrity(entry.payload, entry.checksum)
        if (!isValidIntegrity) {
          console.error(`[FlushManager] Tampered checksum detected for idempotencyKey: ${entry.idempotencyKey}. Dropping corrupted payload.`)
          await removeSyncedTransaction(entry.idempotencyKey)
          failedCount++
          continue
        }

        // Step 2: Submit to backend API with original X-Idempotency-Key
        try {
          const res = await fetch(`${this.baseUrl}/v1/company-books/${this.bookId}/transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': entry.idempotencyKey,
            },
            body: JSON.stringify(entry.payload),
          })

          if (res.ok || res.status === 200 || res.status === 201) {
            await removeSyncedTransaction(entry.idempotencyKey)
            syncedCount++
          } else if (res.status >= 500) {
            // 5xx Server Error -> apply exponential backoff delay before proceeding
            entry.retryCount = (entry.retryCount || 0) + 1
            const delay = FlushManager.calculateBackoffDelay(entry.retryCount)
            console.warn(`[FlushManager] Server error ${res.status}. Backing off for ${delay}ms (retry #${entry.retryCount})`)
            await new Promise(r => setTimeout(r, Math.min(delay, 2000))) // Cap wait in loop for UX
            failedCount++
          } else {
            // Client error (4xx) -> log and discard or flag
            console.error(`[FlushManager] Transaction rejected with status ${res.status}`)
            await removeSyncedTransaction(entry.idempotencyKey)
            failedCount++
          }
        } catch (netErr: any) {
          this.lastError = netErr?.message || 'Network flush request failed'
          failedCount++
          break // Stop flushing when network drops completely
        }
      }

      this.lastFlushTime = new Date().toISOString()
    } finally {
      this.isFlushing = false
      await this.refreshPendingCount()
    }

    return { syncedCount, failedCount }
  }
}

// Global Singleton Instance
export const flushManager = new FlushManager()
