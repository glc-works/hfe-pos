import { useRef, useState } from 'react'
import type { CartItem, OrderFulfillmentMode, OrderTicket, PosPayMethod, TableStatus } from '../types/pos'
import type { GovernedRetailCheckoutPayload, HfePosFinancialPort } from '../services/financial'
import { CafeCheckoutAttemptCoordinator } from '../services/financial/CafeCheckoutAttemptCoordinator'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { isConnectedFirstPartyRuntime, requiredRuntimeUuid, resolveGovernedQuoteContext } from '../config/firstPartyRuntime'
import { companyBookPostingHref } from '../config/companyBookPostingLink'
import { useLiveCoreActivation } from '../context/DataTruthContext'
import { appendDeadLetterEntry } from '../services/financial/deadLetterLedger'

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
  formatPrice: (amount: number) => string
  commitPaidState: () => void
  clearCart: () => void
}

export function resolveConfiguredCashierSessionId(fallbackSourceId: string): string {
  return isConnectedFirstPartyRuntime()
    ? requiredRuntimeUuid('VITE_HFE_CASHIER_SESSION_ID')
    : fallbackSourceId
}

interface GovernedCheckoutInput {
  tableId?: string
  contactId: string
  policy: 'pay-first' | 'open-tab'
  paymentMethod: PosPayMethod
  cashierId: string
  quoteContext: { outletId: string; terminalId: string; currency: string }
  items: Array<{
    id: string
    quantity: number
    modifierIds?: string[]
    price?: number
    hfeGlAccount?: string
  }>
}

export function buildGovernedCafeCheckoutPayload(input: GovernedCheckoutInput): GovernedRetailCheckoutPayload {
  if (input.paymentMethod !== 'cash' && input.paymentMethod !== 'qris') {
    throw new Error(`Unsupported governed tender: ${input.paymentMethod}.`)
  }
  return {
    table_id: input.tableId,
    contact_id: input.contactId,
    policy: input.policy,
    payment_method: input.paymentMethod,
    outlet_id: input.quoteContext.outletId,
    terminal_id: input.quoteContext.terminalId,
    currency: input.quoteContext.currency,
    promotion_codes: [],
    items: input.items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      modifier_ids: item.modifierIds || [],
    })),
    cashier_id: input.cashierId,
  }
}

export function useCafeSettlement(options: UseCafeSettlementOptions) {
  const [financialStatus, setFinancialStatus] = useState<CafeFinancialStatus>('idle')
  const [financialNotice, setFinancialNotice] = useState<CafeFinancialNotice>(null)
  const [financialFailureCode, setFinancialFailureCode] = useState<CheckoutFailureCode | null>(null)
  const [postingTruthHref, setPostingTruthHref] = useState<string | null>(null)
  const coordinator = useRef(new CafeCheckoutAttemptCoordinator<GovernedRetailCheckoutPayload>(
    new OfflineIntentQueue<GovernedRetailCheckoutPayload>(),
  ))
  const activateLiveCore = useLiveCoreActivation()

  const executeCheckout = async (resumeExisting: boolean) => {
    const {
      selectedTable, items, orders, fulfillmentMode, paymentMethod, cashierId,
      financialPort, companyBookId, organizationId, authorityContext,
      commitPaidState, clearCart, formatPrice,
    } = options
    if (items.length === 0 && (!selectedTable || selectedTable.totalBill === 0)) {
      alert('Keranjang masih kosong! Silakan pilih menu atau meja terlebih dahulu.')
      return
    }

    const sourceOrder = orders.find((order) => selectedTable && (
      order.table === selectedTable.name || order.table === selectedTable.id
    ))
    const sourceId = sourceOrder?.id || selectedTable?.id || `walk-in-${fulfillmentMode}`
    const payload = buildGovernedCafeCheckoutPayload({
      tableId: selectedTable?.id,
      contactId: '',
      policy: sourceOrder?.policy || 'pay-first',
      paymentMethod,
      cashierId,
      quoteContext: resolveGovernedQuoteContext(),
      items,
    })

    setFinancialStatus('pending')
    setPostingTruthHref(null)
    setFinancialNotice('submitting')
    try {
      const checkoutKey = `${companyBookId}:${sourceId}`
      const result = await coordinator.current.execute({
        checkoutKey,
        bookId: companyBookId,
        payload,
        post: (identifiedPayload, attempt) => financialPort.postGovernedRetailOrder(
          identifiedPayload as GovernedRetailCheckoutPayload,
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
        reconcile: (identifiedPayload, attempt) => financialPort.reconcileGovernedRetailOrder(
          identifiedPayload as GovernedRetailCheckoutPayload,
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
        void appendDeadLetterEntry({
          kind: 'operator_action_required',
          detail: result.attempt.lastError || `attempt status: ${result.attempt.status}`,
          bookId: companyBookId,
          checkoutKey,
          idempotencyKey: result.attempt.idempotencyKey,
        }).catch(() => {})
        return
      }
      if (result.kind === 'outcome_unknown') {
        setFinancialStatus('error')
        setFinancialNotice('outcome_unknown')
        setFinancialFailureCode(classifyCheckoutFailure(result.message))
        void appendDeadLetterEntry({
          kind: 'outcome_unknown',
          detail: result.message,
          bookId: companyBookId,
          checkoutKey,
        }).catch(() => {})
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
      alert(`🎉 Pembayaran ${selectedTable?.name || (fulfillmentMode === 'takeaway' ? 'Takeaway' : 'Walk-In')} Sebesar ${formatPrice(result.response.grand_total)} LUNAS via ${paymentMethod.toUpperCase()}!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setFinancialStatus('error')
      setFinancialNotice('failed')
      setFinancialFailureCode(classifyCheckoutFailure(message))
      void appendDeadLetterEntry({ kind: 'outcome_unknown', detail: message, bookId: companyBookId }).catch(() => {})
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
