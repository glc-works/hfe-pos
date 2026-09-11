import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { PosQrisTenderForm } from '../components/pos/PosQrisTenderForm'
import { PosPaymentSettlementModal } from '../components/pos/PosPaymentSettlementModal'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'
import { formatThermalReceiptText, ReceiptData } from '../services/receiptPrinter'

describe('Manual QRIS Reference & RRN Settlement Suite', () => {
  it('renders PosQrisTenderForm with popular providers and RRN input', () => {
    const setSelectedProvider = vi.fn()
    const setRrnRefNumber = vi.fn()
    const setSenderName = vi.fn()

    const html = renderToStaticMarkup(
      <LanguageProvider>
        <PosQrisTenderForm
          selectedProvider="BCA"
          setSelectedProvider={setSelectedProvider}
          rrnRefNumber="123456789012"
          setRrnRefNumber={setRrnRefNumber}
          senderName="Budi Santoso"
          setSenderName={setSenderName}
        />
      </LanguageProvider>
    )

    // Verify providers
    expect(html).toContain('BCA')
    expect(html).toContain('GoPay')
    expect(html).toContain('OVO')
    expect(html).toContain('ShopeePay')
    expect(html).toContain('Dana')
    expect(html).toContain('Mandiri')
    expect(html).toContain('Lainnya')

    // Verify badge
    expect(html).toContain('QRIS Statis Konter')

    // Verify input values
    expect(html).toContain('123456789012')
    expect(html).toContain('Budi Santoso')
  })

  it('renders QRIS tender form inside PosPaymentSettlementModal when posPayMethod is qris', () => {
    const setQrisMetadata = vi.fn()
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={[{ id: '1', name: 'Es Kopi Gula Aren', price: 25000, quantity: 2, category: 'Coffee' } as any]}
            selectedTable={null}
            subtotal={50000}
            pb1Tax={5000}
            grandTotal={55000}
            fulfillmentMode="takeaway"
            posPayMethod="qris"
            setPosPayMethod={vi.fn()}
            posCashGiven=""
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
            qrisMetadata={{ provider: 'GoPay', rrnRefNumber: 'GOPAY-998877' }}
            setQrisMetadata={setQrisMetadata}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    expect(html).toContain('Konfirmasi Pembayaran Kasir')
    expect(html).toContain('GoPay')
    expect(html).toContain('GOPAY-998877')
    expect(html).toContain('Selesaikan &amp; Cetak Struk')
  })

  it('prints QRIS provider and RRN reference number on thermal receipts', () => {
    const receiptData: ReceiptData = {
      receiptNo: 'RCP-20260911-001',
      storeName: 'Kopi Kenangan Senopati',
      storeAddress: 'Jl. Senopati No. 42, Jakarta Selatan',
      cashierName: 'Siti Rahma',
      customerName: 'Budi Santoso',
      tableNo: '04',
      orderType: 'dine-in',
      timestamp: '11/09/2026 21:15',
      items: [{ name: 'Caramel Macchiato', qty: 2, price: 40000 }],
      subtotal: 80000,
      pb1Tax: 8000,
      grandTotal: 88000,
      paymentMethod: 'qris',
      qrisProvider: 'BCA',
      qrisRrn: '000123456789'
    }

    const receiptOutput = formatThermalReceiptText(receiptData)

    expect(receiptOutput).toContain('Metode Bayar: QRIS')
    expect(receiptOutput).toContain('Penyedia QRIS : BCA')
    expect(receiptOutput).toContain('No. Ref / RRN : 000123456789')
    expect(receiptOutput).toContain('TOTAL BAYAR')
    expect(receiptOutput).toContain('Rp 88.000')
  })
})
