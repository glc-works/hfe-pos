import { describe, it, expect } from 'vitest'
import { MenuItem, CartItem, ModifierGroup, SelectedModifier } from '../types/pos'

/**
 * Calculates effective unit price including active modifier price deltas
 */
function calculateItemUnitPrice(item: MenuItem | CartItem, selectedModifiers?: SelectedModifier[]): number {
  const mods = selectedModifiers || ('selectedModifiers' in item ? item.selectedModifiers : []) || []
  const modifierTotal = mods.reduce((sum, m) => sum + m.priceDelta, 0)
  return item.price + modifierTotal
}

/**
 * Calculates total gross cart value across all line items and their selected modifiers
 */
function calculateCartGrossTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const unitPrice = calculateItemUnitPrice(item, item.selectedModifiers)
    return total + (unitPrice * item.quantity)
  }, 0)
}

/**
 * Helper to update selected modifiers for single/multiple selection groups
 */
function selectModifier(
  current: SelectedModifier[],
  group: ModifierGroup,
  optionId: string
): SelectedModifier[] {
  const option = group.options.find(o => o.id === optionId)
  if (!option) return current

  if (group.selectionType === 'single') {
    const filtered = current.filter(m => m.groupId !== group.id)
    return [...filtered, { groupId: group.id, optionId: option.id, name: option.name, priceDelta: option.priceDelta }]
  } else {
    const exists = current.some(m => m.groupId === group.id && m.optionId === optionId)
    if (exists) {
      return current.filter(m => !(m.groupId === group.id && m.optionId === optionId))
    } else {
      return [...current, { groupId: group.id, optionId: option.id, name: option.name, priceDelta: option.priceDelta }]
    }
  }
}

describe('Customer QR Dynamic Modifiers & Cart Math Engine', () => {
  const sampleLatte: MenuItem = {
    id: 'MENU-LATTE-01',
    name: 'Espresso Aren Latte',
    category: 'Coffee',
    hfeCategoryCode: 'BEV_COFFEE',
    price: 28000,
    image: '/images/latte.jpg',
    description: 'Espresso with fresh milk and palm sugar',
    hasModifiers: true,
    modifierGroups: [
      {
        id: 'grp-milk',
        name: 'Pilihan Susu',
        selectionType: 'single',
        options: [
          { id: 'm-regular', name: 'Fresh Milk Regular', priceDelta: 0 },
          { id: 'm-oat', name: 'Oat Milk Barista Edition', priceDelta: 6000 },
          { id: 'm-almond', name: 'Almond Milk Organik', priceDelta: 8000 },
        ]
      },
      {
        id: 'grp-sugar',
        name: 'Tingkat Gula (Sugar Level)',
        selectionType: 'single',
        options: [
          { id: 's-normal', name: 'Normal Sugar (100%)', priceDelta: 0 },
          { id: 's-less', name: 'Less Sugar (50%)', priceDelta: 0 },
          { id: 's-none', name: 'No Sugar (0%)', priceDelta: 0 },
        ]
      },
      {
        id: 'grp-topping',
        name: 'Extra Topping & Add-ons',
        selectionType: 'multiple',
        options: [
          { id: 'top-shot', name: 'Extra Espresso Shot', priceDelta: 5000 },
          { id: 'top-jelly', name: 'Grass Jelly Organik', priceDelta: 4000 },
          { id: 'top-cream', name: 'Cheese Foam Macchiato', priceDelta: 6000 },
        ]
      }
    ]
  }

  it('calculates base item price correctly with zero modifiers', () => {
    const unitPrice = calculateItemUnitPrice(sampleLatte, [])
    expect(unitPrice).toBe(28000)
  })

  it('handles single-choice modifier selection with positive price delta (Oat Milk +6.000)', () => {
    let mods: SelectedModifier[] = []
    const milkGroup = sampleLatte.modifierGroups![0]
    mods = selectModifier(mods, milkGroup, 'm-oat')

    expect(mods).toHaveLength(1)
    expect(mods[0].name).toBe('Oat Milk Barista Edition')
    expect(mods[0].priceDelta).toBe(6000)

    const unitPrice = calculateItemUnitPrice(sampleLatte, mods)
    expect(unitPrice).toBe(34000)
  })

  it('replaces single-choice modifier in same group without accumulating delta', () => {
    let mods: SelectedModifier[] = []
    const milkGroup = sampleLatte.modifierGroups![0]
    mods = selectModifier(mods, milkGroup, 'm-oat') // +6.000
    expect(calculateItemUnitPrice(sampleLatte, mods)).toBe(34000)

    // Switch to Almond Milk (+8.000)
    mods = selectModifier(mods, milkGroup, 'm-almond')
    expect(mods).toHaveLength(1)
    expect(mods[0].optionId).toBe('m-almond')
    expect(calculateItemUnitPrice(sampleLatte, mods)).toBe(36000)
  })

  it('handles zero-delta modifier selections (Less Sugar 50%) preserving price', () => {
    let mods: SelectedModifier[] = []
    const sugarGroup = sampleLatte.modifierGroups![1]
    mods = selectModifier(mods, sugarGroup, 's-less')

    expect(mods).toHaveLength(1)
    expect(mods[0].priceDelta).toBe(0)
    expect(calculateItemUnitPrice(sampleLatte, mods)).toBe(28000)
  })

  it('accumulates multiple-choice toppings correctly (Extra Shot + Grass Jelly = +9.000)', () => {
    let mods: SelectedModifier[] = []
    const toppingGroup = sampleLatte.modifierGroups![2]

    mods = selectModifier(mods, toppingGroup, 'top-shot')  // +5.000
    mods = selectModifier(mods, toppingGroup, 'top-jelly') // +4.000

    expect(mods).toHaveLength(2)
    const unitPrice = calculateItemUnitPrice(sampleLatte, mods)
    expect(unitPrice).toBe(37000) // 28.000 + 5.000 + 4.000
  })

  it('toggles off / removes a multiple-choice topping when reselected', () => {
    let mods: SelectedModifier[] = []
    const toppingGroup = sampleLatte.modifierGroups![2]

    mods = selectModifier(mods, toppingGroup, 'top-shot')  // added
    mods = selectModifier(mods, toppingGroup, 'top-jelly') // added
    expect(mods).toHaveLength(2)

    mods = selectModifier(mods, toppingGroup, 'top-shot')  // removed
    expect(mods).toHaveLength(1)
    expect(mods[0].optionId).toBe('top-jelly')
    expect(calculateItemUnitPrice(sampleLatte, mods)).toBe(32000) // 28.000 + 4.000
  })

  it('calculates full cart gross total across multiple items and quantities', () => {
    const cart: CartItem[] = [
      {
        ...sampleLatte,
        quantity: 2,
        selectedModifiers: [
          { groupId: 'grp-milk', optionId: 'm-oat', name: 'Oat Milk', priceDelta: 6000 },
          { groupId: 'grp-topping', optionId: 'top-shot', name: 'Extra Shot', priceDelta: 5000 },
        ] // Unit: 28.000 + 11.000 = 39.000 -> Subtotal: 78.000
      },
      {
        id: 'MENU-CROISSANT-01',
        name: 'Butter Croissant',
        category: 'Pastry',
        hfeCategoryCode: 'FOOD_PASTRY',
        price: 25000,
        image: '/images/croissant.jpg',
        description: 'French Butter Croissant',
        quantity: 3,
        selectedModifiers: [] // Unit: 25.000 -> Subtotal: 75.000
      }
    ]

    const grossTotal = calculateCartGrossTotal(cart)
    expect(grossTotal).toBe(153000) // 78.000 + 75.000
  })
})
