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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-foreground rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono text-[10px] font-bold">
                  FORM-LOG-04
                </span>
                <h3 className="font-bold text-foreground text-sm">Penyesuaian Waste / Spoilage</h3>
              </div>
              <p className="text-xs text-muted-foreground">Jurnal beban barang tumpah / pecah / kadaluarsa</p>
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
          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Lokasi Gudang</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border text-foreground font-semibold rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Bahan Baku Tumpah / Kadaluarsa</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Jumlah Waste (Qty)</label>
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
              <label className="block font-semibold text-muted-foreground mb-1">Akun Jurnal Beban</label>
              <input
                type="text"
                value={expenseGlAccount}
                onChange={(e) => setExpenseGlAccount(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border text-foreground font-mono rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Alasan Kerusakan / Spoilage</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {REASON_OPTIONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Catatan Tambahan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Susu tumpah tersenggol saat rush hour..."
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
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Menyimpan...' : 'Posting Jurnal Waste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
