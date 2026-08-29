import React, { lazy, Suspense, useState } from 'react'
import { ShoppingBag, Coffee, Calculator, Minus, Plus, Trash2, Banknote, QrCode, CreditCard, CheckCircle2, Scissors, UtensilsCrossed, Bike } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, CardTenderMetadata, OrderFulfillmentMode } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { SegmentedControl, Button } from '@/ui'
import { GLYPHS } from '../../tokens/designTokens'

import type { ReviewedPosQuote } from '../../services/financial'
import type { GovernedCheckoutPhase } from '../../hooks/useCafeSettlement'
import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'
import { formatExactMinorCurrency } from '../../utils/localeNumberFormat'
const PosCardTenderForm = lazy(() => import('./PosCardTenderForm').then(({ PosCardTenderForm }) => ({ default: PosCardTenderForm })))
const PosCashTenderForm = lazy(() => import('./PosCashTenderForm').then(({ PosCashTenderForm }) => ({ default: PosCashTenderForm })))
export interface PosCartSectionProps {
  cartItems: CartItem[]
  selectedPOSTable: TableStatus | null
  posPayMethod: PosPayMethod
  posCashGiven: string
  subtotal: number
  pb1Tax: number
  grandTotal: number
  packagingFee?: number
  fulfillmentMode?: OrderFulfillmentMode
  hideHeader?: boolean
  cardMetadata?: CardTenderMetadata
  authoritativeQuote?: ReviewedPosQuote | null
  checkoutPhase?: GovernedCheckoutPhase
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  setFulfillmentMode?: (mode: OrderFulfillmentMode) => void
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
  packagingFee = 0,
  fulfillmentMode = 'dine_in',
  hideHeader = false,
  authoritativeQuote,
  checkoutPhase,
  setPosPayMethod,
  setPosCashGiven,
  setFulfillmentMode,
  onUpdateQty,
  onOpenDirectQtyModal,
  onCheckout,
  onOpenSplitPayment,
  onSwitchToCatalog
}) => {
  const { t, formatPrice, language } = useTranslation()

  const formatExactMinor = (value: string) => formatExactMinorCurrency(value, authoritativeQuote!.currency, language)
  const reviewReady = checkoutPhase?.kind === 'review'
  const connectedRuntime = isConnectedFirstPartyRuntime()
  const awaitingCoreQuote = connectedRuntime && !authoritativeQuote
  const isTenderEligible = (tenderType: 'cash' | 'qris') => !authoritativeQuote || (
    authoritativeQuote.tenderEligibility.filter((entry) => entry.tenderType === tenderType).length === 1 &&
    authoritativeQuote.tenderEligibility.some((entry) => entry.tenderType === tenderType && entry.eligible)
  )
  const isCardEligible = !connectedRuntime && !authoritativeQuote
  const unavailableTenderClass = 'opacity-40 cursor-not-allowed'

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
      <SegmentedControl
        options={[
          { value: 'dine_in', label: t.cart.dineInModeLabel, icon: GLYPHS.DINE_IN },
          { value: 'takeaway', label: t.cart.takeawayModeLabel, icon: GLYPHS.TAKEAWAY },
          { value: 'delivery', label: t.cart.deliveryModeLabel, icon: GLYPHS.DELIVERY }
        ]}
        value={fulfillmentMode}
        onChange={(val) => setFulfillmentMode?.(val as OrderFulfillmentMode)}
        size="sm"
        className="mb-1.5 shrink-0"
      />

      {!hideHeader && (
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {t.cart.cashierCart}
          </h3>
          <div className="flex items-center gap-2">
            {onSwitchToCatalog && (
              <button
                type="button"
                onClick={onSwitchToCatalog}
                className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 bg-amber-100 dark:bg-amber-500/10 hover:bg-amber-200 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Tambah Menu ke Keranjang"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.cart.addMoreMenu}</span>
              </button>
            )}
            {selectedPOSTable && fulfillmentMode === 'dine_in' && (
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-xl border border-amber-300 dark:border-amber-500/30">
                {selectedPOSTable.name}
              </span>
            )}
          </div>
        </div>
      )}

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
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap shrink-0">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDirectQtyModal(item, idx)}
                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
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
                <span>{t.cart.addMoreMenu}</span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 pt-2 flex flex-col gap-2">
        {awaitingCoreQuote ? (
          <p data-testid="awaiting-core-quote" className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-xs font-bold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            {t.cart.awaitingCoreQuote}
          </p>
        ) : <div data-testid={!authoritativeQuote ? 'local-price-estimate' : undefined}>
          {!authoritativeQuote && <p className="mb-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">{t.cart.localPriceEstimate}</p>}
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.cart.subtotal}</span>
            <span className="font-mono text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">{authoritativeQuote ? formatExactMinor(authoritativeQuote.subtotalMinor) : formatPrice(subtotal)}</span>
          </div>
        {!authoritativeQuote && packagingFee > 0 && (
          <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>{t.cart.packagingFeeLabel}</span>
            <span className="font-mono whitespace-nowrap shrink-0">+{formatPrice(packagingFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t.cart.pb1Tax}</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">{authoritativeQuote ? formatExactMinor(authoritativeQuote.taxTotalMinor) : formatPrice(pb1Tax)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-2">
          <span>{t.cart.totalBill}</span>
          <span data-testid="authoritative-amount-due" className="font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">{authoritativeQuote ? formatExactMinor(authoritativeQuote.amountDueMinor) : formatPrice(grandTotal)}</span>
        </div>
        </div>}
        {authoritativeQuote && (
          <p data-testid="reviewed-core-quote" className="text-[10px] text-slate-500 font-mono truncate" title={authoritativeQuote.digestSha256}>
            CORE {authoritativeQuote.quoteId} r{authoritativeQuote.revision} · {authoritativeQuote.source} · {authoritativeQuote.digestSha256.slice(0, 12)}
          </p>
        )}

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            data-testid="tender-cash"
            type="button"
            disabled={!isTenderEligible('cash')}
            onClick={() => isTenderEligible('cash') && setPosPayMethod('cash')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${!isTenderEligible('cash') ? unavailableTenderClass : posPayMethod === 'cash' ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Banknote className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCash}</span>
          </button>
          <button
            data-testid="tender-qris"
            type="button"
            disabled={!isTenderEligible('qris')}
            onClick={() => isTenderEligible('qris') && setPosPayMethod('qris')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${!isTenderEligible('qris') ? unavailableTenderClass : posPayMethod === 'qris' ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payQris}</span>
          </button>
          <button
            data-testid="tender-card"
            type="button"
            disabled={!isCardEligible}
            onClick={() => isCardEligible && setPosPayMethod('card')}
            className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              !isCardEligible
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                : posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit'
                  ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t.cart.payCard}</span>
          </button>
        </div>

        {isCardEligible && (posPayMethod === 'card' || posPayMethod === 'cc' || posPayMethod === 'debit') && (
          <Suspense fallback={<div className="min-h-[180px] rounded-2xl bg-slate-50 dark:bg-slate-950" aria-busy="true" />}>
          <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                {t.cart.edcSectionTitle}
              </span>
            </div>
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
          </Suspense>
        )}

        {posPayMethod === 'cash' && !awaitingCoreQuote && (
          <Suspense fallback={<div className="min-h-[180px] rounded-2xl bg-slate-50 dark:bg-slate-950" aria-busy="true" />}>
            <PosCashTenderForm authoritativeQuote={authoritativeQuote} posCashGiven={posCashGiven} setPosCashGiven={setPosCashGiven} grandTotal={grandTotal} />
          </Suspense>
        )}

        <div className="flex items-center gap-2 pt-1">
          {onOpenSplitPayment && (
            <Button
              variant="secondary"
              size="md"
              onClick={onOpenSplitPayment}
              icon={<Scissors className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />}
              className="rounded-2xl shrink-0"
              title="Split Tagihan per Meja / Kursi"
            >
              {t.cart.splitBill}
            </Button>
          )}

          <Button
            variant="emerald"
            size="md"
            fullWidth
            onClick={() => onCheckout()}
            disabled={cartItems.length === 0 && (!selectedPOSTable || selectedPOSTable.totalBill === 0)}
            icon={<CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />}
            className="rounded-2xl shadow-xl flex-1 font-black text-xs sm:text-sm"
          >
            {reviewReady ? t.cart.acceptReviewedCoreQuote : t.cart.reviewCoreQuote}
          </Button>
        </div>
      </div>
    </div>
  )
}
