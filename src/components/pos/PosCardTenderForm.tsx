import React from 'react'
import { CreditCard, CheckCircle2, Hash } from 'lucide-react'
import { PosPayMethod } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { identifyCardBin } from '../../utils/cardBinEngine'

export interface PosCardTenderFormProps {
  posPayMethod: PosPayMethod
  internalCardType: 'cc' | 'debit'
  selectedBank: string
  cardPrefix: string
  cardLast3?: string
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
  posPayMethod: _posPayMethod,
  internalCardType: _internalCardType,
  selectedBank: _selectedBank,
  cardPrefix,
  cardLast3 = '',
  cardLast4 = '',
  cardNetwork: _cardNetwork,
  approvalCode,
  setInternalCardType,
  setPosPayMethod,
  setSelectedBank,
  onCardPrefixChange,
  onCardLast3Change,
  onCardLast4Change,
  setApprovalCode,
}) => {
  const { t } = useTranslation()
  const effectiveLast4 = cardLast4 || cardLast3
  const binInfo = identifyCardBin(cardPrefix)

  // Combined card number digits: up to 16 digits
  const fullNumberRaw = (cardPrefix + effectiveLast4).replace(/\D/g, '').slice(0, 16)

  const handleFullNumberChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 16)
    const newPrefix = digitsOnly.slice(0, Math.min(8, digitsOnly.length))
    const newSuffix = digitsOnly.length > 8 ? digitsOnly.slice(8) : ''

    onCardPrefixChange(newPrefix)
    if (onCardLast4Change) onCardLast4Change(newSuffix)
    else if (onCardLast3Change) onCardLast3Change(newSuffix)

    if (newPrefix.length >= 4) {
      const detected = identifyCardBin(newPrefix)
      if (detected.bankName !== 'Bank Umum') {
        setSelectedBank(detected.bankName)
      }
      const resolvedType = detected.cardType === 'credit' ? 'cc' : 'debit'
      setInternalCardType(resolvedType)
      setPosPayMethod(resolvedType)
    }
  }

  // Format 16 digits with spaces: "4556 3321 8899 9876"
  const formatCardInputDisplay = (val: string) => {
    const digits = val.replace(/\D/g, '')
    const parts: string[] = []
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4))
    }
    return parts.join(' ')
  }

  return (
    <div className="flex flex-col gap-2">
      {/* SINGLE UNIFIED INTERACTIVE VIRTUAL CARD */}
      <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl flex flex-col gap-3">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: Network Badge + Bank & Tier + Instrument Pill */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-mono font-black uppercase text-white bg-indigo-600 px-2 py-0.5 rounded-md shadow-sm shrink-0">
              {binInfo.network.toUpperCase()}
            </span>
            <span className="text-xs font-black text-white truncate">
              {binInfo.bankName}
            </span>
            <span className="text-[10px] font-mono text-slate-300 font-bold truncate">
              • {binInfo.cardTier}
            </span>
          </div>

          <span
            className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border shadow-sm shrink-0 ${
              binInfo.cardType === 'credit'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
            }`}
          >
            {binInfo.cardType === 'credit' ? t.cart.creditCardBadge : t.cart.debitCardBadge}
          </span>
        </div>

        {/* Card Center: Unified In-Situ Card Number Input */}
        <div className="flex flex-col gap-1 relative z-10">
          <div className="relative flex items-center">
            <CreditCard className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              value={formatCardInputDisplay(fullNumberRaw)}
              onChange={(e) => handleFullNumberChange(e.target.value)}
              placeholder="4556 3321 •••• 9876"
              className="w-full bg-slate-950/60 border border-indigo-500/40 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 rounded-xl pl-9 pr-3 py-2 text-sm sm:text-base text-white font-mono text-center placeholder-slate-500 focus:outline-none shadow-inner tracking-widest font-bold"
            />
          </div>
        </div>

        {/* Card Footer: Live Verification Status + Inline EDC Approval Code */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/60 relative z-10">
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.cart.cardVerified}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-0.5">
              <Hash className="w-3 h-3 text-amber-400" />
              Trace:
            </span>
            <input
              type="text"
              maxLength={8}
              value={approvalCode}
              onChange={(e) => setApprovalCode(e.target.value.toUpperCase())}
              placeholder="882104"
              className="w-20 bg-slate-950/70 border border-slate-700 focus:border-amber-400 rounded-lg px-2 py-0.5 text-[11px] text-amber-300 font-mono text-center placeholder-slate-600 focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosCardTenderForm
