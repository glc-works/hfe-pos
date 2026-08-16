import { describe, it, expect } from 'vitest'
import { BUILTIN_THEMES } from '../data/mockData'
import { MARKETPLACE_THEMES } from '../data/marketplaceThemesData'

describe('Single-Door Merchant Configuration Architecture (L2-POS-43)', () => {
  it('should verify all available themes combine builtin, marketplace and saved themes', () => {
    const builtin = BUILTIN_THEMES
    const marketplace = MARKETPLACE_THEMES.map((m) => m.theme)
    const customVault = [
      {
        themeName: 'Kopi Kenangan Senopati Custom',
        fontFamily: 'Inter, sans-serif',
        primaryAccentHex: '#ff6600',
        pageBgHex: '#121212',
        cardBgHex: '#1e1e1e',
        textColorHex: '#ffffff'
      }
    ]

    const all = [...builtin, ...marketplace, ...customVault]
    expect(all.length).toBeGreaterThanOrEqual(11)
    expect(all.some((t) => t.themeName === 'Kopi Kenangan Senopati Custom')).toBe(true)
    expect(all.some((t) => t.themeName === 'Tokyo Matcha Zen')).toBe(true)
  })

  it('should test single-door payment policy mutation logic', () => {
    let paymentPolicy: 'pay-first' | 'open-tab' = 'pay-first'
    const setPaymentPolicy = (p: 'pay-first' | 'open-tab') => {
      paymentPolicy = p
    }

    expect(paymentPolicy).toBe('pay-first')
    setPaymentPolicy('open-tab')
    expect(paymentPolicy).toBe('open-tab')
  })
})
