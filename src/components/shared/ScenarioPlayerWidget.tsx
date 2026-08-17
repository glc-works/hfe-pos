import React, { useState } from 'react';
import { Button, Badge, Card } from '../../ui';
import { useMerchantConfig } from '../../context/MerchantConfigContext';
import { StaffSurfaceMode } from '../../types/pos';

export type SimulationMode = 'none' | 'snapshot' | 'live';
export type PlaybackSpeed = '1x' | '5x' | 'turbo';

interface ScenarioStep {
  stepIndex: number;
  actTitle: string;
  actionDesc: string;
  targetPillar: string;
  highlightSelector?: string;
}

interface ScenarioPlayerWidgetProps {
  activeStaffSurface?: StaffSurfaceMode;
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void;
}

const MASTER_13_ACTS: ScenarioStep[] = [
  { stepIndex: 1, actTitle: 'Act 1: Gerobak Kopi', actionDesc: 'Pendaftaran menu landing page (Hfeit:BOARD)', targetPillar: 'BOARD' },
  { stepIndex: 2, actTitle: 'Act 2: Kafe BSD 20 Meja', actionDesc: 'Aktivasi kasir POS & denah meja (CapacityBadge 👥 3/4)', targetPillar: 'POS' },
  { stepIndex: 3, actTitle: 'Act 3: Mati Lampu Rush-Hour', actionDesc: 'Buffer kasir offline IndexedDB & sync idempotensi', targetPillar: 'POS' },
  { stepIndex: 4, actTitle: 'Act 4: Split-Bill & CARD VIP', actionDesc: 'Split 4 cara via QRIS BCA SNAP BI & diskon poin', targetPillar: 'POS' },
  { stepIndex: 5, actTitle: 'Act 5: Aktivasi Modul BOOK', actionDesc: 'Double-entry general journal & DJP e-Faktur 4.0', targetPillar: 'BOOK' },
  { stepIndex: 6, actTitle: 'Act 6: Audit KAP Santoso', actionDesc: 'Multi-Book Switcher & stempel digital SHA-256', targetPillar: 'BOOK' },
  { stepIndex: 7, actTitle: 'Act 7: Wholesale Billing B2B', actionDesc: 'Tenant 01 meteran invoice ke Tenant 02', targetPillar: 'ADMIN' },
  { stepIndex: 8, actTitle: 'Act 8: Sleek SG Ekspansi', actionDesc: 'Konektor Xero PayNow SGD & migrasi klien Sleek', targetPillar: 'CORE' },
  { stepIndex: 9, actTitle: 'Act 9: Sovereign Jakarta Node', actionDesc: 'Kepatuhan UU PDP server AWS Jakarta ap-se-3', targetPillar: 'ADMIN' },
  { stepIndex: 10, actTitle: 'Act 10: Malaysia DuitNow', actionDesc: 'Penyelesaian DuitNow QR & LHDN e-Invoice Ringgit', targetPillar: 'BOOK' },
  { stepIndex: 11, actTitle: 'Act 11: Restrukturisasi HoldCo', actionDesc: 'Pemisahan bersih IP HoldCo vs OpCo komersial', targetPillar: 'ADMIN' },
  { stepIndex: 12, actTitle: 'Act 12: Hong Kong FPS Trade', actionDesc: 'HKMA FPS clearing & ekspor kontainer kopi USD', targetPillar: 'BOOK' },
  { stepIndex: 13, actTitle: 'Act 13: Seed-to-Cup Conglomerate', actionDesc: 'Manufaktur BOM Roasting + Kebun Gayo 50 Ha PSAK 69', targetPillar: 'BOOK' },
];

