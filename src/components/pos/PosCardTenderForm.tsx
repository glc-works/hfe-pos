import React, { useRef } from 'react'
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { PosPayMethod } from '../../types/pos'
import { identifyCardBin, CardNetworkType, CardInstrumentType } from '../../utils/cardBinEngine'

export interface PosCardTenderFormProps {
  posPayMethod: PosPayMethod
  internalCardType: 'cc' | 'debit'
  selectedBank: string
  cardPrefix: string
  cardLast3?: string // backwards compatibility alias
  cardLast4?: string
  cardNetwork: 'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'discover' | 'unionpay' | 'other'
  approvalCode: string
  setInternalCardType: (type: 'cc' | 'debit') => void
  setPosPayMethod: (method: PosPayMethod) => void
  setSelectedBank: (bank: string) => void
  onCardPrefixChange: (val: string) => void
  onCardLast3Change?: (val: string) => void
  onCardLast4Change?: (val: string) => void
  setApprovalCode: (code: string) => void
}

export const PosCardTenderForm: React.FC<PosCardTenderFormProps> = ({
  posPayMethod,
  internalCardType,
  selectedBank,
  cardPrefix,
  cardLast3 = '',
  cardLast4 = '',
  cardNetwork,
  approvalCode,
  setInternalCardType,
  setPosPayMethod,
  setSelectedBank,
  onCardPrefixChange,
  onCardLast3Change,
  onCardLast4Change,
  setApprovalCode
}) => {
  const last4Ref = useRef<HTMLInputElement | null>(null)
  const approvalRef = useRef<HTMLInputElement | null>(null)

  const effectiveLast4 = cardLast4 || cardLast3
  const binInfo = identifyCardBin(cardPrefix)

  const handlePrefixChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 8)
    onCardPrefixChange(cleaned)

    if (cleaned.length >= 4) {
      const detected = identifyCardBin(cleaned)
      if (detected.bankName !== 'Bank Umum') {
        setSelectedBank(detected.bankName)
      }
      setInternalCardType(detected.cardType === 'credit' ? 'cc' : 'debit')
      setPosPayMethod(detected.cardType === 'credit' ? 'cc' : 'debit')
    }

    // Auto-advance focus to Last 4 digits when 8 digits filled
    if (cleaned.length === 8 && last4Ref.current) {
      last4Ref.current.focus()
    }
  }

  const handleLast4Change = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 4)
    if (onCardLast4Change) onCardLast4Change(cleaned)
    else if (onCardLast3Change) onCardLast3Change(cleaned)

    // Auto-advance to approval code when 4 digits filled
    if (cleaned.length === 4 && approvalRef.current) {
      approvalRef.current.focus()
    }
  }

  // Format 8-digit BIN nicely with space: "4556 3321"
  const formattedPrefix = cardPrefix.length > 4 ? `${cardPrefix.slice(0, 4)} ${cardPrefix.slice(4)}` : cardPrefix

  return (
    <div className="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
      {/* 1. CLEAN 3-COLUMN INPUT STRIP (ZERO BUTTON CLUTTER) */}
      <div className="grid grid-cols-12 gap-2">
        {/* 8 DIGITS PREFIX (BIN / IIN) */}
        <div className="col-span-5 flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-indigo-400" /> 8 Digit Depan
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={cardPrefix}
            onChange={(e) => handlePrefixChange(e.target.value)}
            placeholder="45563321"
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-2 text-xs text-white font-mono text-center placeholder-slate-600 focus:outline-none shadow-inner tracking-wider"
          />
        </div>

        {/* 4 DIGITS LAST (PHYSICAL VERIFICATION) */}
        <div className="col-span-3 flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            4 Belakang
          </label>
          <input
            ref={last4Ref}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={effectiveLast4}
            onChange={(e) => handleLast4Change(e.target.value)}
            placeholder="9876"
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-2 py-2 text-xs text-white font-mono text-center placeholder-slate-600 focus:outline-none shadow-inner tracking-wider"
          />
        </div>

        {/* APPROVAL CODE (FROM EDC SLIP) */}
        <div className="col-span-4 flex flex-col gap-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Approval EDC
          </label>
          <input
            ref={approvalRef}
            type="text"
            maxLength={8}
            value={approvalCode}
            onChange={(e) => setApprovalCode(e.target.value.toUpperCase())}
            placeholder="882104"
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-2 py-2 text-xs text-amber-300 font-mono text-center placeholder-slate-600 focus:outline-none shadow-inner font-bold"
          />
        </div>
      </div>

      {/* 2. LIVE SMART CARD VISUAL BADGE (AUTO-DETECTED 100%) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[10px] font-mono font-black uppercase text-white bg-indigo-600 px-2 py-0.5 rounded-md shadow-sm">
              {binInfo.network.toUpperCase()}
            </span>
            <span className="text-xs font-extrabold text-white truncate">
              {binInfo.bankName}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              • {binInfo.cardTier}
            </span>
          </div>

          <span
            className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
              binInfo.cardType === 'credit'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {binInfo.cardType === 'credit' ? 'Kartu Kredit' : 'Kartu Debit'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-800/80">
          <span className="text-xs font-mono font-bold text-slate-200 tracking-widest">
            {formattedPrefix || '•••• ••••'} •••• {effectiveLast4 || '••••'}
          </span>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{approvalCode ? `Appr: ${approvalCode}` : 'Siap Diproses'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
