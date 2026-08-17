import React from 'react';
import { Card, Button } from '../../ui';

interface GameActionControlsProps {
  speed: '1x' | '2x' | '5x' | 'PAUSE';
  onSetSpeed: (s: '1x' | '2x' | '5x' | 'PAUSE') => void;
  onOpenCardTapModal: () => void;
  onSpawnRushHour: () => void;
  onRestockBOM: () => void;
  onRunMonthEndClose: () => void;
}

export const GameActionControls: React.FC<GameActionControlsProps> = ({
  speed,
  onSetSpeed,
  onOpenCardTapModal,
  onSpawnRushHour,
  onRestockBOM,
  onRunMonthEndClose,
}) => {
  return (
    <Card className="p-3 bg-slate-900 border-slate-800 text-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2">⚡ Speed:</span>
          {(['PAUSE', '1x', '2x', '5x'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-all ${
                speed === s
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s === 'PAUSE' ? '⏸️' : s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenCardTapModal}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8"
          >
            🪪 Tap Kartu Identitas
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onSpawnRushHour}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs h-8"
          >
            🔥 Trigger Rush Hour
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onRestockBOM}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs h-8"
          >
            📦 Roasting 100kg BOM
          </Button>

          <Button
            size="sm"
            onClick={onRunMonthEndClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8"
          >
            🔒 Tutup Buku Bulanan
          </Button>
        </div>
      </div>
    </Card>
  );
};
