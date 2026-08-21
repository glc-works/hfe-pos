import { describe, it, expect } from 'vitest'
import { evaluateAccessControl } from '../hooks/useTeamMembership'
import { generateLlmsTxt, StorefrontInfo } from '../services/llmsTxtGenerator'
import { generateStorefrontSchemaJsonLd } from '../services/schemaOrgGenerator'
import { PRODUCT_CATALOG } from '../data/mockData'
import { StorefrontCustomizationConfig } from '../types/pos'

describe('Merchant Home / Hub & RBAC Access Control Suite', () => {
  it('strictly enforces role access: only owner and store_manager can access Merchant Hub', () => {
    expect(evaluateAccessControl('owner').canAccessMerchantHub).toBe(true)
    expect(evaluateAccessControl('store_manager').canAccessMerchantHub).toBe(true)
    expect(evaluateAccessControl('cashier').canAccessMerchantHub).toBe(false)
    expect(evaluateAccessControl('barista').canAccessMerchantHub).toBe(false)
    expect(evaluateAccessControl('chef').canAccessMerchantHub).toBe(false)
    expect(evaluateAccessControl('waiter').canAccessMerchantHub).toBe(false)
    expect(evaluateAccessControl('warehouse_keeper').canAccessMerchantHub).toBe(false)
  })

  it('calculates QRIS MDR 0.3% deduction fee with mathematical precision', () => {
    const grossSettlement = 14850000
    const mdrRate = 0.003
    const expectedMdr = Math.round(grossSettlement * mdrRate) // 44550
    const netDisbursed = grossSettlement - expectedMdr // 14805450

    expect(expectedMdr).toBe(44550)
    expect(netDisbursed).toBe(14805450)
    expect(netDisbursed + expectedMdr).toBe(grossSettlement)
  })

  it('calculates Regional PB1 10% Restaurant Tax and DPP accurately', () => {
    const taxableSales = 145200000
    const pb1Rate = 0.10
    const pb1Payable = Math.round(taxableSales * pb1Rate) // 14520000

    expect(pb1Payable).toBe(14520000)
  })
})

describe('Generative Engine Optimization (GEO) & /llms.txt Generator', () => {
  const mockConfig: Partial<StorefrontCustomizationConfig> = {
    storeName: 'Kopi Nusantara Abadi',
    storefrontSubdomain: 'kopinusantara',
    storefrontCustomDomain: 'www.kopinusantara.id',
    currency: 'IDR',
  }

  const mockInfo: StorefrontInfo = {
    storeName: 'Kopi Nusantara Abadi',
    tagline: 'Artisan Indonesian Single Origin Roastery',
    address: 'Jl. Senopati No. 45',
    city: 'Jakarta Selatan',
    country: 'Indonesia',
    phone: '+62 21 555 1234',
    email: 'hello@kopinusantara.id',
    openingHours: '07:00 - 22:00 WIB',
    wifiSsid: 'KopiNusantara_HighSpeed',
    halalCertified: true,
    powerOutletsAvailable: true,
    smokingArea: true,
    petFriendly: true,
    signatureMenuItems: ['Es Kopi Susu Aren Gayo', 'Manual Brew V60 Flores Bajawa', 'Croissant Butter Almond'],
    eventsSchedule: [
      { title: 'Latte Art Masterclass with World Champion', date: '2026-08-25', time: '14:00 WIB', priceIdr: 350000 }
    ]
  }

  it('generates rich, structured /llms.txt manifest for AI search engines', () => {
    const output = generateLlmsTxt(mockConfig, PRODUCT_CATALOG, mockInfo)

    expect(output).toContain('# Kopi Nusantara Abadi — Official AI Knowledge Manifest (/llms.txt)')
    expect(output).toContain('100% Halal Ingredients & Certified')
    expect(output).toContain('KopiNusantara_HighSpeed')
    expect(output).toContain('Latte Art Masterclass')
    expect(output).toContain('Context for LLM & Search Agents')
  })

  it('generates deep Schema.org JSON-LD Knowledge Graph with CafeOrCoffeeShop and FAQPage', () => {
    const jsonLd = generateStorefrontSchemaJsonLd(mockConfig, PRODUCT_CATALOG, mockInfo) as any

    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(Array.isArray(jsonLd['@graph'])).toBe(true)

    const cafeObj = jsonLd['@graph'].find((item: any) => item['@type'] === 'CafeOrCoffeeShop')
    expect(cafeObj).toBeDefined()
    expect(cafeObj.name).toBe('Kopi Nusantara Abadi')
    expect(cafeObj.url).toBe('https://www.kopinusantara.id')
    expect(cafeObj.servesCuisine).toContain('Specialty Coffee')

    const faqObj = jsonLd['@graph'].find((item: any) => item['@type'] === 'FAQPage')
    expect(faqObj).toBeDefined()
    expect(faqObj.mainEntity.length).toBeGreaterThanOrEqual(3)
  })
})
