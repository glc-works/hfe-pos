import React, { useState, useEffect } from 'react'
import { ShoppingBag, Coffee, Calculator, Minus, Plus, Trash2, Banknote, QrCode, CreditCard, CheckCircle2, Scissors, Building2 } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, CardTenderMetadata } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import {
  getCountryCashPresets,
  ACCEPTED_TENDER_CURRENCIES,
  convertCurrency,
  getCurrencySymbol
} from '../../utils/countryCashDenominations'
import {
  formatMoneyInputDisplay,
  parseMoneyInput,
  formatLocaleNumber
} from '../../utils/localeNumberFormat'
import { PosCardTenderForm } from './PosCardTenderForm'

export interface PosCartSectionProps {
  cartItems: CartItem[]
  selectedPOSTable: TableStatus | null
  posPayMethod: PosPayMethod
  posCashGiven: string
  subtotal: number
  pb1Tax: number
  grandTotal: number
  hideHeader?: boolean
  cardMetadata?: CardTenderMetadata
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  setCardMetadata?: (meta: CardTenderMetadata) => void
  onUpdateQty: (index: number, qty: number) => void
  onOpenDirectQtyModal: (item: CartItem, index: number) => void
  onCheckout: () => void
  onOpenSplitPayment?: () => void
  onSwitchToCatalog?: () => void
}

