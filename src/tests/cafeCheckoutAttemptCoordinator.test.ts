import { describe, expect, it, vi } from 'vitest'
import type { SubmitRetailTransactionPayload, SubmitRetailTransactionResponse } from '../services/financial/HfePosFinancialPort'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
} from '../services/financial/CafeCheckoutAttemptCoordinator'

const payload: SubmitRetailTransactionPayload = {
  contact_id: '',
  policy: 'pay-first',
  payment_method: 'cash',
  items: [{ product_id: 'COFFEE-1', hfe_gl_account: '', qty: 1, price: 25000 }],
  subtotal: 25000,
  tax_pb1_amount: 0,
  service_fee_amount: 0,
  discount_amount: 0,
  grand_total: 25000,
  cashier_id: 'CASHIER-1',
}

class MemoryAttemptStore implements CheckoutAttemptStore {
  readonly records = new Map<string, CheckoutAttemptRecord>()

  async get(checkoutKey: string) {
    return this.records.get(checkoutKey) ?? null
  }

  async put(record: CheckoutAttemptRecord) {
    this.records.set(record.checkoutKey, structuredClone(record))
  }

  async remove(checkoutKey: string) {
    this.records.delete(checkoutKey)
  }
}

function posted(idempotencyKey: string): SubmitRetailTransactionResponse {
  return {
    tx_id: 'ORDER-1',
    status: 'posted',
    created_at: '2026-08-24T00:00:00Z',
    grand_total: 25000,
    idempotency_key: idempotencyKey,
    ledger_journal_id: 'POSTING-1',
  }
}

describe('cafe checkout attempt coordination', () => {
  it('persists one stable idempotency identity through durable success until the UI acknowledges it', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '11111111-1111-4111-8111-111111111111')
    const post = vi.fn(async (request: SubmitRetailTransactionPayload) => posted(request.idempotency_key!))

    const result = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post,
    })

    expect(result.kind).toBe('posted')
    expect(post.mock.calls[0][0].idempotency_key).toBe('11111111-1111-4111-8111-111111111111')
    expect(await store.get('BOOK-1:ORDER-1')).toMatchObject({
      status: 'posted',
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
      response: { ledger_journal_id: 'POSTING-1' },
    })

    await coordinator.acknowledgePosted('BOOK-1:ORDER-1')
    expect(await store.get('BOOK-1:ORDER-1')).toBeNull()
  })

  it('blocks a concurrent double click before a second CORE mutation starts', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '22222222-2222-4222-8222-222222222222')
    let release!: (value: SubmitRetailTransactionResponse) => void
    const post = vi.fn((request: SubmitRetailTransactionPayload) => new Promise<SubmitRetailTransactionResponse>((resolve) => {
      release = resolve
      expect(request.idempotency_key).toBe('22222222-2222-4222-8222-222222222222')
    }))

    const first = coordinator.execute({ checkoutKey: 'BOOK-1:ORDER-1', bookId: 'BOOK-1', payload, post })
    await vi.waitFor(() => expect(post).toHaveBeenCalledOnce())
    const second = await coordinator.execute({ checkoutKey: 'BOOK-1:ORDER-1', bookId: 'BOOK-1', payload, post })

    expect(second.kind).toBe('already_in_progress')
    expect(post).toHaveBeenCalledOnce()
    release(posted('22222222-2222-4222-8222-222222222222'))
    await first
  })

  it('does not retry an unknown outcome after a reload and keeps the stable payload fingerprint', async () => {
    const store = new MemoryAttemptStore()
    const firstCoordinator = new CafeCheckoutAttemptCoordinator(store, () => '33333333-3333-4333-8333-333333333333')
    const failedPost = vi.fn().mockRejectedValue(new Error('connection dropped after request write'))

    const first = await firstCoordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: failedPost,
    })
    const durableAttempt = await store.get('BOOK-1:ORDER-1')

    const reloadedCoordinator = new CafeCheckoutAttemptCoordinator(store, () => '44444444-4444-4444-8444-444444444444')
    const retryPost = vi.fn()
    const restored = await reloadedCoordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: retryPost,
    })

    expect(first.kind).toBe('outcome_unknown')
    expect(durableAttempt).toMatchObject({
      idempotencyKey: '33333333-3333-4333-8333-333333333333',
      status: 'outcome_unknown',
    })
    expect(durableAttempt?.payloadFingerprint).toMatch(/^[a-f0-9]{64}$/)
    expect(restored.kind).toBe('operator_action_required')
    expect(retryPost).not.toHaveBeenCalled()
  })

  it('reconciles an unknown outcome without invoking the posting mutation again', async () => {
    const store = new MemoryAttemptStore()
    const firstCoordinator = new CafeCheckoutAttemptCoordinator(store, () => '66666666-6666-4666-8666-666666666666')
    await firstCoordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: vi.fn().mockRejectedValue(new Error('connection dropped after request write')),
    })

    const observedAttemptTimes: string[] = []
    const retryPost = vi.fn()
    const reconcile = vi.fn(async (request: SubmitRetailTransactionPayload, attempt: CheckoutAttemptRecord) => {
      observedAttemptTimes.push(attempt.createdAt)
      return posted(request.idempotency_key!)
    })
    const resumed = await new CafeCheckoutAttemptCoordinator(store).execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: retryPost,
      reconcile,
      resumeExisting: true,
    })

    expect(resumed.kind).toBe('posted')
    expect(retryPost).not.toHaveBeenCalled()
    expect(reconcile).toHaveBeenCalledOnce()
    expect(reconcile.mock.calls[0][0].idempotency_key).toBe('66666666-6666-4666-8666-666666666666')
    expect(observedAttemptTimes).toEqual([(await store.get('BOOK-1:ORDER-1'))?.createdAt])
  })

  it('recovers a locally posted attempt after a crash without any CORE call', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '77777777-7777-4777-8777-777777777777')
    await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: async (request) => posted(request.idempotency_key!),
    })
    const post = vi.fn()
    const reconcile = vi.fn()

    const recovered = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post,
      reconcile,
      resumeExisting: true,
    })

    expect(recovered).toMatchObject({ kind: 'posted', response: { ledger_journal_id: 'POSTING-1' } })
    expect(post).not.toHaveBeenCalled()
    expect(reconcile).not.toHaveBeenCalled()
  })

  it('keeps an asynchronous CORE result pending and never fabricates Posted', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '55555555-5555-4555-8555-555555555555')

    const result = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1',
      bookId: 'BOOK-1',
      payload,
      post: async () => ({ ...posted('55555555-5555-4555-8555-555555555555'), status: 'pending', ledger_journal_id: undefined }),
    })

    expect(result.kind).toBe('pending')
    expect(await store.get('BOOK-1:ORDER-1')).toMatchObject({ status: 'pending' })
  })
})
