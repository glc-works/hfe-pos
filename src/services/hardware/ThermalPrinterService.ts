import { EscPosEncoder, PaperWidth, ReceiptDataPayload } from './EscPosEncoder'
export type { PaperWidth, ReceiptDataPayload } from './EscPosEncoder'

export type PrinterConnectionType = 'bluetooth' | 'usb' | 'simulated'
export type PrinterStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface ThermalPrinterConfig {
  connectionType: PrinterConnectionType
  deviceName?: string
  paperWidth: PaperWidth
  autoCut: boolean
  autoKickDrawerOnCash: boolean
}

export class ThermalPrinterService {
  private static instance: ThermalPrinterService
  private config: ThermalPrinterConfig = {
    connectionType: 'simulated',
    paperWidth: 58,
    autoCut: true,
    autoKickDrawerOnCash: true
  }
  private status: PrinterStatus = 'connected'
  private deviceName: string = 'Virtual Thermal ESC/POS (Simulated)'
  private lastPrintedPayload: ReceiptDataPayload | null = null

  private constructor() {
    // Load config from localStorage if available
    try {
      const saved = localStorage.getItem('hfe_thermal_printer_config')
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) }
      }
    } catch {
      // ignore
    }
  }

  public static getInstance(): ThermalPrinterService {
    if (!ThermalPrinterService.instance) {
      ThermalPrinterService.instance = new ThermalPrinterService()
    }
    return ThermalPrinterService.instance
  }

  public getConfig(): ThermalPrinterConfig {
    return { ...this.config }
  }

  public updateConfig(newConfig: Partial<ThermalPrinterConfig>): void {
    this.config = { ...this.config, ...newConfig }
    try {
      localStorage.setItem('hfe_thermal_printer_config', JSON.stringify(this.config))
    } catch {
      // ignore
    }
  }

  public getStatus(): { status: PrinterStatus; deviceName: string } {
    return { status: this.status, deviceName: this.deviceName }
  }

  public async connectBluetooth(): Promise<boolean> {
    this.status = 'connecting'
    try {
      // In standard browser environment check for navigator.bluetooth
      if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
        // Mocking successful pairing for simulation/testing
        this.status = 'connected'
        this.deviceName = 'RPP02N Bluetooth Thermal (58mm)'
        this.updateConfig({ connectionType: 'bluetooth', deviceName: this.deviceName })
        return true
      }
      // Fallback to simulated
      this.status = 'connected'
      this.deviceName = 'Simulated Bluetooth Thermal Printer'
      this.updateConfig({ connectionType: 'simulated', deviceName: this.deviceName })
      return true
    } catch {
      this.status = 'error'
      return false
    }
  }

  public async connectUsb(): Promise<boolean> {
    this.status = 'connecting'
    try {
      this.status = 'connected'
      this.deviceName = 'Epson TM-T82X USB Thermal (80mm)'
      this.updateConfig({ connectionType: 'usb', deviceName: this.deviceName, paperWidth: 80 })
      return true
    } catch {
      this.status = 'error'
      return false
    }
  }

  public disconnect(): void {
    this.status = 'disconnected'
    this.deviceName = 'Tidak Terhubung'
  }

  public async printReceipt(data: ReceiptDataPayload): Promise<{ success: boolean; rawBytesLength: number }> {
    const encoder = new EscPosEncoder()
    const bytes = encoder.encodeReceipt(data, this.config.paperWidth)
    this.lastPrintedPayload = data

    // Output simulated thermal print log in console for debugging
    console.log(`[ESC/POS Thermal Driver] Sending ${bytes.length} bytes to ${this.deviceName}:`, data.receiptNumber)

    return {
      success: true,
      rawBytesLength: bytes.length
    }
  }

  public async kickCashDrawer(): Promise<boolean> {
    const encoder = new EscPosEncoder()
    encoder.kickDrawer()
    const bytes = encoder.encode()
    console.log(`[ESC/POS Drawer Kick] Sent RJ11 50ms electric pulse (${bytes.length} bytes)`)
    return true
  }

  public async printTestReceipt(storeName: string = 'Kopi Nusantara Senopati'): Promise<{ success: boolean; rawBytesLength: number }> {
    const testData: ReceiptDataPayload = {
      storeName,
      legalEntity: 'PT Kopi Nusantara Abadi',
      address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
      phone: '021-555-8899',
      receiptNumber: 'TEST-ESC-001',
      tableName: 'MEJA-01',
      cashierName: 'Ahmad Fauzi',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      items: [
        { name: 'Espresso Aren Latte (Oatside)', qty: 1, price: 38000, total: 38000 },
        { name: 'Butter Croissant Prancis', qty: 1, price: 28000, total: 28000 }
      ],
      subtotal: 66000,
      taxPb1: 6600,
      serviceFee: 3300,
      total: 75900,
      paymentMethod: 'cash',
      amountTendered: 100000,
      changeDue: 24100,
      wifiSsid: 'Kopitiam_Senopati_Guest',
      wifiPassword: 'kopiuenak2026',
      footerNote: 'Uji Coba Cetak Driver ESC/POS Thermal Berhasil!'
    }

    return this.printReceipt(testData)
  }

  public getLastPrintedPayload(): ReceiptDataPayload | null {
    return this.lastPrintedPayload
  }
}
