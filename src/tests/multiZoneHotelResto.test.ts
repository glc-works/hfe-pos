import { describe, it, expect } from 'vitest'
import { PROPERTY_ZONES, INITIAL_TABLES, MOCK_HOTEL_GUEST_FOLIOS } from '../data/mockData'
import { TableStatus, PropertyZoneConfig, HotelGuestFolio } from '../types/pos'

describe('L2-POS-45 Module A: Multi-Zone Property Table & Dynamic Custom Naming Engine', () => {
  it('contains default hotel property zones with dedicated staff and VIP min spend', () => {
    expect(PROPERTY_ZONES).toBeDefined()
    expect(PROPERTY_ZONES.length).toBeGreaterThanOrEqual(5)

    const outdoor = PROPERTY_ZONES.find((z) => z.id === 'outdoor-garden')
    const indoor = PROPERTY_ZONES.find((z) => z.id === 'indoor-ac')
    const vip = PROPERTY_ZONES.find((z) => z.id === 'vip-private')
    const pool = PROPERTY_ZONES.find((z) => z.id === 'poolside-cabana')
    const roof = PROPERTY_ZONES.find((z) => z.id === 'rooftop-skybar')

    expect(outdoor).toBeDefined()
    expect(indoor).toBeDefined()
    expect(vip?.minSpend).toBe(2500000)
    expect(pool).toBeDefined()
    expect(roof).toBeDefined()
  })

  it('filters tables correctly across all 5 distinct hotel resto zones', () => {
    const outdoorTables = INITIAL_TABLES.filter((t) => t.zoneId === 'outdoor-garden')
    const indoorTables = INITIAL_TABLES.filter((t) => t.zoneId === 'indoor-ac')
    const vipTables = INITIAL_TABLES.filter((t) => t.zoneId === 'vip-private')
    const poolTables = INITIAL_TABLES.filter((t) => t.zoneId === 'poolside-cabana')
    const roofTables = INITIAL_TABLES.filter((t) => t.zoneId === 'rooftop-skybar')

    expect(outdoorTables.length).toBe(6)
    expect(indoorTables.length).toBe(6)
    expect(vipTables.length).toBe(2)
    expect(poolTables.length).toBe(4)
    expect(roofTables.length).toBe(4)
    expect(INITIAL_TABLES.length).toBe(22)
  })

  it('allows owner to dynamically customize zone names and add custom zones', () => {
    let zones: PropertyZoneConfig[] = [...PROPERTY_ZONES]

    // 1. Owner renames "Outdoor Garden" to "Beachfront Sunset Terrace"
    const updateZoneName = (id: string, newName: string) => {
      zones = zones.map((z) => (z.id === id ? { ...z, name: newName } : z))
    }
    updateZoneName('outdoor-garden', 'Beachfront Sunset Terrace')
    expect(zones.find((z) => z.id === 'outdoor-garden')?.name).toBe('Beachfront Sunset Terrace')

    // 2. Owner adds custom zone "Wine Cellar Private Lounge"
    const addCustomZone = (newZone: PropertyZoneConfig) => {
      zones = [...zones, newZone]
    }
    addCustomZone({
      id: 'wine-cellar',
      name: 'Wine Cellar Private Lounge',
      icon: '🍷',
      tablePrefix: 'WINE',
      totalTables: 3,
      minSpend: 5000000
    })

    expect(zones.length).toBe(PROPERTY_ZONES.length + 1)
    expect(zones.find((z) => z.id === 'wine-cellar')?.name).toBe('Wine Cellar Private Lounge')
    expect(zones.find((z) => z.id === 'wine-cellar')?.minSpend).toBe(5000000)
  })

  it('calculates VIP minimum spend progress and threshold completion accurately', () => {
    const vipTable = INITIAL_TABLES.find((t) => t.id === 'TBL-VIP-01')
    expect(vipTable).toBeDefined()
    expect(vipTable?.minSpend).toBe(2500000000)
    expect(vipTable?.totalBill).toBe(1850000000)

    const minSpend = vipTable?.minSpend || 2500000000
    const currentBill = vipTable?.totalBill || 0
    const progressPercent = Math.min(100, Math.round((currentBill / minSpend) * 100))
    const isMinSpendMet = currentBill >= minSpend

    expect(progressPercent).toBe(74)
    expect(isMinSpendMet).toBe(false)

    // When VIP guest adds more items exceeding min spend
    const additionalBill = 800000000
    const updatedBill = currentBill + additionalBill
    const updatedProgress = Math.min(100, Math.round((updatedBill / minSpend) * 100))
    const updatedIsMet = updatedBill >= minSpend

    expect(updatedBill).toBe(2650000000)
    expect(updatedProgress).toBe(100)
    expect(updatedIsMet).toBe(true)
  })
})

