import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { CustomerCheckoutView } from '../components/customer/CustomerCheckoutView'
import { CartItem, CafeThemeConfig, HfeCompanyProfile } from '../types/pos'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

const mockTheme: CafeThemeConfig = {
  themeName: 'Default Theme',
  mode: 'light',
  primaryAccentHex: '#f59e0b',
  textColorHex: '#0f172a',
  secondaryTextColorHex: '#475569',
  cardBgHex: '#ffffff',
  pageBgHex: '#f8fafc',
  fontFamily: 'sans-serif'
}

const mockProfile: HfeCompanyProfile = {
  companyBookId: '00000000-0000-4000-8000-000000000001',
  ptLegalName: 'PT Senopati Kuliner Nusantara',
  brandName: 'Senopati Kopitiam',
  logoUrl: '',
  taxIdNpwp: '01.234.567.8-901.000',
  nibPermit: '1234567890123',
  address: 'Jl. Senopati No. 45, Jakarta Selatan',
  hfeLedgerApiEndpoint: 'https://core.hfeit.com'
}

const mockCart: CartItem[] = [
  {
    id: 'prod-01',
    name: 'Roti Bakar Kaya',
    price: 35000,
    quantity: 1,
    category: 'Snack',
    hfeCategoryCode: 'SNACK',
    image: '',
    description: 'Roti bakar kaya lezat',
    selectedModifiers: [
      { groupId: 'g1', optionId: 'opt-1', name: 'Tanpa Mentega', priceDelta: 0 }
    ]
  },
  {
    id: 'prod-02',
    name: 'Es Kopi Susu Aren',
    price: 25000,
    quantity: 2,
    category: 'Coffee',
    hfeCategoryCode: 'COFFEE',
    image: '',
    description: 'Kopi susu aren segar'
  }
]

describe('CustomerCheckoutView - ESB Order Parity Tests', () => {
  it('renders Ordered Items header with total quantity and + Tambah Menu pill button', () => {
    const html = renderToString(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(
          MerchantConfigProvider,
          null,
          React.createElement(CustomerCheckoutView, {
            selectedTable: 'T-01',
            scannedSeat: 'Seat A',
            activeTheme: mockTheme,
            cart: mockCart,
            hfeCompanyProfile: mockProfile,
            promoCodeInput: '',
            setPromoCodeInput: vi.fn(),
            appliedPromo: null,
            redeemedVoucher: false,
            serviceFeeRate: 5,
            calculatedServiceFee: 4250,
            taxPB1Mode: 1,
            calculatedPB1Tax: 8500,
            selectedTipAmount: 0,
            setSelectedTipAmount: vi.fn(),
            paymentPolicy: 'pay-first',
            setPaymentPolicy: vi.fn(),
            rawSubtotal: 85000,
            grandTotalBill: 97750,
            setQrStepView: vi.fn(),
            handleUpdateQty: vi.fn(),
            handleApplyPromo: vi.fn(),
            handleSubmitOrder: vi.fn()
          })
        )
      )
    )

    expect(html).toContain('Daftar Menu Dipesan')
    expect(html).toContain('+ Tambah Menu')
  })

  it('renders Edit varian button and No notes yet clickable note', () => {
    const html = renderToString(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(
          MerchantConfigProvider,
          null,
          React.createElement(CustomerCheckoutView, {
            selectedTable: 'T-01',
            scannedSeat: 'Seat A',
            activeTheme: mockTheme,
            cart: mockCart,
            hfeCompanyProfile: mockProfile,
            onOpenModifierModal: vi.fn(),
            promoCodeInput: '',
            setPromoCodeInput: vi.fn(),
            appliedPromo: null,
            redeemedVoucher: false,
            serviceFeeRate: 5,
            calculatedServiceFee: 4250,
            taxPB1Mode: 1,
            calculatedPB1Tax: 8500,
            selectedTipAmount: 0,
            setSelectedTipAmount: vi.fn(),
            paymentPolicy: 'pay-first',
            setPaymentPolicy: vi.fn(),
            rawSubtotal: 85000,
            grandTotalBill: 97750,
            setQrStepView: vi.fn(),
            handleUpdateQty: vi.fn(),
            handleApplyPromo: vi.fn(),
            handleSubmitOrder: vi.fn()
          })
        )
      )
    )

    expect(html).toContain('Edit')
    expect(html).toContain('Belum ada catatan')
    expect(html).toContain('Tanpa Mentega')
  })

  it('renders explicit Rounding row and Other fees in the financial breakdown', () => {
    const html = renderToString(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(
          MerchantConfigProvider,
          null,
          React.createElement(CustomerCheckoutView, {
            selectedTable: 'T-01',
            scannedSeat: 'Seat A',
            activeTheme: mockTheme,
            cart: mockCart,
            hfeCompanyProfile: mockProfile,
            promoCodeInput: '',
            setPromoCodeInput: vi.fn(),
            appliedPromo: null,
            redeemedVoucher: false,
            serviceFeeRate: 5,
            calculatedServiceFee: 4250,
            taxPB1Mode: 1,
            calculatedPB1Tax: 8500,
            selectedTipAmount: 0,
            setSelectedTipAmount: vi.fn(),
            paymentPolicy: 'pay-first',
            setPaymentPolicy: vi.fn(),
            rawSubtotal: 85000,
            grandTotalBill: 97750,
            setQrStepView: vi.fn(),
            handleUpdateQty: vi.fn(),
            handleApplyPromo: vi.fn(),
            handleSubmitOrder: vi.fn()
          })
        )
      )
    )

    expect(html).toContain('Pembulatan')
    expect(html).toContain('Biaya Lainnya')
  })
})
