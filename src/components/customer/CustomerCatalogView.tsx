import React, { useMemo } from 'react'
import { Plus, Minus, RotateCcw, Search, X, Sparkles } from 'lucide-react'
import { MenuItem, CafeThemeConfig, HfeCompanyProfile, CartItem, OrderTicket } from '../../types/pos'
import { getCategoryIcon } from './CustomerHeader'

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
  handleUpdateQty?: (index: number, newQty: number) => void
  onOpenModifierSheet?: (item: MenuItem) => void
  setQrStepView: (step: 'catalog' | 'checkout') => void
  categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

export const CustomerCatalogView: React.FC<CustomerCatalogViewProps> = ({
  productCatalog,
  activeTheme,
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
          <div
            key={item.id}
            className={`theme-customer-card p-3.5 flex gap-3.5 transition-all shadow-sm hover:shadow-md rounded-2xl border ${
              cartQty > 0 ? 'ring-1 ring-emerald-500/40' : ''
            }`}
            style={{ borderColor: cardBorderColor, backgroundColor: activeTheme.cardBgHex }}
          >
            {/* PRODUCT IMAGE WITH FLOATING CART COUNT BADGE */}
            <div className="relative shrink-0">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-20 h-20 rounded-xl object-cover border shrink-0 shadow-inner"
                style={{ borderColor: cardBorderColor }}
              />
              {cartQty > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[10px] font-mono font-black px-2 py-0.5 rounded-full shadow-lg border animate-scaleIn flex items-center gap-0.5"
                  style={{
                    backgroundColor: '#10b981',
                    color: '#020617',
                    borderColor: '#6ee7b7'
                  }}
                  title={`${cartQty} porsi sudah ada di keranjang`}
                >
                  {cartQty}x
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <h4
                    className="font-bold text-sm truncate tracking-tight"
                    style={{ color: textColor }}
                  >
                    {item.name}
                  </h4>
                  {priceVisibilityMode === 'show_prices' ? (
                    <span
                      className="text-xs font-bold font-mono whitespace-nowrap shrink-0"
                      style={{ color: activeTheme.primaryAccentHex }}
                    >
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  ) : (
                    <span
                      className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border whitespace-nowrap shrink-0"
                      style={{ color: secondaryTextColor, borderColor: cardBorderColor }}
                    >
                      🏷️ Kontak Barista
                    </span>
                  )}
                </div>
                <p
                  className="text-[11px] line-clamp-1 mt-0.5 leading-relaxed"
                  style={{ color: secondaryTextColor }}
                >
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                {customerAppDisplayMode === 'full_ordering' ? (
                  <div className="flex items-center gap-2">
                    {hasPreviousOrders && (
                      <button
                        type="button"
                        onClick={() => handleReorderSameItem(item)}
                        className="hover:opacity-80 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border transition-all touch-manipulation"
                        style={{ color: textColor, borderColor: cardBorderColor }}
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" /> Re-Order
                      </button>
                    )}
                    {cartQty > 0 ? (
                      <div
                        className="flex items-center rounded-xl p-0.5 shadow-sm border"
                        style={{
                          backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                          borderColor: cardBorderColor
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (handleUpdateQty && cartItemIndex >= 0) {
                              handleUpdateQty(cartItemIndex, cartQty - 1)
                            }
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black active:scale-95 transition-all shadow-sm"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#1e293b',
                            color: textColor
                          }}
                          title="Kurangi 1 porsi"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className="px-2 font-mono font-black text-xs min-w-[24px] text-center"
                          style={{ color: '#10b981' }}
                        >
                          {cartQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (shouldOpenItemModifierModal(item) && onOpenModifierSheet) {
                              onOpenModifierSheet(item)
                            } else {
                              handleAddToCart(item)
                            }
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black active:scale-95 transition-all shadow text-slate-950"
                          style={{
                            backgroundColor: '#10b981'
                          }}
                          title="Tambah 1 porsi lagi"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (shouldOpenItemModifierModal(item) && onOpenModifierSheet) {
                            onOpenModifierSheet(item)
                          } else {
                            handleAddToCart(item)
                          }
                        }}
                        className="theme-customer-btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 touch-manipulation active:scale-[0.98]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 font-bold whitespace-nowrap shrink-0">
                    📖 Buku Menu (View Only)
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {/* 1. INSTANT SEARCH BAR FOR LARGE MENUS */}
      <div className="pt-1 pb-1">
        <div
          className="relative flex items-center rounded-2xl border px-3.5 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-amber-500/50"
          style={{
            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
            borderColor: cardBorderColor
          }}
        >
          <Search className="w-4 h-4 opacity-50 shrink-0 mr-2.5" style={{ color: textColor }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, pastry, makanan, minuman..."
            className="w-full bg-transparent text-xs font-medium outline-none placeholder:opacity-50"
            style={{ color: textColor }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full hover:opacity-75 transition-all shrink-0 ml-1"
              style={{ color: secondaryTextColor }}
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
                <span className="text-[11px] font-mono font-medium opacity-75" style={{ color: secondaryTextColor }}>
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

      {/* BOTTOM SPACING BUFFER FOR ZERO-CLIPPING & RUNWAY (256px) */}
      <div className="h-64 shrink-0" />
    </>
  )
}
