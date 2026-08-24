import { describe, it, expect } from 'vitest'
import {
  evaluateActiveChannels,
  buildOrderHandoffUrl,
  DEFAULT_CHANNELS,
} from '../../packages/storefront-astro/src/lib/channelGovernance'
import {
  resolveStorefrontData,
  formatCurrencyIDR,
} from '../../packages/storefront-astro/src/lib/merchantDataResolver'

describe('Astro Storefront (BOARD.Hfeit) & Channel Governance Engine', () => {
  describe('Channel Governance & Sovereign Toggles', () => {
    it('evaluates default channels with all standard services open', () => {
      const channels = evaluateActiveChannels()
      expect(channels.enableDineInQr).toBe(true)
      expect(channels.enableTakeaway).toBe(true)
      expect(channels.enableOnlineDelivery).toBe(true)
      expect(channels.enableTableReservation).toBe(true)
      expect(channels.enableEventTicketing).toBe(true)
      expect(channels.isEmergencyBusyMode).toBe(false)
    })

    it('locks online delivery and table reservations when emergency busy mode is activated', () => {
      const channels = evaluateActiveChannels({
        isEmergencyBusyMode: true,
        enableOnlineDelivery: true,
        enableTableReservation: true,
      })

      // Invariant: Emergency busy mode overrides and shuts down delivery & reservations
      expect(channels.enableOnlineDelivery).toBe(false)
      expect(channels.enableTableReservation).toBe(false)
      // In-store dine-in and takeaway remain open
      expect(channels.enableDineInQr).toBe(true)
      expect(channels.enableTakeaway).toBe(true)
    })

    it('respects merchant selective channel shutdowns', () => {
      const channels = evaluateActiveChannels({
        enableOnlineDelivery: false,
        enableTableReservation: false,
      })

      expect(channels.enableOnlineDelivery).toBe(false)
      expect(channels.enableTableReservation).toBe(false)
      expect(channels.enableDineInQr).toBe(true)
    })
  })

  describe('Deep-Link Cart Handoff URL Serializer', () => {
    it('builds valid dine-in order URL with table number', () => {
      const url = buildOrderHandoffUrl({
        merchantSlug: 'senopati-kopitiam',
        mode: 'dine_in',
        tableNumber: 'OUT-04',
        addItemId: 'MN-001',
        quantity: 2,
      })

      expect(url).toBe(
        'https://order.hfeit.com/senopati-kopitiam?mode=dine_in&table=OUT-04&addItem=MN-001&qty=2',
      )
    })

    it('builds valid delivery order URL with promo voucher code', () => {
      const url = buildOrderHandoffUrl({
        merchantSlug: 'senopati-kopitiam',
        mode: 'delivery',
        addItemId: 'MN-002',
        promoCode: 'MEMBERBARU15',
      })

      expect(url).toBe(
        'https://order.hfeit.com/senopati-kopitiam?mode=delivery&addItem=MN-002&qty=1&promo=MEMBERBARU15',
      )
    })

    it('builds valid takeaway order URL for event ticket purchase', () => {
      const url = buildOrderHandoffUrl({
        merchantSlug: 'senopati-kopitiam',
        mode: 'takeaway',
        addItemId: 'EVT-001',
      })

      expect(url).toBe('https://order.hfeit.com/senopati-kopitiam?mode=takeaway&addItem=EVT-001&qty=1')
    })
  })

  describe('SSOT Merchant Data Resolution & Auto-Inheritance', () => {
    it('resolves authoritative merchant profile and catalog without dummy data', async () => {
      const data = await resolveStorefrontData('senopati-kopitiam')
      expect(data).not.toBeNull()
      expect(data!.profile.businessName).toContain('Kopitiam Senopati HQ')
      expect(data!.profile.primaryCurrency).toBe('IDR')
      expect(data!.profile.rating).toBeGreaterThanOrEqual(4.5)
      expect(data!.catalog.length).toBeGreaterThanOrEqual(4)
      expect(data!.promos.length).toBeGreaterThanOrEqual(1)
    })

    it('treats event tickets as first-class products in catalog', async () => {
      const data = await resolveStorefrontData('senopati-kopitiam')
      expect(data).not.toBeNull()
      expect(data!.events.length).toBeGreaterThanOrEqual(1)
      const eventTicket = data!.events[0]
      expect(eventTicket.category).toBe('event_ticket')
      expect(eventTicket.price).toBe(150000)
      expect(eventTicket.eventDetails).toBeDefined()
      expect(eventTicket.eventDetails?.remainingSeats).toBeGreaterThan(0)
    })

    it('fails closed in production mode when no explicit backend endpoint is configured (Issue #60)', async () => {
      const prevEnv = process.env.NODE_ENV
      const prevPreview = process.env.PUBLIC_IS_PREVIEW
      const prevApiUrl = process.env.HFE_STOREFRONT_API_URL

      try {
        process.env.NODE_ENV = 'production'
        process.env.PUBLIC_IS_PREVIEW = 'false'
        delete process.env.HFE_STOREFRONT_API_URL

        const data = await resolveStorefrontData('unregistered-merchant-slug')
        // Invariant: Fail closed, return null, zero fake live data in production
        expect(data).toBeNull()
      } finally {
        process.env.NODE_ENV = prevEnv
        process.env.PUBLIC_IS_PREVIEW = prevPreview
        if (prevApiUrl) {
          process.env.HFE_STOREFRONT_API_URL = prevApiUrl
        }
      }
    })

    it('formats monetary figures using exact IDR currency standards', () => {
      expect(formatCurrencyIDR(28000)).toMatch(/28\.000/)
      expect(formatCurrencyIDR(150000)).toMatch(/150\.000/)
    })
  })
})
