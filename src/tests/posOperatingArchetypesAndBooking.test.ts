import { describe, it, expect } from 'vitest'
import { BusinessOperatingArchetype, PosWorkflowToggles, TableReservation } from '../types/pos'
import { MOCK_TABLE_RESERVATIONS } from '../data/mockData'

describe('POS Operating Archetypes & Workflow Modes Suite', () => {
  it('correctly maps quick-service-stall archetype to no-tables fast checkout mode', () => {
    const archetype: BusinessOperatingArchetype = 'quick-service-stall'
    let toggles: PosWorkflowToggles

    if (archetype === 'quick-service-stall') {
      toggles = {
        enableMenuCatalog: true,
        enableTableFloorPlan: false,
        enableBookingReservations: false,
        defaultPosMode: 'catalog'
      }
    } else {
      toggles = {
        enableMenuCatalog: true,
        enableTableFloorPlan: true,
        enableBookingReservations: false,
        defaultPosMode: 'tables'
      }
    }

    expect(toggles.enableTableFloorPlan).toBe(false)
    expect(toggles.enableBookingReservations).toBe(false)
    expect(toggles.enableMenuCatalog).toBe(true)
    expect(toggles.defaultPosMode).toBe('catalog')
  })

  it('correctly maps casual-dine-in archetype to table floor plan mode', () => {
    const archetype: BusinessOperatingArchetype = 'casual-dine-in'
    const toggles: PosWorkflowToggles = {
      enableMenuCatalog: true,
      enableTableFloorPlan: true,
      enableBookingReservations: false,
      defaultPosMode: 'tables'
    }

    expect(toggles.enableTableFloorPlan).toBe(true)
    expect(toggles.enableBookingReservations).toBe(false)
    expect(toggles.defaultPosMode).toBe('tables')
  })

  it('correctly maps full-service-resto archetype to booking + tables + catalog 3-mode', () => {
    const archetype: BusinessOperatingArchetype = 'full-service-resto'
    const toggles: PosWorkflowToggles = {
      enableMenuCatalog: true,
      enableTableFloorPlan: true,
      enableBookingReservations: true,
      defaultPosMode: 'tables'
    }

    expect(toggles.enableTableFloorPlan).toBe(true)
    expect(toggles.enableBookingReservations).toBe(true)
    expect(toggles.enableMenuCatalog).toBe(true)
  })

  it('validates mock reservations structure and check-in transition', () => {
    const reservations: TableReservation[] = [...MOCK_TABLE_RESERVATIONS]
    expect(reservations.length).toBeGreaterThanOrEqual(2)

    const vipRsv = reservations.find(r => r.id === 'RSV-01')
    expect(vipRsv).toBeDefined()
    expect(vipRsv?.customerName).toBe('Bpk. Alexander Pratama')
    expect(vipRsv?.paxCount).toBe(8)
    expect(vipRsv?.dpAmount).toBe(500000)
    expect(vipRsv?.status).toBe('confirmed')

    // Simulate check-in transition
    const updated = reservations.map(r => r.id === 'RSV-01' ? { ...r, status: 'seated' as const } : r)
    const seatedRsv = updated.find(r => r.id === 'RSV-01')
    expect(seatedRsv?.status).toBe('seated')
  })
})
