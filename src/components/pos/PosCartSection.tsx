import React, { useState } from 'react'
import { ShoppingBag, Coffee, Calculator, Minus, Plus, Trash2, Banknote, QrCode, CreditCard, CheckCircle2, Scissors, Building2 } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, CardTenderMetadata } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { getCountryCashPresets } from '../../utils/countryCashDenominations'

export interface PosCartSectionProps {
  cartItems: CartItem[]
  selectedPOSTable: TableStatus | null
  posPayMethod: PosPayMethod
  posCashGiven: string
  subtotal: number
  pb1Tax: number
  grandTotal: number
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
  const currency = (merchantTheme as any)?.currency || (language === 'en' ? 'USD' : 'IDR')
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'SGD' ? 'S$' : currency === 'MYR' ? 'RM' : currency === 'JPY' ? '¥' : 'Rp'
  const cashPresets = getCountryCashPresets(grandTotal, currency, language)
  const cashGivenNum = parseFloat(posCashGiven) || 0
  const changeAmount = Math.max(0, cashGivenNum - grandTotal)

  // Internal Card Metadata state
  const [internalCardType, setInternalCardType] = useState<'cc' | 'debit'>(
    posPayMethod === 'debit' ? 'debit' : 'cc'
  )
  const [selectedBank, setSelectedBank] = useState<string>('BCA')
  const [cardPrefix, setCardPrefix] = useState<string>('4123')
  const [cardLast3, setCardLast3] = useState<string>('789')
  const [cardTier, setCardTier] = useState<string>('World')
  const [cardNetwork, setCardNetwork] = useState<'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'other'>('visa')
  const [approvalCode, setApprovalCode] = useState<string>('')

