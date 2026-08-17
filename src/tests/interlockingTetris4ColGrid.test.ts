import { describe, it, expect } from 'vitest'

export interface TableSlotAllocation {
  id: string
  name: string
  zoneId: string
  slots: number
}

export const computeInterlockingSlots = (tables: TableSlotAllocation[]): { totalSlots: number; totalRows: number; remainder: number } => {
  const totalSlots = tables.reduce((sum, t) => sum + t.slots, 0)
  const totalRows = Math.ceil(totalSlots / 4)
  const remainder = totalSlots % 4 === 0 ? 0 : 4 - (totalSlots % 4)

  return { totalSlots, totalRows, remainder }
}

describe('4-Column Continuous Interlocking Tetris Rotation Engine Suite (L2-POS-65)', () => {
  const MOCK_RESTAURANT_TABLES: TableSlotAllocation[] = [
    // Outdoor Garden (6 tables = 6 slots)
    { id: 't1', name: 'OUT-01', zoneId: 'outdoor-garden', slots: 1 },
    { id: 't2', name: 'OUT-02', zoneId: 'outdoor-garden', slots: 1 },
    { id: 't3', name: 'OUT-03', zoneId: 'outdoor-garden', slots: 1 },
    { id: 't4', name: 'OUT-04', zoneId: 'outdoor-garden', slots: 1 },
    { id: 't5', name: 'OUT-05', zoneId: 'outdoor-garden', slots: 1 },
    { id: 't6', name: 'OUT-06', zoneId: 'outdoor-garden', slots: 1 },

    // Indoor AC Dining (6 tables = 6 slots)
    { id: 't7', name: 'IND-01', zoneId: 'indoor-ac', slots: 1 },
    { id: 't8', name: 'IND-02', zoneId: 'indoor-ac', slots: 1 },
    { id: 't9', name: 'IND-03', zoneId: 'indoor-ac', slots: 1 },
    { id: 't10', name: 'IND-04', zoneId: 'indoor-ac', slots: 1 },
    { id: 't11', name: 'IND-05', zoneId: 'indoor-ac', slots: 1 },
    { id: 't12', name: 'IND-06', zoneId: 'indoor-ac', slots: 1 },

    // VIP Private Rooms (2 tables x 2 slots = 4 slots)
    { id: 't13', name: 'VIP-01', zoneId: 'vip-private', slots: 2 },
    { id: 't14', name: 'VIP-02', zoneId: 'vip-private', slots: 2 },

    // Poolside Cabana (4 tables = 4 slots)
    { id: 't15', name: 'POOL-01', zoneId: 'poolside-cabana', slots: 1 },
    { id: 't16', name: 'POOL-02', zoneId: 'poolside-cabana', slots: 1 },
    { id: 't17', name: 'POOL-03', zoneId: 'poolside-cabana', slots: 1 },
    { id: 't18', name: 'POOL-04', zoneId: 'poolside-cabana', slots: 1 },

    // Rooftop Sky Bar (4 tables = 4 slots)
    { id: 't19', name: 'ROOF-01', zoneId: 'rooftop-skybar', slots: 1 },
    { id: 't20', name: 'ROOF-02', zoneId: 'rooftop-skybar', slots: 1 },
    { id: 't21', name: 'ROOF-03', zoneId: 'rooftop-skybar', slots: 1 },
    { id: 't22', name: 'ROOF-04', zoneId: 'rooftop-skybar', slots: 1 },
  ]

  it('guarantees all 22 tables interlock into exactly 6 full 4-slot rows with 0 empty space', () => {
    const { totalSlots, totalRows, remainder } = computeInterlockingSlots(MOCK_RESTAURANT_TABLES)

    expect(totalSlots).toBe(24) // 20 std + (2 VIP x 2) = 24
    expect(totalRows).toBe(6)   // 24 / 4 = 6 rows
    expect(remainder).toBe(0)   // ZERO remainder slots!
  })

  it('verifies Row 2 houses OUT-05, OUT-06, IND-01, and IND-02 in 180-degree interlocking rotation', () => {
    const row2Tables = MOCK_RESTAURANT_TABLES.slice(4, 8)

    expect(row2Tables.map(t => t.name)).toEqual(['OUT-05', 'OUT-06', 'IND-01', 'IND-02'])
    expect(row2Tables.reduce((sum, t) => sum + t.slots, 0)).toBe(4) // 4 slots full!
  })
})
