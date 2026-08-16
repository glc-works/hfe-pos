import React from 'react'
import { Copy, Check, Info, Layers } from 'lucide-react'
import { Voucher } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export { type Voucher } from '../../types/pos'

export const DEFAULT_AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: 'BCA15K',
    title: 'Diskon Debit/Kredit BCA Rp 15.000',
    description: 'Min. belanja Rp 50.000 dengan kartu BCA di EDC resto',
    discountAmount: 15000,
    discountType: 'flat',
    minSpend: 50000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bca',
    sponsorType: 'bank',
    sponsorName: 'Bank BCA',
    sponsorIcon: '💳',
    sponsorBrandColor: '#005baa',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku khusus untuk transaksi menggunakan Kartu Debit / Kredit BCA.',
      'Minimum transaksi Rp 50.000 sebelum PB1 dan service fee.',
      'Dapat digabungkan dengan promo merchant dan cashback loyalitas.',
      'Berlaku di seluruh outlet resmi Kopitiam Senopati & Roastery.'
    ]
  },
  {
    code: 'BNI25K',
    title: 'Diskon Spesial Kartu BNI Rp 25.000',
    description: 'Potongan Rp 25.000 untuk QRIS BNI / Kartu BNI min. Rp 75.000',
    discountAmount: 25000,
    discountType: 'flat',
    minSpend: 75000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bni',
    sponsorType: 'bank',
    sponsorName: 'Bank BNI',
    sponsorIcon: '🏦',
    sponsorBrandColor: '#f15a24',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku untuk pembayaran QRIS wondr by BNI atau Kartu Kredit/Debit BNI.',
      'Minimum transaksi Rp 75.000.',
      'Kuota terbatas per hari sesuai ketentuan BNI promo program.'
    ]
  },
  {
    code: 'BRI20K',
    title: 'Promo BRImo & Kartu BRI Rp 20.000',
    description: 'Potongan Rp 20.000 min. order Rp 60.000 dengan BRI',
    discountAmount: 20000,
    discountType: 'flat',
    minSpend: 60000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bri',
    sponsorType: 'bank',
    sponsorName: 'Bank BRI',
    sponsorIcon: '🏛️',
    sponsorBrandColor: '#00529c',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku untuk pembayaran melalui BRImo QRIS atau Kartu Debit BRI.',
      'Min. transaksi Rp 60.000.',
      'Berlaku setiap hari selama masa periode program promo.'
    ]
  },
  {
    code: 'KOPIHEBAT',
    title: 'Voucher Kopitiam Loyalty Rp 10.000',
    description: 'Potongan Rp 10.000 untuk varian Kopi & Manual Brew',
    discountAmount: 10000,
    discountType: 'flat',
    minSpend: 30000,
    isStackable: true,
    issuerOrigin: 'merchant',
    contactId: 'contact-merchant',
    sponsorType: 'merchant',
    sponsorName: 'Kopitiam Official',
    sponsorIcon: '☕',
    sponsorBrandColor: '#d97706',
    expiryDate: '31 Des 2026',
    quantity: 3, // Multi voucher
    isActive: true,
    termsAndConditions: [
      'Voucher resmi diterbitkan oleh Kopitiam Senopati & Roastery HQ.',
      'Min. transaksi Rp 30.000 untuk seluruh kategori minuman kopi.',
      'Dapat digabungkan dengan promo bank sponsor.'
    ]
  },
  {
    code: 'GRABFOOD20',
    title: 'Partner Promo GrabFood Rp 20.000',
    description: 'Diskon merchant partner min. order Rp 60.000',
    discountAmount: 20000,
    discountType: 'flat',
    minSpend: 60000,
    isStackable: false,
    issuerOrigin: 'platform',
    contactId: 'contact-grab',
    sponsorType: 'partner',
    sponsorName: 'Grab Partner',
    sponsorIcon: '🛵',
    sponsorBrandColor: '#00b14f',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Voucher promo khusus kemitraan GrabFood Dine-in.',
      'Single use only, tidak dapat digabungkan dengan promo bank lain.'
    ]
  },
  {
    code: 'CASHBACK50',
    title: 'Cashback 50% Poin VIP Sultan',
    description: 'Cashback poin loyalitas hingga 200 Poin untuk member terdaftar',
    discountAmount: 12000,
    discountType: 'flat',
    minSpend: 35000,
    isStackable: true,
    issuerOrigin: 'merchant',
    contactId: 'contact-vip',
    sponsorType: 'loyalty',
    sponsorName: 'VIP Member',
    sponsorIcon: '👑',
    sponsorBrandColor: '#8b5cf6',
    expiryDate: '31 Des 2026',
    quantity: 2, // Multi voucher
    isActive: true,
    termsAndConditions: [
      'Berlaku otomatis untuk semua pelanggan terdaftar dengan status VIP Member.',
      'Poin langsung dikreditkan ke saldo akun setelah pesanan selesai.'
    ]
  }
]

