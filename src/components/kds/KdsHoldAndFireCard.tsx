import React, { useState } from 'react'
import { Flame, Clock, Check, AlertCircle, ChefHat, Play, Pause, Bell } from 'lucide-react'

export interface KdsCourseItem {
  id: string
  name: string
  qty: number
  courseType: 'appetizer' | 'main' | 'dessert' | 'beverage'
  status: 'fire_now' | 'on_hold' | 'ready'
  holdUntilMinutes?: number
  specialNotes?: string
}

export interface KdsHoldAndFireCardProps {
  tableNumber: string
  orderId: string
  items: KdsCourseItem[]
  onItemStatusChange?: (itemId: string, newStatus: 'fire_now' | 'on_hold' | 'ready') => void
}

export const KdsHoldAndFireCard: React.FC<KdsHoldAndFireCardProps> = ({
  tableNumber,
  orderId,
  items: initialItems,
  onItemStatusChange
}) => {
  const [items, setItems] = useState<KdsCourseItem[]>(initialItems)
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null)

  const handleToggleHoldFire = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextStatus = item.status === 'on_hold' ? 'fire_now' : 'on_hold'
        if (onItemStatusChange) onItemStatusChange(itemId, nextStatus)
        setNotificationMsg(nextStatus === 'fire_now' ? `🔥 ${item.name} Sedang Dimasak (Fired)!` : `⏳ ${item.name} Ditahan (On Hold).`)
        return { ...item, status: nextStatus }
      }
      return item
    }))
    setTimeout(() => setNotificationMsg(null), 3000)
  }

  const handleMarkReady = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (onItemStatusChange) onItemStatusChange(itemId, 'ready')
        setNotificationMsg(`✅ ${item.name} Siap Diantar!`)
        return { ...item, status: 'ready' }
      }
      return item
    }))
    setTimeout(() => setNotificationMsg(null), 3000)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl text-slate-100 w-full max-w-md">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">{tableNumber}</h4>
            <span className="text-[10px] font-mono text-slate-400">{orderId}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300">
          KDS Course Sequencing
        </span>
      </div>

      {notificationMsg && (
        <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
          <Bell className="w-3.5 h-3.5" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* ITEMS LIST */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const isHold = item.status === 'on_hold'
          const isReady = item.status === 'ready'
          const isFiring = item.status === 'fire_now'

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                isReady
                  ? 'bg-emerald-950/30 border-emerald-500/40 opacity-70'
                  : isHold
                  ? 'bg-slate-950 border-amber-500/40'
                  : 'bg-orange-950/20 border-orange-500/50 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-amber-400">{item.qty}x</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {item.courseType} {item.specialNotes && `• ${item.specialNotes}`}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-mono border ${
                  isReady
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : isHold
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-orange-500/20 border-orange-500/50 text-orange-300 animate-pulse'
                }`}>
                  {isReady ? 'Ready' : isHold ? '⏳ ON HOLD' : '🔥 COOKING'}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              {!isReady && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleToggleHoldFire(item.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isHold
                        ? 'bg-orange-500 hover:bg-orange-400 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                    }`}
                  >
                    {isHold ? <Flame className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isHold ? 'Mulai Masak (Fire)' : 'Tahan (Hold)'}</span>
                  </button>

                  {isFiring && (
                    <button
                      type="button"
                      onClick={() => handleMarkReady(item.id)}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Siap</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
