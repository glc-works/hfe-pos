import React, { useState } from 'react'
import { X, ClipboardCheck, Search, CheckCircle2, AlertTriangle, Send } from 'lucide-react'
import { submitStocktake, StocktakeResponse } from '../../services/hfeWorkflowsApi'

export interface StocktakeItem {
  itemCode: string
  name: string
  category: string
  unit: string
  systemStock: number
  physicalCount: number | ''
  notes?: string
}

interface StocktakeAuditModalProps {
  isOpen: boolean
  onClose: () => void
  bookId?: string
  onSubmitted?: (result: StocktakeResponse) => void
}

const INITIAL_STOCKTAKE_ITEMS: StocktakeItem[] = [
  { itemCode: 'ING-COFFEE-01', name: 'Specialty Espresso Beans', category: 'Biji Kopi', unit: 'Gram', systemStock: 4500, physicalCount: 4500 },
  { itemCode: 'ING-MILK-OAT', name: 'Oatside Oat Milk 1L', category: 'Susu & Diary', unit: 'Karton', systemStock: 24, physicalCount: 22 },
  { itemCode: 'ING-SUGAR-SYRUP', name: 'Organic Palm Sugar Syrup', category: 'Sirup & Gula', unit: 'Liter', systemStock: 8, physicalCount: 8 },
  { itemCode: 'PACK-CUP-12OZ', name: 'Hot Paper Cup 12oz', category: 'Kemasan', unit: 'Pcs', systemStock: 250, physicalCount: 240 },
  { itemCode: 'PACK-STRAW-BIO', name: 'Bio Cassava Straw', category: 'Kemasan', unit: 'Pcs', systemStock: 500, physicalCount: 500 },
]

export const StocktakeAuditModal: React.FC<StocktakeAuditModalProps> = ({
  isOpen,
  onClose,
  bookId = 'BOOK-CAFE-HQ-88',
  onSubmitted,
}) => {
  const [items, setItems] = useState<StocktakeItem[]>(INITIAL_STOCKTAKE_ITEMS)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitResult, setSubmitResult] = useState<StocktakeResponse | null>(null)

  if (!isOpen) return null

  const handleUpdatePhysicalCount = (itemCode: string, val: string) => {
    const num = val === '' ? '' : Number(val)
    setItems((prev) =>
      prev.map((i) => (i.itemCode === itemCode ? { ...i, physicalCount: num } : i))
    )
  }

  const handleUpdateNotes = (itemCode: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.itemCode === itemCode ? { ...i, notes } : i))
    )
  }

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsWithDiscrepancy = items.filter((i) => {
    const count = typeof i.physicalCount === 'number' ? i.physicalCount : i.systemStock
    return count !== i.systemStock
  })

  const handleSubmitAudit = async () => {
    setIsSubmitting(true)
    try {
      const payload = items.map((i) => {
        const count = typeof i.physicalCount === 'number' ? i.physicalCount : i.systemStock
        return {
          itemCode: i.itemCode,
          systemStock: i.systemStock,
          physicalCount: count,
          variance: count - i.systemStock,
          notes: i.notes,
        }
      })
      const res = await submitStocktake(payload, bookId)
      setSubmitResult(res)
      if (onSubmitted) onSubmitted(res)
    } catch (err) {
      console.error('Submit stocktake error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Stocktake Audit UI & Adjust Kasir</h3>
            <p className="text-xs text-slate-400">Hitung stok fisik bahan baku resep BOM & verifikasi selisih ledger</p>
          </div>
        </div>

        {/* SUMMARY BADGES */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex justify-between items-center">
            <span className="text-slate-400">Total Item Diaudit:</span>
            <span className="font-mono font-bold text-white text-sm">{items.length} SKU</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex justify-between items-center">
            <span className="text-slate-400">Item Selisih (Variance):</span>
            <span className={`font-mono font-bold text-sm ${itemsWithDiscrepancy.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {itemsWithDiscrepancy.length} SKU
            </span>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari SKU, nama bahan baku, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* STOCK TABLE */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 max-h-64 overflow-y-auto flex flex-col gap-2">
          {filteredItems.map((item) => {
            const count = typeof item.physicalCount === 'number' ? item.physicalCount : item.systemStock
            const variance = count - item.systemStock

            return (
              <div
                key={item.itemCode}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      {item.itemCode}
                    </span>
                    <span className="font-bold text-white">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Kategori: {item.category} • Satuan: {item.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Sistem</span>
                    <span className="font-mono font-bold text-slate-300">
                      {item.systemStock} {item.unit}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-[10px]">Hitung Fisik</span>
                    <input
                      type="number"
                      value={item.physicalCount}
                      onChange={(e) => handleUpdatePhysicalCount(item.itemCode, e.target.value)}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 font-mono font-bold text-white text-center focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="w-20 text-center">
                    <span className="text-slate-400 text-[10px] block">Selisih</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                        variance === 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {variance > 0 ? `+${variance}` : variance}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {submitResult && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Audit Stocktake #{submitResult.auditId} Berhasil!
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {submitResult.adjustedItemsCount} SKU Disesuaikan
            </span>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmitAudit}
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <Send className="w-4 h-4" /> {isSubmitting ? 'Memproses Audit...' : 'Simpan & Submit Adjust Stok ke HCB Core'}
        </button>
      </div>
    </div>
  )
}
