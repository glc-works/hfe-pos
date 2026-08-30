import React, { useState } from 'react'
import {
  Tag, Copy, Check, Sparkles, Trees, Car, Wifi, Zap, Wind,
  Coffee, Music, MapPin, Ticket, CalendarCheck, PawPrint, Search, ShoppingBag, ArrowRight
} from 'lucide-react'
import { MenuItem, EventTicketItem, AmenityTagId } from '../../types/pos'
import { STANDARD_AMENITIES_CATALOG, DEFAULT_MERCHANT_AMENITY_TAGS } from '../../data/amenityCatalog'
import { useTranslation } from '../../context/LanguageContext'
import { FacilityItem } from './LandingFacilitiesSection'
import { PromoItem } from './LandingPromosSection'

interface LandingDedicatedSectionViewProps {
  section: 'menu' | 'promos' | 'facilities' | 'events'
  productCatalog: MenuItem[]
  promos: PromoItem[]
  facilities: FacilityItem[]
  amenityTags?: AmenityTagId[]
  events: EventTicketItem[]
  onSelectEvent: (evt: EventTicketItem) => void
  onCopyPromo: (code: string) => void
  copiedPromoCode: string | null
  onSwitchToCustomerApp: () => void
  onOpenReservationModal: () => void
  isMobile: boolean
}

export const LandingDedicatedSectionView: React.FC<LandingDedicatedSectionViewProps> = ({
  section,
  productCatalog,
  promos,
  facilities,
  amenityTags = DEFAULT_MERCHANT_AMENITY_TAGS,
  events,
  onSelectEvent,
  onCopyPromo,
  copiedPromoCode,
  onSwitchToCustomerApp,
  onOpenReservationModal,
  isMobile
}) => {
  const { language, t, formatPrice } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-blue-500 shrink-0" />
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-500 shrink-0" />
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-500 shrink-0" />
      case 'trees':
        return <Trees className="w-4 h-4 text-emerald-500 shrink-0" />
      case 'car':
        return <Car className="w-4 h-4 text-indigo-500 shrink-0" />
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
      case 'paw':
        return <PawPrint className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      case 'music':
        return <Music className="w-4 h-4 text-purple-500 shrink-0" />
      case 'calendar':
        return <CalendarCheck className="w-4 h-4 text-emerald-500 shrink-0" />
      default:
        return <Check className="w-4 h-4 text-amber-500 shrink-0" />
    }
  }

  // --- DEDICATED 1: PROMOS FULL VIEW ---
  if (section === 'promos') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-5 sm:p-7">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <Tag className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-black">{t.landing.promosTitle} & Voucher Bank Partner</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            Gunakan voucher dan penawaran spesial eksklusif untuk hemat lebih banyak saat bersantap di outlet kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => {
            const isCopied = copiedPromoCode === promo.code
            return (
              <div
                key={promo.id}
                className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-amber-500 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      {promo.code}
                    </span>
                    <Tag className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-3">{promo.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{promo.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                    {promo.minSpend ? `Min. ${formatPrice(promo.minSpend)}` : 'Tanpa Min. Belanja'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyPromo(promo.code)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin Kupon'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // --- DEDICATED 2: FACILITIES FULL VIEW ---
  if (section === 'facilities') {
    const activeTagDefinitions = (amenityTags && amenityTags.length > 0 ? amenityTags : DEFAULT_MERCHANT_AMENITY_TAGS)
      .map(tagId => STANDARD_AMENITIES_CATALOG.find(cat => cat.id === tagId))
      .filter((def): def is NonNullable<typeof def> => Boolean(def))

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-black">{t.landing.facilitiesTitle} & Area Ruangan</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Jelajahi kenyamanan seluruh sudut ruangan kami mulai dari area outdoor asri, slow bar roastery, hingga ruang VIP privat.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            📅 Reservasi Meja / Ruang
          </button>
        </div>

        {/* FULL PHOTO GALLERY GRID */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Galeri Sudut Ruangan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-52 bg-slate-900 shadow-sm"
              >
                {fac.image ? (
                  <img src={fac.image} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-amber-500 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                  <h4 className="font-bold text-sm text-white">{fac.title}</h4>
                  {fac.desc && <p className="text-xs text-slate-300 mt-0.5">{fac.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL AMENITIES LIST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Fasilitas & Standar Kenyamanan Google Maps ({activeTagDefinitions.length} Tersedia)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeTagDefinitions.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80"
              >
                {renderAmenityIcon(tag.icon)}
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'en' ? tag.labelEn : tag.labelId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // --- DEDICATED 3: EVENTS FULL VIEW ---
  if (section === 'events') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
              <Music className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-black">{t.landing.eventsTitle} & Workshop Kalender</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Ikuti penampilan musik live akustik mingguan dan kelas masterclass seduh kopi bersama head roaster kami.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenReservationModal}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            RSVP Tempat
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden flex flex-col justify-between shadow-md hover:border-purple-500 transition-all"
            >
              {evt.bannerUrl && (
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden shrink-0">
                  <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-purple-200 bg-purple-900/80 backdrop-blur-xs px-3 py-1 rounded-full border border-purple-400/40 font-mono uppercase">
                      {evt.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 dark:text-purple-300 font-mono font-bold">
                      📅 {evt.date} • ⏱️ {evt.time}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      Sisa: <strong className="text-amber-600 dark:text-amber-400">{evt.quotaRemaining}</strong>/{evt.quotaTotal}
                    </span>
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white mt-2">{evt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5">{evt.description}</p>
                  <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300 mt-3 font-mono">
                    <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono block">Harga Tiket:</span>
                    <span className="text-sm sm:text-base font-mono font-black text-amber-600 dark:text-amber-400">
                      {formatPrice(evt.price)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    className="text-xs font-bold px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{evt.category === 'workshop_class' ? 'Booking Kelas' : 'Beli Tiket'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- DEDICATED 4: MENU / FULL CATALOG VIEW ---
  const categories = ['all', ...Array.from(new Set(productCatalog.map(p => p.category)))]
  const filteredProducts = productCatalog.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <Coffee className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-black">{t.landing.menuTitle} & Seluruh Katalog</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
            Pilihan sajian racikan artisan kopi, minuman segar, dan hidangan pendamping lezat.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToCustomerApp}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pesan Online Sekarang</span>
        </button>
      </div>

      {/* SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu favorit..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-1.5 w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Menu' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={onSwitchToCustomerApp}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-3 flex flex-col justify-between shadow-xs hover:border-amber-500/60 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2.5 relative">
              {prod.image ? (
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-amber-500/40" />
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 uppercase block">{prod.category}</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                {prod.name}
              </h4>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="font-mono font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                {formatPrice(prod.price)}
              </span>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                Pesan <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
