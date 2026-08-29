import React, { useState } from 'react'
import { QrCode, CreditCard, Landmark, Banknote, ChevronRight, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react'

export type DeliveryPaymentMethodKey = 'qris_instant' | 'card_online' | 'bank_va' | 'cod_cash'

export interface CustomerDeliveryPaymentSelectorProps {
  selectedMethod: DeliveryPaymentMethodKey
  onSelectMethod: (method: DeliveryPaymentMethodKey) => void
  grandTotalFormatted: string
}

export const CustomerDeliveryPaymentSelector: React.FC<CustomerDeliveryPaymentSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  grandTotalFormatted
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false)

  const paymentOptions: {
    id: DeliveryPaymentMethodKey
    title: string
    subtitle: string
    badge?: string
    isAvailable: boolean
    icon: React.ReactNode
  }[] = [
    {
      id: 'qris_instant',
      title: 'QRIS & E-Wallet',
      subtitle: 'Semua Bank & Dompet Digital',
      badge: 'Aktif • Bebas Biaya',
      isAvailable: true,
      icon: <QrCode className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'card_online',
      title: 'Kartu Debit / Kredit Online',
      subtitle: 'Visa, Mastercard, JCB, GPN',
      badge: 'Segera Hadir',
      isAvailable: false,
      icon: <CreditCard className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'bank_va',
      title: 'Virtual Account Bank',
      subtitle: 'BCA, Mandiri, BRI, BNI & Lainnya',
      badge: 'Segera Hadir',
      isAvailable: false,
      icon: <Landmark className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'cod_cash',
      title: 'Bayar Tunai ke Kurir',
      subtitle: 'Bayar uang pas saat pesanan tiba',
      badge: 'Segera Hadir',
      isAvailable: false,
      icon: <Banknote className="w-5 h-5 text-slate-400" />
    }
  ]

  const activeOption = paymentOptions.find((p) => p.id === selectedMethod) || paymentOptions[0]

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2.5 shadow-md transition-all">
      {/* Top Header Row with Title and Action Trigger */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-primary" />
          <span>Metode Pembayaran</span>
        </label>
        <button
          type="button"
          onClick={() => setShowDetailModal(true)}
          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-0.5 px-2 py-0.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <span>Ubah</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Payment Method Card (Spacious 2-Row Stacked Layout) */}
      <button
        type="button"
        onClick={() => setShowDetailModal(true)}
        className="w-full bg-background hover:bg-muted/40 border border-border hover:border-primary/40 rounded-xl p-3 flex items-center gap-3 text-left transition-all active:scale-[0.99] group shadow-sm cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {activeOption.icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-bold text-foreground leading-tight">
            {activeOption.title}
          </span>
          <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            {activeOption.subtitle}
          </span>
        </div>
      </button>

      {/* Elegant Payment Methods Detail Modal / Sheet */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar animate-slideUp">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Pilih Metode Pembayaran</h3>
                  <p className="text-[11px] text-muted-foreground">Total Tagihan: <span className="font-mono font-bold text-foreground">{grandTotalFormatted}</span></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {paymentOptions.map((opt) => {
                const isSelected = selectedMethod === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!opt.isAvailable}
                    onClick={() => {
                      if (opt.isAvailable) {
                        onSelectMethod(opt.id)
                        setShowDetailModal(false)
                      }
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-foreground shadow-md'
                        : opt.isAvailable
                        ? 'bg-background hover:bg-muted/50 border-border text-foreground cursor-pointer'
                        : 'bg-muted/20 border-border/50 text-muted-foreground opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                        {opt.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{opt.title}</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                              opt.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">{opt.subtitle}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pembayaran diproses secara instan & aman dengan pencatatan jurnal Hfe CORE real-time.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
