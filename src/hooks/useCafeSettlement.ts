import { useEffect, useRef, useState } from 'react'
import type { CartItem, OrderFulfillmentMode, OrderTicket, PosPayMethod, TableStatus } from '../types/pos'
import type { GovernedRetailCheckoutPayload, HfePosFinancialPort, QrisPaymentResponse, ReviewedPosQuote } from '../services/financial'
import { CafeCheckoutAttemptCoordinator } from '../services/financial/CafeCheckoutAttemptCoordinator'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { isConnectedFirstPartyRuntime, requiredRuntimeUuid, resolveGovernedQuoteContext } from '../config/firstPartyRuntime'
import { companyBookPostingHref } from '../config/companyBookPostingLink'
import { useLiveCoreActivation } from '../context/DataTruthContext'
import { appendDeadLetterEntry } from '../services/financial/deadLetterLedger'
import { formatExactMinorCurrency } from '../utils/localeNumberFormat'

export type CafeFinancialStatus = 'idle' | 'pending' | 'error' | 'posted'
export type CafeFinancialNotice = 'submitting' | 'in_progress' | 'pending_core' | 'posted_unacknowledged' | 'outcome_unknown' | 'posted' | 'failed' | null
export type CheckoutFailureCode = 'auth' | 'contract' | 'network' | 'validation' | 'conflict' | 'unknown'

export type GovernedCheckoutPhase =
  | { kind: 'editing' }
  | { kind: 'quoting' }
  | { kind: 'review'; quote: ReviewedPosQuote; payloadFingerprint: string }
  | { kind: 'accepting'; quote: ReviewedPosQuote }
  | { kind: 'pending_outcome'; quote: ReviewedPosQuote; tenderId: string }
  | { kind: 'posted'; postingId: string }
  | { kind: 'failed'; message: string }

export function classifyCheckoutFailure(message?: string): CheckoutFailureCode {
  const normalized = (message || '').toLowerCase()
  if (/\((401|403)\)|unauthorized|forbidden/.test(normalized)) return 'auth'
  if (/\(404\)|not found|unexpected successful http status/.test(normalized)) return 'contract'
  if (/network|timed out|timeout|fetch/.test(normalized)) return 'network'
  if (/\(409\)|conflict/.test(normalized)) return 'conflict'
  if (/mismatch|required|invalid|must be|unsupported|does not yet support/.test(normalized)) return 'validation'
  return 'unknown'
}

export function formatPostedCheckoutAmount(
  value: number | string,
  currency: string,
  language: string,
  fallback: () => string,
): string {
  if (typeof value === 'number') return Number.isFinite(value) ? fallback() : String(value)
  try {
    return formatExactMinorCurrency(value, currency, language)
  } catch {
    return fallback()
  }
}

export async function settleQuoteRetirement(
  retirement: Promise<void>,
  onFailure: (error: unknown) => void,
): Promise<void> {
  try {
    await retirement
  } catch (error) {
    onFailure(error)
    throw error
  }
}

