import React from 'react'
import { Sparkles, TrendingUp, Package, DollarSign, Crown, ShieldCheck, ArrowRight, Store } from 'lucide-react'
import { HfeInsightWidget } from '../components/insights/HfeInsightWidget'
import { MenuItem, OrderTicket, TableStatus, ViewportModeType } from '../types/pos'

import { OwnerReportCenterSection } from '../components/insights/OwnerReportCenterSection'

export interface HfeInsightsViewProps {
  productCatalog: MenuItem[]
  orders: OrderTicket[]
  tablesGrid: TableStatus[]
  cashDrawerFloat: number
  viewportMode?: ViewportModeType
  onPinFavorite?: (menuItemId: string) => void
  onNavigateToPos?: () => void
}

export const HfeInsightsView: React.FC<HfeInsightsViewProps> = ({
  productCatalog,
  orders,
  tablesGrid,
  cashDrawerFloat,
  onPinFavorite,
  onNavigateToPos
}) => {
  return (
    <main className="flex-1 p-3 sm:p-6 max-w-6xl mx-auto w-full flex flex-col gap-6 animate-fadeIn pb-16">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                HFE Real-Time Operational & Financial Insights
              </h2>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                LIVE 99.8%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Analisis otomatis pola permintaan kasir, alert PO supplier, ranking gross margin & integritas kas float.
            </p>
          </div>
        </div>

        {onNavigateToPos && (
          <button
            type="button"
            onClick={onNavigateToPos}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
          >
            <Store className="w-4 h-4" /> Buka Kasir POS ➔
          </button>
        )}
      </div>

      {/* 2. 👑 OWNER REPORT & INTELLIGENCE CENTER */}
      <OwnerReportCenterSection />

      {/* 3. FULL ENGINE INSIGHTS DASHBOARD */}
      <HfeInsightWidget
        variant="full"
        productCatalog={productCatalog}
        cashDrawerFloat={cashDrawerFloat}
        orders={orders}
        tablesGrid={tablesGrid}
        onPinFavorite={onPinFavorite}
      />
    </main>
  )
}
