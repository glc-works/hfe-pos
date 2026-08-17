import React from 'react'
import { CreditCard, Building2 } from 'lucide-react'
import { PosPayMethod } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface PosCardTenderFormProps {
  posPayMethod: PosPayMethod
  internalCardType: 'cc' | 'debit'
  selectedBank: string
  cardPrefix: string
  cardLast3: string
  cardNetwork: 'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'other'
  approvalCode: string
  setInternalCardType: (type: 'cc' | 'debit') => void
  setPosPayMethod: (method: PosPayMethod) => void
  setSelectedBank: (bank: string) => void
  onCardPrefixChange: (val: string) => void
  onCardLast3Change: (val: string) => void
  setApprovalCode: (code: string) => void
}

export const PosCardTenderForm: React.FC<PosCardTenderFormProps> = ({
  posPayMethod,
  internalCardType,
  selectedBank,
  cardPrefix,
  cardLast3,
  cardNetwork,
  approvalCode,
  setInternalCardType,
  setPosPayMethod,
  setSelectedBank,
  onCardPrefixChange,
  onCardLast3Change,
  setApprovalCode
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
      {/* CC vs DEBIT TOGGLE */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{t.cart.cardTypeLabel}</span>
        <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setInternalCardType('cc')
              setPosPayMethod('cc')
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              internalCardType === 'cc' || posPayMethod === 'cc' || posPayMethod === 'card'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> {t.cart.payCc}
          </button>
          <button
            type="button"
            onClick={() => {
              setInternalCardType('debit')
              setPosPayMethod('debit')
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              internalCardType === 'debit' || posPayMethod === 'debit'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> {t.cart.payDebit}
          </button>
        </div>
      </div>

      {/* EDC BANK SELECTOR */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{t.cart.cardBankLabel}</span>
        <div className="grid grid-cols-5 gap-1">
          {['BCA', 'Mandiri', 'BRI', 'BNI', 'CIMB'].map((bank) => (
            <button
              key={bank}
              type="button"
              onClick={() => setSelectedBank(bank)}
              className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                selectedBank === bank
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {bank}
            </button>
          ))}
        </div>
      </div>

      {/* CARD PREFIX & SUFFIX & APPROVAL CODE */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase">{t.cart.cardPrefixLabel}</span>
          <input
            type="text"
            maxLength={4}
            value={cardPrefix}
            onChange={(e) => onCardPrefixChange(e.target.value)}
            placeholder="4123"
            className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-100 font-mono text-center placeholder-slate-600 focus:outline-none focus:border-indigo-400 shadow-inner"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase">{t.cart.cardSuffixLabel}</span>
          <input
            type="text"
            maxLength={3}
            value={cardLast3}
            onChange={(e) => onCardLast3Change(e.target.value)}
            placeholder="789"
            className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-100 font-mono text-center placeholder-slate-600 focus:outline-none focus:border-indigo-400 shadow-inner"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase">{t.cart.approvalCodeLabel}</span>
          <input
            type="text"
            maxLength={6}
            value={approvalCode}
            onChange={(e) => setApprovalCode(e.target.value.toUpperCase())}
            placeholder="APPRV1"
            className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-100 font-mono text-center placeholder-slate-600 focus:outline-none focus:border-indigo-400 shadow-inner"
          />
        </div>
      </div>

      {/* LIVE AUTO-DETECTED RECONCILIATION PREVIEW */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-md font-mono tracking-wider shadow-sm shrink-0">
            {cardNetwork}
          </span>
          <span className="text-xs font-mono font-bold text-slate-200 truncate">
            {selectedBank} EDC • {cardPrefix || '****'}-***-{cardLast3 || '***'}
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          Auto-Detected
        </span>
      </div>
    </div>
  )
}
