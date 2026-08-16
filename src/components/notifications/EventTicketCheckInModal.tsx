import React, { useState } from 'react'
import {
  Ticket, X, CheckCircle2, AlertCircle, QrCode, Sparkles, UserCheck, Search
} from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'

export interface EventTicketCheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

interface EventTicketRecord {
  ticketCode: string
  eventName: string
  attendeeName: string
  tier: 'VIP' | 'Regular' | 'Workshop'
  seatOrTable?: string
  status: 'VALID' | 'CHECKED_IN' | 'EXPIRED'
  checkedInAt?: string
}

const SAMPLE_EVENT_TICKETS: EventTicketRecord[] = [
  {
    ticketCode: 'TKT-2026-089',
    eventName: 'Specialty Cupping & Sensory Workshop',
    attendeeName: 'Rudi Hartono',
    tier: 'VIP',
    seatOrTable: 'Seat A-04',
    status: 'VALID'
  },
  {
    ticketCode: 'TKT-2026-090',
    eventName: 'Latte Art Championship 2026',
    attendeeName: 'Maya Salsabila',
    tier: 'Regular',
    status: 'VALID'
  },
  {
    ticketCode: 'TKT-2026-077',
    eventName: 'Barista Roasting Intensive',
    attendeeName: 'Hendro Gunawan',
    tier: 'Workshop',
    seatOrTable: 'Bar Counter 2',
    status: 'CHECKED_IN',
    checkedInAt: '13:45 WIB'
  }
]

export const EventTicketCheckInModal: React.FC<EventTicketCheckInModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addNotification } = useNotification()
  const [ticketQuery, setTicketQuery] = useState('')
  const [ticketsList, setTicketsList] = useState<EventTicketRecord[]>(SAMPLE_EVENT_TICKETS)
  const [activeTicket, setActiveTicket] = useState<EventTicketRecord | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'already'; message: string } | null>(null)

  if (!isOpen) return null

  const handleValidateCode = (code: string) => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    const found = ticketsList.find(t => t.ticketCode.toUpperCase() === trimmed)
    if (!found) {
      setActiveTicket(null)
      setFeedback({ type: 'error', message: `Tiket "${trimmed}" tidak ditemukan dalam database Hfe.` })
      return
    }

    setActiveTicket(found)
    if (found.status === 'CHECKED_IN') {
      setFeedback({ type: 'already', message: `Tiket sudah digunakan pada ${found.checkedInAt || 'sebelumnya'}.` })
    } else {
      setFeedback(null)
    }
  }

  const handleConfirmCheckIn = () => {
    if (!activeTicket || activeTicket.status === 'CHECKED_IN') return

    const checkInTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    
    setTicketsList(prev => prev.map(t => {
      if (t.ticketCode === activeTicket.ticketCode) {
        return { ...t, status: 'CHECKED_IN' as const, checkedInAt: checkInTime }
      }
      return t
    }))

    setActiveTicket(prev => prev ? { ...prev, status: 'CHECKED_IN', checkedInAt: checkInTime } : null)
    setFeedback({ type: 'success', message: `Gate-In Berhasil! ${activeTicket.attendeeName} (${activeTicket.tier}) dipersilakan masuk.` })

    // Trigger realtime notification
    addNotification({
      title: `Gate-In: ${activeTicket.attendeeName}`,
      message: `Tiket ${activeTicket.ticketCode} (${activeTicket.eventName} - ${activeTicket.tier}) berhasil check-in.`,
      category: 'tickets',
      priority: 'normal'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 border border-sky-500/40 rounded-2xl text-sky-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Event Ticket Gate-In</h3>
              <p className="text-[11px] text-slate-400 font-mono">Pintu Masuk & Validasi Tiket</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          {/* SEARCH INPUT */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={ticketQuery}
                onChange={e => { setTicketQuery(e.target.value); handleValidateCode(e.target.value) }}
                placeholder="Scan QR / Ketik Kode (e.g. TKT-2026-089)"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="button"
              onClick={() => handleValidateCode(ticketQuery)}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md shrink-0"
            >
              Cek
            </button>
          </div>

          {/* QUICK SHORTCUT BADGES */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 shrink-0">Sample:</span>
            {ticketsList.map(t => (
              <button
                key={t.ticketCode}
                type="button"
                onClick={() => { setTicketQuery(t.ticketCode); handleValidateCode(t.ticketCode) }}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 shrink-0"
              >
                {t.ticketCode}
              </button>
            ))}
          </div>

          {/* ACTIVE TICKET CARD */}
          {activeTicket ? (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-xl">
                  {activeTicket.ticketCode}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  activeTicket.status === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {activeTicket.status === 'VALID' ? 'Siap Check-In' : `Sudah Digunakan (${activeTicket.checkedInAt})`}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-black text-white">{activeTicket.attendeeName}</h4>
                <p className="text-xs text-slate-300 font-medium">{activeTicket.eventName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Tier: {activeTicket.tier}
                  </span>
                  {activeTicket.seatOrTable && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      📍 {activeTicket.seatOrTable}
                    </span>
                  )}
                </div>
              </div>

              {activeTicket.status === 'VALID' && (
                <button
                  type="button"
                  onClick={handleConfirmCheckIn}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Validasi & Check-In Masuk (Gate-In)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center text-slate-500">
              <QrCode className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-xs font-bold text-slate-400">Scan QR Tiket di Scanner</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Atau ketik kode voucher tiket pengunjung di atas.</p>
            </div>
          )}

          {/* FEEDBACK BANNER */}
          {feedback && (
            <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 font-medium border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : feedback.type === 'already'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
