import React, { useState, useMemo } from 'react'
import {
  Package,
  Bike,
  FlaskConical,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Layers,
  Printer,
  ShieldCheck,
  Scale
} from 'lucide-react'
import {
  calculateShiftBomMargin,
  DEFAULT_SHIFT_SOLD_ITEMS,
  ShiftSoldItem,
  TheoreticalIngredientUsage
} from '../../utils/shiftReconcile'

export interface ShiftClosingBomSummaryProps {
  soldItems?: ShiftSoldItem[]
  cashVariance?: number
  totalGrossSales?: number
  cashSales?: number
  ojolCommissionRate?: number
  onExportReport?: () => void
}

export const ShiftClosingBomSummary: React.FC<ShiftClosingBomSummaryProps> = ({
  soldItems = DEFAULT_SHIFT_SOLD_ITEMS,
  cashVariance = 0,
  totalGrossSales,
  cashSales,
  ojolCommissionRate = 0.20,
  onExportReport
}) => {
  const [showDetailedIngredients, setShowDetailedIngredients] = useState<boolean>(true)

  const summary = useMemo(() => {
    return calculateShiftBomMargin({
      soldItems,
      cashVariance,
      ojolCommissionRate
    })
  }, [soldItems, cashVariance, ojolCommissionRate])

  const effectiveOmzet = totalGrossSales !== undefined ? totalGrossSales : summary.totalOmzet

  return (
    <div className="flex flex-col gap-3.5 bg-background/50 text-foreground">
      {/* HEADER STRIP */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-[9px] font-bold">
                FORM-OPS-04
              </span>
              <h4 className="text-xs font-bold text-foreground">Rekonsiliasi BoM &amp; Margin Riil Shift</h4>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Konsumsi bahan baku teoritis, komisi delivery 20% &amp; laba bersih operasional
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-muted border border-border text-muted-foreground">
            {soldItems.length} SKU Terjual
          </span>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS (QUADRANT MATRIX) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. TOTAL OMZET */}
        <div className="bg-card border border-border rounded-2xl p-2.5 flex flex-col justify-between gap-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-blue-500" /> Total Omzet Shift
            </span>
            <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-500 px-1 rounded">100%</span>
          </div>
          <div className="mt-1">
            <span className="text-xs sm:text-sm font-mono font-black text-foreground tabular-nums block">
              Rp {effectiveOmzet.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-muted-foreground">Gross Sales Register</span>
          </div>
        </div>

        {/* 2. OJOL COMMISSION */}
        <div className="bg-card border border-border rounded-2xl p-2.5 flex flex-col justify-between gap-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold flex items-center gap-1">
              <Bike className="w-3.5 h-3.5 text-amber-500" /> Komisi Ojol (20%)
            </span>
            <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 px-1 rounded">
              {summary.totalOmzet > 0 ? `${((summary.ojolCommission / summary.totalOmzet) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs sm:text-sm font-mono font-black text-amber-500 tabular-nums block">
              -Rp {summary.ojolCommission.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-muted-foreground">GoFood/GrabFood/Shopee</span>
          </div>
        </div>

        {/* 3. TOTAL BOM COGS */}
        <div className="bg-card border border-border rounded-2xl p-2.5 flex flex-col justify-between gap-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-rose-500" /> Total HPP BoM
            </span>
            <span className="text-[9px] font-mono font-bold bg-rose-500/10 text-rose-500 px-1 rounded">
              {summary.totalOmzet > 0 ? `${((summary.totalBomCogs / summary.totalOmzet) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs sm:text-sm font-mono font-black text-rose-500 tabular-nums block">
              -Rp {summary.totalBomCogs.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-muted-foreground">Theoretical COGS Depleted</span>
          </div>
        </div>

        {/* 4. NET OPERATIONAL PROFIT */}
        <div className="bg-card border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-2.5 flex flex-col justify-between gap-1 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Laba Bersih Shift
            </span>
            <span className="text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 rounded">
              {summary.netMarginPercent.toFixed(1)}%
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs sm:text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 tabular-nums block">
              Rp {summary.finalSettlementProfit.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-muted-foreground">Net Margin Riil Shift</span>
          </div>
        </div>
      </div>

      {/* CASH VARIANCE RECONCILIATION BADGE */}
      <div
        className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
          cashVariance === 0
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : cashVariance > 0
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {cashVariance === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <div>
            <span className="font-bold block text-[11px]">
              ⚠️ Selisih Kas Fisik vs Sistem:{' '}
              {cashVariance === 0
                ? 'Balance (Sesuai Rp 0)'
                : cashVariance > 0
                ? `Lebih Setor (+Rp ${cashVariance.toLocaleString('id-ID')})`
                : `Kurang Setor (-Rp ${Math.abs(cashVariance).toLocaleString('id-ID')})`}
            </span>
            <span className="text-[9px] opacity-80 block">
              {cashVariance === 0
                ? 'Laci fisik kasir cocok sempurna dengan jurnal Hfe CORE.'
                : 'Selisih akan otomatis dibukukan ke GL 5109 / GL 4109 saat posting.'}
            </span>
          </div>
        </div>
        <span className="font-mono font-bold text-xs shrink-0 tabular-nums">
          {cashVariance >= 0 ? `+Rp ${cashVariance.toLocaleString('id-ID')}` : `-Rp ${Math.abs(cashVariance).toLocaleString('id-ID')}`}
        </span>
      </div>

      {/* THEORETICAL BOM INGREDIENTS BREAKDOWN ACCORDION */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDetailedIngredients(!showDetailedIngredients)}
          className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Rincian Konsumsi Bahan Baku Komposisi BoM ({summary.ingredientUsages.length} Bahan)</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <span>{showDetailedIngredients ? 'Sembunyikan' : 'Tampilkan'}</span>
            {showDetailedIngredients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showDetailedIngredients && (
          <div className="p-2.5 pt-0 border-t border-border/60">
            <div className="max-h-44 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-1 mt-2">
              {summary.ingredientUsages.map((ing, idx) => (
                <div
                  key={`${ing.name}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60 text-xs"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-medium text-foreground truncate text-[11px]">{ing.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Konsumsi: {ing.totalAmount.toLocaleString('id-ID')} {ing.unit}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-rose-500 text-[11px] block tabular-nums">
                      Rp {ing.totalCost.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">HPP Terpakai</span>
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
