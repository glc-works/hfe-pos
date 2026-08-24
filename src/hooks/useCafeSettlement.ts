import { useRef, useState } from 'react'
import type { CartItem, OrderFulfillmentMode, OrderTicket, PosPayMethod, TableStatus } from '../types/pos'
import type { HfePosFinancialPort, SubmitRetailTransactionPayload } from '../services/financial'
import { CafeCheckoutAttemptCoordinator } from '../services/financial/CafeCheckoutAttemptCoordinator'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'

export type CafeFinancialStatus = 'idle' | 'pending' | 'error' | 'posted'
export type CafeFinancialNotice = 'submitting' | 'in_progress' | 'pending_core' | 'posted_unacknowledged' | 'outcome_unknown' | 'posted' | 'failed' | null

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
  const [financialNotice, setFinancialNotice] = useState<CafeFinancialNotice>(null)
  const coordinator = useRef(new CafeCheckoutAttemptCoordinator(new OfflineIntentQueue()))

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
    }

    setFinancialStatus('pending')
    setFinancialNotice('submitting')
    try {
      const now = new Date()
      const checkoutKey = `${companyBookId}:${sourceId}`
      const result = await coordinator.current.execute({
        checkoutKey,
        bookId: companyBookId,
        payload,
        post: (identifiedPayload) => financialPort.postRetailOrder(
          identifiedPayload,
          {
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
        ),
      })
      if (result.kind === 'already_in_progress') {
        setFinancialNotice('in_progress')
        return
      }
      if (result.kind === 'pending') {
        setFinancialNotice('pending_core')
        return
      }
      if (result.kind === 'operator_action_required') {
        setFinancialStatus(result.attempt.status === 'posted' ? 'error' : 'pending')
        setFinancialNotice(result.attempt.status === 'posted' ? 'posted_unacknowledged' : 'outcome_unknown')
        return
      }
      if (result.kind === 'outcome_unknown') {
        setFinancialStatus('error')
        setFinancialNotice('outcome_unknown')
        return
      }

      setFinancialStatus('posted')
      setFinancialNotice('posted')
      commitPaidState()
      clearCart()
      await coordinator.current.acknowledgePosted(checkoutKey)
      alert(`🎉 Pembayaran ${selectedTable?.name || (fulfillmentMode === 'takeaway' ? 'Takeaway' : 'Walk-In')} Sebesar ${formatPrice(grandTotal > 0 ? grandTotal : (selectedTable?.totalBill || 0))} LUNAS via ${paymentMethod.toUpperCase()}!`)
    } catch {
      setFinancialStatus('error')
      setFinancialNotice('failed')
    }
  }

  return { financialStatus, financialNotice, handleCheckout }
}
