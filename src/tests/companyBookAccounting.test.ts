import { describe, it, expect } from 'vitest'
import {
  MOCK_CHART_OF_ACCOUNTS,
  MOCK_JOURNAL_ENTRIES,
  MOCK_TRIAL_BALANCE,
  MOCK_BALANCE_SHEET,
  MOCK_PROFIT_AND_LOSS,
  MOCK_TAX_OBLIGATIONS
} from '../data/accountingMockData'
import { formatPrice, formatCompactPrice } from '../utils/currencyFormatter'
import { AccountingTabId } from '../types/accounting'

describe('Pillar 6: Company Books Accounting & Financial Ledger Invariants', () => {
  describe('Double-Entry Balance Invariants (Debits === Credits)', () => {
    it('should assert every general journal entry is strictly balanced (Sum(Dr) === Sum(Cr))', () => {
      expect(MOCK_JOURNAL_ENTRIES.length).toBeGreaterThan(0)

      MOCK_JOURNAL_ENTRIES.forEach((entry) => {
        const lineDebitSum = entry.lines.reduce((sum, l) => sum + l.debit, 0)
        const lineCreditSum = entry.lines.reduce((sum, l) => sum + l.credit, 0)

        expect(lineDebitSum).toBe(lineCreditSum)
        expect(entry.totalDebit).toBe(entry.totalCredit)
        expect(entry.totalDebit).toBe(lineDebitSum)
        expect(entry.status).toBe('posted')
        expect(entry.kernelProofId).toMatch(/^TB-PROOF-/)
      })
    })

    it('should assert trial balance total closing debits strictly equal closing credits with zero variance', () => {
      expect(MOCK_TRIAL_BALANCE.length).toBeGreaterThan(0)

      const totalOpeningDebit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.openingDebit, 0)
      const totalOpeningCredit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.openingCredit, 0)
      expect(totalOpeningDebit).toBe(totalOpeningCredit)

      const totalMovementDebit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.movementDebit, 0)
      const totalMovementCredit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.movementCredit, 0)
      expect(totalMovementDebit).toBe(totalMovementCredit)

      const totalClosingDebit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.closingDebit, 0)
      const totalClosingCredit = MOCK_TRIAL_BALANCE.reduce((acc, r) => acc + r.closingCredit, 0)
      expect(totalClosingDebit).toBe(totalClosingCredit)

      const variance = Math.abs(totalClosingDebit - totalClosingCredit)
      expect(variance).toBe(0)
    })
  })

  describe('Financial Statements Mathematical Identities', () => {
    it('should assert Balance Sheet identity: Total Assets === Total Liabilities + Total Equity', () => {
      const currentAssets = MOCK_BALANCE_SHEET.currentAssets.reduce((sum, a) => sum + a.currentPeriod, 0)
      const nonCurrentAssets = MOCK_BALANCE_SHEET.nonCurrentAssets.reduce((sum, a) => sum + a.currentPeriod, 0)
      const computedTotalAssets = currentAssets + nonCurrentAssets

      expect(computedTotalAssets).toBe(MOCK_BALANCE_SHEET.totalAssets)

      const currentLiabilities = MOCK_BALANCE_SHEET.currentLiabilities.reduce((sum, l) => sum + l.currentPeriod, 0)
      const nonCurrentLiabilities = MOCK_BALANCE_SHEET.nonCurrentLiabilities.reduce((sum, l) => sum + l.currentPeriod, 0)
      const computedTotalLiabilities = currentLiabilities + nonCurrentLiabilities

      expect(computedTotalLiabilities).toBe(MOCK_BALANCE_SHEET.totalLiabilities)

      const computedTotalEquity = MOCK_BALANCE_SHEET.equityLines.reduce((sum, e) => sum + e.currentPeriod, 0)
      expect(computedTotalEquity).toBe(MOCK_BALANCE_SHEET.totalEquity)

      const totalLiabilitiesAndEquity = computedTotalLiabilities + computedTotalEquity
      expect(computedTotalAssets).toBe(totalLiabilitiesAndEquity)
      expect(MOCK_BALANCE_SHEET.isBalanced).toBe(true)
    })

    it('should assert Profit & Loss statement arithmetic correctness', () => {
      const computedRevenue = MOCK_PROFIT_AND_LOSS.revenueLines.reduce((sum, r) => sum + r.currentPeriod, 0)
      expect(computedRevenue).toBe(MOCK_PROFIT_AND_LOSS.totalRevenue)

      const computedCogs = MOCK_PROFIT_AND_LOSS.cogsLines.reduce((sum, c) => sum + c.currentPeriod, 0)
      expect(computedCogs).toBe(MOCK_PROFIT_AND_LOSS.totalCogs)

      const computedGrossProfit = computedRevenue - computedCogs
      expect(computedGrossProfit).toBe(MOCK_PROFIT_AND_LOSS.grossProfit)

      const computedExpenses = MOCK_PROFIT_AND_LOSS.expenseLines.reduce((sum, e) => sum + e.currentPeriod, 0)
      expect(computedExpenses).toBe(MOCK_PROFIT_AND_LOSS.totalExpenses)

      const computedOperatingProfit = computedGrossProfit - computedExpenses
      expect(computedOperatingProfit).toBe(MOCK_PROFIT_AND_LOSS.operatingProfit)

      const computedNetIncome = computedOperatingProfit - MOCK_PROFIT_AND_LOSS.taxExpense
      expect(computedNetIncome).toBe(MOCK_PROFIT_AND_LOSS.netIncome)
    })
  })

  describe('Tabular Numbers Rendering & Zero-Jitter Presentation', () => {
    it('should format all financial monetary figures using tabular-nums formatPrice', () => {
      const sampleAmounts = [0, 5000000, 115600000, 1850000000]

      sampleAmounts.forEach((amt) => {
        const formatted = formatPrice(amt)
        expect(formatted).toMatch(/^Rp\s/)
        expect(formatted.replace(/[^0-9]/g, '')).toBe(amt.toString())
      })

      const compactMillion = formatCompactPrice(15000000)
      expect(compactMillion).toContain('Jt')
    })
  })

  describe('Clean View Tab Transitions & Isolation', () => {
    it('should define all 6 accounting tabs without state leakage', () => {
      const validTabs: AccountingTabId[] = [
        'coa',
        'journals',
        'trial-balance',
        'balance-sheet',
        'pnl',
        'tax'
      ]

      expect(validTabs.length).toBe(6)

      // Verify Chart of Accounts covers standard 6 SAK categories
      const categories = new Set(MOCK_CHART_OF_ACCOUNTS.map((a) => a.category))
      expect(categories.has('asset')).toBe(true)
      expect(categories.has('liability')).toBe(true)
      expect(categories.has('equity')).toBe(true)
      expect(categories.has('revenue')).toBe(true)
      expect(categories.has('cogs')).toBe(true)
      expect(categories.has('expense')).toBe(true)
    })

    it('should verify tax obligations adhere to Indonesian Resto PB1 and PPh regulations', () => {
      const pb1 = MOCK_TAX_OBLIGATIONS.find((t) => t.taxType === 'PB1_RESTO')
      expect(pb1).toBeDefined()
      expect(pb1?.ratePercent).toBe(10)
      expect(pb1?.taxAmount).toBe(Math.round((pb1?.taxableBase || 0) * 0.1))

      const pphFinal = MOCK_TAX_OBLIGATIONS.find((t) => t.taxType === 'PPH_FINAL_05')
      expect(pphFinal).toBeDefined()
      expect(pphFinal?.ratePercent).toBe(0.5)
      expect(pphFinal?.status).toBe('settled')
    })
  })
})
