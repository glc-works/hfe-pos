import React, { useState } from 'react'
import {
  X, Receipt, Plus, QrCode, Bell, Coffee, Utensils, CheckCircle2,
  Clock, ShieldCheck, Sparkles, ChevronRight, AlertCircle, Wifi, Copy, Check
} from 'lucide-react'
import { OrderTicket, TableStatus, HfeCompanyProfile } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useNotification } from '../../context/NotificationContext'
import { PostVisitFeedbackSection } from './PostVisitFeedbackSection'


export interface ActiveOpenBillDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedTable: string
  scannedSeat?: string
  tableStatus?: TableStatus | null
  tableOrders?: OrderTicket[]
  hfeCompanyProfile?: HfeCompanyProfile
  onAddMoreItems: () => void
  onOpenSettlementQRIS: () => void
  onCallWaiterForBill?: () => void
}

export const ActiveOpenBillDrawer: React.FC<ActiveOpenBillDrawerProps> = ({
  isOpen,
  onClose,
  selectedTable,
  scannedSeat = 'Seat 1',
  tableStatus,
  tableOrders = [],
  hfeCompanyProfile,
  onAddMoreItems,
  onOpenSettlementQRIS,
  onCallWaiterForBill
}) => {
  const { customerTheme } = useMerchantConfig()
  const { createServiceTicket } = useNotification()
  const [waiterCalled, setWaiterCalled] = useState<boolean>(false)
  const [waterCalled, setWaterCalled] = useState<boolean>(false)
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false)

  const defaultSsid = hfeCompanyProfile?.brandName ? `${hfeCompanyProfile.brandName.replace(/[^a-zA-Z0-9]/g, '_')}_Guest` : 'Guest_WiFi'
  const wifiSsid = hfeCompanyProfile?.storefrontInfo?.wifiSsid || defaultSsid
  const wifiPassword = hfeCompanyProfile?.storefrontInfo?.wifiPassword || 'guestwifi123'
  const wifiAccessPolicy = hfeCompanyProfile?.storefrontInfo?.wifiAccessPolicy || 'after_payment'

  const handleCopyWifi = (pass: string) => {
    navigator.clipboard?.writeText(pass)
    setCopiedWifi(true)
    setTimeout(() => setCopiedWifi(false), 2500)
  }

  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'

  if (!isOpen) return null

  // Collect all items across active orders for this table
  const relevantOrders = tableOrders.filter(o => o.table === selectedTable && o.status !== 'cancelled')
  const totalItemsCount = relevantOrders.reduce((sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0), 0)
  
  const rawSubtotal = relevantOrders.length > 0
    ? relevantOrders.reduce((sum, ord) => sum + ord.items.reduce((s, i) => s + (i.price * i.quantity), 0), 0)
    : (tableStatus?.totalBill || 0)

  const serviceFee = Math.round(rawSubtotal * 0.05)
  const pb1Tax = Math.round((rawSubtotal + serviceFee) * 0.1)
  const grandTotal = rawSubtotal + serviceFee + pb1Tax

  const handleCallWaiter = () => {
    setWaiterCalled(true)
    createServiceTicket({
      tableNumber: selectedTable,
      type: 'bill_request',
      notes: `Permintaan tagihan fisik & kasir (${scannedSeat})`
    })
    onCallWaiterForBill?.()
    setTimeout(() => setWaiterCalled(false), 5000)
  }

  const handleCallWaterRefill = () => {
    setWaterCalled(true)
    createServiceTicket({
      tableNumber: selectedTable,
      type: 'water_refill',
      notes: `Permintaan refill air minum (${scannedSeat})`
    })
    setTimeout(() => setWaterCalled(false), 5000)
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'placed':
      case 'processing':
        return (
          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Coffee className="w-2.5 h-2.5 animate-pulse" /> Sedang Diseduh/Dimasak
          </span>
        )
      case 'ready':
      case 'completed':
      default:
        return (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Sudah Disajikan
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-sm transition-all animate-fadeIn">
      <div
        className="w-full max-w-md border-t rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        {/* DRAG HANDLE BAR */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-1 shrink-0" />

        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: cardBorder }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-500 shrink-0 font-black text-sm shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Sesi Open Tab Aktif
              </span>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight truncate" style={{ color: textColor }}>
                Rincian Tagihan {selectedTable}
              </h3>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: secondaryTextColor }}>
                {scannedSeat} • {totalItemsCount > 0 ? `${totalItemsCount} Menu Dipesan` : 'Siap Menambah Menu'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shrink-0 active:scale-95 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OPEN TAB EXPLANATION NOTICE */}
        <div 
          className="p-3 rounded-2xl border flex items-start gap-2.5 text-xs"
          style={{
            backgroundColor: `${customerTheme.primaryAccentHex}12`,
            borderColor: `${customerTheme.primaryAccentHex}30`,
            color: textColor
          }}
        >
          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-relaxed">
            <p className="font-bold">Mode Open-Bill Meja Aktif</p>
            <p className="text-[11px]" style={{ color: secondaryTextColor }}>
              Pesanan ronde sebelumnya langsung dikirim ke barista/dapur. Anda dapat menambah ronde baru kapan saja dan melakukan pelunasan saat selesai.
            </p>
          </div>
        </div>

        {/* 📶 WIFI ACCESS CELEBRATION BANNER */}
        {wifiAccessPolicy !== 'disabled' && (wifiAccessPolicy === 'always_visible' || relevantOrders.length > 0 || (tableStatus?.totalBill || 0) > 0) && (
          <div 
            className="border rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-sm animate-fadeIn"
            style={{
              backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)',
              borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-emerald-600 dark:text-emerald-400">
                  📶 Akses WiFi Kafe Terbuka
                </span>
                <p className="text-xs font-semibold truncate" style={{ color: textColor }}>
                  SSID: <strong className="font-mono">{wifiSsid}</strong> • Password: <strong className="font-mono text-amber-500">{wifiPassword}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyWifi(wifiPassword)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-sm"
              style={{
                backgroundColor: copiedWifi ? '#10b981' : (isLight ? '#ffffff' : '#0f172a'),
                borderColor: isLight ? '#86efac' : 'rgba(16, 185, 129, 0.4)',
                color: copiedWifi ? '#ffffff' : (isLight ? '#15803d' : '#34d399')
              }}
            >
              {copiedWifi ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Password</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ORDER ROUNDS BREAKDOWN */}
        <div className="flex flex-col gap-2.5 max-h-[36vh] overflow-y-auto no-scrollbar">
          <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: textColor }}>
            <Utensils className="w-3.5 h-3.5 text-amber-500" /> Riwayat Ronde Pesanan Meja:
          </span>

          {relevantOrders.length > 0 ? (
            relevantOrders.map((order, ordIdx) => (
              <div
                key={order.id}
                className="border rounded-2xl p-3 flex flex-col gap-2 shadow-sm"
                style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
              >
                <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: subCardBorder }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                      Ronde #{ordIdx + 1}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>
                      {order.createdAt || '14:20'} WIB
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex flex-col gap-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <span className="font-semibold" style={{ color: textColor }}>
                          {item.quantity}x {item.name}
                        </span>
                        {item.temperature && (
                          <p className="text-[10px]" style={{ color: secondaryTextColor }}>
                            {item.temperature} • Sugar {item.sugarLevel} • {item.milkOption}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold shrink-0" style={{ color: textColor }}>
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div 
              className="border rounded-2xl p-4 text-center flex flex-col items-center gap-1.5"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <Coffee className="w-6 h-6 text-amber-500 opacity-60" />
              <p className="text-xs font-bold" style={{ color: textColor }}>Belum Ada Pesanan yang Dikirim</p>
              <p className="text-[11px]" style={{ color: secondaryTextColor }}>Pilih menu dari katalog untuk memulai ronde 1.</p>
            </div>
          )}
        </div>

        {/* BILL SUMMARY WITH PB1 TAX & SERVICE FEE */}
        <div 
          className="border rounded-2xl p-3.5 flex flex-col gap-2 shadow"
          style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: secondaryTextColor }}>
            <span>Subtotal Ronde Meja:</span>
            <span className="font-mono font-bold" style={{ color: textColor }}>Rp {rawSubtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: secondaryTextColor }}>
            <span>Service Charge (5%):</span>
            <span className="font-mono" style={{ color: textColor }}>+Rp {serviceFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: secondaryTextColor }}>
            <span>Pajak Restoran PB1 (10%):</span>
            <span className="font-mono" style={{ color: textColor }}>+Rp {pb1Tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t text-sm font-black" style={{ borderColor: subCardBorder }}>
            <span style={{ color: textColor }}>Total Tagihan Berjalan:</span>
            <span className="text-base font-mono font-black" style={{ color: customerTheme.primaryAccentHex }}>
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* POST-VISIT MERCHANT FEEDBACK & SERVICE RECOVERY (P1-7 & P1-8) */}
        <PostVisitFeedbackSection
          activeTheme={customerTheme}
          tableNumber={selectedTable}
          guestName={scannedSeat}
        />

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-2 pt-1">
          {/* 1. ADD NEW ROUND */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onAddMoreItems()
            }}
            className="w-full py-2.5 rounded-2xl border border-dashed font-bold text-xs flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: `${customerTheme.primaryAccentHex}15`,
              borderColor: customerTheme.primaryAccentHex,
              color: isLight ? '#92400e' : '#fde68a'
            }}
          >
            <Plus className="w-4 h-4 text-amber-500" />
            <span>+ Tambah Pesanan Ronde Baru</span>
          </button>

          {/* 2. INSTANT SELF-SETTLEMENT VIA QRIS */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenSettlementQRIS()
            }}
            className="w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span className="truncate">Pelunasan QRIS Meja • Rp {grandTotal.toLocaleString('id-ID')}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>

          {/* 3. CALL WAITER FOR WATER REFILL */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCallWaterRefill}
              className="py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder, color: secondaryTextColor }}
            >
              <Utensils className={`w-3.5 h-3.5 ${waterCalled ? 'text-sky-400' : 'text-sky-500'}`} />
              <span className="truncate">{waterCalled ? '✓ Refill Dikirim' : 'Refill Air'}</span>
            </button>

            <button
              type="button"
              onClick={handleCallWaiter}
              className="py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder, color: secondaryTextColor }}
            >
              <Bell className={`w-3.5 h-3.5 ${waiterCalled ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className="truncate">{waiterCalled ? '✓ Menuju Meja' : 'Panggil Kasir'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
