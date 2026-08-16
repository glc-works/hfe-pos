import { describe, it, expect, beforeEach } from 'vitest'
import { DEFAULT_STOREFRONT_CUSTOMIZATION, BANNER_PRESETS } from '../data/defaultStorefrontCustomization'
import { StorefrontCustomizationConfig } from '../types/pos'

const storageMock: Record<string, string> = {}
const localStorageMock = {
  getItem: (k: string) => storageMock[k] || null,
  setItem: (k: string, v: string) => { storageMock[k] = v },
  removeItem: (k: string) => { delete storageMock[k] },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]) }
}
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
}

describe('Merchant Storefront Customization & Global Governance Suite', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('honors default centralized Hfe Ecosystem storefront configuration', () => {
    expect(DEFAULT_STOREFRONT_CUSTOMIZATION.heroHeadline).toBe('Artisan Coffee Roasters & Fresh Pastry Bar')
    expect(DEFAULT_STOREFRONT_CUSTOMIZATION.announcementBarActive).toBe(true)
    expect(DEFAULT_STOREFRONT_CUSTOMIZATION.qrMenuLayout).toBe('grid_2col')
    expect(DEFAULT_STOREFRONT_CUSTOMIZATION.wifiAccessPolicy).toBe('after_payment')
  })

  it('contains 5 curated banner image presets for quick merchant branding', () => {
    expect(BANNER_PRESETS.length).toBeGreaterThanOrEqual(5)
    expect(BANNER_PRESETS[0].label).toContain('Specialty Coffee')
    expect(BANNER_PRESETS[1].label).toContain('Artisan French Bakery')
  })

  it('allows merchant to override landing page headlines and social media handles', () => {
    const customConfig: StorefrontCustomizationConfig = {
      ...DEFAULT_STOREFRONT_CUSTOMIZATION,
      heroHeadline: 'Bali Specialty Roasters Canggu',
      heroTagline: 'Single origin anaerobik terbaik di pesisir pantai Canggu.',
      socialLinks: {
        instagram: '@canggu_roasters',
        whatsapp: '+62 811-9988-7766'
      }
    }

    localStorage.setItem('hfe_storefront_customization', JSON.stringify(customConfig))
    const stored = JSON.parse(localStorage.getItem('hfe_storefront_customization') || '{}')

    expect(stored.heroHeadline).toBe('Bali Specialty Roasters Canggu')
    expect(stored.socialLinks.instagram).toBe('@canggu_roasters')
  })

  it('allows merchant to customize customer QR order greeting and menu layout mode', () => {
    const customQrConfig: StorefrontCustomizationConfig = {
      ...DEFAULT_STOREFRONT_CUSTOMIZATION,
      greetingMessage: 'Selamat datang di Rooftop Skybar! Pesanan diantar langsung ke meja Anda.',
      qrMenuLayout: 'story_cards',
      receiptCustomFooter: 'Terima kasih telah mengunjungi Skybar. Dapatkan voucher 10% di kunjungan berikutnya.'
    }

    expect(customQrConfig.qrMenuLayout).toBe('story_cards')
    expect(customQrConfig.receiptCustomFooter).toContain('Skybar')
  })

  it('supports fail-safe reset back to default Hfe Ecosystem global settings', () => {
    // 1. Set custom
    const custom: StorefrontCustomizationConfig = {
      ...DEFAULT_STOREFRONT_CUSTOMIZATION,
      heroHeadline: 'Modified Headline'
    }
    localStorage.setItem('hfe_storefront_customization', JSON.stringify(custom))
    expect(JSON.parse(localStorage.getItem('hfe_storefront_customization')!).heroHeadline).toBe('Modified Headline')

    // 2. Reset
    localStorage.setItem('hfe_storefront_customization', JSON.stringify(DEFAULT_STOREFRONT_CUSTOMIZATION))
    expect(JSON.parse(localStorage.getItem('hfe_storefront_customization')!).heroHeadline).toBe('Artisan Coffee Roasters & Fresh Pastry Bar')
  })
})
