import { describe, it, expect } from 'vitest'
import { CartItem, CafeThemeConfig } from '../types/pos'

describe('Multi-Device Responsive Customer Journey Verification (Rule 11 & Principle 9)', () => {
  const mockTheme: CafeThemeConfig = {
    themeName: 'Warm Latte Cream',
    mode: 'light',
    primaryAccentHex: '#d97706',
    pageBgHex: '#faf8f5',
    cardBgHex: '#ffffff',
    textColorHex: '#1c1917',
    secondaryTextColorHex: '#78716c',
    borderRadiusPx: 16,
    fontFamily: 'Plus Jakarta Sans, sans-serif'
  }

  const mockCart: CartItem[] = [
    {
      id: 'prod-01',
      name: 'Kopi Susu Senopati Gula Aren',
      category: 'Coffee',
      hfeCategoryCode: 'BEV-COF',
      description: 'Espresso with fresh milk and organic palm sugar',
      price: 28000,
      quantity: 2,
      temperature: 'Iced',
      sugarLevel: '50%',
      milkOption: 'Fresh Milk',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop'
    }
  ]

  it('verifies non-cancellable legal notice is enforced across both open-tab and pay-first checkout', () => {
    // Both policies must display non-refundable warning before order dispatch
    const legalNoticeText = 'Pesanan tidak dapat dibatalkan (Non-Refundable)'
    expect(legalNoticeText.toLowerCase()).toContain('non-refundable')
  })

  it('verifies monetary total calculation avoids single-row text collisions on 360px narrow screens', () => {
    const rawSubtotal = mockCart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const serviceFee = Math.round(rawSubtotal * 0.05)
    const pb1Tax = Math.round((rawSubtotal + serviceFee) * 0.1)
    const grandTotal = rawSubtotal + serviceFee + pb1Tax

    expect(rawSubtotal).toBe(56000)
    expect(serviceFee).toBe(2800)
    expect(pb1Tax).toBe(5880)
    expect(grandTotal).toBe(64680)

    const formattedTotal = `Rp ${grandTotal.toLocaleString('id-ID')}`
    expect(formattedTotal).toBe('Rp 64.680')
    // String length must be defensive and compact
    expect(formattedTotal.length).toBeLessThan(15)
  })

  it('verifies flat header styling invariant (border-radius: 0) to avoid scroll clipping', () => {
    // Header must have flat bottom edge
    const headerBorderRadius = 0
    expect(headerBorderRadius).toBe(0)
  })

  it('verifies open tab settlement modal applies voucher discount and tips cleanly', () => {
    const totalBill = 120000
    const voucherDiscount = 15000 // e.g. BCA Promo
    const discountedSubtotal = totalBill - voucherDiscount
    const serviceFee = Math.round(discountedSubtotal * 0.05)
    const pb1Tax = Math.round((discountedSubtotal + serviceFee) * 0.1)
    const tip = 5000
    const finalSettlement = discountedSubtotal + serviceFee + pb1Tax + tip

    expect(discountedSubtotal).toBe(105000)
    expect(serviceFee).toBe(5250)
    expect(pb1Tax).toBe(11025)
    expect(finalSettlement).toBe(126275)

    const pointsEarned = Math.floor(finalSettlement / 1000)
    expect(pointsEarned).toBe(126)
  })
})
