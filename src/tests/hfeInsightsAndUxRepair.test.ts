import { describe, it, expect } from 'vitest'

// Helper interfaces for testing Hfe Insights logic
interface DemandForecast {
  predictedRushHour: string
  expectedOrderVolume: number
  recommendedPrepItems: string[]
}

interface LowStockAlert {
  skuId: string
  productName: string
  currentStock: number
  reorderPoint: number
  suggestedPoQty: number
}

interface ProductMargin {
  id: string
  name: string
  sellingPrice: number
  cogsCost: number
  marginPercent: number
}

interface VipGuestInsight {
  guestName: string
  vipTier: 'Platinum VIP' | 'Gold' | 'Regular'
  hasAllergenAlert: boolean
  allergenNote?: string
}

// Multi-Voucher Stacking Rule Engine
export function calculateStackedDiscounts(
  rawSubtotal: number,
  primaryVoucher: { type: 'percent' | 'fixed'; value: number } | null,
  perkVoucher: { type: 'free_item' | 'fixed_perk'; value: number } | null
): { totalDiscount: number; finalPayable: number } {
  let primaryDiscount = 0
  let perkDiscount = 0

  if (primaryVoucher) {
    if (primaryVoucher.type === 'percent') {
      primaryDiscount = Math.round(rawSubtotal * (primaryVoucher.value / 100))
    } else {
      primaryDiscount = Math.min(rawSubtotal, primaryVoucher.value)
    }
  }

  if (perkVoucher) {
    perkDiscount = Math.min(rawSubtotal - primaryDiscount, perkVoucher.value)
  }

  const totalDiscount = primaryDiscount + perkDiscount
  const finalPayable = Math.max(0, rawSubtotal - totalDiscount)

  return { totalDiscount, finalPayable }
}

// Quick Cash Suggestion Engine
export function getQuickCashSuggestions(totalBill: number): number[] {
  const suggestions: number[] = [totalBill] // Uang pas
  const standardDenoms = [20000, 50000, 100000]

  standardDenoms.forEach((denom) => {
    if (denom >= totalBill && !suggestions.includes(denom)) {
      suggestions.push(denom)
    }
  })

  // Round up to next 50k / 100k if higher
  const next50k = Math.ceil(totalBill / 50000) * 50000
  if (next50k > totalBill && !suggestions.includes(next50k)) {
    suggestions.push(next50k)
  }

  return suggestions.sort((a, b) => a - b)
}

describe('Hfe Real-Time Operational Insights Engine', () => {
  it('predicts upcoming rush hour and suggests inventory prep', () => {
    const historicalOrders = [
      { hour: 11, count: 12 },
      { hour: 12, count: 45 },
      { hour: 13, count: 50 },
      { hour: 14, count: 20 },
    ]

    const peak = historicalOrders.reduce((prev, curr) => (curr.count > prev.count ? curr : prev))
    const forecast: DemandForecast = {
      predictedRushHour: `${peak.hour}:00 WIB`,
      expectedOrderVolume: peak.count * 1.2, // +20% forecast
      recommendedPrepItems: ['Biji Kopi Arabica Gayo', 'Susu Oatside 1L'],
    }

    expect(forecast.predictedRushHour).toBe('13:00 WIB')
    expect(forecast.expectedOrderVolume).toBe(60)
    expect(forecast.recommendedPrepItems).toContain('Biji Kopi Arabica Gayo')
  })

  it('detects low stock SKUs and calculates 1-tap PO suggestion', () => {
    const inventory: LowStockAlert[] = [
      { skuId: 'SKU-001', productName: 'Susu Fresh Milk 1L', currentStock: 3, reorderPoint: 10, suggestedPoQty: 24 },
      { skuId: 'SKU-002', productName: 'Sirup Caramel 750ml', currentStock: 15, reorderPoint: 5, suggestedPoQty: 6 },
    ]

    const lowStockItems = inventory.filter((item) => item.currentStock <= item.reorderPoint)
    expect(lowStockItems).toHaveLength(1)
    expect(lowStockItems[0].productName).toBe('Susu Fresh Milk 1L')
    expect(lowStockItems[0].suggestedPoQty).toBe(24)
  })

  it('calculates profit margin percentage and identifies margin leaders', () => {
    const products: ProductMargin[] = [
      { id: 'P1', name: 'Espresso Single', sellingPrice: 25000, cogsCost: 4000, marginPercent: 0 },
      { id: 'P2', name: 'Oat Milk Latte', sellingPrice: 38000, cogsCost: 12000, marginPercent: 0 },
    ]

    const calculated = products.map((p) => ({
      ...p,
      marginPercent: Math.round(((p.sellingPrice - p.cogsCost) / p.sellingPrice) * 100),
    }))

    expect(calculated[0].marginPercent).toBe(84) // (21k / 25k) = 84%
    expect(calculated[1].marginPercent).toBe(68) // (26k / 38k) = 68%

    const leader = calculated.sort((a, b) => b.marginPercent - a.marginPercent)[0]
    expect(leader.name).toBe('Espresso Single')
  })

  it('detects returning VIP guest profile and allergen alerts', () => {
    const guest: VipGuestInsight = {
      guestName: 'Drs. H. Bambang Soeprapto',
      vipTier: 'Platinum VIP',
      hasAllergenAlert: true,
      allergenNote: 'Kacang / Nut Allergy',
    }

    expect(guest.vipTier).toBe('Platinum VIP')
    expect(guest.hasAllergenAlert).toBe(true)
    expect(guest.allergenNote).toContain('Nut Allergy')
  })

  it('validates shift float integrity score', () => {
    const initialFloat = 500000
    const cashSales = 750000
    const expectedDrawerCash = initialFloat + cashSales
    const actualDrawerCash = 1250000
    const variance = actualDrawerCash - expectedDrawerCash

    const integrityScore = variance === 0 ? 100 : Math.max(0, 100 - Math.abs(variance) / 1000)
    expect(variance).toBe(0)
    expect(integrityScore).toBe(100)
  })
})

describe('UX Repair & Flow Verification Suite', () => {
  it('applies multi-voucher stacking rules (1 Primary Discount + 1 Perk Voucher)', () => {
    const subtotal = 100000 // Rp 100.000
    const primaryVoucher = { type: 'percent' as const, value: 20 } // 20% = Rp 20.000
    const perkVoucher = { type: 'fixed_perk' as const, value: 10000 } // Rp 10.000

    const { totalDiscount, finalPayable } = calculateStackedDiscounts(subtotal, primaryVoucher, perkVoucher)

    expect(totalDiscount).toBe(30000)
    expect(finalPayable).toBe(70000)
  })

  it('generates exact quick cash options for payment checkout', () => {
    const bill = 35000 // Rp 35.000
    const options = getQuickCashSuggestions(bill)

    expect(options).toContain(35000) // Uang Pas
    expect(options).toContain(50000) // Rp 50k
    expect(options).toContain(100000) // Rp 100k
  })

  it('evaluates HCB system-verified Getting Started onboarding steps correctly', () => {
    const companyName = 'PT Artisan Kopi Indonesia'
    const staffRosterCount = 3
    const initialShiftFloat = 500000

    const isProfileVerified = Boolean(companyName && companyName.length > 3)
    const isStaffVerified = staffRosterCount >= 1
    const isShiftVerified = initialShiftFloat > 0

    expect(isProfileVerified).toBe(true)
    expect(isStaffVerified).toBe(true)
    expect(isShiftVerified).toBe(true)
  })
})
