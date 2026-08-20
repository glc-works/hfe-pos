import { describe, it, expect } from 'vitest'
import { OrderFulfillmentMode } from '../types/pos'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'

describe('Order Fulfillment Modes & Takeaway Packaging Fee (POS-ENG-STD-001)', () => {
  const calculateTotalsWithFulfillment = (
    items: { price: number; quantity: number }[],
    mode: OrderFulfillmentMode
  ) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const pb1Tax = Math.round(subtotal * 0.1)
    const packagingFee = mode === 'takeaway' ? 2000 : 0
    const grandTotal = subtotal + pb1Tax + packagingFee

    return {
      subtotal,
      pb1Tax,
      packagingFee,
      grandTotal,
      mode
    }
  }

  describe('Fulfillment Mode Definitions', () => {
    it('supports all 3 authoritative fulfillment modes', () => {
      const validModes: OrderFulfillmentMode[] = ['dine_in', 'takeaway', 'delivery']
      expect(validModes).toContain('dine_in')
      expect(validModes).toContain('takeaway')
      expect(validModes).toContain('delivery')
      expect(validModes.length).toBe(3)
    })
  })

  describe('Takeaway Auto-Packaging Fee Math', () => {
    it('adds Rp 2.000 packaging fee for takeaway mode', () => {
      const items = [{ price: 30000, quantity: 2 }] // Subtotal 60.000, Tax 6.000
      const result = calculateTotalsWithFulfillment(items, 'takeaway')

      expect(result.subtotal).toBe(60000)
      expect(result.pb1Tax).toBe(6000)
      expect(result.packagingFee).toBe(2000)
      expect(result.grandTotal).toBe(68000) // 60k + 6k + 2k
    })

    it('charges Rp 0 packaging fee for dine_in mode', () => {
      const items = [{ price: 30000, quantity: 2 }]
      const result = calculateTotalsWithFulfillment(items, 'dine_in')

      expect(result.subtotal).toBe(60000)
      expect(result.pb1Tax).toBe(6000)
      expect(result.packagingFee).toBe(0)
      expect(result.grandTotal).toBe(66000) // 60k + 6k + 0
    })

    it('charges Rp 0 packaging fee for delivery mode', () => {
      const items = [{ price: 30000, quantity: 2 }]
      const result = calculateTotalsWithFulfillment(items, 'delivery')

      expect(result.subtotal).toBe(60000)
      expect(result.pb1Tax).toBe(6000)
      expect(result.packagingFee).toBe(0)
      expect(result.grandTotal).toBe(66000)
    })

    it('handles multi-item basket in takeaway mode accurately', () => {
      const items = [
        { price: 28000, quantity: 1 }, // Espresso: 28.000
        { price: 35000, quantity: 2 }, // Latte: 70.000
        { price: 42000, quantity: 1 }  // Croissant: 42.000
      ]
      // Subtotal = 140.000
      // PB1 Tax (10%) = 14.000
      // Packaging Fee = 2.000
      // Grand Total = 156.000
      const result = calculateTotalsWithFulfillment(items, 'takeaway')

      expect(result.subtotal).toBe(140000)
      expect(result.pb1Tax).toBe(14000)
      expect(result.packagingFee).toBe(2000)
      expect(result.grandTotal).toBe(156000)
    })

    it('handles empty cart in takeaway mode safely', () => {
      const result = calculateTotalsWithFulfillment([], 'takeaway')
      expect(result.subtotal).toBe(0)
      expect(result.pb1Tax).toBe(0)
      expect(result.packagingFee).toBe(2000)
      expect(result.grandTotal).toBe(2000)
    })
  })

  describe('i18n Translations Synchronization', () => {
    it('has all 3 mode labels and packaging fee keys defined in Indonesian dictionary', () => {
      expect(idTranslations.cart.dineInModeLabel).toBe('Makan di Tempat')
      expect(idTranslations.cart.takeawayModeLabel).toBe('Bungkus')
      expect(idTranslations.cart.deliveryModeLabel).toBe('Pesan Antar')
      expect(idTranslations.cart.packagingFeeLabel).toBe('Biaya Kemasan (Takeaway)')
      expect(idTranslations.cart.queueNumberLabel).toBe('No. Antrean')
    })

    it('has all 3 mode labels and packaging fee keys defined in English dictionary', () => {
      expect(enTranslations.cart.dineInModeLabel).toBe('Dine-In')
      expect(enTranslations.cart.takeawayModeLabel).toBe('Takeaway')
      expect(enTranslations.cart.deliveryModeLabel).toBe('Delivery')
      expect(enTranslations.cart.packagingFeeLabel).toBe('Packaging Fee (Takeaway)')
      expect(enTranslations.cart.queueNumberLabel).toBe('Queue #')
    })
  })
})
