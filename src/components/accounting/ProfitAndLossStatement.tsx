import React from 'react'
import { TrendingUp, PieChart, DollarSign, Percent, ShieldCheck } from 'lucide-react'
import { ProfitAndLossData } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface ProfitAndLossStatementProps {
  data: ProfitAndLossData
}

export const ProfitAndLossStatement: React.FC<ProfitAndLossStatementProps> = ({
  data
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* PnL Top KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Pendapatan</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <PriceTag amount={data.totalRevenue} size="lg" variant="emerald" />
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Gross Sales F&amp;B + Retail</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Laba Kotor (Gross Profit)</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <PriceTag amount={data.grossProfit} size="lg" variant="accent" />
            <span className="text-xs font-mono font-bold text-amber-400">({data.grossMarginPct}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Margin setelah HPP Bahan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Laba Operasional (EBITDA)</span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <PriceTag amount={data.operatingProfit} size="lg" variant="default" />
            <span className="text-xs font-mono font-bold text-sky-400">({data.operatingMarginPct}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Sebelum Pajak Restoran/PPh</p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold text-emerald-300">Laba Bersih (Net Income)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <PriceTag amount={data.netIncome} size="lg" variant="emerald" />
            <span className="text-xs font-mono font-bold text-emerald-400">({data.netMarginPct}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Net Profit Ditahan ke Ekuitas</p>
        </div>
      </div>

      {/* Structured Income Statement Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">Laporan Laba Rugi Komprehensif (Income Statement)</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">{data.period}</span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {/* 1. REVENUE SECTION */}
          <div className="p-4 bg-slate-950/20">
            <h5 className="font-bold text-emerald-400 mb-2 uppercase tracking-wide text-[11px]">
              1. Pendapatan Usaha (Revenue)
            </h5>
            <div className="space-y-1.5">
              {data.revenueLines.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                    <span className="text-slate-200 truncate">{item.name}</span>
                  </div>
                  <PriceTag amount={item.currentPeriod} size="xs" variant="emerald" />
                </div>
              ))}
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
              <span className="text-white">Total Pendapatan Bersih</span>
              <PriceTag amount={data.totalRevenue} size="sm" variant="emerald" />
            </div>
          </div>

          {/* 2. COGS SECTION */}
          <div className="p-4 bg-slate-950/40">
            <h5 className="font-bold text-rose-400 mb-2 uppercase tracking-wide text-[11px]">
              2. Beban Pokok Penjualan (COGS)
            </h5>
            <div className="space-y-1.5">
              {data.cogsLines.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                    <span className="text-slate-200 truncate">{item.name}</span>
                  </div>
                  <PriceTag amount={item.currentPeriod} size="xs" variant="muted" />
                </div>
              ))}
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
              <span className="text-white">Total Beban Pokok Penjualan</span>
              <PriceTag amount={data.totalCogs} size="sm" variant="muted" />
            </div>
          </div>

          {/* GROSS PROFIT ROW */}
          <div className="p-4 bg-amber-500/10 flex justify-between items-center font-black">
            <div className="flex items-center gap-2">
              <span className="text-white uppercase tracking-wide">LABA KOTOR (GROSS PROFIT)</span>
              <span className="text-xs font-mono text-amber-400">({data.grossMarginPct}%)</span>
            </div>
            <PriceTag amount={data.grossProfit} size="md" variant="accent" />
          </div>

          {/* 3. OPERATING EXPENSES */}
          <div className="p-4">
            <h5 className="font-bold text-orange-400 mb-2 uppercase tracking-wide text-[11px]">
              3. Beban Operasional (Operating Expenses)
            </h5>
            <div className="space-y-1.5">
              {data.expenseLines.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                    <span className="text-slate-200 truncate">{item.name}</span>
                  </div>
                  <PriceTag amount={item.currentPeriod} size="xs" />
                </div>
              ))}
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
              <span className="text-white">Total Beban Operasional</span>
              <PriceTag amount={data.totalExpenses} size="sm" variant="default" />
            </div>
          </div>

          {/* OPERATING PROFIT ROW */}
          <div className="p-4 bg-slate-950 flex justify-between items-center font-bold">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 uppercase tracking-wide">LABA OPERASIONAL (EBITDA)</span>
              <span className="text-xs font-mono text-sky-400">({data.operatingMarginPct}%)</span>
            </div>
            <PriceTag amount={data.operatingProfit} size="sm" variant="default" />
          </div>

          {/* TAX EXPENSE ROW */}
          <div className="p-4 bg-slate-950/40 flex justify-between items-center text-xs">
            <span className="text-slate-400">Beban Pajak Penghasilan / Restoran</span>
            <PriceTag amount={data.taxExpense} size="xs" variant="muted" />
          </div>

          {/* NET INCOME ROW */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 to-slate-950 border-t-2 border-emerald-500 flex justify-between items-center">
            <div>
              <span className="text-sm sm:text-base font-black text-white uppercase tracking-wider block">
                LABA BERSIH TAHUN BERJALAN (NET INCOME)
              </span>
              <span className="text-xs text-emerald-400 font-mono">Net Margin: {data.netMarginPct}%</span>
            </div>
            <PriceTag amount={data.netIncome} size="xl" variant="emerald" />
          </div>
        </div>
      </div>
    </div>
  )
}
