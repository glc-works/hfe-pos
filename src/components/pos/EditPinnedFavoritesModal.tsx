import React, { useState } from 'react'
import { X, Sparkles, Pin, Check, RotateCcw } from 'lucide-react'
import { MenuItem } from '../../types/pos'

export interface EditPinnedFavoritesModalProps {
  show: boolean
  onClose: () => void
  productCatalog: MenuItem[]
  currentPinnedIds: string[]
  onSavePinnedFavorites: (newPinnedIds: string[]) => void
}

export const EditPinnedFavoritesModal: React.FC<EditPinnedFavoritesModalProps> = ({
  show,
  onClose,
  productCatalog,
  currentPinnedIds,
  onSavePinnedFavorites
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(currentPinnedIds)

  if (!show) return null

  const togglePin = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        if (prev.length >= 12) {
          alert('Maksimum 12 item yang dapat di-pin ke Bar Favorit POS!')
          return prev
        }
        return [...prev, id]
      }
    })
  }

  const handleResetDefault = () => {
    setSelectedIds(productCatalog.slice(0, 12).map((item) => item.id))
  }

  const handleSave = () => {
    onSavePinnedFavorites(selectedIds)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /> Edit 12 Menu Pinned Favorites
            </h3>
            <p className="text-xs text-slate-400">Pilih menu dari katalog yang ingin ditampilkan di tombol favorit kasir</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN COUNT BADGE */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-300 font-semibold">
            Status Pin: <strong className="text-amber-400 font-mono">{selectedIds.length} / 12 Slot Terisi</strong>
          </span>
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
          >
            <RotateCcw className="w-3 h-3" /> Reset Top 12 Default
          </button>
        </div>

        {/* CATALOG SELECTION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 overflow-y-auto max-h-96 pr-1">
          {productCatalog.map((item) => {
            const isPinned = selectedIds.includes(item.id)
            return (
              <div
                key={item.id}
                onClick={() => togglePin(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isPinned
                    ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate">{item.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
                <button
                  type="button"
                  className={`p-1.5 rounded-xl text-xs font-bold ${
                    isPinned ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isPinned ? <Check className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>
            )
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Simpan Perubahan Pinned Menu ➔
          </button>
        </div>

      </div>
    </div>
  )
}
