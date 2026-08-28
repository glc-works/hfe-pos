// --- HFE POS FINANCIAL PORT (POS-ENG-STD-001) ---
// Universal Financial Integration Port Contract for POS & Commerce Suite

import { MenuItem } from '../../types/pos'
import type { ReadbackValidationResult } from './HfePostingReadbackValidator'
import type { GovernedCheckoutDurability } from './GovernedCheckoutDurability'

export type AccountingTopologyMode = 'dimensional' | 'multi_book' | 'sub_account'

export interface CostCenterInfo {
  id: string
  name: string
  code: string
  is_active?: boolean
}

export interface AccountingTopologyConfig {
  mode: AccountingTopologyMode
  default_sales_gl_account: string
  default_cogs_gl_account: string
  default_cash_gl_account: string
  default_tax_gl_account: string
  default_service_gl_account?: string
  default_receivable_gl_account?: string
  cost_centers?: CostCenterInfo[]
}

export interface CompanyBookSettingsResponse {
  company_book_id: string
  legal_entity_name: string
  brand_name: string
  currency: string
  tax_id_npwp?: string
  nib_permit?: string
  accounting_topology: AccountingTopologyConfig
  isSimulated?: boolean
  fetched_at?: string
}

export interface ResolveContactResponse {
  contact_id: string
  loyalty_tier: string
  loyalty_points: number
  active_vouchers_count: number
  isSimulated?: boolean
}

export interface FinancialTransactionItem {
  product_id: string
  hfe_gl_account: string
  qty: number
  price: number
  modifiers?: Record<string, string>
  cost_price?: number
  name?: string
}

export interface SubmitRetailTransactionPayload {
  table_id?: string
  contact_id: string
  policy: 'pay-first' | 'open-tab'
  payment_method: 'cash' | 'qris' | 'card' | 'kasbon'
  items: FinancialTransactionItem[]
  subtotal: number
  tax_pb1_amount: number
  service_fee_amount: number
  discount_amount: number
  grand_total: number
  card_metadata?: Record<string, unknown>
  cashier_id?: string
  branch_id?: string
  cost_center_id?: string
  idempotency_key?: string
}

export interface GovernedRetailCheckoutItem {
  product_id: string
  quantity: number
  modifier_ids?: string[]
}

/**
 * Connected cashier intent. Monetary, policy-calculation, and accounting facts are
 * deliberately absent: CORE resolves them from the accepted catalog and preset.
 */
export interface GovernedRetailCheckoutPayload {
  table_id?: string
  contact_id: string
  policy: 'pay-first' | 'open-tab'
  payment_method: 'cash' | 'qris'
  outlet_id: string
  terminal_id: string
  currency: string
  promotion_codes?: string[]
  items: GovernedRetailCheckoutItem[]
  cashier_id?: string
  idempotency_key?: string
}

export type PersistedRetailCheckoutPayload =
  | SubmitRetailTransactionPayload
  | GovernedRetailCheckoutPayload

export interface GlPostingEntry {
  account: string
  account_name?: string
  debit: number
  credit: number
}

export interface SubmitRetailTransactionResponse {
  tx_id: string
  status: 'posted' | 'buffered_offline' | 'pending'
  created_at: string
  /** Legacy orders use a number; governed completion retains CORE's canonical minor-unit string. */
  grand_total: number | ExactMinorString
  idempotency_key: string
  ledger_journal_id?: string
  /** Canonical Posting identity proven by independent CORE read-back. */
  posting_id?: string
  /** Fail-closed proof artifact computed by the transport's own read-back. */
  readback_validation?: ReadbackValidationResult
  /** CORE-issued QRIS intent shown to the cashier/customer while provider outcome remains pending. */
  qris_payment?: QrisPaymentResponse & { tender_id: string }
  gl_entries_posted?: GlPostingEntry[]
  isSimulated?: boolean
}

export interface RetailPostingContext {
  companyBookId: string
  /** Local tenant/organization scope; CORE's current quote contract has no body field for it. */
  organizationId?: string
  authorityContext: string
  sessionId: string
  financialDate: string
  /** Durable phase evidence for the governed quote/intent/accept/confirm lifecycle. */
  governedAttempt?: GovernedCheckoutDurability
  handover: {
    actorPrincipalId: string
    evidenceReference: string
    occurredAt: string
  }
}

export type GovernedTenderType = 'cash' | 'qris'
export type ExactMinorString = string

export interface ReviewedPosQuote {
  quoteId: string
  revision: string
  digestSha256: string
  currency: string
  subtotalMinor: ExactMinorString
  amountDueMinor: ExactMinorString
  discountTotalMinor: ExactMinorString
  taxTotalMinor: ExactMinorString
  serviceChargeTotalMinor: ExactMinorString
  tipTotalMinor: ExactMinorString
  roundingTotalMinor: ExactMinorString
  presetId: string
  presetVersion: string
  lines: Array<{
    ordinal: number
    itemId: string
    quantity: string
    modifierIds: string[]
    discountAllocatedMinor: ExactMinorString
  }>
  expiresAt: string
  tenderEligibility: Array<{ tenderType: GovernedTenderType; eligible: boolean; reasonCode?: string }>
  /** Local canonical intent/scope snapshot that must still equal the acceptance request. */
  intentFingerprint: string
  source: 'hfe-core'
}

export interface GovernedAcceptedTenderEvidence {
  orderId: string
  acceptedAt: string
  tenderId: string
  acceptanceEffectKey: string
  tenderType: GovernedTenderType
  amountMinor: ExactMinorString
  quote: Pick<ReviewedPosQuote, 'quoteId' | 'revision' | 'digestSha256' | 'currency' | 'amountDueMinor' | 'presetId' | 'presetVersion'>
}

