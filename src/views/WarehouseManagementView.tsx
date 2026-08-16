import React, { useState } from 'react'
import {
  Warehouse,
  PackagePlus,
  ArrowLeftRight,
  Trash2,
  ScanBarcode,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { useWarehouse } from '../hooks/useWarehouse'
import { GoodsReceivingModal } from '../components/warehouse/GoodsReceivingModal'
import { StockTransferModal } from '../components/warehouse/StockTransferModal'
import { WasteAdjustmentModal } from '../components/warehouse/WasteAdjustmentModal'

export interface WarehouseManagementViewProps {
  bookId?: string
}

export const WarehouseManagementView: React.FC<WarehouseManagementViewProps> = ({
  bookId = 'BOOK-CAFE-HQ-88',
}) => {
  const {
    activeWarehouseId,
    setActiveWarehouseId,
    activeWarehouse,
    warehouses,
    stockItems,
    allStockItems,
    transferRequests,
    wasteAdjustments,
    receivingLogs,
    isReceivingModalOpen,
    setIsReceivingModalOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isWasteModalOpen,
    setIsWasteModalOpen,
    handleReceiveGoods,
    handleTransferStock,
    updateTransferStatus,
    handleAdjustWaste,
  } = useWarehouse(bookId)

  const [searchTerm, setSearchTerm] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers' | 'receiving' | 'waste'>('inventory')

  const filteredItems = stockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm)
  )

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput) return
    setSearchTerm(barcodeInput)
    setBarcodeInput('')
  }

  const formatIdr = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* View Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-600 text-white rounded-xl shadow-xs">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Manajemen Gudang & Stok Multi-Lokasi</h1>
            <p className="text-xs text-slate-500">Penerimaan barang, transfer internal, dan penyesuaian waste</p>
          </div>
        </div>

        {/* Location Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Pilih Gudang:</label>
          <select
            value={activeWarehouseId}
            onChange={(e) => setActiveWarehouseId(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
          >
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Lokasi Aktif</p>
          <h3 className="text-lg font-bold text-slate-800 mt-1">{activeWarehouse.name}</h3>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {activeWarehouse.code}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Item SKU</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{stockItems.length} SKU</h3>
          <p className="text-xs text-slate-400 mt-1">Terdaftar di gudang ini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Valuasi Stok</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{formatIdr(activeWarehouse.totalValuationIdr)}</h3>
          <p className="text-xs text-slate-400 mt-1">Berdasarkan HPP/unit cost</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Transfer Dalam Perjalanan</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">
            {transferRequests.filter((t) => t.status === 'in_transit').length} Mutasi
          </h3>
          <p className="text-xs text-slate-400 mt-1">Pending dikonfirmasi</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReceivingModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Penerimaan Barang</span>
          </button>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Stok</span>
          </button>
          <button
            onClick={() => setIsWasteModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Catat Waste</span>
          </button>
        </div>

        {/* Barcode Quick Search / Scanner */}
        <form onSubmit={handleBarcodeScan} className="flex items-center space-x-2">
          <div className="relative">
            <ScanBarcode className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan Barcode / SKU..."
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'inventory' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Daftar Stok Inventaris ({filteredItems.length})
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'transfers' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Log Transfer Stok ({transferRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('receiving')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'receiving' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Riwayat Penerimaan ({receivingLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('waste')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'waste' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Jurnal Waste ({wasteAdjustments.length})
          </button>
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter nama item / SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                    <th className="py-3 px-4 text-center">Min. Stok</th>
                    <th className="py-3 px-4 text-right">Cost/Unit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.sku} | Barcode: {item.barcode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatIdr(item.unitCost)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'in_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Aman
                          </span>
                        )}
                        {item.status === 'low_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            Warning
                          </span>
                        )}
                        {item.status === 'out_of_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Habis
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada data item stok yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Transfers List */}
        {activeTab === 'transfers' && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">ID Mutasi</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Asal ➔ Tujuan</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Konfirmasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transferRequests.map((trf) => (
                  <tr key={trf.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{trf.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{trf.itemName}</div>
                      <div className="text-[11px] text-slate-400">{trf.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {trf.sourceWarehouseId} ➔ {trf.destinationWarehouseId}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{trf.qty}</td>
                    <td className="py-3 px-4 text-center">
                      {trf.status === 'requested' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          Requested
                        </span>
                      )}
                      {trf.status === 'in_transit' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          In Transit
                        </span>
                      )}
                      {trf.status === 'received' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Received
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {trf.status === 'in_transit' && (
                        <button
                          onClick={() => updateTransferStatus(trf.id, 'received')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Konfirmasi Diterima</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Receiving Logs */}
        {activeTab === 'receiving' && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">ID Receiving</th>
                  <th className="py-3 px-4">Item & Batch</th>
                  <th className="py-3 px-4">Gudang</th>
                  <th className="py-3 px-4 text-center">Qty Diterima</th>
                  <th className="py-3 px-4">PO Supplier</th>
                  <th className="py-3 px-4">Kadaluarsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {receivingLogs.map((rec) => (
                  <tr key={rec.id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{rec.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{rec.itemName}</div>
                      <div className="text-[11px] text-slate-400">Batch: {rec.batchNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{rec.warehouseId}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{rec.qty}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{rec.supplierPoNumber}</td>
                    <td className="py-3 px-4 text-slate-500">{rec.expiryDate || '-'}</td>
                  </tr>
                ))}
                {receivingLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      Belum ada riwayat penerimaan barang baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Waste Journal */}
        {activeTab === 'waste' && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">ID Waste</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Alasan & Jurnal</th>
                  <th className="py-3 px-4 text-center">Qty Waste</th>
                  <th className="py-3 px-4 text-right">Nilai Beban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {wasteAdjustments.map((wst) => (
                  <tr key={wst.id}>
                    <td className="py-3 px-4 font-mono font-bold text-red-600">{wst.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{wst.itemName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700">{wst.reason}</div>
                      <div className="text-[11px] text-slate-400 font-mono">GL: {wst.expenseGlAccount}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-red-600">{wst.qty}</td>
                    <td className="py-3 px-4 text-right font-bold text-red-700">
                      {formatIdr(wst.expenseAmountIdr)}
                    </td>
                  </tr>
                ))}
                {wasteAdjustments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Belum ada pencatatan waste/spoilage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoodsReceivingModal
        isOpen={isReceivingModalOpen}
        onClose={() => setIsReceivingModalOpen(false)}
        onReceive={handleReceiveGoods}
        stockItems={allStockItems}
        warehouses={warehouses}
        currentWarehouseId={activeWarehouseId}
      />

      <StockTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransferStock}
        stockItems={stockItems}
        warehouses={warehouses}
        currentWarehouseId={activeWarehouseId}
      />

      <WasteAdjustmentModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
        onAdjust={handleAdjustWaste}
        stockItems={stockItems}
        warehouses={warehouses}
        currentWarehouseId={activeWarehouseId}
      />
    </div>
  )
}
