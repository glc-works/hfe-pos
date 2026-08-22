import { describe, it, expect } from 'vitest'
import { normalizeSurfaceHost } from '../utils/surfaceHost'

/**
 * Shared Preview serves the same build on `prv-<surface>` hosts. The surface
 * rules in App.tsx and MerchantConfigContext.tsx match on `order.`, `card.`,
 * `board.` and friends, so the prefix has to be removed before they run.
 */
describe('Preview host normalization', () => {
  it('strips the prv- prefix so Preview resolves the same surface as production', () => {
    expect(normalizeSurfaceHost('prv-order.hfeit.com')).toBe('order.hfeit.com')
    expect(normalizeSurfaceHost('prv-card.hfeit.com')).toBe('card.hfeit.com')
    expect(normalizeSurfaceHost('prv-board.hfeit.com')).toBe('board.hfeit.com')
    expect(normalizeSurfaceHost('prv-pos.hfeit.app')).toBe('pos.hfeit.app')
  })

  // Every rule matches on `<surface>.`, so an unstripped prefix matches nothing
  // and the caller falls through to its default. Both defaults are the POS
  // surface, which means the failure is silent: ORDER would have served POS and
  // reported nothing wrong.
  it('leaves no prefixed host matching a surface rule by accident', () => {
    for (const host of ['prv-order.hfeit.com', 'prv-card.hfeit.com', 'prv-board.hfeit.com']) {
      expect(host.startsWith('order.') || host.startsWith('card.') || host.startsWith('board.')).toBe(false)
      const normalized = normalizeSurfaceHost(host)
      expect(
        normalized.startsWith('order.') || normalized.startsWith('card.') || normalized.startsWith('board.'),
      ).toBe(true)
    }
  })

  it('keeps stripping the development prefixes it already supported', () => {
    expect(normalizeSurfaceHost('dev-order.hfeit.com')).toBe('order.hfeit.com')
    expect(normalizeSurfaceHost('dev.order.hfeit.com')).toBe('order.hfeit.com')
  })

  // The nested form is superseded by `prv-`, but tolerating it costs one entry
  // and removes a trap if a record in that shape outlives the decision.
  it('tolerates the superseded nested preview form', () => {
    expect(normalizeSurfaceHost('prv.order.hfeit.com')).toBe('order.hfeit.com')
  })

  it('lowercases and otherwise leaves production hosts untouched', () => {
    expect(normalizeSurfaceHost('POS.Hfeit.com')).toBe('pos.hfeit.com')
    expect(normalizeSurfaceHost('hfeit.com')).toBe('hfeit.com')
    expect(normalizeSurfaceHost('localhost')).toBe('localhost')
  })

  // `previewing.` and `development.` both begin with a stripped prefix's letters
  // but are not prefixes; slicing four characters off them would corrupt the host.
  it('does not strip look-alike hostnames', () => {
    expect(normalizeSurfaceHost('preview.hfeit.com')).toBe('preview.hfeit.com')
    expect(normalizeSurfaceHost('developer.hfeit.com')).toBe('developer.hfeit.com')
  })
})