  const handleCardPrefixChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4)
    setCardPrefix(cleaned)

    // Auto-detect network from first digits
    if (cleaned.startsWith('4')) {
      setCardNetwork('visa')
    } else if (cleaned.startsWith('51') || cleaned.startsWith('52') || cleaned.startsWith('53') || cleaned.startsWith('54') || cleaned.startsWith('55') || cleaned.startsWith('2')) {
      setCardNetwork('mastercard')
    } else if (cleaned.startsWith('5899') || cleaned.startsWith('1946') || cleaned.startsWith('60')) {
      setCardNetwork('gpn')
    } else if (cleaned.startsWith('34') || cleaned.startsWith('37')) {
      setCardNetwork('amex')
    } else if (cleaned.startsWith('35')) {
      setCardNetwork('jcb')
    }
  }

  const handleCardLast3Change = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 3)
    setCardLast3(cleaned)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl h-full min-h-0 overflow-hidden">
      {/* HEADER KERANJANG (PINNED TOP) */}
      <div className="shrink-0 flex items-center justify-between border-b border-slate-800 pb-2.5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-indigo-400" /> {t.cart.cashierCart}
        </h3>
        <div className="flex items-center gap-2">
          {onSwitchToCatalog && (
            <button
              type="button"
              onClick={onSwitchToCatalog}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Tambah Menu ke Keranjang"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Menu</span>
            </button>
          )}
          {selectedPOSTable && (
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-xl border border-amber-500/30">
              {selectedPOSTable.name}
            </span>
          )}
        </div>
      </div>

      {/* DAFTAR ITEM KERANJANG (INTERNAL SCROLL OWNER) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 my-1.5 flex flex-col gap-2">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-center text-slate-500 text-xs gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400/80">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-300">{t.cart.emptyCartTitle}</span>
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
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-200 truncate">{item.name}</h5>
                  <p className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDirectQtyModal(item, idx)}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
                  >
                    <Calculator className="w-3 h-3 text-slate-400 shrink-0" /> {item.quantity}x
                  </button>
                  <button type="button" onClick={() => onUpdateQty(idx, item.quantity - 1)} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg shrink-0">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => onUpdateQty(idx, item.quantity + 1)} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg shrink-0">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(idx, 0)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 bg-slate-800 rounded-lg transition-all shrink-0"
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
                className="w-full py-1.5 border border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-xl text-slate-400 hover:text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98 mt-1"
              >
                <Plus className="w-3 h-3" />
                <span>+ Tambah Menu Lainnya</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* RINGKASAN SUB-TOTAL & METODE BAYAR (PINNED BOTTOM) */}
      <div className="shrink-0 border-t border-slate-800 pt-2 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{t.cart.subtotal}</span>
          <span className="font-mono text-slate-200 whitespace-nowrap shrink-0">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>{t.cart.pb1Tax}</span>
          <span className="font-mono text-slate-300 whitespace-nowrap shrink-0">{formatPrice(pb1Tax)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-2">
          <span>{t.cart.totalBill}</span>
          <span className="font-mono text-emerald-400 whitespace-nowrap shrink-0">{formatPrice(grandTotal)}</span>
        </div>

        {/* METODE BAYAR (3 METODE UTAMA: CASH / QRIS / KARTU - STRICT SINGLE LINE) */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setPosPayMethod('cash')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'cash' ? 'bg-white border-white text-slate-950 shadow-md font-extrabold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCash}</span>
          </button>
          <button
            type="button"
            onClick={() => setPosPayMethod('qris')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'qris' ? 'bg-white border-white text-slate-950 shadow-md font-extrabold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payQris}</span>
          </button>
          <button
            type="button"
            onClick={() => setPosPayMethod('card')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit'
                ? 'bg-white border-white text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCard}</span>
          </button>
        </div>

        {/* CARD SETTLEMENT METADATA BOX (CC / DEBIT) FOR ACCOUNTING AUDIT */}
        {(posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit') && (
          <div className="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-bold text-amber-400 font-mono flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-400" />
                Detail EDC & Settlement Akuntansi
              </span>
            </div>

            {/* PILIH TIPE KARTU: CC VS DEBIT */}
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
                  onChange={(e) => handleCardPrefixChange(e.target.value)}
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
                  onChange={(e) => handleCardLast3Change(e.target.value)}
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

            {/* LIVE AUTO-DETECTED RECONCILIATION PREVIEW (ZERO MANUAL JARINGAN SELECTION) */}
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
        )}

        {/* BAR TOMBOL UANG CEPAT (Jika Cash) */}
        {posPayMethod === 'cash' && (
          <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>{t.cart.cashGivenPrompt}</span>
              {cashGivenNum === grandTotal && grandTotal > 0 && (
                <span className="text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {t.cart.exactCashPaid}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => setPosCashGiven(grandTotal.toString())}
                className={`py-1.5 px-0.5 font-mono text-[9px] sm:text-[10px] font-bold rounded-xl border transition-all whitespace-nowrap text-center ${
                  cashGivenNum === grandTotal && grandTotal > 0
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
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
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {/* INPUT NOMINAL UANG TUNAI MANUAL */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">{currencySymbol}</span>
              <input
                type="number"
                value={posCashGiven}
                onChange={(e) => setPosCashGiven(e.target.value)}
                placeholder="0"
                className="bg-transparent w-full text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* KEMBALIAN PELANGGAN */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-xs font-bold">
              <span className="text-slate-400">{t.cart.changeReturn}</span>
              <span
                className={`font-mono text-sm ${
                  cashGivenNum >= grandTotal && grandTotal > 0
                    ? 'text-amber-400 font-black'
                    : 'text-slate-500'
                }`}
              >
                {formatPrice(changeAmount)}
              </span>
            </div>
          </div>
        )}

        {/* TOMBOL AKSI UTAMA: SPLIT BILL & CHECKOUT PROCESS */}
        <div className="flex items-center gap-2 pt-1">
          {onOpenSplitPayment && (
            <button
              type="button"
              onClick={onOpenSplitPayment}
              className="py-3 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 whitespace-nowrap"
              title="Split Tagihan per Meja / Kursi"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
