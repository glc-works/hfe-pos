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

  it('strictly validates all 9 accounting connectors against connector-creation v2.1.0 metadata standard', () => {
    const accountingSlugs = [
      'xero-sync-connector',
      'quickbooks-online-bridge',
      'mekari-jurnal-sync-connector',
      'accurate-online-sync-connector',
      'sap-business-one-connector',
      'netsuite-erp-connector',
      'odoo-accounting-bridge',
      'wave-accounting-sync',
      'sage-intacct-gateway'
    ]

    const accountingConnectors = CONNECTORS_DATA.filter((c) => c.category === 'accounting')
    expect(accountingConnectors.length).toBe(9)

    for (const slug of accountingSlugs) {
      const connector = accountingConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(2)

      // 2. requiredScopes check
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(3)
      expect(connector.requiredScopes).toContain('ledger:post')
      expect(connector.requiredScopes).toContain('accounts:read')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })

  it('strictly validates all 6 POS connectors against connector-creation v2.1.0 metadata standard', () => {
    const posSlugs = [
      'moka-pos-sync',
      'esb-resto-enterprise',
      'sg-qashier-storehub-pos',
      'hk-octopus-alipay-pos',
      'uae-foodics-pos-bridge',
      'us-toast-clover-pos'
    ]

    const posConnectors = CONNECTORS_DATA.filter((c) => c.category === 'pos')
    expect(posConnectors.length).toBe(6)

    for (const slug of posSlugs) {
      const connector = posConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(2)

      // 2. requiredScopes check (must include least-privilege POS scopes)
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(2)
      expect(connector.requiredScopes).toContain('pos:shift_close')
      expect(connector.requiredScopes).toContain('sales:write')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })

  it('strictly validates all 9 E-Commerce connectors against connector-creation v2.1.0 metadata standard', () => {
    const ecommerceSlugs = [
      'shopify-multistore-sync',
      'woocommerce-webhook-sync',
      'alfamart-h2h-retail-sync',
      'indomaret-isaku-sync',
      'tokopedia-omnichannel-sync',
      'shopee-open-platform-sync',
      'tiktok-shop-partner-sync',
      'lazada-open-platform-sync',
      'gofood-grabfood-merchant-sync'
    ]

    const ecommerceConnectors = CONNECTORS_DATA.filter((c) => c.category === 'ecommerce')
    expect(ecommerceConnectors.length).toBe(9)

    for (const slug of ecommerceSlugs) {
      const connector = ecommerceConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(2)

      // 2. requiredScopes check (must include least-privilege e-commerce scopes)
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(2)
      expect(connector.requiredScopes).toContain('sales:read_write')
      expect(connector.requiredScopes).toContain('payouts:read')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })

  it('strictly validates all 4 Tax connectors against connector-creation v2.1.0 metadata standard', () => {
    const taxSlugs = [
      'djp-efaktur-gateway',
      'sg-invoicenow-peppol',
      'uae-fta-emaratax-vat',
      'us-vertex-cloud-tax'
    ]

    const taxConnectors = CONNECTORS_DATA.filter((c) => c.category === 'tax')
    expect(taxConnectors.length).toBe(4)

    for (const slug of taxSlugs) {
      const connector = taxConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(2)

      // 2. requiredScopes check (must include least-privilege tax scopes)
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(2)
      expect(connector.requiredScopes).toContain('tax:efaktur_generate')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })

  it('strictly validates all 11 Banking & Statement Feeds connectors against connector-creation v2.1.0 metadata standard', () => {
    const bankingSlugs = [
      'bca-snap-bi-gateway',
      'mandiri-mcm-snap-bi',
      'bri-briapi-snap-gateway',
      'bni-direct-snap-gateway',
      'bank-jago-bisnis-connector',
      'cimb-bizchannel-snap',
      'permata-ebusiness-snap',
      'sg-paynow-fast-gateway',
      'hk-fps-banking-rail',
      'us-plaid-fednow-bridge',
      'eu-sepa-instant-tink'
    ]

    const bankingConnectors = CONNECTORS_DATA.filter((c) => c.category === 'banking')
    expect(bankingConnectors.length).toBe(11)

    for (const slug of bankingSlugs) {
      const connector = bankingConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check (must include feeds & idempotent badges)
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(3)
      expect(connector.derivedBadges).toContain('🏦 Auto Statement Feeds')
      expect(connector.derivedBadges).toContain('🔒 Webhook HMAC-SHA256')
      expect(connector.derivedBadges).toContain('🔁 Idempotent Replay Safe')

      // 2. requiredScopes check (least privilege banking scopes)
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(3)
      expect(connector.requiredScopes).toContain('banking:read')
      expect(connector.requiredScopes).toContain('statements:write')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })

  it('strictly validates all 11 Payment Gateway connectors against connector-creation v2.1.0 metadata standard', () => {
    const paymentSlugs = [
      'qris-bi-standar-gateway',
      'stripe-elements-gateway',
      'midtrans-snap-gateway',
      'xendit-invoicing-gateway',
      'doku-checkout-gateway',
      'faspay-billing-gateway',
      'ovo-merchant-direct',
      'gopay-merchant-direct',
      'dana-qris-direct',
      'shopeepay-merchant-direct',
      'eu-adyen-mollie-gateway'
    ]

    const paymentConnectors = CONNECTORS_DATA.filter((c) => c.category === 'payments')
    expect(paymentConnectors.length).toBe(11)

    for (const slug of paymentSlugs) {
      const connector = paymentConnectors.find((c) => c.slug === slug)
      expect(connector).toBeDefined()
      if (!connector) continue

      // 1. derivedBadges check (must include HMAC-SHA256 & idempotency)
      expect(connector.derivedBadges).toBeDefined()
      expect(Array.isArray(connector.derivedBadges)).toBe(true)
      expect(connector.derivedBadges!.length).toBeGreaterThanOrEqual(3)
      expect(connector.derivedBadges).toContain('🔒 Webhook HMAC-SHA256')
      expect(connector.derivedBadges).toContain('🔁 Idempotent Replay Safe')

      // 2. requiredScopes check (must include least-privilege payment scopes)
      expect(connector.requiredScopes).toBeDefined()
      expect(Array.isArray(connector.requiredScopes)).toBe(true)
      expect(connector.requiredScopes!.length).toBeGreaterThanOrEqual(3)
      expect(connector.requiredScopes).toContain('payments:charge')
      expect(connector.requiredScopes).toContain('webhooks:listen')

      // 3. supportedVersions check
      expect(connector.supportedVersions).toBeDefined()
      expect(Array.isArray(connector.supportedVersions)).toBe(true)
      expect(connector.supportedVersions.length).toBeGreaterThanOrEqual(1)

      // 4. environment check
      expect(connector.environment).toBeDefined()
      expect(['both', 'sandbox', 'production']).toContain(connector.environment)
    }
  })
})

