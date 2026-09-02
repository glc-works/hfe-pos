import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { LandingPageView } from '../components/landing/LandingPageView'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ViewportProvider } from '../context/ViewportContext'
import { NotificationProvider } from '../context/NotificationContext'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'
import { DEFAULT_COMPANY_PROFILE, PRODUCT_CATALOG } from '../data/mockData'

function renderLanding(): string {
  return renderToString(
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
}

describe('BOARD Merchant Storefront Footer Onboarding CTA', () => {
  it('renders merchant onboarding CTA with direct link to https://pos.hfeit.com', () => {
    const html = renderLanding()
    expect(html).toContain('https://pos.hfeit.com')
    expect(html).toContain(idTranslations.landing.merchantCtaBadge.replace('&', '&amp;'))
    expect(html).toContain(idTranslations.landing.merchantCtaButton)
  })

  it('contains complete i18n definitions for Indonesian and English', () => {
    expect(idTranslations.landing.merchantCtaBadge).toBeDefined()
    expect(idTranslations.landing.merchantCtaButton).toContain('Daftar Merchant Baru di POS.Hfeit')

    expect(enTranslations.landing.merchantCtaBadge).toBeDefined()
    expect(enTranslations.landing.merchantCtaButton).toContain('Register New Merchant on POS.Hfeit')
  })
})
