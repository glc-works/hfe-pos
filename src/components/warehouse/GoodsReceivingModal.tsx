import React, { useState } from 'react'
import { X, PackagePlus, Barcode } from 'lucide-react'
import { StockItem, WarehouseInfo, ReceiveGoodsPayload } from '../../services/hfeApi'

export interface GoodsReceivingModalProps {
  isOpen: boolean
  onClose: () => void
  onReceive: (payload: ReceiveGoodsPayload) => Promise<void>
  stockItems: StockItem[]
  warehouses: WarehouseInfo[]
  currentWarehouseId: string
}

export const GoodsReceivingModal: React.FC<GoodsReceivingModalProps> = ({
  isOpen,
  onClose,
  onReceive,
  stockItems,
  warehouses,
  currentWarehouseId,
}) => {
  const [warehouseId, setWarehouseId] = useState(currentWarehouseId)
  const [itemCode, setItemCode] = useState(stockItems[0]?.sku || '')
  const [qty, setQty] = useState(10)
  const [supplierPoNumber, setSupplierPoNumber] = useState(`PO-SUPP-${Date.now().toString().slice(-4)}`)
  const [batchNumber, setBatchNumber] = useState(`BATCH-${Date.now().toString().slice(-6)}`)
  const [expiryDate, setExpiryDate] = useState('2026-12-31')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemCode || qty <= 0) return
    setLoading(true)
    try {
      await onReceive({
        warehouseId,
        itemCode,
        qty: Number(qty),
        supplierPoNumber,
        batchNumber,
        expiryDate,
      })
      onClose()
    } catch (err) {
      console.error('[GoodsReceivingModal] Error receiving goods:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Penerimaan Barang (Receiving)</h3>
              <p className="text-xs text-slate-500">Catat stok masuk dari supplier / PO Vendor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gudang Tujuan</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item / SKU Bahan Baku</label>
            <select
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {stockItems.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.name} ({item.sku}) - Current: {item.currentStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Diterima</label>
              <input
                type="number"
                min={1}
                required
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">No. PO Supplier</label>
              <input
                type="text"
                required
                value={supplierPoNumber}
                onChange={(e) => setSupplierPoNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">No. Batch Produksi</label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kadaluarsa</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Simpan...' : 'Proses Penerimaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
