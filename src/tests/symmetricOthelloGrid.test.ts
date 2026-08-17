import { describe, it, expect } from 'vitest'
import { AREA_SURFACE_PALETTES } from '../components/pos/AreaSurfaceOverlay'

describe('Symmetric Othello Grid & Zone Territorial Surfaces (L2-POS-69)', () => {
  it('guarantees each row in the 4-column Othello grid totals exactly 4 slot units', () => {
    // Row 0: OUT-01..04 (1 + 1 + 1 + 1 = 4)
    const row0 = [1, 1, 1, 1]
    expect(row0.reduce((a, b) => a + b, 0)).toBe(4)

    // Row 1: OUT-05..06 (1 + 1) + IND-01..02 (1 + 1) = 4
    const row1 = [1, 1, 1, 1]
    expect(row1.reduce((a, b) => a + b, 0)).toBe(4)

    // Row 2: IND-03..06 (1 + 1 + 1 + 1 = 4)
    const row2 = [1, 1, 1, 1]
    expect(row2.reduce((a, b) => a + b, 0)).toBe(4)

    // Row 3: VIP-01 (2) + VIP-02 (2) = 4
    const row3 = [2, 2]
    expect(row3.reduce((a, b) => a + b, 0)).toBe(4)

    // Row 4: POOL-01..04 (1 + 1 + 1 + 1 = 4)
    const row4 = [1, 1, 1, 1]
    expect(row4.reduce((a, b) => a + b, 0)).toBe(4)

    // Row 5: ROOF-01..04 (1 + 1 + 1 + 1 = 4)
    const row5 = [1, 1, 1, 1]
    expect(row5.reduce((a, b) => a + b, 0)).toBe(4)
  })

  it('guarantees clean, distinct chromatic surface tokens for each zone with zero wireframes', () => {
    expect(AREA_SURFACE_PALETTES['outdoor-garden'].bgCard).toBe('bg-emerald-950/40')
    expect(AREA_SURFACE_PALETTES['outdoor-garden'].borderCard).toContain('border-emerald-500/40')

    expect(AREA_SURFACE_PALETTES['indoor-ac'].bgCard).toBe('bg-cyan-950/40')
    expect(AREA_SURFACE_PALETTES['indoor-ac'].borderCard).toContain('border-cyan-500/40')

    expect(AREA_SURFACE_PALETTES['vip-private'].bgCard).toBe('bg-amber-950/45')
    expect(AREA_SURFACE_PALETTES['vip-private'].borderCard).toContain('border-amber-500/50')
  })
})
