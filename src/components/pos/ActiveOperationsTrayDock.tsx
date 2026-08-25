import React, { useState } from 'react'
import { 
  Inbox, ChevronUp, ChevronDown, Trash2, ArrowUpRight, 
  Clock, Coffee, ShoppingBag, Truck, X
} from 'lucide-react'
import { ParkedOperationTab } from '../../types/pos'

export interface ActiveOperationsTrayDockProps {
  parkedTabs: ParkedOperationTab[]
  onRestoreTab: (tab: ParkedOperationTab) => void
  onDiscardTab: (tabId: string) => void
  onClearAllTabs?: () => void
  onParkCurrentCart?: () => void
  hasActiveCartItems?: boolean
}

export const ActiveOperationsTrayDock: React.FC<ActiveOperationsTrayDockProps> = ({
  parkedTabs,
  onRestoreTab,
  onDiscardTab,
  onClearAllTabs,
  onParkCurrentCart,
  hasActiveCartItems = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)


  const getFulfillmentIcon = (mode: string) => {
    switch (mode) {
      case 'dine_in': return <Coffee className="w-3.5 h-3.5 text-amber-500" />
      case 'takeaway': return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
      case 'delivery': return <Truck className="w-3.5 h-3.5 text-blue-500" />
      default: return <Inbox className="w-3.5 h-3.5 text-slate-400" />
    }
  }

  const formatElapsedTime = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime()
      const mins = Math.max(1, Math.floor(diffMs / 60000))
      return `${mins}m lalu`
    } catch {
      return 'baru saja'
    }
  }

  return (
    <aside 
      aria-label="Baki Operasi Parkir Pesanan"
      className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl transition-all z-20 shrink-0"
    >
      {/* 1. DOCK HEADER BAR */}
      <div className="px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 text-xs font-bold transition-all hover:bg-amber-500/20 active:scale-[0.97] cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-mono font-black">{parkedTabs.length}</span>
            <span>Parkir Antrean</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* QUICK HORIZONTAL STRIP OF PARKED TABS (IF NOT EXPANDED) */}
          {!isExpanded && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {parkedTabs.slice(0, 3).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onRestoreTab(tab)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 transition-all shrink-0 active:scale-[0.97] cursor-pointer"
                >
                  {getFulfillmentIcon(tab.fulfillmentMode)}
                  <span className="truncate max-w-[90px]">{tab.label}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 text-[10px]">
                    Rp {(tab.totalAmount / 1000).toLocaleString('id-ID')}k
                  </span>
                </button>
              ))}
              {parkedTabs.length > 3 && (
                <span className="text-[10px] text-slate-400 font-mono">+{parkedTabs.length - 3} lagi</span>
              )}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1.5 shrink-0">
          {hasActiveCartItems && onParkCurrentCart && (
            <button
              type="button"
              onClick={onParkCurrentCart}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all active:scale-[0.97] cursor-pointer"
              title="Parkirkan transaksi yang sedang aktif ke baki bawah"
            >
              <Inbox className="w-3 h-3 text-amber-500" />
              <span>Parkirkan Keranjang</span>
            </button>
          )}

          {isExpanded && parkedTabs.length > 0 && onClearAllTabs && (
            <button
              type="button"
              onClick={onClearAllTabs}
              className="text-[10px] font-bold px-2 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              Bersihkan Semua
            </button>
          )}
        </div>
      </div>

      {/* 2. EXPANDED TRAY VIEW */}
      {isExpanded && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto overscroll-contain animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {parkedTabs.map((tab) => (
              <div
                key={tab.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 flex flex-col justify-between gap-2 shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {getFulfillmentIcon(tab.fulfillmentMode)}
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {tab.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {tab.items.reduce((s, i) => s + i.quantity, 0)} item • Rp {tab.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatElapsedTime(tab.parkedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDiscardTab(tab.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Hapus tab parkir"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ITEMS BRIEF */}
                <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800/80 truncate">
                  {tab.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                {/* RESTORE ACTION */}
                <button
                  type="button"
                  onClick={() => {
                    onRestoreTab(tab)
                    setIsExpanded(false)
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 shadow transition-all active:scale-[0.97] cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Buka & Lanjutkan Transaksi</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
