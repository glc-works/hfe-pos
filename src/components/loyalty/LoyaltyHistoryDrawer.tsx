import React from 'react'
import { History, X, Store, Coffee, Calendar, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react'

export interface LoyaltyTransactionRecord {
  id: string
  merchantBrand: string
  merchantBranch: string
  merchantLogo: string
  totalIdr: number
  itemsSummary: string
  timestamp: string
  earnedPoints: number
}

export type ToGrowTransactionRecord = LoyaltyTransactionRecord

export interface LoyaltyHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  accountId?: string
  networkName?: string
}

export type ToGrowHistoryDrawerProps = LoyaltyHistoryDrawerProps

const MOCK_LOYALTY_HISTORY: LoyaltyTransactionRecord[] = [
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

export const LoyaltyHistoryDrawer: React.FC<LoyaltyHistoryDrawerProps> = ({
  isOpen,
  onClose,
  accountId = 'ACC-882194',
  networkName = 'Hfe Ecosystem',
}) => {
  if (!isOpen) return null

  const totalSpentAllMerchants = MOCK_LOYALTY_HISTORY.reduce((sum, t) => sum + t.totalIdr, 0)
  const totalVisits = MOCK_LOYALTY_HISTORY.length
  const totalPoints = MOCK_LOYALTY_HISTORY.reduce((sum, t) => sum + t.earnedPoints, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Histori {networkName}</h3>
              <p className="text-xs text-slate-400">Riwayat transaksi di seluruh merchant jaringan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Lifetime Stats */}
        <div className="p-4 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/30 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-200">Insight Konsumsi Ekosistem</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ID: {accountId}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Total Kunjungan</span>
              <span className="text-base font-bold text-white font-mono">{totalVisits}x</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">di 3 Cafe</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Total Belanja</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                Rp {(totalSpentAllMerchants / 1000).toLocaleString('id-ID')}k
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Semua Merchant</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Poin Global</span>
              <span className="text-base font-bold text-amber-400 font-mono">+{totalPoints}</span>
              <span className="text-[10px] text-amber-500/80 block mt-0.5">Loyalty Pts</span>
            </div>
          </div>
        </div>

        {/* Transaction Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Aktivitas Terkini</span>
            <span className="text-[10px] text-slate-500">Live Synchronized</span>
          </div>

          {MOCK_LOYALTY_HISTORY.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">
                    {tx.merchantLogo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tx.merchantBrand}</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Store className="w-3 h-3 text-slate-500" />
                      {tx.merchantBranch}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">
                    Rp {tx.totalIdr.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono block">
                    +{tx.earnedPoints} pts
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 truncate max-w-[220px]">
                  <ShoppingBag className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{tx.itemsSummary}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-center shrink-0">
          <p className="text-[11px] text-slate-400">
            Identitas & Stamp Member Terhubung Melalui <span className="font-bold text-cyan-400">{networkName}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export const ToGrowHistoryDrawer = LoyaltyHistoryDrawer
