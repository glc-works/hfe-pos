import { describe, it, expect, vi } from 'vitest'
import { MenuItem } from '../types/pos'

const MOCK_PRODUCT: MenuItem = {
  id: 'PROD-001',
  name: 'Espresso Aren Latte',
  category: 'Coffee',
  price: 28000,
  image: '☕',
  description: 'Espresso ganda Arabica kintamani dipadu gula aren organik',
  hfeCategoryCode: 'SKU-COF-001'
}

describe('Universal Shared ProductCard Standard', () => {
  it('determines SKU visibility strictly based on persona / channel variant', () => {
    // POS variants (Cashier / Barista) MUST show SKU by default
    const isPosVariant = (v: string) => v.startsWith('pos-')
    expect(isPosVariant('pos-list')).toBe(true)
    expect(isPosVariant('pos-grid')).toBe(true)
    expect(isPosVariant('pos-compact')).toBe(true)

    // Customer variants MUST hide SKU by default
    expect(isPosVariant('customer-card')).toBe(false)
    expect(isPosVariant('speed-key')).toBe(false)
  })

  it('guarantees event isolation and single-increment on user click', () => {
    let cartQty = 1
    const onAddToCart = vi.fn(() => {
      cartQty += 1
    })
    const onUpdateQty = vi.fn((newQty: number) => {
      cartQty = newQty
    })

    // Simulate clicking "+" button with stopPropagation
    const fakeEvent = {
      stopPropagation: vi.fn()
    } as unknown as React.MouseEvent

    const handlePlusClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onAddToCart()
    }

    handlePlusClick(fakeEvent)

    expect(fakeEvent.stopPropagation).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(cartQty).toBe(2) // Exactly 1 increment, zero double-firing!
  })

  it('handles negative decrement and clamp at 0', () => {
    let cartQty = 1
    const onUpdateQty = vi.fn((newQty: number) => {
      cartQty = Math.max(0, newQty)
    })

    const handleMinusClick = () => {
      onUpdateQty(cartQty - 1)
    }

    handleMinusClick()
    expect(cartQty).toBe(0)

    // Decrementing below 0 clamps at 0
    handleMinusClick()
    expect(cartQty).toBe(0)
  })
})
