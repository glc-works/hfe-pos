import { describe, expect, it, vi } from 'vitest'
import type { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'

const payload = {
  contact_id: '',
  policy: 'pay-first',
  payment_method: 'cash',
  items: [{ product_id: 'MN-001', hfe_gl_account: '4101', qty: 2, price: 28_000 }],
  subtotal: 56_000,
  tax_pb1_amount: 0,
  service_fee_amount: 0,
  discount_amount: 0,
  grand_total: 56_000,
  idempotency_key: 'readback-validation-key',
} satisfies SubmitRetailTransactionPayload

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

describe('HfeSdkAdapter POS posting read-back validation', () => {
  it('rejects legacy dotted source capability instead of accepting incorrect POS lineage', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-DOTTED', content_sha256: null, subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-DOTTED', content_sha256: 'SOURCE-TOKEN-DOTTED', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { finality: 'applied', order_id: 'ORDER-DOTTED', posting_id: 'POSTING-DOTTED' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-DOTTED', book_id: context.companyBookId, finality: 'applied',
        source_capability: 'pos.order', source_object_id: 'ORDER-DOTTED',
        stable_effect_key: payload.idempotency_key,
      })))

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' }).postRetailOrder(payload, context))
      .rejects.toThrow(/durable posting read-back mismatch/i)
  })

  it('fails closed when durable posting read-back does not match the exact POS lineage', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(201, { id: 'ORDER-003', content_sha256: null, subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { id: 'ORDER-003', content_sha256: 'SOURCE-TOKEN-003', subtotal_minor: '56000', tax_amount_minor: '0', discount_amount_minor: '0', final_total_minor: '56000', items: [] }))
      .mockResolvedValueOnce(response(200, { finality: 'applied', order_id: 'ORDER-003', posting_id: 'POSTING-003' }))
      .mockResolvedValueOnce(response(200, {
        id: 'POSTING-DIFFERENT', finality: 'applied', source_capability: 'manual-journal',
        source_object_id: 'ORDER-DIFFERENT', stable_effect_key: 'different-key',
      })))

    await expect(new HfeSdkAdapter({ baseUrl: 'http://localhost:8080' }).postRetailOrder(payload, context))
      .rejects.toThrow(/durable posting read-back mismatch/i)
  })
})
