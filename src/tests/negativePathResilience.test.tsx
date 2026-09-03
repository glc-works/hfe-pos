import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { PosPaymentSettlementModal } from '../components/pos/PosPaymentSettlementModal'
import { ItemModifierModal } from '../components/customer/ItemModifierModal'
import { LanguageProvider } from '../context/LanguageContext'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

describe('Negative Path Resilience & Escape Hatch Tests', () => {
  it('renders split payment shortcut when cash given is insufficient', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <PosPaymentSettlementModal
            show={true}
            onClose={vi.fn()}
            items={[{ id: '1', name: 'Latte', price: 30000, quantity: 1, category: 'Coffee' }] as any}
            selectedTable={{ id: 'tbl-1', name: 'OUT-04', status: 'occupied', seats: [], shape: 'round', totalBill: 33000, orderCount: 1 } as any}
            subtotal={30000}
            pb1Tax={3000}
            grandTotal={33000}
            fulfillmentMode="dine_in"
            posPayMethod="cash"
            setPosPayMethod={vi.fn()}
            posCashGiven="20000"
            setPosCashGiven={vi.fn()}
            onConfirmSettlement={vi.fn()}
            onOpenSplitPaymentModal={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // Negative path indicator
    expect(html).toContain('Uang Kurang!')
    // Escape hatch shortcut to split payment
    expect(html).toContain('Bayar Sebagian (Split)')
    expect(html).toContain('13.000')
  })

  it('renders required modifier badge on mandatory modifier groups', () => {
    const itemWithRequiredGroup = {
      id: 'prod-1',
      name: 'Specialty Pour Over',
      price: 45000,
      category: 'Coffee',
      image: '/coffee.jpg',
      modifierGroups: [
        {
          id: 'grp-beans',
          name: 'Pilihan Biji Kopi',
          selectionType: 'single' as const,
          minSelection: 1,
          maxSelection: 1,
          options: [
            { id: 'opt-geisha', name: 'Panama Geisha', priceDelta: 20000 },
            { id: 'opt-ethiopia', name: 'Ethiopia Yirgacheffe', priceDelta: 0 }
          ]
        }
      ]
    }

    const html = renderToStaticMarkup(
      <LanguageProvider>
        <MerchantConfigProvider>
          <ItemModifierModal
            show={true}
            onClose={vi.fn()}
            item={itemWithRequiredGroup as any}
            onAddToCart={vi.fn()}
          />
        </MerchantConfigProvider>
      </LanguageProvider>
    )

    // Mandatory badge verification
    expect(html).toContain('Wajib')
    expect(html).toContain('Pilihan Biji Kopi')
    expect(html).toContain('Panama Geisha')
  })
})
