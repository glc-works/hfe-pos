import React from 'react'
import {
  Filter,
  Settings,
  ClipboardList,
  Kanban,
  List,
  SlidersHorizontal,
  Contact,
  BookOpen,
  Layers,
  AlertTriangle,
  ChefHat,
  CheckCircle2,
  Printer,
  Clock
} from 'lucide-react'
import { OrderTicket, StationConfig, KdsViewModeType, MenuItem } from '../types/pos'

export interface KdsKanbanViewProps {
  stations: StationConfig[]
  activeStationId: string
  setActiveStationId: (id: string) => void
  setActiveStaffSurface: (surface: any) => void
  kdsViewMode: KdsViewModeType
  setKdsViewMode: (mode: KdsViewModeType) => void
  kdsSortBy: 'time-desc' | 'time-asc' | 'category'
  setKdsSortBy: (sort: 'time-desc' | 'time-asc' | 'category') => void
  orders: OrderTicket[]
  setSelectedRecipeBOM: (item: MenuItem | null) => void
  handleMoveStatus: (orderId: string, targetStatus: OrderTicket['status']) => void
}

export const KdsKanbanView: React.FC<KdsKanbanViewProps> = ({
  stations,
  activeStationId,
  setActiveStationId,
  setActiveStaffSurface,
  kdsViewMode,
  setKdsViewMode,
  kdsSortBy,
  setKdsSortBy,
  orders,
  setSelectedRecipeBOM,
  handleMoveStatus
}) => {
  const currentStation = stations.find(s => s.id === activeStationId) || stations[0]

  const stationFilteredOrders = orders.map(order => {
    if (activeStationId === 'all') return order
    const filteredItems = order.items.filter(item => currentStation.categories.includes(item.category))
    if (filteredItems.length === 0) return null
    return { ...order, items: filteredItems }
  }).filter(Boolean) as OrderTicket[]

  const sortedOrders = [...stationFilteredOrders].sort((a, b) => {
    if (kdsSortBy === 'time-desc') return b.timeElapsedMinutes - a.timeElapsedMinutes
    if (kdsSortBy === 'time-asc') return a.timeElapsedMinutes - b.timeElapsedMinutes
    return a.items[0]?.category.localeCompare(b.items[0]?.category || '') || 0
  })

  const placedOrders = sortedOrders.filter(o => o.status === 'placed')
  const processingOrders = sortedOrders.filter(o => o.status === 'processing')
  const readyOrders = sortedOrders.filter(o => o.status === 'ready' || o.status === 'qc-passed')

  return (
    <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
      {/* STATION FILTER HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Kitchen Stations (Split Screen Mode)
          </h2>

          <button
            onClick={() => setActiveStaffSurface('cafe-config')}
            className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" /> Setting Station (Owner Portal)
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stations.map(station => (
            <button
              key={station.id}
              onClick={() => setActiveStationId(station.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeStationId === station.id
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{station.icon}</span>
              <span>{station.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KDS CONTROLS: 3 VIEW MODES SWITCHER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">Station Aktif: {currentStation.name}</span>
          <p className="text-[11px] sm:text-xs text-slate-400">Pilih Mode Tampilan Layar Dapur & Barista</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setKdsViewMode('workorder')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                kdsViewMode === 'workorder' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" /> Mode Work Order (BOM & SOP)
            </button>

            <button
              onClick={() => setKdsViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                kdsViewMode === 'kanban' ? 'bg-indigo-500 text-white font-bold shadow' : 'text-slate-400'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>

            <button
              onClick={() => setKdsViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                kdsViewMode === 'list' ? 'bg-indigo-500 text-white font-bold shadow' : 'text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
            <select
              value={kdsSortBy}
              onChange={(e) => setKdsSortBy(e.target.value as any)}
              className="bg-transparent text-indigo-400 font-bold focus:outline-none text-xs"
            >
              <option value="time-desc">Terlama (Priority)</option>
              <option value="time-asc">Terbaru</option>
              <option value="category">Kategori</option>
            </select>
          </div>
        </div>
      </div>

      {/* MODE 1: WORK ORDER VIEW WITH SEAT-LEVEL CONTACT PROFILING */}
      {kdsViewMode === 'workorder' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {sortedOrders.map(order => (
            <div key={order.id} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-amber-400">{order.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      order.status === 'placed' 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : order.status === 'processing'
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{order.table} • {order.customerName}</h3>
                </div>

                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {order.createdAt} ({order.timeElapsedMinutes}m ago)
                </span>
              </div>

              {/* Item Work Orders */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><ClipboardList className="w-4 h-4 text-amber-500" /> Lembar Kerja Fabrikasi (Work Order):</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">SEAT CONTACT BOUND</span>
                </span>

                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {item.id}
                          </span>
                          {item.quantity}x {item.name}
                          {item.seatNumber && (
                            <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                              {item.seatNumber}
                            </span>
                          )}
                        </h4>

                        {item.seatCustomerContact && (
                          <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                            <Contact className="w-3 h-3 text-emerald-400" /> Tamu Ter-profil: {item.seatCustomerContact.name} ({item.seatCustomerContact.savedPreferences})
                          </div>
                        )}

                        {item.temperature && (
                          <p className="text-[10px] text-amber-400 font-medium mt-0.5">
                            {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setSelectedRecipeBOM(item)}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3 text-indigo-400" /> Detail SOP
                      </button>
                    </div>

                    {/* BOM Ingredients Breakdown */}
                    {item.bomIngredients && (
                      <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5 flex flex-col gap-1.5 text-[11px]">
                        <span className="font-semibold text-slate-400 flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-amber-500" /> Komposisi Bahan Baku (BOM):</span>
                          <span className="text-[9px] font-mono text-emerald-400">Inventory Sync</span>
                        </span>
                        {item.bomIngredients.map((ing, ingIdx) => (
                          <div key={ingIdx} className="flex items-center justify-between text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                                {ing.itemCode}
                              </span>
                              <span>{ing.name}</span>
                            </div>
                            <span className="font-mono font-bold text-amber-400 text-xs">{ing.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.allergenNotes && (
                      <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3 text-rose-500" /> Allergen Note: {item.allergenNotes}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                {order.status === 'placed' && (
                  <button
                    onClick={() => handleMoveStatus(order.id, 'processing')}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <ChefHat className="w-4 h-4" /> Mulai Kerjakan Work Order ➔
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleMoveStatus(order.id, 'ready')}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Selesai Kerjakan & Kirim ke Checker ➔
                  </button>
                )}
                {(order.status === 'ready' || order.status === 'qc-passed') && (
                  <button
                    onClick={() => alert(`Struk Work Order ${order.id} dicetak!`)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Print Tiket Work Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: KANBAN BOARD */}
      {kdsViewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* INCOMING */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-amber-500" /> 1. Incoming ({placedOrders.length})
            </h3>
            <div className="flex flex-col gap-3">
              {placedOrders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div>
                      <span className="font-mono font-black text-xs text-amber-400">{order.id}</span>
                      <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {order.timeElapsedMinutes}m ago
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                        <span className="text-[9px] font-mono text-amber-400 font-bold">{item.id}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleMoveStatus(order.id, 'processing')}
                    className="w-full bg-amber-500 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                  >
                    <ChefHat className="w-4 h-4" /> Proses Pesanan ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <ChefHat className="w-4 h-4 text-indigo-500" /> 2. In Progress ({processingOrders.length})
            </h3>
            <div className="flex flex-col gap-3">
              {processingOrders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-mono font-black text-xs text-indigo-400">{order.id}</span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">{order.timeElapsedMinutes}m active</span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} onClick={() => setSelectedRecipeBOM(item)} className="bg-slate-900/80 p-2 rounded-lg cursor-pointer flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                        <span className="text-[9px] font-mono text-amber-400 font-bold">{item.id}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleMoveStatus(order.id, 'ready')}
                    className="w-full bg-emerald-500 text-slate-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow"
                  >
                    Kirim ke Checker (QC) ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* READY */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3. Ready ({readyOrders.length})
            </h3>
            <div className="flex flex-col gap-3">
              {readyOrders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                  <span className="font-mono font-black text-xs text-emerald-400">{order.id} • {order.table}</span>
                  <button
                    onClick={() => alert(`Struk ${order.id} dicetak!`)}
                    className="w-full bg-slate-800 text-slate-200 text-xs font-bold py-2 rounded-lg border border-slate-700"
                  >
                    Print Struk Dapur
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: LIST VIEW */}
      {kdsViewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl overflow-x-auto">
          <div className="grid grid-cols-6 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 px-3 min-w-[600px]">
            <span>ID Tiket</span>
            <span>Meja / Customer</span>
            <span>Item Pesanan</span>
            <span>Durasi Antre</span>
            <span>Status KDS</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="flex flex-col gap-2 divide-y divide-slate-800/60 min-w-[600px]">
            {sortedOrders.map(order => (
              <div key={order.id} className="pt-2 first:pt-0 grid grid-cols-6 items-center text-xs px-3">
                <span className="font-mono font-bold text-amber-400">{order.id}</span>
                <div>
                  <p className="font-bold text-white">{order.table}</p>
                  <p className="text-[11px] text-slate-400">{order.customerName}</p>
                </div>

                <div className="flex flex-col gap-1">
                  {order.items.map((item, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => setSelectedRecipeBOM(item)}
                      className="font-semibold text-slate-200 hover:text-amber-400 cursor-pointer flex items-center gap-1"
                    >
                      [{item.id}] {item.quantity}x {item.name} <BookOpen className="w-3 h-3 text-amber-500 inline" />
                    </span>
                  ))}
                </div>

                <span className="font-mono text-slate-300">{order.timeElapsedMinutes} menit</span>

                <div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    order.status === 'placed' 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : order.status === 'processing'
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  {order.status === 'placed' && (
                    <button
                      onClick={() => handleMoveStatus(order.id, 'processing')}
                      className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      Proses ➔
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleMoveStatus(order.id, 'ready')}
                      className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      Selesai ➔
                    </button>
                  )}
                  {(order.status === 'ready' || order.status === 'qc-passed') && (
                    <button
                      onClick={() => alert(`Struk ${order.id} dicetak!`)}
                      className="bg-slate-800 text-slate-200 font-bold px-3 py-1 rounded-lg text-xs border border-slate-700"
                    >
                      Print Struk
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
