import React, { lazy, Suspense, useState } from 'react'
import { ShoppingBag, Coffee, Calculator, Minus, Plus, Trash2, Banknote, QrCode, CreditCard, CheckCircle2, Scissors, UtensilsCrossed, Bike, Loader2, Sparkles, User, X, Crown } from 'lucide-react'
import { CartItem, TableStatus, PosPayMethod, CardTenderMetadata, QrisTenderMetadata, OrderFulfillmentMode } from '../../types/pos'
import { CustomerContact } from '../../hooks/useCustomerContacts'
import { useTranslation } from '../../context/LanguageContext'
import { SegmentedControl, Button } from '@/ui'
import { GLYPHS } from '../../tokens/designTokens'

import type { ReviewedPosQuote } from '../../services/financial'
import type { GovernedCheckoutPhase } from '../../hooks/useCafeSettlement'
import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'
import { formatExactMinorCurrency } from '../../utils/localeNumberFormat'
const PosCardTenderForm = lazy(() => import('./PosCardTenderForm').then(({ PosCardTenderForm }) => ({ default: PosCardTenderForm })))
const PosCashTenderForm = lazy(() => import('./PosCashTenderForm').then(({ PosCashTenderForm }) => ({ default: PosCashTenderForm })))
const PosQrisTenderForm = lazy(() => import('./PosQrisTenderForm').then(({ PosQrisTenderForm }) => ({ default: PosQrisTenderForm })))
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
  selectedCustomer?: CustomerContact | null
  onOpenCustomerPicker?: () => void
  onClearCustomer?: () => void
  cardMetadata?: CardTenderMetadata
  qrisMetadata?: QrisTenderMetadata
  authoritativeQuote?: ReviewedPosQuote | null
  checkoutPhase?: GovernedCheckoutPhase
  setPosPayMethod: (method: PosPayMethod) => void
  setPosCashGiven: (val: string) => void
  setFulfillmentMode?: (mode: OrderFulfillmentMode) => void
  setCardMetadata?: (meta: CardTenderMetadata) => void
  setQrisMetadata?: (meta: QrisTenderMetadata) => void
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
  selectedCustomer,
  onOpenCustomerPicker,
  onClearCustomer,
  qrisMetadata,
  authoritativeQuote,
  checkoutPhase,
  setPosPayMethod,
  setPosCashGiven,
  setFulfillmentMode,
  setQrisMetadata,
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

  const [qrisProvider, setQrisProvider] = useState<string>(qrisMetadata?.provider || 'BCA')
  const [rrnRefNumber, setRrnRefNumber] = useState<string>(qrisMetadata?.rrnRefNumber || '')
  const [senderName, setSenderName] = useState<string>(qrisMetadata?.senderName || '')

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
          {selectedPOSTable && fulfillmentMode === 'dine_in' && (
            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-xl border border-amber-300 dark:border-amber-500/30">
              {selectedPOSTable.name}
            </span>
          )}
        </div>
      )}

      {/* CUSTOMER CONTACT & LOYALTY CAPSULE */}
      <div className="shrink-0 pt-1.5 pb-0.5">
        {selectedCustomer ? (
          <div className="w-full py-1.5 px-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-1.5 min-w-0">
              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 truncate">
                  {selectedCustomer.name}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded border border-amber-500/30 shrink-0">
                  {selectedCustomer.tier}
                </span>
                {selectedCustomer.phone && selectedCustomer.phone !== '-' && (
                  <span className="text-[10px] font-mono text-slate-400 truncate hidden sm:inline">
                    {selectedCustomer.phone}
                  </span>
                )}
              </div>
            </div>
            {onClearCustomer && (
              <button
                type="button"
                onClick={onClearCustomer}
                className="p-0.5 hover:bg-amber-500/20 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                title="Lepas Pelanggan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenCustomerPicker}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              <span className="font-semibold text-[11px]">+ Pasang Pelanggan / Member</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Tamu Umum ▾</span>
          </button>
        )}
      </div>

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
          <Suspense fallback={<div className="min-h-[140px] rounded-2xl bg-slate-50 dark:bg-slate-950" aria-busy="true" />}>
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
          </Suspense>
        )}

        {posPayMethod === 'cash' && !awaitingCoreQuote && (
          <Suspense fallback={<div className="min-h-[180px] rounded-2xl bg-slate-50 dark:bg-slate-950" aria-busy="true" />}>
            <PosCashTenderForm authoritativeQuote={authoritativeQuote} posCashGiven={posCashGiven} setPosCashGiven={setPosCashGiven} grandTotal={grandTotal} />
          </Suspense>
        )}

        {posPayMethod === 'qris' && !awaitingCoreQuote && (
          <Suspense fallback={<div className="min-h-[120px] rounded-2xl bg-slate-50 dark:bg-slate-950" aria-busy="true" />}>
            <PosQrisTenderForm
              selectedProvider={qrisMetadata?.provider || qrisProvider}
              setSelectedProvider={(prov) => {
                setQrisProvider(prov)
                setQrisMetadata?.({ provider: prov, rrnRefNumber, senderName })
              }}
              rrnRefNumber={qrisMetadata?.rrnRefNumber ?? rrnRefNumber}
              setRrnRefNumber={(rrn) => {
                setRrnRefNumber(rrn)
                setQrisMetadata?.({ provider: qrisProvider, rrnRefNumber: rrn, senderName })
              }}
              senderName={qrisMetadata?.senderName ?? senderName}
              setSenderName={(name) => {
                setSenderName(name)
                setQrisMetadata?.({ provider: qrisProvider, rrnRefNumber, senderName: name })
              }}
            />
          </Suspense>
        )}

        {reviewReady && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 animate-fadeIn">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Kuotasi PB1 Siap (Tahap 2/2)</span>
            </span>
            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
              {authoritativeQuote ? formatExactMinor(authoritativeQuote.amountDueMinor) : formatPrice(grandTotal)}
            </span>
          </div>
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
            disabled={checkoutPhase?.kind === 'quoting' || checkoutPhase?.kind === 'accepting' || (cartItems.length === 0 && (!selectedPOSTable || selectedPOSTable.totalBill === 0))}
            icon={
              checkoutPhase?.kind === 'quoting' || checkoutPhase?.kind === 'accepting' ? (
                <Loader2 className="w-4 h-4 text-slate-950 shrink-0 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
              )
            }
            className={`rounded-2xl shadow-xl flex-1 font-black text-xs sm:text-sm transition-all ${
              reviewReady ? 'ring-2 ring-emerald-400 ring-offset-2 animate-pulse' : ''
            }`}
          >
            {checkoutPhase?.kind === 'quoting' || checkoutPhase?.kind === 'accepting'
              ? 'Memproses...'
              : `${t.cart.payAction} ➔`}
          </Button>
        </div>
      </div>
    </div>
  )
}
