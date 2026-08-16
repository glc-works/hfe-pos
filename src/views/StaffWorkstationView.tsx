import React, { useState } from 'react'
import { Coffee, BadgeCheck, Footprints, Clock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { OrderTicket, ViewportModeType } from '../types/pos'
import { useViewport } from '../context/ViewportContext'

export interface StaffWorkstationViewProps {
  orders?: OrderTicket[]
  handleMoveStatus?: (orderId: string, targetStatus: OrderTicket['status']) => void
  activeSubRole?: 'barista' | 'checker' | 'server'
  viewportMode?: ViewportModeType
}

export const StaffWorkstationView: React.FC<StaffWorkstationViewProps> = ({
  orders = [],
  handleMoveStatus = () => {},
  activeSubRole: initialRole = 'barista',
  viewportMode = 'responsive'
}) => {
  const { isMobile: isContextMobile } = useViewport()
  const isMobile = viewportMode === 'mobile' || isContextMobile
  const [activeRole, setActiveRole] = useState<'barista' | 'checker' | 'server'>(initialRole)
  const [filterQuery, setFilterQuery] = useState<string>('')

  // Filter orders by role context
  const baristaOrders = orders.filter(o => o.status === 'placed' || o.status === 'processing')
  const checkerOrders = orders.filter(o => o.status === 'processing' || o.status === 'ready')
  const serverOrders = orders.filter(o => o.status === 'ready' || o.status === 'qc-passed' || o.status === 'served')

  return (
    <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-5">
      {/* CONSOLIDATED HEADER & ROLE SELECTOR */}
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between gap-4 shadow-xl ${
        isMobile ? 'flex-col items-stretch' : 'flex-col sm:flex-row items-start sm:items-center'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {activeRole === 'barista' && <Coffee className="w-6 h-6" />}
            {activeRole === 'checker' && <BadgeCheck className="w-6 h-6" />}
            {activeRole === 'server' && <Footprints className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Workstation Staf Terpadu (Unified Staff Surface)
            </h1>
            <p className="text-xs text-slate-400">
              {activeRole === 'barista' && 'Barista Touch: Queue Pembuatan Minuman & Brewing'}
              {activeRole === 'checker' && 'Checker QC: Inspeksi Kualitas & Kelengkapan Piring'}
              {activeRole === 'server' && 'Server / Waiter: Pengantaran Hidangan Meja real-time'}
            </p>
          </div>
        </div>

        {/* ROLE TABS */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveRole('barista')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'barista' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" /> ☕ Barista
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('checker')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'checker' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" /> 🛡️ Checker QC
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('server')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'server' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" /> 🏃 Server Waiter
          </button>
        </div>
      </div>

      {/* BARISTA WORKSTATION VIEW */}
      {activeRole === 'barista' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
              <Coffee className="w-4 h-4" /> Antrean Pesanan Minuman Barista ({baristaOrders.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Target Waktu Espresso & Handbrew &lt; 4 Min</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {baristaOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-amber-400 text-xs">{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{order.table} • {order.customerName}</span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="font-bold text-white">{item.quantity}x {item.name}</span>
                      <span className="text-[10px] font-mono text-indigo-400">{item.category}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveStatus(order.id, 'processing')}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Start Espresso Extraction ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHECKER QC WORKSTATION VIEW */}
      {activeRole === 'checker' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" /> Tiket Lolos Quality Control ({checkerOrders.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Pemeriksaan Suhu & Kelengkapan Garnish</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkerOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-amber-400 text-xs">{order.id}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    QC Inspection Required
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs text-slate-300 font-semibold">{order.table} • {order.customerName}</p>
                  <div className="text-[11px] text-slate-400">Total Item: {order.items.length} piring/gelas</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveStatus(order.id, 'ready')}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass QC & Loloskan ke Server ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVER WAITER WORKSTATION VIEW */}
      {activeRole === 'server' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Footprints className="w-4 h-4" /> Antrean Pengantaran Meja Waiter ({serverOrders.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Kirim langsung ke Meja Pelanggan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serverOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 min-w-0">
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">{order.id}</span>
                  <span className="text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                    {order.table}
                  </span>
                </div>

                <div className="space-y-1 text-xs min-w-0">
                  <p className="text-white font-bold truncate">{order.customerName}</p>
                  <p className="text-slate-400 text-[11px] truncate">Status: Ready to serve</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveStatus(order.id, 'served')}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Konfirmasi Terlayani di Meja
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
