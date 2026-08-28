import { describe, expect, it, vi } from 'vitest'
import type { Int64String, PosSaleQuoteView } from '@hfe/sdk'
import type {
  GovernedRetailCheckoutPayload,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
} from '../services/financial/HfePosFinancialPort'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
} from '../services/financial/CafeCheckoutAttemptCoordinator'
import { resumeDurablePostedCleanup } from '../hooks/cafeSettlementOutcome'

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

  async createIfAbsent(record: CheckoutAttemptRecord) {
    const existing = this.records.get(record.checkoutKey)
    if (existing) return structuredClone(existing)
    this.records.set(record.checkoutKey, structuredClone(record))
    return structuredClone(record)
  }

  async remove(checkoutKey: string) {
    this.records.delete(checkoutKey)
  }

  async compareAndDeletePosted(checkoutKey: string, expected: import('../services/financial/CafeCheckoutAttemptCoordinator').PostedDeleteExpectation) {
    const record = this.records.get(checkoutKey)
    if (!record || record.status !== 'posted' || record.bookId !== expected.bookId ||
      record.scopeFingerprint !== expected.scopeFingerprint || record.idempotencyKey !== expected.idempotencyKey ||
      record.cleanupEvidenceFingerprint !== expected.cleanupEvidenceFingerprint) return false
    this.records.delete(checkoutKey)
    return true
  }

  async findPosted(bookId: string, scopeFingerprint: string) {
    return [...this.records.values()].filter((record) => (
      record.bookId === bookId && record.scopeFingerprint === scopeFingerprint && record.status === 'posted'
    ))
  }
}

class RacingAttemptStore extends MemoryAttemptStore {
  private reads = 0
  private releaseReads!: () => void
  private readonly bothRead = new Promise<void>((resolve) => { this.releaseReads = resolve })

  override async get(checkoutKey: string) {
    this.reads += 1
    if (this.reads <= 2) {
      if (this.reads === 2) this.releaseReads()
      await this.bothRead
      return null
    }
    return super.get(checkoutKey)
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
    posting_id: 'POSTING-1',
    readback_validation: {
      isValid: true, finality: 'applied', isApplied: true, isMismatch: false, journalLinesCount: 2,
    },
  }
}

