import React, { useState, useMemo } from 'react'
import {
  Bell, X, CheckCheck, Trash2, AlertTriangle, ShieldAlert,
  MessageSquare, DollarSign, Layers, Clock, Flame
} from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'
import { NotificationCategory, HfeNotification } from '../../types/pos'

export interface NotificationCenterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenServiceTickets?: () => void
  onOpenTicketValidator?: () => void
}

type FilterTab = 'all' | NotificationCategory

const CATEGORY_TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua Alert', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'safety_allergen', label: 'Alergen', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
  { id: 'operational', label: 'Meja & Dapur', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'financial_shifts', label: 'Shift Kasir', icon: <DollarSign className="w-3.5 h-3.5 text-yellow-400" /> },
  { id: 'feedback', label: 'Ulasan Tamu', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> }
]

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  onOpenServiceTickets,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications, openServiceTicketsCount } = useNotification()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  // Cafe Operations Isolation: In 'all' tab, prioritize operational F&B alerts (Allergens, Service, Shifts, Feedback)
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') {
      return notifications.filter(n => n.category !== 'tickets')
    }
    return notifications.filter(n => n.category === activeTab)
  }, [notifications, activeTab])

  if (!isOpen) return null

  const getPriorityBadge = (priority?: HfeNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">Urgent</span>
      case 'high':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Tinggi</span>
      case 'low':
        return <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Info</span>
      default:
        return null
    }
  }

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'safety_allergen':
        return <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400"><ShieldAlert className="w-4 h-4" /></div>
      case 'operational':
        return <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400"><Flame className="w-4 h-4" /></div>
      case 'feedback':
        return <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><MessageSquare className="w-4 h-4" /></div>
      case 'financial_shifts':
        return <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"><DollarSign className="w-4 h-4" /></div>
      default:
        return <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"><Bell className="w-4 h-4" /></div>
    }
  }

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime()
      const diffMin = Math.max(0, Math.floor(diffMs / 60000))
      if (diffMin < 1) return 'Baru saja'
      if (diffMin < 60) return `${diffMin}m lalu`
      const diffHour = Math.floor(diffMin / 60)
      return `${diffHour}j lalu`
    } catch {
      return 'Terkini'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-[100dvh] overflow-hidden animate-slideLeft text-slate-100">
        
        {/* 1. HEADER & QUICK STATS */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-slate-900">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                Pusat Alert Operasional Kafe
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {unreadCount} belum dibaca • Layanan lantai & alergen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-all text-xs flex items-center gap-1"
                title="Tandai Semua Selesai Dibaca"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all text-xs"
                title="Bersihkan Semua Notifikasi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. DEDICATED SHORTCUT HUBS: TABLE SERVICE & ALLERGEN ALERTS */}
        <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenServiceTickets?.()
            }}
            className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-slate-800 hover:from-amber-500/30 border border-amber-500/30 flex items-center justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">🛎️</span>
              <span className="text-xs font-bold text-slate-200">Panggilan Meja</span>
            </div>
            {openServiceTicketsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-black">
                {openServiceTicketsCount} Open
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">0</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('safety_allergen')}
            className={`flex-1 py-2 px-2.5 rounded-xl border flex items-center justify-between text-left transition-all active:scale-[0.98] ${
              activeTab === 'safety_allergen'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/30'
                : 'bg-gradient-to-r from-rose-500/10 to-slate-800 hover:from-rose-500/20 border-rose-500/20 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">⚠️</span>
              <span className="text-xs font-bold">Alert Alergen</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold">Kritis</span>
          </button>
        </div>

        {/* 3. CATEGORY FILTER TABS */}
        <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {CATEGORY_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 4. NOTIFICATIONS LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 min-h-0">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-300">Tidak Ada Alert Aktif</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Semua alert operasional meja dan alergen sudah tertangani.
              </p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  notif.isRead
                    ? 'bg-slate-900/40 border-slate-850/80 opacity-75 hover:opacity-100'
                    : 'bg-slate-900 border-slate-700/80 shadow-md ring-1 ring-amber-500/20'
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <h3 className={`text-xs font-bold truncate ${notif.isRead ? 'text-slate-300' : 'text-white font-extrabold'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getPriorityBadge(notif.priority)}
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.tableNumber && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        📍 {notif.tableNumber}
                      </span>
                      {!notif.isRead && (
                        <span className="text-[10px] text-amber-300/80 font-medium">
                          Sentuh untuk tandai baca
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 5. FOOTER */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-mono">
            Hfe Floor Operations & Service Dispatch (GLC-ENG-STD-001)
          </p>
        </div>
      </div>
    </div>
  )
}
