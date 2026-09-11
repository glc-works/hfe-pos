import React from 'react'
import { DollarSign, Percent, ShoppingBag, Coins, CreditCard, Banknote, QrCode, Building2 } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { SupportedCurrency } from '../../types/pos'
import { TextInput, Badge } from '@/ui'

export const FinancialTaxPolicyZone: React.FC = () => {
  const { t } = useTranslation()
  const {
    pb1TaxMode,
    setPb1TaxMode,
    takeawaySurcharge,
    setTakeawaySurcharge,
    primaryCurrency,
    setPrimaryCurrency,
    paymentPolicy,
    setPaymentPolicy,
    initialCashFloat,
    setInitialCashFloat,
    enabledPaymentMethods,
    updateEnabledPaymentMethods
  } = useMerchantConfig()

  const CURRENCIES: { code: SupportedCurrency; label: string; symbol: string; flag: string }[] = [
    { code: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    { code: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' }
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {t.settings.zone2Heading}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.settings.zone2Desc}
            </p>
          </div>
        </div>

        <Badge variant="emerald" glyph="🪙">
          PB1: {pb1TaxMode === 1 ? '10% Exclude' : pb1TaxMode === 2 ? '10% Include' : '0% Non-Tax'}
        </Badge>
      </div>

      {/* 1. PB1 RESTAURANT TAX TREATMENT SELECTOR */}
      <div className="flex flex-col gap-2.5">
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            {t.settings.pb1TaxTitle}
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">{t.settings.pb1TaxSub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OPTION 1: EXCLUDE */}
          <button
            type="button"
            onClick={() => setPb1TaxMode(1)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
              pb1TaxMode === 1
                ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/40 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">{t.settings.pb1Exclude}</span>
              {pb1TaxMode === 1 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.pb1ExcludeDesc}</p>
          </button>

          {/* OPTION 2: INCLUDE */}
          <button
            type="button"
            onClick={() => setPb1TaxMode(2)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
              pb1TaxMode === 2
                ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/40 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">{t.settings.pb1Include}</span>
              {pb1TaxMode === 2 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.pb1IncludeDesc}</p>
          </button>

          {/* OPTION 3: DISABLED */}
          <button
            type="button"
            onClick={() => setPb1TaxMode(0)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
              pb1TaxMode === 0
                ? 'bg-slate-800 border-slate-600 text-white ring-1 ring-slate-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{t.settings.pb1Disabled}</span>
              {pb1TaxMode === 0 && <span className="w-2 h-2 rounded-full bg-slate-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.pb1DisabledDesc}</p>
          </button>
        </div>
      </div>

      {/* 2. NUMERIC CONFIGS (TAKEAWAY SURCHARGE, PRIMARY CURRENCY, CASH FLOAT) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* TAKEAWAY SURCHARGE */}
        <div className="flex flex-col gap-1.5">
          <TextInput
            label={t.settings.takeawaySurcharge}
            leadingIcon={<ShoppingBag className="w-4 h-4 text-amber-400" />}
            type="number"
            min={0}
            step={500}
            value={takeawaySurcharge}
            onChange={(e) => setTakeawaySurcharge(Math.max(0, Number(e.target.value) || 0))}
            className="font-mono font-bold"
          />
          <p className="text-[10px] text-slate-500 pl-1">{t.settings.takeawaySurchargeSub}</p>
        </div>

        {/* PRIMARY CURRENCY */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-indigo-400" />
            {t.settings.primaryCurrency}
          </label>
          <select
            value={primaryCurrency}
            onChange={(e) => setPrimaryCurrency(e.target.value as SupportedCurrency)}
            className="min-h-[44px] h-11 bg-slate-950 border border-slate-800 text-indigo-300 text-xs sm:text-sm rounded-xl px-3.5 font-mono font-bold focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} - {c.symbol} ({c.label})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 pl-1">{t.settings.primaryCurrencySub}</p>
        </div>

        {/* INITIAL CASH FLOAT */}
        <div className="flex flex-col gap-1.5">
          <TextInput
            label={t.settings.initialCashFloat}
            leadingIcon={<Banknote className="w-4 h-4 text-emerald-400" />}
            type="number"
            min={0}
            step={50000}
            value={initialCashFloat}
            onChange={(e) => setInitialCashFloat(Math.max(0, Number(e.target.value) || 0))}
            className="font-mono font-bold"
          />
          <p className="text-[10px] text-slate-500 pl-1">{t.settings.initialCashFloatSub}</p>
        </div>
      </div>

      {/* 3. PAYMENT POLICY (PAY FIRST VS OPEN TAB) */}
      <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-800/80">
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            {t.settings.paymentPolicyTitle}
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">{t.settings.paymentPolicySub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentPolicy('pay-first')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
              paymentPolicy === 'pay-first'
                ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">{t.settings.payFirst}</span>
              {paymentPolicy === 'pay-first' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.payFirstDesc}</p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentPolicy('open-tab')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
              paymentPolicy === 'open-tab'
                ? 'bg-indigo-500/15 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400">{t.settings.openTab}</span>
              {paymentPolicy === 'open-tab' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.openTabDesc}</p>
          </button>
        </div>
      </div>

      {/* 4. ENABLED PAYMENT METHODS SELECTOR */}
      <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-800/80">
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            {t.settings.enabledPaymentMethodsTitle}
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">{t.settings.enabledPaymentMethodsSub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CASH */}
          <button
            type="button"
            onClick={() => updateEnabledPaymentMethods({ cash: !enabledPaymentMethods.cash })}
            className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
              enabledPaymentMethods.cash
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Banknote className={`w-4 h-4 ${enabledPaymentMethods.cash ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{t.settings.enableCashTender}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{t.settings.enableCashTenderDesc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-bold shrink-0 ${enabledPaymentMethods.cash ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {enabledPaymentMethods.cash ? 'Aktif' : 'Nonaktif'}
            </span>
          </button>

          {/* QRIS */}
          <button
            type="button"
            onClick={() => updateEnabledPaymentMethods({ qris: !enabledPaymentMethods.qris })}
            className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
              enabledPaymentMethods.qris
                ? 'bg-indigo-500/10 border-indigo-500/50 text-white ring-1 ring-indigo-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <QrCode className={`w-4 h-4 ${enabledPaymentMethods.qris ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{t.settings.enableQrisTender}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{t.settings.enableQrisTenderDesc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-bold shrink-0 ${enabledPaymentMethods.qris ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
              {enabledPaymentMethods.qris ? 'Aktif' : 'Nonaktif'}
            </span>
          </button>

          {/* CARD EDC */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
            enabledPaymentMethods.card
              ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => updateEnabledPaymentMethods({ card: !enabledPaymentMethods.card })}
                className="flex-1 text-left space-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className={`w-4 h-4 ${enabledPaymentMethods.card ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold text-slate-200">{t.settings.enableCardTender}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{t.settings.enableCardTenderDesc}</p>
              </button>
              <button
                type="button"
                onClick={() => updateEnabledPaymentMethods({ card: !enabledPaymentMethods.card })}
                className={`text-xs px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${enabledPaymentMethods.card ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}
              >
                {enabledPaymentMethods.card ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>

            {/* Sub-pills: All vs Debit Only vs CC Only */}
            {enabledPaymentMethods.card && (
              <div className="flex items-center gap-1.5 pt-1 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => updateEnabledPaymentMethods({ cardMode: 'all' })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    (enabledPaymentMethods.cardMode || 'all') === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t.settings.cardModeAll}
                </button>
                <button
                  type="button"
                  onClick={() => updateEnabledPaymentMethods({ cardMode: 'debit_only' })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    enabledPaymentMethods.cardMode === 'debit_only'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t.settings.cardModeDebitOnly}
                </button>
                <button
                  type="button"
                  onClick={() => updateEnabledPaymentMethods({ cardMode: 'credit_only' })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    enabledPaymentMethods.cardMode === 'credit_only'
                      ? 'bg-purple-500 text-white shadow-sm font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t.settings.cardModeCreditOnly}
                </button>
              </div>
            )}
          </div>

          {/* ROOM CHARGE */}
          <button
            type="button"
            onClick={() => updateEnabledPaymentMethods({ roomCharge: !enabledPaymentMethods.roomCharge })}
            className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
              enabledPaymentMethods.roomCharge
                ? 'bg-purple-500/10 border-purple-500/50 text-white ring-1 ring-purple-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className={`w-4 h-4 ${enabledPaymentMethods.roomCharge ? 'text-purple-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{t.settings.enableRoomChargeTender}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{t.settings.enableRoomChargeTenderDesc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-bold shrink-0 ${enabledPaymentMethods.roomCharge ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
              {enabledPaymentMethods.roomCharge ? 'Aktif' : 'Nonaktif'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
