import React from 'react'
import { History, X, Store, Coffee, Calendar, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react'

export interface ToGrowTransactionRecord {
  id: string
  merchantBrand: string
  merchantBranch: string
  merchantLogo: string
  totalIdr: number
  itemsSummary: string
  timestamp: string
  earnedPoints: number
}

export interface ToGrowHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  accountId?: string
}

const MOCK_TOGROW_HISTORY: ToGrowTransactionRecord[] = [
  {
    id: 'TG-TX-9901',
    merchantBrand: 'Artisan Cafe HQ',
    merchantBranch: 'Sudirman, Jakarta',
    merchantLogo: '☕',
    totalIdr: 78000,
    itemsSummary: '1x Oat Milk Latte, 1x Butter Croissant',
    timestamp: '2026-08-15 14:20',
    earnedPoints: 117,
  },
  {
    id: 'TG-TX-8820',
    merchantBrand: 'Kopitiam Senopati',
    merchantBranch: 'Senopati, Jakarta',
    merchantLogo: '🥐',
    totalIdr: 45000,
    itemsSummary: '1x Iced Aren Latte, 1x Kaya Toast',
    timestamp: '2026-08-12 09:15',
    earnedPoints: 67,
  },
  {
    id: 'TG-TX-7712',
    merchantBrand: 'Roastery Dago',
    merchantBranch: 'Dago, Bandung',
    merchantLogo: '🫘',
    totalIdr: 120000,
    itemsSummary: '2x Filter Beans Single Origin 250g',
    timestamp: '2026-08-04 16:45',
    earnedPoints: 180,
  },
  {
    id: 'TG-TX-6540',
    merchantBrand: 'Artisan Cafe HQ',
    merchantBranch: 'Sudirman, Jakarta',
    merchantLogo: '☕',
    totalIdr: 62000,
    itemsSummary: '2x Manual Brew V60 Flores',
    timestamp: '2026-07-28 11:30',
    earnedPoints: 93,
  },
]

export const ToGrowHistoryDrawer: React.FC<ToGrowHistoryDrawerProps> = ({
  isOpen,
  onClose,
  accountId = 'TOGROW-ACC-882194',
}) => {
  if (!isOpen) return null

  const totalSpentAllMerchants = MOCK_TOGROW_HISTORY.reduce((sum, t) => sum + t.totalIdr, 0)
  const totalVisits = MOCK_TOGROW_HISTORY.length

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white">Histori toGrow Ecosystem</h3>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  Universal ID
                </span>
              </div>
              <p className="text-xs text-slate-400">Riwayat transaksi di seluruh merchant jaringan toGrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Customer Taste Pattern Insights Card */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-amber-950/40 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-200">Insight Konsumsi toGrow</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px] block">Total Kunjungan</span>
              <strong className="text-white text-sm">{totalVisits} Transaksi</strong>
              <span className="text-[10px] text-cyan-400 block mt-0.5">di 3 Cafe toGrow</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px] block">Minuman Favorit</span>
              <strong className="text-amber-300 text-sm">Oat Milk Latte</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Dipesan 7x bulan ini</span>
            </div>
          </div>
        </div>

        {/* Transaction History List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Riwayat Transaksi</span>
            <span>Total: Rp {totalSpentAllMerchants.toLocaleString('id-ID')}</span>
          </div>

          {MOCK_TOGROW_HISTORY.map(tx => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                    {tx.merchantLogo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tx.merchantBrand}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Store className="h-3 w-3 text-slate-500" />
                      {tx.merchantBranch}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    Rp {tx.totalIdr.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    +{tx.earnedPoints} Poin
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <ShoppingBag className="h-3 w-3 text-slate-500" />
                  {tx.itemsSummary}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <Calendar className="h-3 w-3" />
                  {tx.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
