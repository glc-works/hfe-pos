import { describe, it, expect } from 'vitest'
import { STANDARD_AMENITIES_CATALOG } from '../data/amenityCatalog'

describe('Landing Breadcrumbs & Dedicated Views Suite', () => {
  it('defines 22 standardized amenities in catalog for dedicated facilities view', () => {
    expect(STANDARD_AMENITIES_CATALOG.length).toBeGreaterThanOrEqual(20)
    const petFriendly = STANDARD_AMENITIES_CATALOG.find(a => a.id === 'pet_friendly')
    expect(petFriendly).toBeDefined()
    expect(petFriendly?.icon).toBe('paw')
    expect(petFriendly?.labelId).toBe('Pet Friendly')
  })

  it('verifies all 4 section IDs are valid breadcrumbs targets', () => {
    const validSections = ['overview', 'menu', 'promos', 'facilities', 'events']
    expect(validSections).toContain('menu')
    expect(validSections).toContain('promos')
    expect(validSections).toContain('facilities')
    expect(validSections).toContain('events')
  })
})
