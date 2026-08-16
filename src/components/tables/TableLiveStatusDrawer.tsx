import React from 'react'
import { X, Clock, UserCheck, Utensils, CheckCircle2, Phone, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react'
import { TableStatus, OrderTicket } from '../../types/pos'

export interface TableLiveStatusDrawerProps {
  show: boolean
  onClose: () => void
  table: TableStatus | null
  orderTicket?: OrderTicket | null
  onCheckoutTable?: (table: TableStatus) => void
  onMoveKitchenStatus?: (orderId: string, targetStatus: OrderTicket['status']) => void
}

export const TableLiveStatusDrawer: React.FC<TableLiveStatusDrawerProps> = ({
  show,
  onClose,
  table,
  orderTicket,
  onCheckoutTable,
  onMoveKitchenStatus
}) => {
  if (!show || !table) return null

  const guestName = table.customerName || orderTicket?.customerName || 'Aldi Pratama'
  const guestPhone = orderTicket?.phone || '081234567890'
  const timeElapsed = orderTicket?.timeElapsedMinutes ?? 12
  const currentStatus = orderTicket?.status || 'processing'

  const items = orderTicket?.items || [
    { name: 'Espresso Single Shot', quantity: 2, price: 25000, temperature: 'Hot', sugarLevel: '100%' },
    { name: 'Artisan Matcha Latte', quantity: 1, price: 38000, temperature: 'Iced', milkOption: 'Oat Milk (+Rp 5.000)' }
  ]

  const totalBill = table.totalBill > 0 ? table.totalBill : items.reduce((acc, i) => acc + (i.price * i.quantity), 0)

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
              {table.name}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                🟢 Live Status Monitoring Meja ({table.name})
              </h3>
              <p className="text-[11px] text-slate-400">Status pesanan dapur real-time & rincian billing open-tab</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guest Profile & Waiting Timer Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{guestName}</h4>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> {guestPhone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold">{timeElapsed} Menit Menunggu</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Metode Tab: <strong className="text-slate-200 uppercase">{table.status}</strong></span>
            <span>Tagihan Meja: <strong className="text-amber-400 font-mono text-xs">Rp {totalBill.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {/* Kitchen Status Stepper (Brewing, Cooking, Served) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-indigo-400" /> Tracking Status Dapur & Barista:
            </span>
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {currentStatus}
            </span>
          </span>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
              ['placed', 'processing'].includes(currentStatus)
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span className="text-xs">☕ Brewing</span>
              <span className="text-[9px] font-mono">Dapur Masak</span>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
              ['ready', 'qc-passed'].includes(currentStatus)
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span className="text-xs">🍳 Cooking / QC</span>
              <span className="text-[9px] font-mono font-normal">Nampan Ready</span>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
              currentStatus === 'served'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span className="text-xs">✅ Served</span>
              <span className="text-[9px] font-mono font-normal">Tersaji Meja</span>
            </div>
          </div>
        </div>

        {/* Item Orders List Breakdown */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Daftar Pesanan Item ({items.length}):</span>
            <span className="text-[10px] text-slate-500">Seat Allocation Included</span>
          </span>

          {items.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                  {item.quantity}x
                </span>
                <div>
                  <h5 className="font-bold text-xs text-slate-100">{item.name}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.temperature || 'Reg'} {item.milkOption ? `• ${item.milkOption}` : ''} {item.sugarLevel ? `• Sugar ${item.sugarLevel}` : ''}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex gap-2">
          {orderTicket && onMoveKitchenStatus && currentStatus !== 'served' && (
            <button
              onClick={() => onMoveKitchenStatus(orderTicket.id, 'served')}
              className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" /> Tandai Served
            </button>
          )}

          {onCheckoutTable && (
            <button
              onClick={() => {
                onCheckoutTable(table)
                onClose()
              }}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-4 h-4" /> Pelunasan Meja ➔
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
