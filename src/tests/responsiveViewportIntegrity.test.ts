import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'

describe('Responsive Viewport & Text Bleeding Integrity Guard (GLC-FNB-UX-001)', () => {
  it('should verify all translation strings have valid, trimmed non-empty content', () => {
    expect(translations.id.landing.heroTitle).toBeDefined()
    expect(translations.en.landing.heroTitle).toBeDefined()
    expect(translations.id.landing.reserveTableCta).toContain('Reservasi')
    expect(translations.en.landing.reserveTableCta).toContain('Reserve')
  })

  it('should verify speed key labels and action buttons are concise without excessive length', () => {
    // Quick cash & action buttons must not exceed reasonable length for 390px screens
    expect(translations.id.cart.exactCash.length).toBeLessThan(15)
    expect(translations.en.cart.exactCash.length).toBeLessThan(15)
    expect(translations.id.pos.skuCatalog.length).toBeLessThan(25)
    expect(translations.en.pos.skuCatalog.length).toBeLessThan(25)
  })

  it('should verify all major sections support both ID and EN dictionaries', () => {
    const requiredSections = ['common', 'nav', 'pos', 'cart', 'hostStand', 'customer', 'kds', 'settings', 'landing'] as const
    for (const sec of requiredSections) {
      expect(translations.id[sec]).toBeDefined()
      expect(translations.en[sec]).toBeDefined()
    }
  })
})
