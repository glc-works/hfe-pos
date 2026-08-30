import React, { useState } from 'react'
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
  ChefHat,
  CheckCircle2,
  Clock,
  Flame,
  Utensils,
  BadgeCheck,
  Footprints
} from 'lucide-react'
import { OrderTicket, StationConfig, KdsViewModeType, MenuItem, ViewportModeType } from '../types/pos'
import { FineDiningCourseMatrix, TableCourseOrder } from '../components/kds/FineDiningCourseMatrix'
import { useViewport } from '../context/ViewportContext'

const DEFAULT_FINE_DINING_ORDERS: TableCourseOrder[] = [
  {
    id: 'FD-101',
    tableNumber: 'VIP Table 01',
    guestName: 'Drs. H. Bambang Soeprapto',
    menuType: '7-Course',
    currentCourseIndex: 1,
    courses: [
      { number: 1, name: 'Amuse-Bouche', dishes: ['Hokkaido Scallop Tartare & Caviar'], status: 'Served' },
      { number: 2, name: 'Appetizer', dishes: ['Pan-Seared Foie Gras & Fig Reduction'], status: 'Fired', firedAt: '20:15 WIB' },
      { number: 3, name: 'Soup', dishes: ['Truffle Consommé Celestine'], status: 'Holding' },
      { number: 4, name: 'Palate Cleanser', dishes: ['Champagne & Yuzu Granita'], status: 'Holding' },
      { number: 5, name: 'Main Course', dishes: ['A5 Miyazaki Wagyu Tenderloin Rossini'], status: 'Holding' },
      { number: 6, name: 'Dessert', dishes: ['Valrhona Dark Chocolate Sphere'], status: 'Holding' },
      { number: 7, name: 'Mignardises', dishes: ['Artisan Macarons & Geisha Pour Over'], status: 'Holding' }
    ]
  },
  {
    id: 'FD-104',
    tableNumber: 'Chef Table 04',
    guestName: 'Madame Veronica Tan',
    menuType: '5-Course',
    currentCourseIndex: 2,
    courses: [
      { number: 1, name: 'Amuse-Bouche', dishes: ['King Crab Tartlet with Finger Lime'], status: 'Served' },
      { number: 2, name: 'Appetizer', dishes: ['Smoked Duck Breast Carpaccio'], status: 'Served' },
      { number: 3, name: 'Main Course', dishes: ['Patagonian Toothfish in Saffron Emulsion'], status: 'Fired', firedAt: '20:20 WIB' },
      { number: 4, name: 'Pre-Dessert', dishes: ['Wild Berry Sorbet'], status: 'Holding' },
      { number: 5, name: 'Grand Dessert', dishes: ['Madagascar Vanilla Souffle'], status: 'Holding' }
    ]
  }
]

export interface UnifiedKdsViewProps {
  stations?: StationConfig[]
  activeStationId?: string
  setActiveStationId?: (id: string) => void
  setActiveStaffSurface?: (surface: any) => void
  kdsViewMode?: KdsViewModeType
  setKdsViewMode?: (mode: KdsViewModeType) => void
  kdsSortBy?: 'time-desc' | 'time-asc' | 'category'
  setKdsSortBy?: (sort: 'time-desc' | 'time-asc' | 'category') => void
  orders?: OrderTicket[]
  setSelectedRecipeBOM?: (item: MenuItem | null) => void
  handleMoveStatus?: (orderId: string, targetStatus: OrderTicket['status']) => void
  initialFineDiningMode?: boolean
  enableCourseFiring?: boolean
  viewportMode?: ViewportModeType
}

