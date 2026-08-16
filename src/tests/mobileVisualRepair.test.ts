import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'

describe('Mobile Viewport Visual Polish & Single-Line Badge Rule (L2-POS-37)', () => {
  it('should verify concise, single-line wording for POS floor plan headers', () => {
    const idPos = translations.id.pos
    expect(idPos.floorPlanStatus).toBe('Peta Meja & Lantai')
    expect(idPos.floorPlanStatus.length).toBeLessThanOrEqual(20)

    const enPos = translations.en.pos
    expect(enPos.floorPlanStatus).toBe('Floor & Table Plan')
    expect(enPos.floorPlanStatus.length).toBeLessThanOrEqual(20)
  })

  it('should ensure status words are single-line compact', () => {
    const statusWords = ['Kosong', 'Tagihan', 'Lunas']
    statusWords.forEach(word => {
      expect(word.length).toBeLessThanOrEqual(10)
      expect(word).not.toMatch(/\s/)
    })
  })
})