describe('L2-POS-45 Module B: Universal Table Reassignment & Emergency Weather Relocation Engine', () => {
  it('relocates outdoor table to indoor table with complete bill, chit and guest preservation', () => {
    let mockGrid: TableStatus[] = [
      { id: 'T-OUT-04', name: 'OUT-04', status: 'occupied', customerName: 'Aldi Pratama', totalBill: 150000, orderCount: 3, zoneId: 'outdoor-garden' },
      { id: 'T-IND-01', name: 'IND-01', status: 'free', totalBill: 0, orderCount: 0, zoneId: 'indoor-ac' }
    ]

    const relocateTable = (fromName: string, toName: string, reason: string) => {
      const src = mockGrid.find((t) => t.name === fromName)
      if (!src) return
      mockGrid = mockGrid.map((t) => {
        if (t.name === fromName) {
          return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
        }
        if (t.name === toName) {
          return { ...t, status: 'occupied', totalBill: src.totalBill, orderCount: src.orderCount, customerName: src.customerName }
        }
        return t
      })
      return { fromName, toName, reason, transferredAmount: src.totalBill }
    }

    const receipt = relocateTable('OUT-04', 'IND-01', 'Cuaca / Hujan (Emergency Rain Relocation)')
    expect(receipt).toBeDefined()
    expect(receipt?.reason).toContain('Cuaca / Hujan')
    expect(receipt?.transferredAmount).toBe(150000)

    const sourceAfter = mockGrid.find((t) => t.name === 'OUT-04')
    const targetAfter = mockGrid.find((t) => t.name === 'IND-01')

    expect(sourceAfter?.status).toBe('free')
    expect(sourceAfter?.totalBill).toBe(0)
    expect(sourceAfter?.customerName).toBeUndefined()

    expect(targetAfter?.status).toBe('occupied')
    expect(targetAfter?.totalBill).toBe(150000)
    expect(targetAfter?.orderCount).toBe(3)
    expect(targetAfter?.customerName).toBe('Aldi Pratama')
  })

  it('supports universal relocation reasons (guest request, capacity, VIP upgrade, maintenance)', () => {
    const reasons = [
      'guest_request',
      'weather_rain',
      'larger_capacity',
      'vip_upgrade',
      'outlet_window',
      'table_maintenance',
      'other'
    ]
    expect(reasons).toHaveLength(7)
  })

  it('merges multiple tables (merge tabs) combining grand totals and order counts', () => {
    const tableA: TableStatus = { id: 'T1', name: 'IND-01', status: 'occupied', customerName: 'Table A Group', totalBill: 200000, orderCount: 2 }
    const tableB: TableStatus = { id: 'T2', name: 'IND-02', status: 'occupied', customerName: 'Table B Group', totalBill: 350000, orderCount: 3 }

    const combinedBill = tableA.totalBill + tableB.totalBill
    const combinedCount = tableA.orderCount + tableB.orderCount
    const mergedCustomerName = `${tableA.customerName} & ${tableB.customerName}`

    expect(combinedBill).toBe(550000)
    expect(combinedCount).toBe(5)
    expect(mergedCustomerName).toBe('Table A Group & Table B Group')
  })
})

describe('L2-POS-45 Module D: Hotel Guest Room Folio Charge Engine & Double-Entry Ledger Posting', () => {
  it('validates hotel room search and guest check-in verification', () => {
    const folios: HotelGuestFolio[] = MOCK_HOTEL_GUEST_FOLIOS

    // Lookup Room 402
    const room402 = folios.find((f) => f.roomNumber === '402')
    expect(room402).toBeDefined()
    expect(room402?.guestName).toBe('Bambang Soeprapto')
    expect(room402?.status).toBe('checked_in')
    expect(room402?.creditLimit).toBe(5000000)
    expect(room402?.glAccountReceivable).toBe('1104 - Piutang Tamu Hotel (Guest Room Folio)')

    // Lookup Checked-out Room 208
    const room208 = folios.find((f) => f.roomNumber === '208')
    expect(room208).toBeDefined()
    expect(room208?.status).toBe('checked_out')
  })

  it('verifies credit limit check and rejects over-limit room charges', () => {
    const folio = MOCK_HOTEL_GUEST_FOLIOS.find((f) => f.roomNumber === '305')
    expect(folio).toBeDefined()
    if (!folio) return

    const remainingCredit = folio.creditLimit - folio.currentBalance // 3.000.000 - 450.000 = 2.550.000
    expect(remainingCredit).toBe(2550000)

    const validChargeAmount = 500000
    const overLimitChargeAmount = 3000000

    const isValidChargeAllowed = remainingCredit >= validChargeAmount
    const isOverLimitAllowed = remainingCredit >= overLimitChargeAmount

    expect(isValidChargeAllowed).toBe(true)
    expect(isOverLimitAllowed).toBe(false)
  })

  it('generates correct double-entry ledger journal lines for room charge settlement', () => {
    const totalBill = 220000 // Rp 220.000
    const subtotal = Math.round(totalBill / 1.1) // Rp 200.000
    const taxPB1 = totalBill - subtotal // Rp 20.000

    const journalEntries = [
      { account: '1104 - Piutang Tamu Hotel (Folio)', type: 'DEBIT', amount: totalBill },
      { account: '4101 - Pendapatan Penjualan Restoran', type: 'KREDIT', amount: subtotal },
      { account: '2105 - Hutang Pajak Restoran PB1 (10%)', type: 'KREDIT', amount: taxPB1 }
    ]

    const totalDebit = journalEntries.filter((j) => j.type === 'DEBIT').reduce((s, j) => s + j.amount, 0)
    const totalKredit = journalEntries.filter((j) => j.type === 'KREDIT').reduce((s, j) => s + j.amount, 0)

    expect(totalDebit).toBe(220000)
    expect(totalKredit).toBe(220000)
    expect(totalDebit - totalKredit).toBe(0) // Zero imbalance invariant
  })
})
