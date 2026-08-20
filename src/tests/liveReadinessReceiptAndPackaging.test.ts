import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatThermalReceiptText, ReceiptData } from '../services/receiptPrinter'
import { EscPosEncoder, ReceiptDataPayload } from '../services/hardware/EscPosEncoder'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'

describe('Production Live-Readiness: Receipt Formatting & Offline Queue Resilience', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. Thermal Receipt Formatting (Fulfillment Modes, Packaging Fee, GL Post ID, Ref No)', () => {
    it('formats Dine-In thermal receipt with table badge and GL posting ID', () => {
      const dineInReceipt: ReceiptData = {
        receiptNo: 'REC-2026-DIN-001',
        storeName: 'Kopi Nusantara Senopati',
        storeAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
        storeNpwp: '01.234.567.8-012.000',
        cashierName: 'Ahmad Fauzi',
        customerName: 'Bpk. Alexander',
        tableNo: 'OUT-04',
        orderType: 'dine-in',
        timestamp: '2026-08-20 14:15 WIB',
        items: [
          { name: 'Espresso Aren Latte', qty: 2, price: 35000 },
          { name: 'Butter Croissant', qty: 1, price: 28000 }
        ],
        subtotal: 98000,
        pb1Tax: 9800,
        serviceCharge: 4900,
        grandTotal: 112700,
        paymentMethod: 'qris',
        glPostingId: 'GL-POST-2026-0820-9941',
        transactionRef: 'TXR-SEN-882190',
        sha256Hash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890'
      }

      const receiptText = formatThermalReceiptText(dineInReceipt)

      // Assert fulfillment banner
      expect(receiptText).toContain('[ DINE-IN - MEJA OUT-04 ]')
      // Assert metadata & transaction ref
      expect(receiptText).toContain('No. Struk : REC-2026-DIN-001')
      expect(receiptText).toContain('Ref Trans : TXR-SEN-882190')
      expect(receiptText).toContain('Kasir     : Ahmad Fauzi')
      expect(receiptText).toContain('Tamu      : Bpk. Alexander')
      // Assert items & charges
      expect(receiptText).toContain('Espresso Aren Latte x2')
      expect(receiptText).toContain('Subtotal')
      expect(receiptText).toContain('PB1 Tax (10%)')
      expect(receiptText).toContain('Service Fee')
      // Assert GL posting ID and SHA256 verification
      expect(receiptText).toContain('GL Post ID: GL-POST-2026-0820-9941')
      expect(receiptText).toContain('HCB Verify: a1b2c3d4e5f67890...')
    })

    it('formats Takeaway thermal receipt with Queue #08 and Takeaway Packaging Fee', () => {
      const takeawayReceipt: ReceiptData = {
        receiptNo: 'REC-2026-TKW-008',
        storeName: 'Kopi Nusantara Senopati',
        storeAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
        cashierName: 'Siti Rahma',
        customerName: 'Ibu Ratna',
        queueNo: '08',
        orderType: 'takeaway',
        timestamp: '2026-08-20 15:30 WIB',
        items: [
          { name: 'Iced Matcha Latte', qty: 2, price: 38000 },
          { name: 'Bagel Cream Cheese', qty: 2, price: 32000 }
        ],
        subtotal: 140000,
        pb1Tax: 14000,
        packagingFee: 4000, // Packaging Fee for Takeaway
        grandTotal: 158000,
        paymentMethod: 'cash',
        cashGiven: 200000,
        changeReturned: 42000,
        glPostingId: 'GL-POST-TKW-7782',
        transactionRef: 'TXR-TKW-00994'
      }

      const receiptText = formatThermalReceiptText(takeawayReceipt)

      // Assert fulfillment banner
      expect(receiptText).toContain('[ TAKEAWAY - ANTREAN #08 ]')
      expect(receiptText).toContain('No. Struk : REC-2026-TKW-008')
      expect(receiptText).toContain('Ref Trans : TXR-TKW-00994')
      // Assert packaging fee line is rendered
      expect(receiptText).toContain('Biaya Kemasan')
      expect(receiptText).toContain('Rp 4.000')
      // Assert cash tender & change
      expect(receiptText).toContain('Tunai Diterima: Rp 200.000')
      expect(receiptText).toContain('Kembalian     : Rp 42.000')
      expect(receiptText).toContain('GL Post ID: GL-POST-TKW-7782')
    })

    it('formats Delivery thermal receipt banner', () => {
      const deliveryReceipt: ReceiptData = {
        receiptNo: 'REC-2026-DEL-012',
        storeName: 'Kopi Nusantara Senopati',
        storeAddress: 'Jl. Senopati No. 45',
        cashierName: 'Budi',
        orderType: 'delivery',
        timestamp: '2026-08-20 16:00 WIB',
        items: [{ name: 'Cold Brew 1L', qty: 1, price: 95000 }],
        subtotal: 95000,
        pb1Tax: 9500,
        packagingFee: 5000,
        grandTotal: 109500,
        paymentMethod: 'qris'
      }

      const receiptText = formatThermalReceiptText(deliveryReceipt)
      expect(receiptText).toContain('[ DELIVERY ]')
      expect(receiptText).toContain('Biaya Kemasan')
      expect(receiptText).toContain('Rp 5.000')
    })
  })

  describe('2. ESC/POS Binary Encoder Hardware Readiness', () => {
    it('encodes full receipt data payload with packaging fee and GL posting ID into ESC/POS byte buffer', () => {
      const encoder = new EscPosEncoder()
      const payload: ReceiptDataPayload = {
        storeName: 'Kopi Nusantara Senopati',
        legalEntity: 'PT Kopi Nusantara Abadi',
        address: 'Jl. Senopati No. 45',
        phone: '021-5558899',
        receiptNumber: 'ESC-REC-901',
        tableName: 'OUT-04',
        orderType: 'dine-in',
        cashierName: 'Ahmad',
        timestamp: '20:00 WIB',
        items: [{ name: 'Arabica Beans 250g', qty: 1, price: 85000, total: 85000 }],
        subtotal: 85000,
        taxPb1: 8500,
        packagingFee: 2000,
        total: 95500,
        paymentMethod: 'cash',
        amountTendered: 100000,
        changeDue: 4500,
        glPostingId: 'GL-POST-9912',
        transactionRef: 'REF-TX-771'
      }

      const bytes = encoder.encodeReceipt(payload, 58)
      expect(bytes).toBeInstanceOf(Uint8Array)
      expect(bytes.length).toBeGreaterThan(50)

      // Convert bytes to string for text assertion
      const decodedString = new TextDecoder('latin1').decode(bytes)
      expect(decodedString).toContain('Kopi Nusantara Senopati')
      expect(decodedString).toContain('[ DINE-IN - MEJA OUT-04 ]')
      expect(decodedString).toContain('ESC-REC-901')
      expect(decodedString).toContain('REF-TX-771')
      expect(decodedString).toContain('Biaya Kemasan')
      expect(decodedString).toContain('GL-POST-9912')
    })
  })

  describe('3. OfflineIntentQueue & Fail-Closed Durability', () => {
    const mockPayload: SubmitRetailTransactionPayload = {
      table_id: 'OUT-04',
      contact_id: 'CUST-01',
      policy: 'pay-first',
      payment_method: 'cash',
      items: [
        { product_id: 'SKU-01', hfe_gl_account: '4101-BEV', name: 'Latte', qty: 1, price: 35000 }
      ],
      subtotal: 35000,
      tax_pb1_amount: 3500,
      service_fee_amount: 0,
      discount_amount: 0,
      grand_total: 38500,
      cashier_id: 'CASHIER-01',
      branch_id: 'BRANCH-HQ',
      cost_center_id: 'CC-FNB'
    }

    it('enqueues financial intent with SHA-256 checksum and fail-closed bookId guard', async () => {
      const queue = new OfflineIntentQueue()

      // Empty bookId fails closed
      await expect(queue.enqueueIntent(mockPayload, '')).rejects.toThrow(
        /companyBookId is required for ledger mutations/
      )

      // Valid bookId succeeds
      const intent = await queue.enqueueIntent(mockPayload, 'BOOK-SENOPATI-01')
      expect(intent.bookId).toBe('BOOK-SENOPATI-01')
      expect(intent.status).toBe('pending_sync')
      expect(intent.idempotencyKey).toBeDefined()
      expect(intent.checksum).toBeDefined()
      expect(intent.checksum.length).toBe(64) // SHA-256 length

      const pending = await queue.getPendingIntents()
      expect(pending.length).toBeGreaterThanOrEqual(1)
      expect(pending.some((i) => i.idempotencyKey === intent.idempotencyKey)).toBe(true)
    })

    it('transitions intent status through syncing, failed, and removal lifecycles', async () => {
      const queue = new OfflineIntentQueue()
      const intent = await queue.enqueueIntent(mockPayload, 'BOOK-SENOPATI-01')

      // Mark syncing
      await queue.markIntentSyncing(intent.idempotencyKey)
      let stored = await queue.getIntent(intent.idempotencyKey)
      expect(stored?.status).toBe('syncing')
      expect(stored?.retryCount).toBe(1)

      // Mark failed
      await queue.markIntentFailed(intent.idempotencyKey, 'Network 503 Service Unavailable')
      stored = await queue.getIntent(intent.idempotencyKey)
      expect(stored?.status).toBe('failed')
      expect(stored?.lastError).toContain('Network 503')

      // Remove after sync resolution
      await queue.removeIntent(intent.idempotencyKey)
      stored = await queue.getIntent(intent.idempotencyKey)
      expect(stored).toBeNull()
    })
  })
})
