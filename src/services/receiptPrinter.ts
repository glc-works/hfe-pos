// Thermal Receipt Print & E-Receipt Generator Service for hfe-pos

export interface ReceiptData {
  receiptNo: string
  storeName: string
  storeAddress: string
  storeNpwp?: string
  cashierName: string
  customerName?: string
  tableNo?: string
  queueNo?: string
  orderType: 'dine-in' | 'takeaway' | 'delivery'
  timestamp: string
  items: Array<{ name: string; qty: number; price: number }>
  subtotal: number
  pb1Tax: number
  serviceCharge?: number
  packagingFee?: number
  grandTotal: number
  paymentMethod: 'cash' | 'qris' | 'card' | 'kasbon'
  cashGiven?: number
  changeReturned?: number
  sha256Hash?: string
  glPostingId?: string
  transactionRef?: string
}

export function formatThermalReceiptText(data: ReceiptData): string {
  const line = '--------------------------------'
  const doubleLine = '================================'

  let text = ''
  text += `${centerText(data.storeName.toUpperCase())}\n`
  text += `${centerText(data.storeAddress)}\n`
  if (data.storeNpwp) text += `${centerText(`NPWP: ${data.storeNpwp}`)}\n`
  text += `${doubleLine}\n`

  // Format Fulfillment Banner
  let fulfillmentBadge = ''
  if (data.orderType === 'dine-in') {
    if (data.tableNo) {
      const cleanTable = data.tableNo.toUpperCase().startsWith('MEJA')
        ? data.tableNo.toUpperCase()
        : `MEJA ${data.tableNo.toUpperCase()}`
      fulfillmentBadge = `[ DINE-IN - ${cleanTable} ]`
    } else {
      fulfillmentBadge = `[ DINE-IN ]`
    }
  } else if (data.orderType === 'takeaway') {
    const q = data.queueNo || (data.tableNo && data.tableNo.toLowerCase().includes('antrean') ? data.tableNo : (data.tableNo ? `#${data.tableNo}` : ''))
    if (q) {
      const cleanQ = q.toUpperCase().includes('ANTREAN') ? q.toUpperCase() : `ANTREAN ${q.startsWith('#') ? q : `#${q}`}`
      fulfillmentBadge = `[ TAKEAWAY - ${cleanQ} ]`
    } else {
      fulfillmentBadge = `[ TAKEAWAY ]`
    }
  } else if (data.orderType === 'delivery') {
    fulfillmentBadge = `[ DELIVERY ]`
  }

  if (fulfillmentBadge) {
    text += `${centerText(fulfillmentBadge)}\n`
    text += `${line}\n`
  }

  text += `No. Struk : ${data.receiptNo}\n`
  if (data.transactionRef) {
    text += `Ref Trans : ${data.transactionRef}\n`
  }
  text += `Tgl/Waktu : ${data.timestamp}\n`
  text += `Kasir     : ${data.cashierName}\n`
  text += `Tamu      : ${data.customerName || 'Tamu Umum'}\n`
  text += `Tipe/Meja : ${data.orderType.toUpperCase()} ${data.tableNo ? `(${data.tableNo})` : ''}\n`
  text += `${line}\n`

  data.items.forEach((item) => {
    const itemLine = `${item.name} x${item.qty}`
    const priceLine = `Rp ${(item.price * item.qty).toLocaleString('id-ID')}`
    text += `${formatTwoColumn(itemLine, priceLine, 32)}\n`
  })

  text += `${line}\n`
  text += `${formatTwoColumn('Subtotal', `Rp ${data.subtotal.toLocaleString('id-ID')}`, 32)}\n`
  text += `${formatTwoColumn('PB1 Tax (10%)', `Rp ${data.pb1Tax.toLocaleString('id-ID')}`, 32)}\n`
  if (data.serviceCharge && data.serviceCharge > 0) {
    text += `${formatTwoColumn('Service Fee', `Rp ${data.serviceCharge.toLocaleString('id-ID')}`, 32)}\n`
  }
  if (data.packagingFee && data.packagingFee > 0) {
    text += `${formatTwoColumn('Biaya Kemasan', `Rp ${data.packagingFee.toLocaleString('id-ID')}`, 32)}\n`
  }
  text += `${doubleLine}\n`
  text += `${formatTwoColumn('TOTAL BAYAR', `Rp ${data.grandTotal.toLocaleString('id-ID')}`, 32)}\n`
  text += `${line}\n`
  text += `Metode Bayar: ${data.paymentMethod.toUpperCase()}\n`
  if (data.paymentMethod === 'cash' && data.cashGiven) {
    text += `Tunai Diterima: Rp ${data.cashGiven.toLocaleString('id-ID')}\n`
    text += `Kembalian     : Rp ${(data.changeReturned || 0).toLocaleString('id-ID')}\n`
  }
  text += `${doubleLine}\n`
  if (data.glPostingId) {
    text += `GL Post ID: ${data.glPostingId}\n`
  }
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

function formatTwoColumn(left: string, right: string, width = 32): string {
  const availableLeft = width - right.length - 1
  const truncatedLeft = left.length > availableLeft ? left.substring(0, availableLeft - 1) + '…' : left
  const spacesNeeded = Math.max(1, width - truncatedLeft.length - right.length)
  return truncatedLeft + ' '.repeat(spacesNeeded) + right
}
