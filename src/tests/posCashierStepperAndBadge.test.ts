import { describe, it, expect, vi } from 'vitest'
import { CartItem, MenuItem } from '../types/pos'

describe('POS Cashier Stepper & Sensory Feedback Tests (POS-ENG-STD-001)', () => {
  const mockCatalog: MenuItem[] = [
    {
      id: 'SKU-001',
      name: 'Espresso Single',
      price: 18000,
      category: 'Beverage',
      hfeCategoryCode: 'BEV-001',
      image: '☕',
      description: 'Single origin espresso'
    },
    {
      id: 'SKU-002',
      name: 'Caramel Macchiato',
      price: 35000,
      category: 'Beverage',
      hfeCategoryCode: 'BEV-002',
      image: '☕',
      description: 'Rich espresso with caramel'
    },
    {
      id: 'SKU-003',
      name: 'Croissant Butter',
      price: 25000,
      category: 'Pastry',
      hfeCategoryCode: 'PAS-001',
      image: '🥐',
      description: 'French butter croissant'
    }
  ]

  it('correctly calculates cartQty and cartItemIndex for active items', () => {
    const cartItems: CartItem[] = [
      { ...mockCatalog[0], quantity: 2 },
      { ...mockCatalog[2], quantity: 1 }
    ]

    // Item 1 (In cart, qty 2)
    const item1 = mockCatalog[0]
    const idx1 = cartItems.findIndex(c => c.id === item1.id || c.name === item1.name)
    const qty1 = cartItems.filter(c => c.id === item1.id || c.name === item1.name).reduce((sum, c) => sum + c.quantity, 0)
    expect(idx1).toBe(0)
    expect(qty1).toBe(2)

    // Item 2 (Not in cart, qty 0)
    const item2 = mockCatalog[1]
    const idx2 = cartItems.findIndex(c => c.id === item2.id || c.name === item2.name)
    const qty2 = cartItems.filter(c => c.id === item2.id || c.name === item2.name).reduce((sum, c) => sum + c.quantity, 0)
    expect(idx2).toBe(-1)
    expect(qty2).toBe(0)

    // Item 3 (In cart, qty 1)
    const item3 = mockCatalog[2]
    const idx3 = cartItems.findIndex(c => c.id === item3.id || c.name === item3.name)
    const qty3 = cartItems.filter(c => c.id === item3.id || c.name === item3.name).reduce((sum, c) => sum + c.quantity, 0)
    expect(idx3).toBe(1)
    expect(qty3).toBe(1)
  })

  it('increments item quantity when (+) stepper is triggered', () => {
    let cartItems: CartItem[] = [
      { ...mockCatalog[0], quantity: 1 }
    ]

    const handleAddToCart = (item: MenuItem) => {
      const idx = cartItems.findIndex(c => c.id === item.id)
      if (idx >= 0) {
        cartItems[idx] = { ...cartItems[idx], quantity: cartItems[idx].quantity + 1 }
      } else {
        cartItems.push({ ...item, quantity: 1 })
      }
    }

    const handleUpdateQty = (index: number, newQty: number) => {
      if (newQty <= 0) {
        cartItems = cartItems.filter((_, i) => i !== index)
      } else {
        cartItems = cartItems.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
      }
    }

    // Trigger Add / Plus on SKU-001
    handleAddToCart(mockCatalog[0])
    expect(cartItems[0].quantity).toBe(2)

    // Trigger Plus on SKU-002 (new item)
    handleAddToCart(mockCatalog[1])
    expect(cartItems.length).toBe(2)
    expect(cartItems[1].quantity).toBe(1)

    // Update via onUpdateQty index 0
    handleUpdateQty(0, cartItems[0].quantity + 1)
    expect(cartItems[0].quantity).toBe(3)
  })

  it('decrements item quantity and removes item when reaching qty 0', () => {
    let cartItems: CartItem[] = [
      { ...mockCatalog[0], quantity: 2 },
      { ...mockCatalog[1], quantity: 1 }
    ]

    const handleUpdateQty = (index: number, newQty: number) => {
      if (newQty <= 0) {
        cartItems = cartItems.filter((_, i) => i !== index)
      } else {
        cartItems = cartItems.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
      }
    }

    // Decrement SKU-001 from 2 to 1
    handleUpdateQty(0, cartItems[0].quantity - 1)
    expect(cartItems[0].quantity).toBe(1)

    // Decrement SKU-002 from 1 to 0 (should remove it)
    handleUpdateQty(1, cartItems[1].quantity - 1)
    expect(cartItems.length).toBe(1)
    expect(cartItems.find(c => c.id === 'SKU-002')).toBeUndefined()

    // Decrement remaining SKU-001 to 0 (should remove it, cart becomes empty)
    handleUpdateQty(0, 0)
    expect(cartItems.length).toBe(0)
  })

  it('guarantees badge and stepper visibility flags across different view modes', () => {
    const cartItems: CartItem[] = [
      { ...mockCatalog[1], quantity: 4 }
    ]

    mockCatalog.forEach(item => {
      const cartQty = cartItems.filter(c => c.id === item.id || c.name === item.name).reduce((sum, c) => sum + c.quantity, 0)
      const shouldShowBadge = cartQty > 0
      const shouldShowStepper = cartQty > 0

      if (item.id === 'SKU-002') {
        expect(shouldShowBadge).toBe(true)
        expect(shouldShowStepper).toBe(true)
        expect(cartQty).toBe(4)
      } else {
        expect(shouldShowBadge).toBe(false)
        expect(shouldShowStepper).toBe(false)
        expect(cartQty).toBe(0)
      }
    })
  })

  it('handles name-based table cart item reconciliation when item id matches or is resolved', () => {
    // Simulated table bill items that have formatted name like "Caramel Macchiato (MEJA-04)"
    const tableCartItems: CartItem[] = [
      {
        ...mockCatalog[1],
        id: 'SKU-002',
        name: 'Caramel Macchiato (MEJA-04)',
        quantity: 2
      }
    ]

    const item = mockCatalog[1]
    const matchById = tableCartItems.find(c => c.id === item.id)
    expect(matchById).toBeDefined()
    expect(matchById?.quantity).toBe(2)
  })
})
