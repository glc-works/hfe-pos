import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { CustomerMobileView } from '../../views/CustomerMobileView'
import { DEFAULT_COMPANY_PROFILE, BUILTIN_THEMES, PRODUCT_CATALOG } from '../../data/mockData'

const meta: Meta<typeof CustomerMobileView> = {
  title: 'Customer/CustomerMobileView',
  component: CustomerMobileView,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'iphone14'
    }
  }
}

export default meta
type Story = StoryObj<typeof CustomerMobileView>

export const MobileQrScanCatalog: Story = {
  args: {
    hfeCompanyProfile: DEFAULT_COMPANY_PROFILE,
    selectedTable: 'MEJA-04',
    scannedSeat: 'Seat 1',
    activeTheme: BUILTIN_THEMES[0],
    isCustomerSessionActive: true,
    loginType: 'phone',
    customerPhone: '6281298765432',
    guestName: 'Budi Santoso',
    loyaltyPoints: 450,
    productCatalog: PRODUCT_CATALOG,
    reservationPolicyMode: 'instant',
    priceVisibilityMode: 'show_prices',
    customerAppDisplayMode: 'full_ordering',
    cart: [],
    totalCartCount: 0,
    grandTotalBill: 0,
    previousOrders: [],
    qrStepView: 'catalog',
    promoCodeInput: '',
    appliedPromo: null,
    redeemedVoucher: false,
    serviceFeeRate: 0.05,
    calculatedServiceFee: 0,
    taxPB1Mode: 1,
    calculatedPB1Tax: 0,
    selectedTipAmount: 0,
    paymentPolicy: 'pay-first',
    rawSubtotal: 0,
    setShowReservationModal: () => {},
    setShowLoginModal: () => {},
    setQrStepView: () => {},
    setPromoCodeInput: () => {},
    setSelectedTipAmount: () => {},
    setPaymentPolicy: () => {},
    handleReorderSameItem: () => {},
    handleAddToCart: () => {},
    handleUpdateQty: () => {},
    handleApplyPromo: () => {},
    handleSubmitOrder: () => {},
    onSwitchToLandingPage: () => {},
    onSwitchToPos: () => {}
  }
}

export const MobileCheckoutView: Story = {
  args: {
    ...MobileQrScanCatalog.args,
    qrStepView: 'checkout',
    cart: [
      {
        ...PRODUCT_CATALOG[0],
        quantity: 2
      }
    ],
    totalCartCount: 2,
    rawSubtotal: 56000,
    grandTotalBill: 56000
  }
}
