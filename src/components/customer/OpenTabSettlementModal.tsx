import React, { useState } from 'react'
import {
  X, QrCode, CheckCircle2, Receipt, ShieldCheck, HeartHandshake,
  Ticket, Sparkles, Download, Share2, ArrowRight
} from 'lucide-react'
import { OrderTicket, Voucher } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export interface OpenTabSettlementModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTable: string
  scannedSeat?: string
  totalBill: number
  tableOrders?: OrderTicket[]
  onSettlementSuccess: (settlementDetails: {
    paidAmount: number
    method: 'qris' | 'cash' | 'card'
    taxPB1: number
    tipAmount: number
    pointsEarned: number
  }) => void
}

export const OpenTabSettlementModal: React.FC<OpenTabSettlementModalProps> = ({
  isOpen,
  onClose,
  selectedTable,
  scannedSeat = 'Seat 1',
  totalBill,
  tableOrders = [],
  onSettlementSuccess
}) => {
  const { customerTheme, vouchers } = useMerchantConfig()
  const activeVouchers = vouchers.filter(v => v.isActive !== false)

  const [selectedTip, setSelectedTip] = useState<number>(0)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isSuccessReceipt, setIsSuccessReceipt] = useState<boolean>(false)

  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'

  if (!isOpen) return null

  const discountAmount = selectedVoucher ? selectedVoucher.discountAmount : 0
  const discountedSubtotal = Math.max(0, totalBill - discountAmount)
  const serviceFee = Math.round(discountedSubtotal * 0.05)
  const pb1Tax = Math.round((discountedSubtotal + serviceFee) * 0.1)
  const grandTotal = discountedSubtotal + serviceFee + pb1Tax + selectedTip
  const pointsEarned = Math.floor(grandTotal / 1000)

  const handleConfirmQRISPayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccessReceipt(true)
      onSettlementSuccess({
        paidAmount: grandTotal,
        method: 'qris',
        taxPB1: pb1Tax,
        tipAmount: selectedTip,
        pointsEarned
      })
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        className="w-full max-w-md border rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccessReceipt ? (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b pb-3 pr-8" style={{ borderColor: cardBorder }}>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm tracking-tight leading-tight truncate" style={{ color: textColor }}>
                  Pelunasan QRIS Meja (Open Tab)
                </h3>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: secondaryTextColor }}>
                  {selectedTable} • {scannedSeat} • Instant Settlement
                </p>
              </div>
            </div>

            {/* QR CODE CONTAINER WITH SCANNING MOCK */}
            <div 
              className="border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-inner text-center"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200">
                {/* QR SVG MOCK */}
                <div className="w-40 h-40 bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                  <QrCode className="w-28 h-28 text-white" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-amber-400 uppercase mt-1">
                    QRIS RESMI HFE
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400">NMID: ID1020039201948</span>
                <p className="text-xs font-bold" style={{ color: textColor }}>
                  Scan dengan GoPay, OVO, Dana, BCA, BRImo, atau Livin
                </p>
              </div>
            </div>

            {/* VOUCHER PROMO SELECTOR AT SETTLEMENT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold flex items-center gap-1" style={{ color: textColor }}>
                <Ticket className="w-3.5 h-3.5 text-amber-500" /> Pasang Kupon Potongan (Opsional):
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {activeVouchers.slice(0, 3).map(v => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => setSelectedVoucher(selectedVoucher?.code === v.code ? null : v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedVoucher?.code === v.code
                        ? 'shadow-sm font-black'
                        : ''
                    }`}
                    style={
                      selectedVoucher?.code === v.code
                        ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                        : { backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }
                    }
                  >
                    <span>{v.sponsorIcon || '🎟️'}</span>
                    <span>{v.code} (-Rp {v.discountAmount.toLocaleString('id-ID')})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TIP SELECTION */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold flex items-center gap-1" style={{ color: secondaryTextColor }}>
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500" /> Tip Barista (Opsional):
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 2000, 5000, 10000].map(tip => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => setSelectedTip(tip)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTip === tip ? 'shadow-sm font-black' : ''
                    }`}
                    style={
                      selectedTip === tip
                        ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                        : { backgroundColor: subCardBg, color: secondaryTextColor, borderColor: subCardBorder }
                    }
                  >
                    {tip === 0 ? 'Tanpa Tip' : `+${tip / 1000}rb`}
                  </button>
                ))}
              </div>
            </div>

            {/* BILL CALCULATION SUMMARY */}
            <div 
              className="border rounded-2xl p-3.5 flex flex-col gap-1.5 text-xs shadow-sm"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Subtotal Pesanan Meja:</span>
                <span className="font-mono">Rp {totalBill.toLocaleString('id-ID')}</span>
              </div>
              {selectedVoucher && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Diskon Kupon ({selectedVoucher.code}):</span>
                  <span className="font-mono">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Service Fee (5%):</span>
                <span className="font-mono">+Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Pajak Restoran PB1 (10%):</span>
                <span className="font-mono">+Rp {pb1Tax.toLocaleString('id-ID')}</span>
              </div>
              {selectedTip > 0 && (
                <div className="flex justify-between text-amber-500 font-bold">
                  <span>Tips Barista:</span>
                  <span className="font-mono">+Rp {selectedTip.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-2 border-t" style={{ borderColor: subCardBorder, color: textColor }}>
                <span>Total Pelunasan:</span>
                <span className="text-base font-mono font-black" style={{ color: customerTheme.primaryAccentHex }}>
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* CONFIRM PAYMENT BUTTON */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmQRISPayment}
              className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
            >
              {isProcessing ? (
                <span>Memverifikasi Pembayaran QRIS...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Konfirmasi Pelunasan QRIS Selesai ➔</span>
                </>
              )}
            </button>
          </>
        ) : (
          /* SUCCESSFUL DIGITAL RECEIPT VIEW */
          <div className="flex flex-col gap-4 py-2 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-black text-base" style={{ color: textColor }}>
                Pembayaran Meja Berhasil!
              </h3>
              <p className="text-xs" style={{ color: secondaryTextColor }}>
                Tagihan {selectedTable} telah lunas. Saldo poin loyalitas Anda bertambah <strong>+{pointsEarned} Poin</strong>.
              </p>
            </div>

            {/* COMPACT DIGITAL RECEIPT TICKET */}
            <div 
              className="border border-dashed rounded-2xl p-4 text-left flex flex-col gap-2 text-xs font-mono"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="flex justify-between text-slate-400 border-b pb-2" style={{ borderColor: subCardBorder }}>
                <span>No. Transaksi:</span>
                <span className="font-bold text-amber-500">TRX-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Meja & Sesi:</span>
                <span style={{ color: textColor }}>{selectedTable} • {scannedSeat}</span>
              </div>
              <div className="flex justify-between" style={{ color: secondaryTextColor }}>
                <span>Metode Pelunasan:</span>
                <span className="font-bold text-emerald-500">QRIS Instant Lunas</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: subCardBorder, color: textColor }}>
                <span>Total Dibayar:</span>
                <span className="text-sm font-black text-amber-500">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => alert('Struk digital telah diunduh!')}
                className="flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                style={{ backgroundColor: subCardBg, borderColor: subCardBorder, color: textColor }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Struk</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-black text-xs shadow transition-all"
                style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
