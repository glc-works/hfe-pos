import React from 'react'
import { X, Check, Copy, Calendar, ShieldCheck, Layers, Sparkles } from 'lucide-react'
import { Voucher } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export interface VoucherDetailModalProps {
  voucher: Voucher | null
  isOpen: boolean
  onClose: () => void
  onApply?: (voucher: Voucher) => void
  onCopy?: (code: string) => void
  isApplied?: boolean
  isCopied?: boolean
  mode?: 'selectable' | 'copyable'
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  isOpen,
  onClose,
  onApply,
  onCopy,
  isApplied = false,
  isCopied = false,
  mode = 'selectable'
}) => {
  const { customerTheme } = useMerchantConfig()
  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'

  if (!isOpen || !voucher) return null

  const terms = voucher.termsAndConditions || [
    `Minimum transaksi Rp ${(voucher.minSpend || 0).toLocaleString('id-ID')} sebelum pajak PB1 dan service charge.`,
    voucher.sponsorType === 'bank'
      ? `Berlaku khusus untuk pembayaran menggunakan kartu Debit/Kredit ${voucher.sponsorName} atau EDC resto.`
      : `Berlaku untuk seluruh menu kategori yang berpartisipasi di outlet resmi.`,
    voucher.isStackable
      ? 'Dapat digabungkan (stackable) dengan promo merchant atau kupon loyalitas lainnya.'
      : 'Hanya berlaku 1 kupon per transaksi (tidak dapat digabungkan dengan promo sejenis).',
    'Voucher tidak dapat diuangkan, dipindahtangankan, atau dikembalikan jika pesanan dibatalkan.',
    `Masa berlaku voucher hingga ${voucher.expiryDate || '31 Desember 2026'}. Kuota promo mengikuti kebijakan penerbit.`
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
      <div 
        className="w-full max-w-md border rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        {/* DRAG HANDLE BAR */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-1 shrink-0 sm:hidden" />

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 font-black text-sm">
              {voucher.sponsorIcon || '🎟️'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider font-mono">
                {voucher.sponsorName || 'Official Promo'}
              </span>
              <h3 className="font-extrabold text-sm truncate leading-tight" style={{ color: textColor }}>
                Detail Syarat & Ketentuan
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VOUCHER SUMMARY CARD */}
        <div 
          className="border rounded-2xl p-4 flex flex-col gap-2.5 shadow-inner"
          style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-black" style={{ color: textColor }}>{voucher.title}</span>
            <span className="text-sm font-black font-mono text-amber-500 whitespace-nowrap">
              -Rp {voucher.discountAmount.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: secondaryTextColor }}>{voucher.description}</p>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            {voucher.isStackable ? (
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Stackable (Bisa Digabung)
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                Single-Use Only
              </span>
            )}

            {(voucher.quantity || 1) > 1 && (
              <span className="text-[10px] font-black font-mono text-amber-600 dark:text-amber-300 bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Layers className="w-3 h-3" /> {voucher.quantity}x Kupon Dimiliki
              </span>
            )}

            <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: secondaryTextColor }}>
              <Calendar className="w-3 h-3" /> Berlaku s/d {voucher.expiryDate || '31 Des 2026'}
            </span>
          </div>
        </div>

        {/* PROMO CODE DISPLAY & COPY */}
        <div 
          className="border border-dashed border-amber-500/50 rounded-2xl p-3.5 flex items-center justify-between gap-2"
          style={{ backgroundColor: `${customerTheme.primaryAccentHex}10` }}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono" style={{ color: secondaryTextColor }}>Kode Promo Kupon</span>
            <span className="text-sm font-black font-mono text-amber-500 tracking-wider">{voucher.code}</span>
          </div>

          <button
            type="button"
            onClick={() => onCopy && onCopy(voucher.code)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow ${
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
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        {/* TERMS AND CONDITIONS LIST */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold flex items-center gap-1.5" style={{ color: textColor }}>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Syarat & Ketentuan Penggunaan (S&K):
          </h4>
          <ul 
            className="flex flex-col gap-2 border rounded-2xl p-3.5 text-[11px] leading-relaxed"
            style={{ backgroundColor: subCardBg, borderColor: subCardBorder, color: secondaryTextColor }}
          >
            {terms.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold font-mono shrink-0">{idx + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BOTTOM ACTION */}
        {mode === 'selectable' && onApply && (
          <button
            type="button"
            onClick={() => {
              onApply(voucher)
              onClose()
            }}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              isApplied
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Kupon Sudah Terpasang di Checkout</span>
              </>
            ) : (
              <span>Gunakan Kupon Ini Sekarang</span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
