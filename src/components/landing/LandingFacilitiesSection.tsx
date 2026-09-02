import React, { useRef } from 'react'
import { Sparkles, Trees, Car, Wifi, Zap, Wind, Coffee, Check, Music, CalendarCheck, PawPrint, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { AmenityTagId } from '../../types/pos'
import { STANDARD_AMENITIES_CATALOG, DEFAULT_MERCHANT_AMENITY_TAGS } from '../../data/amenityCatalog'
import { useTranslation } from '../../context/LanguageContext'

export interface FacilityItem {
  icon: string
  title: string
  desc?: string
  image?: string
}

export interface LandingFacilitiesSectionProps {
  facilities: FacilityItem[]
  amenityTags?: AmenityTagId[]
  title: string
  onViewAllFacilities?: () => void
  isMobile: boolean
}

export const LandingFacilitiesSection: React.FC<LandingFacilitiesSectionProps> = ({
  facilities,
  amenityTags = DEFAULT_MERCHANT_AMENITY_TAGS,
  title,
  onViewAllFacilities,
  isMobile
}) => {
  const { language } = useTranslation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if ((!facilities || facilities.length === 0) && (!amenityTags || amenityTags.length === 0)) {
    return null
  }

  const activeTagDefinitions = (amenityTags && amenityTags.length > 0 ? amenityTags : DEFAULT_MERCHANT_AMENITY_TAGS)
    .map(tagId => STANDARD_AMENITIES_CATALOG.find(cat => cat.id === tagId))
    .filter((def): def is NonNullable<typeof def> => Boolean(def))

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-blue-500 shrink-0" />
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />
      case 'trees':
        return <Trees className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      case 'car':
        return <Car className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      case 'paw':
        return <PawPrint className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      case 'music':
        return <Music className="w-3.5 h-3.5 text-purple-500 shrink-0" />
      case 'calendar':
        return <CalendarCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      default:
        return <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
    }
  }

  return (
    <section id="facilities-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
      isMobile ? 'px-4' : 'px-4 sm:px-8'
    }`}>
      {/* SECTION HEADER WITH CLICKABLE TITLE & CONTROLS AT FAR RIGHT */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onViewAllFacilities}
          className="group text-left cursor-pointer transition-transform active:scale-98"
        >
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-amber-500 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{title}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:inline-block" />
          </h3>
        </button>

        <div className="flex items-center gap-2.5">
          {onViewAllFacilities && (
            <button
              type="button"
              onClick={onViewAllFacilities}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 cursor-pointer"
            >
              <span>Detail Fasilitas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {facilities.length > 3 && (
            <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer active:scale-95"
                title="Geser Kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer active:scale-95"
                title="Geser Kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* HORIZONTAL SNAP CAROUSEL GALLERY */}
      {facilities && facilities.length > 0 && (
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 sm:gap-4 pb-1 scroll-smooth"
        >
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="min-w-[270px] sm:min-w-[320px] max-w-[340px] snap-start shrink-0 relative group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 h-44 sm:h-48 shadow-xs dark:shadow-md bg-slate-900"
            >
              {fac.image ? (
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-amber-500 opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-white">
                  {fac.icon === 'trees' ? <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> :
                   fac.icon === 'sparkles' ? <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> :
                   fac.icon === 'car' ? <Car className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> :
                   <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <h4 className="font-bold text-xs sm:text-sm text-white">{fac.title}</h4>
                </div>
                {fac.desc && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-1">{fac.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STANDARDIZED GOOGLE MAPS AMENITY TAGS STRIP */}
      {activeTagDefinitions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {activeTagDefinitions.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs hover:border-amber-500/40 transition-colors"
            >
              {renderAmenityIcon(tag.icon)}
              <span>{language === 'en' ? tag.labelEn : tag.labelId}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
