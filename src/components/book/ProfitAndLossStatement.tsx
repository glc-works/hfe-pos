import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  PriceTag
} from '@/ui'

export interface PnLItem {
  id: string
  code: string
  name: string
  currentAmount: number
  priorAmount: number
  isNegative?: boolean
}

export interface ProfitAndLossStatementProps {
  data?: any
  companyName?: string
  currentPeriodLabel?: string
  priorPeriodLabel?: string
  onExportCsv?: () => void
}

const DEFAULT_REVENUE: PnLItem[] = [
  { id: '4110', code: '4110', name: 'Penjualan Dine-In & Takeaway F&B', currentAmount: 142500000, priorAmount: 128000000 },
  { id: '4120', code: '4120', name: 'Penjualan Online Delivery (Grab/GoFood)', currentAmount: 38400000, priorAmount: 34200000 },
  { id: '4130', code: '4130', name: 'Penjualan Retail Biji Kopi & Merch', currentAmount: 15600000, priorAmount: 12100000 },
  { id: '4140', code: '4140', name: 'Pendapatan Service Charge (5%)', currentAmount: 7800000, priorAmount: 6900000 },
  { id: '4210', code: '4210', name: 'Diskon Member & Promo Penjualan', currentAmount: -8300000, priorAmount: -7200000, isNegative: true },
]

const DEFAULT_COGS: PnLItem[] = [
  { id: '5110', code: '5110', name: 'Bahan Baku Kopi, Susu & Sirup', currentAmount: 48500000, priorAmount: 44200000 },
  { id: '5120', code: '5120', name: 'Bahan Baku Kitchen & Makanan Fresh', currentAmount: 26200000, priorAmount: 23800000 },
  { id: '5130', code: '5130', name: 'Packaging, Cup Custom & Disposable', currentAmount: 7600000, priorAmount: 6800000 },
  { id: '5140', code: '5140', name: 'Penyusutan Bahan / Waste Spoilage', currentAmount: 1900000, priorAmount: 2100000 },
]

const DEFAULT_OPEX: PnLItem[] = [
  { id: '6110', code: '6110', name: 'Gaji, Tunjangan & Lembur Barista/Kitchen', currentAmount: 34500000, priorAmount: 33000000 },
  { id: '6120', code: '6120', name: 'Sewa Outlet & Service Charge Mall', currentAmount: 18000000, priorAmount: 18000000 },
  { id: '6130', code: '6130', name: 'Utilitas Listrik, Air & Gas Outlet', currentAmount: 7400000, priorAmount: 7100000 },
  { id: '6140', code: '6140', name: 'Pemasaran, Ads Digital & Promo', currentAmount: 5200000, priorAmount: 4800000 },
  { id: '6150', code: '6150', name: 'Software POS SaaS & Internet Fiber', currentAmount: 1600000, priorAmount: 1600000 },
  { id: '6160', code: '6160', name: 'Pemeliharaan Mesin Espresso & Sanitasi', currentAmount: 2300000, priorAmount: 2000000 },
]

const DEFAULT_TAX_DEPR: PnLItem[] = [
  { id: '7110', code: '7110', name: 'Depresiasi Mesin & Kitchen Equipment', currentAmount: 3000000, priorAmount: 3000000 },
  { id: '7120', code: '7120', name: 'Beban Bunga Pinjaman Bank KUR', currentAmount: 750000, priorAmount: 850000 },
  { id: '8110', code: '8110', name: 'Estimasi Pajak PPh Final UMKM / PPh 25', currentAmount: 2150000, priorAmount: 1900000 },
]

