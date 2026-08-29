import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { CustomerDeliveryAddressCard } from '../components/customer/CustomerDeliveryAddressCard'
import { CustomerDeliveryAddressModal } from '../components/customer/CustomerDeliveryAddressModal'
import { CustomerDeliveryPaymentSelector } from '../components/customer/CustomerDeliveryPaymentSelector'
import { CustomerCheckoutView } from '../components/customer/CustomerCheckoutView'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { DeliveryAddressInfo, CartItem, CafeThemeConfig } from '../types/pos'

const mockAddress: DeliveryAddressInfo = {
  recipientName: 'Aldi',
  phoneNumber: '081298765432',
  streetAddress: 'Menara Mandiri, Jl. Jend. Sudirman Kav. 54-55',
  unitOrFloor: 'Lantai 18, Ruang 1802',
  dropOffOption: 'leave_at_lobby_guard',
  driverNotes: 'Titip di meja resepsionis lobi utama',
  distanceKm: 3.5
}

const mockTheme: CafeThemeConfig = {
  themeName: 'Warm Latte Cream (Light)',
  fontFamily: 'sans-serif',
  mode: 'light',
  pageBgHex: '#ffffff',
  cardBgHex: '#f8fafc',
  primaryAccentHex: '#d97706',
  textColorHex: '#0f172a',
  secondaryTextColorHex: '#64748b'
}

const mockCart: CartItem[] = [
  {
    id: 'ITEM-1',
    name: 'Espresso Aren Latte',
    price: 28000,
    quantity: 2,
    category: 'Coffee',
    hfeCategoryCode: 'FNB',
    image: '',
    description: ''
  }
]

describe('L2-POS-102: Luxury Online Delivery Checkout & Precision Address Architecture', () => {
  it('renders CustomerDeliveryAddressCard as a compact summary card on checkout', () => {
    const html = renderToString(
      <CustomerDeliveryAddressCard
        address={mockAddress}
        onChangeAddress={() => {}}
      />
    )

    expect(html).toContain('Pesan Antar (Online Delivery)')
    expect(html).toContain('3.5')
    expect(html).toContain('Menara Mandiri, Jl. Jend. Sudirman Kav. 54-55')
    expect(html).toContain('Lantai 18, Ruang 1802')
    expect(html).toContain('Titip Satpam / Lobby')
    expect(html).toContain('Titip di meja resepsionis lobi utama')
    expect(html).toContain('Ubah')
  })

  it('renders CustomerDeliveryAddressModal with complete 3-tier address form and drop-off selectors', () => {
    const html = renderToString(
      <CustomerDeliveryAddressModal
        isOpen={true}
        onClose={() => {}}
        address={mockAddress}
        onSaveAddress={() => {}}
      />
    )

    expect(html).toContain('Detail Alamat Pengiriman')
    expect(html).toContain('Alamat Utama &amp; Titik Lokasi')
    expect(html).toContain('Detail Unit / Lantai / Patokan')
    expect(html).toContain('Titip Satpam / Lobby')
    expect(html).toContain('Depan Pintu Unit')
    expect(html).toContain('Bertemu Langsung')
    expect(html).toContain('Simpan Alamat Pengiriman')
  })

  it('renders CustomerDeliveryPaymentSelector without raw radio buttons and enforces pay-first QRIS', () => {
    const html = renderToString(
      <CustomerDeliveryPaymentSelector
        selectedMethod="qris_instant"
        onSelectMethod={() => {}}
        grandTotalFormatted="Rp 74.000"
      />
    )

    // Verify zero raw radio buttons in DOM
    expect(html).not.toContain('type="radio"')
    expect(html).toContain('QRIS Instan (Lunas di Depan)')
    expect(html).toContain('Aktif • Bebas Biaya')
    expect(html).toContain('Pay-First • Terverifikasi')
  })

  it('renders CustomerCheckoutView in delivery mode with delivery fee, thermal packaging fee and CTA', () => {
    const html = renderToString(
      <MerchantConfigProvider>
        <LanguageProvider>
          <CustomerCheckoutView
            selectedTable="DELIVERY"
            scannedSeat="Online"
            activeTheme={mockTheme}
            cart={mockCart}
            promoCodeInput=""
            setPromoCodeInput={() => {}}
            appliedPromo={null}
            redeemedVoucher={false}
            serviceFeeRate={0}
            calculatedServiceFee={0}
            taxPB1Mode={1}
            calculatedPB1Tax={5600}
            selectedTipAmount={0}
            setSelectedTipAmount={() => {}}
            paymentPolicy="pay-first"
            setPaymentPolicy={() => {}}
            rawSubtotal={56000}
            grandTotalBill={61600}
            setQrStepView={() => {}}
            handleUpdateQty={() => {}}
            handleApplyPromo={() => {}}
            handleSubmitOrder={() => {}}
            fulfillmentMode="delivery"
            deliveryAddress={mockAddress}
            deliveryFee={12000}
            packagingFee={3000}
          />
        </LanguageProvider>
      </MerchantConfigProvider>
    )

    expect(html).toContain('Pesan Antar')
    expect(html).toContain('Ongkos Kirim')
    expect(html).toContain('Biaya Kemasan Delivery (Thermal Bag)')
    expect(html).toContain('Pesan Antar Sekarang')
  })
})
