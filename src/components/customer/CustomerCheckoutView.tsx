import React, { useState } from 'react'
import {
  ShoppingBag, Contact, Minus, Plus, AlertTriangle,
  CreditCard, CheckCircle2, Edit3, Receipt, Navigation,
  ChevronDown, ChevronUp
} from 'lucide-react'
import {
  CartItem, PaymentPolicy, PB1TaxMode, CafeThemeConfig, Voucher,
  HfeCompanyProfile, OrderFulfillmentMode, DeliveryAddressInfo, QrStepView
} from '../../types/pos'
import { VoucherSelectionDrawer } from '../pos/VoucherSelectionDrawer'
import { PayFirstPaymentSection } from './PayFirstPaymentSection'
import { CustomerDeliveryAddressCard } from './CustomerDeliveryAddressCard'
import { CustomerDeliveryPaymentSelector, DeliveryPaymentMethodKey } from './CustomerDeliveryPaymentSelector'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useTranslation } from '../../context/LanguageContext'
import { PriceTag } from '../../ui/PriceTag'
import { Button } from '../../ui/Button'
import { ValueLedMembershipBanner } from './ValueLedMembershipBanner'
import { WifiAccessCelebrationBanner } from './WifiAccessCelebrationBanner'
import { PostVisitFeedbackSection } from './PostVisitFeedbackSection'

export interface CustomerCheckoutViewProps {
  selectedTable: string
  scannedSeat: string
  activeTheme: CafeThemeConfig
  cart: CartItem[]
  hfeCompanyProfile?: HfeCompanyProfile
  hasPaidOrder?: boolean
  isCustomerSessionActive?: boolean
  onJoinMembership?: (phone: string) => void
  onResetGuestSession?: () => void
  onOpenModifierModal?: (item: CartItem, index: number) => void
  promoCodeInput: string
  setPromoCodeInput: (val: string) => void
  appliedPromo: { code: string; discount: number } | null
  redeemedVoucher: boolean
  serviceFeeRate: number
  calculatedServiceFee: number
  taxPB1Mode: PB1TaxMode
  calculatedPB1Tax: number
  selectedTipAmount: number
  setSelectedTipAmount: (val: number) => void
  paymentPolicy: PaymentPolicy
  setPaymentPolicy: (val: PaymentPolicy) => void
  rawSubtotal: number
  grandTotalBill: number
  setQrStepView: (v: QrStepView) => void
  handleUpdateQty: (index: number, delta: number) => void
  handleApplyPromo: () => void
  handleSubmitOrder: () => void
  fulfillmentMode?: OrderFulfillmentMode
  deliveryAddress?: DeliveryAddressInfo
  onChangeDeliveryAddress?: (updated: Partial<DeliveryAddressInfo>) => void
  deliveryFee?: number
  packagingFee?: number
}

const defaultAddress: DeliveryAddressInfo = {
  recipientName: 'Pelanggan',
  phoneNumber: '081234567890',
  streetAddress: 'Menara Mandiri, Jl. Jend. Sudirman Kav. 54-55',
  unitOrFloor: 'Lantai 18, Ruang 1802',
  dropOffOption: 'leave_at_lobby_guard',
  driverNotes: 'Tolong titip di meja resepsionis lantai 1 ya mas',
  distanceKm: 3.2
}

