import { describe, it, expect } from 'vitest'
import {
  getTierMultiplier,
  getTierForLifetimeSpend,
  calculateVoucherDiscount,
  isItemContainsAllergen,
  filterMenuItemsByAllergen,
  Voucher,
  LoyaltyTier,
  AllergenFlag,
} from '../hooks/useLoyalty'
import { MenuItem } from '../types/pos'

describe('Loyalty Tier & Point Multiplier Engine', () => {
  it('assigns correct tier based on lifetime spend thresholds', () => {
    expect(getTierForLifetimeSpend(0)).toBe('Bronze')
    expect(getTierForLifetimeSpend(499999)).toBe('Bronze')
    expect(getTierForLifetimeSpend(500000)).toBe('Silver')
    expect(getTierForLifetimeSpend(1999999)).toBe('Silver')
    expect(getTierForLifetimeSpend(2000000)).toBe('Gold')
    expect(getTierForLifetimeSpend(4999999)).toBe('Gold')
    expect(getTierForLifetimeSpend(5000000)).toBe('Platinum')
    expect(getTierForLifetimeSpend(15000000)).toBe('Platinum')
  })

  it('calculates point multiplier for each tier level', () => {
    expect(getTierMultiplier('Bronze')).toBe(1.0)
    expect(getTierMultiplier('Silver')).toBe(1.25)
    expect(getTierMultiplier('Gold')).toBe(1.5)
    expect(getTierMultiplier('Platinum')).toBe(2.0)
  })

  it('calculates accrued points correctly using tier multiplier', () => {
    const subtotal = 100000 // Rp 100.000
    // Formula: Math.floor((subtotal / 1000) * multiplier)
    expect(Math.floor((subtotal / 1000) * getTierMultiplier('Bronze'))).toBe(100)
    expect(Math.floor((subtotal / 1000) * getTierMultiplier('Silver'))).toBe(125)
    expect(Math.floor((subtotal / 1000) * getTierMultiplier('Gold'))).toBe(150)
    expect(Math.floor((subtotal / 1000) * getTierMultiplier('Platinum'))).toBe(200)
  })
})

describe('Voucher Wallet & Promo Discount Engine', () => {
  const voucherBirthday: Voucher = {
    code: 'VOUCHER-BIRTHDAY',
    title: 'Voucher Ulang Tahun',
    description: 'Diskon Rp 25.000',
    discountType: 'fixed',
    discountValue: 25000,
    minSpend: 50000,
    expiresAt: '2026-12-31',
  }

  const voucherDisc10Pct: Voucher = {
    code: 'VOUCHER-DISC10PCT',
    title: 'Diskon 10%',
    description: 'Diskon 10% All Varian',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 30000,
    expiresAt: '2026-12-31',
  }

  const voucherFreeUpgrade: Voucher = {
    code: 'VOUCHER-FREEUPGRADE',
    title: 'Gratis Upgrade Size',
    description: 'Hemat Rp 5.000',
    discountType: 'upgrade',
    discountValue: 5000,
    minSpend: 20000,
    expiresAt: '2026-12-31',
  }

  it('calculates fixed discount VOUCHER-BIRTHDAY (Rp 25.000)', () => {
    // Meets min spend 50k
    expect(calculateVoucherDiscount(voucherBirthday, 60000)).toBe(25000)
    // Capped by subtotal if subtotal < discountValue
    expect(calculateVoucherDiscount({ ...voucherBirthday, minSpend: 10000 }, 20000)).toBe(20000)
  })

  it('calculates percentage discount VOUCHER-DISC10PCT (10%)', () => {
    // 10% of 150,000 = 15,000
    expect(calculateVoucherDiscount(voucherDisc10Pct, 150000)).toBe(15000)
    // 10% of 35,000 = 3,500
    expect(calculateVoucherDiscount(voucherDisc10Pct, 35000)).toBe(3500)
  })

  it('calculates size upgrade discount VOUCHER-FREEUPGRADE (Rp 5.000)', () => {
    expect(calculateVoucherDiscount(voucherFreeUpgrade, 25000)).toBe(5000)
  })

  it('returns 0 discount when subtotal is below minimum spend threshold', () => {
    // Birthday voucher requires 50k min spend, subtotal is 40k
    expect(calculateVoucherDiscount(voucherBirthday, 40000)).toBe(0)
    // 10% voucher requires 30k min spend, subtotal is 20k
    expect(calculateVoucherDiscount(voucherDisc10Pct, 20000)).toBe(0)
  })

  it('returns 0 discount for null voucher', () => {
    expect(calculateVoucherDiscount(null, 100000)).toBe(0)
  })
})

