import React, { useState, useEffect } from 'react'
import { Wine, Clock, GlassWater, Award, Search, Sparkles, CheckCircle2 } from 'lucide-react'
import { fetchCellarBottles, pourWineBottle, WineCellarBottle } from '../services/hfeApi'

export const SommelierView: React.FC = () => {
  const [wines, setWines] = useState<WineCellarBottle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [decantTimer, setDecantTimer] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [pourNotice, setPourNotice] = useState<string | null>(null)

  useEffect(() => {
    async function loadCellar() {
      const data = await fetchCellarBottles()
      setWines(data)
      setLoading(false)
    }
    loadCellar()
  }, [])

  // Decanting Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && decantTimer !== null && decantTimer > 0) {
      interval = setInterval(() => {
        setDecantTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, decantTimer])

  const handleStartDecanting = (minutes: number) => {
    setDecantTimer(minutes * 60)
    setTimerActive(true)
  }

  const handlePourWine = async (bottleId: string, pourType: 'glass' | 'bottle') => {
    const res = await pourWineBottle(bottleId, pourType, 1)
    setWines(prev => prev.map(w => w.id === bottleId ? { ...w, stockBottles: res.remainingBottles } : w))
    setPourNotice(`Penuangan berhasil! Terdeduksi ${pourType === 'glass' ? '1 Gelas (0.2 Botol)' : '1 Botol'}. Sisa botol: ${res.remainingBottles}`)
  }

  const filteredWines = wines.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.recommendedPairing.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimerSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Sommelier Digital Wine List & Cellar Control</h1>
            <p className="text-xs text-slate-400">Katalog Vintage Wine, Pairing Suggestion, & Decanting Pacing</p>
          </div>
        </div>

        {/* Decanting Timer Widget */}
        <div className="bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-2 flex items-center gap-3">
          <Clock className="w-4 h-4 text-purple-400 animate-spin" />
          <div>
            <span className="text-[10px] text-slate-400 block">Timer Decanting Aerasi</span>
            <span className="text-sm font-mono font-bold text-purple-400">
              {decantTimer !== null ? formatTimerSeconds(decantTimer) : '00:00'}
            </span>
          </div>
        </div>
      </div>

      {pourNotice && (
        <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{pourNotice}</span>
        </div>
      )}

      {/* Wine Catalog Grid */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari wine, vintage, region, atau pairing hidangan..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Memuat data Wine Cellar...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWines.map((wine) => (
              <div key={wine.id} className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{wine.region}</span>
                      <h2 className="text-sm font-bold text-white">{wine.name} ({wine.vintage})</h2>
                      <p className="text-[11px] text-slate-400">{wine.producer}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-bold">
                      <Award className="w-3.5 h-3.5" /> {wine.rating}/100
                    </div>
                  </div>

                  {/* Tasting Notes */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {wine.flavorProfile.map((note, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-[10px] rounded-md border border-slate-800">
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Pairing Recommendation */}
                  <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Rekomendasi Pairing Chef:
                    </span>
                    <p className="text-xs text-slate-200">{wine.recommendedPairing}</p>
                  </div>
                </div>

                {/* Pouring & Decanting Actions */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Stok Cellar: <span className="text-white font-bold">{wine.stockBottles} Botol (~{Math.round(wine.stockBottles * 5)} Gelas)</span></span>
                    <button
                      onClick={() => handleStartDecanting(wine.decantTimeMinutes)}
                      className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" /> Decant {wine.decantTimeMinutes} Min
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePourWine(wine.id, 'glass')}
                      className="py-2 bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <GlassWater className="w-3.5 h-3.5" /> Tuang 1 Gelas
                    </button>
                    <button
                      onClick={() => handlePourWine(wine.id, 'bottle')}
                      className="py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Wine className="w-3.5 h-3.5" /> Buka 1 Botol
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
