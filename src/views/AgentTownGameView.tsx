import React, { useState, useEffect, useCallback } from 'react';
import {
  TownCanvasMap,
  CardTapIdentityModal,
  FinancialHudTicker,
  GameActionControls,
  CardIdentityItem,
} from '@/components/town';
import { TableCard } from '@/components/shared/TableCard';
import { PriceTag, Badge, Button, Card } from '@/ui';
import { TableStatus } from '@/types/pos';

const INITIAL_TABLES: TableStatus[] = [
  {
    id: 't-01',
    name: 'T-01 (Bar Table)',
    status: 'occupied',
    customerName: 'Bpk. Budi Pratama',
    totalBill: 120000,
    orderCount: 3,
    seatedGuests: 3,
    maxCapacity: 4,
    seatedDurationMinutes: 25,
  },
  {
    id: 't-02',
    name: 'T-02 (Window Booth)',
    status: 'free',
    totalBill: 0,
    orderCount: 0,
    seatedGuests: 0,
    maxCapacity: 2,
    seatedDurationMinutes: 0,
  },
  {
    id: 't-03',
    name: 'T-03 (VIP Lounge)',
    status: 'occupied',
    customerName: 'Bpk. Alexander III',
    zoneId: 'vip-private',
    minSpend: 500000,
    totalBill: 450000,
    orderCount: 5,
    seatedGuests: 4,
    maxCapacity: 6,
    seatedDurationMinutes: 45,
  },
  {
    id: 't-04',
    name: 'T-04 (Outdoor Garden)',
    status: 'billing',
    customerName: 'Ibu Ratna Dewi',
    totalBill: 185000,
    orderCount: 2,
    seatedGuests: 2,
    maxCapacity: 4,
    seatedDurationMinutes: 60,
  },
];