describe('Customer Allergen Filtering Engine', () => {
  const sampleMenu: (MenuItem & { allergens?: AllergenFlag[] })[] = [
    {
      id: 'M1',
      name: 'Iced Oat Milk Latte',
      category: 'Coffee',
      hfeCategoryCode: 'CAT-COFFEE',
      price: 35000,
      image: '',
      description: 'Espresso dengan oat milk segar dan gula aren',
      milkOption: 'Oat Milk (+Rp 5.000)',
      allergens: [],
    },
    {
      id: 'M2',
      name: 'Whole Milk Cappuccino',
      category: 'Coffee',
      hfeCategoryCode: 'CAT-COFFEE',
      price: 30000,
      image: '',
      description: 'Espresso disajikan dengan susu sapi segar (fresh milk lactose)',
      milkOption: 'Whole Milk',
      allergens: ['lactose'],
    },
    {
      id: 'M3',
      name: 'Hazelnut Almond Croissant',
      category: 'Pastry',
      hfeCategoryCode: 'CAT-PASTRY',
      price: 28000,
      image: '',
      description: 'Croissant renyah dengan isian selai kacang hazelnut dan potongan almond',
      allergens: ['nuts', 'gluten'],
    },
    {
      id: 'M4',
      name: 'Black Americano',
      category: 'Coffee',
      hfeCategoryCode: 'CAT-COFFEE',
      price: 22000,
      image: '',
      description: 'Double shot espresso murni tanpa campuran susu atau gula',
      allergens: [],
    },
    {
      id: 'M5',
      name: 'Grilled Seafood Toast',
      category: 'Snack',
      hfeCategoryCode: 'CAT-SNACK',
      price: 45000,
      image: '',
      description: 'Roti bakar isi daging udang dan kepiting segar',
      allergens: ['seafood', 'gluten'],
    },
  ]

  it('detects allergen keywords accurately in menu items', () => {
    // Lactose detection
    expect(isItemContainsAllergen(sampleMenu[1], ['lactose'])).toBe(true) // Whole Milk
    expect(isItemContainsAllergen(sampleMenu[3], ['lactose'])).toBe(false) // Black Americano

    // Nuts detection
    expect(isItemContainsAllergen(sampleMenu[2], ['nuts'])).toBe(true) // Almond / Hazelnut
    expect(isItemContainsAllergen(sampleMenu[0], ['nuts'])).toBe(false) // Oat Milk

    // Gluten detection
    expect(isItemContainsAllergen(sampleMenu[2], ['gluten'])).toBe(true) // Croissant
    expect(isItemContainsAllergen(sampleMenu[3], ['gluten'])).toBe(false) // Black Americano

    // Seafood detection
    expect(isItemContainsAllergen(sampleMenu[4], ['seafood'])).toBe(true) // Udang & kepiting
  })

  it('handles grey-out display mode by tagging isDisabledAllergen without removing items', () => {
    const result = filterMenuItemsByAllergen(sampleMenu, ['lactose', 'nuts'], 'grey-out')

    expect(result.items.length).toBe(5) // All 5 items retained
    expect(result.hiddenCount).toBe(0)

    // Cappuccino (lactose) & Croissant (nuts/lactose) should be disabled
    const cappuccino = result.items.find(i => i.id === 'M2')
    const croissant = result.items.find(i => i.id === 'M3')
    const americano = result.items.find(i => i.id === 'M4')

    expect(cappuccino?.isDisabledAllergen).toBe(true)
    expect(croissant?.isDisabledAllergen).toBe(true)
    expect(americano?.isDisabledAllergen).toBe(false)
  })

  it('handles hide display mode by removing allergen items from list', () => {
    const result = filterMenuItemsByAllergen(sampleMenu, ['lactose', 'nuts'], 'hide')

    // M2 (lactose) and M3 (nuts & keju) removed -> 3 items remain (M1, M4, M5)
    expect(result.items.length).toBe(3)
    expect(result.hiddenCount).toBe(2)
    expect(result.items.some(i => i.id === 'M2')).toBe(false)
    expect(result.items.some(i => i.id === 'M3')).toBe(false)
    expect(result.items.some(i => i.id === 'M4')).toBe(true)
  })

  it('returns original list when no allergens are selected', () => {
    const result = filterMenuItemsByAllergen(sampleMenu, [], 'hide')
    expect(result.items.length).toBe(5)
    expect(result.hiddenCount).toBe(0)
  })
})
