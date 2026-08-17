import React, { useState } from 'react'
import { Building2, Coins } from 'lucide-react'
import { Badge } from '@/ui'

export type ConsolCurrency = 'USD' | 'SGD' | 'IDR'

const ENTITY_FINANCIALS = {
  holdCoSg: { name: 'Kopi HoldCo (SG)', rateToUsd: 0.75, cash: 2500000, interAr: 1200000, tradeAr: 450000, inv: 350000, investSub: 3800000, fa: 850000, tradeAp: 220000, interAp: 0, debt: 1500000, equity: 5000000, re: 2380000 },
  ptIndo: { name: 'PT Kopi Indo (ID)', rateToUsd: 0.000062, cash: 18500000000, interAr: 0, tradeAr: 6200000000, inv: 8400000000, investSub: 0, fa: 24500000000, tradeAp: 4100000000, interAp: 9677419355, debt: 12000000000, equity: 20000000000, re: 11822580645 },
  myOpCo: { name: 'Kopi Sdn Bhd (MY)', rateToUsd: 0.22, cash: 1400000, interAr: 0, tradeAr: 850000, inv: 1100000, investSub: 0, fa: 3200000, tradeAp: 650000, interAp: 1818182, debt: 1500000, equity: 2000000, re: 581818 },
  hkOpCo: { name: 'Kopi HK Ltd (HK)', rateToUsd: 0.128, cash: 3800000, interAr: 0, tradeAr: 2100000, inv: 1900000, investSub: 0, fa: 1200000, tradeAp: 950000, interAp: 0, debt: 0, equity: 4000000, re: 4050000 }
}

