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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Transfer Stok Antar Gudang</h3>
              <p className="text-xs text-slate-500">Kirim mutasi stok dari gudang asal ke tujuan</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gudang Asal</label>
              <select
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gudang Tujuan</label>
              <select
                value={destinationWarehouseId}
                onChange={(e) => setDestinationWarehouseId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Item / Bahan Baku</label>
            <select
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {stockItems.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.name} ({item.sku}) - Avail: {item.currentStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Transfer</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan / No. Surat Jalan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
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
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Transfer Stok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
