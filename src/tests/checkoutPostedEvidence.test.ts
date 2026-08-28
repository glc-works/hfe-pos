import { describe, expect, it, vi } from 'vitest'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
  type PostedDeleteExpectation,
} from '../services/financial/CafeCheckoutAttemptCoordinator'
import type { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'
import { canonicalCleanupEvidence } from '../services/financial/CheckoutCleanupEvidence'

const payload: SubmitRetailTransactionPayload = {
  contact_id: '', policy: 'pay-first', payment_method: 'cash',
  items: [{ product_id: 'COFFEE-1', hfe_gl_account: '', qty: 1, price: 25000 }],
  subtotal: 25000, tax_pb1_amount: 0, service_fee_amount: 0, discount_amount: 0,
  grand_total: 25000, cashier_id: 'CASHIER-1',
}

class Store implements CheckoutAttemptStore {
  record: CheckoutAttemptRecord | null = null
  async get(_checkoutKey?: string) { return this.record ? structuredClone(this.record) : null }
  async createIfAbsent(record: CheckoutAttemptRecord) {
    if (!this.record) this.record = structuredClone(record)
    return structuredClone(this.record)
  }
  async put(record: CheckoutAttemptRecord) { this.record = structuredClone(record) }
  async remove() { this.record = null }
  async findPosted(bookId: string, scopeFingerprint: string) {
    return this.record?.status === 'posted' && this.record.bookId === bookId && this.record.scopeFingerprint === scopeFingerprint
      ? [structuredClone(this.record)] : []
  }
  async compareAndDeletePosted(_checkoutKey: string, expected: PostedDeleteExpectation) {
    if (!this.record || this.record.status !== 'posted' || this.record.bookId !== expected.bookId ||
      this.record.scopeFingerprint !== expected.scopeFingerprint || this.record.idempotencyKey !== expected.idempotencyKey ||
      canonicalCleanupEvidence(this.record) !== expected.canonicalEvidence) return false
    this.record = null
    return true
  }
}

describe('checkout posted evidence boundary', () => {
  it('fails closed without reposting when a posted record has no response evidence', async () => {
    const store = new Store()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000205')
    const attempt = await coordinator.prepare('BOOK-1:ORDER-MISSING-RESPONSE', 'BOOK-1', payload)
    attempt.status = 'posted'
    await store.put(attempt)
    const post = vi.fn()
    const reconcile = vi.fn()

    const result = await coordinator.execute({
      checkoutKey: attempt.checkoutKey, bookId: attempt.bookId, payload: attempt.payload,
      post, reconcile, resumeExisting: true,
    })

    expect(result).toEqual({ kind: 'operator_action_required', attempt: expect.objectContaining({
      checkoutKey: attempt.checkoutKey, status: 'posted',
    }) })
    expect(post).not.toHaveBeenCalled()
    expect(reconcile).not.toHaveBeenCalled()
    expect(await store.get(attempt.checkoutKey)).toMatchObject({ status: 'posted' })
  })

  it('reserves the terminal posted phase for coordinator-validated response evidence', async () => {
    const store = new Store()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000206')
    await coordinator.prepare('BOOK-1:ORDER-TERMINAL-PHASE', 'BOOK-1', payload)
    const durable = coordinator.durability('BOOK-1:ORDER-TERMINAL-PHASE')
    await durable.transition('quote_requested')
    await durable.transition('quote_ready')
    await durable.transition('accept_requested')
    await durable.transition('accepted')

    await expect(durable.transition('posted')).rejects.toThrow(/invalid governed checkout phase transition/i)
    expect(await store.get()).toMatchObject({ status: 'accepted' })
  })
})
