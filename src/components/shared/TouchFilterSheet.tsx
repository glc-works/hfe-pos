import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, RotateCcw, SlidersHorizontal } from 'lucide-react'

export interface FilterOption<T = string> {
  id: T
  label: string
  icon?: string | React.ReactNode
  badgeCount?: number
  badgeColor?: string
  description?: string
}

export interface FilterSection<T = string> {
  id: string
  title: string
  icon?: React.ReactNode
  type?: 'single' | 'multiple'
  options: FilterOption<T>[]
  selected: T | T[]
  onSelect: (value: T) => void
}

export interface TouchFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  sections: FilterSection<any>[]
  onResetAll?: () => void
  onApply?: () => void
  activeCountBadge?: number
}

export const TouchFilterSheet: React.FC<TouchFilterSheetProps> = ({
  isOpen,
  onClose,
  title = 'Filter & Preferensi Tampilan',
  subtitle = 'Pilih kategori lantai, status tagihan, dan opsi visual',
  sections,
  onResetAll,
  onApply,
  activeCountBadge
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleApplyClick = () => {
    onApply?.()
    onClose()
  }

  const sheetContent = (
    <div className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GRAB HANDLE FOR MOBILE */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{title}</h3>
                {activeCountBadge !== undefined && (
                  <span className="text-[10px] font-mono bg-indigo-500 text-white px-2 py-0.2 rounded-full font-bold">
                    {activeCountBadge} Meja
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Tutup Filter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE SECTIONS BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 flex flex-col gap-6 custom-scrollbar">
          {sections.map((sec) => (
            <div key={sec.id} className="flex flex-col gap-2.5">
              {/* SECTION TITLE */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  {sec.icon} {sec.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {Array.isArray(sec.selected) ? `${sec.selected.length} dipilih` : 'Pilih 1'}
                </span>
              </div>

              {/* SECTION LARGE TOUCH OPTIONS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.options.map((opt) => {
                  const isSelected = Array.isArray(sec.selected)
                    ? sec.selected.includes(opt.id)
                    : sec.selected === opt.id

                  return (
                    <button
                      key={String(opt.id)}
                      type="button"
                      onClick={() => sec.onSelect(opt.id)}
                      className={`w-full min-h-[52px] p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 active:scale-[0.98] cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/10 dark:from-indigo-500/25 dark:to-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500/30 font-bold'
                          : 'bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {opt.icon && (
                          <span className="text-lg shrink-0 flex items-center justify-center">
                            {opt.icon}
                          </span>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate">{opt.label}</span>
                          {opt.description && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {opt.badgeCount !== undefined && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold ${
                              opt.badgeColor
                                ? opt.badgeColor
                                : isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {opt.badgeCount}
                          </span>
                        )}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER BAR: RESET & APPLY BUTTONS */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          {onResetAll ? (
            <button
              type="button"
              onClick={onResetAll}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleApplyClick}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Terapkan Filter</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(sheetContent, document.body)
}
export default TouchFilterSheet
