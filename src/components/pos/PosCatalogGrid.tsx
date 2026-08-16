import React from 'react'
import { Search } from 'lucide-react'
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

export const PosCatalogGrid: React.FC<PosCatalogGridProps> = ({
  searchQuery: _searchQuery,
  setSearchQuery: _setSearchQuery,
  selectedCategory: _selectedCategory,
  setSelectedCategory: _setSelectedCategory,
  categories: _categories,
  filteredCatalog,
  isImageUrl,
  onAddToCart,
  isMobile = false,
  cartItems = [],
  onUpdateQty,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
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

      {/* MODE 2: COMPACT VIEW (HIGH-DENSITY TOUCH TILES) */}
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

      {/* MODE 3: LIST VIEW (HIGH-DENSITY RETAIL ROWS) */}
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
