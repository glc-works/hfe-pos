import React from 'react'
import { Search, X, Layers, Sparkles } from 'lucide-react'
import { MenuItem, CartItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { ProductCard } from '../shared/ProductCard'

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
  cartItems?: CartItem[]
  onUpdateQty?: (index: number, newQty: number) => void
  viewMode?: CatalogViewMode
}

export type CatalogViewMode = 'grid' | 'compact' | 'list'

export const getCategoryGlyph = (category: string): string => {
  const lower = category.toLowerCase()
  if (lower === 'all' || lower === 'semua') return '☕'
  if (lower.includes('coffee') && !lower.includes('non')) return '☕'
  if (lower.includes('non-coffee') || lower.includes('tea') || lower.includes('matcha')) return '🍵'
  if (lower.includes('pastry') || lower.includes('bakery') || lower.includes('croissant')) return '🥐'
  if (lower.includes('snack') || lower.includes('fries') || lower.includes('bites')) return '🍟'
  if (lower.includes('food') || lower.includes('meal') || lower.includes('main')) return '🍽️'
  if (lower.includes('dessert') || lower.includes('cake')) return '🍰'
  return '🏷️'
}

export const PosCatalogGrid: React.FC<PosCatalogGridProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredCatalog,
  isImageUrl,
  onAddToCart,
  isMobile = false,
  cartItems = [],
  onUpdateQty,
  viewMode = 'grid'
}) => {
  const { t, language } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 select-none">
      {/* 1. SHARED IN-PAGE SEARCH & ETALASE CATEGORY SHOWCASE BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col gap-2 shadow-md">
        {/* ROW A: IN-PAGE SEARCH BAR */}
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search menu name, coffee, pastry, or ID...' : 'Cari nama menu, kopi, pastry, atau ID...'}
            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500/60 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ROW B: 1-TAP HORIZONTAL CATEGORY SHOWCASE PILLS (ETALASE KATEGORI) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border active:scale-[0.97] ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800/80'
            }`}
          >
            <span>☕</span>
            <span>Semua</span>
          </button>

          {categories.filter(c => c !== 'all').map((cat) => {
            const isActive = selectedCategory === cat
            const glyph = getCategoryGlyph(cat)

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border active:scale-[0.97] ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800/80'
                }`}
              >
                <span>{glyph}</span>
                <span>{cat}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. EMPTY STATE */}
      {filteredCatalog.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <Search className="w-8 h-8 text-slate-600 mb-1" />
          <p className="text-sm font-bold text-slate-300">{t.pos?.noProductsFound || 'Produk tidak ditemukan'}</p>
          <p className="text-xs text-slate-500">{t.pos?.noProductsSub || 'Coba gunakan kata kunci pencarian atau kategori lain'}</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 rounded-xl border border-slate-700"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* 3. MODE 1: GRID VIEW (FOTO BESAR) */}
      {viewMode === 'grid' && filteredCatalog.length > 0 && (
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {filteredCatalog.map((item) => {
            const cartItemIndex = cartItems?.findIndex((c) => c.id === item.id || c.name === item.name) ?? -1
            const cartQty = cartItems?.filter((c) => c.id === item.id || c.name === item.name).reduce((sum, c) => sum + c.quantity, 0) ?? 0

            return (
              <ProductCard
                key={item.id}
                product={item}
                quantityInCart={cartQty}
                variant="pos-grid"
                showSku={true}
                onAddToCart={onAddToCart}
                onUpdateQty={(newQty) => onUpdateQty && onUpdateQty(cartItemIndex, newQty)}
                isImageUrl={isImageUrl}
              />
            )
          })}
        </div>
      )}

      {/* 4. MODE 2: COMPACT VIEW (HIGH-DENSITY TOUCH TILES) */}
      {viewMode === 'compact' && filteredCatalog.length > 0 && (
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'}`}>
          {filteredCatalog.map((item) => {
            const cartItemIndex = cartItems?.findIndex((c) => c.id === item.id || c.name === item.name) ?? -1
            const cartQty = cartItems?.filter((c) => c.id === item.id || c.name === item.name).reduce((sum, c) => sum + c.quantity, 0) ?? 0

            return (
              <ProductCard
                key={item.id}
                product={item}
                quantityInCart={cartQty}
                variant="pos-compact"
                showSku={false}
                onAddToCart={onAddToCart}
                onUpdateQty={(newQty) => onUpdateQty && onUpdateQty(cartItemIndex, newQty)}
                isImageUrl={isImageUrl}
              />
            )
          })}
        </div>
      )}

      {/* 5. MODE 3: LIST VIEW (HIGH-DENSITY RETAIL ROWS) */}
      {viewMode === 'list' && filteredCatalog.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {filteredCatalog.map((item) => {
            const cartItemIndex = cartItems?.findIndex((c) => c.id === item.id || c.name === item.name) ?? -1
            const cartQty = cartItems?.filter((c) => c.id === item.id || c.name === item.name).reduce((sum, c) => sum + c.quantity, 0) ?? 0

            return (
              <ProductCard
                key={item.id}
                product={item}
                quantityInCart={cartQty}
                variant="pos-list"
                showSku={true}
                onAddToCart={onAddToCart}
                onUpdateQty={(newQty) => onUpdateQty && onUpdateQty(cartItemIndex, newQty)}
                isImageUrl={isImageUrl}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
