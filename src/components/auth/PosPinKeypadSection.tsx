import React from 'react'
import { Store, Lock, ShieldAlert, CheckCircle, MapPin } from 'lucide-react'

export interface PosPinKeypadSectionProps {
  pin: string
  onKeypadPress: (val: string) => void
  onLoginSubmit: (e: React.FormEvent) => void
  loading: boolean
  isCooldownActive: boolean
  cooldownSeconds: number
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  branches: { id: string; name: string }[]
  errorMessage: string | null
  successMessage: string | null
}

export const PosPinKeypadSection: React.FC<PosPinKeypadSectionProps> = ({
  pin,
  onKeypadPress,
  onLoginSubmit,
  loading,
  isCooldownActive,
  cooldownSeconds,
  activeBranchId,
  setActiveBranchId,
  branches,
  errorMessage,
  successMessage
}) => {
  return (
    <form onSubmit={onLoginSubmit} className="flex flex-col gap-4">
      {/* BRANCH SELECTOR */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Lokasi Outlet / Cabang:</span>
        </label>
        <select
          value={activeBranchId}
          onChange={(e) => setActiveBranchId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
        >
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* PIN DISPLAY */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                idx < pin.length
                  ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {isCooldownActive ? `⏳ Terkunci sementara (${cooldownSeconds}s)` : 'Masukkan 6 Digit PIN Kasir'}
        </span>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* NUMPAD GRID */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((btn) => (
          <button
            key={btn}
            type="button"
            disabled={isCooldownActive || loading}
            onClick={() => onKeypadPress(btn)}
            className={`py-3.5 rounded-2xl font-mono font-bold text-base transition-all active:scale-95 cursor-pointer shadow-md ${
              btn === 'CLR' || btn === 'DEL'
                ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs'
                : 'bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {btn === 'CLR' ? 'Hapus' : btn === 'DEL' ? '⌫' : btn}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={pin.length < 6 || loading || isCooldownActive}
        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-1"
      >
        {loading ? 'Memverifikasi PIN...' : 'Masuk ke Kasir POS ➔'}
      </button>
    </form>
  )
}
