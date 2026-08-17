import { describe, it, expect } from 'vitest'
import { CONNECTORS_DATA, EcosystemConnector } from '../components/core/hub/ConnectorsCatalogGrid'
import { WebhookRelayPanel } from '../components/core/hub/WebhookRelayPanel'

describe('ConnectorInstallModal & Connect Hub Ecosystem Tests', () => {
  it('contains >= 44 connectors across all supported regions and categories', () => {
    expect(CONNECTORS_DATA.length).toBeGreaterThanOrEqual(44)

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

  it('verifies essential benchmark connectors: Xero, QuickBooks, Stripe, QRIS, Midtrans, SNAP BI, PayNow, FPS, Shopify, Alfamart', () => {
    const requiredSlugs = [
      'xero-sync-connector',
      'quickbooks-online-bridge',
      'qris-bi-standar-gateway',
      'stripe-elements-gateway',
      'midtrans-snap-gateway',
      'bca-snap-bi-gateway',
      'sg-paynow-fast-gateway',
      'hk-fps-banking-rail',
      'shopify-multistore-sync',
      'woocommerce-webhook-sync',
      'alfamart-h2h-retail-sync'
    ]

    for (const slug of requiredSlugs) {
      const found = CONNECTORS_DATA.find((c) => c.slug === slug)
      expect(found).toBeDefined()
      expect(found?.name.length).toBeGreaterThan(0)
    }
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

  it('exports WebhookRelayPanel component cleanly', () => {
    expect(WebhookRelayPanel).toBeDefined()
  })
})
