import React, { useState } from 'react'
import {
  Calendar,
  Music,
  Tv,
  Coffee,
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  Sparkles,
  Layers,
  Camera,
  X,
  SlidersHorizontal,
  Check
} from 'lucide-react'

export interface MerchantEvent {
  id: string
  title: string
  category: 'live_music' | 'nobar_sport' | 'workshop' | 'private_party'
  dateStr: string
  timeStr: string
  isGatedTicket: boolean
  ticketPrice: number
  fdcInclusions?: string
  allocatedTables?: string[]
  maxCapacity: number
  ticketsSold: number
  checkedInCount: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

const INITIAL_EVENTS: MerchantEvent[] = [
  {
    id: 'EVT-001',
    title: '🎸 Akustik Senja & Live Music Friday',
    category: 'live_music',
    dateStr: 'Jumat, 29 Agu 2026',
    timeStr: '19:30 - 22:30 WIB',
    isGatedTicket: false,
    ticketPrice: 0,
    maxCapacity: 60,
    ticketsSold: 42,
    checkedInCount: 28,
    status: 'upcoming'
  },
  {
    id: 'EVT-002',
    title: '⚽ Nobar Big Match & Final Cup',
    category: 'nobar_sport',
    dateStr: 'Sabtu, 30 Agu 2026',
    timeStr: '21:00 - 23:30 WIB',
    isGatedTicket: true,
    ticketPrice: 50000,
    fdcInclusions: 'Free 1x Ice Aren Latte + Snack',
    allocatedTables: ['OUT-01', 'OUT-02', 'OUT-03', 'OUT-04'],
    maxCapacity: 80,
    ticketsSold: 76,
    checkedInCount: 52,
    status: 'upcoming'
  },
  {
    id: 'EVT-003',
    title: '☕ Roastery & Latte Art Workshop',
    category: 'workshop',
    dateStr: 'Minggu, 31 Agu 2026',
    timeStr: '10:00 - 13:00 WIB',
    isGatedTicket: true,
    ticketPrice: 150000,
    fdcInclusions: 'Sertifikat, Beans 250g & Lunch',
    maxCapacity: 12,
    ticketsSold: 12,
    checkedInCount: 0,
    status: 'upcoming'
  }
]

export const EventManagementTab: React.FC = () => {
  const [events, setEvents] = useState<MerchantEvent[]>(INITIAL_EVENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [checkinSuccessMsg, setCheckinSuccessMsg] = useState<string | null>(null)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState<'live_music' | 'nobar_sport' | 'workshop' | 'private_party'>('live_music')
  const [formDate, setFormDate] = useState('Sabtu, 5 Sep 2026')
  const [formTime, setFormTime] = useState('19:00 - 22:00 WIB')
  const [formIsGated, setFormIsGated] = useState(false)
  const [formPrice, setFormPrice] = useState('50000')
  const [formCapacity, setFormCapacity] = useState('50')
  const [formFdc, setFormFdc] = useState('Free 1x Minuman Pilihan')

  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = filterCategory === 'all' || e.category === filterCategory
    return matchSearch && matchCat
  })

