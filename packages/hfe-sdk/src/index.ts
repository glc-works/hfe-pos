/**
 * Headless Financial Engine (Hfe) Official TypeScript SDK
 * Auto-generated from OpenAPI 3.1 Canonical Specification
 * Accounting-First Principle & Implementation-Neutral Double-Entry Invariant
 */

// ============================================================================
// TYPE SCHEMAS
// ============================================================================

declare const int64Brand: unique symbol;
export type Int64String = string & { readonly [int64Brand]: true };

export interface AcceptInvitationRequest {
  token: string;
}

export interface Account {
  active: boolean;
  code: string;
  id: string;
  manual_entry_allowed: boolean;
  name: string;
  normal_balance: string;
  state_revision: Int64String;
}

export interface AccountList {
  accounts: Account[];
}

export interface AccountingBookScopeSummary {
  mode: string;
}

export interface AccountingPeriod {
  financial_end: string;
  financial_start: string;
  id: string;
  state: PeriodState;
  state_revision: Int64String;
  temporary_posting_lock?: null | TemporaryLockEvidenceView;
}

export interface AccountingPeriodList {
  accounting_periods: AccountingPeriod[];
}

export interface AccountingPeriodTransition {
  reason: string;
}

export interface AccountsReceivableAgingReportView {
  aging_buckets: ArAgingBucketView;
  as_of_date: string;
  company_book_id: string;
  generated_at: string;
  total_ar_outstanding_minor: Int64String;
}

export interface AcquireDocumentLockRequest {
  display_name: string;
  email: string;
  ttl_minutes?: Int64String | null;
}

export interface AddRevisionRequest {
  content: CadjProposalContent;
}

export interface AddSubsidiaryMemberRequest {
  effective_from: string;
  effective_to?: string | null;
  ownership_percentage: number;
  subsidiary_company_book_id: string;
}

export interface AdminReviewSubmissionRequest {
  decision: string;
  review_comments: string;
  target_id: string;
  target_type: string;
}

export interface AdmissionView {
  admission_scope: string;
  application: string;
  client_application_id: string;
  company_book_id: string;
  created_at: string;
  created_by_principal_id: string;
  created_reason: string;
  data_handling_notice: string;
  deployment_environment: string;
  exit_export_route: string;
  expires_at: string;
  id: string;
  participant_id?: string | null;
  principal_id: string;
  review_at: string;
  revocation_reason?: string | null;
  revoked_at?: string | null;
  revoked_by_principal_id?: string | null;
  starts_at: string;
  state_revision: Int64String;
  status: string;
  support_contact: string;
  suspended_at?: string | null;
  suspended_by_principal_id?: string | null;
  suspension_reason?: string | null;
  tenant_id: string;
  updated_at: string;
}

export interface AgingBucket {
  contact_id: string;
  contact_name: string;
  current: Int64String;
  days_1_30: Int64String;
  days_31_60: Int64String;
  days_61_90: Int64String;
  days_90_plus: Int64String;
  total_open: Int64String;
}

export interface AgingBucketSummary {
  aging_31_60d: Int64String;
  aging_61_90d: Int64String;
  aging_90d_plus: Int64String;
  current_0_30d: Int64String;
}

export interface AgingReport {
  as_of_date: string;
  buckets: AgingBucket[];
  direction: string;
  grand_total: Int64String;
}

export interface AllocateContractLossRequest {
  capital_ratio?: number | null;
  contract_id: string;
  contract_mode?: string | null;
  period_id: string;
  total_loss_minor: Int64String;
}

export interface AllocateNsfpPoolRequest {
  nsfp_end_number: string;
  nsfp_start_number: string;
  tax_year: number;
}

export interface AllocatePayment {
  allocated_amount: Int64String;
  document_id: string;
  document_type: string;
  fx_gain_loss?: Int64String | null;
}

export interface ApiError {
  code: string;
  details: ApiErrorDetails;
  message: string;
  request_id: string;
}

export interface ApiErrorDetails {
  violations?: ValidationViolation[] | null;
}

export interface ApplyInvoiceEstampRequest {
  document_amount_minor?: Int64String | null;
  provider_name?: string | null;
}

export interface ApplyPartnerRequest {
  certified_consultants_count?: number | null;
  contact_email: string;
  description: string;
  industry_specializations: string[];
  jurisdiction_coverage: string[];
  logo_url?: string | null;
  partner_name: string;
  partner_type: string;
  summary: string;
  website_url?: string | null;
}

export interface ApprovalDecisionRequest {
  decision: string;
  reason?: string | null;
}

export interface ApprovalDecisionResponse {
  approval_request_id: string;
  decision: string;
  state: string;
}

export interface ApprovalPolicySetting {
  configured: boolean;
  mode: string;
  required_role: string;
  source_capability: string;
  threshold_amount?: Int64String | null;
}

export interface ApproveLiveRequest {
  notes?: string | null;
}

export interface ApprovePayrollCalculationRequest {
  notes?: string | null;
  payroll_run_id: string;
}

export interface ApprovePayrollRunRequest {
  auto_post_journal?: boolean | null;
}

export interface ApproveTimesheetBatchRequest {
  period_end: string;
  period_start: string;
  timesheet_entry_ids: string[];
}

export interface ArAgingBucketView {
  current_minor: Int64String;
  days_1_30_minor: Int64String;
  days_31_60_minor: Int64String;
  days_61_90_minor: Int64String;
  over_90_days_minor: Int64String;
}

export interface ArApReconciliation {
  difference: Int64String;
  direction: string;
  gl_account_balance: Int64String;
  reconciled: boolean;
  subledger_open_total: Int64String;
}

export type ArchiveCompanyBook = Record<string, unknown>;

export interface AssessPocProjectRevenueRequest {
  actual_cost_incurred_minor: Int64String;
  billed_to_date_minor: Int64String;
}

export interface AssetCategoryView {
  created_at: string;
  created_by: string;
  id: string;
  name: string;
}

export interface AssignParticipantRequest {
  participant_role: string;
  principal_id: string;
}

export interface Attention {
  action_type: string;
  action_url?: string | null;
  created_at: string;
  description?: string | null;
  detail?: unknown;
  id: string;
  severity: string;
  source_capability: string;
  source_id?: string | null;
  source_type: string;
  state: string;
  title: string;
  updated_at: string;
}

export interface AttentionList {
  attentions: Attention[];
  unread_count: Int64String;
}

export interface AuctionBidView {
  bid_amount_minor: Int64String;
  bid_deposit_hold_id: string;
  bidder_principal_id: string;
  company_book_id: string;
  created_at: string;
  id: string;
  lot_id: string;
  status: string;
  tenant_id: string;
}

export interface AuctionLotView {
  auction_mode: string;
  company_book_id: string;
  created_at: string;
  current_highest_bid_minor: Int64String;
  end_time: string;
  id: string;
  lot_title: string;
  reserve_price_minor: Int64String;
  starting_price_minor: Int64String;
  status: string;
  tenant_id: string;
  winning_bidder_principal_id?: string | null;
}

export interface AuctionSettlementView {
  buyer_premium_minor: Int64String;
  company_book_id: string;
  created_at: string;
  id: string;
  lot_id: string;
  net_payout_minor: Int64String;
  seller_commission_minor: Int64String;
  status: string;
  tenant_id: string;
  winning_bid_minor: Int64String;
}

export interface AuditFindingContent {
  affected_period?: string | null;
  asserted_amount_minor?: Int64String | null;
  asserted_currency?: string | null;
  classification: string;
  description: string;
}

export interface AuditedCalkNotesView {
  accounting_policies_summary: string;
  audit_merkle_root_hash: string;
  audit_working_paper_ref: string;
  company_book_id: string;
  critical_accounting_estimates: string;
  currency: string;
  general_information: string;
  generated_at: string;
  period_end_date: string;
  period_start_date: string;
  reporting_standard: string;
  segment_reporting_notes: string[];
}

export interface AuditedCashFlowStatementView {
  audit_merkle_root_hash: string;
  beginning_cash_balance_minor: Int64String;
  company_book_id: string;
  currency: string;
  ending_cash_balance_minor: Int64String;
  financing_activities_minor: Int64String;
  generated_at: string;
  investing_activities_minor: Int64String;
  method: string;
  net_cash_flow_minor: Int64String;
  operating_activities_minor: Int64String;
  period_end_date: string;
  period_start_date: string;
  reporting_standard: string;
}

export interface AuditedChangesInEquityView {
  additional_paid_in_capital_minor: Int64String;
  audit_merkle_root_hash: string;
  company_book_id: string;
  currency: string;
  generated_at: string;
  other_comprehensive_income_minor: Int64String;
  period_end_date: string;
  period_start_date: string;
  reporting_standard: string;
  retained_earnings_minor: Int64String;
  share_capital_minor: Int64String;
  total_equity_minor: Int64String;
}

export interface AuditorDigitalSignatureView {
  auditor_firm_name: string;
  auditor_license_number: string;
  auditor_principal_id: string;
  auditor_public_key_fingerprint: string;
  auditor_signature_scope: string;
  company_book_id: string;
  fiscal_period: number;
  fiscal_year: number;
  id: string;
  merkle_root_hash: string;
  pki_signature_hex: string;
  signed_at: string;
  tenant_id: string;
}

export interface AuditorSignatureStatusView {
  company_book_id: string;
  is_signed: boolean;
  period_id: string;
  signature?: null | AuditorDigitalSignatureView;
  verification_status: string;
}

export interface AuditorWorkingPaperView {
  adjustment_scope: string;
  auditor_role: string;
  company_book_id: string;
  created_at: string;
  created_by_principal_id: string;
  division_code: string;
  fiscal_period: number;
  fiscal_year: number;
  id: string;
  paper_findings_json: unknown;
  paper_title: string;
  tenant_id: string;
}

export interface AuthorityComponentSummary {
  display_name: string;
  id: string;
  unrestricted: boolean;
}

export type AuthorityContextKind = "operational_role" | "owner";

export interface AuthorityContextList {
  authority_contexts: AuthorityContextSummary[];
  membership_read_visibility_revision: string;
}

export type AuthorityContextStatus = "active" | "revoked";

export interface AuthorityContextSummary {
  accounting_book_scope?: null | AccountingBookScopeSummary;
  authority_context_id: string;
  authority_revision: Int64String;
  context_group?: null | AuthorityComponentSummary;
  document_access_profile?: null | AuthorityComponentSummary;
  kind: AuthorityContextKind;
  membership_read_visibility_revision: string;
  role_display_name?: string | null;
  role_id?: string | null;
  role_system?: boolean | null;
  status: AuthorityContextStatus;
}

export interface AuthorityRevisionPreview {
  added_actions: string[];
  affected_principals: Int64String;
  current_authority_revision_id: string;
  elevated: boolean;
  permission_group_id: string;
  removed_actions: string[];
  role_id: string;
}

export interface AuthorizedCompanyBookView {
  authority_context_count: Int64String;
  display_name: string;
  functional_currency: string;
  id: string;
  membership_read_visibility_revision: string;
  read_only: boolean;
  status: CompanyBookStatus;
}

export interface AutoSyncDraftRequest {
  client_device_signature: string;
  draft_payload: unknown;
  draft_type: string;
}

export interface AutoSyncDraftView {
  client_device_signature: string;
  company_book_id: string;
  draft_payload: unknown;
  draft_type: string;
  id: string;
  synced: boolean;
  updated_at: string;
  user_principal_id: string;
}

export interface BadDebtProvisioningRunView {
  as_of_date: string;
  company_book_id: string;
  created_at: string;
  id: string;
  journal_entry_id?: string | null;
  provision_allowance_minor: Int64String;
  status: string;
  tenant_id: string;
  total_ar_outstanding_minor: Int64String;
}

export interface BalanceSheet {
  assets: BalanceSheetSection;
  equity: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  total_equity_minor: number;
}

export interface BalanceSheetLine {
  account_code: string;
  account_id: string;
  account_name: string;
  balance_minor: number;
}

export interface BalanceSheetSection {
  lines: BalanceSheetLine[];
  total_minor: number;
}

export interface BankAccount {
  account_name: string;
  account_number?: string | null;
  account_type: string;
  bank_code?: string | null;
  bank_name?: string | null;
  created_at: string;
  currency: string;
  dimension_value_ids: string[];
  gl_account_code?: string | null;
  id: string;
  institution_contact_id?: string | null;
  state_revision: Int64String;
  status: string;
  swift_code?: string | null;
  updated_at: string;
}

export interface BankAccountEvidence {
  evidence_type: string;
  integrity_sha256?: string | null;
  locator: string;
}

export interface BankAccountList {
  accounts: BankAccount[];
}

export interface BankCategorizationRuleView {
  company_book_id: string;
  created_at: string;
  description_pattern: string;
  id: string;
  priority: number;
  rule_name: string;
  status: string;
  target_account_number: string;
}

export interface BankFeedConnectionView {
  bank_name: string;
  company_book_id: string;
  connection_type: string;
  created_at: string;
  external_account_id: string;
  id: string;
  provider_name: string;
  status: string;
}

export interface BankFeedMatchConfirmationView {
  company_book_id: string;
  confirmed_at: string;
  id: string;
  journal_entry_id?: string | null;
  match_id: string;
  matched_invoice_id?: string | null;
  statement_line_id: string;
  status: string;
}

export interface BankFeedMatchView {
  company_book_id: string;
  confidence_score: number;
  created_at: string;
  id: string;
  match_status: string;
  matched_invoice_id?: string | null;
  statement_line_id: string;
  tenant_id: string;
}

export interface BankLineMatch {
  line_id: string;
  outcome: string;
  payment_ids: string[];
}

export interface BankMatchRun {
  already_resolved: Int64String;
  lines: BankLineMatch[];
  matched: Int64String;
  statement_id: string;
  suggested: Int64String;
  unmatched: Int64String;
}

export interface BankReconciliation {
  balanced: boolean;
  closing_balance: Int64String;
  difference: Int64String;
  finalized_at?: string | null;
  id: string;
  movement: Int64String;
  opening_balance: Int64String;
  statement_id: string;
  status: string;
  unresolved_lines: Int64String;
}

export interface BankStatement {
  bank_account_id: string;
  closing_balance: string;
  created_at: string;
  id: string;
  import_source: string;
  lines: BankStatementLine[];
  opening_balance: string;
  reconciliation_status: string;
  statement_date: string;
}

export interface BankStatementFeedIngestView {
  company_book_id: string;
  external_account_id: string;
  ingested_at: string;
  provider_name: string;
  records_ingested: number;
  status: string;
}

export interface BankStatementLine {
  amount: string;
  currency: string;
  description: string;
  id: string;
  match_status: string;
  matched_payment_id?: string | null;
  ordinal: number;
  raw_record?: unknown;
  reference?: string | null;
  transaction_date: string;
}

export interface BankStatementList {
  statements: BankStatementSummary[];
}

export interface BankStatementMappingOverride {
  column_mapping?: unknown;
  date_format?: string | null;
  decimal_separator?: string | null;
  delimiter?: string | null;
  has_header_row?: boolean | null;
  skip_lines?: number | null;
  thousand_separator?: string | null;
}

export interface BankStatementProfile {
  active: boolean;
  bank_name: string;
  channel: string;
  column_mapping: unknown;
  currency: string;
  date_format: string;
  decimal_separator: string;
  delimiter: string;
  format: string;
  has_header_row: boolean;
  id: string;
  skip_lines: number;
  thousand_separator: string;
}

export interface BankStatementProfileList {
  profiles: BankStatementProfile[];
}

export interface BankStatementSummary {
  bank_account_id: string;
  closing_balance: string;
  created_at: string;
  id: string;
  import_filename?: string | null;
  import_source: string;
  line_count: Int64String;
  opening_balance: string;
  reconciliation_status: string;
  statement_date: string;
}

export interface BarcodeLookupRequest {
  barcode: string;
}

export interface BarcodeLookupResponse {
  barcode: string;
  category: string;
  name: string;
  product_id: string;
  retail_price: Int64String;
  stock_level: number;
  uom: string;
  wholesale_min_qty?: number | null;
  wholesale_price?: Int64String | null;
}

export interface BatamFtzSettingsView {
  allow_usd_functional_currency: boolean;
  bp_batam_license_number: string;
  company_book_id: string;
  created_at: string;
  customs_registration_number?: string | null;
  default_ftz_tax_code: string;
  id: string;
  tenant_id: string;
}

export interface BatamFtzVatSummaryView {
  company_book_id: string;
  generated_at: string;
  ppftz_01_document_count: Int64String;
  ppftz_02_document_count: Int64String;
  ppftz_03_document_count: Int64String;
  tax_period: string;
  total_intra_ftz_delivery_minor: Int64String;
  total_tlddp_delivery_minor: Int64String;
  total_vat_collected_standard_minor: Int64String;
  total_vat_non_collectible_07_minor: Int64String;
}

export interface BillableHoursInvoiceView {
  company_book_id: string;
  created_at: string;
  customer_contact_id: string;
  invoice_id: string;
  period_end: string;
  period_start: string;
  sales_invoice_document_id?: string | null;
  status: string;
  total_billable_hours: number;
  total_invoice_amount_minor: Int64String;
}

export interface BillingOverviewResponse {
  base_company_fee_idr: Int64String;
  per_pos_transaction_fee_idr: Int64String;
  projected_mrr_idr: Int64String;
  total_active_companies: Int64String;
  total_live_approved_companies: Int64String;
  total_pos_transactions_current_month: Int64String;
  total_sandbox_companies: Int64String;
}

export interface BookComparisonLine {
  account_code: string;
  account_id: string;
  account_name: string;
  delta_minor: number;
  left_balance_minor: number;
  left_credit_minor: number;
  left_debit_minor: number;
  right_balance_minor: number;
  right_credit_minor: number;
  right_debit_minor: number;
}

export interface BookCourierDeliveryRequest {
  cod_amount_minor?: Int64String | null;
  courier_service_code: string;
  is_cod?: boolean | null;
  package_description?: string | null;
  provider_name: string;
  recipient_address: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_postal_code: string;
  sender_address: string;
  sender_name: string;
  sender_phone: string;
  sender_postal_code: string;
  weight_grams: number;
}

export interface BookDepreciationResultView {
  accumulated: Int64String;
  book_id: string;
  depreciated_through?: string | null;
  months_posted: number;
  nbv: Int64String;
  posted: PostedMonth[];
}

export interface BookListView {
  books: BookView[];
}

export interface BookView {
  created_at: string;
  effective_from: string;
  id: string;
  is_primary: boolean;
  lifecycle_changed_by?: string | null;
  lifecycle_effective_at: string;
  lifecycle_reason: string;
  lifecycle_recorded_at: string;
  lifecycle_state: LifecycleState;
  name: string;
  purpose: string;
  state_revision: Int64String;
}

export interface BookedCourierDeliveryView {
  awb_tracking_number: string;
  booked_at: string;
  company_book_id: string;
  courier_service_code: string;
  currency: string;
  delivery_id: string;
  id: string;
  label_barcode_data: string;
  label_pdf_url?: string | null;
  provider_name: string;
  shipping_cost_minor: Int64String;
  status: string;
  tracking_url?: string | null;
}

export interface BoundedAccountList {
  accounts: Account[];
  has_more: boolean;
  next_cursor?: string | null;
}

export interface BoundedFinancialLineList {
  book_id: string;
  has_more: boolean;
  lines: FinancialLine[];
  next_cursor?: string | null;
}

export interface BoundedTrialBalanceComparison {
  all_reconciled: boolean;
  as_of?: string | null;
  has_more: boolean;
  left_book_id: string;
  left_reconciliation: Reconciliation;
  left_total_credit_minor: number;
  left_total_debit_minor: number;
  lines: BookComparisonLine[];
  next_cursor?: string | null;
  right_book_id: string;
  right_reconciliation: Reconciliation;
  right_total_credit_minor: number;
  right_total_debit_minor: number;
}

export type BuiltByTier = "official" | "certified_partner" | "community";

export interface CadjLineInput {
  account_code: string;
  amount_minor: Int64String;
  description?: string | null;
  dimension_value_ids?: string[];
  direction: string;
  ordinal: number;
}

export interface CadjProposalContent {
  correction_route: string;
  currency: string;
  description: string;
  evidence?: EvidenceRefInput[];
  financial_date: string;
  ias8_rationale: string;
  lines: CadjLineInput[];
}

export interface CalculatePayrollRunRequest {
  include_commissions?: boolean | null;
  include_overtime?: boolean | null;
  period_month: number;
  period_year: number;
}

export interface CalculateProfitSharingRequest {
  agreement_id?: string | null;
  hurdle_amount_minor?: Int64String | null;
  partner_contact_id?: string | null;
  period_month: number;
  period_year: number;
  share_percentage?: number | null;
  split_type?: string | null;
  total_net_profit_minor: Int64String;
}

export interface CalculateShippingRatesRequest {
  courier_providers?: string[] | null;
  destination_postal_code: string;
  items_value_minor?: Int64String | null;
  origin_postal_code: string;
  weight_grams: number;
}

export interface CalculateWorkingCapitalContributionsRequest {
  contribution_basis?: string | null;
  contribution_percentage_rate?: number | null;
  net_working_capital_minor: Int64String;
  period_year: number;
  recipient_contact_id: string;
}

export type CalendarCategory = "statutory_compliance" | "tax_filing" | "accounting_close" | "treasury_due" | "payroll" | "custom_milestone";

export type CalendarEventSeverity = "info" | "warning" | "critical";

export type CalendarEventStatus = "pending" | "satisfied" | "overdue" | "dismissed";

export interface CalendarEventView {
  action_label?: string | null;
  action_url?: string | null;
  category: CalendarCategory;
  company_book_id: string;
  event_date: string;
  id: string;
  jurisdiction: string;
  severity: CalendarEventSeverity;
  source_capability?: string | null;
  source_id?: string | null;
  status: CalendarEventStatus;
  summary?: string | null;
  title: string;
}

export interface CalendarEventsSummaryView {
  company_book_id: string;
  critical_count: number;
  events: CalendarEventView[];
  pending_count: number;
  total_events: number;
  upcoming_30_days_count: number;
}

export type CapabilityReadiness = CapabilityReadinessState & { capability: string; company_book_id: string; decided_by: string; reason: string; };

export type CapabilityReadinessState = { state: "ready"; } | { state: "missing_required_configuration"; } | { state: "needs_review"; } | { state: "recommended_action"; } | { state: "not_applicable"; } | { operations: string[]; state: "blocked"; };

export interface CapabilitySettingInput {
  capability_key: string;
  effective_from: string;
  enabled: boolean;
  reason: string;
}

export interface CapabilitySettingView {
  capability_key: string;
  changed_by: string;
  created_at: string;
  effective_from: string;
  enabled: boolean;
  id: string;
  reason: string;
  version: Int64String;
}

export interface CashFlowLine {
  account_code: string;
  account_name: string;
  amount_minor: number;
  label: string;
}

export interface CashFlowSection {
  lines: CashFlowLine[];
  total_minor: number;
}

export interface CashFlowStatement {
  financing: CashFlowSection;
  investing: CashFlowSection;
  net_cash_change_minor: number;
  operating: CashFlowSection;
}

export interface CertifyProgressRequest {
  actual_cost_incurred_minor: Int64String;
  bast_document_ref?: string | null;
  certified_physical_progress_pct: number;
  period_index: number;
}

export interface ChangeRoleAuthorityRequest {
  permission_group_id: string;
  reason: string;
}

export interface ClaimConnectorVendorRequest {
  claim_verification_method?: string | null;
  counterparty_org_name: string;
  developer_id: string;
  official_domain_email: string;
  sentinel_proof_signature: string;
}

export interface ClaimConnectorVendorView {
  claim_id: string;
  claim_status: string;
  connector_id: string;
  counterparty_org_name: string;
  verified_at: string;
}

export interface ClaimGuestCounterparty {
  claim_token: string;
}

export interface ClaimedGuestCounterparty {
  connection_id: string;
  prepared_document_ids: string[];
}

export interface ClearDraftResultView {
  cleared: boolean;
  draft_type: string;
}

export interface CloseAuctionLotRequest {
  buyer_premium_rate_pct?: number | null;
  seller_commission_rate_pct?: number | null;
}

export interface ClosePosCashierSessionRequest {
  closing_cash_counted_minor: Int64String;
  session_id: string;
}

export interface CloseReadinessStatusView {
  close_readiness_score: number;
  company_book_id: string;
  daily_fx_revaluation_last_run?: string | null;
  daily_micro_depreciation_last_run?: string | null;
  fiscal_period: number;
  fiscal_year: number;
  ready_for_lock: boolean;
  reconciliation_matched_count: Int64String;
  status: string;
  updated_at: string;
}

export interface CodSettlementReconciliationView {
  awb_tracking_number: string;
  collected_amount_minor: Int64String;
  company_book_id: string;
  gateway_fee_minor: Int64String;
  id: string;
  journal_entry_id?: string | null;
  net_payout_minor: Int64String;
  reconciled_at: string;
  settlement_status: string;
  tenant_id: string;
}

export interface CommercialSalesOrder {
  contact_id: string;
  currency: string;
  document_date: string;
  document_number: string;
  id: string;
  lines: CommercialSalesOrderLine[];
  quote_conversion_id: string;
  source_customer_quote_id: string;
  status: string;
  subtotal: Int64String;
}

export interface CommercialSalesOrderLine {
  allocated_quantity: Int64String;
  description: string;
  id: string;
  line_total: Int64String;
  ordinal: number;
  source_customer_quote_line_id: string;
  unit_price: Int64String;
}

export interface CompanyAccountingFrameworkSettingsView {
  accounting_framework: string;
  company_book_id: string;
  created_at: string;
  effective_from: string;
  id: string;
  inventory_costing_method: string;
  tenant_id: string;
  use_us_gaap_presentation: boolean;
}

export interface CompanyBillingProfileView {
  base_monthly_fee_idr: Int64String;
  billing_status: string;
  company_book_id: string;
  environment: string;
  live_approval_notes?: string | null;
  live_approved_at?: string | null;
  live_approved_by?: string | null;
  per_pos_transaction_fee_idr: Int64String;
}

export interface CompanyBook {
  archived_at?: string | null;
  archived_by_principal_id?: string | null;
  display_name: string;
  functional_currency: string;
  id: string;
  read_only: boolean;
  status: CompanyBookStatus;
}

export interface CompanyBookList {
  company_books: AuthorizedCompanyBookView[];
  next_cursor?: string | null;
}

export type CompanyBookStatus = "active" | "archived";

export interface CompanyEmployeePayslipView {
  base_salary_minor: Int64String;
  bpjs_deduction_minor: Int64String;
  commissions_minor: Int64String;
  company_book_id: string;
  created_at: string;
  employee_contact_id: string;
  id: string;
  net_salary_minor: Int64String;
  overtime_pay_minor: Int64String;
  payroll_run_id: string;
  pph21_deduction_minor: Int64String;
  tenant_id: string;
}

export interface CompanyFixedAssetView {
  accumulated_depr_account_number: string;
  acquisition_cost_minor: Int64String;
  acquisition_date: string;
  asset_account_number: string;
  asset_code: string;
  asset_name: string;
  company_book_id: string;
  created_at: string;
  depreciation_expense_account_number: string;
  depreciation_method: string;
  id: string;
  salvage_value_minor: Int64String;
  status: string;
  tenant_id: string;
  useful_life_months: number;
}

export interface CompanyGroupHierarchyView {
  consolidation_method: string;
  created_at: string;
  id: string;
  ownership_percentage: number;
  parent_company_book_id: string;
  status: string;
  subsidiary_company_book_id: string;
  tenant_id: string;
}

export interface CompanyInstalledConnectorView {
  company_book_id: string;
  connector_id: string;
  connector_name: string;
  connector_slug: string;
  granted_permission_scopes: string[];
  id: string;
  installed_at: string;
  installed_version_semver: string;
  is_enabled: boolean;
  tenant_id: string;
}

export interface CompanyLegalHoldView {
  case_reference_number: string;
  company_book_id: string;
  created_at: string;
  gdpr_deletion_override: boolean;
  id: string;
  merkle_evidence_root_hash: string;
  status: string;
  tenant_id: string;
}

export interface CompanyWorkOrderView {
  assigned_technician_principal_id?: string | null;
  company_book_id: string;
  created_at: string;
  customer_contact_id: string;
  description: string;
  estimated_cost_minor: Int64String;
  estimated_labor_hours: number;
  id: string;
  status: string;
  tenant_id: string;
  work_order_number: string;
}

export interface CompleteWorkOrderRequest {
  actual_labor_hours?: number | null;
  completion_notes?: string | null;
}

export interface CompleteWorkOrderResultView {
  actual_labor_hours: number;
  company_book_id: string;
  completed_at: string;
  completion_notes?: string | null;
  id: string;
  status: string;
  tenant_id: string;
  work_order_id: string;
}

export interface ComponentRef {
  component_key: string;
  component_version: Int64String;
}

export interface ComposeStarterCoaRequest {
  enabled_capabilities: string[];
  jurisdiction: string;
  primary_operating_model: string;
}

export interface ConfigureAccountingFrameworkRequest {
  accounting_framework: string;
  effective_from: string;
  inventory_costing_method: string;
  use_us_gaap_presentation?: boolean | null;
}

export interface ConfigureBatamFtzJurisdictionRequest {
  allow_usd_functional_currency?: boolean | null;
  bp_batam_license_number: string;
  customs_registration_number?: string | null;
  default_ftz_tax_code?: string | null;
}

export interface ConfigureHoldingSamplingRuleRequest {
  audit_entity_level?: string | null;
  audit_status?: string | null;
  holding_perimeter_id: string;
  sample_rule_name: string;
  sampled_journal_id: string;
  subsidiary_company_book_id: string;
}

export interface ConfigureUaeJurisdictionRequest {
  corporate_tax_exemption?: boolean | null;
  free_zone_name?: string | null;
  is_free_zone_qfzp?: boolean | null;
  trn_number: string;
  vat_stagger_period?: string | null;
}

export interface ConfirmBankFeedMatchRequest {
  clearing_account_number?: string | null;
  matched_invoice_id?: string | null;
}

export interface ConfirmOnboardingRequest {
  admitted_relationship_id: string;
}

export interface ConfirmOnboardingResponse {
  company_book: CompanyBook;
  initial_readiness: CapabilityReadiness[];
  owner_membership_id: string;
  starter_coa_preview?: null | StarterCoaPreview;
}

export interface Connection {
  counterparty: DirectoryProfile;
  decision_reason?: string | null;
  direction: string;
  id: string;
  message?: string | null;
  status: string;
}

export interface ConsolidatedBalanceSheetView {
  cta_translation_reserve_minor: Int64String;
  generated_at: string;
  non_controlling_interest_minor: Int64String;
  parent_company_book_id: string;
  parent_equity_minor: Int64String;
  period_month: number;
  period_year: number;
  presentation_currency: string;
  status: string;
  total_consolidated_assets_minor: Int64String;
  total_consolidated_liabilities_minor: Int64String;
}

export interface ConsolidatedTrialBalanceView {
  lines: ConsolidationLineItem[];
  perimeter_id: string;
  presentation_currency: string;
  total_consolidated_credit_minor: number;
  total_consolidated_debit_minor: number;
  total_elimination_credit_minor: number;
  total_elimination_debit_minor: number;
  total_gross_credit_minor: number;
  total_gross_debit_minor: number;
  zero_net_internal_leakage: boolean;
}

export interface ConsolidationLineItem {
  account_code: string;
  account_name: string;
  balance_minor: number;
  consolidated_credit_minor: number;
  consolidated_debit_minor: number;
  elimination_credit_minor: number;
  elimination_debit_minor: number;
  gross_credit_minor: number;
  gross_debit_minor: number;
}

export interface ConsolidationMemberView {
  created_at: string;
  effective_from: string;
  effective_to?: string | null;
  ownership_percentage: number;
  perimeter_id: string;
  subsidiary_company_book_id: string;
}

export interface ConsolidationPerimeterView {
  created_at: string;
  holding_company_book_id: string;
  id: string;
  perimeter_name: string;
  presentation_currency: string;
}

export interface Contact {
  active: boolean;
  created_at: string;
  dimension_value_ids: string[];
  email?: string | null;
  id: string;
  is_self: boolean;
  kind: string;
  name: string;
  notes?: string | null;
  tax_id?: string | null;
  telephone?: string | null;
  updated_at: string;
}

export interface ContactAddress {
  address_country: string;
  address_locality?: string | null;
  address_region?: string | null;
  contact_id: string;
  id: string;
  is_primary: boolean;
  label?: string | null;
  postal_code?: string | null;
  street_address: string;
}

export interface ContactBankAccount {
  account_number: string;
  active: boolean;
  bank_name: string;
  contact_id: string;
  country?: string | null;
  currency?: string | null;
  id: string;
  is_primary: boolean;
  swift?: string | null;
}

export interface ContactCreditLimitView {
  company_book_id: string;
  contact_id: string;
  created_at: string;
  credit_hold_active: boolean;
  credit_limit_minor: Int64String;
  grace_period_days: number;
  id: string;
  status: string;
  tenant_id: string;
}

export interface ContactList {
  contacts: Contact[];
}

export interface ContactOrganization {
  contact_id: string;
  industry?: string | null;
  legal_name: string;
  lei?: string | null;
  registration_no?: string | null;
  website?: string | null;
}

export interface ContactPerson {
  additional_name?: string | null;
  birth_date?: string | null;
  contact_id: string;
  family_name?: string | null;
  gender?: number | null;
  gender_description?: string | null;
  given_name: string;
}

export interface ContactProfile {
  about?: string | null;
  contact_id: string;
  headline?: string | null;
  links: ContactProfileLink[];
  location?: string | null;
  photo_url?: string | null;
  website?: string | null;
}

export interface ContactProfileLink {
  active: boolean;
  contact_id: string;
  id: string;
  label?: string | null;
  platform: string;
  url: string;
}

export interface ContactRelationship {
  active: boolean;
  effective_from: string;
  effective_to?: string | null;
  from_contact_id: string;
  id: string;
  notes?: string | null;
  ownership_basis_points?: number | null;
  relationship_type: string;
  title?: string | null;
  to_contact_id: string;
}

export interface ContactRole {
  active: boolean;
  contact_id: string;
  credit_limit?: Int64String | null;
  current: boolean;
  default_account?: string | null;
  effective_from: string;
  effective_to?: string | null;
  id: string;
  payment_terms_days?: number | null;
  risk_note?: string | null;
  role: string;
}

export interface ContinuousCloseScheduleView {
  close_readiness_score: number;
  company_book_id: string;
  daily_fx_revaluation_last_run?: string | null;
  daily_micro_depreciation_last_run?: string | null;
  fiscal_period: number;
  fiscal_year: number;
  id: string;
  reconciliation_matched_count: Int64String;
  status: string;
  tenant_id: string;
  updated_at: string;
}

export interface ContractLossAllocationView {
  capital_provider_loss_minor: Int64String;
  company_book_id: string;
  contract_id: string;
  created_at: string;
  id: string;
  operator_loss_minor: Int64String;
  period_id: string;
  tenant_id: string;
  total_loss_minor: Int64String;
}

export type ConversionAction = "within_quote" | "adjust_po" | "revise_quote" | "new_quote" | "linked_exception" | "standalone_exception" | "detach_to_standalone";

export interface ConversionOutcome {
  action: ConversionAction;
  conversion_id: string;
  lines: LineVariance[];
  purchase_order_id?: string | null;
  source_quote_id: string;
  status: string;
  target_quote_id?: string | null;
  warning: boolean;
}

export interface ConversionPreview {
  expired: boolean;
  lines: LineVariance[];
  offered_actions: ConversionAction[];
  source_quote_id: string;
  source_quote_status: string;
  warning: boolean;
  warning_message?: string | null;
}

export interface ConvertCustomerQuote {
  allocations: QuoteOrderAllocation[];
  memo?: string | null;
  order_date: string;
}

export interface ConvertQuoteToInvoiceRequest {
  due_date?: string | null;
  invoice_issue_date?: string | null;
}

export interface ConvertedQuoteToInvoiceView {
  company_book_id: string;
  converted_at: string;
  quote_id: string;
  sales_invoice_id: string;
  status: string;
}

export interface CorporateRestructuringEventView {
  carveout_perimeter_json: unknown;
  company_book_id: string;
  created_at: string;
  created_by_principal_id: string;
  effective_date: string;
  event_type: string;
  goodwill_recognized_minor: Int64String;
  id: string;
  target_entity_name: string;
  tenant_id: string;
  transaction_valuation_minor: Int64String;
}

export interface CreateAccount {
  active?: boolean;
  code: string;
  manual_entry_allowed?: boolean;
  name: string;
  normal_balance: string;
}

export interface CreateAccountingPeriod {
  financial_end: string;
  financial_start: string;
}

export interface CreateAdmission {
  client_application_id: string;
  data_handling_notice: string;
  exit_export_route: string;
  expires_at: string;
  participant_id?: string | null;
  principal_id: string;
  reason: string;
  review_at: string;
  starts_at: string;
  support_contact: string;
}

export interface CreateAssetCategoryRequest {
  name: string;
}

export interface CreateAssignmentRequest {
  principal_id: string;
  role_id: string;
}

export interface CreateAuctionLotRequest {
  auction_mode?: string | null;
  end_time: string;
  lot_title: string;
  reserve_price_minor?: Int64String | null;
  starting_price_minor: Int64String;
}

export interface CreateAuditorWorkingPaperRequest {
  adjustment_scope?: string | null;
  auditor_role: string;
  division_code?: string | null;
  fiscal_period: number;
  fiscal_year: number;
  paper_findings_json: unknown;
  paper_title: string;
}

export interface CreateBankAccount {
  account_name: string;
  account_number?: string | null;
  account_type: string;
  bank_code?: string | null;
  bank_name?: string | null;
  currency: string;
  dimension_value_ids?: string[] | null;
  gl_account_code?: string | null;
  institution_contact_id?: string | null;
  swift_code?: string | null;
}

export interface CreateBankCategorizationRuleRequest {
  description_pattern: string;
  priority?: number | null;
  rule_name: string;
  target_account_number: string;
}

export interface CreateBankFeedConnectionRequest {
  bank_name: string;
  connection_type?: string | null;
  external_account_id: string;
  provider_name: string;
}

export interface CreateBankStatement {
  bank_account_id: string;
  closing_balance: string;
  lines: CreateBankStatementLine[];
  opening_balance: string;
  statement_date: string;
}

export interface CreateBankStatementLine {
  amount: string;
  currency: string;
  description: string;
  reference?: string | null;
  transaction_date: string;
}

export interface CreateBookInput {
  effective_from: string;
  name: string;
  purpose: string;
  reason: string;
}

export interface CreateBusinessEventRuleRequest {
  classification_result?: string | null;
  metric_trigger_condition: string;
  rule_name: string;
}

export interface CreateCompanyBook {
  display_name: string;
  enabled_capabilities?: string[];
  functional_currency: string;
  jurisdiction_id?: string | null;
  operating_model?: string | null;
}

export interface CreateConsolidationPerimeterRequest {
  perimeter_name: string;
  presentation_currency: string;
}

export interface CreateContact {
  dimension_value_ids?: string[] | null;
  email?: string | null;
  kind: string;
  name: string;
  notes?: string | null;
  tax_id?: string | null;
  telephone?: string | null;
}

export interface CreateContactAddress {
  address_country: string;
  address_locality?: string | null;
  address_region?: string | null;
  is_primary?: boolean | null;
  label?: string | null;
  postal_code?: string | null;
  street_address: string;
}

export interface CreateContactBankAccount {
  account_number: string;
  bank_name: string;
  country?: string | null;
  currency?: string | null;
  is_primary?: boolean | null;
  swift?: string | null;
}

export interface CreateContactProfileLink {
  label?: string | null;
  platform: string;
  url: string;
}

export interface CreateContactRelationship {
  effective_from: string;
  effective_to?: string | null;
  notes?: string | null;
  ownership_basis_points?: number | null;
  relationship_type: string;
  title?: string | null;
  to_contact_id: string;
}

export interface CreateContactRole {
  credit_limit?: Int64String | null;
  default_account?: string | null;
  effective_from?: string | null;
  effective_to?: string | null;
  payment_terms_days?: number | null;
  risk_note?: string | null;
  role: string;
}

export interface CreateCustomCalendarEventRequest {
  action_label?: string | null;
  action_url?: string | null;
  category: CalendarCategory;
  event_date: string;
  jurisdiction?: string | null;
  severity?: null | CalendarEventSeverity;
  summary?: string | null;
  title: string;
}

export interface CreateCustomerSubscriptionRequest {
  auto_renew?: boolean | null;
  contact_id: string;
  current_period_end: string;
  current_period_start: string;
  mrr_value_minor: Int64String;
  next_billing_date: string;
  plan_id: string;
}

export interface CreateDelivery {
  carrier?: string | null;
  delivery_date: string;
  lines: CreateDeliveryLine[];
  received_date?: string | null;
  sales_document_id: string;
  ship_to_contact_id?: string | null;
  shipping_address_id?: string | null;
  tracking_number?: string | null;
}

export interface CreateDeliveryLine {
  description: string;
  item_id?: string | null;
  quantity: Int64String;
  sales_document_line_id: string;
}

export interface CreateDimensionValue {
  code: string;
  name: string;
  parent_value_id?: string | null;
}

export interface CreateDiscountRuleRequest {
  discount_category: string;
  discount_percentage?: number | null;
  effective_from?: string | null;
  effective_to?: string | null;
  fixed_discount_minor?: Int64String | null;
  margin_guard_floor_percentage?: number | null;
  min_order_value_minor?: Int64String | null;
  rule_name: string;
}

export interface CreateEmployeePayrollProfileRequest {
  allowances_minor?: Int64String | null;
  base_salary_minor: Int64String;
  employee_name: string;
  npwp_number?: string | null;
  ptkp_status?: string | null;
  ter_category?: string | null;
}

export interface CreateEngagementRequest {
  engagement_code: string;
  engagement_type: string;
}

export interface CreateExpenseClaim {
  business_purpose?: string | null;
  claim_date: string;
  claimant_contact_id: string;
  currency: string;
  description?: string | null;
  dimension_value_ids?: string[] | null;
  lines: CreateExpenseLine[];
  period_end?: string | null;
  period_start?: string | null;
}

export interface CreateExpenseLine {
  amount: string;
  category?: string | null;
  description: string;
  dimension_value_ids?: string[] | null;
  expense_account?: string | null;
  expense_date: string;
  tax_amount?: string | null;
  tax_profile_id?: string | null;
}

export interface CreateFindingRequest {
  content: AuditFindingContent;
  finding_code: string;
}

export interface CreateFixedAsset {
  acquired_date: string;
  asset_category_id: string;
  asset_class: string;
  barcode?: string | null;
  category?: string | null;
  cost: Int64String;
  custodian_contact_id?: string | null;
  depreciation_method?: string | null;
  depreciation_rate?: string | null;
  description?: string | null;
  dimension_value_ids?: string[] | null;
  funding_account?: string | null;
  gl_asset: string;
  insurer_contact_id?: string | null;
  location?: string | null;
  name: string;
  parent_asset_id?: string | null;
  registration_no?: string | null;
  salvage?: Int64String | null;
  serial_number?: string | null;
  supplier_contact_id?: string | null;
  useful_life_months: number;
}

export interface CreateGuestCounterparty {
  display_name: string;
}

export interface CreateImportDeclaration {
  authority_reference?: string | null;
  customs_currency: string;
  customs_value?: Int64String | null;
  declaration_date: string;
  declaration_number: string;
  duty_total?: Int64String | null;
  exchange_rate?: string | null;
  import_tax_total?: Int64String | null;
  incoterm?: string | null;
  lines: CreateImportDeclarationLine[];
  memo?: string | null;
  other_charges_total?: Int64String | null;
  port_of_entry?: string | null;
  purchase_document_ids?: string[];
}

export interface CreateImportDeclarationLine {
  customs_value?: Int64String | null;
  description: string;
  duty_amount?: Int64String | null;
  import_tax_amount?: Int64String | null;
  imported_form?: string | null;
  item_id?: string | null;
  quantity?: Int64String | null;
  tariff_code?: string | null;
}

export interface CreateInventoryLocation {
  is_primary?: boolean;
  location_code: string;
  location_name: string;
}

export interface CreateInventoryTransfer {
  from_location_id: string;
  status?: string | null;
  to_location_id: string;
  transfer_date: string;
  transfer_number: string;
}

export interface CreateInventoryTransformation {
  abnormal_loss_value?: Int64String | null;
  bom_id?: string | null;
  consume: TransformationConsume[];
  kind: string;
  produce: TransformationProduce[];
  transformation_date: string;
}

export interface CreateInvitationRequest {
  email: string;
  role_id: RoleId;
}

export interface CreateItem {
  aliases?: string[] | null;
  barcode?: string | null;
  description?: string | null;
  dimension_value_ids?: string[] | null;
  kind: string;
  max_stock_level?: Int64String | null;
  min_stock_level?: Int64String | null;
  name: string;
  parent_item_id?: string | null;
  preferred_supplier_contact_id?: string | null;
  purchase_account?: string | null;
  purchase_price?: Int64String | null;
  sale_account?: string | null;
  sale_price?: Int64String | null;
  sku?: string | null;
  taxable?: boolean;
  unit?: string | null;
}

export interface CreateLandedCostApportionment {
  apportionment_date: string;
  basis: string;
  lines: CreateLandedCostLine[];
  memo?: string | null;
  purchase_document_id: string;
}

export interface CreateLandedCostLine {
  amount: string;
  capitalise?: boolean | null;
  cost_type: string;
  description?: string | null;
  vendor_contact_id?: string | null;
}

export interface CreateLead {
  contact_id: string;
  currency: string;
  estimated_deal_amount?: string | null;
  lead_code: string;
  lead_source: string;
}

export interface CreateMonthlyPayrollRunRequest {
  period_month: number;
  period_year: number;
  total_bpjs_employee_minor: Int64String;
  total_bpjs_employer_minor: Int64String;
  total_gross_salary_minor: Int64String;
  total_pph21_withheld_minor: Int64String;
}

export interface CreatePayment {
  amount: Int64String;
  bank_account_id: string;
  contact_id: string;
  currency: string;
  dimension_value_ids?: string[] | null;
  direction: string;
  memo?: string | null;
  payment_date: string;
  payment_method?: string | null;
  reference?: string | null;
}

export interface CreatePayrollLine {
  allowances?: Int64String | null;
  bank_account_id?: string | null;
  bonus?: Int64String | null;
  bpjs_employee?: Int64String | null;
  bpjs_employer?: Int64String | null;
  employee_contact_id: string;
  gross: Int64String;
  other_deductions?: Int64String | null;
  overtime?: Int64String | null;
  pph21?: Int64String | null;
}

export interface CreatePayrollRun {
  functional_currency: string;
  lines: CreatePayrollLine[];
  pay_date: string;
  period: string;
}

export interface CreatePersonInCharge {
  effective_from?: string | null;
  email?: string | null;
  family_name?: string | null;
  gender?: number | null;
  gender_description?: string | null;
  given_name?: string | null;
  name?: string | null;
  person_contact_id?: string | null;
  relationship_type?: string | null;
  telephone?: string | null;
  title?: string | null;
}

export interface CreatePocProjectBudgetRequest {
  contract_value_minor: Int64String;
  project_id: string;
  total_budgeted_cost_minor: Int64String;
}

export interface CreateProposalRequest {
  proposal_code: string;
}

export interface CreatePurchaseDocument {
  contact_id: string;
  currency: string;
  dimension_value_ids?: string[] | null;
  document_date: string;
  document_type: string;
  due_date?: string | null;
  lines: CreatePurchaseLine[];
  matched_po_id?: string | null;
  matched_receipt_id?: string | null;
  memo?: string | null;
  parent_document_id?: string | null;
  prices_include_tax?: boolean | null;
  received_date?: string | null;
  vendor_invoice_number?: string | null;
}

export interface CreatePurchaseLine {
  description: string;
  dimension_value_ids?: string[] | null;
  discount_amount?: Int64String | null;
  expense_account?: string | null;
  item_id?: string | null;
  quantity: Int64String;
  tax_profile_id?: string | null;
  taxable?: boolean;
  unit?: string | null;
  unit_price: Int64String;
  withholding_profile_id?: string | null;
}

export interface CreateReversalRequest {
  reason: string;
  reversal_financial_date: string;
}

export interface CreateRoleRequest {
  description?: string | null;
  permission_group_id: string;
  suffix: string;
}

export interface CreateSalesDocument {
  contact_id: string;
  currency: string;
  dimension_value_ids?: string[] | null;
  document_date: string;
  document_type: string;
  due_date?: string | null;
  lines: CreateSalesLine[];
  memo?: string | null;
  parent_document_id?: string | null;
  prices_include_tax?: boolean | null;
  reference?: string | null;
  salesperson_id?: string | null;
}

export interface CreateSalesLine {
  description: string;
  dimension_value_ids?: string[] | null;
  discount_amount?: Int64String | null;
  item_id?: string | null;
  quantity: Int64String;
  revenue_account?: string | null;
  tax_profile_id?: string | null;
  taxable?: boolean;
  unit?: string | null;
  unit_price: Int64String;
  withholding_profile_id?: string | null;
}

export interface CreateSalesOpportunityRequest {
  assigned_sales_rep_principal_id?: string | null;
  contact_id: string;
  estimated_amount_minor?: Int64String | null;
  opportunity_name: string;
  pipeline_stage?: string | null;
  win_probability_pct?: number | null;
}

export interface CreateSalesQuoteRequest {
  contact_id: string;
  expiry_date: string;
  grand_total_minor: Int64String;
  opportunity_id?: string | null;
  quote_date: string;
  quote_number: string;
  subtotal_minor: Int64String;
  tax_total_minor: Int64String;
}

export interface CreateServiceBilling {
  allocations: ServiceBillingAllocationInput[];
  document_date: string;
  due_date?: string | null;
  evidence_digest: string;
  evidence_reference: string;
  reason: string;
}

export interface CreateServiceContractAssessment {
  classification: ServiceRevenueClassification;
  contract_modification: boolean;
  currency: string;
  fixed_transaction_price: Int64String;
  paragraph_35_a_met: boolean;
  paragraph_35_b_met: boolean;
  paragraph_35_c_met: boolean;
  performance_obligations: ServicePerformanceObligationInput[];
  principal_agent_issue: boolean;
  qualified_assessment_reference: string;
  qualified_assessment_sha256: string;
  variable_consideration: boolean;
}

export interface CreateServiceFakturMonetaryAssessment {
  aggregation_level: string;
  calculation_contract_identity: string;
  commercial_terms_reference: string;
  commercial_terms_sha256: string;
  currency: string;
  dpp: Int64String;
  dpp_method: string;
  dpp_method_version: string;
  faktur_evidence_reference: string;
  faktur_evidence_sha256: string;
  faktur_status: string;
  gross_customer_amount: Int64String;
  nominal_ppn_rate_basis_points: number;
  official_source_checked_on: string;
  official_source_reference: string;
  official_source_sha256: string;
  output_ppn: Int64String;
  penggantian: Int64String;
  rounding_contract_reference: string;
  rounding_contract_sha256: string;
  rounding_mode: string;
  service_invoice_id: string;
  service_tax_point_assessment_id: string;
}

export interface CreateServiceFulfillment {
  evidence_digest: string;
  evidence_reference: string;
  lines: ServiceFulfillmentLineInput[];
  performed_from: string;
  performed_through: string;
  reason: string;
}

export interface CreateServiceRecognitionReadinessAssessment {
  obligation_satisfactions: ServiceObligationSatisfactionInput[];
  tax_point_assessments: ServiceTaxPointAssessmentInput[];
}

export interface CreateSubscriptionPlanRequest {
  billing_interval?: string | null;
  currency?: string | null;
  plan_code: string;
  plan_name: string;
  price_minor: Int64String;
}

export interface CreateSupplierQuote {
  connector_idempotency_key?: string | null;
  contact_id: string;
  currency: string;
  external_company_ref?: string | null;
  external_content_sha256?: string | null;
  external_party_ref?: string | null;
  external_quote_ref?: string | null;
  external_revision_ref?: string | null;
  lines: SupplierQuoteLine[];
  memo?: string | null;
  quote_date: string;
  source_system?: string | null;
  supplier_reference: string;
  valid_until: string;
}

export interface CreateTemplateDefinitionRequest {
  category: string;
  locale?: string | null;
  name: string;
  source_capability: string;
  template_key: string;
  variable_schema: unknown;
}

export interface CreateTemplateVersionRequest {
  content_payload: string;
  style_metadata?: unknown;
  subject_pattern?: string | null;
  version: number;
}

export interface CreateTemporaryPostingLock {
  expires_at?: string | null;
  reason: string;
}

export interface CreateTreatmentRequest {
  annual_rate_basis_points?: number | null;
  authority_reference: string;
  classification_reference?: string | null;
  effective_from: string;
  method: string;
  policy_reference: string;
  reason: string;
  residual_value: Int64String;
  useful_life_months: number;
}

export interface CreateUniversalContractRequest {
  capital_ratio?: number | null;
  contract_mode?: string | null;
  profit_split_ratio?: number | null;
}

export interface CreateUserReferralCodeRequest {
  custom_referral_code?: string | null;
}

export interface CreateWealthPortfolioRequest {
  asset_class: string;
  currency?: string | null;
  current_valuation_minor?: Int64String | null;
  family_group_id: string;
  portfolio_name: string;
}

export interface CreateWebhookSubscriptionRequest {
  event_types: string[];
  secret: string;
  target_url: string;
}

export interface CreateWorkOrderRequest {
  assigned_technician_principal_id?: string | null;
  customer_contact_id: string;
  description: string;
  estimated_cost_minor?: Int64String | null;
  estimated_labor_hours?: number | null;
  work_order_number: string;
}

export interface CustomerLoyaltyAccountView {
  company_book_id: string;
  created_at: string;
  current_points_balance: Int64String;
  customer_contact_id: string;
  id: string;
  lifetime_points_earned: Int64String;
  status: string;
  tenant_id: string;
  tier_level: string;
}

export interface CustomerLoyaltyPointsResultView {
  account: CustomerLoyaltyAccountView;
  entry: PointLedgerEntryView;
}

export interface CustomerQuote {
  accepted_at?: string | null;
  contact_id: string;
  created_at: string;
  currency: string;
  customer_reference?: string | null;
  document_number: string;
  id: string;
  lines: CustomerQuoteLine[];
  memo?: string | null;
  quote_date: string;
  revision_number: Int64String;
  revision_of_id?: string | null;
  state_revision: Int64String;
  status: QuoteState;
  subtotal: Int64String;
  terms: string;
  updated_at: string;
  valid_until: string;
}

export interface CustomerQuoteConversion {
  conversion_id: string;
  sales_order: CommercialSalesOrder;
  source_quote_id: string;
}

export interface CustomerQuoteLifecycleRequest {
  reason?: string | null;
  target_status: QuoteState;
}

export interface CustomerQuoteLine {
  description: string;
  discount_amount: Int64String;
  id: string;
  item_id?: string | null;
  line_total: Int64String;
  ordinal: number;
  quantity: Int64String;
  unit?: string | null;
  unit_price: Int64String;
}

export interface CustomerQuoteLineRequest {
  description: string;
  discount_amount?: Int64String;
  item_id?: string | null;
  quantity: Int64String;
  unit?: string | null;
  unit_price: Int64String;
}

export interface CustomerQuoteRequest {
  contact_id: string;
  currency: string;
  customer_reference?: string | null;
  lines: CustomerQuoteLineRequest[];
  memo?: string | null;
  quote_date: string;
  terms: string;
  valid_until: string;
}

export type CustomerStatus = "pending" | "accepted" | "rejected";

export interface CustomerSubscriptionView {
  auto_renew: boolean;
  company_book_id: string;
  contact_id: string;
  created_at: string;
  current_period_end: string;
  current_period_start: string;
  id: string;
  mrr_value_minor: Int64String;
  next_billing_date: string;
  plan_id: string;
  status: string;
  tenant_id: string;
}

export interface DataSovereigntyExportView {
  company_book_id: string;
  created_at: string;
  download_url: string;
  expires_at: string;
  export_format: string;
  export_id: string;
}

export interface DecideConnection {
  decision: string;
  reason?: string | null;
}

export interface Decision {
  reason?: string | null;
}

export interface Delivery {
  carrier?: string | null;
  created_at: string;
  delivery_date: string;
  delivery_number: string;
  dimension_value_ids: string[];
  id: string;
  lines: DeliveryLine[];
  received_date?: string | null;
  sales_document_id: string;
  ship_to_contact_id?: string | null;
  shipping_address_id?: string | null;
  status: string;
  tracking_number?: string | null;
  updated_at: string;
}

export interface DeliveryLine {
  description: string;
  id: string;
  item_id?: string | null;
  quantity: Int64String;
  sales_document_line_id: string;
}

export interface DeliveryList {
  deliveries: Delivery[];
}

export interface DepreciateRequest {
  book_ids: string[];
  through: string;
}

export interface DepreciationResult {
  asset_id: string;
  books: BookDepreciationResultView[];
}

export interface DetectBankStatement {
  file_content: string;
}

export interface DetectedBankStatementMapping {
  delimiter: string;
  has_header_row: boolean;
  headers: string[];
  preview_rows: string[][];
  suggested_mapping: unknown;
  warnings: string[];
}

export interface DeveloperKeyItem {
  created_at: string;
  environment: string;
  id: string;
  key_name: string;
  key_prefix: string;
  last_used_at?: string | null;
  last_used_ip?: string | null;
  owner_email?: string | null;
  owner_name?: string | null;
  retiring_at?: string | null;
  revoke_reason?: string | null;
  revoked_at?: string | null;
  scopes: string[];
  status: string;
  total_requests: Int64String;
}

export interface DeveloperKeyMetricsItem {
  environment: string;
  key_id: string;
  key_name: string;
  key_prefix: string;
  owner_email?: string | null;
  status: string;
  total_api_requests: Int64String;
  total_companies_created: Int64String;
  total_gmv_amount: Int64String;
  total_pos_transactions: Int64String;
}

export interface DeveloperSandboxResetView {
  company_book_id: string;
  environment_mode: string;
  reset_at: string;
  sandbox_reset_count: number;
  status: string;
}

export interface DeviceSyncStatusView {
  client_device_signature: string;
  company_book_id: string;
  last_synced_at?: string | null;
  pending_queue_count: Int64String;
  records: SyncOfflineRecordView[];
  total_synced_count: Int64String;
}

export interface DimensionDefinition {
  active: boolean;
  applies_to: string;
  code: string;
  created_at: string;
  id: string;
  kind: string;
  name: string;
  system_seed: boolean;
  updated_at: string;
}

export interface DimensionDefinitionList {
  definitions: DimensionDefinition[];
}

export interface DimensionRequirementInput {
  account_class?: string | null;
  account_role?: string | null;
  definition_id: string;
  document_type?: string | null;
  effective_from: string;
  line_context?: string | null;
  reason: string;
  required: boolean;
  source_capability?: string | null;
}

export interface DimensionRequirementView {
  account_class?: string | null;
  account_role?: string | null;
  changed_by: string;
  created_at: string;
  definition_id: string;
  document_type?: string | null;
  effective_from: string;
  id: string;
  line_context?: string | null;
  reason: string;
  required: boolean;
  source_capability?: string | null;
  version: Int64String;
}

export interface DimensionValue {
  active: boolean;
  code: string;
  created_at: string;
  definition_id: string;
  id: string;
  name: string;
  parent_value_id?: string | null;
  updated_at: string;
}

export interface DimensionValueList {
  values: DimensionValue[];
}

export interface DirectoryProfile {
  display_name: string;
  handle: string;
  verified: boolean;
}

export interface DisburseH2hIso20022PaymentRequest {
  bank_code: string;
  creditor_account_number: string;
  creditor_name: string;
  currency: string;
  debtor_account_number: string;
  end_to_end_id?: string | null;
  external_message_id?: string | null;
  instructed_amount_minor: Int64String;
  raw_pain001_xml?: string | null;
}

export interface DisburseH2hIso20022PaymentView {
  bank_code: string;
  company_book_id: string;
  currency: string;
  disbursed_at: string;
  external_message_id: string;
  id: string;
  instructed_amount_minor: Int64String;
  message_type: string;
  status: string;
  tenant_id: string;
}

export interface DisburseSalaryPayoutsRequest {
  bank_account_id: string;
  payment_method?: string | null;
  payroll_run_id: string;
}

export interface DisburseSalaryPayoutsView {
  bank_account_id: string;
  company_book_id: string;
  disbursed_at: string;
  id: string;
  journal_entry_id?: string | null;
  payroll_run_id: string;
  status: string;
  total_net_disbursed_minor: Int64String;
}

export interface DiscountRuleView {
  company_book_id: string;
  created_at: string;
  discount_category: string;
  discount_percentage: number;
  effective_from: string;
  effective_to?: string | null;
  fixed_discount_minor: Int64String;
  id: string;
  margin_guard_floor_percentage: number;
  min_order_value_minor: Int64String;
  rule_name: string;
}

export interface DispatchSleekSignDocumentRequest {
  custom_message?: string | null;
  document_title: string;
  document_type: string;
  recipient_email: string;
  recipient_name: string;
}

export interface DisposeFixedAssetRequest {
  disposal_date: string;
  disposal_proceeds_minor: Int64String;
  gain_loss_account_number?: string | null;
  notes?: string | null;
  proceeds_account_number?: string | null;
}

export interface DisposeRequest {
  date: string;
  proceeds?: Int64String | null;
}

export interface DisputeSalesInvoiceRequest {
  dispute_reason: string;
  disputed_amount_minor: Int64String;
  payer_contact_id?: string | null;
}

export interface DisputeSalesInvoiceResultView {
  company_book_id: string;
  created_at: string;
  dispute_reason: string;
  dispute_sub_invoice_id: string;
  disputed_amount_minor: Int64String;
  id: string;
  original_invoice_id: string;
  status: string;
  tenant_id: string;
}

export interface DistributePartnerProfitRequest {
  agreement_id?: string | null;
  disbursement_method?: string | null;
  partner_contact_id: string;
  payout_amount_minor: Int64String;
  period_month: number;
  period_year: number;
  source_bank_account_id?: string | null;
}

export interface DivisionAuditPaperSummary {
  auditor_role: string;
  division_code: string;
  papers: AuditorWorkingPaperView[];
  total_working_papers: Int64String;
}

export interface DocumentActiveEditorView {
  display_name: string;
  editing_since: string;
  email: string;
  lock_expires_at: string;
  principal_id: string;
}

export interface DocumentActiveViewerView {
  display_name: string;
  email: string;
  principal_id: string;
  viewing_since: string;
}

export interface DocumentLockView {
  document_id: string;
  document_type: string;
  expires_at: string;
  lock_id: string;
  locked_at: string;
  locked_by_display_name: string;
  locked_by_email: string;
  locked_by_principal_id: string;
  minutes_remaining: Int64String;
}

export interface DocumentLockedErrorResponse {
  error: string;
  lock_holder: LockHolderInfo;
  message: string;
}

export interface DocumentPresenceView {
  active_editor?: null | DocumentActiveEditorView;
  active_viewers: DocumentActiveViewerView[];
  document_id: string;
  document_type: string;
}

export interface DocumentUnlockResultView {
  document_id: string;
  document_type: string;
  unlocked: boolean;
}

export interface EarnCustomerLoyaltyPointsRequest {
  customer_contact_id: string;
  points: Int64String;
  reference_document_id?: string | null;
  unearned_liability_amount_minor?: Int64String | null;
}

export interface EcosystemBilateralTradeView {
  company_book_id: string;
  counterparty_book_uri: string;
  created_at: string;
  id: string;
  inbound_purchase_document_id?: string | null;
  outbound_sales_document_id?: string | null;
  proof_sentinel_hash: string;
  status: string;
  tenant_id: string;
}

export interface EfakturCsvExportView {
  batch_id: string;
  company_book_id: string;
  csv_content: string;
  exported_at: string;
  total_documents: Int64String;
}

export interface EfakturDocumentView {
  buyer_name: string;
  buyer_npwp: string;
  company_book_id: string;
  created_at: string;
  dpp_amount_minor: Int64String;
  efaktur_status: string;
  id: string;
  nsfp_assigned_number: string;
  ppn_amount_minor: Int64String;
  qr_code_verification_url?: string | null;
  sales_invoice_id: string;
}

export interface EfakturFtzExportView {
  company_book_id: string;
  csv_payload: string;
  generated_at: string;
  tax_period: string;
  total_gross_amount_minor: Int64String;
  total_records: number;
  total_tax_amount_minor: Int64String;
}

export type Eligibility = "current" | "expired" | "unavailable";

export interface EmployeePayrollProfileView {
  allowances_minor: Int64String;
  base_salary_minor: Int64String;
  company_book_id: string;
  created_at: string;
  employee_name: string;
  id: string;
  npwp_number?: string | null;
  ptkp_status: string;
  status: string;
  ter_category: string;
}

export interface EnableCompanyLegalHoldRequest {
  case_reference_number: string;
  gdpr_deletion_override?: boolean | null;
  merkle_evidence_root_hash: string;
}

export interface EngineDiscrepancy {
  account_id: string;
  engine_account_id: string;
  engine_credit_normal_minor: number;
  journal_credit_normal_minor: number;
  kind: string;
}

export interface EnqueueExportJobRequest {
  format: string;
  parameters?: unknown;
  report_type: string;
}

export interface EnrollBetaChannelRequest {
  connector_id?: string | null;
  enrolled_channel?: string | null;
  invite_code_or_token?: string | null;
}

export interface EnrollBetaChannelView {
  company_book_id: string;
  connector_id?: string | null;
  enrolled_at: string;
  enrolled_channel: string;
  enrollment_id: string;
  status: string;
}

export interface EnterpriseDivisionAuditMatrixView {
  company_book_id: string;
  divisions: DivisionAuditPaperSummary[];
  fiscal_period?: number | null;
  fiscal_year?: number | null;
  total_papers: Int64String;
}

export interface EntityHierarchyReparentingView {
  company_book_id: string;
  created_at: string;
  effective_from: string;
  id: string;
  new_parent_book_id: string;
  previous_parent_book_id?: string | null;
  reparented_by_principal_id: string;
  reparenting_reason: string;
  tenant_id: string;
}

export interface EquityMovementLine {
  account_code: string;
  account_name: string;
  amount_minor: number;
  label: string;
}

export interface ErrorEnvelope {
  error: ApiError;
}

export interface EvaluateDiscountQuoteRequest {
  discount_rule_ids?: string[];
  estimated_cogs_minor: Int64String;
  gross_order_value_minor: Int64String;
  manual_discount_percentage?: number | null;
  manual_fixed_discount_minor?: Int64String | null;
}

export interface EvaluateDiscountQuoteView {
  applied_rule_ids: string[];
  estimated_cogs_minor: Int64String;
  gross_margin_percentage: number;
  gross_order_value_minor: Int64String;
  gross_profit_minor: Int64String;
  margin_guard_floor_percentage: number;
  margin_guard_passed: boolean;
  max_permissible_discount_minor: Int64String;
  net_order_value_minor: Int64String;
  status: string;
  total_discount_minor: Int64String;
}

export interface EvidenceInput {
  evidence_type: string;
  integrity_sha256?: string | null;
  locator: string;
  originating_capability: string;
}

export interface EvidenceRefInput {
  evidence_reference_id: string;
}

export interface ExecuteBilateralTradeRequest {
  counterparty_book_uri: string;
  inbound_purchase_document_id?: string | null;
  outbound_sales_document_id?: string | null;
  proof_sentinel_hash: string;
  status?: string | null;
}

export type ExecutionMode = "stateless" | "stateful" | "legacy_adapter";

export interface ExpenseClaim {
  business_purpose?: string | null;
  claim_date: string;
  claim_number: string;
  claimant_contact_id: string;
  created_at: string;
  currency: string;
  description?: string | null;
  dimension_value_ids: string[];
  id: string;
  lines: ExpenseLine[];
  period_end?: string | null;
  period_start?: string | null;
  posting_id?: string | null;
  status: string;
  subtotal: string;
  tax_total: string;
  total: string;
  updated_at: string;
}

export interface ExpenseClaimList {
  claims: ExpenseClaim[];
}

export interface ExpenseLine {
  amount: string;
  category?: string | null;
  description: string;
  dimension_value_ids: string[];
  expense_account?: string | null;
  expense_date: string;
  id: string;
  ordinal: number;
  tax_amount: string;
}

export interface ExportDataSovereigntyRequest {
  export_format?: string | null;
  include_audit_trail?: boolean | null;
}

export interface ExportEfakturFtzScheduleRequest {
  include_ppftz_details?: boolean | null;
  tax_period: string;
}

export interface ExportFtaAuditFileRequest {
  export_reference?: string | null;
  period_end: string;
  period_start: string;
}

export interface ExportJobResponse {
  artifact_id?: string | null;
  completed_at?: string | null;
  created_at: string;
  error?: string | null;
  format: string;
  generation_id: string;
  report_type: string;
  status: string;
}

export interface FederatedNodeSyncView {
  company_book_id: string;
  created_at: string;
  endpoint_uri: string;
  id: string;
  last_synced_at?: string | null;
  node_deployment_mode: string;
  node_name: string;
  public_key_fingerprint: string;
  status: string;
  tenant_id: string;
}

export interface FinancialInsightsSummary {
  kpis: FinancialKpiMetrics;
  payables_aging_summary: AgingBucketSummary;
  provenance: FinancialTruthProvenance;
  receivables_aging_summary: AgingBucketSummary;
}

export interface FinancialKpiMetrics {
  burn_rate_monthly: Int64String;
  capital_efficiency_index: number;
  fcf_margin_pct: number;
  gross_margin_pct: number;
  liquid_cash: Int64String;
  net_income: Int64String;
  revenue: Int64String;
  runway_months: number;
}

export interface FinancialLine {
  account_code: string;
  account_id: string;
  account_name: string;
  amount_minor: Int64String;
  direction: string;
  entry_description: string;
  financial_date: string;
  journal_entry_id: string;
  line_description?: string | null;
  line_ordinal: number;
  posting_id: string;
  posting_time: string;
}

export interface FinancialLineList {
  lines: FinancialLine[];
}

export interface FinancialTruthProvenance {
  as_of_timestamp: string;
  provenance_ref: string;
  reconciled_status: string;
}

export interface FindingDispositionRequest {
  disposition: string;
  reason: string;
}

export interface FixedAsset {
  accumulated_depreciation: Int64String;
  accumulated_impairment: Int64String;
  accumulated_revaluation: Int64String;
  acquired_date: string;
  active: boolean;
  asset_category_id: string;
  asset_class: string;
  barcode?: string | null;
  category?: string | null;
  cost: Int64String;
  created_at: string;
  custodian_contact_id?: string | null;
  depreciated_through?: string | null;
  depreciation_method: string;
  depreciation_rate?: string | null;
  description?: string | null;
  dimension_value_ids: string[];
  disposal_date?: string | null;
  disposal_proceeds?: Int64String | null;
  funding_account?: string | null;
  gl_asset: string;
  id: string;
  insurance_expiry?: string | null;
  insurance_policy_no?: string | null;
  insured_value?: Int64String | null;
  insurer_contact_id?: string | null;
  location?: string | null;
  name: string;
  net_book_value: Int64String;
  parent_asset_id?: string | null;
  placed_in_service_date?: string | null;
  registration_no?: string | null;
  salvage: Int64String;
  serial_number?: string | null;
  status: string;
  supplier_contact_id?: string | null;
  updated_at: string;
  useful_life_months: number;
  warranty_expiry?: string | null;
  warranty_terms?: string | null;
}

export interface FixedAssetDisposalResultView {
  accumulated_depreciation_minor: Int64String;
  acquisition_cost_minor: Int64String;
  asset_id: string;
  company_book_id: string;
  disposal_date: string;
  disposal_proceeds_minor: Int64String;
  disposed_at: string;
  gain_loss_minor: Int64String;
  net_book_value_minor: Int64String;
  status: string;
}

export interface FixedAssetList {
  assets: FixedAsset[];
}

export interface FixedAssetReconciliation {
  difference: Int64String;
  gl_accumulated_depreciation: Int64String;
  gl_asset_cost: Int64String;
  gl_net_book_value: Int64String;
  reconciled: boolean;
  register_accumulated_depreciation: Int64String;
  register_cost: Int64String;
  register_net_book_value: Int64String;
}

export interface FtaAuditFileExportView {
  company_book_id: string;
  created_at: string;
  export_id: string;
  file_format: string;
  generated_file_content: string;
  period_end: string;
  period_start: string;
  sha256_checksum: string;
  total_general_ledger_records: Int64String;
  total_purchase_records: Int64String;
  total_sales_records: Int64String;
  trn_number: string;
}

export interface FtaVat201ReportView {
  company_book_id: string;
  corporate_tax_applicable_rate_pct: number;
  corporate_tax_threshold_minor: Int64String;
  currency: string;
  exempt_supplies_amount_minor: Int64String;
  is_qfzp: boolean;
  net_vat_due_minor: Int64String;
  reverse_charge_expenses_amount_minor: Int64String;
  reverse_charge_expenses_recoverable_vat_minor: Int64String;
  reverse_charge_supplies_amount_minor: Int64String;
  reverse_charge_supplies_vat_minor: Int64String;
  standard_rated_expenses_amount_minor: Int64String;
  standard_rated_expenses_recoverable_vat_minor: Int64String;
  standard_rated_supplies_amount_minor: Int64String;
  standard_rated_supplies_vat_minor: Int64String;
  tax_period_end?: string | null;
  tax_period_start?: string | null;
  total_output_tax_minor: Int64String;
  total_recoverable_tax_minor: Int64String;
  tourist_tax_refunds_vat_minor: Int64String;
  trn_number: string;
  zero_rated_supplies_amount_minor: Int64String;
}

export interface GatewayFeeBreakdownItem {
  amount_minor: Int64String;
  fee_type: string;
}

export interface GatewayFeeBreakdownView {
  amount_minor: Int64String;
  fee_type: string;
  id: string;
}

export interface GenerateBillableHoursInvoiceRequest {
  customer_contact_id: string;
  period_end: string;
  period_start: string;
  project_code?: string | null;
}

export interface GenerateEfakturDocumentRequest {
  buyer_name: string;
  buyer_npwp: string;
  dpp_amount_minor: Int64String;
  ppn_amount_minor: Int64String;
  sales_invoice_id: string;
}

export interface GuestCounterparty {
  claim_token?: string | null;
  claimed: boolean;
  display_name: string;
  held_document_count: Int64String;
  id: string;
}

export interface HoldingAuditSampleView {
  audit_entity_level: string;
  audit_status: string;
  created_at: string;
  holding_perimeter_id: string;
  id: string;
  sample_rule_name: string;
  sampled_by_principal_id: string;
  sampled_journal_id: string;
  subsidiary_company_book_id: string;
  tenant_id: string;
}

export interface HubAppView {
  app_type: string;
  app_url?: string | null;
  author_name: string;
  built_by_tier: BuiltByTier;
  category: string;
  created_at: string;
  demo_url?: string | null;
  description: string;
  developer_id?: string | null;
  execution_mode: ExecutionMode;
  icon_url?: string | null;
  id: string;
  is_official: boolean;
  last_maintained_at: string;
  maintenance_status: MaintenanceStatus;
  name: string;
  pricing_model: string;
  slug: string;
  status: string;
  summary: string;
  verified_badge: boolean;
  version: string;
}

export interface HubConnectorView {
  author_name: string;
  built_by_tier: BuiltByTier;
  category: string;
  created_at: string;
  description: string;
  developer_id?: string | null;
  documentation_url?: string | null;
  execution_mode: ExecutionMode;
  icon_url?: string | null;
  id: string;
  is_official: boolean;
  last_maintained_at: string;
  maintenance_status: MaintenanceStatus;
  mcp_protocol_version?: string | null;
  name: string;
  pricing_model: string;
  slug: string;
  status: string;
  summary: string;
  verified_badge: boolean;
  version: string;
}

export interface HubDeveloperProfileView {
  created_at: string;
  developer_email: string;
  developer_name: string;
  id: string;
  support_email: string;
  tenant_id: string;
  verification_status: string;
  website_url?: string | null;
}

export interface HubPartnerView {
  certified_consultants_count: number;
  contact_email: string;
  created_at: string;
  description: string;
  developer_id?: string | null;
  id: string;
  industry_specializations: string[];
  is_featured: boolean;
  jurisdiction_coverage: string[];
  logo_url?: string | null;
  partner_name: string;
  partner_type: string;
  rating_score: number;
  status: string;
  summary: string;
  tier: string;
  website_url?: string | null;
}

export interface ImpairAsset {
  date: string;
  reason: string;
  recoverable_amount: Int64String;
}

export interface ImportBankStatement {
  closing_balance: string;
  file_content: string;
  filename?: string | null;
  format?: string | null;
  mapping?: null | BankStatementMappingOverride;
  opening_balance: string;
  profile_id?: string | null;
  statement_date: string;
}

export interface ImportCoaRequest {
  dry_run?: boolean;
  file_content_base64: string;
  file_format: string;
}

export interface ImportCoaResponse {
  created_account_ids: string[];
  imported_accounts_count: number;
  is_dry_run: boolean;
  mapped_roles_count: number;
  preview_rows?: ImportedAccountRow[] | null;
}

export interface ImportDeclaration {
  assessed_total: Int64String;
  authority_reference?: string | null;
  created_at: string;
  customs_currency: string;
  customs_value: Int64String;
  declaration_date: string;
  declaration_number: string;
  duty_total: Int64String;
  exchange_rate?: string | null;
  id: string;
  import_tax_total: Int64String;
  incoterm?: string | null;
  lines: ImportDeclarationLine[];
  memo?: string | null;
  other_charges_total: Int64String;
  port_of_entry?: string | null;
  posting_id?: string | null;
  purchase_document_ids: string[];
  status: string;
  updated_at: string;
}

export interface ImportDeclarationLine {
  customs_value: Int64String;
  description: string;
  duty_amount: Int64String;
  id: string;
  import_tax_amount: Int64String;
  imported_form: string;
  item_id?: string | null;
  ordinal: number;
  quantity: Int64String;
  tariff_code?: string | null;
}

export interface ImportDeclarationList {
  declarations: ImportDeclaration[];
}

export interface ImportXeroHistoricalDataRequest {
  import_contacts?: boolean | null;
  import_journals?: boolean | null;
  xero_tenant_id: string;
}

export interface ImportedAccountRow {
  account_class: string;
  account_code: string;
  name: string;
  normal_balance: string;
  parent_code?: string | null;
  role_mapping?: string | null;
}

export interface IncomeStatement {
  expenses: IncomeStatementLine[];
  net_income_minor: number;
  revenue: IncomeStatementLine[];
  total_expenses_minor: number;
  total_revenue_minor: number;
}

export interface IncomeStatementLine {
  account_code: string;
  account_id: string;
  account_name: string;
  amount_minor: number;
}

export interface IngestBankStatementFeedRequest {
  external_account_id: string;
  provider_name: string;
  raw_statement_data: string;
}

export interface IngestH2hCamt053StatementRequest {
  bank_code: string;
  external_message_id: string;
  raw_xml_payload: string;
  statement_reference?: string | null;
}

export interface IngestH2hCamt053StatementView {
  bank_code: string;
  company_book_id: string;
  currency: string;
  external_message_id: string;
  id: string;
  ingested_at: string;
  message_type: string;
  processed_status: string;
  statement_lines_parsed: Int64String;
  tenant_id: string;
  total_closing_balance_minor?: Int64String | null;
}

export interface IngestPgSettlementBatchRequest {
  fee_breakdowns: GatewayFeeBreakdownItem[];
  gross_amount_minor: Int64String;
  net_payout_minor: Int64String;
  provider_name: string;
  settlement_date: string;
  settlement_reference: string;
  total_fee_minor: Int64String;
}

export interface IngestPhysicalEventRequest {
  classification?: string | null;
  device_id: string;
  event_type: string;
  metric_payload: unknown;
}

export interface InstallConnectorRequest {
  configuration_values?: unknown;
  connector_id: string;
  granted_permission_scopes?: string[] | null;
}

export interface IntercompanyEliminationRunView {
  created_at: string;
  cta_translation_reserve_minor: Int64String;
  eliminated_expense_minor: Int64String;
  eliminated_payable_minor: Int64String;
  eliminated_receivable_minor: Int64String;
  eliminated_revenue_minor: Int64String;
  id: string;
  parent_company_book_id: string;
  period_month: number;
  period_year: number;
  status: string;
  tenant_id: string;
}

export interface InventoryLocation {
  created_at: string;
  id: string;
  is_primary: boolean;
  location_code: string;
  location_name: string;
}

export interface InventoryMovement {
  created_at: string;
  id: string;
  item_id: string;
  movement_date: string;
  movement_type: string;
  quantity: Int64String;
  running_avg_cost: Int64String;
  running_book_value: Int64String;
  running_qty: Int64String;
  source_capability?: string | null;
  source_document_id?: string | null;
  total_value: Int64String;
  unit_cost: Int64String;
}

export interface InventoryReconciliation {
  difference: Int64String;
  gl_inventory: Int64String;
  movement_book_value: Int64String;
  reconciled: boolean;
  register_book_value: Int64String;
  register_movement_difference: Int64String;
}

export interface InventoryTransfer {
  created_at: string;
  from_location_id: string;
  id: string;
  posting_id?: string | null;
  status: string;
  to_location_id: string;
  transfer_date: string;
  transfer_number: string;
}

export interface InventoryTransformation {
  abnormal_loss_value: Int64String;
  bom_id?: string | null;
  by_product_value: Int64String;
  consumed_movement_ids: string[];
  id: string;
  input_value: Int64String;
  kind: string;
  outputs: TransformationOutput[];
  posting_id?: string | null;
  transformation_date: string;
  unassigned_value: Int64String;
}

export interface InvitationView {
  company_book_id: string;
  expires_at: string;
  id: string;
  normalized_email: string;
  proposed_role_id: RoleId;
  state_revision: Int64String;
}

export interface InvoiceEstampResultView {
  company_book_id: string;
  document_amount_minor: Int64String;
  document_id: string;
  estamp_serial_number: string;
  id: string;
  provider_name: string;
  stamped_at: string;
  status: string;
  tenant_id: string;
}

export interface InvoicePaymentLinkView {
  company_book_id: string;
  created_at: string;
  expires_at?: string | null;
  invoice_id: string;
  payment_link_url: string;
  provider_name: string;
  status: string;
}

export interface IssueDeveloperKeyRequest {
  environment?: string | null;
  expires_at?: string | null;
  key_name: string;
  owner_email?: string | null;
  owner_name?: string | null;
  scopes?: string[] | null;
}

export interface IssueDeveloperKeyResponse {
  environment: string;
  key_id: string;
  key_name: string;
  key_prefix: string;
  note: string;
  raw_secret_token: string;
  scopes: string[];
}

export interface IssueNonFiatUnitsRequest {
  counterparty_entity_id: string;
  unit_type: string;
  units_amount: number;
}

export interface IssueWorkOrderPartsRequest {
  item_id: string;
  quantity?: number | null;
  unit_cost_minor: Int64String;
}

export interface Item {
  active: boolean;
  aliases: string[];
  avg_cost: Int64String;
  barcode?: string | null;
  book_value: Int64String;
  created_at: string;
  description?: string | null;
  dimension_value_ids: string[];
  id: string;
  kind: string;
  max_stock_level?: Int64String | null;
  min_stock_level?: Int64String | null;
  name: string;
  on_hand_qty: Int64String;
  parent_item_id?: string | null;
  preferred_supplier_contact_id?: string | null;
  purchase_account?: string | null;
  purchase_price: Int64String;
  sale_account?: string | null;
  sale_price: Int64String;
  sku?: string | null;
  taxable: boolean;
  unit: string;
  updated_at: string;
}

export interface ItemList {
  items: Item[];
}

export interface JournalLineInput {
  account_id: string;
  amount_minor: Int64String;
  description?: string | null;
  dimension_value_ids?: string[];
  direction: string;
  ordinal: number;
}

export interface LandedCostAllocation {
  allocated_cost: string;
  basis_amount: string;
  id: string;
  item_id?: string | null;
  purchase_document_line_id: string;
}

export interface LandedCostApportionment {
  allocations: LandedCostAllocation[];
  apportionment_date: string;
  basis: string;
  capitalised_total: string;
  created_at: string;
  id: string;
  lines: LandedCostLine[];
  memo?: string | null;
  posting_id?: string | null;
  purchase_document_id: string;
  residual_total: string;
  residual_treatment?: string | null;
  status: string;
  total_cost: string;
  updated_at: string;
}

export interface LandedCostApportionmentList {
  apportionments: LandedCostApportionment[];
}

export interface LandedCostLine {
  amount: string;
  capitalise: boolean;
  cost_type: string;
  description?: string | null;
  id: string;
  ordinal: number;
  vendor_contact_id?: string | null;
}

export interface LandedCostPolicy {
  options: LandedCostPolicyOption[];
  residual_treatment: string;
}

export interface LandedCostPolicyOption {
  description: string;
  is_default: boolean;
  residual_treatment: string;
}

export interface Lead {
  contact_id: string;
  converted_at?: string | null;
  created_at: string;
  credit_score?: number | null;
  currency: string;
  estimated_deal_amount: string;
  id: string;
  lead_code: string;
  lead_source: string;
  stage: string;
  updated_at: string;
}

export interface LeadList {
  leads: Lead[];
}

export interface LedgerWebhookEnvelope {
  company_book_id: string;
  data: unknown;
  event_id: string;
  event_type: string;
  timestamp: string;
}

export type LifecycleState = "open" | "closed" | "finalized";

export interface LineVariance {
  committed_quantity: Int64String;
  committed_value: Int64String;
  excess_quantity: Int64String;
  excess_value: Int64String;
  quote_line_id: string;
  quoted_quantity: Int64String;
  quoted_value: Int64String;
  remaining_quantity: Int64String;
  remaining_value: Int64String;
  requested_quantity: Int64String;
  requested_value: Int64String;
  reserved_quantity: Int64String;
  reserved_value: Int64String;
  warning: boolean;
}

export interface LinkSubsidiaryCompanyBookRequest {
  consolidation_method?: string | null;
  ownership_percentage?: number | null;
  subsidiary_company_book_id: string;
}

export interface LockHolderInfo {
  display_name: string;
  email: string;
  lock_expires_at: string;
  locked_at: string;
  minutes_remaining: Int64String;
  principal_id: string;
}

export interface LogTimesheetEntryRequest {
  billable_rate_minor: Int64String;
  customer_contact_id: string;
  entry_date: string;
  hours_logged: number;
  is_billable?: boolean | null;
  project_code: string;
  staff_principal_id: string;
}

export type MaintenanceStatus = "active" | "maintenance_mode" | "deprecated" | "archived";

export interface ManualJournal {
  approval_request_id?: string | null;
  content_revision: Int64String;
  content_sha256: string;
  currency: string;
  description: string;
  evidence: EvidenceInput[];
  external_reference?: string | null;
  financial_date: string;
  id: string;
  lines: JournalLineInput[];
  state: string;
  state_revision: Int64String;
  version_id: string;
}

export interface ManualJournalContent {
  currency: string;
  description: string;
  evidence?: EvidenceInput[];
  external_reference?: string | null;
  financial_date: string;
  lines: JournalLineInput[];
}

export interface MatchGoodsReceiptBillRequest {
  bill_date: string;
  due_date: string;
  lines: MatchedBillLineRequest[];
  memo?: string | null;
  prices_include_tax?: boolean;
  vendor_invoice_number: string;
}

export interface MatchedBillLineRequest {
  receipt_line_id: string;
  tax_profile_id?: string | null;
  taxable?: boolean;
  withholding_profile_id?: string | null;
}

export interface MembershipList {
  memberships: MembershipListItem[];
  pending_invitations: PendingInvitationListItem[];
}

export interface MembershipListItem {
  active: boolean;
  created_at: string;
  latest_verified_email?: string | null;
  owner_active: boolean;
  principal_id: string;
  role_ids: RoleId[];
  state_revision: Int64String;
  state_token: string;
  updated_at: string;
}

export interface MembershipView {
  active: boolean;
  company_book_id: string;
  owner_active: boolean;
  principal_id: string;
  role_assignment_id?: string | null;
  role_id?: null | RoleId;
  state_revision: Int64String;
}

export interface MerchantBillingItem {
  base_monthly_fee_idr: Int64String;
  billing_status: string;
  company_book_id: string;
  company_name: string;
  current_cycle_pos_gmv_idr: Int64String;
  current_cycle_pos_tx_count: Int64String;
  environment: string;
  per_pos_transaction_fee_idr: Int64String;
  projected_monthly_total_idr: Int64String;
}

export interface MigrateRealCompanyOpeningBalancesRequest {
  as_of_date: string;
  total_asset_opening_balance_minor: Int64String;
  total_equity_opening_balance_minor: Int64String;
  total_liability_opening_balance_minor: Int64String;
}

export interface MigrateTenantInfrastructureRequest {
  migrated_journal_count: Int64String;
  migration_payload_uri: string;
  proof_sentinel_checksum: string;
  source_deployment_mode: string;
  status?: string | null;
  target_deployment_mode: string;
}

export interface MonthlyDepreciationBatchResultView {
  assets_processed_count: number;
  company_book_id: string;
  period_date: string;
  processed_at: string;
  schedules_created_count: number;
  status: string;
  total_depreciation_amount_minor: Int64String;
}

export interface MonthlyPayrollRunView {
  company_book_id: string;
  created_at: string;
  id: string;
  journal_entry_id?: string | null;
  period_month: number;
  period_year: number;
  status: string;
  total_bpjs_employee_minor: Int64String;
  total_bpjs_employer_minor: Int64String;
  total_gross_salary_minor: Int64String;
  total_pph21_withheld_minor: Int64String;
}

export interface NotificationDelivery {
  channel: string;
  company_book_id: string;
  created_at: string;
  id: string;
  provider?: string | null;
  provider_message_id?: string | null;
  recipient_email?: string | null;
  retry_count: number;
  sent_at?: string | null;
  source_capability?: string | null;
  source_id?: string | null;
  state: string;
  subject?: string | null;
}

export interface NotificationDeliveryEnqueuedView {
  notification_delivery_id: string;
  status: string;
}

export interface NsfpPoolView {
  company_book_id: string;
  created_at: string;
  current_assigned_number: string;
  id: string;
  nsfp_end_number: string;
  nsfp_start_number: string;
  status: string;
  tax_year: number;
}

export interface OffboardingInventoryView {
  active_document_locks_count: Int64String;
  assigned_roles_count: Int64String;
  blockade_reason?: string | null;
  calendar_events_count: Int64String;
  can_safely_offboard: boolean;
  is_owner: boolean;
  latest_verified_email?: string | null;
  pending_attentions_count: Int64String;
  source_principal_id: string;
  user_drafts_count: Int64String;
}

export interface OffboardingTransferResult {
  attentions_transferred: Int64String;
  calendar_events_transferred: Int64String;
  company_book_id: string;
  document_locks_released: Int64String;
  drafts_transferred: Int64String;
  handover_id: string;
  membership_deactivated: boolean;
  source_principal_id: string;
  successor_principal_id: string;
  transferred_at: string;
}

export interface OnboardSingaporeEntityRequest {
  base_currency?: string | null;
  company_name: string;
  corporate_secretary?: string | null;
  directors?: string[] | null;
  gst_registered: boolean;
  registered_address?: string | null;
  sleek_api_key?: string | null;
  uen: string;
}

export interface OnboardingDraftView {
  admitted_relationship_id: string;
  confirmed_company_book_id?: string | null;
  draft_payload: unknown;
  id: string;
  state_revision: Int64String;
  step_index: number;
}

export interface OnboardingPreviewRequest {
  admitted_relationship_id: string;
}

export interface OnboardingPreviewResponse {
  admitted_relationship_id: string;
  display_name: string;
  enabled_capabilities: string[];
  functional_currency: string;
  is_confirmable: boolean;
  jurisdiction_id?: string | null;
  operating_model?: string | null;
  readiness_gaps: string[];
  required_facts: string[];
  starter_coa_preview?: null | StarterCoaPreview;
}

export interface OpenItem {
  amount_allocated: Int64String;
  amount_open: Int64String;
  amount_open_transaction?: Int64String | null;
  contact_id: string;
  created_at: string;
  direction: string;
  document_date: string;
  due_date?: string | null;
  id: string;
  original_amount: Int64String;
  parent_open_item_id?: string | null;
  source_capability: string;
  source_doc_id: string;
  source_doc_type: string;
  status: string;
  transaction_currency?: string | null;
}

export interface OpenPosCashierSessionRequest {
  cashier_principal_id: string;
  opening_cash_float_minor?: Int64String | null;
  terminal_id: string;
}

export interface OpeningBalancesMigrationView {
  as_of_date: string;
  company_book_id: string;
  migrated_at: string;
  migration_id: string;
  opening_balances_migrated: boolean;
  status: string;
  total_credits_minor: Int64String;
  total_debits_minor: Int64String;
}

export interface OwnerCapacityList {
  owner_capacities: OwnerCapacityView[];
}

export interface OwnerCapacityView {
  id: string;
  principal_id: string;
  state: string;
  state_revision: Int64String;
  state_token: string;
}

export interface PartnerManagedClientItemView {
  client_name: string;
  company_book_id: string;
  environment_mode: string;
  linked_at: string;
  status: string;
}

export interface PartnerManagedClientListView {
  clients: PartnerManagedClientItemView[];
  matured_commission_balance_minor: Int64String;
  partner_id: string;
  partner_name: string;
  partner_tier: string;
  total_clients: number;
}

export interface Payment {
  allocations: PaymentAllocation[];
  amount: Int64String;
  amount_allocated: Int64String;
  bank_account_id: string;
  contact_id: string;
  created_at: string;
  currency: string;
  dimension_value_ids: string[];
  direction: string;
  id: string;
  memo?: string | null;
  payment_date: string;
  payment_method?: string | null;
  payment_number: string;
  payment_purpose: string;
  reference?: string | null;
  resolved_gl_account_code: string;
  state_revision: Int64String;
  status: string;
  updated_at: string;
}

export interface PaymentAllocation {
  allocated_amount: Int64String;
  applied_at?: string | null;
  applied_posting_id?: string | null;
  document_id: string;
  document_type: string;
  fx_gain_loss?: Int64String | null;
  id: string;
  payment_id: string;
}

export interface PaymentList {
  payments: Payment[];
}

export interface PayrollCalculationApprovalView {
  approved_at: string;
  approved_by_principal_id: string;
  company_book_id: string;
  id: string;
  payroll_run_id: string;
  status: string;
}

export interface PayrollCalculationRunView {
  company_book_id: string;
  created_at: string;
  id: string;
  period_month: number;
  period_year: number;
  status: string;
  tenant_id: string;
  total_bpjs_deduction_minor: Int64String;
  total_gross_salary_minor: Int64String;
  total_net_payout_minor: Int64String;
  total_pph21_tax_minor: Int64String;
}

export interface PayrollRun {
  bpjs_total: Int64String;
  created_at: string;
  deductions_total: Int64String;
  functional_currency: string;
  gross_total: Int64String;
  id: string;
  lines: PayrollRunLine[];
  net_total: Int64String;
  pay_date: string;
  period: string;
  posting_id?: string | null;
  pph21_total: Int64String;
  status: string;
  updated_at: string;
}

export interface PayrollRunApprovalView {
  approved_at: string;
  company_book_id: string;
  id: string;
  journal_entry_id?: string | null;
  status: string;
}

export interface PayrollRunLine {
  allowances: Int64String;
  bank_account_id?: string | null;
  bonus: Int64String;
  bpjs_employee: Int64String;
  bpjs_employer: Int64String;
  employee_contact_id: string;
  gross: Int64String;
  id: string;
  net_pay: Int64String;
  other_deductions: Int64String;
  overtime: Int64String;
  pph21: Int64String;
}

export interface PayrollRunList {
  runs: PayrollRun[];
}

export interface PendingCurationItemView {
  id: string;
  status: string;
  submitted_at: string;
  submitter_name: string;
  target_id: string;
  target_name: string;
  target_type: string;
}

export interface PendingCurationListView {
  items: PendingCurationItemView[];
  total_count: number;
}

export interface PendingInvitationListItem {
  delivery_state: string;
  expires_at: string;
  id: string;
  invited_by_principal_id: string;
  normalized_email: string;
  proposed_role_id: RoleId;
  state_revision: Int64String;
  state_token: string;
}

export interface PeriodDeltaAdjustmentView {
  adjusted_by_principal_id: string;
  adjustment_reason: string;
  company_book_id: string;
  created_at: string;
  delta_amount_minor: Int64String;
  delta_journal_id: string;
  fiscal_period: number;
  fiscal_year: number;
  id: string;
  original_amount_minor: Int64String;
  target_journal_id: string;
  tenant_id: string;
}

export type PeriodState = "open" | "locked" | "closing" | "closed" | "finalized";

export interface PersonInCharge {
  contact_id: string;
  effective_from: string;
  email?: string | null;
  family_name?: string | null;
  given_name: string;
  name: string;
  organization_contact_id: string;
  organization_name: string;
  relationship_id: string;
  relationship_type: string;
  telephone?: string | null;
  title?: string | null;
}

export interface PgSettlementBatchIngestView {
  company_book_id: string;
  created_at: string;
  fee_breakdowns: GatewayFeeBreakdownView[];
  gross_amount_minor: Int64String;
  id: string;
  net_payout_minor: Int64String;
  provider_name: string;
  settlement_date: string;
  settlement_reference: string;
  status: string;
  total_fee_minor: Int64String;
}

export interface PgSettlementReconciliationResultView {
  gross_amount_minor: Int64String;
  journal_entry_id: string;
  net_payout_minor: Int64String;
  reconciled_at: string;
  settlement_id: string;
  status: string;
  total_fee_minor: Int64String;
}

export interface PhysicalBusinessEventRuleView {
  classification_result: string;
  company_book_id: string;
  created_at: string;
  id: string;
  metric_trigger_condition: string;
  rule_name: string;
  tenant_id: string;
}

export interface PhysicalDeviceView {
  company_book_id: string;
  created_at: string;
  device_identifier: string;
  device_type: string;
  firmware_version: string;
  id: string;
  mac_address?: string | null;
  status: string;
  tenant_id: string;
}

export interface PhysicalEventStreamView {
  classification: string;
  company_book_id: string;
  created_at: string;
  device_id: string;
  event_type: string;
  id: string;
  metric_payload: unknown;
  processed_at: string;
  tenant_id: string;
}

export interface PlaceAuctionBidRequest {
  bid_amount_minor: Int64String;
  bid_deposit_hold_id?: string | null;
  bidder_principal_id: string;
}

export interface PlaceInService {
  date: string;
}

export interface PlatformAdminOverviewView {
  engine_health_status: string;
  open_support_tickets_count: number;
  pending_curation_submissions_count: number;
  total_active_books: number;
  total_mrr_minor: Int64String;
  total_tenants: number;
}

export interface PlatformSystemHealthView {
  checked_at: string;
  otel_collector_ready: boolean;
  postgres_ready: boolean;
  status: string;
  tigerbeetle_ready: boolean;
  uptime_seconds: Int64String;
}

export interface PlatformTenantListView {
  tenants: PlatformTenantSummary[];
  total_count: number;
}

export interface PlatformTenantSummary {
  book_count: number;
  created_at: string;
  status: string;
  tenant_id: string;
  tenant_name: string;
}

export interface PocProjectBudgetView {
  actual_cost_incurred_minor: Int64String;
  billed_to_date_minor: Int64String;
  company_book_id: string;
  completion_percentage: number;
  contract_asset_liability_minor: Int64String;
  contract_value_minor: Int64String;
  created_at: string;
  id: string;
  project_id: string;
  recognized_revenue_to_date_minor: Int64String;
  total_budgeted_cost_minor: Int64String;
}

export interface PointLedgerEntryView {
  company_book_id: string;
  created_at: string;
  id: string;
  loyalty_account_id: string;
  points_delta: Int64String;
  reference_document_id?: string | null;
  tenant_id: string;
  transaction_type: string;
  unearned_liability_amount_minor: Int64String;
}

export interface PolicyInput {
  catalog_key: string;
  effective_from: string;
  enabled?: boolean;
  qualified_assessment_reference?: string | null;
  qualified_assessment_sha256?: string | null;
}

export interface PolicyView {
  approved_by: string;
  authority_url: string;
  catalog_key: string;
  created_at: string;
  effective_from: string;
  enabled: boolean;
  entity_applicability: string;
  explanation: string;
  financial_effect: string;
  framework: string;
  id: string;
  jurisdiction: string;
  policy_key: string;
  policy_value: unknown;
  qualified_assessment_reference?: string | null;
  qualified_assessment_sha256?: string | null;
  requires_professional_judgment: boolean;
  source_locator: string;
  source_revision: string;
  source_title: string;
  supported_alternatives: string[];
  treatment_classification: TreatmentClassification;
  version: Int64String;
}

export interface PosCashierSessionView {
  cash_over_short_amount_minor?: Int64String | null;
  cashier_principal_id: string;
  closed_at?: string | null;
  closing_cash_counted_minor?: Int64String | null;
  company_book_id: string;
  created_at: string;
  expected_cash_total_minor?: Int64String | null;
  id: string;
  opened_at: string;
  opening_cash_float_minor: Int64String;
  status: string;
  tenant_id: string;
  terminal_id: string;
}

export interface PosHandoverEvidenceRequest {
  control_transferred: boolean;
  evidence_reference: string;
  occurred_at: string;
}

export interface PosOrderItemView {
  cogs_amount_minor: Int64String;
  created_at: string;
  id: string;
  line_discount_minor: Int64String;
  pos_order_id: string;
  product_id: string;
  quantity: number;
  unit_price_minor: Int64String;
}

export interface PosOrderView {
  company_book_id: string;
  content_sha256?: string | null;
  correction_kind?: string | null;
  corrects_pos_order_id?: string | null;
  created_at: string;
  customer_contact_id?: string | null;
  discount_amount_minor: Int64String;
  final_total_minor: Int64String;
  financial_date?: string | null;
  functional_currency?: string | null;
  handover_actor_principal_id?: string | null;
  handover_evidence_reference?: string | null;
  handover_occurred_at?: string | null;
  id: string;
  items: PosOrderItemView[];
  payment_method: string;
  posting_id?: string | null;
  session_id: string;
  state_revision: Int64String;
  status: string;
  subtotal_minor: Int64String;
  tax_amount_minor: Int64String;
  tenant_id: string;
}

export interface PosTerminalView {
  company_book_id: string;
  created_at: string;
  id: string;
  outlet_location_id: string;
  receipt_footer?: string | null;
  receipt_header?: string | null;
  status: string;
  tenant_id: string;
  terminal_code: string;
  terminal_name: string;
}

export interface PostPeriodDeltaAdjustmentRequest {
  adjustment_reason: string;
  delta_amount_minor: Int64String;
  delta_journal_id: string;
  fiscal_period: number;
  fiscal_year: number;
  original_amount_minor: Int64String;
  target_journal_id: string;
}

export type PostPosOrderAcceptedResponse = PostPosOrderResponse | PostPosOrderApprovalRequiredResponse;

export interface PostPosOrderApprovalRequiredResponse {
  order_id: string;
  status: string;
}

export interface PostPosOrderRequest {
  expected_source_token: string;
}

export interface PostPosOrderResponse {
  finality: string;
  order_id: string;
  posting_id: string;
}

export interface PostedMonth {
  charge: Int64String;
  month: string;
}

export interface Posting {
  book_id: string;
  finality: string;
  financial_date: string;
  functional_currency: string;
  id: string;
  posting_time?: string | null;
  source_capability: string;
  source_object_id: string;
  source_version: Int64String;
  stable_effect_key: string;
  state_revision: Int64String;
}

export interface PostingSummary {
  finality: string;
  posting_id: string;
}

export interface PredictVariableConsiderationRequest {
  customer_id: string;
  discount_term_days?: number | null;
  early_discount_pct?: number | null;
  gross_amount_minor: Int64String;
  net_due_days?: number | null;
  sales_document_id: string;
}

export interface PreviewCollision {
  component_key: string;
  decision: string;
  line_key: string;
  semantic_role: string;
}

export interface PreviewLine {
  account_class: string;
  code: string;
  line_key: string;
  name: string;
  normal_balance: string;
  ordinal: number;
  semantic_role: string;
}

export interface ProcessPosRetailOrderItemRequest {
  line_discount_minor?: Int64String | null;
  product_id: string;
  quantity: number;
  unit_price_minor: Int64String;
}

export interface ProcessPosRetailOrderRequest {
  customer_contact_id?: string | null;
  discount_amount_minor?: Int64String | null;
  items: ProcessPosRetailOrderItemRequest[];
  payment_method?: string | null;
  session_id: string;
}

export interface ProfitDistributionResultView {
  agreement_id?: string | null;
  company_book_id: string;
  disbursed_at: string;
  id: string;
  journal_entry_id?: string | null;
  partner_contact_id: string;
  payout_amount_minor: Int64String;
  period_month: number;
  period_year: number;
  status: string;
  tenant_id: string;
}

export interface ProfitSharingCalculationView {
  agreement_id?: string | null;
  calculated_at: string;
  calculated_payout_amount_minor: Int64String;
  company_book_id: string;
  hurdle_amount_minor: Int64String;
  id: string;
  partner_contact_id: string;
  period_month: number;
  period_year: number;
  retained_earnings_minor: Int64String;
  share_percentage: number;
  split_type: string;
  status: string;
  tenant_id: string;
  total_net_profit_minor: Int64String;
}

export interface ProjectRetentionSummaryView {
  accumulated_released_minor: Int64String;
  accumulated_withheld_minor: Int64String;
  defect_liability_days: number;
  defect_liability_end_date?: string | null;
  retention_rate_pct: number;
  status: string;
  unmatured_balance_minor: Int64String;
}

export interface ProjectSCurveMetricsView {
  cost_variance_minor?: Int64String | null;
  cpi?: number | null;
  current_period_index?: number | null;
  estimate_at_completion_eac_minor?: Int64String | null;
  estimate_to_complete_etc_minor?: Int64String | null;
  is_onerous_contract_risk: boolean;
  schedule_variance_minor?: Int64String | null;
  spi?: number | null;
}

export interface ProjectSCurvePointView {
  ac_cost_minor?: Int64String | null;
  ac_pct?: number | null;
  ev_pct?: number | null;
  ev_value_minor?: Int64String | null;
  period_index: number;
  period_label: string;
  pv_cost_minor: Int64String;
  pv_pct: number;
  status: string;
}

export interface ProjectSCurveSeriesResponse {
  budget_at_completion_bac_minor: Int64String;
  company_book_id: string;
  contract_value_minor: Int64String;
  metrics: ProjectSCurveMetricsView;
  project_id: string;
  retention?: null | ProjectRetentionSummaryView;
  series: ProjectSCurvePointView[];
}

export interface PrometheusMetricsView {
  active_provider: string;
  metrics: string;
  otel_endpoint: string;
}

export interface PublishDirectoryProfile {
  discoverable: boolean;
  display_name: string;
  handle: string;
}

export interface PurchaseDocument {
  amount_paid: Int64String;
  contact_id: string;
  created_at: string;
  currency: string;
  dimension_value_ids: string[];
  document_date: string;
  document_number: string;
  document_type: string;
  due_date?: string | null;
  id: string;
  lines: PurchaseLine[];
  matched_po_id?: string | null;
  matched_receipt_id?: string | null;
  memo?: string | null;
  parent_document_id?: string | null;
  posting_id?: string | null;
  received_date?: string | null;
  settlement_status: string;
  status: string;
  subtotal: Int64String;
  tax_total: Int64String;
  total: Int64String;
  updated_at: string;
  vendor_invoice_number?: string | null;
}

export interface PurchaseDocumentList {
  documents: PurchaseDocument[];
}

export interface PurchaseLine {
  description: string;
  discount_amount: Int64String;
  expense_account?: string | null;
  id: string;
  item_id?: string | null;
  line_total: Int64String;
  ordinal: number;
  quantity: Int64String;
  quantity_invoiced: Int64String;
  quantity_received: Int64String;
  source_goods_receipt_line_id?: string | null;
  source_purchase_order_line_id?: string | null;
  source_supplier_quote_line_id?: string | null;
  tax_profile_id?: string | null;
  taxable: boolean;
  unit?: string | null;
  unit_price: Int64String;
}

export interface PurchaseOrderDecisionRequest {
  decision: string;
  reason?: string | null;
}

export interface PurchaseOrderDetachRequest {
  reason: string;
}

export interface PurchaseOrderLineView {
  description: string;
  discount_amount: Int64String;
  id: string;
  line_total: Int64String;
  quantity: Int64String;
  quantity_invoiced: Int64String;
  quantity_received: Int64String;
  source_quote_line_id?: string | null;
  unit_price: Int64String;
}

export type PurchaseOrderState = "draft" | "submitted" | "approved" | "issued" | "void" | "cancelled";

export interface PurchaseOrderView {
  approval_request_id?: string | null;
  conversion_id?: string | null;
  document_number: string;
  exception_reason?: string | null;
  id: string;
  lines: PurchaseOrderLineView[];
  source_quote_id?: string | null;
  state_revision: Int64String;
  status: PurchaseOrderState;
  total: Int64String;
}

export interface QrisGenerateRequest {
  amount_idr: Int64String;
  biller_split_fee_idr?: Int64String | null;
  transaction_id: string;
}

export interface QrisGenerateResponse {
  expires_at: string;
  payment_id: string;
  qr_image_url: string;
  qris_string: string;
}

export interface QrisStatusResponse {
  amount_received_idr?: Int64String | null;
  paid_at?: string | null;
  payment_id: string;
  status: string;
}

export interface QualifyCredit {
  credit_score: number;
  notes?: string | null;
}

export interface QuoteConsumptionLineView {
  committed_quantity: Int64String;
  committed_value: Int64String;
  quote_line_id: string;
  quoted_quantity: Int64String;
  quoted_value: Int64String;
  remaining_quantity: Int64String;
  remaining_value: Int64String;
  reserved_quantity: Int64String;
  reserved_value: Int64String;
}

export interface QuoteConsumptionView {
  lines: QuoteConsumptionLineView[];
  source_quote_id: string;
}

export interface QuoteOrderAllocation {
  quantity: Int64String;
  quote_line_id: string;
}

export interface QuoteRevisionLineRequest {
  description: string;
  discount_amount?: Int64String;
  item_id?: string | null;
  quantity: Int64String;
  source_quote_line_id?: string | null;
  unit_price: Int64String;
}

export interface QuoteRevisionRequest {
  lines: QuoteRevisionLineRequest[];
  supplier_reference: string;
  valid_until: string;
}

export type QuoteState = "draft" | "sent" | "accepted" | "rejected" | "expired" | "withdrawn";

export interface ReceivePurchaseOrderRequest {
  memo?: string | null;
  receipt_date: string;
}

export interface ReconcileCodSettlementRequest {
  awb_tracking_number: string;
  collected_amount_minor: Int64String;
  gateway_fee_minor: Int64String;
  settlement_notes?: string | null;
}

export interface ReconcilePgSettlementJournalRequest {
  bank_account_id: string;
  clearing_account_id?: string | null;
  fee_expense_account_id?: string | null;
}

export interface Reconciliation {
  clean: boolean;
  discrepancies: EngineDiscrepancy[];
  invariant: string;
  pending_count: Int64String;
}

export type ReconciliationConflict = Reconciliation | ErrorEnvelope;

export interface ReconciliationRequest {
  book_id: string;
}

export interface RecordRestructuringEventRequest {
  carveout_perimeter_json: unknown;
  effective_date: string;
  event_type: string;
  goodwill_recognized_minor?: Int64String | null;
  target_entity_name: string;
  transaction_valuation_minor: Int64String;
}

export interface RecurringBillingBatchResultView {
  batch_id: string;
  billing_as_of_date: string;
  company_book_id: string;
  invoices_generated_count: number;
  processed_at: string;
  status: string;
  subscriptions_evaluated_count: number;
  total_billed_minor: Int64String;
}

export interface RedeemCustomerLoyaltyPointsRequest {
  customer_contact_id: string;
  points: Int64String;
  reference_document_id?: string | null;
}

export interface RedeemNonFiatUnitsRequest {
  counterparty_entity_id: string;
  unit_type: string;
  units_amount: number;
}

export interface RefundPayload {
  reason: string;
  refunded_amount: Int64String;
  tx_id: string;
}

export interface RefundResponse {
  refund_id: string;
  refunded_at: string;
  status: string;
}

export interface RegisterDeveloperRequest {
  developer_email: string;
  developer_name: string;
  support_email: string;
  website_url?: string | null;
}

export interface RegisterFixedAssetRequest {
  accumulated_depr_account_number: string;
  acquisition_cost_minor: Int64String;
  acquisition_date: string;
  asset_account_number: string;
  asset_code: string;
  asset_name: string;
  depreciation_expense_account_number: string;
  depreciation_method?: string | null;
  salvage_value_minor?: Int64String | null;
  useful_life_months: number;
}

export interface RegisterPhysicalDeviceRequest {
  device_identifier: string;
  device_type: string;
  firmware_version?: string | null;
  mac_address?: string | null;
}

export interface RegisterPosTerminalRequest {
  outlet_location_id: string;
  receipt_footer?: string | null;
  receipt_header?: string | null;
  terminal_code: string;
  terminal_name: string;
}

export interface ReleaseTemporaryPostingLock {
  reason: string;
}

export interface ReopenAccountingPeriod {
  correction_purpose: string;
  reason: string;
}

export interface ReparentCompanyBookRequest {
  effective_from: string;
  new_parent_book_id: string;
  previous_parent_book_id?: string | null;
  reparenting_reason: string;
}

export interface ReplaceAccount {
  active: boolean;
  code: string;
  manual_entry_allowed: boolean;
  name: string;
}

export interface RequestConnection {
  handle: string;
  message?: string | null;
}

export interface RequestOwnerRequest {
  principal_id: string;
}

export interface ResetDeveloperSandboxBookRequest {
  preserve_configuration?: boolean | null;
  reason?: string | null;
}

export interface ResolveBankStatementLine {
  action: string;
  payment_id?: string | null;
}

export interface ResolveContactRequest {
  display_name?: string | null;
  entry_mode: string;
  phone?: string | null;
}

export interface ResolveContactResponse {
  active_vouchers_count: number;
  contact_id: string;
  loyalty_points: Int64String;
  loyalty_tier: string;
}

export interface RespondFindingRequest {
  response_text: string;
}

export interface RevaluationRequest {
  as_of_date: string;
  currency: string;
  exchange_rate?: number | null;
  rate_type?: string;
}

export interface RevaluationRun {
  as_of_date: string;
  created_at: string;
  currency: string;
  exchange_rate: number;
  id: string;
  status: string;
  total_fx_gain_loss: Int64String;
  total_items_revalued: number;
}

export interface RevalueAsset {
  date: string;
  reason: string;
  revalued_amount: Int64String;
}

export interface ReversalRequest {
  approval_request_id: string;
  content_sha256: string;
  id: string;
  original_posting_id: string;
  reason: string;
  requested_by_principal_id: string;
  reversal_financial_date: string;
  state: string;
  state_revision: Int64String;
}

export interface RevokeDeveloperKeyRequest {
  reason: string;
}

export interface RoleAssignmentList {
  assignments: RoleAssignmentView[];
}

export interface RoleAssignmentView {
  active: boolean;
  elevated: boolean;
  id: string;
  principal_id: string;
  role_display_name: string;
  role_id: string;
  state_revision: Int64String;
  state_token: string;
}

export interface RoleDeactivationPreview {
  affected_assignments: Int64String;
  referenced: boolean;
  role_id: string;
}

export type RoleId = string;

export interface RoleList {
  roles: RoleView[];
}

export interface RoleView {
  active: boolean;
  archived: boolean;
  authority_revision: Int64String;
  authority_revision_id: string;
  description?: string | null;
  display_name: string;
  elevated: boolean;
  id: string;
  permission_group_id: string;
  state_revision: Int64String;
  state_token: string;
  system: boolean;
  system_key?: string | null;
}

export interface RotateDeveloperKeyRequest {
  grace_period_hours?: Int64String | null;
}

export interface RunBadDebtProvisioningRequest {
  as_of_date?: string | null;
  provision_rate_pct?: number | null;
}

export interface RunBankFeedRuleMatchingRequest {
  min_confidence_threshold?: number | null;
  rule_ids?: string[] | null;
  statement_line_ids?: string[] | null;
}

export interface RunBankFeedRuleMatchingResultView {
  auto_reconciled: Int64String;
  company_book_id: string;
  matches: BankFeedMatchView[];
  total_evaluated: Int64String;
  total_matched: Int64String;
}

export interface RunIntercompanyEliminationsRequest {
  auto_eliminate_matching_intercompany_tx?: boolean | null;
  period_month: number;
  period_year: number;
}

export interface RunMonthlyDepreciationBatchRequest {
  asset_ids?: string[] | null;
  period_date: string;
}

export interface RunRecurringBillingBatchRequest {
  billing_as_of_date?: string | null;
  dry_run?: boolean | null;
}

export interface SaaSUsageMeteringView {
  api_request_count: Int64String;
  billing_period_end: string;
  billing_period_start: string;
  company_book_id: string;
  created_at: string;
  id: string;
  journal_posting_count: Int64String;
  status: string;
  storage_bytes_used: Int64String;
  tenant_id: string;
}

export interface SalesDocument {
  amount_paid: Int64String;
  contact_id: string;
  created_at: string;
  currency: string;
  dimension_value_ids: string[];
  document_date: string;
  document_number: string;
  document_type: string;
  due_date?: string | null;
  id: string;
  lines: SalesLine[];
  memo?: string | null;
  parent_document_id?: string | null;
  posting_id?: string | null;
  reference?: string | null;
  salesperson_id?: string | null;
  settlement_status: string;
  status: string;
  subtotal: Int64String;
  tax_total: Int64String;
  total: Int64String;
  updated_at: string;
}

export interface SalesDocumentList {
  documents: SalesDocument[];
}

export interface SalesLeaderboardEntry {
  conversion_rate_percentage: number;
  gross_margin_contribution_minor: number;
  qualified_leads_count: Int64String;
  rank: number;
  sales_rep_name: string;
  sales_rep_principal_id?: string | null;
  total_collected_cash_minor: number;
  total_invoiced_revenue_minor: number;
  total_leads_assigned: Int64String;
}

export interface SalesLeaderboardView {
  company_book_id: string;
  entries: SalesLeaderboardEntry[];
}

export interface SalesLine {
  description: string;
  discount_amount: Int64String;
  id: string;
  item_id?: string | null;
  line_total: Int64String;
  ordinal: number;
  quantity: Int64String;
  revenue_account?: string | null;
  tax_profile_id?: string | null;
  taxable: boolean;
  unit?: string | null;
  unit_price: Int64String;
}

export interface SalesOpportunityView {
  assigned_sales_rep_principal_id?: string | null;
  company_book_id: string;
  contact_id: string;
  created_at: string;
  estimated_amount_minor: Int64String;
  id: string;
  opportunity_name: string;
  pipeline_stage: string;
  status: string;
  tenant_id: string;
  win_probability_pct: number;
}

export interface SalesQuoteView {
  company_book_id: string;
  contact_id: string;
  converted_sales_invoice_id?: string | null;
  created_at: string;
  expiry_date: string;
  grand_total_minor: Int64String;
  id: string;
  opportunity_id?: string | null;
  quote_date: string;
  quote_number: string;
  status: string;
  subtotal_minor: Int64String;
  tax_total_minor: Int64String;
  tenant_id: string;
}

export interface SaveDraftInput {
  draft_payload: unknown;
  expected_revision?: Int64String | null;
  step_index: number;
}

export interface SelectTemplateRequest {
  document_kind: string;
  effective_from: string;
  reason?: string | null;
  template_id: string;
  template_version: string;
}

export interface SendDocumentEmailRequest {
  message_body?: string | null;
  recipient_email?: string | null;
  subject?: string | null;
}

export interface ServiceBilling {
  allocations: ServiceBillingAllocation[];
  evidence_digest: string;
  evidence_reference: string;
  invoice: SalesDocument;
  reason: string;
  source_sales_order_id: string;
}

export interface ServiceBillingAllocation {
  id: string;
  quantity: Int64String;
  service_billing_line_id: string;
  service_fulfillment_line_id: string;
}

export interface ServiceBillingAllocationInput {
  quantity: Int64String;
  service_fulfillment_line_id: string;
}

export interface ServiceContractAssessment {
  actor_principal_id: string;
  classification: ServiceRevenueClassification;
  contract_modification: boolean;
  created_at: string;
  currency: string;
  finalized_at: string;
  fixed_transaction_price: Int64String;
  id: string;
  paragraph_35_a_met: boolean;
  paragraph_35_b_met: boolean;
  paragraph_35_c_met: boolean;
  performance_obligations: ServicePerformanceObligation[];
  principal_agent_issue: boolean;
  qualified_assessment_reference: string;
  qualified_assessment_sha256: string;
  sales_order_id: string;
  sales_order_state_revision: Int64String;
  source_customer_quote_id: string;
  source_quote_revision: Int64String;
  variable_consideration: boolean;
}

export interface ServiceEvidence {
  evidence_digest: string;
  evidence_reference: string;
  reason: string;
}

export interface ServiceFakturMonetaryAssessment {
  actor_principal_id: string;
  aggregation_level: string;
  calculation_contract_identity: string;
  commercial_terms_reference: string;
  commercial_terms_sha256: string;
  contact_id: string;
  created_at: string;
  currency: string;
  dpp: Int64String;
  dpp_method: string;
  dpp_method_version: string;
  faktur_date: string;
  faktur_evidence_reference: string;
  faktur_evidence_sha256: string;
  faktur_reference: string;
  faktur_status: string;
  finalized_at: string;
  gross_customer_amount: Int64String;
  id: string;
  nominal_ppn_rate_basis_points: number;
  official_source_checked_on: string;
  official_source_reference: string;
  official_source_sha256: string;
  output_ppn: Int64String;
  penggantian: Int64String;
  rounding_contract_reference: string;
  rounding_contract_sha256: string;
  rounding_mode: string;
  sales_order_id: string;
  service_contract_assessment_id: string;
  service_invoice_id: string;
  service_recognition_readiness_assessment_id: string;
  service_tax_point_assessment_id: string;
  tax_point_date: string;
}

export interface ServiceFulfillment {
  actor_principal_id: string;
  created_at: string;
  customer_decided_at?: string | null;
  customer_status: CustomerStatus;
  evidence_digest: string;
  evidence_reference: string;
  id: string;
  lines: ServiceFulfillmentLine[];
  performed_from: string;
  performed_through: string;
  sales_order_id: string;
}

export interface ServiceFulfillmentCustomerDecision {
  customer_status: CustomerStatus;
  evidence_digest: string;
  evidence_reference: string;
  reason: string;
}

export interface ServiceFulfillmentLine {
  id: string;
  quantity: Int64String;
  sales_order_line_id: string;
}

export interface ServiceFulfillmentLineInput {
  quantity: Int64String;
  sales_order_line_id: string;
}

export interface ServiceFulfillmentMutation {
  fulfillment: ServiceFulfillment;
  sales_order: ServiceOrder;
}

export interface ServiceObligationBillingAllocation {
  id: string;
  quantity: Int64String;
  sales_order_line_id: string;
  service_fulfillment_line_id: string;
  service_invoice_allocation_id: string;
  service_invoice_id: string;
  service_invoice_line_id: string;
}

export interface ServiceObligationBillingAllocationInput {
  quantity: Int64String;
  service_invoice_allocation_id: string;
}

export interface ServiceObligationOrderLineAllocation {
  id: string;
  quantity: Int64String;
  sales_order_line_id: string;
}

export interface ServiceObligationOrderLineAllocationInput {
  quantity: Int64String;
  sales_order_line_id: string;
}

export interface ServiceObligationSatisfaction {
  control_transferred: boolean;
  customer_acceptance_reference: string;
  customer_acceptance_sha256: string;
  id: string;
  paragraph_38_control_reference: string;
  paragraph_38_control_sha256: string;
  performance_obligation_id: string;
  point_in_time_satisfied: boolean;
  qualified_evidence_reference: string;
  qualified_evidence_sha256: string;
  satisfaction_date: string;
}

export interface ServiceObligationSatisfactionInput {
  control_transferred: boolean;
  customer_acceptance_reference: string;
  customer_acceptance_sha256: string;
  paragraph_38_control_reference: string;
  paragraph_38_control_sha256: string;
  performance_obligation_id: string;
  point_in_time_satisfied: boolean;
  qualified_evidence_reference: string;
  qualified_evidence_sha256: string;
  satisfaction_date: string;
}

export interface ServiceOrder {
  confirmed_at?: string | null;
  confirmed_by_principal_id?: string | null;
  contact_id: string;
  currency: string;
  document_date: string;
  document_number: string;
  id: string;
  lines: ServiceOrderLine[];
  state_revision: Int64String;
  status: ServiceOrderState;
  subtotal: Int64String;
}

export interface ServiceOrderLifecycle {
  evidence_digest: string;
  evidence_reference: string;
  reason: string;
  target_status: ServiceOrderState;
}

export interface ServiceOrderLine {
  accepted_or_pending_quantity: Int64String;
  confirmed_quantity: Int64String;
  description: string;
  id: string;
  item_id: string;
}

export type ServiceOrderState = "draft" | "confirmed" | "partially_fulfilled" | "fulfilled" | "on_hold" | "closed" | "cancelled";

export interface ServicePerformanceObligation {
  allocated_amount: Int64String;
  billing_allocations: ServiceObligationBillingAllocation[];
  description: string;
  id: string;
  order_line_allocations: ServiceObligationOrderLineAllocation[];
  reference: string;
}

export interface ServicePerformanceObligationInput {
  allocated_amount: Int64String;
  billing_allocations: ServiceObligationBillingAllocationInput[];
  description: string;
  order_line_allocations: ServiceObligationOrderLineAllocationInput[];
  reference: string;
}

export interface ServiceRecognitionReadinessAssessment {
  actor_principal_id: string;
  contact_id: string;
  created_at: string;
  currency: string;
  finalized_at: string;
  fixed_transaction_price: Int64String;
  id: string;
  obligation_satisfactions: ServiceObligationSatisfaction[];
  sales_order_id: string;
  sales_order_state_revision: Int64String;
  service_contract_assessment_id: string;
  source_customer_quote_id: string;
  source_quote_revision: Int64String;
  tax_point_assessments: ServiceTaxPointAssessment[];
}

export type ServiceRevenueClassification = "point_in_time" | "over_time";

export interface ServiceTaxPointAssessment {
  currency: string;
  designated_collector: boolean;
  domestic_supply: boolean;
  export_supply: boolean;
  faktur_date: string;
  faktur_reference: string;
  free_trade_zone: boolean;
  id: string;
  other_exclusion: boolean;
  prior_advance_tax: boolean;
  prior_taxed_base: Int64String;
  prior_term_tax: boolean;
  qualified_basis_reference: string;
  qualified_basis_sha256: string;
  remaining_taxable_base: Int64String;
  service_invoice_id: string;
  special_regime: boolean;
  statutory_supply_basis: string;
  supplier_pkp: boolean;
  tax_facility: boolean;
  tax_point_date: string;
  taxable_service_jkp: boolean;
}

export interface ServiceTaxPointAssessmentInput {
  designated_collector: boolean;
  domestic_supply: boolean;
  export_supply: boolean;
  faktur_date: string;
  faktur_reference: string;
  free_trade_zone: boolean;
  other_exclusion: boolean;
  prior_advance_tax: boolean;
  prior_taxed_base: Int64String;
  prior_term_tax: boolean;
  qualified_basis_reference: string;
  qualified_basis_sha256: string;
  remaining_taxable_base: Int64String;
  service_invoice_id: string;
  special_regime: boolean;
  statutory_supply_basis: string;
  supplier_pkp: boolean;
  tax_facility: boolean;
  tax_point_date: string;
  taxable_service_jkp: boolean;
}

export interface SetApprovalPolicy {
  mode: string;
  reason: string;
  required_role?: string | null;
  threshold_amount?: Int64String | null;
}

export interface SetContactCreditLimitRequest {
  credit_hold_active?: boolean | null;
  credit_limit_minor: Int64String;
  grace_period_days?: number | null;
}

export interface SetLandedCostPolicy {
  residual_treatment: string;
}

export interface SetTimephasedBaselineRequest {
  items: TimephasedBaselineItemRequest[];
}

export interface ShareDocument {
  sales_document_id: string;
}

export interface SharedDocument {
  id: string;
  prepared_document_id: string;
  prepared_status: string;
  source_document_number: string;
}

export interface ShippingRateQuoteView {
  courier_name: string;
  courier_service_code: string;
  currency: string;
  estimated_days: string;
  is_cod_supported: boolean;
  provider_name: string;
  rate_amount_minor: Int64String;
  service_name: string;
}

export interface ShippingRatesQuoteListView {
  cached_until: string;
  company_book_id: string;
  destination_postal_code: string;
  origin_postal_code: string;
  quotes: ShippingRateQuoteView[];
  weight_grams: number;
}

export interface SignoffAccountingPeriodAuditorRequest {
  auditor_firm_name: string;
  auditor_license_number: string;
  auditor_public_key_fingerprint: string;
  auditor_signature_scope?: string | null;
  fiscal_period: number;
  fiscal_year: number;
  merkle_root_hash: string;
  pki_signature_hex: string;
}

export interface SingaporeEntityOnboardingView {
  agm_due?: string | null;
  annual_return_due?: string | null;
  base_currency: string;
  coa_template: string;
  company_book_id: string;
  corporate_secretary: string;
  directors: string[];
  gst_rate_basis_points: number;
  gst_registered: boolean;
  jurisdiction: string;
  legal_name: string;
  message: string;
  registered_address: string;
  status: string;
  uen: string;
}

export interface SleekCompanyProfileView {
  agm_due?: string | null;
  annual_return_due?: string | null;
  company_book_id: string;
  company_type: string;
  corporate_secretary: string;
  directors: string[];
  legal_name: string;
  registered_address: string;
  registration_date: string;
  status: string;
  uen: string;
}

export interface SleekSignDocumentView {
  company_book_id: string;
  dispatched_at: string;
  document_id: string;
  document_title: string;
  recipient_email: string;
  signing_url?: string | null;
  status: string;
}

export interface SleekWebhookAckView {
  event_id: string;
  status: string;
  success: boolean;
}

export interface SleekWebhookPayload {
  document_id: string;
  event: string;
  signature_hash?: string | null;
  status: string;
  uen: string;
}

export interface SoftLockAccountingPeriodRequest {
  reason?: string | null;
}

export interface SoftLockAccountingPeriodView {
  accounting_period_id: string;
  company_book_id: string;
  id: string;
  locked_at: string;
  locked_by_principal_id: string;
  reason?: string | null;
  status: string;
}

export interface SourcedPurchaseOrderListView {
  purchase_orders: PurchaseOrderView[];
}

export interface StarterCoaPreview {
  collisions: PreviewCollision[];
  components: ComponentRef[];
  lines: PreviewLine[];
  status: string;
}

export interface StatementOfChangesInEquity {
  closing_equity_minor: number;
  movements: EquityMovementLine[];
  net_income_minor: number;
  opening_equity_minor: number;
}

export interface StockPosition {
  avg_cost: Int64String;
  book_value: Int64String;
  item_id: string;
  on_hand_qty: Int64String;
}

export interface StocktakeRequest {
  counted_qty: Int64String;
  note?: string | null;
}

export interface SubledgerStatementView {
  account_role: string;
  company_book_id: string;
  counterparty_entity_id: string;
  created_at: string;
  id: string;
  in_review_claim_balance_minor: Int64String;
  matured_claimable_balance_minor: Int64String;
  non_fiat_units_balance: number;
  paid_out_total_minor: Int64String;
  tax_withheld_total_minor: Int64String;
  unmatured_balance_minor: Int64String;
}

export interface SubmitAppRequest {
  app_type: string;
  app_url?: string | null;
  category: string;
  demo_url?: string | null;
  description: string;
  execution_mode?: string | null;
  icon_url?: string | null;
  name: string;
  pricing_model?: string | null;
  slug: string;
  summary: string;
  version?: string | null;
}

export interface SubmitConnectorRequest {
  category: string;
  description: string;
  documentation_url?: string | null;
  execution_mode?: string | null;
  icon_url?: string | null;
  mcp_protocol_version?: string | null;
  name: string;
  pricing_model?: string | null;
  release_notes?: string | null;
  required_permission_scopes?: string[] | null;
  slug: string;
  summary: string;
  version?: string | null;
  version_semver: string;
}

export interface SubmitPosOrderRequest {
  financial_date: string;
  handover: PosHandoverEvidenceRequest;
}

export interface SubmitSubledgerClaimRequest {
  account_role: string;
  claim_amount_minor: Int64String;
}

export interface SubscriptionPlanView {
  billing_interval: string;
  company_book_id: string;
  created_at: string;
  currency: string;
  id: string;
  plan_code: string;
  plan_name: string;
  price_minor: Int64String;
  status: string;
  tenant_id: string;
}

export interface SupplierQuote {
  accepted_at?: string | null;
  approval_request_id?: string | null;
  connector_idempotency_key?: string | null;
  contact_id: string;
  created_at: string;
  currency: string;
  document_number: string;
  eligibility: Eligibility;
  external_company_ref?: string | null;
  external_content_sha256?: string | null;
  external_party_ref?: string | null;
  external_quote_ref?: string | null;
  external_revision_ref?: string | null;
  id: string;
  lines: SupplierQuoteLineView[];
  memo?: string | null;
  quote_date: string;
  revision_of_id?: string | null;
  source_system?: string | null;
  status: QuoteState;
  subtotal: Int64String;
  supplier_reference: string;
  total: Int64String;
  updated_at: string;
  valid_until: string;
}

export interface SupplierQuoteConversion {
  action: ConversionAction;
  document_date: string;
  lines: SupplierQuoteConversionLine[];
  memo?: string | null;
  reason?: string | null;
  revision?: null | QuoteRevisionRequest;
}

export interface SupplierQuoteConversionLine {
  discount_amount?: Int64String;
  quantity: Int64String;
  quote_line_id: string;
  unit_price: Int64String;
}

export interface SupplierQuoteDecision {
  decision: string;
  reason?: string | null;
}

export interface SupplierQuoteLine {
  description: string;
  discount_amount?: Int64String;
  item_id?: string | null;
  quantity: Int64String;
  unit_price: Int64String;
}

export interface SupplierQuoteLineView {
  description: string;
  discount_amount: Int64String;
  id: string;
  item_id?: string | null;
  line_total: Int64String;
  ordinal: number;
  quantity: Int64String;
  unit_price: Int64String;
}

export interface SupplierQuoteList {
  quotes: SupplierQuote[];
}

export interface SyncOfflineQueueItem {
  client_device_signature: string;
  client_queue_id: string;
  offline_seq_hash: string;
  transaction_payload: unknown;
  transaction_type: string;
}

export interface SyncOfflineQueueRequest {
  records: SyncOfflineQueueItem[];
}

export interface SyncOfflineQueueResultView {
  processed_count: number;
  synced_records: SyncOfflineRecordView[];
}

export interface SyncOfflineRecordView {
  client_device_signature: string;
  client_queue_id: string;
  id: string;
  offline_seq_hash: string;
  status: string;
  synced_at?: string | null;
  transaction_type: string;
}

export interface SyncSleekCompanyProfileRequest {
  api_key?: string | null;
  uen: string;
}

export interface TagOwnerRequest {
  owner_email: string;
  owner_name: string;
}

export interface TemplateDefinitionView {
  category: string;
  created_at: string;
  id: string;
  locale: string;
  name: string;
  source_capability: string;
  template_key: string;
  tenant_id: string;
  variable_schema: unknown;
}

export interface TemplateSelectionView {
  company_book_id: string;
  created_at: string;
  created_by: string;
  document_kind: string;
  effective_from: string;
  id: string;
  provenance: unknown;
  template_id: string;
  template_version: string;
  tenant_id: string;
}

export interface TemplateVersionView {
  content_payload: string;
  created_at: string;
  style_metadata?: unknown;
  subject_pattern?: string | null;
  template_id: string;
  tenant_id: string;
  version: number;
}

export interface TemporaryLockEvidenceView {
  expires_at?: string | null;
  locked_at: string;
  owner_principal_id: string;
  reason: string;
}

export interface TenantInfrastructureMigrationView {
  company_book_id: string;
  id: string;
  initiated_by_principal_id: string;
  migrated_at: string;
  migrated_journal_count: Int64String;
  migration_payload_uri: string;
  proof_sentinel_checksum: string;
  source_deployment_mode: string;
  status: string;
  target_deployment_mode: string;
  tenant_id: string;
}

export interface TimephasedBaselineItemRequest {
  period_index: number;
  period_label: string;
  planned_cost_incremental_minor: Int64String;
  planned_progress_pct: number;
}

export interface TimesheetApprovalRunView {
  approved_by_principal_id: string;
  approved_entries_count: number;
  company_book_id: string;
  created_at: string;
  id: string;
  period_end: string;
  period_start: string;
  status: string;
  tenant_id: string;
  total_approved_amount_minor: Int64String;
  total_approved_hours: number;
}

export interface TimesheetEntryView {
  billable_rate_minor: Int64String;
  company_book_id: string;
  created_at: string;
  customer_contact_id: string;
  entry_date: string;
  hours_logged: number;
  id: string;
  is_billable: boolean;
  project_code: string;
  staff_principal_id: string;
  status: string;
  tenant_id: string;
  total_billable_minor: Int64String;
}

export interface TransferAndOffboardRequest {
  notes?: string | null;
  release_document_locks: boolean;
  successor_principal_id: string;
  transfer_attentions: boolean;
  transfer_calendar_events: boolean;
  transfer_drafts: boolean;
}

export interface TransformationConsume {
  item_id: string;
  quantity: Int64String;
}

export interface TransformationOutput {
  item_id: string;
  movement_id: string;
  quantity: Int64String;
  unit_cost: Int64String;
  value: Int64String;
}

export interface TransformationProduce {
  item_id: string;
  kind: string;
  quantity: Int64String;
  value?: Int64String | null;
}

export interface TransitionAdmissionRequest {
  reason: string;
}

export interface TransitionBankAccount {
  evidence: BankAccountEvidence[];
  reason: string;
  target_status: string;
}

export interface TransitionBookInput {
  effective_at: string;
  reason: string;
  target_state: LifecycleState;
}

export type TreatmentClassification = "required" | "permitted" | "workflow";

export interface TreatmentView {
  annual_rate_basis_points?: number | null;
  asset_category_id: string;
  authority_reference: string;
  book_id: string;
  classification_reference?: string | null;
  effective_from: string;
  id: string;
  method: string;
  policy_reference: string;
  reason: string;
  recorded_at: string;
  recorded_by: string;
  residual_value: Int64String;
  useful_life_months: number;
  version: Int64String;
}

export interface TrialBalance {
  lines: TrialBalanceLine[];
  total_credit_minor: number;
  total_debit_minor: number;
}

export interface TrialBalanceLine {
  account_code: string;
  account_id: string;
  account_name: string;
  balance_minor: number;
  credit_minor: number;
  debit_minor: number;
}

export interface TrialBalanceRenderProjection {
  as_of?: string | null;
  book_id: string;
  company_book_id: string;
  complete: boolean;
  functional_currency: string;
  has_more: boolean;
  lines: TrialBalanceLine[];
  masking: string;
  membership_read_visibility_revision: string;
  next_cursor?: string | null;
  payload_id?: string | null;
  payload_schema_version: number;
  payload_sha256?: string | null;
  report_kind: string;
  source_report_id: string;
  source_report_revision?: string | null;
  total_credit_minor: number;
  total_debit_minor: number;
}

export interface TriggerContinuousCloseRequest {
  close_readiness_score?: number | null;
  daily_fx_revaluation_last_run?: string | null;
  daily_micro_depreciation_last_run?: string | null;
  fiscal_period: number;
  fiscal_year: number;
  reconciliation_matched_count?: Int64String | null;
  status?: string | null;
}

export interface TriggerFederatedNodeSyncRequest {
  endpoint_uri: string;
  node_deployment_mode?: string | null;
  node_name: string;
  public_key_fingerprint: string;
}

export interface UaeTaxSettingsView {
  company_book_id: string;
  corporate_tax_exemption: boolean;
  created_at: string;
  free_zone_name?: string | null;
  id: string;
  is_free_zone_qfzp: boolean;
  tenant_id: string;
  trn_number: string;
  vat_stagger_period: string;
}

export interface UnifiedIdentityItem {
  created_at: string;
  email?: string | null;
  identity_id: string;
  identity_type: string;
  issuer: string;
  last_active_at?: string | null;
  name: string;
  status: string;
  total_requests: Int64String;
}

export interface UnitReferenceItem {
  lot_batch: string;
  unit_id: string;
}

export interface UnitResolverPayload {
  acquisition_date: string;
  current_location: string;
  financial_cost_basis: Int64String;
  item_code: string;
  item_name: string;
  provenance_journal_ref: string;
  serial_number: string;
  unit_references: UnitReferenceItem[];
  warranty_status: string;
}

export interface UniversalContractView {
  capital_ratio: number;
  company_book_id: string;
  contract_mode: string;
  created_at: string;
  id: string;
  profit_split_ratio: number;
  status: string;
  tenant_id: string;
}

export interface UpdateBankAccount {
  account_name?: string | null;
  account_number?: string | null;
  account_type?: string | null;
  bank_code?: string | null;
  bank_name?: string | null;
  currency?: string | null;
  dimension_value_ids?: string[] | null;
  gl_account_code?: string | null;
  institution_contact_id?: string | null;
  swift_code?: string | null;
}

export interface UpdateCalendarEventStatusRequest {
  status: CalendarEventStatus;
}

export interface UpdateContact {
  active?: boolean;
  dimension_value_ids?: string[] | null;
  email?: string | null;
  name: string;
  notes?: string | null;
  tax_id?: string | null;
  telephone?: string | null;
}

export interface UpdateInstalledConnectorConfigRequest {
  configuration_values?: unknown;
  granted_permission_scopes?: string[] | null;
  is_enabled?: boolean | null;
}

export interface UpdateItem {
  active?: boolean;
  aliases?: string[] | null;
  barcode?: string | null;
  description?: string | null;
  dimension_value_ids?: string[] | null;
  max_stock_level?: Int64String | null;
  min_stock_level?: Int64String | null;
  name: string;
  preferred_supplier_contact_id?: string | null;
  purchase_account?: string | null;
  purchase_price?: Int64String | null;
  sale_account?: string | null;
  sale_price?: Int64String | null;
  sku?: string | null;
  taxable?: boolean;
  unit?: string | null;
}

export interface UpdatePayment {
  amount: Int64String;
  bank_account_id: string;
  contact_id: string;
  currency: string;
  dimension_value_ids?: string[] | null;
  direction: string;
  memo?: string | null;
  payment_date: string;
  payment_method?: string | null;
  reference?: string | null;
}

export interface UpdateRoleMetadataRequest {
  description?: string | null;
  suffix: string;
}

export interface UpsertContactOrganization {
  industry?: string | null;
  legal_name: string;
  lei?: string | null;
  registration_no?: string | null;
  website?: string | null;
}

export interface UpsertContactPerson {
  additional_name?: string | null;
  birth_date?: string | null;
  family_name?: string | null;
  gender?: number | null;
  gender_description?: string | null;
  given_name: string;
}

export interface UpsertContactProfile {
  about?: string | null;
  headline?: string | null;
  location?: string | null;
  photo_url?: string | null;
  website?: string | null;
}

export interface UsGaapBalanceSheetView {
  as_of: string;
  company_book_id: string;
  currency: string;
  current_assets_minor: Int64String;
  current_liabilities_minor: Int64String;
  non_current_assets_minor: Int64String;
  non_current_liabilities_minor: Int64String;
  presentation_standard: string;
  stockholders_equity_minor: Int64String;
  total_assets_minor: Int64String;
  total_liabilities_and_equity_minor: Int64String;
  total_liabilities_minor: Int64String;
}

export interface UsGaapIncomeStatementView {
  company_book_id: string;
  cost_of_goods_sold_minor: Int64String;
  currency: string;
  from_date?: string | null;
  gross_profit_minor: Int64String;
  gross_revenue_minor: Int64String;
  income_before_tax_minor: Int64String;
  income_tax_expense_minor: Int64String;
  net_income_minor: Int64String;
  non_operating_income_expense_minor: Int64String;
  operating_expenses_minor: Int64String;
  operating_income_minor: Int64String;
  presentation_standard: string;
  to_date?: string | null;
}

export interface UserDraftView {
  client_device_signature: string;
  company_book_id: string;
  draft_payload: unknown;
  draft_type: string;
  has_draft: boolean;
  id?: string | null;
  updated_at?: string | null;
  user_principal_id: string;
}

export interface UserReferralCodeView {
  company_book_id: string;
  created_at: string;
  referee_discount_pct: number;
  referral_code: string;
  referral_code_id: string;
  referrer_principal_id: string;
  referrer_reward_pct: number;
  total_credits_earned_minor: Int64String;
}

export interface ValidationViolation {
  code: string;
  message: string;
  path: string;
}

export interface VariableConsiderationPredictionView {
  company_book_id: string;
  created_at: string;
  customer_id: string;
  id: string;
  predicted_take_up_probability: number;
  reserve_account_code: string;
  reserved_discount_amount_minor: Int64String;
  sales_document_id: string;
  should_book_day1_reserve: boolean;
  status: string;
  tenant_id: string;
}

export interface WealthPortfolioView {
  asset_class: string;
  created_at: string;
  currency: string;
  current_valuation_minor: Int64String;
  family_group_id: string;
  id: string;
  last_valued_at: string;
  portfolio_name: string;
  tenant_id: string;
}

export interface WebhookDeliveryView {
  created_at: string;
  event_payload: unknown;
  event_type: string;
  http_status?: number | null;
  id: Int64String;
  retry_count: number;
  sent_at?: string | null;
  status: string;
  subscription_id: string;
}

export interface WebhookSubscriptionView {
  company_book_id: string;
  created_at: string;
  event_types: string[];
  id: string;
  is_active: boolean;
  last_status?: string | null;
  retry_count: number;
  target_url: string;
}

export interface WorkOrderPartsIssuedView {
  company_book_id: string;
  created_at: string;
  id: string;
  item_id: string;
  quantity: number;
  tenant_id: string;
  total_cost_minor: Int64String;
  unit_cost_minor: Int64String;
  work_order_id: string;
}

export interface WorkingCapitalContributionView {
  calculated_amount_minor: Int64String;
  company_book_id: string;
  contribution_basis: string;
  contribution_percentage_rate: number;
  created_at: string;
  id: string;
  period_year: number;
  recipient_contact_id: string;
  status: string;
  tenant_id: string;
}

export interface XeroHistoricalDataImportView {
  company_book_id: string;
  import_id: string;
  imported_at: string;
  imported_contacts_count: number;
  imported_journals_count: number;
  status: string;
  xero_tenant_id: string;
}

const schemaDescriptors: Record<string, SchemaDescriptor> =
{"AcceptInvitationRequest":{"kind":"object","properties":{"token":{"kind":"string"}},"additional":null},"Account":{"kind":"object","properties":{"active":{"kind":"boolean"},"code":{"kind":"string"},"id":{"kind":"string"},"manual_entry_allowed":{"kind":"boolean"},"name":{"kind":"string"},"normal_balance":{"kind":"string"},"state_revision":{"kind":"int64"}},"additional":null},"AccountList":{"kind":"object","properties":{"accounts":{"kind":"array","items":{"kind":"ref","name":"Account"}}},"additional":null},"AccountingBookScopeSummary":{"kind":"object","properties":{"mode":{"kind":"string"}},"additional":null},"AccountingPeriod":{"kind":"object","properties":{"financial_end":{"kind":"string"},"financial_start":{"kind":"string"},"id":{"kind":"string"},"state":{"kind":"ref","name":"PeriodState"},"state_revision":{"kind":"int64"},"temporary_posting_lock":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"TemporaryLockEvidenceView"}]}},"additional":null},"AccountingPeriodList":{"kind":"object","properties":{"accounting_periods":{"kind":"array","items":{"kind":"ref","name":"AccountingPeriod"}}},"additional":null},"AccountingPeriodTransition":{"kind":"object","properties":{"reason":{"kind":"string"}},"additional":null},"AccountsReceivableAgingReportView":{"kind":"object","properties":{"aging_buckets":{"kind":"ref","name":"ArAgingBucketView"},"as_of_date":{"kind":"string"},"company_book_id":{"kind":"string"},"generated_at":{"kind":"string"},"total_ar_outstanding_minor":{"kind":"int64"}},"additional":null},"AcquireDocumentLockRequest":{"kind":"object","properties":{"display_name":{"kind":"string"},"email":{"kind":"string"},"ttl_minutes":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"AddRevisionRequest":{"kind":"object","properties":{"content":{"kind":"ref","name":"CadjProposalContent"}},"additional":null},"AddSubsidiaryMemberRequest":{"kind":"object","properties":{"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ownership_percentage":{"kind":"number"},"subsidiary_company_book_id":{"kind":"string"}},"additional":null},"AdminReviewSubmissionRequest":{"kind":"object","properties":{"decision":{"kind":"string"},"review_comments":{"kind":"string"},"target_id":{"kind":"string"},"target_type":{"kind":"string"}},"additional":null},"AdmissionView":{"kind":"object","properties":{"admission_scope":{"kind":"string"},"application":{"kind":"string"},"client_application_id":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"created_by_principal_id":{"kind":"string"},"created_reason":{"kind":"string"},"data_handling_notice":{"kind":"string"},"deployment_environment":{"kind":"string"},"exit_export_route":{"kind":"string"},"expires_at":{"kind":"string"},"id":{"kind":"string"},"participant_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"principal_id":{"kind":"string"},"review_at":{"kind":"string"},"revocation_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"revoked_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"revoked_by_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"starts_at":{"kind":"string"},"state_revision":{"kind":"int64"},"status":{"kind":"string"},"support_contact":{"kind":"string"},"suspended_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"suspended_by_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"suspension_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tenant_id":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"AgingBucket":{"kind":"object","properties":{"contact_id":{"kind":"string"},"contact_name":{"kind":"string"},"current":{"kind":"int64"},"days_1_30":{"kind":"int64"},"days_31_60":{"kind":"int64"},"days_61_90":{"kind":"int64"},"days_90_plus":{"kind":"int64"},"total_open":{"kind":"int64"}},"additional":null},"AgingBucketSummary":{"kind":"object","properties":{"aging_31_60d":{"kind":"int64"},"aging_61_90d":{"kind":"int64"},"aging_90d_plus":{"kind":"int64"},"current_0_30d":{"kind":"int64"}},"additional":null},"AgingReport":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"buckets":{"kind":"array","items":{"kind":"ref","name":"AgingBucket"}},"direction":{"kind":"string"},"grand_total":{"kind":"int64"}},"additional":null},"AllocateContractLossRequest":{"kind":"object","properties":{"capital_ratio":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"contract_id":{"kind":"string"},"contract_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_id":{"kind":"string"},"total_loss_minor":{"kind":"int64"}},"additional":null},"AllocateNsfpPoolRequest":{"kind":"object","properties":{"nsfp_end_number":{"kind":"string"},"nsfp_start_number":{"kind":"string"},"tax_year":{"kind":"integer"}},"additional":null},"AllocatePayment":{"kind":"object","properties":{"allocated_amount":{"kind":"int64"},"document_id":{"kind":"string"},"document_type":{"kind":"string"},"fx_gain_loss":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"ApiError":{"kind":"object","properties":{"code":{"kind":"string"},"details":{"kind":"ref","name":"ApiErrorDetails"},"message":{"kind":"string"},"request_id":{"kind":"string"}},"additional":null},"ApiErrorDetails":{"kind":"object","properties":{"violations":{"kind":"union","variants":[{"kind":"array","items":{"kind":"ref","name":"ValidationViolation"}},{"kind":"null"}]}},"additional":null},"ApplyInvoiceEstampRequest":{"kind":"object","properties":{"document_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"provider_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ApplyPartnerRequest":{"kind":"object","properties":{"certified_consultants_count":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"contact_email":{"kind":"string"},"description":{"kind":"string"},"industry_specializations":{"kind":"array","items":{"kind":"string"}},"jurisdiction_coverage":{"kind":"array","items":{"kind":"string"}},"logo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"partner_name":{"kind":"string"},"partner_type":{"kind":"string"},"summary":{"kind":"string"},"website_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ApprovalDecisionRequest":{"kind":"object","properties":{"decision":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ApprovalDecisionResponse":{"kind":"object","properties":{"approval_request_id":{"kind":"string"},"decision":{"kind":"string"},"state":{"kind":"string"}},"additional":null},"ApprovalPolicySetting":{"kind":"object","properties":{"configured":{"kind":"boolean"},"mode":{"kind":"string"},"required_role":{"kind":"string"},"source_capability":{"kind":"string"},"threshold_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"ApproveLiveRequest":{"kind":"object","properties":{"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ApprovePayrollCalculationRequest":{"kind":"object","properties":{"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payroll_run_id":{"kind":"string"}},"additional":null},"ApprovePayrollRunRequest":{"kind":"object","properties":{"auto_post_journal":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]}},"additional":null},"ApproveTimesheetBatchRequest":{"kind":"object","properties":{"period_end":{"kind":"string"},"period_start":{"kind":"string"},"timesheet_entry_ids":{"kind":"array","items":{"kind":"string"}}},"additional":null},"ArAgingBucketView":{"kind":"object","properties":{"current_minor":{"kind":"int64"},"days_1_30_minor":{"kind":"int64"},"days_31_60_minor":{"kind":"int64"},"days_61_90_minor":{"kind":"int64"},"over_90_days_minor":{"kind":"int64"}},"additional":null},"ArApReconciliation":{"kind":"object","properties":{"difference":{"kind":"int64"},"direction":{"kind":"string"},"gl_account_balance":{"kind":"int64"},"reconciled":{"kind":"boolean"},"subledger_open_total":{"kind":"int64"}},"additional":null},"ArchiveCompanyBook":{"kind":"object","properties":{},"additional":null},"AssessPocProjectRevenueRequest":{"kind":"object","properties":{"actual_cost_incurred_minor":{"kind":"int64"},"billed_to_date_minor":{"kind":"int64"}},"additional":null},"AssetCategoryView":{"kind":"object","properties":{"created_at":{"kind":"string"},"created_by":{"kind":"string"},"id":{"kind":"string"},"name":{"kind":"string"}},"additional":null},"AssignParticipantRequest":{"kind":"object","properties":{"participant_role":{"kind":"string"},"principal_id":{"kind":"string"}},"additional":null},"Attention":{"kind":"object","properties":{"action_type":{"kind":"string"},"action_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"detail":{"kind":"value"},"id":{"kind":"string"},"severity":{"kind":"string"},"source_capability":{"kind":"string"},"source_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_type":{"kind":"string"},"state":{"kind":"string"},"title":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"AttentionList":{"kind":"object","properties":{"attentions":{"kind":"array","items":{"kind":"ref","name":"Attention"}},"unread_count":{"kind":"int64"}},"additional":null},"AuctionBidView":{"kind":"object","properties":{"bid_amount_minor":{"kind":"int64"},"bid_deposit_hold_id":{"kind":"string"},"bidder_principal_id":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"lot_id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"AuctionLotView":{"kind":"object","properties":{"auction_mode":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"current_highest_bid_minor":{"kind":"int64"},"end_time":{"kind":"string"},"id":{"kind":"string"},"lot_title":{"kind":"string"},"reserve_price_minor":{"kind":"int64"},"starting_price_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"winning_bidder_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"AuctionSettlementView":{"kind":"object","properties":{"buyer_premium_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"lot_id":{"kind":"string"},"net_payout_minor":{"kind":"int64"},"seller_commission_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"winning_bid_minor":{"kind":"int64"}},"additional":null},"AuditFindingContent":{"kind":"object","properties":{"affected_period":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"asserted_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"asserted_currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"classification":{"kind":"string"},"description":{"kind":"string"}},"additional":null},"AuditedCalkNotesView":{"kind":"object","properties":{"accounting_policies_summary":{"kind":"string"},"audit_merkle_root_hash":{"kind":"string"},"audit_working_paper_ref":{"kind":"string"},"company_book_id":{"kind":"string"},"critical_accounting_estimates":{"kind":"string"},"currency":{"kind":"string"},"general_information":{"kind":"string"},"generated_at":{"kind":"string"},"period_end_date":{"kind":"string"},"period_start_date":{"kind":"string"},"reporting_standard":{"kind":"string"},"segment_reporting_notes":{"kind":"array","items":{"kind":"string"}}},"additional":null},"AuditedCashFlowStatementView":{"kind":"object","properties":{"audit_merkle_root_hash":{"kind":"string"},"beginning_cash_balance_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"currency":{"kind":"string"},"ending_cash_balance_minor":{"kind":"int64"},"financing_activities_minor":{"kind":"int64"},"generated_at":{"kind":"string"},"investing_activities_minor":{"kind":"int64"},"method":{"kind":"string"},"net_cash_flow_minor":{"kind":"int64"},"operating_activities_minor":{"kind":"int64"},"period_end_date":{"kind":"string"},"period_start_date":{"kind":"string"},"reporting_standard":{"kind":"string"}},"additional":null},"AuditedChangesInEquityView":{"kind":"object","properties":{"additional_paid_in_capital_minor":{"kind":"int64"},"audit_merkle_root_hash":{"kind":"string"},"company_book_id":{"kind":"string"},"currency":{"kind":"string"},"generated_at":{"kind":"string"},"other_comprehensive_income_minor":{"kind":"int64"},"period_end_date":{"kind":"string"},"period_start_date":{"kind":"string"},"reporting_standard":{"kind":"string"},"retained_earnings_minor":{"kind":"int64"},"share_capital_minor":{"kind":"int64"},"total_equity_minor":{"kind":"int64"}},"additional":null},"AuditorDigitalSignatureView":{"kind":"object","properties":{"auditor_firm_name":{"kind":"string"},"auditor_license_number":{"kind":"string"},"auditor_principal_id":{"kind":"string"},"auditor_public_key_fingerprint":{"kind":"string"},"auditor_signature_scope":{"kind":"string"},"company_book_id":{"kind":"string"},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"id":{"kind":"string"},"merkle_root_hash":{"kind":"string"},"pki_signature_hex":{"kind":"string"},"signed_at":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"AuditorSignatureStatusView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"is_signed":{"kind":"boolean"},"period_id":{"kind":"string"},"signature":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"AuditorDigitalSignatureView"}]},"verification_status":{"kind":"string"}},"additional":null},"AuditorWorkingPaperView":{"kind":"object","properties":{"adjustment_scope":{"kind":"string"},"auditor_role":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"created_by_principal_id":{"kind":"string"},"division_code":{"kind":"string"},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"id":{"kind":"string"},"paper_findings_json":{"kind":"value"},"paper_title":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"AuthorityComponentSummary":{"kind":"object","properties":{"display_name":{"kind":"string"},"id":{"kind":"string"},"unrestricted":{"kind":"boolean"}},"additional":null},"AuthorityContextKind":{"kind":"enum","values":["operational_role","owner"]},"AuthorityContextList":{"kind":"object","properties":{"authority_contexts":{"kind":"array","items":{"kind":"ref","name":"AuthorityContextSummary"}},"membership_read_visibility_revision":{"kind":"string"}},"additional":null},"AuthorityContextStatus":{"kind":"enum","values":["active","revoked"]},"AuthorityContextSummary":{"kind":"object","properties":{"accounting_book_scope":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"AccountingBookScopeSummary"}]},"authority_context_id":{"kind":"string"},"authority_revision":{"kind":"int64"},"context_group":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"AuthorityComponentSummary"}]},"document_access_profile":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"AuthorityComponentSummary"}]},"kind":{"kind":"ref","name":"AuthorityContextKind"},"membership_read_visibility_revision":{"kind":"string"},"role_display_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role_system":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"status":{"kind":"ref","name":"AuthorityContextStatus"}},"additional":null},"AuthorityRevisionPreview":{"kind":"object","properties":{"added_actions":{"kind":"array","items":{"kind":"string"}},"affected_principals":{"kind":"int64"},"current_authority_revision_id":{"kind":"string"},"elevated":{"kind":"boolean"},"permission_group_id":{"kind":"string"},"removed_actions":{"kind":"array","items":{"kind":"string"}},"role_id":{"kind":"string"}},"additional":null},"AuthorizedCompanyBookView":{"kind":"object","properties":{"authority_context_count":{"kind":"int64"},"display_name":{"kind":"string"},"functional_currency":{"kind":"string"},"id":{"kind":"string"},"membership_read_visibility_revision":{"kind":"string"},"read_only":{"kind":"boolean"},"status":{"kind":"ref","name":"CompanyBookStatus"}},"additional":null},"AutoSyncDraftRequest":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"draft_payload":{"kind":"value"},"draft_type":{"kind":"string"}},"additional":null},"AutoSyncDraftView":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"company_book_id":{"kind":"string"},"draft_payload":{"kind":"value"},"draft_type":{"kind":"string"},"id":{"kind":"string"},"synced":{"kind":"boolean"},"updated_at":{"kind":"string"},"user_principal_id":{"kind":"string"}},"additional":null},"BadDebtProvisioningRunView":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"provision_allowance_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"total_ar_outstanding_minor":{"kind":"int64"}},"additional":null},"BalanceSheet":{"kind":"object","properties":{"assets":{"kind":"ref","name":"BalanceSheetSection"},"equity":{"kind":"ref","name":"BalanceSheetSection"},"liabilities":{"kind":"ref","name":"BalanceSheetSection"},"total_equity_minor":{"kind":"integer"}},"additional":null},"BalanceSheetLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_id":{"kind":"string"},"account_name":{"kind":"string"},"balance_minor":{"kind":"integer"}},"additional":null},"BalanceSheetSection":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"BalanceSheetLine"}},"total_minor":{"kind":"integer"}},"additional":null},"BankAccount":{"kind":"object","properties":{"account_name":{"kind":"string"},"account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_type":{"kind":"string"},"bank_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bank_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"gl_account_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"institution_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"state_revision":{"kind":"int64"},"status":{"kind":"string"},"swift_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"string"}},"additional":null},"BankAccountEvidence":{"kind":"object","properties":{"evidence_type":{"kind":"string"},"integrity_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"locator":{"kind":"string"}},"additional":null},"BankAccountList":{"kind":"object","properties":{"accounts":{"kind":"array","items":{"kind":"ref","name":"BankAccount"}}},"additional":null},"BankCategorizationRuleView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"description_pattern":{"kind":"string"},"id":{"kind":"string"},"priority":{"kind":"integer"},"rule_name":{"kind":"string"},"status":{"kind":"string"},"target_account_number":{"kind":"string"}},"additional":null},"BankFeedConnectionView":{"kind":"object","properties":{"bank_name":{"kind":"string"},"company_book_id":{"kind":"string"},"connection_type":{"kind":"string"},"created_at":{"kind":"string"},"external_account_id":{"kind":"string"},"id":{"kind":"string"},"provider_name":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"BankFeedMatchConfirmationView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"confirmed_at":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"match_id":{"kind":"string"},"matched_invoice_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"statement_line_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"BankFeedMatchView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"confidence_score":{"kind":"number"},"created_at":{"kind":"string"},"id":{"kind":"string"},"match_status":{"kind":"string"},"matched_invoice_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"statement_line_id":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"BankLineMatch":{"kind":"object","properties":{"line_id":{"kind":"string"},"outcome":{"kind":"string"},"payment_ids":{"kind":"array","items":{"kind":"string"}}},"additional":null},"BankMatchRun":{"kind":"object","properties":{"already_resolved":{"kind":"int64"},"lines":{"kind":"array","items":{"kind":"ref","name":"BankLineMatch"}},"matched":{"kind":"int64"},"statement_id":{"kind":"string"},"suggested":{"kind":"int64"},"unmatched":{"kind":"int64"}},"additional":null},"BankReconciliation":{"kind":"object","properties":{"balanced":{"kind":"boolean"},"closing_balance":{"kind":"int64"},"difference":{"kind":"int64"},"finalized_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"movement":{"kind":"int64"},"opening_balance":{"kind":"int64"},"statement_id":{"kind":"string"},"status":{"kind":"string"},"unresolved_lines":{"kind":"int64"}},"additional":null},"BankStatement":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"closing_balance":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"import_source":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"BankStatementLine"}},"opening_balance":{"kind":"string"},"reconciliation_status":{"kind":"string"},"statement_date":{"kind":"string"}},"additional":null},"BankStatementFeedIngestView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"external_account_id":{"kind":"string"},"ingested_at":{"kind":"string"},"provider_name":{"kind":"string"},"records_ingested":{"kind":"integer"},"status":{"kind":"string"}},"additional":null},"BankStatementLine":{"kind":"object","properties":{"amount":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"string"},"id":{"kind":"string"},"match_status":{"kind":"string"},"matched_payment_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ordinal":{"kind":"integer"},"raw_record":{"kind":"value"},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"transaction_date":{"kind":"string"}},"additional":null},"BankStatementList":{"kind":"object","properties":{"statements":{"kind":"array","items":{"kind":"ref","name":"BankStatementSummary"}}},"additional":null},"BankStatementMappingOverride":{"kind":"object","properties":{"column_mapping":{"kind":"value"},"date_format":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"decimal_separator":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"delimiter":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"has_header_row":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"skip_lines":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"thousand_separator":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"BankStatementProfile":{"kind":"object","properties":{"active":{"kind":"boolean"},"bank_name":{"kind":"string"},"channel":{"kind":"string"},"column_mapping":{"kind":"value"},"currency":{"kind":"string"},"date_format":{"kind":"string"},"decimal_separator":{"kind":"string"},"delimiter":{"kind":"string"},"format":{"kind":"string"},"has_header_row":{"kind":"boolean"},"id":{"kind":"string"},"skip_lines":{"kind":"integer"},"thousand_separator":{"kind":"string"}},"additional":null},"BankStatementProfileList":{"kind":"object","properties":{"profiles":{"kind":"array","items":{"kind":"ref","name":"BankStatementProfile"}}},"additional":null},"BankStatementSummary":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"closing_balance":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"import_filename":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"import_source":{"kind":"string"},"line_count":{"kind":"int64"},"opening_balance":{"kind":"string"},"reconciliation_status":{"kind":"string"},"statement_date":{"kind":"string"}},"additional":null},"BarcodeLookupRequest":{"kind":"object","properties":{"barcode":{"kind":"string"}},"additional":null},"BarcodeLookupResponse":{"kind":"object","properties":{"barcode":{"kind":"string"},"category":{"kind":"string"},"name":{"kind":"string"},"product_id":{"kind":"string"},"retail_price":{"kind":"int64"},"stock_level":{"kind":"integer"},"uom":{"kind":"string"},"wholesale_min_qty":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"wholesale_price":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"BatamFtzSettingsView":{"kind":"object","properties":{"allow_usd_functional_currency":{"kind":"boolean"},"bp_batam_license_number":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"customs_registration_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"default_ftz_tax_code":{"kind":"string"},"id":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"BatamFtzVatSummaryView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"generated_at":{"kind":"string"},"ppftz_01_document_count":{"kind":"int64"},"ppftz_02_document_count":{"kind":"int64"},"ppftz_03_document_count":{"kind":"int64"},"tax_period":{"kind":"string"},"total_intra_ftz_delivery_minor":{"kind":"int64"},"total_tlddp_delivery_minor":{"kind":"int64"},"total_vat_collected_standard_minor":{"kind":"int64"},"total_vat_non_collectible_07_minor":{"kind":"int64"}},"additional":null},"BillableHoursInvoiceView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"customer_contact_id":{"kind":"string"},"invoice_id":{"kind":"string"},"period_end":{"kind":"string"},"period_start":{"kind":"string"},"sales_invoice_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"total_billable_hours":{"kind":"number"},"total_invoice_amount_minor":{"kind":"int64"}},"additional":null},"BillingOverviewResponse":{"kind":"object","properties":{"base_company_fee_idr":{"kind":"int64"},"per_pos_transaction_fee_idr":{"kind":"int64"},"projected_mrr_idr":{"kind":"int64"},"total_active_companies":{"kind":"int64"},"total_live_approved_companies":{"kind":"int64"},"total_pos_transactions_current_month":{"kind":"int64"},"total_sandbox_companies":{"kind":"int64"}},"additional":null},"BookComparisonLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_id":{"kind":"string"},"account_name":{"kind":"string"},"delta_minor":{"kind":"integer"},"left_balance_minor":{"kind":"integer"},"left_credit_minor":{"kind":"integer"},"left_debit_minor":{"kind":"integer"},"right_balance_minor":{"kind":"integer"},"right_credit_minor":{"kind":"integer"},"right_debit_minor":{"kind":"integer"}},"additional":null},"BookCourierDeliveryRequest":{"kind":"object","properties":{"cod_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"courier_service_code":{"kind":"string"},"is_cod":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"package_description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"provider_name":{"kind":"string"},"recipient_address":{"kind":"string"},"recipient_name":{"kind":"string"},"recipient_phone":{"kind":"string"},"recipient_postal_code":{"kind":"string"},"sender_address":{"kind":"string"},"sender_name":{"kind":"string"},"sender_phone":{"kind":"string"},"sender_postal_code":{"kind":"string"},"weight_grams":{"kind":"integer"}},"additional":null},"BookDepreciationResultView":{"kind":"object","properties":{"accumulated":{"kind":"int64"},"book_id":{"kind":"string"},"depreciated_through":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"months_posted":{"kind":"integer"},"nbv":{"kind":"int64"},"posted":{"kind":"array","items":{"kind":"ref","name":"PostedMonth"}}},"additional":null},"BookListView":{"kind":"object","properties":{"books":{"kind":"array","items":{"kind":"ref","name":"BookView"}}},"additional":null},"BookView":{"kind":"object","properties":{"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"id":{"kind":"string"},"is_primary":{"kind":"boolean"},"lifecycle_changed_by":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lifecycle_effective_at":{"kind":"string"},"lifecycle_reason":{"kind":"string"},"lifecycle_recorded_at":{"kind":"string"},"lifecycle_state":{"kind":"ref","name":"LifecycleState"},"name":{"kind":"string"},"purpose":{"kind":"string"},"state_revision":{"kind":"int64"}},"additional":null},"BookedCourierDeliveryView":{"kind":"object","properties":{"awb_tracking_number":{"kind":"string"},"booked_at":{"kind":"string"},"company_book_id":{"kind":"string"},"courier_service_code":{"kind":"string"},"currency":{"kind":"string"},"delivery_id":{"kind":"string"},"id":{"kind":"string"},"label_barcode_data":{"kind":"string"},"label_pdf_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"provider_name":{"kind":"string"},"shipping_cost_minor":{"kind":"int64"},"status":{"kind":"string"},"tracking_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"BoundedAccountList":{"kind":"object","properties":{"accounts":{"kind":"array","items":{"kind":"ref","name":"Account"}},"has_more":{"kind":"boolean"},"next_cursor":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"BoundedFinancialLineList":{"kind":"object","properties":{"book_id":{"kind":"string"},"has_more":{"kind":"boolean"},"lines":{"kind":"array","items":{"kind":"ref","name":"FinancialLine"}},"next_cursor":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"BoundedTrialBalanceComparison":{"kind":"object","properties":{"all_reconciled":{"kind":"boolean"},"as_of":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"has_more":{"kind":"boolean"},"left_book_id":{"kind":"string"},"left_reconciliation":{"kind":"ref","name":"Reconciliation"},"left_total_credit_minor":{"kind":"integer"},"left_total_debit_minor":{"kind":"integer"},"lines":{"kind":"array","items":{"kind":"ref","name":"BookComparisonLine"}},"next_cursor":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"right_book_id":{"kind":"string"},"right_reconciliation":{"kind":"ref","name":"Reconciliation"},"right_total_credit_minor":{"kind":"integer"},"right_total_debit_minor":{"kind":"integer"}},"additional":null},"BuiltByTier":{"kind":"enum","values":["official","certified_partner","community"]},"CadjLineInput":{"kind":"object","properties":{"account_code":{"kind":"string"},"amount_minor":{"kind":"int64"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"direction":{"kind":"string"},"ordinal":{"kind":"integer"}},"additional":null},"CadjProposalContent":{"kind":"object","properties":{"correction_route":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"string"},"evidence":{"kind":"array","items":{"kind":"ref","name":"EvidenceRefInput"}},"financial_date":{"kind":"string"},"ias8_rationale":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CadjLineInput"}}},"additional":null},"CalculatePayrollRunRequest":{"kind":"object","properties":{"include_commissions":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"include_overtime":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"}},"additional":null},"CalculateProfitSharingRequest":{"kind":"object","properties":{"agreement_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"hurdle_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"partner_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"share_percentage":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"split_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"total_net_profit_minor":{"kind":"int64"}},"additional":null},"CalculateShippingRatesRequest":{"kind":"object","properties":{"courier_providers":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"destination_postal_code":{"kind":"string"},"items_value_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"origin_postal_code":{"kind":"string"},"weight_grams":{"kind":"integer"}},"additional":null},"CalculateWorkingCapitalContributionsRequest":{"kind":"object","properties":{"contribution_basis":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contribution_percentage_rate":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"net_working_capital_minor":{"kind":"int64"},"period_year":{"kind":"integer"},"recipient_contact_id":{"kind":"string"}},"additional":null},"CalendarCategory":{"kind":"enum","values":["statutory_compliance","tax_filing","accounting_close","treasury_due","payroll","custom_milestone"]},"CalendarEventSeverity":{"kind":"enum","values":["info","warning","critical"]},"CalendarEventStatus":{"kind":"enum","values":["pending","satisfied","overdue","dismissed"]},"CalendarEventView":{"kind":"object","properties":{"action_label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"action_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"category":{"kind":"ref","name":"CalendarCategory"},"company_book_id":{"kind":"string"},"event_date":{"kind":"string"},"id":{"kind":"string"},"jurisdiction":{"kind":"string"},"severity":{"kind":"ref","name":"CalendarEventSeverity"},"source_capability":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"ref","name":"CalendarEventStatus"},"summary":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"title":{"kind":"string"}},"additional":null},"CalendarEventsSummaryView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"critical_count":{"kind":"integer"},"events":{"kind":"array","items":{"kind":"ref","name":"CalendarEventView"}},"pending_count":{"kind":"integer"},"total_events":{"kind":"integer"},"upcoming_30_days_count":{"kind":"integer"}},"additional":null},"CapabilityReadiness":{"kind":"intersection","variants":[{"kind":"ref","name":"CapabilityReadinessState"},{"kind":"object","properties":{"capability":{"kind":"string"},"company_book_id":{"kind":"string"},"decided_by":{"kind":"string"},"reason":{"kind":"string"}},"additional":null}]},"CapabilityReadinessState":{"kind":"union","variants":[{"kind":"object","properties":{"state":{"kind":"enum","values":["ready"]}},"additional":null},{"kind":"object","properties":{"state":{"kind":"enum","values":["missing_required_configuration"]}},"additional":null},{"kind":"object","properties":{"state":{"kind":"enum","values":["needs_review"]}},"additional":null},{"kind":"object","properties":{"state":{"kind":"enum","values":["recommended_action"]}},"additional":null},{"kind":"object","properties":{"state":{"kind":"enum","values":["not_applicable"]}},"additional":null},{"kind":"object","properties":{"operations":{"kind":"array","items":{"kind":"string"}},"state":{"kind":"enum","values":["blocked"]}},"additional":null}]},"CapabilitySettingInput":{"kind":"object","properties":{"capability_key":{"kind":"string"},"effective_from":{"kind":"string"},"enabled":{"kind":"boolean"},"reason":{"kind":"string"}},"additional":null},"CapabilitySettingView":{"kind":"object","properties":{"capability_key":{"kind":"string"},"changed_by":{"kind":"string"},"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"enabled":{"kind":"boolean"},"id":{"kind":"string"},"reason":{"kind":"string"},"version":{"kind":"int64"}},"additional":null},"CashFlowLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_name":{"kind":"string"},"amount_minor":{"kind":"integer"},"label":{"kind":"string"}},"additional":null},"CashFlowSection":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"CashFlowLine"}},"total_minor":{"kind":"integer"}},"additional":null},"CashFlowStatement":{"kind":"object","properties":{"financing":{"kind":"ref","name":"CashFlowSection"},"investing":{"kind":"ref","name":"CashFlowSection"},"net_cash_change_minor":{"kind":"integer"},"operating":{"kind":"ref","name":"CashFlowSection"}},"additional":null},"CertifyProgressRequest":{"kind":"object","properties":{"actual_cost_incurred_minor":{"kind":"int64"},"bast_document_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"certified_physical_progress_pct":{"kind":"number"},"period_index":{"kind":"integer"}},"additional":null},"ChangeRoleAuthorityRequest":{"kind":"object","properties":{"permission_group_id":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"ClaimConnectorVendorRequest":{"kind":"object","properties":{"claim_verification_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"counterparty_org_name":{"kind":"string"},"developer_id":{"kind":"string"},"official_domain_email":{"kind":"string"},"sentinel_proof_signature":{"kind":"string"}},"additional":null},"ClaimConnectorVendorView":{"kind":"object","properties":{"claim_id":{"kind":"string"},"claim_status":{"kind":"string"},"connector_id":{"kind":"string"},"counterparty_org_name":{"kind":"string"},"verified_at":{"kind":"string"}},"additional":null},"ClaimGuestCounterparty":{"kind":"object","properties":{"claim_token":{"kind":"string"}},"additional":null},"ClaimedGuestCounterparty":{"kind":"object","properties":{"connection_id":{"kind":"string"},"prepared_document_ids":{"kind":"array","items":{"kind":"string"}}},"additional":null},"ClearDraftResultView":{"kind":"object","properties":{"cleared":{"kind":"boolean"},"draft_type":{"kind":"string"}},"additional":null},"CloseAuctionLotRequest":{"kind":"object","properties":{"buyer_premium_rate_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"seller_commission_rate_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]}},"additional":null},"ClosePosCashierSessionRequest":{"kind":"object","properties":{"closing_cash_counted_minor":{"kind":"int64"},"session_id":{"kind":"string"}},"additional":null},"CloseReadinessStatusView":{"kind":"object","properties":{"close_readiness_score":{"kind":"number"},"company_book_id":{"kind":"string"},"daily_fx_revaluation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"daily_micro_depreciation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"ready_for_lock":{"kind":"boolean"},"reconciliation_matched_count":{"kind":"int64"},"status":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"CodSettlementReconciliationView":{"kind":"object","properties":{"awb_tracking_number":{"kind":"string"},"collected_amount_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"gateway_fee_minor":{"kind":"int64"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"net_payout_minor":{"kind":"int64"},"reconciled_at":{"kind":"string"},"settlement_status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"CommercialSalesOrder":{"kind":"object","properties":{"contact_id":{"kind":"string"},"currency":{"kind":"string"},"document_date":{"kind":"string"},"document_number":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CommercialSalesOrderLine"}},"quote_conversion_id":{"kind":"string"},"source_customer_quote_id":{"kind":"string"},"status":{"kind":"string"},"subtotal":{"kind":"int64"}},"additional":null},"CommercialSalesOrderLine":{"kind":"object","properties":{"allocated_quantity":{"kind":"int64"},"description":{"kind":"string"},"id":{"kind":"string"},"line_total":{"kind":"int64"},"ordinal":{"kind":"integer"},"source_customer_quote_line_id":{"kind":"string"},"unit_price":{"kind":"int64"}},"additional":null},"CompanyAccountingFrameworkSettingsView":{"kind":"object","properties":{"accounting_framework":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"id":{"kind":"string"},"inventory_costing_method":{"kind":"string"},"tenant_id":{"kind":"string"},"use_us_gaap_presentation":{"kind":"boolean"}},"additional":null},"CompanyBillingProfileView":{"kind":"object","properties":{"base_monthly_fee_idr":{"kind":"int64"},"billing_status":{"kind":"string"},"company_book_id":{"kind":"string"},"environment":{"kind":"string"},"live_approval_notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"live_approved_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"live_approved_by":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"per_pos_transaction_fee_idr":{"kind":"int64"}},"additional":null},"CompanyBook":{"kind":"object","properties":{"archived_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"archived_by_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"display_name":{"kind":"string"},"functional_currency":{"kind":"string"},"id":{"kind":"string"},"read_only":{"kind":"boolean"},"status":{"kind":"ref","name":"CompanyBookStatus"}},"additional":null},"CompanyBookList":{"kind":"object","properties":{"company_books":{"kind":"array","items":{"kind":"ref","name":"AuthorizedCompanyBookView"}},"next_cursor":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CompanyBookStatus":{"kind":"enum","values":["active","archived"]},"CompanyEmployeePayslipView":{"kind":"object","properties":{"base_salary_minor":{"kind":"int64"},"bpjs_deduction_minor":{"kind":"int64"},"commissions_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"employee_contact_id":{"kind":"string"},"id":{"kind":"string"},"net_salary_minor":{"kind":"int64"},"overtime_pay_minor":{"kind":"int64"},"payroll_run_id":{"kind":"string"},"pph21_deduction_minor":{"kind":"int64"},"tenant_id":{"kind":"string"}},"additional":null},"CompanyFixedAssetView":{"kind":"object","properties":{"accumulated_depr_account_number":{"kind":"string"},"acquisition_cost_minor":{"kind":"int64"},"acquisition_date":{"kind":"string"},"asset_account_number":{"kind":"string"},"asset_code":{"kind":"string"},"asset_name":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"depreciation_expense_account_number":{"kind":"string"},"depreciation_method":{"kind":"string"},"id":{"kind":"string"},"salvage_value_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"useful_life_months":{"kind":"integer"}},"additional":null},"CompanyGroupHierarchyView":{"kind":"object","properties":{"consolidation_method":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"ownership_percentage":{"kind":"number"},"parent_company_book_id":{"kind":"string"},"status":{"kind":"string"},"subsidiary_company_book_id":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"CompanyInstalledConnectorView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"connector_id":{"kind":"string"},"connector_name":{"kind":"string"},"connector_slug":{"kind":"string"},"granted_permission_scopes":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"installed_at":{"kind":"string"},"installed_version_semver":{"kind":"string"},"is_enabled":{"kind":"boolean"},"tenant_id":{"kind":"string"}},"additional":null},"CompanyLegalHoldView":{"kind":"object","properties":{"case_reference_number":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"gdpr_deletion_override":{"kind":"boolean"},"id":{"kind":"string"},"merkle_evidence_root_hash":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"CompanyWorkOrderView":{"kind":"object","properties":{"assigned_technician_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"customer_contact_id":{"kind":"string"},"description":{"kind":"string"},"estimated_cost_minor":{"kind":"int64"},"estimated_labor_hours":{"kind":"number"},"id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"work_order_number":{"kind":"string"}},"additional":null},"CompleteWorkOrderRequest":{"kind":"object","properties":{"actual_labor_hours":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"completion_notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CompleteWorkOrderResultView":{"kind":"object","properties":{"actual_labor_hours":{"kind":"number"},"company_book_id":{"kind":"string"},"completed_at":{"kind":"string"},"completion_notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"work_order_id":{"kind":"string"}},"additional":null},"ComponentRef":{"kind":"object","properties":{"component_key":{"kind":"string"},"component_version":{"kind":"int64"}},"additional":null},"ComposeStarterCoaRequest":{"kind":"object","properties":{"enabled_capabilities":{"kind":"array","items":{"kind":"string"}},"jurisdiction":{"kind":"string"},"primary_operating_model":{"kind":"string"}},"additional":null},"ConfigureAccountingFrameworkRequest":{"kind":"object","properties":{"accounting_framework":{"kind":"string"},"effective_from":{"kind":"string"},"inventory_costing_method":{"kind":"string"},"use_us_gaap_presentation":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]}},"additional":null},"ConfigureBatamFtzJurisdictionRequest":{"kind":"object","properties":{"allow_usd_functional_currency":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"bp_batam_license_number":{"kind":"string"},"customs_registration_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"default_ftz_tax_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ConfigureHoldingSamplingRuleRequest":{"kind":"object","properties":{"audit_entity_level":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"audit_status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"holding_perimeter_id":{"kind":"string"},"sample_rule_name":{"kind":"string"},"sampled_journal_id":{"kind":"string"},"subsidiary_company_book_id":{"kind":"string"}},"additional":null},"ConfigureUaeJurisdictionRequest":{"kind":"object","properties":{"corporate_tax_exemption":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"free_zone_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"is_free_zone_qfzp":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"trn_number":{"kind":"string"},"vat_stagger_period":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ConfirmBankFeedMatchRequest":{"kind":"object","properties":{"clearing_account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"matched_invoice_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ConfirmOnboardingRequest":{"kind":"object","properties":{"admitted_relationship_id":{"kind":"string"}},"additional":null},"ConfirmOnboardingResponse":{"kind":"object","properties":{"company_book":{"kind":"ref","name":"CompanyBook"},"initial_readiness":{"kind":"array","items":{"kind":"ref","name":"CapabilityReadiness"}},"owner_membership_id":{"kind":"string"},"starter_coa_preview":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"StarterCoaPreview"}]}},"additional":null},"Connection":{"kind":"object","properties":{"counterparty":{"kind":"ref","name":"DirectoryProfile"},"decision_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"direction":{"kind":"string"},"id":{"kind":"string"},"message":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"}},"additional":null},"ConsolidatedBalanceSheetView":{"kind":"object","properties":{"cta_translation_reserve_minor":{"kind":"int64"},"generated_at":{"kind":"string"},"non_controlling_interest_minor":{"kind":"int64"},"parent_company_book_id":{"kind":"string"},"parent_equity_minor":{"kind":"int64"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"presentation_currency":{"kind":"string"},"status":{"kind":"string"},"total_consolidated_assets_minor":{"kind":"int64"},"total_consolidated_liabilities_minor":{"kind":"int64"}},"additional":null},"ConsolidatedTrialBalanceView":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"ConsolidationLineItem"}},"perimeter_id":{"kind":"string"},"presentation_currency":{"kind":"string"},"total_consolidated_credit_minor":{"kind":"integer"},"total_consolidated_debit_minor":{"kind":"integer"},"total_elimination_credit_minor":{"kind":"integer"},"total_elimination_debit_minor":{"kind":"integer"},"total_gross_credit_minor":{"kind":"integer"},"total_gross_debit_minor":{"kind":"integer"},"zero_net_internal_leakage":{"kind":"boolean"}},"additional":null},"ConsolidationLineItem":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_name":{"kind":"string"},"balance_minor":{"kind":"integer"},"consolidated_credit_minor":{"kind":"integer"},"consolidated_debit_minor":{"kind":"integer"},"elimination_credit_minor":{"kind":"integer"},"elimination_debit_minor":{"kind":"integer"},"gross_credit_minor":{"kind":"integer"},"gross_debit_minor":{"kind":"integer"}},"additional":null},"ConsolidationMemberView":{"kind":"object","properties":{"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ownership_percentage":{"kind":"number"},"perimeter_id":{"kind":"string"},"subsidiary_company_book_id":{"kind":"string"}},"additional":null},"ConsolidationPerimeterView":{"kind":"object","properties":{"created_at":{"kind":"string"},"holding_company_book_id":{"kind":"string"},"id":{"kind":"string"},"perimeter_name":{"kind":"string"},"presentation_currency":{"kind":"string"}},"additional":null},"Contact":{"kind":"object","properties":{"active":{"kind":"boolean"},"created_at":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"is_self":{"kind":"boolean"},"kind":{"kind":"string"},"name":{"kind":"string"},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"telephone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"string"}},"additional":null},"ContactAddress":{"kind":"object","properties":{"address_country":{"kind":"string"},"address_locality":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"address_region":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"id":{"kind":"string"},"is_primary":{"kind":"boolean"},"label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"postal_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"street_address":{"kind":"string"}},"additional":null},"ContactBankAccount":{"kind":"object","properties":{"account_number":{"kind":"string"},"active":{"kind":"boolean"},"bank_name":{"kind":"string"},"contact_id":{"kind":"string"},"country":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"is_primary":{"kind":"boolean"},"swift":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ContactCreditLimitView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"credit_hold_active":{"kind":"boolean"},"credit_limit_minor":{"kind":"int64"},"grace_period_days":{"kind":"integer"},"id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"ContactList":{"kind":"object","properties":{"contacts":{"kind":"array","items":{"kind":"ref","name":"Contact"}}},"additional":null},"ContactOrganization":{"kind":"object","properties":{"contact_id":{"kind":"string"},"industry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"legal_name":{"kind":"string"},"lei":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"registration_no":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"website":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ContactPerson":{"kind":"object","properties":{"additional_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"birth_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"family_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gender":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"gender_description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"given_name":{"kind":"string"}},"additional":null},"ContactProfile":{"kind":"object","properties":{"about":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"headline":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"links":{"kind":"array","items":{"kind":"ref","name":"ContactProfileLink"}},"location":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"photo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"website":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ContactProfileLink":{"kind":"object","properties":{"active":{"kind":"boolean"},"contact_id":{"kind":"string"},"id":{"kind":"string"},"label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"platform":{"kind":"string"},"url":{"kind":"string"}},"additional":null},"ContactRelationship":{"kind":"object","properties":{"active":{"kind":"boolean"},"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"from_contact_id":{"kind":"string"},"id":{"kind":"string"},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ownership_basis_points":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"relationship_type":{"kind":"string"},"title":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"to_contact_id":{"kind":"string"}},"additional":null},"ContactRole":{"kind":"object","properties":{"active":{"kind":"boolean"},"contact_id":{"kind":"string"},"credit_limit":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"current":{"kind":"boolean"},"default_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"payment_terms_days":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"risk_note":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role":{"kind":"string"}},"additional":null},"ContinuousCloseScheduleView":{"kind":"object","properties":{"close_readiness_score":{"kind":"number"},"company_book_id":{"kind":"string"},"daily_fx_revaluation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"daily_micro_depreciation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"id":{"kind":"string"},"reconciliation_matched_count":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"ContractLossAllocationView":{"kind":"object","properties":{"capital_provider_loss_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"contract_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"operator_loss_minor":{"kind":"int64"},"period_id":{"kind":"string"},"tenant_id":{"kind":"string"},"total_loss_minor":{"kind":"int64"}},"additional":null},"ConversionAction":{"kind":"enum","values":["within_quote","adjust_po","revise_quote","new_quote","linked_exception","standalone_exception","detach_to_standalone"]},"ConversionOutcome":{"kind":"object","properties":{"action":{"kind":"ref","name":"ConversionAction"},"conversion_id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"LineVariance"}},"purchase_order_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_quote_id":{"kind":"string"},"status":{"kind":"string"},"target_quote_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"warning":{"kind":"boolean"}},"additional":null},"ConversionPreview":{"kind":"object","properties":{"expired":{"kind":"boolean"},"lines":{"kind":"array","items":{"kind":"ref","name":"LineVariance"}},"offered_actions":{"kind":"array","items":{"kind":"ref","name":"ConversionAction"}},"source_quote_id":{"kind":"string"},"source_quote_status":{"kind":"string"},"warning":{"kind":"boolean"},"warning_message":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ConvertCustomerQuote":{"kind":"object","properties":{"allocations":{"kind":"array","items":{"kind":"ref","name":"QuoteOrderAllocation"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"order_date":{"kind":"string"}},"additional":null},"ConvertQuoteToInvoiceRequest":{"kind":"object","properties":{"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"invoice_issue_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ConvertedQuoteToInvoiceView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"converted_at":{"kind":"string"},"quote_id":{"kind":"string"},"sales_invoice_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"CorporateRestructuringEventView":{"kind":"object","properties":{"carveout_perimeter_json":{"kind":"value"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"created_by_principal_id":{"kind":"string"},"effective_date":{"kind":"string"},"event_type":{"kind":"string"},"goodwill_recognized_minor":{"kind":"int64"},"id":{"kind":"string"},"target_entity_name":{"kind":"string"},"tenant_id":{"kind":"string"},"transaction_valuation_minor":{"kind":"int64"}},"additional":null},"CreateAccount":{"kind":"object","properties":{"active":{"kind":"boolean"},"code":{"kind":"string"},"manual_entry_allowed":{"kind":"boolean"},"name":{"kind":"string"},"normal_balance":{"kind":"string"}},"additional":null},"CreateAccountingPeriod":{"kind":"object","properties":{"financial_end":{"kind":"string"},"financial_start":{"kind":"string"}},"additional":null},"CreateAdmission":{"kind":"object","properties":{"client_application_id":{"kind":"string"},"data_handling_notice":{"kind":"string"},"exit_export_route":{"kind":"string"},"expires_at":{"kind":"string"},"participant_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"principal_id":{"kind":"string"},"reason":{"kind":"string"},"review_at":{"kind":"string"},"starts_at":{"kind":"string"},"support_contact":{"kind":"string"}},"additional":null},"CreateAssetCategoryRequest":{"kind":"object","properties":{"name":{"kind":"string"}},"additional":null},"CreateAssignmentRequest":{"kind":"object","properties":{"principal_id":{"kind":"string"},"role_id":{"kind":"string"}},"additional":null},"CreateAuctionLotRequest":{"kind":"object","properties":{"auction_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"end_time":{"kind":"string"},"lot_title":{"kind":"string"},"reserve_price_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"starting_price_minor":{"kind":"int64"}},"additional":null},"CreateAuditorWorkingPaperRequest":{"kind":"object","properties":{"adjustment_scope":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"auditor_role":{"kind":"string"},"division_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"paper_findings_json":{"kind":"value"},"paper_title":{"kind":"string"}},"additional":null},"CreateBankAccount":{"kind":"object","properties":{"account_name":{"kind":"string"},"account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_type":{"kind":"string"},"bank_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bank_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"gl_account_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"institution_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"swift_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateBankCategorizationRuleRequest":{"kind":"object","properties":{"description_pattern":{"kind":"string"},"priority":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"rule_name":{"kind":"string"},"target_account_number":{"kind":"string"}},"additional":null},"CreateBankFeedConnectionRequest":{"kind":"object","properties":{"bank_name":{"kind":"string"},"connection_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_account_id":{"kind":"string"},"provider_name":{"kind":"string"}},"additional":null},"CreateBankStatement":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"closing_balance":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateBankStatementLine"}},"opening_balance":{"kind":"string"},"statement_date":{"kind":"string"}},"additional":null},"CreateBankStatementLine":{"kind":"object","properties":{"amount":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"string"},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"transaction_date":{"kind":"string"}},"additional":null},"CreateBookInput":{"kind":"object","properties":{"effective_from":{"kind":"string"},"name":{"kind":"string"},"purpose":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"CreateBusinessEventRuleRequest":{"kind":"object","properties":{"classification_result":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"metric_trigger_condition":{"kind":"string"},"rule_name":{"kind":"string"}},"additional":null},"CreateCompanyBook":{"kind":"object","properties":{"display_name":{"kind":"string"},"enabled_capabilities":{"kind":"array","items":{"kind":"string"}},"functional_currency":{"kind":"string"},"jurisdiction_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"operating_model":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateConsolidationPerimeterRequest":{"kind":"object","properties":{"perimeter_name":{"kind":"string"},"presentation_currency":{"kind":"string"}},"additional":null},"CreateContact":{"kind":"object","properties":{"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"kind":{"kind":"string"},"name":{"kind":"string"},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"telephone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateContactAddress":{"kind":"object","properties":{"address_country":{"kind":"string"},"address_locality":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"address_region":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"is_primary":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"postal_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"street_address":{"kind":"string"}},"additional":null},"CreateContactBankAccount":{"kind":"object","properties":{"account_number":{"kind":"string"},"bank_name":{"kind":"string"},"country":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"is_primary":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"swift":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateContactProfileLink":{"kind":"object","properties":{"label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"platform":{"kind":"string"},"url":{"kind":"string"}},"additional":null},"CreateContactRelationship":{"kind":"object","properties":{"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ownership_basis_points":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"relationship_type":{"kind":"string"},"title":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"to_contact_id":{"kind":"string"}},"additional":null},"CreateContactRole":{"kind":"object","properties":{"credit_limit":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"default_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_terms_days":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"risk_note":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role":{"kind":"string"}},"additional":null},"CreateCustomCalendarEventRequest":{"kind":"object","properties":{"action_label":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"action_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"category":{"kind":"ref","name":"CalendarCategory"},"event_date":{"kind":"string"},"jurisdiction":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"severity":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"CalendarEventSeverity"}]},"summary":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"title":{"kind":"string"}},"additional":null},"CreateCustomerSubscriptionRequest":{"kind":"object","properties":{"auto_renew":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"contact_id":{"kind":"string"},"current_period_end":{"kind":"string"},"current_period_start":{"kind":"string"},"mrr_value_minor":{"kind":"int64"},"next_billing_date":{"kind":"string"},"plan_id":{"kind":"string"}},"additional":null},"CreateDelivery":{"kind":"object","properties":{"carrier":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"delivery_date":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateDeliveryLine"}},"received_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sales_document_id":{"kind":"string"},"ship_to_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"shipping_address_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tracking_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateDeliveryLine":{"kind":"object","properties":{"description":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"sales_document_line_id":{"kind":"string"}},"additional":null},"CreateDimensionValue":{"kind":"object","properties":{"code":{"kind":"string"},"name":{"kind":"string"},"parent_value_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateDiscountRuleRequest":{"kind":"object","properties":{"discount_category":{"kind":"string"},"discount_percentage":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"effective_from":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fixed_discount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"margin_guard_floor_percentage":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"min_order_value_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"rule_name":{"kind":"string"}},"additional":null},"CreateEmployeePayrollProfileRequest":{"kind":"object","properties":{"allowances_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"base_salary_minor":{"kind":"int64"},"employee_name":{"kind":"string"},"npwp_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ptkp_status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ter_category":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateEngagementRequest":{"kind":"object","properties":{"engagement_code":{"kind":"string"},"engagement_type":{"kind":"string"}},"additional":null},"CreateExpenseClaim":{"kind":"object","properties":{"business_purpose":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"claim_date":{"kind":"string"},"claimant_contact_id":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateExpenseLine"}},"period_end":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_start":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateExpenseLine":{"kind":"object","properties":{"amount":{"kind":"string"},"category":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"expense_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"expense_date":{"kind":"string"},"tax_amount":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateFindingRequest":{"kind":"object","properties":{"content":{"kind":"ref","name":"AuditFindingContent"},"finding_code":{"kind":"string"}},"additional":null},"CreateFixedAsset":{"kind":"object","properties":{"acquired_date":{"kind":"string"},"asset_category_id":{"kind":"string"},"asset_class":{"kind":"string"},"barcode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"category":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"cost":{"kind":"int64"},"custodian_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"depreciation_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"depreciation_rate":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"funding_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gl_asset":{"kind":"string"},"insurer_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"location":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"parent_asset_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"registration_no":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"salvage":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"serial_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"supplier_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"useful_life_months":{"kind":"integer"}},"additional":null},"CreateGuestCounterparty":{"kind":"object","properties":{"display_name":{"kind":"string"}},"additional":null},"CreateImportDeclaration":{"kind":"object","properties":{"authority_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"customs_currency":{"kind":"string"},"customs_value":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"declaration_date":{"kind":"string"},"declaration_number":{"kind":"string"},"duty_total":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"exchange_rate":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"import_tax_total":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"incoterm":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateImportDeclarationLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"other_charges_total":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"port_of_entry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_document_ids":{"kind":"array","items":{"kind":"string"}}},"additional":null},"CreateImportDeclarationLine":{"kind":"object","properties":{"customs_value":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"description":{"kind":"string"},"duty_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"import_tax_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"imported_form":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"tariff_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateInventoryLocation":{"kind":"object","properties":{"is_primary":{"kind":"boolean"},"location_code":{"kind":"string"},"location_name":{"kind":"string"}},"additional":null},"CreateInventoryTransfer":{"kind":"object","properties":{"from_location_id":{"kind":"string"},"status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"to_location_id":{"kind":"string"},"transfer_date":{"kind":"string"},"transfer_number":{"kind":"string"}},"additional":null},"CreateInventoryTransformation":{"kind":"object","properties":{"abnormal_loss_value":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"bom_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"consume":{"kind":"array","items":{"kind":"ref","name":"TransformationConsume"}},"kind":{"kind":"string"},"produce":{"kind":"array","items":{"kind":"ref","name":"TransformationProduce"}},"transformation_date":{"kind":"string"}},"additional":null},"CreateInvitationRequest":{"kind":"object","properties":{"email":{"kind":"string"},"role_id":{"kind":"ref","name":"RoleId"}},"additional":null},"CreateItem":{"kind":"object","properties":{"aliases":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"barcode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"kind":{"kind":"string"},"max_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"min_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"name":{"kind":"string"},"parent_item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"preferred_supplier_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_price":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"sale_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sale_price":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"sku":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateLandedCostApportionment":{"kind":"object","properties":{"apportionment_date":{"kind":"string"},"basis":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateLandedCostLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_document_id":{"kind":"string"}},"additional":null},"CreateLandedCostLine":{"kind":"object","properties":{"amount":{"kind":"string"},"capitalise":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"cost_type":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"vendor_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateLead":{"kind":"object","properties":{"contact_id":{"kind":"string"},"currency":{"kind":"string"},"estimated_deal_amount":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lead_code":{"kind":"string"},"lead_source":{"kind":"string"}},"additional":null},"CreateMonthlyPayrollRunRequest":{"kind":"object","properties":{"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"total_bpjs_employee_minor":{"kind":"int64"},"total_bpjs_employer_minor":{"kind":"int64"},"total_gross_salary_minor":{"kind":"int64"},"total_pph21_withheld_minor":{"kind":"int64"}},"additional":null},"CreatePayment":{"kind":"object","properties":{"amount":{"kind":"int64"},"bank_account_id":{"kind":"string"},"contact_id":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"direction":{"kind":"string"},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_date":{"kind":"string"},"payment_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreatePayrollLine":{"kind":"object","properties":{"allowances":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"bank_account_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bonus":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"bpjs_employee":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"bpjs_employer":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"employee_contact_id":{"kind":"string"},"gross":{"kind":"int64"},"other_deductions":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"overtime":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"pph21":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"CreatePayrollRun":{"kind":"object","properties":{"functional_currency":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CreatePayrollLine"}},"pay_date":{"kind":"string"},"period":{"kind":"string"}},"additional":null},"CreatePersonInCharge":{"kind":"object","properties":{"effective_from":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"family_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gender":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"gender_description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"given_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"person_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"relationship_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"telephone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"title":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreatePocProjectBudgetRequest":{"kind":"object","properties":{"contract_value_minor":{"kind":"int64"},"project_id":{"kind":"string"},"total_budgeted_cost_minor":{"kind":"int64"}},"additional":null},"CreateProposalRequest":{"kind":"object","properties":{"proposal_code":{"kind":"string"}},"additional":null},"CreatePurchaseDocument":{"kind":"object","properties":{"contact_id":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"document_date":{"kind":"string"},"document_type":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"CreatePurchaseLine"}},"matched_po_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"matched_receipt_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"parent_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"prices_include_tax":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"received_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"vendor_invoice_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreatePurchaseLine":{"kind":"object","properties":{"description":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"discount_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"expense_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"},"withholding_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateReversalRequest":{"kind":"object","properties":{"reason":{"kind":"string"},"reversal_financial_date":{"kind":"string"}},"additional":null},"CreateRoleRequest":{"kind":"object","properties":{"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"permission_group_id":{"kind":"string"},"suffix":{"kind":"string"}},"additional":null},"CreateSalesDocument":{"kind":"object","properties":{"contact_id":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"document_date":{"kind":"string"},"document_type":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"CreateSalesLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"parent_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"prices_include_tax":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"salesperson_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateSalesLine":{"kind":"object","properties":{"description":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"discount_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"revenue_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"},"withholding_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateSalesOpportunityRequest":{"kind":"object","properties":{"assigned_sales_rep_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"estimated_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"opportunity_name":{"kind":"string"},"pipeline_stage":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"win_probability_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]}},"additional":null},"CreateSalesQuoteRequest":{"kind":"object","properties":{"contact_id":{"kind":"string"},"expiry_date":{"kind":"string"},"grand_total_minor":{"kind":"int64"},"opportunity_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"quote_number":{"kind":"string"},"subtotal_minor":{"kind":"int64"},"tax_total_minor":{"kind":"int64"}},"additional":null},"CreateServiceBilling":{"kind":"object","properties":{"allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceBillingAllocationInput"}},"document_date":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"CreateServiceContractAssessment":{"kind":"object","properties":{"classification":{"kind":"ref","name":"ServiceRevenueClassification"},"contract_modification":{"kind":"boolean"},"currency":{"kind":"string"},"fixed_transaction_price":{"kind":"int64"},"paragraph_35_a_met":{"kind":"boolean"},"paragraph_35_b_met":{"kind":"boolean"},"paragraph_35_c_met":{"kind":"boolean"},"performance_obligations":{"kind":"array","items":{"kind":"ref","name":"ServicePerformanceObligationInput"}},"principal_agent_issue":{"kind":"boolean"},"qualified_assessment_reference":{"kind":"string"},"qualified_assessment_sha256":{"kind":"string"},"variable_consideration":{"kind":"boolean"}},"additional":null},"CreateServiceFakturMonetaryAssessment":{"kind":"object","properties":{"aggregation_level":{"kind":"string"},"calculation_contract_identity":{"kind":"string"},"commercial_terms_reference":{"kind":"string"},"commercial_terms_sha256":{"kind":"string"},"currency":{"kind":"string"},"dpp":{"kind":"int64"},"dpp_method":{"kind":"string"},"dpp_method_version":{"kind":"string"},"faktur_evidence_reference":{"kind":"string"},"faktur_evidence_sha256":{"kind":"string"},"faktur_status":{"kind":"string"},"gross_customer_amount":{"kind":"int64"},"nominal_ppn_rate_basis_points":{"kind":"integer"},"official_source_checked_on":{"kind":"string"},"official_source_reference":{"kind":"string"},"official_source_sha256":{"kind":"string"},"output_ppn":{"kind":"int64"},"penggantian":{"kind":"int64"},"rounding_contract_reference":{"kind":"string"},"rounding_contract_sha256":{"kind":"string"},"rounding_mode":{"kind":"string"},"service_invoice_id":{"kind":"string"},"service_tax_point_assessment_id":{"kind":"string"}},"additional":null},"CreateServiceFulfillment":{"kind":"object","properties":{"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"ServiceFulfillmentLineInput"}},"performed_from":{"kind":"string"},"performed_through":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"CreateServiceRecognitionReadinessAssessment":{"kind":"object","properties":{"obligation_satisfactions":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationSatisfactionInput"}},"tax_point_assessments":{"kind":"array","items":{"kind":"ref","name":"ServiceTaxPointAssessmentInput"}}},"additional":null},"CreateSubscriptionPlanRequest":{"kind":"object","properties":{"billing_interval":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"plan_code":{"kind":"string"},"plan_name":{"kind":"string"},"price_minor":{"kind":"int64"}},"additional":null},"CreateSupplierQuote":{"kind":"object","properties":{"connector_idempotency_key":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"currency":{"kind":"string"},"external_company_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_content_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_party_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_quote_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_revision_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"SupplierQuoteLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"source_system":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"supplier_reference":{"kind":"string"},"valid_until":{"kind":"string"}},"additional":null},"CreateTemplateDefinitionRequest":{"kind":"object","properties":{"category":{"kind":"string"},"locale":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"source_capability":{"kind":"string"},"template_key":{"kind":"string"},"variable_schema":{"kind":"value"}},"additional":null},"CreateTemplateVersionRequest":{"kind":"object","properties":{"content_payload":{"kind":"string"},"style_metadata":{"kind":"value"},"subject_pattern":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"version":{"kind":"integer"}},"additional":null},"CreateTemporaryPostingLock":{"kind":"object","properties":{"expires_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reason":{"kind":"string"}},"additional":null},"CreateTreatmentRequest":{"kind":"object","properties":{"annual_rate_basis_points":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"authority_reference":{"kind":"string"},"classification_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"string"},"method":{"kind":"string"},"policy_reference":{"kind":"string"},"reason":{"kind":"string"},"residual_value":{"kind":"int64"},"useful_life_months":{"kind":"integer"}},"additional":null},"CreateUniversalContractRequest":{"kind":"object","properties":{"capital_ratio":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"contract_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"profit_split_ratio":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]}},"additional":null},"CreateUserReferralCodeRequest":{"kind":"object","properties":{"custom_referral_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"CreateWealthPortfolioRequest":{"kind":"object","properties":{"asset_class":{"kind":"string"},"currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"current_valuation_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"family_group_id":{"kind":"string"},"portfolio_name":{"kind":"string"}},"additional":null},"CreateWebhookSubscriptionRequest":{"kind":"object","properties":{"event_types":{"kind":"array","items":{"kind":"string"}},"secret":{"kind":"string"},"target_url":{"kind":"string"}},"additional":null},"CreateWorkOrderRequest":{"kind":"object","properties":{"assigned_technician_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"customer_contact_id":{"kind":"string"},"description":{"kind":"string"},"estimated_cost_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"estimated_labor_hours":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"work_order_number":{"kind":"string"}},"additional":null},"CustomerLoyaltyAccountView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"current_points_balance":{"kind":"int64"},"customer_contact_id":{"kind":"string"},"id":{"kind":"string"},"lifetime_points_earned":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"tier_level":{"kind":"string"}},"additional":null},"CustomerLoyaltyPointsResultView":{"kind":"object","properties":{"account":{"kind":"ref","name":"CustomerLoyaltyAccountView"},"entry":{"kind":"ref","name":"PointLedgerEntryView"}},"additional":null},"CustomerQuote":{"kind":"object","properties":{"accepted_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"customer_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"document_number":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"CustomerQuoteLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"revision_number":{"kind":"int64"},"revision_of_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"state_revision":{"kind":"int64"},"status":{"kind":"ref","name":"QuoteState"},"subtotal":{"kind":"int64"},"terms":{"kind":"string"},"updated_at":{"kind":"string"},"valid_until":{"kind":"string"}},"additional":null},"CustomerQuoteConversion":{"kind":"object","properties":{"conversion_id":{"kind":"string"},"sales_order":{"kind":"ref","name":"CommercialSalesOrder"},"source_quote_id":{"kind":"string"}},"additional":null},"CustomerQuoteLifecycleRequest":{"kind":"object","properties":{"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"target_status":{"kind":"ref","name":"QuoteState"}},"additional":null},"CustomerQuoteLine":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"line_total":{"kind":"int64"},"ordinal":{"kind":"integer"},"quantity":{"kind":"int64"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"CustomerQuoteLineRequest":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"CustomerQuoteRequest":{"kind":"object","properties":{"contact_id":{"kind":"string"},"currency":{"kind":"string"},"customer_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"CustomerQuoteLineRequest"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"terms":{"kind":"string"},"valid_until":{"kind":"string"}},"additional":null},"CustomerStatus":{"kind":"enum","values":["pending","accepted","rejected"]},"CustomerSubscriptionView":{"kind":"object","properties":{"auto_renew":{"kind":"boolean"},"company_book_id":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"current_period_end":{"kind":"string"},"current_period_start":{"kind":"string"},"id":{"kind":"string"},"mrr_value_minor":{"kind":"int64"},"next_billing_date":{"kind":"string"},"plan_id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"DataSovereigntyExportView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"download_url":{"kind":"string"},"expires_at":{"kind":"string"},"export_format":{"kind":"string"},"export_id":{"kind":"string"}},"additional":null},"DecideConnection":{"kind":"object","properties":{"decision":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"Decision":{"kind":"object","properties":{"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"Delivery":{"kind":"object","properties":{"carrier":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"delivery_date":{"kind":"string"},"delivery_number":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"DeliveryLine"}},"received_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sales_document_id":{"kind":"string"},"ship_to_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"shipping_address_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"tracking_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"string"}},"additional":null},"DeliveryLine":{"kind":"object","properties":{"description":{"kind":"string"},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"sales_document_line_id":{"kind":"string"}},"additional":null},"DeliveryList":{"kind":"object","properties":{"deliveries":{"kind":"array","items":{"kind":"ref","name":"Delivery"}}},"additional":null},"DepreciateRequest":{"kind":"object","properties":{"book_ids":{"kind":"array","items":{"kind":"string"}},"through":{"kind":"string"}},"additional":null},"DepreciationResult":{"kind":"object","properties":{"asset_id":{"kind":"string"},"books":{"kind":"array","items":{"kind":"ref","name":"BookDepreciationResultView"}}},"additional":null},"DetectBankStatement":{"kind":"object","properties":{"file_content":{"kind":"string"}},"additional":null},"DetectedBankStatementMapping":{"kind":"object","properties":{"delimiter":{"kind":"string"},"has_header_row":{"kind":"boolean"},"headers":{"kind":"array","items":{"kind":"string"}},"preview_rows":{"kind":"array","items":{"kind":"array","items":{"kind":"string"}}},"suggested_mapping":{"kind":"value"},"warnings":{"kind":"array","items":{"kind":"string"}}},"additional":null},"DeveloperKeyItem":{"kind":"object","properties":{"created_at":{"kind":"string"},"environment":{"kind":"string"},"id":{"kind":"string"},"key_name":{"kind":"string"},"key_prefix":{"kind":"string"},"last_used_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"last_used_ip":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"owner_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"owner_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"retiring_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"revoke_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"revoked_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"scopes":{"kind":"array","items":{"kind":"string"}},"status":{"kind":"string"},"total_requests":{"kind":"int64"}},"additional":null},"DeveloperKeyMetricsItem":{"kind":"object","properties":{"environment":{"kind":"string"},"key_id":{"kind":"string"},"key_name":{"kind":"string"},"key_prefix":{"kind":"string"},"owner_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"total_api_requests":{"kind":"int64"},"total_companies_created":{"kind":"int64"},"total_gmv_amount":{"kind":"int64"},"total_pos_transactions":{"kind":"int64"}},"additional":null},"DeveloperSandboxResetView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"environment_mode":{"kind":"string"},"reset_at":{"kind":"string"},"sandbox_reset_count":{"kind":"integer"},"status":{"kind":"string"}},"additional":null},"DeviceSyncStatusView":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"company_book_id":{"kind":"string"},"last_synced_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"pending_queue_count":{"kind":"int64"},"records":{"kind":"array","items":{"kind":"ref","name":"SyncOfflineRecordView"}},"total_synced_count":{"kind":"int64"}},"additional":null},"DimensionDefinition":{"kind":"object","properties":{"active":{"kind":"boolean"},"applies_to":{"kind":"string"},"code":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"kind":{"kind":"string"},"name":{"kind":"string"},"system_seed":{"kind":"boolean"},"updated_at":{"kind":"string"}},"additional":null},"DimensionDefinitionList":{"kind":"object","properties":{"definitions":{"kind":"array","items":{"kind":"ref","name":"DimensionDefinition"}}},"additional":null},"DimensionRequirementInput":{"kind":"object","properties":{"account_class":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_role":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"definition_id":{"kind":"string"},"document_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"string"},"line_context":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reason":{"kind":"string"},"required":{"kind":"boolean"},"source_capability":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"DimensionRequirementView":{"kind":"object","properties":{"account_class":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_role":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"changed_by":{"kind":"string"},"created_at":{"kind":"string"},"definition_id":{"kind":"string"},"document_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"string"},"id":{"kind":"string"},"line_context":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reason":{"kind":"string"},"required":{"kind":"boolean"},"source_capability":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"version":{"kind":"int64"}},"additional":null},"DimensionValue":{"kind":"object","properties":{"active":{"kind":"boolean"},"code":{"kind":"string"},"created_at":{"kind":"string"},"definition_id":{"kind":"string"},"id":{"kind":"string"},"name":{"kind":"string"},"parent_value_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"string"}},"additional":null},"DimensionValueList":{"kind":"object","properties":{"values":{"kind":"array","items":{"kind":"ref","name":"DimensionValue"}}},"additional":null},"DirectoryProfile":{"kind":"object","properties":{"display_name":{"kind":"string"},"handle":{"kind":"string"},"verified":{"kind":"boolean"}},"additional":null},"DisburseH2hIso20022PaymentRequest":{"kind":"object","properties":{"bank_code":{"kind":"string"},"creditor_account_number":{"kind":"string"},"creditor_name":{"kind":"string"},"currency":{"kind":"string"},"debtor_account_number":{"kind":"string"},"end_to_end_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_message_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"instructed_amount_minor":{"kind":"int64"},"raw_pain001_xml":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"DisburseH2hIso20022PaymentView":{"kind":"object","properties":{"bank_code":{"kind":"string"},"company_book_id":{"kind":"string"},"currency":{"kind":"string"},"disbursed_at":{"kind":"string"},"external_message_id":{"kind":"string"},"id":{"kind":"string"},"instructed_amount_minor":{"kind":"int64"},"message_type":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"DisburseSalaryPayoutsRequest":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"payment_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payroll_run_id":{"kind":"string"}},"additional":null},"DisburseSalaryPayoutsView":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"company_book_id":{"kind":"string"},"disbursed_at":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payroll_run_id":{"kind":"string"},"status":{"kind":"string"},"total_net_disbursed_minor":{"kind":"int64"}},"additional":null},"DiscountRuleView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"discount_category":{"kind":"string"},"discount_percentage":{"kind":"number"},"effective_from":{"kind":"string"},"effective_to":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fixed_discount_minor":{"kind":"int64"},"id":{"kind":"string"},"margin_guard_floor_percentage":{"kind":"number"},"min_order_value_minor":{"kind":"int64"},"rule_name":{"kind":"string"}},"additional":null},"DispatchSleekSignDocumentRequest":{"kind":"object","properties":{"custom_message":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"document_title":{"kind":"string"},"document_type":{"kind":"string"},"recipient_email":{"kind":"string"},"recipient_name":{"kind":"string"}},"additional":null},"DisposeFixedAssetRequest":{"kind":"object","properties":{"disposal_date":{"kind":"string"},"disposal_proceeds_minor":{"kind":"int64"},"gain_loss_account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"proceeds_account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"DisposeRequest":{"kind":"object","properties":{"date":{"kind":"string"},"proceeds":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"DisputeSalesInvoiceRequest":{"kind":"object","properties":{"dispute_reason":{"kind":"string"},"disputed_amount_minor":{"kind":"int64"},"payer_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"DisputeSalesInvoiceResultView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"dispute_reason":{"kind":"string"},"dispute_sub_invoice_id":{"kind":"string"},"disputed_amount_minor":{"kind":"int64"},"id":{"kind":"string"},"original_invoice_id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"DistributePartnerProfitRequest":{"kind":"object","properties":{"agreement_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"disbursement_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"partner_contact_id":{"kind":"string"},"payout_amount_minor":{"kind":"int64"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"source_bank_account_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"DivisionAuditPaperSummary":{"kind":"object","properties":{"auditor_role":{"kind":"string"},"division_code":{"kind":"string"},"papers":{"kind":"array","items":{"kind":"ref","name":"AuditorWorkingPaperView"}},"total_working_papers":{"kind":"int64"}},"additional":null},"DocumentActiveEditorView":{"kind":"object","properties":{"display_name":{"kind":"string"},"editing_since":{"kind":"string"},"email":{"kind":"string"},"lock_expires_at":{"kind":"string"},"principal_id":{"kind":"string"}},"additional":null},"DocumentActiveViewerView":{"kind":"object","properties":{"display_name":{"kind":"string"},"email":{"kind":"string"},"principal_id":{"kind":"string"},"viewing_since":{"kind":"string"}},"additional":null},"DocumentLockView":{"kind":"object","properties":{"document_id":{"kind":"string"},"document_type":{"kind":"string"},"expires_at":{"kind":"string"},"lock_id":{"kind":"string"},"locked_at":{"kind":"string"},"locked_by_display_name":{"kind":"string"},"locked_by_email":{"kind":"string"},"locked_by_principal_id":{"kind":"string"},"minutes_remaining":{"kind":"int64"}},"additional":null},"DocumentLockedErrorResponse":{"kind":"object","properties":{"error":{"kind":"string"},"lock_holder":{"kind":"ref","name":"LockHolderInfo"},"message":{"kind":"string"}},"additional":null},"DocumentPresenceView":{"kind":"object","properties":{"active_editor":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"DocumentActiveEditorView"}]},"active_viewers":{"kind":"array","items":{"kind":"ref","name":"DocumentActiveViewerView"}},"document_id":{"kind":"string"},"document_type":{"kind":"string"}},"additional":null},"DocumentUnlockResultView":{"kind":"object","properties":{"document_id":{"kind":"string"},"document_type":{"kind":"string"},"unlocked":{"kind":"boolean"}},"additional":null},"EarnCustomerLoyaltyPointsRequest":{"kind":"object","properties":{"customer_contact_id":{"kind":"string"},"points":{"kind":"int64"},"reference_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unearned_liability_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"EcosystemBilateralTradeView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"counterparty_book_uri":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"inbound_purchase_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"outbound_sales_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"proof_sentinel_hash":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"EfakturCsvExportView":{"kind":"object","properties":{"batch_id":{"kind":"string"},"company_book_id":{"kind":"string"},"csv_content":{"kind":"string"},"exported_at":{"kind":"string"},"total_documents":{"kind":"int64"}},"additional":null},"EfakturDocumentView":{"kind":"object","properties":{"buyer_name":{"kind":"string"},"buyer_npwp":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"dpp_amount_minor":{"kind":"int64"},"efaktur_status":{"kind":"string"},"id":{"kind":"string"},"nsfp_assigned_number":{"kind":"string"},"ppn_amount_minor":{"kind":"int64"},"qr_code_verification_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sales_invoice_id":{"kind":"string"}},"additional":null},"EfakturFtzExportView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"csv_payload":{"kind":"string"},"generated_at":{"kind":"string"},"tax_period":{"kind":"string"},"total_gross_amount_minor":{"kind":"int64"},"total_records":{"kind":"integer"},"total_tax_amount_minor":{"kind":"int64"}},"additional":null},"Eligibility":{"kind":"enum","values":["current","expired","unavailable"]},"EmployeePayrollProfileView":{"kind":"object","properties":{"allowances_minor":{"kind":"int64"},"base_salary_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"employee_name":{"kind":"string"},"id":{"kind":"string"},"npwp_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ptkp_status":{"kind":"string"},"status":{"kind":"string"},"ter_category":{"kind":"string"}},"additional":null},"EnableCompanyLegalHoldRequest":{"kind":"object","properties":{"case_reference_number":{"kind":"string"},"gdpr_deletion_override":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"merkle_evidence_root_hash":{"kind":"string"}},"additional":null},"EngineDiscrepancy":{"kind":"object","properties":{"account_id":{"kind":"string"},"engine_account_id":{"kind":"string"},"engine_credit_normal_minor":{"kind":"integer"},"journal_credit_normal_minor":{"kind":"integer"},"kind":{"kind":"string"}},"additional":null},"EnqueueExportJobRequest":{"kind":"object","properties":{"format":{"kind":"string"},"parameters":{"kind":"value"},"report_type":{"kind":"string"}},"additional":null},"EnrollBetaChannelRequest":{"kind":"object","properties":{"connector_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"enrolled_channel":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"invite_code_or_token":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"EnrollBetaChannelView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"connector_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"enrolled_at":{"kind":"string"},"enrolled_channel":{"kind":"string"},"enrollment_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"EnterpriseDivisionAuditMatrixView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"divisions":{"kind":"array","items":{"kind":"ref","name":"DivisionAuditPaperSummary"}},"fiscal_period":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"fiscal_year":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"total_papers":{"kind":"int64"}},"additional":null},"EntityHierarchyReparentingView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"id":{"kind":"string"},"new_parent_book_id":{"kind":"string"},"previous_parent_book_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reparented_by_principal_id":{"kind":"string"},"reparenting_reason":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"EquityMovementLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_name":{"kind":"string"},"amount_minor":{"kind":"integer"},"label":{"kind":"string"}},"additional":null},"ErrorEnvelope":{"kind":"object","properties":{"error":{"kind":"ref","name":"ApiError"}},"additional":null},"EvaluateDiscountQuoteRequest":{"kind":"object","properties":{"discount_rule_ids":{"kind":"array","items":{"kind":"string"}},"estimated_cogs_minor":{"kind":"int64"},"gross_order_value_minor":{"kind":"int64"},"manual_discount_percentage":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"manual_fixed_discount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"EvaluateDiscountQuoteView":{"kind":"object","properties":{"applied_rule_ids":{"kind":"array","items":{"kind":"string"}},"estimated_cogs_minor":{"kind":"int64"},"gross_margin_percentage":{"kind":"number"},"gross_order_value_minor":{"kind":"int64"},"gross_profit_minor":{"kind":"int64"},"margin_guard_floor_percentage":{"kind":"number"},"margin_guard_passed":{"kind":"boolean"},"max_permissible_discount_minor":{"kind":"int64"},"net_order_value_minor":{"kind":"int64"},"status":{"kind":"string"},"total_discount_minor":{"kind":"int64"}},"additional":null},"EvidenceInput":{"kind":"object","properties":{"evidence_type":{"kind":"string"},"integrity_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"locator":{"kind":"string"},"originating_capability":{"kind":"string"}},"additional":null},"EvidenceRefInput":{"kind":"object","properties":{"evidence_reference_id":{"kind":"string"}},"additional":null},"ExecuteBilateralTradeRequest":{"kind":"object","properties":{"counterparty_book_uri":{"kind":"string"},"inbound_purchase_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"outbound_sales_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"proof_sentinel_hash":{"kind":"string"},"status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ExecutionMode":{"kind":"enum","values":["stateless","stateful","legacy_adapter"]},"ExpenseClaim":{"kind":"object","properties":{"business_purpose":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"claim_date":{"kind":"string"},"claim_number":{"kind":"string"},"claimant_contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"ExpenseLine"}},"period_end":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_start":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"subtotal":{"kind":"string"},"tax_total":{"kind":"string"},"total":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"ExpenseClaimList":{"kind":"object","properties":{"claims":{"kind":"array","items":{"kind":"ref","name":"ExpenseClaim"}}},"additional":null},"ExpenseLine":{"kind":"object","properties":{"amount":{"kind":"string"},"category":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"expense_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"expense_date":{"kind":"string"},"id":{"kind":"string"},"ordinal":{"kind":"integer"},"tax_amount":{"kind":"string"}},"additional":null},"ExportDataSovereigntyRequest":{"kind":"object","properties":{"export_format":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"include_audit_trail":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]}},"additional":null},"ExportEfakturFtzScheduleRequest":{"kind":"object","properties":{"include_ppftz_details":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"tax_period":{"kind":"string"}},"additional":null},"ExportFtaAuditFileRequest":{"kind":"object","properties":{"export_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_end":{"kind":"string"},"period_start":{"kind":"string"}},"additional":null},"ExportJobResponse":{"kind":"object","properties":{"artifact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"completed_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"error":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"format":{"kind":"string"},"generation_id":{"kind":"string"},"report_type":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"FederatedNodeSyncView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"endpoint_uri":{"kind":"string"},"id":{"kind":"string"},"last_synced_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"node_deployment_mode":{"kind":"string"},"node_name":{"kind":"string"},"public_key_fingerprint":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"FinancialInsightsSummary":{"kind":"object","properties":{"kpis":{"kind":"ref","name":"FinancialKpiMetrics"},"payables_aging_summary":{"kind":"ref","name":"AgingBucketSummary"},"provenance":{"kind":"ref","name":"FinancialTruthProvenance"},"receivables_aging_summary":{"kind":"ref","name":"AgingBucketSummary"}},"additional":null},"FinancialKpiMetrics":{"kind":"object","properties":{"burn_rate_monthly":{"kind":"int64"},"capital_efficiency_index":{"kind":"number"},"fcf_margin_pct":{"kind":"number"},"gross_margin_pct":{"kind":"number"},"liquid_cash":{"kind":"int64"},"net_income":{"kind":"int64"},"revenue":{"kind":"int64"},"runway_months":{"kind":"integer"}},"additional":null},"FinancialLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_id":{"kind":"string"},"account_name":{"kind":"string"},"amount_minor":{"kind":"int64"},"direction":{"kind":"string"},"entry_description":{"kind":"string"},"financial_date":{"kind":"string"},"journal_entry_id":{"kind":"string"},"line_description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"line_ordinal":{"kind":"integer"},"posting_id":{"kind":"string"},"posting_time":{"kind":"string"}},"additional":null},"FinancialLineList":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"FinancialLine"}}},"additional":null},"FinancialTruthProvenance":{"kind":"object","properties":{"as_of_timestamp":{"kind":"string"},"provenance_ref":{"kind":"string"},"reconciled_status":{"kind":"string"}},"additional":null},"FindingDispositionRequest":{"kind":"object","properties":{"disposition":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"FixedAsset":{"kind":"object","properties":{"accumulated_depreciation":{"kind":"int64"},"accumulated_impairment":{"kind":"int64"},"accumulated_revaluation":{"kind":"int64"},"acquired_date":{"kind":"string"},"active":{"kind":"boolean"},"asset_category_id":{"kind":"string"},"asset_class":{"kind":"string"},"barcode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"category":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"cost":{"kind":"int64"},"created_at":{"kind":"string"},"custodian_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"depreciated_through":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"depreciation_method":{"kind":"string"},"depreciation_rate":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"disposal_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"disposal_proceeds":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"funding_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gl_asset":{"kind":"string"},"id":{"kind":"string"},"insurance_expiry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"insurance_policy_no":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"insured_value":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"insurer_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"location":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"net_book_value":{"kind":"int64"},"parent_asset_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"placed_in_service_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"registration_no":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"salvage":{"kind":"int64"},"serial_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"supplier_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"string"},"useful_life_months":{"kind":"integer"},"warranty_expiry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"warranty_terms":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"FixedAssetDisposalResultView":{"kind":"object","properties":{"accumulated_depreciation_minor":{"kind":"int64"},"acquisition_cost_minor":{"kind":"int64"},"asset_id":{"kind":"string"},"company_book_id":{"kind":"string"},"disposal_date":{"kind":"string"},"disposal_proceeds_minor":{"kind":"int64"},"disposed_at":{"kind":"string"},"gain_loss_minor":{"kind":"int64"},"net_book_value_minor":{"kind":"int64"},"status":{"kind":"string"}},"additional":null},"FixedAssetList":{"kind":"object","properties":{"assets":{"kind":"array","items":{"kind":"ref","name":"FixedAsset"}}},"additional":null},"FixedAssetReconciliation":{"kind":"object","properties":{"difference":{"kind":"int64"},"gl_accumulated_depreciation":{"kind":"int64"},"gl_asset_cost":{"kind":"int64"},"gl_net_book_value":{"kind":"int64"},"reconciled":{"kind":"boolean"},"register_accumulated_depreciation":{"kind":"int64"},"register_cost":{"kind":"int64"},"register_net_book_value":{"kind":"int64"}},"additional":null},"FtaAuditFileExportView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"export_id":{"kind":"string"},"file_format":{"kind":"string"},"generated_file_content":{"kind":"string"},"period_end":{"kind":"string"},"period_start":{"kind":"string"},"sha256_checksum":{"kind":"string"},"total_general_ledger_records":{"kind":"int64"},"total_purchase_records":{"kind":"int64"},"total_sales_records":{"kind":"int64"},"trn_number":{"kind":"string"}},"additional":null},"FtaVat201ReportView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"corporate_tax_applicable_rate_pct":{"kind":"number"},"corporate_tax_threshold_minor":{"kind":"int64"},"currency":{"kind":"string"},"exempt_supplies_amount_minor":{"kind":"int64"},"is_qfzp":{"kind":"boolean"},"net_vat_due_minor":{"kind":"int64"},"reverse_charge_expenses_amount_minor":{"kind":"int64"},"reverse_charge_expenses_recoverable_vat_minor":{"kind":"int64"},"reverse_charge_supplies_amount_minor":{"kind":"int64"},"reverse_charge_supplies_vat_minor":{"kind":"int64"},"standard_rated_expenses_amount_minor":{"kind":"int64"},"standard_rated_expenses_recoverable_vat_minor":{"kind":"int64"},"standard_rated_supplies_amount_minor":{"kind":"int64"},"standard_rated_supplies_vat_minor":{"kind":"int64"},"tax_period_end":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_period_start":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"total_output_tax_minor":{"kind":"int64"},"total_recoverable_tax_minor":{"kind":"int64"},"tourist_tax_refunds_vat_minor":{"kind":"int64"},"trn_number":{"kind":"string"},"zero_rated_supplies_amount_minor":{"kind":"int64"}},"additional":null},"GatewayFeeBreakdownItem":{"kind":"object","properties":{"amount_minor":{"kind":"int64"},"fee_type":{"kind":"string"}},"additional":null},"GatewayFeeBreakdownView":{"kind":"object","properties":{"amount_minor":{"kind":"int64"},"fee_type":{"kind":"string"},"id":{"kind":"string"}},"additional":null},"GenerateBillableHoursInvoiceRequest":{"kind":"object","properties":{"customer_contact_id":{"kind":"string"},"period_end":{"kind":"string"},"period_start":{"kind":"string"},"project_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"GenerateEfakturDocumentRequest":{"kind":"object","properties":{"buyer_name":{"kind":"string"},"buyer_npwp":{"kind":"string"},"dpp_amount_minor":{"kind":"int64"},"ppn_amount_minor":{"kind":"int64"},"sales_invoice_id":{"kind":"string"}},"additional":null},"GuestCounterparty":{"kind":"object","properties":{"claim_token":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"claimed":{"kind":"boolean"},"display_name":{"kind":"string"},"held_document_count":{"kind":"int64"},"id":{"kind":"string"}},"additional":null},"HoldingAuditSampleView":{"kind":"object","properties":{"audit_entity_level":{"kind":"string"},"audit_status":{"kind":"string"},"created_at":{"kind":"string"},"holding_perimeter_id":{"kind":"string"},"id":{"kind":"string"},"sample_rule_name":{"kind":"string"},"sampled_by_principal_id":{"kind":"string"},"sampled_journal_id":{"kind":"string"},"subsidiary_company_book_id":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"HubAppView":{"kind":"object","properties":{"app_type":{"kind":"string"},"app_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"author_name":{"kind":"string"},"built_by_tier":{"kind":"ref","name":"BuiltByTier"},"category":{"kind":"string"},"created_at":{"kind":"string"},"demo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"string"},"developer_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"execution_mode":{"kind":"ref","name":"ExecutionMode"},"icon_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"is_official":{"kind":"boolean"},"last_maintained_at":{"kind":"string"},"maintenance_status":{"kind":"ref","name":"MaintenanceStatus"},"name":{"kind":"string"},"pricing_model":{"kind":"string"},"slug":{"kind":"string"},"status":{"kind":"string"},"summary":{"kind":"string"},"verified_badge":{"kind":"boolean"},"version":{"kind":"string"}},"additional":null},"HubConnectorView":{"kind":"object","properties":{"author_name":{"kind":"string"},"built_by_tier":{"kind":"ref","name":"BuiltByTier"},"category":{"kind":"string"},"created_at":{"kind":"string"},"description":{"kind":"string"},"developer_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"documentation_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"execution_mode":{"kind":"ref","name":"ExecutionMode"},"icon_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"is_official":{"kind":"boolean"},"last_maintained_at":{"kind":"string"},"maintenance_status":{"kind":"ref","name":"MaintenanceStatus"},"mcp_protocol_version":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"pricing_model":{"kind":"string"},"slug":{"kind":"string"},"status":{"kind":"string"},"summary":{"kind":"string"},"verified_badge":{"kind":"boolean"},"version":{"kind":"string"}},"additional":null},"HubDeveloperProfileView":{"kind":"object","properties":{"created_at":{"kind":"string"},"developer_email":{"kind":"string"},"developer_name":{"kind":"string"},"id":{"kind":"string"},"support_email":{"kind":"string"},"tenant_id":{"kind":"string"},"verification_status":{"kind":"string"},"website_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"HubPartnerView":{"kind":"object","properties":{"certified_consultants_count":{"kind":"integer"},"contact_email":{"kind":"string"},"created_at":{"kind":"string"},"description":{"kind":"string"},"developer_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"industry_specializations":{"kind":"array","items":{"kind":"string"}},"is_featured":{"kind":"boolean"},"jurisdiction_coverage":{"kind":"array","items":{"kind":"string"}},"logo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"partner_name":{"kind":"string"},"partner_type":{"kind":"string"},"rating_score":{"kind":"number"},"status":{"kind":"string"},"summary":{"kind":"string"},"tier":{"kind":"string"},"website_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ImpairAsset":{"kind":"object","properties":{"date":{"kind":"string"},"reason":{"kind":"string"},"recoverable_amount":{"kind":"int64"}},"additional":null},"ImportBankStatement":{"kind":"object","properties":{"closing_balance":{"kind":"string"},"file_content":{"kind":"string"},"filename":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"format":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"mapping":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"BankStatementMappingOverride"}]},"opening_balance":{"kind":"string"},"profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"statement_date":{"kind":"string"}},"additional":null},"ImportCoaRequest":{"kind":"object","properties":{"dry_run":{"kind":"boolean"},"file_content_base64":{"kind":"string"},"file_format":{"kind":"string"}},"additional":null},"ImportCoaResponse":{"kind":"object","properties":{"created_account_ids":{"kind":"array","items":{"kind":"string"}},"imported_accounts_count":{"kind":"integer"},"is_dry_run":{"kind":"boolean"},"mapped_roles_count":{"kind":"integer"},"preview_rows":{"kind":"union","variants":[{"kind":"array","items":{"kind":"ref","name":"ImportedAccountRow"}},{"kind":"null"}]}},"additional":null},"ImportDeclaration":{"kind":"object","properties":{"assessed_total":{"kind":"int64"},"authority_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"customs_currency":{"kind":"string"},"customs_value":{"kind":"int64"},"declaration_date":{"kind":"string"},"declaration_number":{"kind":"string"},"duty_total":{"kind":"int64"},"exchange_rate":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"import_tax_total":{"kind":"int64"},"incoterm":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"lines":{"kind":"array","items":{"kind":"ref","name":"ImportDeclarationLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"other_charges_total":{"kind":"int64"},"port_of_entry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_document_ids":{"kind":"array","items":{"kind":"string"}},"status":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"ImportDeclarationLine":{"kind":"object","properties":{"customs_value":{"kind":"int64"},"description":{"kind":"string"},"duty_amount":{"kind":"int64"},"id":{"kind":"string"},"import_tax_amount":{"kind":"int64"},"imported_form":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ordinal":{"kind":"integer"},"quantity":{"kind":"int64"},"tariff_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ImportDeclarationList":{"kind":"object","properties":{"declarations":{"kind":"array","items":{"kind":"ref","name":"ImportDeclaration"}}},"additional":null},"ImportXeroHistoricalDataRequest":{"kind":"object","properties":{"import_contacts":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"import_journals":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"xero_tenant_id":{"kind":"string"}},"additional":null},"ImportedAccountRow":{"kind":"object","properties":{"account_class":{"kind":"string"},"account_code":{"kind":"string"},"name":{"kind":"string"},"normal_balance":{"kind":"string"},"parent_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role_mapping":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"IncomeStatement":{"kind":"object","properties":{"expenses":{"kind":"array","items":{"kind":"ref","name":"IncomeStatementLine"}},"net_income_minor":{"kind":"integer"},"revenue":{"kind":"array","items":{"kind":"ref","name":"IncomeStatementLine"}},"total_expenses_minor":{"kind":"integer"},"total_revenue_minor":{"kind":"integer"}},"additional":null},"IncomeStatementLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_id":{"kind":"string"},"account_name":{"kind":"string"},"amount_minor":{"kind":"integer"}},"additional":null},"IngestBankStatementFeedRequest":{"kind":"object","properties":{"external_account_id":{"kind":"string"},"provider_name":{"kind":"string"},"raw_statement_data":{"kind":"string"}},"additional":null},"IngestH2hCamt053StatementRequest":{"kind":"object","properties":{"bank_code":{"kind":"string"},"external_message_id":{"kind":"string"},"raw_xml_payload":{"kind":"string"},"statement_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"IngestH2hCamt053StatementView":{"kind":"object","properties":{"bank_code":{"kind":"string"},"company_book_id":{"kind":"string"},"currency":{"kind":"string"},"external_message_id":{"kind":"string"},"id":{"kind":"string"},"ingested_at":{"kind":"string"},"message_type":{"kind":"string"},"processed_status":{"kind":"string"},"statement_lines_parsed":{"kind":"int64"},"tenant_id":{"kind":"string"},"total_closing_balance_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"IngestPgSettlementBatchRequest":{"kind":"object","properties":{"fee_breakdowns":{"kind":"array","items":{"kind":"ref","name":"GatewayFeeBreakdownItem"}},"gross_amount_minor":{"kind":"int64"},"net_payout_minor":{"kind":"int64"},"provider_name":{"kind":"string"},"settlement_date":{"kind":"string"},"settlement_reference":{"kind":"string"},"total_fee_minor":{"kind":"int64"}},"additional":null},"IngestPhysicalEventRequest":{"kind":"object","properties":{"classification":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"device_id":{"kind":"string"},"event_type":{"kind":"string"},"metric_payload":{"kind":"value"}},"additional":null},"InstallConnectorRequest":{"kind":"object","properties":{"configuration_values":{"kind":"value"},"connector_id":{"kind":"string"},"granted_permission_scopes":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]}},"additional":null},"IntercompanyEliminationRunView":{"kind":"object","properties":{"created_at":{"kind":"string"},"cta_translation_reserve_minor":{"kind":"int64"},"eliminated_expense_minor":{"kind":"int64"},"eliminated_payable_minor":{"kind":"int64"},"eliminated_receivable_minor":{"kind":"int64"},"eliminated_revenue_minor":{"kind":"int64"},"id":{"kind":"string"},"parent_company_book_id":{"kind":"string"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"InventoryLocation":{"kind":"object","properties":{"created_at":{"kind":"string"},"id":{"kind":"string"},"is_primary":{"kind":"boolean"},"location_code":{"kind":"string"},"location_name":{"kind":"string"}},"additional":null},"InventoryMovement":{"kind":"object","properties":{"created_at":{"kind":"string"},"id":{"kind":"string"},"item_id":{"kind":"string"},"movement_date":{"kind":"string"},"movement_type":{"kind":"string"},"quantity":{"kind":"int64"},"running_avg_cost":{"kind":"int64"},"running_book_value":{"kind":"int64"},"running_qty":{"kind":"int64"},"source_capability":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"total_value":{"kind":"int64"},"unit_cost":{"kind":"int64"}},"additional":null},"InventoryReconciliation":{"kind":"object","properties":{"difference":{"kind":"int64"},"gl_inventory":{"kind":"int64"},"movement_book_value":{"kind":"int64"},"reconciled":{"kind":"boolean"},"register_book_value":{"kind":"int64"},"register_movement_difference":{"kind":"int64"}},"additional":null},"InventoryTransfer":{"kind":"object","properties":{"created_at":{"kind":"string"},"from_location_id":{"kind":"string"},"id":{"kind":"string"},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"to_location_id":{"kind":"string"},"transfer_date":{"kind":"string"},"transfer_number":{"kind":"string"}},"additional":null},"InventoryTransformation":{"kind":"object","properties":{"abnormal_loss_value":{"kind":"int64"},"bom_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"by_product_value":{"kind":"int64"},"consumed_movement_ids":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"input_value":{"kind":"int64"},"kind":{"kind":"string"},"outputs":{"kind":"array","items":{"kind":"ref","name":"TransformationOutput"}},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"transformation_date":{"kind":"string"},"unassigned_value":{"kind":"int64"}},"additional":null},"InvitationView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"expires_at":{"kind":"string"},"id":{"kind":"string"},"normalized_email":{"kind":"string"},"proposed_role_id":{"kind":"ref","name":"RoleId"},"state_revision":{"kind":"int64"}},"additional":null},"InvoiceEstampResultView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"document_amount_minor":{"kind":"int64"},"document_id":{"kind":"string"},"estamp_serial_number":{"kind":"string"},"id":{"kind":"string"},"provider_name":{"kind":"string"},"stamped_at":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"InvoicePaymentLinkView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"expires_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"invoice_id":{"kind":"string"},"payment_link_url":{"kind":"string"},"provider_name":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"IssueDeveloperKeyRequest":{"kind":"object","properties":{"environment":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"expires_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"key_name":{"kind":"string"},"owner_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"owner_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"scopes":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]}},"additional":null},"IssueDeveloperKeyResponse":{"kind":"object","properties":{"environment":{"kind":"string"},"key_id":{"kind":"string"},"key_name":{"kind":"string"},"key_prefix":{"kind":"string"},"note":{"kind":"string"},"raw_secret_token":{"kind":"string"},"scopes":{"kind":"array","items":{"kind":"string"}}},"additional":null},"IssueNonFiatUnitsRequest":{"kind":"object","properties":{"counterparty_entity_id":{"kind":"string"},"unit_type":{"kind":"string"},"units_amount":{"kind":"number"}},"additional":null},"IssueWorkOrderPartsRequest":{"kind":"object","properties":{"item_id":{"kind":"string"},"quantity":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"unit_cost_minor":{"kind":"int64"}},"additional":null},"Item":{"kind":"object","properties":{"active":{"kind":"boolean"},"aliases":{"kind":"array","items":{"kind":"string"}},"avg_cost":{"kind":"int64"},"barcode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"book_value":{"kind":"int64"},"created_at":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"kind":{"kind":"string"},"max_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"min_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"name":{"kind":"string"},"on_hand_qty":{"kind":"int64"},"parent_item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"preferred_supplier_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_price":{"kind":"int64"},"sale_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sale_price":{"kind":"int64"},"sku":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"ItemList":{"kind":"object","properties":{"items":{"kind":"array","items":{"kind":"ref","name":"Item"}}},"additional":null},"JournalLineInput":{"kind":"object","properties":{"account_id":{"kind":"string"},"amount_minor":{"kind":"int64"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"direction":{"kind":"string"},"ordinal":{"kind":"integer"}},"additional":null},"LandedCostAllocation":{"kind":"object","properties":{"allocated_cost":{"kind":"string"},"basis_amount":{"kind":"string"},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_document_line_id":{"kind":"string"}},"additional":null},"LandedCostApportionment":{"kind":"object","properties":{"allocations":{"kind":"array","items":{"kind":"ref","name":"LandedCostAllocation"}},"apportionment_date":{"kind":"string"},"basis":{"kind":"string"},"capitalised_total":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"LandedCostLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_document_id":{"kind":"string"},"residual_total":{"kind":"string"},"residual_treatment":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"total_cost":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"LandedCostApportionmentList":{"kind":"object","properties":{"apportionments":{"kind":"array","items":{"kind":"ref","name":"LandedCostApportionment"}}},"additional":null},"LandedCostLine":{"kind":"object","properties":{"amount":{"kind":"string"},"capitalise":{"kind":"boolean"},"cost_type":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"ordinal":{"kind":"integer"},"vendor_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"LandedCostPolicy":{"kind":"object","properties":{"options":{"kind":"array","items":{"kind":"ref","name":"LandedCostPolicyOption"}},"residual_treatment":{"kind":"string"}},"additional":null},"LandedCostPolicyOption":{"kind":"object","properties":{"description":{"kind":"string"},"is_default":{"kind":"boolean"},"residual_treatment":{"kind":"string"}},"additional":null},"Lead":{"kind":"object","properties":{"contact_id":{"kind":"string"},"converted_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"credit_score":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"currency":{"kind":"string"},"estimated_deal_amount":{"kind":"string"},"id":{"kind":"string"},"lead_code":{"kind":"string"},"lead_source":{"kind":"string"},"stage":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"LeadList":{"kind":"object","properties":{"leads":{"kind":"array","items":{"kind":"ref","name":"Lead"}}},"additional":null},"LedgerWebhookEnvelope":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"data":{"kind":"value"},"event_id":{"kind":"string"},"event_type":{"kind":"string"},"timestamp":{"kind":"string"}},"additional":null},"LifecycleState":{"kind":"enum","values":["open","closed","finalized"]},"LineVariance":{"kind":"object","properties":{"committed_quantity":{"kind":"int64"},"committed_value":{"kind":"int64"},"excess_quantity":{"kind":"int64"},"excess_value":{"kind":"int64"},"quote_line_id":{"kind":"string"},"quoted_quantity":{"kind":"int64"},"quoted_value":{"kind":"int64"},"remaining_quantity":{"kind":"int64"},"remaining_value":{"kind":"int64"},"requested_quantity":{"kind":"int64"},"requested_value":{"kind":"int64"},"reserved_quantity":{"kind":"int64"},"reserved_value":{"kind":"int64"},"warning":{"kind":"boolean"}},"additional":null},"LinkSubsidiaryCompanyBookRequest":{"kind":"object","properties":{"consolidation_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"ownership_percentage":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"subsidiary_company_book_id":{"kind":"string"}},"additional":null},"LockHolderInfo":{"kind":"object","properties":{"display_name":{"kind":"string"},"email":{"kind":"string"},"lock_expires_at":{"kind":"string"},"locked_at":{"kind":"string"},"minutes_remaining":{"kind":"int64"},"principal_id":{"kind":"string"}},"additional":null},"LogTimesheetEntryRequest":{"kind":"object","properties":{"billable_rate_minor":{"kind":"int64"},"customer_contact_id":{"kind":"string"},"entry_date":{"kind":"string"},"hours_logged":{"kind":"number"},"is_billable":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"project_code":{"kind":"string"},"staff_principal_id":{"kind":"string"}},"additional":null},"MaintenanceStatus":{"kind":"enum","values":["active","maintenance_mode","deprecated","archived"]},"ManualJournal":{"kind":"object","properties":{"approval_request_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"content_revision":{"kind":"int64"},"content_sha256":{"kind":"string"},"currency":{"kind":"string"},"description":{"kind":"string"},"evidence":{"kind":"array","items":{"kind":"ref","name":"EvidenceInput"}},"external_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"financial_date":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"JournalLineInput"}},"state":{"kind":"string"},"state_revision":{"kind":"int64"},"version_id":{"kind":"string"}},"additional":null},"ManualJournalContent":{"kind":"object","properties":{"currency":{"kind":"string"},"description":{"kind":"string"},"evidence":{"kind":"array","items":{"kind":"ref","name":"EvidenceInput"}},"external_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"financial_date":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"JournalLineInput"}}},"additional":null},"MatchGoodsReceiptBillRequest":{"kind":"object","properties":{"bill_date":{"kind":"string"},"due_date":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"MatchedBillLineRequest"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"prices_include_tax":{"kind":"boolean"},"vendor_invoice_number":{"kind":"string"}},"additional":null},"MatchedBillLineRequest":{"kind":"object","properties":{"receipt_line_id":{"kind":"string"},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"withholding_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"MembershipList":{"kind":"object","properties":{"memberships":{"kind":"array","items":{"kind":"ref","name":"MembershipListItem"}},"pending_invitations":{"kind":"array","items":{"kind":"ref","name":"PendingInvitationListItem"}}},"additional":null},"MembershipListItem":{"kind":"object","properties":{"active":{"kind":"boolean"},"created_at":{"kind":"string"},"latest_verified_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"owner_active":{"kind":"boolean"},"principal_id":{"kind":"string"},"role_ids":{"kind":"array","items":{"kind":"ref","name":"RoleId"}},"state_revision":{"kind":"int64"},"state_token":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"MembershipView":{"kind":"object","properties":{"active":{"kind":"boolean"},"company_book_id":{"kind":"string"},"owner_active":{"kind":"boolean"},"principal_id":{"kind":"string"},"role_assignment_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"role_id":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"RoleId"}]},"state_revision":{"kind":"int64"}},"additional":null},"MerchantBillingItem":{"kind":"object","properties":{"base_monthly_fee_idr":{"kind":"int64"},"billing_status":{"kind":"string"},"company_book_id":{"kind":"string"},"company_name":{"kind":"string"},"current_cycle_pos_gmv_idr":{"kind":"int64"},"current_cycle_pos_tx_count":{"kind":"int64"},"environment":{"kind":"string"},"per_pos_transaction_fee_idr":{"kind":"int64"},"projected_monthly_total_idr":{"kind":"int64"}},"additional":null},"MigrateRealCompanyOpeningBalancesRequest":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"total_asset_opening_balance_minor":{"kind":"int64"},"total_equity_opening_balance_minor":{"kind":"int64"},"total_liability_opening_balance_minor":{"kind":"int64"}},"additional":null},"MigrateTenantInfrastructureRequest":{"kind":"object","properties":{"migrated_journal_count":{"kind":"int64"},"migration_payload_uri":{"kind":"string"},"proof_sentinel_checksum":{"kind":"string"},"source_deployment_mode":{"kind":"string"},"status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"target_deployment_mode":{"kind":"string"}},"additional":null},"MonthlyDepreciationBatchResultView":{"kind":"object","properties":{"assets_processed_count":{"kind":"integer"},"company_book_id":{"kind":"string"},"period_date":{"kind":"string"},"processed_at":{"kind":"string"},"schedules_created_count":{"kind":"integer"},"status":{"kind":"string"},"total_depreciation_amount_minor":{"kind":"int64"}},"additional":null},"MonthlyPayrollRunView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"status":{"kind":"string"},"total_bpjs_employee_minor":{"kind":"int64"},"total_bpjs_employer_minor":{"kind":"int64"},"total_gross_salary_minor":{"kind":"int64"},"total_pph21_withheld_minor":{"kind":"int64"}},"additional":null},"NotificationDelivery":{"kind":"object","properties":{"channel":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"provider":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"provider_message_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"recipient_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"retry_count":{"kind":"integer"},"sent_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_capability":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"state":{"kind":"string"},"subject":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"NotificationDeliveryEnqueuedView":{"kind":"object","properties":{"notification_delivery_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"NsfpPoolView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"current_assigned_number":{"kind":"string"},"id":{"kind":"string"},"nsfp_end_number":{"kind":"string"},"nsfp_start_number":{"kind":"string"},"status":{"kind":"string"},"tax_year":{"kind":"integer"}},"additional":null},"OffboardingInventoryView":{"kind":"object","properties":{"active_document_locks_count":{"kind":"int64"},"assigned_roles_count":{"kind":"int64"},"blockade_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"calendar_events_count":{"kind":"int64"},"can_safely_offboard":{"kind":"boolean"},"is_owner":{"kind":"boolean"},"latest_verified_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"pending_attentions_count":{"kind":"int64"},"source_principal_id":{"kind":"string"},"user_drafts_count":{"kind":"int64"}},"additional":null},"OffboardingTransferResult":{"kind":"object","properties":{"attentions_transferred":{"kind":"int64"},"calendar_events_transferred":{"kind":"int64"},"company_book_id":{"kind":"string"},"document_locks_released":{"kind":"int64"},"drafts_transferred":{"kind":"int64"},"handover_id":{"kind":"string"},"membership_deactivated":{"kind":"boolean"},"source_principal_id":{"kind":"string"},"successor_principal_id":{"kind":"string"},"transferred_at":{"kind":"string"}},"additional":null},"OnboardSingaporeEntityRequest":{"kind":"object","properties":{"base_currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"company_name":{"kind":"string"},"corporate_secretary":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"directors":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"gst_registered":{"kind":"boolean"},"registered_address":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sleek_api_key":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"uen":{"kind":"string"}},"additional":null},"OnboardingDraftView":{"kind":"object","properties":{"admitted_relationship_id":{"kind":"string"},"confirmed_company_book_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"draft_payload":{"kind":"value"},"id":{"kind":"string"},"state_revision":{"kind":"int64"},"step_index":{"kind":"integer"}},"additional":null},"OnboardingPreviewRequest":{"kind":"object","properties":{"admitted_relationship_id":{"kind":"string"}},"additional":null},"OnboardingPreviewResponse":{"kind":"object","properties":{"admitted_relationship_id":{"kind":"string"},"display_name":{"kind":"string"},"enabled_capabilities":{"kind":"array","items":{"kind":"string"}},"functional_currency":{"kind":"string"},"is_confirmable":{"kind":"boolean"},"jurisdiction_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"operating_model":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"readiness_gaps":{"kind":"array","items":{"kind":"string"}},"required_facts":{"kind":"array","items":{"kind":"string"}},"starter_coa_preview":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"StarterCoaPreview"}]}},"additional":null},"OpenItem":{"kind":"object","properties":{"amount_allocated":{"kind":"int64"},"amount_open":{"kind":"int64"},"amount_open_transaction":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"direction":{"kind":"string"},"document_date":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"original_amount":{"kind":"int64"},"parent_open_item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_capability":{"kind":"string"},"source_doc_id":{"kind":"string"},"source_doc_type":{"kind":"string"},"status":{"kind":"string"},"transaction_currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"OpenPosCashierSessionRequest":{"kind":"object","properties":{"cashier_principal_id":{"kind":"string"},"opening_cash_float_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"terminal_id":{"kind":"string"}},"additional":null},"OpeningBalancesMigrationView":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"company_book_id":{"kind":"string"},"migrated_at":{"kind":"string"},"migration_id":{"kind":"string"},"opening_balances_migrated":{"kind":"boolean"},"status":{"kind":"string"},"total_credits_minor":{"kind":"int64"},"total_debits_minor":{"kind":"int64"}},"additional":null},"OwnerCapacityList":{"kind":"object","properties":{"owner_capacities":{"kind":"array","items":{"kind":"ref","name":"OwnerCapacityView"}}},"additional":null},"OwnerCapacityView":{"kind":"object","properties":{"id":{"kind":"string"},"principal_id":{"kind":"string"},"state":{"kind":"string"},"state_revision":{"kind":"int64"},"state_token":{"kind":"string"}},"additional":null},"PartnerManagedClientItemView":{"kind":"object","properties":{"client_name":{"kind":"string"},"company_book_id":{"kind":"string"},"environment_mode":{"kind":"string"},"linked_at":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"PartnerManagedClientListView":{"kind":"object","properties":{"clients":{"kind":"array","items":{"kind":"ref","name":"PartnerManagedClientItemView"}},"matured_commission_balance_minor":{"kind":"int64"},"partner_id":{"kind":"string"},"partner_name":{"kind":"string"},"partner_tier":{"kind":"string"},"total_clients":{"kind":"integer"}},"additional":null},"Payment":{"kind":"object","properties":{"allocations":{"kind":"array","items":{"kind":"ref","name":"PaymentAllocation"}},"amount":{"kind":"int64"},"amount_allocated":{"kind":"int64"},"bank_account_id":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"direction":{"kind":"string"},"id":{"kind":"string"},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_date":{"kind":"string"},"payment_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_number":{"kind":"string"},"payment_purpose":{"kind":"string"},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"resolved_gl_account_code":{"kind":"string"},"state_revision":{"kind":"int64"},"status":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"PaymentAllocation":{"kind":"object","properties":{"allocated_amount":{"kind":"int64"},"applied_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"applied_posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"document_id":{"kind":"string"},"document_type":{"kind":"string"},"fx_gain_loss":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"id":{"kind":"string"},"payment_id":{"kind":"string"}},"additional":null},"PaymentList":{"kind":"object","properties":{"payments":{"kind":"array","items":{"kind":"ref","name":"Payment"}}},"additional":null},"PayrollCalculationApprovalView":{"kind":"object","properties":{"approved_at":{"kind":"string"},"approved_by_principal_id":{"kind":"string"},"company_book_id":{"kind":"string"},"id":{"kind":"string"},"payroll_run_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"PayrollCalculationRunView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"total_bpjs_deduction_minor":{"kind":"int64"},"total_gross_salary_minor":{"kind":"int64"},"total_net_payout_minor":{"kind":"int64"},"total_pph21_tax_minor":{"kind":"int64"}},"additional":null},"PayrollRun":{"kind":"object","properties":{"bpjs_total":{"kind":"int64"},"created_at":{"kind":"string"},"deductions_total":{"kind":"int64"},"functional_currency":{"kind":"string"},"gross_total":{"kind":"int64"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"PayrollRunLine"}},"net_total":{"kind":"int64"},"pay_date":{"kind":"string"},"period":{"kind":"string"},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"pph21_total":{"kind":"int64"},"status":{"kind":"string"},"updated_at":{"kind":"string"}},"additional":null},"PayrollRunApprovalView":{"kind":"object","properties":{"approved_at":{"kind":"string"},"company_book_id":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"}},"additional":null},"PayrollRunLine":{"kind":"object","properties":{"allowances":{"kind":"int64"},"bank_account_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bonus":{"kind":"int64"},"bpjs_employee":{"kind":"int64"},"bpjs_employer":{"kind":"int64"},"employee_contact_id":{"kind":"string"},"gross":{"kind":"int64"},"id":{"kind":"string"},"net_pay":{"kind":"int64"},"other_deductions":{"kind":"int64"},"overtime":{"kind":"int64"},"pph21":{"kind":"int64"}},"additional":null},"PayrollRunList":{"kind":"object","properties":{"runs":{"kind":"array","items":{"kind":"ref","name":"PayrollRun"}}},"additional":null},"PendingCurationItemView":{"kind":"object","properties":{"id":{"kind":"string"},"status":{"kind":"string"},"submitted_at":{"kind":"string"},"submitter_name":{"kind":"string"},"target_id":{"kind":"string"},"target_name":{"kind":"string"},"target_type":{"kind":"string"}},"additional":null},"PendingCurationListView":{"kind":"object","properties":{"items":{"kind":"array","items":{"kind":"ref","name":"PendingCurationItemView"}},"total_count":{"kind":"integer"}},"additional":null},"PendingInvitationListItem":{"kind":"object","properties":{"delivery_state":{"kind":"string"},"expires_at":{"kind":"string"},"id":{"kind":"string"},"invited_by_principal_id":{"kind":"string"},"normalized_email":{"kind":"string"},"proposed_role_id":{"kind":"ref","name":"RoleId"},"state_revision":{"kind":"int64"},"state_token":{"kind":"string"}},"additional":null},"PeriodDeltaAdjustmentView":{"kind":"object","properties":{"adjusted_by_principal_id":{"kind":"string"},"adjustment_reason":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"delta_amount_minor":{"kind":"int64"},"delta_journal_id":{"kind":"string"},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"id":{"kind":"string"},"original_amount_minor":{"kind":"int64"},"target_journal_id":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"PeriodState":{"kind":"enum","values":["open","locked","closing","closed","finalized"]},"PersonInCharge":{"kind":"object","properties":{"contact_id":{"kind":"string"},"effective_from":{"kind":"string"},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"family_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"given_name":{"kind":"string"},"name":{"kind":"string"},"organization_contact_id":{"kind":"string"},"organization_name":{"kind":"string"},"relationship_id":{"kind":"string"},"relationship_type":{"kind":"string"},"telephone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"title":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"PgSettlementBatchIngestView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"fee_breakdowns":{"kind":"array","items":{"kind":"ref","name":"GatewayFeeBreakdownView"}},"gross_amount_minor":{"kind":"int64"},"id":{"kind":"string"},"net_payout_minor":{"kind":"int64"},"provider_name":{"kind":"string"},"settlement_date":{"kind":"string"},"settlement_reference":{"kind":"string"},"status":{"kind":"string"},"total_fee_minor":{"kind":"int64"}},"additional":null},"PgSettlementReconciliationResultView":{"kind":"object","properties":{"gross_amount_minor":{"kind":"int64"},"journal_entry_id":{"kind":"string"},"net_payout_minor":{"kind":"int64"},"reconciled_at":{"kind":"string"},"settlement_id":{"kind":"string"},"status":{"kind":"string"},"total_fee_minor":{"kind":"int64"}},"additional":null},"PhysicalBusinessEventRuleView":{"kind":"object","properties":{"classification_result":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"metric_trigger_condition":{"kind":"string"},"rule_name":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"PhysicalDeviceView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"device_identifier":{"kind":"string"},"device_type":{"kind":"string"},"firmware_version":{"kind":"string"},"id":{"kind":"string"},"mac_address":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"PhysicalEventStreamView":{"kind":"object","properties":{"classification":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"device_id":{"kind":"string"},"event_type":{"kind":"string"},"id":{"kind":"string"},"metric_payload":{"kind":"value"},"processed_at":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"PlaceAuctionBidRequest":{"kind":"object","properties":{"bid_amount_minor":{"kind":"int64"},"bid_deposit_hold_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bidder_principal_id":{"kind":"string"}},"additional":null},"PlaceInService":{"kind":"object","properties":{"date":{"kind":"string"}},"additional":null},"PlatformAdminOverviewView":{"kind":"object","properties":{"engine_health_status":{"kind":"string"},"open_support_tickets_count":{"kind":"integer"},"pending_curation_submissions_count":{"kind":"integer"},"total_active_books":{"kind":"integer"},"total_mrr_minor":{"kind":"int64"},"total_tenants":{"kind":"integer"}},"additional":null},"PlatformSystemHealthView":{"kind":"object","properties":{"checked_at":{"kind":"string"},"otel_collector_ready":{"kind":"boolean"},"postgres_ready":{"kind":"boolean"},"status":{"kind":"string"},"tigerbeetle_ready":{"kind":"boolean"},"uptime_seconds":{"kind":"int64"}},"additional":null},"PlatformTenantListView":{"kind":"object","properties":{"tenants":{"kind":"array","items":{"kind":"ref","name":"PlatformTenantSummary"}},"total_count":{"kind":"integer"}},"additional":null},"PlatformTenantSummary":{"kind":"object","properties":{"book_count":{"kind":"integer"},"created_at":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"tenant_name":{"kind":"string"}},"additional":null},"PocProjectBudgetView":{"kind":"object","properties":{"actual_cost_incurred_minor":{"kind":"int64"},"billed_to_date_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"completion_percentage":{"kind":"number"},"contract_asset_liability_minor":{"kind":"int64"},"contract_value_minor":{"kind":"int64"},"created_at":{"kind":"string"},"id":{"kind":"string"},"project_id":{"kind":"string"},"recognized_revenue_to_date_minor":{"kind":"int64"},"total_budgeted_cost_minor":{"kind":"int64"}},"additional":null},"PointLedgerEntryView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"loyalty_account_id":{"kind":"string"},"points_delta":{"kind":"int64"},"reference_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tenant_id":{"kind":"string"},"transaction_type":{"kind":"string"},"unearned_liability_amount_minor":{"kind":"int64"}},"additional":null},"PolicyInput":{"kind":"object","properties":{"catalog_key":{"kind":"string"},"effective_from":{"kind":"string"},"enabled":{"kind":"boolean"},"qualified_assessment_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"qualified_assessment_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"PolicyView":{"kind":"object","properties":{"approved_by":{"kind":"string"},"authority_url":{"kind":"string"},"catalog_key":{"kind":"string"},"created_at":{"kind":"string"},"effective_from":{"kind":"string"},"enabled":{"kind":"boolean"},"entity_applicability":{"kind":"string"},"explanation":{"kind":"string"},"financial_effect":{"kind":"string"},"framework":{"kind":"string"},"id":{"kind":"string"},"jurisdiction":{"kind":"string"},"policy_key":{"kind":"string"},"policy_value":{"kind":"value"},"qualified_assessment_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"qualified_assessment_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"requires_professional_judgment":{"kind":"boolean"},"source_locator":{"kind":"string"},"source_revision":{"kind":"string"},"source_title":{"kind":"string"},"supported_alternatives":{"kind":"array","items":{"kind":"string"}},"treatment_classification":{"kind":"ref","name":"TreatmentClassification"},"version":{"kind":"int64"}},"additional":null},"PosCashierSessionView":{"kind":"object","properties":{"cash_over_short_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"cashier_principal_id":{"kind":"string"},"closed_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"closing_cash_counted_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"expected_cash_total_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"id":{"kind":"string"},"opened_at":{"kind":"string"},"opening_cash_float_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"terminal_id":{"kind":"string"}},"additional":null},"PosHandoverEvidenceRequest":{"kind":"object","properties":{"control_transferred":{"kind":"boolean"},"evidence_reference":{"kind":"string"},"occurred_at":{"kind":"string"}},"additional":null},"PosOrderItemView":{"kind":"object","properties":{"cogs_amount_minor":{"kind":"int64"},"created_at":{"kind":"string"},"id":{"kind":"string"},"line_discount_minor":{"kind":"int64"},"pos_order_id":{"kind":"string"},"product_id":{"kind":"string"},"quantity":{"kind":"integer"},"unit_price_minor":{"kind":"int64"}},"additional":null},"PosOrderView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"content_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"correction_kind":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"corrects_pos_order_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"customer_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"discount_amount_minor":{"kind":"int64"},"final_total_minor":{"kind":"int64"},"financial_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"functional_currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"handover_actor_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"handover_evidence_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"handover_occurred_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"items":{"kind":"array","items":{"kind":"ref","name":"PosOrderItemView"}},"payment_method":{"kind":"string"},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"session_id":{"kind":"string"},"state_revision":{"kind":"int64"},"status":{"kind":"string"},"subtotal_minor":{"kind":"int64"},"tax_amount_minor":{"kind":"int64"},"tenant_id":{"kind":"string"}},"additional":null},"PosTerminalView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"outlet_location_id":{"kind":"string"},"receipt_footer":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"receipt_header":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"terminal_code":{"kind":"string"},"terminal_name":{"kind":"string"}},"additional":null},"PostPeriodDeltaAdjustmentRequest":{"kind":"object","properties":{"adjustment_reason":{"kind":"string"},"delta_amount_minor":{"kind":"int64"},"delta_journal_id":{"kind":"string"},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"original_amount_minor":{"kind":"int64"},"target_journal_id":{"kind":"string"}},"additional":null},"PostPosOrderAcceptedResponse":{"kind":"union","variants":[{"kind":"ref","name":"PostPosOrderResponse"},{"kind":"ref","name":"PostPosOrderApprovalRequiredResponse"}]},"PostPosOrderApprovalRequiredResponse":{"kind":"object","properties":{"order_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"PostPosOrderRequest":{"kind":"object","properties":{"expected_source_token":{"kind":"string"}},"additional":null},"PostPosOrderResponse":{"kind":"object","properties":{"finality":{"kind":"string"},"order_id":{"kind":"string"},"posting_id":{"kind":"string"}},"additional":null},"PostedMonth":{"kind":"object","properties":{"charge":{"kind":"int64"},"month":{"kind":"string"}},"additional":null},"Posting":{"kind":"object","properties":{"book_id":{"kind":"string"},"finality":{"kind":"string"},"financial_date":{"kind":"string"},"functional_currency":{"kind":"string"},"id":{"kind":"string"},"posting_time":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_capability":{"kind":"string"},"source_object_id":{"kind":"string"},"source_version":{"kind":"int64"},"stable_effect_key":{"kind":"string"},"state_revision":{"kind":"int64"}},"additional":null},"PostingSummary":{"kind":"object","properties":{"finality":{"kind":"string"},"posting_id":{"kind":"string"}},"additional":null},"PredictVariableConsiderationRequest":{"kind":"object","properties":{"customer_id":{"kind":"string"},"discount_term_days":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"early_discount_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"gross_amount_minor":{"kind":"int64"},"net_due_days":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"sales_document_id":{"kind":"string"}},"additional":null},"PreviewCollision":{"kind":"object","properties":{"component_key":{"kind":"string"},"decision":{"kind":"string"},"line_key":{"kind":"string"},"semantic_role":{"kind":"string"}},"additional":null},"PreviewLine":{"kind":"object","properties":{"account_class":{"kind":"string"},"code":{"kind":"string"},"line_key":{"kind":"string"},"name":{"kind":"string"},"normal_balance":{"kind":"string"},"ordinal":{"kind":"integer"},"semantic_role":{"kind":"string"}},"additional":null},"ProcessPosRetailOrderItemRequest":{"kind":"object","properties":{"line_discount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"product_id":{"kind":"string"},"quantity":{"kind":"integer"},"unit_price_minor":{"kind":"int64"}},"additional":null},"ProcessPosRetailOrderRequest":{"kind":"object","properties":{"customer_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"discount_amount_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"items":{"kind":"array","items":{"kind":"ref","name":"ProcessPosRetailOrderItemRequest"}},"payment_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"session_id":{"kind":"string"}},"additional":null},"ProfitDistributionResultView":{"kind":"object","properties":{"agreement_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"company_book_id":{"kind":"string"},"disbursed_at":{"kind":"string"},"id":{"kind":"string"},"journal_entry_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"partner_contact_id":{"kind":"string"},"payout_amount_minor":{"kind":"int64"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"ProfitSharingCalculationView":{"kind":"object","properties":{"agreement_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"calculated_at":{"kind":"string"},"calculated_payout_amount_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"hurdle_amount_minor":{"kind":"int64"},"id":{"kind":"string"},"partner_contact_id":{"kind":"string"},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"},"retained_earnings_minor":{"kind":"int64"},"share_percentage":{"kind":"number"},"split_type":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"total_net_profit_minor":{"kind":"int64"}},"additional":null},"ProjectRetentionSummaryView":{"kind":"object","properties":{"accumulated_released_minor":{"kind":"int64"},"accumulated_withheld_minor":{"kind":"int64"},"defect_liability_days":{"kind":"integer"},"defect_liability_end_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"retention_rate_pct":{"kind":"number"},"status":{"kind":"string"},"unmatured_balance_minor":{"kind":"int64"}},"additional":null},"ProjectSCurveMetricsView":{"kind":"object","properties":{"cost_variance_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"cpi":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"current_period_index":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"estimate_at_completion_eac_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"estimate_to_complete_etc_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"is_onerous_contract_risk":{"kind":"boolean"},"schedule_variance_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"spi":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]}},"additional":null},"ProjectSCurvePointView":{"kind":"object","properties":{"ac_cost_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"ac_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"ev_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"ev_value_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"period_index":{"kind":"integer"},"period_label":{"kind":"string"},"pv_cost_minor":{"kind":"int64"},"pv_pct":{"kind":"number"},"status":{"kind":"string"}},"additional":null},"ProjectSCurveSeriesResponse":{"kind":"object","properties":{"budget_at_completion_bac_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"contract_value_minor":{"kind":"int64"},"metrics":{"kind":"ref","name":"ProjectSCurveMetricsView"},"project_id":{"kind":"string"},"retention":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"ProjectRetentionSummaryView"}]},"series":{"kind":"array","items":{"kind":"ref","name":"ProjectSCurvePointView"}}},"additional":null},"PrometheusMetricsView":{"kind":"object","properties":{"active_provider":{"kind":"string"},"metrics":{"kind":"string"},"otel_endpoint":{"kind":"string"}},"additional":null},"PublishDirectoryProfile":{"kind":"object","properties":{"discoverable":{"kind":"boolean"},"display_name":{"kind":"string"},"handle":{"kind":"string"}},"additional":null},"PurchaseDocument":{"kind":"object","properties":{"amount_paid":{"kind":"int64"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"document_date":{"kind":"string"},"document_number":{"kind":"string"},"document_type":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"PurchaseLine"}},"matched_po_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"matched_receipt_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"parent_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"received_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"settlement_status":{"kind":"string"},"status":{"kind":"string"},"subtotal":{"kind":"int64"},"tax_total":{"kind":"int64"},"total":{"kind":"int64"},"updated_at":{"kind":"string"},"vendor_invoice_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"PurchaseDocumentList":{"kind":"object","properties":{"documents":{"kind":"array","items":{"kind":"ref","name":"PurchaseDocument"}}},"additional":null},"PurchaseLine":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"expense_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"line_total":{"kind":"int64"},"ordinal":{"kind":"integer"},"quantity":{"kind":"int64"},"quantity_invoiced":{"kind":"int64"},"quantity_received":{"kind":"int64"},"source_goods_receipt_line_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_purchase_order_line_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_supplier_quote_line_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"PurchaseOrderDecisionRequest":{"kind":"object","properties":{"decision":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"PurchaseOrderDetachRequest":{"kind":"object","properties":{"reason":{"kind":"string"}},"additional":null},"PurchaseOrderLineView":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"id":{"kind":"string"},"line_total":{"kind":"int64"},"quantity":{"kind":"int64"},"quantity_invoiced":{"kind":"int64"},"quantity_received":{"kind":"int64"},"source_quote_line_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"PurchaseOrderState":{"kind":"enum","values":["draft","submitted","approved","issued","void","cancelled"]},"PurchaseOrderView":{"kind":"object","properties":{"approval_request_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"conversion_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"document_number":{"kind":"string"},"exception_reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"PurchaseOrderLineView"}},"source_quote_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"state_revision":{"kind":"int64"},"status":{"kind":"ref","name":"PurchaseOrderState"},"total":{"kind":"int64"}},"additional":null},"QrisGenerateRequest":{"kind":"object","properties":{"amount_idr":{"kind":"int64"},"biller_split_fee_idr":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"transaction_id":{"kind":"string"}},"additional":null},"QrisGenerateResponse":{"kind":"object","properties":{"expires_at":{"kind":"string"},"payment_id":{"kind":"string"},"qr_image_url":{"kind":"string"},"qris_string":{"kind":"string"}},"additional":null},"QrisStatusResponse":{"kind":"object","properties":{"amount_received_idr":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"paid_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_id":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"QualifyCredit":{"kind":"object","properties":{"credit_score":{"kind":"integer"},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"QuoteConsumptionLineView":{"kind":"object","properties":{"committed_quantity":{"kind":"int64"},"committed_value":{"kind":"int64"},"quote_line_id":{"kind":"string"},"quoted_quantity":{"kind":"int64"},"quoted_value":{"kind":"int64"},"remaining_quantity":{"kind":"int64"},"remaining_value":{"kind":"int64"},"reserved_quantity":{"kind":"int64"},"reserved_value":{"kind":"int64"}},"additional":null},"QuoteConsumptionView":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"QuoteConsumptionLineView"}},"source_quote_id":{"kind":"string"}},"additional":null},"QuoteOrderAllocation":{"kind":"object","properties":{"quantity":{"kind":"int64"},"quote_line_id":{"kind":"string"}},"additional":null},"QuoteRevisionLineRequest":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"source_quote_line_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"QuoteRevisionRequest":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"QuoteRevisionLineRequest"}},"supplier_reference":{"kind":"string"},"valid_until":{"kind":"string"}},"additional":null},"QuoteState":{"kind":"enum","values":["draft","sent","accepted","rejected","expired","withdrawn"]},"ReceivePurchaseOrderRequest":{"kind":"object","properties":{"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"receipt_date":{"kind":"string"}},"additional":null},"ReconcileCodSettlementRequest":{"kind":"object","properties":{"awb_tracking_number":{"kind":"string"},"collected_amount_minor":{"kind":"int64"},"gateway_fee_minor":{"kind":"int64"},"settlement_notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ReconcilePgSettlementJournalRequest":{"kind":"object","properties":{"bank_account_id":{"kind":"string"},"clearing_account_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fee_expense_account_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"Reconciliation":{"kind":"object","properties":{"clean":{"kind":"boolean"},"discrepancies":{"kind":"array","items":{"kind":"ref","name":"EngineDiscrepancy"}},"invariant":{"kind":"string"},"pending_count":{"kind":"int64"}},"additional":null},"ReconciliationConflict":{"kind":"union","variants":[{"kind":"ref","name":"Reconciliation"},{"kind":"ref","name":"ErrorEnvelope"}]},"ReconciliationRequest":{"kind":"object","properties":{"book_id":{"kind":"string"}},"additional":null},"RecordRestructuringEventRequest":{"kind":"object","properties":{"carveout_perimeter_json":{"kind":"value"},"effective_date":{"kind":"string"},"event_type":{"kind":"string"},"goodwill_recognized_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"target_entity_name":{"kind":"string"},"transaction_valuation_minor":{"kind":"int64"}},"additional":null},"RecurringBillingBatchResultView":{"kind":"object","properties":{"batch_id":{"kind":"string"},"billing_as_of_date":{"kind":"string"},"company_book_id":{"kind":"string"},"invoices_generated_count":{"kind":"integer"},"processed_at":{"kind":"string"},"status":{"kind":"string"},"subscriptions_evaluated_count":{"kind":"integer"},"total_billed_minor":{"kind":"int64"}},"additional":null},"RedeemCustomerLoyaltyPointsRequest":{"kind":"object","properties":{"customer_contact_id":{"kind":"string"},"points":{"kind":"int64"},"reference_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"RedeemNonFiatUnitsRequest":{"kind":"object","properties":{"counterparty_entity_id":{"kind":"string"},"unit_type":{"kind":"string"},"units_amount":{"kind":"number"}},"additional":null},"RefundPayload":{"kind":"object","properties":{"reason":{"kind":"string"},"refunded_amount":{"kind":"int64"},"tx_id":{"kind":"string"}},"additional":null},"RefundResponse":{"kind":"object","properties":{"refund_id":{"kind":"string"},"refunded_at":{"kind":"string"},"status":{"kind":"string"}},"additional":null},"RegisterDeveloperRequest":{"kind":"object","properties":{"developer_email":{"kind":"string"},"developer_name":{"kind":"string"},"support_email":{"kind":"string"},"website_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"RegisterFixedAssetRequest":{"kind":"object","properties":{"accumulated_depr_account_number":{"kind":"string"},"acquisition_cost_minor":{"kind":"int64"},"acquisition_date":{"kind":"string"},"asset_account_number":{"kind":"string"},"asset_code":{"kind":"string"},"asset_name":{"kind":"string"},"depreciation_expense_account_number":{"kind":"string"},"depreciation_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"salvage_value_minor":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"useful_life_months":{"kind":"integer"}},"additional":null},"RegisterPhysicalDeviceRequest":{"kind":"object","properties":{"device_identifier":{"kind":"string"},"device_type":{"kind":"string"},"firmware_version":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"mac_address":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"RegisterPosTerminalRequest":{"kind":"object","properties":{"outlet_location_id":{"kind":"string"},"receipt_footer":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"receipt_header":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"terminal_code":{"kind":"string"},"terminal_name":{"kind":"string"}},"additional":null},"ReleaseTemporaryPostingLock":{"kind":"object","properties":{"reason":{"kind":"string"}},"additional":null},"ReopenAccountingPeriod":{"kind":"object","properties":{"correction_purpose":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"ReparentCompanyBookRequest":{"kind":"object","properties":{"effective_from":{"kind":"string"},"new_parent_book_id":{"kind":"string"},"previous_parent_book_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reparenting_reason":{"kind":"string"}},"additional":null},"ReplaceAccount":{"kind":"object","properties":{"active":{"kind":"boolean"},"code":{"kind":"string"},"manual_entry_allowed":{"kind":"boolean"},"name":{"kind":"string"}},"additional":null},"RequestConnection":{"kind":"object","properties":{"handle":{"kind":"string"},"message":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"RequestOwnerRequest":{"kind":"object","properties":{"principal_id":{"kind":"string"}},"additional":null},"ResetDeveloperSandboxBookRequest":{"kind":"object","properties":{"preserve_configuration":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ResolveBankStatementLine":{"kind":"object","properties":{"action":{"kind":"string"},"payment_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ResolveContactRequest":{"kind":"object","properties":{"display_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"entry_mode":{"kind":"string"},"phone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ResolveContactResponse":{"kind":"object","properties":{"active_vouchers_count":{"kind":"integer"},"contact_id":{"kind":"string"},"loyalty_points":{"kind":"int64"},"loyalty_tier":{"kind":"string"}},"additional":null},"RespondFindingRequest":{"kind":"object","properties":{"response_text":{"kind":"string"}},"additional":null},"RevaluationRequest":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"currency":{"kind":"string"},"exchange_rate":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"rate_type":{"kind":"string"}},"additional":null},"RevaluationRun":{"kind":"object","properties":{"as_of_date":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"exchange_rate":{"kind":"number"},"id":{"kind":"string"},"status":{"kind":"string"},"total_fx_gain_loss":{"kind":"int64"},"total_items_revalued":{"kind":"integer"}},"additional":null},"RevalueAsset":{"kind":"object","properties":{"date":{"kind":"string"},"reason":{"kind":"string"},"revalued_amount":{"kind":"int64"}},"additional":null},"ReversalRequest":{"kind":"object","properties":{"approval_request_id":{"kind":"string"},"content_sha256":{"kind":"string"},"id":{"kind":"string"},"original_posting_id":{"kind":"string"},"reason":{"kind":"string"},"requested_by_principal_id":{"kind":"string"},"reversal_financial_date":{"kind":"string"},"state":{"kind":"string"},"state_revision":{"kind":"int64"}},"additional":null},"RevokeDeveloperKeyRequest":{"kind":"object","properties":{"reason":{"kind":"string"}},"additional":null},"RoleAssignmentList":{"kind":"object","properties":{"assignments":{"kind":"array","items":{"kind":"ref","name":"RoleAssignmentView"}}},"additional":null},"RoleAssignmentView":{"kind":"object","properties":{"active":{"kind":"boolean"},"elevated":{"kind":"boolean"},"id":{"kind":"string"},"principal_id":{"kind":"string"},"role_display_name":{"kind":"string"},"role_id":{"kind":"string"},"state_revision":{"kind":"int64"},"state_token":{"kind":"string"}},"additional":null},"RoleDeactivationPreview":{"kind":"object","properties":{"affected_assignments":{"kind":"int64"},"referenced":{"kind":"boolean"},"role_id":{"kind":"string"}},"additional":null},"RoleId":{"kind":"string"},"RoleList":{"kind":"object","properties":{"roles":{"kind":"array","items":{"kind":"ref","name":"RoleView"}}},"additional":null},"RoleView":{"kind":"object","properties":{"active":{"kind":"boolean"},"archived":{"kind":"boolean"},"authority_revision":{"kind":"int64"},"authority_revision_id":{"kind":"string"},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"display_name":{"kind":"string"},"elevated":{"kind":"boolean"},"id":{"kind":"string"},"permission_group_id":{"kind":"string"},"state_revision":{"kind":"int64"},"state_token":{"kind":"string"},"system":{"kind":"boolean"},"system_key":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"RotateDeveloperKeyRequest":{"kind":"object","properties":{"grace_period_hours":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"RunBadDebtProvisioningRequest":{"kind":"object","properties":{"as_of_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"provision_rate_pct":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]}},"additional":null},"RunBankFeedRuleMatchingRequest":{"kind":"object","properties":{"min_confidence_threshold":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"rule_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"statement_line_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]}},"additional":null},"RunBankFeedRuleMatchingResultView":{"kind":"object","properties":{"auto_reconciled":{"kind":"int64"},"company_book_id":{"kind":"string"},"matches":{"kind":"array","items":{"kind":"ref","name":"BankFeedMatchView"}},"total_evaluated":{"kind":"int64"},"total_matched":{"kind":"int64"}},"additional":null},"RunIntercompanyEliminationsRequest":{"kind":"object","properties":{"auto_eliminate_matching_intercompany_tx":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"period_month":{"kind":"integer"},"period_year":{"kind":"integer"}},"additional":null},"RunMonthlyDepreciationBatchRequest":{"kind":"object","properties":{"asset_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"period_date":{"kind":"string"}},"additional":null},"RunRecurringBillingBatchRequest":{"kind":"object","properties":{"billing_as_of_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dry_run":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]}},"additional":null},"SaaSUsageMeteringView":{"kind":"object","properties":{"api_request_count":{"kind":"int64"},"billing_period_end":{"kind":"string"},"billing_period_start":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"journal_posting_count":{"kind":"int64"},"status":{"kind":"string"},"storage_bytes_used":{"kind":"int64"},"tenant_id":{"kind":"string"}},"additional":null},"SalesDocument":{"kind":"object","properties":{"amount_paid":{"kind":"int64"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"array","items":{"kind":"string"}},"document_date":{"kind":"string"},"document_number":{"kind":"string"},"document_type":{"kind":"string"},"due_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"SalesLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"parent_document_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"posting_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"salesperson_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"settlement_status":{"kind":"string"},"status":{"kind":"string"},"subtotal":{"kind":"int64"},"tax_total":{"kind":"int64"},"total":{"kind":"int64"},"updated_at":{"kind":"string"}},"additional":null},"SalesDocumentList":{"kind":"object","properties":{"documents":{"kind":"array","items":{"kind":"ref","name":"SalesDocument"}}},"additional":null},"SalesLeaderboardEntry":{"kind":"object","properties":{"conversion_rate_percentage":{"kind":"number"},"gross_margin_contribution_minor":{"kind":"integer"},"qualified_leads_count":{"kind":"int64"},"rank":{"kind":"integer"},"sales_rep_name":{"kind":"string"},"sales_rep_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"total_collected_cash_minor":{"kind":"integer"},"total_invoiced_revenue_minor":{"kind":"integer"},"total_leads_assigned":{"kind":"int64"}},"additional":null},"SalesLeaderboardView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"entries":{"kind":"array","items":{"kind":"ref","name":"SalesLeaderboardEntry"}}},"additional":null},"SalesLine":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"line_total":{"kind":"int64"},"ordinal":{"kind":"integer"},"quantity":{"kind":"int64"},"revenue_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_profile_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"unit_price":{"kind":"int64"}},"additional":null},"SalesOpportunityView":{"kind":"object","properties":{"assigned_sales_rep_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"company_book_id":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"estimated_amount_minor":{"kind":"int64"},"id":{"kind":"string"},"opportunity_name":{"kind":"string"},"pipeline_stage":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"win_probability_pct":{"kind":"number"}},"additional":null},"SalesQuoteView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"contact_id":{"kind":"string"},"converted_sales_invoice_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"created_at":{"kind":"string"},"expiry_date":{"kind":"string"},"grand_total_minor":{"kind":"int64"},"id":{"kind":"string"},"opportunity_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"quote_number":{"kind":"string"},"status":{"kind":"string"},"subtotal_minor":{"kind":"int64"},"tax_total_minor":{"kind":"int64"},"tenant_id":{"kind":"string"}},"additional":null},"SaveDraftInput":{"kind":"object","properties":{"draft_payload":{"kind":"value"},"expected_revision":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"step_index":{"kind":"integer"}},"additional":null},"SelectTemplateRequest":{"kind":"object","properties":{"document_kind":{"kind":"string"},"effective_from":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"template_id":{"kind":"string"},"template_version":{"kind":"string"}},"additional":null},"SendDocumentEmailRequest":{"kind":"object","properties":{"message_body":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"recipient_email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"subject":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"ServiceBilling":{"kind":"object","properties":{"allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceBillingAllocation"}},"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"invoice":{"kind":"ref","name":"SalesDocument"},"reason":{"kind":"string"},"source_sales_order_id":{"kind":"string"}},"additional":null},"ServiceBillingAllocation":{"kind":"object","properties":{"id":{"kind":"string"},"quantity":{"kind":"int64"},"service_billing_line_id":{"kind":"string"},"service_fulfillment_line_id":{"kind":"string"}},"additional":null},"ServiceBillingAllocationInput":{"kind":"object","properties":{"quantity":{"kind":"int64"},"service_fulfillment_line_id":{"kind":"string"}},"additional":null},"ServiceContractAssessment":{"kind":"object","properties":{"actor_principal_id":{"kind":"string"},"classification":{"kind":"ref","name":"ServiceRevenueClassification"},"contract_modification":{"kind":"boolean"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"finalized_at":{"kind":"string"},"fixed_transaction_price":{"kind":"int64"},"id":{"kind":"string"},"paragraph_35_a_met":{"kind":"boolean"},"paragraph_35_b_met":{"kind":"boolean"},"paragraph_35_c_met":{"kind":"boolean"},"performance_obligations":{"kind":"array","items":{"kind":"ref","name":"ServicePerformanceObligation"}},"principal_agent_issue":{"kind":"boolean"},"qualified_assessment_reference":{"kind":"string"},"qualified_assessment_sha256":{"kind":"string"},"sales_order_id":{"kind":"string"},"sales_order_state_revision":{"kind":"int64"},"source_customer_quote_id":{"kind":"string"},"source_quote_revision":{"kind":"int64"},"variable_consideration":{"kind":"boolean"}},"additional":null},"ServiceEvidence":{"kind":"object","properties":{"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"ServiceFakturMonetaryAssessment":{"kind":"object","properties":{"actor_principal_id":{"kind":"string"},"aggregation_level":{"kind":"string"},"calculation_contract_identity":{"kind":"string"},"commercial_terms_reference":{"kind":"string"},"commercial_terms_sha256":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"dpp":{"kind":"int64"},"dpp_method":{"kind":"string"},"dpp_method_version":{"kind":"string"},"faktur_date":{"kind":"string"},"faktur_evidence_reference":{"kind":"string"},"faktur_evidence_sha256":{"kind":"string"},"faktur_reference":{"kind":"string"},"faktur_status":{"kind":"string"},"finalized_at":{"kind":"string"},"gross_customer_amount":{"kind":"int64"},"id":{"kind":"string"},"nominal_ppn_rate_basis_points":{"kind":"integer"},"official_source_checked_on":{"kind":"string"},"official_source_reference":{"kind":"string"},"official_source_sha256":{"kind":"string"},"output_ppn":{"kind":"int64"},"penggantian":{"kind":"int64"},"rounding_contract_reference":{"kind":"string"},"rounding_contract_sha256":{"kind":"string"},"rounding_mode":{"kind":"string"},"sales_order_id":{"kind":"string"},"service_contract_assessment_id":{"kind":"string"},"service_invoice_id":{"kind":"string"},"service_recognition_readiness_assessment_id":{"kind":"string"},"service_tax_point_assessment_id":{"kind":"string"},"tax_point_date":{"kind":"string"}},"additional":null},"ServiceFulfillment":{"kind":"object","properties":{"actor_principal_id":{"kind":"string"},"created_at":{"kind":"string"},"customer_decided_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"customer_status":{"kind":"ref","name":"CustomerStatus"},"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"ServiceFulfillmentLine"}},"performed_from":{"kind":"string"},"performed_through":{"kind":"string"},"sales_order_id":{"kind":"string"}},"additional":null},"ServiceFulfillmentCustomerDecision":{"kind":"object","properties":{"customer_status":{"kind":"ref","name":"CustomerStatus"},"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"ServiceFulfillmentLine":{"kind":"object","properties":{"id":{"kind":"string"},"quantity":{"kind":"int64"},"sales_order_line_id":{"kind":"string"}},"additional":null},"ServiceFulfillmentLineInput":{"kind":"object","properties":{"quantity":{"kind":"int64"},"sales_order_line_id":{"kind":"string"}},"additional":null},"ServiceFulfillmentMutation":{"kind":"object","properties":{"fulfillment":{"kind":"ref","name":"ServiceFulfillment"},"sales_order":{"kind":"ref","name":"ServiceOrder"}},"additional":null},"ServiceObligationBillingAllocation":{"kind":"object","properties":{"id":{"kind":"string"},"quantity":{"kind":"int64"},"sales_order_line_id":{"kind":"string"},"service_fulfillment_line_id":{"kind":"string"},"service_invoice_allocation_id":{"kind":"string"},"service_invoice_id":{"kind":"string"},"service_invoice_line_id":{"kind":"string"}},"additional":null},"ServiceObligationBillingAllocationInput":{"kind":"object","properties":{"quantity":{"kind":"int64"},"service_invoice_allocation_id":{"kind":"string"}},"additional":null},"ServiceObligationOrderLineAllocation":{"kind":"object","properties":{"id":{"kind":"string"},"quantity":{"kind":"int64"},"sales_order_line_id":{"kind":"string"}},"additional":null},"ServiceObligationOrderLineAllocationInput":{"kind":"object","properties":{"quantity":{"kind":"int64"},"sales_order_line_id":{"kind":"string"}},"additional":null},"ServiceObligationSatisfaction":{"kind":"object","properties":{"control_transferred":{"kind":"boolean"},"customer_acceptance_reference":{"kind":"string"},"customer_acceptance_sha256":{"kind":"string"},"id":{"kind":"string"},"paragraph_38_control_reference":{"kind":"string"},"paragraph_38_control_sha256":{"kind":"string"},"performance_obligation_id":{"kind":"string"},"point_in_time_satisfied":{"kind":"boolean"},"qualified_evidence_reference":{"kind":"string"},"qualified_evidence_sha256":{"kind":"string"},"satisfaction_date":{"kind":"string"}},"additional":null},"ServiceObligationSatisfactionInput":{"kind":"object","properties":{"control_transferred":{"kind":"boolean"},"customer_acceptance_reference":{"kind":"string"},"customer_acceptance_sha256":{"kind":"string"},"paragraph_38_control_reference":{"kind":"string"},"paragraph_38_control_sha256":{"kind":"string"},"performance_obligation_id":{"kind":"string"},"point_in_time_satisfied":{"kind":"boolean"},"qualified_evidence_reference":{"kind":"string"},"qualified_evidence_sha256":{"kind":"string"},"satisfaction_date":{"kind":"string"}},"additional":null},"ServiceOrder":{"kind":"object","properties":{"confirmed_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"confirmed_by_principal_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"currency":{"kind":"string"},"document_date":{"kind":"string"},"document_number":{"kind":"string"},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"ServiceOrderLine"}},"state_revision":{"kind":"int64"},"status":{"kind":"ref","name":"ServiceOrderState"},"subtotal":{"kind":"int64"}},"additional":null},"ServiceOrderLifecycle":{"kind":"object","properties":{"evidence_digest":{"kind":"string"},"evidence_reference":{"kind":"string"},"reason":{"kind":"string"},"target_status":{"kind":"ref","name":"ServiceOrderState"}},"additional":null},"ServiceOrderLine":{"kind":"object","properties":{"accepted_or_pending_quantity":{"kind":"int64"},"confirmed_quantity":{"kind":"int64"},"description":{"kind":"string"},"id":{"kind":"string"},"item_id":{"kind":"string"}},"additional":null},"ServiceOrderState":{"kind":"enum","values":["draft","confirmed","partially_fulfilled","fulfilled","on_hold","closed","cancelled"]},"ServicePerformanceObligation":{"kind":"object","properties":{"allocated_amount":{"kind":"int64"},"billing_allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationBillingAllocation"}},"description":{"kind":"string"},"id":{"kind":"string"},"order_line_allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationOrderLineAllocation"}},"reference":{"kind":"string"}},"additional":null},"ServicePerformanceObligationInput":{"kind":"object","properties":{"allocated_amount":{"kind":"int64"},"billing_allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationBillingAllocationInput"}},"description":{"kind":"string"},"order_line_allocations":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationOrderLineAllocationInput"}},"reference":{"kind":"string"}},"additional":null},"ServiceRecognitionReadinessAssessment":{"kind":"object","properties":{"actor_principal_id":{"kind":"string"},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"finalized_at":{"kind":"string"},"fixed_transaction_price":{"kind":"int64"},"id":{"kind":"string"},"obligation_satisfactions":{"kind":"array","items":{"kind":"ref","name":"ServiceObligationSatisfaction"}},"sales_order_id":{"kind":"string"},"sales_order_state_revision":{"kind":"int64"},"service_contract_assessment_id":{"kind":"string"},"source_customer_quote_id":{"kind":"string"},"source_quote_revision":{"kind":"int64"},"tax_point_assessments":{"kind":"array","items":{"kind":"ref","name":"ServiceTaxPointAssessment"}}},"additional":null},"ServiceRevenueClassification":{"kind":"enum","values":["point_in_time","over_time"]},"ServiceTaxPointAssessment":{"kind":"object","properties":{"currency":{"kind":"string"},"designated_collector":{"kind":"boolean"},"domestic_supply":{"kind":"boolean"},"export_supply":{"kind":"boolean"},"faktur_date":{"kind":"string"},"faktur_reference":{"kind":"string"},"free_trade_zone":{"kind":"boolean"},"id":{"kind":"string"},"other_exclusion":{"kind":"boolean"},"prior_advance_tax":{"kind":"boolean"},"prior_taxed_base":{"kind":"int64"},"prior_term_tax":{"kind":"boolean"},"qualified_basis_reference":{"kind":"string"},"qualified_basis_sha256":{"kind":"string"},"remaining_taxable_base":{"kind":"int64"},"service_invoice_id":{"kind":"string"},"special_regime":{"kind":"boolean"},"statutory_supply_basis":{"kind":"string"},"supplier_pkp":{"kind":"boolean"},"tax_facility":{"kind":"boolean"},"tax_point_date":{"kind":"string"},"taxable_service_jkp":{"kind":"boolean"}},"additional":null},"ServiceTaxPointAssessmentInput":{"kind":"object","properties":{"designated_collector":{"kind":"boolean"},"domestic_supply":{"kind":"boolean"},"export_supply":{"kind":"boolean"},"faktur_date":{"kind":"string"},"faktur_reference":{"kind":"string"},"free_trade_zone":{"kind":"boolean"},"other_exclusion":{"kind":"boolean"},"prior_advance_tax":{"kind":"boolean"},"prior_taxed_base":{"kind":"int64"},"prior_term_tax":{"kind":"boolean"},"qualified_basis_reference":{"kind":"string"},"qualified_basis_sha256":{"kind":"string"},"remaining_taxable_base":{"kind":"int64"},"service_invoice_id":{"kind":"string"},"special_regime":{"kind":"boolean"},"statutory_supply_basis":{"kind":"string"},"supplier_pkp":{"kind":"boolean"},"tax_facility":{"kind":"boolean"},"tax_point_date":{"kind":"string"},"taxable_service_jkp":{"kind":"boolean"}},"additional":null},"SetApprovalPolicy":{"kind":"object","properties":{"mode":{"kind":"string"},"reason":{"kind":"string"},"required_role":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"threshold_amount":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"SetContactCreditLimitRequest":{"kind":"object","properties":{"credit_hold_active":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]},"credit_limit_minor":{"kind":"int64"},"grace_period_days":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]}},"additional":null},"SetLandedCostPolicy":{"kind":"object","properties":{"residual_treatment":{"kind":"string"}},"additional":null},"SetTimephasedBaselineRequest":{"kind":"object","properties":{"items":{"kind":"array","items":{"kind":"ref","name":"TimephasedBaselineItemRequest"}}},"additional":null},"ShareDocument":{"kind":"object","properties":{"sales_document_id":{"kind":"string"}},"additional":null},"SharedDocument":{"kind":"object","properties":{"id":{"kind":"string"},"prepared_document_id":{"kind":"string"},"prepared_status":{"kind":"string"},"source_document_number":{"kind":"string"}},"additional":null},"ShippingRateQuoteView":{"kind":"object","properties":{"courier_name":{"kind":"string"},"courier_service_code":{"kind":"string"},"currency":{"kind":"string"},"estimated_days":{"kind":"string"},"is_cod_supported":{"kind":"boolean"},"provider_name":{"kind":"string"},"rate_amount_minor":{"kind":"int64"},"service_name":{"kind":"string"}},"additional":null},"ShippingRatesQuoteListView":{"kind":"object","properties":{"cached_until":{"kind":"string"},"company_book_id":{"kind":"string"},"destination_postal_code":{"kind":"string"},"origin_postal_code":{"kind":"string"},"quotes":{"kind":"array","items":{"kind":"ref","name":"ShippingRateQuoteView"}},"weight_grams":{"kind":"integer"}},"additional":null},"SignoffAccountingPeriodAuditorRequest":{"kind":"object","properties":{"auditor_firm_name":{"kind":"string"},"auditor_license_number":{"kind":"string"},"auditor_public_key_fingerprint":{"kind":"string"},"auditor_signature_scope":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"merkle_root_hash":{"kind":"string"},"pki_signature_hex":{"kind":"string"}},"additional":null},"SingaporeEntityOnboardingView":{"kind":"object","properties":{"agm_due":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"annual_return_due":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"base_currency":{"kind":"string"},"coa_template":{"kind":"string"},"company_book_id":{"kind":"string"},"corporate_secretary":{"kind":"string"},"directors":{"kind":"array","items":{"kind":"string"}},"gst_rate_basis_points":{"kind":"integer"},"gst_registered":{"kind":"boolean"},"jurisdiction":{"kind":"string"},"legal_name":{"kind":"string"},"message":{"kind":"string"},"registered_address":{"kind":"string"},"status":{"kind":"string"},"uen":{"kind":"string"}},"additional":null},"SleekCompanyProfileView":{"kind":"object","properties":{"agm_due":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"annual_return_due":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"company_book_id":{"kind":"string"},"company_type":{"kind":"string"},"corporate_secretary":{"kind":"string"},"directors":{"kind":"array","items":{"kind":"string"}},"legal_name":{"kind":"string"},"registered_address":{"kind":"string"},"registration_date":{"kind":"string"},"status":{"kind":"string"},"uen":{"kind":"string"}},"additional":null},"SleekSignDocumentView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"dispatched_at":{"kind":"string"},"document_id":{"kind":"string"},"document_title":{"kind":"string"},"recipient_email":{"kind":"string"},"signing_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"}},"additional":null},"SleekWebhookAckView":{"kind":"object","properties":{"event_id":{"kind":"string"},"status":{"kind":"string"},"success":{"kind":"boolean"}},"additional":null},"SleekWebhookPayload":{"kind":"object","properties":{"document_id":{"kind":"string"},"event":{"kind":"string"},"signature_hash":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"uen":{"kind":"string"}},"additional":null},"SoftLockAccountingPeriodRequest":{"kind":"object","properties":{"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"SoftLockAccountingPeriodView":{"kind":"object","properties":{"accounting_period_id":{"kind":"string"},"company_book_id":{"kind":"string"},"id":{"kind":"string"},"locked_at":{"kind":"string"},"locked_by_principal_id":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"}},"additional":null},"SourcedPurchaseOrderListView":{"kind":"object","properties":{"purchase_orders":{"kind":"array","items":{"kind":"ref","name":"PurchaseOrderView"}}},"additional":null},"StarterCoaPreview":{"kind":"object","properties":{"collisions":{"kind":"array","items":{"kind":"ref","name":"PreviewCollision"}},"components":{"kind":"array","items":{"kind":"ref","name":"ComponentRef"}},"lines":{"kind":"array","items":{"kind":"ref","name":"PreviewLine"}},"status":{"kind":"string"}},"additional":null},"StatementOfChangesInEquity":{"kind":"object","properties":{"closing_equity_minor":{"kind":"integer"},"movements":{"kind":"array","items":{"kind":"ref","name":"EquityMovementLine"}},"net_income_minor":{"kind":"integer"},"opening_equity_minor":{"kind":"integer"}},"additional":null},"StockPosition":{"kind":"object","properties":{"avg_cost":{"kind":"int64"},"book_value":{"kind":"int64"},"item_id":{"kind":"string"},"on_hand_qty":{"kind":"int64"}},"additional":null},"StocktakeRequest":{"kind":"object","properties":{"counted_qty":{"kind":"int64"},"note":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"SubledgerStatementView":{"kind":"object","properties":{"account_role":{"kind":"string"},"company_book_id":{"kind":"string"},"counterparty_entity_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"in_review_claim_balance_minor":{"kind":"int64"},"matured_claimable_balance_minor":{"kind":"int64"},"non_fiat_units_balance":{"kind":"number"},"paid_out_total_minor":{"kind":"int64"},"tax_withheld_total_minor":{"kind":"int64"},"unmatured_balance_minor":{"kind":"int64"}},"additional":null},"SubmitAppRequest":{"kind":"object","properties":{"app_type":{"kind":"string"},"app_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"category":{"kind":"string"},"demo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"string"},"execution_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"icon_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"pricing_model":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"slug":{"kind":"string"},"summary":{"kind":"string"},"version":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"SubmitConnectorRequest":{"kind":"object","properties":{"category":{"kind":"string"},"description":{"kind":"string"},"documentation_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"execution_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"icon_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"mcp_protocol_version":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"pricing_model":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"release_notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"required_permission_scopes":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"slug":{"kind":"string"},"summary":{"kind":"string"},"version":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"version_semver":{"kind":"string"}},"additional":null},"SubmitPosOrderRequest":{"kind":"object","properties":{"financial_date":{"kind":"string"},"handover":{"kind":"ref","name":"PosHandoverEvidenceRequest"}},"additional":null},"SubmitSubledgerClaimRequest":{"kind":"object","properties":{"account_role":{"kind":"string"},"claim_amount_minor":{"kind":"int64"}},"additional":null},"SubscriptionPlanView":{"kind":"object","properties":{"billing_interval":{"kind":"string"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"id":{"kind":"string"},"plan_code":{"kind":"string"},"plan_name":{"kind":"string"},"price_minor":{"kind":"int64"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"SupplierQuote":{"kind":"object","properties":{"accepted_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"approval_request_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"connector_idempotency_key":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"contact_id":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"document_number":{"kind":"string"},"eligibility":{"kind":"ref","name":"Eligibility"},"external_company_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_content_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_party_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_quote_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"external_revision_ref":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"SupplierQuoteLineView"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quote_date":{"kind":"string"},"revision_of_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"source_system":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"ref","name":"QuoteState"},"subtotal":{"kind":"int64"},"supplier_reference":{"kind":"string"},"total":{"kind":"int64"},"updated_at":{"kind":"string"},"valid_until":{"kind":"string"}},"additional":null},"SupplierQuoteConversion":{"kind":"object","properties":{"action":{"kind":"ref","name":"ConversionAction"},"document_date":{"kind":"string"},"lines":{"kind":"array","items":{"kind":"ref","name":"SupplierQuoteConversionLine"}},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"revision":{"kind":"union","variants":[{"kind":"null"},{"kind":"ref","name":"QuoteRevisionRequest"}]}},"additional":null},"SupplierQuoteConversionLine":{"kind":"object","properties":{"discount_amount":{"kind":"int64"},"quantity":{"kind":"int64"},"quote_line_id":{"kind":"string"},"unit_price":{"kind":"int64"}},"additional":null},"SupplierQuoteDecision":{"kind":"object","properties":{"decision":{"kind":"string"},"reason":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"SupplierQuoteLine":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"quantity":{"kind":"int64"},"unit_price":{"kind":"int64"}},"additional":null},"SupplierQuoteLineView":{"kind":"object","properties":{"description":{"kind":"string"},"discount_amount":{"kind":"int64"},"id":{"kind":"string"},"item_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"line_total":{"kind":"int64"},"ordinal":{"kind":"integer"},"quantity":{"kind":"int64"},"unit_price":{"kind":"int64"}},"additional":null},"SupplierQuoteList":{"kind":"object","properties":{"quotes":{"kind":"array","items":{"kind":"ref","name":"SupplierQuote"}}},"additional":null},"SyncOfflineQueueItem":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"client_queue_id":{"kind":"string"},"offline_seq_hash":{"kind":"string"},"transaction_payload":{"kind":"value"},"transaction_type":{"kind":"string"}},"additional":null},"SyncOfflineQueueRequest":{"kind":"object","properties":{"records":{"kind":"array","items":{"kind":"ref","name":"SyncOfflineQueueItem"}}},"additional":null},"SyncOfflineQueueResultView":{"kind":"object","properties":{"processed_count":{"kind":"integer"},"synced_records":{"kind":"array","items":{"kind":"ref","name":"SyncOfflineRecordView"}}},"additional":null},"SyncOfflineRecordView":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"client_queue_id":{"kind":"string"},"id":{"kind":"string"},"offline_seq_hash":{"kind":"string"},"status":{"kind":"string"},"synced_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"transaction_type":{"kind":"string"}},"additional":null},"SyncSleekCompanyProfileRequest":{"kind":"object","properties":{"api_key":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"uen":{"kind":"string"}},"additional":null},"TagOwnerRequest":{"kind":"object","properties":{"owner_email":{"kind":"string"},"owner_name":{"kind":"string"}},"additional":null},"TemplateDefinitionView":{"kind":"object","properties":{"category":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"locale":{"kind":"string"},"name":{"kind":"string"},"source_capability":{"kind":"string"},"template_key":{"kind":"string"},"tenant_id":{"kind":"string"},"variable_schema":{"kind":"value"}},"additional":null},"TemplateSelectionView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"created_by":{"kind":"string"},"document_kind":{"kind":"string"},"effective_from":{"kind":"string"},"id":{"kind":"string"},"provenance":{"kind":"value"},"template_id":{"kind":"string"},"template_version":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"TemplateVersionView":{"kind":"object","properties":{"content_payload":{"kind":"string"},"created_at":{"kind":"string"},"style_metadata":{"kind":"value"},"subject_pattern":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"template_id":{"kind":"string"},"tenant_id":{"kind":"string"},"version":{"kind":"integer"}},"additional":null},"TemporaryLockEvidenceView":{"kind":"object","properties":{"expires_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"locked_at":{"kind":"string"},"owner_principal_id":{"kind":"string"},"reason":{"kind":"string"}},"additional":null},"TenantInfrastructureMigrationView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"id":{"kind":"string"},"initiated_by_principal_id":{"kind":"string"},"migrated_at":{"kind":"string"},"migrated_journal_count":{"kind":"int64"},"migration_payload_uri":{"kind":"string"},"proof_sentinel_checksum":{"kind":"string"},"source_deployment_mode":{"kind":"string"},"status":{"kind":"string"},"target_deployment_mode":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"TimephasedBaselineItemRequest":{"kind":"object","properties":{"period_index":{"kind":"integer"},"period_label":{"kind":"string"},"planned_cost_incremental_minor":{"kind":"int64"},"planned_progress_pct":{"kind":"number"}},"additional":null},"TimesheetApprovalRunView":{"kind":"object","properties":{"approved_by_principal_id":{"kind":"string"},"approved_entries_count":{"kind":"integer"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"period_end":{"kind":"string"},"period_start":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"total_approved_amount_minor":{"kind":"int64"},"total_approved_hours":{"kind":"number"}},"additional":null},"TimesheetEntryView":{"kind":"object","properties":{"billable_rate_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"customer_contact_id":{"kind":"string"},"entry_date":{"kind":"string"},"hours_logged":{"kind":"number"},"id":{"kind":"string"},"is_billable":{"kind":"boolean"},"project_code":{"kind":"string"},"staff_principal_id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"},"total_billable_minor":{"kind":"int64"}},"additional":null},"TransferAndOffboardRequest":{"kind":"object","properties":{"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"release_document_locks":{"kind":"boolean"},"successor_principal_id":{"kind":"string"},"transfer_attentions":{"kind":"boolean"},"transfer_calendar_events":{"kind":"boolean"},"transfer_drafts":{"kind":"boolean"}},"additional":null},"TransformationConsume":{"kind":"object","properties":{"item_id":{"kind":"string"},"quantity":{"kind":"int64"}},"additional":null},"TransformationOutput":{"kind":"object","properties":{"item_id":{"kind":"string"},"movement_id":{"kind":"string"},"quantity":{"kind":"int64"},"unit_cost":{"kind":"int64"},"value":{"kind":"int64"}},"additional":null},"TransformationProduce":{"kind":"object","properties":{"item_id":{"kind":"string"},"kind":{"kind":"string"},"quantity":{"kind":"int64"},"value":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]}},"additional":null},"TransitionAdmissionRequest":{"kind":"object","properties":{"reason":{"kind":"string"}},"additional":null},"TransitionBankAccount":{"kind":"object","properties":{"evidence":{"kind":"array","items":{"kind":"ref","name":"BankAccountEvidence"}},"reason":{"kind":"string"},"target_status":{"kind":"string"}},"additional":null},"TransitionBookInput":{"kind":"object","properties":{"effective_at":{"kind":"string"},"reason":{"kind":"string"},"target_state":{"kind":"ref","name":"LifecycleState"}},"additional":null},"TreatmentClassification":{"kind":"enum","values":["required","permitted","workflow"]},"TreatmentView":{"kind":"object","properties":{"annual_rate_basis_points":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"asset_category_id":{"kind":"string"},"authority_reference":{"kind":"string"},"book_id":{"kind":"string"},"classification_reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"effective_from":{"kind":"string"},"id":{"kind":"string"},"method":{"kind":"string"},"policy_reference":{"kind":"string"},"reason":{"kind":"string"},"recorded_at":{"kind":"string"},"recorded_by":{"kind":"string"},"residual_value":{"kind":"int64"},"useful_life_months":{"kind":"integer"},"version":{"kind":"int64"}},"additional":null},"TrialBalance":{"kind":"object","properties":{"lines":{"kind":"array","items":{"kind":"ref","name":"TrialBalanceLine"}},"total_credit_minor":{"kind":"integer"},"total_debit_minor":{"kind":"integer"}},"additional":null},"TrialBalanceLine":{"kind":"object","properties":{"account_code":{"kind":"string"},"account_id":{"kind":"string"},"account_name":{"kind":"string"},"balance_minor":{"kind":"integer"},"credit_minor":{"kind":"integer"},"debit_minor":{"kind":"integer"}},"additional":null},"TrialBalanceRenderProjection":{"kind":"object","properties":{"as_of":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"book_id":{"kind":"string"},"company_book_id":{"kind":"string"},"complete":{"kind":"boolean"},"functional_currency":{"kind":"string"},"has_more":{"kind":"boolean"},"lines":{"kind":"array","items":{"kind":"ref","name":"TrialBalanceLine"}},"masking":{"kind":"string"},"membership_read_visibility_revision":{"kind":"string"},"next_cursor":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payload_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payload_schema_version":{"kind":"integer"},"payload_sha256":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"report_kind":{"kind":"string"},"source_report_id":{"kind":"string"},"source_report_revision":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"total_credit_minor":{"kind":"integer"},"total_debit_minor":{"kind":"integer"}},"additional":null},"TriggerContinuousCloseRequest":{"kind":"object","properties":{"close_readiness_score":{"kind":"union","variants":[{"kind":"number"},{"kind":"null"}]},"daily_fx_revaluation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"daily_micro_depreciation_last_run":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"fiscal_period":{"kind":"integer"},"fiscal_year":{"kind":"integer"},"reconciliation_matched_count":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"TriggerFederatedNodeSyncRequest":{"kind":"object","properties":{"endpoint_uri":{"kind":"string"},"node_deployment_mode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"node_name":{"kind":"string"},"public_key_fingerprint":{"kind":"string"}},"additional":null},"UaeTaxSettingsView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"corporate_tax_exemption":{"kind":"boolean"},"created_at":{"kind":"string"},"free_zone_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"id":{"kind":"string"},"is_free_zone_qfzp":{"kind":"boolean"},"tenant_id":{"kind":"string"},"trn_number":{"kind":"string"},"vat_stagger_period":{"kind":"string"}},"additional":null},"UnifiedIdentityItem":{"kind":"object","properties":{"created_at":{"kind":"string"},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"identity_id":{"kind":"string"},"identity_type":{"kind":"string"},"issuer":{"kind":"string"},"last_active_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"status":{"kind":"string"},"total_requests":{"kind":"int64"}},"additional":null},"UnitReferenceItem":{"kind":"object","properties":{"lot_batch":{"kind":"string"},"unit_id":{"kind":"string"}},"additional":null},"UnitResolverPayload":{"kind":"object","properties":{"acquisition_date":{"kind":"string"},"current_location":{"kind":"string"},"financial_cost_basis":{"kind":"int64"},"item_code":{"kind":"string"},"item_name":{"kind":"string"},"provenance_journal_ref":{"kind":"string"},"serial_number":{"kind":"string"},"unit_references":{"kind":"array","items":{"kind":"ref","name":"UnitReferenceItem"}},"warranty_status":{"kind":"string"}},"additional":null},"UniversalContractView":{"kind":"object","properties":{"capital_ratio":{"kind":"number"},"company_book_id":{"kind":"string"},"contract_mode":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"profit_split_ratio":{"kind":"number"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"UpdateBankAccount":{"kind":"object","properties":{"account_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_number":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"account_type":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bank_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"bank_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"currency":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"gl_account_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"institution_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"swift_code":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UpdateCalendarEventStatusRequest":{"kind":"object","properties":{"status":{"kind":"ref","name":"CalendarEventStatus"}},"additional":null},"UpdateContact":{"kind":"object","properties":{"active":{"kind":"boolean"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"email":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"name":{"kind":"string"},"notes":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"tax_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"telephone":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UpdateInstalledConnectorConfigRequest":{"kind":"object","properties":{"configuration_values":{"kind":"value"},"granted_permission_scopes":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"is_enabled":{"kind":"union","variants":[{"kind":"boolean"},{"kind":"null"}]}},"additional":null},"UpdateItem":{"kind":"object","properties":{"active":{"kind":"boolean"},"aliases":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"barcode":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"max_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"min_stock_level":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"name":{"kind":"string"},"preferred_supplier_contact_id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"purchase_price":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"sale_account":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"sale_price":{"kind":"union","variants":[{"kind":"int64"},{"kind":"null"}]},"sku":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"taxable":{"kind":"boolean"},"unit":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UpdatePayment":{"kind":"object","properties":{"amount":{"kind":"int64"},"bank_account_id":{"kind":"string"},"contact_id":{"kind":"string"},"currency":{"kind":"string"},"dimension_value_ids":{"kind":"union","variants":[{"kind":"array","items":{"kind":"string"}},{"kind":"null"}]},"direction":{"kind":"string"},"memo":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"payment_date":{"kind":"string"},"payment_method":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"reference":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UpdateRoleMetadataRequest":{"kind":"object","properties":{"description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"suffix":{"kind":"string"}},"additional":null},"UpsertContactOrganization":{"kind":"object","properties":{"industry":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"legal_name":{"kind":"string"},"lei":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"registration_no":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"website":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UpsertContactPerson":{"kind":"object","properties":{"additional_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"birth_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"family_name":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gender":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"gender_description":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"given_name":{"kind":"string"}},"additional":null},"UpsertContactProfile":{"kind":"object","properties":{"about":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"headline":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"location":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"photo_url":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"website":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UsGaapBalanceSheetView":{"kind":"object","properties":{"as_of":{"kind":"string"},"company_book_id":{"kind":"string"},"currency":{"kind":"string"},"current_assets_minor":{"kind":"int64"},"current_liabilities_minor":{"kind":"int64"},"non_current_assets_minor":{"kind":"int64"},"non_current_liabilities_minor":{"kind":"int64"},"presentation_standard":{"kind":"string"},"stockholders_equity_minor":{"kind":"int64"},"total_assets_minor":{"kind":"int64"},"total_liabilities_and_equity_minor":{"kind":"int64"},"total_liabilities_minor":{"kind":"int64"}},"additional":null},"UsGaapIncomeStatementView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"cost_of_goods_sold_minor":{"kind":"int64"},"currency":{"kind":"string"},"from_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"gross_profit_minor":{"kind":"int64"},"gross_revenue_minor":{"kind":"int64"},"income_before_tax_minor":{"kind":"int64"},"income_tax_expense_minor":{"kind":"int64"},"net_income_minor":{"kind":"int64"},"non_operating_income_expense_minor":{"kind":"int64"},"operating_expenses_minor":{"kind":"int64"},"operating_income_minor":{"kind":"int64"},"presentation_standard":{"kind":"string"},"to_date":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]}},"additional":null},"UserDraftView":{"kind":"object","properties":{"client_device_signature":{"kind":"string"},"company_book_id":{"kind":"string"},"draft_payload":{"kind":"value"},"draft_type":{"kind":"string"},"has_draft":{"kind":"boolean"},"id":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"updated_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"user_principal_id":{"kind":"string"}},"additional":null},"UserReferralCodeView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"referee_discount_pct":{"kind":"number"},"referral_code":{"kind":"string"},"referral_code_id":{"kind":"string"},"referrer_principal_id":{"kind":"string"},"referrer_reward_pct":{"kind":"number"},"total_credits_earned_minor":{"kind":"int64"}},"additional":null},"ValidationViolation":{"kind":"object","properties":{"code":{"kind":"string"},"message":{"kind":"string"},"path":{"kind":"string"}},"additional":null},"VariableConsiderationPredictionView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"customer_id":{"kind":"string"},"id":{"kind":"string"},"predicted_take_up_probability":{"kind":"number"},"reserve_account_code":{"kind":"string"},"reserved_discount_amount_minor":{"kind":"int64"},"sales_document_id":{"kind":"string"},"should_book_day1_reserve":{"kind":"boolean"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"WealthPortfolioView":{"kind":"object","properties":{"asset_class":{"kind":"string"},"created_at":{"kind":"string"},"currency":{"kind":"string"},"current_valuation_minor":{"kind":"int64"},"family_group_id":{"kind":"string"},"id":{"kind":"string"},"last_valued_at":{"kind":"string"},"portfolio_name":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"WebhookDeliveryView":{"kind":"object","properties":{"created_at":{"kind":"string"},"event_payload":{"kind":"value"},"event_type":{"kind":"string"},"http_status":{"kind":"union","variants":[{"kind":"integer"},{"kind":"null"}]},"id":{"kind":"int64"},"retry_count":{"kind":"integer"},"sent_at":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"status":{"kind":"string"},"subscription_id":{"kind":"string"}},"additional":null},"WebhookSubscriptionView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"event_types":{"kind":"array","items":{"kind":"string"}},"id":{"kind":"string"},"is_active":{"kind":"boolean"},"last_status":{"kind":"union","variants":[{"kind":"string"},{"kind":"null"}]},"retry_count":{"kind":"integer"},"target_url":{"kind":"string"}},"additional":null},"WorkOrderPartsIssuedView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"created_at":{"kind":"string"},"id":{"kind":"string"},"item_id":{"kind":"string"},"quantity":{"kind":"integer"},"tenant_id":{"kind":"string"},"total_cost_minor":{"kind":"int64"},"unit_cost_minor":{"kind":"int64"},"work_order_id":{"kind":"string"}},"additional":null},"WorkingCapitalContributionView":{"kind":"object","properties":{"calculated_amount_minor":{"kind":"int64"},"company_book_id":{"kind":"string"},"contribution_basis":{"kind":"string"},"contribution_percentage_rate":{"kind":"number"},"created_at":{"kind":"string"},"id":{"kind":"string"},"period_year":{"kind":"integer"},"recipient_contact_id":{"kind":"string"},"status":{"kind":"string"},"tenant_id":{"kind":"string"}},"additional":null},"XeroHistoricalDataImportView":{"kind":"object","properties":{"company_book_id":{"kind":"string"},"import_id":{"kind":"string"},"imported_at":{"kind":"string"},"imported_contacts_count":{"kind":"integer"},"imported_journals_count":{"kind":"integer"},"status":{"kind":"string"},"xero_tenant_id":{"kind":"string"}},"additional":null}};
// ============================================================================
// HFE CLIENT CONFIGURATION & RUNTIME
// ============================================================================

export interface HfeClientConfig {
  baseUrl?: string;
  token?: string;
  fetchFn?: typeof fetch;
}

type SchemaDescriptor =
  | { kind: "value" }
  | { kind: "string" | "integer" | "number" | "boolean" | "null" }
  | { kind: "literal"; value: unknown }
  | { kind: "enum"; values: unknown[] }
  | { kind: "int64" }
  | { kind: "ref"; name: string }
  | { kind: "array"; items: SchemaDescriptor }
  | { kind: "object"; properties: Record<string, SchemaDescriptor>; additional: SchemaDescriptor | null }
  | { kind: "union" | "intersection"; variants: SchemaDescriptor[] };

interface OperationOptions {
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  body?: unknown;
}

interface OperationResponseDescriptor {
  schema: SchemaDescriptor;
  contentType: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeViolations(details: Record<string, unknown>): ValidationViolation[] | undefined {
  const violations = details.violations;
  if (violations === undefined || violations === null) {
    return [];
  }
  if (!Array.isArray(violations)) {
    return undefined;
  }
  if (!violations.every((violation) =>
    isRecord(violation) &&
    typeof violation.code === "string" &&
    typeof violation.message === "string" &&
    typeof violation.path === "string"
  )) {
    return undefined;
  }
  return violations as ValidationViolation[];
}

function quoteUnsafeJsonIntegers(json: string): string {
  const maxSafeInteger = BigInt(Number.MAX_SAFE_INTEGER);
  const minSafeInteger = BigInt(Number.MIN_SAFE_INTEGER);
  const jsonNumberPattern = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
  let output = "";
  let index = 0;

  while (index < json.length) {
    if (json[index] === '"') {
      const stringStart = index;
      index += 1;
      while (index < json.length) {
        if (json[index] === "\\") {
          index += 2;
        } else if (json[index] === '"') {
          index += 1;
          break;
        } else {
          index += 1;
        }
      }
      output += json.slice(stringStart, index);
      continue;
    }

    const current = json[index];
    jsonNumberPattern.lastIndex = index;
    const numberMatch = current === "-" || (current >= "0" && current <= "9")
      ? jsonNumberPattern.exec(json)
      : null;
    if (numberMatch) {
      const token = numberMatch[0];
      if (!/[.eE]/.test(token)) {
        const integer = BigInt(token);
        if (integer > maxSafeInteger || integer < minSafeInteger) {
          output += JSON.stringify(token);
          index += token.length;
          continue;
        }
      }
      output += token;
      index += token.length;
      continue;
    }

    output += json[index];
    index += 1;
  }

  return output;
}

function parseLosslessJson(json: string): unknown {
  return JSON.parse(quoteUnsafeJsonIntegers(json));
}

function resolveDescriptor(descriptor: SchemaDescriptor): SchemaDescriptor {
  if (descriptor.kind !== "ref") return descriptor;
  const resolved = schemaDescriptors[descriptor.name];
  if (!resolved) throw new Error(`Unknown generated schema descriptor: ${descriptor.name}`);
  return resolved;
}

function validateInt64Text(value: string): string {
  const text = String(value);
  if (!/^-?(?:0|[1-9]\d*)$/.test(text)) {
    throw new TypeError("int64 value must use canonical signed-decimal syntax");
  }
  const integer = BigInt(text);
  if (integer < -9223372036854775808n || integer > 9223372036854775807n) {
    throw new RangeError("int64 value must fit the inclusive signed 64-bit range");
  }
  return text;
}

function decodeInt64(value: unknown): string {
  if (typeof value === "string") return validateInt64Text(value);
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return validateInt64Text(String(value));
  }
  throw new TypeError("int64 response value must be an exact signed decimal string or safe integer");
}

function encodeInt64(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("generated int64 request value must be a canonical signed decimal string");
  }
  return validateInt64Text(value);
}

function descriptorMatches(value: unknown, descriptor: SchemaDescriptor): boolean {
  const resolved = resolveDescriptor(descriptor);
  switch (resolved.kind) {
    case "int64": {
      try {
        decodeInt64(value);
        return true;
      } catch {
        return false;
      }
    }
    case "string": return typeof value === "string";
    case "integer": return typeof value === "number" && Number.isInteger(value);
    case "number": return typeof value === "number";
    case "boolean": return typeof value === "boolean";
    case "null": return value === null;
    case "literal": return Object.is(value, resolved.value);
    case "enum": return resolved.values.some((candidate) => Object.is(value, candidate));
    case "array": return Array.isArray(value);
    case "object": return isRecord(value);
    case "union": return resolved.variants.some((variant) => descriptorMatches(value, variant));
    case "intersection": return resolved.variants.every((variant) => descriptorMatches(value, variant));
    default: return true;
  }
}

function matchingUnionVariant(value: unknown, variants: SchemaDescriptor[]): SchemaDescriptor | undefined {
  return variants.find((candidate) => resolveDescriptor(candidate).kind === "int64" && descriptorMatches(value, candidate))
    || variants.find((candidate) => descriptorMatches(value, candidate));
}

function assertSafeObjectKey(name: string): void {
  if (name === "__proto__" || name === "constructor" || name === "prototype") {
    throw new TypeError(`unsafe object key rejected: ${name}`);
  }
}

function decodeSchemaValue(value: unknown, descriptor: SchemaDescriptor): unknown {
  const resolved = resolveDescriptor(descriptor);
  switch (resolved.kind) {
    case "int64":
      return decodeInt64(value) as Int64String;
    case "array":
      return Array.isArray(value)
        ? value.map((item) => decodeSchemaValue(item, resolved.items))
        : value;
    case "object": {
      if (!isRecord(value)) return value;
      const decodedEntries = Object.entries(value).map(([name, childValue]) => {
        assertSafeObjectKey(name);
        if (Object.prototype.hasOwnProperty.call(resolved.properties, name)) {
          return [name, decodeSchemaValue(childValue, resolved.properties[name])] as const;
        }
        if (resolved.additional) {
          return [name, decodeSchemaValue(childValue, resolved.additional)] as const;
        }
        return [name, childValue] as const;
      });
      return Object.fromEntries(decodedEntries);
    }
    case "union": {
      const variant = matchingUnionVariant(value, resolved.variants);
      return variant ? decodeSchemaValue(value, variant) : value;
    }
    case "intersection":
      return resolved.variants.reduce((current, variant) => decodeSchemaValue(current, variant), value);
    default:
      return value;
  }
}

function serializeSchemaValue(value: unknown, descriptor: SchemaDescriptor): string {
  if (value === undefined) {
    throw new TypeError("undefined is not a valid generated SDK request value");
  }
  const resolved = resolveDescriptor(descriptor);
  switch (resolved.kind) {
    case "int64":
      return encodeInt64(value);
    case "array":
      if (!Array.isArray(value)) throw new TypeError("expected array for generated SDK request");
      return `[${value.map((item) => serializeSchemaValue(item, resolved.items)).join(",")}]`;
    case "object": {
      if (!isRecord(value)) throw new TypeError("expected object for generated SDK request");
      return `{${Object.entries(value).filter(([, child]) => child !== undefined).map(([name, child]) => {
        assertSafeObjectKey(name);
        const childDescriptor = resolved.properties[name] || resolved.additional || { kind: "value" };
        return `${JSON.stringify(name)}:${serializeSchemaValue(child, childDescriptor)}`;
      }).join(",")}}`;
    }
    case "union": {
      const variant = matchingUnionVariant(value, resolved.variants);
      return variant ? serializeSchemaValue(value, variant) : JSON.stringify(value);
    }
    case "intersection": {
      if (!isRecord(value)) return JSON.stringify(value);
      const merged: Record<string, SchemaDescriptor> = {};
      for (const variant of resolved.variants) {
        const candidate = resolveDescriptor(variant);
        if (candidate.kind === "object") Object.assign(merged, candidate.properties);
      }
      return serializeSchemaValue(value, { kind: "object", properties: merged, additional: null });
    }
    default:
      return JSON.stringify(value);
  }
}

export class HfeApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId: string | undefined,
    public details: ApiErrorDetails | undefined,
    public violations: ValidationViolation[],
    public rawBody: string
  ) {
    super(message);
    this.name = "HfeApiError";
  }
}

export class HfeClient {
  public baseUrl: string;
  private token?: string;
  private fetchFn: typeof fetch;

  constructor(config: HfeClientConfig = {}) {
    this.baseUrl = (config.baseUrl || "http://localhost:8080").replace(/\/+$/, "");
    this.token = config.token;
    this.fetchFn = config.fetchFn || (typeof fetch !== "undefined" ? fetch.bind(globalThis) : (undefined as any));
  }

  public setToken(token: string) {
    this.token = token;
  }

  private requestHeaders(extra: Record<string, unknown> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "X-Request-Id": `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    for (const [name, value] of Object.entries(extra)) {
      if (value !== undefined && value !== null) headers[name] = String(value);
    }
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    return headers;
  }

  private async apiError(response: Response): Promise<never> {
    const rawBody = await response.text();
    let parsedBody: unknown;
    try {
      parsedBody = parseLosslessJson(rawBody);
    } catch {
      const message = response.statusText || `HTTP ${response.status}`;
      throw new HfeApiError(response.status, "HTTP_ERROR", message, undefined, undefined, [], rawBody);
    }
    const error = isRecord(parsedBody) && isRecord(parsedBody.error) ? parsedBody.error : undefined;
    const errorDetails = error && isRecord(error.details) ? error.details : undefined;
    const violations = errorDetails ? normalizeViolations(errorDetails) : undefined;
    if (error && typeof error.code === "string" && typeof error.message === "string" &&
        typeof error.request_id === "string" && errorDetails && violations) {
      throw new HfeApiError(
        response.status,
        error.code,
        error.message,
        error.request_id,
        errorDetails as unknown as ApiErrorDetails,
        violations,
        rawBody
      );
    }
    const message = response.statusText || `HTTP ${response.status}`;
    throw new HfeApiError(response.status, "API_ERROR", message, undefined, undefined, [], rawBody);
  }

  public async request<T = any>(
    method: string,
    path: string,
    options: { params?: Record<string, any>; body?: any; idempotencyKey?: string; headers?: Record<string, string> } = {}
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (options.params) {
      const query = new URLSearchParams();
      for (const [name, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) query.append(name, String(value));
      }
      const encoded = query.toString();
      if (encoded) url += `?${encoded}`;
    }
    const headers = this.requestHeaders(options.headers);
    if (options.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
      headers["X-Idempotency-Key"] = options.idempotencyKey;
    }
    if (options.body) headers["Content-Type"] = "application/json";
    const response = await this.fetchFn(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) return this.apiError(response);
    if (response.status === 204) return undefined as any;
    return parseLosslessJson(await response.text()) as T;
  }

  private async requestOperation(
    method: string,
    pathTemplate: string,
    options: OperationOptions,
    requestSchema: SchemaDescriptor | undefined,
    responses: Record<string, OperationResponseDescriptor>
  ): Promise<{ status: number; body: unknown }> {
    let path = pathTemplate;
    for (const [name, value] of Object.entries(options.path || {})) {
      path = path.replace(`{${name}}`, encodeURIComponent(String(value)));
    }
    if (/\{[^}]+\}/.test(path)) throw new TypeError(`missing generated SDK path parameter for ${path}`);
    let url = `${this.baseUrl}${path}`;
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(options.query || {})) {
      if (value !== undefined && value !== null) query.append(name, String(value));
    }
    const encodedQuery = query.toString();
    if (encodedQuery) url += `?${encodedQuery}`;
    const headers = this.requestHeaders(options.headers);
    let body: string | undefined;
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = requestSchema ? serializeSchemaValue(options.body, requestSchema) : JSON.stringify(options.body);
    }
    const response = await this.fetchFn(url, { method, headers, body });
    if (!response.ok) return this.apiError(response);
    const expected = responses[String(response.status)];
    if (!expected) throw new Error(`Unexpected successful HTTP status ${response.status}`);
    if (expected.contentType === null) return { status: response.status, body: undefined };
    const rawBody = await response.text();
    const parsed = expected.contentType === "application/json" ? parseLosslessJson(rawBody) : rawBody;
    return { status: response.status, body: decodeSchemaValue(parsed, expected.schema) };
  }

  public readonly operations = {
    abortAccountingPeriodClose: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: AccountingPeriodTransition; }): Promise<{ status: 200; body: AccountingPeriod; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/abort-close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AccountingPeriodTransition"},
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriod; }>,

    acceptAuditProposal: (options: { path: { book: string; proposal_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-proposals/{proposal_id}/accept",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    acceptCompanyBookInvitation: (options: { headers: { "Idempotency-Key": string; }; body: AcceptInvitationRequest; }): Promise<{ status: 201; body: MembershipView; }> =>
      this.requestOperation(
        "POST",
        "/v1/invitations/accept",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AcceptInvitationRequest"},
        {"201":{"schema":{"kind":"ref","name":"MembershipView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: MembershipView; }>,

    acceptCompanyBookOwner: (options: { path: { book: string; owner: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: OwnerCapacityView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/owners/{owner}/accept",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OwnerCapacityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OwnerCapacityView; }>,

    acquireDocumentLock: (options: { path: { book: string; type: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AcquireDocumentLockRequest; }): Promise<{ status: 200; body: DocumentLockView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/documents/{type}/{id}/lock",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AcquireDocumentLockRequest"},
        {"200":{"schema":{"kind":"ref","name":"DocumentLockView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DocumentLockView; }>,

    addAuditProposalRevision: (options: { path: { book: string; proposal_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AddRevisionRequest; }): Promise<{ status: 201; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-proposals/{proposal_id}/revisions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AddRevisionRequest"},
        {"201":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: undefined; }>,

    addSubsidiaryMember: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AddSubsidiaryMemberRequest; }): Promise<{ status: 201; body: ConsolidationMemberView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/consolidation-perimeters/{id}/members",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AddSubsidiaryMemberRequest"},
        {"201":{"schema":{"kind":"ref","name":"ConsolidationMemberView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ConsolidationMemberView; }>,

    add_comment: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/tickets/{id}/comments",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    allocateContractLoss: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AllocateContractLossRequest; }): Promise<{ status: 200; body: ContractLossAllocationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contracts/allocate-loss",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AllocateContractLossRequest"},
        {"200":{"schema":{"kind":"ref","name":"ContractLossAllocationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContractLossAllocationView; }>,

    allocateNsfpSerialPool: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AllocateNsfpPoolRequest; }): Promise<{ status: 201; body: NsfpPoolView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/tax/nsfp-pools",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AllocateNsfpPoolRequest"},
        {"201":{"schema":{"kind":"ref","name":"NsfpPoolView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: NsfpPoolView; }>,

    allocatePayment: (options: { path: { book: string; payment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AllocatePayment; }): Promise<{ status: 200; body: Payment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/{payment_id}/allocate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AllocatePayment"},
        {"200":{"schema":{"kind":"ref","name":"Payment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Payment; }>,

    applyHubPartner: (options: { headers: { "Idempotency-Key": string; }; body: ApplyPartnerRequest; }): Promise<{ status: 201; body: HubPartnerView; }> =>
      this.requestOperation(
        "POST",
        "/v1/connect-hub/partners/apply",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApplyPartnerRequest"},
        {"201":{"schema":{"kind":"ref","name":"HubPartnerView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: HubPartnerView; }>,

    applyInvoiceEstamp: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ApplyInvoiceEstampRequest; }): Promise<{ status: 200; body: InvoiceEstampResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/invoices/{id}/estamp",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApplyInvoiceEstampRequest"},
        {"200":{"schema":{"kind":"ref","name":"InvoiceEstampResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InvoiceEstampResultView; }>,

    approveCompanyLive: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; }; body: ApproveLiveRequest; }): Promise<{ status: 200; body: CompanyBillingProfileView; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/company-books/{book}/approve-live",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApproveLiveRequest"},
        {"200":{"schema":{"kind":"ref","name":"CompanyBillingProfileView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyBillingProfileView; }>,

    approveManualJournal: (options: { path: { book: string; journal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: Decision; }): Promise<{ status: 200; body: ManualJournal; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/manual-journals/{journal}/approve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"Decision"},
        {"200":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ManualJournal; }>,

    approvePayrollCalculation: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ApprovePayrollCalculationRequest; }): Promise<{ status: 200; body: PayrollCalculationApprovalView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/approve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApprovePayrollCalculationRequest"},
        {"200":{"schema":{"kind":"ref","name":"PayrollCalculationApprovalView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollCalculationApprovalView; }>,

    approvePayrollRun: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ApprovePayrollRunRequest; }): Promise<{ status: 200; body: PayrollRunApprovalView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/runs/{id}/approve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApprovePayrollRunRequest"},
        {"200":{"schema":{"kind":"ref","name":"PayrollRunApprovalView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollRunApprovalView; }>,

    approveReversalRequest: (options: { path: { book: string; reversal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: Decision; }): Promise<{ status: 200; body: ReversalRequest; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reversal-requests/{reversal}/approve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"Decision"},
        {"200":{"schema":{"kind":"ref","name":"ReversalRequest"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ReversalRequest; }>,

    approveTimesheetBatch: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ApproveTimesheetBatchRequest; }): Promise<{ status: 200; body: TimesheetApprovalRunView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/timesheets/approve-batch",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApproveTimesheetBatchRequest"},
        {"200":{"schema":{"kind":"ref","name":"TimesheetApprovalRunView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: TimesheetApprovalRunView; }>,

    archiveCompanyBook: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ArchiveCompanyBook; }): Promise<{ status: 200; body: CompanyBook; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/archive",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ArchiveCompanyBook"},
        {"200":{"schema":{"kind":"ref","name":"CompanyBook"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyBook; }>,

    assessPocProjectRevenue: (options: { path: { book: string; project_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AssessPocProjectRevenueRequest; }): Promise<{ status: 200; body: PocProjectBudgetView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/poc-projects/{project_id}/assess-revenue",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AssessPocProjectRevenueRequest"},
        {"200":{"schema":{"kind":"ref","name":"PocProjectBudgetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PocProjectBudgetView; }>,

    assignAuditParticipant: (options: { path: { book: string; engagement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AssignParticipantRequest; }): Promise<{ status: 201; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-engagements/{engagement_id}/participants",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AssignParticipantRequest"},
        {"201":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: undefined; }>,

    autoSyncDraft: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: AutoSyncDraftRequest; }): Promise<{ status: 200; body: AutoSyncDraftView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/drafts/auto-sync",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AutoSyncDraftRequest"},
        {"200":{"schema":{"kind":"ref","name":"AutoSyncDraftView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AutoSyncDraftView; }>,

    beginAccountingPeriodClose: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: AccountingPeriodTransition; }): Promise<{ status: 200; body: AccountingPeriod; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/begin-close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AccountingPeriodTransition"},
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriod; }>,

    bookCourierDelivery: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: BookCourierDeliveryRequest; }): Promise<{ status: 200; body: BookedCourierDeliveryView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/deliveries/{id}/book-courier",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"BookCourierDeliveryRequest"},
        {"200":{"schema":{"kind":"ref","name":"BookedCourierDeliveryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BookedCourierDeliveryView; }>,

    calculatePayrollRun: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CalculatePayrollRunRequest; }): Promise<{ status: 200; body: PayrollCalculationRunView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/calculate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CalculatePayrollRunRequest"},
        {"200":{"schema":{"kind":"ref","name":"PayrollCalculationRunView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollCalculationRunView; }>,

    calculateProfitSharing: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CalculateProfitSharingRequest; }): Promise<{ status: 200; body: ProfitSharingCalculationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/profit-sharing/calculate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CalculateProfitSharingRequest"},
        {"200":{"schema":{"kind":"ref","name":"ProfitSharingCalculationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ProfitSharingCalculationView; }>,

    calculateShippingRates: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CalculateShippingRatesRequest; }): Promise<{ status: 200; body: ShippingRatesQuoteListView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/shipping/rates",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CalculateShippingRatesRequest"},
        {"200":{"schema":{"kind":"ref","name":"ShippingRatesQuoteListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ShippingRatesQuoteListView; }>,

    calculateWorkingCapitalContributions: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CalculateWorkingCapitalContributionsRequest; }): Promise<{ status: 200; body: WorkingCapitalContributionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contracts/contributions/calculate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CalculateWorkingCapitalContributionsRequest"},
        {"200":{"schema":{"kind":"ref","name":"WorkingCapitalContributionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WorkingCapitalContributionView; }>,

    cancelPurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/cancel",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    cancelSupplierQuoteConversion: (options: { path: { book: string; conversion_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: ConversionOutcome; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/quote-conversions/{conversion_id}/cancel",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ConversionOutcome"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConversionOutcome; }>,

    certifyProgressAndCost: (options: { path: { book: string; project_id: string; }; headers: { "X-CBook-Authority-Context": string; }; body: CertifyProgressRequest; }): Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/poc-projects/{project_id}/certify-progress",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CertifyProgressRequest"},
        {"200":{"schema":{"kind":"ref","name":"ProjectSCurveSeriesResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }>,

    claimConnectorVendor: (options: { path: { slug: string; }; headers: { "Idempotency-Key": string; }; body: ClaimConnectorVendorRequest; }): Promise<{ status: 200; body: ClaimConnectorVendorView; }> =>
      this.requestOperation(
        "POST",
        "/v1/connect-hub/connectors/{slug}/claim",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ClaimConnectorVendorRequest"},
        {"200":{"schema":{"kind":"ref","name":"ClaimConnectorVendorView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ClaimConnectorVendorView; }>,

    claimGuestCounterparty: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ClaimGuestCounterparty; }): Promise<{ status: 200; body: ClaimedGuestCounterparty; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/guest-counterparties/claim",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ClaimGuestCounterparty"},
        {"200":{"schema":{"kind":"ref","name":"ClaimedGuestCounterparty"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ClaimedGuestCounterparty; }>,

    clearUserDraft: (options: { path: { book: string; draft_type: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: ClearDraftResultView; }> =>
      this.requestOperation(
        "DELETE",
        "/v1/company-books/{book}/drafts/{draft_type}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ClearDraftResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ClearDraftResultView; }>,

    closeAccountingPeriod: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: AccountingPeriodTransition; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AccountingPeriodTransition"},
        {"200":{"schema":{"kind":"value"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: undefined; }>,

    closeAuctionLot: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CloseAuctionLotRequest; }): Promise<{ status: 200; body: AuctionSettlementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/auctions/{id}/close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CloseAuctionLotRequest"},
        {"200":{"schema":{"kind":"ref","name":"AuctionSettlementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuctionSettlementView; }>,

    closeAuditEngagement: (options: { path: { book: string; engagement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-engagements/{engagement_id}/close",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    closePosCashierSession: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ClosePosCashierSessionRequest; }): Promise<{ status: 200; body: PosCashierSessionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/sessions/close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ClosePosCashierSessionRequest"},
        {"200":{"schema":{"kind":"ref","name":"PosCashierSessionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PosCashierSessionView; }>,

    completeWorkOrder: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CompleteWorkOrderRequest; }): Promise<{ status: 200; body: CompleteWorkOrderResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/work-orders/{id}/complete",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CompleteWorkOrderRequest"},
        {"200":{"schema":{"kind":"ref","name":"CompleteWorkOrderResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompleteWorkOrderResultView; }>,

    configureAccountingFramework: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConfigureAccountingFrameworkRequest; }): Promise<{ status: 200; body: CompanyAccountingFrameworkSettingsView; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/settings/accounting-framework",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfigureAccountingFrameworkRequest"},
        {"200":{"schema":{"kind":"ref","name":"CompanyAccountingFrameworkSettingsView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyAccountingFrameworkSettingsView; }>,

    configureBatamFtzJurisdiction: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConfigureBatamFtzJurisdictionRequest; }): Promise<{ status: 200; body: BatamFtzSettingsView; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/settings/jurisdiction/batam-ftz",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfigureBatamFtzJurisdictionRequest"},
        {"200":{"schema":{"kind":"ref","name":"BatamFtzSettingsView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BatamFtzSettingsView; }>,

    configureHoldingSamplingRule: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConfigureHoldingSamplingRuleRequest; }): Promise<{ status: 201; body: HoldingAuditSampleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/auditor-working-papers/holding-sampling",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfigureHoldingSamplingRuleRequest"},
        {"201":{"schema":{"kind":"ref","name":"HoldingAuditSampleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: HoldingAuditSampleView; }>,

    configureUaeJurisdiction: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConfigureUaeJurisdictionRequest; }): Promise<{ status: 200; body: UaeTaxSettingsView; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/settings/jurisdiction/uae",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfigureUaeJurisdictionRequest"},
        {"200":{"schema":{"kind":"ref","name":"UaeTaxSettingsView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UaeTaxSettingsView; }>,

    confirmBankFeedMatch: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConfirmBankFeedMatchRequest; }): Promise<{ status: 200; body: BankFeedMatchConfirmationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/banking/feeds/{id}/confirm-match",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfirmBankFeedMatchRequest"},
        {"200":{"schema":{"kind":"ref","name":"BankFeedMatchConfirmationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankFeedMatchConfirmationView; }>,

    confirmCompanyBookRoleAuthority: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ChangeRoleAuthorityRequest; }): Promise<{ status: 200; body: RoleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/roles/{role}/authority-revisions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ChangeRoleAuthorityRequest"},
        {"200":{"schema":{"kind":"ref","name":"RoleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleView; }>,

    confirmOnboarding: (options: { headers: { "Idempotency-Key": string; }; body: ConfirmOnboardingRequest; }): Promise<{ status: 201; body: ConfirmOnboardingResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/product-experience/onboarding/confirmations",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConfirmOnboardingRequest"},
        {"201":{"schema":{"kind":"ref","name":"ConfirmOnboardingResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ConfirmOnboardingResponse; }>,

    confirmServiceSalesOrder: (options: { path: { book: string; order_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ServiceEvidence; }): Promise<{ status: 200; body: ServiceOrder; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/confirmation",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ServiceEvidence"},
        {"200":{"schema":{"kind":"ref","name":"ServiceOrder"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceOrder; }>,

    convertCustomerQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ConvertCustomerQuote; }): Promise<{ status: 201; body: CustomerQuoteConversion; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/customer-quotes/{quote_id}/sales-orders",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConvertCustomerQuote"},
        {"201":{"schema":{"kind":"ref","name":"CustomerQuoteConversion"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CustomerQuoteConversion; }>,

    convertQuoteToSalesInvoice: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ConvertQuoteToInvoiceRequest; }): Promise<{ status: 200; body: ConvertedQuoteToInvoiceView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/quotes/{id}/convert-to-invoice",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ConvertQuoteToInvoiceRequest"},
        {"200":{"schema":{"kind":"ref","name":"ConvertedQuoteToInvoiceView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConvertedQuoteToInvoiceView; }>,

    convertSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SupplierQuoteConversion; }): Promise<{ status: 201; body: ConversionOutcome; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/convert",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SupplierQuoteConversion"},
        {"201":{"schema":{"kind":"ref","name":"ConversionOutcome"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ConversionOutcome; }>,

    createAccount: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAccount; }): Promise<{ status: 201; body: Account; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAccount"},
        {"201":{"schema":{"kind":"ref","name":"Account"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Account; }>,

    createAccountingPeriod: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAccountingPeriod; }): Promise<{ status: 201; body: AccountingPeriod; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAccountingPeriod"},
        {"201":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AccountingPeriod; }>,

    createAccountingPolicyVersion: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PolicyInput; }): Promise<{ status: 201; body: PolicyView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/accounting-policies",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PolicyInput"},
        {"201":{"schema":{"kind":"ref","name":"PolicyView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PolicyView; }>,

    createAuctionLot: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAuctionLotRequest; }): Promise<{ status: 201; body: AuctionLotView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/auctions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAuctionLotRequest"},
        {"201":{"schema":{"kind":"ref","name":"AuctionLotView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AuctionLotView; }>,

    createAuditEngagement: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateEngagementRequest; }): Promise<{ status: 201; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-engagements",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateEngagementRequest"},
        {"201":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: undefined; }>,

    createAuditFinding: (options: { path: { book: string; engagement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateFindingRequest; }): Promise<{ status: 201; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-engagements/{engagement_id}/findings",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateFindingRequest"},
        {"201":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: undefined; }>,

    createAuditProposal: (options: { path: { book: string; finding_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateProposalRequest; }): Promise<{ status: 201; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-findings/{finding_id}/proposals",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateProposalRequest"},
        {"201":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: undefined; }>,

    createAuditorWorkingPaper: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAuditorWorkingPaperRequest; }): Promise<{ status: 201; body: AuditorWorkingPaperView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/auditor-working-papers",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAuditorWorkingPaperRequest"},
        {"201":{"schema":{"kind":"ref","name":"AuditorWorkingPaperView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AuditorWorkingPaperView; }>,

    createBankAccount: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBankAccount; }): Promise<{ status: 201; body: BankAccount; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-accounts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBankAccount"},
        {"201":{"schema":{"kind":"ref","name":"BankAccount"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BankAccount; }>,

    createBankCategorizationRule: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBankCategorizationRuleRequest; }): Promise<{ status: 201; body: BankCategorizationRuleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-feeds/rules",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBankCategorizationRuleRequest"},
        {"201":{"schema":{"kind":"ref","name":"BankCategorizationRuleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BankCategorizationRuleView; }>,

    createBankFeedConnection: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBankFeedConnectionRequest; }): Promise<{ status: 201; body: BankFeedConnectionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-feeds/connections",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBankFeedConnectionRequest"},
        {"201":{"schema":{"kind":"ref","name":"BankFeedConnectionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BankFeedConnectionView; }>,

    createBankStatement: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBankStatement; }): Promise<{ status: 201; body: BankStatement; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-statements",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBankStatement"},
        {"201":{"schema":{"kind":"ref","name":"BankStatement"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BankStatement; }>,

    createBusinessEventRule: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBusinessEventRuleRequest; }): Promise<{ status: 201; body: PhysicalBusinessEventRuleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/iot/rules",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBusinessEventRuleRequest"},
        {"201":{"schema":{"kind":"ref","name":"PhysicalBusinessEventRuleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PhysicalBusinessEventRuleView; }>,

    createCompanyBook: (options: { headers: { "Idempotency-Key": string; }; body: CreateCompanyBook; }): Promise<{ status: 201; body: CompanyBook; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateCompanyBook"},
        {"201":{"schema":{"kind":"ref","name":"CompanyBook"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CompanyBook; }>,

    createCompanyBookAccountingBook: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateBookInput; }): Promise<{ status: 201; body: BookView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/books",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateBookInput"},
        {"201":{"schema":{"kind":"ref","name":"BookView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BookView; }>,

    createCompanyBookInvitation: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateInvitationRequest; }): Promise<{ status: 200; body: InvitationView; } | { status: 201; body: InvitationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/invitations",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateInvitationRequest"},
        {"200":{"schema":{"kind":"ref","name":"InvitationView"},"contentType":"application/json"},"201":{"schema":{"kind":"ref","name":"InvitationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InvitationView; } | { status: 201; body: InvitationView; }>,

    createCompanyBookRole: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateRoleRequest; }): Promise<{ status: 201; body: RoleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/roles",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateRoleRequest"},
        {"201":{"schema":{"kind":"ref","name":"RoleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: RoleView; }>,

    createCompanyBookRoleAssignment: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAssignmentRequest; }): Promise<{ status: 201; body: RoleAssignmentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/role-assignments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAssignmentRequest"},
        {"201":{"schema":{"kind":"ref","name":"RoleAssignmentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: RoleAssignmentView; }>,

    createCompanyCapabilitySettingVersion: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CapabilitySettingInput; }): Promise<{ status: 201; body: CapabilitySettingView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/capabilities",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CapabilitySettingInput"},
        {"201":{"schema":{"kind":"ref","name":"CapabilitySettingView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CapabilitySettingView; }>,

    createCompanyDimensionRequirementVersion: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DimensionRequirementInput; }): Promise<{ status: 201; body: DimensionRequirementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/dimension-requirements",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DimensionRequirementInput"},
        {"201":{"schema":{"kind":"ref","name":"DimensionRequirementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: DimensionRequirementView; }>,

    createConsolidationPerimeter: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateConsolidationPerimeterRequest; }): Promise<{ status: 201; body: ConsolidationPerimeterView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/consolidation-perimeters",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateConsolidationPerimeterRequest"},
        {"201":{"schema":{"kind":"ref","name":"ConsolidationPerimeterView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ConsolidationPerimeterView; }>,

    createContact: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContact; }): Promise<{ status: 201; body: Contact; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContact"},
        {"201":{"schema":{"kind":"ref","name":"Contact"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Contact; }>,

    createContactAddress: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContactAddress; }): Promise<{ status: 201; body: ContactAddress; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/addresses",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContactAddress"},
        {"201":{"schema":{"kind":"ref","name":"ContactAddress"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ContactAddress; }>,

    createContactBankAccount: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContactBankAccount; }): Promise<{ status: 201; body: ContactBankAccount; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/bank-accounts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContactBankAccount"},
        {"201":{"schema":{"kind":"ref","name":"ContactBankAccount"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ContactBankAccount; }>,

    createContactProfileLink: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContactProfileLink; }): Promise<{ status: 201; body: ContactProfileLink; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/profile/links",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContactProfileLink"},
        {"201":{"schema":{"kind":"ref","name":"ContactProfileLink"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ContactProfileLink; }>,

    createContactRelationship: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContactRelationship; }): Promise<{ status: 201; body: ContactRelationship; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/relationships",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContactRelationship"},
        {"201":{"schema":{"kind":"ref","name":"ContactRelationship"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ContactRelationship; }>,

    createContactRole: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateContactRole; }): Promise<{ status: 201; body: ContactRole; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/roles",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateContactRole"},
        {"201":{"schema":{"kind":"ref","name":"ContactRole"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ContactRole; }>,

    createCustomCalendarEvent: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateCustomCalendarEventRequest; }): Promise<{ status: 201; body: CalendarEventView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/calendar/events/custom",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateCustomCalendarEventRequest"},
        {"201":{"schema":{"kind":"ref","name":"CalendarEventView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CalendarEventView; }>,

    createCustomerQuote: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CustomerQuoteRequest; }): Promise<{ status: 201; body: CustomerQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/customer-quotes",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CustomerQuoteRequest"},
        {"201":{"schema":{"kind":"ref","name":"CustomerQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CustomerQuote; }>,

    createCustomerSubscription: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateCustomerSubscriptionRequest; }): Promise<{ status: 201; body: CustomerSubscriptionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/subscriptions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateCustomerSubscriptionRequest"},
        {"201":{"schema":{"kind":"ref","name":"CustomerSubscriptionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CustomerSubscriptionView; }>,

    createDelivery: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateDelivery; }): Promise<{ status: 201; body: Delivery; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/deliveries",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateDelivery"},
        {"201":{"schema":{"kind":"ref","name":"Delivery"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Delivery; }>,

    createDimensionValue: (options: { path: { book: string; definition_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateDimensionValue; }): Promise<{ status: 201; body: DimensionValue; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/dimensions/{definition_id}/values",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateDimensionValue"},
        {"201":{"schema":{"kind":"ref","name":"DimensionValue"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: DimensionValue; }>,

    createDiscountRule: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateDiscountRuleRequest; }): Promise<{ status: 201; body: DiscountRuleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/discounts/rules",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateDiscountRuleRequest"},
        {"201":{"schema":{"kind":"ref","name":"DiscountRuleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: DiscountRuleView; }>,

    createEarlyAccessAdmission: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; }; body: CreateAdmission; }): Promise<{ status: 201; body: AdmissionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/company-books/{book}/early-access-admissions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAdmission"},
        {"201":{"schema":{"kind":"ref","name":"AdmissionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AdmissionView; }>,

    createEmployeePayrollProfile: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateEmployeePayrollProfileRequest; }): Promise<{ status: 201; body: EmployeePayrollProfileView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/employees",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateEmployeePayrollProfileRequest"},
        {"201":{"schema":{"kind":"ref","name":"EmployeePayrollProfileView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: EmployeePayrollProfileView; }>,

    createExpenseClaim: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateExpenseClaim; }): Promise<{ status: 201; body: ExpenseClaim; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/expense-claims",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateExpenseClaim"},
        {"201":{"schema":{"kind":"ref","name":"ExpenseClaim"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ExpenseClaim; }>,

    createExportJob: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: EnqueueExportJobRequest; }): Promise<{ status: 202; body: ExportJobResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/exports",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"EnqueueExportJobRequest"},
        {"202":{"schema":{"kind":"ref","name":"ExportJobResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 202; body: ExportJobResponse; }>,

    createFixedAsset: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateFixedAsset; }): Promise<{ status: 201; body: FixedAsset; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateFixedAsset"},
        {"201":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: FixedAsset; }>,

    createFixedAssetCategory: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateAssetCategoryRequest; }): Promise<{ status: 201; body: AssetCategoryView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/asset-categories",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateAssetCategoryRequest"},
        {"201":{"schema":{"kind":"ref","name":"AssetCategoryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AssetCategoryView; }>,

    createFixedAssetCategoryBookTreatment: (options: { path: { book: string; category: string; accounting_book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateTreatmentRequest; }): Promise<{ status: 201; body: TreatmentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/asset-categories/{category}/books/{accounting_book}/treatments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateTreatmentRequest"},
        {"201":{"schema":{"kind":"ref","name":"TreatmentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TreatmentView; }>,

    createGuestCounterparty: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateGuestCounterparty; }): Promise<{ status: 201; body: GuestCounterparty; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/guest-counterparties",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateGuestCounterparty"},
        {"201":{"schema":{"kind":"ref","name":"GuestCounterparty"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: GuestCounterparty; }>,

    createImportDeclaration: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateImportDeclaration; }): Promise<{ status: 201; body: ImportDeclaration; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/import-declarations",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateImportDeclaration"},
        {"201":{"schema":{"kind":"ref","name":"ImportDeclaration"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ImportDeclaration; }>,

    createInventoryLocation: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateInventoryLocation; }): Promise<{ status: 201; body: InventoryLocation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/inventory-locations",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateInventoryLocation"},
        {"201":{"schema":{"kind":"ref","name":"InventoryLocation"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: InventoryLocation; }>,

    createInventoryTransfer: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateInventoryTransfer; }): Promise<{ status: 201; body: InventoryTransfer; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/inventory-transfers",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateInventoryTransfer"},
        {"201":{"schema":{"kind":"ref","name":"InventoryTransfer"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: InventoryTransfer; }>,

    createInventoryTransformation: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateInventoryTransformation; }): Promise<{ status: 201; body: InventoryTransformation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/inventory/transformations",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateInventoryTransformation"},
        {"201":{"schema":{"kind":"ref","name":"InventoryTransformation"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: InventoryTransformation; }>,

    createItem: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateItem; }): Promise<{ status: 201; body: Item; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/items",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateItem"},
        {"201":{"schema":{"kind":"ref","name":"Item"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Item; }>,

    createLandedCostApportionment: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateLandedCostApportionment; }): Promise<{ status: 201; body: LandedCostApportionment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/landed-cost-apportionments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateLandedCostApportionment"},
        {"201":{"schema":{"kind":"ref","name":"LandedCostApportionment"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: LandedCostApportionment; }>,

    createLead: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateLead; }): Promise<{ status: 201; body: Lead; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/leads",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateLead"},
        {"201":{"schema":{"kind":"ref","name":"Lead"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Lead; }>,

    createManualJournal: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ManualJournalContent; }): Promise<{ status: 201; body: ManualJournal; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/manual-journals",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ManualJournalContent"},
        {"201":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ManualJournal; }>,

    createMonthlyPayrollRun: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateMonthlyPayrollRunRequest; }): Promise<{ status: 201; body: MonthlyPayrollRunView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/runs",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateMonthlyPayrollRunRequest"},
        {"201":{"schema":{"kind":"ref","name":"MonthlyPayrollRunView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: MonthlyPayrollRunView; }>,

    createPayment: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePayment; }): Promise<{ status: 201; body: Payment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePayment"},
        {"201":{"schema":{"kind":"ref","name":"Payment"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Payment; }>,

    createPayrollRun: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePayrollRun; }): Promise<{ status: 201; body: PayrollRun; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll-runs",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePayrollRun"},
        {"201":{"schema":{"kind":"ref","name":"PayrollRun"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PayrollRun; }>,

    createPersonInCharge: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePersonInCharge; }): Promise<{ status: 201; body: PersonInCharge; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/people-in-charge",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePersonInCharge"},
        {"201":{"schema":{"kind":"ref","name":"PersonInCharge"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PersonInCharge; }>,

    createPocProjectBudget: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePocProjectBudgetRequest; }): Promise<{ status: 201; body: PocProjectBudgetView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/poc-projects",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePocProjectBudgetRequest"},
        {"201":{"schema":{"kind":"ref","name":"PocProjectBudgetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PocProjectBudgetView; }>,

    createPurchaseDocument: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePurchaseDocument; }): Promise<{ status: 201; body: PurchaseDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-documents",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePurchaseDocument"},
        {"201":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PurchaseDocument; }>,

    createReversalRequest: (options: { path: { book: string; posting: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateReversalRequest; }): Promise<{ status: 201; body: ReversalRequest; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/postings/{posting}/reversal-requests",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateReversalRequest"},
        {"201":{"schema":{"kind":"ref","name":"ReversalRequest"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ReversalRequest; }>,

    createSalesDocument: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSalesDocument; }): Promise<{ status: 201; body: SalesDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-documents",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSalesDocument"},
        {"201":{"schema":{"kind":"ref","name":"SalesDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SalesDocument; }>,

    createSalesOpportunity: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSalesOpportunityRequest; }): Promise<{ status: 201; body: SalesOpportunityView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/opportunities",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSalesOpportunityRequest"},
        {"201":{"schema":{"kind":"ref","name":"SalesOpportunityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SalesOpportunityView; }>,

    createSalesQuote: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSalesQuoteRequest; }): Promise<{ status: 201; body: SalesQuoteView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/quotes",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSalesQuoteRequest"},
        {"201":{"schema":{"kind":"ref","name":"SalesQuoteView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SalesQuoteView; }>,

    createServiceBilling: (options: { path: { book: string; order_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateServiceBilling; }): Promise<{ status: 201; body: ServiceBilling; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/service-billings",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateServiceBilling"},
        {"201":{"schema":{"kind":"ref","name":"ServiceBilling"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ServiceBilling; }>,

    createServiceContractAssessment: (options: { path: { book: string; order_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateServiceContractAssessment; }): Promise<{ status: 201; body: ServiceContractAssessment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/service-contract-assessments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateServiceContractAssessment"},
        {"201":{"schema":{"kind":"ref","name":"ServiceContractAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ServiceContractAssessment; }>,

    createServiceFakturMonetaryAssessment: (options: { path: { book: string; readiness_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateServiceFakturMonetaryAssessment; }): Promise<{ status: 201; body: ServiceFakturMonetaryAssessment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/service-recognition-readiness-assessments/{readiness_id}/faktur-monetary-assessments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateServiceFakturMonetaryAssessment"},
        {"201":{"schema":{"kind":"ref","name":"ServiceFakturMonetaryAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ServiceFakturMonetaryAssessment; }>,

    createServiceFulfillment: (options: { path: { book: string; order_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateServiceFulfillment; }): Promise<{ status: 201; body: ServiceFulfillmentMutation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/service-fulfillments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateServiceFulfillment"},
        {"201":{"schema":{"kind":"ref","name":"ServiceFulfillmentMutation"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ServiceFulfillmentMutation; }>,

    createServiceRecognitionReadinessAssessment: (options: { path: { book: string; assessment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateServiceRecognitionReadinessAssessment; }): Promise<{ status: 201; body: ServiceRecognitionReadinessAssessment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/service-contract-assessments/{assessment_id}/recognition-readiness-assessments",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateServiceRecognitionReadinessAssessment"},
        {"201":{"schema":{"kind":"ref","name":"ServiceRecognitionReadinessAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: ServiceRecognitionReadinessAssessment; }>,

    createSubscriptionPlan: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSubscriptionPlanRequest; }): Promise<{ status: 201; body: SubscriptionPlanView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/subscriptions/plans",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSubscriptionPlanRequest"},
        {"201":{"schema":{"kind":"ref","name":"SubscriptionPlanView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SubscriptionPlanView; }>,

    createSupplierQuote: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSupplierQuote; }): Promise<{ status: 201; body: SupplierQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSupplierQuote"},
        {"201":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SupplierQuote; }>,

    createTemplateDefinition: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateTemplateDefinitionRequest; }): Promise<{ status: 201; body: TemplateDefinitionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/templates/definitions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateTemplateDefinitionRequest"},
        {"201":{"schema":{"kind":"ref","name":"TemplateDefinitionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TemplateDefinitionView; }>,

    createTemplateVersion: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateTemplateVersionRequest; }): Promise<{ status: 201; body: TemplateVersionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/templates/definitions/{id}/versions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateTemplateVersionRequest"},
        {"201":{"schema":{"kind":"ref","name":"TemplateVersionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TemplateVersionView; }>,

    createTemporaryPostingLock: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CreateTemporaryPostingLock; }): Promise<{ status: 200; body: AccountingPeriod; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/lock",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateTemporaryPostingLock"},
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriod; }>,

    createUniversalContract: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateUniversalContractRequest; }): Promise<{ status: 201; body: UniversalContractView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contracts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateUniversalContractRequest"},
        {"201":{"schema":{"kind":"ref","name":"UniversalContractView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: UniversalContractView; }>,

    createUserReferralCode: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; "X-CBook-Authority-Context": string; }; body: CreateUserReferralCodeRequest; }): Promise<{ status: 200; body: UserReferralCodeView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/referrals/codes",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateUserReferralCodeRequest"},
        {"200":{"schema":{"kind":"ref","name":"UserReferralCodeView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UserReferralCodeView; }>,

    createWealthPortfolio: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateWealthPortfolioRequest; }): Promise<{ status: 201; body: WealthPortfolioView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/wealth-portfolios",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateWealthPortfolioRequest"},
        {"201":{"schema":{"kind":"ref","name":"WealthPortfolioView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: WealthPortfolioView; }>,

    createWebhookSubscription: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; "X-CBook-Authority-Context": string; }; body: CreateWebhookSubscriptionRequest; }): Promise<{ status: 200; body: WebhookSubscriptionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/webhooks/subscriptions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateWebhookSubscriptionRequest"},
        {"200":{"schema":{"kind":"ref","name":"WebhookSubscriptionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WebhookSubscriptionView; }>,

    createWorkOrder: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateWorkOrderRequest; }): Promise<{ status: 201; body: CompanyWorkOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/work-orders",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateWorkOrderRequest"},
        {"201":{"schema":{"kind":"ref","name":"CompanyWorkOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CompanyWorkOrderView; }>,

    create_ticket: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/tickets",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    deactivateCompanyBookRole: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: RoleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/roles/{role}/deactivate",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleView; }>,

    deactivateContactProfileLink: (options: { path: { book: string; contact_id: string; link_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 204; body: undefined; }> =>
      this.requestOperation(
        "DELETE",
        "/v1/company-books/{book}/contacts/{contact_id}/profile/links/{link_id}",
        options as unknown as OperationOptions,
        undefined,
        {"204":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 204; body: undefined; }>,

    decideApproval: (options: { path: { book: string; approval_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ApprovalDecisionRequest; }): Promise<{ status: 200; body: ApprovalDecisionResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/approvals/{approval_id}/decide",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ApprovalDecisionRequest"},
        {"200":{"schema":{"kind":"ref","name":"ApprovalDecisionResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ApprovalDecisionResponse; }>,

    decideConnection: (options: { path: { book: string; connection_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DecideConnection; }): Promise<{ status: 200; body: Connection; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connections/{connection_id}/decide",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DecideConnection"},
        {"200":{"schema":{"kind":"ref","name":"Connection"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Connection; }>,

    decidePurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PurchaseOrderDecisionRequest; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/decide",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PurchaseOrderDecisionRequest"},
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    decideServiceFulfillmentCustomerStatus: (options: { path: { book: string; order_id: string; fulfillment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ServiceFulfillmentCustomerDecision; }): Promise<{ status: 200; body: ServiceFulfillmentMutation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/service-fulfillments/{fulfillment_id}/customer-status",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ServiceFulfillmentCustomerDecision"},
        {"200":{"schema":{"kind":"ref","name":"ServiceFulfillmentMutation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceFulfillmentMutation; }>,

    decideSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SupplierQuoteDecision; }): Promise<{ status: 200; body: SupplierQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/decide",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SupplierQuoteDecision"},
        {"200":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuote; }>,

    deleteCompanyBookRole: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 204; body: undefined; }> =>
      this.requestOperation(
        "DELETE",
        "/v1/company-books/{book}/roles/{role}",
        options as unknown as OperationOptions,
        undefined,
        {"204":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 204; body: undefined; }>,

    depreciateAsset: (options: { path: { book: string; asset_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DepreciateRequest; }): Promise<{ status: 200; body: DepreciationResult; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets/{asset_id}/depreciate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DepreciateRequest"},
        {"200":{"schema":{"kind":"ref","name":"DepreciationResult"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DepreciationResult; }>,

    detachPurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PurchaseOrderDetachRequest; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/detach",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PurchaseOrderDetachRequest"},
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    detectBankStatementMapping: (options: { path: { book: string; account_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DetectBankStatement; }): Promise<{ status: 200; body: DetectedBankStatementMapping; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-accounts/{account_id}/statements/detect",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DetectBankStatement"},
        {"200":{"schema":{"kind":"ref","name":"DetectedBankStatementMapping"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DetectedBankStatementMapping; }>,

    disburseH2hIso20022Payment: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DisburseH2hIso20022PaymentRequest; }): Promise<{ status: 200; body: DisburseH2hIso20022PaymentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/banking/h2h/disburse",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DisburseH2hIso20022PaymentRequest"},
        {"200":{"schema":{"kind":"ref","name":"DisburseH2hIso20022PaymentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DisburseH2hIso20022PaymentView; }>,

    disburseSalaryPayouts: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DisburseSalaryPayoutsRequest; }): Promise<{ status: 200; body: DisburseSalaryPayoutsView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll/disburse",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DisburseSalaryPayoutsRequest"},
        {"200":{"schema":{"kind":"ref","name":"DisburseSalaryPayoutsView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DisburseSalaryPayoutsView; }>,

    dismissAttention: (options: { path: { book: string; attention_id: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/attentions/{attention_id}/dismiss",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    dispatchSleekSignDocument: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DispatchSleekSignDocumentRequest; }): Promise<{ status: 201; body: SleekSignDocumentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connect-hub/sleek/documents/dispatch",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DispatchSleekSignDocumentRequest"},
        {"201":{"schema":{"kind":"ref","name":"SleekSignDocumentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SleekSignDocumentView; }>,

    disposeAsset: (options: { path: { book: string; asset_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DisposeRequest; }): Promise<{ status: 200; body: FixedAsset; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets/{asset_id}/dispose",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DisposeRequest"},
        {"200":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAsset; }>,

    disposeFixedAsset: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DisposeFixedAssetRequest; }): Promise<{ status: 200; body: FixedAssetDisposalResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/assets/{id}/dispose",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DisposeFixedAssetRequest"},
        {"200":{"schema":{"kind":"ref","name":"FixedAssetDisposalResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAssetDisposalResultView; }>,

    disputeSalesInvoice: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DisputeSalesInvoiceRequest; }): Promise<{ status: 200; body: DisputeSalesInvoiceResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/invoices/{id}/dispute",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DisputeSalesInvoiceRequest"},
        {"200":{"schema":{"kind":"ref","name":"DisputeSalesInvoiceResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DisputeSalesInvoiceResultView; }>,

    distributePartnerProfit: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: DistributePartnerProfitRequest; }): Promise<{ status: 200; body: ProfitDistributionResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/profit-sharing/distribute",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"DistributePartnerProfitRequest"},
        {"200":{"schema":{"kind":"ref","name":"ProfitDistributionResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ProfitDistributionResultView; }>,

    downloadExportArtifact: (options: { path: { book: string; generation_id: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/exports/{generation_id}/download",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    downloadTrialBalancePdf: (options: { path: { book: string; }; query?: { book_id?: string; as_of?: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/trial-balance/pdf",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    downloadTrialBalanceXlsx: (options: { path: { book: string; }; query?: { book_id?: string; as_of?: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/trial-balance/xlsx",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    earnCustomerLoyaltyPoints: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: EarnCustomerLoyaltyPointsRequest; }): Promise<{ status: 200; body: CustomerLoyaltyPointsResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/loyalty/earn",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"EarnCustomerLoyaltyPointsRequest"},
        {"200":{"schema":{"kind":"ref","name":"CustomerLoyaltyPointsResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CustomerLoyaltyPointsResultView; }>,

    enableCompanyLegalHold: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: EnableCompanyLegalHoldRequest; }): Promise<{ status: 200; body: CompanyLegalHoldView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/legal-hold/enable",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"EnableCompanyLegalHoldRequest"},
        {"200":{"schema":{"kind":"ref","name":"CompanyLegalHoldView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyLegalHoldView; }>,

    enrollBetaChannel: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: EnrollBetaChannelRequest; }): Promise<{ status: 200; body: EnrollBetaChannelView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connect-hub/beta-enroll",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"EnrollBetaChannelRequest"},
        {"200":{"schema":{"kind":"ref","name":"EnrollBetaChannelView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EnrollBetaChannelView; }>,

    evaluateDiscountQuote: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: EvaluateDiscountQuoteRequest; }): Promise<{ status: 200; body: EvaluateDiscountQuoteView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/discounts/evaluate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"EvaluateDiscountQuoteRequest"},
        {"200":{"schema":{"kind":"ref","name":"EvaluateDiscountQuoteView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EvaluateDiscountQuoteView; }>,

    executeBilateralTrade: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ExecuteBilateralTradeRequest; }): Promise<{ status: 201; body: EcosystemBilateralTradeView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/ecosystem/bilateral-trade",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ExecuteBilateralTradeRequest"},
        {"201":{"schema":{"kind":"ref","name":"EcosystemBilateralTradeView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: EcosystemBilateralTradeView; }>,

    exportEfakturCsvBatch: (options: { path: { book: string; }; }): Promise<{ status: 200; body: EfakturCsvExportView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/tax/efaktur/export-csv",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"EfakturCsvExportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EfakturCsvExportView; }>,

    exportEfakturFtzSchedule: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ExportEfakturFtzScheduleRequest; }): Promise<{ status: 200; body: EfakturFtzExportView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reports/efaktur-ftz-export",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ExportEfakturFtzScheduleRequest"},
        {"200":{"schema":{"kind":"ref","name":"EfakturFtzExportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EfakturFtzExportView; }>,

    exportFtaAuditFile: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ExportFtaAuditFileRequest; }): Promise<{ status: 200; body: FtaAuditFileExportView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reports/fta-audit-file-export",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ExportFtaAuditFileRequest"},
        {"200":{"schema":{"kind":"ref","name":"FtaAuditFileExportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FtaAuditFileExportView; }>,

    exportFullCompanyBookData: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ExportDataSovereigntyRequest; }): Promise<{ status: 200; body: DataSovereigntyExportView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/data-sovereignty/export",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ExportDataSovereigntyRequest"},
        {"200":{"schema":{"kind":"ref","name":"DataSovereigntyExportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DataSovereigntyExportView; }>,

    exportPrometheusMetrics: (options: {}): Promise<{ status: 200; body: PrometheusMetricsView; }> =>
      this.requestOperation(
        "GET",
        "/metrics",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PrometheusMetricsView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PrometheusMetricsView; }>,

    finalizeBankReconciliation: (options: { path: { book: string; statement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: BankReconciliation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-statements/{statement_id}/reconcile/finalize",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankReconciliation; }>,

    forceUnlockDocument: (options: { path: { book: string; type: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: DocumentUnlockResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/documents/{type}/{id}/force-unlock",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DocumentUnlockResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DocumentUnlockResultView; }>,

    generateBillableHoursInvoice: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: GenerateBillableHoursInvoiceRequest; }): Promise<{ status: 200; body: BillableHoursInvoiceView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/timesheets/generate-invoice",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"GenerateBillableHoursInvoiceRequest"},
        {"200":{"schema":{"kind":"ref","name":"BillableHoursInvoiceView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BillableHoursInvoiceView; }>,

    generateEfakturDocument: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: GenerateEfakturDocumentRequest; }): Promise<{ status: 201; body: EfakturDocumentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/tax/efaktur/generate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"GenerateEfakturDocumentRequest"},
        {"201":{"schema":{"kind":"ref","name":"EfakturDocumentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: EfakturDocumentView; }>,

    generatePosQris: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: QrisGenerateRequest; }): Promise<{ status: 200; body: QrisGenerateResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/qris/generate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"QrisGenerateRequest"},
        {"200":{"schema":{"kind":"ref","name":"QrisGenerateResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: QrisGenerateResponse; }>,

    getAccount: (options: { path: { book: string; account: string; }; }): Promise<{ status: 200; body: Account; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounts/{account}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Account"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Account; }>,

    getAccountImportTemplate: (options: { path: { book: string; }; }): Promise<{ status: 200; body: string; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounts/import/template",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"string"},"contentType":"text/plain"}}
      ) as Promise<{ status: 200; body: string; }>,

    getAccountingPeriod: (options: { path: { book: string; period: string; }; }): Promise<{ status: 200; body: AccountingPeriod; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounting-periods/{period}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriod; }>,

    getAccountingPolicyVersion: (options: { path: { book: string; policy: string; }; }): Promise<{ status: 200; body: PolicyView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/accounting-policies/{policy}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PolicyView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PolicyView; }>,

    getAccountsReceivableAgingReport: (options: { path: { book: string; }; }): Promise<{ status: 200; body: AccountsReceivableAgingReportView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/ar-aging",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AccountsReceivableAgingReportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountsReceivableAgingReportView; }>,

    getAgingReport: (options: { path: { book: string; }; query?: { direction?: string; as_of?: string; }; }): Promise<{ status: 200; body: AgingReport; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/aging",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AgingReport"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AgingReport; }>,

    getAuditorSignatureStatus: (options: { path: { book: string; period: string; }; query?: { scope?: string; fiscal_year?: number; fiscal_period?: number; }; }): Promise<{ status: 200; body: AuditorSignatureStatusView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounting-periods/{period}/auditor-signature",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuditorSignatureStatusView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuditorSignatureStatusView; }>,

    getBalanceSheet: (options: { path: { book: string; }; query?: { as_of?: string; }; }): Promise<{ status: 200; body: BalanceSheet; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/balance-sheet",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BalanceSheet"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BalanceSheet; }>,

    getBankAccount: (options: { path: { book: string; account_id: string; }; }): Promise<{ status: 200; body: BankAccount; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-accounts/{account_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankAccount"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankAccount; }>,

    getBankReconciliation: (options: { path: { book: string; statement_id: string; }; }): Promise<{ status: 200; body: BankReconciliation; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-statements/{statement_id}/reconciliation",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankReconciliation; }>,

    getBankStatement: (options: { path: { book: string; statement_id: string; }; }): Promise<{ status: 200; body: BankStatement; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-statements/{statement_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankStatement"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankStatement; }>,

    getBatamFtzVatSummary: (options: { path: { book: string; }; query?: { tax_period?: string; }; }): Promise<{ status: 200; body: BatamFtzVatSummaryView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/batam-ftz-vat-summary",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BatamFtzVatSummaryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BatamFtzVatSummaryView; }>,

    getBillingOverview: (options: {}): Promise<{ status: 200; body: BillingOverviewResponse; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/billing/overview",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BillingOverviewResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BillingOverviewResponse; }>,

    getCalendarEvents: (options: { path: { book: string; }; query?: { from?: string; to?: string; category?: string; status?: string; }; }): Promise<{ status: 200; body: CalendarEventView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/calendar/events",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"CalendarEventView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CalendarEventView[]; }>,

    getCalendarFeedIcs: (options: { path: { book: string; }; }): Promise<{ status: 200; body: string; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/calendar/feed.ics",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"string"},"contentType":"text/calendar"}}
      ) as Promise<{ status: 200; body: string; }>,

    getCalendarSummary: (options: { path: { book: string; }; }): Promise<{ status: 200; body: CalendarEventsSummaryView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/calendar/summary",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CalendarEventsSummaryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CalendarEventsSummaryView; }>,

    getCalkNotesToFinancialStatements: (options: { path: { book: string; }; query?: { period_start_date?: string; period_end_date?: string; }; }): Promise<{ status: 200; body: AuditedCalkNotesView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/calk-notes",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuditedCalkNotesView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuditedCalkNotesView; }>,

    getCashFlowStatement: (options: { path: { book: string; }; query?: { from_date?: string; to_date?: string; }; }): Promise<{ status: 200; body: CashFlowStatement; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/cash-flow",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CashFlowStatement"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CashFlowStatement; }>,

    getChangesInEquity: (options: { path: { book: string; }; query?: { from_date?: string; to_date?: string; }; }): Promise<{ status: 200; body: StatementOfChangesInEquity; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/changes-in-equity",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"StatementOfChangesInEquity"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: StatementOfChangesInEquity; }>,

    getCloseReadinessStatus: (options: { path: { book: string; }; query?: { fiscal_year?: number; fiscal_period?: number; }; }): Promise<{ status: 200; body: CloseReadinessStatusView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounting-periods/close-readiness",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CloseReadinessStatusView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CloseReadinessStatusView; }>,

    getCompanyBillingProfile: (options: { path: { book: string; }; }): Promise<{ status: 200; body: CompanyBillingProfileView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/billing/profile",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CompanyBillingProfileView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyBillingProfileView; }>,

    getCompanyBookAuthorityContext: (options: { path: { book: string; authority_context: string; }; }): Promise<{ status: 200; body: AuthorityContextSummary; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/authority-contexts/{authority_context}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuthorityContextSummary"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuthorityContextSummary; }>,

    getCompanyBookRole: (options: { path: { book: string; role: string; }; }): Promise<{ status: 200; body: RoleView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/roles/{role}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleView; }>,

    getCompanyUsageMetering: (options: { path: { book: string; }; }): Promise<{ status: 200; body: SaaSUsageMeteringView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/usage-metering",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SaaSUsageMeteringView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SaaSUsageMeteringView; }>,

    getConsolidatedBalanceSheet: (options: { path: { book: string; }; query?: { period_year?: number; period_month?: number; }; }): Promise<{ status: 200; body: ConsolidatedBalanceSheetView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/consolidation/balance-sheet",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ConsolidatedBalanceSheetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConsolidatedBalanceSheetView; }>,

    getConsolidatedTrialBalance: (options: { path: { book: string; id: string; }; }): Promise<{ status: 200; body: ConsolidatedTrialBalanceView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/consolidation-perimeters/{id}/trial-balance",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ConsolidatedTrialBalanceView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConsolidatedTrialBalanceView; }>,

    getContact: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: Contact; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Contact"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Contact; }>,

    getCustomerQuote: (options: { path: { book: string; quote_id: string; }; }): Promise<{ status: 200; body: CustomerQuote; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/customer-quotes/{quote_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CustomerQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CustomerQuote; }>,

    getDelivery: (options: { path: { book: string; delivery_id: string; }; }): Promise<{ status: 200; body: Delivery; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/deliveries/{delivery_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Delivery"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Delivery; }>,

    getDeviceSyncStatus: (options: { path: { book: string; device_signature: string; }; }): Promise<{ status: 200; body: DeviceSyncStatusView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/sync-status/{device_signature}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DeviceSyncStatusView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DeviceSyncStatusView; }>,

    getDocumentPresence: (options: { path: { book: string; type: string; id: string; }; }): Promise<{ status: 200; body: DocumentPresenceView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/documents/{type}/{id}/presence",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DocumentPresenceView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DocumentPresenceView; }>,

    getEarlyAccessAdmission: (options: { path: { book: string; admission: string; }; }): Promise<{ status: 200; body: AdmissionView; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/company-books/{book}/early-access-admissions/{admission}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AdmissionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AdmissionView; }>,

    getEnterpriseDivisionAuditMatrix: (options: { path: { book: string; }; query?: { fiscal_year?: number; fiscal_period?: number; }; }): Promise<{ status: 200; body: EnterpriseDivisionAuditMatrixView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/auditor-working-papers/division-matrix",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"EnterpriseDivisionAuditMatrixView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EnterpriseDivisionAuditMatrixView; }>,

    getExpenseClaim: (options: { path: { book: string; claim_id: string; }; }): Promise<{ status: 200; body: ExpenseClaim; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/expense-claims/{claim_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ExpenseClaim"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ExpenseClaim; }>,

    getExportJob: (options: { path: { book: string; generation_id: string; }; }): Promise<{ status: 200; body: ExportJobResponse; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/exports/{generation_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ExportJobResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ExportJobResponse; }>,

    getFinancialInsightsSummary: (options: { path: { book: string; }; }): Promise<{ status: 200; body: FinancialInsightsSummary; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/insights/summary",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"FinancialInsightsSummary"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FinancialInsightsSummary; }>,

    getFixedAsset: (options: { path: { book: string; asset_id: string; }; }): Promise<{ status: 200; body: FixedAsset; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/fixed-assets/{asset_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAsset; }>,

    getFtaVat201Report: (options: { path: { book: string; }; query?: { tax_period_start?: string; tax_period_end?: string; }; }): Promise<{ status: 200; body: FtaVat201ReportView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/fta-vat-201",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"FtaVat201ReportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FtaVat201ReportView; }>,

    getGeneralLedger: (options: { path: { book: string; }; query?: { book_id?: string; account_id?: string; financial_start?: string; financial_end?: string; limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: BoundedFinancialLineList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/general-ledger",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BoundedFinancialLineList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BoundedFinancialLineList; }>,

    getGeneratedArtifact: (options: { path: { book: string; artifact_id: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/artifacts/{artifact_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    getHealth: (options: {}): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/health",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    getHubApp: (options: { path: { slug: string; }; }): Promise<{ status: 200; body: HubAppView; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/apps/{slug}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"HubAppView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubAppView; }>,

    getHubConnector: (options: { path: { slug: string; }; }): Promise<{ status: 200; body: HubConnectorView; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/connectors/{slug}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"HubConnectorView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubConnectorView; }>,

    getHubPartner: (options: { path: { id: string; }; }): Promise<{ status: 200; body: HubPartnerView; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/partners/{id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"HubPartnerView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubPartnerView; }>,

    getImportDeclaration: (options: { path: { book: string; declaration_id: string; }; }): Promise<{ status: 200; body: ImportDeclaration; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/import-declarations/{declaration_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ImportDeclaration"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ImportDeclaration; }>,

    getIncomeStatement: (options: { path: { book: string; }; query?: { from_date?: string; to_date?: string; }; }): Promise<{ status: 200; body: IncomeStatement; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/income-statement",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"IncomeStatement"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: IncomeStatement; }>,

    getInvoicePaymentLink: (options: { path: { book: string; id: string; }; }): Promise<{ status: 200; body: InvoicePaymentLinkView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/sales/invoices/{id}/payment-link",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"InvoicePaymentLinkView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InvoicePaymentLinkView; }>,

    getItem: (options: { path: { book: string; item_id: string; }; }): Promise<{ status: 200; body: Item; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/items/{item_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Item"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Item; }>,

    getJournal: (options: { path: { book: string; }; query?: { book_id?: string; limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: BoundedFinancialLineList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/journal",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BoundedFinancialLineList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BoundedFinancialLineList; }>,

    getLandedCostApportionment: (options: { path: { book: string; apportionment_id: string; }; }): Promise<{ status: 200; body: LandedCostApportionment; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/landed-cost-apportionments/{apportionment_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"LandedCostApportionment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LandedCostApportionment; }>,

    getLandedCostPolicy: (options: { path: { book: string; }; }): Promise<{ status: 200; body: LandedCostPolicy; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/landed-cost-policy",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"LandedCostPolicy"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LandedCostPolicy; }>,

    getLiveness: (options: {}): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/livez",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    getManualJournal: (options: { path: { book: string; journal: string; }; }): Promise<{ status: 200; body: ManualJournal; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/manual-journals/{journal}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ManualJournal; }>,

    getMemberOffboardingInventory: (options: { path: { book: string; principal: string; }; }): Promise<{ status: 200; body: OffboardingInventoryView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/memberships/{principal}/offboarding-inventory",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OffboardingInventoryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OffboardingInventoryView; }>,

    getNotificationDelivery: (options: { path: { book: string; id: string; }; }): Promise<{ status: 200; body: NotificationDelivery; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/notification-deliveries/{id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"NotificationDelivery"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: NotificationDelivery; }>,

    getOnboardingDraft: (options: { path: { admitted_relationship_id: string; }; }): Promise<{ status: 200; body: OnboardingDraftView; }> =>
      this.requestOperation(
        "GET",
        "/v1/product-experience/onboarding/drafts/{admitted_relationship_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OnboardingDraftView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OnboardingDraftView; }>,

    getPayment: (options: { path: { book: string; payment_id: string; }; }): Promise<{ status: 200; body: Payment; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/payments/{payment_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Payment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Payment; }>,

    getPayrollRun: (options: { path: { book: string; run_id: string; }; }): Promise<{ status: 200; body: PayrollRun; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/payroll-runs/{run_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PayrollRun"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollRun; }>,

    getPlatformAdminOverview: (options: {}): Promise<{ status: 200; body: PlatformAdminOverviewView; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/overview",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PlatformAdminOverviewView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PlatformAdminOverviewView; }>,

    getPlatformSystemHealth: (options: {}): Promise<{ status: 200; body: PlatformSystemHealthView; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/system/health",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PlatformSystemHealthView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PlatformSystemHealthView; }>,

    getPocProjectBudget: (options: { path: { book: string; project_id: string; }; }): Promise<{ status: 200; body: PocProjectBudgetView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/poc-projects/{project_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PocProjectBudgetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PocProjectBudgetView; }>,

    getPocProjectSCurveSeries: (options: { path: { book: string; project_id: string; }; }): Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/poc-projects/{project_id}/s-curve-series",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ProjectSCurveSeriesResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }>,

    getPosOrder: (options: { path: { book: string; order: string; }; }): Promise<{ status: 200; body: PosOrderView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/pos/orders/{order}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PosOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PosOrderView; }>,

    getPosting: (options: { path: { book: string; posting: string; }; }): Promise<{ status: 200; body: Posting; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/postings/{posting}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Posting"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Posting; }>,

    getPurchaseDocument: (options: { path: { book: string; document_id: string; }; }): Promise<{ status: 200; body: PurchaseDocument; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/purchase-documents/{document_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseDocument; }>,

    getPurchaseOrder: (options: { path: { book: string; po_id: string; }; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/purchase-orders/{po_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    getReadiness: (options: {}): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/readyz",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    getReparentingHistory: (options: { path: { book: string; }; }): Promise<{ status: 200; body: EntityHierarchyReparentingView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/hierarchy/history",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"EntityHierarchyReparentingView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: EntityHierarchyReparentingView[]; }>,

    getReversalRequest: (options: { path: { book: string; reversal: string; }; }): Promise<{ status: 200; body: ReversalRequest; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reversal-requests/{reversal}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ReversalRequest"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ReversalRequest; }>,

    getSalesDocument: (options: { path: { book: string; document_id: string; }; }): Promise<{ status: 200; body: SalesDocument; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/sales-documents/{document_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SalesDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesDocument; }>,

    getSalesLeaderboard: (options: { path: { book: string; }; }): Promise<{ status: 200; body: SalesLeaderboardView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/sales-leaderboard",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SalesLeaderboardView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesLeaderboardView; }>,

    getSelfContact: (options: { path: { book: string; }; }): Promise<{ status: 200; body: Contact; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/self-contact",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Contact"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Contact; }>,

    getServiceBilling: (options: { path: { book: string; billing_id: string; }; }): Promise<{ status: 200; body: ServiceBilling; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/service-billings/{billing_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ServiceBilling"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceBilling; }>,

    getServiceContractAssessment: (options: { path: { book: string; assessment_id: string; }; }): Promise<{ status: 200; body: ServiceContractAssessment; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/service-contract-assessments/{assessment_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ServiceContractAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceContractAssessment; }>,

    getServiceFakturMonetaryAssessment: (options: { path: { book: string; assessment_id: string; }; }): Promise<{ status: 200; body: ServiceFakturMonetaryAssessment; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/service-faktur-monetary-assessments/{assessment_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ServiceFakturMonetaryAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceFakturMonetaryAssessment; }>,

    getServiceRecognitionReadinessAssessment: (options: { path: { book: string; readiness_id: string; }; }): Promise<{ status: 200; body: ServiceRecognitionReadinessAssessment; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/service-recognition-readiness-assessments/{readiness_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ServiceRecognitionReadinessAssessment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceRecognitionReadinessAssessment; }>,

    getSetupReadiness: (options: { path: { book: string; }; }): Promise<{ status: 200; body: CapabilityReadiness[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/setup-readiness",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"CapabilityReadiness"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CapabilityReadiness[]; }>,

    getStatementOfCashFlows: (options: { path: { book: string; }; query?: { method?: string; period_start_date?: string; period_end_date?: string; }; }): Promise<{ status: 200; body: AuditedCashFlowStatementView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/cash-flow",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuditedCashFlowStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuditedCashFlowStatementView; }>,

    getStatementOfChangesInEquity: (options: { path: { book: string; }; query?: { period_start_date?: string; period_end_date?: string; }; }): Promise<{ status: 200; body: AuditedChangesInEquityView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/equity-changes",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuditedChangesInEquityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuditedChangesInEquityView; }>,

    getStockPosition: (options: { path: { book: string; item_id: string; }; }): Promise<{ status: 200; body: StockPosition; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/items/{item_id}/stock",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"StockPosition"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: StockPosition; }>,

    getSubledgerStatement: (options: { path: { book: string; entity_id: string; }; query?: { account_role?: string; }; }): Promise<{ status: 200; body: SubledgerStatementView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/subledgers/{entity_id}/statement",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SubledgerStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SubledgerStatementView; }>,

    getSupplierQuote: (options: { path: { book: string; quote_id: string; }; }): Promise<{ status: 200; body: SupplierQuote; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuote; }>,

    getSupplierQuoteConsumption: (options: { path: { book: string; quote_id: string; }; }): Promise<{ status: 200; body: QuoteConsumptionView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/consumption",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"QuoteConsumptionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: QuoteConsumptionView; }>,

    getSupplierQuoteConversion: (options: { path: { book: string; conversion_id: string; }; }): Promise<{ status: 200; body: ConversionOutcome; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/quote-conversions/{conversion_id}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ConversionOutcome"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConversionOutcome; }>,

    getTrialBalance: (options: { path: { book: string; }; query?: { book_id?: string; as_of?: string; limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: TrialBalanceRenderProjection; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/trial-balance",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"TrialBalanceRenderProjection"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: TrialBalanceRenderProjection; }>,

    getTrialBalanceComparison: (options: { path: { book: string; }; query: { left_book_id?: string; right_book_id: string; as_of?: string; limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: BoundedTrialBalanceComparison; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/trial-balance-comparison",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BoundedTrialBalanceComparison"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BoundedTrialBalanceComparison; }>,

    getUsGaapBalanceSheet: (options: { path: { book: string; }; query?: { as_of?: string; }; }): Promise<{ status: 200; body: UsGaapBalanceSheetView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/us-gaap-balance-sheet",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"UsGaapBalanceSheetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UsGaapBalanceSheetView; }>,

    getUsGaapIncomeStatement: (options: { path: { book: string; }; query?: { from_date?: string; to_date?: string; }; }): Promise<{ status: 200; body: UsGaapIncomeStatementView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reports/us-gaap-income-statement",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"UsGaapIncomeStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UsGaapIncomeStatementView; }>,

    getUserDraft: (options: { path: { book: string; draft_type: string; }; }): Promise<{ status: 200; body: UserDraftView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/drafts/{draft_type}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"UserDraftView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UserDraftView; }>,

    handleSleekWebhook: (options: { headers: { "Idempotency-Key": string; }; body: SleekWebhookPayload; }): Promise<{ status: 200; body: SleekWebhookAckView; }> =>
      this.requestOperation(
        "POST",
        "/v1/webhooks/sleek",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SleekWebhookPayload"},
        {"200":{"schema":{"kind":"ref","name":"SleekWebhookAckView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SleekWebhookAckView; }>,

    holdDocumentForGuest: (options: { path: { book: string; guest_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ShareDocument; }): Promise<{ status: 201; body: GuestCounterparty; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/guest-counterparties/{guest_id}/share",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ShareDocument"},
        {"201":{"schema":{"kind":"ref","name":"GuestCounterparty"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: GuestCounterparty; }>,

    impairAsset: (options: { path: { book: string; asset_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ImpairAsset; }): Promise<{ status: 200; body: FixedAsset; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets/{asset_id}/impair",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ImpairAsset"},
        {"200":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAsset; }>,

    importAccounts: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ImportCoaRequest; }): Promise<{ status: 200; body: ImportCoaResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounts/import",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ImportCoaRequest"},
        {"200":{"schema":{"kind":"ref","name":"ImportCoaResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ImportCoaResponse; }>,

    importBankStatement: (options: { path: { book: string; account_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ImportBankStatement; }): Promise<{ status: 201; body: BankStatement; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-accounts/{account_id}/statements/import",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ImportBankStatement"},
        {"201":{"schema":{"kind":"ref","name":"BankStatement"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: BankStatement; }>,

    importXeroHistoricalData: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ImportXeroHistoricalDataRequest; }): Promise<{ status: 200; body: XeroHistoricalDataImportView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/imports/xero",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ImportXeroHistoricalDataRequest"},
        {"200":{"schema":{"kind":"ref","name":"XeroHistoricalDataImportView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: XeroHistoricalDataImportView; }>,

    ingestBankStatementFeed: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IngestBankStatementFeedRequest; }): Promise<{ status: 200; body: BankStatementFeedIngestView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-feeds/ingest",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IngestBankStatementFeedRequest"},
        {"200":{"schema":{"kind":"ref","name":"BankStatementFeedIngestView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankStatementFeedIngestView; }>,

    ingestH2hCamt053Statement: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IngestH2hCamt053StatementRequest; }): Promise<{ status: 200; body: IngestH2hCamt053StatementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/banking/h2h/statements/ingest",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IngestH2hCamt053StatementRequest"},
        {"200":{"schema":{"kind":"ref","name":"IngestH2hCamt053StatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: IngestH2hCamt053StatementView; }>,

    ingestPgSettlementBatch: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IngestPgSettlementBatchRequest; }): Promise<{ status: 201; body: PgSettlementBatchIngestView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/settlements/ingest",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IngestPgSettlementBatchRequest"},
        {"201":{"schema":{"kind":"ref","name":"PgSettlementBatchIngestView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PgSettlementBatchIngestView; }>,

    ingestPhysicalEvent: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IngestPhysicalEventRequest; }): Promise<{ status: 201; body: PhysicalEventStreamView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/iot/events",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IngestPhysicalEventRequest"},
        {"201":{"schema":{"kind":"ref","name":"PhysicalEventStreamView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PhysicalEventStreamView; }>,

    installHubConnector: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: InstallConnectorRequest; }): Promise<{ status: 201; body: CompanyInstalledConnectorView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connect-hub/install",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"InstallConnectorRequest"},
        {"201":{"schema":{"kind":"ref","name":"CompanyInstalledConnectorView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CompanyInstalledConnectorView; }>,

    issueDeveloperKey: (options: { headers: { "Idempotency-Key": string; }; body: IssueDeveloperKeyRequest; }): Promise<{ status: 201; body: IssueDeveloperKeyResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/developer-keys",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IssueDeveloperKeyRequest"},
        {"201":{"schema":{"kind":"ref","name":"IssueDeveloperKeyResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: IssueDeveloperKeyResponse; }>,

    issueNonFiatUnits: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IssueNonFiatUnitsRequest; }): Promise<{ status: 200; body: SubledgerStatementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/non-fiat-units/issue",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IssueNonFiatUnitsRequest"},
        {"200":{"schema":{"kind":"ref","name":"SubledgerStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SubledgerStatementView; }>,

    issuePurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/issue",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    issueWorkOrderParts: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: IssueWorkOrderPartsRequest; }): Promise<{ status: 200; body: WorkOrderPartsIssuedView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/work-orders/{id}/issue-parts",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"IssueWorkOrderPartsRequest"},
        {"200":{"schema":{"kind":"ref","name":"WorkOrderPartsIssuedView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WorkOrderPartsIssuedView; }>,

    linkSubsidiaryCompanyBook: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: LinkSubsidiaryCompanyBookRequest; }): Promise<{ status: 201; body: CompanyGroupHierarchyView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/consolidation/hierarchies",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"LinkSubsidiaryCompanyBookRequest"},
        {"201":{"schema":{"kind":"ref","name":"CompanyGroupHierarchyView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CompanyGroupHierarchyView; }>,

    listAccountingPeriods: (options: { path: { book: string; }; }): Promise<{ status: 200; body: AccountingPeriodList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounting-periods",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriodList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriodList; }>,

    listAccountingPolicyVersions: (options: { path: { book: string; }; query?: { policy_key?: string; effective_on?: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/accounting-policies",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listAccounts: (options: { path: { book: string; }; query?: { limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: BoundedAccountList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/accounts",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BoundedAccountList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BoundedAccountList; }>,

    listApprovalPolicies: (options: { path: { book: string; }; }): Promise<{ status: 200; body: ApprovalPolicySetting[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/approval-policies",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"ApprovalPolicySetting"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ApprovalPolicySetting[]; }>,

    listAttentions: (options: { path: { book: string; }; query?: { state?: string; source?: string; severity?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: AttentionList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/attentions",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AttentionList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AttentionList; }>,

    listAuditEngagements: (options: { path: { book: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/audit-engagements",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listAuditFindings: (options: { path: { book: string; engagement_id: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/audit-engagements/{engagement_id}/findings",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listAuditProposals: (options: { path: { book: string; finding_id: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/audit-findings/{finding_id}/proposals",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listBankAccounts: (options: { path: { book: string; }; query?: { account_type?: string; status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: BankAccountList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-accounts",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankAccountList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankAccountList; }>,

    listBankStatementProfiles: (options: { path: { book: string; }; }): Promise<{ status: 200; body: BankStatementProfileList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-statement-profiles",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankStatementProfileList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankStatementProfileList; }>,

    listBankStatements: (options: { path: { book: string; account_id: string; }; query?: { reconciliation_status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: BankStatementList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/bank-accounts/{account_id}/statements",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankStatementList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankStatementList; }>,

    listCompanyBookAccountingBooks: (options: { path: { book: string; }; }): Promise<{ status: 200; body: BookListView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/books",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BookListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BookListView; }>,

    listCompanyBookAuthorityContexts: (options: { path: { book: string; }; }): Promise<{ status: 200; body: AuthorityContextList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/authority-contexts",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"AuthorityContextList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuthorityContextList; }>,

    listCompanyBookMemberships: (options: { path: { book: string; }; }): Promise<{ status: 200; body: MembershipList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/memberships",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"MembershipList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: MembershipList; }>,

    listCompanyBookOwners: (options: { path: { book: string; }; }): Promise<{ status: 200; body: OwnerCapacityList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/owners",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OwnerCapacityList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OwnerCapacityList; }>,

    listCompanyBookRoleAssignments: (options: { path: { book: string; }; }): Promise<{ status: 200; body: RoleAssignmentList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/role-assignments",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleAssignmentList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleAssignmentList; }>,

    listCompanyBookRoles: (options: { path: { book: string; }; }): Promise<{ status: 200; body: RoleList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/roles",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleList; }>,

    listCompanyBooks: (options: { query?: { limit?: number; cursor?: string; }; }): Promise<{ status: 200; body: CompanyBookList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"CompanyBookList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyBookList; }>,

    listCompanyCapabilitySettingVersions: (options: { path: { book: string; }; query?: { effective_on?: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/capabilities",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listCompanyDimensionRequirementVersions: (options: { path: { book: string; }; query?: { effective_on?: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/settings/dimension-requirements",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: undefined; }>,

    listCompanyTemplateSelections: (options: { path: { book: string; }; query?: { document_kind?: string; }; }): Promise<{ status: 200; body: TemplateSelectionView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/templates/selections",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"TemplateSelectionView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: TemplateSelectionView[]; }>,

    listConnections: (options: { path: { book: string; }; }): Promise<{ status: 200; body: Connection[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/connections",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"Connection"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Connection[]; }>,

    listContactAddresss: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: ContactAddress[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/addresses",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"ContactAddress"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactAddress[]; }>,

    listContactBankAccounts: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: ContactBankAccount[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/bank-accounts",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"ContactBankAccount"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactBankAccount[]; }>,

    listContactRelationships: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: ContactRelationship[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/relationships",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"ContactRelationship"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactRelationship[]; }>,

    listContactRoles: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: ContactRole[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/roles",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"ContactRole"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactRole[]; }>,

    listContacts: (options: { path: { book: string; }; query?: { role?: string; q?: string; include_inactive?: boolean; limit?: Int64String; }; }): Promise<{ status: 200; body: ContactList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ContactList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactList; }>,

    listDeliveries: (options: { path: { book: string; }; query?: { sales_document_id?: string; status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: DeliveryList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/deliveries",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DeliveryList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DeliveryList; }>,

    listDeveloperKeys: (options: {}): Promise<{ status: 200; body: DeveloperKeyItem[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/developer-keys",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"DeveloperKeyItem"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DeveloperKeyItem[]; }>,

    listDimensionDefinitions: (options: { path: { book: string; }; query?: { applies_to?: string; include_inactive?: boolean; }; }): Promise<{ status: 200; body: DimensionDefinitionList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/dimensions",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DimensionDefinitionList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DimensionDefinitionList; }>,

    listDimensionValues: (options: { path: { book: string; definition_id: string; }; query?: { definition_id?: string; include_inactive?: boolean; }; }): Promise<{ status: 200; body: DimensionValueList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/dimensions/{definition_id}/values",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DimensionValueList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DimensionValueList; }>,

    listDiscountRules: (options: { path: { book: string; }; query?: { discount_category?: string; }; }): Promise<{ status: 200; body: DiscountRuleView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/discounts/rules",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"DiscountRuleView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DiscountRuleView[]; }>,

    listEarlyAccessAdmissions: (options: { path: { book: string; }; }): Promise<{ status: 200; body: AdmissionView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/company-books/{book}/early-access-admissions",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"AdmissionView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AdmissionView[]; }>,

    listEngagements: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: PersonInCharge[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/engagements",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"PersonInCharge"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PersonInCharge[]; }>,

    listExpenseClaims: (options: { path: { book: string; }; query?: { status?: string; claimant_contact_id?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: ExpenseClaimList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/expense-claims",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ExpenseClaimList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ExpenseClaimList; }>,

    listFixedAssets: (options: { path: { book: string; }; query?: { status?: string; category?: string; custodian_contact_id?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: FixedAssetList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/fixed-assets",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"FixedAssetList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAssetList; }>,

    listHubApps: (options: { query?: { category?: string; search?: string; }; }): Promise<{ status: 200; body: HubAppView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/apps",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"HubAppView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubAppView[]; }>,

    listHubConnectors: (options: { query?: { category?: string; search?: string; official_only?: boolean; }; }): Promise<{ status: 200; body: HubConnectorView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/connectors",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"HubConnectorView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubConnectorView[]; }>,

    listHubPartners: (options: { query?: { partner_type?: string; jurisdiction?: string; }; }): Promise<{ status: 200; body: HubPartnerView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/connect-hub/partners",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"HubPartnerView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: HubPartnerView[]; }>,

    listImportDeclarations: (options: { path: { book: string; }; query?: { status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: ImportDeclarationList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/import-declarations",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ImportDeclarationList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ImportDeclarationList; }>,

    listInstalledConnectors: (options: { path: { book: string; }; }): Promise<{ status: 200; body: CompanyInstalledConnectorView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/connect-hub/installed",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"CompanyInstalledConnectorView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CompanyInstalledConnectorView[]; }>,

    listInventoryLocations: (options: { path: { book: string; }; }): Promise<{ status: 200; body: InventoryLocation[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/inventory-locations",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"InventoryLocation"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InventoryLocation[]; }>,

    listInventoryMovements: (options: { path: { book: string; item_id: string; }; query?: { limit?: Int64String; }; }): Promise<{ status: 200; body: InventoryMovement[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/items/{item_id}/movements",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"InventoryMovement"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InventoryMovement[]; }>,

    listItems: (options: { path: { book: string; }; query?: { kind?: string; q?: string; include_inactive?: boolean; limit?: Int64String; }; }): Promise<{ status: 200; body: ItemList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/items",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ItemList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ItemList; }>,

    listKeyResourceMetrics: (options: {}): Promise<{ status: 200; body: DeveloperKeyMetricsItem[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/developer-keys/metrics",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"DeveloperKeyMetricsItem"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DeveloperKeyMetricsItem[]; }>,

    listLandedCostApportionments: (options: { path: { book: string; }; query?: { status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: LandedCostApportionmentList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/landed-cost-apportionments",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"LandedCostApportionmentList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LandedCostApportionmentList; }>,

    listLeads: (options: { path: { book: string; }; query?: { stage?: string; contact_id?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: LeadList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/leads",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"LeadList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LeadList; }>,

    listMerchantBilling: (options: {}): Promise<{ status: 200; body: MerchantBillingItem[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/billing/merchants",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"MerchantBillingItem"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: MerchantBillingItem[]; }>,

    listOpenItems: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: OpenItem[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/open-items",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"OpenItem"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OpenItem[]; }>,

    listPartnerManagedClients: (options: { query?: { partner_id?: string; status?: string; }; }): Promise<{ status: 200; body: PartnerManagedClientListView; }> =>
      this.requestOperation(
        "GET",
        "/v1/partner/clients",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PartnerManagedClientListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PartnerManagedClientListView; }>,

    listPayments: (options: { path: { book: string; }; query?: { direction?: string; contact_id?: string; status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: PaymentList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/payments",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PaymentList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PaymentList; }>,

    listPayrollRuns: (options: { path: { book: string; }; query?: { status?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: PayrollRunList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/payroll-runs",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PayrollRunList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollRunList; }>,

    listPendingCurationSubmissions: (options: {}): Promise<{ status: 200; body: PendingCurationListView; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/curations/pending",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PendingCurationListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PendingCurationListView; }>,

    listPeopleInCharge: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: PersonInCharge[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/people-in-charge",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"PersonInCharge"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PersonInCharge[]; }>,

    listPlatformTenants: (options: {}): Promise<{ status: 200; body: PlatformTenantListView; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/tenants",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PlatformTenantListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PlatformTenantListView; }>,

    listPurchaseDocuments: (options: { path: { book: string; }; query?: { document_type?: string; status?: string; contact_id?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: PurchaseDocumentList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/purchase-documents",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseDocumentList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseDocumentList; }>,

    listRestructuringEvents: (options: { path: { book: string; }; }): Promise<{ status: 200; body: CorporateRestructuringEventView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/corporate-restructuring/events",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"CorporateRestructuringEventView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CorporateRestructuringEventView[]; }>,

    listRevaluationRuns: (options: { path: { book: string; }; query?: { limit?: Int64String; }; }): Promise<{ status: 200; body: RevaluationRun[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/revaluation-runs",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"RevaluationRun"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RevaluationRun[]; }>,

    listSalesDocuments: (options: { path: { book: string; }; query?: { document_type?: string; status?: string; contact_id?: string; q?: string; include_inactive?: boolean; limit?: Int64String; }; }): Promise<{ status: 200; body: SalesDocumentList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/sales-documents",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SalesDocumentList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesDocumentList; }>,

    listSupplierQuotePurchaseOrders: (options: { path: { book: string; quote_id: string; }; }): Promise<{ status: 200; body: SourcedPurchaseOrderListView; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/purchase-orders",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SourcedPurchaseOrderListView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SourcedPurchaseOrderListView; }>,

    listSupplierQuotes: (options: { path: { book: string; }; query?: { status?: string; contact_id?: string; limit?: Int64String; }; }): Promise<{ status: 200; body: SupplierQuoteList; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/supplier-quotes",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SupplierQuoteList"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuoteList; }>,

    listTemplateDefinitions: (options: { path: { book: string; }; query?: { category?: string; source_capability?: string; }; }): Promise<{ status: 200; body: TemplateDefinitionView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/templates/definitions",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"TemplateDefinitionView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: TemplateDefinitionView[]; }>,

    listUnifiedIdentities: (options: {}): Promise<{ status: 200; body: UnifiedIdentityItem[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/identities/unified",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"UnifiedIdentityItem"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UnifiedIdentityItem[]; }>,

    listWealthPortfolios: (options: { path: { book: string; }; query?: { family_group_id?: string; asset_class?: string; }; }): Promise<{ status: 200; body: WealthPortfolioView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/wealth-portfolios",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"WealthPortfolioView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WealthPortfolioView[]; }>,

    listWebhookDeliveries: (options: { path: { book: string; }; }): Promise<{ status: 200; body: WebhookDeliveryView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/webhooks/deliveries",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"WebhookDeliveryView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WebhookDeliveryView[]; }>,

    listWebhookSubscriptions: (options: { path: { book: string; }; }): Promise<{ status: 200; body: WebhookSubscriptionView[]; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/webhooks/subscriptions",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"array","items":{"kind":"ref","name":"WebhookSubscriptionView"}},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WebhookSubscriptionView[]; }>,

    list_admin_tickets: (options: {}): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/admin/tickets",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    list_tickets: (options: { path: { book: string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/tickets",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    logTimesheetEntry: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: LogTimesheetEntryRequest; }): Promise<{ status: 201; body: TimesheetEntryView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/timesheets",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"LogTimesheetEntryRequest"},
        {"201":{"schema":{"kind":"ref","name":"TimesheetEntryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TimesheetEntryView; }>,

    lookupPosBarcode: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: BarcodeLookupRequest; }): Promise<{ status: 200; body: BarcodeLookupResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/barcodes/lookup",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"BarcodeLookupRequest"},
        {"200":{"schema":{"kind":"ref","name":"BarcodeLookupResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BarcodeLookupResponse; }>,

    matchBankStatement: (options: { path: { book: string; statement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: BankMatchRun; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-statements/{statement_id}/match",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankMatchRun"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankMatchRun; }>,

    matchGoodsReceiptBill: (options: { path: { book: string; receipt_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: MatchGoodsReceiptBillRequest; }): Promise<{ status: 201; body: PurchaseDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/goods-receipts/{receipt_id}/match-bill",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"MatchGoodsReceiptBillRequest"},
        {"201":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PurchaseDocument; }>,

    migrateRealCompanyOpeningBalances: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; "X-CBook-Authority-Context": string; }; body: MigrateRealCompanyOpeningBalancesRequest; }): Promise<{ status: 200; body: OpeningBalancesMigrationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/opening-balances",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"MigrateRealCompanyOpeningBalancesRequest"},
        {"200":{"schema":{"kind":"ref","name":"OpeningBalancesMigrationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OpeningBalancesMigrationView; }>,

    migrateTenantInfrastructure: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: MigrateTenantInfrastructureRequest; }): Promise<{ status: 201; body: TenantInfrastructureMigrationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/migrate-tenant-infrastructure",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"MigrateTenantInfrastructureRequest"},
        {"201":{"schema":{"kind":"ref","name":"TenantInfrastructureMigrationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TenantInfrastructureMigrationView; }>,

    onboardSingaporeEntity: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: OnboardSingaporeEntityRequest; }): Promise<{ status: 201; body: SingaporeEntityOnboardingView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/onboarding/singapore-entity",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"OnboardSingaporeEntityRequest"},
        {"201":{"schema":{"kind":"ref","name":"SingaporeEntityOnboardingView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SingaporeEntityOnboardingView; }>,

    openPosCashierSession: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: OpenPosCashierSessionRequest; }): Promise<{ status: 200; body: PosCashierSessionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/sessions/open",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"OpenPosCashierSessionRequest"},
        {"200":{"schema":{"kind":"ref","name":"PosCashierSessionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PosCashierSessionView; }>,

    placeAssetInService: (options: { path: { book: string; asset_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PlaceInService; }): Promise<{ status: 200; body: FixedAsset; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets/{asset_id}/place-in-service",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PlaceInService"},
        {"200":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAsset; }>,

    placeAuctionBid: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PlaceAuctionBidRequest; }): Promise<{ status: 201; body: AuctionBidView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/auctions/{id}/bids",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PlaceAuctionBidRequest"},
        {"201":{"schema":{"kind":"ref","name":"AuctionBidView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AuctionBidView; }>,

    postAuditProposal: (options: { path: { book: string; proposal_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 201; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-proposals/{proposal_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"201":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 201; body: PostingSummary; } | { status: 202; body: undefined; }>,

    postExpenseClaim: (options: { path: { book: string; claim_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/expense-claims/{claim_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }>,

    postImportDeclaration: (options: { path: { book: string; declaration_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/import-declarations/{declaration_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }>,

    postLandedCostApportionment: (options: { path: { book: string; apportionment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/landed-cost-apportionments/{apportionment_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }>,

    postManualJournal: (options: { path: { book: string; journal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/manual-journals/{journal}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }>,

    postPayment: (options: { path: { book: string; payment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: undefined; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/{payment_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; } | { status: 202; body: undefined; }>,

    postPayrollRun: (options: { path: { book: string; run_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll-runs/{run_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }>,

    postPeriodDeltaAdjustment: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PostPeriodDeltaAdjustmentRequest; }): Promise<{ status: 201; body: PeriodDeltaAdjustmentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/adjust-delta",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PostPeriodDeltaAdjustmentRequest"},
        {"201":{"schema":{"kind":"ref","name":"PeriodDeltaAdjustmentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PeriodDeltaAdjustmentView; }>,

    postPosOrder: (options: { path: { book: string; order: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PostPosOrderRequest; }): Promise<{ status: 200; body: PostPosOrderResponse; } | { status: 202; body: PostPosOrderAcceptedResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/orders/{order}/post",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PostPosOrderRequest"},
        {"200":{"schema":{"kind":"ref","name":"PostPosOrderResponse"},"contentType":"application/json"},"202":{"schema":{"kind":"ref","name":"PostPosOrderAcceptedResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PostPosOrderResponse; } | { status: 202; body: PostPosOrderAcceptedResponse; }>,

    postPurchaseDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: undefined; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-documents/{document_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; } | { status: 202; body: undefined; }>,

    postReversalRequest: (options: { path: { book: string; reversal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reversal-requests/{reversal}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }>,

    postSalesDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-documents/{document_id}/post",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: undefined; }>,

    predictVariableConsideration: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PredictVariableConsiderationRequest; }): Promise<{ status: 200; body: VariableConsiderationPredictionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales/invoices/predict-variable-consideration",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PredictVariableConsiderationRequest"},
        {"200":{"schema":{"kind":"ref","name":"VariableConsiderationPredictionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: VariableConsiderationPredictionView; }>,

    previewCompanyBookRoleAuthority: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ChangeRoleAuthorityRequest; }): Promise<{ status: 200; body: AuthorityRevisionPreview; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/roles/{role}/authority-preview",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ChangeRoleAuthorityRequest"},
        {"200":{"schema":{"kind":"ref","name":"AuthorityRevisionPreview"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AuthorityRevisionPreview; }>,

    previewCompanyBookRoleDeactivation: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: RoleDeactivationPreview; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/roles/{role}/deactivation-preview",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleDeactivationPreview"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleDeactivationPreview; }>,

    previewOnboarding: (options: { headers: { "Idempotency-Key": string; }; body: OnboardingPreviewRequest; }): Promise<{ status: 200; body: OnboardingPreviewResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/product-experience/onboarding/previews",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"OnboardingPreviewRequest"},
        {"200":{"schema":{"kind":"ref","name":"OnboardingPreviewResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OnboardingPreviewResponse; }>,

    previewStarterCoa: (options: { headers: { "Idempotency-Key": string; }; body: ComposeStarterCoaRequest; }): Promise<{ status: 200; body: StarterCoaPreview; }> =>
      this.requestOperation(
        "POST",
        "/v1/starter-coa/previews",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ComposeStarterCoaRequest"},
        {"200":{"schema":{"kind":"ref","name":"StarterCoaPreview"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: StarterCoaPreview; }>,

    previewSupplierQuoteConversion: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SupplierQuoteConversion; }): Promise<{ status: 200; body: ConversionPreview; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/conversion-preview",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SupplierQuoteConversion"},
        {"200":{"schema":{"kind":"ref","name":"ConversionPreview"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ConversionPreview; }>,

    processPosRetailOrder: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ProcessPosRetailOrderRequest; }): Promise<{ status: 201; body: PosOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/orders",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ProcessPosRetailOrderRequest"},
        {"201":{"schema":{"kind":"ref","name":"PosOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PosOrderView; }>,

    publishDirectoryProfile: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: PublishDirectoryProfile; }): Promise<{ status: 200; body: DirectoryProfile; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/directory-profile",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"PublishDirectoryProfile"},
        {"200":{"schema":{"kind":"ref","name":"DirectoryProfile"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DirectoryProfile; }>,

    qualifyLeadCredit: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: QualifyCredit; }): Promise<{ status: 200; body: Lead; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/leads/{id}/qualify-credit",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"QualifyCredit"},
        {"200":{"schema":{"kind":"ref","name":"Lead"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Lead; }>,

    readContactProfile: (options: { path: { book: string; contact_id: string; }; }): Promise<{ status: 200; body: ContactProfile; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/contacts/{contact_id}/profile",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ContactProfile"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactProfile; }>,

    receivePurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ReceivePurchaseOrderRequest; }): Promise<{ status: 201; body: PurchaseDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/receive",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReceivePurchaseOrderRequest"},
        {"201":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PurchaseDocument; }>,

    reconcileArAp: (options: { path: { book: string; }; query?: { direction?: string; }; }): Promise<{ status: 200; body: ArApReconciliation; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reconciliation/ar-ap",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ArApReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ArApReconciliation; }>,

    reconcileBankStatement: (options: { path: { book: string; statement_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: BankReconciliation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-statements/{statement_id}/reconcile",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"BankReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankReconciliation; }>,

    reconcileCodSettlement: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ReconcileCodSettlementRequest; }): Promise<{ status: 200; body: CodSettlementReconciliationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/shipping/cod-settlement",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReconcileCodSettlementRequest"},
        {"200":{"schema":{"kind":"ref","name":"CodSettlementReconciliationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CodSettlementReconciliationView; }>,

    reconcileCompanyBook: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ReconciliationRequest; }): Promise<{ status: 200; body: Reconciliation; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reconcile",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReconciliationRequest"},
        {"200":{"schema":{"kind":"ref","name":"Reconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Reconciliation; }>,

    reconcileFixedAssets: (options: { path: { book: string; }; }): Promise<{ status: 200; body: FixedAssetReconciliation; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reconciliation/fixed-assets",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"FixedAssetReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAssetReconciliation; }>,

    reconcileInventory: (options: { path: { book: string; }; }): Promise<{ status: 200; body: InventoryReconciliation; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/reconciliation/inventory",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"InventoryReconciliation"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InventoryReconciliation; }>,

    reconcilePgSettlementJournal: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ReconcilePgSettlementJournalRequest; }): Promise<{ status: 200; body: PgSettlementReconciliationResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/settlements/{id}/reconcile",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReconcilePgSettlementJournalRequest"},
        {"200":{"schema":{"kind":"ref","name":"PgSettlementReconciliationResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PgSettlementReconciliationResultView; }>,

    recordAuditFindingDisposition: (options: { path: { book: string; finding_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: FindingDispositionRequest; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-findings/{finding_id}/disposition",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"FindingDispositionRequest"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    recordRestructuringEvent: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RecordRestructuringEventRequest; }): Promise<{ status: 201; body: CorporateRestructuringEventView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/corporate-restructuring/events",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RecordRestructuringEventRequest"},
        {"201":{"schema":{"kind":"ref","name":"CorporateRestructuringEventView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CorporateRestructuringEventView; }>,

    redeemCustomerLoyaltyPoints: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RedeemCustomerLoyaltyPointsRequest; }): Promise<{ status: 200; body: CustomerLoyaltyPointsResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/loyalty/redeem",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RedeemCustomerLoyaltyPointsRequest"},
        {"200":{"schema":{"kind":"ref","name":"CustomerLoyaltyPointsResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CustomerLoyaltyPointsResultView; }>,

    redeemNonFiatUnits: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RedeemNonFiatUnitsRequest; }): Promise<{ status: 200; body: SubledgerStatementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/non-fiat-units/redeem",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RedeemNonFiatUnitsRequest"},
        {"200":{"schema":{"kind":"ref","name":"SubledgerStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SubledgerStatementView; }>,

    registerFixedAsset: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RegisterFixedAssetRequest; }): Promise<{ status: 201; body: CompanyFixedAssetView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/assets",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RegisterFixedAssetRequest"},
        {"201":{"schema":{"kind":"ref","name":"CompanyFixedAssetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CompanyFixedAssetView; }>,

    registerHubDeveloper: (options: { headers: { "Idempotency-Key": string; }; body: RegisterDeveloperRequest; }): Promise<{ status: 201; body: HubDeveloperProfileView; }> =>
      this.requestOperation(
        "POST",
        "/v1/connect-hub/developers/register",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RegisterDeveloperRequest"},
        {"201":{"schema":{"kind":"ref","name":"HubDeveloperProfileView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: HubDeveloperProfileView; }>,

    registerPhysicalDevice: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RegisterPhysicalDeviceRequest; }): Promise<{ status: 201; body: PhysicalDeviceView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/iot/devices",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RegisterPhysicalDeviceRequest"},
        {"201":{"schema":{"kind":"ref","name":"PhysicalDeviceView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PhysicalDeviceView; }>,

    registerPosTerminal: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RegisterPosTerminalRequest; }): Promise<{ status: 201; body: PosTerminalView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/terminals",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RegisterPosTerminalRequest"},
        {"201":{"schema":{"kind":"ref","name":"PosTerminalView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: PosTerminalView; }>,

    rejectManualJournal: (options: { path: { book: string; journal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: Decision; }): Promise<{ status: 200; body: ManualJournal; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/manual-journals/{journal}/reject",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"Decision"},
        {"200":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ManualJournal; }>,

    rejectReversalRequest: (options: { path: { book: string; reversal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: Decision; }): Promise<{ status: 200; body: ReversalRequest; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/reversal-requests/{reversal}/reject",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"Decision"},
        {"200":{"schema":{"kind":"ref","name":"ReversalRequest"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ReversalRequest; }>,

    releaseDocumentLock: (options: { path: { book: string; type: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: DocumentUnlockResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/documents/{type}/{id}/unlock",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DocumentUnlockResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DocumentUnlockResultView; }>,

    releaseTemporaryPostingLock: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ReleaseTemporaryPostingLock; }): Promise<{ status: 200; body: AccountingPeriod; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/unlock",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReleaseTemporaryPostingLock"},
        {"200":{"schema":{"kind":"ref","name":"AccountingPeriod"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AccountingPeriod; }>,

    relinquishCompanyBookOwner: (options: { path: { book: string; owner: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: OwnerCapacityView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/owners/{owner}/relinquish",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OwnerCapacityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OwnerCapacityView; }>,

    relinquishCompanyBookRoleAssignment: (options: { path: { book: string; assignment: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: RoleAssignmentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/role-assignments/{assignment}/relinquish",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleAssignmentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleAssignmentView; }>,

    removeCompanyBookOwner: (options: { path: { book: string; owner: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: OwnerCapacityView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/owners/{owner}/remove",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"OwnerCapacityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OwnerCapacityView; }>,

    reopenAccountingPeriod: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ReopenAccountingPeriod; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/reopen",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReopenAccountingPeriod"},
        {"200":{"schema":{"kind":"value"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: undefined; }>,

    repairPosting: (options: { path: { book: string; posting: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/postings/{posting}/repair",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"},"202":{"schema":{"kind":"ref","name":"PostingSummary"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PostingSummary; } | { status: 202; body: PostingSummary; }>,

    reparentCompanyBook: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ReparentCompanyBookRequest; }): Promise<{ status: 201; body: EntityHierarchyReparentingView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/hierarchy/reparent",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReparentCompanyBookRequest"},
        {"201":{"schema":{"kind":"ref","name":"EntityHierarchyReparentingView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: EntityHierarchyReparentingView; }>,

    replaceAccount: (options: { path: { book: string; account: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ReplaceAccount; }): Promise<{ status: 200; body: Account; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/accounts/{account}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ReplaceAccount"},
        {"200":{"schema":{"kind":"ref","name":"Account"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Account; }>,

    replaceManualJournal: (options: { path: { book: string; journal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ManualJournalContent; }): Promise<{ status: 200; body: ManualJournal; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/manual-journals/{journal}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ManualJournalContent"},
        {"200":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ManualJournal; }>,

    requestCompanyBookOwner: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RequestOwnerRequest; }): Promise<{ status: 201; body: OwnerCapacityView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/owners",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RequestOwnerRequest"},
        {"201":{"schema":{"kind":"ref","name":"OwnerCapacityView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: OwnerCapacityView; }>,

    requestConnection: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RequestConnection; }): Promise<{ status: 201; body: Connection; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connections",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RequestConnection"},
        {"201":{"schema":{"kind":"ref","name":"Connection"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: Connection; }>,

    resetDeveloperSandboxBook: (options: { path: { book: string; }; headers: { "Idempotency-Key": string; "X-CBook-Authority-Context": string; }; body: ResetDeveloperSandboxBookRequest; }): Promise<{ status: 200; body: DeveloperSandboxResetView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sandbox/reset",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ResetDeveloperSandboxBookRequest"},
        {"200":{"schema":{"kind":"ref","name":"DeveloperSandboxResetView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DeveloperSandboxResetView; }>,

    resolveBankStatementLine: (options: { path: { book: string; line_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ResolveBankStatementLine; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-statement-lines/{line_id}/resolve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ResolveBankStatementLine"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    resolvePosContact: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ResolveContactRequest; }): Promise<{ status: 200; body: ResolveContactResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/resolve",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ResolveContactRequest"},
        {"200":{"schema":{"kind":"ref","name":"ResolveContactResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ResolveContactResponse; }>,

    resolveUnitBySerialNumber: (options: { path: { book: string; serial_number: string; }; }): Promise<{ status: 200; body: UnitResolverPayload; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/units/{serial_number}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"UnitResolverPayload"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: UnitResolverPayload; }>,

    respondAuditFinding: (options: { path: { book: string; finding_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RespondFindingRequest; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-findings/{finding_id}/respond",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RespondFindingRequest"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    retryWebhookDelivery: (options: { path: { book: string; delivery_id: Int64String; }; headers: { "Idempotency-Key": string; "X-CBook-Authority-Context": string; }; }): Promise<{ status: 200; body: WebhookDeliveryView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/webhooks/deliveries/{delivery_id}/retry",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"WebhookDeliveryView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: WebhookDeliveryView; }>,

    revalueAsset: (options: { path: { book: string; asset_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RevalueAsset; }): Promise<{ status: 200; body: FixedAsset; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/fixed-assets/{asset_id}/revalue",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RevalueAsset"},
        {"200":{"schema":{"kind":"ref","name":"FixedAsset"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FixedAsset; }>,

    reviewHubSubmission: (options: { headers: { "Idempotency-Key": string; }; body: AdminReviewSubmissionRequest; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/connect-hub/admin/reviews",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"AdminReviewSubmissionRequest"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    reviseCustomerQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CustomerQuoteRequest; }): Promise<{ status: 201; body: CustomerQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/customer-quotes/{quote_id}/revisions",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CustomerQuoteRequest"},
        {"201":{"schema":{"kind":"ref","name":"CustomerQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: CustomerQuote; }>,

    reviseSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSupplierQuote; }): Promise<{ status: 201; body: SupplierQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/revise",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSupplierQuote"},
        {"201":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SupplierQuote; }>,

    revokeCompanyBookInvitation: (options: { path: { book: string; invitation: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: InvitationView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/invitations/{invitation}/revoke",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"InvitationView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InvitationView; }>,

    revokeCompanyBookMembership: (options: { path: { book: string; principal: string; }; headers: { "X-CBook-Authority-Context"?: string | null; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: MembershipView; }> =>
      this.requestOperation(
        "DELETE",
        "/v1/company-books/{book}/memberships/{principal}",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"MembershipView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: MembershipView; }>,

    revokeCompanyBookRoleAssignment: (options: { path: { book: string; assignment: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: RoleAssignmentView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/role-assignments/{assignment}/revoke",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"RoleAssignmentView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleAssignmentView; }>,

    revokeDeveloperKey: (options: { path: { id: string; }; headers: { "Idempotency-Key": string; }; body: RevokeDeveloperKeyRequest; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/developer-keys/{id}/revoke",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RevokeDeveloperKeyRequest"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    revokeEarlyAccessAdmission: (options: { path: { book: string; admission: string; }; headers: { "Idempotency-Key": string; }; body: TransitionAdmissionRequest; }): Promise<{ status: 200; body: AdmissionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/company-books/{book}/early-access-admissions/{admission}/revoke",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TransitionAdmissionRequest"},
        {"200":{"schema":{"kind":"ref","name":"AdmissionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AdmissionView; }>,

    rotateDeveloperKey: (options: { path: { id: string; }; headers: { "Idempotency-Key": string; }; body: RotateDeveloperKeyRequest; }): Promise<{ status: 200; body: IssueDeveloperKeyResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/developer-keys/{id}/rotate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RotateDeveloperKeyRequest"},
        {"200":{"schema":{"kind":"ref","name":"IssueDeveloperKeyResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: IssueDeveloperKeyResponse; }>,

    runBadDebtProvisioning: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RunBadDebtProvisioningRequest; }): Promise<{ status: 200; body: BadDebtProvisioningRunView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/credit-control/run-provisioning",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RunBadDebtProvisioningRequest"},
        {"200":{"schema":{"kind":"ref","name":"BadDebtProvisioningRunView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BadDebtProvisioningRunView; }>,

    runBankFeedRuleMatching: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RunBankFeedRuleMatchingRequest; }): Promise<{ status: 200; body: RunBankFeedRuleMatchingResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/banking/feeds/match",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RunBankFeedRuleMatchingRequest"},
        {"200":{"schema":{"kind":"ref","name":"RunBankFeedRuleMatchingResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RunBankFeedRuleMatchingResultView; }>,

    runIntercompanyEliminations: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RunIntercompanyEliminationsRequest; }): Promise<{ status: 201; body: IntercompanyEliminationRunView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/consolidation/runs",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RunIntercompanyEliminationsRequest"},
        {"201":{"schema":{"kind":"ref","name":"IntercompanyEliminationRunView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: IntercompanyEliminationRunView; }>,

    runMonthlyDepreciationBatch: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RunMonthlyDepreciationBatchRequest; }): Promise<{ status: 200; body: MonthlyDepreciationBatchResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/assets/depreciate-batch",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RunMonthlyDepreciationBatchRequest"},
        {"200":{"schema":{"kind":"ref","name":"MonthlyDepreciationBatchResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: MonthlyDepreciationBatchResultView; }>,

    runRecurringBillingBatch: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RunRecurringBillingBatchRequest; }): Promise<{ status: 200; body: RecurringBillingBatchResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/subscriptions/run-recurring-billing",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RunRecurringBillingBatchRequest"},
        {"200":{"schema":{"kind":"ref","name":"RecurringBillingBatchResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RecurringBillingBatchResultView; }>,

    runRevaluation: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: RevaluationRequest; }): Promise<{ status: 200; body: RevaluationRun; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/revaluate",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"RevaluationRequest"},
        {"200":{"schema":{"kind":"ref","name":"RevaluationRun"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RevaluationRun; }>,

    saveOnboardingDraft: (options: { path: { admitted_relationship_id: string; }; headers: { "Idempotency-Key": string; }; body: SaveDraftInput; }): Promise<{ status: 200; body: OnboardingDraftView; }> =>
      this.requestOperation(
        "PUT",
        "/v1/product-experience/onboarding/drafts/{admitted_relationship_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SaveDraftInput"},
        {"200":{"schema":{"kind":"ref","name":"OnboardingDraftView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OnboardingDraftView; }>,

    searchDirectory: (options: { path: { book: string; }; query: { handle: string; }; }): Promise<{ status: 200; body: DirectoryProfile; }> =>
      this.requestOperation(
        "GET",
        "/v1/company-books/{book}/directory",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"DirectoryProfile"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: DirectoryProfile; }>,

    selectCompanyTemplate: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SelectTemplateRequest; }): Promise<{ status: 201; body: TemplateSelectionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/templates/selections",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SelectTemplateRequest"},
        {"201":{"schema":{"kind":"ref","name":"TemplateSelectionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: TemplateSelectionView; }>,

    sendContactStatementEmail: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SendDocumentEmailRequest; }): Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{contact_id}/statement/email",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SendDocumentEmailRequest"},
        {"202":{"schema":{"kind":"ref","name":"NotificationDeliveryEnqueuedView"},"contentType":"application/json"}}
      ) as Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }>,

    sendPurchaseDocumentEmail: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SendDocumentEmailRequest; }): Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-documents/{document_id}/email",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SendDocumentEmailRequest"},
        {"202":{"schema":{"kind":"ref","name":"NotificationDeliveryEnqueuedView"},"contentType":"application/json"}}
      ) as Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }>,

    sendSalesDocumentEmail: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SendDocumentEmailRequest; }): Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-documents/{document_id}/email",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SendDocumentEmailRequest"},
        {"202":{"schema":{"kind":"ref","name":"NotificationDeliveryEnqueuedView"},"contentType":"application/json"}}
      ) as Promise<{ status: 202; body: NotificationDeliveryEnqueuedView; }>,

    setApprovalPolicy: (options: { path: { book: string; capability: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SetApprovalPolicy; }): Promise<{ status: 200; body: ApprovalPolicySetting; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/settings/approval-policies/{capability}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SetApprovalPolicy"},
        {"200":{"schema":{"kind":"ref","name":"ApprovalPolicySetting"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ApprovalPolicySetting; }>,

    setContactCreditLimit: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SetContactCreditLimitRequest; }): Promise<{ status: 200; body: ContactCreditLimitView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/contacts/{id}/credit-limit",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SetContactCreditLimitRequest"},
        {"200":{"schema":{"kind":"ref","name":"ContactCreditLimitView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactCreditLimitView; }>,

    setLandedCostPolicy: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SetLandedCostPolicy; }): Promise<{ status: 200; body: LandedCostPolicy; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/landed-cost-policy",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SetLandedCostPolicy"},
        {"200":{"schema":{"kind":"ref","name":"LandedCostPolicy"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LandedCostPolicy; }>,

    setTimephasedBaselineSchedule: (options: { path: { book: string; project_id: string; }; headers: { "X-CBook-Authority-Context": string; }; body: SetTimephasedBaselineRequest; }): Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/poc-projects/{project_id}/baseline-schedule",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SetTimephasedBaselineRequest"},
        {"200":{"schema":{"kind":"ref","name":"ProjectSCurveSeriesResponse"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ProjectSCurveSeriesResponse; }>,

    shareDocumentAcrossConnection: (options: { path: { book: string; connection_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: ShareDocument; }): Promise<{ status: 201; body: SharedDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connections/{connection_id}/share",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ShareDocument"},
        {"201":{"schema":{"kind":"ref","name":"SharedDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: SharedDocument; }>,

    signoffAccountingPeriodAuditor: (options: { path: { book: string; period: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SignoffAccountingPeriodAuditorRequest; }): Promise<{ status: 201; body: AuditorDigitalSignatureView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{period}/auditor-signoff",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SignoffAccountingPeriodAuditorRequest"},
        {"201":{"schema":{"kind":"ref","name":"AuditorDigitalSignatureView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: AuditorDigitalSignatureView; }>,

    softLockAccountingPeriod: (options: { path: { book: string; id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SoftLockAccountingPeriodRequest; }): Promise<{ status: 200; body: SoftLockAccountingPeriodView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/{id}/soft-lock",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SoftLockAccountingPeriodRequest"},
        {"200":{"schema":{"kind":"ref","name":"SoftLockAccountingPeriodView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SoftLockAccountingPeriodView; }>,

    stocktakeAdjustment: (options: { path: { book: string; item_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: StocktakeRequest; }): Promise<{ status: 200; body: InventoryMovement; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/items/{item_id}/stocktake",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"StocktakeRequest"},
        {"200":{"schema":{"kind":"ref","name":"InventoryMovement"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: InventoryMovement; }>,

    submitAuditProposal: (options: { path: { book: string; proposal_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/audit-proposals/{proposal_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    submitExpenseClaim: (options: { path: { book: string; claim_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: ExpenseClaim; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/expense-claims/{claim_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ExpenseClaim"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ExpenseClaim; }>,

    submitHubApp: (options: { headers: { "Idempotency-Key": string; }; body: SubmitAppRequest; }): Promise<{ status: 201; body: HubAppView; }> =>
      this.requestOperation(
        "POST",
        "/v1/connect-hub/apps",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SubmitAppRequest"},
        {"201":{"schema":{"kind":"ref","name":"HubAppView"},"contentType":"application/json"}}
      ) as Promise<{ status: 201; body: HubAppView; }>,

    submitImportDeclaration: (options: { path: { book: string; declaration_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: ImportDeclaration; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/import-declarations/{declaration_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ImportDeclaration"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ImportDeclaration; }>,

    submitLandedCostApportionment: (options: { path: { book: string; apportionment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: LandedCostApportionment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/landed-cost-apportionments/{apportionment_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"LandedCostApportionment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: LandedCostApportionment; }>,

    submitManualJournal: (options: { path: { book: string; journal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; }): Promise<{ status: 200; body: ManualJournal; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/manual-journals/{journal}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"ManualJournal"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ManualJournal; }>,

    submitPayment: (options: { path: { book: string; payment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: Payment; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payments/{payment_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"Payment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Payment; }>,

    submitPayrollRun: (options: { path: { book: string; run_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PayrollRun; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/payroll-runs/{run_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PayrollRun"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PayrollRun; }>,

    submitPosOrder: (options: { path: { book: string; order: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SubmitPosOrderRequest; }): Promise<{ status: 200; body: PosOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/pos/orders/{order}/submit",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SubmitPosOrderRequest"},
        {"200":{"schema":{"kind":"ref","name":"PosOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PosOrderView; }>,

    submitPurchaseDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PurchaseDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-documents/{document_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseDocument; }>,

    submitPurchaseOrder: (options: { path: { book: string; po_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PurchaseOrderView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-orders/{po_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseOrderView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseOrderView; }>,

    submitSalesDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: SalesDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-documents/{document_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SalesDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesDocument; }>,

    submitSubledgerClaim: (options: { path: { book: string; entity_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SubmitSubledgerClaimRequest; }): Promise<{ status: 200; body: SubledgerStatementView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/subledgers/{entity_id}/claims",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SubmitSubledgerClaimRequest"},
        {"200":{"schema":{"kind":"ref","name":"SubledgerStatementView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SubledgerStatementView; }>,

    submitSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: SupplierQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/submit",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuote; }>,

    suspendEarlyAccessAdmission: (options: { path: { book: string; admission: string; }; headers: { "Idempotency-Key": string; }; body: TransitionAdmissionRequest; }): Promise<{ status: 200; body: AdmissionView; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/company-books/{book}/early-access-admissions/{admission}/suspend",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TransitionAdmissionRequest"},
        {"200":{"schema":{"kind":"ref","name":"AdmissionView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: AdmissionView; }>,

    syncOfflineQueue: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SyncOfflineQueueRequest; }): Promise<{ status: 200; body: SyncOfflineQueueResultView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sync-offline-queue",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SyncOfflineQueueRequest"},
        {"200":{"schema":{"kind":"ref","name":"SyncOfflineQueueResultView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SyncOfflineQueueResultView; }>,

    syncSleekCompanyProfile: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: SyncSleekCompanyProfileRequest; }): Promise<{ status: 200; body: SleekCompanyProfileView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/connect-hub/sleek/sync-profile",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"SyncSleekCompanyProfileRequest"},
        {"200":{"schema":{"kind":"ref","name":"SleekCompanyProfileView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SleekCompanyProfileView; }>,

    tagDeveloperKeyOwner: (options: { path: { id: string; }; headers: { "Idempotency-Key": string; }; body: TagOwnerRequest; }): Promise<{ status: 200; body: undefined; }> =>
      this.requestOperation(
        "POST",
        "/v1/admin/developer-keys/{id}/tag-owner",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TagOwnerRequest"},
        {"200":{"schema":{"kind":"value"},"contentType":null}}
      ) as Promise<{ status: 200; body: undefined; }>,

    transferResourcesAndOffboardMember: (options: { path: { book: string; principal: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: TransferAndOffboardRequest; }): Promise<{ status: 200; body: OffboardingTransferResult; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/memberships/{principal}/transfer-and-offboard",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TransferAndOffboardRequest"},
        {"200":{"schema":{"kind":"ref","name":"OffboardingTransferResult"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: OffboardingTransferResult; }>,

    transitionBankAccount: (options: { path: { book: string; account_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: TransitionBankAccount; }): Promise<{ status: 200; body: BankAccount; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/bank-accounts/{account_id}/lifecycle",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TransitionBankAccount"},
        {"200":{"schema":{"kind":"ref","name":"BankAccount"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankAccount; }>,

    transitionCompanyBookAccountingBookLifecycle: (options: { path: { book: string; accounting_book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: TransitionBookInput; }): Promise<{ status: 200; body: BookView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/settings/books/{accounting_book}/lifecycle",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TransitionBookInput"},
        {"200":{"schema":{"kind":"ref","name":"BookView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BookView; }>,

    transitionCustomerQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CustomerQuoteLifecycleRequest; }): Promise<{ status: 200; body: CustomerQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/customer-quotes/{quote_id}/lifecycle",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CustomerQuoteLifecycleRequest"},
        {"200":{"schema":{"kind":"ref","name":"CustomerQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CustomerQuote; }>,

    transitionServiceSalesOrder: (options: { path: { book: string; order_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: ServiceOrderLifecycle; }): Promise<{ status: 200; body: ServiceOrder; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-orders/{order_id}/lifecycle",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"ServiceOrderLifecycle"},
        {"200":{"schema":{"kind":"ref","name":"ServiceOrder"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ServiceOrder; }>,

    triggerContinuousCloseRun: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: TriggerContinuousCloseRequest; }): Promise<{ status: 200; body: ContinuousCloseScheduleView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/accounting-periods/continuous-close",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TriggerContinuousCloseRequest"},
        {"200":{"schema":{"kind":"ref","name":"ContinuousCloseScheduleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContinuousCloseScheduleView; }>,

    triggerFederatedNodeSync: (options: { path: { book: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: TriggerFederatedNodeSyncRequest; }): Promise<{ status: 200; body: FederatedNodeSyncView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/federated-sync",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"TriggerFederatedNodeSyncRequest"},
        {"200":{"schema":{"kind":"ref","name":"FederatedNodeSyncView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: FederatedNodeSyncView; }>,

    updateBankAccount: (options: { path: { book: string; account_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: UpdateBankAccount; }): Promise<{ status: 200; body: BankAccount; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/bank-accounts/{account_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdateBankAccount"},
        {"200":{"schema":{"kind":"ref","name":"BankAccount"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: BankAccount; }>,

    updateCalendarEventStatus: (options: { path: { book: string; event_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpdateCalendarEventStatusRequest; }): Promise<{ status: 200; body: CalendarEventView; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/calendar/events/{event_id}/status",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdateCalendarEventStatusRequest"},
        {"200":{"schema":{"kind":"ref","name":"CalendarEventView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CalendarEventView; }>,

    updateCompanyBookRoleMetadata: (options: { path: { book: string; role: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: UpdateRoleMetadataRequest; }): Promise<{ status: 200; body: RoleView; }> =>
      this.requestOperation(
        "PATCH",
        "/v1/company-books/{book}/roles/{role}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdateRoleMetadataRequest"},
        {"200":{"schema":{"kind":"ref","name":"RoleView"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: RoleView; }>,

    updateContact: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpdateContact; }): Promise<{ status: 200; body: Contact; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/contacts/{contact_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdateContact"},
        {"200":{"schema":{"kind":"ref","name":"Contact"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Contact; }>,

    updateCustomerQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: CustomerQuoteRequest; }): Promise<{ status: 200; body: CustomerQuote; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/customer-quotes/{quote_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CustomerQuoteRequest"},
        {"200":{"schema":{"kind":"ref","name":"CustomerQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: CustomerQuote; }>,

    updateItem: (options: { path: { book: string; item_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpdateItem; }): Promise<{ status: 200; body: Item; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/items/{item_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdateItem"},
        {"200":{"schema":{"kind":"ref","name":"Item"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Item; }>,

    updatePayment: (options: { path: { book: string; payment_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; "If-Match": string; }; body: UpdatePayment; }): Promise<{ status: 200; body: Payment; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/payments/{payment_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpdatePayment"},
        {"200":{"schema":{"kind":"ref","name":"Payment"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: Payment; }>,

    updatePurchaseDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreatePurchaseDocument; }): Promise<{ status: 200; body: PurchaseDocument; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/purchase-documents/{document_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreatePurchaseDocument"},
        {"200":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseDocument; }>,

    updateSalesDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSalesDocument; }): Promise<{ status: 200; body: SalesDocument; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/sales-documents/{document_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSalesDocument"},
        {"200":{"schema":{"kind":"ref","name":"SalesDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesDocument; }>,

    updateSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: CreateSupplierQuote; }): Promise<{ status: 200; body: SupplierQuote; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"CreateSupplierQuote"},
        {"200":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuote; }>,

    upsertContactOrganization: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpsertContactOrganization; }): Promise<{ status: 200; body: ContactOrganization; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/contacts/{contact_id}/organization",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpsertContactOrganization"},
        {"200":{"schema":{"kind":"ref","name":"ContactOrganization"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactOrganization; }>,

    upsertContactPerson: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpsertContactPerson; }): Promise<{ status: 200; body: ContactPerson; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/contacts/{contact_id}/person",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpsertContactPerson"},
        {"200":{"schema":{"kind":"ref","name":"ContactPerson"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactPerson; }>,

    upsertContactProfile: (options: { path: { book: string; contact_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; body: UpsertContactProfile; }): Promise<{ status: 200; body: ContactProfile; }> =>
      this.requestOperation(
        "PUT",
        "/v1/company-books/{book}/contacts/{contact_id}/profile",
        options as unknown as OperationOptions,
        {"kind":"ref","name":"UpsertContactProfile"},
        {"200":{"schema":{"kind":"ref","name":"ContactProfile"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: ContactProfile; }>,

    voidPurchaseDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: PurchaseDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/purchase-documents/{document_id}/void",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"PurchaseDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: PurchaseDocument; }>,

    voidSalesDocument: (options: { path: { book: string; document_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: SalesDocument; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/sales-documents/{document_id}/void",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SalesDocument"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SalesDocument; }>,

    voidSupplierQuote: (options: { path: { book: string; quote_id: string; }; headers: { "X-CBook-Authority-Context": string; "Idempotency-Key": string; }; }): Promise<{ status: 200; body: SupplierQuote; }> =>
      this.requestOperation(
        "POST",
        "/v1/company-books/{book}/supplier-quotes/{quote_id}/void",
        options as unknown as OperationOptions,
        undefined,
        {"200":{"schema":{"kind":"ref","name":"SupplierQuote"},"contentType":"application/json"}}
      ) as Promise<{ status: 200; body: SupplierQuote; }>,

  };
}

export default HfeClient;