export interface GovernedTenderOutcomeQuery {
  idempotencyKey?: string
  orderId: string
  tenderId: string
  acceptedTenderEffectKey: string
  amountMinor: ExactMinorString
  currency: string
}

export interface GenerateQrisPayload {
  transaction_id: string
  amount_idr: number
  biller_split_fee_idr?: number
  merchant_name?: string
}

export interface QrisPaymentResponse {
  payment_id: string
  qris_string: string
  qr_image_url: string
  expires_at: string
  isSimulated?: boolean
}

export interface CashierShiftResponse {
  shift_id: string
  cashier_id: string
  opened_at: string
  initial_float: number
  status: 'open' | 'closed'
  isSimulated?: boolean
}

export interface CashierShiftCloseResponse {
  shift_id: string
  cashier_id?: string
  opened_at?: string
  closed_at: string
  initial_float?: number
  reported_cash: number
  expected_cash: number
  cash_variance: number
  total_sales: number
  status: 'closed'
  isSimulated?: boolean
}

export type PaymentTenderType =
  | 'cash'
  | 'qris'
  | 'card_debit'
  | 'card_credit'
  | 'hotel_room_folio'
  | 'voucher_credit'
  | 'bank_transfer'

export interface TenderItemPayload {
  tender_type: PaymentTenderType
  amount_minor: number
  reference_id?: string
  gl_account_override?: string
}

export interface DiscrepancyItemPayload {
  discrepancy_type: 'rounding_adjustment' | 'tip_income' | 'merchant_discount_fee' | 'cash_shortage' | 'cash_overage'
  amount_minor: number
  reason?: string
}

export interface UniversalMultiTenderRequest {
  document_reference_id: string
  total_obligation_minor: number
  tenders: TenderItemPayload[]
  discrepancies?: DiscrepancyItemPayload[]
  cashier_id?: string
  notes?: string
  idempotency_key?: string
}

export interface UniversalMultiTenderResponse {
  settlement_id: string
  document_reference_id: string
  total_obligation_minor: number
  total_tendered_minor: number
  total_discrepancy_minor: number
  status: string
  settled_at: string
  journal_posting_id: string
  gl_entries_posted?: GlPostingEntry[]
  isSimulated?: boolean
}

export interface HfePosFinancialPort {
  readonly isSimulated: boolean
  readonly adapterName: string

  /**
   * Fetch master product catalog with mapped COA accounts
   */
  fetchProductCatalog(bookId?: string): Promise<MenuItem[]>

  /**
   * Resolve customer loyalty and vouchers from CRM subledger
   */
  resolveContact(
    entryMode: 'phone' | 'guest-name',
    phone?: string,
    name?: string,
    bookId?: string
  ): Promise<ResolveContactResponse>

  /**
   * Submit retail checkout transaction for real-time GL posting
   */
  submitRetailTransaction(
    payload: SubmitRetailTransactionPayload,
    bookId?: string
  ): Promise<SubmitRetailTransactionResponse>

  /**
   * Execute the canonical CORE POS order lifecycle and verify its durable posting.
   */
  postRetailOrder(
    payload: SubmitRetailTransactionPayload,
    context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse>

  /** Execute a CORE-priced checkout without accepting caller-owned money or GL facts. */
  postGovernedRetailOrder(
    payload: GovernedRetailCheckoutPayload,
    context: RetailPostingContext,
    reviewedQuote: ReviewedPosQuote,
  ): Promise<SubmitRetailTransactionResponse>

  /** Prepare and project a frozen CORE sales quote for cashier review. */
  prepareGovernedRetailQuote(
    payload: GovernedRetailCheckoutPayload,
    context: RetailPostingContext,
    bookId?: string
  ): Promise<ReviewedPosQuote>

  /** Accept a reviewed CORE sales quote and return authoritative tender evidence. */
  acceptGovernedRetailQuote(
    payload: GovernedRetailCheckoutPayload,
    reviewed: ReviewedPosQuote,
    context: RetailPostingContext,
    bookId?: string,
    providerIntentReference?: string
  ): Promise<GovernedAcceptedTenderEvidence>

  /**
   * Reconcile an unresolved canonical POS attempt without submitting or posting it again.
   */
  reconcileRetailOrder(
    payload: SubmitRetailTransactionPayload,
    context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse>

  /** Reuse the same governed idempotency lineage to resolve an unknown outcome. */
  reconcileGovernedRetailOrder(
    payload: GovernedRetailCheckoutPayload,
    context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse>

  /** Reconcile an accepted governed tender through read-only outcome and Posting contracts. */
  reconcileGovernedTenderOutcome(
    query: GovernedTenderOutcomeQuery,
    context: RetailPostingContext,
    bookId?: string
  ): Promise<SubmitRetailTransactionResponse>

  /**
   * Settle complex transactions with multiple tenders and adjustments
   */
  settleUniversalMultiTender(
    payload: UniversalMultiTenderRequest,
    bookId?: string
  ): Promise<UniversalMultiTenderResponse>

  /**
   * Generate QRIS payment dynamic payload with fee split
   */
  generateQrisPayment(
    payload: GenerateQrisPayload,
    bookId?: string
  ): Promise<QrisPaymentResponse>

  /**
   * Open cashier shift with initial cash float
   */
  openCashierShift(
    cashierId: string,
    initialFloat: number,
    bookId?: string
  ): Promise<CashierShiftResponse>

  /**
   * Close cashier shift and calculate blind audit variance
   */
  closeCashierShift(
    shiftId: string,
    reportedCash: number,
    bookId?: string
  ): Promise<CashierShiftCloseResponse>

  /**
   * Fetch authoritative accounting topology from Hfe Core
   */
  fetchCompanyBookSettings(bookId?: string): Promise<CompanyBookSettingsResponse>
}
