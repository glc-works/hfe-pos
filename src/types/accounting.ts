/**
 * Double-Entry Accounting & Financial Ledger Types (Pillar 6: BOOK)
 * Standard: SAK Indonesia & IFRS Compliance with TigerBeetle Kernel
 * Tier 1: Types & Domain Contracts
 */

export type AccountCategory = 'asset' | 'liability' | 'equity' | 'revenue' | 'cogs' | 'expense'
export type NormalBalance = 'debit' | 'credit'

export interface ChartOfAccount {
  code: string
  name: string
  category: AccountCategory
  normalBalance: NormalBalance
  balance: number
  description: string
  parentCode?: string
  currency: string
  isActive: boolean
  isReconciled?: boolean
}

export interface JournalEntryLine {
  id: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
  memo?: string
}

export interface JournalEntry {
  id: string
  date: string
  referenceNumber: string
  description: string
  postedAt: string
  postedBy: string
  kernelProofId: string
  status: 'posted' | 'draft' | 'void'
  lines: JournalEntryLine[]
  totalDebit: number
  totalCredit: number
}

export interface TrialBalanceRow {
  accountCode: string
  accountName: string
  category: AccountCategory
  openingDebit: number
  openingCredit: number
  movementDebit: number
  movementCredit: number
  closingDebit: number
  closingCredit: number
}

export interface StatementLine {
  id: string
  code: string
  name: string
  currentPeriod: number
  previousPeriod: number
  depth?: number
  isSubtotal?: boolean
  isTotal?: boolean
}

export interface BalanceSheetData {
  asOfDate: string
  currentAssets: StatementLine[]
  nonCurrentAssets: StatementLine[]
  totalAssets: number
  currentLiabilities: StatementLine[]
  nonCurrentLiabilities: StatementLine[]
  totalLiabilities: number
  equityLines: StatementLine[]
  totalEquity: number
  isBalanced: boolean
}

export interface ProfitAndLossData {
  period: string
  revenueLines: StatementLine[]
  totalRevenue: number
  cogsLines: StatementLine[]
  totalCogs: number
  grossProfit: number
  grossMarginPct: number
  expenseLines: StatementLine[]
  totalExpenses: number
  operatingProfit: number
  operatingMarginPct: number
  taxExpense: number
  netIncome: number
  netMarginPct: number
}

export type TaxType = 'PB1_RESTO' | 'PPN_11' | 'PPH_21' | 'PPH_FINAL_05'
export type TaxFilingStatus = 'draft' | 'calculated' | 'filed' | 'settled'

export interface TaxObligation {
  id: string
  taxType: TaxType
  taxName: string
  period: string
  taxableBase: number
  ratePercent: number
  taxAmount: number
  status: TaxFilingStatus
  dueDate: string
  ntpnCode?: string
  billingCode?: string
  sptpdNumber?: string
}

export type AccountingTabId = 'coa' | 'journals' | 'trial-balance' | 'balance-sheet' | 'pnl' | 'tax'
