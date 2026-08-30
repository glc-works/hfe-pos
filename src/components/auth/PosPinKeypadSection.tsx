import React, { useState } from 'react'
import { Store, Lock, ShieldAlert, CheckCircle, MapPin, UserCheck } from 'lucide-react'

export interface StaffProfile {
  id: string
  name: string
  role: string
  roleLabel: string
  avatar: string
}

export const DEFAULT_STAFF_PROFILES: StaffProfile[] = [
  { id: 'USR-DEMO-BARISTA-01', name: 'Siti Barista', role: 'barista', roleLabel: 'Barista / Kasir', avatar: '👩‍🍳' },
  { id: 'STF-01', name: 'Alexander Raden', role: 'owner', roleLabel: 'Owner / Pemilik', avatar: '👔' },
  { id: 'STF-02', name: 'Bambang Sudarsono', role: 'store_manager', roleLabel: 'Store Manager', avatar: '👨‍💼' },
  { id: 'STF-04', name: 'Dimas Barista', role: 'barista', roleLabel: 'Barista / Chef', avatar: '🧑‍🍳' },
  { id: 'STF-05', name: 'Rian Server', role: 'waiter', roleLabel: 'Server / Waiter', avatar: '🏃‍♂️' },
]

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
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile>(DEFAULT_STAFF_PROFILES[0])

  return (
    <form onSubmit={onLoginSubmit} className="flex flex-col gap-4">
      {/* 1. BRANCH SELECTOR */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Lokasi Outlet / Cabang:</span>
        </label>
        <select
          value={activeBranchId}
          onChange={(e) => setActiveBranchId(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-amber-500"
        >
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* 2. LAPTOP-STYLE STAFF PROFILE PICKER (SELECT USER FIRST) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Pilih Profil Staf yang Bertugas:</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 custom-scrollbar">
          {DEFAULT_STAFF_PROFILES.map((staff) => {
            const isSelected = selectedStaff.id === staff.id
            return (
              <button
                key={staff.id}
                type="button"
                onClick={() => {
                  setSelectedStaff(staff)
                  onKeypadPress('CLR')
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all cursor-pointer shrink-0 min-w-[76px] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md scale-105'
                    : 'bg-muted/40 border-border hover:bg-muted/70 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xl">{staff.avatar}</span>
                <span className="text-[10px] font-bold text-foreground truncate max-w-[70px]">
                  {staff.name.split(' ')[0]}
                </span>
                <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded-full border ${
                  isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-background text-muted-foreground border-border'
                }`}>
                  {staff.role}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. ACTIVE USER SPOTLIGHT & 6-DIGIT PIN DISPLAY */}
      <div className="flex flex-col items-center gap-2 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedStaff.avatar}</span>
          <div className="flex flex-col">
            <span className="text-xs font-black text-foreground">{selectedStaff.name}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{selectedStaff.roleLabel}</span>
          </div>
        </div>

        <div className="flex gap-3 py-1">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                idx < pin.length
                  ? 'bg-amber-500 scale-125 shadow-lg shadow-amber-500/50'
                  : 'bg-muted border border-border'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {isCooldownActive ? `⏳ Terkunci sementara (${cooldownSeconds}s)` : 'Masukkan 6 Digit PIN Kasir'}
        </span>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 4. NUMPAD GRID */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((btn) => (
          <button
            key={btn}
            type="button"
            disabled={isCooldownActive || loading}
            onClick={() => onKeypadPress(btn)}
            className={`py-3.5 rounded-2xl font-mono font-bold text-base transition-all active:scale-95 cursor-pointer shadow-sm ${
              btn === 'CLR' || btn === 'DEL'
                ? 'bg-muted/80 text-muted-foreground hover:text-foreground border border-border text-xs'
                : 'bg-card text-foreground hover:bg-muted/60 border border-border hover:border-amber-500/40'
            }`}
          >
            {btn === 'CLR' ? 'Hapus' : btn === 'DEL' ? '⌫' : btn}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={pin.length < 6 || loading || isCooldownActive}
        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-1"
      >
        {loading ? 'Memverifikasi PIN...' : 'Masuk ke Kasir POS ➔'}
      </button>
    </form>
  )
}