export const AgentTownGameView: React.FC = () => {
  // Game & Financial State
  const [day, setDay] = useState<number>(1);
  const [timeHour, setTimeHour] = useState<number>(8);
  const [speed, setSpeed] = useState<'1x' | '2x' | '5x' | 'PAUSE'>('1x');
  const [cashBalance, setCashBalance] = useState<number>(500000);
  const [todaySales, setTodaySales] = useState<number>(755000);
  const [inventoryKg, setInventoryKg] = useState<number>(42);
  const [retainedEarnings, setRetainedEarnings] = useState<number>(12500000);
  const [activeTables, setActiveTables] = useState<TableStatus[]>(INITIAL_TABLES);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [activeCardPersona, setActiveCardPersona] = useState<string>('Siti Rahma (Head Cashier)');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([
    '🌟 [08:00] Selamat datang di World.Hfeit — Living Commercial Simulator & UI Testbed!',
    '☕ [08:15] Barista Siti menyapa Bpk. Alexander di Meja 03: "Pagi Pak, V60 Gayo spesial hari ini?"',
    '📜 [08:30] Saldo laci kas awal Rp 500.000 terverifikasi. Debits == Credits klop $0.00.',
    '⚠️ [11:30] SIDAK BAPENDA: Petugas Pajak memeriksa setoran PB1 10%... Hasil: 100% Klop!',
    '📦 [14:00] Truk Roastery Mas Agus tiba membawa 85kg biji kopi. Terselip surat wasiat rahasia...',
  ]);

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogMessages((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 19)]);
  }, []);

  // Time loop ticker based on speed
  useEffect(() => {
    if (speed === 'PAUSE') return;
    const intervalMs = speed === '1x' ? 3000 : speed === '2x' ? 1500 : 600;

    const timer = setInterval(() => {
      setTimeHour((prevHour) => {
        if (prevHour >= 22) {
          setDay((prevDay) => {
            const nextDay = prevDay + 1;
            addLog(`📅 Pergantian Hari! Memasuki Day ${nextDay} operasional.`);
            return nextDay;
          });
          return 8;
        }
        return prevHour + 1;
      });

      // Update table elapsed timers
      setActiveTables((prev) =>
        prev.map((t) => (t.status !== 'free' ? { ...t, seatedDurationMinutes: (t.seatedDurationMinutes || 0) + 10 } : t))
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [speed, addLog]);

  // Event Handlers
  const handleTapCard = (card: CardIdentityItem) => {
    setActiveCardPersona(`${card.holderName} (${card.role})`);
    addLog(`🪪 [NFC TAP] Operator beralih ke: ${card.holderName} [${card.role}] via ${card.id}`);
  };

  const handleSpawnRushHour = () => {
    setActiveTables([
      {
        id: 't-01',
        name: 'T-01 (Bar Table)',
        status: 'occupied',
        customerName: 'Bpk. Budi Pratama',
        totalBill: 210000,
        orderCount: 4,
        seatedGuests: 4,
        maxCapacity: 4,
        seatedDurationMinutes: 35,
      },
      {
        id: 't-02',
        name: 'T-02 (Window Booth)',
        status: 'occupied',
        customerName: 'Nona Cindy & Rekan',
        totalBill: 165000,
        orderCount: 3,
        seatedGuests: 2,
        maxCapacity: 2,
        seatedDurationMinutes: 15,
      },
      {
        id: 't-03',
        name: 'T-03 (VIP Lounge)',
        status: 'occupied',
        customerName: 'Bpk. Alexander III (VIP)',
        zoneId: 'vip-private',
        minSpend: 500000,
        totalBill: 580000,
        orderCount: 6,
        seatedGuests: 5,
        maxCapacity: 6,
        seatedDurationMinutes: 50,
      },
      {
        id: 't-04',
        name: 'T-04 (Outdoor Garden)',
        status: 'billing',
        customerName: 'Ibu Ratna Dewi',
        totalBill: 290000,
        orderCount: 3,
        seatedGuests: 4,
        maxCapacity: 4,
        seatedDurationMinutes: 75,
      },
    ]);
    const addedSales = 650000;
    setTodaySales((prev) => prev + addedSales);
    setCashBalance((prev) => prev + addedSales);
    setInventoryKg((prev) => Math.max(0, prev - 4));
    addLog(`🔥 [RUSH HOUR] 4 Meja Kafe terisi penuh! Penjualan +Rp ${addedSales.toLocaleString('id-ID')}, Stok -4kg.`);
  };

  const handleRestockBOM = () => {
    const cost = 350000;
    if (cashBalance < cost) {
      addLog('⚠️ [BOM FAILED] Kas tidak mencukupi untuk biaya roasting!');
      return;
    }
    setCashBalance((prev) => prev - cost);
    setInventoryKg((prev) => prev + 85);
    addLog(`📦 [BOM ROASTING] 100kg Green Beans di-roasting (susut 15%). +85kg Biji Matang siap. Kas -Rp ${cost.toLocaleString('id-ID')}.`);
  };

  const handleRunMonthEndClose = () => {
    setDay(31);
    setRetainedEarnings((prev) => prev + todaySales);
    setTodaySales(0);
    addLog(`🔒 [MONTH-END CLOSE] Tutup Buku Bulanan Day 31 selesai! Laba di-rollover ke Laba Ditahan. TigerBeetle Journal WTP Sealed ✓`);
  };

  const totalAssets = cashBalance + inventoryKg * 150000 + retainedEarnings;
  const occupiedCount = activeTables.filter((t) => t.status !== 'free').length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-2 sm:p-4 gap-3">
      {/* 1. TOP FINANCIAL HUD TICKER */}
      <FinancialHudTicker
        cashMinor={cashBalance}
        todaySalesMinor={todaySales}
        inventoryKg={inventoryKg}
        retainedEarningsMinor={retainedEarnings}
        totalAssetsMinor={totalAssets}
        isDebitsCreditsMatched={true}
        activePeriodLabel={`Day ${day} • ${String(timeHour).padStart(2, '0')}:00 WIB`}
      />

      {/* 2. OPERATOR CONTEXT STATUS STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">👤 Operator Aktif:</span>
          <Badge variant="outline" className="text-amber-300 border-amber-500/40 bg-amber-500/10 font-mono text-[11px]">
            {activeCardPersona}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Status Meja:</span>
          <span className="font-mono text-emerald-400 font-bold">{occupiedCount}/4 Terisi</span>
          <Button
            size="sm"
            onClick={() => setIsCardModalOpen(true)}
            className="h-6 text-[11px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            🪪 Switch Operator
          </Button>
        </div>
      </div>

      {/* 3. CENTER SPLIT: TOWN CANVAS MAP (LEFT) & REAL LIVING TABLE CARDS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* CENTER LEFT: Town Canvas Map */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <TownCanvasMap
            day={day}
            timeHour={timeHour}
            cashBalance={cashBalance}
            inventoryKg={inventoryKg}
            activeActorsCount={occupiedCount + 2}
            onSelectLocation={(loc) => addLog(`📍 Inspeksi lokasi kota: ${loc}`)}
          />
        </div>

        {/* CENTER RIGHT: Real Mounted Living Table Cards for Live DOM Testing */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <Card className="p-3 bg-slate-900 border-slate-800 text-white shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm">🍽️</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Living Table Cards (DOM Testbed)
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-sky-400 border-sky-500/40">
                4-Quadrant Matrix
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-2.5 flex-1">
              {activeTables.map((tbl) => (
                <TableCard
                  key={tbl.id}
                  table={tbl}
                  isSelected={selectedTableId === tbl.id}
                  onClick={() => {
                    setSelectedTableId(tbl.id);
                    addLog(`🔎 Meja ${tbl.name} dipilih untuk inspeksi.`);
                  }}
                  onOpenOpsModal={(e) => {
                    e.stopPropagation();
                    addLog(`⚙️ Opsi Meja ${tbl.name} dibuka.`);
                  }}
                />
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Standard: Capacity Ratio & Tabular Nums</span>
              <span className="text-amber-400 font-mono">👥 seatedGuests/maxCapacity</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. BOTTOM CONTROLS & LIVE EVENT LOG */}
      <div className="flex flex-col gap-2">
        <GameActionControls
          speed={speed}
          onSetSpeed={(s) => {
            setSpeed(s);
            addLog(`⚡ Kecepatan simulasi diubah ke: ${s}`);
          }}
          onOpenCardTapModal={() => setIsCardModalOpen(true)}
          onSpawnRushHour={handleSpawnRushHour}
          onRestockBOM={handleRestockBOM}
          onRunMonthEndClose={handleRunMonthEndClose}
        />

        {/* Live Event Feed */}
        <Card className="p-3 bg-slate-900/90 border-slate-800 text-white shadow-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>📜</span> Live Tycoon & Accounting Event Feed
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Event Bus</span>
          </div>
          <div className="space-y-1 max-h-28 overflow-y-auto font-mono text-[11px] text-slate-300">
            {logMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`py-0.5 px-1.5 rounded transition-colors ${
                  idx === 0 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5. NFC DUAL-PERSONA TAP MODAL */}
      <CardTapIdentityModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onTapCard={handleTapCard}
      />
    </div>
  );
};
