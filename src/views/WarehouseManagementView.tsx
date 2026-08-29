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
import { VendorDirectoryTab, PurchaseOrderRecord } from '../components/warehouse/VendorDirectoryTab'

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
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers' | 'receiving' | 'waste' | 'vendors'>('inventory')
  const [prefillPo, setPrefillPo] = useState<PurchaseOrderRecord | undefined>(undefined)

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
    <div className="p-4 sm:p-6 bg-background text-foreground min-h-screen space-y-6">
      {/* View Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-xs">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Manajemen Gudang & Stok Multi-Lokasi</h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[10px] font-bold">
                SOP-LOG-01
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Penerimaan barang supplier, transfer antar cabang & penyesuaian waste</p>
          </div>
        </div>

        {/* Location Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Pilih Gudang:</label>
          <select
            value={activeWarehouseId}
            onChange={(e) => setActiveWarehouseId(e.target.value)}
            className="bg-background border border-border text-foreground text-sm font-semibold rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
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
        <div className="bg-card p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground">Lokasi Aktif</p>
          <h3 className="text-base font-bold text-foreground mt-0.5">{activeWarehouse.name}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">{activeWarehouse.code}</span>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground">Total Item SKU</p>
          <h3 className="text-xl font-black text-foreground mt-0.5">{stockItems.length} SKU</h3>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground">Valuasi Stok</p>
          <h3 className="text-lg font-black text-emerald-500 mt-0.5">{formatIdr(activeWarehouse.totalValuationIdr)}</h3>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground">Transfer Dalam Perjalanan</p>
          <h3 className="text-xl font-black text-blue-500 mt-0.5">{transferRequests.filter((t) => t.status === 'in_transit').length} Mutasi</h3>
        </div>
      </div>

      {/* Action Toolbar with Form SOP Badges */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsReceivingModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Terima Barang</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Cabang</span>
          </button>
          <button
            type="button"
            onClick={() => setIsWasteModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Catat Waste</span>
          </button>
        </div>

        {/* Barcode Quick Search / Scanner */}
        <form onSubmit={handleBarcodeScan} className="flex items-center space-x-2">
          <div className="relative">
            <ScanBarcode className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan Barcode / SKU..."
              className="pl-9 pr-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="flex border-b border-border bg-muted/30 px-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory' ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Daftar Stok Inventaris ({filteredItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfers')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'transfers' ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Log Transfer Stok ({transferRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receiving')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'receiving' ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Riwayat Penerimaan ({receivingLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('waste')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'waste' ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Jurnal Waste ({wasteAdjustments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'vendors' ? 'border-amber-500 text-amber-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🏢 Pemasok & PO Vendor
          </button>
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter nama item / SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                    <th className="py-3 px-4 text-center">Min. Stok</th>
                    <th className="py-3 px-4 text-right">Cost/Unit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">{item.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{item.sku} | Barcode: {item.barcode}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-center font-bold text-foreground">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">
                        {formatIdr(item.unitCost)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'in_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Aman
                          </span>
                        )}
                        {item.status === 'low_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Warning
                          </span>
                        )}
                        {item.status === 'out_of_stock' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            Habis
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
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
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">ID Mutasi</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Asal ➔ Tujuan</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Konfirmasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {transferRequests.map((trf) => (
                  <tr key={trf.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{trf.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{trf.itemName}</div>
                      <div className="text-[11px] text-muted-foreground">{trf.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">
                      {trf.sourceWarehouseId} ➔ {trf.destinationWarehouseId}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-foreground">{trf.qty}</td>
                    <td className="py-3 px-4 text-center">
                      {trf.status === 'requested' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          Requested
                        </span>
                      )}
                      {trf.status === 'in_transit' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          In Transit
                        </span>
                      )}
                      {trf.status === 'received' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Received
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {trf.status === 'in_transit' && (
                        <button
                          type="button"
                          onClick={() => updateTransferStatus(trf.id, 'received')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center space-x-1 cursor-pointer"
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
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">ID Receiving</th>
                  <th className="py-3 px-4">Item & Batch</th>
                  <th className="py-3 px-4">Gudang</th>
                  <th className="py-3 px-4 text-center">Qty Diterima</th>
                  <th className="py-3 px-4">PO Supplier</th>
                  <th className="py-3 px-4">Kadaluarsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {receivingLogs.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{rec.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{rec.itemName}</div>
                      <div className="text-[11px] text-muted-foreground">Batch: {rec.batchNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{rec.warehouseId}</td>
                    <td className="py-3 px-4 text-center font-bold text-foreground">{rec.qty}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{rec.supplierPoNumber}</td>
                    <td className="py-3 px-4 text-muted-foreground">{rec.expiryDate || '-'}</td>
                  </tr>
                ))}
                {receivingLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
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
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                  <th className="py-3 px-4">ID Waste</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Alasan & Jurnal</th>
                  <th className="py-3 px-4 text-center">Qty Waste</th>
                  <th className="py-3 px-4 text-right">Nilai Beban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {wasteAdjustments.map((wst) => (
                  <tr key={wst.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono font-bold text-rose-500">{wst.id}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{wst.itemName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{wst.reason}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">GL: {wst.expenseGlAccount}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-rose-500">{wst.qty}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-500">
                      {formatIdr(wst.expenseAmountIdr)}
                    </td>
                  </tr>
                ))}
                {wasteAdjustments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                      Belum ada pencatatan waste/spoilage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Vendor Directory & PO Management */}
        {activeTab === 'vendors' && (
          <div className="p-4">
            <VendorDirectoryTab
              onOpenReceivingModal={(po) => {
                setPrefillPo(po)
                setIsReceivingModalOpen(true)
              }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <GoodsReceivingModal
        isOpen={isReceivingModalOpen}
        onClose={() => {
          setIsReceivingModalOpen(false)
          setPrefillPo(undefined)
        }}
        onReceive={handleReceiveGoods}
        stockItems={allStockItems}
        warehouses={warehouses}
        currentWarehouseId={activeWarehouseId}
        prefillPoNumber={prefillPo?.poNumber}
        prefillVendorName={prefillPo?.vendorName}
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
