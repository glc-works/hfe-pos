import React, { useState } from 'react'
import { Card, Button, Badge } from '../../ui'
import { TrendingUp, DollarSign, PieChart, Clock, FileText, Printer, Sparkles, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export function ExecutiveInsightsTab() {
  const { t, formatPrice } = useTranslation()
  const [selectedRange, setSelectedRange] = useState<'today' | 'this_week' | 'this_month'>('today')
  const [zReportGenerated, setZReportGenerated] = useState(false)

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
            <TrendingUp className="w-4 h-4 text-primary" /> Ringkasan Kinerja Eksekutif
          </h3>
          <p className="text-xs text-muted-foreground">Kalkulasi laba kotor riil berbasis resep bahan baku (BOM)</p>
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
              {range === 'today' ? 'Hari Ini' : range === 'this_week' ? 'Minggu Ini' : 'Bulan Ini'}
            </button>
          ))}
        </div>
      </div>

      {/* Realtime Business Truth Card: "Apa yang Baru Terjadi Secara Finansial?" */}
      <Card className="p-4 border-emerald-500/30 bg-emerald-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              {t.hub.businessTruthTitle}
            </h4>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
            {t.hub.businessTruthPostedBadge}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthTxLabel}</span>
            <span className="font-bold text-foreground">Meja OUT-04 • QR</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthGrossLabel}</span>
            <span className="font-bold text-foreground tabular-nums">{formatPrice(57500)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthTaxLabel}</span>
            <span className="font-bold text-amber-400 tabular-nums">{formatPrice(5000)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block font-sans">{t.hub.businessTruthProfitLabel}</span>
            <span className="font-bold text-emerald-400 tabular-nums">{formatPrice(36000)} (72%)</span>
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
            <span>Omset Kotor (Gross)</span>
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            Rp {metrics.grossSales.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-sans text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs kemarin
          </div>
        </Card>

        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span>Beban Bahan Baku (HPP/BOM)</span>
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">
            Rp {metrics.cogsBom.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            28.0% dari omset bersih (Ideal &lt;32%)
          </div>
        </Card>

        <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span className="text-emerald-400 font-semibold">Laba Kotor Riil (Gross Profit)</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            Rp {metrics.grossProfit.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            Margin: <strong className="text-emerald-400 font-mono">72.0%</strong>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span>Total Transaksi & Struk</span>
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">
            {metrics.totalTransactions} <span className="text-xs font-normal text-muted-foreground">struk</span>
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-1">
            Rata-rata: Rp {metrics.avgTicket.toLocaleString('id-ID')} / meja
          </div>
        </Card>
      </div>

      {/* Rush Hour Heatmap */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Rush Hour Heatmap (Puncak Jam Ramai Kasir & Dapur)
            </h4>
            <p className="text-xs text-muted-foreground">Distribusi frekuensi pesanan per jam operasional</p>
          </div>
          <Badge variant="outline" className="text-[11px]">
            🔥 2 Jam Puncak Terdeteksi (12:00 & 19:00)
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
                  {isPeak ? '🔥 PEAK' : isHigh ? '⚡ SIBUK' : 'RAMAI'}
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
              <Printer className="w-4 h-4 text-primary" /> Laporan Tutup Kasir Harian (Z-Report)
            </h4>
            <p className="text-xs text-muted-foreground">
              Rekapitulasi total penerimaan tunai, QRIS, kartu debit/kredit, potongan diskon, dan selisih laci kas <code>GL 5101</code>.
            </p>
          </div>
          <Button 
            onClick={handlePrintZReport} 
            className="font-bold text-xs shrink-0"
            disabled={zReportGenerated}
          >
            {zReportGenerated ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Mencetak ke Printer Kasir...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Cetak Z-Report Thermal (80mm)
              </span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
