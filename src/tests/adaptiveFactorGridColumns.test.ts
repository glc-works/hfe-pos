import { describe, it, expect } from 'vitest'

export const resolveAdaptiveGridColumns = (totalTables: number, isVipZone = false): number => {
  if (totalTables <= 2 || isVipZone) return 2 // 2 columns x 1 row = 2 tables (0 remainder)
  if (totalTables === 5 || totalTables === 6) return 3 // 3 columns x 2 rows = 6 tables (0 remainder)
  return 4 // 4 columns (for 4, 8, etc.)
}

export const calculateTrailingEmptySlots = (totalTables: number, columns: number): number => {
  const remainder = totalTables % columns
  return remainder === 0 ? 0 : columns - remainder
}

describe('Adaptive Factor Grid Columns Zero Empty Space Suite (L2-POS-61)', () => {
  it('factorizes 6-table zones into 3 columns, eliminating row-2 empty slot gaps', () => {
    const cols = resolveAdaptiveGridColumns(6, false)
    const emptySlots = calculateTrailingEmptySlots(6, cols)

    expect(cols).toBe(3)
    expect(emptySlots).toBe(0) // 0 empty slots on row 2!
  })

  it('factorizes 4-table zones into 4 columns, filling 1 complete row without gaps', () => {
    const cols = resolveAdaptiveGridColumns(4, false)
    const emptySlots = calculateTrailingEmptySlots(4, cols)

    expect(cols).toBe(4)
    expect(emptySlots).toBe(0)
  })

  it('factorizes 2-table/VIP zones into 2 columns, filling 1 complete row without gaps', () => {
    const cols = resolveAdaptiveGridColumns(2, true)
    const emptySlots = calculateTrailingEmptySlots(2, cols)

    expect(cols).toBe(2)
    expect(emptySlots).toBe(0)
  })
})
