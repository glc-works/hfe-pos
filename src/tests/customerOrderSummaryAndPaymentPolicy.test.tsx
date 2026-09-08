import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { CustomerOrderSummaryView } from '../components/customer/CustomerOrderSummaryView'
import { OrderTicket, CafeThemeConfig } from '../types/pos'
import { LanguageProvider } from '../context/LanguageContext'

const mockTheme: CafeThemeConfig = {
  themeId: 'modern-dark',
  themeName: 'Modern Dark',
  mode: 'dark',
  primaryAccentHex: '#f59e0b',
  pageBgHex: '#020617',
  cardBgHex: '#0f172a',
  textColorHex: '#f8fafc',
  fontFamily: 'Inter',
  borderRadiusPx: 16
}

const mockOrderPayFirst: OrderTicket = {
  id: 'ORD-4821',
  table: 'OUT-04',
  customerName: 'Aldi',
  items: [
    {
      id: 'c1',
      name: 'Caramel Macchiato',
      price: 35000,
      quantity: 2,
      category: 'Coffee',
      hfeCategoryCode: 'CAT-COF',
      image: '/coffee.jpg',
      description: 'Espresso with milk and caramel',
      selectedModifiers: [{ groupId: 'g1', optionId: 'o1', name: 'Oat Milk', priceDelta: 5000 }]
    }
  ],
  policy: 'pay-first',
  total: 77000,
  taxPB1Amount: 7000,
  serviceFeeAmount: 0,
  tipAmount: 0,
  status: 'processing',
  timeElapsedMinutes: 1,
  createdAt: '16:05',
  queueNumber: 12
}

const mockOrderOpenTab: OrderTicket = {
  id: 'ORD-9102',
  table: 'OUT-04',
  customerName: 'Aldi',
  items: [
    {
      id: 'f1',
      name: 'Truffle Fries',
      price: 45000,
      quantity: 1,
      category: 'Snack',
      hfeCategoryCode: 'CAT-SNK',
      image: '/fries.jpg',
      description: 'Crispy truffle fries'
    }
  ],
  policy: 'open-tab',
  total: 49500,
  taxPB1Amount: 4500,
  serviceFeeAmount: 0,
  tipAmount: 0,
  status: 'placed',
  timeElapsedMinutes: 2,
  createdAt: '16:10'
}

describe('CustomerOrderSummaryView - Adaptive Payment Policy Parity', () => {
  it('renders pay-first mode with queue number and paid confirmation', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <CustomerOrderSummaryView
          order={mockOrderPayFirst}
          selectedTable="OUT-04"
          activeTheme={mockTheme}
          paymentPolicy="pay-first"
          onAddMoreItems={vi.fn()}
        />
      </LanguageProvider>
    )

    // Verify order ID and details
    expect(html).toContain('#ORD-4821')
    expect(html).toContain('Caramel Macchiato')
    expect(html).toContain('Transaction Number')
    expect(html).toContain('Number of Pax')
    expect(html).toContain('Table:')
    expect(html).toContain('OUT-04')
    expect(html).toContain('Lunas')
    expect(html).toContain('Terbayar')
  })

  it('renders open-tab mode with kitchen dispatch status and split payment options', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <CustomerOrderSummaryView
          order={mockOrderOpenTab}
          tableOrders={[mockOrderPayFirst, mockOrderOpenTab]}
          selectedTable="OUT-04"
          activeTheme={mockTheme}
          paymentPolicy="open-tab"
          onAddMoreItems={vi.fn()}
          onPayOrderNow={vi.fn()}
          onPayTableSession={vi.fn()}
        />
      </LanguageProvider>
    )

    // Verify open tab status
    expect(html).toContain('#ORD-9102')
    expect(html).toContain('Order 1 (2 Item)')
    expect(html).toContain('Order 2 (1 Item)')
    expect(html).toContain('Truffle Fries')
    expect(html).toContain('Preparing')
    expect(html).toContain('Total Payment')
    expect(html).toContain('Pay')
  })

  it('gracefully renders empty state when no active order exists', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <CustomerOrderSummaryView
          order={null}
          selectedTable="OUT-04"
          activeTheme={mockTheme}
          paymentPolicy="open-tab"
          onAddMoreItems={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(html).toContain('Belum Ada Pesanan Aktif')
    expect(html).toContain('+ Tambah Menu Lain / Ronde Baru')
  })
})
