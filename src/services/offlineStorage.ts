import { SubmitTransactionPayload } from './hfeApi'
import { generatePayloadChecksum } from '../utils/cryptoHasher'

export interface OfflineTransactionEntry {
  idempotencyKey: string
  payload: SubmitTransactionPayload
  checksum: string
  createdAt: string
  retryCount: number
}

export interface MasterDataEntry<T = any> {
  cacheKey: string
  data: T
  cachedAt: string
}

const DB_NAME = 'hfe_pos_offline_db'
const DB_VERSION = 1
const STORE_TRANSACTIONS = 'unSyncedTransactions'
const STORE_MASTER_DATA = 'masterDataCache'

/**
 * Request persistent browser storage to prevent OS eviction during offline cashier shifts.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist()
      return isPersisted
    } catch (err) {
      console.warn('[OfflineStorage] navigator.storage.persist() call failed:', err)
      return false
    }
  }
  return false
}

/**
 * Register beforeunload crash guard to prevent tab closure when un-synced offline transactions exist.
 */
export function registerOfflineBeforeUnloadGuard(getPendingCountFn: () => number): () => void {
  if (typeof window === 'undefined') return () => {}

  const handler = (e: BeforeUnloadEvent) => {
    const pending = getPendingCountFn()
    if (pending > 0) {
      e.preventDefault()
      e.returnValue = `Terdapat ${pending} transaksi kasir offline yang belum tersinkronisasi. Yakin ingin menutup halaman?`
      return e.returnValue
    }
  }

  window.addEventListener('beforeunload', handler)
  return () => {
    window.removeEventListener('beforeunload', handler)
  }
}

/**
 * Open or upgrade browser native IndexedDB for offline transactions & master data.
 */
export function openOfflineStorageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in current runtime environment'))
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
        db.createObjectStore(STORE_TRANSACTIONS, { keyPath: 'idempotencyKey' })
      }
      if (!db.objectStoreNames.contains(STORE_MASTER_DATA)) {
        db.createObjectStore(STORE_MASTER_DATA, { keyPath: 'cacheKey' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Save un-synced offline transaction into IndexedDB buffer with SHA-256 integrity checksum.
 * STRICT FAIL-CLOSED: Throws an error if disk persistence fails to prevent phantom confirmations.
 */
export async function saveOfflineTransaction(
  payload: SubmitTransactionPayload
): Promise<OfflineTransactionEntry> {
  const idempotencyKey = payload.idempotency_key || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `OFFLINE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  const payloadWithKey = { ...payload, idempotency_key: idempotencyKey }
  const checksum = await generatePayloadChecksum(payloadWithKey)

  const entry: OfflineTransactionEntry = {
    idempotencyKey,
    payload: payloadWithKey,
    checksum,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  }

  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_TRANSACTIONS, 'readwrite')
    const store = tx.objectStore(STORE_TRANSACTIONS)
    store.put(entry)

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    if (typeof indexedDB !== 'undefined') {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[OfflineStorage] FAIL-CLOSED: IndexedDB physical write failed:', message)
      throw new Error(`Failed to persist offline transaction to disk storage: ${message}`)
    }
  }

  return entry
}

/**
 * Retrieve all pending un-synced transactions sorted by creation date.
 */
export async function getPendingTransactions(): Promise<OfflineTransactionEntry[]> {
  if (typeof indexedDB === 'undefined') {
    return []
  }
  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_TRANSACTIONS, 'readonly')
    const store = tx.objectStore(STORE_TRANSACTIONS)
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results: OfflineTransactionEntry[] = request.result || []
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('[OfflineStorage] Failed to retrieve pending transactions:', err)
    return []
  }
}

/**
 * Remove successfully flushed transaction from IndexedDB.
 */
export async function removeSyncedTransaction(idempotencyKey: string): Promise<void> {
  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_TRANSACTIONS, 'readwrite')
    const store = tx.objectStore(STORE_TRANSACTIONS)
    store.delete(idempotencyKey)

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('[OfflineStorage] Failed to delete synced transaction:', err)
  }
}

/**
 * Cache master data (product catalog, branches, table layout).
 */
export async function cacheMasterData<T = any>(cacheKey: string, data: T): Promise<void> {
  const entry: MasterDataEntry<T> = {
    cacheKey,
    data,
    cachedAt: new Date().toISOString(),
  }

  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_MASTER_DATA, 'readwrite')
    const store = tx.objectStore(STORE_MASTER_DATA)
    store.put(entry)

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('[OfflineStorage] Failed to cache master data:', err)
  }
}

/**
 * Retrieve cached master data.
 */
export async function getMasterData<T = any>(cacheKey: string): Promise<T | null> {
  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_MASTER_DATA, 'readonly')
    const store = tx.objectStore(STORE_MASTER_DATA)
    const request = store.get(cacheKey)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result: MasterDataEntry<T> | undefined = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('[OfflineStorage] Failed to fetch cached master data:', err)
    return null
  }
}

/**
 * Get count of pending offline transactions.
 */
export async function getPendingCount(): Promise<number> {
  const items = await getPendingTransactions()
  return items.length
}

/**
 * Clear all pending transactions in buffer.
 */
export async function clearOfflineBuffer(): Promise<void> {
  try {
    const db = await openOfflineStorageDB()
    const tx = db.transaction(STORE_TRANSACTIONS, 'readwrite')
    const store = tx.objectStore(STORE_TRANSACTIONS)
    store.clear()

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('[OfflineStorage] Failed to clear offline buffer:', err)
  }
}
