import React, { useEffect } from 'react'
import { X, Coffee, ShoppingBag, ChevronRight, Check } from 'lucide-react'
import { MenuItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import { getBadgeMeta } from '../shared/ProductCard'

export interface ProductDetailModalProps {
  show: boolean
  product: MenuItem | null
  onClose: () => void
  onOrderNow: (product: MenuItem) => void
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  show,
  product,
  onClose,
  onOrderNow
}) => {
  const { formatPrice } = useTranslation()
  const badgeMeta = product ? getBadgeMeta(product.badge) : null

  // Keyboard shortcut: close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, onClose])

  if (!show || !product) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* MOBILE DRAG HANDLE */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* LEFT / TOP: PHOTO MEDIA */}
            <div className="sm:col-span-5 flex flex-col gap-2.5">
              <div className="aspect-square sm:aspect-[4/5] rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 overflow-hidden relative shadow-inner">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-amber-500/50">
                    <Coffee className="w-12 h-12" />
                    <span className="text-[10px] font-bold text-slate-400">Foto Sajian Segar</span>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30 uppercase tracking-wider shadow-xs">
                  {product.category}
                </span>
              </div>
            </div>

            {/* RIGHT / MAIN: DETAILS & DESCRIPTION */}
            <div className="sm:col-span-7 flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {badgeMeta && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border shadow-xs flex items-center gap-1 ${badgeMeta.className}`}>
                      <span>{badgeMeta.label}</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
                <h3
                  id="product-detail-title"
                  className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight"
                >
                  {product.name}
                </h3>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-mono font-black text-lg sm:text-xl text-amber-600 dark:text-amber-400">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    (Sudah termasuk PB1)
                  </span>
                </div>
              </div>

              {/* CURATED BADGE STORY CARD */}
              {product.badgeStory && (
                <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${badgeMeta?.className || 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'}`}>
                  <span className="text-base shrink-0">{badgeMeta?.glyph || '✨'}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block font-mono">
                      {badgeMeta?.label || 'Catatan Kurasi Roaster'}
                    </span>
                    <p className="text-xs mt-0.5 leading-relaxed font-medium">
                      {product.badgeStory}
                    </p>
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.description ||
                    'Diracik menggunakan bahan berkualitas tinggi pilihan roaster kami untuk menghadirkan cita rasa seimbang, aroma memikat, dan kesegaran terbaik.'}
                </p>

                {/* TASTING NOTES */}
                {product.tastingNotes && product.tastingNotes.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                      Profil Rasa (Tasting Notes):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <span>🌸</span>
                          <span>{note}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ORIGIN & HARVEST */}
                {product.originInfo && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-500 dark:text-slate-400 font-mono text-[10px]">ASAL BAHAN:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{product.originInfo}</span>
                  </div>
                )}

                {/* BOM INGREDIENTS */}
                {product.bomIngredients && product.bomIngredients.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 font-mono">
                      Komposisi Utama:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.bomIngredients.map((bom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {bom.name} {bom.amount ? `(${bom.amount})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DIETARY & SAFETY BADGES */}
              {product.dietaryTags && product.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {product.dietaryTags.includes('vegan') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px]">
                      🌱 100% Vegan
                    </span>
                  )}
                  {product.dietaryTags.includes('gluten_free') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px]">
                      🌾 Bebas Gluten
                    </span>
                  )}
                  {product.dietaryTags.includes('dairy_free') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 text-[10px]">
                      🥛 Bebas Susu Sapi
                    </span>
                  )}
                  {product.dietaryTags.includes('halal') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px]">
                      <Check className="w-3 h-3 text-emerald-500" /> Halal Certified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION DOCK (STICKY & THUMB FRIENDLY) */}
        <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onOrderNow(product)
            }}
            className="flex-1 sm:flex-none sm:min-w-[220px] px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>Pesan Menu Ini</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </div>
  )
}
