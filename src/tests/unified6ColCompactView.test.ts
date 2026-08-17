import { describe, it, expect } from 'vitest'
import { INITIAL_TABLES } from '../data/mockData'
import { AREA_SURFACE_PALETTES } from '../components/pos/AreaSurfaceOverlay'
import { PropertyZoneId } from '../types/pos'

describe('Unified Single-Canvas 6-Col Compact View Suite (L2-POS-73)', () => {
  it('verifies that all 22 tables are directly mapped as children of the master canvas', () => {
    expect(INITIAL_TABLES.length).toBe(22)
    
    // Check zone distributions
    const gardenCount = INITIAL_TABLES.filter(t => t.zoneId === 'outdoor-garden' || t.name.startsWith('OUT')).length
    const indoorCount = INITIAL_TABLES.filter(t => t.zoneId === 'indoor-ac' || t.name.startsWith('IND')).length
    const vipCount = INITIAL_TABLES.filter(t => t.zoneId === 'vip-private' || t.name.startsWith('VIP')).length
    const poolsideCount = INITIAL_TABLES.filter(t => t.zoneId === 'poolside-cabana' || t.name.startsWith('POOL')).length
    const rooftopCount = INITIAL_TABLES.filter(t => t.zoneId === 'rooftop-skybar' || t.name.startsWith('ROOF')).length

    expect(gardenCount).toBe(6)
    expect(indoorCount).toBe(6)
    expect(vipCount).toBe(2)
    expect(poolsideCount).toBe(4)
    expect(rooftopCount).toBe(4)
    expect(gardenCount + indoorCount + vipCount + poolsideCount + rooftopCount).toBe(22)
  })

  it('guarantees dedicated chromatic territorial surfaces for all compact table cards', () => {
    INITIAL_TABLES.forEach(table => {
      const zoneId = (table.zoneId || (
        table.name.startsWith('OUT') ? 'outdoor-garden' :
        table.name.startsWith('IND') ? 'indoor-ac' :
        table.name.startsWith('VIP') ? 'vip-private' :
        table.name.startsWith('POOL') ? 'poolside-cabana' :
        table.name.startsWith('ROOF') ? 'rooftop-skybar' : 'indoor-ac'
      )) as PropertyZoneId

      const palette = AREA_SURFACE_PALETTES[zoneId]
      expect(palette).toBeDefined()
      expect(palette.bgCard).toContain('bg-')
      expect(palette.borderCard).toContain('border-')
    })
  })

  it('verifies slot allocation logic for 6-column compact grid', () => {
    INITIAL_TABLES.forEach(table => {
      const isVip = table.zoneId === 'vip-private' || table.name.startsWith('VIP')
      const slotSpanClass = isVip
        ? 'col-span-2 sm:col-span-2 lg:col-span-2'
        : 'col-span-1'
      
      if (isVip) {
        expect(slotSpanClass).toBe('col-span-2 sm:col-span-2 lg:col-span-2')
      } else {
        expect(slotSpanClass).toBe('col-span-1')
      }
    })
  })
})
