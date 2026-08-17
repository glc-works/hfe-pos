import React, { useState } from 'react'
import {
  Scale,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Printer
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  PriceTag
} from '@/ui'

export interface BalanceSheetItem {
  id: string
  code: string
  name: string
  currentAmount: number
  priorAmount: number
  isNegative?: boolean
}

export interface BalanceSheetStatementProps {
  companyName?: string
  currentPeriodLabel?: string
  priorPeriodLabel?: string
  onExportCsv?: () => void
}

const DEFAULT_CURRENT_ASSETS: BalanceSheetItem[] = [
  { id: '1110', code: '1110', name: 'Kas Kasir & Petty Cash', currentAmount: 5500000, priorAmount: 4800000 },
  { id: '1120', code: '1120', name: 'Bank BCA Operasional (Settlement EDC)', currentAmount: 88500000, priorAmount: 76200000 },
  { id: '1130', code: '1130', name: 'Bank Mandiri QRIS Escrow', currentAmount: 54200000, priorAmount: 49100000 },
  { id: '1210', code: '1210', name: 'Piutang Usaha & Platform Delivery', currentAmount: 18450000, priorAmount: 16800000 },
  { id: '1310', code: '1310', name: 'Persediaan Bahan Baku Kopi & Susu (FIFO)', currentAmount: 26800000, priorAmount: 24500000 },
  { id: '1410', code: '1410', name: 'Uang Muka Sewa & Asuransi Dibayar Dimuka', currentAmount: 12000000, priorAmount: 14000000 },
]

const DEFAULT_FIXED_ASSETS: BalanceSheetItem[] = [
  { id: '1510', code: '1510', name: 'Mesin Espresso & Kitchen Equipment', currentAmount: 95000000, priorAmount: 95000000 },
  { id: '1520', code: '1520', name: 'Perangkat Hardware POS & Sound System', currentAmount: 28000000, priorAmount: 28000000 },
  { id: '1530', code: '1530', name: 'Akumulasi Penyusutan Peralatan', currentAmount: -22500000, priorAmount: -19500000, isNegative: true },
  { id: '1610', code: '1610', name: 'Hak Guna Bangunan / Fit-out Restoran', currentAmount: 65000000, priorAmount: 65000000 },
]

const DEFAULT_CURRENT_LIABILITIES: BalanceSheetItem[] = [
  { id: '2110', code: '2110', name: 'Utang Usaha Supplier Bahan Baku', currentAmount: 31400000, priorAmount: 28900000 },
  { id: '2120', code: '2120', name: 'Utang Pajak (PPN 11% & PB1 Restoran)', currentAmount: 14250000, priorAmount: 12800000 },
  { id: '2130', code: '2130', name: 'Beban Akrual Gaji & THR Karyawan', currentAmount: 24800000, priorAmount: 23500000 },
  { id: '2140', code: '2140', name: 'Uang Muka Reservasi & DP Catering', currentAmount: 6500000, priorAmount: 4200000 },
]

const DEFAULT_LONG_TERM_LIABILITIES: BalanceSheetItem[] = [
  { id: '2210', code: '2210', name: 'Utang Bank Investasi (KUR Mandiri)', currentAmount: 60000000, priorAmount: 70000000 },
  { id: '2220', code: '2220', name: 'Liabilitas Sewa Outlet Jangka Panjang', currentAmount: 45000000, priorAmount: 50000000 },
]

const DEFAULT_EQUITY: BalanceSheetItem[] = [
  { id: '3110', code: '3110', name: 'Modal Disetor Pemegang Saham', currentAmount: 120000000, priorAmount: 120000000 },
  { id: '3210', code: '3210', name: 'Laba Ditahan (Retained Earnings)', currentAmount: 40500000, priorAmount: 21500000 },
  { id: '3310', code: '3310', name: 'Laba Bersih Periode Berjalan', currentAmount: 28500000, priorAmount: 19000000 },
]