export const CustomerCheckoutView: React.FC<CustomerCheckoutViewProps> = ({
  selectedTable, scannedSeat, activeTheme, cart, hfeCompanyProfile,
  hasPaidOrder = false, isCustomerSessionActive = false, onJoinMembership,
  onResetGuestSession, onOpenModifierModal, promoCodeInput, setPromoCodeInput, appliedPromo,
  redeemedVoucher, serviceFeeRate, calculatedServiceFee, taxPB1Mode,
  calculatedPB1Tax, selectedTipAmount, setSelectedTipAmount, paymentPolicy,
  setPaymentPolicy, rawSubtotal, grandTotalBill, setQrStepView,
  handleUpdateQty, handleApplyPromo, handleSubmitOrder,
  fulfillmentMode = 'dine_in', deliveryAddress = defaultAddress,
  onChangeDeliveryAddress, deliveryFee = 0, packagingFee = 0
}) => {
  const { vouchers } = useMerchantConfig()
  const { t, formatPrice } = useTranslation()
  const [showVoucherDrawer, setShowVoucherDrawer] = useState<boolean>(false)
  const [appliedVouchers, setAppliedVouchers] = useState<Voucher[]>([])
  const [manualCodeInput, setManualCodeInput] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash' | 'card'>('qris')
  const [deliveryPayMethod, setDeliveryPayMethod] = useState<DeliveryPaymentMethodKey>('qris_instant')
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({})
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false)
  const [isOtherFeesExpanded, setIsOtherFeesExpanded] = useState<boolean>(false)

  const isDelivery = fulfillmentMode === 'delivery'
  const isLight = activeTheme.mode === 'light'
  const textColor = activeTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = activeTheme.secondaryTextColorHex || (isLight ? '#475569' : '#cbd5e1')
  const cardBorderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
  const subCardBg = isLight ? 'rgba(0,0,0,0.025)' : 'rgba(15,23,42,0.85)'
  const subCardBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)'
  const inputBg = isLight ? '#ffffff' : 'rgba(2,6,23,0.9)'
  const inputBorder = isLight ? '#cbd5e1' : '#475569'
  const buttonInactiveBg = isLight ? '#ffffff' : '#1e293b'
  const buttonInactiveBorder = isLight ? '#e2e8f0' : '#334155'

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const otherFeesTotal = (calculatedServiceFee || 0) + (taxPB1Mode === 1 ? (calculatedPB1Tax || 0) : 0)

  const effectiveDeliveryFee = isDelivery ? (deliveryFee > 0 ? deliveryFee : Math.max(10000, Math.round(deliveryAddress.distanceKm * 3000))) : 0
  const effectivePackagingFee = isDelivery ? (packagingFee > 0 ? packagingFee : 3000) : packagingFee
  const computedGrandTotal = grandTotalBill + effectiveDeliveryFee + effectivePackagingFee

  const handleApplyVoucher = (voucher: Voucher) => {
    if (!appliedVouchers.some(v => v.code === voucher.code)) {
      setAppliedVouchers(prev => [...prev, voucher])
    }
  }

  const handleRemoveVoucher = (code: string) => {
    setAppliedVouchers(prev => prev.filter(v => v.code !== code))
  }

  const handleApplyManualCode = () => {
    if (manualCodeInput.trim()) {
      setPromoCodeInput(manualCodeInput.trim().toUpperCase())
      handleApplyPromo()
      const found = vouchers.find((v: Voucher) => v.code.toUpperCase() === manualCodeInput.trim().toUpperCase())
      if (found) handleApplyVoucher(found)
      setManualCodeInput('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 📶 WIFI ACCESS BANNER */}
      <WifiAccessCelebrationBanner
        wifiAccessPolicy={hfeCompanyProfile?.storefrontInfo?.wifiAccessPolicy || 'after_payment'}
        hasPaidOrder={hasPaidOrder}
        wifiSsid={hfeCompanyProfile?.storefrontInfo?.wifiSsid || (hfeCompanyProfile?.brandName ? `${hfeCompanyProfile.brandName.replace(/[^a-zA-Z0-9]/g, '_')}_Guest` : 'Guest_WiFi')}
        wifiPassword={hfeCompanyProfile?.storefrontInfo?.wifiPassword || 'guestwifi123'}
        isLight={isLight}
        textColor={textColor}
      />

      {/* ⭐ POST-VISIT FEEDBACK */}
      {hasPaidOrder && (
        <PostVisitFeedbackSection
          activeTheme={activeTheme} tableNumber={selectedTable}
          guestName={scannedSeat} isMember={isCustomerSessionActive}
        />
      )}

      {/* 🛵 1. LUXURY 3-TIER DELIVERY ADDRESS (IF DELIVERY MODE) */}
      {isDelivery && (
        <CustomerDeliveryAddressCard
          address={deliveryAddress}
          onChangeAddress={onChangeDeliveryAddress || (() => {})}
        />
      )}

      {/* Dedicated Checkout Container */}
      <div 
        className="theme-customer-card border rounded-2xl p-4 flex flex-col gap-4 shadow-xl"
        style={{ borderColor: cardBorderColor, backgroundColor: activeTheme.cardBgHex }}
      >
        {/* Header with [ + Add Item ] pill button */}
        <div 
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: cardBorderColor }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isDelivery ? (
              <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <h3 className="text-sm font-bold truncate" style={{ color: textColor }}>
              {isDelivery ? 'Menu Pesanan Antar' : t.customer.orderedItemsHeader} ({totalCartItems})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setQrStepView('catalog')}
            className="text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center gap-1 shrink-0 select-none"
          >
            <Plus className="w-3 h-3" />
            <span>{t.customer.addItemPill}</span>
          </button>
        </div>

        {/* Items Breakdown with [ 📝 Edit ] and Stepper */}
        <div className="flex flex-col gap-3 divide-y" style={{ borderColor: cardBorderColor }}>
          {cart.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-sm leading-snug" style={{ color: textColor }}>{item.name}</h4>
                    {onOpenModifierModal && (
                      <button
                        type="button"
                        onClick={() => onOpenModifierModal(item, idx)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/80 bg-background/80 hover:bg-accent text-muted-foreground flex items-center gap-1 transition-all active:scale-95"
                        title="Edit varian"
                      >
                        <Edit3 className="w-2.5 h-2.5 text-amber-500" />
                        <span>{t.customer.editItemModifier}</span>
                      </button>
                    )}
                    {item.seatNumber && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border" style={{ backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }}>{item.seatNumber}</span>
                    )}
                    {item.seatCustomerContact && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1" style={{ backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }}>
                        <Contact className="w-3 h-3 text-amber-500" /> {item.seatCustomerContact.name}
                      </span>
                    )}
                  </div>
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {item.selectedModifiers.map(m => m.name).join(', ')}
                    </p>
                  )}
                  <div className="mt-1"><PriceTag amount={item.price * item.quantity} size="sm" variant="accent" /></div>
                </div>
                
                <div className="flex items-center gap-1.5 border rounded-full p-1 shrink-0" style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}>
                  <button onClick={() => handleUpdateQty(idx, -1)} className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }} title="Kurangi"><Minus className="w-3 h-3" /></button>
                  <span className="font-bold font-mono text-xs w-5 text-center" style={{ color: textColor }}>{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(idx, 1)} className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }} title="Tambah"><Plus className="w-3 h-3" /></button>
                </div>
              </div>

              {/* Note Line with clickable [ No notes yet ] */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] pt-0.5">
                {editingNoteIndex === idx ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text" autoFocus value={itemNotes[idx] || ''}
                      onChange={(e) => setItemNotes(prev => ({ ...prev, [idx]: e.target.value }))}
                      onBlur={() => setEditingNoteIndex(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingNoteIndex(null) }}
                      placeholder="Tulis catatan (cth: Less ice)..."
                      className="flex-1 text-xs rounded-lg px-2.5 py-1 focus:outline-none border"
                      style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
                    />
                    <button onClick={() => setEditingNoteIndex(null)} className="text-xs px-2.5 py-1 rounded-lg font-bold border" style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}>Selesai</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingNoteIndex(idx)} className="text-[11px] flex items-center gap-1 hover:underline text-muted-foreground">
                    <Edit3 className="w-3 h-3 text-muted-foreground" />
                    {itemNotes[idx] ? <span className="font-medium italic text-foreground">"{itemNotes[idx]}"</span> : <span className="text-muted-foreground/80">{t.customer.noNotesYet}</span>}
                  </button>
                )}
                {item.allergenNotes && (
                  <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3 text-rose-500" /> Alergen: {item.allergenNotes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 💳 2. PAYMENT METHOD SELECTOR (DELIVERY INTERACTIVE CARD OR DINE-IN) */}
        {isDelivery ? (
          <CustomerDeliveryPaymentSelector
            selectedMethod={deliveryPayMethod}
            onSelectMethod={setDeliveryPayMethod}
            grandTotalFormatted={formatPrice(computedGrandTotal)}
          />
        ) : paymentPolicy === 'pay-first' ? (
          <PayFirstPaymentSection
            activeTheme={activeTheme} isLight={isLight} textColor={textColor} secondaryTextColor={secondaryTextColor}
            subCardBg={subCardBg} subCardBorder={subCardBorder} buttonInactiveBg={buttonInactiveBg} buttonInactiveBorder={buttonInactiveBorder}
            inputBg={inputBg} inputBorder={inputBorder} cardBorderColor={cardBorderColor} appliedVouchers={appliedVouchers}
            setShowVoucherDrawer={setShowVoucherDrawer} useLoyaltyPoints={useLoyaltyPoints} setUseLoyaltyPoints={setUseLoyaltyPoints}
            promoCodeInput={promoCodeInput} setPromoCodeInput={setPromoCodeInput} handleApplyPromo={handleApplyPromo}
            selectedTipAmount={selectedTipAmount} setSelectedTipAmount={setSelectedTipAmount} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
          />
        ) : (
          <div className="border rounded-2xl p-3.5 flex items-start gap-3 text-xs shadow-sm" style={{ backgroundColor: `${activeTheme.primaryAccentHex}12`, borderColor: `${activeTheme.primaryAccentHex}35`, color: textColor }}>
            <Receipt className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-xs text-amber-500 uppercase tracking-wider font-mono">{t.customer.openTabNoticeTitle}</span>
              <p className="text-[11px]" style={{ color: secondaryTextColor }}>{t.customer.openTabNoticeDesc}</p>
            </div>
          </div>
        )}

        {/* 🧾 3. TRANSPARENT FINANCIAL BREAKDOWN WITH ESB PARITY */}
        <div className="pt-3 border-t flex flex-col gap-1.5 text-xs" style={{ borderColor: cardBorderColor }}>
          <div className="flex justify-between" style={{ color: secondaryTextColor }}>
            <span>Subtotal:</span>
            <span className="font-mono">{formatPrice(rawSubtotal)}</span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>Promo ({appliedPromo.code}):</span>
              <span className="font-mono">-{formatPrice(appliedPromo.discount)}</span>
            </div>
          )}

          {isDelivery && (
            <>
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Ongkos Kirim • {deliveryAddress.distanceKm} km:</span>
                <span className="font-mono text-foreground font-bold">+{formatPrice(effectiveDeliveryFee)}</span>
              </div>
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Biaya Kemasan Thermal:</span>
                <span className="font-mono text-foreground font-bold">+{formatPrice(effectivePackagingFee)}</span>
              </div>
            </>
          )}

          {/* EXPLICIT ROUNDING ROW */}
          <div className="flex justify-between text-muted-foreground">
            <span>{t.customer.roundingLabel}:</span>
            <span className="font-mono text-xs font-semibold">{formatPrice(0)}</span>
          </div>

          {/* COLLAPSIBLE OTHER FEES ACCORDION (SERVICE CHARGE + PBJT 10%) */}
          {otherFeesTotal > 0 && (
            <div className="flex flex-col border rounded-xl overflow-hidden my-0.5" style={{ borderColor: subCardBorder, backgroundColor: subCardBg }}>
              <button
                type="button"
                onClick={() => setIsOtherFeesExpanded(!isOtherFeesExpanded)}
                className="flex items-center justify-between p-2.5 text-xs font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 select-none"
                style={{ color: textColor }}
              >
                <span className="flex items-center gap-1.5">
                  <span>{t.customer.otherFeesLabel}</span>
                  {isOtherFeesExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-500" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-500" />}
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  +{formatPrice(otherFeesTotal)}
                </span>
              </button>

              {isOtherFeesExpanded && (
                <div className="px-3 pb-2.5 pt-1 border-t flex flex-col gap-1 text-[11px] bg-background/50" style={{ borderColor: subCardBorder, color: secondaryTextColor }}>
                  {calculatedServiceFee > 0 && (
                    <div className="flex justify-between">
                      <span>{t.customer.serviceChargeLabel} ({serviceFeeRate}%):</span>
                      <span className="font-mono">+{formatPrice(calculatedServiceFee)}</span>
                    </div>
                  )}
                  {taxPB1Mode === 1 && calculatedPB1Tax > 0 && (
                    <div className="flex justify-between">
                      <span>{t.customer.pbjtTaxLabel}:</span>
                      <span className="font-mono">+{formatPrice(calculatedPB1Tax)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm font-black pt-2.5 border-t" style={{ color: textColor, borderColor: cardBorderColor }}>
            <span className="truncate">{isDelivery ? 'Total Pembayaran Pesan Antar:' : (paymentPolicy === 'pay-first' ? t.customer.finalBillTotal : t.customer.estimatedTotalThisRound)}</span>
            <span className="font-mono text-base sm:text-lg font-black whitespace-nowrap shrink-0" style={{ color: activeTheme.primaryAccentHex }}>
              {formatPrice(computedGrandTotal)}
            </span>
          </div>
        </div>

        {/* VALUE-LED MEMBERSHIP */}
        <ValueLedMembershipBanner isCustomerSessionActive={isCustomerSessionActive} onJoinMembership={onJoinMembership} />

        {/* DEMO RESET */}
        {onResetGuestSession && (
          <button type="button" onClick={onResetGuestSession} className="min-h-[44px] w-full rounded-xl border border-dashed border-border text-[11px] font-bold text-muted-foreground flex items-center justify-center gap-1.5 select-none">
            🔄 {t.customer.resetDemoSession}
          </button>
        )}

        {/* LEGAL WARNING */}
        <div className="border rounded-xl p-2.5 flex items-start gap-2 text-[11px] shadow-sm" style={{ backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.08)', borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.3)', color: isLight ? '#92400e' : '#fde68a' }}>
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-snug">
            <span className="font-extrabold text-[11px] text-amber-600 dark:text-amber-400">⚠️ {t.customer.nonRefundableWarningTitle}</span>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">{t.customer.nonRefundableWarningDesc}</p>
          </div>
        </div>

        {/* FINAL CTA BUTTON */}
        <Button
          variant="primary" size="lg" onClick={handleSubmitOrder}
          className="w-full font-extrabold text-xs sm:text-sm py-3.5 shadow-lg flex items-center justify-center gap-2 mt-1"
        >
          {isDelivery ? (
            <>
              <Navigation className="w-4 h-4 shrink-0" />
              <span className="truncate">Pesan Antar Sekarang • {formatPrice(computedGrandTotal)} ➔</span>
            </>
          ) : paymentPolicy === 'pay-first' ? (
            <>
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.customer.payOrderNow} • {formatPrice(computedGrandTotal)}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.customer.sendOrderToKitchen}</span>
            </>
          )}
        </Button>
      </div>

      {/* Voucher Drawer */}
      <VoucherSelectionDrawer
        show={showVoucherDrawer} onClose={() => setShowVoucherDrawer(false)} appliedVouchers={appliedVouchers}
        onApplyVoucher={handleApplyVoucher} onRemoveVoucher={handleRemoveVoucher} manualCodeInput={manualCodeInput}
        setManualCodeInput={setManualCodeInput} onApplyManualCode={handleApplyManualCode}
      />
    </div>
  )
}
