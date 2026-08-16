import React, { useState } from 'react'
import { X, Gift, ShieldAlert, Check, Sparkles, Coffee, AlertTriangle } from 'lucide-react'
import { CartItem } from '../../types/pos'

export interface CompItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: CartItem | null
  onConfirmComp?: (compData: { itemId: string; reason: string; managerPin: string; glExpenseAccount: string }) => void
}

export const CompItemModal: React.FC<CompItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmComp
}) => {
  const [reason, setReason] = useState<'spill' | 'taste' | 'vip_hospitality'>('spill')
  const [managerPin, setManagerPin] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen || !item) return null

  const handleCompSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!managerPin.trim()) {
      setErrorMsg('PIN Manager wajib diisi untuk otorisasi Comp.')
      return
    }

    setIsSuccess(true)
    if (onConfirmComp) {
      onConfirmComp({
        itemId: item.id,
        reason,
        managerPin,
        glExpenseAccount: 'GL-5107-HOSPITALITY-AND-SPOILAGE'
      })
    }

    setTimeout(() => {
      setIsSuccess(false)
      setManagerPin('')
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-rose-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🎁 Complimentary Item (Comp on House)</h4>
              <span className="text-[10px] font-mono text-rose-400">Penggantian Gratis • GL 5107 Jurnal Beban</span>
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

        {isSuccess ? (
          <div className="p-5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-6">
            <Check className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Item Berhasil di-Comp (Rp 0 ke Tamu)!</span>
            <p className="text-xs text-emerald-300 font-mono">
              HPP Bahan Baku dipotong ke GL 5107 (Beban Keramahan & Penggantian).
            </p>
          </div>
        ) : (
          <form onSubmit={handleCompSubmit} className="flex flex-col gap-3.5">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{item.quantity}x • Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
              <span className="text-xs font-mono font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
                Diskon 100% (Rp 0)
              </span>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">Alasan Penggantian (Comp Reason):</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="spill">☕ Kopi/Makanan Tumpah (Accidental Spill)</option>
                <option value="taste">👅 Komplain Rasa / Dingin (Taste / Quality Issue)</option>
                <option value="vip_hospitality">👑 Keramahan Tamu VIP / Relasi Owner (Hospitality)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">PIN Otorisasi Manajer:</label>
              <input
                type="password"
                maxLength={6}
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
                placeholder="6-Digit PIN"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-center font-mono font-black text-base tracking-widest text-amber-400 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Otorisasi Comp & Bebankan ke GL 5107</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
