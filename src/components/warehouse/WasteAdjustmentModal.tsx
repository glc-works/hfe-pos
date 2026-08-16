import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { StockItem, WarehouseInfo, WasteAdjustmentPayload } from '../../services/hfeApi'

export interface WasteAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdjust: (payload: WasteAdjustmentPayload) => Promise<void>
  stockItems: StockItem[]
  warehouses: WarehouseInfo[]
  currentWarehouseId: string
}

const REASON_OPTIONS = [
  'Tumpah saat brewing / Spilled Coffee Beans',
  'Susu Kadaluarsa / Expired Milk',
  'Botol Pecah / Broken Bottle',
  'Kerusakan Kemasan / Damaged Packaging',
  'Lain-lain (Catat Keterangan)',
]

export const WasteAdjustmentModal: React.FC<WasteAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onAdjust,
  stockItems,
  warehouses,
  currentWarehouseId,
}) => {
  const [warehouseId, setWarehouseId] = useState(currentWarehouseId)
  const [itemCode, setItemCode] = useState(stockItems[0]?.sku || '')
  const [qty, setQty] = useState(1)
  const [reason, setReason] = useState(REASON_OPTIONS[0])
  const [expenseGlAccount, setExpenseGlAccount] = useState('6-5100-SPOILAGE-EXPENSE')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemCode || qty <= 0) return
    setLoading(true)
    try {
      await onAdjust({
        warehouseId,
        itemCode,
        qty: Number(qty),
        reason,
        expenseGlAccount,
        notes,
      })
      onClose()
    } catch (err) {
      console.error('[WasteAdjustmentModal] Error adjusting waste:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pencatatan Waste / Spoilage</h3>
              <p className="text-xs text-slate-500">Jurnal beban barang tumpah / pecah / kadaluarsa</p>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Gudang</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bahan Baku Tumpah / Kadaluarsa</label>
            <select
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {stockItems.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.name} ({item.sku}) - Stok: {item.currentStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Waste</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akun Jurnal Beban</label>
              <input
                type="text"
                required
                value={expenseGlAccount}
                onChange={(e) => setExpenseGlAccount(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alasan Penyesuaian Waste</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional (cth: pecah saat bongkar muat)"
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
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Catat Waste Jurnal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
