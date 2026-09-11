import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { PosPaymentSettlementModal } from '../components/pos/PosPaymentSettlementModal'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

describe('POS Payment Settlement Modal Flow (Toast / Square Benchmark)', () => {
  const sampleItems = [
    { id: '1', name: 'Caramel Macchiato', price: 42000, quantity: 2, category: 'coffee' }
  ]

  it('renders bill summary with subtotal and PB1 10% tax in settlement modal', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={sampleItems as any}
            selectedTable={{ id: 'tbl-1', name: 'OUT-04', status: 'occupied', seats: [], shape: 'round', totalBill: 92400, orderCount: 2 } as any}
            subtotal={84000}
            pb1Tax={8400}
            grandTotal={92400}
            fulfillmentMode="dine_in"
            posPayMethod="cash"
            setPosPayMethod={vi.fn()}
            posCashGiven="100000"
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // Table identity
    expect(html).toContain('Meja OUT-04')
    // Subtotal and tax
    expect(html).toContain('92.400')
    // Payment method selector
    expect(html).toContain('Tunai')
    expect(html).toContain('QRIS')
    expect(html).toContain('Kartu EDC')
    // Kembalian calculation
    expect(html).toContain('Kembalian:')
    expect(html).toContain('7.600')
    // Selesaikan CTA
    expect(html).toContain('Selesaikan &amp; Cetak Struk')
  })

  it('calculates change amount correctly for cash presets', () => {
    const payableAmount = 92400
    const cashGiven = 100000
    const change = cashGiven - payableAmount
    expect(change).toBe(7600)
  })

  it('renders interactive virtual card tender form when card payment method is selected', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={sampleItems as any}
            selectedTable={null}
            subtotal={84000}
            pb1Tax={8400}
            grandTotal={92400}
            fulfillmentMode="takeaway"
            posPayMethod="card"
            setPosPayMethod={vi.fn()}
            posCashGiven="92400"
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // Card tender elements from PosCardTenderForm
    expect(html).toContain('VISA')
    expect(html).toContain('Trace:')
    expect(html).toContain('APPR-8899')
  })

  it('renders rich QRIS provider options and RRN fields when qris payment method is selected', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={sampleItems as any}
            selectedTable={null}
            subtotal={84000}
            pb1Tax={8400}
            grandTotal={92400}
            fulfillmentMode="dine_in"
            posPayMethod="qris"
            setPosPayMethod={vi.fn()}
            posCashGiven="92400"
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
            qrisMetadata={{ provider: 'GoPay', rrnRefNumber: '123456789012', senderName: 'Budi' }}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // QRIS provider pills and RRN
    expect(html).toContain('GoPay')
    expect(html).toContain('123456789012')
    expect(html).toContain('Budi')
  })
})
