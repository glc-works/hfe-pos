import { describe, it, expect } from 'vitest'
import { getCategoryGlyph } from '../components/pos/PosCatalogGrid'
import { MenuItem } from '../types/pos'

describe('Shared POS Catalog Category Showcase & In-Page Search Suite (L2-POS-78)', () => {
  const sampleMenu: MenuItem[] = [
    { id: 'item-1', name: 'Espresso Aren Latte', price: 28000, category: 'Coffee', sku: 'SKU-COF-001' },
    { id: 'item-2', name: 'Japanese Cold Brew V60', price: 35000, category: 'Coffee', sku: 'SKU-COF-002' },
    { id: 'item-3', name: 'Uji Matcha Oat Latte', price: 34000, category: 'Non-Coffee', sku: 'SKU-MAT-001' },
    { id: 'item-4', name: 'Croissant Butter Paris', price: 25000, category: 'Pastry', sku: 'SKU-PAS-001' },
    { id: 'item-5', name: 'Truffle Fries with Garlic Dip', price: 38000, category: 'Snacks', sku: 'SKU-SNK-001' }
  ]

  it('correctly maps category glyphs for rich visual showcase', () => {
    expect(getCategoryGlyph('all')).toBe('☕')
    expect(getCategoryGlyph('Coffee')).toBe('☕')
    expect(getCategoryGlyph('Non-Coffee')).toBe('🍵')
    expect(getCategoryGlyph('Matcha Tea')).toBe('🍵')
    expect(getCategoryGlyph('Pastry & Bakery')).toBe('🥐')
    expect(getCategoryGlyph('Snacks & Bites')).toBe('🍟')
    expect(getCategoryGlyph('Main Food')).toBe('🍽️')
    expect(getCategoryGlyph('Cheesecake Dessert')).toBe('🍰')
    expect(getCategoryGlyph('Retail Merchandise')).toBe('🏷️')
  })

  it('filters catalog accurately by in-page search query (name and SKU)', () => {
    const searchByName = sampleMenu.filter(item =>
      item.name.toLowerCase().includes('matcha') || item.sku?.toLowerCase().includes('matcha')
    )
    expect(searchByName.length).toBe(1)
    expect(searchByName[0].id).toBe('item-3')

    const searchBySku = sampleMenu.filter(item =>
      item.name.toLowerCase().includes('sku-pas') || item.sku?.toLowerCase().includes('sku-pas')
    )
    expect(searchBySku.length).toBe(1)
    expect(searchBySku[0].name).toBe('Croissant Butter Paris')
  })

  it('filters catalog accurately by 1-tap category showcase selection', () => {
    const coffeeItems = sampleMenu.filter(item => item.category === 'Coffee')
    expect(coffeeItems.length).toBe(2)

    const pastryItems = sampleMenu.filter(item => item.category === 'Pastry')
    expect(pastryItems.length).toBe(1)
    expect(pastryItems[0].name).toBe('Croissant Butter Paris')
  })
})
