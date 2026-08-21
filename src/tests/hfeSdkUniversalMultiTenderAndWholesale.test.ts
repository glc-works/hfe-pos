import { describe, it, expect, vi } from 'vitest'
import { MockHfeAdapter } from '../services/financial/MockHfeAdapter'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import { UniversalMultiTenderRequest } from '../services/financial/HfePosFinancialPort'
import { MenuItem } from '../types/pos'

describe('Universal Multi-Tender Settlement & Wholesale Volume Pricing Suite (L2-POS-91)', () => {
  it('should settle multi-tender transaction in MockHfeAdapter with balanced GL entries', async () => {
    const adapter = new MockHfeAdapter()

    const request: UniversalMultiTenderRequest = {
      document_reference_id: 'DOC-BILL-8899',
      total_obligation_minor: 100000,
      tenders: [
        { tender_type: 'cash', amount_minor: 60000 },
        { tender_type: 'qris', amount_minor: 40000, reference_id: 'QRIS-REF-1002' }
      ],
      discrepancies: [
        { discrepancy_type: 'tip_income', amount_minor: 5000, reason: 'Tipping Barista' }
      ],
      cashier_id: 'CASHIER-01',
      notes: 'Split payment Cash + QRIS'
    }

    const response = await adapter.settleUniversalMultiTender(request)

    expect(response.status).toBe('settled')
    expect(response.total_obligation_minor).toBe(100000)
    expect(response.total_tendered_minor).toBe(100000)
    expect(response.total_discrepancy_minor).toBe(5000)
    expect(response.journal_posting_id).toBeDefined()
    expect(response.gl_entries_posted?.length).toBeGreaterThanOrEqual(3)

    // Verify debit tenders = credit sales
    const totalDebit = response.gl_entries_posted?.reduce((s, e) => s + e.debit, 0) || 0
    const totalCredit = response.gl_entries_posted?.reduce((s, e) => s + e.credit, 0) || 0
    expect(totalDebit).toBe(100000)
    expect(totalCredit).toBe(100000)
  })

  it('uses generated settlement headers and preserves int64 digits on the wire', async () => {
    const adapter = new HfeSdkAdapter({
      baseUrl: 'http://localhost:8080',
      defaultBookId: 'BOOK-TEST-01',
      authorityContextId: 'AUTH-CONTEXT-01',
    } as any)

    const mockSuccessResponse = {
      settlement_id: 'SETTLE-LIVE-7711',
      document_reference_id: 'DOC-BILL-8899',
      total_obligation_minor: 150000,
      total_tendered_minor: 150000,
      total_discrepancy_minor: 0,
      status: 'settled',
      settled_at: new Date().toISOString(),
      journal_posting_id: 'JRN-7711',
    }

    const resJson = JSON.stringify(mockSuccessResponse)
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => JSON.parse(resJson),
      text: async () => resJson,
    } as Response)
    global.fetch = mockFetch

    const request = {
      document_kind: 'pos_retail_order',
      document_reference_id: 'DOC-BILL-8899',
      total_obligation_minor: '9007199254740993',
      tenders: [
        { tender_type: 'card_debit', amount_minor: '9007199254740000', reference_id: 'BCA-EDC-9901' },
        { tender_type: 'cash', amount_minor: '993' }
      ],
      idempotency_key: 'idemp-multi-tender-7711'
    } as any

    const result = await adapter.settleUniversalMultiTender(request)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const callArgs = mockFetch.mock.calls[0]
    const headers = callArgs[1]?.headers as Record<string, string>

    expect(headers['X-CBook-Authority-Context']).toBe('AUTH-CONTEXT-01')
    expect(headers['Idempotency-Key']).toBe('idemp-multi-tender-7711')
    const rawBody = callArgs[1]?.body as string
    expect(rawBody).toContain('"total_obligation_minor":9007199254740993')
    expect(rawBody).toContain('"amount_minor":9007199254740000')
    expect(rawBody).not.toContain('9007199254740992')
    expect(result.settlement_id).toBe('SETTLE-LIVE-7711')
    expect(result.status).toBe('settled')
  })

  it('should calculate wholesale volume price tier when quantity meets MOQ threshold', () => {
    const wholesaleProduct: MenuItem = {
      id: 'PRD-SYRUP-01',
      name: 'Monin Vanilla Syrup 700ml',
      category: 'Beverage Raw Material',
      hfeCategoryCode: 'RAW-SYRUP',
      price: 185000, // Retail price per bottle
      wholesalePrice: 155000, // Wholesale price if >= 6 bottles
      wholesaleMinQty: 6,
      barcode: '8991234567890',
      image: '/images/monin-vanilla.png',
      description: 'Sirup impor kualitas barista premium',
    }

    const calculateEffectivePrice = (item: MenuItem, qty: number) => {
      if (item.wholesalePrice && item.wholesaleMinQty && qty >= item.wholesaleMinQty) {
        return {
          unitPrice: item.wholesalePrice,
          total: item.wholesalePrice * qty,
          isWholesale: true,
          savings: (item.price - item.wholesalePrice) * qty
        }
      }
      return {
        unitPrice: item.price,
        total: item.price * qty,
        isWholesale: false,
        savings: 0
      }
    }

    // Case 1: Below MOQ (5 bottles) -> Standard Retail Price
    const belowMoq = calculateEffectivePrice(wholesaleProduct, 5)
    expect(belowMoq.isWholesale).toBe(false)
    expect(belowMoq.unitPrice).toBe(185000)
    expect(belowMoq.total).toBe(925000)
    expect(belowMoq.savings).toBe(0)

    // Case 2: Meets MOQ (6 bottles) -> Wholesale Price Triggered
    const meetsMoq = calculateEffectivePrice(wholesaleProduct, 6)
    expect(meetsMoq.isWholesale).toBe(true)
    expect(meetsMoq.unitPrice).toBe(155000)
    expect(meetsMoq.total).toBe(930000)
    expect(meetsMoq.savings).toBe(180000)

    // Case 3: Bulk Purchase (12 bottles) -> Wholesale Savings Multiplied
    const bulkOrder = calculateEffectivePrice(wholesaleProduct, 12)
    expect(bulkOrder.isWholesale).toBe(true)
    expect(bulkOrder.total).toBe(1860000)
    expect(bulkOrder.savings).toBe(360000)
  })
})
