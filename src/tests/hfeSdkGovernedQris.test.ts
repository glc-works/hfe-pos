import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import type { GovernedRetailCheckoutPayload } from '../services/financial/HfePosFinancialPort'

const context = {
  companyBookId: 'BOOK-CAFE-HQ-88',
  organizationId: 'ORG-CAFE-HQ-88',
  authorityContext: 'AUTHCTX-DEMO-BARISTA-01',
  sessionId: 'SESSION-OUT-04',
  financialDate: '2026-08-24',
  handover: {
    actorPrincipalId: 'USR-DEMO-BARISTA-01',
    evidenceReference: 'POS-RECEIPT-OUT-04',
    occurredAt: '2026-08-24T10:00:00.000Z',
  },
}

const governedPayload = {
  contact_id: '',
  policy: 'pay-first',
  payment_method: 'qris',
  outlet_id: 'OUTLET-CAFE-HQ',
  terminal_id: 'TERMINAL-04',
  currency: 'IDR',
  items: [{ product_id: 'MN-001', quantity: 1 }],
  cashier_id: 'USR-DEMO-BARISTA-01',
  idempotency_key: 'flagship-governed-qris-001',
} satisfies GovernedRetailCheckoutPayload

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

describe('HfeSdkAdapter governed QRIS lifecycle', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('returns the CORE QR receipt and freezes its provider reference without confirming payment', async () => {
    const qrisExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, {
        quote_id: 'QUOTE-QRIS-001', revision: '3', digest_sha256: 'd'.repeat(64),
        preset_id: 'PRESET-CAFE-ID', preset_version: '3', currency: 'IDR',
        subtotal_minor: '28000', amount_due_minor: '30800', discount_total_minor: '0',
        tax_total_minor: '2800', service_charge_total_minor: '0', tip_total_minor: '0', rounding_total_minor: '0',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), lines: [{ item_id: 'MN-001', quantity: '1', modifier_ids: [], discount_allocated_minor: '0' }],
        tender_eligibility: [{ eligible: false, tender_type: 'cash' }, { eligible: true, tender_type: 'qris' }],
      }))
      .mockResolvedValueOnce(response(200, {
        expires_at: qrisExpiresAt, payment_id: 'QRIS-INTENT-001',
        qr_image_url: 'https://example.test/qris/QRIS-INTENT-001.png', qris_string: '000201010212',
      }))
      .mockResolvedValueOnce(response(201, {
        acceptance_idempotency_key: 'flagship-governed-qris-001:accept',
        accepted_at: '2026-08-24T10:00:01.000Z', order_id: 'ORDER-QRIS-001',
        quote: {
          quote_id: 'QUOTE-QRIS-001', revision: '3', digest_sha256: 'd'.repeat(64),
          currency: 'IDR', amount_due_minor: '30800',
        },
        tender: {
          acceptance_effect_key: 'e'.repeat(64), amount_minor: '30800',
          provider_intent_reference: 'QRIS-INTENT-001', tender_id: 'TENDER-QRIS-001', tender_type: 'qris',
        },
      }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const reviewed = await adapter.prepareGovernedRetailQuote(governedPayload, context)
    const result = await adapter.postGovernedRetailOrder(governedPayload, context, reviewed)

    expect(result).toMatchObject({
      status: 'pending', tx_id: 'ORDER-QRIS-001', grand_total: '30800',
      qris_payment: {
        payment_id: 'QRIS-INTENT-001', tender_id: 'TENDER-QRIS-001',
        qris_string: '000201010212',
        qr_image_url: 'https://example.test/qris/QRIS-INTENT-001.png',
        expires_at: qrisExpiresAt,
      },
    })
    const calls = fetchMock.mock.calls.map(([, request]) => JSON.parse(String((request as RequestInit).body)))
    expect(calls[1]).toEqual({ amount_idr: 30_800, transaction_id: 'QUOTE-QRIS-001' })
    expect(calls[2].tender).toEqual({ amount_minor: '30800', provider_intent_reference: 'QRIS-INTENT-001', tender_type: 'qris' })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('rejects QRIS acceptance when the receipt echoes a different provider intent', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, {
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), payment_id: 'QRIS-INTENT-001',
        qr_image_url: 'https://example.test/qris/QRIS-INTENT-001.png', qris_string: '000201010212',
      }))
      .mockResolvedValueOnce(response(201, {
        acceptance_idempotency_key: 'flagship-governed-qris-001:accept',
        accepted_at: '2026-08-24T10:00:01.000Z', order_id: 'ORDER-QRIS-001',
        quote: { quote_id: 'QUOTE-QRIS-001', revision: '3', digest_sha256: 'd'.repeat(64), currency: 'IDR', amount_due_minor: '30800' },
        tender: { acceptance_effect_key: 'e'.repeat(64), amount_minor: '30800', provider_intent_reference: 'QRIS-FOREIGN', tender_id: 'TENDER-QRIS-001', tender_type: 'qris' },
      }))
    vi.stubGlobal('fetch', fetchMock)
    const reviewed = {
      quoteId: 'QUOTE-QRIS-001', revision: '3', digestSha256: 'd'.repeat(64), currency: 'IDR',
      subtotalMinor: '28000', amountDueMinor: '30800', discountTotalMinor: '0', taxTotalMinor: '2800',
      serviceChargeTotalMinor: '0', tipTotalMinor: '0', roundingTotalMinor: '0', presetId: 'PRESET-CAFE-ID', presetVersion: '3',
      lines: [{ ordinal: 0, itemId: 'MN-001', quantity: '1', modifierIds: [], discountAllocatedMinor: '0' }],
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      tenderEligibility: [{ tenderType: 'qris' as const, eligible: true }], source: 'hfe-core' as const,
      intentFingerprint: (await import('../services/financial/GovernedPosCheckout')).governedIntentFingerprint(governedPayload, context, context.companyBookId),
    }

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .postGovernedRetailOrder(governedPayload, context, reviewed))
      .rejects.toThrow(/provider intent reference/i)
  })

  it('fails closed without network mutation when no authoritative outcome-read contract exists', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(404, { message: 'not found' }))
    vi.stubGlobal('fetch', fetchMock)

    const recoveryContext = {
      ...context,
      governedAttempt: {
        load: async () => ({ phase: 'accept_requested' as const }),
        transition: async () => {},
      },
    }
    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .reconcileGovernedRetailOrder(governedPayload, recoveryContext))
      .rejects.toThrow(/recovery lookup is unavailable/i)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('exposes the generated governed tender outcome operation on HfeClient', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, {
      accepted_tender_effect_key: 'e'.repeat(64),
      amount_minor: '30800',
      currency: 'IDR',
      order_id: 'ORDER-1',
      outcome: 'pending',
      posting_finality: null,
      posting_id: null,
      posting_source_capability: null,
      posting_source_object_id: null,
      posting_stable_effect_key: null,
      provider_event_id: null,
      provider_event_receipt_id: null,
      provider_occurred_at: null,
      tender_id: 'TENDER-1',
    }))
    vi.stubGlobal('fetch', fetchMock)
    const { HfeClient } = await import('@hfe/sdk')
    const client = new HfeClient({ baseUrl: 'http://localhost:8080' })
    const result = await client.operations.getGovernedPosTenderOutcome({
      path: { book: 'BOOK-1', tender_id: 'TENDER-1' },
    })
    expect(result.body).toMatchObject({ tender_id: 'TENDER-1', outcome: 'pending' })
  })

  it('reconciles QRIS outcome when pending without mutation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, {
      tender_id: 'TENDER-QRIS-001',
      order_id: 'ORDER-QRIS-001',
      amount_minor: '30800',
      currency: 'IDR',
      accepted_tender_effect_key: 'e'.repeat(64),
      outcome: 'pending',
    }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.reconcileGovernedTenderOutcome({
      orderId: 'ORDER-QRIS-001',
      tenderId: 'TENDER-QRIS-001',
      acceptedTenderEffectKey: 'e'.repeat(64),
      amountMinor: '30800',
      currency: 'IDR',
    }, context)

    expect(result).toMatchObject({
      status: 'pending',
      tx_id: 'ORDER-QRIS-001',
      grand_total: '30800',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reconciles applied QRIS outcome with Posting read-back verification', async () => {
    const effectKey = 'e'.repeat(64)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, {
        tender_id: 'TENDER-QRIS-001',
        order_id: 'ORDER-QRIS-001',
        amount_minor: '30800',
        currency: 'IDR',
        accepted_tender_effect_key: effectKey,
        outcome: 'applied',
        posting_id: 'POSTING-QRIS-001',
        posting_finality: 'applied',
        posting_source_capability: 'pos_tender_sale',
        posting_source_object_id: 'TENDER-QRIS-001',
        posting_stable_effect_key: effectKey,
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-QRIS-001',
        posting_id: 'POSTING-QRIS-001',
        book_id: 'BOOK-CAFE-HQ-88',
        finality: 'applied',
        source_capability: 'pos_tender_sale',
        source_object_id: 'TENDER-QRIS-001',
        stable_effect_key: effectKey,
        functional_currency: 'IDR',
        lines: [
          { account_code: '1104', debit_minor: '30800', credit_minor: '0' },
          { account_code: '4101', debit_minor: '0', credit_minor: '30800' },
        ],
      }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.reconcileGovernedTenderOutcome({
      orderId: 'ORDER-QRIS-001',
      tenderId: 'TENDER-QRIS-001',
      acceptedTenderEffectKey: effectKey,
      amountMinor: '30800',
      currency: 'IDR',
    }, context)

    expect(result).toMatchObject({
      status: 'posted',
      tx_id: 'ORDER-QRIS-001',
      posting_id: 'POSTING-QRIS-001',
      grand_total: '30800',
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['posting_finality', 'pending', /posting finality/i],
    ['posting_source_capability', 'invoice', /source capability/i],
    ['posting_source_object_id', 'TENDER-FOREIGN', /source object/i],
    ['posting_stable_effect_key', 'f'.repeat(64), /stable effect key/i],
  ] as const)('rejects applied outcome metadata with mismatched %s', async (field, value, expectedError) => {
    const effectKey = 'e'.repeat(64)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, {
        tender_id: 'TENDER-QRIS-001', order_id: 'ORDER-QRIS-001', amount_minor: '30800',
        currency: 'IDR', accepted_tender_effect_key: effectKey, outcome: 'applied',
        posting_id: 'POSTING-QRIS-001', posting_finality: 'applied',
        posting_source_capability: 'pos_tender_sale', posting_source_object_id: 'TENDER-QRIS-001',
        posting_stable_effect_key: effectKey,
        [field]: value,
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-QRIS-001', book_id: context.companyBookId, finality: 'applied',
        source_capability: 'pos_tender_sale', source_object_id: 'TENDER-QRIS-001',
        stable_effect_key: effectKey, functional_currency: 'IDR',
        lines: [
          { account_code: '1104', debit_minor: '30800', credit_minor: '0' },
          { account_code: '4101', debit_minor: '0', credit_minor: '30800' },
        ],
      }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .reconcileGovernedTenderOutcome({
        orderId: 'ORDER-QRIS-001', tenderId: 'TENDER-QRIS-001', acceptedTenderEffectKey: effectKey,
        amountMinor: '30800', currency: 'IDR',
      }, context)).rejects.toThrow(expectedError)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fails closed when QRIS outcome reports mismatch', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, {
      tender_id: 'TENDER-QRIS-001',
      order_id: 'ORDER-DIFFERENT',
      amount_minor: '30800',
      currency: 'IDR',
      accepted_tender_effect_key: 'e'.repeat(64),
      outcome: 'applied',
      posting_id: 'POSTING-QRIS-001',
    }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    await expect(adapter.reconcileGovernedTenderOutcome({
      orderId: 'ORDER-QRIS-001',
      tenderId: 'TENDER-QRIS-001',
      acceptedTenderEffectKey: 'e'.repeat(64),
      amountMinor: '30800',
      currency: 'IDR',
    }, context)).rejects.toThrow(/Order outcome mismatch/i)
  })

  it.each([
    ['amount_minor', '30900', /Amount outcome mismatch/i],
    ['currency', 'USD', /Currency outcome mismatch/i],
    ['accepted_tender_effect_key', 'f'.repeat(64), /effect key mismatch/i],
  ] as const)('rejects a pending outcome with mismatched %s', async (field, value, expectedError) => {
    const effectKey = 'e'.repeat(64)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(200, {
      tender_id: 'TENDER-QRIS-001', order_id: 'ORDER-QRIS-001', amount_minor: '30800',
      currency: 'IDR', accepted_tender_effect_key: effectKey, outcome: 'pending',
      [field]: value,
    })))

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .reconcileGovernedTenderOutcome({
        orderId: 'ORDER-QRIS-001', tenderId: 'TENDER-QRIS-001', acceptedTenderEffectKey: effectKey,
        amountMinor: '30800', currency: 'IDR',
      }, context)).rejects.toThrow(expectedError)
  })

  it('rejects an applied outcome whose Posting currency differs from accepted evidence', async () => {
    const effectKey = 'e'.repeat(64)
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(200, {
        tender_id: 'TENDER-QRIS-001', order_id: 'ORDER-QRIS-001', amount_minor: '30800',
        currency: 'IDR', accepted_tender_effect_key: effectKey, outcome: 'applied',
        posting_id: 'POSTING-QRIS-001', posting_finality: 'applied',
        posting_source_capability: 'pos_tender_sale', posting_source_object_id: 'TENDER-QRIS-001',
        posting_stable_effect_key: effectKey,
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-QRIS-001', book_id: context.companyBookId, finality: 'applied',
        source_capability: 'pos_tender_sale', source_object_id: 'TENDER-QRIS-001', stable_effect_key: effectKey,
        functional_currency: 'USD',
        lines: [
          { account_id: '1104', debit_minor: '30800', credit_minor: '0' },
          { account_id: '4101', debit_minor: '0', credit_minor: '30800' },
        ],
      })))

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
      .reconcileGovernedTenderOutcome({
        orderId: 'ORDER-QRIS-001', tenderId: 'TENDER-QRIS-001', acceptedTenderEffectKey: effectKey,
        amountMinor: '30800', currency: 'IDR',
      }, context)).rejects.toThrow(/functional currency mismatch/i)
  })
})
