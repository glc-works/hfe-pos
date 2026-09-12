import React, { useState } from 'react'
import { Card, Button, Badge, TruthChannelBadge } from '@/ui'
import { 
  ShieldCheck, TrendingUp, Landmark, RefreshCw, 
  Sparkles, CheckCircle2, AlertCircle, Layers, Activity, Gauge
} from 'lucide-react'
import { useDataTruth } from '@/context/DataTruthContext'
import { FinancialHealthSnapshot, AssetValuationCategory } from '../../types/financialHealth'

const DEFAULT_SNAPSHOT: FinancialHealthSnapshot = {
  cashRunwayDays: 142,
  cashRunwayStatus: 'healthy',
  quickRatio: 2.45,
  grossMarginPercent: 68.4,
  operatingMarginPercent: 32.1,
  netMarginPercent: 24.2,
  workingCapitalMinor: 35000000000, // 350 Juta
  inventoryTurnoverDays: 18,
  taxReserveFundMinor: 4850000000, // 48.5 Juta
  taxObligationMinor: 4850000000, // 48.5 Juta
  taxReserveFundStatus: 'sufficient',
  assetCategory: 'fnb_raw_ingredients',
  assetValuationMinor: 18500000000, // 185 Juta
  assetTurnoverVelocityScore: 92,
  dailyBurnRateMinor: 341500000, // 3.415 Juta
  liquidCashMinor: 48500000000 // 485 Juta
}

const ASSET_CATEGORIES: { id: AssetValuationCategory; label: string; glyph: string; desc: string }[] = [
  { id: 'fnb_raw_ingredients', label: 'Bahan Baku F&B & Kopi', glyph: '☕', desc: 'Biji kopi green beans, fresh milk, sirup artisan' },
  { id: 'retail_merchandise', label: 'Stok Ritel & Merchandise', glyph: '🛍️', desc: 'Tumbler, drip bag, manual brewer, apparel' },
  { id: 'mfg_wip', label: 'Barang Dalam Proses (WIP)', glyph: '🏭', desc: 'Batch sangrai roasting di cooling tray, kemasan foil' },
  { id: 'biological_produce', label: 'Aset Biologis & Hasil Panen', glyph: '🌿', desc: 'Cherry kopi masak di pohon & gabah basah (PSAK 69)' },
  { id: 'general_fixed_assets', label: 'Aset Tetap & Mesin Espresso', glyph: '⚙️', desc: 'Mesin La Marzocco, grinder Mazzer, kompresor' }
]

export interface UniversalFinancialHealthGaugeProps {
  customSnapshot?: Partial<FinancialHealthSnapshot>
  isCoreConnected?: boolean
  authoritativeSnapshot?: {
    metrics: FinancialHealthSnapshot
    bookId: string
    periodStart: string
    periodEnd: string
    asOf: string
    source: string
  }
  expectedBookId?: string
  trustedSource?: string
  maxReceiptAgeMs?: number
}

const FINANCIAL_METRIC_KEYS: (keyof FinancialHealthSnapshot)[] = [
  'cashRunwayDays', 'quickRatio', 'grossMarginPercent', 'operatingMarginPercent',
  'netMarginPercent', 'workingCapitalMinor', 'inventoryTurnoverDays',
  'taxReserveFundMinor', 'taxObligationMinor', 'assetValuationMinor',
  'assetTurnoverVelocityScore', 'dailyBurnRateMinor', 'liquidCashMinor',
]

