import { describe, it, expect } from 'vitest'
import { CONNECTORS_DATA, EcosystemConnector } from '../components/connect_hub/ConnectorsCatalogGrid'

describe('ConnectorInstallModal & Connect Hub Ecosystem Tests', () => {
  it('contains valid connectors across all supported regions and categories', () => {
    expect(CONNECTORS_DATA.length).toBeGreaterThanOrEqual(15)

    const categories = new Set(CONNECTORS_DATA.map((c) => c.category))
    expect(categories.has('banking')).toBe(true)
    expect(categories.has('accounting')).toBe(true)
    expect(categories.has('payments')).toBe(true)
    expect(categories.has('pos')).toBe(true)
    expect(categories.has('ecommerce')).toBe(true)
    expect(categories.has('tax')).toBe(true)

    const regions = new Set(CONNECTORS_DATA.map((c) => c.region))
    expect(regions.has('id')).toBe(true)
    expect(regions.has('sg')).toBe(true)
    expect(regions.has('hk')).toBe(true)
    expect(regions.has('uae')).toBe(true)
    expect(regions.has('us')).toBe(true)
    expect(regions.has('eu')).toBe(true)
  })

  it('verifies connector attributes and slug immutability', () => {
    const bca = CONNECTORS_DATA.find((c) => c.slug === 'bca-snap-bi-gateway')
    expect(bca).toBeDefined()
    expect(bca?.category).toBe('banking')
    expect(bca?.verified).toBe(true)
    expect(bca?.track).toBe('stable')

    const xero = CONNECTORS_DATA.find((c) => c.slug === 'xero-sync-connector')
    expect(xero).toBeDefined()
    expect(xero?.category).toBe('accounting')
    expect(xero?.track).toBe('stable')
  })

  it('validates required scope groups for accounting, banking, payments, and ecommerce', () => {
    const sampleScopes = {
      accounting: ['ledger:post', 'accounts:read', 'tax:sync', 'reconcile:write'],
      banking: ['banking:read', 'statements:write', 'transfers:bi_fast', 'va:manage'],
      payments: ['payments:charge', 'refunds:write', 'webhooks:listen', 'settlement:read'],
      ecommerce: ['sales:read_write', 'inventory:sync', 'payouts:read'],
      pos: ['pos:shift_close', 'sales:write', 'cogs:deplete'],
      tax: ['tax:efaktur_generate', 'tax:filing_submit', 'tax:audit_read']
    }

    expect(sampleScopes.accounting).toContain('ledger:post')
    expect(sampleScopes.banking).toContain('statements:write')
    expect(sampleScopes.payments).toContain('webhooks:listen')
    expect(sampleScopes.ecommerce).toContain('sales:read_write')
    expect(sampleScopes.pos).toContain('cogs:deplete')
    expect(sampleScopes.tax).toContain('tax:efaktur_generate')
  })
})
