import React, { useState } from 'react'
import { Calendar, Users, Clock, CheckCircle2, Phone, Sparkles, MapPin, DollarSign, Filter, Search } from 'lucide-react'
import { TableReservation, TableStatus } from '../../types/pos'
import { MOCK_TABLE_RESERVATIONS } from '../../data/mockData'

export interface PosBookingReservationsSectionProps {
  onCheckInReservation?: (reservation: TableReservation) => void
  onSelectTable?: (tableId: string) => void
}

export const PosBookingReservationsSection: React.FC<PosBookingReservationsSectionProps> = ({
  onCheckInReservation
}) => {
  const [reservations, setReservations] = useState<TableReservation[]>(MOCK_TABLE_RESERVATIONS)
  const [filterArea, setFilterArea] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleCheckIn = (rsv: TableReservation) => {
    setReservations(prev =>
      prev.map(r => r.id === rsv.id ? { ...r, status: 'seated' } : r)
    )
    onCheckInReservation?.(rsv)
  }

  const filteredReservations = reservations.filter(rsv => {
    if (filterArea !== 'all' && !rsv.tableArea.toLowerCase().includes(filterArea.toLowerCase())) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return rsv.customerName.toLowerCase().includes(q) || rsv.phone.includes(q) || rsv.tableArea.toLowerCase().includes(q)
    }
    return true
  })

  const totalPax = reservations.reduce((acc, r) => acc + (r.status !== 'cancelled' ? r.paxCount : 0), 0)
  const totalDp = reservations.reduce((acc, r) => acc + (r.dpStatus === 'paid_qris' ? r.dpAmount : 0), 0)

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 p-3 sm:p-5 overflow-y-auto overscroll-contain">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 shrink-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Booking</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-mono font-black text-white mt-1">
            {reservations.length} <span className="text-xs font-normal text-slate-400 font-sans">Reservasi</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estimasi Tamu</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-mono font-black text-emerald-400 mt-1">
            {totalPax} <span className="text-xs font-normal text-slate-400 font-sans">Pax</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DP Terkumpul</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-mono font-black text-amber-400 mt-1 truncate">
            Rp {totalDp.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status Meja VIP</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xs font-bold text-purple-300 mt-1 flex items-center gap-1">
            <span>👑 1 Meja Terbooking</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH STRIP */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          <button
            type="button"
            onClick={() => setFilterArea('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterArea === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semua ({reservations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterArea('vip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterArea === 'vip'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            👑 VIP Rooms
          </button>
          <button
            type="button"
            onClick={() => setFilterArea('outdoor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterArea === 'outdoor'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🌿 Outdoor
          </button>
          <button
            type="button"
            onClick={() => setFilterArea('indoor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterArea === 'indoor'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ❄️ Indoor AC
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu / no. HP..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 3. RESERVATION CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
        {filteredReservations.map((rsv) => {
          const isSeated = rsv.status === 'seated'
          return (
            <div
              key={rsv.id}
              className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                isSeated
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div>
                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {rsv.customerName}
                      </span>
                      {isSeated && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                          ✓ Sudah Duduk
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {rsv.phone}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                        <Users className="w-3 h-3 text-indigo-400" /> {rsv.paxCount} Pax
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                      <Clock className="w-3 h-3" />
                      <span>{rsv.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* AREA & DP BADGES */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" /> {rsv.tableArea}
                  </span>
                  {rsv.dpAmount > 0 && (
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> DP Rp {rsv.dpAmount.toLocaleString('id-ID')} (Lunas)
                    </span>
                  )}
                </div>

                {/* SPECIAL NOTES */}
                {rsv.specialNotes && (
                  <div className="mt-3 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-slate-300">Catatan Khusus:</span> {rsv.specialNotes}
                  </div>
                )}
              </div>

              {/* CARD FOOTER ACTION */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-500">ID: {rsv.id}</span>
                {!isSeated ? (
                  <button
                    type="button"
                    onClick={() => handleCheckIn(rsv)}
                    className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check-In Tamu ➔ Buka Meja</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tamu Berada di Meja
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default PosBookingReservationsSection