export function shouldAcceptQuoteResponse(requestedFingerprint: string, latestFingerprint: string): boolean {
  return requestedFingerprint === latestFingerprint
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

export function checkoutIntentFingerprint(
  options: UseCafeSettlementOptions,
  paymentMethod: PosPayMethod,
  quoteContext = resolveGovernedQuoteContext(),
): string {
  const sourceOrder = options.orders.find((order) => options.selectedTable && (
    order.table === options.selectedTable.name || order.table === options.selectedTable.id
  ))
  return JSON.stringify({
    companyBookId: options.companyBookId, organizationId: options.organizationId,
    authorityContext: options.authorityContext, cashierId: options.cashierId,
    tableId: options.selectedTable?.id, fulfillment: options.fulfillmentMode, tender: paymentMethod,
    policy: sourceOrder?.policy || 'pay-first', outletId: quoteContext.outletId,
    terminalId: quoteContext.terminalId, currency: quoteContext.currency,
    items: options.items.map((item) => {
      const governedItem = item as CartItem & { modifierIds?: string[] }
      return [item.id, item.quantity, [...(governedItem.modifierIds || [])].sort()]
    }),
  })
}

export function useCafeSettlement(options: UseCafeSettlementOptions) {
  const [financialStatus, setFinancialStatus] = useState<CafeFinancialStatus>('idle')
  const [financialNotice, setFinancialNotice] = useState<CafeFinancialNotice>(null)
  const [financialFailureCode, setFinancialFailureCode] = useState<CheckoutFailureCode | null>(null)
  const [postingTruthHref, setPostingTruthHref] = useState<string | null>(null)
  const [pendingQrisPayment, setPendingQrisPayment] = useState<(QrisPaymentResponse & { tender_id: string }) | null>(null)
  const [canResumeFinancialAttempt, setCanResumeFinancialAttempt] = useState(true)
  const [authoritativeQuote, setAuthoritativeQuote] = useState<ReviewedPosQuote | null>(null)
  const [checkoutPhase, setCheckoutPhase] = useState<GovernedCheckoutPhase>({ kind: 'editing' })
  const quoteIdempotencyKey = useRef<string | null>(null)
  const quoteCheckoutKey = useRef<string | null>(null)
  const quoteRetirementInFlight = useRef<Promise<void> | null>(null)
  const quoteRequestInFlight = useRef(false)
  const reviewedIntentFingerprint = useRef<string | null>(null)

  const coordinator = useRef(new CafeCheckoutAttemptCoordinator<GovernedRetailCheckoutPayload>(
    new OfflineIntentQueue<GovernedRetailCheckoutPayload>(),
  ))
  const activateLiveCore = useLiveCoreActivation()

  const beginQuoteRetirement = (checkoutKey: string): Promise<void> => {
    let tracked: Promise<void>
    tracked = settleQuoteRetirement(coordinator.current.retirePrepared(checkoutKey), (error) => {
      setCheckoutPhase({ kind: 'failed', message: error instanceof Error ? error.message : String(error) })
    }).then(() => {
      if (quoteRetirementInFlight.current === tracked) quoteRetirementInFlight.current = null
      if (quoteCheckoutKey.current === checkoutKey) {
        quoteCheckoutKey.current = null
        quoteIdempotencyKey.current = null
      }
    })
    quoteRetirementInFlight.current = tracked
    void tracked.catch(() => {})
    return tracked
  }

  const invalidateQuote = () => {
    if (quoteCheckoutKey.current && !quoteRetirementInFlight.current) {
      void beginQuoteRetirement(quoteCheckoutKey.current)
    }
    setAuthoritativeQuote(null)
    setCheckoutPhase({ kind: 'editing' })
  }
  const intentFingerprint = checkoutIntentFingerprint(options, options.paymentMethod)
  const latestIntentFingerprint = useRef(intentFingerprint)
  latestIntentFingerprint.current = intentFingerprint
  useEffect(() => {
    if (reviewedIntentFingerprint.current !== null && reviewedIntentFingerprint.current !== intentFingerprint) {
      invalidateQuote()
    }
    reviewedIntentFingerprint.current = intentFingerprint
  }, [intentFingerprint])

  const requestQuote = async (intendedPaymentMethod: PosPayMethod = options.paymentMethod) => {
    if (quoteRequestInFlight.current) return
    const {
      selectedTable, items, orders, fulfillmentMode, cashierId,
      financialPort, companyBookId, authorityContext,
    } = options
    if (items.length === 0 && (!selectedTable || selectedTable.totalBill === 0)) {
      return
    }
    const sourceOrder = orders.find((order) => selectedTable && (
      order.table === selectedTable.name || order.table === selectedTable.id
    ))
    const sourceId = sourceOrder?.id || selectedTable?.id || `walk-in-${fulfillmentMode}`
    const payload = {
      ...buildGovernedCafeCheckoutPayload({
      tableId: selectedTable?.id,
      contactId: '',
      policy: sourceOrder?.policy || 'pay-first',
      paymentMethod: intendedPaymentMethod,
      cashierId,
      quoteContext: resolveGovernedQuoteContext(),
      items,
      }),
      idempotency_key: quoteIdempotencyKey.current ?? undefined,
    }
    const checkoutKey = `${companyBookId}:${sourceId}`
    const requestedFingerprint = checkoutIntentFingerprint(options, intendedPaymentMethod)
    quoteRequestInFlight.current = true
    setCheckoutPhase({ kind: 'quoting' })
    try {
      if (quoteRetirementInFlight.current) {
        try {
          await quoteRetirementInFlight.current
        } catch {
          if (!quoteCheckoutKey.current) throw new Error('Failed quote retirement remains unresolved.')
          await beginQuoteRetirement(quoteCheckoutKey.current)
        }
      }
      if (financialPort.prepareGovernedRetailQuote) {
        const attempt = await coordinator.current.prepare(checkoutKey, companyBookId, payload, {
          organizationId: options.organizationId,
          authorityContext,
          cashierId,
          actorPrincipalId: cashierId,
        })
        quoteCheckoutKey.current = checkoutKey
        quoteIdempotencyKey.current = attempt.idempotencyKey
        const quote = await financialPort.prepareGovernedRetailQuote(attempt.payload, {
          companyBookId,
          organizationId: options.organizationId,
          authorityContext,
          governedAttempt: coordinator.current.durability(checkoutKey),
          sessionId: resolveConfiguredCashierSessionId(sourceId),
          financialDate: new Date().toISOString().slice(0, 10),
          handover: {
            actorPrincipalId: cashierId,
            evidenceReference: `pos-order:${sourceId}`,
            occurredAt: new Date().toISOString(),
          },
        })
        if (!shouldAcceptQuoteResponse(requestedFingerprint, latestIntentFingerprint.current)) {
          invalidateQuote()
          return
        }
        setAuthoritativeQuote(quote)
        reviewedIntentFingerprint.current = checkoutIntentFingerprint(options, intendedPaymentMethod)
        setCheckoutPhase({ kind: 'review', quote, payloadFingerprint: attempt.payloadFingerprint })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setCheckoutPhase({ kind: 'failed', message: msg })
    } finally {
      quoteRequestInFlight.current = false
    }
  }

  const executeCheckout = async (resumeExisting: boolean, intendedPaymentMethod: PosPayMethod = options.paymentMethod) => {
    const {
      selectedTable, items, orders, fulfillmentMode, cashierId,
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
    const payload = {
      ...buildGovernedCafeCheckoutPayload({
      tableId: selectedTable?.id,
      contactId: '',
      policy: sourceOrder?.policy || 'pay-first',
      paymentMethod: intendedPaymentMethod,
      cashierId,
      quoteContext: resolveGovernedQuoteContext(),
      items,
      }),
      idempotency_key: quoteIdempotencyKey.current ?? undefined,
    }
    const reviewed = authoritativeQuote
    const intendedFingerprint = checkoutIntentFingerprint(options, intendedPaymentMethod)
    if (!resumeExisting && (!reviewed || checkoutPhase.kind !== 'review' || reviewedIntentFingerprint.current !== intendedFingerprint)) {
      await requestQuote(intendedPaymentMethod)
      return
    }
    setCanResumeFinancialAttempt(true)

    setFinancialStatus('pending')
    setPostingTruthHref(null)
    setFinancialNotice('submitting')
    if (!resumeExisting && reviewed) setCheckoutPhase({ kind: 'accepting', quote: reviewed })
    try {
      const checkoutKey = `${companyBookId}:${sourceId}`
      const result = await coordinator.current.execute({
        checkoutKey,
        bookId: companyBookId,
        payload,
        scope: { organizationId, authorityContext, cashierId, actorPrincipalId: cashierId },
        post: (identifiedPayload, attempt) => financialPort.postGovernedRetailOrder(
          identifiedPayload as GovernedRetailCheckoutPayload,
          {
            companyBookId,
            organizationId,
            authorityContext,
            governedAttempt: coordinator.current.durability(checkoutKey),
            sessionId: resolveConfiguredCashierSessionId(sourceId),
            financialDate: attempt.createdAt.slice(0, 10),
            handover: {
              actorPrincipalId: cashierId,
              evidenceReference: `pos-order:${sourceId}`,
              occurredAt: attempt.createdAt,
            },
          },
          reviewed!,
        ),
        reconcile: (identifiedPayload, attempt) => financialPort.reconcileGovernedRetailOrder(
          identifiedPayload as GovernedRetailCheckoutPayload,
          {
            companyBookId,
            organizationId,
            authorityContext,
            governedAttempt: coordinator.current.durability(checkoutKey),
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
        setPendingQrisPayment(result.response.qris_payment || null)
        setFinancialNotice('pending_core')
        if (reviewed && result.response.qris_payment?.tender_id) {
          setCheckoutPhase({ kind: 'pending_outcome', quote: reviewed, tenderId: result.response.qris_payment.tender_id })
        }
        return
      }
      if (result.kind === 'operator_action_required') {
        setPendingQrisPayment(result.attempt.response?.qris_payment || null)
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
      if (result.kind === 'validation_failed') {
        setFinancialStatus('error')
        setFinancialNotice('failed')
        setFinancialFailureCode(classifyCheckoutFailure(result.message))
        setCheckoutPhase({ kind: 'failed', message: result.message })
        return
      }

      setFinancialStatus('posted')
      setPendingQrisPayment(null)
      setFinancialNotice('posted')
      setFinancialFailureCode(null)
      if (result.response.posting_id) setCheckoutPhase({ kind: 'posted', postingId: result.response.posting_id })

      // #35: the ONLY sanctioned live-core activation — feed the transport's own
      // fail-closed read-back proof into the Data Truth Boundary. Any gate throw
      // falls into the catch below and surfaces as a loud financial failure.
      if (result.response.readback_validation && result.response.posting_id) {
        activateLiveCore(result.response.readback_validation, result.response.posting_id)
      }

      setPostingTruthHref(result.response.posting_id
        ? companyBookPostingHref(organizationId, companyBookId, result.response.posting_id, result.response.tx_id)
        : null)
      // Successful acknowledgement owns a separate cleanup path. Clearing the
      // cart must not trigger pre-accept retirement against a posted attempt.
      quoteCheckoutKey.current = null
      quoteIdempotencyKey.current = null
      reviewedIntentFingerprint.current = null
      setAuthoritativeQuote(null)
      commitPaidState()
      clearCart()
      await coordinator.current.acknowledgePosted(checkoutKey)
      const displayedAmount = formatPostedCheckoutAmount(
        result.response.grand_total,
        authoritativeQuote?.currency || resolveGovernedQuoteContext().currency,
        'id',
        () => typeof result.response.grand_total === 'number'
          ? formatPrice(result.response.grand_total)
          : result.response.grand_total,
      )
      alert(`🎉 Pembayaran ${selectedTable?.name || (fulfillmentMode === 'takeaway' ? 'Takeaway' : 'Walk-In')} Sebesar ${displayedAmount} LUNAS via ${intendedPaymentMethod.toUpperCase()}!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setFinancialStatus('error')
      setFinancialNotice('failed')
      setFinancialFailureCode(classifyCheckoutFailure(message))
      setCheckoutPhase({ kind: 'failed', message })
      void appendDeadLetterEntry({ kind: 'outcome_unknown', detail: message, bookId: companyBookId }).catch(() => {})
    }
  }

  return {
    financialStatus,
    financialNotice,
    financialFailureCode,
    postingTruthHref,
    pendingQrisPayment,
    canResumeFinancialAttempt,
    authoritativeQuote,
    checkoutPhase,
    requestQuote,
    invalidateQuote,
    dismissPendingQrisPayment: () => setPendingQrisPayment(null),
    handleCheckout: (intendedPaymentMethod?: PosPayMethod) => executeCheckout(false, intendedPaymentMethod),
    resumeCheckout: () => executeCheckout(true),
  }
}
