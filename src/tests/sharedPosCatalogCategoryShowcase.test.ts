import { describe, it, expect } from 'vitest'
import { getCategoryGlyph } from '../components/pos/PosCatalogGrid'
import { MenuItem } from '../types/pos'

describe('Shared POS Catalog Category Showcase & In-Page Search Suite (L2-POS-78)', () => {
  const sampleMenu: MenuItem[] = [
    { id: 'item-1', name: 'Espresso Aren Latte', price: 28000, category: 'Coffee', hfeCategoryCode: 'COF-01', image: '', description: 'Espresso with aren sugar' },
    { id: 'item-2', name: 'Japanese Cold Brew V60', price: 35000, category: 'Coffee', hfeCategoryCode: 'COF-02', image: '', description: 'Cold drip artisan' },
    { id: 'item-3', name: 'Uji Matcha Oat Latte', price: 34000, category: 'Non-Coffee', hfeCategoryCode: 'MAT-01', image: '', description: 'Kyoto matcha' },
    { id: 'item-4', name: 'Croissant Butter Paris', price: 25000, category: 'Pastry', hfeCategoryCode: 'PAS-01', image: '', description: 'Flaky pastry' },
    { id: 'item-5', name: 'Truffle Fries with Garlic Dip', price: 38000, category: 'Snack', hfeCategoryCode: 'SNK-01', image: '', description: 'Crispy fries' }
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

  it('filters catalog accurately by in-page search query (name and category code)', () => {
    const searchByName = sampleMenu.filter(item =>
      item.name.toLowerCase().includes('matcha') || item.hfeCategoryCode.toLowerCase().includes('matcha')
    )
    expect(searchByName.length).toBe(1)
    expect(searchByName[0].id).toBe('item-3')

    const searchByCode = sampleMenu.filter(item =>
      item.name.toLowerCase().includes('pas-01') || item.hfeCategoryCode.toLowerCase().includes('pas-01')
    )
    expect(searchByCode.length).toBe(1)
    expect(searchByCode[0].name).toBe('Croissant Butter Paris')
  })

  it('filters catalog accurately by 1-tap category showcase selection', () => {
    const coffeeItems = sampleMenu.filter(item => item.category === 'Coffee')
    expect(coffeeItems.length).toBe(2)

    const pastryItems = sampleMenu.filter(item => item.category === 'Pastry')
    expect(pastryItems.length).toBe(1)
    expect(pastryItems[0].name).toBe('Croissant Butter Paris')
  })
})
