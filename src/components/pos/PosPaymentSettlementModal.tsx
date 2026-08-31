import React, { useState, useEffect } from 'react'
import {
  X, Banknote, QrCode, CreditCard, Building2, CheckCircle2,
  Calculator, Sparkles, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck
} from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, OrderFulfillmentMode, CardTenderMetadata } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { Button, PriceTag } from '@/ui'
import type { ReviewedPosQuote } from '../../services/financial'
import type { GovernedCheckoutPhase } from '../../hooks/useCafeSettlement'
import { formatExactMinorCurrency } from '../../utils/localeNumberFormat'

export interface PosPaymentSettlementModalProps {
  show: boolean
  onClose: () => void
  items: CartItem[]
  selectedTable: TableStatus | null
  subtotal: number
  pb1Tax: number
  packagingFee?: number
  grandTotal: number
  fulfillmentMode: OrderFulfillmentMode
  posPayMethod: PosPayMethod
  setPosPayMethod: (method: PosPayMethod) => void
  posCashGiven: string
  setPosCashGiven: (val: string) => void
  authoritativeQuote?: ReviewedPosQuote | null
  checkoutPhase?: GovernedCheckoutPhase
  onConfirmSettlement: () => Promise<void> | void
  onOpenRoomChargeModal?: () => void
}

export const PosPaymentSettlementModal: React.FC<PosPaymentSettlementModalProps> = ({
  show,
  onClose,
  items,
  selectedTable,
  subtotal,
  pb1Tax,
  packagingFee = 0,
  grandTotal,
  fulfillmentMode,
  posPayMethod,
  setPosPayMethod,
  posCashGiven,
  setPosCashGiven,
  authoritativeQuote,
  checkoutPhase,
  onConfirmSettlement,
  onOpenRoomChargeModal
}) => {
  const { t, formatPrice, language } = useTranslation()

  const payableAmount = authoritativeQuote
    ? Number(authoritativeQuote.amountDueMinor) / 100
    : grandTotal

  const [selectedBank, setSelectedBank] = useState<string>('BCA')
  const [cardPrefix, setCardPrefix] = useState<string>('45563321')
  const [cardLast4, setCardLast4] = useState<string>('9876')
  const [approvalCode, setApprovalCode] = useState<string>('APPR-8899')

  // Auto-default cash given to exact amount on open if empty
  useEffect(() => {
    if (show && posPayMethod === 'cash' && !posCashGiven) {
      setPosCashGiven(payableAmount.toString())
    }
  }, [show, posPayMethod, payableAmount, posCashGiven, setPosCashGiven])

  if (!show) return null

  const cashGivenNum = Number(posCashGiven.replace(/\D/g, '')) || 0
  const changeAmount = Math.max(0, cashGivenNum - payableAmount)
  const isCashSufficient = posPayMethod !== 'cash' || cashGivenNum >= payableAmount

  const quickPresets = [
    { label: 'Uang Pas', amount: payableAmount },
    { label: 'Rp 50.000', amount: 50000 },
    { label: 'Rp 100.000', amount: 100000 },
    { label: 'Rp 200.000', amount: 200000 }
  ].filter(p => p.amount >= payableAmount || p.label === 'Uang Pas')

  const isSubmitting = checkoutPhase?.kind === 'quoting' || checkoutPhase?.kind === 'accepting'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              💳
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Konfirmasi Pembayaran Kasir
                {selectedTable && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold">
                    Meja {selectedTable.name}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih metode bayar, hitung kembalian, lalu selesaikan transaksi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Bill Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Rincian Pesanan ({items.length} Menu):</span>
              <span className="font-mono font-bold">{formatPrice(subtotal)}</span>
            </div>
            {packagingFee > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Biaya Kemasan (Takeaway):</span>
                <span className="font-mono font-bold">+{formatPrice(packagingFee)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Pajak Restoran PB1 (10%):</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">+{formatPrice(pb1Tax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Total Tagihan:</span>
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatPrice(payableAmount)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Pilih Metode Pembayaran:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPosPayMethod('cash')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  posPayMethod === 'cash'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20 font-black'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-500" />
                <span>💵 Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => setPosPayMethod('qris')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  posPayMethod === 'qris'
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-500/20 font-black'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-indigo-500" />
                <span>📱 QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setPosPayMethod('card')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm ring-2 ring-amber-500/20 font-black'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>💳 Kartu EDC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenRoomChargeModal?.()
                }}
                className="p-2.5 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-purple-500" />
                <span>🏨 Kamar Hotel</span>
              </button>
            </div>
          </div>

          {/* Tender Form Specifics */}
          {posPayMethod === 'cash' && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nominal Uang Tunai Diterima:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={posCashGiven}
                    onChange={(e) => setPosCashGiven(e.target.value)}
                    placeholder={payableAmount.toString()}
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Cash Presets */}
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPosCashGiven(preset.amount.toString())}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Change / Kembalian Calculation */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Uang Kembalian:
                </span>
                <span className={`text-base font-black font-mono ${
                  changeAmount > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : isCashSufficient
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-500'
                }`}>
                  {isCashSufficient ? formatPrice(changeAmount) : 'Uang Kurang!'}
                </span>
              </div>
            </div>
          )}

          {posPayMethod === 'qris' && (
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center text-xl font-bold">
                📱
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                QRIS Dinamis Otomatis
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Setelah tombol ditekan, kode QRIS resmi akan tampil untuk discan oleh pelanggan (BCA/GoPay/OVO/ShopeePay).
              </p>
            </div>
          )}

          {(posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit') && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Bank EDC:
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="BCA">BCA EDC</option>
                    <option value="Mandiri">Mandiri EDC</option>
                    <option value="BRI">BRI EDC</option>
                    <option value="BNI">BNI EDC</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Approval Code EDC:
                  </label>
                  <input
                    type="text"
                    value={approvalCode}
                    onChange={(e) => setApprovalCode(e.target.value)}
                    placeholder="APPR-1234"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="rounded-2xl text-xs font-bold"
          >
            Batal
          </Button>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => {
              if (isCashSufficient) {
                onConfirmSettlement()
              }
            }}
            disabled={!isCashSufficient || isSubmitting}
            className="rounded-2xl font-black text-xs sm:text-sm px-6 shadow-xl flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Memproses Pembayaran...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Selesaikan & Cetak Struk ➔</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
