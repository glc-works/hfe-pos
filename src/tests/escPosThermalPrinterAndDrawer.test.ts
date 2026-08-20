import { describe, it, expect } from 'vitest'
import { EscPosEncoder, ReceiptDataPayload } from '../services/hardware/EscPosEncoder'
import { ThermalPrinterService } from '../services/hardware/ThermalPrinterService'

describe('L2-POS-88: Direct ESC/POS Thermal Printer & Cash Drawer Driver', () => {
  it('should initialize ESC/POS buffer with standard ESC @ command', () => {
    const encoder = new EscPosEncoder()
    const bytes = encoder.encode()

    expect(bytes.length).toBeGreaterThanOrEqual(2)
    expect(bytes[0]).toBe(0x1b) // ESC
    expect(bytes[1]).toBe(0x40) // @
  })

  it('should correctly encode text alignment and styling commands', () => {
    const encoder = new EscPosEncoder()
    encoder.align('center').bold(true).text('WARUNG KOPI').bold(false).align('left')
    const bytes = encoder.encode()

    // Check center align command (ESC a 1)
    expect(bytes).toContain(0x61)
    // Check bold on command (ESC E 1)
    expect(bytes).toContain(0x45)
  })

  it('should format two-column key-value rows according to 58mm (32 cols) and 80mm (48 cols)', () => {
    const encoder58 = new EscPosEncoder()
    encoder58.twoColumn('1x Latte', 'Rp 35.000', 58)
    const bytes58 = encoder58.encode()
    expect(bytes58.length).toBeGreaterThan(10)

    const encoder80 = new EscPosEncoder()
    encoder80.twoColumn('1x Japanese Drip V60 Gayo Organic', 'Rp 45.000', 80)
    const bytes80 = encoder80.encode()
    expect(bytes80.length).toBeGreaterThan(15)
  })

  it('should append 50ms electric pulse sequence for RJ11 cash drawer kick', () => {
    const encoder = new EscPosEncoder()
    encoder.kickDrawer()
    const bytes = encoder.encode()

    // ESC p 0 25 250
    const kickPattern = [0x1b, 0x70, 0x00, 0x19, 0xfa]
    let foundKick = false

    for (let i = 0; i <= bytes.length - kickPattern.length; i++) {
      if (
        bytes[i] === kickPattern[0] &&
        bytes[i + 1] === kickPattern[1] &&
        bytes[i + 2] === kickPattern[2] &&
        bytes[i + 3] === kickPattern[3] &&
        bytes[i + 4] === kickPattern[4]
      ) {
        foundKick = true
        break
      }
    }

    expect(foundKick).toBe(true)
  })

  it('should encode full receipt with PB1 tax, WiFi credentials, and auto-cutter', () => {
    const payload: ReceiptDataPayload = {
      storeName: 'Kopi Nusantara Senopati',
      legalEntity: 'PT Kopi Nusantara Abadi',
      receiptNumber: 'INV-20260820-001',
      tableName: 'MEJA-04',
      cashierName: 'Ahmad Fauzi',
      timestamp: '15:30 WIB',
      items: [
        { name: 'Espresso Aren Latte', qty: 2, price: 38000, total: 76000 },
        { name: 'Butter Croissant', qty: 1, price: 28000, total: 28000 }
      ],
      subtotal: 104000,
      taxPb1: 10400,
      serviceFee: 5200,
      total: 119600,
      paymentMethod: 'cash',
      amountTendered: 150000,
      changeDue: 30400,
      wifiSsid: 'Kopitiam_Senopati_Guest',
      wifiPassword: 'kopiuenak2026',
      footerNote: 'Terima kasih atas kunjungan Anda!'
    }

    const encoder = new EscPosEncoder()
    const rawBytes = encoder.encodeReceipt(payload, 58)

    expect(rawBytes.length).toBeGreaterThan(100)
    // Check auto-cut command at the end (GS V A 3)
    const lastBytes = Array.from(rawBytes.slice(-4))
    expect(lastBytes).toEqual([0x1d, 0x56, 0x41, 0x03])
  })

  it('should manage ThermalPrinterService singleton, connection, and test prints', async () => {
    const service = ThermalPrinterService.getInstance()
    expect(service).toBeDefined()

    // Config updates
    service.updateConfig({ paperWidth: 80, autoCut: true })
    expect(service.getConfig().paperWidth).toBe(80)

    // Connect Bluetooth
    const btResult = await service.connectBluetooth()
    expect(btResult).toBe(true)
    expect(service.getStatus().status).toBe('connected')

    // Connect USB
    const usbResult = await service.connectUsb()
    expect(usbResult).toBe(true)
    expect(service.getStatus().deviceName).toContain('Epson')

    // Test print
    const printResult = await service.printTestReceipt('Senopati Resto')
    expect(printResult.success).toBe(true)
    expect(printResult.rawBytesLength).toBeGreaterThan(50)

    // Cash drawer kick test
    const drawerResult = await service.kickCashDrawer()
    expect(drawerResult).toBe(true)
  })
})
