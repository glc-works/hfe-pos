import React, { useMemo } from 'react'
import { Search, X, Sparkles } from 'lucide-react'
import { MenuItem, CafeThemeConfig, HfeCompanyProfile, CartItem, OrderTicket } from '../../types/pos'
import { getCategoryIcon } from './CustomerHeader'
import { ProductCard } from '../shared/ProductCard'
import { ProductDetailModal } from '../landing/ProductDetailModal'

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
  const [selectedBadge, setSelectedBadge] = React.useState<string>('all')
  const [selectedProductForDetail, setSelectedProductForDetail] = React.useState<MenuItem | null>(null)
  const hasPreviousOrders = previousOrders && previousOrders.length > 0
  const isLight = activeTheme.mode === 'light'
  const textColor = activeTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = activeTheme.secondaryTextColorHex || (isLight ? '#475569' : '#cbd5e1')
  const cardBorderColor = isLight ? '#e2e8f0' : '#334155'

  // Badge counts
  const seasonalCount = productCatalog.filter(p => p.badge === 'seasonal').length
  const chefCount = productCatalog.filter(p => p.badge === 'chef_recommendation').length
  const bestSellerCount = productCatalog.filter(p => p.badge === 'best_seller').length
  const newCount = productCatalog.filter(p => p.badge === 'new_arrival').length
  const sigCount = productCatalog.filter(p => p.badge === 'signature').length

  // Instant reactive filter
  const filteredCatalog = useMemo(() => {
    let list = productCatalog

    // 1. Badge Filter
    if (selectedBadge !== 'all') {
      list = list.filter(item => item.badge === selectedBadge)
    }

    // 2. Search Query (Full spectrum: name, description, category, tasting notes, origin, and badge alias)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(q)
        const descMatch = Boolean(item.description && item.description.toLowerCase().includes(q))
        const catMatch = item.category.toLowerCase().includes(q)
        const originMatch = Boolean(item.originInfo && item.originInfo.toLowerCase().includes(q))
        const notesMatch = Boolean(item.tastingNotes && item.tastingNotes.some(n => n.toLowerCase().includes(q)))
        const badgeMatch = Boolean(item.badge && (
          item.badge.toLowerCase().includes(q) ||
          (item.badge === 'seasonal' && (q.includes('musim') || q.includes('season'))) ||
          (item.badge === 'chef_recommendation' && (q.includes('chef') || q.includes('rekomendasi') || q.includes('pilihan'))) ||
          (item.badge === 'best_seller' && (q.includes('favorit') || q.includes('laris') || q.includes('best') || q.includes('top'))) ||
          (item.badge === 'new_arrival' && (q.includes('baru') || q.includes('new'))) ||
          (item.badge === 'signature' && (q.includes('signature') || q.includes('khas')))
        ))
        return nameMatch || descMatch || catMatch || originMatch || notesMatch || badgeMatch
      })
    }

    return list
  }, [productCatalog, selectedBadge, searchQuery])

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
    if (item.modifierGroups && item.modifierGroups.length > 0) return true
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
            onOpenDetail={(prod) => setSelectedProductForDetail(prod)}
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
          className="relative flex items-center rounded-xl border px-3.5 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/50"
          style={{
            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.06)',
            borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
            color: textColor
          }}
        >
          <Search className="w-4 h-4 shrink-0 mr-2.5" style={{ color: secondaryTextColor }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, pastry, makanan, minuman..."
            className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none"
            style={{ color: textColor }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full hover:opacity-75 transition-all shrink-0 ml-1 cursor-pointer"
              style={{ color: secondaryTextColor }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* QUICK FILTER CHIP STRIP */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedBadge('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedBadge === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500/40'
            }`}
          >
            ✨ Semua ({productCatalog.length})
          </button>
          {seasonalCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedBadge(selectedBadge === 'seasonal' ? 'all' : 'seasonal')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBadge === 'seasonal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              🍂 Musiman ({seasonalCount})
            </button>
          )}
          {chefCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedBadge(selectedBadge === 'chef_recommendation' ? 'all' : 'chef_recommendation')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBadge === 'chef_recommendation'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/20'
              }`}
            >
              👨‍🍳 Pilihan Chef ({chefCount})
            </button>
          )}
          {bestSellerCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedBadge(selectedBadge === 'best_seller' ? 'all' : 'best_seller')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBadge === 'best_seller'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              🔥 Terlaris ({bestSellerCount})
            </button>
          )}
          {newCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedBadge(selectedBadge === 'new_arrival' ? 'all' : 'new_arrival')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBadge === 'new_arrival'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 hover:bg-sky-500/20'
              }`}
            >
              ✨ Menu Baru ({newCount})
            </button>
          )}
          {sigCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedBadge(selectedBadge === 'signature' ? 'all' : 'signature')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBadge === 'signature'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              👑 Signature ({sigCount})
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

      {/* PRODUCT QUICK-PEEK DETAIL & STORY MODAL */}
      <ProductDetailModal
        show={Boolean(selectedProductForDetail)}
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onOrderNow={(prod) => {
          setSelectedProductForDetail(null)
          if (shouldOpenItemModifierModal(prod) && onOpenModifierSheet) {
            onOpenModifierSheet(prod)
          } else {
            handleAddToCart(prod)
          }
        }}
      />
    </>
  )
}
