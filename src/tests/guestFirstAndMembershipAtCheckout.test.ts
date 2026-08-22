import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ValueLedMembershipBanner } from '../components/customer/ValueLedMembershipBanner'
import { WifiAccessCelebrationBanner } from '../components/customer/WifiAccessCelebrationBanner'

describe('Guest-First Anonymous Start & Value-Led Membership (Issue #34 P0)', () => {
  it('renders ValueLedMembershipBanner for anonymous guests with 1-click CTA', () => {
    const html = renderToString(
      React.createElement(ValueLedMembershipBanner, {
        isCustomerSessionActive: false,
      })
    )

    expect(html).toContain('Gabung Member: Hemat &amp; Kumpulkan Poin')
    expect(html).toContain('✨ Gabung (1-Ketuk)')
    expect(html).toContain('Daftar instan tanpa password')
  })

  it('hides ValueLedMembershipBanner when customer session is already active / member logged in', () => {
    const html = renderToString(
      React.createElement(ValueLedMembershipBanner, {
        isCustomerSessionActive: true,
      })
    )

    expect(html).toBe('')
  })

  it('renders WifiAccessCelebrationBanner properly after payment', () => {
    const html = renderToString(
      React.createElement(WifiAccessCelebrationBanner, {
        wifiAccessPolicy: 'after_payment',
        hasPaidOrder: true,
        wifiSsid: 'Kopitiam_Senopati_Guest',
        wifiPassword: 'kopiuenak2026',
        isLight: true,
        textColor: '#0f172a',
      })
    )

    expect(html).toContain('Akses WiFi Kafe Terbuka')
    expect(html).toContain('Kopitiam_Senopati_Guest')
    expect(html).toContain('kopiuenak2026')
    expect(html).toContain('Salin Password')
  })
})
