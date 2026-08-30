import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { LandingPageView } from '../components/landing/LandingPageView'
import { CustomerHeader } from '../components/customer/CustomerHeader'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { ViewportProvider } from '../context/ViewportContext'
import { NotificationProvider } from '../context/NotificationContext'
import { BUILTIN_THEMES, DEFAULT_COMPANY_PROFILE, PRODUCT_CATALOG } from '../data/mockData'

describe('L2-POS-101: BOARD Dual-CTA & Online Table State Isolation', () => {
  it('renders Dual-CTA buttons (Pesan Online and Reservasi Meja) on LandingPageView', () => {
    const html = renderToString(
      <LanguageProvider>
        <ViewportProvider viewportMode="responsive">
          <MerchantConfigProvider>
            <NotificationProvider>
              <LandingPageView
                hfeCompanyProfile={DEFAULT_COMPANY_PROFILE}
                productCatalog={PRODUCT_CATALOG}
                onOpenReservationModal={() => {}}
                onSwitchToCustomerApp={() => {}}
              />
            </NotificationProvider>
          </MerchantConfigProvider>
        </ViewportProvider>
      </LanguageProvider>
    )

    expect(html).toContain('Buka Menu &amp; Pesan')
    expect(html).toContain('Reservasi Meja')
  })

  it('renders Online Order badge in CustomerHeader when selectedTable is empty', () => {
    const html = renderToString(
      <LanguageProvider>
        <MerchantConfigProvider>
          <NotificationProvider>
            <CustomerHeader
              hfeCompanyProfile={DEFAULT_COMPANY_PROFILE}
              selectedTable=""
              scannedSeat=""
              hasPaidOrder={false}
              activeTheme={BUILTIN_THEMES[0]}
              isCustomerSessionActive={false}
              loginType="guest-name"
              customerPhone=""
              guestName="Tamu"
              loyaltyPoints={0}
              setShowLoginModal={() => {}}
              setShowReservationModal={() => {}}
              scrollToCategorySection={() => {}}
              onSwitchToLandingPage={() => {}}
            />
          </NotificationProvider>
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('Pesan Online')
    expect(html).toContain('Ambil &amp; Antar')
    expect(html).not.toContain('OUT-04')
  })

  it('renders specific in-store table and seat badge when selectedTable is provided from QR', () => {
    const html = renderToString(
      <LanguageProvider>
        <MerchantConfigProvider>
          <NotificationProvider>
            <CustomerHeader
              hfeCompanyProfile={DEFAULT_COMPANY_PROFILE}
              selectedTable="OUT-04"
              scannedSeat="Seat 1"
              hasPaidOrder={false}
              activeTheme={BUILTIN_THEMES[0]}
              isCustomerSessionActive={false}
              loginType="guest-name"
              customerPhone=""
              guestName="Tamu"
              loyaltyPoints={0}
              setShowLoginModal={() => {}}
              setShowReservationModal={() => {}}
              scrollToCategorySection={() => {}}
              onSwitchToLandingPage={() => {}}
            />
          </NotificationProvider>
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('OUT-04')
    expect(html).toContain('Seat 1')
    expect(html).toContain('Bill &amp; Info')
  })

  it('dynamically adapts navbar and CTA taxonomy for service/barber business vertical', () => {
    const barberProfile = {
      ...DEFAULT_COMPANY_PROFILE,
      brandName: 'Gentlemen Premium Barber',
      businessType: 'barber' as any
    }

    const html = renderToString(
      <LanguageProvider>
        <ViewportProvider viewportMode="responsive">
          <MerchantConfigProvider>
            <NotificationProvider>
              <LandingPageView
                hfeCompanyProfile={barberProfile}
                productCatalog={PRODUCT_CATALOG}
                onOpenReservationModal={() => {}}
                onSwitchToCustomerApp={() => {}}
              />
            </NotificationProvider>
          </MerchantConfigProvider>
        </ViewportProvider>
      </LanguageProvider>
    )

    // Should render "Layanan" instead of "Menu"
    expect(html).toContain('Layanan')
    expect(html).toContain('Pilih Stylist / Jadwal')
  })
})
