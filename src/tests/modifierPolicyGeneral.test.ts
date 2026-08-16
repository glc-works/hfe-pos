import { describe, it, expect } from 'vitest'
import { MenuItem } from '../types/pos'
import { 
  shouldOpenItemModifierModal, 
  shouldAllowItemCustomNotes,
  DEFAULT_CATEGORY_CONFIGS 
} from '../utils/modifierHelpers'

describe('Generalized Modifier & Category Policy Engine (POS-ENG-STD-001)', () => {
  const beverageItem: MenuItem = {
    id: 'MN-001',
    name: 'Espresso Aren Latte',
    category: 'Coffee',
    hfeCategoryCode: 'BEV',
    price: 28000,
    image: 'https://example.com/coffee.jpg',
    description: 'Specialty coffee'
  }

  const snackItem: MenuItem = {
    id: 'MN-004',
    name: 'Truffle Fries with Garlic Mayo',
    category: 'Snack',
    hfeCategoryCode: 'FOOD',
    price: 38000,
    image: 'https://example.com/fries.jpg',
    description: 'French fries'
  }

  const pastryItem: MenuItem = {
    id: 'MN-003',
    name: 'Almond Croissant',
    category: 'Pastry',
    hfeCategoryCode: 'FOOD',
    price: 35000,
    image: 'https://example.com/croissant.jpg',
    description: 'Fresh pastry'
  }

  it('Category Level: Coffee & Non-Coffee open modifier modal by default', () => {
    expect(shouldOpenItemModifierModal(beverageItem)).toBe(true)
  })

  it('Category Level: Snack & Pastry add to cart in 1-tap direct without modal', () => {
    expect(shouldOpenItemModifierModal(snackItem)).toBe(false)
    expect(shouldOpenItemModifierModal(pastryItem)).toBe(false)
  })

  it('Item Override: Item with explicit modifierPolicy="always" forces modal open', () => {
    const customFries: MenuItem = {
      ...snackItem,
      modifierPolicy: 'always'
    }
    expect(shouldOpenItemModifierModal(customFries)).toBe(true)
  })

  it('Item Override: Item with explicit modifierPolicy="never" disables modal even for Coffee', () => {
    const cannedCoffee: MenuItem = {
      ...beverageItem,
      modifierPolicy: 'never'
    }
    expect(shouldOpenItemModifierModal(cannedCoffee)).toBe(false)
  })

  it('Item Override: Item with explicit hasModifiers=true enables modal', () => {
    const burgerWithToppings: MenuItem = {
      ...snackItem,
      hasModifiers: true
    }
    expect(shouldOpenItemModifierModal(burgerWithToppings)).toBe(true)
  })

  it('Notes Policy: Snack and Pastry disallow free-text notes by default', () => {
    expect(shouldAllowItemCustomNotes(snackItem)).toBe(false)
    expect(shouldAllowItemCustomNotes(pastryItem)).toBe(false)
  })

  it('Notes Policy: Explicit allowCustomNotes=true overrides category policy', () => {
    const customPastry: MenuItem = {
      ...pastryItem,
      allowCustomNotes: true
    }
    expect(shouldAllowItemCustomNotes(customPastry)).toBe(true)
  })
})
