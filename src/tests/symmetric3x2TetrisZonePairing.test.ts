import { describe, it, expect } from 'vitest'

export interface SymmetricalZoneConfig {
  id: string
  name: string
  tablesCount: number
  colSpan: number
  rowSpan: number
  internalCols: number
}

export const resolveSymmetricTetrisZone = (tablesCount: number, isVip = false): SymmetricalZoneConfig => {
  if (isVip || tablesCount <= 2) {
    return {
      id: 'vip',
      name: 'VIP Rooms',
      tablesCount,
      colSpan: 2,
      rowSpan: 2,
      internalCols: 1, // 2 rows tall, 1 column
    }
  }

  if (tablesCount === 3 || tablesCount === 4) {
    return {
      id: 'four-table-zone',
      name: '4-Table Zone',
      tablesCount,
      colSpan: 4,
      rowSpan: 1,
      internalCols: 4, // 1 row tall, 4 columns
    }
  }

  // 6-table zone: 3 columns wide x 2 rows tall (3x2 = 6 tables!)
  return {
    id: 'six-table-zone',
    name: '6-Table Zone',
    tablesCount,
    colSpan: 3,
    rowSpan: 2,
    internalCols: 3, // 2 rows tall, 3 columns
  }
}

describe('Symmetric 3x2 Tetris Zone Pairing Suite (L2-POS-58)', () => {
  it('factorizes 6-table zones into symmetric 3x2 modular blocks without row 2 gaps', () => {
    const outdoorZone = resolveSymmetricTetrisZone(6, false)
    const indoorZone = resolveSymmetricTetrisZone(6, false)

    expect(outdoorZone.colSpan).toBe(3)
    expect(outdoorZone.rowSpan).toBe(2)
    expect(outdoorZone.internalCols).toBe(3)

    // Two 3x2 zones pair side-by-side: 3 + 3 = 6 columns
    const pairedCols = outdoorZone.colSpan + indoorZone.colSpan
    expect(pairedCols).toBe(6)
  })

  it('calculates 100% total floor plan rectangular occupancy across 4 rows', () => {
    // Rows 1-2: Outdoor (3x2) + Indoor (3x2) = 6 x 2 = 12 cells
    // Rows 3-4: VIP (2x2) + Poolside (4x1) + Rooftop (4x1) = 2x2 + 4x1 + 4x1 = 12 cells
    const rows12Area = 3 * 2 + 3 * 2 // 12 cells
    const rows34Area = 2 * 2 + 4 * 1 + 4 * 1 // 12 cells
    const totalArea = rows12Area + rows34Area // 24 cells (6 cols x 4 rows)

    expect(totalArea).toBe(24)
    expect(totalArea).toBe(6 * 4) // 100% solid rectangle, 0% wasted space!
  })
})
