import { describe, it, expect } from 'vitest'
import { INITIAL_TABLES, PROPERTY_ZONES } from '../data/mockData'
import { TableStatus, PropertyZoneId } from '../types/pos'
import { AREA_SURFACE_PALETTES } from '../components/pos/AreaSurfaceOverlay'

export const filterTablesByZoneAndStatus = (
  tables: TableStatus[],
  zoneId: PropertyZoneId,
  statusFilter: 'all' | 'unpaid' | 'paid' | 'available'
): TableStatus[] => {
  return tables.filter(t => {
    const resolvedZone = t.zoneId || (
      t.name.startsWith('OUT') ? 'outdoor-garden' :
      t.name.startsWith('IND') ? 'indoor-ac' :
      t.name.startsWith('VIP') ? 'vip-private' :
      t.name.startsWith('POOL') ? 'poolside-cabana' :
      t.name.startsWith('ROOF') ? 'rooftop-skybar' : 'indoor-ac'
    )
    const matchZone = zoneId === 'all' || resolvedZone === zoneId

    const isUnpaid = (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0
    const isPaid = t.customerName?.includes('(Lunas)') || (t.status === 'occupied' && t.totalBill === 0)
    const isAvailable = t.status === 'free'

    let matchStatus = true
    if (statusFilter === 'unpaid') matchStatus = isUnpaid
    if (statusFilter === 'paid') matchStatus = isPaid
    if (statusFilter === 'available') matchStatus = isAvailable

    return matchZone && matchStatus
  })
}

describe('Floor Plan Area Filters & View Consistency Suite (L2-POS-72)', () => {
  it('correctly filters tables by each distinct property zone', () => {
    const allTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'all', 'all')
    expect(allTables.length).toBe(22)

    const outdoorTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'outdoor-garden', 'all')
    expect(outdoorTables.length).toBe(6)

    const indoorTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'indoor-ac', 'all')
    expect(indoorTables.length).toBe(6)

    const vipTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'vip-private', 'all')
    expect(vipTables.length).toBe(2)

    const poolsideTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'poolside-cabana', 'all')
    expect(poolsideTables.length).toBe(4)

    const rooftopTables = filterTablesByZoneAndStatus(INITIAL_TABLES, 'rooftop-skybar', 'all')
    expect(rooftopTables.length).toBe(4)
  })

  it('correctly applies combinational filtering of Zone + Operational Status', () => {
    const outdoorUnpaid = filterTablesByZoneAndStatus(INITIAL_TABLES, 'outdoor-garden', 'unpaid')
    outdoorUnpaid.forEach(t => {
      expect(t.totalBill).toBeGreaterThan(0)
      expect(t.name.startsWith('OUT') || t.zoneId === 'outdoor-garden').toBe(true)
    })

    const indoorAvailable = filterTablesByZoneAndStatus(INITIAL_TABLES, 'indoor-ac', 'available')
    indoorAvailable.forEach(t => {
      expect(t.status).toBe('free')
    })
  })

  it('guarantees complete palette mapping for all configured property zones', () => {
    PROPERTY_ZONES.forEach(zone => {
      expect(AREA_SURFACE_PALETTES[zone.id]).toBeDefined()
      expect(AREA_SURFACE_PALETTES[zone.id].bgCard).toBeDefined()
      expect(AREA_SURFACE_PALETTES[zone.id].borderCard).toBeDefined()
    })
  })
})