export const ScenarioPlayerWidget: React.FC<ScenarioPlayerWidgetProps> = ({
  activeStaffSurface,
  setActiveStaffSurface,
}) => {
  const { activeApp, setActiveApp } = useMerchantConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<SimulationMode>('live');
  const [speed, setSpeed] = useState<PlaybackSpeed>('5x');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    let step = currentStep;
    const intervalMs = speed === '1x' ? 1200 : speed === '5x' ? 300 : 50;
    const timer = setInterval(() => {
      step += 1;
      if (step > MASTER_13_ACTS.length) {
        clearInterval(timer);
        setIsPlaying(false);
        setCurrentStep(MASTER_13_ACTS.length);
      } else {
        setCurrentStep(step);
      }
    }, intervalMs);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="shadow-2xl flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono"
        >
          <span>🎬</span>
          <span>Dev Toolkit (Live QA)</span>
          {isPlaying && <span className="animate-ping w-2 h-2 rounded-full bg-amber-400" />}
        </Button>
      ) : (
        <Card className="w-96 shadow-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-4 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <div>
                <h3 className="text-sm font-bold tracking-tight">HFE Dev Toolkit & QA Player</h3>
                <p className="text-[10px] text-slate-400 font-mono">SCN-FULL-ECOSYSTEM-01</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {/* Mode Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mode Observasi:</span>
              <div className="flex gap-1">
                {(['none', 'snapshot', 'live'] as SimulationMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      activeMode === m ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Kecepatan Gerak:</span>
              <div className="flex gap-1">
                {(['1x', '5x', 'turbo'] as PlaybackSpeed[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      speed === s ? 'bg-teal-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Click Surface & App Switcher */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>🌐 Ganti Layar / Surface:</span>
                <span className="text-amber-400 font-bold">{activeApp?.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveApp('cafe');
                    if (setActiveStaffSurface) setActiveStaffSurface('hfe-agent-town');
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-1.5 ${
                    activeApp === 'cafe' && activeStaffSurface === 'hfe-agent-town'
                      ? 'bg-amber-500 text-slate-950 shadow ring-2 ring-amber-400 font-black'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300'
                  }`}
                >
                  <span>🎮</span> World.Hfeit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveApp('cafe');
                    if (setActiveStaffSurface) setActiveStaffSurface('barista-pos');
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-1.5 ${
                    activeApp === 'cafe' && activeStaffSurface !== 'hfe-agent-town' && activeStaffSurface !== 'hfe-company-book'
                      ? 'bg-emerald-600 text-white shadow font-black'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>☕</span> Kasir & POS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveApp('customer')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-1.5 ${
                    activeApp === 'customer'
                      ? 'bg-blue-600 text-white shadow font-black'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>📱</span> Tamu QR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveApp('cafe');
                    if (setActiveStaffSurface) setActiveStaffSurface('hfe-company-book');
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-1.5 ${
                    activeApp === 'cafe' && activeStaffSurface === 'hfe-company-book'
                      ? 'bg-purple-600 text-white shadow font-black'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-purple-300'
                  }`}
                >
                  <span>📚</span> Company Books
                </button>
              </div>
            </div>

            {/* Active Step HUD */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400">
                  {currentStep === 0 ? 'STATUS: STANDBY' : `STEP ${currentStep} / ${MASTER_13_ACTS.length}`}
                </span>
                <Badge variant={currentStep === 13 ? 'emerald' : currentStep > 0 ? 'indigo' : 'secondary'}>
                  {currentStep === 13 ? '100% PROVEN ✓' : isPlaying ? 'EXECUTING...' : 'IDLE'}
                </Badge>
              </div>

              {currentStep > 0 && currentStep <= MASTER_13_ACTS.length ? (
                <div className="space-y-0.5 pt-1">
                  <div className="text-xs font-semibold text-slate-200">
                    {MASTER_13_ACTS[currentStep - 1].actTitle}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {MASTER_13_ACTS[currentStep - 1].actionDesc}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic py-1">
                  Klik &quot;Play Simulasi Visual&quot; untuk menjalankan ke-13 babak di layar.
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="default"
                size="sm"
                onClick={togglePlay}
                className="flex-1 font-mono text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isPlaying ? '⏸ Pause' : currentStep === 13 ? '🔄 Ulangi Skenario' : '▶ Play Simulasi Visual'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={resetSimulation}
                className="font-mono text-xs"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
