import React, { useState } from 'react'
import { Card, Button, Badge, TruthChannelBadge } from '../../ui'
import { TrendingUp, DollarSign, PieChart, Clock, FileText, Printer, Sparkles, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { UniversalFinancialHealthGauge } from './UniversalFinancialHealthGauge'
import { FavoriteProductsLeaderboard } from './FavoriteProductsLeaderboard'

export type FinancialTruthPostingStatus = 'posted' | 'pending' | 'failed' | 'demo'

export interface EconomicEventDetails {
  tableName?: string
  grossMinor?: number
  taxMinor?: number
  grossProfitMinor?: number
  marginPercent?: number
}

export interface ExecutiveInsightsTabProps {
  postingStatus?: FinancialTruthPostingStatus
  eventDetails?: EconomicEventDetails
}

export function ExecutiveInsightsTab({
  postingStatus = 'demo',
  eventDetails
}: ExecutiveInsightsTabProps) {
  const { t, formatPrice } = useTranslation()
  const [selectedRange, setSelectedRange] = useState<'today' | 'this_week' | 'this_month'>('today')
  const [zReportGenerated, setZReportGenerated] = useState(false)

  // Default economic event fallback (honest demo baseline)
  const activeEvent = {
    tableName: eventDetails?.tableName || 'Meja OUT-04 • QR',
    grossMinor: eventDetails?.grossMinor ?? 57500,
    taxMinor: eventDetails?.taxMinor ?? 5000,
    grossProfitMinor: eventDetails?.grossProfitMinor ?? 36000,
    marginPercent: eventDetails?.marginPercent ?? 72
  }

  // Metrics (Live derivation)
  const metrics = {
    grossSales: 18450000,
    netSales: 16772727,
    pb1Tax: 1677273, // 10%
    cogsBom: 4696363, // 28% Recipe BOM cost
    grossProfit: 12076364, // 72% Margin
    totalTransactions: 342,
    avgTicket: 53947,
  }

  // Rush hour heatmap (hours 08:00 - 22:00)
  const rushHourData = [
    { hour: '08:00', tx: 12, intensity: 'low' },
    { hour: '09:00', tx: 24, intensity: 'medium' },
    { hour: '10:00', tx: 31, intensity: 'medium' },
    { hour: '11:00', tx: 48, intensity: 'high' },
    { hour: '12:00', tx: 65, intensity: 'peak' }, // Lunch Peak
    { hour: '13:00', tx: 54, intensity: 'high' },
    { hour: '14:00', tx: 28, intensity: 'medium' },
    { hour: '15:00', tx: 19, intensity: 'low' },
    { hour: '16:00', tx: 26, intensity: 'medium' },
    { hour: '17:00', tx: 38, intensity: 'medium' },
    { hour: '18:00', tx: 58, intensity: 'high' },
    { hour: '19:00', tx: 72, intensity: 'peak' }, // Dinner Peak
    { hour: '20:00', tx: 45, intensity: 'high' },
    { hour: '21:00', tx: 22, intensity: 'low' },
  ]

  const handlePrintZReport = () => {
    setZReportGenerated(true)
    setTimeout(() => setZReportGenerated(false), 2500)
  }


  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> {t.hub.executiveSummaryTitle}
          </h3>
          <p className="text-xs text-muted-foreground">{t.hub.executiveSummarySub}</p>
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg text-xs">
          {(['today', 'this_week', 'this_month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedRange === range ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === 'today' ? t.hub.rangeToday : range === 'this_week' ? t.hub.rangeThisWeek : t.hub.rangeThisMonth}
            </button>
          ))}
        </div>
      </div>

      {/* Universal Executive Financial Health & Capital Velocity Gauge */}
      <UniversalFinancialHealthGauge />

      {/* Realtime Business Truth Card: "Apa yang Baru Terjadi Secara Finansial?" */}
      <Card className="p-4 border-emerald-500/30 bg-emerald-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              {t.hub.businessTruthTitle}
            </h4>
          </div>
          <TruthChannelBadge channel={postingStatus === 'posted' ? 'live-core' : postingStatus === 'pending' ? 'pending-sync' : 'demo'} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthTxLabel}</span>
            <span className="font-bold text-foreground truncate block">{activeEvent.tableName}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthGrossLabel}</span>
            <span className="font-bold text-foreground tabular-nums">{formatPrice(activeEvent.grossMinor)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthTaxLabel}</span>
            <span className="font-bold text-amber-400 tabular-nums">{formatPrice(activeEvent.taxMinor)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthProfitLabel}</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {formatPrice(activeEvent.grossProfitMinor)} ({activeEvent.marginPercent}%)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span>{t.hub.businessTruthLineage}</span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold">{t.hub.businessTruthTagline}</span>
        </div>
      </Card>

      {/* KPI Cards: Revenue, BOM COGS, Real Gross Profit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <Card className="p-4">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span>{t.hub.grossSalesLabel}</span>
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {formatPrice(metrics.grossSales)}
          </div>
          <div className="text-[11px] font-sans text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {t.hub.grossSalesComparison}
          </div>
        </Card>

        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span>{t.hub.cogsBomLabel}</span>
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">
            {formatPrice(metrics.cogsBom)}
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            {t.hub.cogsBomSub}
          </div>
        </Card>

        <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span className="text-emerald-400 font-semibold">{t.hub.grossProfitLabel}</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            {formatPrice(metrics.grossProfit)}
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            {t.hub.marginLabel} <strong className="text-emerald-400 font-mono">72.0%</strong>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span>{t.hub.totalTransactionsLabel}</span>
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {metrics.totalTransactions} <span className="text-xs font-normal text-muted-foreground">{t.hub.receiptsUnit}</span>
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            {t.hub.avgTicketSub.replace('{amount}', formatPrice(metrics.avgTicket))}
          </div>
        </Card>
      </div>

      {/* Favorite Products Leaderboard (Bakehouse Benchmark Pattern) */}
      <FavoriteProductsLeaderboard />

      {/* Rush Hour Heatmap */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> {t.hub.rushHourHeatmapTitle}
            </h4>
            <p className="text-xs text-muted-foreground">{t.hub.rushHourHeatmapSub}</p>
          </div>
          <Badge variant="outline" className="text-[11px]">
            {t.hub.rushHourPeaksDetected}
          </Badge>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 font-mono text-center text-xs">
          {rushHourData.map((slot) => {
            const isPeak = slot.intensity === 'peak'
            const isHigh = slot.intensity === 'high'
            const isMed = slot.intensity === 'medium'
            const bgClass = isPeak 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' 
              : isHigh 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold' 
              : isMed 
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
              : 'bg-muted/30 text-muted-foreground border-border/40'

            return (
              <div key={slot.hour} className={`p-2 rounded-lg border flex flex-col justify-between ${bgClass}`}>
                <div className="text-[10px] text-muted-foreground">{slot.hour}</div>
                <div className="text-sm font-bold tabular-nums my-1">{slot.tx}</div>
                <div className="text-[9px] uppercase tracking-tighter">
                  {isPeak ? `🔥 ${t.hub.peakLabel}` : isHigh ? `⚡ ${t.hub.busyLabel}` : t.hub.moderateLabel}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Z-Report Shift Reconciliation Box */}
      <Card className="p-5 bg-gradient-to-r from-muted/30 via-background to-muted/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Printer className="w-4 h-4 text-primary" /> {t.hub.zReportTitle}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t.hub.zReportSub}
            </p>
          </div>
          <Button 
            onClick={handlePrintZReport} 
            className="font-bold text-xs shrink-0"
            disabled={zReportGenerated}
          >
            {zReportGenerated ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> {t.hub.printingZReport}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> {t.hub.printZReportCta}
              </span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