export const PosCartSection: React.FC<PosCartSectionProps> = ({
  cartItems,
  selectedPOSTable,
  posPayMethod,
  posCashGiven,
  subtotal,
  pb1Tax,
  grandTotal,
  hideHeader = false,
  setPosPayMethod,
  setPosCashGiven,
  onUpdateQty,
  onOpenDirectQtyModal,
  onCheckout,
  onOpenSplitPayment,
  onSwitchToCatalog
}) => {
  const { t, formatPrice, language } = useTranslation()
  const { merchantTheme } = useMerchantConfig()
  const baseCurrency = (merchantTheme as any)?.currency || 'IDR'
  const [tenderCurrency, setTenderCurrency] = useState<string>(baseCurrency)

  useEffect(() => {
    setTenderCurrency(baseCurrency)
  }, [baseCurrency])

  const tenderGrandTotal = convertCurrency(grandTotal, baseCurrency, tenderCurrency)
  const currencySymbol = getCurrencySymbol(tenderCurrency)
  const cashPresets = getCountryCashPresets(tenderGrandTotal, tenderCurrency, language)
  const cashGivenNum = parseFloat(posCashGiven) || 0
  const changeAmount = Math.max(0, cashGivenNum - tenderGrandTotal)
  const isForeignTender = tenderCurrency !== baseCurrency
  const baseCurrencyChange = isForeignTender ? convertCurrency(changeAmount, tenderCurrency, baseCurrency) : 0

  // Internal Card Metadata state
  const [internalCardType, setInternalCardType] = useState<'cc' | 'debit'>(
    posPayMethod === 'debit' ? 'debit' : 'cc'
  )
  const [selectedBank, setSelectedBank] = useState<string>('BCA')
  const [cardPrefix, setCardPrefix] = useState<string>('45563321')
  const [cardLast4, setCardLast4] = useState<string>('9876')
  const [cardNetwork, setCardNetwork] = useState<'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'discover' | 'unionpay' | 'other'>('visa')
  const [approvalCode, setApprovalCode] = useState<string>('')

  const handleCardPrefixChange = (val: string) => setCardPrefix(val.replace(/\D/g, '').slice(0, 8))
  const handleCardLast4Change = (val: string) => setCardLast4(val.replace(/\D/g, '').slice(0, 4))

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl h-full min-h-0 overflow-hidden">
      {/* HEADER KERANJANG (PINNED TOP, HIDDEN WHEN IN MOBILE DRAWER) */}
      {!hideHeader && (
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {t.cart.cashierCart}
          </h3>
          <div className="flex items-center gap-2">
            {onSwitchToCatalog && (
              <button
                type="button"
                onClick={onSwitchToCatalog}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Tambah Menu ke Keranjang"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Menu</span>
              </button>
            )}
            {selectedPOSTable && (
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-xl border border-amber-500/30">
                {selectedPOSTable.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* DAFTAR ITEM KERANJANG (INTERNAL SCROLL OWNER) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 my-1.5 flex flex-col gap-2">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-center text-slate-400 dark:text-slate-500 text-xs gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-amber-500 dark:text-amber-400/80">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.cart.emptyCartTitle}</span>
              <span className="text-[10px] text-slate-500">Pilih menu dari katalog atau shortcut favorit</span>
            </div>
            {onSwitchToCatalog && (
              <button
                type="button"
                onClick={onSwitchToCatalog}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buka Katalog Menu</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {cartItems.map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap shrink-0">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDirectQtyModal(item, idx)}
                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
                  >
                    <Calculator className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" /> {item.quantity}x
                  </button>
                  <button type="button" onClick={() => onUpdateQty(idx, item.quantity - 1)} className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => onUpdateQty(idx, item.quantity + 1)} className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(idx, 0)}
                    className="p-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 bg-slate-200 dark:bg-slate-800 rounded-lg transition-all shrink-0"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {onSwitchToCatalog && (
              <button
                type="button"
                onClick={onSwitchToCatalog}
                className="w-full py-1.5 border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98 mt-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Menu Lainnya</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* RINGKASAN SUB-TOTAL & METODE BAYAR (PINNED BOTTOM) */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 pt-2 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t.cart.subtotal}</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t.cart.pb1Tax}</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">{formatPrice(pb1Tax)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-2">
          <span>{t.cart.totalBill}</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">{formatPrice(grandTotal)}</span>
        </div>

        {/* METODE BAYAR (3 METODE UTAMA: CASH / QRIS / KARTU - STRICT SINGLE LINE) */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setPosPayMethod('cash')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'cash'
                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCash}</span>
          </button>
          <button
            type="button"
            onClick={() => setPosPayMethod('qris')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'qris'
                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payQris}</span>
          </button>
          <button
            type="button"
            onClick={() => setPosPayMethod('card')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit'
                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCard}</span>
          </button>
        </div>

        {/* CARD SETTLEMENT METADATA BOX (CC / DEBIT) FOR ACCOUNTING AUDIT */}
        {(posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit') && (
          <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Detail EDC & Settlement Akuntansi
              </span>
            </div>

            {/* EDC CARD TENDER FORM */}
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
              onCardPrefixChange={handleCardPrefixChange}
              onCardLast4Change={handleCardLast4Change}
              setApprovalCode={setApprovalCode}
            />
          </div>
        )}

        {/* BAR TOMBOL UANG CEPAT (Jika Cash) */}
        {posPayMethod === 'cash' && (
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            {/* TENDER CURRENCY SELECTOR (KISS MULTI-CURRENCY) */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Mata Uang Diterima:
              </span>
              <div className="flex items-center gap-1">
                {ACCEPTED_TENDER_CURRENCIES.slice(0, 3).map((curr) => {
                  const isCurActive = tenderCurrency === curr.code
                  return (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setTenderCurrency(curr.code)
                        const converted = convertCurrency(grandTotal, baseCurrency, curr.code)
                        setPosCashGiven(converted.toString())
                      }}
                      className={`px-1.5 py-0.5 rounded-lg text-[9px] font-mono font-bold border transition-all flex items-center gap-1 ${
                        isCurActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span>{t.cart.cashGivenPrompt} {isForeignTender && `(${currencySymbol}${tenderGrandTotal})`}</span>
              {cashGivenNum === tenderGrandTotal && tenderGrandTotal > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {t.cart.exactCashPaid}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => setPosCashGiven(tenderGrandTotal.toString())}
                className={`py-1.5 px-0.5 font-mono text-[9px] sm:text-[10px] font-bold rounded-xl border transition-all whitespace-nowrap text-center ${
                  cashGivenNum === tenderGrandTotal && tenderGrandTotal > 0
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.cart.exactCash}
              </button>
              {cashPresets.map((preset) => {
                const isSelected = cashGivenNum === preset.value
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPosCashGiven(preset.value.toString())}
                    className={`py-1.5 px-0.5 font-mono text-[10px] font-bold rounded-xl border transition-all whitespace-nowrap text-center ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-400 font-extrabold shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {/* INPUT NOMINAL UANG TUNAI MANUAL & SPEED KEYS */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatMoneyInputDisplay(posCashGiven, language)}
                  onChange={(e) => {
                    const raw = parseMoneyInput(e.target.value, language)
                    setPosCashGiven(raw)
                  }}
                  placeholder="0"
                  className="bg-transparent w-full text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                />
                {posCashGiven && posCashGiven !== '0' && (
                  <button
                    type="button"
                    onClick={() => setPosCashGiven('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-mono font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                    title="Hapus"
                  >
                    ⌫
                  </button>
                )}
              </div>

              {/* SPEED MULTIPLIER BUTTONS (000, 00, +10k, +50k) */}
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const current = posCashGiven || '0'
                    setPosCashGiven(current === '0' ? '1000' : `${current}000`)
                  }}
                  className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm"
                  title="Tambah 000 (Ribuan)"
                >
                  +000
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = posCashGiven || '0'
                    setPosCashGiven(current === '0' ? '100' : `${current}00`)
                  }}
                  className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm"
                  title="Tambah 00 (Ratusan)"
                >
                  +00
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = parseFloat(posCashGiven) || 0
                    const increment = tenderCurrency === 'IDR' ? 10000 : 10
                    setPosCashGiven((val + increment).toString())
                  }}
                  className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-amber-500/20 hover:border-amber-500/40 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm"
                >
                  +{tenderCurrency === 'IDR' ? '10rb' : `${currencySymbol}10`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = parseFloat(posCashGiven) || 0
                    const increment = tenderCurrency === 'IDR' ? 50000 : 50
                    setPosCashGiven((val + increment).toString())
                  }}
                  className="py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-amber-500/20 hover:border-amber-500/40 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm"
                >
                  +{tenderCurrency === 'IDR' ? '50rb' : `${currencySymbol}50`}
                </button>
              </div>
            </div>

            {/* KEMBALIAN PELANGGAN */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-1.5 text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">{t.cart.changeReturn}</span>
              <div className="flex items-baseline gap-1.5 text-right">
                <span
                  className={`font-mono text-sm tabular-nums ${
                    cashGivenNum >= tenderGrandTotal && tenderGrandTotal > 0
                      ? 'text-amber-600 dark:text-amber-400 font-black'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isForeignTender
                    ? `${currencySymbol}${formatLocaleNumber(changeAmount, language, 2, 2)}`
                    : formatPrice(changeAmount)}
                </span>
                {isForeignTender && changeAmount > 0 && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    (Rp {formatLocaleNumber(baseCurrencyChange, language, 0, 0)})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOMBOL AKSI UTAMA: SPLIT BILL & CHECKOUT PROCESS */}
        <div className="flex items-center gap-2 pt-1">
          {onOpenSplitPayment && (
            <button
              type="button"
              onClick={onOpenSplitPayment}
              className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 whitespace-nowrap"
              title="Split Tagihan per Meja / Kursi"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>{t.cart.splitBill}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCheckout}
            disabled={cartItems.length === 0 && (!selectedPOSTable || selectedPOSTable.totalBill === 0)}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 touch-manipulation whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{t.cart.processPayment}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
