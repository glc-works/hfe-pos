// --- ESC/POS THERMAL RECEIPT DRIVER (58MM / 80MM) ---

export interface ReceiptItem {
  name: string
  quantity: number
  price: number
}

export interface ReceiptData {
  companyName: string
  address: string
  npwp: string
  cashierName: string
  orderId: string
  dateStr: string
  items: ReceiptItem[]
  subtotal: number
  serviceFee: number
  pb1Tax: number
  grandTotal: number
  paymentMethod: string
  cashGiven?: number
  changeDue?: number
  qrisRef?: string
}

export const ESC_COMMANDS = {
  INIT: '\x1B\x40',
  ALIGN_LEFT: '\x1B\x61\x00',
  ALIGN_CENTER: '\x1B\x61\x01',
  ALIGN_RIGHT: '\x1B\x61\x02',
  TEXT_BOLD_ON: '\x1B\x45\x01',
  TEXT_BOLD_OFF: '\x1B\x45\x00',
  CUT_PAPER: '\x1D\x56\x41\x03',
}

export function formatLine(left: string, right: string, width: number = 32): string {
  const availableSpace = width - left.length - right.length
  if (availableSpace <= 0) {
    return left.slice(0, width - right.length - 1) + ' ' + right
  }
  return left + ' '.repeat(availableSpace) + right
}

export function formatReceiptText(data: ReceiptData, paperWidth: '58mm' | '80mm' = '58mm'): string {
  const width = paperWidth === '58mm' ? 32 : 48
  const separator = '-'.repeat(width)
  const doubleSeparator = '='.repeat(width)

  const lines: string[] = []

  // HEADER
  lines.push(data.companyName.toUpperCase().padStart(Math.floor((width + data.companyName.length) / 2)))
  lines.push(data.address.padStart(Math.floor((width + data.address.length) / 2)))
  if (data.npwp) {
    lines.push(`NPWP: ${data.npwp}`.padStart(Math.floor((width + 6 + data.npwp.length) / 2)))
  }
  lines.push(separator)

  // META
  lines.push(formatLine(`Order #${data.orderId}`, data.dateStr, width))
  lines.push(formatLine(`Kasir: ${data.cashierName}`, `Bayar: ${data.paymentMethod}`, width))
  lines.push(separator)

  // ITEMS
  data.items.forEach((item) => {
    lines.push(item.name)
    const qtyPriceStr = `${item.quantity} x ${item.price.toLocaleString('id-ID')}`
    const totalStr = (item.quantity * item.price).toLocaleString('id-ID')
    lines.push(formatLine(`  ${qtyPriceStr}`, totalStr, width))
  })
  lines.push(separator)

  // TOTALS
  lines.push(formatLine('Subtotal', `Rp ${data.subtotal.toLocaleString('id-ID')}`, width))
  if (data.serviceFee > 0) {
    lines.push(formatLine('Service Fee (5%)', `Rp ${data.serviceFee.toLocaleString('id-ID')}`, width))
  }
  if (data.pb1Tax > 0) {
    lines.push(formatLine('Pajak Resto (PB1 10%)', `Rp ${data.pb1Tax.toLocaleString('id-ID')}`, width))
  }
  lines.push(doubleSeparator)
  lines.push(formatLine('TOTAL', `Rp ${data.grandTotal.toLocaleString('id-ID')}`, width))

  if (data.cashGiven !== undefined && data.changeDue !== undefined) {
    lines.push(formatLine('Tunai Diterima', `Rp ${data.cashGiven.toLocaleString('id-ID')}`, width))
    lines.push(formatLine('Kembalian', `Rp ${data.changeDue.toLocaleString('id-ID')}`, width))
  }
  if (data.qrisRef) {
    lines.push(formatLine('NMID QRIS', data.qrisRef, width))
  }

  lines.push(separator)
  lines.push('Terima Kasih Atas Kunjungan Anda!'.padStart(Math.floor((width + 32) / 2)))
  lines.push('Powered by Hfe POS & Commerce'.padStart(Math.floor((width + 29) / 2)))
  lines.push('\n\n')

  return lines.join('\n')
}

export function generateEscPosBuffer(data: ReceiptData, paperWidth: '58mm' | '80mm' = '58mm'): Uint8Array {
  const textContent = formatReceiptText(data, paperWidth)
  const fullContent = ESC_COMMANDS.INIT + ESC_COMMANDS.ALIGN_LEFT + textContent + ESC_COMMANDS.CUT_PAPER
  const encoder = new TextEncoder()
  return encoder.encode(fullContent)
}

export async function connectBluetoothPrinter(): Promise<any> {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null
  if (!nav || !nav.bluetooth) {
    console.warn('[EscPosDriver] WebBluetooth tidak didukung di browser ini.')
    return null
  }
  try {
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
    })
    return device
  } catch (err) {
    console.warn('[EscPosDriver] Koneksi Bluetooth dibatalkan:', err)
    return null
  }
}

export async function connectUsbPrinter(): Promise<any> {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null
  if (!nav || !nav.usb) {
    console.warn('[EscPosDriver] WebUSB tidak didukung di browser ini.')
    return null
  }
  try {
    const device = await nav.usb.requestDevice({ filters: [] })
    return device
  } catch (err) {
    console.warn('[EscPosDriver] Koneksi USB dibatalkan:', err)
    return null
  }
}
