import React, { useState } from 'react'
import { X, RefreshCw, Leaf, CheckCircle2, Banknote, Sparkles, Award } from 'lucide-react'

export interface BottleDepositReturnModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmReturn?: (returnData: { bottleQty: number; refundType: 'cash' | 'points'; amount: number; ecoPointsEarned: number }) => void
}

const DEPOSIT_PER_BOTTLE = 10000 // Rp 10.000 per botol kaca
const POINTS_PER_BOTTLE = 50 // 50 Eco-Points per botol

export const BottleDepositReturnModal: React.FC<BottleDepositReturnModalProps> = ({
  isOpen,
  onClose,
  onConfirmReturn
}) => {
  const [bottleQty, setBottleQty] = useState<number>(2)
  const [refundType, setRefundType] = useState<'cash' | 'points'>('points')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const totalRefundCash = bottleQty * DEPOSIT_PER_BOTTLE
  const totalEcoPoints = bottleQty * POINTS_PER_BOTTLE

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    if (onConfirmReturn) {
      onConfirmReturn({
        bottleQty,
        refundType,
        amount: totalRefundCash,
        ecoPointsEarned: totalEcoPoints
      })
    }
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🍾 Pengembalian Botol Kaca (Eco-Return)</h4>
              <span className="text-[10px] font-mono text-emerald-400">Circular Economy • Deposit Refund & Eco-Points</span>
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
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-bold text-white">Pengembalian {bottleQty} Botol Sukses!</span>
            <p className="text-xs text-emerald-300 font-mono">
              {refundType === 'cash' 
                ? `Uang deposit Rp ${totalRefundCash.toLocaleString('id-ID')} diserahkan ke pelanggan.`
                : `+${totalEcoPoints} Eco-Points ditambahkan ke HfeCard pelanggan.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleProcessReturn} className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Jumlah Botol Kaca Dikembalikan:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setBottleQty(qty)}
                    className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      bottleQty === qty
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-300 font-medium">Bentuk Pengembalian Deposit:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefundType('points')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    refundType === 'points'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-black shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>+{totalEcoPoints} Eco-Points</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Ke HfeCard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRefundType('cash')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    refundType === 'cash'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-black shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>Rp {totalRefundCash.toLocaleString('id-ID')}</span>
                  <span className="text-[9px] text-slate-400 font-mono">Uang Tunai Kasir</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Proses Pengembalian Botol</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
