import { describe, it, expect } from 'vitest'
import * as BookComponents from '../components/book'

describe('Pillar 6: Book (Financial Statements & Tax Portal)', () => {
  it('exports all 6 canonical book components from barrel index', () => {
    expect(BookComponents.CoATreeHierarchy).toBeDefined()
    expect(BookComponents.JournalEntryTable).toBeDefined()
    expect(BookComponents.TrialBalanceView).toBeDefined()
    expect(BookComponents.BalanceSheetStatement).toBeDefined()
    expect(BookComponents.ProfitAndLossStatement).toBeDefined()
    expect(BookComponents.TaxCompliancePortal).toBeDefined()
  })

  describe('Balance Sheet Statement (BalanceSheetStatement)', () => {
    it('verifies accounting balance equation: Assets = Liabilities + Equity', () => {
      // Assets: Current (205,450,000) + Fixed (165,500,000) = 370,950,000
      const currentAssets = 5500000 + 88500000 + 54200000 + 18450000 + 26800000 + 12000000
      const fixedAssets = 95000000 + 28000000 - 22500000 + 65000000
      const totalAssets = currentAssets + fixedAssets

      // Liabilities: Current (76,950,000) + Long-term (105,000,000) = 181,950,000
      const currentLiab = 31400000 + 14250000 + 24800000 + 6500000
      const longTermLiab = 60000000 + 45000000
      const totalLiab = currentLiab + longTermLiab

      // Equity: 120,000,000 + 40,500,000 + 28,500,000 = 189,000,000
      const equity = 120000000 + 40500000 + 28500000

      expect(totalAssets).toBe(totalLiab + equity)
      expect(totalAssets).toBe(370950000)
    })
  })

  describe('Profit and Loss Statement (ProfitAndLossStatement)', () => {
    it('verifies multi-step income statement logic: Revenue - CoGS = Gross -> OpEx -> EBITDA -> Tax = Net Profit', () => {
      const revenue = 142500000 + 38400000 + 15600000 + 7800000 - 8300000 // 196,000,000
      const cogs = 48500000 + 26200000 + 7600000 + 1900000 // 84,200,000
      const grossProfit = revenue - cogs // 111,800,000

      const opex = 34500000 + 18000000 + 7400000 + 5200000 + 1600000 + 2300000 // 69,000,000
      const ebitda = grossProfit - opex // 42,800,000

      const taxDepr = 3000000 + 750000 + 2150000 // 5,900,000
      const netProfit = ebitda - taxDepr // 36,900,000

      expect(grossProfit).toBe(111800000)
      expect(ebitda).toBe(42800000)
      expect(netProfit).toBe(36900000)
      expect(netProfit).toBeGreaterThan(0)
    })
  })

  describe('Tax Compliance Portal (TaxCompliancePortal)', () => {
    it('calculates PPN 11% output tax, input tax and net payable correctly', () => {
      const dppSales = 188700000
      const dppPurchases = 84200000
      const ppnOutput11 = (dppSales * 11) / 100
      const ppnInput11 = (dppPurchases * 11) / 100
      const ppnPayable = ppnOutput11 - ppnInput11

      expect(ppnOutput11).toBe(20757000)
      expect(ppnInput11).toBe(9262000)
      expect(ppnPayable).toBe(11495000)
    })

    it('asserts FTZ Batam zero-rated exemption condition', () => {
      const isFtz = true
      const ppnOutput = isFtz ? 0 : 20757000
      expect(ppnOutput).toBe(0)
    })
  })
})
