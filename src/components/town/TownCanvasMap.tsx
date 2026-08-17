import React, { useEffect, useRef } from 'react';
import { Card, Badge } from '../../ui';

interface TownCanvasMapProps {
  day: number;
  timeHour: number;
  cashBalance: number;
  inventoryKg: number;
  activeActorsCount: number;
  onSelectLocation: (loc: string) => void;
}

export const TownCanvasMap: React.FC<TownCanvasMapProps> = ({
  day,
  timeHour,
  cashBalance,
  inventoryKg,
  activeActorsCount,
  onSelectLocation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Clear background (Dark modern theme grid)
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, height);

      // Draw subtle isometric grid lines
      ctx.strokeStyle = '#1e293b'; // slate-800
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Road connection
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(80, 100);
      ctx.lineTo(width / 2, 100);
      ctx.lineTo(width / 2, height - 90);
      ctx.lineTo(width - 80, height - 90);
      ctx.stroke();

      // Location 1: ☕ Kafe BSD (Focal Center)
      const cafeX = width / 2;
      const cafeY = 100;
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.beginPath();
      ctx.roundRect(cafeX - 55, cafeY - 35, 110, 70, 8);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☕ KAFE BSD', cafeX, cafeY - 8);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('Cashier & Tables', cafeX, cafeY + 10);

      // Location 2: 🏭 Pabrik Roastery (Top Left)
      const factoryX = 80;
      const factoryY = 100;
      ctx.fillStyle = '#0284c7'; // sky-600
      ctx.beginPath();
      ctx.roundRect(factoryX - 50, factoryY - 35, 100, 70, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🏭 ROASTERY', factoryX, factoryY - 8);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`${inventoryKg}kg Ready`, factoryX, factoryY + 10);

      // Location 3: 🌾 Kebun Kopi Gayo (Bottom Right)
      const farmX = width - 80;
      const farmY = height - 90;
      ctx.fillStyle = '#16a34a'; // emerald-600
      ctx.beginPath();
      ctx.roundRect(farmX - 50, farmY - 35, 100, 70, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🌾 GAYO 50-HA', farmX, farmY - 8);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('PSAK 69 Trees', farmX, farmY + 10);

      // Moving Delivery Truck (Animated along road)
      const truckPos = (Math.sin(tick * 0.5) + 1) / 2; // 0 to 1
      const truckX = 80 + truckPos * (width / 2 - 80);
      const truckY = 100;
      ctx.fillStyle = '#e11d48'; // rose-600
      ctx.beginPath();
      ctx.roundRect(truckX - 10, truckY - 6, 20, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.fillText('🚚', truckX, truckY + 3);

      // Moving Guest Sprites (Around Cafe)
      for (let i = 0; i < Math.min(activeActorsCount, 5); i++) {
        const angle = tick + (i * Math.PI) / 2.5;
        const radius = 55 + (i % 2) * 15;
        const guestX = cafeX + Math.cos(angle) * radius;
        const guestY = cafeY + Math.sin(angle) * (radius * 0.6);

        ctx.fillStyle = i === 0 ? '#fbbf24' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(guestX, guestY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Speech bubble simulation
        if (i === 0 && Math.sin(tick * 2) > 0.5) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(guestX - 25, guestY - 24, 50, 16, 4);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = '9px Inter, sans-serif';
          ctx.fillText('Order V60!', guestX, guestY - 12);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inventoryKg, activeActorsCount]);

  return (
    <Card className="p-3 bg-slate-900 border-slate-800 text-white relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🗺️</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            BSD City Commercial Map & Living Simulator
          </h3>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
            60 FPS Live Canvas
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-amber-400">📅 Day {day}</span>
          <span className="text-slate-400">⏱️ {String(timeHour).padStart(2, '0')}:00 WIB</span>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={260}
          className="w-full h-[220px] sm:h-[260px] object-cover cursor-pointer block"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width * 0.33) onSelectLocation('ROASTERY');
            else if (x > rect.width * 0.66) onSelectLocation('GAYO_PLANTATION');
            else onSelectLocation('BSD_CAFE');
          }}
        />
        <div className="absolute bottom-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
            👆 Klik lokasi di peta untuk inspeksi cepat
          </span>
        </div>
      </div>
    </Card>
  );
};
