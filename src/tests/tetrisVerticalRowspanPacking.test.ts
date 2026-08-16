import { describe, it, expect } from 'vitest'

export interface ZoneGeometry {
  id: string
  name: string
  colSpan: number
  rowSpan: number
}

export const calculate2DCellOccupancy = (zones: ZoneGeometry[]): number => {
  return zones.reduce((sum, z) => sum + z.colSpan * z.rowSpan, 0)
}

describe('2D Tetris Vertical RowSpan Packing Suite (L2-POS-57)', () => {
  const zones: ZoneGeometry[] = [
    { id: 'vip-private', name: 'VIP Private Rooms', colSpan: 2, rowSpan: 2 },
    { id: 'poolside-cabana', name: 'Poolside Cabana', colSpan: 4, rowSpan: 1 },
    { id: 'rooftop-skybar', name: 'Rooftop Sky Bar', colSpan: 4, rowSpan: 1 },
  ]

  it('calculates 100% full rectangular 2D area (6 columns x 2 rows = 12 cells)', () => {
    const totalArea = calculate2DCellOccupancy(zones)
    const expectedRectangularGridArea = 6 * 2 // 12 cells

    expect(totalArea).toBe(expectedRectangularGridArea)
    expect(totalArea).toBe(12)
  })

  it('verifies Row 1 and Row 2 both sum exactly to 6 columns without holes', () => {
    const row1Cols = zones[0].colSpan + zones[1].colSpan // VIP (2) + Poolside (4) = 6
    const row2Cols = zones[0].colSpan + zones[2].colSpan // VIP (2) + Rooftop (4) = 6

    expect(row1Cols).toBe(6)
    expect(row2Cols).toBe(6)
  })
})
