import React, { useState } from 'react'
import { 
  X, Coffee, Utensils, Clock, CheckCircle2, Plus, Receipt, 
  Store, Globe, Calendar, Wifi, Lock, Copy, MapPin, ExternalLink, ChevronRight, ChevronDown, Sparkles, MessageCircle, Instagram, Share2, Check 
} from 'lucide-react'
import { HfeCompanyProfile } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { MerchantSocialAndHoursSection } from './MerchantSocialAndHoursSection'

export interface MerchantDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  hfeCompanyProfile: HfeCompanyProfile
  selectedTable: string
  scannedSeat: string
  hasPaidOrder?: boolean
  onAddMoreItems: () => void
  onOpenReservationModal?: () => void
  onSwitchToLandingPage?: () => void
}

const TABLE_LIVE_SESSION_MOCK = {
  sessionId: 'SES-MEJA-04-88',
  openedAt: 'Hari ini, 14:15 WIB',
  rounds: [
    { roundNo: 1, time: '14:20', items: [{ name: 'Caffe Latte (Less Ice)', qty: 2, price: 38000, status: 'brewing' }, { name: 'Truffle French Fries', qty: 1, price: 35000, status: 'cooking' }] },
    { roundNo: 2, time: '14:40', items: [{ name: 'Pain au Chocolat', qty: 1, price: 32000, status: 'served' }] }
  ],
  subtotal: 143000,
  serviceFee: 7150,
  taxPB1: 15015,
  grandTotal: 165165
}

const WEEKLY_HOURS_SCHEDULE = [
  { day: 'Senin - Kamis', hours: '07:00 - 22:00', isToday: false },
  { day: 'Jumat', hours: '07:00 - 23:00', isToday: false },
  { day: 'Sabtu (Weekend)', hours: '07:00 - 23:30', isToday: true },
  { day: 'Minggu', hours: '07:00 - 22:00', isToday: false }
]

