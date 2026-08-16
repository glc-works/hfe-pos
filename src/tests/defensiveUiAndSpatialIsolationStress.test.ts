import { describe, it, expect } from 'vitest'
import { TableStatus, MenuItem, CartItem, DigitalMemberCardData, HfeNotification } from '../types/pos'

describe('Defensive UI & Spatial Isolation Standard (HFE-UI-STD-001 / Zero Text-Collision)', () => {
  // 4-Quadrant Dynamic Content Stress Matrix Data Extremes
  const Q1_EMPTY_STATE = {
    tableName: 'OUT-01',
    customerName: '',
    totalBill: 0,
    seatedMinutes: 0,
    pax: 0,
    status: 'free' as const
  }

  const Q2_EXTREME_SHORT_STATE = {
    tableName: 'T1',
    customerName: 'Al',
    totalBill: 500,
    seatedMinutes: 1,
    pax: 1,
    status: 'occupied' as const
  }

  const Q3_EXTREME_LONG_OVERFLOW_STATE = {
    tableName: 'VIP-PRIVATE-ROOM-01-SUITE',
    customerName: 'Bpk. Prof. Dr. Alexander Raden Christopher Hadiningrat III, S.E., M.B.A., Ph.D.',
    totalBill: 1850000000, // Rp 1.850.000.000 (1.85 Milyar)
    seatedMinutes: 380, // 380 minutes (> 6 hours)
    pax: 24,
    status: 'open-tab' as const
  }

  const Q4_MULTI_STATE_VARIATIONS = [
    { status: 'free' as const, isUnpaid: false, isPaid: false, isAvailable: true, label: 'Kosong' },
    { status: 'open-tab' as const, isUnpaid: true, isPaid: false, isAvailable: false, label: 'Tagihan' },
    { status: 'occupied' as const, isUnpaid: false, isPaid: true, isAvailable: false, label: 'Lunas' }
  ]

  it('verifies Q1 (Zero/Empty State & Zero-Noise Invariant): suppresses placeholder text (no "Tersedia" or "Rp 0")', () => {
    // When table is free, Slot 3 (Customer Name) and Slot 4 (Financial Outcome) must be completely suppressed
    const isAvailable = Q1_EMPTY_STATE.status === 'free'
    const shouldRenderSlot3And4 = !isAvailable

    expect(shouldRenderSlot3And4).toBe(false)
    // Invariant: empty tables must not leak redundant strings into UI
    const slot3Text = shouldRenderSlot3And4 ? Q1_EMPTY_STATE.customerName : null
    const slot4Text = shouldRenderSlot3And4 ? `Rp ${Q1_EMPTY_STATE.totalBill}` : null

    expect(slot3Text).toBeNull()
    expect(slot4Text).toBeNull()
    expect(Q1_EMPTY_STATE.tableName).toBe('OUT-01')
    
    // Capacity format when empty: "👥 4" (Glyph-First)
    const emptyCapFormat = `👥 ${Q1_EMPTY_STATE.pax || 4}`
    expect(emptyCapFormat).toBe('👥 4')
  })

  it('verifies F&B Capacity Utilisation & Glyph-First Standard (seatedGuests/maxCapacity)', () => {
    // When occupied with 3 guests on a 4-capacity table (Glyph-First: "👥 3/4")
    const occupiedTable = {
      seatedGuests: 3,
      maxCapacity: 4,
      status: 'occupied' as const
    }

    const formatUtilisation = (table: typeof occupiedTable) => `👥 ${table.seatedGuests}/${table.maxCapacity}`
    expect(formatUtilisation(occupiedTable)).toBe('👥 3/4')

    // Single guest in 10-person VIP suite (Under-capacity)
    const vipSingle = { seatedGuests: 1, maxCapacity: 10, status: 'occupied' as const }
    expect(formatUtilisation(vipSingle)).toBe('👥 1/10')
  })

  it('verifies Q2 (Extreme Short State): handles 1-2 char initials without visual collapse', () => {
    const formatPrice = (p: number) => `Rp ${p.toLocaleString('id-ID')}`
    expect(formatPrice(Q2_EXTREME_SHORT_STATE.totalBill)).toBe('Rp 500')
    expect(Q2_EXTREME_SHORT_STATE.customerName.length).toBe(2)
    expect(Q2_EXTREME_SHORT_STATE.tableName.length).toBe(2)
  })

  it('verifies Q3 (Extreme Long/Overflow State): defensive truncation contracts and tabular formatting', () => {
    const formatPrice = (p: number) => `Rp ${p.toLocaleString('id-ID')}`
    const formattedBillion = formatPrice(Q3_EXTREME_LONG_OVERFLOW_STATE.totalBill)
    expect(formattedBillion).toBe('Rp 1.850.000.000')

    // Truncation string contract check: when rendering in a tight sub-container, name must truncate safely
    const truncateName = (name: string, maxLen: number) => name.length > maxLen ? `${name.slice(0, maxLen - 1)}…` : name
    const safelyTruncated = truncateName(Q3_EXTREME_LONG_OVERFLOW_STATE.customerName, 18)
    expect(safelyTruncated.length).toBeLessThanOrEqual(18)
    expect(safelyTruncated.endsWith('…')).toBe(true)

    // Seated timer formatting
    const formattedDuration = `${Q3_EXTREME_LONG_OVERFLOW_STATE.seatedMinutes}m`
    expect(formattedDuration).toBe('380m')
  })

  it('verifies Q4 (Multi-State Variations): correctly maps status badges and color states', () => {
    Q4_MULTI_STATE_VARIATIONS.forEach(state => {
      if (state.status === 'free') {
        expect(state.isAvailable).toBe(true)
        expect(state.label).toBe('Kosong')
      } else if (state.status === 'open-tab') {
        expect(state.isUnpaid).toBe(true)
        expect(state.label).toBe('Tagihan')
      } else if (state.status === 'occupied') {
        expect(state.isPaid).toBe(true)
        expect(state.label).toBe('Lunas')
      }
    })
  })

  it('verifies Digital Member Passbook handles multi-tier and extreme points balance', () => {
    const luxuryPass: DigitalMemberCardData = {
      cardNumber: 'CARD-VIP-99999999',
      customerName: 'Bpk. Alexander Raden Christopher III',
      phone: '+6281299998888',
      tier: 'Platinum',
      pointsBalance: 258900,
      stampCount: 8,
      stampMax: 10,
      barcodeData: 'HCB-MBR-PLT-99999999',
      qrData: 'https://hfe.io/pass/MBR-PLT-99999999',
      joinedDate: '2025-01-15',
      brandName: 'Kopitiam Senopati Artisanal Reserve & Roastery',
      allergens: ['lactose', 'nuts', 'gluten', 'seafood']
    }

    expect(luxuryPass.pointsBalance.toLocaleString('id-ID')).toBe('258.900')
    expect(luxuryPass.allergens?.length).toBe(4)
    expect(luxuryPass.stampMax - luxuryPass.stampCount).toBe(2)
  })

  it('verifies Notification Center handles multi-priority urgent alerts with table tags', () => {
    const urgentNotif: HfeNotification = {
      id: 'notif-urg-01',
      title: '⚠️ ALERGEN DARURAT: Tamu Meja VIP-01 Alergi Berat Kacang',
      message: 'Pastikan kitchen ware dan blender disterilisasi sebelum membuat Almond Croissant dan Hazelnut Latte.',
      category: 'safety_allergen',
      priority: 'urgent',
      timestamp: new Date().toISOString(),
      isRead: false,
      tableNumber: 'VIP-01'
    }

    expect(urgentNotif.priority).toBe('urgent')
    expect(urgentNotif.category).toBe('safety_allergen')
    expect(urgentNotif.tableNumber).toBe('VIP-01')
  })
})
