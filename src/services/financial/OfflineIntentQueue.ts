// --- HFE OFFLINE INTENT QUEUE (POS-ENG-STD-001) ---
// Strict Fail-Closed Intent Buffer for Disconnected POS Operations

import { PersistedRetailCheckoutPayload, SubmitRetailTransactionPayload } from './HfePosFinancialPort'
import { generatePayloadChecksum } from '../../utils/cryptoHasher'
import type { CheckoutAttemptRecord, CheckoutAttemptStore } from './CafeCheckoutAttemptCoordinator'

export interface QueuedFinancialIntent {
  idempotencyKey: string
  bookId: string
  payload: SubmitRetailTransactionPayload
  status: 'pending_sync' | 'syncing' | 'failed' | 'synced'
  checksum: string
  createdAt: string
  retryCount: number
  lastError?: string
}

const DB_NAME = 'hfe_pos_financial_intents_db'
const DB_VERSION = 2
const STORE_NAME = 'financial_intents'
const CHECKOUT_ATTEMPTS_STORE = 'checkout_attempts'
import { generateUUIDv4 } from './HfePostingReadbackValidator'

export class OfflineIntentQueue<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> implements CheckoutAttemptStore<TPayload> {
  private inMemoryQueue: Map<string, QueuedFinancialIntent> = new Map()
  private inMemoryCheckoutAttempts: Map<string, CheckoutAttemptRecord<TPayload>> = new Map()

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return reject(new Error('IndexedDB unavailable in current environment'))
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'idempotencyKey' })
        }
        if (!db.objectStoreNames.contains(CHECKOUT_ATTEMPTS_STORE)) {
          db.createObjectStore(CHECKOUT_ATTEMPTS_STORE, { keyPath: 'checkoutKey' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(checkoutKey: string): Promise<CheckoutAttemptRecord<TPayload> | null> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readonly')
      const request = tx.objectStore(CHECKOUT_ATTEMPTS_STORE).get(checkoutKey)
      return await new Promise<CheckoutAttemptRecord<TPayload> | null>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch {
      return this.inMemoryCheckoutAttempts.get(checkoutKey) || null
    }
  }

  async put(record: CheckoutAttemptRecord<TPayload>): Promise<void> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readwrite')
      tx.objectStore(CHECKOUT_ATTEMPTS_STORE).put(record)
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      this.inMemoryCheckoutAttempts.set(record.checkoutKey, record)
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to persist checkout identity to physical storage: ${message}`)
      }
      this.inMemoryCheckoutAttempts.set(record.checkoutKey, record)
    }
  }

  async remove(checkoutKey: string): Promise<void> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readwrite')
      tx.objectStore(CHECKOUT_ATTEMPTS_STORE).delete(checkoutKey)
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      this.inMemoryCheckoutAttempts.delete(checkoutKey)
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to remove completed checkout identity: ${message}`)
      }
      this.inMemoryCheckoutAttempts.delete(checkoutKey)
    }
  }

  async enqueueIntent(
    payload: SubmitRetailTransactionPayload,
    bookId: string
  ): Promise<QueuedFinancialIntent> {
    if (!bookId || bookId.trim() === '') {
      throw new Error('companyBookId is required for ledger mutations. Fail-closed: zero fallback default allowed.')
    }

    const idempotencyKey = payload.idempotency_key || generateUUIDv4()
    const payloadWithKey: SubmitRetailTransactionPayload = {
      ...payload,
      idempotency_key: idempotencyKey,
    }

    const checksum = await generatePayloadChecksum(payloadWithKey)
    const intent: QueuedFinancialIntent = {
      idempotencyKey,
      bookId,
      payload: payloadWithKey,
      status: 'pending_sync',
      checksum,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    }

    try {
      const db = await this.openDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.put(intent)

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })

      // Only add to inMemoryQueue once physical disk write succeeds
      this.inMemoryQueue.set(idempotencyKey, intent)
    } catch (err) {
      if (typeof indexedDB !== 'undefined') {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[OfflineIntentQueue] FAIL-CLOSED: Physical disk write failed:', msg)
        throw new Error(`Failed to persist financial intent to physical storage: ${msg}`)
      } else {
        // Non-browser / Node.js test environment fallback
        this.inMemoryQueue.set(idempotencyKey, intent)
      }
    }

    return intent
  }

  async getPendingIntents(): Promise<QueuedFinancialIntent[]> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()

      return new Promise<QueuedFinancialIntent[]>((resolve, reject) => {
        request.onsuccess = () => {
          const results: QueuedFinancialIntent[] = request.result || []
          const pending = results.filter((i) => i.status === 'pending_sync' || i.status === 'failed')
          pending.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          resolve(pending)
        }
        request.onerror = () => reject(request.error)
      })
    } catch {
      const memoryResults = Array.from(this.inMemoryQueue.values())
        .filter((i) => i.status === 'pending_sync' || i.status === 'failed')
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      return Promise.resolve(memoryResults)
    }
  }

  async getIntent(idempotencyKey: string): Promise<QueuedFinancialIntent | null> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(idempotencyKey)

      return new Promise<QueuedFinancialIntent | null>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch {
      return Promise.resolve(this.inMemoryQueue.get(idempotencyKey) || null)
    }
  }

  async markIntentSyncing(idempotencyKey: string): Promise<void> {
    const existing = await this.getIntent(idempotencyKey)
    if (existing) {
      existing.status = 'syncing'
      existing.retryCount += 1
      this.inMemoryQueue.set(idempotencyKey, existing)

      try {
        const db = await this.openDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.put(existing)
      } catch {}
    }
  }

  async markIntentFailed(idempotencyKey: string, errorMessage: string): Promise<void> {
    const existing = await this.getIntent(idempotencyKey)
    if (existing) {
      existing.status = 'failed'
      existing.lastError = errorMessage
      this.inMemoryQueue.set(idempotencyKey, existing)

      try {
        const db = await this.openDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.put(existing)
      } catch {}
    }
  }

  async removeIntent(idempotencyKey: string): Promise<void> {
    this.inMemoryQueue.delete(idempotencyKey)

    try {
      const db = await this.openDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.delete(idempotencyKey)

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    } catch {}
  }

  async clearQueue(): Promise<void> {
    this.inMemoryQueue.clear()

    try {
      const db = await this.openDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.clear()

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    } catch {}
  }

  async getQueueCount(): Promise<number> {
    const pending = await this.getPendingIntents()
    return pending.length
  }
}
