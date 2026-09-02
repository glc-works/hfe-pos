import { describe, it, expect } from 'vitest'
import {
  calculateShiftBomMargin,
  DEFAULT_SHIFT_SOLD_ITEMS,
  ShiftSoldItem
} from '../utils/shiftReconcile'

describe('Shift Closing Theoretical BoM Reconciliation & Realtime Margin Suite', () => {
  it('aggregates theoretical raw material consumption accurately across all sold SKUs', () => {
    const result = calculateShiftBomMargin({
      soldItems: DEFAULT_SHIFT_SOLD_ITEMS,
      cashVariance: 0,
      ojolCommissionRate: 0.20
    })

    // 24x Aren Latte (18g) + 18x Americano (18g) = 42 * 18g = 756g Coffee Beans
    const coffeeBeans = result.ingredientUsages.find(i => i.name.includes('Biji Kopi Gayo'))
    expect(coffeeBeans).toBeDefined()
    expect(coffeeBeans?.totalAmount).toBe(756)
    expect(coffeeBeans?.unit).toBe('g')
    expect(coffeeBeans?.totalCost).toBe(756 * 250) // Rp 189.000

    // 24x Aren Latte (150ml) = 3600ml Fresh Milk
    const milk = result.ingredientUsages.find(i => i.name.includes('Fresh Milk'))
    expect(milk).toBeDefined()
    expect(milk?.totalAmount).toBe(3600)
    expect(milk?.unit).toBe('ml')

    // 12x French Croissant (80g) = 960g Pastry Dough
    const pastry = result.ingredientUsages.find(i => i.name.includes('Adonan Pastry'))
    expect(pastry?.totalAmount).toBe(960)
  })

  it('calculates total omzet, BoM COGS, and gross profit correctly', () => {
    const result = calculateShiftBomMargin({
      soldItems: DEFAULT_SHIFT_SOLD_ITEMS,
      cashVariance: 0
    })

    // Total Omzet:
    // (24 * 28.000) + (18 * 22.000) + (12 * 25.000) + (8 * 35.000)
    // = 672.000 + 396.000 + 300.000 + 280.000 = 1.648.000
    expect(result.totalOmzet).toBe(1648000)

    // Total BoM COGS:
    // (24 * 9.200) + (18 * 4.800) + (12 * 8.500) + (8 * 12.000)
    // = 220.800 + 86.400 + 102.000 + 96.000 = 505.200
    expect(result.totalBomCogs).toBe(505200)

    // Gross Profit: 1.648.000 - 505.200 = 1.142.800
    expect(result.grossProfit).toBe(1142800)
    expect(result.grossMarginPercent).toBeCloseTo(69.34, 1)
  })

  it('deducts 20% online delivery commission ONLY on delivery channel items', () => {
    const result = calculateShiftBomMargin({
      soldItems: DEFAULT_SHIFT_SOLD_ITEMS,
      ojolCommissionRate: 0.20
    })

    // Delivery items in DEFAULT_SHIFT_SOLD_ITEMS:
    // 18x Americano (Rp 396.000) + 8x Truffle Fries (Rp 280.000) = Rp 676.000
    expect(result.totalOjolSales).toBe(676000)

    // 20% commission on Rp 676.000 = Rp 135.200
    expect(result.ojolCommission).toBe(135200)

    // Net Operational Margin: 1.648.000 - 135.200 (ojol) - 505.200 (cogs) = 1.007.600
    expect(result.netOperationalMargin).toBe(1007600)
    expect(result.netMarginPercent).toBeCloseTo(61.14, 1)
  })

  it('factors cash shortage into final shift settlement profit', () => {
    // Scenario: Cashier short by Rp 50.000 in physical cash drawer
    const result = calculateShiftBomMargin({
      soldItems: DEFAULT_SHIFT_SOLD_ITEMS,
      cashVariance: -50000,
      ojolCommissionRate: 0.20
    })

    expect(result.cashVariance).toBe(-50000)
    expect(result.netOperationalMargin).toBe(1007600)
    // Final Settlement = 1.007.600 - 50.000 = 957.600
    expect(result.finalSettlementProfit).toBe(957600)
  })

  it('handles zero sales edge case gracefully with 0% margin and zero divisions', () => {
    const emptyResult = calculateShiftBomMargin({
      soldItems: [],
      cashVariance: 0
    })

    expect(emptyResult.totalOmzet).toBe(0)
    expect(emptyResult.totalBomCogs).toBe(0)
    expect(emptyResult.grossProfit).toBe(0)
    expect(emptyResult.grossMarginPercent).toBe(0)
    expect(emptyResult.netOperationalMargin).toBe(0)
    expect(emptyResult.netMarginPercent).toBe(0)
    expect(emptyResult.ingredientUsages).toHaveLength(0)
  })
})
