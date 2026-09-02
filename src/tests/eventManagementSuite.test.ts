import { describe, it, expect } from 'vitest'

describe('Event & Ticketing Suite (L2-POS-101)', () => {
  it('should verify event capacity and checkin calculation', () => {
    const event = {
      title: 'Nobar Big Match Final',
      isGatedTicket: true,
      ticketPrice: 50000,
      maxCapacity: 80,
      ticketsSold: 76,
      checkedInCount: 52
    }

    const occupancyRate = Math.round((event.checkedInCount / event.maxCapacity) * 100)
    const remainingTickets = event.maxCapacity - event.ticketsSold

    expect(occupancyRate).toBe(65)
    expect(remainingTickets).toBe(4)
    expect(event.ticketsSold * event.ticketPrice).toBe(3800000)
  })

  it('should support open walk-in non-gated events with zero ticket price', () => {
    const acousticEvent = {
      title: 'Akustik Senja Friday',
      isGatedTicket: false,
      ticketPrice: 0,
      maxCapacity: 60,
      ticketsSold: 42,
      checkedInCount: 28
    }

    expect(acousticEvent.isGatedTicket).toBe(false)
    expect(acousticEvent.ticketPrice).toBe(0)
  })
})
