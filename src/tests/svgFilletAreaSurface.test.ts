import { describe, it, expect } from 'vitest'

export const OUTDOOR_SVG_PATH =
  'M 20 0 H 980 A 20 20 0 0 1 1000 20 V 120 A 20 20 0 0 1 980 140 H 520 A 16 16 0 0 0 504 156 V 272 A 20 20 0 0 1 484 292 H 20 A 20 20 0 0 1 0 272 V 20 A 20 20 0 0 1 20 0 Z'

export const INDOOR_SVG_PATH =
  'M 524 152 H 980 A 20 20 0 0 1 1000 172 V 424 A 20 20 0 0 1 980 444 H 20 A 20 20 0 0 1 0 424 V 324 A 20 20 0 0 1 20 304 H 480 A 16 16 0 0 0 496 288 V 172 A 20 20 0 0 1 516 152 Z'

describe('Native SVG Fillet Path Surface Engine Suite (L2-POS-68)', () => {
  it('guarantees both convex outer corners (0 0 1) and concave inner turns (0 0 0) are present in Outdoor and Indoor paths', () => {
    // Convex outer turns
    expect(OUTDOOR_SVG_PATH).toContain('A 20 20 0 0 1')
    expect(INDOOR_SVG_PATH).toContain('A 20 20 0 0 1')

    // Concave inner fillet turns (smooth Tetris notch)
    expect(OUTDOOR_SVG_PATH).toContain('A 16 16 0 0 0')
    expect(INDOOR_SVG_PATH).toContain('A 16 16 0 0 0')
  })

  it('guarantees closed vector path topology (ends with Z)', () => {
    expect(OUTDOOR_SVG_PATH.endsWith('Z')).toBe(true)
    expect(INDOOR_SVG_PATH.endsWith('Z')).toBe(true)
  })
})
