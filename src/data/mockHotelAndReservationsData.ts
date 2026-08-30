import { HotelGuestFolio, TableReservation } from '../types/pos'

export const MOCK_HOTEL_GUEST_FOLIOS: HotelGuestFolio[] = [
  {
    roomNumber: '402',
    guestName: 'Bambang Soeprapto',
    checkInDate: '2026-08-14',
    checkOutDate: '2026-08-18',
    status: 'checked_in',
    creditLimit: 5000000,
    currentBalance: 1250000,
    glAccountReceivable: '1104 - Piutang Tamu Hotel (Guest Room Folio)',
    folioId: 'FOLIO-402-8821'
  },
  {
    roomNumber: '305',
    guestName: 'Jessica Tanuwidjaja',
    checkInDate: '2026-08-15',
    checkOutDate: '2026-08-19',
    status: 'checked_in',
    creditLimit: 3000000,
    currentBalance: 450000,
    glAccountReceivable: '1104 - Piutang Tamu Hotel (Guest Room Folio)',
    folioId: 'FOLIO-305-7712'
  },
  {
    roomNumber: '501',
    guestName: 'Michael Alexander',
    checkInDate: '2026-08-12',
    checkOutDate: '2026-08-17',
    status: 'checked_in',
    creditLimit: 10000000,
    currentBalance: 3200000,
    glAccountReceivable: '1104 - Piutang Tamu Hotel (Guest Room Folio)',
    folioId: 'FOLIO-501-9901'
  },
  {
    roomNumber: '208',
    guestName: 'Siti Rahmawati',
    checkInDate: '2026-08-10',
    checkOutDate: '2026-08-14',
    status: 'checked_out',
    creditLimit: 0,
    currentBalance: 0,
    glAccountReceivable: '1104 - Piutang Tamu Hotel (Guest Room Folio)',
    folioId: 'FOLIO-208-6610'
  }
]

export const MOCK_TABLE_RESERVATIONS: TableReservation[] = [
  {
    id: 'RSV-01',
    customerName: 'Bpk. Alexander Pratama',
    phone: '081299887711',
    tableArea: '👑 VIP Room 01 (VIP-01)',
    paxCount: 8,
    reservationDate: '2026-08-20',
    timeSlot: '19:00 WIB',
    dpAmount: 500000,
    dpStatus: 'paid_qris',
    approvalPolicy: 'instant',
    status: 'confirmed',
    specialNotes: 'Ulang Tahun ke-40 • Min Spend Rp 2.500.000',
    createdAt: '2026-08-20 10:30'
  },
  {
    id: 'RSV-02',
    customerName: 'Ibu Ratna Dewi (Corporate)',
    phone: '081877665544',
    tableArea: '🌿 Outdoor Garden (OUT-03)',
    paxCount: 4,
    reservationDate: '2026-08-20',
    timeSlot: '19:30 WIB',
    dpAmount: 200000,
    dpStatus: 'paid_qris',
    approvalPolicy: 'instant',
    status: 'confirmed',
    specialNotes: 'Meja dekat stopkontak laptop',
    createdAt: '2026-08-20 14:15'
  }
]
