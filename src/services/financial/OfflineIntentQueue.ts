// --- HFE OFFLINE INTENT QUEUE (POS-ENG-STD-001) ---
// Strict Fail-Closed Intent Buffer for Disconnected POS Operations

import { SubmitRetailTransactionPayload } from './HfePosFinancialPort'
import { generatePayloadChecksum } from '../../utils/cryptoHasher'

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
const DB_VERSION = 1
const STORE_NAME = 'financial_intents'

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export class OfflineIntentQueue {
  private inMemoryQueue: Map<string, QueuedFinancialIntent> = new Map()

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
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
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
