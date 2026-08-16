import { describe, it, expect } from 'vitest'
import { PRODUCT_CATALOG } from '../data/mockData'
import { translations } from '../i18n/translations'

describe('Anti-Bleeding Typography & Single-Line Heuristics (L2-POS-30)', () => {
  it('should ensure payment methods in ID and EN are compact single-word labels', () => {
    const idCart = translations.id.cart
    const enCart = translations.en.cart

    // Check payment method buttons are concise
    expect(idCart.payCash).toBe('Cash')
    expect(idCart.payQris).toBe('QRIS')
    expect(idCart.payCard).toBe('Kartu')

    expect(enCart.payCash).toBe('Cash')
    expect(enCart.payQris).toBe('QRIS')
    expect(enCart.payCard).toBe('Card')

    // None should contain line breaks or parenthesized wraps
    expect(idCart.payCard.length).toBeLessThanOrEqual(8)
    expect(enCart.payCard.length).toBeLessThanOrEqual(8)
  })

  it('should ensure catalog menu titles are concise and prevent multi-line overflow', () => {
    PRODUCT_CATALOG.forEach(item => {
      expect(item.name.length).toBeLessThanOrEqual(35)
      expect(item.price).toBeGreaterThan(0)
    })

    const chocolate = PRODUCT_CATALOG.find(i => i.id === 'MN-010')
    expect(chocolate?.name).toBe('Dark Chocolate 70%')
  })
})
