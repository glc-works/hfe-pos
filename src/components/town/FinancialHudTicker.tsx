import React from 'react';
import { Card, Badge, PriceTag } from '../../ui';

interface FinancialHudTickerProps {
  cashMinor: number;
  todaySalesMinor: number;
  inventoryKg: number;
  retainedEarningsMinor: number;
  totalAssetsMinor: number;
  isDebitsCreditsMatched: boolean;
  activePeriodLabel: string;
}

export const FinancialHudTicker: React.FC<FinancialHudTickerProps> = ({
  cashMinor,
  todaySalesMinor,
  inventoryKg,
  retainedEarningsMinor,
  totalAssetsMinor,
  isDebitsCreditsMatched,
  activePeriodLabel,
}) => {
  return (
    <Card className="p-3 bg-slate-900/95 border-slate-800 text-white shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Live Accounting & Balance Sheet Ticker
          </span>
          <Badge
            variant="outline"
            className={
              isDebitsCreditsMatched
                ? 'text-emerald-400 border-emerald-500/40 text-[10px]'
                : 'text-rose-400 border-rose-500/40 text-[10px]'
            }
          >
            {isDebitsCreditsMatched ? 'Debits == Credits ✓' : 'Imbalance Alert ⚠️'}
          </Badge>
        </div>
        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          🏛️ {activePeriodLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5">
        <div className="p-2 rounded bg-slate-800/70 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">💵 Kas di Tangan & Laci</div>
          <PriceTag amount={cashMinor} className="text-sm font-bold text-emerald-400" />
        </div>

        <div className="p-2 rounded bg-slate-800/70 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">📈 Penjualan Hari Ini</div>
          <PriceTag amount={todaySalesMinor} className="text-sm font-bold text-sky-400" />
        </div>

        <div className="p-2 rounded bg-slate-800/70 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">📦 Stok Biji Kopi Matang</div>
          <div className="text-sm font-bold font-mono text-amber-300 tabular-nums">
            {inventoryKg} <span className="text-xs font-normal text-slate-400">Kg Ready</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-800/70 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 font-medium">🏛️ Akumulasi Laba Ditahan</div>
          <PriceTag amount={retainedEarningsMinor} className="text-sm font-bold text-purple-400" />
        </div>
      </div>
    </Card>
  );
};
