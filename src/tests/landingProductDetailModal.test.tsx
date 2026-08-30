import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ProductDetailModal } from '../components/landing/ProductDetailModal'
import { MenuItem } from '../types/pos'
import { LanguageProvider } from '../context/LanguageContext'

const mockProduct: MenuItem = {
  id: 'PROD-ESP-01',
  name: 'Espresso Single Origin Senopati',
  category: 'Coffee',
  hfeCategoryCode: 'CAT-COFFEE',
  price: 28000,
  image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
  description: 'Ekstraksi 1:2 dari biji kopi Gayo washed dengan crema tebal dan aroma floral.',
  bomIngredients: [
    { itemCode: 'ING-01', name: 'Biji Kopi Gayo', amount: '18g' }
  ]
}

describe('BOARD Product Quick-Peek Detail Modal Suite', () => {
  it('should render product name, formatted price, category, and tasting notes', () => {
    const html = renderToString(
      <LanguageProvider>
        <ProductDetailModal
          show={true}
          product={mockProduct}
          onClose={vi.fn()}
          onOrderNow={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(html).toContain('Espresso Single Origin Senopati')
    expect(html).toContain('Coffee')
    expect(html).toContain('Biji Kopi Gayo')
    expect(html).toContain('Ekstraksi 1:2 dari biji kopi Gayo')
    expect(html).toContain('Pesan Menu Ini')
    expect(html).toContain('28.000')
  })

  it('should render null when show is false or product is null', () => {
    const htmlHidden = renderToString(
      <LanguageProvider>
        <ProductDetailModal
          show={false}
          product={mockProduct}
          onClose={vi.fn()}
          onOrderNow={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(htmlHidden).toBe('')

    const htmlNull = renderToString(
      <LanguageProvider>
        <ProductDetailModal
          show={true}
          product={null}
          onClose={vi.fn()}
          onOrderNow={vi.fn()}
        />
      </LanguageProvider>
    )

    expect(htmlNull).toBe('')
  })
})
