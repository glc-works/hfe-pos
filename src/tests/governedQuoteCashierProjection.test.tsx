import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PosCartSection } from '../components/pos/PosCartSection'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import type { ReviewedPosQuote } from '../services/financial/HfePosFinancialPort'

const sampleReviewedQuote: ReviewedPosQuote = {
  quoteId: 'QUOTE-TEST-001',
  revision: '5',
  digestSha256: 'a'.repeat(64),
  currency: 'IDR',
  subtotalMinor: '28000',
  amountDueMinor: '30800',
  discountTotalMinor: '0',
  taxTotalMinor: '2800',
  serviceChargeTotalMinor: '0',
  tipTotalMinor: '0',
  roundingTotalMinor: '0',
  presetId: 'PRESET-CAFE-HQ',
  presetVersion: '1',
  lines: [],
  expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  tenderEligibility: [
    { tenderType: 'cash', eligible: true },
    { tenderType: 'qris', eligible: true },
  ],
  intentFingerprint: 'test-intent',
  source: 'hfe-core',
}

describe('PosCartSection authoritative quote projection', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('renders authoritative CORE quote amount and disables unsupported card tender', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosCartSection
            cartItems={[{
              id: '1',
              name: 'Latte',
              price: 30000,
              quantity: 1,
              category: 'coffee',
              hfeCategoryCode: 'BEV-COFFEE',
              image: '',
              description: 'Espresso with milk',
            }]}
            selectedPOSTable={null}
            posPayMethod="cash"
            posCashGiven=""
            subtotal={30000}
            pb1Tax={3000}
            grandTotal={33000}
            authoritativeQuote={sampleReviewedQuote}
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onUpdateQty={vi.fn()}
            onOpenDirectQtyModal={vi.fn()}
            onCheckout={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // Authoritative amount 30.800 must be displayed
    expect(html).toContain('data-testid="authoritative-amount-due"')
    expect(html).toContain('IDR\u00a030.800')

    // Card button should be disabled
    expect(html).toContain('data-testid="tender-card"')
    expect(html).toMatch(/data-testid="tender-card"[^>]*disabled=""/)
  })

  it('disables cash when the reviewed CORE quote permits only QRIS', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosCartSection
            cartItems={[]}
            selectedPOSTable={null}
            posPayMethod="cash"
            posCashGiven=""
            subtotal={0}
            pb1Tax={0}
            grandTotal={33000}
            authoritativeQuote={{ ...sampleReviewedQuote, tenderEligibility: [{ tenderType: 'qris', eligible: true }] }}
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onUpdateQty={vi.fn()}
            onOpenDirectQtyModal={vi.fn()}
            onCheckout={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toMatch(/data-testid="tender-cash"[^>]*disabled=""/)
    expect(html).toMatch(/data-testid="tender-card"[^>]*disabled=""/)
    expect(html).not.toMatch(/data-testid="tender-qris"[^>]*disabled=""/)
  })

  it('hides browser-calculated payable totals and card entry before connected CORE review', () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosCartSection
            cartItems={[{
              id: '1', name: 'Latte', price: 30000, quantity: 1, category: 'coffee',
              hfeCategoryCode: 'BEV-COFFEE', image: '', description: 'Espresso with milk',
            }]}
            selectedPOSTable={null}
            posPayMethod="card"
            posCashGiven=""
            subtotal={30000}
            pb1Tax={3000}
            grandTotal={33000}
            authoritativeQuote={null}
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onUpdateQty={vi.fn()}
            onOpenDirectQtyModal={vi.fn()}
            onCheckout={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('data-testid="awaiting-core-quote"')
    expect(html).not.toContain('data-testid="authoritative-amount-due"')
    expect(html).not.toContain('aria-busy="true"')
    expect(html).not.toContain('33.000')
    expect(html).toMatch(/data-testid="tender-card"[^>]*disabled=""/)
  })

  it('labels local estimates and keeps card entry only in explicit synthetic mode', () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'synthetic')
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosCartSection
            cartItems={[]}
            selectedPOSTable={null}
            posPayMethod="card"
            posCashGiven=""
            subtotal={30000}
            pb1Tax={3000}
            grandTotal={33000}
            authoritativeQuote={null}
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onUpdateQty={vi.fn()}
            onOpenDirectQtyModal={vi.fn()}
            onCheckout={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('data-testid="local-price-estimate"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('33.000')
  })
})
