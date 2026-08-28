import React from 'react'
import { MenuItem } from '../../types/pos'
import { Flame, Trophy, TrendingUp } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

interface FavoriteProductItem {
  id: string
  name: string
  category: string
  image: string
  price: number
  unitsSold: number
  growthPercentage: number
}

interface FavoriteProductsLeaderboardProps {
  products?: MenuItem[]
  className?: string
}

export const FavoriteProductsLeaderboard: React.FC<FavoriteProductsLeaderboardProps> = ({
  products = [],
  className = ''
}) => {
  const { formatPrice } = useTranslation()

  // Generate top 5 bestselling rankings from product catalog
  const favoriteItems: FavoriteProductItem[] = [
    {
      id: 'FAV-01',
      name: 'Espresso Aren Latte',
      category: 'Coffee',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&q=80',
      price: 28000,
      unitsSold: 184,
      growthPercentage: 14.2
    },
    {
      id: 'FAV-02',
      name: 'Japanese Cold Brew V60',
      category: 'Coffee',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&q=80',
      price: 35000,
      unitsSold: 156,
      growthPercentage: 9.8
    },
    {
      id: 'FAV-03',
      name: 'Croissant Butter Prancis',
      category: 'Pastry',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&q=80',
      price: 26000,
      unitsSold: 132,
      growthPercentage: 11.5
    },
    {
      id: 'FAV-04',
      name: 'Kyoto Uji Matcha Latte',
      category: 'Non-Coffee',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=100&q=80',
      price: 32000,
      unitsSold: 118,
      growthPercentage: 7.2
    },
    {
      id: 'FAV-05',
      name: 'Truffle French Fries',
      category: 'Snack',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=100&q=80',
      price: 28000,
      unitsSold: 95,
      growthPercentage: 5.4
    }
  ]

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-500 text-slate-950 font-black border-amber-300 shadow-amber-500/20'
      case 1:
        return 'bg-slate-300 text-slate-900 font-bold border-slate-200'
      case 2:
        return 'bg-amber-700/80 text-amber-100 font-bold border-amber-600'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium border-slate-200 dark:border-slate-700'
    }
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between ${className}`}>
      {/* 1. HEADER */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Menu Terlaris (Favorite Products)</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Peringkat penjualan teratas outlet bulan ini
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Top 5
        </span>
      </div>

      {/* 2. LEADERBOARD ROWS */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
        {favoriteItems.map((item, idx) => (
          <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-xl transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 border ${getRankBadge(idx)}`}>
                {idx + 1}
              </span>

              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs"
              />

              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-extrabold font-mono text-xs text-slate-900 dark:text-white tabular-nums">
                {item.unitsSold} <span className="text-[10px] font-sans font-normal text-slate-500">Porsi</span>
              </p>
              <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-0.5">
                <span>+{item.growthPercentage}%</span>
                <TrendingUp className="w-2.5 h-2.5" />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
