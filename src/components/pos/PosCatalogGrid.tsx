import React, { useState } from 'react'
import { Search, LayoutGrid, Grid, List, Plus, Tag } from 'lucide-react'
import { MenuItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export interface PosCatalogGridProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  categories: string[]
  filteredCatalog: MenuItem[]
  isImageUrl: (url?: string) => boolean
  onAddToCart: (item: MenuItem) => void
  isMobile?: boolean
}

export type CatalogViewMode = 'grid' | 'compact' | 'list'

export const PosCatalogGrid: React.FC<PosCatalogGridProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredCatalog,
  isImageUrl,
  onAddToCart,
  isMobile = false
}) => {
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid')
  const { t, formatPrice } = useTranslation()

  return (
    <div className="flex flex-col gap-3.5">
      {/* SEARCH & VIEW MODE SWITCHER */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`${t.common.search} (${t.pos.skuCatalog.replace(/^[^\w\s]+/, '').trim()})...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-all shadow-inner"
          />
        </div>

        {/* 3 VIEW MODE BUTTONS: GRID / COMPACT / LIST */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t.pos.viewGrid}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'compact'
                ? 'bg-white text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Compact View"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t.pos.viewCompact}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-white text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t.pos.viewList}</span>
          </button>
        </div>
      </div>

      {/* CATEGORY PILL FILTER */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-white border-white text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat === 'all' ? `✨ ${t.common.all}` : cat}
          </button>
        ))}
      </div>

      {/* CATALOG HEADER WITH COUNT */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" /> {t.pos.skuCatalog}:
        </span>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
          {filteredCatalog.length} {t.pos.availableSkus}
        </span>
      </div>

      {/* EMPTY STATE */}
      {filteredCatalog.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <Search className="w-8 h-8 text-slate-600 mb-1" />
          <p className="text-sm font-bold text-slate-300">{t.pos.noProductsFound}</p>
          <p className="text-xs text-slate-500">{t.pos.noProductsSub}</p>
        </div>
      )}

      {/* MODE 1: GRID VIEW (FOTO BESAR) */}
      {viewMode === 'grid' && filteredCatalog.length > 0 && (
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              onClick={() => onAddToCart(item)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-500 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between shadow-md group"
            >
              {isImageUrl(item.image) ? (
                <img src={item.image} alt={item.name} className="w-full h-28 sm:h-32 object-cover rounded-t-xl group-hover:opacity-90 transition-opacity" />
              ) : (
                <div className="w-full h-24 bg-slate-800/80 flex items-center justify-center text-3xl rounded-t-xl">
                  {item.image || '☕'}
                </div>
              )}
              <div className="p-3 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-white">{item.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">{item.category}</span>
                  <span className="font-mono text-slate-500">{item.hfeCategoryCode || item.id}</span>
                </div>
                <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: COMPACT VIEW (HIGH-DENSITY TOUCH TILES) */}
      {viewMode === 'compact' && filteredCatalog.length > 0 && (
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'}`}>
          {filteredCatalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddToCart(item)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-500 rounded-xl p-2.5 flex flex-col items-center justify-between text-center transition-all hover:scale-[1.02] shadow-sm group min-h-[110px]"
            >
              {isImageUrl(item.image) ? (
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover mb-1 shadow-inner group-hover:opacity-90" />
              ) : (
                <span className="text-xl mb-1">{item.image || '☕'}</span>
              )}
              <div className="w-full flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-white">{item.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1">{formatPrice(item.price)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* MODE 3: LIST VIEW (HIGH-DENSITY RETAIL ROWS) */}
      {viewMode === 'list' && filteredCatalog.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              onClick={() => onAddToCart(item)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-800/60 shadow-sm group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {isImageUrl(item.image) ? (
                  <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover shrink-0 shadow-inner" />
                ) : (
                  <div className="w-11 h-11 bg-slate-800 rounded-lg flex items-center justify-center text-xl shrink-0">
                    {item.image || '☕'}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100 truncate group-hover:text-white">{item.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                      {item.hfeCategoryCode || item.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">{item.category} • {item.description?.slice(0, 40) || 'Menu Item'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToCart(item)
                  }}
                  className="bg-white hover:bg-slate-200 text-slate-950 p-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center"
                  title={t.pos.addToCart}
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
