import React, { useState, useMemo } from 'react'
import {
  Bell, X, CheckCircle2, Clock, Utensils, Droplets, Sparkles, Check, Flame
} from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'
import { ServiceTicket } from '../../types/pos'

export interface ServiceTicketingDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const ServiceTicketingDrawer: React.FC<ServiceTicketingDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { serviceTickets, resolveTicket, updateTicketStatus, openServiceTicketsCount } = useNotification()
  const [filter, setFilter] = useState<'open' | 'all'>('open')

  const filteredTickets = useMemo(() => {
    if (filter === 'open') return serviceTickets.filter(t => t.status !== 'resolved')
    return serviceTickets
  }, [serviceTickets, filter])

  if (!isOpen) return null

  const getServiceTypeInfo = (type: ServiceTicket['type']) => {
    switch (type) {
      case 'bill_request':
        return { label: 'Minta Tagihan / Bill', icon: <DollarIcon className="w-4 h-4 text-amber-400" />, color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' }
      case 'water_refill':
        return { label: 'Refill Air Minum', icon: <Droplets className="w-4 h-4 text-sky-400" />, color: 'bg-sky-500/10 border-sky-500/30 text-sky-300' }
      case 'clean_table':
        return { label: 'Bersihkan Meja', icon: <Sparkles className="w-4 h-4 text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' }
      case 'sommelier_advice':
        return { label: 'Konsultasi Sommelier', icon: <Utensils className="w-4 h-4 text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/30 text-purple-300' }
      default:
        return { label: 'Panggil Waiter', icon: <Bell className="w-4 h-4 text-rose-400" />, color: 'bg-rose-500/10 border-rose-500/30 text-rose-300' }
    }
  }

  const calculateWaitMinutes = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime()
    return Math.max(1, Math.floor(diffMs / 60000))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-[100dvh] overflow-hidden animate-slideLeft text-slate-100 font-sans">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                Panggilan Pelayan & Meja
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {openServiceTicketsCount} tiket menunggu respons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filter === 'open'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Aktif / Menunggu ({openServiceTicketsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Semua Riwayat ({serviceTickets.length})
          </button>
        </div>

        {/* TICKETS LIST */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
          {filteredTickets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-slate-300">Semua Meja Terlayani!</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Tidak ada panggilan tamu atau permintaan tagihan tertunda.
              </p>
            </div>
          ) : (
            filteredTickets.map(ticket => {
              const info = getServiceTypeInfo(ticket.type)
              const waitMin = calculateWaitMinutes(ticket.createdAt)
              const isResolved = ticket.status === 'resolved'

              return (
                <div
                  key={ticket.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                    isResolved
                      ? 'bg-slate-900/40 border-slate-850 opacity-60'
                      : waitMin > 5
                      ? 'bg-slate-900 border-rose-500/50 shadow-lg ring-1 ring-rose-500/20'
                      : 'bg-slate-900 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 shadow-sm">
                        {ticket.tableNumber}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${info.color}`}>
                        {info.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono">
                      <Clock className={`w-3 h-3 ${waitMin > 5 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                      <span className={waitMin > 5 ? 'text-rose-400 font-black' : 'text-slate-400'}>
                        {isResolved ? 'Selesai' : `${waitMin} mnt lalu`}
                      </span>
                    </div>
                  </div>

                  {ticket.notes && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      💬 &quot;{ticket.notes}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {isResolved ? (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" /> Dilayani oleh {ticket.assignedStaffName || 'Staff'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {ticket.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => updateTicketStatus(ticket.id, 'in_progress', 'Staff Kasir')}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95"
                          >
                            Tangani
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => resolveTicket(ticket.id, 'Staff Kasir')}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Selesai Dilayani</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-mono">
            Hfe POS Realtime Waiter & Service Dispatch
          </p>
        </div>
      </div>
    </div>
  )
}

const DollarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`font-mono font-black ${className}`}>Rp</span>
)
