import React, { useState, useEffect } from 'react'
import { HfeCompanyProfile, MenuItem, ViewportModeType } from '../../types/pos'
import {
  Coffee, Building, CalendarCheck, QrCode, Sparkles, ChevronRight,
  Smartphone, Ticket, Copy, Check, Calendar, Music, MapPin, MessageCircle, Tag, CreditCard, Sliders, Search
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useViewport } from '../../context/ViewportContext'
import { EventTicketItem, PurchasedEventTicket } from '../../types/pos'
import { EventTicketPurchaseModal } from './EventTicketPurchaseModal'
import { MerchantStorefrontCustomizerModal } from '../settings/MerchantStorefrontCustomizerModal'
import { SpotlightOmniSearchModal } from '../common/SpotlightOmniSearchModal'
import { OneTransactionOneTruthSection } from './OneTransactionOneTruthSection'

interface LandingPageViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  productCatalog: MenuItem[]
  viewportMode?: ViewportModeType
  onOpenReservationModal: () => void
  onSwitchToCustomerApp: () => void
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  hfeCompanyProfile,
  productCatalog,
  viewportMode = 'responsive',
  onOpenReservationModal,
  onSwitchToCustomerApp
}) => {
  const { isMobile: isContextMobile } = useViewport()
  const isMobile = viewportMode === 'mobile' || isContextMobile
  const { t, formatPrice } = useTranslation()
  const { vouchers, setActiveApp, storefrontConfig } = useMerchantConfig()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<EventTicketItem | null>(null)
  const [showCustomizerModal, setShowCustomizerModal] = useState(false)
  const [showSpotlightModal, setShowSpotlightModal] = useState(false)

  // Public Spotlight Keyboard Listener (⌘K, Ctrl+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )

      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setShowSpotlightModal((prev) => !prev)
        return
      }

      if (e.key === '/' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setShowSpotlightModal(true)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const activePromos = vouchers.filter(v => v.isActive).slice(0, 3)

  const upcomingEvents: EventTicketItem[] = [
    {
      id: 'EVT-JAZZ-01',
      title: '🎷 Friday Night Live Acoustic Jazz',
      category: 'music_event',
      date: 'Setiap Jumat',
      time: '19:30 - 22:00 WIB',
      location: '🌿 Outdoor Garden & Stage',
      price: 150000,
      quotaTotal: 40,
      quotaRemaining: 14,
      description: 'Penampilan jazz akustik santai, termasuk Welcome Drink Signature Mocktail.',
      includedBenefits: ['Welcome Drink', 'Free Seating Stage View']
    },
    {
      id: 'EVT-WORKSHOP-02',
      title: '☕ Barista Cupping & Manual Brew Masterclass',
      category: 'workshop_class',
      date: 'Sabtu, 29 Agustus',
      time: '10:00 - 13:00 WIB',
      location: '❄️ VIP Roastery Room',
      price: 250000,
      quotaTotal: 12,
      quotaRemaining: 4,
      instructorName: 'Head Roaster Dimas',
      description: 'Workshop seduh V60 & cupping 5 single-origin nusantara + Sertifikat & Biji Kopi 200g.',
      includedBenefits: ['Sertifikat Workshop', 'Beans 200g', 'Cupping Kit']
    }
  ]

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 theme-customer-container overflow-y-auto overscroll-contain">
      {/* 📢 TOP PROMOTIONAL ANNOUNCEMENT BAR (MERCHANT CUSTOMIZABLE) */}
      {storefrontConfig.announcementBarActive && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-3 py-1.5 text-center text-[10px] sm:text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{storefrontConfig.announcementBarText}</span>
        </div>
      )}

      {/* LANDING PAGE NAVBAR */}
      <header className={`border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40 flex items-center justify-between gap-2 shadow-xs dark:shadow-lg ${
        isMobile ? 'px-3 pt-[max(env(safe-area-inset-top,8px),8px)] pb-2.5' : 'px-4 sm:px-8 py-3'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {hfeCompanyProfile.logoUrl ? (
            <img src={hfeCompanyProfile.logoUrl} alt={hfeCompanyProfile.brandName} className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-amber-500/50 shadow shrink-0" />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl theme-customer-btn-primary flex items-center justify-center font-black text-xs shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white tracking-tight leading-tight truncate max-w-[120px] sm:max-w-none">
              {hfeCompanyProfile.brandName}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
              <Building className="w-3 h-3 text-amber-500 shrink-0" /> <span className="truncate">{hfeCompanyProfile.ptLegalName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PUBLIC SPOTLIGHT SEARCH TRIGGER BUTTON */}
          <button
            type="button"
            onClick={() => setShowSpotlightModal(true)}
            className="p-1.5 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 whitespace-nowrap shadow-xs transition-all cursor-pointer"
            title="Pencarian Spotlight Publik (⌘K atau /)"
          >
            <Search className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Cari</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[9px] font-mono text-slate-600 dark:text-slate-400 font-bold">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setShowCustomizerModal(true)}
            className="hidden sm:flex bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 items-center gap-1 whitespace-nowrap shadow-xs transition-all cursor-pointer"
            title="Kustomisasi Tampilan Ruang Toko"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Kustomisasi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveApp('customer-portal')}
            className="hidden md:flex bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-amber-500/40 items-center gap-1.5 whitespace-nowrap shadow-xs hover:border-amber-500 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Kartu Member</span>
          </button>
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="hidden sm:flex theme-customer-btn-primary text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t.landing.reserveTable}</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToCustomerApp}
            className="bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{isMobile ? 'Menu' : t.landing.scanQrOrder}</span>
          </button>
        </div>
      </header>

      {/* HERO SHOWCASE (MERCHANT CUSTOMIZED) */}
      <section className={`relative max-w-6xl mx-auto w-full flex justify-between gap-6 sm:gap-8 ${
        isMobile ? 'flex-col px-4 py-6' : 'flex-col md:flex-row items-center px-4 sm:px-8 py-10 sm:py-16'
      }`}>
        <div className="flex-1 flex flex-col gap-3.5 sm:gap-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 w-fit">
            {t.landing.heroTag}
          </span>
          <h2 className={`font-black text-slate-900 dark:text-white tracking-tight leading-tight ${
            isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'
          }`}>
            {storefrontConfig.heroHeadline || t.landing.heroTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {storefrontConfig.heroTagline || t.landing.heroSubtitle}
          </p>

          {/* MOBILE HERO IMAGE */}
          {isMobile && (
            <div className="w-full relative my-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-indigo-500/30 rounded-3xl blur-md"></div>
              <img
                src={storefrontConfig.heroBannerUrl}
                alt="Store Banner"
                className="relative rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xl w-full h-48"
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className={`pt-2 flex ${isMobile ? 'flex-col gap-2.5 w-full' : 'flex-row items-center gap-3'}`}>
            <button
              type="button"
              onClick={onOpenReservationModal}
              className={`theme-customer-btn-primary text-xs font-bold px-5 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all text-center ${
                isMobile ? 'w-full' : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0" /> {storefrontConfig.ctaReserveText || t.landing.reserveTableCta}
            </button>
            <button
              type="button"
              onClick={onSwitchToCustomerApp}
              className={`bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-center transition-all ${
                isMobile ? 'w-full' : ''
              }`}
            >
              <Smartphone className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> {storefrontConfig.ctaOrderText || t.landing.menuAndQr}
            </button>
          </div>
        </div>

        {/* DESKTOP HERO IMAGE */}
        {!isMobile && (
          <div className="w-full md:w-1/2 relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-3xl blur-lg opacity-30"></div>
            <img
              src={storefrontConfig.heroBannerUrl}
              alt="Store Banner"
              className="relative rounded-3xl object-cover border border-slate-200 dark:border-slate-800 shadow-2xl w-full h-64 sm:h-80"
            />
          </div>
        )}
      </section>

      {/* 🎟️ PROMOS & CLAIMABLE COUPONS SECTION */}
      {activePromos.length > 0 && (
        <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
          isMobile ? 'px-4' : 'px-4 sm:px-8'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-500 shrink-0" /> Promo & Kupon Spesial
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Salin & pakai di menu QR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activePromos.map((voucher) => (
              <div key={voucher.code} className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-xs dark:shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {voucher.code}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{voucher.title}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{voucher.description || 'Gunakan saat pemesanan online / QR meja'}</p>
                  </div>
                  <Tag className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 opacity-70" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Min. {formatPrice(voucher.minSpend || 0)}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyVoucher(voucher.code)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-all"
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Kupon</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🎉 UPCOMING EVENTS & COMMUNITY CALENDAR */}
      <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" /> Jadwal Event & Hiburan
          </h3>
          <button type="button" onClick={onOpenReservationModal} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1">
            RSVP Tempat <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {upcomingEvents.map((evt) => (
            <div key={evt.id} className="bg-white dark:bg-slate-900/90 border border-purple-500/25 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs dark:shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono uppercase">
                    {evt.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Sisa Kuota: <strong className="text-amber-600 dark:text-amber-400">{evt.quotaRemaining}</strong>/{evt.quotaTotal}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{evt.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{evt.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-purple-600 dark:text-purple-300 mt-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Harga Tiket:</span>
                  <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                    {formatPrice(evt.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventForTicket(evt)}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{evt.category === 'workshop_class' ? 'Booking Kelas' : 'Beli Tiket'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITY & AMBIANCE CARDS */}
      <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.facilitiesTitle}
        </h3>

        <div className={`grid gap-2.5 sm:gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {[
            { icon: '🍃', title: 'Outdoor Garden', desc: 'Area outdoor asri & smoking area' },
            { icon: '❄️', title: 'VIP AC Room', desc: 'Ruang privat meeting 12 pax' },
            { icon: '📶', title: 'WiFi 300 Mbps', desc: 'Koneksi cepat & colokan di tiap meja' },
            { icon: '🅿️', title: 'Free Valet Parking', desc: 'Parkir luas & EV charging' }
          ].map((fac, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-xs dark:shadow-lg">
              <span className="text-xl sm:text-2xl">{fac.icon}</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{fac.title}</h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SPECIALTY MENU */}
      <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.featuredMenuTitle}
          </h3>
          <button type="button" onClick={onSwitchToCustomerApp} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer">
            {t.landing.viewAllCatalog} <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {productCatalog.slice(0, 3).map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex gap-3 shadow-xs dark:shadow-xl">
              <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">{formatPrice(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ ONE TRANSACTION. ONE TRUTH. FLOW SECTION */}
      <OneTransactionOneTruthSection />

      {/* FOOTER & ADDRESS */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-8 py-6 text-center text-xs text-slate-500 flex flex-col gap-2">
        <p className="font-bold text-slate-800 dark:text-slate-300">{hfeCompanyProfile.brandName} • {hfeCompanyProfile.ptLegalName}</p>
        <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-mono">NPWP: {hfeCompanyProfile.taxIdNpwp} • {hfeCompanyProfile.address}</p>
        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-600">{t.landing.hours}</p>
      </footer>

      {/* 🎟️ EVENT TICKET & WORKSHOP BOOKING MODAL */}
      <EventTicketPurchaseModal
        show={Boolean(selectedEventForTicket)}
        event={selectedEventForTicket}
        onClose={() => setSelectedEventForTicket(null)}
        onPurchaseSuccess={(tkt) => {
          alert(`🎉 Pembelian Tiket Berhasil!\nKode: ${tkt.ticketCode}\nTotal: ${formatPrice(tkt.totalAmountPaid)}\nE-Ticket siap ditunjukkan saat masuk.`)
        }}
      />

      {/* 🛠️ MERCHANT STOREFRONT CUSTOMIZER MODAL */}
      <MerchantStorefrontCustomizerModal
        isOpen={showCustomizerModal}
        onClose={() => setShowCustomizerModal(false)}
        initialTab="landing"
      />

      {/* 🔍 PUBLIC SPOTLIGHT OMNI-SEARCH MODAL */}
      <SpotlightOmniSearchModal
        isOpen={showSpotlightModal}
        onClose={() => setShowSpotlightModal(false)}
        onSelectProduct={(_item) => {
          setShowSpotlightModal(false)
          onSwitchToCustomerApp()
        }}
        onSelectTable={(_tableId) => {
          setShowSpotlightModal(false)
          onSwitchToCustomerApp()
        }}
        onOpenStorefrontStudio={() => {
          setShowSpotlightModal(false)
          setShowCustomizerModal(true)
        }}
        onNavigateApp={(appId) => {
          setShowSpotlightModal(false)
          if (appId === 'customer-portal' || appId === 'customer' || appId === 'landing' || appId === 'cafe') {
            setActiveApp(appId as any)
          }
        }}
      />
    </div>
  )
}
