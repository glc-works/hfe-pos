import React, { useState, useRef, useEffect } from 'react'
import { Home, ChevronRight, ChevronDown, Check, Coffee, Tag, Sparkles, Music } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export type LandingSectionId = 'overview' | 'menu' | 'promos' | 'facilities' | 'events'

interface LandingBreadcrumbsProps {
  activeSection: LandingSectionId
  onSelectSection: (section: LandingSectionId) => void
  isMobile?: boolean
}

export const LandingBreadcrumbs: React.FC<LandingBreadcrumbsProps> = ({
  activeSection,
  onSelectSection,
  isMobile = false
}) => {
  const { t } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sections: { id: LandingSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'menu', label: t.landing.menuTitle, icon: <Coffee className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'promos', label: t.landing.promosTitle, icon: <Tag className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'facilities', label: t.landing.facilitiesTitle, icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'events', label: t.landing.eventsTitle, icon: <Music className="w-3.5 h-3.5 text-purple-500" /> }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

  return (
    <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs font-semibold">
      {/* ROOT: BERANDA */}
      <button
        type="button"
        onClick={() => onSelectSection('overview')}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Kembali ke Beranda"
      >
        <Home className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Beranda</span>
      </button>

      {/* SEPARATOR */}
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />

      {/* CURRENT SECTION WITH GITHUB-STYLE QUICK DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            isDropdownOpen
              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/40'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {currentSection?.icon}
          <span>{currentSection?.label || 'Seksi'}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* DROPDOWN POPOVER */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              Lompat ke Seksi
            </div>
            {sections.map(s => {
              const isActive = s.id === activeSection
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(s.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <span>{s.label}</span>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
