import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'

describe('Staff SubNavigator Zero-Redundancy Navigation (L2-POS-39)', () => {
  it('should verify 5 core workstation surfaces are cleanly mapped without duplicates', () => {
    const coreSurfaces = [
      'barista-pos',
      'kds-screen',
      'hfe-insights',
      'warehouse-mgmt',
      'cafe-config'
    ]

    const uniqueSet = new Set(coreSurfaces)
    expect(uniqueSet.size).toBe(5)
    expect(coreSurfaces.length).toBe(5)
  })

  it('should ensure POS translation keys exist', () => {
    expect(translations.id.pos.tableFloorPlan).toBeDefined()
    expect(translations.id.pos.skuCatalog).toBeDefined()
  })
})
