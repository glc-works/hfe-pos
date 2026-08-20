export type PaperWidth = 58 | 80

export interface ReceiptItemLine {
  name: string
  qty: number
  price: number
  total: number
}

export interface ReceiptDataPayload {
  storeName: string
  legalEntity?: string
  address?: string
  phone?: string
  receiptNumber: string
  tableName?: string
  cashierName?: string
  timestamp: string
  items: ReceiptItemLine[]
  subtotal: number
  taxPb1: number
  serviceFee?: number
  discount?: number
  total: number
  paymentMethod: string
  amountTendered?: number
  changeDue?: number
  wifiSsid?: string
  wifiPassword?: string
  footerNote?: string
}

export class EscPosEncoder {
  private buffer: number[] = []

  constructor() {
    this.initialize()
  }

  public initialize(): this {
    this.buffer.push(0x1b, 0x40) // ESC @
    return this
  }

  public align(mode: 'left' | 'center' | 'right'): this {
    const val = mode === 'center' ? 0x01 : mode === 'right' ? 0x02 : 0x00
    this.buffer.push(0x1b, 0x61, val)
    return this
  }

  public bold(enable: boolean = true): this {
    this.buffer.push(0x1b, 0x45, enable ? 0x01 : 0x00)
    return this
  }

  public doubleSize(enable: boolean = true): this {
    this.buffer.push(0x1d, 0x21, enable ? 0x11 : 0x00)
    return this
  }

  public text(str: string): this {
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      this.buffer.push(code < 128 ? code : 0x20) // standard ASCII fallback
    }
    return this
  }

  public textLine(str: string = ''): this {
    this.text(str)
    this.buffer.push(0x0a) // LF
    return this
  }

  public feed(lines: number = 1): this {
    for (let i = 0; i < lines; i++) {
      this.buffer.push(0x0a)
    }
    return this
  }

  public dashedLine(paperWidth: PaperWidth = 58): this {
    const colWidth = paperWidth === 80 ? 48 : 32
    return this.textLine('-'.repeat(colWidth))
  }

  public twoColumn(left: string, right: string, paperWidth: PaperWidth = 58): this {
    const totalCols = paperWidth === 80 ? 48 : 32
    const availableLeft = totalCols - right.length - 1
    const truncatedLeft = left.length > availableLeft ? left.substring(0, availableLeft - 1) + '…' : left
    const spacesNeeded = Math.max(1, totalCols - truncatedLeft.length - right.length)
    const line = truncatedLeft + ' '.repeat(spacesNeeded) + right
    return this.textLine(line)
  }

  public kickDrawer(): this {
    // ESC p 0 25 250 (50ms pulse to pin 2)
    this.buffer.push(0x1b, 0x70, 0x00, 0x19, 0xfa)
    return this
  }

  public cut(): this {
    this.feed(3)
    this.buffer.push(0x1d, 0x56, 0x41, 0x03) // GS V A 3 (feed and cut)
    return this
  }

  public encode(): Uint8Array {
    return new Uint8Array(this.buffer)
  }

  public encodeReceipt(data: ReceiptDataPayload, paperWidth: PaperWidth = 58): Uint8Array {
    this.initialize()

    // 1. Header (Centered)
    this.align('center')
    this.doubleSize(true).bold(true)
    this.textLine(data.storeName)
    this.doubleSize(false).bold(false)

    if (data.legalEntity) {
      this.textLine(data.legalEntity)
    }
    if (data.address) {
      this.textLine(data.address)
    }
    if (data.phone) {
      this.textLine(`Tel: ${data.phone}`)
    }

    this.dashedLine(paperWidth)

    // 2. Transaction Metadata (Left aligned)
    this.align('left')
    this.twoColumn(`Struk: ${data.receiptNumber}`, data.timestamp, paperWidth)
    if (data.tableName) {
      this.twoColumn(`Meja: ${data.tableName}`, data.cashierName ? `Kasir: ${data.cashierName}` : '', paperWidth)
    }

    this.dashedLine(paperWidth)

    // 3. Items List
    data.items.forEach((item) => {
      this.twoColumn(
        `${item.qty}x ${item.name}`,
        `Rp ${item.total.toLocaleString('id-ID')}`,
        paperWidth
      )
    })

    this.dashedLine(paperWidth)

    // 4. Totals & Tax Breakdown
    this.twoColumn('Subtotal', `Rp ${data.subtotal.toLocaleString('id-ID')}`, paperWidth)
    if (data.taxPb1 > 0) {
      this.twoColumn('Pajak Resto PB1 (10%)', `Rp ${data.taxPb1.toLocaleString('id-ID')}`, paperWidth)
    }
    if (data.serviceFee && data.serviceFee > 0) {
      this.twoColumn('Service Charge', `Rp ${data.serviceFee.toLocaleString('id-ID')}`, paperWidth)
    }
    if (data.discount && data.discount > 0) {
      this.twoColumn('Diskon / Promo', `-Rp ${data.discount.toLocaleString('id-ID')}`, paperWidth)
    }

    this.dashedLine(paperWidth)

    // Grand Total (Bold)
    this.bold(true)
    this.twoColumn('TOTAL TAGIHAN', `Rp ${data.total.toLocaleString('id-ID')}`, paperWidth)
    this.bold(false)

    // Tender Method
    this.twoColumn(`Bayar (${data.paymentMethod.toUpperCase()})`, `Rp ${(data.amountTendered || data.total).toLocaleString('id-ID')}`, paperWidth)
    if (data.changeDue !== undefined && data.changeDue > 0) {
      this.twoColumn('Kembalian', `Rp ${data.changeDue.toLocaleString('id-ID')}`, paperWidth)
    }

    this.dashedLine(paperWidth)

    // 5. WiFi Info (If available)
    if (data.wifiSsid && data.wifiPassword) {
      this.align('center')
      this.bold(true).textLine('=== AKSES WIFI OUTLET ===').bold(false)
      this.textLine(`SSID: ${data.wifiSsid}`)
      this.textLine(`Password: ${data.wifiPassword}`)
      this.feed(1)
    }

    // 6. Footer Note (Centered)
    this.align('center')
    this.textLine(data.footerNote || 'Terima kasih atas kunjungan Anda!')
    this.textLine('Powered by CORE.Hfeit Engine')

    // Kick Drawer if cash payment
    if (data.paymentMethod.toLowerCase() === 'cash' || data.paymentMethod.toLowerCase() === 'tunai') {
      this.kickDrawer()
    }

    // Cut Paper
    this.cut()

    return this.encode()
  }
}
