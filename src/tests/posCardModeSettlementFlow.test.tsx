import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { PosPaymentSettlementModal } from '../components/pos/PosPaymentSettlementModal'
import { PosCardTenderForm } from '../components/pos/PosCardTenderForm'
import { FinancialTaxPolicyZone } from '../components/settings/FinancialTaxPolicyZone'
import { DEFAULT_ENABLED_PAYMENT_METHODS } from '../context/merchantThemeUtils'

const storageStore: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => storageStore[key] || null,
  setItem: (key: string, val: string) => { storageStore[key] = val },
  removeItem: (key: string) => { delete storageStore[key] },
  clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]) }
}
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
}

describe('POS Card Payment Modes (All vs Debit-Only vs CC-Only)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has DEFAULT_ENABLED_PAYMENT_METHODS with cardMode: "all"', () => {
    expect(DEFAULT_ENABLED_PAYMENT_METHODS.card).toBe(true)
    expect(DEFAULT_ENABLED_PAYMENT_METHODS.cardMode).toBe('all')
  })

  it('renders card mode sub-pills in FinancialTaxPolicyZone when card tender is enabled', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <FinancialTaxPolicyZone />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('Semua (Debit &amp; Kredit)')
    expect(html).toContain('Hanya Kartu Debit')
    expect(html).toContain('Hanya Kartu Kredit')
  })

  it('renders "Kartu EDC" in settlement modal when cardMode is "all"', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={[]}
            selectedTable={null}
            subtotal={25000}
            pb1Tax={2500}
            grandTotal={27500}
            fulfillmentMode="dine_in"
            posPayMethod="card"
            posCashGiven=""
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('data-testid="settlement-tender-card"')
    expect(html).toContain('Kartu EDC')
  })

  it('renders "Kartu Debit" in settlement modal when debit_only is configured', () => {
    const stored = JSON.stringify({ cash: true, qris: true, card: true, cardMode: 'debit_only', roomCharge: false })
    localStorage.setItem('hfe_enabled_payment_methods', stored)

    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={[]}
            selectedTable={null}
            subtotal={25000}
            pb1Tax={2500}
            grandTotal={27500}
            fulfillmentMode="dine_in"
            posPayMethod="debit"
            posCashGiven=""
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('data-testid="settlement-tender-card"')
    expect(html).toContain('Kartu Debit')
  })

  it('renders "Kartu Kredit" in settlement modal when credit_only is configured', () => {
    const stored = JSON.stringify({ cash: true, qris: true, card: true, cardMode: 'credit_only', roomCharge: false })
    localStorage.setItem('hfe_enabled_payment_methods', stored)

    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={[]}
            selectedTable={null}
            subtotal={25000}
            pb1Tax={2500}
            grandTotal={27500}
            fulfillmentMode="dine_in"
            posPayMethod="cc"
            posCashGiven=""
            setPosPayMethod={vi.fn()}
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('data-testid="settlement-tender-card"')
    expect(html).toContain('Kartu Kredit')
  })

  it('displays a warning when PosCardTenderForm detects a credit card under debit_only mode', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <PosCardTenderForm
          posPayMethod="cc"
          internalCardType="cc"
          selectedBank="BCA"
          cardPrefix="47264700"
          cardLast4="1234"
          cardNetwork="visa"
          approvalCode="APPR-123"
          cardMode="debit_only"
          setInternalCardType={vi.fn()}
          setPosPayMethod={vi.fn()}
          setSelectedBank={vi.fn()}
          onCardPrefixChange={vi.fn()}
          onCardLast4Change={vi.fn()}
          setApprovalCode={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(html).toContain('Kredit (Hanya Debit)')
    expect(html).toContain('Toko hanya menerima Kartu Debit')
  })

  it('displays a warning when PosCardTenderForm detects a debit card under credit_only mode', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <PosCardTenderForm
          posPayMethod="debit"
          internalCardType="debit"
          selectedBank="BCA"
          cardPrefix="45563321"
          cardLast4="1234"
          cardNetwork="visa"
          approvalCode="APPR-123"
          cardMode="credit_only"
          setInternalCardType={vi.fn()}
          setPosPayMethod={vi.fn()}
          setSelectedBank={vi.fn()}
          onCardPrefixChange={vi.fn()}
          onCardLast4Change={vi.fn()}
          setApprovalCode={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(html).toContain('Debit (Hanya Kredit)')
    expect(html).toContain('Toko hanya menerima Kartu Kredit')
  })
})
