// --- RECONCILIATION & FIND-AND-MATCH TYPES (XERO-STYLE BENCHMARK) ---

export interface BankStatementLine {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  sourceBank: string
  status: 'unmatched' | 'matched' | 'reconciled'
  matchedTransactionId?: string
  confidenceScore?: number
  suggestedTransactionId?: string
  notes?: string
}

export interface ReconciliationCandidate {
  id: string
  documentRef: string
  date: string
  amount: number
  tenderType: string
  customerName?: string
  tableName?: string
  glJournalId?: string
  status: 'unmatched' | 'matched'
}

export interface ReconciliationAdjustment {
  statementLineId: string
  mdrFeeMinor: number
  discrepancyType: 'mdr_fee' | 'rounding' | 'bank_charge'
  reason: string
  glAccountTarget: string
}
