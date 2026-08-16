import { describe, it, expect } from 'vitest'

export const resolveFloorPlanCanvasSlots = (viewMode: 'grid' | 'compact') => {
  if (viewMode === 'grid') {
    return {
      masterSlots: 4,
      gridClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      standardSlotSpan: 1, // 25% of row width
      vipSlotSpan: 2,      // 50% of row width (2x1)
    }
  }

  return {
    masterSlots: 6,
    gridClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
    standardSlotSpan: 1, // High density Tetris packing
    vipSlotSpan: 1,      // Desktop Tetris single slot
  }
}

describe('Strict 4-Slot Grid View & 6-Slot Compact View Canvas Suite (L2-POS-64)', () => {
  it('strictly locks Grid View to a 4-column canvas across all zones', () => {
    const canvas = resolveFloorPlanCanvasSlots('grid')

    expect(canvas.masterSlots).toBe(4)
    expect(canvas.gridClass).toContain('lg:grid-cols-4')
    expect(canvas.standardSlotSpan).toBe(1)
    expect(canvas.vipSlotSpan).toBe(2)
  })

  it('strictly locks Compact View to a 6-column Tetris canvas', () => {
    const canvas = resolveFloorPlanCanvasSlots('compact')

    expect(canvas.masterSlots).toBe(6)
    expect(canvas.gridClass).toContain('lg:grid-cols-6')
  })
})
