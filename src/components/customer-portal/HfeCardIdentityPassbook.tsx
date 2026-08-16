import React, { useState } from 'react'
import { 
  Sparkles, Crown, Shield, QrCode, Coffee, ShieldAlert, Award, 
  Building2, Briefcase, UserCheck, Clock, Check, ChevronRight, Copy 
} from 'lucide-react'
import { HfeUserIdentity, CustomerPreferences } from '../../types/pos'
import { HfeCardMiniAppsGrid } from './HfeCardMiniAppsGrid'

export interface HfeCardIdentityPassbookProps {
  onOpenMenu?: () => void
  onOpenTickets?: () => void
  onOpenVouchers?: () => void
}

const DEFAULT_IDENTITIES: HfeUserIdentity[] = [
  {
    id: 'ID-LIFE-01',
    type: 'life',
    label: 'Personal (Life)',
    icon: '🌿'
  },
  {
    id: 'ID-WORK-SENOPATI',
    type: 'work',
    label: 'Senopati (Manager)',
    icon: '💼',
    workConfig: {
      companyName: 'PT Cafe Berkah Sentosa',
      companyBookId: 'BOOK-SENOPATI-01',
      branchName: 'Kopitiam Senopati (HQ)',
      role: 'store_manager',
      employeeId: 'STF-SEN-002',
      qrPassCode: 'PASS-SEN-MGR-8829',
      activeShift: {
        clockInTime: '08:15 WIB',
        shiftDuration: '4j 20m',
        isClockedIn: true
      },
      staffCoffeeQuotaRemaining: 1,
      pendingApprovalsCount: 2
    }
  },
  {
    id: 'ID-WORK-CILANDAK',
    type: 'work',
    label: 'Cilandak (Logistik)',
    icon: '📦',
    workConfig: {
      companyName: 'PT Roastery Nusantara',
      companyBookId: 'BOOK-CILANDAK-02',
      branchName: 'Roastery Cilandak Central Hub',
      role: 'warehouse_keeper',
      employeeId: 'STF-CLN-014',
      qrPassCode: 'PASS-CLN-WH-8829',
      activeShift: {
        clockInTime: '07:30 WIB',
        shiftDuration: '5j 05m',
        isClockedIn: true
      },
      staffCoffeeQuotaRemaining: 2,
      pendingApprovalsCount: 0
    }
  },
  {
    id: 'ID-WORK-SCBD',
    type: 'work',
    label: 'SCBD (Sommelier)',
    icon: '🍷',
    workConfig: {
      companyName: 'PT Gastronomi Selera Prima',
      companyBookId: 'BOOK-SCBD-03',
      branchName: 'Bistro SCBD Fine Dining',
      role: 'sommelier',
      employeeId: 'STF-SCBD-009',
      qrPassCode: 'PASS-SCBD-SOM-8829',
      activeShift: {
        clockInTime: '17:00 WIB',
        shiftDuration: 'Off-Shift',
        isClockedIn: false
      },
      staffCoffeeQuotaRemaining: 1,
      pendingApprovalsCount: 0
    }
  }
]

