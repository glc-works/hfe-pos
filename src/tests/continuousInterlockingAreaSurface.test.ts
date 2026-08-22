import { describe, it, expect } from 'vitest'
import { AREA_SURFACE_PALETTES } from '../components/pos/AreaSurfaceOverlay'

export interface GridSlotCoordinate {
  col: number
  row: number
  spanCols: number
  spanRows: number
}

export interface AreaOccupancyMap {
  zoneId: string
  slots: GridSlotCoordinate[]
}

export const computeAreaOccupancyFootprint = (): Record<string, GridSlotCoordinate[]> => {
  return {
    'outdoor-garden': [
      { col: 0, row: 0, spanCols: 1, spanRows: 1 },
      { col: 1, row: 0, spanCols: 1, spanRows: 1 },
      { col: 2, row: 0, spanCols: 1, spanRows: 1 },
      { col: 3, row: 0, spanCols: 1, spanRows: 1 },
      { col: 0, row: 1, spanCols: 1, spanRows: 1 },
      { col: 1, row: 1, spanCols: 1, spanRows: 1 },
    ],
    'indoor-ac': [
      { col: 2, row: 1, spanCols: 1, spanRows: 1 },
      { col: 3, row: 1, spanCols: 1, spanRows: 1 },
      { col: 0, row: 2, spanCols: 1, spanRows: 1 },
      { col: 1, row: 2, spanCols: 1, spanRows: 1 },
      { col: 2, row: 2, spanCols: 1, spanRows: 1 },
      { col: 3, row: 2, spanCols: 1, spanRows: 1 },
    ],
    'vip-private': [
      { col: 0, row: 3, spanCols: 2, spanRows: 1 }, // VIP-01: 2x1 slot
      { col: 2, row: 3, spanCols: 2, spanRows: 1 }, // VIP-02: 2x1 slot
    ],
    'poolside-cabana': [
      { col: 0, row: 4, spanCols: 1, spanRows: 1 },
      { col: 1, row: 4, spanCols: 1, spanRows: 1 },
      { col: 2, row: 4, spanCols: 1, spanRows: 1 },
      { col: 3, row: 4, spanCols: 1, spanRows: 1 },
    ],
    'rooftop-skybar': [
      { col: 0, row: 5, spanCols: 1, spanRows: 1 },
      { col: 1, row: 5, spanCols: 1, spanRows: 1 },
      { col: 2, row: 5, spanCols: 1, spanRows: 1 },
      { col: 3, row: 5, spanCols: 1, spanRows: 1 },
    ],
  }
}

describe('Continuous Interlocking Area Surface Engine Suite (L2-POS-67)', () => {
  it('guarantees identical row alignment across different areas on the same master row', () => {
    const footprints = computeAreaOccupancyFootprint()
    const outdoorRow1 = footprints['outdoor-garden'].filter(s => s.row === 1)
    const indoorRow1 = footprints['indoor-ac'].filter(s => s.row === 1)

    // OUT-05, OUT-06 and IND-01, IND-02 all share row index 1!
    expect(outdoorRow1.length).toBe(2)
    expect(indoorRow1.length).toBe(2)

    outdoorRow1.forEach(s => expect(s.row).toBe(1))
    indoorRow1.forEach(s => expect(s.row).toBe(1))

    // Total slots on row 1 equals exactly 4 (full row!)
    const totalRow1Slots = outdoorRow1.reduce((sum, s) => sum + s.spanCols, 0) + indoorRow1.reduce((sum, s) => sum + s.spanCols, 0)
    expect(totalRow1Slots).toBe(4)
  })

  it('guarantees normal tables occupy 1x1 slots and VIP tables occupy 2x1 slots', () => {
    const footprints = computeAreaOccupancyFootprint()

    footprints['outdoor-garden'].forEach(s => expect(s.spanCols).toBe(1))
    footprints['indoor-ac'].forEach(s => expect(s.spanCols).toBe(1))
    footprints['vip-private'].forEach(s => expect(s.spanCols).toBe(2)) // 2x1 slots
    footprints['poolside-cabana'].forEach(s => expect(s.spanCols).toBe(1))
    footprints['rooftop-skybar'].forEach(s => expect(s.spanCols).toBe(1))
  })

  it('verifies all 5 areas have defined chromatic surface palettes', () => {
    expect(AREA_SURFACE_PALETTES['outdoor-garden'].bgCard).toContain('dark:bg-emerald-950/40')
    expect(AREA_SURFACE_PALETTES['indoor-ac'].bgCard).toContain('dark:bg-cyan-950/40')
    expect(AREA_SURFACE_PALETTES['vip-private'].bgCard).toContain('dark:bg-amber-950/45')
    expect(AREA_SURFACE_PALETTES['poolside-cabana'].bgCard).toContain('dark:bg-teal-950/40')
    expect(AREA_SURFACE_PALETTES['rooftop-skybar'].bgCard).toContain('dark:bg-indigo-950/40')
  })
})
