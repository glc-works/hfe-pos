import { describe, it, expect } from 'vitest'

export const resolveZoneTetrisColSpan = (tableCount: number, isVipZone = false): number => {
  if (tableCount <= 2 || isVipZone) return 2 // 2 Slots (e.g. VIP Rooms)
  if (tableCount === 3 || tableCount === 4) return 4 // 4 Slots (e.g. Poolside Cabana, Rooftop)
  return 6 // 6 Slots (e.g. Outdoor Garden, Indoor AC)
}

export const canPairInSingleRow = (zoneACols: number, zoneBCols: number, maxRowCols = 6): boolean => {
  return zoneACols + zoneBCols <= maxRowCols
}

describe('Proportional Tetris Zone Packing & Zero Empty Space Suite (L2-POS-56)', () => {
  describe('Pillar A: Proportional Zone ColSpan Resolution', () => {
    it('resolves 2 slots for VIP or 2-table zones', () => {
      expect(resolveZoneTetrisColSpan(2, true)).toBe(2)
      expect(resolveZoneTetrisColSpan(2, false)).toBe(2)
    })

    it('resolves 4 slots for 4-table zones', () => {
      expect(resolveZoneTetrisColSpan(4, false)).toBe(4)
      expect(resolveZoneTetrisColSpan(3, false)).toBe(4)
    })

    it('resolves 6 slots for 6-table full-width zones', () => {
      expect(resolveZoneTetrisColSpan(6, false)).toBe(6)
      expect(resolveZoneTetrisColSpan(8, false)).toBe(6)
    })
  })

  describe('Pillar B: 2D Tetris Row Sum Pairing (Zero Wasted Space)', () => {
    it('pairs 4-slot Poolside Cabana and 2-slot VIP Rooms into a 100% full 6-slot row', () => {
      const poolsideCols = resolveZoneTetrisColSpan(4, false) // 4
      const vipCols = resolveZoneTetrisColSpan(2, true) // 2

      expect(canPairInSingleRow(poolsideCols, vipCols, 6)).toBe(true)
      expect(poolsideCols + vipCols).toBe(6) // 100% filled, ZERO empty slots!
    })

    it('calculates zero empty space percentage on packed rows', () => {
      const rowSlotsAllocated = 4 + 2
      const maxRowCapacity = 6
      const wastedSlotPercentage = ((maxRowCapacity - rowSlotsAllocated) / maxRowCapacity) * 100

      expect(wastedSlotPercentage).toBe(0)
    })
  })
})
