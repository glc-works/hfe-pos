import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  resolveStorefrontData,
  formatCurrencyIDR,
} from '../../packages/storefront-astro/src/lib/merchantDataResolver'

describe('Storefront Resolver Fail-Closed Protection (Issue #60)', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  it('fails closed and returns null in production when no authoritative API endpoint is configured', async () => {
    process.env.NODE_ENV = 'production'
    process.env.PUBLIC_IS_PREVIEW = 'false'
    delete process.env.HFE_STOREFRONT_API_URL

    const result = await resolveStorefrontData('unregistered-merchant-slug')
    expect(result).toBeNull()
  })

  it('fails closed and returns null in production when authoritative endpoint returns 404', async () => {
    process.env.NODE_ENV = 'production'
    process.env.PUBLIC_IS_PREVIEW = 'false'
    process.env.HFE_STOREFRONT_API_URL = 'https://core.hfeit.com'

    // Mock global fetch returning 404
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }) as unknown as typeof fetch

    const result = await resolveStorefrontData('nonexistent-merchant')
    expect(result).toBeNull()
  })

  it('fails closed and returns null in production when network fetch throws', async () => {
    process.env.NODE_ENV = 'production'
    process.env.PUBLIC_IS_PREVIEW = 'false'
    process.env.HFE_STOREFRONT_API_URL = 'https://core.hfeit.com'

    // Mock network drop / timeout
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Connection refused')) as unknown as typeof fetch

    const result = await resolveStorefrontData('offline-merchant')
    expect(result).toBeNull()
  })

  it('returns isolated preview benchmark fixtures in preview/dev mode', async () => {
    process.env.NODE_ENV = 'development'
    process.env.PUBLIC_IS_PREVIEW = 'true'
    delete process.env.HFE_STOREFRONT_API_URL

    const result = await resolveStorefrontData('senopati-kopitiam')
    expect(result).not.toBeNull()
    expect(result?.profile.slug).toBe('senopati-kopitiam')
    expect(result?.profile.businessName).toContain('Kopitiam Senopati')
    expect(result?.catalog.length).toBeGreaterThan(0)
  })

  it('formats IDR currency with proper formatting and zero decimals', () => {
    expect(formatCurrencyIDR(28000)).toContain('28.000')
    expect(formatCurrencyIDR(0)).toContain('0')
  })
})
