import React, { useState } from 'react'
import {
  TrendingUp,
  Package,
  DollarSign,
  Crown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Check,
  RefreshCw,
  ShoppingBag
} from 'lucide-react'
import { useHfeInsights, UseHfeInsightsProps } from '../../hooks/useHfeInsights'

export interface HfeInsightWidgetProps extends UseHfeInsightsProps {
  variant?: 'banner' | 'full' | 'compact'
  onPinFavorite?: (menuItemId: string) => void
}

export const HfeInsightWidget: React.FC<HfeInsightWidgetProps> = (props) => {
  const { variant = 'banner' } = props
  const insights = useHfeInsights(props)
  const [activeTab, setActiveTab] = useState<'all' | 'demand' | 'stock' | 'vip' | 'margin' | 'cash'>('all')
  const [poCreatedNotice, setPoCreatedNotice] = useState<string | null>(null)

  const handlePOAction = (skuId: string, skuName: string) => {
    insights.handleCreateAutoPO(skuId)
    setPoCreatedNotice(`✅ Auto-PO dibuat & dikirim ke Supplier untuk ${skuName}!`)
    setTimeout(() => setPoCreatedNotice(null), 4000)
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-3 shadow-lg flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/40">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                Hfe Real-Time Operational Insights Engine
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.2 rounded-full border border-emerald-500/30 font-mono">
                  LIVE 99.8%
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">Prediksi operasional & financial anomaly detector</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Float Kas: {insights.shiftCashIntegrity.integrityScorePct}%
            </span>
          </div>
        </div>

        {poCreatedNotice && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{poCreatedNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Demand Forecast */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-amber-400 font-mono">ESTIMASI RUSH HOUR</span>
              <h5 className="text-xs font-bold text-slate-200 truncate">{insights.demandForecast.peakWindow}</h5>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{insights.demandForecast.prepRecommendation}</p>
            </div>
          </div>

          {/* Low Stock PO Alert */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-rose-400 font-mono">LOW STOCK ALERT</span>
              {insights.lowStockAlerts.length > 0 ? (
                <>
                  <h5 className="text-xs font-bold text-slate-200 truncate">{insights.lowStockAlerts[0].name}</h5>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-rose-300 font-mono">Sisa: {insights.lowStockAlerts[0].currentStock} {insights.lowStockAlerts[0].unit}</span>
                    <button
                      type="button"
                      onClick={() => handlePOAction(insights.lowStockAlerts[0].id, insights.lowStockAlerts[0].name)}
                      className="px-2 py-0.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-[10px] rounded-md transition-all flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" /> 1-Ketuk Auto-PO
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-emerald-400 mt-0.5">Stok aman (Semua SKU mencukupi)</p>
              )}
            </div>
          </div>

          {/* VIP Guest / Margin Leader */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-purple-400 font-mono">VIP GUEST & MARGIN</span>
              {insights.vipGuestsAtTables.length > 0 ? (
                <>
                  <h5 className="text-xs font-bold text-slate-200 truncate">{insights.vipGuestsAtTables[0].customerName} ({insights.vipGuestsAtTables[0].tableName})</h5>
                  <p className="text-[11px] text-amber-300 truncate mt-0.5">
                    {insights.vipGuestsAtTables[0].allergenAlert ? `⚠️ ${insights.vipGuestsAtTables[0].allergenAlert}` : `Fav: ${insights.vipGuestsAtTables[0].favoriteDrink}`}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-slate-400 truncate mt-0.5">Top Margin: {insights.profitMarginLeaders[0]?.name || '-'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Hfe Real-Time Operational & Financial Insights Engine
            </h3>
            <p className="text-xs text-slate-400">Analisis otomatis permintaan, persediaan, margin menu, & integritas kasir</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Shift Cash Integrity: {insights.shiftCashIntegrity.integrityScorePct}%
          </span>
        </div>
      </div>

      {poCreatedNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> {poCreatedNotice}
          </span>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {(['all', 'demand', 'stock', 'vip', 'margin', 'cash'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === t ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            {t === 'all'
              ? 'Semua Wawasan'
              : t === 'demand'
              ? '📈 Demand Forecast'
              : t === 'stock'
              ? '📦 Low-Stock Auto-PO'
              : t === 'vip'
              ? '👑 VIP Personalization'
              : t === 'margin'
              ? '💰 Margin Leaders'
              : '💵 Shift Cash Integrity'}
          </button>
        ))}
      </div>

      {/* GRID INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Demand Forecast */}
        {(activeTab === 'all' || activeTab === 'demand') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-4 h-4" /> DEMAND RUSH HOUR FORECAST
              </span>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                Score {insights.demandForecast.confidenceScore}%
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Prediksi Peak Hours: {insights.demandForecast.peakWindow}</h4>
              <p className="text-xs text-slate-400 mt-1">Estimasi Volume: <strong className="text-emerald-400 font-mono">{insights.demandForecast.predictedOrders} pesanan</strong></p>
              <div className="mt-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                💡 <strong>Rekomendasi Prep:</strong> {insights.demandForecast.prepRecommendation}
              </div>
            </div>
          </div>
        )}

        {/* 2. Low-Stock Auto-PO */}
        {(activeTab === 'all' || activeTab === 'stock') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                <Package className="w-4 h-4" /> LOW-STOCK AUTO-PO SUPPLIER
              </span>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/30">
                {insights.lowStockAlerts.length} Item Menipis
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {insights.lowStockAlerts.length === 0 ? (
                <p className="text-xs text-emerald-400 py-4">Semua stok bahan baku berada di batas aman.</p>
              ) : (
                insights.lowStockAlerts.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-200 truncate">{item.name}</h5>
                      <p className="text-[11px] text-slate-400">
                        Sisa: <span className="text-rose-400 font-bold font-mono">{item.currentStock} {item.unit}</span> | Min: {item.reorderPoint}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePOAction(item.id, item.name)}
                      className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> 1-Ketuk PO
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. VIP Personalization */}
        {(activeTab === 'all' || activeTab === 'vip') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 font-mono">
                <Crown className="w-4 h-4" /> VIP GUEST PERSONALIZATION
              </span>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/30">
                {insights.vipGuestsAtTables.length} VIP Seated
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {insights.vipGuestsAtTables.map((vip, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" /> {vip.customerName} ({vip.tableName})
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                      {vip.loyaltyTier} ({vip.totalVisits}x Datang)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Fav: <span className="text-indigo-400 font-semibold">{vip.favoriteDrink}</span></p>
                  {vip.allergenAlert && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{vip.allergenAlert}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Profit Margin Leaders */}
        {(activeTab === 'all' || activeTab === 'margin') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <DollarSign className="w-4 h-4" /> PROFIT MARGIN LEADERS
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Top Gross Margin %
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {insights.profitMarginLeaders.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-200 truncate">{m.name}</h5>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Harga: Rp {m.price.toLocaleString('id-ID')} | Cost: Rp {m.estimatedCost.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 font-mono block">{m.marginPct}% Margin</span>
                    <span className="text-[10px] text-slate-400 font-mono">+Rp {m.marginAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