export const MerchantDetailDrawer: React.FC<MerchantDetailDrawerProps> = ({
  isOpen,
  onClose,
  hfeCompanyProfile,
  selectedTable,
  scannedSeat,
  hasPaidOrder = false,
  onAddMoreItems,
  onOpenReservationModal,
  onSwitchToLandingPage
}) => {
  const { customerTheme } = useMerchantConfig()
  const [activeTab, setActiveTab] = useState<'session' | 'profile'>('session')
  const [showHoursSchedule, setShowHoursSchedule] = useState<boolean>(false)
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false)
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false)

  const defaultSsid = hfeCompanyProfile.brandName ? `${hfeCompanyProfile.brandName.replace(/[^a-zA-Z0-9]/g, '_')}_Guest` : 'Guest_WiFi'
  const wifiSsid = hfeCompanyProfile.storefrontInfo?.wifiSsid || defaultSsid
  const wifiPassword = hfeCompanyProfile.storefrontInfo?.wifiPassword || 'guestwifi123'
  const wifiAccessPolicy = hfeCompanyProfile.storefrontInfo?.wifiAccessPolicy || 'after_payment'

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
  const tabBg = isLight ? '#f1f5f9' : '#020617'

  if (!isOpen) return null

  const handleShareLandingPage = async () => {
    const landingUrl = `${window.location.origin}${window.location.pathname}?app=landing`
    const brand = hfeCompanyProfile.brandName || 'Outlet Kami'
    const shareData = {
      title: brand,
      text: `Yuk berkunjung ke ${brand}! Cek katalog produk & promo spesial di sini:`,
      url: landingUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    navigator.clipboard?.writeText(landingUrl)
    setCopiedShareLink(true)
    setTimeout(() => setCopiedShareLink(false), 2500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'brewing':
        return (
          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Coffee className="w-2.5 h-2.5 animate-pulse" /> Sedang Diseduh
          </span>
        )
      case 'cooking':
        return (
          <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Utensils className="w-2.5 h-2.5 animate-pulse" /> Sedang Dimasak
          </span>
        )
      case 'served':
      default:
        return (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Sudah Disajikan
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm transition-all animate-fadeIn">
      <div 
        className="w-full max-w-md border-t rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        {/* DRAG HANDLE BAR (TOUCH AFFORDANCE) */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-1 shrink-0" />

        {/* HEADER: BRAND LOGO + TITLE + CLOSE BUTTON */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: cardBorder }}>
          <div className="flex items-center gap-3 min-w-0">
            {hfeCompanyProfile.logoUrl ? (
              <img 
                src={hfeCompanyProfile.logoUrl} 
                alt={hfeCompanyProfile.brandName} 
                className="w-11 h-11 rounded-2xl object-cover border shadow shrink-0"
                style={{ borderColor: customerTheme.primaryAccentHex }}
              />
            ) : (
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow shrink-0"
                style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
              >
                <Coffee className="w-5 h-5" />
              </div>
            )}
            
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm tracking-tight leading-tight truncate" style={{ color: textColor }}>
                {hfeCompanyProfile.brandName}
              </h3>
              <p className="text-[11px] font-mono font-bold flex items-center gap-1 mt-0.5" style={{ color: customerTheme.primaryAccentHex }}>
                <span>{selectedTable} • {scannedSeat}</span>
                <span className="opacity-40">•</span>
                <span className="text-emerald-500 font-sans">Sesi Aktif</span>
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

        {/* SEGMENTED TAB SWITCHER */}
        <div 
          className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border text-xs"
          style={{ backgroundColor: tabBg, borderColor: subCardBorder }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('session')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-98 ${
              activeTab === 'session'
                ? 'shadow font-black'
                : 'hover:opacity-80'
            }`}
            style={
              activeTab === 'session'
                ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }
                : { color: secondaryTextColor }
            }
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Sesi & Bill Meja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-98 ${
              activeTab === 'profile'
                ? 'shadow font-black'
                : 'hover:opacity-80'
            }`}
            style={
              activeTab === 'profile'
                ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }
                : { color: secondaryTextColor }
            }
          >
            <Store className="w-3.5 h-3.5" />
            <span>Profil & Info Resto</span>
          </button>
        </div>

        {/* ================= TAB 1: SESI & TAGIHAN MEJA ================= */}
        {activeTab === 'session' && (
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: textColor }}>
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Pesanan Berjalan di Meja Ini:
              </span>
              <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>Mulai: {TABLE_LIVE_SESSION_MOCK.openedAt}</span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[38vh] overflow-y-auto no-scrollbar">
              {TABLE_LIVE_SESSION_MOCK.rounds.map((round) => (
                <div 
                  key={round.roundNo} 
                  className="border rounded-2xl p-3 flex flex-col gap-2 shadow-sm"
                  style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
                >
                  <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: subCardBorder }}>
                    <span className="text-[10px] font-mono font-bold" style={{ color: secondaryTextColor }}>
                      Ronde #{round.roundNo} • {round.time} WIB
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>{round.items.length} Menu</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {round.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <span className="font-semibold" style={{ color: textColor }}>{item.qty}x {item.name}</span>
                          <p className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* BILL SUMMARY */}
            <div className="border rounded-2xl p-3.5 flex flex-col gap-2 shadow" style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}>
              <div className="flex items-center justify-between text-xs" style={{ color: secondaryTextColor }}>
                <span>Subtotal Meja:</span>
                <span className="font-mono" style={{ color: textColor }}>Rp {TABLE_LIVE_SESSION_MOCK.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: secondaryTextColor }}>
                <span>PB1 Tax (10%) & Service (5%):</span>
                <span className="font-mono" style={{ color: textColor }}>Rp {(TABLE_LIVE_SESSION_MOCK.serviceFee + TABLE_LIVE_SESSION_MOCK.taxPB1).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-sm" style={{ borderColor: subCardBorder }}>
                <span className="font-bold" style={{ color: textColor }}>Total Tagihan Meja:</span>
                <span className="font-black font-mono text-amber-500">Rp {TABLE_LIVE_SESSION_MOCK.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* ADD ROUND BUTTON */}
            <button
              type="button"
              onClick={() => { onClose(); onAddMoreItems() }}
              className="w-full h-12 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all touch-manipulation active:scale-[0.98]"
              style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Pesanan Ronde Baru</span>
            </button>
          </div>
        )}

        {/* ================= TAB 2: PROFIL RESTORAN & LANDING/RESERVASI ================= */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            {/* RESTO INFO CARD WITH COMPACT EXPANDABLE OPERATING HOURS */}
            <div 
              className="border rounded-2xl p-4 flex flex-col gap-3 shadow"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 font-mono text-amber-500">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Specialty Coffee & Roastery
                </span>
              </div>

              <MerchantSocialAndHoursSection
                modalBg={modalBg}
                subCardBorder={subCardBorder}
                secondaryTextColor={secondaryTextColor}
                textColor={textColor}
                customerTheme={customerTheme}
                isLight={isLight}
                address={hfeCompanyProfile.address}
                brandName={hfeCompanyProfile.brandName}
                wifiAccessPolicy={wifiAccessPolicy}
                wifiSsid={wifiSsid}
                wifiPassword={wifiPassword}
                hasPaidOrder={hasPaidOrder}
                weeklySchedule={WEEKLY_HOURS_SCHEDULE}
                onShareLandingPage={handleShareLandingPage}
                copiedShareLink={copiedShareLink}
              />
            </div>

            {/* ACTION BUTTON 1: PINDAH KE LANDING PAGE */}
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onSwitchToLandingPage) onSwitchToLandingPage()
              }}
              className="w-full border p-3.5 rounded-2xl flex items-center justify-between text-left transition-all group shadow active:scale-98 touch-manipulation"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold group-hover:text-amber-500 transition-colors flex items-center gap-1.5" style={{ color: textColor }}>
                    <span>Lihat Landing Page Merchant</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </h4>
                  <p className="text-[10px]" style={{ color: secondaryTextColor }}>Cerita brand, promo spesial & katalog lengkap</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* ACTION BUTTON 2: RESERVASI MEJA */}
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onOpenReservationModal) onOpenReservationModal()
              }}
              className="w-full border p-3.5 rounded-2xl flex items-center justify-between text-left transition-all group shadow active:scale-98 touch-manipulation"
              style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold group-hover:text-amber-500 transition-colors" style={{ color: textColor }}>
                    Reservasi Meja / Booking Tempat
                  </h4>
                  <p className="text-[10px]" style={{ color: secondaryTextColor }}>Pesan tempat untuk kunjungan berikutnya</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
