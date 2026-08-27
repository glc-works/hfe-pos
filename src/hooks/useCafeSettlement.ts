import { useRef, useState } from 'react'
import type { CartItem, OrderFulfillmentMode, OrderTicket, PosPayMethod, TableStatus } from '../types/pos'
import type { HfePosFinancialPort, SubmitRetailTransactionPayload } from '../services/financial'
import { CafeCheckoutAttemptCoordinator } from '../services/financial/CafeCheckoutAttemptCoordinator'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { isConnectedFirstPartyRuntime, requiredRuntimeUuid } from '../config/firstPartyRuntime'
import { companyBookPostingHref } from '../config/companyBookPostingLink'
import { useLiveCoreActivation } from '../context/DataTruthContext'

export type CafeFinancialStatus = 'idle' | 'pending' | 'error' | 'posted'
export type CafeFinancialNotice = 'submitting' | 'in_progress' | 'pending_core' | 'posted_unacknowledged' | 'outcome_unknown' | 'posted' | 'failed' | null
export type CheckoutFailureCode = 'auth' | 'contract' | 'network' | 'validation' | 'conflict' | 'unknown'

export function classifyCheckoutFailure(message?: string): CheckoutFailureCode {
  const normalized = (message || '').toLowerCase()
  if (/\((401|403)\)|unauthorized|forbidden/.test(normalized)) return 'auth'
  if (/\(404\)|not found|unexpected successful http status/.test(normalized)) return 'contract'
  if (/network|timed out|timeout|fetch/.test(normalized)) return 'network'
  if (/\(409\)|conflict/.test(normalized)) return 'conflict'
  if (/mismatch|required|invalid|must be|unsupported|does not yet support/.test(normalized)) return 'validation'
  return 'unknown'
}

interface UseCafeSettlementOptions {
  financialPort: HfePosFinancialPort
  companyBookId: string
  organizationId: string
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

export function resolveConfiguredCashierSessionId(fallbackSourceId: string): string {
  return isConnectedFirstPartyRuntime()
    ? requiredRuntimeUuid('VITE_HFE_CASHIER_SESSION_ID')
    : fallbackSourceId
}

export function useCafeSettlement(options: UseCafeSettlementOptions) {
  const [financialStatus, setFinancialStatus] = useState<CafeFinancialStatus>('idle')
  const [financialNotice, setFinancialNotice] = useState<CafeFinancialNotice>(null)
  const [financialFailureCode, setFinancialFailureCode] = useState<CheckoutFailureCode | null>(null)
  const [postingTruthHref, setPostingTruthHref] = useState<string | null>(null)
  const coordinator = useRef(new CafeCheckoutAttemptCoordinator(new OfflineIntentQueue()))
  const activateLiveCore = useLiveCoreActivation()

  const executeCheckout = async (resumeExisting: boolean) => {
    const {
      selectedTable, items, orders, fulfillmentMode, paymentMethod, cashierId,
      financialPort, companyBookId, organizationId, authorityContext, subtotal, taxAmount,
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
    setPostingTruthHref(null)
    setFinancialNotice('submitting')
    try {
      const checkoutKey = `${companyBookId}:${sourceId}`
      const result = await coordinator.current.execute({
        checkoutKey,
        bookId: companyBookId,
        payload,
        post: (identifiedPayload, attempt) => financialPort.postRetailOrder(
          identifiedPayload,
          {
            companyBookId,
            authorityContext,
            sessionId: resolveConfiguredCashierSessionId(sourceId),
            financialDate: attempt.createdAt.slice(0, 10),
            handover: {
              actorPrincipalId: cashierId,
              evidenceReference: `pos-order:${sourceId}`,
              occurredAt: attempt.createdAt,
            },
          },
        ),
        reconcile: (identifiedPayload, attempt) => financialPort.reconcileRetailOrder(
          identifiedPayload,
          {
            companyBookId,
            authorityContext,
            sessionId: resolveConfiguredCashierSessionId(sourceId),
            financialDate: attempt.createdAt.slice(0, 10),
            handover: {
              actorPrincipalId: cashierId,
              evidenceReference: `pos-order:${sourceId}`,
              occurredAt: attempt.createdAt,
            },
          },
        ),
        resumeExisting,
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
        setFinancialFailureCode(classifyCheckoutFailure(result.attempt.lastError))
        return
      }
      if (result.kind === 'outcome_unknown') {
        setFinancialStatus('error')
        setFinancialNotice('outcome_unknown')
        setFinancialFailureCode(classifyCheckoutFailure(result.message))
        return
      }

      setFinancialStatus('posted')
      setFinancialNotice('posted')
      setFinancialFailureCode(null)

      // #35: the ONLY sanctioned live-core activation — feed the transport's own
      // fail-closed read-back proof into the Data Truth Boundary. Any gate throw
      // falls into the catch below and surfaces as a loud financial failure.
      if (result.response.readback_validation && result.response.posting_id) {
        activateLiveCore(result.response.readback_validation, result.response.posting_id)
      }

      setPostingTruthHref(result.response.posting_id
        ? companyBookPostingHref(organizationId, companyBookId, result.response.posting_id, result.response.tx_id)
        : null)
      commitPaidState()
      clearCart()
      await coordinator.current.acknowledgePosted(checkoutKey)
      alert(`🎉 Pembayaran ${selectedTable?.name || (fulfillmentMode === 'takeaway' ? 'Takeaway' : 'Walk-In')} Sebesar ${formatPrice(grandTotal > 0 ? grandTotal : (selectedTable?.totalBill || 0))} LUNAS via ${paymentMethod.toUpperCase()}!`)
    } catch (error) {
      setFinancialStatus('error')
      setFinancialNotice('failed')
      setFinancialFailureCode(classifyCheckoutFailure(error instanceof Error ? error.message : String(error)))
    }
  }

  return {
    financialStatus,
    financialNotice,
    financialFailureCode,
    postingTruthHref,
    handleCheckout: () => executeCheckout(false),
    resumeCheckout: () => executeCheckout(true),
  }
}