export interface VoucherCardProps {
  voucher: Voucher
  mode?: 'selectable' | 'copyable'
  isApplied?: boolean
  isCopied?: boolean
  onSelect?: (voucher: Voucher) => void
  onCopy?: (code: string) => void
  onViewDetails?: (voucher: Voucher) => void
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  mode = 'selectable',
  isApplied = false,
  isCopied = false,
  onSelect,
  onCopy,
  onViewDetails
}) => {
  const { customerTheme } = useMerchantConfig()
  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const cardBg = isLight ? '#ffffff' : 'rgba(15,23,42,0.9)'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const codeBg = isLight ? '#f1f5f9' : 'rgba(2,6,23,0.8)'
  const codeBorder = isLight ? '#cbd5e1' : '#1e293b'

  const brandColor = voucher.sponsorBrandColor || '#d97706'
  const hasMultiple = (voucher.quantity || 1) > 1

  return (
    <div
      className={`shrink-0 border rounded-2xl p-3 flex flex-col gap-2 transition-all shadow-sm relative overflow-hidden group ${
        isApplied
          ? 'bg-amber-500/10 border-amber-500/60 shadow-amber-500/10'
          : ''
      }`}
      style={
        !isApplied
          ? { backgroundColor: cardBg, borderColor: cardBorder }
          : undefined
      }
    >
      {/* TOP ROW: BRAND LOGO + TITLE + QUANTITY + DISCOUNT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* PROMINENT SPONSOR / BANK BRAND LOGO AVATAR */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm border relative"
          style={{
            backgroundColor: `${brandColor}18`,
            borderColor: `${brandColor}40`,
            color: brandColor
          }}
          title={voucher.sponsorName}
        >
          {voucher.sponsorLogoUrl ? (
            <img src={voucher.sponsorLogoUrl} alt={voucher.sponsorName} className="w-full h-full object-contain p-1" />
          ) : (
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-base">{voucher.sponsorIcon || '🎟️'}</span>
              <span className="text-[7px] font-black uppercase font-mono tracking-tighter mt-0.5 opacity-90 truncate max-w-[38px]">
                {voucher.sponsorName?.split(' ')[1] || voucher.sponsorName || 'Promo'}
              </span>
            </div>
          )}

          {/* MULTI-VOUCHER STACK BADGE CORNER */}
          {hasMultiple && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black font-mono w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {voucher.quantity}
            </span>
          )}
        </div>

        {/* VOUCHER HEADLINE & SUBTITLE */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="font-extrabold text-xs leading-tight truncate" style={{ color: textColor }}>
              {voucher.title}
            </h4>
            <span className="text-xs font-black font-mono text-amber-500 whitespace-nowrap shrink-0">
              -Rp {voucher.discountAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-[10.5px] truncate mt-0.5" style={{ color: secondaryTextColor }}>
            {voucher.description}
          </p>

          {/* BADGES ROW */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="text-[9px] font-bold px-1.5 py-0.2 rounded border truncate max-w-[120px]"
              style={{
                backgroundColor: `${brandColor}15`,
                color: brandColor,
                borderColor: `${brandColor}35`
              }}
            >
              {voucher.sponsorName}
            </span>

            {/* ISSUER ORIGIN BADGE: PLATFORM VS MERCHANT */}
            <span className={`text-[8.5px] font-mono font-bold px-1 py-0.2 rounded shrink-0 border ${
              voucher.issuerOrigin === 'platform'
                ? 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30'
                : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
            }`}>
              {voucher.issuerOrigin === 'platform' ? '⚡ Platform' : '🏠 Toko'}
            </span>

            {voucher.isStackable ? (
              <span className="text-[8.5px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.2 rounded shrink-0">
                ⚡ Stackable
              </span>
            ) : (
              <span 
                className="text-[8.5px] font-mono px-1 py-0.2 rounded border shrink-0"
                style={{ backgroundColor: codeBg, color: secondaryTextColor, borderColor: codeBorder }}
              >
                Single-Use
              </span>
            )}

            {hasMultiple && (
              <span className="text-[8.5px] font-mono font-black text-amber-600 dark:text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shrink-0">
                <Layers className="w-2.5 h-2.5" /> {voucher.quantity}x Kupon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR: CODE + DETAILS LINK + COMPACT BUTTON */}
      <div className="flex items-center justify-between pt-2 border-t gap-2" style={{ borderColor: cardBorder }}>
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="px-2 py-0.5 rounded-lg font-mono font-black text-[11px] text-amber-600 dark:text-amber-400 tracking-wider shrink-0 border"
            style={{ backgroundColor: codeBg, borderColor: codeBorder }}
          >
            {voucher.code}
          </div>

          {/* 1-TAP TERMS & CONDITIONS / DETAIL TRIGGER */}
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(voucher)}
              className="text-[10px] font-semibold hover:text-amber-500 flex items-center gap-0.5 transition-colors shrink-0 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2"
              style={{ color: secondaryTextColor }}
            >
              <Info className="w-3 h-3" />
              <span>S&K</span>
            </button>
          )}
        </div>

        {mode === 'copyable' ? (
          <button
            type="button"
            onClick={() => onCopy && onCopy(voucher.code)}
            className={`text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1 transition-all shadow active:scale-95 touch-manipulation shrink-0 ${
              isCopied
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelect && onSelect(voucher)}
            className={`text-[11px] font-bold px-3.5 py-1 rounded-xl flex items-center gap-1 transition-all shadow active:scale-95 touch-manipulation shrink-0 ${
              isApplied
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Terpasang</span>
              </>
            ) : (
              'Gunakan'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