export const HfeCardIdentityPassbook: React.FC<HfeCardIdentityPassbookProps> = ({
  onOpenMenu,
  onOpenTickets,
  onOpenVouchers
}) => {
  const [identities] = useState<HfeUserIdentity[]>(DEFAULT_IDENTITIES)
  const [activeIdentityId, setActiveIdentityId] = useState<string>('ID-LIFE-01')
  const [copiedBarcode, setCopiedBarcode] = useState<boolean>(false)

  const activeIdentity = identities.find(i => i.id === activeIdentityId) || identities[0]
  const isLife = activeIdentity.type === 'life'
  const workConfig = activeIdentity.workConfig

  const handleCopyBarcode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBarcode(true)
    setTimeout(() => setCopiedBarcode(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 w-full text-slate-100">
      {/* 1. IDENTITY TABS SWITCHER */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Pilih Kartu Identitas Aktif (Dual-Persona):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {identities.map((identity) => {
            const isSelected = identity.id === activeIdentityId
            return (
              <button
                key={identity.id}
                type="button"
                onClick={() => setActiveIdentityId(identity.id)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? identity.type === 'life'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg font-black scale-102'
                      : 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg font-black scale-102'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <span>{identity.icon}</span>
                <span>{identity.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. THE VISUAL CARD PASSBOOK */}
      {isLife ? (
        /* 🌿 LIFE MODE CARD: WARM GOLD VIP MEMBER PASS */
        <div className="relative w-full rounded-3xl p-5 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border border-amber-400/40 shadow-2xl overflow-hidden flex flex-col justify-between gap-5 text-white">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

          {/* CARD TOP HEADER */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-200" />
                <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-200">
                  Hfe Universal Member Pass
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Michael Chandra</h3>
              <span className="text-[11px] font-mono text-amber-200/90">Akun Universal Platform Hfe</span>
            </div>

            <div className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow">
              <Award className="w-3.5 h-3.5" />
              <span>GOLD VIP</span>
            </div>
          </div>

          {/* LOYALTY PROGRESS: POINTS & STAMPS */}
          <div className="grid grid-cols-2 gap-3 relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-amber-200">Saldo Poin Belanja:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-mono text-white">2.450</span>
                <span className="text-[10px] text-amber-300 font-bold">pts</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-amber-200">Kopitiam Stamp Card:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-mono text-amber-300">8/10</span>
                <span className="text-[10px] text-amber-100 font-medium">Cups (2 lagi Free!)</span>
              </div>
            </div>
          </div>

          {/* BARCODE SECTION */}
          <div className="flex flex-col items-center gap-1.5 relative z-10 pt-2 border-t border-white/15">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-amber-200 px-1">
              <span>SCAN SAAT ORDER DI KASIR POS</span>
              <button
                type="button"
                onClick={() => handleCopyBarcode('CUST-8829-VIP')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBarcode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBarcode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <div className="w-full bg-white/95 text-slate-950 p-2.5 rounded-xl flex flex-col items-center shadow-inner">
              <span className="font-mono font-black text-xs tracking-[0.25em]">▌│█║▌║▌║║▌█║</span>
              <span className="text-[10px] font-mono font-bold tracking-wider mt-0.5">CUST-8829-VIP</span>
            </div>
          </div>
        </div>
      ) : (
        /* 💼 WORK MODE CARD: OBSIDIAN TITANIUM STAFF PASS */
        <div className="relative w-full rounded-3xl p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 border border-teal-500/40 shadow-2xl overflow-hidden flex flex-col justify-between gap-5 text-white">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

          {/* CARD TOP HEADER */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-black uppercase tracking-widest text-teal-300">
                  {workConfig?.branchName}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Michael Chandra</h3>
              <span className="text-[11px] font-mono text-slate-400">{workConfig?.companyName}</span>
            </div>

            <div className="bg-teal-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow">
              <Shield className="w-3.5 h-3.5" />
              <span className="uppercase">{workConfig?.role?.replace('_', ' ')}</span>
            </div>
          </div>

          {/* WORK DETAILS: SHIFT & ALLOWANCE */}
          <div className="grid grid-cols-2 gap-3 relative z-10 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3.5 border border-teal-500/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-teal-300">Presensi Shift:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white">
                  {workConfig?.activeShift?.clockInTime} ({workConfig?.activeShift?.shiftDuration})
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-teal-300">Jatah Kopi Staf:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-black font-mono text-amber-300">
                  {workConfig?.staffCoffeeQuotaRemaining} Cup Sisa
                </span>
                <span className="text-[10px] text-slate-400">/ Shift</span>
              </div>
            </div>
          </div>

          {/* STAFF BARCODE PASS */}
          <div className="flex flex-col items-center gap-1.5 relative z-10 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-teal-300 px-1">
              <span>SCAN UNTUK CLOCK-IN / OTORISASI POS</span>
              <button
                type="button"
                onClick={() => handleCopyBarcode(workConfig?.qrPassCode || '')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBarcode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBarcode ? 'Tersalin!' : 'Salin Pass'}</span>
              </button>
            </div>

            <div className="w-full bg-slate-900 border border-teal-500/40 text-teal-200 p-2.5 rounded-xl flex flex-col items-center shadow-inner">
              <span className="font-mono font-black text-xs tracking-[0.25em]">▌│█║▌║▌║║▌█║</span>
              <span className="text-[10px] font-mono font-bold tracking-wider mt-0.5 text-white">
                {workConfig?.qrPassCode} (NIK: {workConfig?.employeeId})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. EMBEDDED MINI APPS ACTION GRID */}
      <div className="mt-1">
        <HfeCardMiniAppsGrid
          activeIdentity={activeIdentity}
          onOpenMenu={onOpenMenu}
          onOpenTickets={onOpenTickets}
          onOpenVouchers={onOpenVouchers}
        />
      </div>
    </div>
  )
}
