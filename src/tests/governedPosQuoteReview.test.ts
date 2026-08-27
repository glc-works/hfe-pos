import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import type {
  GovernedRetailCheckoutPayload,
  RetailPostingContext,
} from '../services/financial/HfePosFinancialPort'

const context: RetailPostingContext = {
  companyBookId: 'BOOK-CAFE-HQ-88',
  authorityContext: 'AUTHCTX-DEMO-BARISTA-01',
  sessionId: 'SESSION-OUT-04',
  financialDate: '2026-08-28',
  handover: {
    actorPrincipalId: 'USR-DEMO-BARISTA-01',
    evidenceReference: 'POS-RECEIPT-OUT-04',
    occurredAt: '2026-08-28T10:00:00.000Z',
  },
}

const governedPayload: GovernedRetailCheckoutPayload = {
  contact_id: '',
  policy: 'pay-first',
  payment_method: 'cash',
  outlet_id: 'OUTLET-CAFE-HQ',
  terminal_id: 'TERMINAL-04',
  currency: 'IDR',
  items: [{ product_id: 'MN-001', quantity: 1 }],
  idempotency_key: 'flagship-quote-review-001',
}

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

describe('governed POS quote review & acceptance', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('prepares and projects an authoritative CORE quote without acceptance or posting mutations', async () => {
    const futureExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const fetchMock = vi.fn().mockResolvedValue(response(201, {
      quote_id: 'QUOTE-1',
      revision: '3',
      digest_sha256: 'd'.repeat(64),
      currency: 'IDR',
      subtotal_minor: '28000',
      discount_total_minor: '0',
      tax_total_minor: '2800',
      service_charge_total_minor: '0',
      tip_total_minor: '0',
      rounding_total_minor: '0',
      amount_due_minor: '30800',
      preset_id: 'PRESET-1',
      preset_version: '4',
      lines: [{
        ordinal: 0,
        item_id: 'MN-001',
        quantity: '1',
        modifier_ids: [],
        discount_allocated_minor: '0',
      }],
      expires_at: futureExpiry,
      tender_eligibility: [
        { tender_type: 'cash', eligible: true },
        { tender_type: 'qris', eligible: true },
      ],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.prepareGovernedRetailQuote(governedPayload, context)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      quoteId: 'QUOTE-1',
      revision: '3',
      digestSha256: 'd'.repeat(64),
      currency: 'IDR',
      subtotalMinor: '28000',
      discountTotalMinor: '0',
      taxTotalMinor: '2800',
      serviceChargeTotalMinor: '0',
      tipTotalMinor: '0',
      roundingTotalMinor: '0',
      amountDueMinor: '30800',
      presetId: 'PRESET-1',
      presetVersion: '4',
      source: 'hfe-core',
    })
  })

  it('rejects quotes with non-canonical decimal money strings', async () => {
    const futureExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const fetchMock = vi.fn().mockResolvedValue(response(201, {
      quote_id: 'QUOTE-1',
      revision: '1',
      digest_sha256: 'd'.repeat(64),
      currency: 'IDR',
      amount_due_minor: '-500',
      expires_at: futureExpiry,
      tender_eligibility: [{ tender_type: 'cash', eligible: true }],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    await expect(adapter.prepareGovernedRetailQuote(governedPayload, context))
      .rejects.toThrow(/not a canonical non-negative minor-unit string/i)
  })

  it('rejects quotes with expired timestamp upon receipt', async () => {
    const pastExpiry = new Date(Date.now() - 60 * 1000).toISOString()
    const fetchMock = vi.fn().mockResolvedValue(response(201, {
      quote_id: 'QUOTE-1',
      revision: '1',
      digest_sha256: 'd'.repeat(64),
      currency: 'IDR',
      amount_due_minor: '30800',
      expires_at: pastExpiry,
      tender_eligibility: [{ tender_type: 'cash', eligible: true }],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    await expect(adapter.prepareGovernedRetailQuote(governedPayload, context))
      .rejects.toThrow(/expired upon receipt/i)
  })

  it('rejects quotes when currency differs from requested echo', async () => {
    const futureExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const fetchMock = vi.fn().mockResolvedValue(response(201, {
      quote_id: 'QUOTE-1',
      revision: '1',
      digest_sha256: 'd'.repeat(64),
      currency: 'USD',
      amount_due_minor: '30800',
      expires_at: futureExpiry,
      tender_eligibility: [{ tender_type: 'cash', eligible: true }],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    await expect(adapter.prepareGovernedRetailQuote(governedPayload, context))
      .rejects.toThrow(/differs from requested/i)
  })

  it('accepts reviewed quotes and returns authoritative tender evidence', async () => {
    const futureExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const fetchMock = vi.fn().mockResolvedValue(response(201, {
      order_id: 'ORDER-001',
      accepted_at: '2026-08-28T10:00:01.000Z',
      quote: {
        quote_id: 'QUOTE-1',
        revision: '3',
        digest_sha256: 'd'.repeat(64),
        currency: 'IDR',
        amount_due_minor: '30800',
      },
      tender: {
        tender_id: 'TENDER-CASH-001',
        tender_type: 'cash',
        amount_minor: '30800',
        currency: 'IDR',
        acceptance_effect_key: 'a'.repeat(64),
      },
    }))
    vi.stubGlobal('fetch', fetchMock)

    const reviewedQuote = {
      quoteId: 'QUOTE-1',
      revision: '3',
      digestSha256: 'd'.repeat(64),
      currency: 'IDR',
      subtotalMinor: '28000',
      amountDueMinor: '30800',
      discountTotalMinor: '0',
      taxTotalMinor: '2800',
      serviceChargeTotalMinor: '0',
      tipTotalMinor: '0',
      roundingTotalMinor: '0',
      presetId: 'PRESET-1',
      presetVersion: '4',
      lines: [],
      expiresAt: futureExpiry,
      tenderEligibility: [{ tenderType: 'cash' as const, eligible: true }],
      source: 'hfe-core' as const,
    }

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const evidence = await adapter.acceptGovernedRetailQuote(governedPayload, reviewedQuote, context)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(evidence).toMatchObject({
      orderId: 'ORDER-001',
      tenderId: 'TENDER-CASH-001',
      acceptanceEffectKey: 'a'.repeat(64),
      tenderType: 'cash',
      amountMinor: '30800',
      quote: {
        quoteId: 'QUOTE-1',
        revision: '3',
      },
    })
  })
})
