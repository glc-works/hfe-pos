import React, { useState } from 'react'
import { X, UserPlus, UserCheck, CalendarCheck, Search, CheckCircle2, Phone, Star } from 'lucide-react'
import { TableStatus } from '../../types/pos'

export interface TableGuestBindingDrawerProps {
  show: boolean
  onClose: () => void
  table: TableStatus | null
  onBindGuest: (guestData: {
    name: string
    phone?: string
    type: 'registered' | 'walk-in' | 'reservation'
    contactId?: string
    savedPreferences?: string
  }) => void
}

const REGISTERED_GUESTS = [
  { id: 'VIP-001', name: 'Aldi Pratama', phone: '081234567890', isVip: true, tier: 'Platinum VIP', pref: 'Less Ice, Oat Milk Latte' },
  { id: 'VIP-002', name: 'Drs. H. Bambang Soeprapto', phone: '081198765432', isVip: true, tier: 'Platinum VIP', pref: 'Pojok Quiet Zone, Kopi Less Sugar' },
  { id: 'VIP-003', name: 'Ibu Hj. Ratna', phone: '081567890123', isVip: true, tier: 'Gold VIP', pref: 'Sofa Panjang, Lactose Intolerant' },
  { id: 'CUST-004', name: 'Bapak Erick & Rekan', phone: '081809123456', isVip: false, tier: 'Regular', pref: 'Duduk Dekat Jendela' }
]

const ACTIVE_RESERVATIONS = [
  { id: 'RES-01', name: 'Ibu Maya', phone: '081399887766', timeSlot: '19:30', pax: 4, notes: 'Ultah Celebration - Perlu Cake Candle' },
  { id: 'RES-02', name: 'Pak Budi Santoso', phone: '081211223344', timeSlot: '20:00', pax: 2, notes: 'Dinner Table - VIP AC' }
]

export const TableGuestBindingDrawer: React.FC<TableGuestBindingDrawerProps> = ({
  show,
  onClose,
  table,
  onBindGuest
}) => {
  const [bindMode, setBindMode] = useState<'registered' | 'walk-in' | 'reservation'>('registered')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<typeof REGISTERED_GUESTS[0] | null>(null)
  
  // Walk-in form state
  const [walkInName, setWalkInName] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [walkInPref, setWalkInPref] = useState('')

  // Reservation select state
  const [selectedRes, setSelectedRes] = useState<typeof ACTIVE_RESERVATIONS[0] | null>(null)

  if (!show || !table) return null

  const filteredRegistered = REGISTERED_GUESTS.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.phone.includes(searchQuery)
  )

  const handleConfirmBind = () => {
    if (bindMode === 'registered' && selectedContact) {
      onBindGuest({
        name: selectedContact.name,
        phone: selectedContact.phone,
        type: 'registered',
        contactId: selectedContact.id,
        savedPreferences: selectedContact.pref
      })
    } else if (bindMode === 'walk-in' && walkInName.trim()) {
      onBindGuest({
        name: walkInName.trim(),
        phone: walkInPhone.trim() || undefined,
        type: 'walk-in',
        savedPreferences: walkInPref.trim() || undefined
      })
    } else if (bindMode === 'reservation' && selectedRes) {
      onBindGuest({
        name: selectedRes.name,
        phone: selectedRes.phone,
        type: 'reservation',
        contactId: selectedRes.id,
        savedPreferences: selectedRes.notes
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100">
        {/* 5-STAR HOSPITALITY GREETING HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-md">
              <UserPlus className="w-5 h-5 text-white dark:text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🛎️ Sambut Tamu & Check-In</span>
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">{table.name}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Sambut kedatangan tamu, pilih kontak CRM atau catat tamu walk-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 MODE TABS (NEUTRAL HIGH-CONTRAST STANDARDS) */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setBindMode('registered')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              bindMode === 'registered' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Pilih Kontak CRM
          </button>
          <button
            type="button"
            onClick={() => setBindMode('walk-in')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              bindMode === 'walk-in' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> + Tamu Baru
          </button>
          <button
            type="button"
            onClick={() => setBindMode('reservation')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              bindMode === 'reservation' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Booking
          </button>
        </div>

        {/* MODE 1: REGISTERED CUSTOMERS */}
        {bindMode === 'registered' && (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama / No HP Pelanggan VIP..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
              {filteredRegistered.map((guest) => {
                const isSelected = selectedContact?.id === guest.id
                return (
                  <div
                    key={guest.id}
                    onClick={() => setSelectedContact(guest)}
                    className={`border rounded-2xl p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-white text-slate-900 dark:text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{guest.name}</span>
                        {guest.isVip && (
                          <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" /> {guest.tier}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {guest.phone}
                      </p>
                      {guest.pref && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium italic">Preferensi: {guest.pref}</p>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-white flex-shrink-0" />}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MODE 2: WALK-IN NEW GUEST */}
        {bindMode === 'walk-in' && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Nama Tamu Walk-In *</label>
              <input
                type="text"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="cth: Aldi Pratama"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Nomor WhatsApp / HP (Opsional)</label>
              <input
                type="text"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                placeholder="cth: 081234567890"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Catatan Khusus / Preferensi</label>
              <input
                type="text"
                value={walkInPref}
                onChange={(e) => setWalkInPref(e.target.value)}
                placeholder="cth: Minta tempat di dekat window AC"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* MODE 3: MANUAL RESERVATION */}
        {bindMode === 'reservation' && (
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Daftar Reservasi Hari Ini:</span>
            {ACTIVE_RESERVATIONS.map((res) => {
              const isSelected = selectedRes?.id === res.id
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className={`border rounded-2xl p-3 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{res.name}</span>
                      <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                        ⏰ {res.timeSlot} • {res.pax} Pax
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{res.phone}</p>
                    {res.notes && <p className="text-[10px] text-amber-700 dark:text-amber-400/90 mt-1 font-semibold">Catatan: {res.notes}</p>}
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        )}

        {/* Action Button Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleConfirmBind}
            disabled={
              (bindMode === 'registered' && !selectedContact) ||
              (bindMode === 'walk-in' && !walkInName.trim()) ||
              (bindMode === 'reservation' && !selectedRes)
            }
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" /> Buka Tab & Ikat Tamu ke {table.name} ➔
          </button>
        </div>
      </div>
    </div>
  )
}
