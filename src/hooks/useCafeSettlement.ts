import { useRef, useState } from 'react'
import type { CartItem, OrderFulfillmentMode, OrderTicket, PosPayMethod, TableStatus } from '../types/pos'
import type { HfePosFinancialPort, SubmitRetailTransactionPayload } from '../services/financial'
import { settleCafeOrder } from '../services/financial'

export type CafeFinancialStatus = 'idle' | 'pending' | 'error' | 'posted'

interface UseCafeSettlementOptions {
  financialPort: HfePosFinancialPort
  companyBookId: string
  authorityContext: string
  cashierId: string
  selectedTable: TableStatus | null
  orders: OrderTicket[]
  items: CartItem[]
  fulfillmentMode: OrderFulfillmentMode
  paymentMethod: PosPayMethod
  subtotal: number
  taxAmount: number
  grandTotal: number
  formatPrice: (amount: number) => string
  commitPaidState: () => void
  clearCart: () => void
}

export function useCafeSettlement(options: UseCafeSettlementOptions) {
  const [financialStatus, setFinancialStatus] = useState<CafeFinancialStatus>('idle')
  const idempotencyKeys = useRef(new Map<string, string>())

  const handleCheckout = async () => {
    const {
      selectedTable, items, orders, fulfillmentMode, paymentMethod, cashierId,
      financialPort, companyBookId, authorityContext, subtotal, taxAmount,
      grandTotal, commitPaidState, clearCart, formatPrice,
    } = options
    if (items.length === 0 && (!selectedTable || selectedTable.totalBill === 0)) {
      alert('Keranjang masih kosong! Silakan pilih menu atau meja terlebih dahulu.')
      return
    }

    const sourceOrder = orders.find((order) => selectedTable && (
      order.table === selectedTable.name || order.table === selectedTable.id
    ))
    const sourceId = sourceOrder?.id || selectedTable?.id || `walk-in-${fulfillmentMode}`
    let idempotencyKey = idempotencyKeys.current.get(sourceId)
    if (!idempotencyKey) {
      idempotencyKey = crypto.randomUUID()
      idempotencyKeys.current.set(sourceId, idempotencyKey)
    }
    const corePaymentMethod = paymentMethod === 'cash' || paymentMethod === 'qris' ? paymentMethod : 'card'
    const payload: SubmitRetailTransactionPayload = {
      table_id: selectedTable?.id,
      contact_id: '',
      policy: sourceOrder?.policy || 'pay-first',
      payment_method: corePaymentMethod,
      items: items.map((item) => ({
        product_id: item.id,
        hfe_gl_account: item.hfeGlAccount || '',
        qty: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax_pb1_amount: taxAmount,
      service_fee_amount: 0,
      discount_amount: 0,
      grand_total: grandTotal,
      cashier_id: cashierId,
      idempotency_key: idempotencyKey,
    }

    setFinancialStatus('pending')
    try {
      const now = new Date()
      const result = await settleCafeOrder({
        port: financialPort,
        payload,
        context: {
          companyBookId,
          authorityContext,
          sessionId: sourceId,
          financialDate: now.toISOString().slice(0, 10),
          handover: {
            actorPrincipalId: cashierId,
            evidenceReference: `pos-order:${sourceId}`,
            occurredAt: now.toISOString(),
          },
        },
        commitPaidState,
      })
      if (result.status !== 'posted') return
      setFinancialStatus('posted')
      idempotencyKeys.current.delete(sourceId)
      clearCart()
      alert(`🎉 Pembayaran ${selectedTable?.name || (fulfillmentMode === 'takeaway' ? 'Takeaway' : 'Walk-In')} Sebesar ${formatPrice(grandTotal > 0 ? grandTotal : (selectedTable?.totalBill || 0))} LUNAS via ${paymentMethod.toUpperCase()}!`)
    } catch {
      setFinancialStatus('error')
    }
  }

  return { financialStatus, handleCheckout }
}
