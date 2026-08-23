import { describe, it, expect } from 'vitest'
import { normalizeSurfaceHost } from '../utils/surfaceHost'

describe('normalizeSurfaceHost Utility Engine (Issue #56)', () => {
  it('strips staging and preview prefixes correctly', () => {
    expect(normalizeSurfaceHost('prv-pos.hfeit.app')).toBe('pos.hfeit.app')
    expect(normalizeSurfaceHost('prv.pos.hfeit.app')).toBe('pos.hfeit.app')
    expect(normalizeSurfaceHost('dev-board.hfeit.com')).toBe('board.hfeit.com')
    expect(normalizeSurfaceHost('dev.order.hfeit.com')).toBe('order.hfeit.com')
    expect(normalizeSurfaceHost('stg-card.hfeit.com')).toBe('card.hfeit.com')
    expect(normalizeSurfaceHost('stg.ledger.hfeit.com')).toBe('ledger.hfeit.com')
    expect(normalizeSurfaceHost('preview-hub.hfeit.com')).toBe('hub.hfeit.com')
  })

  it('preserves production and localhost hostnames without modification', () => {
    expect(normalizeSurfaceHost('pos.hfeit.app')).toBe('pos.hfeit.app')
    expect(normalizeSurfaceHost('order.hfeit.com')).toBe('order.hfeit.com')
    expect(normalizeSurfaceHost('hfeit.com')).toBe('hfeit.com')
    expect(normalizeSurfaceHost('localhost')).toBe('localhost')
    expect(normalizeSurfaceHost('127.0.0.1')).toBe('127.0.0.1')
  })

  it('handles case insensitivity and whitespace defensively', () => {
    expect(normalizeSurfaceHost('  PRV-POS.HFEIT.APP  ')).toBe('pos.hfeit.app')
    expect(normalizeSurfaceHost('DEV-BOARD.HFEIT.COM')).toBe('board.hfeit.com')
    expect(normalizeSurfaceHost('')).toBe('')
    expect(normalizeSurfaceHost(null)).toBe('')
    expect(normalizeSurfaceHost(undefined)).toBe('')
  })

  it('does not strip non-prefix substrings that happen to start with dev/stg', () => {
    expect(normalizeSurfaceHost('developers.hfeit.com')).toBe('developers.hfeit.com')
    expect(normalizeSurfaceHost('stagingdomain.com')).toBe('stagingdomain.com')
  })
})
