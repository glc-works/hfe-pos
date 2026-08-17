import { describe, it, expect } from 'vitest'
import { INITIAL_COA_DATA, CoATreeHierarchy } from '../components/book/CoATreeHierarchy'
import { INITIAL_JOURNAL_ENTRIES, JournalEntryTable } from '../components/book/JournalEntryTable'
import { INITIAL_TRIAL_BALANCE, MOCK_SUBLEDGER_MAP, TrialBalanceView } from '../components/book/TrialBalanceView'
import * as BookComponents from '../components/book'

describe('Pillar 6: Book (Chart of Accounts, Journals & Trial Balance)', () => {
  it('exports all 3 canonical book components and types from barrel index', () => {
    expect(BookComponents.CoATreeHierarchy).toBeDefined()
    expect(BookComponents.JournalEntryTable).toBeDefined()
    expect(BookComponents.TrialBalanceView).toBeDefined()
  })

  describe('Chart of Accounts (CoATreeHierarchy)', () => {
    it('covers all 6 accounting categories (1xxx to 6xxx)', () => {
      const rootCodes = INITIAL_COA_DATA.map((c) => c.code)
      expect(rootCodes).toContain('1000') // Assets
      expect(rootCodes).toContain('2000') // Liabilities
      expect(rootCodes).toContain('3000') // Equity
      expect(rootCodes).toContain('4000') // Revenue
      expect(rootCodes).toContain('5000') // CoGS
      expect(rootCodes).toContain('6000') // Expenses
    })

    it('ensures fundamental accounting balance: Assets == Liabilities + Equity', () => {
      const assets = INITIAL_COA_DATA.find((c) => c.code === '1000')?.balance || 0
      const liabilities = INITIAL_COA_DATA.find((c) => c.code === '2000')?.balance || 0
      const equity = INITIAL_COA_DATA.find((c) => c.code === '3000')?.balance || 0

      expect(assets).toBe(liabilities + equity)
      expect(assets).toBe(185450000)
    })

    it('maintains hierarchical children detail nodes with positive balances', () => {
      const assetsNode = INITIAL_COA_DATA.find((c) => c.code === '1000')
      expect(assetsNode?.children).toBeDefined()
      expect(assetsNode!.children!.length).toBeGreaterThanOrEqual(2)

      const cashGroup = assetsNode!.children!.find((c) => c.code === '1100')
      expect(cashGroup?.children).toBeDefined()
      const drawerFloat = cashGroup!.children!.find((c) => c.code === '1110')
      expect(drawerFloat?.normalBalance).toBe('DEBIT')
      expect(drawerFloat?.balance).toBe(5000000)
    })
  })

  describe('Double-Entry Journal Entries (JournalEntryTable)', () => {
    it('verifies that every sample journal entry is strictly balanced (Dr == Cr)', () => {
      INITIAL_JOURNAL_ENTRIES.forEach((entry) => {
        const totalDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0)
        const totalCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0)
        expect(totalDebit).toBe(totalCredit)
        expect(totalDebit).toBeGreaterThan(0)
      })
    })

    it('supports multiple journal classification types', () => {
      const types = INITIAL_JOURNAL_ENTRIES.map((e) => e.type)
      expect(types).toContain('SALES')
      expect(types).toContain('PURCHASE')
      expect(types).toContain('BANK')
      expect(types).toContain('PAYROLL')
      expect(types).toContain('GENERAL')
    })
  })

  describe('Trial Balance (TrialBalanceView)', () => {
    it('verifies Grand Total Debits == Grand Total Credits across all ledger accounts', () => {
      const totalDebits = INITIAL_TRIAL_BALANCE.reduce((sum, acc) => sum + acc.debit, 0)
      const totalCredits = INITIAL_TRIAL_BALANCE.reduce((sum, acc) => sum + acc.credit, 0)

      expect(totalDebits).toBe(totalCredits)
      expect(totalDebits).toBeGreaterThan(0)
    })

    it('contains valid subledger transaction map for drilldowns', () => {
      const cashTransactions = MOCK_SUBLEDGER_MAP['1110']
      expect(cashTransactions).toBeDefined()
      expect(cashTransactions.length).toBeGreaterThanOrEqual(2)
      expect(cashTransactions[0].runningBalance).toBeGreaterThanOrEqual(0)
    })
  })
})
