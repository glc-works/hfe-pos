import React, { useState } from 'react'
import { OrderTicket } from '../../types/pos'
import { Clock, ChefHat, CheckCircle2, ChevronDown, ChevronUp, BellRing, Sparkles } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

interface PosTrackOrderDockProps {
  orders: OrderTicket[]
  onUpdateOrderStatus?: (orderId: string, nextStatus: OrderTicket['status']) => void
  onSelectOrderTable?: (tableName: string) => void
  className?: string
}

export const PosTrackOrderDock: React.FC<PosTrackOrderDockProps> = ({
  orders,
  onUpdateOrderStatus,
  onSelectOrderTable,
  className = ''
}) => {
  const { formatPrice } = useTranslation()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const activeOrders = orders.filter(o => o.status !== 'served' && o.status !== 'cancelled')

  if (activeOrders.length === 0) {
    return null
  }

  const getStatusBadge = (status: OrderTicket['status']) => {
    switch (status) {
      case 'ready':
      case 'qc-passed':
        return {
          label: 'Siap Saji',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          icon: <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
        }
      case 'processing':
      case 'brewing':
        return {
          label: 'Di Dapur',
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400',
          icon: <ChefHat className="w-3 h-3 text-amber-500 shrink-0" />
        }
      default:
        return {
          label: 'Antrean',
          bg: 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400',
          icon: <Clock className="w-3 h-3 text-blue-500 shrink-0" />
        }
    }
  }

  return (
    <div className={`shrink-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all ${className}`}>
      {/* 1. COMPACT EXPAND/COLLAPSE CONTROL BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/60">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Lacak Pesanan Dapur (Track Order)</span>
          <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full">
            {activeOrders.length} Aktif
          </span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronUp className="w-3.5 h-3.5 opacity-60" />}
        </button>

        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Sinkron KDS Dapur &amp; Barista
        </span>
      </div>

      {/* 2. EXPANDED HORIZONTAL TICKET CARDS RAIL */}
      {isExpanded && (
        <div className="p-2.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar touch-pan-x overscroll-x-contain">
          {activeOrders.map(order => {
            const badge = getStatusBadge(order.status)
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrderTable?.(order.table)}
                className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-2.5 min-w-[210px] max-w-[240px] shrink-0 flex flex-col justify-between gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer group select-none"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {order.customerName || 'Tamu'}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold truncate">
                      {order.table ? `Meja ${order.table}` : 'Takeaway / Online'}
                    </p>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${badge.bg}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] border-t border-slate-200/60 dark:border-slate-800/60 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">
                    {itemCount} item • {formatPrice(order.total)}
                  </span>
                  
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-[9px] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {order.timeElapsedMinutes}m
                  </span>
                </div>

                {order.status === 'ready' || order.status === 'qc-passed' ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdateOrderStatus?.(order.id, 'served')
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Sajikan ke Meja
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
