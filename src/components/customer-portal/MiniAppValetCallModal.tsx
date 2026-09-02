import React, { useState } from 'react'
import { X, Car, Key, Check, Clock, Sparkles } from 'lucide-react'

export interface MiniAppValetCallModalProps {
  isOpen: boolean
  onClose: () => void
  savedPlateNumber?: string
}

export const MiniAppValetCallModal: React.FC<MiniAppValetCallModalProps> = ({
  isOpen,
  onClose,
  savedPlateNumber = 'B 1234 XYZ'
}) => {
  const [plate, setPlate] = useState(savedPlateNumber)
  const [isCalled, setIsCalled] = useState(false)

  if (!isOpen) return null

  const handleCallValet = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalled(true)
    setTimeout(() => {
      setIsCalled(false)
      onClose()
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🚗 Panggil Mobil Valet</h4>
              <span className="text-[10px] font-mono text-indigo-400">Fast Valet Retrieval</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCalled ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-6">
            <Check className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Petugas Valet Sedang Menyiapkan Mobil!</span>
            <p className="text-xs text-emerald-300 font-mono">
              Kendaraan plat <strong className="text-white">{plate}</strong> sedang dibawa ke lobi drop-off (Est. 3-5 menit).
            </p>
          </div>
        ) : (
          <form onSubmit={handleCallValet} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">Plat Nomor Kendaraan Anda:</label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="B 1234 XYZ"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-base font-mono font-black text-center text-amber-400 focus:border-indigo-500 focus:outline-none uppercase tracking-wider"
              />
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Karcis valet digital tersimpan di HfeCard Anda. Tunjukkan layar ini saat mengambil kunci di lobi.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Siapkan Mobil Sekarang ➔</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
