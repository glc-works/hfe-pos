import React, { useMemo } from 'react'
import { Search, X, Sparkles } from 'lucide-react'
import { MenuItem, CafeThemeConfig, HfeCompanyProfile, CartItem, OrderTicket } from '../../types/pos'
import { getCategoryIcon } from './CustomerHeader'
import { ProductCard } from '../shared/ProductCard'

export interface CustomerCatalogViewProps {
  productCatalog: MenuItem[]
  activeTheme: CafeThemeConfig
  hfeCompanyProfile: HfeCompanyProfile
  reservationPolicyMode: 'instant' | 'manual_review'
  priceVisibilityMode: 'show_prices' | 'hide_prices'
  customerAppDisplayMode: 'full_ordering' | 'catalog_only'
  cart: CartItem[]
  totalCartCount: number
  grandTotalBill: number
  previousOrders: OrderTicket[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  setShowReservationModal: (show: boolean) => void
  handleReorderSameItem: (item: MenuItem) => void
  handleAddToCart: (item: MenuItem) => void
  handleUpdateQty?: (index: number, delta: number) => void
  onOpenModifierSheet?: (item: MenuItem) => void
  setQrStepView: (step: 'catalog' | 'checkout') => void
  categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

export const CustomerCatalogView: React.FC<CustomerCatalogViewProps> = ({
  productCatalog,
  activeTheme,
  hfeCompanyProfile,
  priceVisibilityMode,
  customerAppDisplayMode,
  cart,
  previousOrders,
  searchQuery,
  setSearchQuery,
  handleReorderSameItem,
  handleAddToCart,
  handleUpdateQty,
  onOpenModifierSheet,
  categoryRefs
}) => {
  const hasPreviousOrders = previousOrders && previousOrders.length > 0
  const isLight = activeTheme.mode === 'light'
  const textColor = activeTheme.textColorHex || (isLight ? '#1e293b' : '#f8fafc')
  const secondaryTextColor = activeTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const cardBorderColor = isLight ? '#e2e8f0' : '#1e293b'

  // Instant reactive filter
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return productCatalog
    const q = searchQuery.toLowerCase().trim()
    return productCatalog.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    )
  }, [productCatalog, searchQuery])

  // Dynamic category grouping
  const categoryGroups = useMemo(() => {
    const groups: { category: string; items: MenuItem[] }[] = []
    const categoryOrder: string[] = []

    filteredCatalog.forEach(item => {
      const cat = item.category || 'General'
      if (!categoryOrder.includes(cat)) {
        categoryOrder.push(cat)
      }
    })

    categoryOrder.forEach(cat => {
      groups.push({
        category: cat,
        items: filteredCatalog.filter(item => item.category === cat)
      })
    })

    return groups
  }, [filteredCatalog])

  const shouldOpenItemModifierModal = (item: MenuItem) => {
    if (item.category === 'Pastry' || item.category === 'Snack' || item.category === 'Retail') return false
    return item.hasModifiers || item.modifierPolicy === 'always'
  }

  const renderProductList = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item) => {
        const cartItemIndex = cart.findIndex((c) => c.id === item.id || c.name === item.name)
        const cartQty = cart
          .filter((c) => c.id === item.id || c.name === item.name)
          .reduce((sum, c) => sum + c.quantity, 0)

        return (
          <ProductCard
            key={item.id}
            product={item}
            quantityInCart={cartQty}
            variant="customer-card"
            showSku={false}
            onAddToCart={() => {
              if (shouldOpenItemModifierModal(item) && onOpenModifierSheet) {
                onOpenModifierSheet(item)
              } else {
                handleAddToCart(item)
              }
            }}
            onUpdateQty={(newQty) => {
              if (handleUpdateQty && cartItemIndex >= 0) {
                const delta = newQty - cartQty
                handleUpdateQty(cartItemIndex, delta)
              }
            }}
            cardBorderColor={cardBorderColor}
            cardBgHex={activeTheme.cardBgHex}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            primaryAccentHex={activeTheme.primaryAccentHex}
            priceVisibilityMode={priceVisibilityMode === 'show_prices' ? 'show_prices' : 'hidden'}
            customerAppDisplayMode={customerAppDisplayMode}
          />
        )
      })}
    </div>
  )

  return (
    <>
      {/* 1. INSTANT SEARCH BAR FOR LARGE MENUS */}
      <div className="pt-0.5 pb-1">
        <div
          className="relative flex items-center rounded-xl border px-3.5 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        >
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, pastry, makanan, minuman..."
            className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all shrink-0 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC CONTINUOUS SMOOTH SCROLL CATALOG SECTIONS */}
      {categoryGroups.length > 0 ? (
        <div className="flex flex-col gap-6 pt-2">
          {categoryGroups.map(({ category, items }) => (
            <div
              key={category}
              ref={(el) => {
                if (categoryRefs) categoryRefs.current[category] = el
              }}
              className="flex flex-col gap-2.5 scroll-mt-28"
              style={{
                contentVisibility: 'auto',
                containIntrinsicSize: '200px'
              }}
            >
              <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: cardBorderColor }}>
                <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-2" style={{ color: textColor }}>
                  <span className="text-base">{getCategoryIcon(category)}</span> {category}
                </h3>
                <span className="text-[11px] font-mono font-medium" style={{ color: isLight ? '#475569' : secondaryTextColor }}>
                  {items.length} menu
                </span>
              </div>
              {renderProductList(items)}
            </div>
          ))}
        </div>
      ) : (
        /* 3. EMPTY STATE FOR 0 SEARCH MATCHES */
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-extrabold text-sm" style={{ color: textColor }}>
              Menu Tidak Ditemukan
            </h4>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: secondaryTextColor }}>
              Tidak ada menu yang cocok dengan kata kunci &quot;<span className="font-bold text-amber-500">{searchQuery}</span>&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs font-bold px-4 py-2 rounded-xl bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all touch-manipulation"
          >
            Tampilkan Semua Menu
          </button>
        </div>
      )}

      {/* CALIBRATED BOTTOM RUNWAY & BRAND STAMP */}
      <div className="pt-8 pb-20 flex flex-col items-center justify-center gap-1.5 opacity-60 shrink-0">
        <span className="text-[11px] font-medium tracking-tight" style={{ color: secondaryTextColor }}>
          {hfeCompanyProfile?.brandName || 'Artisan Cafe & Roastery'} • Menu Digital
        </span>
        <span className="text-[9px] font-mono tracking-wider uppercase opacity-75" style={{ color: secondaryTextColor }}>
          Powered by HFE Engine
        </span>
      </div>
    </>
  )
}
