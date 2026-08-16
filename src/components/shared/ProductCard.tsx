import React from 'react'
import { Plus, Minus } from 'lucide-react'
import { MenuItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

export type ProductCardVariant = 'pos-list' | 'pos-grid' | 'pos-compact' | 'customer-card' | 'speed-key'

export interface ProductCardProps {
  product: MenuItem
  quantityInCart?: number
  variant?: ProductCardVariant
  showSku?: boolean
  onAddToCart?: (item: MenuItem) => void
  onUpdateQty?: (newQty: number) => void
  onOpenModifiers?: (item: MenuItem) => void
  isImageUrl?: (url?: string) => boolean
  cardBorderColor?: string
  cardBgHex?: string
  textColor?: string
  secondaryTextColor?: string
  primaryAccentHex?: string
  priceVisibilityMode?: 'show_prices' | 'hidden'
  customerAppDisplayMode?: 'full_ordering' | 'catalog_only'
  className?: string
  style?: React.CSSProperties
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart = 0,
  variant = 'pos-list',
  showSku,
  onAddToCart,
  onUpdateQty,
  onOpenModifiers,
  isImageUrl = (url) => typeof url === 'string' && (url.startsWith('http') || url.startsWith('/')),
  cardBorderColor,
  cardBgHex,
  textColor,
  secondaryTextColor,
  primaryAccentHex = '#10b981',
  priceVisibilityMode = 'show_prices',
  customerAppDisplayMode = 'full_ordering',
  className = '',
  style
}) => {
  const { t, formatPrice } = useTranslation()
  const cartQty = quantityInCart

  // Default SKU visibility: true for POS cashiers, false for Customers
  const shouldShowSku = showSku !== undefined ? showSku : variant.startsWith('pos-')

  const handleCardClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleMinusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUpdateQty) {
      onUpdateQty(Math.max(0, cartQty - 1))
    }
  }

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    } else if (onUpdateQty) {
      onUpdateQty(cartQty + 1)
    }
  }

  /* ========================================================================= */
  /* VARIANT 1: POS LIST (HIGH-DENSITY CASHIER ROWS)                          */
  /* ========================================================================= */
  if (variant === 'pos-list') {
    return (
      <div
        onClick={handleCardClick}
        className={`bg-slate-900 border ${
          cartQty > 0 ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-slate-800 hover:border-slate-600'
        } rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-800/60 shadow-sm group select-none ${className}`}
        style={style}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {isImageUrl(product.image) ? (
              <img src={product.image} alt={product.name} className="w-11 h-11 rounded-lg object-cover shrink-0 shadow-inner" />
            ) : (
              <div className="w-11 h-11 bg-slate-800 rounded-lg flex items-center justify-center text-xl shrink-0">
                {product.image || '☕'}
              </div>
            )}
            {cartQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-mono font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-md border border-emerald-300 animate-scaleIn z-10">
                {cartQty}x
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-slate-100 truncate group-hover:text-white">{product.name}</span>
              {shouldShowSku && (
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                  {product.hfeCategoryCode || product.id}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {product.category} • {product.description?.slice(0, 40) || 'Menu Item'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          {cartQty > 0 ? (
            <div
              className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-emerald-500/40 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleMinusClick}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-all active:scale-95"
                title="Kurangi"
              >
                <Minus className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <span className="font-mono font-extrabold text-xs text-white px-1.5 min-w-[18px] text-center">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={handlePlusClick}
                className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-all active:scale-95"
                title="Tambah"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePlusClick}
              className="bg-white hover:bg-slate-200 text-slate-950 p-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center active:scale-95"
              title={t.pos?.addToCart || 'Tambah'}
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" />
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ========================================================================= */
  /* VARIANT 2: POS GRID (VISUAL CARDS WITH IMAGES)                            */
  /* ========================================================================= */
  if (variant === 'pos-grid') {
    return (
      <div
        onClick={handleCardClick}
        className={`bg-slate-900 border ${
          cartQty > 0 ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-slate-800 hover:border-slate-500'
        } rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between shadow-md group select-none ${className}`}
        style={style}
      >
        <div className="relative">
          {isImageUrl(product.image) ? (
            <img src={product.image} alt={product.name} className="w-full h-28 sm:h-32 object-cover rounded-t-xl group-hover:opacity-90 transition-opacity" />
          ) : (
            <div className="w-full h-24 bg-slate-800/80 flex items-center justify-center text-3xl rounded-t-xl">
              {product.image || '☕'}
            </div>
          )}
          {cartQty > 0 && (
            <span className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-emerald-300 animate-scaleIn z-10">
              {cartQty}x
            </span>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-white">{product.name}</h4>
            {shouldShowSku && (
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800 shrink-0">
                {product.hfeCategoryCode || product.id}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 truncate">{product.category}</span>
          <div className="flex items-center justify-between mt-1 pt-0.5">
            <p className="text-xs font-mono font-bold text-emerald-400">{formatPrice(product.price)}</p>
            {cartQty > 0 ? (
              <div
                className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-emerald-500/40 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleMinusClick}
                  className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-all active:scale-95"
                  title="Kurangi"
                >
                  <Minus className="w-3 h-3 text-emerald-400" />
                </button>
                <span className="font-mono font-extrabold text-xs text-white px-1.5 min-w-[18px] text-center">
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={handlePlusClick}
                  className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-all active:scale-95"
                  title="Tambah"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePlusClick}
                className="bg-white hover:bg-slate-200 text-slate-950 p-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center active:scale-95"
                title={t.pos?.addToCart || 'Tambah'}
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ========================================================================= */
  /* VARIANT 3: POS COMPACT (HIGH-DENSITY TOUCH TILES)                        */
  /* ========================================================================= */
  if (variant === 'pos-compact') {
    return (
      <button
        type="button"
        onClick={handleCardClick}
        className={`relative bg-slate-900 border ${
          cartQty > 0 ? 'border-emerald-500/50 shadow-emerald-950/30' : 'border-slate-800 hover:border-slate-500'
        } rounded-xl p-2.5 flex flex-col items-center justify-between text-center transition-all hover:scale-[1.02] shadow-sm group min-h-[110px] select-none ${className}`}
        style={style}
      >
        {cartQty > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-slate-950 font-mono font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md border border-emerald-300 animate-scaleIn z-10">
            {cartQty}x
          </span>
        )}
        <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center text-xl overflow-hidden mt-1">
          {isImageUrl(product.image) ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            product.image || '☕'
          )}
        </div>
        <div className="flex flex-col items-center w-full px-1">
          <span className="text-[11px] font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-tight">
            {product.name}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold mt-1">{formatPrice(product.price)}</span>
        </div>
      </button>
    )
  }

  /* ========================================================================= */
  /* VARIANT 4: CUSTOMER QR CARD (LUXURY GUEST TOUCHPOINT - ZERO SKU LEAK)    */
  /* ========================================================================= */
  return (
    <div
      onClick={handleCardClick}
      className={`theme-customer-card p-3.5 flex gap-3.5 transition-all shadow-sm hover:shadow-md rounded-2xl border cursor-pointer ${
        cartQty > 0 ? 'ring-1 ring-emerald-500/40' : ''
      } ${className}`}
      style={{
        borderColor: cardBorderColor,
        backgroundColor: cardBgHex,
        ...style
      }}
    >
      <div className="relative shrink-0">
        <img
          src={product.image}
          alt={product.name}
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
            title={`${cartQty} porsi di keranjang`}
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
              {product.name}
            </h4>
            {priceVisibilityMode === 'show_prices' ? (
              <span
                className="text-xs font-bold font-mono whitespace-nowrap shrink-0"
                style={{ color: primaryAccentHex }}
              >
                Rp {product.price.toLocaleString('id-ID')}
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
          {/* Customer does not see technical SKU, only culinary description */}
          {shouldShowSku && (
            <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
              SKU: {product.hfeCategoryCode || product.id}
            </span>
          )}
          <p
            className="text-[11px] line-clamp-1 mt-0.5 leading-relaxed"
            style={{ color: secondaryTextColor }}
          >
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          {customerAppDisplayMode === 'full_ordering' ? (
            cartQty > 0 ? (
              <div
                className="flex items-center gap-1 p-0.5 rounded-lg border shadow-sm"
                style={{ borderColor: cardBorderColor, backgroundColor: cardBgHex }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleMinusClick}
                  className="p-1 rounded text-slate-300 hover:text-white transition-all active:scale-95"
                  title="Kurangi"
                >
                  <Minus className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                </button>
                <span
                  className="font-mono font-extrabold text-xs px-1.5 min-w-[18px] text-center"
                  style={{ color: textColor }}
                >
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={handlePlusClick}
                  className="p-1 rounded text-slate-300 hover:text-white transition-all active:scale-95"
                  title="Tambah"
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePlusClick}
                className="p-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center active:scale-95"
                style={{
                  backgroundColor: primaryAccentHex,
                  color: '#020617'
                }}
                title={t.pos?.addToCart || 'Tambah'}
              >
                <Plus className="w-4 h-4" />
              </button>
            )
          ) : (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded border"
              style={{ color: secondaryTextColor, borderColor: cardBorderColor }}
            >
              Katalog Only
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
