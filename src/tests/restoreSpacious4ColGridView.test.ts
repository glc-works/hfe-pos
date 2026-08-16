import { describe, it, expect } from 'vitest'

export interface ViewportLayoutSpecs {
  mode: 'grid' | 'compact' | 'list'
  masterCanvasType: 'stacked-flex' | 'dense-tetris-grid' | 'table'
  maxColumnsPerRow: number
  vipColSpan: number
  cardMinHeightPx: number
}

export const resolveFloorPlanLayoutSpecs = (mode: 'grid' | 'compact' | 'list'): ViewportLayoutSpecs => {
  if (mode === 'grid') {
    return {
      mode: 'grid',
      masterCanvasType: 'stacked-flex',
      maxColumnsPerRow: 4, // Spacious 4-column layout!
      vipColSpan: 2, // 2 generous columns for VIP
      cardMinHeightPx: 114,
    }
  }

  if (mode === 'compact') {
    return {
      mode: 'compact',
      masterCanvasType: 'dense-tetris-grid',
      maxColumnsPerRow: 6, // Dense 6-slot Tetris canvas!
      vipColSpan: 1,
      cardMinHeightPx: 72,
    }
  }

  return {
    mode: 'list',
    masterCanvasType: 'table',
    maxColumnsPerRow: 1,
    vipColSpan: 1,
    cardMinHeightPx: 44,
  }
}

describe('Restore Spacious 4-Column Grid View Suite (L2-POS-60)', () => {
  it('guarantees Grid View enforces spacious 4-column layout with 2-col VIP cards', () => {
    const gridSpecs = resolveFloorPlanLayoutSpecs('grid')

    expect(gridSpecs.maxColumnsPerRow).toBe(4)
    expect(gridSpecs.vipColSpan).toBe(2)
    expect(gridSpecs.masterCanvasType).toBe('stacked-flex')
    expect(gridSpecs.cardMinHeightPx).toBeGreaterThanOrEqual(110)
  })

  it('guarantees Compact View strictly preserves dense 6-slot Tetris canvas', () => {
    const compactSpecs = resolveFloorPlanLayoutSpecs('compact')

    expect(compactSpecs.maxColumnsPerRow).toBe(6)
    expect(compactSpecs.masterCanvasType).toBe('dense-tetris-grid')
    expect(compactSpecs.cardMinHeightPx).toBeLessThanOrEqual(76)
  })
})
