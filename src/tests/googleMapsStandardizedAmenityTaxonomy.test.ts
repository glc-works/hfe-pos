import { describe, it, expect } from 'vitest'
import { STANDARD_AMENITIES_CATALOG, DEFAULT_MERCHANT_AMENITY_TAGS } from '../data/amenityCatalog'
import { DEFAULT_STOREFRONT_CUSTOMIZATION } from '../data/defaultStorefrontCustomization'

describe('Google Maps Standardized Amenity Taxonomy', () => {
  it('defines valid standard amenities with localized labels and official icons', () => {
    expect(STANDARD_AMENITIES_CATALOG.length).toBeGreaterThanOrEqual(10)
    
    STANDARD_AMENITIES_CATALOG.forEach(amenity => {
      expect(amenity.id).toBeDefined()
      expect(amenity.icon).toBeDefined()
      expect(amenity.labelId.length).toBeGreaterThan(0)
      expect(amenity.labelEn.length).toBeGreaterThan(0)
      expect(['connectivity', 'comfort', 'parking', 'facilities', 'dietary', 'services']).toContain(amenity.category)
    })
  })

  it('provides default merchant amenity tags compliant with Google Maps places structure', () => {
    expect(DEFAULT_MERCHANT_AMENITY_TAGS).toContain('wifi_high_speed')
    expect(DEFAULT_MERCHANT_AMENITY_TAGS).toContain('power_outlets')
    expect(DEFAULT_MERCHANT_AMENITY_TAGS).toContain('ac_indoor')
    expect(DEFAULT_STOREFRONT_CUSTOMIZATION.amenityTags).toEqual(DEFAULT_MERCHANT_AMENITY_TAGS)
  })
})