  const handleSimulateCheckin = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId && ev.checkedInCount < ev.ticketsSold
          ? { ...ev, checkedInCount: ev.checkedInCount + 1 }
          : ev
      )
    )
    setCheckinSuccessMsg('✅ Tiket #TKT-8821 Terverifikasi! Tamu Berhasil Check-In.')
    setTimeout(() => setCheckinSuccessMsg(null), 3000)
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = formIsGated ? parseInt(formPrice.replace(/\D/g, ''), 10) || 0 : 0
    const capNum = parseInt(formCapacity.replace(/\D/g, ''), 10) || 50

    const newEv: MerchantEvent = {
      id: `EVT-00${events.length + 1}`,
      title: formTitle,
      category: formCategory,
      dateStr: formDate,
      timeStr: formTime,
      isGatedTicket: formIsGated,
      ticketPrice: priceNum,
      fdcInclusions: formIsGated ? formFdc : undefined,
      maxCapacity: capNum,
      ticketsSold: 0,
      checkedInCount: 0,
      status: 'upcoming'
    }

    setEvents((prev) => [newEv, ...prev])
    setIsModalOpen(false)
    setFormTitle('')
  }

  const formatIdr = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-4">
      {/* Top Banner: 100% Optional Notice */}
      <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300 font-semibold">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Fitur Event &amp; Tiket bersifat 100% Opsional. Toko yang tidak mengadakan acara tetap dapat beroperasi normal tanpa hambatan.</span>
        </div>
      </div>

      {/* Top Action Bar (Mobile-First Responsive Stack) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-3.5 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari acara / event..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto text-xs bg-background border border-border text-foreground rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">Semua Jenis Acara</option>
            <option value="live_music">Live Music & Akustik</option>
            <option value="nobar_sport">Nobar Bola / Olahraga</option>
            <option value="workshop">Workshop & Roastery</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormTitle('Live Acoustic Weekend')
            setIsModalOpen(true)
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[42px] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Jadwalkan Event Baru</span>
        </button>
      </div>

      {checkinSuccessMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{checkinSuccessMsg}</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-card p-4 rounded-2xl border border-border shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {ev.category === 'live_music' ? (
                      <Music className="w-4 h-4" />
                    ) : ev.category === 'nobar_sport' ? (
                      <Tv className="w-4 h-4" />
                    ) : (
                      <Coffee className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                      {ev.category === 'live_music'
                        ? 'Live Music'
                        : ev.category === 'nobar_sport'
                        ? 'Nobar Olahraga'
                        : 'Workshop Edukasi'}
                    </span>
                    <span className="text-[10px] text-amber-500 font-mono block">
                      {ev.isGatedTicket ? '🎟️ Tiket Berbayar (FDC)' : '🆓 Masuk Bebas (Walk-in)'}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                  🟢 Terjadwal
                </span>
              </div>

              <h4 className="text-xs font-bold text-foreground leading-snug">{ev.title}</h4>

              <div className="text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-foreground" />
                  <span>{ev.dateStr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-foreground" />
                  <span>{ev.timeStr}</span>
                </div>
              </div>

              {ev.isGatedTicket && (
                <div className="p-2 rounded-xl bg-muted/40 border border-border text-[11px] space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">Harga Tiket:</span>
                    <span className="font-bold text-emerald-500">{formatIdr(ev.ticketPrice)}</span>
                  </div>
                  {ev.fdcInclusions && (
                    <div className="text-[10px] text-muted-foreground">
                      Include: <span className="text-foreground font-medium">{ev.fdcInclusions}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Capacity Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-muted-foreground">Kehadiran (Check-in):</span>
                  <span className="font-bold text-foreground">
                    {ev.checkedInCount} / {ev.ticketsSold} Hadir (Kapasitas: {ev.maxCapacity})
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (ev.checkedInCount / Math.max(1, ev.maxCapacity)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Gate Checkin Action */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSimulateCheckin(ev.id)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[38px]"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Tiket Gate-in</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Schedule Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md p-5 sm:p-6 rounded-2xl border border-border shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Jadwalkan Event / Acara Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Nama Acara / Event</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Nobar Liga Champions"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                  >
                    <option value="live_music">Live Music</option>
                    <option value="nobar_sport">Nobar Olahraga</option>
                    <option value="workshop">Workshop</option>
                    <option value="private_party">Private Party</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Kapasitas Kursi</label>
                  <input
                    type="number"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Wajib Beli Tiket / FDC?</span>
                  <input
                    type="checkbox"
                    checked={formIsGated}
                    onChange={(e) => setFormIsGated(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                </div>
                {formIsGated && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Harga Tiket (IDR)</label>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Termasuk Minuman / FDC</label>
                      <input
                        type="text"
                        value={formFdc}
                        onChange={(e) => setFormFdc(e.target.value)}
                        placeholder="Contoh: Free 1 Mocktail"
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Jadwalkan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
