import { describe, it, expect } from 'vitest'
import { calculateCartTotals, CartItemMath } from '../services/hfeApi'

describe('Cart Financial Math & PB1 Tax Engine', () => {
  it('calculates raw subtotal accurately including milk add-ons', () => {
    const cart: CartItemMath[] = [
      { price: 28000, quantity: 2, milkOption: 'Oat Milk (+Rp 5.000)' }, // (28000 + 5000) * 2 = 66000
      { price: 35000, quantity: 1, milkOption: 'Whole Milk' },           // 35000 * 1 = 35000
    ]

    const totals = calculateCartTotals(cart, 0, 0, 0, 0, 0)
    expect(totals.rawSubtotal).toBe(101000)
    expect(totals.totalCartCount).toBe(3)
  })

  it('applies voucher & promo discounts correctly before tax and service fee', () => {
    const cart: CartItemMath[] = [
      { price: 50000, quantity: 2 }, // 100,000
    ]

    const promoDiscount = 10000
    const voucherDiscount = 10000
    const totals = calculateCartTotals(cart, 1, 5, 0, promoDiscount, voucherDiscount)

    expect(totals.rawSubtotal).toBe(100000)
    expect(totals.totalDiscount).toBe(20000)
    expect(totals.discountedSubtotal).toBe(80000)
  })

  it('calculates PB1 Tax Mode 0 (Disabled)', () => {
    const cart: CartItemMath[] = [{ price: 100000, quantity: 1 }]
    const totals = calculateCartTotals(cart, 0, 5, 5000, 0, 0)

    expect(totals.discountedSubtotal).toBe(100000)
    expect(totals.calculatedServiceFee).toBe(5000) // 5% of 100,000
    expect(totals.calculatedPB1Tax).toBe(0)
    expect(totals.grandTotalBill).toBe(110000) // 100k + 5k service + 5k tip
  })

  it('calculates PB1 Tax Mode 1 (Exclude - 10% Added on top)', () => {
    const cart: CartItemMath[] = [{ price: 100000, quantity: 1 }]
    const totals = calculateCartTotals(cart, 1, 5, 5000, 0, 0)

    expect(totals.discountedSubtotal).toBe(100000)
    expect(totals.calculatedServiceFee).toBe(5000) // 5%
    expect(totals.calculatedPB1Tax).toBe(10000)    // 10% of 100,000
    expect(totals.grandTotalBill).toBe(120000)     // 100k + 5k service + 10k tax + 5k tip
  })

  it('calculates PB1 Tax Mode 2 (Include - 10% Embedded in price)', () => {
    const cart: CartItemMath[] = [{ price: 110000, quantity: 1 }]
    const totals = calculateCartTotals(cart, 2, 5, 5000, 0, 0)

    expect(totals.discountedSubtotal).toBe(110000)
    expect(totals.calculatedServiceFee).toBe(5500) // 5% of 110,000
    // Embedded PB1 Tax: 110,000 - (110,000 / 1.10) = 10,000
    expect(totals.calculatedPB1Tax).toBe(10000)
    // Mode 2 does NOT add PB1 tax on top of subtotal for grand total:
    expect(totals.grandTotalBill).toBe(120500) // 110k subtotal + 5.5k service + 5k tip
  })

  it('handles empty cart without negative or NaN results', () => {
    const totals = calculateCartTotals([], 1, 5, 0, 5000, 5000)
    expect(totals.rawSubtotal).toBe(0)
    expect(totals.discountedSubtotal).toBe(0)
    expect(totals.calculatedServiceFee).toBe(0)
    expect(totals.calculatedPB1Tax).toBe(0)
    expect(totals.grandTotalBill).toBe(0)
  })
})
