import React from 'react'
import { HfeCompanyProfile, MenuItem } from '../../types/pos'
import { Coffee, Building, CalendarCheck, QrCode, Sparkles, ChevronRight, Smartphone } from 'lucide-react'

interface LandingPageViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  productCatalog: MenuItem[]
  onOpenReservationModal: () => void
  onSwitchToCustomerApp: () => void
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  hfeCompanyProfile,
  productCatalog,
  onOpenReservationModal,
  onSwitchToCustomerApp
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 theme-customer-container">
      {/* LANDING PAGE NAVBAR */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hfeCompanyProfile.logoUrl ? (
            <img src={hfeCompanyProfile.logoUrl} alt={hfeCompanyProfile.brandName} className="w-9 h-9 rounded-xl object-cover border border-amber-500/50 shadow" />
          ) : (
            <div className="w-9 h-9 rounded-xl theme-customer-btn-primary flex items-center justify-center font-black text-xs">
              <Coffee className="w-5 h-5 text-slate-950" />
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-none">{hfeCompanyProfile.brandName}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-amber-500" /> {hfeCompanyProfile.ptLegalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReservationModal}
            className="theme-customer-btn-primary text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" /> Reservasi Meja
          </button>
          <button
            onClick={onSwitchToCustomerApp}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-amber-500" /> Scan QR Order
          </button>
        </div>
      </header>

      {/* HERO SHOWCASE */}
      <section className="relative px-4 sm:px-8 py-12 sm:py-20 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit">
            ✨ OFFICIAL CAFE & ARTISAN ROASTERY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Nikmati Pengalaman Kuliner & Kopi Specialty Terbaik di Senopati
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Menyajikan biji kopi houseblend Arabica pilihan, artisan matcha Uji Jepang, hangatnya pastry mentega Prancis, dan suasana tempat yang hangat untuk meeting maupun berkumpul.
          </p>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenReservationModal}
              className="theme-customer-btn-primary text-xs font-bold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <CalendarCheck className="w-4 h-4" /> Reservasi Slot Meja Sekarang ➔
            </button>
            <button
              onClick={onSwitchToCustomerApp}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-amber-400" /> Buku Menu & QR Order
            </button>
          </div>
        </div>

        {/* HERO IMAGE SHOWCASE */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-3xl blur-lg opacity-30"></div>
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
            alt="Cafe Ambiance"
            className="relative rounded-3xl object-cover border border-slate-800 shadow-2xl w-full h-64 sm:h-80"
          />
        </div>
      </section>

      {/* FACILITY & AMBIANCE CARDS */}
      <section className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Fasilitas & Kenyamanan Outlet Kafe
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🍃', title: 'Outdoor Garden', desc: 'Area outdoor asri & smoking area' },
            { icon: '❄️', title: 'VIP AC Room', desc: 'Ruang privat meeting 12 pax' },
            { icon: '📶', title: 'WiFi 300 Mbps', desc: 'Koneksi cepat & colokan di tiap meja' },
            { icon: '🅿️', title: 'Free Valet Parking', desc: 'Parkir luas & EV charging' }
          ].map((fac, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
              <span className="text-2xl">{fac.icon}</span>
              <h4 className="font-bold text-xs text-white mt-1">{fac.title}</h4>
              <p className="text-[10px] text-slate-400">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SPECIALTY MENU */}
      <section className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-500" /> Menu Specialty Populer
          </h3>
          <button onClick={onSwitchToCustomerApp} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Lihat Seluruh Katalog <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {productCatalog.slice(0, 3).map(item => (
            <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex gap-3 shadow-xl">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER & ADDRESS */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-4 sm:px-8 py-6 text-center text-xs text-slate-500 flex flex-col gap-2">
        <p className="font-bold text-slate-300">{hfeCompanyProfile.brandName} • {hfeCompanyProfile.ptLegalName}</p>
        <p className="text-[11px] text-slate-400 font-mono">NPWP: {hfeCompanyProfile.taxIdNpwp} • {hfeCompanyProfile.address}</p>
        <p className="text-[10px] text-slate-600">Jam Operasional: Setiap Hari 07:00 - 23:00 WIB • Powered by HFE Core Engine</p>
      </footer>
    </div>
  )
}