export const UnifiedKdsView: React.FC<UnifiedKdsViewProps> = ({
  stations = [
    { id: 'all', name: 'Semua Station', icon: '🍳', categories: [] },
    { id: 'st-barista', name: 'Barista Station', icon: '☕', categories: ['Coffee', 'Non-Coffee'] },
    { id: 'st-kitchen', name: 'Kitchen Station', icon: '🍔', categories: ['Snack', 'Pastry', 'Food'] },
    { id: 'st-retail', name: 'Retail Station', icon: '🛍️', categories: ['Retail', 'Merchandise'] }
  ],
  activeStationId = 'all',
  setActiveStationId = () => {},
  setActiveStaffSurface = () => {},
  kdsViewMode = 'workorder',
  setKdsViewMode = () => {},
  kdsSortBy = 'time-desc',
  setKdsSortBy = () => {},
  orders = [],
  setSelectedRecipeBOM = () => {},
  handleMoveStatus = () => {},
  initialFineDiningMode = false,
  viewportMode = 'responsive'
}) => {
  const { isMobile: isContextMobile } = useViewport()
  const isMobile = viewportMode === 'mobile' || isContextMobile
  const [isFineDiningActive, setIsFineDiningActive] = useState<boolean>(initialFineDiningMode)
  const [courseOrders, setCourseOrders] = useState<TableCourseOrder[]>(DEFAULT_FINE_DINING_ORDERS)

  const currentStation = stations.find(s => s.id === activeStationId) || stations[0]

  const stationFilteredOrders = orders.map(order => {
    if (activeStationId === 'all') return order
    const filteredItems = order.items.filter(item => {
      if (item.kdsStation) {
        return item.kdsStation === currentStation.id || item.kdsStation === currentStation.name
      }
      return currentStation.categories.includes(item.category)
    })
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
    <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
      {/* UNIFIED HEADER & MODE TOGGLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isFineDiningActive ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
            {isFineDiningActive ? <Flame className="w-6 h-6 animate-pulse" /> : <ChefHat className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Unified Kitchen Display System (KDS)
              {isFineDiningActive && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-full">
                  Fine Dining Mode
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              {isFineDiningActive
                ? 'Manajemen Chef Course Firing & Pacing Hidangan Tasting Menu'
                : 'Kanban, Work Order & Station Filtering Realtime Dapur & Barista'}
            </p>
          </div>
        </div>

        {/* MODE SWITCHER TAB */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar gap-1">
          <button
            type="button"
            onClick={() => setIsFineDiningActive(false)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${
              !isFineDiningActive ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Dapur Regular
          </button>
          <button
            type="button"
            onClick={() => setIsFineDiningActive(true)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${
              isFineDiningActive ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Chef Course Firing
          </button>
          <button
            type="button"
            onClick={() => setActiveStaffSurface('checker-qc')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-teal-300 hover:bg-slate-850 transition-all touch-manipulation cursor-pointer"
          >
            <BadgeCheck className="w-3.5 h-3.5 text-teal-400" /> Checker QC
          </button>
          <button
            type="button"
            onClick={() => setActiveStaffSurface('server-waiter')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-purple-300 hover:bg-slate-850 transition-all touch-manipulation cursor-pointer"
          >
            <Footprints className="w-3.5 h-3.5 text-purple-400" /> Server Runner
          </button>
        </div>
      </div>

      {/* FINE DINING COURSE FIRING MATRIX OR REGULAR KDS */}
      {isFineDiningActive ? (
        <FineDiningCourseMatrix courseOrders={courseOrders} setCourseOrders={setCourseOrders} />
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" /> Kitchen Stations
              </h2>
              <button
                onClick={() => setActiveStaffSurface('cafe-config')}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-400" /> Station Config
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

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">Station: {currentStation.name}</span>
              <p className="text-[11px] sm:text-xs text-slate-400">Pilih Mode Tampilan Dapur & Barista</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setKdsViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    kdsViewMode === 'kanban' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📋 Kanban
                </button>

                <button
                  onClick={() => setKdsViewMode('workorder')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    kdsViewMode === 'workorder' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📄 Work Order List
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

          {/* WORK ORDER VIEW */}
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

                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><ClipboardList className="w-4 h-4 text-amber-500" /> Work Order Items:</span>
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
                                <Contact className="w-3 h-3 text-emerald-400" /> Tamu: {item.seatCustomerContact.name} ({item.seatCustomerContact.savedPreferences})
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => setSelectedRecipeBOM(item)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3 text-indigo-400" /> Detail SOP
                          </button>
                        </div>

                        {item.bomIngredients && (
                          <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5 flex flex-col gap-1.5 text-[11px]">
                            <span className="font-semibold text-slate-400 flex items-center justify-between text-[10px]">
                              <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-amber-500" /> BOM Komposisi:</span>
                            </span>
                            {item.bomIngredients.map((ing, ingIdx) => (
                              <div key={ingIdx} className="flex items-center justify-between text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80">
                                <span>{ing.name}</span>
                                <span className="font-mono font-bold text-amber-400 text-xs">{ing.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => handleMoveStatus(order.id, 'processing')}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        <ChefHat className="w-4 h-4" /> Mulai Kerjakan ➔
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleMoveStatus(order.id, 'ready')}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Selesai ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* KANBAN BOARD VIEW */}
          {kdsViewMode === 'kanban' && (
            <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Clock className="w-4 h-4 text-amber-500" /> Incoming ({placedOrders.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {placedOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-mono font-black text-xs text-amber-400">{order.id}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">{order.timeElapsedMinutes}m ago</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{order.table} • {order.customerName}</h4>
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

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ChefHat className="w-4 h-4 text-indigo-500" /> In Progress ({processingOrders.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {processingOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <span className="font-mono font-black text-xs text-indigo-400">{order.id} • {order.table}</span>
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

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ready ({readyOrders.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {readyOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
                      <span className="font-mono font-black text-xs text-emerald-400">{order.id} • {order.table}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {kdsViewMode === 'list' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl overflow-x-auto">
              <div className="grid grid-cols-5 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 px-3 min-w-[500px]">
                <span>ID Tiket</span>
                <span>Meja / Customer</span>
                <span>Durasi</span>
                <span>Status</span>
                <span className="text-right">Aksi</span>
              </div>
              <div className="flex flex-col gap-2 divide-y divide-slate-800/60 min-w-[500px]">
                {sortedOrders.map(order => (
                  <div key={order.id} className="pt-2 first:pt-0 grid grid-cols-5 items-center text-xs px-3">
                    <span className="font-mono font-bold text-amber-400">{order.id}</span>
                    <span className="font-bold text-white">{order.table} ({order.customerName})</span>
                    <span className="font-mono text-slate-300">{order.timeElapsedMinutes} m</span>
                    <span className="text-amber-400 font-bold uppercase">{order.status}</span>
                    <div className="text-right">
                      {order.status === 'placed' && (
                        <button onClick={() => handleMoveStatus(order.id, 'processing')} className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg">Proses</button>
                      )}
                      {order.status === 'processing' && (
                        <button onClick={() => handleMoveStatus(order.id, 'ready')} className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg">Selesai</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
