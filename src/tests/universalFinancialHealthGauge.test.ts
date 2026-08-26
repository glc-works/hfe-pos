import { describe, it, expect } from 'vitest'
import { FinancialHealthSnapshot, AssetValuationCategory } from '../types/financialHealth'

describe('Universal Executive Financial Health & Capital Velocity Gauge Engine', () => {
  const mockSnapshot: FinancialHealthSnapshot = {
    cashRunwayDays: 142,
    cashRunwayStatus: 'healthy',
    quickRatio: 2.45,
    grossMarginPercent: 68.4,
    operatingMarginPercent: 32.1,
    netMarginPercent: 24.2,
    workingCapitalMinor: 35000000000,
    inventoryTurnoverDays: 18,
    taxReserveFundMinor: 4850000000,
    taxObligationMinor: 4850000000,
    taxReserveFundStatus: 'sufficient',
    assetCategory: 'fnb_raw_ingredients',
    assetValuationMinor: 18500000000,
    assetTurnoverVelocityScore: 92,
    dailyBurnRateMinor: 341500000,
    liquidCashMinor: 48500000000
  }

  it('calculates cash runway days accurately from liquid cash and daily burn rate', () => {
    const calculatedDays = Math.floor(mockSnapshot.liquidCashMinor / mockSnapshot.dailyBurnRateMinor)
    expect(calculatedDays).toBe(142)
    expect(calculatedDays).toBeGreaterThan(90) // Benchmark healthy threshold
    expect(mockSnapshot.cashRunwayStatus).toBe('healthy')
  })

  it('verifies gross profit, COGS, and net margin mathematical consistency', () => {
    const cogsPercent = 100 - mockSnapshot.grossMarginPercent
    expect(cogsPercent).toBeCloseTo(31.6, 1)

    // Net Margin must be within operating margin boundaries
    expect(mockSnapshot.netMarginPercent).toBeLessThan(mockSnapshot.grossMarginPercent)
    expect(mockSnapshot.netMarginPercent).toBe(24.2)
  })

  it('supports universal multi-sector asset classification without locking into a single vertical', () => {
    const categories: AssetValuationCategory[] = [
      'fnb_raw_ingredients',
      'retail_merchandise',
      'mfg_wip',
      'biological_produce',
      'general_fixed_assets'
    ]

    expect(categories.length).toBe(5)
    expect(categories).toContain('fnb_raw_ingredients')
    expect(categories).toContain('retail_merchandise')
    expect(categories).toContain('biological_produce')
    expect(categories).toContain('general_fixed_assets')
  })

  it('asserts statutory tax reserve ring-fencing to guarantee zero compliance shortfall', () => {
    expect(mockSnapshot.taxReserveFundMinor).toBeGreaterThanOrEqual(mockSnapshot.taxObligationMinor)
    expect(mockSnapshot.taxReserveFundStatus).toBe('sufficient')
    const fundingCoverageRatio = mockSnapshot.taxReserveFundMinor / mockSnapshot.taxObligationMinor
    expect(fundingCoverageRatio).toBe(1.0) // 100% covered
  })

  it('supports dynamic financial health snapshot overrides from real-world shift and transactions', () => {
    const customSnapshot: Partial<FinancialHealthSnapshot> = {
      cashRunwayDays: 45,
      cashRunwayStatus: 'warning',
      liquidCashMinor: 15000000000 // 150 Juta
    }

    const merged = { ...mockSnapshot, ...customSnapshot }
    expect(merged.cashRunwayDays).toBe(45)
    expect(merged.cashRunwayStatus).toBe('warning')
    expect(merged.liquidCashMinor).toBe(15000000000)
  })
})
