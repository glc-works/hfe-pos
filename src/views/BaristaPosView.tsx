import React, { useState } from 'react'
import {
  Users,
  ArrowRightLeft,
  Coffee,
  Receipt,
  Zap,
  CheckCircle2,
  Banknote,
  Printer,
  BadgeCheck,
  Footprints,
  Scissors
} from 'lucide-react'
import { TableStatus, MenuItem, OrderTicket, StaffSurfaceMode, PosPayMethod } from '../types/pos'
import { TableGuestBindingDrawer } from '../components/tables/TableGuestBindingDrawer'
import { TableLiveStatusDrawer } from '../components/tables/TableLiveStatusDrawer'

export interface BaristaPosViewProps {
  activeStaffSurface: StaffSurfaceMode
  tablesGrid: TableStatus[]
  selectedPOSTable: TableStatus | null
  productCatalog: MenuItem[]
  posPayMethod: PosPayMethod
  posCashGiven: string
  cashDrawerFloat: number
  orders: OrderTicket[]
  setShowTableReassignModal: (show: boolean) => void
  setSelectedPOSTable: (table: TableStatus | null) => void
  setTablesGrid: React.Dispatch<React.SetStateAction<TableStatus[]>>
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  handlePOSCheckoutTable: () => void
  handleMoveStatus: (orderId: string, targetStatus: OrderTicket['status']) => void
}

