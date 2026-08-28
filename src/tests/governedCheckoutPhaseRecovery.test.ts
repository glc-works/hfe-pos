import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Int64String, PosSaleQuoteView } from '@hfe/sdk'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import {
  CafeCheckoutAttemptCoordinator,
  type CheckoutAttemptRecord,
  type CheckoutAttemptStore,
} from '../services/financial/CafeCheckoutAttemptCoordinator'
import { governedIntentFingerprint } from '../services/financial/GovernedPosCheckout'
import type { GovernedCheckoutDurability, GovernedCheckoutEvidence } from '../services/financial/GovernedCheckoutDurability'
import type { GovernedRetailCheckoutPayload, RetailPostingContext, ReviewedPosQuote } from '../services/financial/HfePosFinancialPort'

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300, status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body, text: async () => JSON.stringify(body),
  } as Response
}

const payload = {
  contact_id: '', policy: 'pay-first', payment_method: 'qris', outlet_id: 'OUTLET-1', terminal_id: 'TERM-1',
  currency: 'IDR', items: [{ product_id: 'MN-001', quantity: 1 }], cashier_id: 'CASHIER-1',
  idempotency_key: 'attempt-101',
} satisfies GovernedRetailCheckoutPayload

const checkoutKey = 'BOOK-1:ORDER-1'

class MemoryAttemptStore implements CheckoutAttemptStore<GovernedRetailCheckoutPayload> {
  record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload> | null = null
  phases: string[] = []

  async get(): Promise<CheckoutAttemptRecord<GovernedRetailCheckoutPayload> | null> {
    return this.record ? structuredClone(this.record) : null
  }

  async put(record: CheckoutAttemptRecord<GovernedRetailCheckoutPayload>): Promise<void> {
    this.record = structuredClone(record)
    this.phases.push(record.status)
  }

  async remove(): Promise<void> {
    this.record = null
  }
}

async function durability(
  initial: GovernedCheckoutEvidence = { phase: 'prepared' },
  attemptPayload: GovernedRetailCheckoutPayload = payload,
) {
  const store = new MemoryAttemptStore()
  const coordinator = new CafeCheckoutAttemptCoordinator(store, () => 'attempt-101')
  await coordinator.prepare(checkoutKey, 'BOOK-1', attemptPayload)
  const port = coordinator.durability(checkoutKey)
  const target = initial.phase
  const phaseOrder = [
    'prepared', 'quote_requested', 'quote_ready', 'qris_intent_requested',
    'qris_intent_ready', 'accept_requested', 'accepted', 'confirm_requested',
  ] as const
  const reaches = (phase: typeof phaseOrder[number]) => phaseOrder.indexOf(target as typeof phaseOrder[number]) >= phaseOrder.indexOf(phase)
  if (reaches('quote_requested')) await port.transition('quote_requested')
  if (reaches('quote_ready')) await port.transition('quote_ready', { quote: initial.quote ?? quoteEvidence() })
  if (reaches('qris_intent_requested')) await port.transition('qris_intent_requested')
  if (reaches('qris_intent_ready')) await port.transition('qris_intent_ready', { qrisIntent: initial.qrisIntent })
  if (reaches('accept_requested')) await port.transition('accept_requested')
  if (reaches('accepted')) await port.transition('accepted', { acceptedOrder: initial.acceptedOrder })
  if (reaches('confirm_requested')) await port.transition('confirm_requested', { cashConfirm: initial.cashConfirm })
  return { coordinator, port, read: () => port.load(), store }
}

function makeContext(governedAttempt: GovernedCheckoutDurability): RetailPostingContext {
  return {
    companyBookId: 'BOOK-1', organizationId: 'ORG-1', authorityContext: 'AUTH-1', sessionId: 'SESSION-1',
    financialDate: '2026-08-28', governedAttempt,
    handover: { actorPrincipalId: 'CASHIER-1', evidenceReference: 'POS-1', occurredAt: '2026-08-28T10:00:00Z' },
  }
}

function reviewed(context: RetailPostingContext, tender: 'cash' | 'qris'): ReviewedPosQuote {
  const intended = { ...payload, payment_method: tender } satisfies GovernedRetailCheckoutPayload
  return {
    quoteId: 'QUOTE-1', revision: '1', digestSha256: 'd'.repeat(64), currency: 'IDR',
    subtotalMinor: '28000', amountDueMinor: '30800', discountTotalMinor: '0', taxTotalMinor: '2800',
    serviceChargeTotalMinor: '0', tipTotalMinor: '0', roundingTotalMinor: '0', presetId: 'PRESET-1', presetVersion: '1',
    lines: [{ ordinal: 0, itemId: 'MN-001', quantity: '1', modifierIds: [], discountAllocatedMinor: '0' }],
    expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    tenderEligibility: [{ tenderType: tender, eligible: true }], source: 'hfe-core',
    intentFingerprint: governedIntentFingerprint(intended, context, context.companyBookId),
  }
}

