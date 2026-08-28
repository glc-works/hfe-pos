import { describe, expect, it, vi } from 'vitest'
import type { GovernedRetailCheckoutPayload, SubmitRetailTransactionResponse } from '../services/financial/HfePosFinancialPort'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
  type PostedDeleteExpectation,
} from '../services/financial/CafeCheckoutAttemptCoordinator'
import { canonicalCleanupEvidence, checkoutAttemptKind } from '../services/financial/CheckoutCleanupEvidence'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { buildGovernedCafeCheckoutPayload } from '../hooks/useCafeSettlement'

const scope = { organizationId: 'ORG-1', authorityContext: 'AUTH-1', cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1' }
const payload = buildGovernedCafeCheckoutPayload({
  tableId: undefined,
  contactId: '',
  policy: 'pay-first',
  paymentMethod: 'cash',
  cashierId: 'CASHIER-1',
  quoteContext: { outletId: 'OUTLET-1', terminalId: 'TERM-1', currency: 'IDR' },
  items: [{ id: 'COFFEE-1', quantity: 1 }],
})

class Store implements CheckoutAttemptStore<GovernedRetailCheckoutPayload> {
  record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload> | null = null
  async get(_checkoutKey?: string) { return this.record ? structuredClone(this.record) : null }
  async createIfAbsent(record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) {
    if (!this.record) this.record = structuredClone(record)
    return structuredClone(this.record)
  }
  async put(record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) { this.record = structuredClone(record) }
  async remove() { this.record = null }
  async findPosted(bookId: string, scopeFingerprint: string) {
    return this.record?.status === 'posted' && this.record.bookId === bookId && this.record.scopeFingerprint === scopeFingerprint
      ? [structuredClone(this.record)] : []
  }
  async compareAndDeletePosted(_key: string, expected: PostedDeleteExpectation) {
    const record = this.record
    if (!record || record.status !== 'posted' || record.bookId !== expected.bookId ||
      record.scopeFingerprint !== expected.scopeFingerprint || record.idempotencyKey !== expected.idempotencyKey ||
      canonicalCleanupEvidence(record) !== expected.canonicalEvidence) return false
    this.record = null
    return true
  }
}

function response(idempotencyKey: string): SubmitRetailTransactionResponse {
  return {
    tx_id: 'ORDER-1', status: 'posted', created_at: '2026-08-28T00:00:00Z', grand_total: '30800' as any,
    idempotency_key: idempotencyKey, posting_id: 'POSTING-1', ledger_journal_id: 'POSTING-1',
    readback_validation: { isValid: true, finality: 'applied', isApplied: true, isMismatch: false, journalLinesCount: 2 },
  }
}

async function postedAttempt(store = new Store()) {
  const coordinator = new CafeCheckoutAttemptCoordinator(store, () => 'attempt-cleanup-1')
  const result = await coordinator.execute({
    checkoutKey: 'BOOK-1:ORDER-1', bookId: 'BOOK-1', payload, scope,
    post: async (request) => {
      const attempt = (await store.get('BOOK-1:ORDER-1'))!
      attempt.acceptedOrder = { order_id: 'ORDER-1', quote: { currency: 'IDR' } } as any
      await store.put(attempt)
      return response(request.idempotency_key!)
    },
  })
  return { store, coordinator, result }
}

describe('governed posted acknowledgement cleanup', () => {
  it.each([
    ['posting_id', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { delete record.response!.posting_id }],
    ['ledger_journal_id', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { delete record.response!.ledger_journal_id }],
    ['readback_validation', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { delete record.response!.readback_validation }],
    ['accepted order tx identity', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { record.response!.tx_id = 'ORDER-OTHER' }],
    ['response status', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { record.response!.status = 'pending' }],
    ['idempotency identity', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { record.response!.idempotency_key = 'OTHER' }],
    ['posting identity', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { record.response!.posting_id = 'POSTING-OTHER' }],
    ['applied finality', (record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>) => { record.response!.readback_validation!.finality = 'pending' }],
  ])('retains governed record with missing or mismatched %s', async (_label, corrupt) => {
    const { store, coordinator } = await postedAttempt()
    corrupt(store.record!)
    await expect(coordinator.findPostedForAcknowledgement('BOOK-1', scope)).rejects.toThrow(/durable posted|fingerprint|posting identity/i)
    await expect(coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)).rejects.toThrow()
    expect(store.record).not.toBeNull()
  })

  it('rejects caller scope replacement and retains the valid governed record', async () => {
    const { store, coordinator } = await postedAttempt()
    await expect(coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', { ...scope, organizationId: 'ORG-OTHER' }))
      .rejects.toThrow(/scope binding mismatch/i)
    expect(store.record).not.toBeNull()
  })

  it('cannot downgrade governed evidence by removing outlet_id', async () => {
    const { store, coordinator } = await postedAttempt()
    delete (store.record!.payload as Partial<GovernedRetailCheckoutPayload>).outlet_id
    expect(store.record?.recordKind).toBe('governed')
    await expect(coordinator.findPostedForAcknowledgement('BOOK-1', scope)).rejects.toThrow(/fingerprint|governed/i)
    expect(store.record).not.toBeNull()
  })

  it('rejects malformed version/discriminator and canonical encoding collisions', () => {
    const base = { bookId: 'B', idempotencyKey: 'I', payload: {}, response: null, acceptedOrder: null }
    expect(() => checkoutAttemptKind({ ...base, schemaVersion: 1 })).toThrow(/missing.*record kind/i)
    expect(checkoutAttemptKind({ ...base, scopeFingerprint: 'scoped' })).toBe('governed')
    const encodedUndefined = canonicalCleanupEvidence({ ...base, payload: { value: undefined } })
    expect(encodedUndefined).not.toBe(canonicalCleanupEvidence({ ...base, payload: {} }))
    expect(encodedUndefined).not.toBe(canonicalCleanupEvidence({ ...base, payload: { value: '__undefined__' } }))
    expect(encodedUndefined).not.toBe(canonicalCleanupEvidence({ ...base, payload: { value: null } }))
    expect(canonicalCleanupEvidence({ ...base, payload: { b: 2, a: 1 } }))
      .toBe(canonicalCleanupEvidence({ ...base, payload: { a: 1, b: 2 } }))
    expect(() => canonicalCleanupEvidence({ ...base, payload: { value: Number.NaN } })).toThrow(/non-finite/i)
    expect(() => canonicalCleanupEvidence({ ...base, payload: { value: () => undefined } })).toThrow(/unsupported/i)
    expect(() => canonicalCleanupEvidence({ ...base, payload: { value: Symbol('x') } })).toThrow(/unsupported/i)
    expect(() => canonicalCleanupEvidence({ ...base, payload: { value: 1n } })).toThrow(/unsupported/i)
    expect(() => canonicalCleanupEvidence({ ...base, payload: Object.create({ inherited: true }) })).toThrow(/unsupported/i)
  })

  it('posts and atomically acknowledges the actual no-table governed payload', async () => {
    const { store, coordinator, result } = await postedAttempt()

    expect(result.kind).toBe('posted')
    expect(Object.prototype.hasOwnProperty.call(store.record!.payload, 'table_id')).toBe(true)
    expect(store.record!.payload.table_id).toBeUndefined()
    expect(store.record).toMatchObject({
      status: 'posted',
      response: response(store.record!.idempotencyKey),
      cleanupEvidenceFingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
    })

    await coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)
    expect(store.record).toBeNull()
  })

  it('aborts and rejects a malformed IndexedDB match without hanging or deleting', async () => {
    vi.stubGlobal('indexedDB', {})
    const queue = new OfflineIntentQueue<GovernedRetailCheckoutPayload>()
    const request: any = {}
    const deleteRecord = vi.fn()
    const tx: any = {
      objectStore: () => ({ get: () => request, delete: deleteRecord }),
      abort: () => queueMicrotask(() => tx.onabort?.()),
    }
    ;(queue as any).openDB = async () => ({ transaction: () => tx })
    const malformed = { status: 'posted', bookId: 'BOOK-1', idempotencyKey: 'I', schemaVersion: 1, payload: {} }
    const result = queue.compareAndDeletePosted('K', {
      bookId: 'BOOK-1', idempotencyKey: 'I', canonicalEvidence: 'expected',
    })
    queueMicrotask(() => { request.result = malformed; request.onsuccess?.() })
    await expect(Promise.race([
      result,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 250)),
    ])).rejects.toThrow(/record kind|atomic posted acknowledgement/i)
    expect(deleteRecord).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('fails closed on ambiguous or failed durable discovery', async () => {
    const { store, coordinator } = await postedAttempt()
    store.findPosted = async () => [structuredClone(store.record!), structuredClone(store.record!)]
    await expect(coordinator.findPostedForAcknowledgement('BOOK-1', scope)).rejects.toThrow(/multiple durable posted/i)
    store.findPosted = async () => { throw new Error('durable read failed') }
    await expect(coordinator.findPostedForAcknowledgement('BOOK-1', scope)).rejects.toThrow(/durable read failed/i)
  })

  it('atomically retains a replacement written by another tab before delete', async () => {
    const store = new Store()
    const { coordinator } = await postedAttempt(store)
    const atomicCompareAndDelete = store.compareAndDeletePosted.bind(store)
    store.compareAndDeletePosted = async (key, expected) => {
      store.record = structuredClone(store.record!)
      store.record.response!.tx_id = 'ORDER-REPLACEMENT'
      return atomicCompareAndDelete(key, expected)
    }
    await expect(coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)).rejects.toThrow(/changed before atomic cleanup/i)
    expect(store.record?.response?.tx_id).toBe('ORDER-REPLACEMENT')
  })

  it('atomically deletes one valid fully-bound governed record without financial network', async () => {
    const { store, coordinator } = await postedAttempt()
    await coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)
    expect(store.record).toBeNull()
  })
})
