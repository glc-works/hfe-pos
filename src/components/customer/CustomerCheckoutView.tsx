import React, { useState } from 'react'
import {
  ShoppingBag, Contact, Minus, Plus, AlertTriangle, HeartHandshake,
  CreditCard, CheckCircle2, Ticket, QrCode, Banknote, Edit3, Receipt
} from 'lucide-react'
import { CartItem, PaymentPolicy, PB1TaxMode, CafeThemeConfig, Voucher } from '../../types/pos'
import { VoucherSelectionDrawer } from '../pos/VoucherSelectionDrawer'
import { PayFirstPaymentSection } from './PayFirstPaymentSection'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useTranslation } from '../../context/LanguageContext'

export interface CustomerCheckoutViewProps {
  selectedTable: string
  scannedSeat: string
  activeTheme: CafeThemeConfig
  cart: CartItem[]
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
  setQrStepView: (v: 'catalog' | 'checkout') => void
  handleUpdateQty: (index: number, delta: number) => void
  handleApplyPromo: () => void
  handleSubmitOrder: () => void
}

export const CustomerCheckoutView: React.FC<CustomerCheckoutViewProps> = ({
  selectedTable,
  scannedSeat,
  activeTheme,
  cart,
  promoCodeInput,
  setPromoCodeInput,
  appliedPromo,
  redeemedVoucher,
  serviceFeeRate,
  calculatedServiceFee,
  taxPB1Mode,
  calculatedPB1Tax,
  selectedTipAmount,
  setSelectedTipAmount,
  paymentPolicy,
  setPaymentPolicy,
  rawSubtotal,
  grandTotalBill,
  setQrStepView,
  handleUpdateQty,
  handleApplyPromo,
  handleSubmitOrder
}) => {
  const { vouchers } = useMerchantConfig()
  const { t, formatPrice } = useTranslation()
  const [showVoucherDrawer, setShowVoucherDrawer] = useState<boolean>(false)
  const [appliedVouchers, setAppliedVouchers] = useState<Voucher[]>([])
  const [manualCodeInput, setManualCodeInput] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash' | 'card'>('qris')
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({})
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false)

  const isLight = activeTheme.mode === 'light'
  const textColor = activeTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = activeTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const cardBorderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? 'rgba(0,0,0,0.025)' : 'rgba(15,23,42,0.6)'
  const subCardBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
  const inputBg = isLight ? '#ffffff' : 'rgba(2,6,23,0.8)'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'
  const buttonInactiveBg = isLight ? '#ffffff' : 'rgba(15,23,42,0.8)'
  const buttonInactiveText = isLight ? '#334155' : '#94a3b8'
  const buttonInactiveBorder = isLight ? '#e2e8f0' : '#1e293b'

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
      if (found) {
        handleApplyVoucher(found)
      }
      setManualCodeInput('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Dedicated Checkout Container */}
      <div 
        className="theme-customer-card border rounded-2xl p-4 flex flex-col gap-4 shadow-xl"
        style={{ borderColor: cardBorderColor, backgroundColor: activeTheme.cardBgHex }}
      >
        <h3 
          className="text-sm font-bold flex items-center gap-2 border-b pb-3"
          style={{ color: textColor, borderColor: cardBorderColor }}
        >
          <ShoppingBag className="w-5 h-5 text-amber-500 shrink-0" /> Ringkasan Pesanan & Pelunasan Meja
        </h3>

        {/* Items Breakdown with Clean Benchmark Layout */}
        <div className="flex flex-col gap-3 divide-y" style={{ borderColor: cardBorderColor }}>
          {cart.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex flex-col gap-1.5">
              {/* ITEM ROW: NAME, MODIFIERS, PRICE & STEPPER */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-sm leading-snug" style={{ color: textColor }}>
                      {item.name}
                    </h4>
                    {item.seatNumber && (
                      <span 
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                        style={{ backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }}
                      >
                        {item.seatNumber}
                      </span>
                    )}
                    {item.seatCustomerContact && (
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1"
                        style={{ backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }}
                      >
                        <Contact className="w-3 h-3 text-amber-500" /> {item.seatCustomerContact.name}
                      </span>
                    )}
                  </div>
                  
                  {item.temperature && (
                    <p className="text-[11px] mt-0.5" style={{ color: secondaryTextColor }}>
                      {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                    </p>
                  )}
                  
                  <p 
                    className="text-xs font-mono font-bold mt-1"
                    style={{ color: activeTheme.primaryAccentHex }}
                  >
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
                
                {/* COMPACT STEPPER BUTTONS */}
                <div 
                  className="flex items-center gap-1.5 border rounded-xl p-1 shrink-0"
                  style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
                >
                  <button 
                    onClick={() => handleUpdateQty(idx, -1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-all border"
                    style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
                    title="Kurangi"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold font-mono text-xs w-5 text-center" style={{ color: textColor }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => handleUpdateQty(idx, 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-all border"
                    style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
                    title="Tambah"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* COMPACT NOTE & ALLERGEN LINE */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] pt-0.5">
                {editingNoteIndex === idx ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      autoFocus
                      value={itemNotes[idx] || ''}
                      onChange={(e) => setItemNotes(prev => ({ ...prev, [idx]: e.target.value }))}
                      onBlur={() => setEditingNoteIndex(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingNoteIndex(null) }}
                      placeholder="Tulis catatan (cth: Less ice, Extra hot)..."
                      className="flex-1 text-xs rounded-lg px-2.5 py-1 focus:outline-none border"
                      style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
                    />
                    <button 
                      onClick={() => setEditingNoteIndex(null)}
                      className="text-xs px-2.5 py-1 rounded-lg font-bold border"
                      style={{ backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
                    >
                      Selesai
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingNoteIndex(idx)}
                    className="text-[11px] flex items-center gap-1 hover:underline transition-all"
                    style={{ color: secondaryTextColor }}
                  >
                    <Edit3 className="w-3 h-3" />
                    {itemNotes[idx] ? <span className="font-medium italic" style={{ color: textColor }}>"{itemNotes[idx]}"</span> : <span>Tambah Catatan</span>}
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

        {/* BENCHMARK GOFOOD/UBER: ADD MORE ITEMS BUTTON */}
        <button
          onClick={() => setQrStepView('catalog')}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed hover:opacity-90 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          style={{
            borderColor: activeTheme.primaryAccentHex,
            backgroundColor: `${activeTheme.primaryAccentHex}15`,
            color: isLight ? '#92400e' : '#fde68a'
          }}
        >
          <Plus className="w-4 h-4 text-amber-500" />
          <span>{t.customer.addMoreMenu}</span>
        </button>

        {/* CONDITIONAL PAYMENT & PROMO SECTION: ONLY SHOWN DURING PAY-FIRST CHECKOUT */}
        {paymentPolicy === 'pay-first' ? (
          <PayFirstPaymentSection
            activeTheme={activeTheme}
            isLight={isLight}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            subCardBg={subCardBg}
            subCardBorder={subCardBorder}
            buttonInactiveBg={buttonInactiveBg}
            buttonInactiveBorder={buttonInactiveBorder}
            inputBg={inputBg}
            inputBorder={inputBorder}
            cardBorderColor={cardBorderColor}
            appliedVouchers={appliedVouchers}
            setShowVoucherDrawer={setShowVoucherDrawer}
            useLoyaltyPoints={useLoyaltyPoints}
            setUseLoyaltyPoints={setUseLoyaltyPoints}
            promoCodeInput={promoCodeInput}
            setPromoCodeInput={setPromoCodeInput}
            handleApplyPromo={handleApplyPromo}
            selectedTipAmount={selectedTipAmount}
            setSelectedTipAmount={setSelectedTipAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        ) : (
          /* OPEN-TAB MODE: INFORMATIONAL CARD */
          <div 
            className="border rounded-2xl p-3.5 flex items-start gap-3 text-xs shadow-sm"
            style={{
              backgroundColor: `${activeTheme.primaryAccentHex}12`,
              borderColor: `${activeTheme.primaryAccentHex}35`,
              color: textColor
            }}
          >
            <Receipt className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-xs text-amber-500 uppercase tracking-wider font-mono">
                {t.customer.openTabNoticeTitle}
              </span>
              <p className="text-[11px]" style={{ color: secondaryTextColor }}>
                {t.customer.openTabNoticeDesc}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Tax PB1, Service Fee & Grand Total Calculation */}
        <div className="pt-3 border-t flex flex-col gap-1.5 text-xs" style={{ borderColor: cardBorderColor }}>
          <div className="flex justify-between" style={{ color: secondaryTextColor }}>
            <span>Subtotal Pesanan:</span>
            <span>{formatPrice(rawSubtotal)}</span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>Promo ({appliedPromo.code}):</span>
              <span>-{formatPrice(appliedPromo.discount)}</span>
            </div>
          )}

          {redeemedVoucher && (
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>Voucher Points Hfe:</span>
              <span>-{formatPrice(10000)}</span>
            </div>
          )}

          {serviceFeeRate > 0 && (
            <div className="flex justify-between" style={{ color: secondaryTextColor }}>
              <span>Service Fee ({serviceFeeRate}%):</span>
              <span>+{formatPrice(calculatedServiceFee)}</span>
            </div>
          )}

          {taxPB1Mode === 1 && (
            <div className="flex justify-between font-medium text-amber-500">
              <span>Pajak Restoran PB1 (10% Exclude):</span>
              <span>+{formatPrice(calculatedPB1Tax)}</span>
            </div>
          )}

          {taxPB1Mode === 2 && (
            <div className="flex justify-between italic text-[11px]" style={{ color: secondaryTextColor }}>
              <span>Pajak PB1 (10% Include Dibelakang):</span>
              <span>[{formatPrice(calculatedPB1Tax)}]</span>
            </div>
          )}

          {selectedTipAmount > 0 && (
            <div className="flex justify-between font-bold text-amber-500">
              <span>Tips Staf & Barista:</span>
              <span>+{formatPrice(selectedTipAmount)}</span>
            </div>
          )}

          <div 
            className="flex items-baseline justify-between gap-3 text-xs sm:text-sm font-black pt-2.5 border-t"
            style={{ color: textColor, borderColor: cardBorderColor }}
          >
            <span className="truncate">{paymentPolicy === 'pay-first' ? t.customer.finalBillTotal : t.customer.estimatedTotalThisRound}</span>
            <span className="font-mono text-base sm:text-lg font-black whitespace-nowrap shrink-0" style={{ color: activeTheme.primaryAccentHex }}>
              {formatPrice(grandTotalBill)}
            </span>
          </div>
        </div>

        {/* LEGAL & NON-CANCELLABLE DISPUTE PREVENTION WARNING */}
        <div 
          className="border rounded-xl p-2.5 flex items-start gap-2 text-[11px] shadow-sm"
          style={{
            backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.08)',
            borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.3)',
            color: isLight ? '#92400e' : '#fde68a'
          }}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-snug">
            <span className="font-extrabold text-[11px] text-amber-600 dark:text-amber-400">
              ⚠️ {t.customer.nonRefundableWarningTitle}
            </span>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
              {t.customer.nonRefundableWarningDesc}
            </p>
          </div>
        </div>

        {/* Submit Order Button */}
        <button
          onClick={handleSubmitOrder}
          className="w-full theme-customer-btn-primary font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-1 touch-manipulation active:scale-[0.98] text-center"
        >
          {paymentPolicy === 'pay-first' ? (
            <>
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.customer.payOrderNow} • {formatPrice(grandTotalBill)}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.customer.sendOrderToKitchen}</span>
            </>
          )}
        </button>
      </div>

      {/* Voucher Selection Modal Drawer */}
      <VoucherSelectionDrawer
        show={showVoucherDrawer}
        onClose={() => setShowVoucherDrawer(false)}
        appliedVouchers={appliedVouchers}
        onApplyVoucher={handleApplyVoucher}
        onRemoveVoucher={handleRemoveVoucher}
        manualCodeInput={manualCodeInput}
        setManualCodeInput={setManualCodeInput}
        onApplyManualCode={handleApplyManualCode}
      />
    </div>
  )
}
