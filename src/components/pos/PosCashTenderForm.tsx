import React, { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { ACCEPTED_TENDER_CURRENCIES, convertCurrency, getCountryCashPresets, getCurrencySymbol } from '../../utils/countryCashDenominations'
import { formatLocaleNumber, formatMoneyInputDisplay, parseMoneyInput } from '../../utils/localeNumberFormat'
import type { ReviewedPosQuote } from '../../services/financial'

export function PosCashTenderForm({ authoritativeQuote, posCashGiven, setPosCashGiven, grandTotal }: {
  authoritativeQuote?: ReviewedPosQuote | null
  posCashGiven: string
  setPosCashGiven: (value: string) => void
  grandTotal: number
}) {
  const { t, formatPrice, language } = useTranslation()
  const { merchantTheme } = useMerchantConfig()
  const baseCurrency = (merchantTheme as any)?.currency || 'IDR'
  const [tenderCurrency, setTenderCurrency] = useState(baseCurrency)
  useEffect(() => setTenderCurrency(baseCurrency), [baseCurrency])

  const reviewedCashGiven = /^\d+$/.test(posCashGiven) ? BigInt(posCashGiven || '0') : 0n
  const reviewedAmount = authoritativeQuote ? BigInt(authoritativeQuote.amountDueMinor) : null
  const reviewedChange = reviewedAmount === null || reviewedCashGiven < reviewedAmount ? 0n : reviewedCashGiven - reviewedAmount
  const tenderGrandTotal = authoritativeQuote ? 0 : convertCurrency(grandTotal, baseCurrency, tenderCurrency)
  const currencySymbol = getCurrencySymbol(tenderCurrency)
  const cashPresets = authoritativeQuote ? [] : getCountryCashPresets(tenderGrandTotal, tenderCurrency, language)
  const cashGivenNum = parseFloat(posCashGiven) || 0
  const changeAmount = Math.max(0, cashGivenNum - tenderGrandTotal)
  const isForeignTender = !authoritativeQuote && tenderCurrency !== baseCurrency
  const baseCurrencyChange = isForeignTender ? convertCurrency(changeAmount, tenderCurrency, baseCurrency) : 0

  return (
    <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-900">
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cart.tenderCurrencyLabel}</span>
        <div className="flex items-center gap-1">
          {ACCEPTED_TENDER_CURRENCIES.slice(0, 3).map((curr) => {
            const active = tenderCurrency === curr.code
            return <button key={curr.code} type="button"
              disabled={Boolean(authoritativeQuote && curr.code !== authoritativeQuote.currency)}
              onClick={() => {
                if (authoritativeQuote && curr.code !== authoritativeQuote.currency) return
                setTenderCurrency(curr.code)
                setPosCashGiven(convertCurrency(authoritativeQuote ? 0 : grandTotal, baseCurrency, curr.code).toString())
              }}
              className={`px-1.5 py-0.5 rounded-lg text-[9px] font-mono font-bold border transition-all flex items-center gap-1 ${active ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <span>{curr.flag}</span><span>{curr.code}</span>
            </button>
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
        <span>{t.cart.cashGivenPrompt} {isForeignTender && `(${currencySymbol}${tenderGrandTotal})`}</span>
        {(authoritativeQuote ? posCashGiven === authoritativeQuote.amountDueMinor : cashGivenNum === tenderGrandTotal && tenderGrandTotal > 0) && (
          <span className="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> {t.cart.exactCashPaid}
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-1">
        <button type="button" onClick={() => setPosCashGiven(authoritativeQuote?.amountDueMinor ?? tenderGrandTotal.toString())}
          className={`py-1.5 px-0.5 font-mono text-[9px] sm:text-[10px] font-bold rounded-xl border transition-all whitespace-nowrap text-center ${(authoritativeQuote ? posCashGiven === authoritativeQuote.amountDueMinor : cashGivenNum === tenderGrandTotal && tenderGrandTotal > 0) ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          {t.cart.exactCash}
        </button>
        {cashPresets.map((preset) => (
          <button key={preset.value} type="button" onClick={() => setPosCashGiven(preset.value.toString())}
            className={`py-1.5 px-0.5 font-mono text-[10px] font-bold rounded-xl border transition-all whitespace-nowrap text-center ${cashGivenNum === preset.value ? 'bg-indigo-600 text-white border-indigo-500 font-extrabold shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">{currencySymbol}</span>
          <input type="text" inputMode="numeric" value={formatMoneyInputDisplay(posCashGiven, language)}
            onChange={(event) => setPosCashGiven(parseMoneyInput(event.target.value, language))} placeholder="0"
            className="bg-transparent w-full text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none" />
          {posCashGiven && posCashGiven !== '0' && (
            <button type="button" onClick={() => setPosCashGiven('')} title="Hapus"
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-mono font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer">⌫</button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1">
          <button type="button" onClick={() => { const current = posCashGiven || '0'; setPosCashGiven(current === '0' ? '1000' : `${current}000`) }}
            className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm" title="Tambah 000 (Ribuan)">+000</button>
          <button type="button" onClick={() => { const current = posCashGiven || '0'; setPosCashGiven(current === '0' ? '100' : `${current}00`) }}
            className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm" title="Tambah 00 (Ratusan)">+00</button>
          {[10000, 50000].map((increment) => (
            <button key={increment} type="button" onClick={() => {
              if (authoritativeQuote) return setPosCashGiven((reviewedCashGiven + BigInt(increment)).toString())
              setPosCashGiven(((parseFloat(posCashGiven) || 0) + (tenderCurrency === 'IDR' ? increment : increment / 1000)).toString())
            }} className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-amber-500/20 hover:border-amber-500/40 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm">
              +{tenderCurrency === 'IDR' ? `${increment / 1000}rb` : `${currencySymbol}${increment / 1000}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-1.5 text-xs font-bold">
        <span className="text-slate-500 dark:text-slate-400">{t.cart.changeReturn}</span>
        <div className="flex items-baseline gap-1.5 text-right">
          <span className={`font-mono text-sm tabular-nums ${(authoritativeQuote ? reviewedCashGiven >= BigInt(authoritativeQuote.amountDueMinor) : cashGivenNum >= tenderGrandTotal && tenderGrandTotal > 0) ? 'text-amber-800 dark:text-amber-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
            {authoritativeQuote ? BigInt(reviewedChange).toLocaleString('id-ID') : isForeignTender ? `${currencySymbol}${formatLocaleNumber(changeAmount, language, 2, 2)}` : formatPrice(changeAmount)}
          </span>
          {isForeignTender && changeAmount > 0 && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">(Rp {formatLocaleNumber(baseCurrencyChange, language, 0, 0)})</span>}
        </div>
      </div>
    </div>
  )
}
