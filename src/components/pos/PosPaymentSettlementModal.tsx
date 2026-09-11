import React, { useState, useEffect } from 'react'
import {
  X, Banknote, QrCode, CreditCard, Building2, CheckCircle2,
  Calculator, Sparkles, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck
} from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, OrderFulfillmentMode, CardTenderMetadata, QrisTenderMetadata } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { Button, PriceTag } from '@/ui'
import type { ReviewedPosQuote } from '../../services/financial'
import type { GovernedCheckoutPhase } from '../../hooks/useCafeSettlement'
import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'
import { PosQrisTenderForm } from './PosQrisTenderForm'
import { PosCardTenderForm } from './PosCardTenderForm'
import { PosCashTenderForm } from './PosCashTenderForm'

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
  onOpenSplitPaymentModal?: () => void
  qrisMetadata?: QrisTenderMetadata
  setQrisMetadata?: (meta: QrisTenderMetadata) => void
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
  onOpenRoomChargeModal,
  onOpenSplitPaymentModal,
  qrisMetadata,
  setQrisMetadata
}) => {
  const { t, formatPrice, language } = useTranslation()

  const payableAmount = authoritativeQuote
    ? Number(authoritativeQuote.amountDueMinor) / 100
    : grandTotal

  const [selectedBank, setSelectedBank] = useState<string>('BCA')
  const [cardPrefix, setCardPrefix] = useState<string>('45563321')
  const [cardLast4, setCardLast4] = useState<string>('9876')
  const [approvalCode, setApprovalCode] = useState<string>('APPR-8899')
  const [internalCardType, setInternalCardType] = useState<'cc' | 'debit'>('cc')
  const [cardNetwork, setCardNetwork] = useState<'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'discover' | 'unionpay' | 'other'>('visa')

  const [qrisProvider, setQrisProvider] = useState<string>(qrisMetadata?.provider || 'BCA')
  const [rrnRefNumber, setRrnRefNumber] = useState<string>(qrisMetadata?.rrnRefNumber || '')
  const [senderName, setSenderName] = useState<string>(qrisMetadata?.senderName || '')

  const handleQrisProviderChange = (prov: string) => {
    setQrisProvider(prov)
    setQrisMetadata?.({ provider: prov, rrnRefNumber, senderName })
  }
  const handleRrnChange = (rrn: string) => {
    setRrnRefNumber(rrn)
    setQrisMetadata?.({ provider: qrisProvider, rrnRefNumber: rrn, senderName })
  }
  const handleSenderNameChange = (name: string) => {
    setSenderName(name)
    setQrisMetadata?.({ provider: qrisProvider, rrnRefNumber, senderName: name })
  }

  // Auto-default cash given to exact amount on open if empty
  useEffect(() => {
    if (show && posPayMethod === 'cash' && !posCashGiven) {
      setPosCashGiven(payableAmount.toString())
    }
  }, [show, posPayMethod, payableAmount, posCashGiven, setPosCashGiven])

  if (!show) return null

  const cashGivenNum = Number(posCashGiven.replace(/\D/g, '')) || 0
  const isCashSufficient = posPayMethod !== 'cash' || cashGivenNum >= payableAmount

  const connectedRuntime = isConnectedFirstPartyRuntime()
  const isTenderEligible = (tenderType: 'cash' | 'qris') => !authoritativeQuote || (
    authoritativeQuote.tenderEligibility.filter((entry) => entry.tenderType === tenderType).length === 1 &&
    authoritativeQuote.tenderEligibility.some((entry) => entry.tenderType === tenderType && entry.eligible)
  )
  const isCardEligible = !connectedRuntime && !authoritativeQuote

  const isSubmitting = checkoutPhase?.kind === 'quoting' || checkoutPhase?.kind === 'accepting'

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
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
                data-testid="settlement-tender-cash"
                type="button"
                disabled={!isTenderEligible('cash')}
                onClick={() => isTenderEligible('cash') && setPosPayMethod('cash')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  !isTenderEligible('cash')
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    : posPayMethod === 'cash'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20 font-black cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-500" />
                <span>Tunai</span>
              </button>

              <button
                data-testid="settlement-tender-qris"
                type="button"
                disabled={!isTenderEligible('qris')}
                onClick={() => isTenderEligible('qris') && setPosPayMethod('qris')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  !isTenderEligible('qris')
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    : posPayMethod === 'qris'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-500/20 font-black cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                }`}
              >
                <QrCode className="w-5 h-5 text-indigo-500" />
                <span>QRIS</span>
              </button>

              <button
                data-testid="settlement-tender-card"
                type="button"
                disabled={!isCardEligible}
                onClick={() => isCardEligible && setPosPayMethod('card')}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  !isCardEligible
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    : posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm ring-2 ring-amber-500/20 font-black cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Kartu EDC</span>
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
                <span>Kamar Hotel</span>
              </button>
            </div>
          </div>

          {/* Tender Form Specifics */}
          {posPayMethod === 'cash' && (
            <div className="space-y-2">
              <PosCashTenderForm
                authoritativeQuote={authoritativeQuote}
                posCashGiven={posCashGiven}
                setPosCashGiven={setPosCashGiven}
                grandTotal={payableAmount}
              />
              {!isCashSufficient && cashGivenNum > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <span className="font-bold">Uang Kurang!</span>
                    <span>(Kurang <span className="font-bold font-mono">{formatPrice(payableAmount - cashGivenNum)}</span>)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onOpenSplitPaymentModal?.()
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    ✂️ Bayar Sebagian (Split) ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {posPayMethod === 'qris' && (
            <PosQrisTenderForm
              selectedProvider={qrisMetadata?.provider || qrisProvider}
              setSelectedProvider={handleQrisProviderChange}
              rrnRefNumber={qrisMetadata?.rrnRefNumber ?? rrnRefNumber}
              setRrnRefNumber={handleRrnChange}
              senderName={qrisMetadata?.senderName ?? senderName}
              setSenderName={handleSenderNameChange}
            />
          )}

          {(posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit') && (
            <PosCardTenderForm
              posPayMethod={posPayMethod}
              internalCardType={internalCardType}
              selectedBank={selectedBank}
              cardPrefix={cardPrefix}
              cardLast4={cardLast4}
              cardNetwork={cardNetwork}
              approvalCode={approvalCode}
              setInternalCardType={setInternalCardType}
              setPosPayMethod={setPosPayMethod}
              setSelectedBank={setSelectedBank}
              onCardPrefixChange={(val) => setCardPrefix(val.replace(/\D/g, '').slice(0, 8))}
              onCardLast4Change={(val) => setCardLast4(val.replace(/\D/g, '').slice(0, 4))}
              setApprovalCode={setApprovalCode}
            />
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
                onClose()
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