export const BaristaPosView: React.FC<BaristaPosViewProps> = ({
  activeStaffSurface,
  tablesGrid,
  selectedPOSTable,
  productCatalog,
  posPayMethod,
  posCashGiven,
  cashDrawerFloat,
  orders,
  setShowTableReassignModal,
  setSelectedPOSTable,
  setTablesGrid,
  setPosPayMethod,
  setPosCashGiven,
  handlePOSCheckoutTable,
  handleMoveStatus
}) => {
  const [showGuestBindingDrawer, setShowGuestBindingDrawer] = useState<boolean>(false)
  const [showLiveStatusDrawer, setShowLiveStatusDrawer] = useState<boolean>(false)
  const [drawerTable, setDrawerTable] = useState<TableStatus | null>(null)

  const handleTableClick = (table: TableStatus) => {
    setSelectedPOSTable(table)
    setDrawerTable(table)
    if (table.status === 'occupied' || table.status === 'open-tab' || table.totalBill > 0) {
      setShowLiveStatusDrawer(true)
    } else {
      setShowGuestBindingDrawer(true)
    }
  }

  const handleBindGuest = (guestData: { name: string; phone?: string; type: string; savedPreferences?: string }) => {
    if (drawerTable) {
      setTablesGrid(prev => prev.map(t => t.id === drawerTable.id ? { ...t, customerName: guestData.name, status: 'occupied' } : t))
      alert(`Tamu ${guestData.name} berhasil di-bind ke meja ${drawerTable.name}!`)
    }
  }

  const matchingOrderForTable = orders.find(o => o.table === selectedPOSTable?.name)

  return (
    <>
      {/* KASIR POS WORKSTATION MAIN SURFACE */}
      {activeStaffSurface === 'barista-pos' && (
        <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> Kasir POS Workstation (General Touch POS)
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400">Monitoring status keterisian meja & Open Tab Billing</p>
              </div>
              
              <button
                onClick={() => setShowTableReassignModal(true)}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-indigo-400" /> 🔀 Reassign / Pindah Meja (Admin)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {tablesGrid.map(table => (
                <div
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`border rounded-2xl p-3 sm:p-4 flex flex-col justify-between h-28 sm:h-32 transition-all cursor-pointer relative overflow-hidden ${
                    selectedPOSTable?.id === table.id
                      ? 'ring-2 ring-indigo-500 bg-indigo-500/20 border-indigo-500'
                      : table.status === 'occupied' 
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : table.status === 'open-tab'
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`} />

                  <div className="flex items-center justify-between pl-1">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-200">{table.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      table.status === 'occupied' ? 'bg-amber-500' : table.status === 'open-tab' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                  </div>

                  <div className="pl-1">
                    {table.customerName ? (
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-300 truncate">{table.customerName}</p>
                    ) : (
                      <p className="text-[11px] text-slate-500">Kosong (Ketuk untuk Bind)</p>
                    )}
                    <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                      {table.totalBill > 0 ? `Rp ${table.totalBill.toLocaleString('id-ID')}` : 'Rp 0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Catalog Grid for Walk-In / Cashier Direct Order */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-indigo-400" /> Katalog Kasir Touchscreen (Pesanan Walk-In / Takeaway)</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">MODE STAF: SHOW SKU CODES</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {productCatalog.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (selectedPOSTable) {
                        setTablesGrid(prev => prev.map(t => t.id === selectedPOSTable.id ? { ...t, status: 'open-tab', totalBill: t.totalBill + item.price, orderCount: t.orderCount + 1 } : t))
                      }
                    }}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left p-2.5 rounded-xl flex flex-col justify-between h-24 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          {item.id}
                        </span>
                        <span className="text-[9px] font-mono text-indigo-400">{item.hfeCategoryCode}</span>
                      </div>
                      <span className="font-bold text-xs text-slate-200 line-clamp-1 mt-1">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cashier Control & Open Tab Checkout Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-400" /> Stasiun Kasir & Pelunasan Meja
                </h3>
                <button
                  onClick={() => setShowTableReassignModal(true)}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Scissors className="w-3.5 h-3.5" /> Split Payment
                </button>
              </div>

              {selectedPOSTable ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-xs font-bold text-amber-400 font-mono">{selectedPOSTable.name}</span>
                      <h4 className="text-sm font-bold text-white">{selectedPOSTable.customerName || 'Pelanggan Walk-In'}</h4>
                    </div>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {selectedPOSTable.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Jumlah Item:</span>
                    <span className="font-bold text-slate-200">{selectedPOSTable.orderCount} Items</span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>Total Tagihan Meja:</span>
                    <span className="text-amber-400 font-mono text-base">Rp {selectedPOSTable.totalBill.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[11px] text-slate-400">Metode Pembayaran Kasir:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['cash', 'qris', 'card'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPosPayMethod(method)}
                          className={`py-2 rounded-lg text-xs font-bold border uppercase transition-all ${
                            posPayMethod === method
                              ? 'bg-indigo-500 text-white border-indigo-500'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {posPayMethod === 'cash' && (
                    <div className="flex flex-col gap-2 pt-1">
                      <label className="text-[11px] text-slate-400">Uang Tunai Diterima:</label>
                      <input
                        type="text"
                        value={posCashGiven}
                        onChange={(e) => setPosCashGiven(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none font-mono"
                      />

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> Tombol Uang Cepat (Quick Cash):
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { label: 'Uang Pas', value: String(selectedPOSTable.totalBill) },
                            { label: 'Rp 20.000', value: '20000' },
                            { label: 'Rp 50.000', value: '50000' },
                            { label: 'Rp 100.000', value: '100000' }
                          ].map(qc => (
                            <button
                              key={qc.label}
                              onClick={() => setPosCashGiven(qc.value)}
                              className="bg-slate-900 hover:bg-indigo-500 hover:text-white text-slate-300 font-mono text-[10px] font-bold py-1.5 rounded-lg border border-slate-800 transition-all"
                            >
                              {qc.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-emerald-400 font-mono pt-0.5">
                        Kembalian: Rp {Math.max(0, parseInt(posCashGiven || '0') - selectedPOSTable.totalBill).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handlePOSCheckoutTable}
                    disabled={selectedPOSTable.totalBill === 0}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Pelunasan Meja ({posPayMethod.toUpperCase()})
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-8 text-center text-xs text-slate-500">
                  Pilihlah salah satu Meja di Matriks Floor Plan untuk melihat & melunasi tagihan.
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-indigo-400" /> Modal Shift Kasir (1010-Cash Drawer)
              </span>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Modal Awal:</span>
                <span className="font-mono text-slate-200">Rp {cashDrawerFloat.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Tunai Masuk:</span>
                <span className="font-mono text-emerald-400 font-bold">+Rp 1.450.000</span>
              </div>
              <button 
                onClick={() => alert('Rekonsiliasi Modal Kasir Berhasil Dicetak & Disimpan ke Hfe!')}
                className="mt-1 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Rekonsiliasi Kasir & Print Struk
              </button>
            </div>
          </div>
        </main>
      )}

      {/* CHECKER QC SURFACE */}
      {activeStaffSurface === 'checker-qc' && (
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-400" /> Mode Checker (Expeditor & Quality Control Pass)
              </h2>
              <p className="text-xs text-slate-400">Verifikasi kelengkapan nampan masakan & racikan minuman sebelum diserahkan ke Waiter/Runner</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {orders.filter(o => o.status === 'ready').map(order => (
              <div key={order.id} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-amber-400">{order.id}</span>
                    <h3 className="text-sm font-bold text-white">{order.table} • {order.customerName}</h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleMoveStatus(order.id, 'qc-passed')
                    alert(`Order ${order.id} Lolos QC Pass & Diteruskan ke Layar Waiter!`)
                  }}
                  className="w-full bg-emerald-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4" /> QC Pass & Serahkan ke Waiter ➔
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* SERVER / WAITER SURFACE */}
      {activeStaffSurface === 'server-waiter' && (
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Footprints className="w-5 h-5 text-indigo-400" /> Mode Server (Pramusaji & Food Runner Delivery)
              </h2>
              <p className="text-xs text-slate-400">Pengantaran Nampan Presisi Berdasarkan Penandaan Nomor Kursi & Profil Kontak Tamu (Seat 1-4)</p>
            </div>

            <button
              onClick={() => setShowTableReassignModal(true)}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <ArrowRightLeft className="w-4 h-4" /> 🔀 Reassign / Pindah Meja Tamu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {orders.filter(o => o.status === 'qc-passed').map(order => (
              <div key={order.id} className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-xs text-emerald-400">{order.id} • {order.table}</span>
                    <span className="text-xs font-bold text-white">{order.customerName}</span>
                  </div>

                  <div className="flex flex-col gap-2 mt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rincian Antar Kursi Meja:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{item.quantity}x {item.name}</span>
                            {item.seatNumber && (
                              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/30">
                                {item.seatNumber}
                              </span>
                            )}
                          </div>
                          {item.seatCustomerContact && (
                            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                              👤 Kontak: {item.seatCustomerContact.name} ({item.seatCustomerContact.phone})
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{item.temperature || 'Reg'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleMoveStatus(order.id, 'served')
                    alert(`Pesanan Meja ${order.table} telah selesai diantar! Profil preferensi tamu diperbarui.`)
                  }}
                  className="w-full bg-emerald-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Tandai Selesai Diantar (Served)
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Table Drawers */}
      <TableGuestBindingDrawer
        show={showGuestBindingDrawer}
        onClose={() => setShowGuestBindingDrawer(false)}
        table={drawerTable}
        onBindGuest={handleBindGuest}
      />

      <TableLiveStatusDrawer
        show={showLiveStatusDrawer}
        onClose={() => setShowLiveStatusDrawer(false)}
        table={drawerTable}
        orderTicket={matchingOrderForTable}
        onCheckoutTable={(table) => {
          setSelectedPOSTable(table)
          handlePOSCheckoutTable()
        }}
        onMoveKitchenStatus={handleMoveStatus}
      />
    </>
  )
}
