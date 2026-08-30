import React, { useState, useEffect } from 'react'
import { HfeCompanyProfile, MenuItem, ViewportModeType, EventTicketItem } from '../../types/pos'
import {
  Coffee, CalendarCheck, Sparkles, ChevronRight,
  Ticket, Copy, Check, Music, MapPin, MessageCircle, Tag, Search, ShoppingBag, Instagram, Share2
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useViewport } from '../../context/ViewportContext'
import { EventTicketPurchaseModal } from './EventTicketPurchaseModal'
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
  const [copiedShareInfo, setCopiedShareInfo] = useState(false)
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<EventTicketItem | null>(null)
  const [showSpotlightModal, setShowSpotlightModal] = useState(false)

  const handleCopyShareInfo = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://pos.hfeit.com'
    const promoSnippet = storefrontConfig.announcementBarActive && storefrontConfig.announcementBarText
      ? `\n✨ Promo: ${storefrontConfig.announcementBarText}`
      : ''
    const shareText = `☕ *${hfeCompanyProfile.brandName}*\n${storefrontConfig.heroTagline || hfeCompanyProfile.tagline || 'Specialty Coffee & Artisan Pastry'}${promoSnippet}\n\n👉 Buka menu & reservasi online:\n${url}\n\n📍 ${hfeCompanyProfile.address || 'Senopati, Jakarta Selatan'}`.trim()

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText)
    }
    setCopiedShareInfo(true)
    setTimeout(() => setCopiedShareInfo(false), 2500)
  }

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

      {/* LANDING PAGE NAVBAR (WORLD-CLASS MERCHANT STANDARD) */}
      <header className={`border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-4 shadow-xs dark:shadow-md transition-all ${
        isMobile ? 'px-4 pt-[max(env(safe-area-inset-top,10px),10px)] pb-3' : 'px-6 sm:px-8 py-3.5'
      }`}>
        {/* KIRI: Logo & Nama Brand Bersih */}
        <div className="flex items-center gap-2.5 min-w-0">
          {hfeCompanyProfile.logoUrl ? (
            <img src={hfeCompanyProfile.logoUrl} alt={hfeCompanyProfile.brandName} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-amber-500/40 shadow-xs shrink-0" />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
          )}
          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-tight truncate">
            {hfeCompanyProfile.brandName}
          </span>
        </div>

        {/* TENGAH: Tautan Navigasi Halus (Desktop Only) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-200">
          <a href="#featured-menu" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Menu Populer</a>
          <a href="#promos-section" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Promo & Kupon</a>
          <a href="#facilities-section" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Fasilitas</a>
          <a href="#events-section" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">Event & Jadwal</a>
        </nav>

        {/* KANAN: Search Minimalis + Share Info + Masuk + CTA Reservasi */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowSpotlightModal(true)}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all cursor-pointer"
            title="Cari Menu atau Info (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopyShareInfo}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all cursor-pointer"
            title="Salin Tautan & Info Kafe"
          >
            {copiedShareInfo ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveApp('customer-portal')}
            className="hidden sm:inline-flex text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
          >
            {t.landing.loginRegister}
          </button>
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t.landing.reserveTable}</span>
          </button>
        </div>
      </header>

      {/* FLOATING TOAST FEEDBACK FOR COPY SHARE */}
      {copiedShareInfo && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn border border-amber-500/50 backdrop-blur">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>Tautan & ringkasan etalase berhasil disalin!</span>
        </div>
      )}

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
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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

          {/* DUAL ACTION BUTTONS (PESAN ONLINE & RESERVASI MEJA) */}
          <div className={`pt-2 flex ${isMobile ? 'flex-col gap-2.5 w-full' : 'flex-row items-center gap-3'}`}>
            <button
              type="button"
              onClick={onSwitchToCustomerApp}
              className={`theme-customer-btn-primary text-xs font-bold px-5 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all text-center ${
                isMobile ? 'w-full' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-slate-950 shrink-0" /> {storefrontConfig.ctaOrderText || t.landing.orderOnlineCta}
            </button>
            <button
              type="button"
              onClick={onOpenReservationModal}
              className={`bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-center transition-all ${
                isMobile ? 'w-full' : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> {storefrontConfig.ctaReserveText || t.landing.reserveTableCta}
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

      {/* ☕ FEATURED SPECIALTY MENU (MOVED TO TOP HOOK) */}
      <section id="featured-menu" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.featuredMenuTitle}
          </h3>
          <button type="button" onClick={onSwitchToCustomerApp} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer">
            {t.landing.viewAllCatalog} <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {productCatalog.slice(0, 6).map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex gap-3 shadow-xs dark:shadow-xl hover:border-amber-500/40 transition-all">
              <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">{formatPrice(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎟️ PROMOS & CLAIMABLE COUPONS SECTION (RESPONSIVE SNAP ON MOBILE) */}
      {activePromos.length > 0 && (
        <section id="promos-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
          isMobile ? 'px-4' : 'px-4 sm:px-8'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-500 shrink-0" /> Promo & Kupon Spesial
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-300 font-mono">{t.landing.promoSubtitle}</span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {activePromos.map((voucher) => (
              <div key={voucher.code} className="min-w-[270px] max-w-[290px] snap-center shrink-0 sm:min-w-0 sm:max-w-none bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-xs dark:shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {voucher.code}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{voucher.title}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">{voucher.description || 'Gunakan saat pemesanan online / QR meja'}</p>
                  </div>
                  <Tag className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 opacity-70" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono">Min. {formatPrice(voucher.minSpend || 0)}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyVoucher(voucher.code)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
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

      {/* ✨ FACILITY & AMBIANCE CARDS (2x2 MOBILE, 4-COL DESKTOP) */}
      <section id="facilities-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.facilitiesTitle}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { icon: '🍃', title: 'Outdoor Garden', desc: 'Area outdoor asri & smoking area' },
            { icon: '❄️', title: 'VIP AC Room', desc: 'Ruang privat meeting 12 pax' },
            { icon: '📶', title: 'WiFi 300 Mbps', desc: 'Koneksi cepat & colokan di tiap meja' },
            { icon: '🅿️', title: 'Free Valet Parking', desc: 'Parkir luas & EV charging' }
          ].map((fac, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-xs dark:shadow-lg">
              <span className="text-xl sm:text-2xl">{fac.icon}</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{fac.title}</h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ HOW TO ORDER (3-STEP SIMPLE FLOW) */}
      <OneTransactionOneTruthSection />

      {/* 🎉 UPCOMING EVENTS & COMMUNITY CALENDAR */}
      <section id="events-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" /> Jadwal Event & Hiburan
          </h3>
          <button type="button" onClick={onOpenReservationModal} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer">
            RSVP Tempat <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {upcomingEvents.map((evt) => (
            <div key={evt.id} className="bg-white dark:bg-slate-900/90 border border-purple-500/25 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs dark:shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono uppercase">
                    {evt.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono">
                    Sisa Kuota: <strong className="text-amber-600 dark:text-amber-400">{evt.quotaRemaining}</strong>/{evt.quotaTotal}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{evt.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{evt.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-purple-600 dark:text-purple-300 mt-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono block">Harga Tiket:</span>
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

      {/* FOOTER & ADDRESS */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-8 py-6 text-center flex flex-col gap-2">
        <div className="text-xs text-slate-500">
          <p className="font-bold text-slate-800 dark:text-slate-200">{hfeCompanyProfile.brandName} • {hfeCompanyProfile.ptLegalName}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-mono">NPWP: {hfeCompanyProfile.taxIdNpwp} • {hfeCompanyProfile.address}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">{t.landing.hours}</p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {storefrontConfig.socialLinks?.instagram && (
            <a href={`https://instagram.com/${storefrontConfig.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {storefrontConfig.socialLinks?.whatsapp && (
            <a href={`https://wa.me/${storefrontConfig.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {storefrontConfig.socialLinks?.googleMapsUrl && (
            <a href={storefrontConfig.socialLinks.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
              <MapPin className="w-4 h-4" />
            </a>
          )}
        </div>

        <p className="text-[9px] text-slate-400 dark:text-slate-500 pt-2">
          {t.landing.merchantCtaBadge} •{' '}
          <a
            href="https://pos.hfeit.com"
            target="_blank"
            rel="noopener noreferrer" 
            className="text-amber-500 hover:text-amber-400 font-bold underline underline-offset-2"
          >
            {t.landing.merchantCtaButton}
          </a>
        </p>
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

      {/* 🔍 PUBLIC SPOTLIGHT OMNI-SEARCH MODAL */}
      <SpotlightOmniSearchModal
        isOpen={showSpotlightModal}
        onClose={() => setShowSpotlightModal(false)}
        onSelectProduct={() => { setShowSpotlightModal(false); onSwitchToCustomerApp() }}
        onSelectTable={() => { setShowSpotlightModal(false); onSwitchToCustomerApp() }}
        onNavigateApp={(appId) => {
          setShowSpotlightModal(false)
          if (['customer-portal', 'customer', 'landing', 'cafe'].includes(appId)) {
            setActiveApp(appId as any)
          }
        }}
      />
    </div>
  )
}
