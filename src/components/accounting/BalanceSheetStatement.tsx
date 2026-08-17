import React from 'react'
import { Landmark, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { BalanceSheetData } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface BalanceSheetStatementProps {
  data: BalanceSheetData
}

export const BalanceSheetStatement: React.FC<BalanceSheetStatementProps> = ({
  data
}) => {
  const currentAssetsSum = data.currentAssets.reduce((sum, r) => sum + r.currentPeriod, 0)
  const nonCurrentAssetsSum = data.nonCurrentAssets.reduce((sum, r) => sum + r.currentPeriod, 0)
  const totalAssets = currentAssetsSum + nonCurrentAssetsSum

  const currentLiabilitiesSum = data.currentLiabilities.reduce((sum, r) => sum + r.currentPeriod, 0)
  const nonCurrentLiabilitiesSum = data.nonCurrentLiabilities.reduce((sum, r) => sum + r.currentPeriod, 0)
  const totalLiabilities = currentLiabilitiesSum + nonCurrentLiabilitiesSum

  const totalEquity = data.equityLines.reduce((sum, r) => sum + r.currentPeriod, 0)
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity

  const isBalanced = totalAssets === totalLiabilitiesAndEquity

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-sm">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Laporan Posisi Keuangan (Neraca / Balance Sheet)</h3>
              {isBalanced ? (
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aset = Liabilitas + Ekuitas
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  Tidak Seimbang
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Per {data.asOfDate} • Standar SAK Entitas Privat (SAK EP / IFRS)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Total Aset Bersih</span>
            <PriceTag amount={totalAssets} size="md" variant="emerald" />
          </div>
        </div>
      </div>

      {/* 2-Column Balance Sheet (Assets vs Liabilities & Equity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT COLUMN: ASSETS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> 1. ASET (ASSETS)
              </h4>
              <span className="text-xs font-mono text-slate-400">Periode Berjalan</span>
            </div>

            {/* Current Assets */}
            <div className="p-4 border-b border-slate-800/80">
              <h5 className="text-xs font-bold text-sky-300 mb-2 uppercase tracking-wide">Aset Lancar (Current Assets)</h5>
              <div className="space-y-1.5">
                {data.currentAssets.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                      <span className="text-slate-200 truncate">{item.name}</span>
                    </div>
                    <PriceTag amount={item.currentPeriod} size="xs" />
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Total Aset Lancar</span>
                <PriceTag amount={currentAssetsSum} size="sm" variant="default" />
              </div>
            </div>

            {/* Non-Current Assets */}
            <div className="p-4">
              <h5 className="text-xs font-bold text-sky-300 mb-2 uppercase tracking-wide">Aset Tidak Lancar (Fixed Assets)</h5>
              <div className="space-y-1.5">
                {data.nonCurrentAssets.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                      <span className="text-slate-200 truncate">{item.name}</span>
                    </div>
                    <PriceTag amount={item.currentPeriod} size="xs" />
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Total Aset Tidak Lancar</span>
                <PriceTag amount={nonCurrentAssetsSum} size="sm" variant="default" />
              </div>
            </div>
          </div>

          {/* Total Assets Summary Footer */}
          <div className="p-4 bg-slate-950 border-t-2 border-sky-500/40 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">TOTAL ASET</span>
            <PriceTag amount={totalAssets} size="md" variant="emerald" />
          </div>
        </div>

        {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 2 &amp; 3. KEWAJIBAN &amp; EKUITAS
              </h4>
              <span className="text-xs font-mono text-slate-400">Periode Berjalan</span>
            </div>

            {/* Current Liabilities */}
            <div className="p-4 border-b border-slate-800/80">
              <h5 className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wide">Kewajiban Lancar (Current Liabilities)</h5>
              <div className="space-y-1.5">
                {data.currentLiabilities.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                      <span className="text-slate-200 truncate">{item.name}</span>
                    </div>
                    <PriceTag amount={item.currentPeriod} size="xs" />
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Total Kewajiban Lancar</span>
                <PriceTag amount={currentLiabilitiesSum} size="sm" variant="default" />
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div className="p-4 border-b border-slate-800/80">
              <h5 className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wide">Kewajiban Jangka Panjang</h5>
              <div className="space-y-1.5">
                {data.nonCurrentLiabilities.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                      <span className="text-slate-200 truncate">{item.name}</span>
                    </div>
                    <PriceTag amount={item.currentPeriod} size="xs" />
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Total Kewajiban</span>
                <PriceTag amount={totalLiabilities} size="sm" variant="default" />
              </div>
            </div>

            {/* Equity */}
            <div className="p-4">
              <h5 className="text-xs font-bold text-purple-300 mb-2 uppercase tracking-wide">Ekuitas &amp; Modal (Equity)</h5>
              <div className="space-y-1.5">
                {data.equityLines.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 hover:bg-slate-850/40 px-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-slate-500">{item.code}</span>
                      <span className="text-slate-200 truncate">{item.name}</span>
                    </div>
                    <PriceTag amount={item.currentPeriod} size="xs" variant={item.code === '3-3001' ? 'accent' : 'default'} />
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Total Ekuitas</span>
                <PriceTag amount={totalEquity} size="sm" variant="default" />
              </div>
            </div>
          </div>

          {/* Total Liabilities & Equity Summary Footer */}
          <div className="p-4 bg-slate-950 border-t-2 border-amber-500/40 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">TOTAL KEWAJIBAN &amp; EKUITAS</span>
            <PriceTag amount={totalLiabilitiesAndEquity} size="md" variant="accent" />
          </div>
        </div>
      </div>
    </div>
  )
}
