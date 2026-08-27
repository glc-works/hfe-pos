// --- DEAD-LETTER & CONFLICT LEDGER (Rule 19 / Issue #61 Phase 2) ---
// Durable ledger for financially ambiguous outcomes that require human or
// manager resolution. Independent IndexedDB database so schema evolution of the
// intent queue never migrates forensic data. Browser-only persistence with an
// explicit in-memory fallback for Node/test environments.
import { generateUUIDv4 } from './HfePostingReadbackValidator'

export type DeadLetterKind =
  | 'outcome_unknown'
  | 'operator_action_required'
  | 'quota_failure'
  | 'duplicate_suspect'

export interface DeadLetterEntry {
  id: string
  kind: DeadLetterKind
  detail: string
  bookId?: string
  checkoutKey?: string
  postingId?: string
  idempotencyKey?: string
  occurredAt: string
}

const DB_NAME = 'hfe_pos_deadletter_db'
const DB_VERSION = 1
const STORE_NAME = 'conflicts'
const memoryLedger = new Map<string, DeadLetterEntry>()

function openDeadLetterDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB unavailable'))
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Fire-and-forget safe by contract: callers must never let ledger failures break checkout UX. */
export async function appendDeadLetterEntry(
  input: Omit<DeadLetterEntry, 'id' | 'occurredAt'> & { id?: string; occurredAt?: string }
): Promise<DeadLetterEntry> {
  const entry: DeadLetterEntry = {
    ...input,
    id: input.id ?? generateUUIDv4(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  }
  try {
    const db = await openDeadLetterDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // In-memory shadow keeps forensics available even when disk refuses.
    memoryLedger.set(entry.id, entry)
  }
  return entry
}

export async function listDeadLetterEntries(): Promise<DeadLetterEntry[]> {
  try {
    const db = await openDeadLetterDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    return await new Promise<DeadLetterEntry[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result ?? [])
      request.onerror = () => reject(request.error)
    })
  } catch {
    return Array.from(memoryLedger.values()).sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
  }
}

export async function removeDeadLetterEntry(id: string): Promise<void> {
  memoryLedger.delete(id)
  try {
    const db = await openDeadLetterDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {}
}

/** Pure CSV builder — RFC-4180 quoting plus spreadsheet-formula neutralisation. */
export function buildDeadLetterCsv(entries: DeadLetterEntry[]): string {
  const header = ['id', 'kind', 'occurredAt', 'bookId', 'checkoutKey', 'postingId', 'idempotencyKey', 'detail']
  const cell = (value: unknown): string => {
    let str = value === null || value === undefined ? '' : String(value)
    if (/^[=+\-@]/.test(str)) str = `'${str}`
    return `"${str.replace(/"/g, '""')}"`
  }
  const rows = entries.map((e) =>
    [e.id, e.kind, e.occurredAt, e.bookId, e.checkoutKey, e.postingId, e.idempotencyKey, e.detail].map(cell).join(',')
  )
  return [header.join(','), ...rows].join('\n')
}

export async function downloadDeadLetterLog(format: 'json' | 'csv'): Promise<void> {
  const entries = await listDeadLetterEntries()
  const blob = format === 'json'
    ? new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    : new Blob([buildDeadLetterCsv(entries)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `hfe-pos-dead-letter-${new Date().toISOString().slice(0, 19)}.${format}`
  anchor.click()
  URL.revokeObjectURL(url)
}
