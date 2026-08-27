import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import type { GovernedRetailCheckoutPayload, SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'

const payload: SubmitRetailTransactionPayload = {
  table_id: 'OUT-04',
  contact_id: 'CONTACT-GUEST',
  policy: 'pay-first',
  payment_method: 'cash',
  items: [{ product_id: 'MN-001', hfe_gl_account: '4101', qty: 2, price: 28_000 }],
  subtotal: 56_000,
  tax_pb1_amount: 0,
  service_fee_amount: 0,
  discount_amount: 0,
  grand_total: 56_000,
  cashier_id: 'USR-DEMO-BARISTA-01',
  idempotency_key: ['test', 'idempotency', 'flagship', '35'].join(':'),
}

const context = {
  companyBookId: 'BOOK-CAFE-HQ-88',
  authorityContext: 'AUTHCTX-DEMO-BARISTA-01',
  sessionId: 'SESSION-OUT-04',
  financialDate: '2026-08-24',
  handover: {
    actorPrincipalId: 'USR-DEMO-BARISTA-01',
    evidenceReference: 'POS-RECEIPT-OUT-04',
    occurredAt: '2026-08-24T10:00:00.000Z',
  },
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

describe('HfeSdkAdapter canonical POS posting path', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('uses the governed quote and frozen cash tender without sending browser-owned money or GL facts', async () => {
    const governedPayload = {
      contact_id: 'CONTACT-GUEST',
      policy: 'pay-first',
      payment_method: 'cash',
      outlet_id: 'OUTLET-CAFE-HQ',
      terminal_id: 'TERMINAL-04',
      currency: 'IDR',
      items: [{ product_id: 'MN-001', quantity: 2, modifier_ids: ['MOD-EXTRA-SHOT'] }],
      idempotency_key: 'flagship-governed-cash-001',
    } satisfies GovernedRetailCheckoutPayload
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, {
        quote_id: 'QUOTE-001',
        revision: '7',
        digest_sha256: 'a'.repeat(64),
        preset_id: 'PRESET-CAFE-ID',
        preset_version: '3',
        currency: 'IDR',
        amount_due_minor: '61600',
        discount_total_minor: '4000',
        expires_at: '2026-08-24T10:05:00.000Z',
        lines: [],
        tender_eligibility: [
          { eligible: true, tender_type: 'cash' },
          { eligible: false, reason_code: 'provider_route_required', tender_type: 'qris' },
        ],
      }))
      .mockResolvedValueOnce(response(201, {
        acceptance_idempotency_key: 'flagship-governed-cash-001:accept',
        accepted_at: '2026-08-24T10:00:01.000Z',
        order_id: 'ORDER-001',
        quote: {
          quote_id: 'QUOTE-001',
          revision: '7',
          digest_sha256: 'a'.repeat(64),
          currency: 'IDR',
          amount_due_minor: '61600',
        },
        tender: {
          acceptance_effect_key: 'b'.repeat(64),
          amount_minor: '61600',
          tender_id: 'TENDER-001',
          tender_type: 'cash',
        },
      }))
      .mockResolvedValueOnce(response(200, {
        finality: 'applied',
        posting_id: 'POSTING-001',
        tender_id: 'TENDER-001',
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-001',
        book_id: context.companyBookId,
        finality: 'applied',
        source_capability: 'pos_tender_sale',
        source_object_id: 'TENDER-001',
        stable_effect_key: 'b'.repeat(64),
      }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.postGovernedRetailOrder(governedPayload, context)

    expect(result).toMatchObject({
      status: 'posted',
      tx_id: 'ORDER-001',
      posting_id: 'POSTING-001',
      grand_total: 61_600,
    })
    const calls = fetchMock.mock.calls.map(([url, init]) => ({
      url: String(url),
      headers: init?.headers as Record<string, string>,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    }))
    expect(calls.map((call) => call.url)).toEqual([
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/sale-quotes',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/order/accepted-orders',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/tenders/TENDER-001/confirm-cash',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/postings/POSTING-001',
    ])
    expect(calls[0].body).toEqual({
      currency: 'IDR',
      lines: [{ item_id: 'MN-001', modifier_ids: ['MOD-EXTRA-SHOT'], quantity: 2 }],
      outlet_id: 'OUTLET-CAFE-HQ',
      promotion_codes: [],
      terminal_id: 'TERMINAL-04',
    })
    expect(calls[1].body).toEqual({
      quote_digest_sha256: 'a'.repeat(64),
      quote_id: 'QUOTE-001',
      quote_revision: 7,
      tender: {
        amount_minor: '61600',
        tender_type: 'cash',
      },
    })
    expect(calls[2].body).toEqual({ accepted_tender_effect_key: 'b'.repeat(64) })
    expect(JSON.stringify(calls.slice(0, 3))).not.toMatch(/hfe_gl_account|unit_price|subtotal|tax_pb1|service_fee|discount_amount|grand_total/)
  })

  it('stops before ORDER acceptance when the authoritative quote disables cash', async () => {
    const governedPayload = {
      contact_id: '',
      policy: 'pay-first',
      payment_method: 'cash',
      outlet_id: 'OUTLET-CAFE-HQ',
      terminal_id: 'TERMINAL-04',
      currency: 'IDR',
      items: [{ product_id: 'MN-001', quantity: 1 }],
      idempotency_key: 'flagship-disabled-cash-001',
    } satisfies GovernedRetailCheckoutPayload
    const fetchMock = vi.fn().mockResolvedValueOnce(response(201, {
      quote_id: 'QUOTE-CASH-DISABLED',
      revision: '1',
      digest_sha256: 'c'.repeat(64),
      preset_id: 'PRESET-CAFE-ID',
      preset_version: '3',
      currency: 'IDR',
      amount_due_minor: '28000',
      discount_total_minor: '0',
      expires_at: '2026-08-24T10:05:00.000Z',
      lines: [],
      tender_eligibility: [{ eligible: false, reason_code: 'terminal_cash_mapping_inactive', tender_type: 'cash' }],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    await expect(adapter.postGovernedRetailOrder(governedPayload, context)).rejects.toThrow(/cash.*not eligible/i)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rejects non-cash tenders before creating a CORE POS order', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder({ ...payload, payment_method: 'qris' }, context))
      .rejects.toThrow(/cash-only/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects tax, fees, or discounts unsupported by the canonical cash-only slice', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder({ ...payload, tax_pb1_amount: 5_600, grand_total: 61_600 }, context))
      .rejects.toThrow(/tax.*fee.*discount/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stops before submit when CORE computed total differs from the POS amount', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(201, {
      id: 'ORDER-MISMATCH',
      company_book_id: context.companyBookId,
      content_sha256: 'SOURCE-TOKEN-MISMATCH',
      status: 'Draft',
      subtotal_minor: '55000',
      tax_amount_minor: '0',
      discount_amount_minor: '0',
      final_total_minor: '55000',
      functional_currency: 'IDR',
      items: [],
    }))
    vi.stubGlobal('fetch', fetchMock)
    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder(payload, context)).rejects.toThrow(/amount mismatch/i)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('accepts posted only after exact applied posting read-back with POS lineage', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, {
        id: 'ORDER-001',
        company_book_id: context.companyBookId,
        content_sha256: null,
        status: 'Draft',
        subtotal_minor: '56000',
        tax_amount_minor: '0',
        discount_amount_minor: '0',
        final_total_minor: '56000',
        functional_currency: 'IDR',
        items: [],
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'ORDER-001',
        company_book_id: context.companyBookId,
        content_sha256: 'SOURCE-TOKEN-001',
        status: 'Submitted',
        items: [],
      }))
      .mockResolvedValueOnce(response(200, {
        finality: 'applied',
        order_id: 'ORDER-001',
        posting_id: 'POSTING-001',
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-001',
        book_id: context.companyBookId,
        finality: 'applied',
        source_capability: 'pos_order',
        source_object_id: 'ORDER-001',
        stable_effect_key: `${payload.idempotency_key}:post`,
      }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.postRetailOrder(payload, context)

    expect(result).toMatchObject({
      status: 'posted',
      tx_id: 'ORDER-001',
      ledger_journal_id: 'POSTING-001',
      posting_id: 'POSTING-001',
      idempotency_key: payload.idempotency_key,
    })
    expect(fetchMock).toHaveBeenCalledTimes(4)

    const calls = fetchMock.mock.calls.map(([url, init]) => ({
      url: String(url),
      headers: init?.headers as Record<string, string>,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    }))
    expect(calls.map((call) => call.url)).toEqual([
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/orders',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/orders/ORDER-001/submit',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/orders/ORDER-001/post',
      'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/postings/POSTING-001',
    ])
    expect(calls.slice(0, 3).map((call) => call.headers['Idempotency-Key'])).toEqual([
      `${payload.idempotency_key}:process`,
      `${payload.idempotency_key}:submit`,
      `${payload.idempotency_key}:post`,
    ])
    for (const call of calls.slice(0, 3)) {
      expect(call.headers['X-CBook-Authority-Context']).toBe(context.authorityContext)
    }
    expect(calls[0].body).toEqual({
      customer_contact_id: payload.contact_id,
      items: [{ product_id: 'MN-001', quantity: 2, unit_price_minor: 28_000 }],
      payment_method: 'cash',
      session_id: context.sessionId,
    })
    expect(calls[1].body).toEqual({
      financial_date: context.financialDate,
      handover: {
        control_transferred: true,
        evidence_reference: context.handover.evidenceReference,
        occurred_at: context.handover.occurredAt,
      },
    })
    expect(calls[2].body).toEqual({ expected_source_token: 'SOURCE-TOKEN-001' })
  })

  it('reconciles an unknown outcome through idempotent discovery and read-only truth checks', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(201, {
        id: 'ORDER-RECOVERED',
        company_book_id: context.companyBookId,
        subtotal_minor: '56000',
        tax_amount_minor: '0',
        discount_amount_minor: '0',
        final_total_minor: '56000',
        items: [],
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'ORDER-RECOVERED',
        company_book_id: context.companyBookId,
        status: 'posted',
        posting_id: 'POSTING-RECOVERED',
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-RECOVERED',
        book_id: context.companyBookId,
        finality: 'applied',
        source_capability: 'pos_order',
        source_object_id: 'ORDER-RECOVERED',
        stable_effect_key: `${payload.idempotency_key}:post`,
      }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.reconcileRetailOrder(payload, context)

    expect(result).toMatchObject({
      status: 'posted',
      tx_id: 'ORDER-RECOVERED',
      ledger_journal_id: 'POSTING-RECOVERED',
      posting_id: 'POSTING-RECOVERED',
      idempotency_key: payload.idempotency_key,
    })
    const calls = fetchMock.mock.calls.map(([url, init]) => ({
      url: String(url),
      method: init?.method,
      headers: init?.headers as Record<string, string>,
    }))
    expect(calls).toEqual([
      {
        url: 'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/orders',
        method: 'POST',
        headers: expect.objectContaining({ 'Idempotency-Key': `${payload.idempotency_key}:process` }),
      },
      {
        url: 'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/pos/orders/ORDER-RECOVERED',
        method: 'GET',
        headers: expect.any(Object),
      },
      {
        url: 'http://localhost:8080/v1/company-books/BOOK-CAFE-HQ-88/postings/POSTING-RECOVERED',
        method: 'GET',
        headers: expect.any(Object),
      },
    ])
    expect(calls.some((call) => call.url.endsWith('/submit') || call.url.endsWith('/post'))).toBe(false)
  })

  it('keeps reconciliation unresolved when the discovered order has no applied posting', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, {
        id: 'ORDER-NOT-POSTED',
        company_book_id: context.companyBookId,
        subtotal_minor: '56000',
        tax_amount_minor: '0',
        discount_amount_minor: '0',
        final_total_minor: '56000',
        items: [],
      }))
      .mockResolvedValueOnce(response(200, {
        id: 'ORDER-NOT-POSTED',
        company_book_id: context.companyBookId,
        status: 'submitted',
        posting_id: null,
      })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.reconcileRetailOrder(payload, context)

    expect(result.status).toBe('pending')
    expect(result.ledger_journal_id).toBeUndefined()
  })

  it('returns pending and does not fabricate durable truth when CORE accepts posting asynchronously', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-002', content_sha256: null, subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-002', content_sha256: 'SOURCE-TOKEN-002', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(202, { order_id: 'ORDER-002', status: 'Pending' })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.postRetailOrder(payload, context)

    expect(result.status).toBe('pending')
    expect(result.ledger_journal_id).toBeUndefined()
  })

  it('rejects legacy title-case finality instead of treating it as authoritative applied truth', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-LEGACY', content_sha256: null, subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-LEGACY', content_sha256: 'SOURCE-TOKEN-LEGACY', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { finality: 'Applied', order_id: 'ORDER-LEGACY', posting_id: 'POSTING-LEGACY' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-LEGACY',
        book_id: context.companyBookId,
        finality: 'Applied',
        source_capability: 'pos_order',
        source_object_id: 'ORDER-LEGACY',
        stable_effect_key: payload.idempotency_key,
      })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder(payload, context)).rejects.toThrow(/durable posting read-back mismatch/i)
  })

})
