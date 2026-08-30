import React, { useRef } from 'react'
import { Tag, Copy, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export interface PromoItem {
  id: string
  code: string
  title: string
  desc: string
  minSpend?: number
}

interface LandingPromosSectionProps {
  promos: PromoItem[]
  copiedPromoCode: string | null
  onCopyPromo: (code: string) => void
  onViewAllPromos: () => void
  isMobile: boolean
}

export const LandingPromosSection: React.FC<LandingPromosSectionProps> = ({
  promos,
  copiedPromoCode,
  onCopyPromo,
  onViewAllPromos,
  isMobile
}) => {
  const { t, formatPrice } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!promos || promos.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <section id="promo-section" className={`py-4 sm:py-6 max-w-6xl mx-auto w-full flex flex-col gap-3.5 ${
      isMobile ? 'px-4' : 'px-4 sm:px-8'
    }`}>
      <div className="flex items-center justify-between">
        {/* CLICKABLE TITLE TO OPEN DEDICATED VIEW */}
        <button
          type="button"
          onClick={onViewAllPromos}
          className="group text-left cursor-pointer transition-transform active:scale-98"
        >
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-amber-500 transition-colors">
            <Tag className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t.landing.promosTitle}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:inline-block" />
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
            {t.landing.promoSubtitle || 'Salin & gunakan saat berkunjung'}
          </p>
        </button>

        {/* RIGHT CONTROLS: [ LIHAT SEMUA ➔ ] THEN [ < ] [ > ] AT FAR RIGHT */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onViewAllPromos}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {promos.length > 3 && (
            <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer active:scale-95"
                title="Geser Kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer active:scale-95"
                title="Geser Kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* HORIZONTAL PROMO VOUCHER CAROUSEL */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 pb-1 scroll-smooth"
      >
        {promos.map((promo) => {
          const isCopied = copiedPromoCode === promo.code
          return (
            <div
              key={promo.id}
              className="min-w-[260px] sm:min-w-[300px] max-w-[320px] snap-start shrink-0 bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-xs dark:shadow-md hover:border-amber-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    {promo.code}
                  </span>
                  <Tag className="w-3.5 h-3.5 text-amber-500/60" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">{promo.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{promo.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                  {promo.minSpend ? `Min. ${formatPrice(promo.minSpend)}` : 'Semua Pesanan'}
                </span>
                <button
                  type="button"
                  onClick={() => onCopyPromo(promo.code)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isCopied ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin Kupon'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
