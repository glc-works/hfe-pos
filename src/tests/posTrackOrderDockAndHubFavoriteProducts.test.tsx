import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { PosTrackOrderDock } from '../components/pos/PosTrackOrderDock'
import { FavoriteProductsLeaderboard } from '../components/hub/FavoriteProductsLeaderboard'
import { LanguageProvider } from '../context/LanguageContext'
import { OrderTicket } from '../types/pos'

const mockOrders: OrderTicket[] = [
  {
    id: 'ORD-101',
    table: '04',
    customerName: 'Mike',
    items: [{ id: 'ITEM-1', name: 'Croissant', price: 28000, quantity: 2, category: 'Pastry', hfeCategoryCode: 'FNB', image: '', description: '' }],
    policy: 'open-tab',
    total: 56000,
    taxPB1Amount: 5600,
    serviceFeeAmount: 0,
    tipAmount: 0,
    status: 'processing',
    timeElapsedMinutes: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-102',
    table: '02',
    customerName: 'Richard',
    items: [{ id: 'ITEM-2', name: 'Latte', price: 35000, quantity: 1, category: 'Coffee', hfeCategoryCode: 'FNB', image: '', description: '' }],
    policy: 'open-tab',
    total: 35000,
    taxPB1Amount: 3500,
    serviceFeeAmount: 0,
    tipAmount: 0,
    status: 'ready',
    timeElapsedMinutes: 12,
    createdAt: new Date().toISOString()
  }
]

describe('L2-POS-103: Live Track Order Dock & Hub Favorite Products', () => {
  it('renders PosTrackOrderDock with active kitchen and barista orders count', () => {
    const html = renderToString(
      <LanguageProvider>
        <PosTrackOrderDock orders={mockOrders} />
      </LanguageProvider>
    )

    expect(html).toContain('Lacak Pesanan Dapur (Track Order)')
    expect(html).toContain('Aktif')
    expect(html).toContain('2')
    expect(html).toContain('Sinkron KDS Dapur &amp; Barista')
  })

  it('returns null for PosTrackOrderDock when all orders are served or empty', () => {
    const servedOrders: OrderTicket[] = [
      {
        ...mockOrders[0],
        id: 'ORD-103',
        status: 'served'
      }
    ]

    const html = renderToString(
      <LanguageProvider>
        <PosTrackOrderDock orders={servedOrders} />
      </LanguageProvider>
    )

    expect(html).toBe('')
  })

  it('renders FavoriteProductsLeaderboard in HUB with top 5 rankings and sales volume', () => {
    const html = renderToString(
      <LanguageProvider>
        <FavoriteProductsLeaderboard />
      </LanguageProvider>
    )

    expect(html).toContain('Menu Terlaris (Favorite Products)')
    expect(html).toContain('Top 5')
    expect(html).toContain('Espresso Aren Latte')
    expect(html).toContain('Japanese Cold Brew V60')
    expect(html).toContain('Croissant Butter Prancis')
    expect(html).toContain('184')
    expect(html).toContain('Porsi')
  })
})
