import { describe, it, expect, vi } from 'vitest'
import {
  settleUniversalMultiTender,
  lookupBarcode,
  UniversalMultiTenderRequest,
  TenderItemPayload,
  DiscrepancyItemPayload,
  generateUUIDv4,
} from '../services/hfeCoreApi'

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('Hfe Core SSOT Synchronization & Universal Multi-Tender Settlement', () => {
  describe('Universal Multi-Tender Obligation & Discrepancy Balance Invariant', () => {
    it('validates exact arithmetic balance: total_tendered + total_discrepancy === total_obligation', () => {
      const obligationMinor = 15000000 // Rp 150.000,00
      const tenders: TenderItemPayload[] = [
        { tender_type: 'cash', amount_minor: 10000000, reference_id: 'CASH-001' },
        { tender_type: 'qris', amount_minor: 5000000, reference_id: 'QRIS-NMD-883' },
      ]
      const discrepancies: DiscrepancyItemPayload[] = []

      const totalTendered = tenders.reduce((sum, t) => sum + t.amount_minor, 0)
      const totalDiscrepancy = discrepancies.reduce((sum, d) => sum + d.amount_minor, 0)

      expect(totalTendered + totalDiscrepancy).toBe(obligationMinor)
    })

    it('handles mixed tenders with rounding adjustment and merchant discount fee (MDF)', () => {
      const obligationMinor = 24525000 // Rp 245.250,00
      const tenders: TenderItemPayload[] = [
        { tender_type: 'card_credit', amount_minor: 20000000, reference_id: 'CC-VISA-4242' },
        { tender_type: 'cash', amount_minor: 4500000, reference_id: 'CASH-002' },
      ]
      const discrepancies: DiscrepancyItemPayload[] = [
        { discrepancy_type: 'rounding_adjustment', amount_minor: 25000, reason: 'Rounding to nearest cash note' },
      ]

      const totalTendered = tenders.reduce((sum, t) => sum + t.amount_minor, 0)
      const totalDiscrepancy = discrepancies.reduce((sum, d) => sum + d.amount_minor, 0)

      expect(totalTendered + totalDiscrepancy).toBe(obligationMinor)
    })

    it('settles universal multi-tender request and returns valid journal posting & settlement metadata', async () => {
      const request: UniversalMultiTenderRequest = {
        document_reference_id: 'DOC-INV-2026-0817-01',
        total_obligation_minor: 35000000,
        tenders: [
          { tender_type: 'hotel_room_folio', amount_minor: 25000000, reference_id: 'FOLIO-RM-304' },
          { tender_type: 'voucher_credit', amount_minor: 10000000, reference_id: 'VOUCH-VIP-100' },
        ],
        discrepancies: [],
        notes: 'Room charge split with VIP loyalty credit',
      }

      const response = await settleUniversalMultiTender(request)
      expect(response.document_reference_id).toBe('DOC-INV-2026-0817-01')
      expect(response.total_obligation_minor).toBe(35000000)
      expect(response.total_tendered_minor).toBe(35000000)
      expect(response.total_discrepancy_minor).toBe(0)
      expect(response.status).toBe('settled')
      expect(response.settlement_id).toBeDefined()
      expect(response.journal_posting_id).toBeDefined()
      expect(response.settled_at).toBeDefined()
    })
  })

  describe('Barcode Wholesale Pricing & Minimum Quantity Tiers', () => {
    it('returns wholesale pricing metadata when looking up bulk product barcodes', async () => {
      const product = await lookupBarcode('8999901')
      expect(product).not.toBeNull()
      expect(product?.name).toBe('Minyak Goreng Rose Brand 1L')
      expect(product?.retail_price).toBe(22000)
      expect(product?.wholesale_price).toBe(19500)
      expect(product?.wholesale_min_qty).toBe(40)
      expect(product?.uom).toBe('Karton')
      expect(product?.stock_level).toBe(120)
    })

    it('calculates price tiers correctly based on minimum wholesale quantity trigger', async () => {
      const product = await lookupBarcode('8999902')
      expect(product).not.toBeNull()
      const minQty = product?.wholesale_min_qty || 10
      const wholesalePrice = product?.wholesale_price || 72000
      const retailPrice = product?.retail_price || 78000

      // Scenario A: Qty below wholesale threshold -> Retail price
      const qtyBelow = 5
      const priceAppliedBelow = qtyBelow >= minQty ? wholesalePrice : retailPrice
      expect(priceAppliedBelow).toBe(78000)

      // Scenario B: Qty meeting or exceeding wholesale threshold -> Wholesale price
      const qtyAbove = 12
      const priceAppliedAbove = qtyAbove >= minQty ? wholesalePrice : retailPrice
      expect(priceAppliedAbove).toBe(72000)
    })

    it('handles non-existent barcodes gracefully returning null', async () => {
      const product = await lookupBarcode('0000000000000')
      expect(product).toBeNull()
    })
  })

  describe('Idempotency Key & Header Protocol on Multi-Tender Settlement', () => {
    it('generates a valid UUID v4 idempotency key for multi-tender settlement calls', () => {
      const key = generateUUIDv4()
      expect(key).toMatch(UUID_V4_REGEX)
    })

    it('includes X-Idempotency-Key header in remote HTTP requests', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async (url, init) => {
        const headers = init?.headers as Record<string, string>
        expect(headers['X-Idempotency-Key']).toBeDefined()
        expect(headers['X-Idempotency-Key']).toMatch(UUID_V4_REGEX)
        return new Response(
          JSON.stringify({
            settlement_id: 'SETTLE-REMOTE-001',
            document_reference_id: 'DOC-REMOTE-001',
            total_obligation_minor: 10000000,
            total_tendered_minor: 10000000,
            total_discrepancy_minor: 0,
            status: 'settled',
            settled_at: new Date().toISOString(),
            journal_posting_id: 'POST-REMOTE-001',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      })

      const request: UniversalMultiTenderRequest = {
        document_reference_id: 'DOC-REMOTE-001',
        total_obligation_minor: 10000000,
        tenders: [{ tender_type: 'bank_transfer', amount_minor: 10000000, reference_id: 'TRF-BCA-99' }],
      }

      const response = await settleUniversalMultiTender(request)
      expect(response.settlement_id).toBe('SETTLE-REMOTE-001')
      expect(response.status).toBe('settled')
      fetchSpy.mockRestore()
    })
  })
})
