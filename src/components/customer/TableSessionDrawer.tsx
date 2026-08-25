import React from 'react'
import { X, Coffee, Utensils, Clock, CheckCircle2, Plus, Receipt } from 'lucide-react'

export interface TableSessionDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedTable: string
  scannedSeat: string
  onAddMoreItems: () => void
}

const TABLE_LIVE_SESSION_MOCK = {
  sessionId: 'SES-MEJA-04-88',
  openedAt: 'Hari ini, 14:15 WIB',
  duration: '45 Menit',
  status: 'active',
  rounds: [
    {
      roundNo: 1,
      time: '14:20',
      items: [
        { name: 'Caffe Latte (Less Ice)', qty: 2, price: 38000, status: 'brewing', kitchenNote: 'Barista Station' },
        { name: 'Truffle French Fries', qty: 1, price: 35000, status: 'cooking', kitchenNote: 'Kitchen Fryer' }
      ]
    },
    {
      roundNo: 2,
      time: '14:40',
      items: [
        { name: 'Pain au Chocolat', qty: 1, price: 32000, status: 'served', kitchenNote: 'Pastry Display' }
      ]
    }
  ],
  subtotal: 143000,
  serviceFee: 7150,
  taxPB1: 15015,
  grandTotal: 165165
}

export const TableSessionDrawer: React.FC<TableSessionDrawerProps> = ({
  isOpen,
  onClose,
  selectedTable,
  scannedSeat,
  onAddMoreItems
}) => {
  if (!isOpen) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'brewing':
        return (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Coffee className="w-2.5 h-2.5 animate-pulse" /> Sedang Diseduh
          </span>
        )
      case 'cooking':
        return (
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Utensils className="w-2.5 h-2.5 animate-pulse" /> Sedang Dimasak
          </span>
        )
      case 'served':
      default:
        return (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Sudah Disajikan
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md transition-all animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto no-scrollbar animate-slideUp text-slate-900 dark:text-slate-100">
        {/* DRAG HANDLE BAR (TOUCH AFFORDANCE) */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700/80 rounded-full mx-auto -mt-1 mb-1 shrink-0" />

        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
                  Status & Tagihan {selectedTable}
                </h3>
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                  {scannedSeat}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Sesi Dine-in Aktif • Mulai {TABLE_LIVE_SESSION_MOCK.openedAt}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-all shrink-0 active:scale-95 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LIVE KITCHEN & BARISTA STATUS PER ROUND */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Pesanan Berjalan di Meja Ini:
          </span>

          <div className="flex flex-col gap-2.5 max-h-[40vh] overflow-y-auto no-scrollbar">
            {TABLE_LIVE_SESSION_MOCK.rounds.map((round) => (
              <div key={round.roundNo} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-900 pb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    Ronde #{round.roundNo} • {round.time} WIB
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{round.items.length} Menu</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {round.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.qty}x {item.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BILL SUMMARY & PELUNASAN */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2 shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Subtotal Meja ({TABLE_LIVE_SESSION_MOCK.rounds.reduce((acc, r) => acc + r.items.length, 0)} item):</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">Rp {TABLE_LIVE_SESSION_MOCK.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>PB1 Tax (10%) & Service (5%):</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">Rp {(TABLE_LIVE_SESSION_MOCK.serviceFee + TABLE_LIVE_SESSION_MOCK.taxPB1).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-900 text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Total Tagihan Meja:</span>
            <span className="font-black font-mono text-amber-700 dark:text-amber-400">Rp {TABLE_LIVE_SESSION_MOCK.grandTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose()
              onAddMoreItems()
            }}
            className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Tambah Pesanan Ronde Baru</span>
          </button>
        </div>
      </div>
    </div>
  )
}
