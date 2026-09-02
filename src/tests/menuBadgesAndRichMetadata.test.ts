import { describe, it, expect } from 'vitest'
import { getBadgeMeta } from '../components/shared/ProductCard'
import { MenuItem } from '../types/pos'
import { PRODUCT_CATALOG } from '../data/mockData'

describe('Menu Badges, Rich Metadata & Smart Search Suite (POS-ENG-STD-001)', () => {
  it('should return correct badge metadata for all 5 governed badge types', () => {
    const seasonal = getBadgeMeta('seasonal')
    expect(seasonal?.label).toBe('🍂 Menu Musiman')
    expect(seasonal?.glyph).toBe('🍂')
    expect(seasonal?.className).toContain('text-amber-700')

    const chef = getBadgeMeta('chef_recommendation')
    expect(chef?.label).toBe('👨‍🍳 Pilihan Chef')
    expect(chef?.glyph).toBe('👨‍🍳')
    expect(chef?.className).toContain('text-purple-700')

    const bestSeller = getBadgeMeta('best_seller')
    expect(bestSeller?.label).toBe('🔥 Menu Terlaris')
    expect(bestSeller?.glyph).toBe('🔥')
    expect(bestSeller?.className).toContain('text-emerald-700')

    const newArrival = getBadgeMeta('new_arrival')
    expect(newArrival?.label).toBe('✨ Menu Baru')
    expect(newArrival?.glyph).toBe('✨')
    expect(newArrival?.className).toContain('text-sky-700')

    const signature = getBadgeMeta('signature')
    expect(signature?.label).toBe('👑 Kreasi Signature')
    expect(signature?.glyph).toBe('👑')
    expect(signature?.className).toContain('text-rose-700')

    expect(getBadgeMeta(undefined)).toBeNull()
  })

  it('should verify sample products in mockData have structured badges and rich metadata', () => {
    const arenas = PRODUCT_CATALOG.find(p => p.id === 'MN-001')
    expect(arenas?.badge).toBe('best_seller')
    expect(arenas?.badgeStory).toBeDefined()
    expect(arenas?.tastingNotes).toContain('Gula Aren')
    expect(arenas?.originInfo).toBeDefined()

    const coldBrew = PRODUCT_CATALOG.find(p => p.id === 'MN-002')
    expect(coldBrew?.badge).toBe('chef_recommendation')
    expect(coldBrew?.tastingNotes).toContain('Peach')
    expect(coldBrew?.dietaryTags).toContain('vegan')

    const hojicha = PRODUCT_CATALOG.find(p => p.id === 'MN-009')
    expect(hojicha?.badge).toBe('seasonal')
    expect(hojicha?.badgeStory).toContain('Musiman')
  })

  it('should support full-spectrum search matching badge keywords and tasting notes', () => {
    const searchFilter = (items: MenuItem[], query: string) => {
      const q = query.toLowerCase().trim()
      return items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(q)
        const descMatch = Boolean(item.description && item.description.toLowerCase().includes(q))
        const catMatch = item.category.toLowerCase().includes(q)
        const originMatch = Boolean(item.originInfo && item.originInfo.toLowerCase().includes(q))
        const notesMatch = Boolean(item.tastingNotes && item.tastingNotes.some(n => n.toLowerCase().includes(q)))
        const badgeMatch = Boolean(item.badge && (
          item.badge.toLowerCase().includes(q) ||
          (item.badge === 'seasonal' && (q.includes('musim') || q.includes('season'))) ||
          (item.badge === 'chef_recommendation' && (q.includes('chef') || q.includes('rekomendasi') || q.includes('pilihan'))) ||
          (item.badge === 'best_seller' && (q.includes('favorit') || q.includes('laris') || q.includes('best') || q.includes('top'))) ||
          (item.badge === 'new_arrival' && (q.includes('baru') || q.includes('new'))) ||
          (item.badge === 'signature' && (q.includes('signature') || q.includes('khas')))
        ))
        return nameMatch || descMatch || catMatch || originMatch || notesMatch || badgeMatch
      })
    }

    // Searching 'musiman' should return Hojicha
    const seasonalResults = searchFilter(PRODUCT_CATALOG, 'musiman')
    expect(seasonalResults.some(p => p.id === 'MN-009')).toBe(true)

    // Searching 'chef' should return Japanese Cold Brew
    const chefResults = searchFilter(PRODUCT_CATALOG, 'chef')
    expect(chefResults.some(p => p.id === 'MN-002')).toBe(true)

    // Searching 'Peach' tasting note should return Japanese Cold Brew
    const peachResults = searchFilter(PRODUCT_CATALOG, 'peach')
    expect(peachResults.some(p => p.id === 'MN-002')).toBe(true)
  })
})
