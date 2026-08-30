import React from 'react'
import { Sparkles, Trees, Car, Wifi, Zap, Wind, Coffee } from 'lucide-react'

export interface FacilityItem {
  icon: string
  title: string
  desc?: string
  image?: string
}

export interface LandingFacilitiesSectionProps {
  facilities: FacilityItem[]
  title: string
  isMobile: boolean
}

export const LandingFacilitiesSection: React.FC<LandingFacilitiesSectionProps> = ({
  facilities,
  title,
  isMobile
}) => {
  if (!facilities || facilities.length === 0) return null

  return (
    <section id="facilities-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
      isMobile ? 'px-4' : 'px-4 sm:px-8'
    }`}>
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> {title}
      </h3>

      {/* VISUAL CARDS GALLERY (PHOTO-DOMINANT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {facilities.map((fac, idx) => (
          <div
            key={idx}
            className="relative group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 h-44 sm:h-48 shadow-xs dark:shadow-md bg-slate-900"
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

      {/* MINIMALIST MICRO-AMENITIES BAR */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs">
          <Wifi className="w-3.5 h-3.5 text-blue-500 shrink-0" /> WiFi 300 Mbps
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Stopkontak
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs">
          <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" /> Full AC & Outdoor
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs">
          <Car className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Parkir & Valet
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Musholla Bersih
        </span>
      </div>
    </section>
  )
}