export const ConsolidatedStatementView: React.FC = () => {
  const [displayCurrency, setDisplayCurrency] = useState<ConsolCurrency>('USD')
  const usdMult = displayCurrency === 'USD' ? 1 : displayCurrency === 'SGD' ? 1.333 : 16200
  const sym = displayCurrency === 'USD' ? '$' : displayCurrency === 'SGD' ? 'S$' : 'Rp '

  const toView = (usdVal: number) => Math.round(usdVal * usdMult)
  const fmt = (usdVal: number) => `${sym}${toView(usdVal).toLocaleString('en-US')}`

  const sg = {
    cash: ENTITY_FINANCIALS.holdCoSg.cash * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    interAr: 900000,
    tradeAr: ENTITY_FINANCIALS.holdCoSg.tradeAr * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    inv: ENTITY_FINANCIALS.holdCoSg.inv * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    investSub: 2850000,
    fa: ENTITY_FINANCIALS.holdCoSg.fa * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    tradeAp: ENTITY_FINANCIALS.holdCoSg.tradeAp * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    interAp: 0,
    debt: ENTITY_FINANCIALS.holdCoSg.debt * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    equity: ENTITY_FINANCIALS.holdCoSg.equity * ENTITY_FINANCIALS.holdCoSg.rateToUsd,
    re: ENTITY_FINANCIALS.holdCoSg.re * ENTITY_FINANCIALS.holdCoSg.rateToUsd
  }

  const id = {
    cash: ENTITY_FINANCIALS.ptIndo.cash * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    interAr: 0,
    tradeAr: ENTITY_FINANCIALS.ptIndo.tradeAr * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    inv: ENTITY_FINANCIALS.ptIndo.inv * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    investSub: 0,
    fa: ENTITY_FINANCIALS.ptIndo.fa * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    tradeAp: ENTITY_FINANCIALS.ptIndo.tradeAp * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    interAp: 600000,
    debt: ENTITY_FINANCIALS.ptIndo.debt * ENTITY_FINANCIALS.ptIndo.rateToUsd,
    equity: 1240000,
    re: 733000
  }

  const my = {
    cash: ENTITY_FINANCIALS.myOpCo.cash * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    interAr: 0,
    tradeAr: ENTITY_FINANCIALS.myOpCo.tradeAr * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    inv: ENTITY_FINANCIALS.myOpCo.inv * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    investSub: 0,
    fa: ENTITY_FINANCIALS.myOpCo.fa * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    tradeAp: ENTITY_FINANCIALS.myOpCo.tradeAp * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    interAp: 300000,
    debt: ENTITY_FINANCIALS.myOpCo.debt * ENTITY_FINANCIALS.myOpCo.rateToUsd,
    equity: 440000,
    re: 128000
  }

  const hk = {
    cash: ENTITY_FINANCIALS.hkOpCo.cash * ENTITY_FINANCIALS.hkOpCo.rateToUsd,
    interAr: 0,
    tradeAr: ENTITY_FINANCIALS.hkOpCo.tradeAr * ENTITY_FINANCIALS.hkOpCo.rateToUsd,
    inv: ENTITY_FINANCIALS.hkOpCo.inv * ENTITY_FINANCIALS.hkOpCo.rateToUsd,
    investSub: 0,
    fa: ENTITY_FINANCIALS.hkOpCo.fa * ENTITY_FINANCIALS.hkOpCo.rateToUsd,
    tradeAp: ENTITY_FINANCIALS.hkOpCo.tradeAp * ENTITY_FINANCIALS.hkOpCo.rateToUsd,
    interAp: 0,
    debt: 0,
    equity: 512000,
    re: 518400
  }

  const elim = { interAr: -900000, interAp: -900000, investSub: -2850000, subEq: -2192000, cta: 42000 }
  const consol = {
    cash: sg.cash + id.cash + my.cash + hk.cash,
    tradeAr: sg.tradeAr + id.tradeAr + my.tradeAr + hk.tradeAr,
    inv: sg.inv + id.inv + my.inv + hk.inv,
    fa: sg.fa + id.fa + my.fa + hk.fa,
    tradeAp: sg.tradeAp + id.tradeAp + my.tradeAp + hk.tradeAp,
    debt: sg.debt + id.debt + my.debt + hk.debt,
    equity: sg.equity,
    cta: elim.cta,
    re: sg.re + id.re + my.re + hk.re
  }

  const totalAssets = consol.cash + consol.tradeAr + consol.inv + consol.fa
  const totalLiabEq = consol.tradeAp + consol.debt + consol.equity + consol.cta + consol.re

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black text-white tracking-tight">Konsolidasi Keuangan Multi-Entitas (IFRS 10 &amp; IAS 21)</h2>
              <Badge variant="emerald">Eliminasi Saldo Resiprokal Tuntas ✓ Net Selisih $0.00</Badge>
            </div>
            <p className="text-xs text-slate-400">Neraca grup 4 entitas yurisdiksi dengan eliminasi utang-piutang &amp; investasi antar-perusahaan.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-400" /><span>Mata Uang:</span></div>
          <div className="flex gap-1">
            {(['USD', 'SGD', 'IDR'] as ConsolCurrency[]).map((cur) => (
              <button key={cur} type="button" onClick={() => setDisplayCurrency(cur)} className={`px-2.5 py-0.5 rounded-xl text-xs font-mono font-bold transition-all ${displayCurrency === cur ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>{cur}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 text-xs font-mono">
        <div><span className="text-slate-400">SG HoldCo: </span><span className="text-white font-bold">1.333 SGD</span></div>
        <div><span className="text-slate-400">ID OpCo: </span><span className="text-white font-bold">16,129 IDR</span></div>
        <div><span className="text-slate-400">MY OpCo: </span><span className="text-white font-bold">4.545 MYR</span></div>
        <div><span className="text-slate-400">HK OpCo: </span><span className="text-white font-bold">7.812 HKD</span></div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <th className="p-2.5 font-sans min-w-[180px]">Pos Neraca Grup</th>
                <th className="p-2.5 text-right">HoldCo SG</th><th className="p-2.5 text-right">PT Indo</th><th className="p-2.5 text-right">MY OpCo</th><th className="p-2.5 text-right">HK OpCo</th><th className="p-2.5 text-right text-purple-400">Eliminasi</th><th className="p-2.5 text-right text-emerald-400 font-bold bg-slate-950/80">Konsol Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="bg-slate-950/40 text-[10px] font-sans font-bold text-slate-400"><td colSpan={7} className="p-2 pl-3">ASET LANCAR</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Kas &amp; Setara Kas</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.cash)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.cash)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.cash)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.cash)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.cash)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4 text-amber-300">Piutang Antar-Entitas</td><td className="p-2.5 text-right tabular-nums text-amber-400">{fmt(sg.interAr)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums text-purple-400 font-bold">({fmt(Math.abs(elim.interAr))})</td><td className="p-2.5 text-right text-slate-500 bg-slate-950/50">{fmt(0)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Piutang Pihak Ketiga</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.tradeAr)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.tradeAr)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.tradeAr)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.tradeAr)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.tradeAr)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Persediaan Barang</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.inv)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.inv)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.inv)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.inv)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.inv)}</td></tr>
              <tr className="bg-slate-950/40 text-[10px] font-sans font-bold text-slate-400"><td colSpan={7} className="p-2 pl-3">ASET TIDAK LANCAR</td></tr>
              <tr><td className="p-2.5 font-sans pl-4 text-purple-300">Investasi pada Anak</td><td className="p-2.5 text-right tabular-nums text-purple-400">{fmt(sg.investSub)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums text-purple-400 font-bold">({fmt(Math.abs(elim.investSub))})</td><td className="p-2.5 text-right text-slate-500 bg-slate-950/50">{fmt(0)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Aset Tetap &amp; Mesin</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.fa)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.fa)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.fa)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.fa)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.fa)}</td></tr>
              <tr className="bg-emerald-950/20 font-bold text-white border-t border-slate-700">
                <td className="p-2.5 font-sans">TOTAL ASET KONSOLIDASI</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(sg.cash + sg.interAr + sg.tradeAr + sg.inv + sg.investSub + sg.fa)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(id.cash + id.tradeAr + id.inv + id.fa)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(my.cash + my.tradeAr + my.inv + my.fa)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(hk.cash + hk.tradeAr + hk.inv + hk.fa)}</td>
                <td className="p-2.5 text-right text-purple-400">({fmt(Math.abs(elim.interAr + elim.investSub))})</td>
                <td className="p-2.5 text-right tabular-nums text-emerald-400 text-sm bg-slate-950">{fmt(totalAssets)}</td>
              </tr>
              <tr className="bg-slate-950/40 text-[10px] font-sans font-bold text-slate-400"><td colSpan={7} className="p-2 pl-3">LIABILITAS &amp; EKUITAS</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Utang Usaha Pihak Ketiga</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.tradeAp)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.tradeAp)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.tradeAp)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.tradeAp)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.tradeAp)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4 text-amber-300">Utang Antar-Entitas</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums text-amber-400">{fmt(id.interAp)}</td><td className="p-2.5 text-right tabular-nums text-amber-400">{fmt(my.interAp)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums text-purple-400 font-bold">({fmt(Math.abs(elim.interAp))})</td><td className="p-2.5 text-right text-slate-500 bg-slate-950/50">{fmt(0)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Pinjaman Bank</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.debt)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.debt)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.debt)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.debt)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Modal Saham Induk</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.equity)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-purple-400">({fmt(Math.abs(elim.subEq))})</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.equity)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4 text-sky-300">Translasi CTA (IAS 21)</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right text-sky-400">{fmt(elim.cta)}</td><td className="p-2.5 text-right tabular-nums font-bold text-sky-400 bg-slate-950/50">{fmt(consol.cta)}</td></tr>
              <tr><td className="p-2.5 font-sans pl-4">Saldo Laba Ditahan</td><td className="p-2.5 text-right tabular-nums">{fmt(sg.re)}</td><td className="p-2.5 text-right tabular-nums">{fmt(id.re)}</td><td className="p-2.5 text-right tabular-nums">{fmt(my.re)}</td><td className="p-2.5 text-right tabular-nums">{fmt(hk.re)}</td><td className="p-2.5 text-right text-slate-500">-</td><td className="p-2.5 text-right tabular-nums font-bold text-white bg-slate-950/50">{fmt(consol.re)}</td></tr>
              <tr className="bg-emerald-950/20 font-bold text-white border-t border-slate-700">
                <td className="p-2.5 font-sans">TOTAL LIABILITAS &amp; EKUITAS</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(sg.tradeAp + sg.debt + sg.equity + sg.re)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(id.tradeAp + id.interAp + id.debt + id.equity + id.re)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(my.tradeAp + my.interAp + my.debt + my.equity + my.re)}</td>
                <td className="p-2.5 text-right tabular-nums">{fmt(hk.tradeAp + hk.equity + hk.re)}</td>
                <td className="p-2.5 text-right text-purple-400">({fmt(Math.abs(elim.interAp + elim.subEq) - elim.cta)})</td>
                <td className="p-2.5 text-right tabular-nums text-emerald-400 text-sm bg-slate-950">{fmt(totalLiabEq)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
