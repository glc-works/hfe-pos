import React, { useState } from 'react'
import { X, PackagePlus, Barcode, Building2, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { StockItem, WarehouseInfo, ReceiveGoodsPayload } from '../../services/hfeApi'

export interface GoodsReceivingModalProps {
  isOpen: boolean
  onClose: () => void
  onReceive: (payload: ReceiveGoodsPayload) => Promise<void>
  stockItems: StockItem[]
  warehouses: WarehouseInfo[]
  currentWarehouseId: string
  prefillPoNumber?: string
  prefillVendorName?: string
}

export const GoodsReceivingModal: React.FC<GoodsReceivingModalProps> = ({
  isOpen,
  onClose,
  onReceive,
  stockItems,
  warehouses,
  currentWarehouseId,
  prefillPoNumber,
  prefillVendorName,
}) => {
  const [warehouseId, setWarehouseId] = useState(currentWarehouseId)
  const [itemCode, setItemCode] = useState(stockItems[0]?.sku || '')
  const [vendorName, setVendorName] = useState(prefillVendorName || 'PT Nusantara Roastery Abadi')
  const [deliveryOrderNo, setDeliveryOrderNo] = useState(`DO-${Date.now().toString().slice(-6)}`)
  const [qty, setQty] = useState(20)
  const [damagedQty, setDamagedQty] = useState(0)
  const [unitCost, setUnitCost] = useState(180000)
  const [supplierPoNumber, setSupplierPoNumber] = useState(prefillPoNumber || `PO-SUPP-${Date.now().toString().slice(-4)}`)
  const [batchNumber, setBatchNumber] = useState(`BATCH-${Date.now().toString().slice(-6)}`)
  const [expiryDate, setExpiryDate] = useState('2026-12-31')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const netReceivedQty = Math.max(0, qty - damagedQty)
  const totalValuation = netReceivedQty * unitCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemCode || netReceivedQty <= 0) return
    setLoading(true)
    try {
      await onReceive({
        warehouseId,
        itemCode,
        qty: Number(netReceivedQty),
        supplierPoNumber: `${supplierPoNumber} [DO: ${deliveryOrderNo}]`,
        batchNumber,
        expiryDate,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      console.error('[GoodsReceivingModal] Error receiving goods:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-foreground rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-border animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Penerimaan Barang (Goods Receipt / GRN)</h3>
              <p className="text-xs text-muted-foreground">Verifikasi fisik surat jalan, tanggal kedaluwarsa & update stok</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-foreground">Barang Berhasil Diterima ke Gudang!</h4>
            <p className="text-xs text-muted-foreground">
              +{netReceivedQty} unit masuk ke stok gudang & jurnal persediaan terposting ke Hfe CORE.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Gudang Tujuan</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Nama Vendor Pemasok</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">No. PO Referensi</label>
                <input
                  type="text"
                  required
                  value={supplierPoNumber}
                  onChange={(e) => setSupplierPoNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-mono rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">No. Surat Jalan / DO Supplier</label>
                <input
                  type="text"
                  required
                  value={deliveryOrderNo}
                  onChange={(e) => setDeliveryOrderNo(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-mono rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Item / SKU Bahan Baku</label>
              <select
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border text-foreground font-medium rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {stockItems.map((item) => (
                  <option key={item.id} value={item.sku}>
                    {item.name} ({item.sku}) - Stok Saat Ini: {item.currentStock} {item.unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Qty Dipesan</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-mono font-bold rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-rose-500 mb-1">Qty Rusak / Tolak</label>
                <input
                  type="number"
                  min={0}
                  value={damagedQty}
                  onChange={(e) => setDamagedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-rose-500/30 text-rose-500 font-mono font-bold rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-emerald-500 mb-1">Net Diterima</label>
                <div className="px-3 py-2 bg-muted/60 border border-border rounded-xl font-mono font-black text-emerald-500 text-sm">
                  {netReceivedQty}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">No. Batch Produksi</label>
                <div className="relative">
                  <Barcode className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border text-foreground font-mono rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Tanggal Kedaluwarsa (Exp)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-mono rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Valuation Summary */}
            <div className="bg-muted/40 p-3 rounded-2xl border border-border flex items-center justify-between font-mono">
              <div>
                <span className="text-muted-foreground text-[11px] block">Estimasi Nilai Barang Diterima:</span>
                <span className="text-[10px] text-muted-foreground font-sans">
                  {netReceivedQty} unit × Rp {unitCost.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-emerald-500 font-bold text-sm">
                Rp {totalValuation.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-border text-muted-foreground hover:text-foreground font-semibold rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || netReceivedQty <= 0}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Konfirmasi Terima Barang (GRN)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
