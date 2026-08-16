import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'

describe('i18n & Multi-Language Localization Engine', () => {
  it('should have complete translations for both Indonesian (id) and English (en)', () => {
    expect(translations.id).toBeDefined()
    expect(translations.en).toBeDefined()

    // Top-level sections match
    const idKeys = Object.keys(translations.id).sort()
    const enKeys = Object.keys(translations.en).sort()
    expect(idKeys).toEqual(enKeys)
  })

  it('should have non-empty strings across all common and pos keys', () => {
    expect(translations.id.common.search).toBe('Cari...')
    expect(translations.en.common.search).toBe('Search...')

    expect(translations.id.pos.tableFloorPlan).toContain('Peta Meja')
    expect(translations.en.pos.tableFloorPlan).toContain('Floor Plan')

    expect(translations.id.pos.skuCatalog).toContain('Katalog Menu')
    expect(translations.en.pos.skuCatalog).toContain('Menu Catalog')

    expect(translations.id.cart.cashierCart).toBe('Keranjang Kasir')
    expect(translations.en.cart.cashierCart).toBe('Cashier Cart')

    expect(translations.id.cart.exactCash).toBe('Uang Pas')
    expect(translations.en.cart.exactCash).toBe('Exact Cash')
  })

  it('should properly support fine-dining KDS course pacing keys', () => {
    expect(translations.id.kds.coursePacingTitle).toBeDefined()
    expect(translations.en.kds.coursePacingTitle).toBeDefined()
    expect(translations.id.kds.holdCourse).toContain('Hold')
    expect(translations.en.kds.holdCourse).toContain('Hold')
    expect(translations.id.kds.fireCourse).toContain('Fire Course')
    expect(translations.en.kds.fireCourse).toContain('Fire Course')
  })

  it('should have matching key structure in nested translation dictionaries', () => {
    for (const section of Object.keys(translations.id) as (keyof typeof translations.id)[]) {
      const idSectionKeys = Object.keys(translations.id[section]).sort()
      const enSectionKeys = Object.keys(translations.en[section]).sort()
      expect(idSectionKeys).toEqual(enSectionKeys)
    }
  })
})
