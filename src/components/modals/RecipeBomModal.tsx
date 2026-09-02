import React from 'react'
import { MenuItem } from '../../types/pos'
import { X, Coffee, Layers, ChefHat } from 'lucide-react'

interface RecipeBomModalProps {
  selectedRecipeBOM: MenuItem | null
  onClose: () => void
}

export const RecipeBomModal: React.FC<RecipeBomModalProps> = ({
  selectedRecipeBOM,
  onClose
}) => {
  if (!selectedRecipeBOM) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <img 
            src={selectedRecipeBOM.image} 
            alt={selectedRecipeBOM.name} 
            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {selectedRecipeBOM.id}
              </span>
              <span className="text-[10px] font-mono text-indigo-400">{selectedRecipeBOM.hfeCategoryCode}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedRecipeBOM.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{selectedRecipeBOM.description}</p>
          </div>
        </div>

        {/* BOM INGREDIENTS LIST */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-amber-500" /> Komposisi BoM (Bill of Materials &amp; Kode Inventori)</span>
            <span className="text-[9px] font-mono text-indigo-400">STAFF ONLY</span>
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            {selectedRecipeBOM.bomIngredients?.map((ing, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {ing.itemCode}
                  </span>
                  <span>{ing.name}</span>
                </div>
                <span className="font-mono font-bold text-amber-400">{ing.amount}</span>
              </div>
            )) || <p className="text-xs text-slate-500">Komposisi BoM standar pabrikasi.</p>}
          </div>
        </div>

        {/* PREPARATION STEPS */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-indigo-500" /> Petunjuk SOP Pembuatan / Barista Guide
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            {selectedRecipeBOM.preparationSteps?.map((step, idx) => (
              <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                {step}
              </p>
            )) || <p className="text-xs text-slate-500">Gunakan petunjuk standar penyajian kafe.</p>}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1"
        >
          Tutup Petunjuk Komposisi BoM
        </button>
      </div>
    </div>
  )
}
