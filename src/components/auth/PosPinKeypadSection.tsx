import React, { useState } from 'react'
import { Store, Lock, ShieldAlert, CheckCircle, MapPin, UserCheck } from 'lucide-react'

export interface StaffProfile {
  id: string
  name: string
  role: string
  roleLabel: string
  avatar: string
  branchIds: string[]
}

export const DEFAULT_STAFF_PROFILES: StaffProfile[] = [
  { id: 'USR-DEMO-BARISTA-01', name: 'Siti Barista', role: 'barista', roleLabel: 'Barista / Kasir', avatar: '👩‍🍳', branchIds: ['BRANCH-HQ-01'] },
  { id: 'STF-01', name: 'Alexander Raden', role: 'owner', roleLabel: 'Owner / Pemilik', avatar: '👔', branchIds: ['ALL'] },
  { id: 'STF-02', name: 'Bambang Sudarsono', role: 'store_manager', roleLabel: 'Store Manager', avatar: '👨‍💼', branchIds: ['BRANCH-HQ-01'] },
  { id: 'STF-04', name: 'Dimas Barista', role: 'barista', roleLabel: 'Barista / Chef', avatar: '🧑‍🍳', branchIds: ['BRANCH-SENOPATI-02'] },
  { id: 'STF-05', name: 'Rian Server', role: 'waiter', roleLabel: 'Server / Waiter', avatar: '🏃‍♂️', branchIds: ['BRANCH-BANDUNG-03'] },
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
  const visibleStaff = DEFAULT_STAFF_PROFILES.filter(
    s => s.branchIds.includes('ALL') || s.branchIds.includes(activeBranchId)
  )
  const [authStep, setAuthStep] = useState<'select-user' | 'enter-pin'>('select-user')
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile>(visibleStaff[0] || DEFAULT_STAFF_PROFILES[0])

  // STATE 1: SELECT USER / STAFF PROFILE GRID
  if (authStep === 'select-user') {
    return (
      <div className="flex flex-col gap-4">
        {/* BRANCH SELECTOR */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Lokasi Outlet / Cabang:</span>
          </label>
          <select
            value={activeBranchId}
            onChange={(e) => {
              setActiveBranchId(e.target.value)
              onKeypadPress('CLR')
            }}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-amber-500"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* STAFF USER SELECTION CARDS */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Profil Staf yang Bertugas:</span>
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {visibleStaff.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => {
                  setSelectedStaff(staff)
                  onKeypadPress('CLR')
                  setAuthStep('enter-pin')
                }}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-muted/30 hover:bg-amber-500/10 border border-border hover:border-amber-500/50 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98 group text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{staff.avatar}</span>
                <div className="flex flex-col items-center min-w-0">
                  <span className="text-xs font-black text-foreground truncate w-full">{staff.name}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{staff.roleLabel}</span>
                </div>
                <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground group-hover:border-amber-500/40 group-hover:text-amber-500">
                  {staff.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // STATE 2: ENTER PIN KEYPAD FOR SELECTED USER
  return (
    <form onSubmit={onLoginSubmit} className="flex flex-col gap-4 animate-scaleUp">
      {/* HEADER: BACK TO USER SELECTOR */}
      <div className="flex items-center justify-between pb-1 border-b border-border">
        <button
          type="button"
          onClick={() => {
            setAuthStep('select-user')
            onKeypadPress('CLR')
          }}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>← Ganti Staf</span>
        </button>
        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 truncate max-w-[160px]">
          {branches.find(b => b.id === activeBranchId)?.name.split('(')[0] || 'Cabang'}
        </span>
      </div>

      {/* ACTIVE USER SPOTLIGHT */}
      <div className="flex flex-col items-center gap-1 py-1">
        <div className="w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-md">
          {selectedStaff.avatar}
        </div>
        <h3 className="text-sm font-black text-foreground">{selectedStaff.name}</h3>
        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{selectedStaff.roleLabel}</span>
      </div>

      {/* PIN DOTS DISPLAY */}
      <div className="flex flex-col items-center gap-2 py-1">
        <div className="flex gap-3">
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

      {/* NUMPAD GRID */}
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
