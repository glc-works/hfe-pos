// Thermal Receipt Print & E-Receipt Generator Service for hfe-pos

export interface ReceiptData {
  receiptNo: string
  storeName: string
  storeAddress: string
  storeNpwp?: string
  cashierName: string
  customerName?: string
  tableNo?: string
  orderType: 'dine-in' | 'takeaway' | 'delivery'
  timestamp: string
  items: Array<{ name: string; qty: number; price: number }>
  subtotal: number
  pb1Tax: number
  serviceCharge?: number
  grandTotal: number
  paymentMethod: 'cash' | 'qris' | 'card' | 'kasbon'
  cashGiven?: number
  changeReturned?: number
  sha256Hash?: string
}

export function formatThermalReceiptText(data: ReceiptData): string {
  const line = '--------------------------------'
  const doubleLine = '================================'

  let text = ''
  text += `${centerText(data.storeName.toUpperCase())}\n`
  text += `${centerText(data.storeAddress)}\n`
  if (data.storeNpwp) text += `${centerText(`NPWP: ${data.storeNpwp}`)}\n`
  text += `${doubleLine}\n`
  text += `No. Struk : ${data.receiptNo}\n`
  text += `Tgl/Waktu : ${data.timestamp}\n`
  text += `Kasir     : ${data.cashierName}\n`
  text += `Tamu      : ${data.customerName || 'Tamu Umum'}\n`
  text += `Tipe/Meja : ${data.orderType.toUpperCase()} ${data.tableNo ? `(${data.tableNo})` : ''}\n`
  text += `${line}\n`

  data.items.forEach((item) => {
    const itemLine = `${item.name} x${item.qty}`
    const priceLine = `Rp ${(item.price * item.qty).toLocaleString('id-ID')}`
    text += `${padRight(itemLine, 20)}${padLeft(priceLine, 12)}\n`
  })

  text += `${line}\n`
  text += `${padRight('Subtotal', 20)}${padLeft(`Rp ${data.subtotal.toLocaleString('id-ID')}`, 12)}\n`
  text += `${padRight('PB1 Tax (10%)', 20)}${padLeft(`Rp ${data.pb1Tax.toLocaleString('id-ID')}`, 12)}\n`
  if (data.serviceCharge) {
    text += `${padRight('Service Fee', 20)}${padLeft(`Rp ${data.serviceCharge.toLocaleString('id-ID')}`, 12)}\n`
  }
  text += `${doubleLine}\n`
  text += `${padRight('TOTAL BAYAR', 20)}${padLeft(`Rp ${data.grandTotal.toLocaleString('id-ID')}`, 12)}\n`
  text += `${line}\n`
  text += `Metode Bayar: ${data.paymentMethod.toUpperCase()}\n`
  if (data.paymentMethod === 'cash' && data.cashGiven) {
    text += `Tunai Diterima: Rp ${data.cashGiven.toLocaleString('id-ID')}\n`
    text += `Kembalian     : Rp ${(data.changeReturned || 0).toLocaleString('id-ID')}\n`
  }
  text += `${doubleLine}\n`
  if (data.sha256Hash) {
    text += `HCB Verify: ${data.sha256Hash.substring(0, 16)}...\n`
  }
  text += `${centerText('Terima Kasih Atas Kunjungan Anda!')}\n`

  return text
}

function centerText(str: string, width = 32): string {
  if (str.length >= width) return str.substring(0, width)
  const leftPadding = Math.floor((width - str.length) / 2)
  return ' '.repeat(leftPadding) + str
}

function padRight(str: string, width: number): string {
  if (str.length >= width) return str.substring(0, width)
  return str + ' '.repeat(width - str.length)
}

function padLeft(str: string, width: number): string {
  if (str.length >= width) return str.substring(0, width)
  return ' '.repeat(width - str.length) + str
}
