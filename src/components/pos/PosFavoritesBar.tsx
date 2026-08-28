import React, { useState } from 'react'
import { Sparkles, Edit3, ChevronDown, ChevronUp, Bell, CheckCircle2, Clock, Utensils } from 'lucide-react'
import { MenuItem, OrderTicket } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface PosFavoritesBarProps {
  pinnedFavorites: MenuItem[]
  isImageUrl: (url?: string) => boolean
  onAddToCart: (item: MenuItem) => void
  onEditPinnedMenu?: () => void
  isMobile?: boolean
  orders?: OrderTicket[]
  onUpdateOrderStatus?: (orderId: string, status: OrderTicket['status']) => void
  onSelectOrderTable?: (tableName: string) => void
}

export const PosFavoritesBar: React.FC<PosFavoritesBarProps> = ({
  pinnedFavorites,
  isImageUrl,
  onAddToCart,
  onEditPinnedMenu,
  isMobile = false,
  orders = [],
  onUpdateOrderStatus,
  onSelectOrderTable,
}) => {
  const { t, formatPrice } = useTranslation()
  const [activeTab, setActiveTab] = useState<'speed_keys' | 'track_orders'>('speed_keys')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeOrders = orders.filter((o) => o.status !== 'served' && o.status !== 'cancelled')

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1.5 shadow-xl transition-all">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1.5">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab('speed_keys')}
            className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
              activeTab === 'speed_keys'
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 fill-amber-500 dark:fill-amber-400 shrink-0" />
            <span className="truncate">{isMobile ? 'Favorites' : '⚡ Speed Keys'}</span>
            <span className="text-[9px] font-mono opacity-80">({pinnedFavorites.length})</span>
          </button>

          {activeOrders.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('track_orders')}
              className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'track_orders'
                  ? 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span className="truncate">Lacak Dapur</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-indigo-600 text-white font-bold rounded-full">
                {activeOrders.length}
              </span>
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {activeTab === 'speed_keys' && (
            <button
              type="button"
              onClick={onEditPinnedMenu}
              className="text-[10px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all shadow-sm shrink-0"
              title="Edit Pinned Shortcuts"
            >
              <Edit3 className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" /> {t.pos.editShortcut}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shrink-0"
            title={isCollapsed ? 'Tampilkan' : 'Sembunyikan'}
          >
            {isCollapsed ? <ChevronUp className="w-3 h-3 text-amber-500 dark:text-amber-400" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {!isCollapsed && activeTab === 'speed_keys' && (
        <div className={`grid gap-1.5 max-h-36 overflow-y-auto custom-scrollbar ${isMobile ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-6'}`}>
          {pinnedFavorites.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddToCart(item)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-1.5 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 shadow-sm group min-w-0"
            >
              {isImageUrl(item.image) ? (
                <img src={item.image} alt={item.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover mb-0.5 shadow-inner group-hover:opacity-90 shrink-0" />
              ) : (
                <span className="text-sm sm:text-base mb-0.5 shrink-0">{item.image || '☕'}</span>
              )}
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-slate-950 dark:group-hover:text-white leading-tight">{item.name}</span>
              <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold leading-tight">{formatPrice(item.price)}</span>
            </button>
          ))}
        </div>
      )}

      {!isCollapsed && activeTab === 'track_orders' && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
          {activeOrders.map((order) => {
            const isReady = order.status === 'ready'
            return (
              <div
                key={order.id}
                className={`shrink-0 flex items-center justify-between gap-3 p-2 rounded-xl border transition-all ${
                  isReady
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div
                  className="flex flex-col min-w-[130px] cursor-pointer"
                  onClick={() => onSelectOrderTable?.(order.table)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {order.customerName || 'Tamu'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      M-{order.table}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{order.items.length} item</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {order.timeElapsedMinutes || 0}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isReady ? (
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus?.(order.id, 'served')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Sajikan
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Utensils className="w-2.5 h-2.5" /> Di Dapur
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

