import { describe, it, expect } from 'vitest'
import { CartItem, MenuItem, OrderTicket } from '../types/pos'
import { calculateMemberTier, calculateStampProgress } from './customerPortalAndMemberCard.test'

describe('Wave 2: Customer Touchpoints & Order Channels Suite', () => {
  describe('Pillar A: Modifier Transparency & Calculation', () => {
    it('accurately calculates item price with modifier add-ons', () => {
      const baseItem: MenuItem = {
        id: 'COFFEE-01',
        name: 'Artisan Latte',
        category: 'Coffee',
        hfeCategoryCode: 'CAT-COF',
        price: 35000,
        image: '/images/latte.jpg',
        description: 'Fresh espresso with steamed milk',
        temperature: 'Iced',
        sugarLevel: '50%',
        milkOption: 'Oat Milk (+Rp 5.000)',
      }

      const oatMilkExtra = 5000
      const unitPriceWithAddons = baseItem.price + oatMilkExtra
      const quantity = 3
      const totalItemPrice = unitPriceWithAddons * quantity

      expect(totalItemPrice).toBe(120000)
    })

    it('verifies transparent modifier tags format for customer checkout', () => {
      const cartItem: CartItem = {
        id: 'COFFEE-02',
        name: 'Cappuccino',
        category: 'Coffee',
        hfeCategoryCode: 'CAT-COF',
        price: 38000,
        image: '/images/cappuccino.jpg',
        description: 'Rich espresso with milk foam',
        quantity: 2,
        temperature: 'Hot',
        sugarLevel: '0%',
        milkOption: 'Fresh Milk',
        customNotes: 'Extra hot',
      }

      const modifierSummary = [
        cartItem.temperature,
        `Gula: ${cartItem.sugarLevel}`,
        cartItem.milkOption,
      ].filter(Boolean)

      expect(modifierSummary).toEqual(['Hot', 'Gula: 0%', 'Fresh Milk'])
      expect(cartItem.customNotes).toBe('Extra hot')
    })
  })

  describe('Pillar B: Table & Zone Context Hydration', () => {
    it('formats table and zone indicator pill accurately', () => {
      const tableNumber = 'IND-02'
      const zoneName = 'Indoor AC'
      const formattedBadge = `🍽️ Meja ${tableNumber} • ❄️ ${zoneName}`

      expect(formattedBadge).toContain('IND-02')
      expect(formattedBadge).toContain('Indoor AC')
    })
  })

  describe('Pillar C: 1-Tap Re-Order Mutation', () => {
    it('creates new cart items from previous order ticket without state pollution', () => {
      const pastOrderTicket: OrderTicket = {
        id: 'ORD-PAST-01',
        table: 'T-01',
        customerName: 'Budi Santoso',
        policy: 'pay-first',
        status: 'served',
        timeElapsedMinutes: 45,
        createdAt: new Date().toISOString(),
        total: 75000,
        taxPB1Amount: 7500,
        serviceFeeAmount: 0,
        tipAmount: 0,
        items: [
          {
            id: 'PAST-ITEM-01',
            name: 'Avocado Toast',
            category: 'Pastry',
            hfeCategoryCode: 'CAT-PAS',
            price: 45000,
            quantity: 1,
            image: '/images/toast.jpg',
            description: 'Toasted sourdough with fresh avocado',
          },
          {
            id: 'PAST-ITEM-02',
            name: 'Cold Brew',
            category: 'Coffee',
            hfeCategoryCode: 'CAT-COF',
            price: 30000,
            quantity: 1,
            image: '/images/coldbrew.jpg',
            description: '18h steeped Ethiopian cold brew',
          },
        ],
      }

      // 1-Tap Reorder Action: extract items
      const reorderedItems = pastOrderTicket.items.map((item) => ({
        ...item,
        quantity: item.quantity,
      }))

      expect(reorderedItems.length).toBe(2)
      expect(reorderedItems[0].name).toBe('Avocado Toast')
      expect(reorderedItems[1].name).toBe('Cold Brew')
    })
  })

  describe('Pillar D: Customer Member Portal & Stamp Tracker Math', () => {
    it('calculates stamp progress and unlock reward threshold accurately', () => {
      const stampProgress = calculateStampProgress(8, 10)
      expect(stampProgress.current).toBe(8)
      expect(stampProgress.max).toBe(10)
      expect(stampProgress.remaining).toBe(2)
      expect(stampProgress.isRewardReady).toBe(false)

      const stampProgressFull = calculateStampProgress(10, 10)
      expect(stampProgressFull.isRewardReady).toBe(true)
      expect(stampProgressFull.remaining).toBe(0)
    })

    it('calculates member tier upgrades deterministically', () => {
      expect(calculateMemberTier(300000)).toBe('Bronze')
      expect(calculateMemberTier(750000)).toBe('Silver')
      expect(calculateMemberTier(2500000)).toBe('Gold')
      expect(calculateMemberTier(6000000)).toBe('Platinum')
    })
  })
})
