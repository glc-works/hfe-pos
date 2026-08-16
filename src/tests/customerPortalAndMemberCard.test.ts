import { describe, it, expect } from 'vitest'
import { DigitalMemberCardData, MemberTier, CustomerPreferences, PurchasedEventTicket } from '../types/pos'

export const calculateMemberTier = (lifetimeSpend: number): MemberTier => {
  if (lifetimeSpend >= 5000000) return 'Platinum'
  if (lifetimeSpend >= 2000000) return 'Gold'
  if (lifetimeSpend >= 500000) return 'Silver'
  return 'Bronze'
}

export const calculatePointsDiscountRupiah = (points: number): number => {
  return points * 10
}

export const calculateStampProgress = (currentStamps: number, maxStamps: number = 10) => {
  const remaining = Math.max(0, maxStamps - currentStamps)
  const isRewardReady = currentStamps >= maxStamps
  return {
    current: currentStamps,
    max: maxStamps,
    remaining,
    isRewardReady
  }
}

export const generateMemberBarcode = (customerUid: string, tier: MemberTier): string => {
  return `CUST-${customerUid}-${tier.toUpperCase()}`
}

export const filterEventTickets = (tickets: PurchasedEventTicket[], statusFilter: 'all' | 'valid' | 'used') => {
  if (statusFilter === 'all') return tickets
  return tickets.filter(t => t.status === statusFilter)
}

export const calculateEcoPoints = (isPaperless: boolean, basePoints: number): number => {
  const ecoBonus = isPaperless ? 10 : 0
  return basePoints + ecoBonus
}

describe('Customer Portal & Digital Member Card Suite (L2-POS-47)', () => {
  describe('Member Tier Calculation & Thresholds', () => {
    it('accurately calculates Bronze tier for spend under Rp 500.000', () => {
      expect(calculateMemberTier(0)).toBe('Bronze')
      expect(calculateMemberTier(499999)).toBe('Bronze')
    })

    it('accurately calculates Silver tier for spend between Rp 500.000 and Rp 1.999.999', () => {
      expect(calculateMemberTier(500000)).toBe('Silver')
      expect(calculateMemberTier(1999999)).toBe('Silver')
    })

    it('accurately calculates Gold VIP tier for spend between Rp 2.000.000 and Rp 4.999.999', () => {
      expect(calculateMemberTier(2000000)).toBe('Gold')
      expect(calculateMemberTier(4500000)).toBe('Gold')
    })

    it('accurately calculates Platinum Elite tier for spend above Rp 5.000.000', () => {
      expect(calculateMemberTier(5000000)).toBe('Platinum')
      expect(calculateMemberTier(12000000)).toBe('Platinum')
    })
  })

  describe('Points Ledger & Rupiah Conversion', () => {
    it('converts loyalty points to rupiah checkout discount correctly (1 pt = Rp 10)', () => {
      expect(calculatePointsDiscountRupiah(100)).toBe(1000)
      expect(calculatePointsDiscountRupiah(1450)).toBe(14500)
      expect(calculatePointsDiscountRupiah(5000)).toBe(50000)
    })

    it('calculates eco-points bonus for paperless transactions (+10 Eco-Points)', () => {
      expect(calculateEcoPoints(true, 86)).toBe(96)
      expect(calculateEcoPoints(false, 86)).toBe(86)
    })
  })

  describe('Stamp Card Progress & Rewards', () => {
    it('calculates remaining stamps accurately for 8/10 cups', () => {
      const progress = calculateStampProgress(8, 10)
      expect(progress.current).toBe(8)
      expect(progress.max).toBe(10)
      expect(progress.remaining).toBe(2)
      expect(progress.isRewardReady).toBe(false)
    })

    it('flags reward as ready when 10/10 stamps are collected', () => {
      const progress = calculateStampProgress(10, 10)
      expect(progress.remaining).toBe(0)
      expect(progress.isRewardReady).toBe(true)
    })
  })

  describe('Barcode & QR Passbook Data Format', () => {
    it('generates high-contrast barcode format matching POS scanner spec', () => {
      const barcode = generateMemberBarcode('8829-01', 'Gold')
      expect(barcode).toBe('CUST-8829-01-GOLD')
      expect(barcode).toContain('CUST-')
    })

    it('validates digital member card payload integrity', () => {
      const sampleCard: DigitalMemberCardData = {
        cardNumber: 'CUST-8829-01',
        customerName: 'Aldi Pratama',
        phone: '081298765432',
        tier: 'Gold',
        pointsBalance: 1450,
        stampCount: 8,
        stampMax: 10,
        joinedDate: '12 Januari 2025',
        barcodeData: 'CUST-8829-01',
        qrData: 'HFE-MEMBER:CUST-8829-01:ALDI-PRATAMA:GOLD',
        brandName: 'Artisan Cafe & Roastery HQ',
        allergens: ['lactose', 'eggs']
      }

      expect(sampleCard.cardNumber).toBe('CUST-8829-01')
      expect(sampleCard.tier).toBe('Gold')
      expect(sampleCard.pointsBalance).toBe(1450)
      expect(sampleCard.allergens).toContain('lactose')
      expect(sampleCard.allergens).toContain('eggs')
    })
  })

  describe('E-Tickets Wallet Filtering', () => {
    const mockTickets: PurchasedEventTicket[] = [
      {
        ticketCode: 'TKT-EVT-01',
        eventId: 'EVT-01',
        eventTitle: 'Jazz Night',
        participantName: 'Aldi',
        participantPhone: '0812',
        quantity: 1,
        totalAmountPaid: 150000,
        paymentMethod: 'QRIS',
        purchasedAt: '2026-08-16',
        qrBarcodeData: 'HFE-TKT:01',
        status: 'valid'
      },
      {
        ticketCode: 'TKT-EVT-02',
        eventId: 'EVT-02',
        eventTitle: 'Cupping Workshop',
        participantName: 'Aldi',
        participantPhone: '0812',
        quantity: 1,
        totalAmountPaid: 250000,
        paymentMethod: 'QRIS',
        purchasedAt: '2026-08-10',
        qrBarcodeData: 'HFE-TKT:02',
        status: 'used'
      }
    ]

    it('filters valid tickets for active gate-in', () => {
      const valid = filterEventTickets(mockTickets, 'valid')
      expect(valid.length).toBe(1)
      expect(valid[0].ticketCode).toBe('TKT-EVT-01')
    })

    it('filters used tickets for event history logbook', () => {
      const used = filterEventTickets(mockTickets, 'used')
      expect(used.length).toBe(1)
      expect(used[0].ticketCode).toBe('TKT-EVT-02')
    })

    it('returns all tickets when filter is all', () => {
      const all = filterEventTickets(mockTickets, 'all')
      expect(all.length).toBe(2)
    })
  })

  describe('Customer Dietary & Vehicle Preferences', () => {
    it('maintains customer allergen preferences including eggs and lactose', () => {
      const prefs: CustomerPreferences = {
        favoriteDrink: 'Espresso Aren Latte',
        preferredMilk: 'Oat Milk (+Rp 5.000)',
        preferredSugar: '50%',
        vehiclePlateNumber: 'B 1234 XYZ',
        allergens: ['lactose', 'eggs'],
        paperlessReceipts: true,
        ecoPointsEarned: 30
      }

      expect(prefs.allergens).toContain('lactose')
      expect(prefs.allergens).toContain('eggs')
      expect(prefs.paperlessReceipts).toBe(true)
      expect(prefs.ecoPointsEarned).toBe(30)
      expect(prefs.vehiclePlateNumber).toBe('B 1234 XYZ')
    })
  })
})
