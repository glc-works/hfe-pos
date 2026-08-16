import React from 'react'
import { Users, ArrowRightLeft } from 'lucide-react'
import { TableStatus } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface PosTableFloorPlanSectionProps {
  tablesGrid: TableStatus[]
  filteredTablesGrid: TableStatus[]
  selectedPOSTable: TableStatus | null
  tableStatusFilter: 'all' | 'unpaid' | 'paid' | 'available'
  unpaidCount: number
  paidCount: number
  availableCount: number
  isMobile: boolean
  setTableStatusFilter: (filter: 'all' | 'unpaid' | 'paid' | 'available') => void
  handleTableClick: (table: TableStatus) => void
  onOpenTableOpsModal: () => void
}

export const PosTableFloorPlanSection: React.FC<PosTableFloorPlanSectionProps> = ({
  tablesGrid,
  filteredTablesGrid,
  selectedPOSTable,
  tableStatusFilter,
  unpaidCount,
  paidCount,
  availableCount,
  isMobile,
  setTableStatusFilter,
  handleTableClick,
  onOpenTableOpsModal
}) => {
  const { t, formatPrice } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">

      {/* 1-TAP TABLE STATUS QUICK FILTERS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pr-8">
        <button
          type="button"
          onClick={() => setTableStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
            tableStatusFilter === 'all'
              ? 'bg-white text-slate-950 font-black shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Semua ({tablesGrid.length})
        </button>
        <button
          type="button"
          onClick={() => setTableStatusFilter('unpaid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
            tableStatusFilter === 'unpaid'
              ? 'bg-amber-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50'
          }`}
        >
          <span>⏳ Tagihan</span>
          <span className="bg-amber-400/30 text-slate-950 px-1.5 py-0.2 rounded-full font-mono text-[10px] font-black">{unpaidCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setTableStatusFilter('paid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
            tableStatusFilter === 'paid'
              ? 'bg-indigo-500 text-white font-black shadow'
              : 'bg-slate-900 border border-slate-800 text-indigo-300 hover:border-indigo-500/50'
          }`}
        >
          <span>✅ Lunas</span>
          <span className="bg-indigo-400/30 text-white px-1.5 py-0.2 rounded-full font-mono text-[10px] font-black">{paidCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setTableStatusFilter('available')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
            tableStatusFilter === 'available'
              ? 'bg-emerald-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/50'
          }`}
        >
          <span>🟢 Kosong</span>
          <span className="bg-emerald-400/30 text-slate-950 px-1.5 py-0.2 rounded-full font-mono text-[10px] font-black">{availableCount}</span>
        </button>
      </div>

      {/* TABLE CARDS WITH HIGH-CONTRAST PAYMENT STATUS BADGES & RUNWAY BUFFER */}
      <div className={`grid gap-2.5 sm:gap-3 pb-32 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {filteredTablesGrid.map((table) => {
          const isUnpaid = (table.status === 'open-tab' || table.status === 'occupied') && table.totalBill > 0
          const isPaid = table.customerName?.includes('(Lunas)') || (table.status === 'occupied' && table.totalBill === 0)
          const isAvailable = table.status === 'free'

          return (
            <div
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`border rounded-2xl p-3 flex flex-col justify-between h-32 transition-all cursor-pointer relative overflow-hidden ${
                selectedPOSTable?.id === table.id
                  ? 'ring-2 ring-indigo-500 bg-indigo-500/20 border-indigo-500 shadow-lg'
                  : isUnpaid
                  ? 'bg-amber-500/10 border-amber-500/60 hover:border-amber-400'
                  : isPaid
                  ? 'bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* LEFT ACCENT STRIP */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                isUnpaid ? 'bg-amber-500' : isPaid ? 'bg-indigo-500' : 'bg-emerald-500'
              }`} />

              {/* TOP: TABLE NAME & STATUS BADGE (STRICT SINGLE LINE NO OVERLAP) */}
              <div className="flex items-center justify-between gap-1.5 pl-1 min-w-0">
                <span className="font-mono font-extrabold text-xs text-white truncate min-w-0">
                  {table.name}
                </span>
                {isUnpaid ? (
                  <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 shadow-sm">
                    ⏳ Tagihan
                  </span>
                ) : isPaid ? (
                  <span className="text-[9px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 shadow-sm">
                    ✅ Lunas
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 border border-emerald-500/30">
                    🟢 Kosong
                  </span>
                )}
              </div>

              {/* BOTTOM: GUEST INFO & BILL AMOUNT */}
              <div className="pl-1 flex flex-col gap-0.5">
                <p className="text-slate-300 text-xs font-semibold truncate">
                  {table.customerName || (isAvailable ? 'Siap Sambut Tamu' : 'Tamu Walk-In')}
                </p>
                <p className={`font-mono text-xs font-black ${
                  isUnpaid ? 'text-amber-400' : isPaid ? 'text-indigo-300' : 'text-slate-500'
                }`}>
                  {table.totalBill > 0 ? formatPrice(table.totalBill) : (isPaid ? 'Rp 0 (PAID)' : 'Rp 0')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
