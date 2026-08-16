import React from 'react'
import { HfeCompanyProfile, MenuItem, ViewportModeType } from '../../types/pos'
import { Coffee, Building, CalendarCheck, QrCode, Sparkles, ChevronRight, Smartphone } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

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
  const isMobile = viewportMode === 'mobile'
  const { t, formatPrice } = useTranslation()

  return (
    <div className="flex-1 flex flex-col bg-slate-950 theme-customer-container">
      {/* LANDING PAGE NAVBAR */}
      <header className={`border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40 flex items-center justify-between gap-2 shadow-lg ${
        isMobile ? 'px-3 py-2.5' : 'px-4 sm:px-8 py-3'
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
            <h1 className="font-extrabold text-xs sm:text-base text-white tracking-tight leading-tight truncate">
              {hfeCompanyProfile.brandName}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium flex items-center gap-1 truncate">
              <Building className="w-3 h-3 text-amber-500 shrink-0" /> <span className="truncate">{hfeCompanyProfile.ptLegalName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="theme-customer-btn-primary text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-1.5 whitespace-nowrap"
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{isMobile ? 'Booking' : t.landing.reserveTable}</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToCustomerApp}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-800 flex items-center gap-1.5 whitespace-nowrap"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{isMobile ? 'Menu' : t.landing.scanQrOrder}</span>
          </button>
        </div>
      </header>

      {/* HERO SHOWCASE */}
      <section className={`relative max-w-6xl mx-auto w-full flex justify-between gap-6 sm:gap-8 ${
        isMobile ? 'flex-col px-4 py-6' : 'flex-col md:flex-row items-center px-4 sm:px-8 py-10 sm:py-16'
      }`}>
        <div className="flex-1 flex flex-col gap-3.5 sm:gap-4 min-w-0">
          <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit">
            {t.landing.heroTag}
          </span>
          <h2 className={`font-black text-white tracking-tight leading-tight ${
            isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'
          }`}>
            {t.landing.heroTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          {/* MOBILE HERO IMAGE (Rendered in single-column flow on mobile) */}
          {isMobile && (
            <div className="w-full relative my-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-indigo-500/30 rounded-3xl blur-md"></div>
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                alt="Cafe Ambiance"
                className="relative rounded-2xl object-cover border border-slate-800 shadow-xl w-full h-48"
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
              <CalendarCheck className="w-4 h-4 shrink-0" /> {t.landing.reserveTableCta}
            </button>
            <button
              type="button"
              onClick={onSwitchToCustomerApp}
              className={`bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold px-4 py-3 rounded-xl border border-slate-800 flex items-center justify-center gap-2 text-center transition-all ${
                isMobile ? 'w-full' : ''
              }`}
            >
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" /> {t.landing.menuAndQr}
            </button>
          </div>
        </div>

        {/* DESKTOP/TABLET HERO IMAGE (Rendered on right column) */}
        {!isMobile && (
          <div className="w-full md:w-1/2 relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-3xl blur-lg opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
              alt="Cafe Ambiance"
              className="relative rounded-3xl object-cover border border-slate-800 shadow-2xl w-full h-64 sm:h-80"
            />
          </div>
        )}
      </section>

      {/* FACILITY & AMBIANCE CARDS */}
      <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.facilitiesTitle}
        </h3>

        <div className={`grid gap-2.5 sm:gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {[
            { icon: '🍃', title: 'Outdoor Garden', desc: 'Area outdoor asri & smoking area' },
            { icon: '❄️', title: 'VIP AC Room', desc: 'Ruang privat meeting 12 pax' },
            { icon: '📶', title: 'WiFi 300 Mbps', desc: 'Koneksi cepat & colokan di tiap meja' },
            { icon: '🅿️', title: 'Free Valet Parking', desc: 'Parkir luas & EV charging' }
          ].map((fac, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-lg">
              <span className="text-xl sm:text-2xl">{fac.icon}</span>
              <h4 className="font-bold text-xs text-white mt-1">{fac.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SPECIALTY MENU */}
      <section className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-800/80 ${
        isMobile ? 'px-4' : 'px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-500 shrink-0" /> {t.landing.featuredMenuTitle}
          </h3>
          <button type="button" onClick={onSwitchToCustomerApp} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            {t.landing.viewAllCatalog} <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {productCatalog.slice(0, 3).map(item => (
            <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex gap-3 shadow-xl">
              <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-800 shrink-0" />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 mt-1">{formatPrice(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER & ADDRESS */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-4 sm:px-8 py-6 text-center text-xs text-slate-500 flex flex-col gap-2">
        <p className="font-bold text-slate-300">{hfeCompanyProfile.brandName} • {hfeCompanyProfile.ptLegalName}</p>
        <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">NPWP: {hfeCompanyProfile.taxIdNpwp} • {hfeCompanyProfile.address}</p>
        <p className="text-[9px] sm:text-[10px] text-slate-600">{t.landing.hours}</p>
      </footer>
    </div>
  )
}