export const BalanceSheetStatement: React.FC<BalanceSheetStatementProps> = ({
  companyName = 'PT Kopi Nusantara Abadi (Headless Books)',
  currentPeriodLabel = '31 Ags 2026',
  priorPeriodLabel = '31 Jul 2026',
  onExportCsv
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (k: string) => setCollapsed(prev => ({ ...prev, [k]: !prev[k] }))
  const sumItems = (items: BalanceSheetItem[]) => ({
    current: items.reduce((acc, item) => acc + item.currentAmount, 0),
    prior: items.reduce((acc, item) => acc + item.priorAmount, 0)
  })

  const currentAssetsTot = sumItems(DEFAULT_CURRENT_ASSETS)
  const fixedAssetsTot = sumItems(DEFAULT_FIXED_ASSETS)
  const totalAssets = {
    current: currentAssetsTot.current + fixedAssetsTot.current,
    prior: currentAssetsTot.prior + fixedAssetsTot.prior
  }

  const currentLiabTot = sumItems(DEFAULT_CURRENT_LIABILITIES)
  const longTermLiabTot = sumItems(DEFAULT_LONG_TERM_LIABILITIES)
  const totalLiab = {
    current: currentLiabTot.current + longTermLiabTot.current,
    prior: currentLiabTot.prior + longTermLiabTot.prior
  }

  const equityTot = sumItems(DEFAULT_EQUITY)
  const totalLiabAndEquity = {
    current: totalLiab.current + equityTot.current,
    prior: totalLiab.prior + equityTot.prior
  }

  const isBalanced = totalAssets.current === totalLiabAndEquity.current
  const balanceDiff = totalAssets.current - totalLiabAndEquity.current
  const netWorkingCapital = currentAssetsTot.current - currentLiabTot.current

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

  const renderSection = (title: string, k: string, items: BalanceSheetItem[], tot: { current: number; prior: number }) => (
    <div className="mb-4 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40">
      <div onClick={() => toggle(k)} className="flex items-center justify-between p-3.5 bg-slate-800/50 cursor-pointer hover:bg-slate-800/70 transition-colors select-none">
        <div className="flex items-center gap-2 min-w-0">
          {collapsed[k] ? <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="font-semibold text-sm text-slate-200 truncate">{title}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{items.length} Akun</Badge>
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
            <span className="text-slate-400">Subtotal {title}</span>
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
              <Scale className="w-5 h-5 text-amber-400" />
              Neraca Keuangan (Balance Sheet)
            </h2>
            {isBalanced ? (
              <Badge variant="emerald" className="gap-1"><CheckCircle2 className="w-3.5 h-3.5" />ASSETS = LIAB + EQUITY (SEIMBANG)</Badge>
            ) : (
              <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3.5 h-3.5" />SELISIH: Rp {balanceDiff.toLocaleString('id-ID')}</Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{companyName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-slate-300"><Calendar className="w-3 h-3" /> {currentPeriodLabel} vs {priorPeriodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer className="w-3.5 h-3.5" />Cetak</Button>
          <Button variant="default" size="sm" className="gap-1.5" onClick={onExportCsv}><Download className="w-3.5 h-3.5" />Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Total Aset (Aktiva)</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={totalAssets.current} size="lg" variant="emerald" />{renderVar(totalAssets.current, totalAssets.prior)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Lancar + Tetap</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Total Liabilitas</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={totalLiab.current} size="lg" variant="default" />{renderVar(totalLiab.current, totalLiab.prior)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Jangka Pendek + Panjang</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Total Ekuitas Modal</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={equityTot.current} size="lg" variant="accent" />{renderVar(equityTot.current, equityTot.prior)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Modal Disetor + Laba Ditahan</span>
        </Card>
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 font-medium">Modal Kerja Bersih (NWC)</span>
          <div className="mt-1 flex items-baseline justify-between"><PriceTag amount={netWorkingCapital} size="lg" variant="default" /><Badge variant="secondary" className="text-[10px]">Likuid</Badge></div>
          <span className="text-[11px] text-slate-500 mt-1 block">Aset Lancar - Liabilitas Lancar</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2"><Layers className="w-4 h-4" />1. ASET (AKTIVA)</h3>
            <PriceTag amount={totalAssets.current} size="md" variant="emerald" />
          </div>
          {renderSection('Aset Lancar (Current Assets)', 'current_assets', DEFAULT_CURRENT_ASSETS, currentAssetsTot)}
          {renderSection('Aset Tetap & Non-Lancar', 'fixed_assets', DEFAULT_FIXED_ASSETS, fixedAssetsTot)}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between mt-4">
            <span className="font-bold text-sm text-emerald-300">TOTAL ASET</span>
            <div className="flex items-center gap-3">
              <PriceTag amount={totalAssets.current} size="lg" variant="emerald" />
              {renderVar(totalAssets.current, totalAssets.prior)}
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="font-bold text-base text-amber-400 flex items-center gap-2"><Layers className="w-4 h-4" />2. LIABILITAS & EKUITAS</h3>
            <PriceTag amount={totalLiabAndEquity.current} size="md" variant="accent" />
          </div>
          {renderSection('Liabilitas Lancar (Short-Term)', 'current_liab', DEFAULT_CURRENT_LIABILITIES, currentLiabTot)}
          {renderSection('Liabilitas Jangka Panjang', 'long_liab', DEFAULT_LONG_TERM_LIABILITIES, longTermLiabTot)}
          {renderSection('Ekuitas Pemilik (Equity)', 'equity', DEFAULT_EQUITY, equityTot)}
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center justify-between mt-4">
            <span className="font-bold text-sm text-amber-300">TOTAL LIABILITAS & EKUITAS</span>
            <div className="flex items-center gap-3">
              <PriceTag amount={totalLiabAndEquity.current} size="lg" variant="accent" />
              {renderVar(totalLiabAndEquity.current, totalLiabAndEquity.prior)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
