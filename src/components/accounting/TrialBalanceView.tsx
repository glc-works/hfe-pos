import React from 'react'
import { Scale, CheckCircle2, ShieldCheck, Download, AlertTriangle } from 'lucide-react'
import { TrialBalanceRow } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface TrialBalanceViewProps {
  rows: TrialBalanceRow[]
  periodName?: string
}

export const TrialBalanceView: React.FC<TrialBalanceViewProps> = ({
  rows,
  periodName = 'Agustus 2026'
}) => {
  const totalOpeningDebit = rows.reduce((acc, r) => acc + r.openingDebit, 0)
  const totalOpeningCredit = rows.reduce((acc, r) => acc + r.openingCredit, 0)
  const totalMovementDebit = rows.reduce((acc, r) => acc + r.movementDebit, 0)
  const totalMovementCredit = rows.reduce((acc, r) => acc + r.movementCredit, 0)
  const totalClosingDebit = rows.reduce((acc, r) => acc + r.closingDebit, 0)
  const totalClosingCredit = rows.reduce((acc, r) => acc + r.closingCredit, 0)

  const isBalanced = totalClosingDebit === totalClosingCredit
  const variance = Math.abs(totalClosingDebit - totalClosingCredit)

  return (
    <div className="flex flex-col gap-4">
      {/* Verification Invariant Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isBalanced
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-rose-500/10 border-rose-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isBalanced ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
            {isBalanced ? <Scale className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                {isBalanced ? 'Neraca Saldo Seimbang (Double-Entry Invariant OK)' : 'Peringatan: Selisih Neraca Saldo'}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
                {periodName}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isBalanced
                ? 'Total saldo Debit sama persis dengan total saldo Kredit tanpa deviasi matematis.'
                : `Ditemukan selisih saldo sebesar Rp ${variance.toLocaleString('id-ID')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-right font-mono text-xs">
            <span className="text-[10px] text-slate-400 block">Selisih (Variance)</span>
            <span className={`font-bold ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
              Rp {variance.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Trial Balance Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">Buku Neraca Saldo (Trial Balance)</h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {rows.length} Akun Terverifikasi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="p-3" rowSpan={2}>Kode</th>
                <th className="p-3" rowSpan={2}>Nama Akun</th>
                <th className="p-2.5 text-center border-l border-slate-800" colSpan={2}>Saldo Awal</th>
                <th className="p-2.5 text-center border-l border-slate-800" colSpan={2}>Pergerakan (Mutasi)</th>
                <th className="p-2.5 text-center border-l border-slate-800" colSpan={2}>Saldo Akhir</th>
              </tr>
              <tr className="border-t border-slate-800/60 text-[9px]">
                <th className="p-2 text-right border-l border-slate-800">Debit</th>
                <th className="p-2 text-right">Kredit</th>
                <th className="p-2 text-right border-l border-slate-800">Debit</th>
                <th className="p-2 text-right">Kredit</th>
                <th className="p-2 text-right border-l border-slate-800 text-amber-300">Debit</th>
                <th className="p-2 text-right text-amber-300">Kredit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows.map((row) => (
                <tr key={row.accountCode} className="hover:bg-slate-850/50 font-mono transition-colors">
                  <td className="p-3 text-amber-400 font-bold whitespace-nowrap">{row.accountCode}</td>
                  <td className="p-3 font-sans text-slate-200 min-w-[180px]">{row.accountName}</td>
                  <td className="p-2 text-right border-l border-slate-800">
                    {row.openingDebit > 0 ? <PriceTag amount={row.openingDebit} size="xs" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-2 text-right">
                    {row.openingCredit > 0 ? <PriceTag amount={row.openingCredit} size="xs" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-2 text-right border-l border-slate-800">
                    {row.movementDebit > 0 ? <PriceTag amount={row.movementDebit} size="xs" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-2 text-right">
                    {row.movementCredit > 0 ? <PriceTag amount={row.movementCredit} size="xs" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-2 text-right border-l border-slate-800 bg-slate-950/30">
                    {row.closingDebit > 0 ? <PriceTag amount={row.closingDebit} size="xs" variant="emerald" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-2 text-right bg-slate-950/30">
                    {row.closingCredit > 0 ? <PriceTag amount={row.closingCredit} size="xs" variant="emerald" /> : <span className="text-slate-600">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 border-t-2 border-slate-700 font-bold text-xs">
              <tr>
                <td colSpan={2} className="p-3 text-right text-slate-300 font-sans uppercase text-[11px] tracking-wide">
                  Total Neraca Saldo
                </td>
                <td className="p-2.5 text-right border-l border-slate-800">
                  <PriceTag amount={totalOpeningDebit} size="xs" />
                </td>
                <td className="p-2.5 text-right">
                  <PriceTag amount={totalOpeningCredit} size="xs" />
                </td>
                <td className="p-2.5 text-right border-l border-slate-800">
                  <PriceTag amount={totalMovementDebit} size="xs" />
                </td>
                <td className="p-2.5 text-right">
                  <PriceTag amount={totalMovementCredit} size="xs" />
                </td>
                <td className="p-2.5 text-right border-l border-slate-800 bg-amber-500/10">
                  <PriceTag amount={totalClosingDebit} size="sm" variant="accent" />
                </td>
                <td className="p-2.5 text-right bg-amber-500/10">
                  <PriceTag amount={totalClosingCredit} size="sm" variant="accent" />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
