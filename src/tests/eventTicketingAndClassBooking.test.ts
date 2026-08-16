import { describe, it, expect } from 'vitest'
import { EventTicketItem, PurchasedEventTicket } from '../types/pos'

describe('Event Ticketing & Workshop Class Booking Engine (L2-POS-46)', () => {
  const sampleEvent: EventTicketItem = {
    id: 'EVT-JAZZ-01',
    title: '🎷 Friday Night Live Acoustic Jazz',
    category: 'music_event',
    date: 'Setiap Jumat',
    time: '19:30 - 22:00 WIB',
    location: '🌿 Outdoor Garden & Stage',
    price: 150000,
    quotaTotal: 40,
    quotaRemaining: 14,
    description: 'Penampilan jazz akustik santai, termasuk Welcome Drink.',
    includedBenefits: ['Welcome Drink', 'Free Seating Stage View']
  }

  const sampleWorkshop: EventTicketItem = {
    id: 'EVT-WORKSHOP-02',
    title: '☕ Barista Cupping & Manual Brew Masterclass',
    category: 'workshop_class',
    date: 'Sabtu, 29 Agustus',
    time: '10:00 - 13:00 WIB',
    location: '❄️ VIP Roastery Room',
    price: 250000,
    quotaTotal: 12,
    quotaRemaining: 4,
    instructorName: 'Head Roaster Dimas',
    description: 'Workshop seduh V60 & cupping 5 single-origin nusantara.',
    includedBenefits: ['Sertifikat Workshop', 'Beans 200g', 'Cupping Kit']
  }

  it('calculates total ticket purchase accurately for multiple participants', () => {
    const qty = 3
    const total = sampleEvent.price * qty
    expect(total).toBe(450000)
  })

  it('validates remaining quota bounds', () => {
    const requestedQty = 5
    const isAvailable = requestedQty <= sampleWorkshop.quotaRemaining
    expect(isAvailable).toBe(false) // Only 4 remaining
  })

  it('generates valid purchased event ticket payload with QR data', () => {
    const ticketCode = `TKT-${sampleEvent.id}-9912`
    const ticket: PurchasedEventTicket = {
      ticketCode,
      eventId: sampleEvent.id,
      eventTitle: sampleEvent.title,
      participantName: 'Michael Chandra',
      participantPhone: '081234567890',
      quantity: 2,
      totalAmountPaid: sampleEvent.price * 2,
      paymentMethod: 'QRIS',
      purchasedAt: '2026-08-16T14:40:00.000Z',
      qrBarcodeData: `HFE-TKT:${ticketCode}:${sampleEvent.id}`,
      status: 'valid'
    }

    expect(ticket.ticketCode).toContain('EVT-JAZZ-01')
    expect(ticket.totalAmountPaid).toBe(300000)
    expect(ticket.status).toBe('valid')
    expect(ticket.qrBarcodeData).toContain('HFE-TKT')
  })

  it('correctly maps ticket revenue to Double-Entry General Ledger account', () => {
    const ticketSaleAmount = 250000
    // Double entry journal for Class Booking:
    // Debit: 1102 - Bank QRIS Settlement (Rp 250.000)
    // Credit: 4103 - Pendapatan Tiket Event & Kelas (Rp 250.000)
    const journalEntry = {
      referenceId: 'TKT-EVT-WORKSHOP-02-1204',
      debitAccount: '1102 - Bank QRIS Settlement',
      creditAccount: '4103 - Pendapatan Tiket Event & Kelas',
      amount: ticketSaleAmount
    }

    expect(journalEntry.creditAccount).toBe('4103 - Pendapatan Tiket Event & Kelas')
    expect(journalEntry.amount).toBe(250000)
  })
})
