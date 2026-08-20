import React, { useRef } from 'react'
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, Hash } from 'lucide-react'
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
  const effectiveLast4 = cardLast4 || cardLast3
  const binInfo = identifyCardBin(cardPrefix)

  // Combined card number string: e.g. "455633219876"
  const fullNumberRaw = (cardPrefix + effectiveLast4).replace(/\D/g, '')

  const handleFullNumberChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 16)
    const newPrefix = digitsOnly.slice(0, 8)
    const newSuffix = digitsOnly.slice(8, 12)

    onCardPrefixChange(newPrefix)
    if (onCardLast4Change) onCardLast4Change(newSuffix)
    else if (onCardLast3Change) onCardLast3Change(newSuffix)

    if (newPrefix.length >= 4) {
      const detected = identifyCardBin(newPrefix)
      if (detected.bankName !== 'Bank Umum') {
        setSelectedBank(detected.bankName)
      }
      setInternalCardType(detected.cardType === 'credit' ? 'cc' : 'debit')
      setPosPayMethod(detected.cardType === 'credit' ? 'cc' : 'debit')
    }
  }

  // Format 12-16 digits with spaces: "4556 3321 9876"
  const formatCardInputDisplay = (val: string) => {
    const digits = val.replace(/\D/g, '')
    const parts: string[] = []
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4))
    }
    return parts.join(' ')
  }

  // Formatted masked preview
  const formattedPrefix = cardPrefix.length > 4 ? `${cardPrefix.slice(0, 4)} ${cardPrefix.slice(4)}` : cardPrefix

  return (
    <div className="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
      {/* 1. FULL-WIDTH CARD NUMBER INPUT (NATURAL 8+4 DIGITS AUTO-SPACED) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            Nomor Kartu (8 Depan + 4 Belakang)
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            {fullNumberRaw.length}/12 Digit
          </span>
        </label>

        <input
          type="text"
          inputMode="numeric"
          value={formatCardInputDisplay(fullNumberRaw)}
          onChange={(e) => handleFullNumberChange(e.target.value)}
          placeholder="4556 3321 9876"
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-white font-mono text-center placeholder-slate-600 focus:outline-none shadow-inner tracking-widest font-bold"
        />
      </div>

      {/* 2. LIVE SMART CARD VISUAL BADGE (HIGH CONTRAST & AUTO-DETECTED) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[10px] font-mono font-black uppercase text-white bg-indigo-600 px-2 py-0.5 rounded-md shadow-sm">
              {binInfo.network.toUpperCase()}
            </span>
            <span className="text-xs font-black text-white truncate">
              {binInfo.bankName}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              • {binInfo.cardTier}
            </span>
          </div>

          <span
            className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border shadow-sm shrink-0 ${
              binInfo.cardType === 'credit'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {binInfo.cardType === 'credit' ? 'Kartu Kredit' : 'Kartu Debit'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs font-mono font-bold text-slate-200 tracking-widest">
            {formattedPrefix || '•••• ••••'} •••• {effectiveLast4 || '••••'}
          </span>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{approvalCode ? `Appr: ${approvalCode}` : 'Terverifikasi'}</span>
          </div>
        </div>
      </div>

      {/* 3. OPTIONAL EDC APPROVAL CODE (CLEAN SECONDARY ROW) */}
      <div className="flex flex-col gap-1 pt-0.5">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-amber-400" />
            Kode Approval EDC (Opsional dari Slip Mesin)
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Bila ada</span>
        </label>
        <input
          type="text"
          maxLength={8}
          value={approvalCode}
          onChange={(e) => setApprovalCode(e.target.value.toUpperCase())}
          placeholder="Contoh: 882104"
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono text-center placeholder-slate-600 focus:outline-none shadow-inner font-bold tracking-wider"
        />
      </div>
    </div>
  )
}
export default PosCardTenderForm
