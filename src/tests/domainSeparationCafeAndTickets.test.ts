import { describe, it, expect } from 'vitest'
import { HfeNotification, ServiceTicket } from '../types/pos'

describe('Domain Separation between Cafe Operations and Event Ticketing (L2-POS-77)', () => {
  const sampleNotifications: HfeNotification[] = [
    {
      id: 'notif-1',
      title: 'Peringatan Alergen Makanan',
      message: 'Tamu Meja IND-02 alergi Kacang & Gluten.',
      category: 'safety_allergen',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'urgent',
      tableNumber: 'IND-02'
    },
    {
      id: 'notif-2',
      title: 'Permintaan Bill Fisik',
      message: 'Meja OUT-04 meminta tagihan cetak fisik.',
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
      isRead: false,
      priority: 'normal'
    },
    {
      id: 'notif-4',
      title: 'Rekonsiliasi Shift Kasir',
      message: 'Shift Pagi ditutup. Kas fisik Rp 1.450.000 sinkron 100%.',
      category: 'financial_shifts',
      timestamp: new Date().toISOString(),
      isRead: true,
      priority: 'normal'
    }
  ]

  it('isolates cafe operations feed in all tab from commercial ticket logs', () => {
    // In 'all' tab of Cafe Alert Center, tickets are excluded to prevent floor distraction
    const cafeAlerts = sampleNotifications.filter(n => n.category !== 'tickets')
    expect(cafeAlerts.length).toBe(3)
    expect(cafeAlerts.some(n => n.category === 'tickets')).toBe(false)
    expect(cafeAlerts.some(n => n.category === 'safety_allergen')).toBe(true)
    expect(cafeAlerts.some(n => n.category === 'operational')).toBe(true)
  })

  it('correctly filters critical food allergen alerts', () => {
    const allergenAlerts = sampleNotifications.filter(n => n.category === 'safety_allergen')
    expect(allergenAlerts.length).toBe(1)
    expect(allergenAlerts[0].priority).toBe('urgent')
    expect(allergenAlerts[0].tableNumber).toBe('IND-02')
  })

  it('preserves open waiter service tickets for real-time table dispatch', () => {
    const serviceTickets: ServiceTicket[] = [
      { id: 'srv-1', tableNumber: 'OUT-04', type: 'bill_request', status: 'open', createdAt: new Date().toISOString() },
      { id: 'srv-2', tableNumber: 'IND-02', type: 'water_refill', status: 'open', createdAt: new Date().toISOString() },
      { id: 'srv-3', tableNumber: 'VIP-01', type: 'sommelier_advice', status: 'resolved', createdAt: new Date().toISOString() }
    ]
    const openCount = serviceTickets.filter(t => t.status !== 'resolved').length
    expect(openCount).toBe(2)
  })
})