function parseCanonicalReceiptDate(value: string, dateOnly: boolean): number | undefined {
  const pattern = dateOnly
    ? /^(\d{4})-(\d{2})-(\d{2})$/
    : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/
  const match = pattern.exec(value)
  if (!match) return undefined
  if (!dateOnly) {
    const [, , , , hour, minute, second, offsetHour, offsetMinute] = match
    if (
      Number(hour) > 23
      || Number(minute) > 59
      || Number(second) > 59
      || (offsetHour !== undefined && Number(offsetHour) > 23)
      || (offsetMinute !== undefined && Number(offsetMinute) > 59)
    ) return undefined
  }

  const canonicalDay = `${match[1]}-${match[2]}-${match[3]}`
  const midnight = Date.parse(`${canonicalDay}T00:00:00Z`)
  if (!Number.isFinite(midnight) || new Date(midnight).toISOString().slice(0, 10) !== canonicalDay) {
    return undefined
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function isValidAuthoritativeReceipt(
  receipt: UniversalFinancialHealthGaugeProps['authoritativeSnapshot'],
  expectedBookId: string | undefined,
  trustedSource: string | undefined,
  maxAgeMs: number,
): boolean {
  if (!receipt || !expectedBookId || !trustedSource) return false
  if (!Number.isFinite(maxAgeMs) || maxAgeMs < 0) return false
  if (receipt.bookId !== expectedBookId || receipt.source !== trustedSource) return false
  const periodStart = parseCanonicalReceiptDate(receipt.periodStart, true)
  const periodEnd = parseCanonicalReceiptDate(receipt.periodEnd, true)
  const asOf = parseCanonicalReceiptDate(receipt.asOf, false)
  if (periodStart === undefined || periodEnd === undefined || asOf === undefined) return false
  if (periodStart > periodEnd || asOf < periodEnd || asOf > Date.now() || Date.now() - asOf > maxAgeMs) return false
  const metrics = receipt.metrics as Partial<FinancialHealthSnapshot> | undefined
  if (!metrics || !FINANCIAL_METRIC_KEYS.every((key) => Number.isFinite(metrics[key]))) return false
  if (
    metrics.cashRunwayDays! < 0
    || metrics.quickRatio! < 0
    || metrics.inventoryTurnoverDays! < 0
    || metrics.taxReserveFundMinor! < 0
    || metrics.taxObligationMinor! < 0
    || metrics.assetValuationMinor! < 0
    || metrics.dailyBurnRateMinor! < 0
    || metrics.liquidCashMinor! < 0
    || metrics.assetTurnoverVelocityScore! < 0
    || metrics.assetTurnoverVelocityScore! > 100
  ) return false
  if (!['healthy', 'warning', 'critical'].includes(String(metrics.cashRunwayStatus))) return false
  if (!ASSET_CATEGORIES.some(({ id }) => id === metrics.assetCategory)) return false
  const sufficient = metrics.taxReserveFundMinor! >= metrics.taxObligationMinor!
  return metrics.taxReserveFundStatus === (sufficient ? 'sufficient' : 'deficit')
}

export const UniversalFinancialHealthGauge: React.FC<UniversalFinancialHealthGaugeProps> = ({
  customSnapshot,
  isCoreConnected: propIsCoreConnected,
  authoritativeSnapshot,
  expectedBookId,
  trustedSource,
  maxReceiptAgeMs = 24 * 60 * 60 * 1000
}) => {
  const { channel } = useDataTruth()
  const hasReportReceipt = isValidAuthoritativeReceipt(authoritativeSnapshot, expectedBookId, trustedSource, maxReceiptAgeMs)
  const isCoreConnected = (propIsCoreConnected ?? (channel === 'live-core')) && hasReportReceipt
  const [selectedAssetCat, setSelectedAssetCat] = useState<AssetValuationCategory>('fnb_raw_ingredients')

  const snapshot: FinancialHealthSnapshot = isCoreConnected && authoritativeSnapshot
    ? authoritativeSnapshot.metrics
    : { ...DEFAULT_SNAPSHOT, ...customSnapshot }

  const effectiveAssetCategory = isCoreConnected ? snapshot.assetCategory : selectedAssetCat
  const activeCategoryConfig = ASSET_CATEGORIES.find(c => c.id === effectiveAssetCategory) || ASSET_CATEGORIES[0]
  const taxCoveragePercent = snapshot.taxObligationMinor > 0
    ? Math.min(100, Math.max(0, Math.round((snapshot.taxReserveFundMinor / snapshot.taxObligationMinor) * 100)))
    : 100
  const taxReserveIsSufficient = snapshot.taxReserveFundStatus === 'sufficient' && taxCoveragePercent >= 100
  const taxShortfallMinor = Math.max(0, snapshot.taxObligationMinor - snapshot.taxReserveFundMinor)
  const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))
  const netMarginBarPercent = clampPercentage(snapshot.netMarginPercent)
  const operatingMarginBarPercent = clampPercentage(snapshot.operatingMarginPercent - Math.max(0, snapshot.netMarginPercent))
  const cogsBarPercent = clampPercentage(100 - snapshot.grossMarginPercent)
  const runwayStatusPresentation = {
    healthy: {
      label: 'Sehat',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      barClass: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    },
    warning: {
      label: 'Perlu Perhatian',
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      barClass: 'bg-gradient-to-r from-amber-500 to-orange-400',
    },
    critical: {
      label: 'Kritis',
      badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
      barClass: 'bg-gradient-to-r from-rose-600 to-red-400',
    },
  }[snapshot.cashRunwayStatus]

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* TOP HEADER SUMMARY BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-950/20 via-slate-900/10 to-blue-950/20 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Universal Executive Financial Health & Capital Velocity
              </h3>
              <TruthChannelBadge channel={isCoreConnected ? 'live-core' : 'demo'} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Derivasi metrik likuiditas, efisiensi margin, kecepatan perputaran modal & cadangan pajak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            {isCoreConnected && authoritativeSnapshot
              ? `CORE • as of ${authoritativeSnapshot.asOf}`
              : 'Sample Snapshot: 2026-08-25 (Simulasi)'}
          </Badge>
        </div>
      </div>

      {/* 4 UNIVERSAL GAUGE QUADRANT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GAUGE 1: CASH RUNWAY & LIQUIDITY */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Landmark className="w-4 h-4" /> Ketahanan Kas (Runway)
              </span>
              <Badge variant="outline" className={`${runwayStatusPresentation.badgeClass} text-[9px]`}>
                {runwayStatusPresentation.label}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-mono font-black text-slate-900 dark:text-white tabular-nums">
                {snapshot.cashRunwayDays}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Hari Operasional</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`${runwayStatusPresentation.barClass} h-full rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, (snapshot.cashRunwayDays / 180) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Kas Likuid:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Rp {(snapshot.liquidCashMinor / 100).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily Burn:</span>
              <span className="text-slate-600 dark:text-slate-400">
                Rp {(snapshot.dailyBurnRateMinor / 100).toLocaleString('id-ID')}/hari
              </span>
            </div>
          </div>
        </Card>

        {/* GAUGE 2: OPERATING & GROSS MARGIN EFFICIENCY */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" /> Margin & Efisiensi HPP
              </span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[9px]">
                Gross: {snapshot.grossMarginPercent}%
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-mono font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {snapshot.netMarginPercent}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Net Margin Bersih</span>
            </div>

            {/* SEGMENTED PROFIT STACK */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${netMarginBarPercent}%` }} title="Net Margin" />
              <div className="bg-blue-400 h-full" style={{ width: `${operatingMarginBarPercent}%` }} title="Operating OpEx" />
              <div className="bg-amber-400 h-full" style={{ width: `${cogsBarPercent}%` }} title="COGS/HPP" />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Gross Margin:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{snapshot.grossMarginPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span>HPP (COGS):</span>
              <span className="text-amber-600 dark:text-amber-400">{(100 - snapshot.grossMarginPercent).toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* GAUGE 3: ASSET & STOCK VELOCITY */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <RefreshCw className="w-4 h-4" /> Perputaran Modal Stok
              </span>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[9px]">
                Skor: {snapshot.assetTurnoverVelocityScore}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-mono font-black text-purple-600 dark:text-purple-400 tabular-nums">
                {snapshot.inventoryTurnoverDays}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Hari / Siklus Putar</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(15, 100 - (snapshot.inventoryTurnoverDays * 2))}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Modal Kerja:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Rp {(snapshot.workingCapitalMinor / 100).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status Stok:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Sangat Likuid</span>
            </div>
          </div>
        </Card>

        {/* GAUGE 4: STATUTORY TAX & OBLIGATION RESERVE */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="w-4 h-4" /> Cadangan Pajak PB1/PPN
              </span>
              <Badge variant="outline" className={taxReserveIsSufficient
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px]'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[9px]'}>
                {`${taxCoveragePercent}% Tersedia`}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white tabular-nums">
                Rp {(snapshot.taxReserveFundMinor / 100).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`${taxReserveIsSufficient ? 'bg-emerald-500' : 'bg-rose-500'} h-full rounded-full transition-all duration-500`}
                style={{ width: `${taxCoveragePercent}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Kewajiban Bapenda:</span>
              <span className="text-slate-800 dark:text-slate-200">
                Rp {(snapshot.taxObligationMinor / 100).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ring-Fence Fund:</span>
              <span className={`${taxReserveIsSufficient ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} font-bold`}>
                {taxReserveIsSufficient
                  ? 'Terproteksi 100%'
                  : `Defisit Rp ${(taxShortfallMinor / 100).toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>
        </Card>

      </div>

      {/* PLUGGABLE ASSET BREAKDOWN SECTOR EXPLORER */}
      <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Klasifikasi Valuasi Aset & Modal Kerja (Multi-Sektor)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih klasifikasi aset untuk memantau nilai buku dan perputaran modal kerja sesuai model bisnis
            </p>
          </div>
        </div>

        {/* SECTOR PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ASSET_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              disabled={isCoreConnected}
              aria-pressed={effectiveAssetCategory === cat.id}
              onClick={() => setSelectedAssetCat(cat.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all select-none shrink-0 disabled:cursor-default ${
                effectiveAssetCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.glyph}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE SECTOR DETAIL CARD */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{activeCategoryConfig.glyph}</span>
              <span className="font-bold text-xs text-slate-900 dark:text-white">{activeCategoryConfig.label}</span>
              <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-mono">
                Valuasi Aktif
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeCategoryConfig.desc}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Total Nilai Buku (General Ledger):</span>
            <span className="text-xl font-mono font-black text-purple-600 dark:text-purple-400 tabular-nums">
              Rp {(snapshot.assetValuationMinor / 100).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </Card>

    </div>
  )
}
export default UniversalFinancialHealthGauge
