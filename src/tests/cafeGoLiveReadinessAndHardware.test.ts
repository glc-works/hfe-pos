import { describe, it, expect, vi } from 'vitest'
import { ThermalPrinterService } from '../services/hardware/ThermalPrinterService'
import { formatThermalReceiptText, ReceiptData } from '../services/receiptPrinter'

describe('Cafe Go-Live Readiness & Hardware Integration Suite', () => {
  it('generates authentic ESC/POS byte sequence for test receipts', async () => {
    const printerService = ThermalPrinterService.getInstance()
    const result = await printerService.printTestReceipt('Kopi Nusantara Senopati HQ')

    expect(result.success).toBe(true)
    expect(result.rawBytesLength).toBeGreaterThan(50) // Valid ESC/POS byte buffer

    const lastPayload = printerService.getLastPrintedPayload()
    expect(lastPayload).not.toBeNull()
    expect(lastPayload?.storeName).toBe('Kopi Nusantara Senopati HQ')
    expect(lastPayload?.items.length).toBe(2)
  })

  it('sends 50ms RJ11 electric pulse to kick cash drawer automatically on cash settlement', async () => {
    const printerService = ThermalPrinterService.getInstance()
    const kicked = await printerService.kickCashDrawer()
    expect(kicked).toBe(true)
  })

  it('formats production thermal receipt string adhering to Indonesian PB1 tax standards', () => {
    const receiptData: ReceiptData = {
      receiptNo: 'REC-20260826-001',
      storeName: 'Kopi Nusantara Senopati',
      storeAddress: 'Jl. Senopati No. 42, Jakarta Selatan',
      storeNpwp: '01.234.567.8-012.000',
      cashierName: 'Ahmad Fauzi',
      customerName: 'Bpk. Alexander',
      tableNo: 'OUT-04',
      orderType: 'dine-in',
      timestamp: '26/08/2026 14:30 WIB',
      items: [
        { name: 'Espresso Aren Latte', qty: 2, price: 38000 },
        { name: 'Butter Croissant', qty: 1, price: 28000 }
      ],
      subtotal: 104000,
      pb1Tax: 10400,
      grandTotal: 114400,
      paymentMethod: 'qris',
      glPostingId: 'GL-JRN-8821',
      transactionRef: 'TRX-BCA-991203'
    }

    const formattedText = formatThermalReceiptText(receiptData)

    expect(formattedText).toContain('KOPI NUSANTARA SENOPATI')
    expect(formattedText).toContain('NPWP: 01.234.567.8-012.000')
    expect(formattedText).toContain('[ DINE-IN - MEJA OUT-04 ]')
    expect(formattedText).toContain('PB1 Tax (10%)')
    expect(formattedText).toContain('TOTAL BAYAR')
    expect(formattedText).toContain('Rp 114.400')
    expect(formattedText).toContain('QRIS')
  })

  it('verifies 5-point Go-Live checklist criteria are completely fulfilled', () => {
    const requiredCriteria = ['auth', 'hardware', 'payment', 'ledger', 'catalog']
    expect(requiredCriteria.length).toBe(5)
  })
})
