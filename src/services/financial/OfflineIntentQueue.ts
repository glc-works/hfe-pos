// --- HFE OFFLINE INTENT QUEUE (POS-ENG-STD-001) ---
// Strict Fail-Closed Intent Buffer for Disconnected POS Operations

import { PersistedRetailCheckoutPayload, SubmitRetailTransactionPayload } from './HfePosFinancialPort'
import { generatePayloadChecksum } from '../../utils/cryptoHasher'
import type { CheckoutAttemptRecord, CheckoutAttemptStore, PostedDeleteExpectation } from './CafeCheckoutAttemptCoordinator'
import { canonicalCleanupEvidence } from './CheckoutCleanupEvidence'

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

export function isIndexedDbConstraintError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'ConstraintError'
}

export class OfflineIntentQueue<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> implements CheckoutAttemptStore<TPayload> {
  private static sharedInMemoryQueue: Map<string, QueuedFinancialIntent> = new Map()
  private static sharedInMemoryCheckoutAttempts: Map<string, CheckoutAttemptRecord<any>> = new Map()

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
      return OfflineIntentQueue.sharedInMemoryCheckoutAttempts.get(checkoutKey) || null
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
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.set(record.checkoutKey, record)
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to persist checkout identity to physical storage: ${message}`)
      }
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.set(record.checkoutKey, record)
    }
  }

  async createIfAbsent(record: CheckoutAttemptRecord<TPayload>): Promise<CheckoutAttemptRecord<TPayload>> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readwrite')
      tx.objectStore(CHECKOUT_ATTEMPTS_STORE).add(record)
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onabort = () => reject(tx.error)
        tx.onerror = () => reject(tx.error)
      })
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.set(record.checkoutKey, record)
      return record
    } catch (error) {
      if (isIndexedDbConstraintError(error)) {
        const winner = await this.get(record.checkoutKey)
        if (winner) return winner
        throw new Error('Atomic checkout identity creation conflicted without a durable winner.')
      }
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to atomically persist checkout identity to physical storage: ${message}`)
      }
      const existing = OfflineIntentQueue.sharedInMemoryCheckoutAttempts.get(record.checkoutKey)
      if (existing) return existing
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.set(record.checkoutKey, record)
      return record
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
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.delete(checkoutKey)
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to remove completed checkout identity: ${message}`)
      }
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.delete(checkoutKey)
    }
  }

  async compareAndDeletePosted(checkoutKey: string, expected: PostedDeleteExpectation): Promise<boolean> {
    const matches = (record?: CheckoutAttemptRecord<TPayload>): boolean => Boolean(record &&
      record.status === 'posted' && record.bookId === expected.bookId &&
      record.scopeFingerprint === expected.scopeFingerprint && record.idempotencyKey === expected.idempotencyKey &&
      canonicalCleanupEvidence(record) === expected.canonicalEvidence)
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readwrite')
      const store = tx.objectStore(CHECKOUT_ATTEMPTS_STORE)
      const request = store.get(checkoutKey)
      const deleted = await new Promise<boolean>((resolve, reject) => {
        let matched = false
        let settled = false
        const resolveOnce = (value: boolean) => { if (!settled) { settled = true; resolve(value) } }
        const rejectOnce = (error: unknown) => { if (!settled) { settled = true; reject(error) } }
        request.onsuccess = () => {
          try {
            matched = matches(request.result)
            if (matched) store.delete(checkoutKey)
          } catch (error) {
            try { tx.abort() } catch { /* transaction already aborting */ }
            rejectOnce(error)
          }
        }
        request.onerror = () => rejectOnce(request.error)
        tx.oncomplete = () => resolveOnce(matched)
        tx.onerror = () => rejectOnce(tx.error)
        tx.onabort = () => rejectOnce(tx.error || new Error('Atomic posted acknowledgement transaction aborted.'))
      })
      if (deleted) OfflineIntentQueue.sharedInMemoryCheckoutAttempts.delete(checkoutKey)
      return deleted
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed atomic posted acknowledgement cleanup: ${message}`)
      }
      const record = OfflineIntentQueue.sharedInMemoryCheckoutAttempts.get(checkoutKey) as CheckoutAttemptRecord<TPayload> | undefined
      if (!matches(record)) return false
      OfflineIntentQueue.sharedInMemoryCheckoutAttempts.delete(checkoutKey)
      return true
    }
  }

  async findPosted(bookId: string, scopeFingerprint: string): Promise<CheckoutAttemptRecord<TPayload>[]> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(CHECKOUT_ATTEMPTS_STORE, 'readonly')
      const request = tx.objectStore(CHECKOUT_ATTEMPTS_STORE).getAll()
      const attempts = await new Promise<CheckoutAttemptRecord<TPayload>[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
      return attempts.filter((attempt) => (
        attempt.bookId === bookId && attempt.scopeFingerprint === scopeFingerprint && attempt.status === 'posted'
      ))
    } catch (error) {
      if (typeof indexedDB !== 'undefined') {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to discover durable posted checkout acknowledgement: ${message}`)
      }
      return [...OfflineIntentQueue.sharedInMemoryCheckoutAttempts.values()].filter((attempt) => (
        attempt.bookId === bookId && attempt.scopeFingerprint === scopeFingerprint && attempt.status === 'posted'
      )) as CheckoutAttemptRecord<TPayload>[]
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
      OfflineIntentQueue.sharedInMemoryQueue.set(idempotencyKey, intent)
    } catch (err) {
      if (typeof indexedDB !== 'undefined') {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[OfflineIntentQueue] FAIL-CLOSED: Physical disk write failed:', msg)
        throw new Error(`Failed to persist financial intent to physical storage: ${msg}`)
      } else {
        // Non-browser / Node.js test environment fallback
        OfflineIntentQueue.sharedInMemoryQueue.set(idempotencyKey, intent)
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
      const memoryResults = Array.from(OfflineIntentQueue.sharedInMemoryQueue.values())
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
      return Promise.resolve(OfflineIntentQueue.sharedInMemoryQueue.get(idempotencyKey) || null)
    }
  }

  async markIntentSyncing(idempotencyKey: string): Promise<void> {
    const existing = await this.getIntent(idempotencyKey)
    if (existing) {
      existing.status = 'syncing'
      existing.retryCount += 1
      OfflineIntentQueue.sharedInMemoryQueue.set(idempotencyKey, existing)

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
      OfflineIntentQueue.sharedInMemoryQueue.set(idempotencyKey, existing)

      try {
        const db = await this.openDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.put(existing)
      } catch {}
    }
  }

  async removeIntent(idempotencyKey: string): Promise<void> {
    OfflineIntentQueue.sharedInMemoryQueue.delete(idempotencyKey)

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
    OfflineIntentQueue.sharedInMemoryQueue.clear()

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
