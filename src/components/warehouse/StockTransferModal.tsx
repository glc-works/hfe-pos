import React, { useState } from 'react'
import { X, ArrowLeftRight } from 'lucide-react'
import { StockItem, WarehouseInfo, StockTransferPayload } from '../../services/hfeApi'

export interface StockTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (payload: StockTransferPayload) => Promise<void>
  stockItems: StockItem[]
  warehouses: WarehouseInfo[]
  currentWarehouseId: string
}

export const StockTransferModal: React.FC<StockTransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  stockItems,
  warehouses,
  currentWarehouseId,
}) => {
  const [sourceWarehouseId, setSourceWarehouseId] = useState(currentWarehouseId)
  const [destinationWarehouseId, setDestinationWarehouseId] = useState(
    warehouses.find((w) => w.id !== currentWarehouseId)?.id || 'WH-SENOPATI-STORE'
  )
  const [itemCode, setItemCode] = useState(stockItems[0]?.sku || '')
  const [qty, setQty] = useState(5)
  const [notes, setNotes] = useState('Surat Jalan Restock Antar Gudang')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sourceWarehouseId === destinationWarehouseId) {
      alert('Gudang asal dan tujuan tidak boleh sama')
      return
    }
    if (!itemCode || qty <= 0) return
    setLoading(true)
    try {
      await onTransfer({
        sourceWarehouseId,
        destinationWarehouseId,
        itemCode,
        qty: Number(qty),
        notes,
      })
      onClose()
    } catch (err) {
      console.error('[StockTransferModal] Error submitting transfer:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-foreground rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono text-[10px] font-bold">
                  FORM-LOG-03
                </span>
                <h3 className="font-bold text-foreground text-sm">Surat Jalan Transfer Cabang</h3>
              </div>
              <p className="text-xs text-muted-foreground">Kirim mutasi stok dari gudang asal ke tujuan</p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Gudang Asal</label>
              <select
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border text-foreground font-semibold rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Gudang Tujuan</label>
              <select
                value={destinationWarehouseId}
                onChange={(e) => setDestinationWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border text-foreground font-semibold rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.code}
                  </option>
                ))}
              </select>
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
                  {item.name} ({item.sku}) - Stok: {item.currentStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Jumlah Mutasi (Qty)</label>
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
            <label className="block font-semibold text-muted-foreground mb-1">Catatan / No. Surat Jalan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
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
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Mengirim...' : 'Terbitkan Surat Jalan (Kirim)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