function accepted(tender: 'cash' | 'qris', provider?: string) {
  return {
    acceptance_idempotency_key: 'attempt-101:accept', accepted_at: '2026-08-28T10:00:01Z', order_id: 'ORDER-1',
    quote: {
      amount_due_minor: '30800', components: [], currency: 'IDR', digest_sha256: 'd'.repeat(64),
      expires_at: '2026-08-28T10:15:00Z', lines: [], policies: [], preset_id: 'PRESET-1', preset_version: '1',
      promotions: [], quote_id: 'QUOTE-1', revision: '1',
    },
    tender: {
      acceptance_effect_key: 'e'.repeat(64), amount_minor: '30800', tender_id: `TENDER-${tender.toUpperCase()}-1`,
      tender_type: tender, ...(provider ? { provider_intent_reference: provider } : {}),
    },
  }
}

function quoteEvidence(): PosSaleQuoteView {
  return {
    quote_id: 'QUOTE-1', revision: '1' as Int64String, digest_sha256: 'd'.repeat(64), currency: 'IDR',
    subtotal_minor: '28000', amount_due_minor: '30800', discount_total_minor: '0', tax_total_minor: '2800',
    service_charge_total_minor: '0', tip_total_minor: '0', rounding_total_minor: '0', preset_id: 'PRESET-1', preset_version: '1' as Int64String,
    expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
    lines: [{ ordinal: 0, item_id: 'MN-001', quantity: '1' as Int64String, modifier_ids: [], discount_allocated_minor: '0' }],
    tender_eligibility: [{ tender_type: 'cash', eligible: true }, { tender_type: 'qris', eligible: true }],
  }
}

