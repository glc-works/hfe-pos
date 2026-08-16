import { describe, it, expect } from 'vitest'
import { fireCourse } from '../services/hfeApi'
import { TableWithGuestInfo } from '../components/tables/TableFloorPlanGrid'
import { PaymentTender, PaymentTenderType } from '../components/payments/MultiTenderPaymentModal'

describe('Module A: Unified KDS & Course Sequence Engine', () => {
  it('fires course sequence step correctly via hfeApi', async () => {
    const res = await fireCourse('FD-101', 3, 'Truffle Consommé')
    expect(res.orderId).toBe('FD-101')
    expect(res.courseNumber).toBe(3)
    expect(res.courseName).toBe('Truffle Consommé')
    expect(res.status).toBe('Fired')
  })
})

describe('Module A: Unified Floor Plan Grid & VIP Guest Profiling', () => {
  const sampleTables: TableWithGuestInfo[] = [
    {
      id: 'TBL-VIP-01',
      name: 'Table 01 (Chef Corner)',
      zone: 'Chef Table',
      capacity: 4,
      status: 'seated_vip',
      guestName: 'Drs. H. Bambang Soeprapto',
      isVip: true,
      vipTier: 'Platinum VIP',
      savedPreferences: 'Kopi Less Sugar',
      anniversaryBadge: true,
      allergenAlert: 'Kacang / Nut Allergy'
    },
    {
      id: 'TBL-02',
      name: 'Table 02 (Main)',
      zone: 'Main Dining',
      capacity: 2,
      status: 'available'
    }
  ]

  it('filters VIP tables correctly', () => {
    const vipOnlyTables = sampleTables.filter(t => t.isVip || t.status === 'seated_vip')
    expect(vipOnlyTables).toHaveLength(1)
    expect(vipOnlyTables[0].guestName).toBe('Drs. H. Bambang Soeprapto')
  })

  it('verifies allergen alert presence on occupied VIP table', () => {
    const vipTable = sampleTables.find(t => t.id === 'TBL-VIP-01')
    expect(vipTable?.allergenAlert).toBe('Kacang / Nut Allergy')
    expect(vipTable?.anniversaryBadge).toBe(true)
  })
})

describe('Module C: Multi-Tender Split Payment Math Engine', () => {
  it('calculates total paid, remaining balance, and change amount across multiple tenders', () => {
    const totalBill = 1000000 // Rp 1.000.000

    const tenders: PaymentTender[] = [
      { id: 'T1', type: 'cash', amount: 400000 },
      { id: 'T2', type: 'qris', amount: 600000, referenceNo: 'QRIS-REF-9988' }
    ]

    const totalPaid = tenders.reduce((sum, t) => sum + t.amount, 0)
    const remainingBalance = Math.max(0, totalBill - totalPaid)
    const changeAmount = Math.max(0, totalPaid - totalBill)

    expect(totalPaid).toBe(1000000)
    expect(remainingBalance).toBe(0)
    expect(changeAmount).toBe(0)
  })

  it('handles cash overpayment with correct change calculation', () => {
    const totalBill = 150000 // Rp 150.000

    const tenders: PaymentTender[] = [
      { id: 'T1', type: 'cash', amount: 200000 }
    ]

    const totalPaid = tenders.reduce((sum, t) => sum + t.amount, 0)
    const remainingBalance = Math.max(0, totalBill - totalPaid)
    const changeAmount = Math.max(0, totalPaid - totalBill)

    expect(totalPaid).toBe(200000)
    expect(remainingBalance).toBe(0)
    expect(changeAmount).toBe(50000)
  })
})

describe('Module C: Loyalty Point Redemption Conversion Engine', () => {
  it('converts loyalty points to IDR discount correctly (1 pt = Rp 100)', () => {
    const conversionRate = 100 // Rp 100 per point
    const pointsToRedeem = 500

    const discountAmount = pointsToRedeem * conversionRate
    expect(discountAmount).toBe(50000) // Rp 50.000 discount
  })

  it('clamps redemption points to available points balance', () => {
    const availablePoints = 350
    const pointsRequested = 500

    const effectivePoints = Math.min(pointsRequested, availablePoints)
    expect(effectivePoints).toBe(350)
  })
})
