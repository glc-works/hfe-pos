import { describe, expect, it } from 'vitest'
import type { GovernedRetailCheckoutPayload, SubmitRetailTransactionResponse } from '../services/financial/HfePosFinancialPort'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
  type PostedDeleteExpectation,
} from '../services/financial/CafeCheckoutAttemptCoordinator'

const scope = { organizationId: 'ORG-1', authorityContext: 'AUTH-1', cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1' }
const payload: GovernedRetailCheckoutPayload = {
  contact_id: '', policy: 'pay-first', payment_method: 'cash', outlet_id: 'OUTLET-1', terminal_id: 'TERM-1',
  currency: 'IDR', items: [{ product_id: 'COFFEE-1', quantity: 1 }], cashier_id: 'CASHIER-1',
}

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
      record.cleanupEvidenceFingerprint !== expected.cleanupEvidenceFingerprint) return false
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
  await coordinator.execute({
    checkoutKey: 'BOOK-1:ORDER-1', bookId: 'BOOK-1', payload, scope,
    post: async (request) => {
      const attempt = (await store.get('BOOK-1:ORDER-1'))!
      attempt.acceptedOrder = { order_id: 'ORDER-1', quote: { currency: 'IDR' } } as any
      await store.put(attempt)
      return response(request.idempotency_key!)
    },
  })
  return { store, coordinator }
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
    store.compareAndDeletePosted = async () => {
      store.record = { ...store.record!, idempotencyKey: 'replacement-attempt', cleanupEvidenceFingerprint: 'replacement' }
      return false
    }
    await expect(coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)).rejects.toThrow(/changed before atomic cleanup/i)
    expect(store.record?.idempotencyKey).toBe('replacement-attempt')
  })

  it('atomically deletes one valid fully-bound governed record without financial network', async () => {
    const { store, coordinator } = await postedAttempt()
    await coordinator.acknowledgePosted('BOOK-1:ORDER-1', 'BOOK-1', scope)
    expect(store.record).toBeNull()
  })
})