export const ProfitAndLossStatement: React.FC<ProfitAndLossStatementProps> = ({
  companyName = 'PT Kopi Nusantara Abadi (Headless Books)',
  currentPeriodLabel = 'Agustus 2026',
  priorPeriodLabel = 'Juli 2026',
  onExportCsv
}) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'ytd'>('monthly')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (k: string) => setCollapsed(prev => ({ ...prev, [k]: !prev[k] }))
  const sumItems = (items: PnLItem[]) => ({
    current: items.reduce((acc, item) => acc + item.currentAmount, 0),
    prior: items.reduce((acc, item) => acc + item.priorAmount, 0)
  })

  const rev = sumItems(DEFAULT_REVENUE)
  const cogs = sumItems(DEFAULT_COGS)
  const gross = { current: rev.current - cogs.current, prior: rev.prior - cogs.prior }
  const grossMargin = rev.current > 0 ? (gross.current / rev.current) * 100 : 0

  const opex = sumItems(DEFAULT_OPEX)
  const ebitda = { current: gross.current - opex.current, prior: gross.prior - opex.prior }
  const ebitdaMargin = rev.current > 0 ? (ebitda.current / rev.current) * 100 : 0

  const taxDepr = sumItems(DEFAULT_TAX_DEPR)
  const net = { current: ebitda.current - taxDepr.current, prior: ebitda.prior - taxDepr.prior }
  const netMargin = rev.current > 0 ? (net.current / rev.current) * 100 : 0

  const renderVar = (curr: number, prev: number) => {
    const v = prev === 0 ? 0 : ((curr - prev) / Math.abs(prev)) * 100
    const isPos = v >= 0
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-mono tabular-nums ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPos ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`}
      </span>
    )
  }

  const renderSection = (title: string, k: string, items: PnLItem[], tot: { current: number; prior: number }, badgeCol: 'default' | 'emerald' | 'secondary' = 'secondary') => (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40">
      <div onClick={() => toggle(k)} className="flex items-center justify-between p-3.5 bg-slate-800/50 cursor-pointer hover:bg-slate-800/70 transition-colors select-none">
        <div className="flex items-center gap-2 min-w-0">
          {collapsed[k] ? <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="font-semibold text-sm text-slate-200 truncate">{title}</span>
          <Badge variant={badgeCol} className="text-[10px] px-1.5 py-0">{items.length} Akun</Badge>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <PriceTag amount={tot.current} size="sm" variant="default" />
          {renderVar(tot.current, tot.prior)}
        </div>
      </div>
      {!collapsed[k] && (
        <div className="divide-y divide-slate-800/50">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/20 text-xs transition-colors">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="font-mono text-slate-500 shrink-0 text-[11px]">{item.code}</span>
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <PriceTag amount={item.currentAmount} size="sm" variant={item.isNegative ? 'accent' : 'default'} />
                <div className="w-14 text-right">{renderVar(item.currentAmount, item.priorAmount)}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950/40 text-xs font-semibold">
            <span className="text-slate-400">Total {title}</span>
            <div className="flex items-center gap-4 shrink-0">
              <PriceTag amount={tot.current} size="sm" variant="accent" />
              <div className="w-14 text-right">{renderVar(tot.current, tot.prior)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Laporan Laba Rugi (Profit & Loss)
            </h2>
            <Badge variant="emerald" className="gap-1 font-mono">Margin Bersih: {netMargin.toFixed(1)}%</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{companyName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-slate-300"><Calendar className="w-3 h-3" /> {currentPeriodLabel} vs {priorPeriodLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            {(['monthly', 'quarterly', 'ytd'] as const).map(tf => (
              <Button key={tf} variant={timeframe === tf ? 'default' : 'ghost'} size="sm" className="h-7 px-2.5 text-xs capitalize" onClick={() => setTimeframe(tf)}>
                {tf === 'monthly' ? 'Bulanan' : tf === 'quarterly' ? 'Kuartal' : 'YTD'}
              </Button>
            ))}
          </div>
          <Button variant="default" size="sm" className="gap-1.5" onClick={onExportCsv}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Formula Pipeline Card */}
      <Card className="p-3 bg-slate-900/90 border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] text-xs font-mono py-1 px-2">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Pendapatan</span>
            <PriceTag amount={rev.current} size="sm" variant="default" />
          </div>
          <span className="text-slate-500 font-bold">-</span>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">HPP (CoGS)</span>
            <PriceTag amount={cogs.current} size="sm" variant="accent" />
          </div>
          <span className="text-slate-500 font-bold">=</span>
          <div className="text-center bg-slate-800/60 px-2 py-1 rounded-lg">
            <span className="text-slate-300 block text-[10px] uppercase font-sans font-semibold">Laba Kotor ({grossMargin.toFixed(0)}%)</span>
            <PriceTag amount={gross.current} size="sm" variant="emerald" />
          </div>
          <span className="text-slate-500 font-bold">-</span>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">OpEx</span>
            <PriceTag amount={opex.current} size="sm" variant="accent" />
          </div>
          <span className="text-slate-500 font-bold">=</span>
          <div className="text-center bg-slate-800/60 px-2 py-1 rounded-lg">
            <span className="text-slate-300 block text-[10px] uppercase font-sans font-semibold">EBITDA ({ebitdaMargin.toFixed(0)}%)</span>
            <PriceTag amount={ebitda.current} size="sm" variant="emerald" />
          </div>
          <span className="text-slate-500 font-bold">-</span>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Pajak & Depr</span>
            <PriceTag amount={taxDepr.current} size="sm" variant="accent" />
          </div>
          <span className="text-slate-500 font-bold">=</span>
          <div className="text-center bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            <span className="text-emerald-300 block text-[10px] uppercase font-sans font-bold">Laba Bersih</span>
            <PriceTag amount={net.current} size="sm" variant="emerald" />
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Pendapatan Bersih (Net Revenue)</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={rev.current} size="lg" variant="default" />{renderVar(rev.current, rev.prior)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Termasuk Service Charge</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Laba Kotor (Gross Profit)</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={gross.current} size="lg" variant="emerald" /><Badge variant="emerald" className="text-[10px] font-mono">{grossMargin.toFixed(1)}%</Badge></div>
          <span className="text-[11px] text-slate-500 mt-1 block">Revenue - HPP</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">EBITDA Operasional</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={ebitda.current} size="lg" variant="default" /><Badge variant="secondary" className="text-[10px] font-mono">{ebitdaMargin.toFixed(1)}%</Badge></div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sebelum Pajak & Depresiasi</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-emerald-950/10 border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-medium">Laba Bersih (Net Profit)</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={net.current} size="lg" variant="emerald" />{renderVar(net.current, net.prior)}</div>
          <span className="text-[11px] text-emerald-500/80 mt-1 block font-mono">{netMargin.toFixed(1)}% Net Margin</span>
        </Card>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {renderSection('1. Pendapatan Usaha (Revenue)', 'revenue', DEFAULT_REVENUE, rev, 'emerald')}
        {renderSection('2. Beban Pokok Pendapatan (CoGS / HPP)', 'cogs', DEFAULT_COGS, cogs)}
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
          <div><span className="font-bold text-sm text-white">LABA KOTOR (GROSS PROFIT)</span><span className="text-xs text-slate-400 block font-mono">Gross Margin: {grossMargin.toFixed(1)}%</span></div>
          <div className="flex items-center gap-4"><PriceTag amount={gross.current} size="lg" variant="emerald" />{renderVar(gross.current, gross.prior)}</div>
        </div>
        {renderSection('3. Beban Operasional (Operating Expenses)', 'opex', DEFAULT_OPEX, opex)}
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
          <div><span className="font-bold text-sm text-white">EBITDA (LABA OPERASIONAL)</span><span className="text-xs text-slate-400 block font-mono">EBITDA Margin: {ebitdaMargin.toFixed(1)}%</span></div>
          <div className="flex items-center gap-4"><PriceTag amount={ebitda.current} size="lg" variant="default" />{renderVar(ebitda.current, ebitda.prior)}</div>
        </div>
        {renderSection('4. Penyusutan, Bunga & Pajak', 'tax_depr', DEFAULT_TAX_DEPR, taxDepr)}
        <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-xl flex items-center justify-between shadow-lg">
          <div><span className="font-bold text-base text-emerald-300">LABA BERSIH SETELAH PAJAK (NET PROFIT)</span><span className="text-xs text-emerald-400/80 block font-mono">Net Profit Margin: {netMargin.toFixed(1)}%</span></div>
          <div className="flex items-center gap-4"><PriceTag amount={net.current} size="xl" variant="emerald" />{renderVar(net.current, net.prior)}</div>
        </div>
      </div>
    </div>
  )
}
