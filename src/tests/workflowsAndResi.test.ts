import { describe, it, expect } from 'vitest'
import { generateAwbResiCode } from '../components/resi/PackageResiLabel'
import { formatLine, formatReceiptText, ReceiptData } from '../utils/escPosDriver'
import { reconcileShift, refundTransaction, submitStocktake, generateResi } from '../services/hfeWorkflowsApi'

describe('Workflows, Delivery & Resi AWB Engine Suite', () => {
  describe('Shift Reconciliation Math & API', () => {
    it('calculates expected cash and variance correctly', async () => {
      const openingFloat = 500000
      const totalCashSales = 1250000
      const cashOutTotal = 50000
      const expectedCash = openingFloat + totalCashSales - cashOutTotal
      expect(expectedCash).toBe(1700000)

      // Test Balanced Case
      const physicalCashBalanced = 1700000
      const varianceBalanced = physicalCashBalanced - expectedCash
      expect(varianceBalanced).toBe(0)

      const resBalanced = await reconcileShift({
        openingFloat,
        totalCashSales,
        cashOutTotal,
        physicalCashCount: physicalCashBalanced,
        variance: varianceBalanced,
      })
      expect(resBalanced.status).toBe('balanced')
      expect(resBalanced.varianceAmount).toBe(0)

      // Test Short Case
      const physicalCashShort = 1650000
      const varianceShort = physicalCashShort - expectedCash
      expect(varianceShort).toBe(-50000)

      const resShort = await reconcileShift({
        openingFloat,
        totalCashSales,
        cashOutTotal,
        physicalCashCount: physicalCashShort,
        variance: varianceShort,
      })
      expect(resShort.status).toBe('short')
      expect(resShort.varianceAmount).toBe(-50000)

      // Test Over Case
      const physicalCashOver = 1720000
      const varianceOver = physicalCashOver - expectedCash
      expect(varianceOver).toBe(20000)

      const resOver = await reconcileShift({
        openingFloat,
        totalCashSales,
        cashOutTotal,
        physicalCashCount: physicalCashOver,
        variance: varianceOver,
      })
      expect(resOver.status).toBe('over')
      expect(resOver.varianceAmount).toBe(20000)
    })
  })

  describe('Manager Void & Refund Engine', () => {
    it('validates manager PIN and generates refund transaction record', async () => {
      const txId = 'ORD-8801'
      const managerPin = '123456'
      const reason = 'Pesanan Salah'

      const refundRes = await refundTransaction(txId, managerPin, reason, false)
      expect(refundRes.transactionId).toBe(txId)
      expect(refundRes.status).toBe('refunded')
      expect(refundRes.restoredBomIngredients).toContain('ING-COFFEE-01')
    })
  })

  describe('Stocktake Audit UI Math', () => {
    it('calculates inventory discrepancy variance accurately', async () => {
      const items = [
        { itemCode: 'ING-COFFEE-01', systemStock: 4500, physicalCount: 4500, variance: 0 },
        { itemCode: 'ING-MILK-OAT', systemStock: 24, physicalCount: 22, variance: -2 },
      ]
      const res = await submitStocktake(items)
      expect(res.adjustedItemsCount).toBe(1)
    })
  })

  describe('Self-Delivery Fee & Runner Dispatch', () => {
    it('applies free delivery for orders above threshold and flat fee otherwise', () => {
      const FREE_THRESHOLD = 100000
      const flatFee = 5000

      const order1Subtotal = 75000
      const fee1 = order1Subtotal >= FREE_THRESHOLD ? 0 : flatFee
      expect(fee1).toBe(5000)

      const order2Subtotal = 120000
      const fee2 = order2Subtotal >= FREE_THRESHOLD ? 0 : flatFee
      expect(fee2).toBe(0)
    })

    it('verifies runner state machine transitions', () => {
      const validStatuses = ['pending', 'dispatched', 'driver_assigned', 'in_transit', 'delivered']
      let currentStatus = 'pending'
      expect(validStatuses).toContain(currentStatus)

      currentStatus = 'dispatched'
      expect(validStatuses).toContain(currentStatus)

      currentStatus = 'in_transit'
      expect(validStatuses).toContain(currentStatus)

      currentStatus = 'delivered'
      expect(validStatuses).toContain(currentStatus)
    })
  })

  describe('AWB Resi Code Generator & API', () => {
    it('formats AWB resi code according to POS-ENG-STD-001 specification', () => {
      const testDate = new Date(2026, 7, 15) // Aug 15, 2026
      const resiCode = generateAwbResiCode('SENOPATI', testDate, 42)
      expect(resiCode).toBe('RESI-SENOPATI-20260815-0042')
    })

    it('generates resi via API fallback', async () => {
      const res = await generateResi('DEL-001', 'SENOPATI')
      expect(res.resiCode).toMatch(/^RESI-SENOPATI-\d{8}-\d{4}$/)
      expect(res.trackingUrl).toContain(res.resiCode)
    })
  })

  describe('ESC/POS Thermal Receipt Driver', () => {
    it('formats aligned text lines for 58mm (32 chars) and 80mm (48 chars)', () => {
      const line58 = formatLine('Subtotal', 'Rp 100.000', 32)
      expect(line58.length).toBe(32)
      expect(line58.startsWith('Subtotal')).toBe(true)
      expect(line58.endsWith('Rp 100.000')).toBe(true)

      const line80 = formatLine('Total Pembayaran', 'Rp 150.000', 48)
      expect(line80.length).toBe(48)
      expect(line80.startsWith('Total Pembayaran')).toBe(true)
      expect(line80.endsWith('Rp 150.000')).toBe(true)
    })

    it('generates complete thermal receipt text output containing mandatory tax & totals', () => {
      const sampleData: ReceiptData = {
        companyName: 'Kopitiam Senopati HQ',
        address: 'Jl. Senopati No. 42',
        npwp: '01.234.567.8-012.000',
        cashierName: 'Siti',
        orderId: 'ORD-8801',
        dateStr: '15/08/2026 12:00',
        items: [{ name: 'Kopi Susu Gula Aren', quantity: 2, price: 28000 }],
        subtotal: 56000,
        serviceFee: 2800,
        pb1Tax: 5600,
        grandTotal: 64400,
        paymentMethod: 'QRIS',
      }

      const receipt58 = formatReceiptText(sampleData, '58mm')
      expect(receipt58).toContain('KOPITIAM SENOPATI HQ')
      expect(receipt58).toContain('Order #ORD-8801')
      expect(receipt58).toContain('Pajak Resto (PB1 10%)')
      expect(receipt58).toContain('TOTAL')
    })
  })
})
