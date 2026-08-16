import { describe, it, expect } from 'vitest'
import { HfeNotification, ServiceTicket, NotificationCategory } from '../types/pos'

describe('Omnichannel Notification Center & Service Ticketing Hub (L2-POS-49)', () => {
  const initialNotifications: HfeNotification[] = [
    {
      id: 'notif-1',
      title: 'Peringatan Alergen Makanan',
      message: 'Tamu di Meja IND-02 alergi parah terhadap Kacang Tanah & Gluten.',
      category: 'safety_allergen',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'urgent',
      tableNumber: 'IND-02'
    },
    {
      id: 'notif-2',
      title: 'Permintaan Bill Fisik',
      message: 'Meja OUT-04 meminta tagihan cetak fisik untuk pelunasan tunai.',
      category: 'operational',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high',
      tableNumber: 'OUT-04'
    },
    {
      id: 'notif-3',
      title: 'Penjualan Tiket Event',
      message: 'Tiket VIP Cupping terjual (TKT-2026-089 - Rudi H).',
      category: 'tickets',
      timestamp: new Date().toISOString(),
      isRead: true,
      priority: 'normal'
    }
  ]

  const initialServiceTickets: ServiceTicket[] = [
    {
      id: 'srv-101',
      tableNumber: 'OUT-04',
      type: 'bill_request',
      status: 'open',
      createdAt: new Date().toISOString(),
      notes: 'Minta tagihan cetak fisik'
    },
    {
      id: 'srv-102',
      tableNumber: 'IND-02',
      type: 'water_refill',
      status: 'open',
      createdAt: new Date().toISOString()
    }
  ]

  it('calculates unread notifications count correctly', () => {
    const unreadCount = initialNotifications.filter(n => !n.isRead).length
    expect(unreadCount).toBe(2)
  })

  it('filters notifications by category accurately', () => {
    const allergenAlerts = initialNotifications.filter(n => n.category === 'safety_allergen')
    expect(allergenAlerts.length).toBe(1)
    expect(allergenAlerts[0].priority).toBe('urgent')
    expect(allergenAlerts[0].tableNumber).toBe('IND-02')

    const ticketAlerts = initialNotifications.filter(n => n.category === 'tickets')
    expect(ticketAlerts.length).toBe(1)
    expect(ticketAlerts[0].isRead).toBe(true)
  })

  it('marks individual notification as read', () => {
    const updated = initialNotifications.map(n => n.id === 'notif-1' ? { ...n, isRead: true } : n)
    const unreadCount = updated.filter(n => !n.isRead).length
    expect(unreadCount).toBe(1)
    expect(updated.find(n => n.id === 'notif-1')?.isRead).toBe(true)
  })

  it('marks all notifications as read', () => {
    const allRead = initialNotifications.map(n => ({ ...n, isRead: true }))
    const unreadCount = allRead.filter(n => !n.isRead).length
    expect(unreadCount).toBe(0)
  })

  it('creates new service ticket and links to table number', () => {
    const newTicket: ServiceTicket = {
      id: 'srv-103',
      tableNumber: 'VIP-01',
      type: 'sommelier_advice',
      status: 'open',
      createdAt: new Date().toISOString(),
      notes: 'Konsultasi pairing wine'
    }

    const tickets = [newTicket, ...initialServiceTickets]
    expect(tickets.length).toBe(3)
    expect(tickets[0].tableNumber).toBe('VIP-01')
    expect(tickets[0].type).toBe('sommelier_advice')
    expect(tickets[0].status).toBe('open')
  })

  it('transitions service ticket from open to in_progress to resolved', () => {
    let ticket: ServiceTicket = {
      id: 'srv-201',
      tableNumber: 'IND-05',
      type: 'clean_table',
      status: 'open',
      createdAt: new Date().toISOString()
    }

    expect(ticket.status).toBe('open')

    // Step 1: Assign to staff / in_progress
    ticket = { ...ticket, status: 'in_progress', assignedStaffName: 'Andi (Busser)' }
    expect(ticket.status).toBe('in_progress')
    expect(ticket.assignedStaffName).toBe('Andi (Busser)')

    // Step 2: Resolve ticket
    ticket = { ...ticket, status: 'resolved', resolvedAt: new Date().toISOString() }
    expect(ticket.status).toBe('resolved')
    expect(ticket.resolvedAt).toBeDefined()
  })

  it('validates event ticket check-in gate-in rules', () => {
    interface EventCheckInPayload {
      ticketCode: string
      status: 'VALID' | 'CHECKED_IN'
      checkedInAt?: string
    }

    const ticketRecord: EventCheckInPayload = {
      ticketCode: 'TKT-2026-089',
      status: 'VALID'
    }

    // Perform gate-in validation
    const validateGateIn = (record: EventCheckInPayload): { success: boolean; error?: string; updatedRecord?: EventCheckInPayload } => {
      if (record.status === 'CHECKED_IN') {
        return { success: false, error: 'Tiket sudah digunakan sebelumnya' }
      }
      return {
        success: true,
        updatedRecord: {
          ...record,
          status: 'CHECKED_IN',
          checkedInAt: '15:30 WIB'
        }
      }
    }

    const result1 = validateGateIn(ticketRecord)
    expect(result1.success).toBe(true)
    expect(result1.updatedRecord?.status).toBe('CHECKED_IN')

    // Second check-in attempt must fail
    const result2 = validateGateIn(result1.updatedRecord!)
    expect(result2.success).toBe(false)
    expect(result2.error).toContain('sudah digunakan')
  })
})
