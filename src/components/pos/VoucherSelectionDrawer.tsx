import React, { useState } from 'react'
import { Ticket, X, Trash2, Tag, AlertCircle } from 'lucide-react'
import { Voucher, VoucherCard } from './VoucherCard'
import { VoucherDetailModal } from './VoucherDetailModal'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export { type Voucher } from './VoucherCard'

export interface VoucherSelectionDrawerProps {
  show: boolean
  onClose: () => void
  availableVouchers?: Voucher[]
  appliedVouchers: Voucher[]
  onApplyVoucher: (voucher: Voucher) => void
  onRemoveVoucher: (code: string) => void
  manualCodeInput: string
  setManualCodeInput: (val: string) => void
  onApplyManualCode: () => void
}

export const VoucherSelectionDrawer: React.FC<VoucherSelectionDrawerProps> = ({
  show,
  onClose,
  availableVouchers,
  appliedVouchers,
  onApplyVoucher,
  onRemoveVoucher,
  manualCodeInput,
  setManualCodeInput,
  onApplyManualCode
}) => {
  const { vouchers, customerTheme } = useMerchantConfig()
  const activeVouchers = (availableVouchers || vouchers).filter(v => v.isActive !== false)
  const [selectedVoucherForDetails, setSelectedVoucherForDetails] = useState<Voucher | null>(null)

  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const inputBg = isLight ? '#f8fafc' : '#020617'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'

  if (!show) return null

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
        <div 
          className="border rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[85vh] overflow-hidden animate-slideUp"
          style={{ backgroundColor: modalBg, borderColor: cardBorder }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: textColor }}>🎟️ Pilih / Lihat Voucher Promo</h3>
                <p className="text-[11px]" style={{ color: secondaryTextColor }}>Promo Bank, Partner & Merchant (Multi-Stacking)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Manual Input Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3 top-3" style={{ color: secondaryTextColor }} />
              <input
                type="text"
                placeholder="Ketik kode promo (misal: BCA15K)"
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
                className="w-full border rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
              />
            </div>
            <button
              onClick={onApplyManualCode}
              disabled={!manualCodeInput.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition-all whitespace-nowrap"
            >
              Terapkan
            </button>
          </div>

          {/* Applied Vouchers List */}
          {appliedVouchers.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                <span>Voucher Terpasang:</span>
                <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                  {appliedVouchers.length} Kupon
                </span>
              </span>

              <div className="flex flex-col gap-2">
                {appliedVouchers.map((v) => (
                  <div
                    key={v.code}
                    className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs"
                    style={{ color: textColor }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-500">{v.code}</span>
                      <span style={{ color: secondaryTextColor }}>({v.title})</span>
                    </div>
                    <button
                      onClick={() => onRemoveVoucher(v.code)}
                      className="text-rose-500 hover:text-rose-400 p-1"
                      title="Hapus Voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Vouchers List (Using Shared Compact VoucherCard) */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1 pb-4 no-scrollbar">
            <span className="text-xs font-semibold" style={{ color: secondaryTextColor }}>Voucher & Promo Tersedia:</span>
            {activeVouchers.map((v) => {
              const isApplied = appliedVouchers.some(av => av.code === v.code)
              return (
                <VoucherCard
                  key={v.code}
                  voucher={v}
                  mode="selectable"
                  isApplied={isApplied}
                  onSelect={(voucher) => {
                    if (isApplied) onRemoveVoucher(voucher.code)
                    else onApplyVoucher(voucher)
                  }}
                  onViewDetails={(voucher) => setSelectedVoucherForDetails(voucher)}
                />
              )
            })}
          </div>

          {/* Footer info */}
          <div className="pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: cardBorder, color: secondaryTextColor }}>
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Voucher berlaku sesuai kuota & S&K.
            </span>
            <button
              onClick={onClose}
              className="theme-customer-btn-primary font-bold px-4 py-2 rounded-xl text-xs shadow"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED TERMS & CONDITIONS MODAL SHEET */}
      <VoucherDetailModal
        voucher={selectedVoucherForDetails}
        isOpen={!!selectedVoucherForDetails}
        onClose={() => setSelectedVoucherForDetails(null)}
        mode="selectable"
        isApplied={appliedVouchers.some(av => av.code === selectedVoucherForDetails?.code)}
        onApply={(v) => {
          if (appliedVouchers.some(av => av.code === v.code)) {
            onRemoveVoucher(v.code)
          } else {
            onApplyVoucher(v)
          }
        }}
      />
    </>
  )
}
