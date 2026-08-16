import React from 'react'
import { Sparkles, Edit3 } from 'lucide-react'
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
            <span className="truncate">{isMobile ? '⚡ Favorites' : t.pos.quickActionFavorites}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-700 shrink-0">
            {pinnedFavorites.length} {t.pos.speedKeysCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <span className="text-[10px] text-slate-400 hidden sm:inline">{t.pos.quickActionSub}</span>
          )}
          <button
            type="button"
            onClick={onEditPinnedMenu}
            className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition-all shadow-sm shrink-0"
            title="Edit Pinned Shortcuts"
          >
            <Edit3 className="w-3 h-3 text-slate-400" /> {t.pos.editShortcut}
          </button>
        </div>
      </div>
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
        {pinnedFavorites.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddToCart(item)}
            className="bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] shadow-sm group"
          >
            {isImageUrl(item.image) ? (
              <img src={item.image} alt={item.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover mb-1 shadow-inner group-hover:opacity-90" />
            ) : (
              <span className="text-lg sm:text-xl mb-1">{item.image || '☕'}</span>
            )}
            <span className="text-[11px] font-bold text-slate-200 truncate w-full group-hover:text-white">{item.name}</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatPrice(item.price)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

