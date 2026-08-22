import React, { useState } from 'react'
import { Sparkles, Edit3, ChevronDown, ChevronUp } from 'lucide-react'
import { MenuItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface PosFavoritesBarProps {
  pinnedFavorites: MenuItem[]
  isImageUrl: (url?: string) => boolean
  onAddToCart: (item: MenuItem) => void
  onEditPinnedMenu?: () => void
  isMobile?: boolean
}

export const PosFavoritesBar: React.FC<PosFavoritesBarProps> = ({
  pinnedFavorites,
  isImageUrl,
  onAddToCart,
  onEditPinnedMenu,
  isMobile = false
}) => {
  const { t, formatPrice } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1.5 shadow-xl transition-all">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 fill-amber-500 dark:fill-amber-400 shrink-0" />
            <span className="truncate">{isMobile ? 'Favorites' : '⚡ Speed Keys'}</span>
          </span>
          <span className="text-[9px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
            {pinnedFavorites.length} Item
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEditPinnedMenu}
            className="text-[10px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all shadow-sm shrink-0"
            title="Edit Pinned Shortcuts"
          >
            <Edit3 className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" /> {t.pos.editShortcut}
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shrink-0"
            title={isCollapsed ? 'Tampilkan Speed Keys' : 'Sembunyikan Speed Keys'}
          >
            {isCollapsed ? <ChevronUp className="w-3 h-3 text-amber-500 dark:text-amber-400" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className={`grid gap-1.5 max-h-36 overflow-y-auto custom-scrollbar ${isMobile ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-6'}`}>
          {pinnedFavorites.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddToCart(item)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-1.5 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 shadow-sm group min-w-0"
            >
              {isImageUrl(item.image) ? (
                <img src={item.image} alt={item.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover mb-0.5 shadow-inner group-hover:opacity-90 shrink-0" />
              ) : (
                <span className="text-sm sm:text-base mb-0.5 shrink-0">{item.image || '☕'}</span>
              )}
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-slate-950 dark:group-hover:text-white leading-tight">{item.name}</span>
              <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold leading-tight">{formatPrice(item.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

