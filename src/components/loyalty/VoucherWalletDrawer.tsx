import React, { useState } from 'react'
import { Ticket, X, CheckCircle, AlertCircle, Tag, Clock, ArrowRight } from 'lucide-react'
import { Voucher } from '../../hooks/useLoyalty'

export interface VoucherWalletDrawerProps {
  isOpen: boolean
  onClose: () => void
  subtotal: number
  vouchers: Voucher[]
  appliedVoucher: Voucher | null
  onApplyVoucher: (code: string) => { success: boolean; message: string; discountAmount: number }
  onRemoveVoucher: () => void
}

export const VoucherWalletDrawer: React.FC<VoucherWalletDrawerProps> = ({
  isOpen,
  onClose,
  subtotal,
  vouchers,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
}) => {
  const [inputCode, setInputCode] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  if (!isOpen) return null

  const handleApplyInputCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputCode.trim()) return

    const res = onApplyVoucher(inputCode.trim())
    if (res.success) {
      setFeedback({ type: 'success', message: res.message })
      setInputCode('')
    } else {
      setFeedback({ type: 'error', message: res.message })
    }
  }

  const handleSelectVoucher = (v: Voucher) => {
    const res = onApplyVoucher(v.code)
    if (res.success) {
      setFeedback({ type: 'success', message: res.message })
    } else {
      setFeedback({ type: 'error', message: res.message })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dompet Voucher & Promo</h3>
              <p className="text-xs text-slate-400">Gunakan voucher belanja untuk diskon tambahan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleApplyInputCode} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={inputCode}
                onChange={e => {
                  setInputCode(e.target.value.toUpperCase())
                  setFeedback(null)
                }}
                placeholder="Masukkan Kode Promo (Contoh: VOUCHER-DISC10PCT)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white uppercase tracking-wider placeholder:text-slate-500 placeholder:normal-case focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Terapkan
            </button>
          </div>
        </form>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Applied Voucher Active Bar */}
        {appliedVoucher && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4 w-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-amber-300">{appliedVoucher.title}</span>
                <p className="text-[11px] text-slate-400">Kode: {appliedVoucher.code}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onRemoveVoucher()
                setFeedback({ type: 'success', message: 'Voucher dilepas dari keranjang' })
              }}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
            >
              Hapus
            </button>
          </div>
        )}

        {/* Voucher List Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Voucher Tersedia ({vouchers.length})
          </h4>

          {vouchers.map(v => {
            const isApplied = appliedVoucher?.code === v.code
            const isEligible = subtotal >= v.minSpend
            const spendNeeded = v.minSpend - subtotal

            return (
              <div
                key={v.code}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isApplied
                    ? 'bg-amber-500/15 border-amber-500/50'
                    : isEligible
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-white">{v.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 border border-slate-700">
                        {v.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{v.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        Berlaku s/d {v.expiresAt}
                      </span>
                      <span>•</span>
                      <span>Min. Belanja: Rp {v.minSpend.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isApplied ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Aktif
                      </span>
                    ) : isEligible ? (
                      <button
                        onClick={() => handleSelectVoucher(v)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1"
                      >
                        Gunakan
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] text-slate-400 font-medium block text-right">
                        Kurang Rp {spendNeeded.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
