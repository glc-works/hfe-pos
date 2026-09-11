import React from 'react'
import { QrCode, Hash, ShieldCheck, Check } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export interface PosQrisTenderFormProps {
  selectedProvider: string
  setSelectedProvider: (provider: string) => void
  rrnRefNumber: string
  setRrnRefNumber: (rrn: string) => void
  senderName?: string
  setSenderName?: (name: string) => void
}

export const QRIS_POPULAR_PROVIDERS = [
  'BCA',
  'GoPay',
  'OVO',
  'ShopeePay',
  'Dana',
  'Mandiri',
  'Lainnya'
] as const

export const PosQrisTenderForm: React.FC<PosQrisTenderFormProps> = ({
  selectedProvider,
  setSelectedProvider,
  rrnRefNumber,
  setRrnRefNumber,
  senderName = '',
  setSenderName
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
      {/* Top Header: Badge Stiker QRIS Konter & Provider */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t.cart.qrisIssuerLabel}
          </span>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5" />
          QRIS Statis Konter
        </span>
      </div>

      {/* Provider Quick Pills */}
      <div className="flex flex-wrap gap-1.5">
        {QRIS_POPULAR_PROVIDERS.map((prov) => {
          const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase()
          return (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvider(prov)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
              <span>{prov}</span>
            </button>
          )
        })}
      </div>

      {/* Input RRN / Reference Number */}
      <div className="flex flex-col gap-1 pt-1">
        <label htmlFor="qris-rrn-input" className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-indigo-500" />
            {t.cart.qrisRrnLabel}
          </span>
          <span className="text-[9px] text-slate-400 font-normal">
            ({t.cart.approvalOptional})
          </span>
        </label>
        <input
          id="qris-rrn-input"
          data-testid="input-qris-rrn"
          type="text"
          value={rrnRefNumber}
          onChange={(e) => setRrnRefNumber(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 24))}
          placeholder={t.cart.qrisRrnPlaceholder}
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
        />
        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
          {t.cart.qrisRrnHelper}
        </p>
      </div>

      {/* Optional: Nama Pengirim */}
      {setSenderName && (
        <div className="flex flex-col gap-1 pt-0.5">
          <label htmlFor="qris-sender-name-input" className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Nama Pengirim di Bukti Bayar:</span>
            <span className="text-[9px] text-slate-400 font-normal">
              ({t.cart.approvalOptional})
            </span>
          </label>
          <input
            id="qris-sender-name-input"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Contoh: Budi Santoso (Opsional)"
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  )
}
