import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { PosFavoritesBar } from '../components/pos/PosFavoritesBar'
import { FavoriteProductsLeaderboard } from '../components/hub/FavoriteProductsLeaderboard'
import { LanguageProvider } from '../context/LanguageContext'
import { OrderTicket, MenuItem } from '../types/pos'

const mockFavorites: MenuItem[] = [
  { id: 'MENU-1', name: 'Espresso Aren Latte', price: 28000, category: 'Coffee', hfeCategoryCode: 'FNB', image: '☕', description: '' },
  { id: 'MENU-2', name: 'Croissant Butter Paris', price: 25000, category: 'Pastry', hfeCategoryCode: 'FNB', image: '🥐', description: '' }
]

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

describe('L2-POS-103: In-Place PosFavoritesBar Tab Switcher & Hub Favorite Products', () => {
  it('renders PosFavoritesBar with Speed Keys tab and Lacak Dapur badge', () => {
    const html = renderToString(
      <LanguageProvider>
        <PosFavoritesBar
          pinnedFavorites={mockFavorites}
          isImageUrl={() => false}
          onAddToCart={() => {}}
          orders={mockOrders}
        />
      </LanguageProvider>
    )

    expect(html).toContain('Speed Keys')
    expect(html).toContain('Lacak Dapur')
    expect(html).toContain('Espresso Aren Latte')
    expect(html).toContain('Croissant Butter Paris')
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
