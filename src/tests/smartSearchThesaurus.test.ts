import { describe, it, expect } from 'vitest'
import { smartSearchFilter, getSmartSearchSuggestion, matchesCategoryThesaurus } from '../utils/searchThesaurus'
import { MenuItem } from '../types/pos'

describe('Smart Semantic Search & Multilingual Thesaurus Suite (L2-POS-79)', () => {
  const sampleMenu: MenuItem[] = [
    { id: 'item-1', name: 'Espresso Aren Latte', price: 28000, category: 'Coffee', hfeCategoryCode: 'COF-01', image: '', description: 'Authentic espresso' },
    { id: 'item-2', name: 'Japanese Cold Brew V60', price: 35000, category: 'Coffee', hfeCategoryCode: 'COF-02', image: '', description: 'Artisan cold drip' },
    { id: 'item-3', name: 'Uji Matcha Oat Latte', price: 34000, category: 'Non-Coffee', hfeCategoryCode: 'MAT-01', image: '', description: 'Matcha green tea' },
    { id: 'item-4', name: 'Croissant Butter Paris', price: 25000, category: 'Pastry', hfeCategoryCode: 'PAS-01', image: '', description: 'Flaky baked pastry' },
    { id: 'item-5', name: 'Truffle Fries with Garlic Dip', price: 38000, category: 'Snack', hfeCategoryCode: 'SNK-01', image: '', description: 'Crispy potato fries' },
    { id: 'item-6', name: 'Nasi Goreng Wagyu', price: 65000, category: 'Main Course', hfeCategoryCode: 'FOD-01', image: '', description: 'Wagyu fried rice' }
  ]

  it('matches bilingual category synonyms accurately', () => {
    expect(matchesCategoryThesaurus('Coffee', 'kopi')).toBe(true)
    expect(matchesCategoryThesaurus('Coffee', 'espresso')).toBe(true)
    expect(matchesCategoryThesaurus('Pastry', 'roti')).toBe(true)
    expect(matchesCategoryThesaurus('Snack', 'kentang')).toBe(true)
    expect(matchesCategoryThesaurus('Snack', 'cemilan')).toBe(true)
    expect(matchesCategoryThesaurus('Main Course', 'makanan')).toBe(true)
    expect(matchesCategoryThesaurus('Non-Coffee', 'teh')).toBe(true)
  })

  it('correctly filters all coffee items when searching localized keyword "kopi"', () => {
    const results = smartSearchFilter(sampleMenu, 'kopi', 'all')
    expect(results.length).toBe(2)
    expect(results.map(r => r.name)).toContain('Espresso Aren Latte')
    expect(results.map(r => r.name)).toContain('Japanese Cold Brew V60')
  })

  it('correctly filters pastry items when searching localized keyword "roti"', () => {
    const results = smartSearchFilter(sampleMenu, 'roti', 'all')
    expect(results.length).toBe(1)
    expect(results[0].name).toBe('Croissant Butter Paris')
  })

  it('correctly filters snack items when searching localized keyword "kentang" or "cemilan"', () => {
    const resultsKentang = smartSearchFilter(sampleMenu, 'kentang', 'all')
    expect(resultsKentang.length).toBe(1)
    expect(resultsKentang[0].name).toBe('Truffle Fries with Garlic Dip')

    const resultsCemilan = smartSearchFilter(sampleMenu, 'cemilan', 'all')
    expect(resultsCemilan.length).toBe(1)
    expect(resultsCemilan[0].name).toBe('Truffle Fries with Garlic Dip')
  })

  it('provides 1-tap smart category recommendations when search query matches a category synonym', () => {
    const categories = ['all', 'Coffee', 'Non-Coffee', 'Pastry', 'Snack', 'Main Course']
    const suggestionKopi = getSmartSearchSuggestion('kopi', categories)
    expect(suggestionKopi).not.toBeNull()
    expect(suggestionKopi?.suggestedCategory).toBe('Coffee')

    const suggestionRoti = getSmartSearchSuggestion('roti', categories)
    expect(suggestionRoti).not.toBeNull()
    expect(suggestionRoti?.suggestedCategory).toBe('Pastry')
  })
})
