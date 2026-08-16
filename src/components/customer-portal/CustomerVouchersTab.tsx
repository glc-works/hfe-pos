import React, { useState } from 'react'
import { Ticket, Sparkles, Check, Copy, Tag, Info, AlertCircle } from 'lucide-react'
import { Voucher } from '../../types/pos'
import { VoucherDetailModal } from '../pos/VoucherDetailModal'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export interface CustomerVouchersTabProps {
  onApplyVoucherToCart?: (voucher: Voucher) => void
}

export const CustomerVouchersTab: React.FC<CustomerVouchersTabProps> = ({
  onApplyVoucherToCart
}) => {
  const { vouchers } = useMerchantConfig()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedVoucherForDetails, setSelectedVoucherForDetails] = useState<Voucher | null>(null)
  const [usedVoucherNotice, setUsedVoucherNotice] = useState<string | null>(null)

  const activeVouchers = vouchers.filter(v => v.isActive !== false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handleUseVoucher = (v: Voucher) => {
    if (onApplyVoucherToCart) {
      onApplyVoucherToCart(v)
    }
    handleCopyCode(v.code)
    setUsedVoucherNotice(`Kupon ${v.code} siap digunakan pada pesanan berikutnya!`)
    setTimeout(() => setUsedVoucherNotice(null), 3000)
  }

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-amber-400" /> Dompet Voucher & Promo
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">Kupon diskon, reward ulang tahun & partner bank</p>
        </div>
        <span className="text-[10px] font-mono bg-slate-900 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-slate-800">
          {activeVouchers.length} Kupon Aktif
        </span>
      </div>

      {usedVoucherNotice && (
        <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-amber-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{usedVoucherNotice}</span>
        </div>
      )}

      {/* VOUCHERS LIST */}
      <div className="grid grid-cols-1 gap-3">
        {activeVouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code
          return (
            <div
              key={voucher.code}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xl transition-all relative overflow-hidden group"
            >
              {/* ACCENT STRIPE */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />

              <div className="flex items-start justify-between gap-3 pl-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {voucher.code}
                    </span>
                    {voucher.sponsorName && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        by {voucher.sponsorName}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1.5">{voucher.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{voucher.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVoucherForDetails(voucher)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white shrink-0"
                  title="Syarat & Ketentuan"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 pl-1">
                <div className="text-[10px] text-slate-400 font-mono">
                  <span>Min. Belanja: <strong className="text-slate-200">Rp {(voucher.minSpend || 0).toLocaleString('id-ID')}</strong></span>
                  {voucher.expiryDate && <span className="block text-slate-500">Exp: {voucher.expiryDate}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(voucher.code)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseVoucher(voucher)}
                    className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Pakai</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL TERMS & CONDITIONS */}
      <VoucherDetailModal
        voucher={selectedVoucherForDetails}
        isOpen={!!selectedVoucherForDetails}
        onClose={() => setSelectedVoucherForDetails(null)}
        mode="copyable"
        isCopied={copiedCode === selectedVoucherForDetails?.code}
        onCopy={handleCopyCode}
      />
    </div>
  )
}
