import React, { useState } from 'react'
import {
  X,
  Users,
  Clock,
  Link,
  Unlink,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  UserCheck,
  LogOut,
  Utensils
} from 'lucide-react'
import { TableStatus } from '../../types/pos'

export interface TableDetailDrawerProps {
  show: boolean
  onClose: () => void
  table: TableStatus | null
  onAddItemsToTable: (tableId: string) => void
  onCheckoutTable: (tableId: string) => void
  onUnjoinTable: (tableId: string) => void
  onPartialSeatCheckout: (tableId: string, seatNo: number) => void
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({
  show,
  onClose,
  table,
  onAddItemsToTable,
  onCheckoutTable,
  onUnjoinTable,
  onPartialSeatCheckout
}) => {
  const [selectedSeatForCheckout, setSelectedSeatForCheckout] = useState<number | null>(null)

  if (!show || !table) return null

  // Mock seat breakdown data for table detail view
  const mockSeats = [
    {
      seatNo: 1,
      guestName: table.customerName || 'Aldi Pratama (VIP Gold)',
      items: [
        { id: '1', name: 'Sirloin Steak Medium-Well', price: 150000, qty: 1, status: 'cooking' },
        { id: '2', name: 'Pinot Noir Red Wine', price: 85000, qty: 1, status: 'served' }
      ]
    },
    {
      seatNo: 2,
      guestName: 'Budi (Tamu Teman)',
      items: [
        { id: '3', name: 'Craft Draft Beer 500ml', price: 50000, qty: 1, status: 'served' }
      ]
    },
    {
      seatNo: 3,
      guestName: 'Siti (Tamu Teman)',
      items: [
        { id: '4', name: 'Creamy Mushroom Pasta', price: 65000, qty: 1, status: 'cooking' },
        { id: '5', name: 'Iced Lemon Tea (Less Ice)', price: 25000, qty: 1, status: 'served' }
      ]
    }
  ]

  const totalSubtotal = mockSeats.reduce(
    (acc, seat) => acc + seat.items.reduce((sAcc, item) => sAcc + item.price * item.qty, 0),
    0
  )
  const prePaidCredit = table.id === 'TBL-04' ? 100000 : 0 // Sub-Folio credit line
  const pb1Tax = Math.round((totalSubtotal - prePaidCredit) * 0.1)
  const remainingPayable = totalSubtotal - prePaidCredit + pb1Tax

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex justify-end transition-all">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between p-4 sm:p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200 text-slate-900 dark:text-slate-100">
        
        {/* HEADER MEJA */}
        <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                🗺️ {table.name} <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">({table.status.toUpperCase()})</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STATUS GABUNGAN & TIMER MENUNGGU */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Waktu Menunggu</p>
                <p className="font-mono font-bold text-amber-700 dark:text-amber-400">18 Menit</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Jumlah Tamu</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">3 Orang (3 Seats)</p>
              </div>
            </div>
          </div>

          {/* STATUS JOIN MEJA */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
              <Link className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Status Join: <strong>Terhubung dengan Meja 05 & Meja 06</strong></span>
            </div>
            <button
              type="button"
              onClick={() => onUnjoinTable(table.id)}
              className="text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-500/15 px-2 py-1 rounded-lg border border-rose-500/30 flex items-center gap-1 active:scale-[0.97]"
            >
              <Unlink className="w-3 h-3" /> Un-Join Meja
            </button>
          </div>
        </div>

        {/* BODY: RINCIAN ITEM PER-SEAT */}
        <div className="flex-1 py-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Rincian Pesanan per-Seat / Tamu:
          </h3>

          <div className="flex flex-col gap-3">
            {mockSeats.map((seat) => (
              <div key={seat.seatNo} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Seat {seat.seatNo} — {seat.guestName}</span>
                  </div>

                  {/* TOMBOL PARTIAL SEAT CHECKOUT (Poin 5) */}
                  <button
                    type="button"
                    onClick={() => onPartialSeatCheckout(table.id, seat.seatNo)}
                    className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1 active:scale-[0.97]"
                    title="Checkout Budi / Tamu ini lebih awal tanpa menutup seluruh meja"
                  >
                    <LogOut className="w-3 h-3" /> Pulang Awal (Checkout Seat)
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 pl-1">
                  {seat.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'served' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-slate-800 dark:text-slate-300 truncate">{item.name} x{item.qty}</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-400">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER: RINGKASAN TAGIHAN & AKSI */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal Items</span>
              <span className="font-mono">Rp {totalSubtotal.toLocaleString('id-ID')}</span>
            </div>
            {prePaidCredit > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                <span>Pre-Paid Credit (Meja 05 DP)</span>
                <span className="font-mono">-Rp {prePaidCredit.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Pajak PB1 (10%)</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">Rp {pb1Tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/80 pt-1.5 mt-0.5">
              <span>Sisa Tagihan Meja:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">Rp {remainingPayable.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAddItemsToTable(table.id)}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 active:scale-[0.97]"
            >
              <Plus className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> + Tambah Menu
            </button>
            <button
              type="button"
              onClick={() => onCheckoutTable(table.id)}
              className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.97]"
            >
              <CreditCard className="w-4 h-4" /> Bayar Tagihan Meja ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
