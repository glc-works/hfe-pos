import React, { useState, useEffect } from 'react'
import { HfeCompanyProfile, MenuItem, ViewportModeType, EventTicketItem } from '../../types/pos'
import {
  Coffee, CalendarCheck, Sparkles, ChevronRight,
  Ticket, Search, ShoppingBag, Instagram, Share2, MessageCircle, MapPin, Check, ArrowRight
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useViewport } from '../../context/ViewportContext'
import { EventTicketPurchaseModal } from './EventTicketPurchaseModal'
import { SpotlightOmniSearchModal } from '../common/SpotlightOmniSearchModal'
import { LandingFacilitiesSection } from './LandingFacilitiesSection'
import { LandingPromosSection } from './LandingPromosSection'
import { LandingEventsSection } from './LandingEventsSection'
import { LandingDedicatedSectionView } from './LandingDedicatedSectionView'
import { LandingBreadcrumbs, LandingSectionId } from './LandingBreadcrumbs'
import { OneTransactionOneTruthSection } from './OneTransactionOneTruthSection'
import { useDynamicFavicon } from '../../hooks/useDynamicFavicon'

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

  // Dynamically synchronize browser tab favicon with merchant logo (fallback to POS favicon)
  useDynamicFavicon(hfeCompanyProfile?.logoUrl, hfeCompanyProfile?.brandName)

  const [activeSection, setActiveSection] = useState<LandingSectionId>('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [copiedShareInfo, setCopiedShareInfo] = useState(false)
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<EventTicketItem | null>(null)
  const [showSpotlightModal, setShowSpotlightModal] = useState(false)

  // Dynamic Industry Archetype Taxonomy Resolver
  const vertical = (storefrontConfig as any).businessVertical || (hfeCompanyProfile as any).businessType || 'fnb'
  const isService = ['service', 'barber', 'salon', 'clinic'].includes(vertical)
  const isRetail = ['retail', 'boutique', 'pharmacy'].includes(vertical)
  const isSpace = ['space', 'coworking', 'studio'].includes(vertical)

  const catalogNavLabel = isService ? 'Layanan' : isRetail ? 'Katalog' : isSpace ? 'Ruangan' : 'Menu'
  const catalogSectionTitle = isService ? 'Layanan & Treatment' : isRetail ? 'Katalog Produk' : isSpace ? 'Daftar Ruangan' : t.landing.featuredMenuTitle
  const defaultOrderCta = isService ? 'Pilih Layanan & Booking' : isRetail ? 'Belanja Produk' : isSpace ? 'Cek Ruangan' : (t.landing.orderOnlineCta || 'Buka Menu & Pesan')
  const defaultReserveCta = isService ? 'Pilih Stylist / Jadwal' : isRetail ? 'Cek Stok Cabang' : isSpace ? 'Reservasi Slot' : (t.landing.reserveTable || 'Reservasi Meja')
  const effectiveOrderCta = (storefrontConfig.ctaOrderText && storefrontConfig.ctaOrderText !== 'Buka Menu & Pesan') ? storefrontConfig.ctaOrderText : defaultOrderCta
  const effectiveReserveCta = (storefrontConfig.ctaReserveText && storefrontConfig.ctaReserveText !== 'Reservasi Meja') ? storefrontConfig.ctaReserveText : defaultReserveCta

  const handleCopyShareInfo = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://pos.hfeit.com'
    const promoSnippet = storefrontConfig.announcementBarActive && storefrontConfig.announcementBarText
      ? `\n✨ Promo: ${storefrontConfig.announcementBarText}`
      : ''
    const tagline = storefrontConfig.heroTagline || (hfeCompanyProfile as any).tagline || t.landing.defaultTaglineFallback
    const address = hfeCompanyProfile.address || t.landing.defaultAddressFallback
    const shareText = `☕ *${hfeCompanyProfile.brandName}*\n${tagline}${promoSnippet}\n\n👉 Buka ${catalogNavLabel.toLowerCase()} & reservasi online:\n${url}\n\n📍 ${address}`.trim()

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

  const activePromos = vouchers.filter(v => v.isActive).map(v => ({
    id: v.code,
    code: v.code,
    title: v.title,
    desc: v.description,
    minSpend: v.minSpend
  }))
  const facilities = storefrontConfig.facilities || []
  const upcomingEvents = storefrontConfig.events || []

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 theme-customer-container overflow-y-auto overscroll-contain">
      {/* 📢 TOP PROMOTIONAL ANNOUNCEMENT BAR */}
      {storefrontConfig.announcementBarActive && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-3 py-1.5 text-center text-[10px] sm:text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{storefrontConfig.announcementBarText}</span>
        </div>
      )}

      {/* LANDING PAGE NAVBAR WITH DYNAMIC BREADCRUMBS */}
      <header className={`border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-3 shadow-xs dark:shadow-md transition-all ${
        isMobile ? 'px-4 pt-[max(env(safe-area-inset-top,10px),10px)] pb-3' : 'px-6 sm:px-8 py-3.5'
      }`}>
        {/* KIRI: Logo / Breadcrumbs */}
        <div className="flex items-center gap-2.5 min-w-0">
          {activeSection === 'overview' ? (
            <>
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
            </>
          ) : (
            <LandingBreadcrumbs
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* TENGAH: Tautan Navigasi Cepat (Desktop Overview Only) */}
        {activeSection === 'overview' && (
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-200">
            <button type="button" onClick={() => setActiveSection('menu')} className="hover:text-amber-500 transition-colors cursor-pointer">{catalogNavLabel}</button>
            <button type="button" onClick={() => setActiveSection('promos')} className="hover:text-amber-500 transition-colors cursor-pointer">Promo</button>
            <button type="button" onClick={() => setActiveSection('facilities')} className="hover:text-amber-500 transition-colors cursor-pointer">Fasilitas</button>
            <button type="button" onClick={() => setActiveSection('events')} className="hover:text-amber-500 transition-colors cursor-pointer">Event</button>
          </nav>
        )}

        {/* KANAN: Search + Share + Masuk + CTA Reservasi */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowSpotlightModal(true)}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all cursor-pointer"
            title={t.landing.searchActionTitle}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopyShareInfo}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all cursor-pointer"
            title={t.landing.shareActionTitle}
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
            className="text-xs font-bold px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hidden sm:inline-flex items-center"
          >
            {t.landing.loginRegister || 'Masuk / Daftar'}
          </button>
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="text-xs font-bold px-3.5 py-1.5 sm:py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{effectiveReserveCta}</span>
            <span className="sm:hidden">Reservasi</span>
          </button>
        </div>
      </header>

      {/* DEDICATED FULL VIEW (IF ACTIVE SECTION IS NOT OVERVIEW) */}
      {activeSection !== 'overview' ? (
        <main className={`flex-1 max-w-6xl mx-auto w-full py-6 sm:py-8 ${isMobile ? 'px-4' : 'px-4 sm:px-8'}`}>
          <LandingDedicatedSectionView
            section={activeSection}
            productCatalog={productCatalog}
            promos={activePromos}
            facilities={facilities}
            amenityTags={storefrontConfig.amenityTags}
            events={upcomingEvents}
            onSelectEvent={setSelectedEventForTicket}
            onCopyPromo={handleCopyVoucher}
            copiedPromoCode={copiedCode}
            onSwitchToCustomerApp={onSwitchToCustomerApp}
            onOpenReservationModal={onOpenReservationModal}
            isMobile={isMobile}
          />
        </main>
      ) : (
        /* OVERVIEW HUB (HERO + CAROUSELS) */
        <main className="flex-1 flex flex-col">
          {/* HERO BANNER SECTION */}
          <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-white min-h-[360px] sm:min-h-[420px] flex items-center">
            <div className="absolute inset-0 z-0">
              {storefrontConfig.heroBannerUrl ? (
                <img src={storefrontConfig.heroBannerUrl} alt="Storefront Banner" className="w-full h-full object-cover opacity-35 dark:opacity-25" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            <div className={`relative z-10 max-w-4xl mx-auto w-full py-10 sm:py-16 text-center flex flex-col items-center gap-4 sm:gap-6 ${
              isMobile ? 'px-4' : 'px-6 sm:px-8'
            }`}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hfeCompanyProfile.brandName}</span>
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
                {storefrontConfig.heroHeadline || t.landing.defaultHeadlineFallback}
              </h1>

              <p className="text-xs sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
                {storefrontConfig.heroTagline || (hfeCompanyProfile as any).tagline || t.landing.defaultTaglineFallback}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onSwitchToCustomerApp}
                  className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{effectiveOrderCta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenReservationModal}
                  className="px-5 py-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {effectiveReserveCta}
                </button>
              </div>
            </div>
          </section>

          {/* 🏷️ SEKSI 1: PROMO CAROUSEL */}
          <LandingPromosSection
            promos={activePromos}
            copiedPromoCode={copiedCode}
            onCopyPromo={handleCopyVoucher}
            onViewAllPromos={() => setActiveSection('promos')}
            isMobile={isMobile}
          />

          {/* ☕ SEKSI 2: MENU & KATALOG UNGGULAN (FEATURED REEL) */}
          <section id="featured-menu" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
            isMobile ? 'px-4' : 'px-4 sm:px-8'
          }`}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="group text-left cursor-pointer transition-transform active:scale-98"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-amber-500 transition-colors">
                  <Coffee className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{catalogSectionTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:inline-block" />
                </h3>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {productCatalog.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={onSwitchToCustomerApp}
                  className="group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-amber-500 opacity-40" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h4>
                  <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ✨ SEKSI 3: FASILITAS SNAP CAROUSEL */}
          <LandingFacilitiesSection
            facilities={facilities}
            amenityTags={storefrontConfig.amenityTags}
            title={t.landing.facilitiesTitle}
            onViewAllFacilities={() => setActiveSection('facilities')}
            isMobile={isMobile}
          />

          {/* 🎵 SEKSI 4: EVENT & WORKSHOP CAROUSEL */}
          <LandingEventsSection
            events={upcomingEvents}
            onSelectEvent={setSelectedEventForTicket}
            onViewAllEvents={() => setActiveSection('events')}
            isMobile={isMobile}
          />

          {/* 📱 SEKSI 5: CARA PESAN */}
          <OneTransactionOneTruthSection />
        </main>
      )}

      {/* FOOTER */}
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

      {/* SPOTLIGHT SEARCH MODAL */}
      <SpotlightOmniSearchModal
        isOpen={showSpotlightModal}
        onClose={() => setShowSpotlightModal(false)}
        onNavigateApp={(appId) => {
          setShowSpotlightModal(false)
          setActiveApp(appId as any)
        }}
      />

      {/* EVENT TICKET PURCHASE MODAL */}
      <EventTicketPurchaseModal
        show={Boolean(selectedEventForTicket)}
        event={selectedEventForTicket}
        onClose={() => setSelectedEventForTicket(null)}
      />
    </div>
  )
}
