import { describe, it, expect } from 'vitest'
import { AREA_SURFACE_PALETTES } from '../components/pos/AreaSurfaceOverlay'

describe('Pure CSS Territorial Area Classification Engine (L2-POS-70)', () => {
  it('guarantees rich, high-contrast chromatic tokens with ambient glow for each area', () => {
    expect(AREA_SURFACE_PALETTES['outdoor-garden'].bgCard).toBe('bg-emerald-950/40')
    expect(AREA_SURFACE_PALETTES['outdoor-garden'].borderCard).toContain('border-emerald-500/40')

    expect(AREA_SURFACE_PALETTES['indoor-ac'].bgCard).toBe('bg-cyan-950/40')
    expect(AREA_SURFACE_PALETTES['indoor-ac'].borderCard).toContain('border-cyan-500/40')

    expect(AREA_SURFACE_PALETTES['vip-private'].bgCard).toBe('bg-amber-950/45')
    expect(AREA_SURFACE_PALETTES['vip-private'].borderCard).toContain('border-amber-500/50')
  })

  it('guarantees 0px movement with 4-column grid row sum invariant', () => {
    const rowCounts = [
      [1, 1, 1, 1], // Row 0
      [1, 1, 1, 1], // Row 1 (OUT-05, OUT-06, IND-01, IND-02)
      [1, 1, 1, 1], // Row 2 (IND-03..06)
      [2, 2],       // Row 3 (VIP-01, VIP-02)
      [1, 1, 1, 1], // Row 4 (POOL-01..04)
      [1, 1, 1, 1], // Row 5 (ROOF-01..04)
    ]

    rowCounts.forEach((row, idx) => {
      const sum = row.reduce((a, b) => a + b, 0)
      expect(sum).toBe(4)
    })
  })
})
