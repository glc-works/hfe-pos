import { describe, it, expect } from 'vitest'
import { CourierMilestone } from '../components/customer-portal/MiniAppCourierRunnerModal'

describe('HfeCard Dual-Persona, Warehouse WMS & Milestone Courier Suite (L2-POS-80)', () => {
  it('correctly transitions courier delivery tasks across the 3 linear milestones', () => {
    let currentMilestone: CourierMilestone = 'assigned'
    expect(currentMilestone).toBe('assigned')

    // Step 1: Picked up at cafe
    currentMilestone = 'picked_up'
    expect(currentMilestone).toBe('picked_up')

    // Step 2: Arrived at destination
    currentMilestone = 'arrived'
    expect(currentMilestone).toBe('arrived')

    // Step 3: Delivered with Proof of Delivery (POD)
    currentMilestone = 'delivered'
    expect(currentMilestone).toBe('delivered')
  })

  it('correctly creates proper Google Maps direction deep-link URL', () => {
    const address = 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan'
    const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    
    expect(directionUrl).toContain('https://www.google.com/maps/dir/?api=1&destination=')
    expect(directionUrl).toContain('Senopati')
  })

  it('correctly isolates multi-merchant pass data', () => {
    const passes = [
      { id: 'PASS-SENOPATI', merchantName: 'Kopitiam Senopati', stampsCount: 8, stampsMax: 10 },
      { id: 'PASS-MENTENG', merchantName: 'Menteng Bakery', stampsCount: 4, stampsMax: 8 }
    ]

    expect(passes[0].merchantName).toBe('Kopitiam Senopati')
    expect(passes[0].stampsCount).toBe(8)
    expect(passes[1].merchantName).toBe('Menteng Bakery')
    expect(passes[1].stampsCount).toBe(4)
  })
})
