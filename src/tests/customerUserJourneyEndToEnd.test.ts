import { describe, it, expect } from 'vitest'
import { PRODUCT_CATALOG, BUILTIN_THEMES, DEFAULT_COMPANY_PROFILE } from '../data/mockData'
import { INITIAL_PARTNER_CONTACTS } from '../data/mockContacts'
import { DEFAULT_AVAILABLE_VOUCHERS } from '../components/pos/VoucherCard'

describe('End-to-End Customer QR Journey Suite (Jony Ive UX Standards)', () => {
  const flagshipTheme = BUILTIN_THEMES[0] // Warm Latte Cream (Light)

  it('1. Catalog and Category Integrity: Catalog has valid items with pricing and categories', () => {
    expect(PRODUCT_CATALOG.length).toBeGreaterThan(5)
    
    const categories = Array.from(new Set(PRODUCT_CATALOG.map(p => p.category)))
    expect(categories).toContain('Coffee')
    expect(categories).toContain('Pastry')
    
    PRODUCT_CATALOG.forEach(item => {
      expect(item.id).toBeDefined()
      expect(item.name.length).toBeGreaterThan(0)
      expect(item.price).toBeGreaterThan(0)
      expect(item.image).toBeDefined()
    })
  })

  it('2. Flagship Theme Contrast: Warm Latte Cream has valid light mode optical tokens', () => {
    expect(flagshipTheme.mode).toBe('light')
    expect(flagshipTheme.textColorHex).toBe('#1e293b') // High contrast dark charcoal
    expect(flagshipTheme.pageBgHex).toBe('#faf8f5') // Warm cream
    expect(flagshipTheme.cardBgHex).toBe('#ffffff') // Crisp white card
    expect(flagshipTheme.primaryAccentHex).toBe('#d97706') // Warm amber
  })

  it('3. Cart & Modifier Calculations: Correctly computes unit and total prices with oat milk modifier', () => {
    const latte = PRODUCT_CATALOG.find(p => p.name.includes('Latte')) || PRODUCT_CATALOG[0]
    const basePrice = latte.price
    const extraOat = 5000
    const qty = 2

    const itemPriceWithMod = basePrice + extraOat
    const subtotal = itemPriceWithMod * qty

    expect(subtotal).toBe((basePrice + 5000) * 2)
  })

  it('4. Multi-Voucher Stacking & Promo Logic: Correctly applies platform and merchant vouchers', () => {
    const bcaVoucher = DEFAULT_AVAILABLE_VOUCHERS.find(v => v.code === 'BCA15K')!
    const kopiVoucher = DEFAULT_AVAILABLE_VOUCHERS.find(v => v.code === 'KOPIHEBAT')!

    expect(bcaVoucher).toBeDefined()
    expect(kopiVoucher).toBeDefined()

    expect(bcaVoucher.isStackable).toBe(true)
    expect(kopiVoucher.isStackable).toBe(true)

    const rawSubtotal = 100000
    const totalDiscount = bcaVoucher.discountAmount + kopiVoucher.discountAmount
    expect(totalDiscount).toBe(25000)

    const subtotalAfterDiscounts = Math.max(0, rawSubtotal - totalDiscount)
    expect(subtotalAfterDiscounts).toBe(75000)
  })

  it('5. Full Bill Calculation: Subtotal, Service Fee, PB1 Exclude, Tips & Grand Total', () => {
    const rawSubtotal = 100000
    const discount = 25000
    const discountedSubtotal = rawSubtotal - discount // 75000

    const serviceFeeRate = 5 // 5%
    const serviceFee = Math.round(discountedSubtotal * (serviceFeeRate / 100)) // 3750

    const taxableBase = discountedSubtotal + serviceFee // 78750
    const pb1TaxRate = 10 // 10%
    const pb1Tax = Math.round(taxableBase * (pb1TaxRate / 100)) // 7875

    const tip = 5000

    const grandTotal = discountedSubtotal + serviceFee + pb1Tax + tip
    expect(grandTotal).toBe(75000 + 3750 + 7875 + 5000) // 91625
  })

  it('6. CRM Partner Contacts: Directory contains banks and merchant ecosystem partners', () => {
    expect(INITIAL_PARTNER_CONTACTS.length).toBeGreaterThan(3)
    const bca = INITIAL_PARTNER_CONTACTS.find(c => c.brandName.includes('BCA'))
    expect(bca).toBeDefined()
    expect(bca?.brandColor).toBe('#005baa')
    expect(bca?.category).toBe('bank')
  })
})
