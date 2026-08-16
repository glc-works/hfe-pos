import React from 'react'
import { X, Sparkles, Plus, Check } from 'lucide-react'
import { MenuItem } from '../../types/pos'

export interface DeterministicUpsellModalProps {
  show: boolean
  onClose: () => void
  cartItemName: string
  suggestedItems: MenuItem[]
  onAddSuggestedItem: (item: MenuItem) => void
}

export const DeterministicUpsellModal: React.FC<DeterministicUpsellModalProps> = ({
  show,
  onClose,
  cartItemName,
  suggestedItems,
  onAddSuggestedItem
}) => {
  if (!show || suggestedItems.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold text-white">Saran Pasangan Menu (Smart Upsell)</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Pelanggan yang memesan <strong className="text-amber-400">{cartItemName}</strong> biasanya juga menyukai:
        </p>

        {/* SUGGESTED ITEMS */}
        <div className="flex flex-col gap-2.5">
          {suggestedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-md"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <span className="text-[10px] font-mono text-emerald-400">Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddSuggestedItem(item)
                  onClose()
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-800 pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-bold py-1 px-3"
          >
            Lewati Saran ➔
          </button>
        </div>

      </div>
    </div>
  )
}
