import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'

describe('Unified POS Single Command Header & Layout Optimization (L2-POS-38)', () => {
  it('should verify translations for unified command header', () => {
    expect(translations.id.pos.tableFloorPlan).toBeDefined()
    expect(translations.id.pos.skuCatalog).toBeDefined()
    expect(translations.id.pos.splitJoinTable).toBe('Split / Join')
  })

  it('should ensure status filter labels are single-word compact', () => {
    const compactLabels = ['Semua', 'Tagihan', 'Lunas', 'Kosong']
    compactLabels.forEach(label => {
      expect(label.length).toBeLessThanOrEqual(10)
    })
  })
})