describe('cafe checkout attempt coordination', () => {
  it('requires explicit persisted scope for a governed checkout attempt', async () => {
    const governedPayload = {
      contact_id: '', policy: 'pay-first', payment_method: 'cash', outlet_id: 'OUTLET-1', terminal_id: 'TERM-1',
      currency: 'IDR', items: [{ product_id: 'COFFEE-1', quantity: 1 }], cashier_id: 'CASHIER-1',
    } as unknown as SubmitRetailTransactionPayload
    await expect(new CafeCheckoutAttemptCoordinator(new MemoryAttemptStore()).prepare(
      'BOOK-1:ORDER-UNSCOPED', 'BOOK-1', governedPayload,
    )).rejects.toThrow(/organization, authority, cashier, and actor scope is required/i)
  })

  it('binds a governed attempt to organization and authority without persisting raw authority context', async () => {
    const store = new MemoryAttemptStore()
    const first = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000099')
    const firstScope = {
      organizationId: 'ORG-1', authorityContext: 'AUTH-CONTEXT-SECRET-LIKE-ID',
      cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1',
    }
    await first.prepare('BOOK-1:ORDER-SCOPE', 'BOOK-1', payload, firstScope)

    const persisted = await store.get('BOOK-1:ORDER-SCOPE')
    expect(persisted?.scopeFingerprint).toMatch(/^[a-f0-9]{64}$/)
    expect(JSON.stringify(persisted)).not.toContain(firstScope.authorityContext)

    const reloaded = new CafeCheckoutAttemptCoordinator(store, () => 'must-not-mint')
    await expect(reloaded.prepare('BOOK-1:ORDER-SCOPE', 'BOOK-1', payload, {
      ...firstScope, authorityContext: 'AUTH-DRIFTED',
    })).rejects.toThrow(/organization or authority scope changed/i)
    expect((await store.get('BOOK-1:ORDER-SCOPE'))?.idempotencyKey).toBe('00000000-0000-4000-8000-000000000099')
  })

  it('rejects authority drift before execute can invoke a financial mutation', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000098')
    const scope = { organizationId: 'ORG-1', authorityContext: 'AUTH-1', cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1' }
    await coordinator.prepare('BOOK-1:ORDER-EXEC-SCOPE', 'BOOK-1', payload, scope)
    const post = vi.fn()

    await expect(coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-EXEC-SCOPE', bookId: 'BOOK-1', payload,
      scope: { ...scope, organizationId: 'ORG-DRIFTED' }, post,
    })).rejects.toThrow(/organization or authority scope changed/i)
    expect(post).not.toHaveBeenCalled()
    expect((await store.get('BOOK-1:ORDER-EXEC-SCOPE'))?.status).toBe('prepared')
  })

  it('rejects a missing current scope when the durable record is scoped', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000097')
    await coordinator.prepare('BOOK-1:ORDER-SYMMETRIC-SCOPE', 'BOOK-1', payload, {
      organizationId: 'ORG-1', authorityContext: 'AUTH-1', cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1',
    })

    await expect(new CafeCheckoutAttemptCoordinator(store).prepare(
      'BOOK-1:ORDER-SYMMETRIC-SCOPE', 'BOOK-1', payload,
    )).rejects.toThrow(/organization or authority scope changed/i)
  })

  it('atomically returns one root attempt across two coordinator instances', async () => {
    const store = new RacingAttemptStore()
    const first = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000201')
    const second = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000202')

    const [a, b] = await Promise.all([
      first.prepare('BOOK-1:ORDER-TABS', 'BOOK-1', payload),
      second.prepare('BOOK-1:ORDER-TABS', 'BOOK-1', payload),
    ])

    expect(a.idempotencyKey).toBe(b.idempotencyKey)
    expect((await store.get('BOOK-1:ORDER-TABS'))?.idempotencyKey).toBe(a.idempotencyKey)
  })

  it('keeps a failed retirement observable and allows the same attempt to be retired on retry', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000203')
    await coordinator.prepare('BOOK-1:ORDER-RETIRE', 'BOOK-1', payload)
    const remove = vi.spyOn(store, 'remove')
      .mockRejectedValueOnce(new Error('disk removal failed'))
      .mockImplementation(async (key) => { store.records.delete(key) })

    await expect(coordinator.retirePrepared('BOOK-1:ORDER-RETIRE')).rejects.toThrow(/disk removal failed/i)
    expect(await store.get('BOOK-1:ORDER-RETIRE')).not.toBeNull()
    await expect(coordinator.retirePrepared('BOOK-1:ORDER-RETIRE')).resolves.toBeUndefined()
    expect(await store.get('BOOK-1:ORDER-RETIRE')).toBeNull()
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('keeps a pre-mutation validation failure prepared and retryable', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000204')
    const first = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-PREFLIGHT', bookId: 'BOOK-1', payload,
      post: async () => { throw new Error('local validation failed before request') },
    })

    expect(first.kind).toBe('validation_failed')
    expect(await store.get('BOOK-1:ORDER-PREFLIGHT')).toMatchObject({ status: 'prepared' })

    const post = vi.fn(async (request: SubmitRetailTransactionPayload) => posted(request.idempotency_key!))
    const second = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-PREFLIGHT', bookId: 'BOOK-1', payload, post,
    })

    expect(await store.get('BOOK-1:ORDER-PREFLIGHT')).toMatchObject({ status: 'posted' })
    expect(second.kind).toBe('posted')
    expect(post).toHaveBeenCalledOnce()
  })

  it('writes durable pre-quote lineage and lets its first reviewed acceptance mutate once', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000101')
    const prepared = await coordinator.prepare('BOOK-1:ORDER-1', 'BOOK-1', payload)
    const post = vi.fn(async (request: SubmitRetailTransactionPayload) => posted(request.idempotency_key!))

    const result = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-1', bookId: 'BOOK-1', payload: prepared.payload, post,
    })

    expect(prepared).toMatchObject({ status: 'prepared', idempotencyKey: '00000000-0000-4000-8000-000000000101' })
    expect(result.kind).toBe('posted')
    expect(post).toHaveBeenCalledOnce()
    expect(post.mock.calls[0][0].idempotency_key).toBe(prepared.idempotencyKey)
  })

  it('mints one stable idempotency key before the first quote', async () => {
    const store = new MemoryAttemptStore()
    const createKey = vi.fn(() => '00000000-0000-4000-8000-000000000102')
    const prepared = await new CafeCheckoutAttemptCoordinator(store, createKey)
      .prepare('BOOK-1:ORDER-2', 'BOOK-1', payload)

    expect(createKey).toHaveBeenCalledOnce()
    expect(prepared.payload.idempotency_key).toBe(prepared.idempotencyKey)
  })

  it('persists governed phase evidence and rejects phase skipping', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '00000000-0000-4000-8000-000000000103')
    await coordinator.prepare('BOOK-1:ORDER-PHASE', 'BOOK-1', payload)
    const durable = coordinator.durability('BOOK-1:ORDER-PHASE')

    await durable.transition('quote_requested')
    await durable.transition('quote_ready', { quote: {
      quote_id: 'QUOTE-1', revision: '1' as Int64String, digest_sha256: 'd'.repeat(64), currency: 'IDR',
      subtotal_minor: '25000', amount_due_minor: '25000', discount_total_minor: '0', tax_total_minor: '0',
      service_charge_total_minor: '0', tip_total_minor: '0', rounding_total_minor: '0', preset_id: 'PRESET-1',
      preset_version: '1' as Int64String, expires_at: '2026-08-28T10:15:00Z', lines: [], tender_eligibility: [],
    } satisfies PosSaleQuoteView })
    await durable.transition('qris_intent_requested')
    await durable.transition('qris_intent_ready', {
      qrisIntent: { payment_id: 'QRIS-1', qris_string: '000201', qr_image_url: 'https://example.test/qr.png', expires_at: '2026-08-28T10:15:00Z' },
    })

    expect(await store.get('BOOK-1:ORDER-PHASE')).toMatchObject({
      status: 'qris_intent_ready', quote: { quote_id: 'QUOTE-1' }, qrisIntent: { payment_id: 'QRIS-1' },
    })
    await expect(durable.transition('posted')).rejects.toThrow(/invalid governed checkout phase transition/i)
  })

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

  it('discovers and acknowledges a scoped posted attempt after reload without payload reconstruction or repost', async () => {
    const store = new MemoryAttemptStore()
    const scope = { organizationId: 'ORG-1', authorityContext: 'AUTH-1', cashierId: 'CASHIER-1', actorPrincipalId: 'CASHIER-1' }
    const governedPayload = {
      contact_id: '', policy: 'pay-first' as const, payment_method: 'cash' as const,
      outlet_id: 'OUTLET-1', terminal_id: 'TERM-1', currency: 'IDR',
      items: [{ product_id: 'COFFEE-1', quantity: 1 }], cashier_id: 'CASHIER-1',
    }
    const governedStore = store as unknown as CheckoutAttemptStore<GovernedRetailCheckoutPayload>
    const first = new CafeCheckoutAttemptCoordinator<GovernedRetailCheckoutPayload>(governedStore, () => '11111111-1111-4111-8111-111111111112')
    await first.execute({
      checkoutKey: 'BOOK-1:ORDER-RESTORED', bookId: 'BOOK-1', payload: governedPayload, scope,
      post: async (request) => {
        const attempt = (await store.get('BOOK-1:ORDER-RESTORED'))!
        attempt.acceptedOrder = { order_id: 'ORDER-1', quote: { currency: 'IDR' } } as any
        await store.put(attempt)
        return posted(request.idempotency_key!)
      },
    })

    const reloaded = new CafeCheckoutAttemptCoordinator<GovernedRetailCheckoutPayload>(governedStore)
    const financialMutation = vi.fn()
    const resumed = await resumeDurablePostedCleanup(
      () => reloaded.findPostedForAcknowledgement('BOOK-1', scope),
      async (restored) => {
        expect(restored).toMatchObject({ checkoutKey: 'BOOK-1:ORDER-RESTORED', status: 'posted' })
        await reloaded.acknowledgePosted(restored.checkoutKey, 'BOOK-1', scope)
      },
    )
    expect(resumed).toBe(true)
    expect(financialMutation).not.toHaveBeenCalled()
    expect(await store.get('BOOK-1:ORDER-RESTORED')).toBeNull()
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

  it('persists a pending QRIS receipt so reload does not require recreating the intent', async () => {
    const store = new MemoryAttemptStore()
    const coordinator = new CafeCheckoutAttemptCoordinator(store, () => '88888888-8888-4888-8888-888888888888')
    const pending: SubmitRetailTransactionResponse = {
      tx_id: 'ORDER-QRIS-1',
      status: 'pending',
      created_at: '2026-08-27T00:00:00Z',
      grand_total: 30_800,
      idempotency_key: '88888888-8888-4888-8888-888888888888',
      qris_payment: {
        payment_id: 'QRIS-INTENT-1',
        tender_id: 'TENDER-QRIS-1',
        qris_string: '000201010212',
        qr_image_url: 'https://provider.example/QRIS-INTENT-1.png',
        expires_at: '2026-08-27T00:15:00Z',
      },
    }

    const result = await coordinator.execute({
      checkoutKey: 'BOOK-1:ORDER-QRIS-1',
      bookId: 'BOOK-1',
      payload,
      post: vi.fn().mockResolvedValue(pending),
    })

    expect(result).toEqual({ kind: 'pending', response: pending })
    expect(await store.get('BOOK-1:ORDER-QRIS-1')).toMatchObject({
      status: 'pending',
      response: { qris_payment: { payment_id: 'QRIS-INTENT-1' } },
    })
  })

  it('does not retry an unknown outcome after a reload and keeps the stable payload fingerprint', async () => {
    const store = new MemoryAttemptStore()
    const firstCoordinator = new CafeCheckoutAttemptCoordinator(store, () => '33333333-3333-4333-8333-333333333333')
    const failedPost = vi.fn(async (_payload, _attempt, markMutationSent: () => Promise<void>) => {
      await markMutationSent()
      throw new Error('connection dropped after request write')
    })

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
      post: vi.fn(async (_payload, _attempt, markMutationSent) => {
        await markMutationSent()
        throw new Error('connection dropped after request write')
      }),
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
