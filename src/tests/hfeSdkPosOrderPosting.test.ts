import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import type { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'

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
        content_sha256: 'SOURCE-TOKEN-001',
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

  it('returns pending and does not fabricate durable truth when CORE accepts posting asynchronously', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-002', content_sha256: 'SOURCE-TOKEN-002', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-002', content_sha256: 'SOURCE-TOKEN-002', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(202, { order_id: 'ORDER-002', status: 'Pending' })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })
    const result = await adapter.postRetailOrder(payload, context)

    expect(result.status).toBe('pending')
    expect(result.ledger_journal_id).toBeUndefined()
  })

  it('rejects legacy title-case finality instead of treating it as authoritative applied truth', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-LEGACY', content_sha256: 'SOURCE-TOKEN-LEGACY', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
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

  it('rejects legacy dotted source capability instead of accepting incorrect POS lineage', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-DOTTED', content_sha256: 'SOURCE-TOKEN-DOTTED', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-DOTTED', content_sha256: 'SOURCE-TOKEN-DOTTED', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { finality: 'applied', order_id: 'ORDER-DOTTED', posting_id: 'POSTING-DOTTED' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-DOTTED',
        book_id: context.companyBookId,
        finality: 'applied',
        source_capability: 'pos.order',
        source_object_id: 'ORDER-DOTTED',
        stable_effect_key: payload.idempotency_key,
      })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder(payload, context)).rejects.toThrow(/durable posting read-back mismatch/i)
  })

  it('fails closed when durable posting read-back does not match the exact POS lineage', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-003', content_sha256: 'SOURCE-TOKEN-003', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-003', content_sha256: 'SOURCE-TOKEN-003', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { finality: 'applied', order_id: 'ORDER-003', posting_id: 'POSTING-003' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-DIFFERENT',
        finality: 'applied',
        source_capability: 'manual-journal',
        source_object_id: 'ORDER-DIFFERENT',
        stable_effect_key: 'different-key',
      })))

    const adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' })

    await expect(adapter.postRetailOrder(payload, context)).rejects.toThrow(/durable posting read-back mismatch/i)
  })
})