describe('governed checkout durable phase recovery', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('replays a response-lost quote request with the same durable key and intent body', async () => {
    const durable = await durability()
    const context = makeContext(durable.port)
    const quote = quoteEvidence()
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('quote response lost')).mockResolvedValueOnce(response(201, quote))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.prepareGovernedRetailQuote(payload, context)).rejects.toThrow(/quote response lost/i)
    expect((await durable.read()).phase).toBe('quote_requested')
    await adapter.prepareGovernedRetailQuote(payload, context)

    const calls = fetchMock.mock.calls.map(([, init]) => init as RequestInit)
    expect(calls.map((call) => call.headers)).toEqual(calls.map(() => expect.objectContaining({ 'Idempotency-Key': 'attempt-101:quote' })))
    expect(calls[0].body).toBe(calls[1].body)
    expect(await durable.read()).toMatchObject({ phase: 'quote_ready', quote: { quote_id: 'QUOTE-1' } })
  })

  it('reloads qris_intent_requested with the same quote and byte-identical QRIS request before one acceptance', async () => {
    const durable = await durability()
    const context = makeContext(durable.port)
    const quote = quoteEvidence()
    const qrisReceipt = { payment_id: 'QRIS-1', qris_string: '000201', qr_image_url: 'https://example.test/qr.png', expires_at: '2026-08-28T10:15:00Z' }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, quote))
      .mockRejectedValueOnce(new Error('response lost'))
      .mockResolvedValueOnce(response(200, qrisReceipt))
      .mockResolvedValueOnce(response(201, accepted('qris', 'QRIS-1')))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    const firstReviewed = await adapter.prepareGovernedRetailQuote(payload, context)
    await expect(adapter.postGovernedRetailOrder(payload, context, firstReviewed)).rejects.toThrow(/response lost/i)
    expect((await durable.read()).phase).toBe('qris_intent_requested')

    const reloaded = new CafeCheckoutAttemptCoordinator(durable.store, () => 'must-not-mint')
    const restoredAttempt = await reloaded.prepare(checkoutKey, 'BOOK-1', payload)
    const restoredContext = makeContext(reloaded.durability(checkoutKey))
    const restoredReviewed = await adapter.prepareGovernedRetailQuote(restoredAttempt.payload, restoredContext)
    const result = await reloaded.execute({
      checkoutKey,
      bookId: 'BOOK-1',
      payload,
      post: (identified) => adapter.postGovernedRetailOrder(identified, restoredContext, restoredReviewed),
    })

    expect(result.kind).toBe('pending')
    const qrisCalls = fetchMock.mock.calls.slice(1, 3).map(([, init]) => init as RequestInit)
    expect(qrisCalls.map((call) => call.headers)).toEqual([
      expect.objectContaining({ 'Idempotency-Key': 'attempt-101:qris-intent' }),
      expect.objectContaining({ 'Idempotency-Key': 'attempt-101:qris-intent' }),
    ])
    expect(qrisCalls.map((call) => call.body)).toEqual(qrisCalls.map(() => JSON.stringify({ amount_idr: 30800, transaction_id: 'QUOTE-1' })))
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/sale-quotes')).length).toBe(1)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/accepted-orders')).length).toBe(1)
    expect(await durable.read()).toMatchObject({ phase: 'pending', qrisIntent: { payment_id: 'QRIS-1' }, acceptedOrder: { order_id: 'ORDER-1' } })
    expect(durable.store.phases).toEqual(expect.not.arrayContaining(['outcome_unknown']))
  })

  it('reloads qris_intent_ready from durable quote and intent evidence without re-quoting or regenerating QRIS', async () => {
    const durable = await durability()
    const context = makeContext(durable.port)
    const qrisReceipt = { payment_id: 'QRIS-1', qris_string: '000201', qr_image_url: 'https://example.test/qr.png', expires_at: '2026-08-28T10:15:00Z' }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, quoteEvidence()))
      .mockResolvedValueOnce(response(201, accepted('qris', 'QRIS-1')))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await adapter.prepareGovernedRetailQuote(payload, context)
    await durable.port.transition('qris_intent_requested')
    await durable.port.transition('qris_intent_ready', { qrisIntent: qrisReceipt })

    const reloaded = new CafeCheckoutAttemptCoordinator(durable.store, () => 'must-not-mint')
    const restoredAttempt = await reloaded.prepare(checkoutKey, 'BOOK-1', payload)
    const restoredContext = makeContext(reloaded.durability(checkoutKey))
    const restoredReviewed = await adapter.prepareGovernedRetailQuote(restoredAttempt.payload, restoredContext)
    const result = await reloaded.execute({
      checkoutKey,
      bookId: 'BOOK-1',
      payload,
      post: (identified) => adapter.postGovernedRetailOrder(identified, restoredContext, restoredReviewed),
    })

    expect(result.kind).toBe('pending')
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/sale-quotes')).length).toBe(1)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/qris/generate')).length).toBe(0)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/accepted-orders')).length).toBe(1)
    expect(await durable.read()).toMatchObject({ phase: 'pending', qrisIntent: qrisReceipt, acceptedOrder: { order_id: 'ORDER-1' } })
  })

  it('recovers a response-lost acceptance through GET and checks the durable QRIS provider reference', async () => {
    const durable = await durability({ phase: 'quote_ready', quote: quoteEvidence() })
    const context = makeContext(durable.port)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, { payment_id: 'QRIS-1', qris_string: '000201', qr_image_url: 'https://example.test/qr.png', expires_at: '2026-08-28T10:15:00Z' }))
      .mockRejectedValueOnce(new Error('accept response lost'))
      .mockResolvedValueOnce(response(200, accepted('qris', 'QRIS-1')))
      .mockResolvedValueOnce(response(200, {
        tender_id: 'TENDER-QRIS-1', order_id: 'ORDER-1', amount_minor: '30800', currency: 'IDR',
        accepted_tender_effect_key: 'e'.repeat(64), outcome: 'pending',
      }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postGovernedRetailOrder(payload, context, reviewed(context, 'qris'))).rejects.toThrow(/accept response lost/i)
    expect((await durable.read()).phase).toBe('accept_requested')
    const result = await adapter.reconcileGovernedRetailOrder(payload, context)

    expect(result).toMatchObject({ status: 'pending', qris_payment: { payment_id: 'QRIS-1', tender_id: 'TENDER-QRIS-1' } })
    expect(fetchMock.mock.calls[2][0]).toContain('/accepted-orders/by-idempotency/attempt-101%3Aaccept')
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it.each([
    ['foreign acceptance key', { acceptance_idempotency_key: 'foreign:accept' }, /acceptance idempotency key/i],
    ['foreign QRIS intent', { tender: { ...accepted('qris', 'QRIS-FOREIGN').tender } }, /provider intent reference/i],
    ['malformed order identifier', { order_id: 'ORDER / unsafe' }, /canonical identifier/i],
    ['noncanonical accepted timestamp', { accepted_at: 'August 28, 2026 10:00:01 GMT' }, /RFC3339/i],
    ['malformed accepted timestamp', { accepted_at: '2026-13-40T25:61:61Z' }, /RFC3339/i],
    ['invalid calendar timestamp', { accepted_at: '2026-02-31T10:00:01Z' }, /RFC3339/i],
  ] as const)('rejects recovered acceptance with %s', async (_case, patch, expected) => {
    const durable = await durability({
      phase: 'accept_requested',
      quote: quoteEvidence(),
      qrisIntent: { payment_id: 'QRIS-1', qris_string: '000201', qr_image_url: 'https://example.test/qr.png', expires_at: '2026-08-28T10:15:00Z' },
    })
    const receipt = { ...accepted('qris', 'QRIS-1'), ...patch }
    const fetchMock = vi.fn().mockResolvedValue(response(200, receipt))
    vi.stubGlobal('fetch', fetchMock)

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .reconcileGovernedRetailOrder(payload, makeContext(durable.port))).rejects.toThrow(expected)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('replays only the byte-identical persisted cash confirmation after response loss', async () => {
    const cashPayload = { ...payload, payment_method: 'cash' as const }
    const durable = await durability({ phase: 'quote_ready', quote: quoteEvidence() }, cashPayload)
    const context = makeContext(durable.port)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, accepted('cash')))
      .mockRejectedValueOnce(new Error('confirm response lost'))
      .mockResolvedValueOnce(response(200, { finality: 'applied', posting_id: 'POSTING-1', tender_id: 'TENDER-CASH-1' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-1', book_id: 'BOOK-1', finality: 'applied', source_capability: 'pos_tender_sale',
        source_object_id: 'TENDER-CASH-1', stable_effect_key: 'e'.repeat(64), functional_currency: 'IDR',
        lines: [{ account_id: '1101', debit_minor: '30800', credit_minor: '0' }, { account_id: '4101', debit_minor: '0', credit_minor: '30800' }],
      }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postGovernedRetailOrder(cashPayload, context, reviewed(context, 'cash'))).rejects.toThrow(/confirm response lost/i)
    expect(await durable.read()).toMatchObject({ phase: 'confirm_requested', cashConfirm: {
      idempotencyKey: 'attempt-101:confirm', tenderId: 'TENDER-CASH-1', body: { accepted_tender_effect_key: 'e'.repeat(64) },
    } })
    const result = await adapter.reconcileGovernedRetailOrder(cashPayload, context)

    expect(result).toMatchObject({ status: 'posted', posting_id: 'POSTING-1' })
    const confirmCalls = [fetchMock.mock.calls[1], fetchMock.mock.calls[2]].map(([, init]) => init as RequestInit)
    expect(confirmCalls.map((call) => call.headers)).toEqual(confirmCalls.map(() => expect.objectContaining({ 'Idempotency-Key': 'attempt-101:confirm' })))
    expect(confirmCalls.map((call) => call.body)).toEqual(confirmCalls.map(() => JSON.stringify({ accepted_tender_effect_key: 'e'.repeat(64) })))
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('resumes a persisted cash 202 with the exact confirmation and validates its Posting', async () => {
    const cashPayload = { ...payload, payment_method: 'cash' as const }
    const durable = await durability({ phase: 'quote_ready', quote: quoteEvidence() }, cashPayload)
    const context = makeContext(durable.port)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, accepted('cash')))
      .mockResolvedValueOnce(response(202, { status: 'approval_required', tender_id: 'TENDER-CASH-1' }))
      .mockResolvedValueOnce(response(200, { finality: 'applied', posting_id: 'POSTING-1', tender_id: 'TENDER-CASH-1' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-1', book_id: 'BOOK-1', finality: 'applied', source_capability: 'pos_tender_sale',
        source_object_id: 'TENDER-CASH-1', stable_effect_key: 'e'.repeat(64), functional_currency: 'IDR',
        lines: [{ account_id: '1101', debit_minor: '30800', credit_minor: '0' }, { account_id: '4101', debit_minor: '0', credit_minor: '30800' }],
      }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    const first = await durable.coordinator.execute({
      checkoutKey,
      bookId: 'BOOK-1',
      payload: cashPayload,
      post: (identified) => adapter.postGovernedRetailOrder(identified, context, reviewed(context, 'cash')),
    })
    expect(first.kind).toBe('pending')
    expect(await durable.read()).toMatchObject({ phase: 'pending', cashConfirm: { response: { status: 'approval_required' } } })

    const reloaded = new CafeCheckoutAttemptCoordinator(durable.store, () => 'must-not-mint')
    const restoredContext = makeContext(reloaded.durability(checkoutKey))
    const restored = await reloaded.execute({
      checkoutKey,
      bookId: 'BOOK-1',
      payload: cashPayload,
      post: async () => { throw new Error('must not restart cash acceptance') },
      reconcile: (identified) => adapter.reconcileGovernedRetailOrder(identified, restoredContext),
      resumeExisting: true,
    })

    expect(restored.kind).toBe('posted')
    const confirmCalls = [fetchMock.mock.calls[1], fetchMock.mock.calls[2]].map(([, init]) => init as RequestInit)
    expect(confirmCalls.map((call) => call.headers)).toEqual(confirmCalls.map(() => expect.objectContaining({ 'Idempotency-Key': 'attempt-101:confirm' })))
    expect(confirmCalls[0].body).toBe(confirmCalls[1].body)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/accepted-orders')).length).toBe(1)
    expect(await durable.read()).toMatchObject({ phase: 'posted', cashConfirm: { response: { posting_id: 'POSTING-1' } } })
  })
})
