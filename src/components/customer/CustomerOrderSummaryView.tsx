import React, { useState } from 'react'
import {
  RotateCcw, Utensils, CheckCircle2, QrCode, Receipt,
  Sparkles, Plus, Download, ChevronUp, ChevronDown
} from 'lucide-react'
import { OrderTicket, PaymentPolicy, CafeThemeConfig, HfeCompanyProfile } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface CustomerOrderSummaryViewProps {
  order: OrderTicket | null
  tableOrders?: OrderTicket[]
  selectedTable: string
  scannedSeat?: string
  activeTheme: CafeThemeConfig
  paymentPolicy: PaymentPolicy
  onAddMoreItems: () => void
  onPayOrderNow?: (order: OrderTicket) => void
  onPayTableSession?: () => void
  hfeCompanyProfile?: HfeCompanyProfile
}

export const CustomerOrderSummaryView: React.FC<CustomerOrderSummaryViewProps> = ({
  order,
  tableOrders = [],
  selectedTable,
  scannedSeat = '1',
  activeTheme,
  paymentPolicy,
  onAddMoreItems,
  onPayOrderNow,
  onPayTableSession
}) => {
  const { t, formatPrice } = useTranslation()
  const [showBillDetails, setShowBillDetails] = useState<boolean>(false)
  const [downloadedNotice, setDownloadedNotice] = useState<boolean>(false)

  const isLight = activeTheme.mode === 'light'
  const textColor = isLight ? '#0f172a' : '#f8fafc'
  const secondaryTextColor = isLight ? '#64748b' : '#94a3b8'
  const cardBorderColor = isLight ? '#f1f5f9' : '#1e293b'
  const accentColor = activeTheme.primaryAccentHex || '#ea580c'

  // If no order yet, show empty state
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-3 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
          <Utensils className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold" style={{ color: textColor }}>Belum Ada Pesanan Aktif</h3>
        <p className="text-xs max-w-xs" style={{ color: secondaryTextColor }}>
          Silakan pilih menu dari katalog untuk memulai pesanan meja Anda.
        </p>
        <button
          type="button"
          onClick={onAddMoreItems}
          className="mt-2 text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-sm active:scale-95 transition-all cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          {t.customer.addMoreItemsForNextRound}
        </button>
      </div>
    )
  }

  const isPayFirst = paymentPolicy === 'pay-first' || order.policy === 'pay-first'
  const relevantOrders = tableOrders.filter(o => o.table === selectedTable && o.status !== 'cancelled')
  const activeOrders = relevantOrders.length > 0 ? relevantOrders : [order]
  const sessionTotal = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  const handleSimulateDownload = () => {
    setDownloadedNotice(true)
    setTimeout(() => setDownloadedNotice(false), 3000)
  }

  return (
    <div className="flex flex-col gap-3 pb-36 animate-fadeIn select-none">
      {/* 1. TOP HEADER & TABLE IDENTIFIER CARD (ALA ESB) */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight" style={{ color: textColor }}>
            Order Summary
          </h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 active:scale-95"
            title="Refresh Pesanan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ESB TABLE PILL */}
        <div
          className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center text-center shadow-xs border"
          style={{
            backgroundColor: isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.15)',
            borderColor: isLight ? '#fde68a' : 'rgba(217, 119, 6, 0.3)'
          }}
        >
          <span className="text-xs sm:text-sm font-bold" style={{ color: isLight ? '#92400e' : '#fcd34d' }}>
            Table: <span className="font-extrabold font-mono text-sm sm:text-base">{selectedTable || 'A8'}</span>
          </span>
        </div>

        {/* METADATA STRIP: TRANSACTION NUMBER & NUMBER OF PAX */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Transaction Number</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
              #{order.id}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-medium">Number of Pax</span>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
              {scannedSeat ? scannedSeat.replace(/[^0-9]/g, '') || '1' : '1'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ROUNDED ORDERS CARDS (ALA ESB: ORDER 1, ORDER 2...) */}
      <div className="flex flex-col gap-3 mt-1">
        {activeOrders.map((ord, roundIdx) => {
          const itemCount = ord.items.reduce((sum, item) => sum + item.quantity, 0)
          const roundTitle = activeOrders.length > 1
            ? `Order ${roundIdx + 1} (${itemCount} Item)`
            : `Order 1 (${itemCount} Item)`

          return (
            <div
              key={ord.id || roundIdx}
              className="bg-white dark:bg-slate-900 rounded-2xl border shadow-xs overflow-hidden"
              style={{ borderColor: cardBorderColor }}
            >
              {/* ROUND HEADER */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: cardBorderColor }}>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {roundTitle}
                </span>
                {isPayFirst && (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Lunas
                  </span>
                )}
              </div>

              {/* ITEMS LIST (ESB ROW PATTERN) */}
              <div className="divide-y" style={{ borderColor: cardBorderColor }}>
                {ord.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="px-4 py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      {/* QTY BADGE ORANGE SOFT */}
                      <span className="shrink-0 text-[11px] font-mono font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-900/50 mt-0.5">
                        {item.quantity}x
                      </span>
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-xs font-bold leading-snug line-clamp-2 text-slate-900 dark:text-slate-100">
                          {item.name}
                        </h4>
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {item.selectedModifiers.map(m => m.name).join(', ')}
                          </p>
                        )}
                        {item.customNotes && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                            &quot;{item.customNotes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PRICE & PREPARING STATUS */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                        Preparing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. ADD MORE / NEW ROUND BUTTON (SECONDARY ACTION) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onAddMoreItems}
          className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-600" />
          <span>+ Tambah Menu Lain / Ronde Baru</span>
        </button>
      </div>

      {/* 4. EXPANDABLE BILL DETAILS DRAWER TRIGGER */}
      {showBillDetails && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-xs flex flex-col gap-2 text-xs" style={{ borderColor: cardBorderColor }}>
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span className="font-mono">{formatPrice(order.total - (order.taxPB1Amount || 0) - (order.serviceFeeAmount || 0))}</span>
          </div>
          {order.serviceFeeAmount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>{t.customer.serviceChargeLabel}:</span>
              <span className="font-mono">+{formatPrice(order.serviceFeeAmount)}</span>
            </div>
          )}
          {order.taxPB1Amount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>{t.customer.pbjtTaxLabel}:</span>
              <span className="font-mono">+{formatPrice(order.taxPB1Amount)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between pt-2 border-t font-black" style={{ borderColor: cardBorderColor }}>
            <span>Total Tagihan:</span>
            <span className="font-mono text-sm font-extrabold text-orange-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM PAY DOCK (ALA ESB: TOTAL PAYMENT + PAY BUTTON) */}
      <div className="fixed bottom-16 inset-x-0 z-30 flex justify-center pointer-events-none px-3.5">
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3 pointer-events-auto">
          <div
            onClick={() => setShowBillDetails(!showBillDetails)}
            className="flex flex-col cursor-pointer min-w-0"
          >
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-slate-700">
              <span>Total Payment</span>
              {showBillDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </div>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-slate-100 truncate">
              {formatPrice(sessionTotal)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPayFirst ? (
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbayar</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onPayTableSession || (() => onPayOrderNow?.(order))}
                className="px-6 py-2.5 rounded-xl text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: accentColor }}
              >
                <span>Pay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
