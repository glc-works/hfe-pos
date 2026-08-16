import React from 'react'
import { Sparkles } from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'
import { MARKETPLACE_THEMES, MarketplaceThemeItem } from '../../data/marketplaceThemesData'

export interface MarketplaceThemeGalleryProps {
  currentTheme: CafeThemeConfig
  onSelectTheme: (theme: CafeThemeConfig) => void
}

export const MarketplaceThemeGallery: React.FC<MarketplaceThemeGalleryProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {MARKETPLACE_THEMES.map((item: MarketplaceThemeItem) => {
        const isSelected = currentTheme.themeName === item.theme.themeName
        return (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 relative bg-slate-950/80 ${
              isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* MINI PREVIEW CANVAS */}
            <div
              className="w-full h-20 rounded-xl p-2 flex flex-col justify-between border shadow-inner relative overflow-hidden"
              style={{ backgroundColor: item.theme.pageBgHex, borderColor: `${item.theme.primaryAccentHex}30` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black" style={{ color: item.theme.textColorHex }}>
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-cyan-500 text-slate-950 uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <div
                className="rounded-lg p-1 flex items-center justify-between border shadow-sm"
                style={{ backgroundColor: item.theme.cardBgHex, borderColor: `${item.theme.primaryAccentHex}30` }}
              >
                <span className="text-[8px] font-bold" style={{ color: item.theme.textColorHex }}>🛒 {item.category}</span>
                <span className="text-[8px] font-bold font-mono" style={{ color: item.theme.primaryAccentHex }}>⭐ {item.rating}</span>
              </div>
            </div>

            {/* CREATOR & METADATA */}
            <div className="flex items-center justify-between text-xs">
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                <p className="text-[10px] text-slate-400 truncate">oleh {item.creator}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTheme(item.theme)}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3 h-3" /> {isSelected ? '✓ Aktif' : 'Pasang'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
