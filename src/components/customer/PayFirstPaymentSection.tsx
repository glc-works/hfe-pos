import React from 'react'
import { Ticket, HeartHandshake, QrCode, Banknote, CreditCard } from 'lucide-react'
import { CafeThemeConfig, Voucher } from '../../types/pos'

export interface PayFirstPaymentSectionProps {
  activeTheme: CafeThemeConfig
  isLight: boolean
  textColor: string
  secondaryTextColor: string
  subCardBg: string
  subCardBorder: string
  buttonInactiveBg: string
  buttonInactiveBorder: string
  inputBg: string
  inputBorder: string
  cardBorderColor: string
  appliedVouchers: Voucher[]
  setShowVoucherDrawer: (v: boolean) => void
  useLoyaltyPoints: boolean
  setUseLoyaltyPoints: (v: boolean) => void
  promoCodeInput: string
  setPromoCodeInput: (v: string) => void
  handleApplyPromo: () => void
  selectedTipAmount: number
  setSelectedTipAmount: (v: number) => void
  paymentMethod: 'qris' | 'cash' | 'card'
  setPaymentMethod: (v: 'qris' | 'cash' | 'card') => void
}

export const PayFirstPaymentSection: React.FC<PayFirstPaymentSectionProps> = ({
  activeTheme,
  isLight,
  textColor,
  secondaryTextColor,
  subCardBg,
  subCardBorder,
  buttonInactiveBg,
  buttonInactiveBorder,
  inputBg,
  inputBorder,
  cardBorderColor,
  appliedVouchers,
  setShowVoucherDrawer,
  useLoyaltyPoints,
  setUseLoyaltyPoints,
  promoCodeInput,
  setPromoCodeInput,
  handleApplyPromo,
  selectedTipAmount,
  setSelectedTipAmount,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <>
      {/* Voucher Selection Drawer Trigger */}
      <button
        onClick={() => setShowVoucherDrawer(true)}
        className="w-full border font-bold text-xs p-3 rounded-xl flex items-center justify-between shadow-sm transition-all"
        style={{ backgroundColor: subCardBg, borderColor: subCardBorder, color: textColor }}
      >
        <span className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-amber-500" /> 🎟️ Pilih / Lihat Voucher Promo
        </span>
        <span 
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
          style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
        >
          {appliedVouchers.length > 0 ? `${appliedVouchers.length} Terpasang` : 'Lihat Promo'}
        </span>
      </button>

      {/* LOYALTY POINTS REDEMPTION WIDGET */}
      <div 
        className="border rounded-xl p-3 flex items-center justify-between gap-2 shadow-sm min-w-0"
        style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-base shrink-0">🪙</span>
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate" style={{ color: textColor }}>Tukar 450 Poin Loyalty</h4>
            <p className="text-[10px] text-amber-500 font-semibold truncate">Hemat potongan Rp 4.500 langsung</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
          className="px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap shrink-0 border"
          style={
            useLoyaltyPoints
              ? { backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: activeTheme.primaryAccentHex }
              : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
          }
        >
          {useLoyaltyPoints ? '✓ Terpasang (-Rp 4.500)' : 'Gunakan'}
        </button>
      </div>

      {/* Quick Promo Code Input */}
      <div className="flex gap-2 pt-1 border-t" style={{ borderColor: cardBorderColor }}>
        <input
          type="text"
          value={promoCodeInput}
          onChange={(e) => setPromoCodeInput(e.target.value)}
          placeholder="Kode Promo (cth: HAPPYHOUR)"
          className="flex-1 text-xs rounded-xl px-3 py-2 focus:outline-none uppercase font-mono border"
          style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
        />
        <button
          onClick={handleApplyPromo}
          className="text-xs font-semibold px-4 py-2 rounded-xl border"
          style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
        >
          Gunakan
        </button>
      </div>

      {/* OPTIONAL CUSTOMER TIPS SELECTION */}
      <div 
        className="border rounded-xl p-3 flex flex-col gap-2"
        style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
      >
        <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: secondaryTextColor }}>
          <HeartHandshake className="w-3.5 h-3.5 text-amber-500" /> Ucapkan Terima Kasih ke Staf / Barista (Tips Opsional):
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Tanpa Tip', val: 0 },
            { label: 'Rp 2.000', val: 2000 },
            { label: 'Rp 5.000', val: 5000 },
            { label: 'Rp 10.000', val: 10000 }
          ].map(tip => (
            <button
              key={tip.label}
              onClick={() => setSelectedTipAmount(tip.val)}
              className="py-2 rounded-xl text-xs font-bold border transition-all shadow-sm"
              style={
                selectedTipAmount === tip.val
                  ? { backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: activeTheme.primaryAccentHex }
                  : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
              }
            >
              {tip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Selection (QRIS / Tunai Kasir / Card) */}
      <div 
        className="border rounded-xl p-3 flex flex-col gap-2"
        style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
      >
        <span className="text-[11px] font-semibold" style={{ color: secondaryTextColor }}>Metode Pembayaran Checkout:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod('qris')}
            className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all shadow-sm"
            style={
              paymentMethod === 'qris'
                ? { backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: activeTheme.primaryAccentHex }
                : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
            }
          >
            <QrCode className="w-3.5 h-3.5" /> QRIS Instant
          </button>
          <button
            onClick={() => setPaymentMethod('cash')}
            className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all shadow-sm"
            style={
              paymentMethod === 'cash'
                ? { backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: activeTheme.primaryAccentHex }
                : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
            }
          >
            <Banknote className="w-3.5 h-3.5" /> Tunai / Kasir
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all shadow-sm"
            style={
              paymentMethod === 'card'
                ? { backgroundColor: activeTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: activeTheme.primaryAccentHex }
                : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
            }
          >
            <CreditCard className="w-3.5 h-3.5" /> Debit / Kredit
          </button>
        </div>
      </div>
    </>
  )
}
