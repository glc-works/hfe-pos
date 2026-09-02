import React, { useState } from 'react'
import {
  Warehouse,
  PackagePlus,
  ArrowLeftRight,
  Trash2,
  ScanBarcode,
  Building2,
  Truck,
} from 'lucide-react'
import { useWarehouse } from '../hooks/useWarehouse'
import { GoodsReceivingModal } from '../components/warehouse/GoodsReceivingModal'
import { StockTransferModal } from '../components/warehouse/StockTransferModal'
import { WasteAdjustmentModal } from '../components/warehouse/WasteAdjustmentModal'
import { VendorDirectoryTab, PurchaseOrderRecord } from '../components/warehouse/VendorDirectoryTab'
import { LogisticsPipelineTab } from '../components/warehouse/LogisticsPipelineTab'
import { InventoryAuditTab } from '../components/warehouse/InventoryAuditTab'

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
    handleAdjustWaste,
  } = useWarehouse(bookId)

  const [searchTerm, setSearchTerm] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [activeTab, setActiveTab] = useState<'inventory' | 'logistics' | 'vendors' | 'audit'>('inventory')
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

  const lowStockCount = stockItems.filter((i) => i.currentStock <= i.minStock && i.currentStock > 0).length
  const outOfStockCount = stockItems.filter((i) => i.currentStock === 0).length
  const inTransitCount = transferRequests.filter((t) => t.status === 'in_transit').length

  return (
    <div className="p-4 sm:p-6 bg-background text-foreground min-h-screen space-y-4">
      {/* ZONE 1: MASTER COMMAND HEADER WITH MONOLITHIC LOCATION SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-xs">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">Logistik & Manajemen Gudang</h1>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[10px] font-bold">
                SOP-LOG-01
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Pusat logistik multi-cabang, inventaris & pergerakan barang</p>
          </div>
        </div>

        {/* MONOLITHIC LOCATION SELECTOR CAPSULE (Single Source of Truth) */}
        <div className="flex items-center bg-muted/80 p-1 rounded-2xl border border-border">
          <div className="flex items-center gap-1.5 px-2.5 text-xs font-semibold text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Lokasi:</span>
          </div>
          <select
            value={activeWarehouseId}
            onChange={(e) => setActiveWarehouseId(e.target.value)}
            className="bg-card border border-border text-foreground text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
          >
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ZONE 2: 3-METRIC EXECUTIVE MICRO-HUD (COMPACT, NON-REDUNDANT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Metric 1: Stock Asset Valuation */}
        <div className="bg-card p-3.5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Valuasi Aset Stok</p>
            <h3 className="text-lg font-black text-emerald-500 mt-0.5">{formatIdr(activeWarehouse.totalValuationIdr)}</h3>
          </div>
          <span className="px-2 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-bold font-mono">
            HPP Live
          </span>
        </div>

        {/* Metric 2: SKU Health Breakdown */}
        <div className="bg-card p-3.5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Kesehatan Inventaris</p>
            <h3 className="text-lg font-black text-foreground mt-0.5">{stockItems.length} SKU Terdaftar</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
            {outOfStockCount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {outOfStockCount} Habis
              </span>
            )}
            {lowStockCount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {lowStockCount} Reorder
              </span>
            )}
            {outOfStockCount === 0 && lowStockCount === 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Aman
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Live Goods in Motion */}
        <div className="bg-card p-3.5 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Pergerakan Barang di Jalan</p>
            <h3 className="text-lg font-black text-blue-500 mt-0.5">{inTransitCount} Mutasi OTW</h3>
          </div>
          <span className="px-2 py-1 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-bold font-mono flex items-center gap-1">
            <Truck className="w-3 h-3" /> In-Transit
          </span>
        </div>
      </div>

      {/* ZONE 3: UNIFIED ACTION & NAVIGATION RAIL */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-border bg-muted/20 p-2.5 gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              📊 Stok & Health ({filteredItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logistics')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'logistics'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              🚚 Pipeline Logistik
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vendors')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vendors'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              🏢 Pemasok & PO
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              📜 Jurnal & Audit ({receivingLogs.length + wasteAdjustments.length})
            </button>
          </div>

          {/* Integrated Actions & Scanner */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleBarcodeScan} className="relative">
              <ScanBarcode className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan Barcode / SKU..."
                className="pl-8 pr-2.5 py-1.5 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none w-40 sm:w-44"
              />
            </form>

            <button
              type="button"
              onClick={() => {
                setPrefillPo(undefined)
                setIsReceivingModalOpen(true)
              }}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Terima</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(true)}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWasteModalOpen(true)}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Waste</span>
            </button>
          </div>
        </div>

        {/* ZONE 4: CONTENT CANVAS */}
        {/* Tab 1: Inventory Table with Visual Stock Health */}
        {activeTab === 'inventory' && (
          <div className="p-4 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                    <th className="py-2.5 px-3">Item & Identitas SKU</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-center">Tingkat Ketersediaan</th>
                    <th className="py-2.5 px-3 text-right">Cost / Unit</th>
                    <th className="py-2.5 px-3 text-center">Status Health</th>
                    <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {filteredItems.map((item) => {
                    const healthPct = Math.min(100, Math.round((item.currentStock / Math.max(1, item.minStock * 2)) * 100))
                    const isLow = item.currentStock <= item.minStock
                    const isOut = item.currentStock === 0

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-foreground">{item.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{item.sku} | Barcode: {item.barcode}</div>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground font-medium">{item.category}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="font-mono font-bold text-foreground text-xs">
                            {item.currentStock} <span className="text-[11px] font-normal text-muted-foreground">{item.unit}</span>
                          </div>
                          <div className="w-20 mx-auto bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isOut ? 'bg-rose-500 w-full' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: isOut ? '100%' : `${healthPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">Min: {item.minStock} {item.unit}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                          {formatIdr(item.unitCost)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              Habis
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              Perlu Reorder
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setPrefillPo(undefined)
                                setIsReceivingModalOpen(true)
                              }}
                              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              + Terima
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsTransferModalOpen(true)}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              ↔ Transfer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                        Tidak ada data item stok yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Universal Logistics Pipeline */}
        {activeTab === 'logistics' && (
          <div className="p-4">
            <LogisticsPipelineTab
              currentWarehouseId={activeWarehouseId}
              transferRequests={transferRequests}
              onOpenReceivingModal={(prefill) => {
                setPrefillPo(prefill)
                setIsReceivingModalOpen(true)
              }}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Vendor Directory & PO Suite */}
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

        {/* Tab 4: Unified Jurnal & Audit (GRN + Waste) */}
        {activeTab === 'audit' && (
          <InventoryAuditTab
            receivingLogs={receivingLogs}
            wasteAdjustments={wasteAdjustments}
          />
        )}
      </div>

      {/* MODALS */}
      <GoodsReceivingModal
        isOpen={isReceivingModalOpen}
        onClose={() => {
          setIsReceivingModalOpen(false)
          setPrefillPo(undefined)
        }}
        onReceive={handleReceiveGoods}
        stockItems={stockItems}
        warehouses={warehouses}
        currentWarehouseId={activeWarehouseId}
        prefill={prefillPo}
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
