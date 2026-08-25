import React, { useState } from 'react'
import { 
  Sparkles, Crown, Shield, QrCode, Coffee, ShieldAlert, Award, 
  Building2, Briefcase, UserCheck, Clock, Check, ChevronRight, Copy,
  Store, Ticket, Gift, Navigation, Tag, MapPin
} from 'lucide-react'
import { HfeUserIdentity, CustomerPreferences } from '../../types/pos'
import { HfeCardMiniAppsGrid } from './HfeCardMiniAppsGrid'

export interface HfeCardIdentityPassbookProps {
  onOpenMenu?: () => void
  onOpenTickets?: () => void
  onOpenVouchers?: () => void
}

export interface MerchantPass {
  id: string
  merchantName: string
  merchantSlug: string
  merchantLogo: string
  themeColor: 'amber' | 'rose' | 'emerald' | 'indigo'
  memberTier: string
  stampsCount: number
  stampsMax: number
  stampsLabel: string
  vouchersCount: number
  barcodeId: string
  isHfeNetworkSharing: boolean
}

const SAMPLE_MERCHANT_PASSES: MerchantPass[] = [
  {
    id: 'PASS-SENOPATI',
    merchantName: 'Kopitiam Senopati & Roastery',
    merchantSlug: 'kopitiam-senopati',
    merchantLogo: '☕',
    themeColor: 'amber',
    memberTier: 'GOLD VIP',
    stampsCount: 8,
    stampsMax: 10,
    stampsLabel: 'Cups (2 lagi Free!)',
    vouchersCount: 2,
    barcodeId: 'CUST-SEN-8829-VIP',
    isHfeNetworkSharing: true
  },
  {
    id: 'PASS-MENTENG',
    merchantName: 'Menteng Artisan Bakery',
    merchantSlug: 'menteng-bakery',
    merchantLogo: '🥐',
    themeColor: 'rose',
    memberTier: 'SILVER',
    stampsCount: 4,
    stampsMax: 8,
    stampsLabel: 'Croissant (4 lagi Free!)',
    vouchersCount: 1,
    barcodeId: 'CUST-MTG-4412-SLV',
    isHfeNetworkSharing: true
  },
  {
    id: 'PASS-SPORTS',
    merchantName: 'Cilandak Sports & Padel Club',
    merchantSlug: 'cilandak-sports',
    merchantLogo: '🎾',
    themeColor: 'indigo',
    memberTier: 'PREMIUM VIP',
    stampsCount: 6,
    stampsMax: 10,
    stampsLabel: 'Sesi Lapangan (4 lagi Bonus!)',
    vouchersCount: 3,
    barcodeId: 'CUST-CLN-9901-PRM',
    isHfeNetworkSharing: false
  }
]

const WORK_IDENTITIES: HfeUserIdentity[] = [
  {
    id: 'ID-WORK-CILANDAK',
    type: 'work',
    label: 'Cilandak (Warehouse Keeper)',
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
    id: 'ID-WORK-SENOPATI',
    type: 'work',
    label: 'Senopati (Store Manager)',
    icon: '☕',
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
  }
]

export const HfeCardIdentityPassbook: React.FC<HfeCardIdentityPassbookProps> = ({
  onOpenMenu,
  onOpenTickets,
  onOpenVouchers
}) => {
  const [personaMode, setPersonaMode] = useState<'life' | 'work'>('life')
  const [merchantPasses] = useState<MerchantPass[]>(SAMPLE_MERCHANT_PASSES)
  const [activePassId, setActivePassId] = useState<string>('PASS-SENOPATI')
  const [activeWorkId, setActiveWorkId] = useState<string>('ID-WORK-CILANDAK')
  const [copiedBarcode, setCopiedBarcode] = useState<boolean>(false)

  const activePass = merchantPasses.find(p => p.id === activePassId) || merchantPasses[0]
  const activeWorkIdentity = WORK_IDENTITIES.find(w => w.id === activeWorkId) || WORK_IDENTITIES[0]

  const handleCopyBarcode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBarcode(true)
    setTimeout(() => setCopiedBarcode(false), 2000)
  }

  // Active identity passed to MiniAppsGrid
  const currentActiveIdentity: HfeUserIdentity = personaMode === 'life'
    ? {
        id: 'ID-LIFE-PERSONAL',
        type: 'life',
        label: 'Personal (Life)',
        icon: '🌿'
      }
    : activeWorkIdentity

  return (
    <div className="flex flex-col gap-4 w-full text-slate-900 dark:text-slate-100">
      {/* 1. TOP DUAL-PERSONA SWITCHER (LIFE vs WORK) */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-inner">
        <button
          type="button"
          onClick={() => setPersonaMode('life')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97] ${
            personaMode === 'life'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>🌿</span>
          <span>Personal (LIFE)</span>
        </button>

        <button
          type="button"
          onClick={() => setPersonaMode('work')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97] ${
            personaMode === 'work'
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>💼</span>
          <span>Kantor / Staf (WORK)</span>
        </button>
      </div>

      {/* 2. SUB-SELECTOR BASED ON PERSONA MODE */}
      {personaMode === 'life' ? (
        /* MULTI-MERCHANT PASS STACK (APPLE WALLET STYLE) */
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Pilih Kartu Merchant (Multi-Pass Wallet):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {merchantPasses.map((pass) => {
              const isSelected = pass.id === activePassId
              return (
                <button
                  key={pass.id}
                  type="button"
                  onClick={() => setActivePassId(pass.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shrink-0 active:scale-[0.97] ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/60 shadow-sm font-black scale-102'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{pass.merchantLogo}</span>
                  <span>{pass.merchantName.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* WORK IDENTITIES SELECTOR */
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Pilih Penugasan Staf Aktif:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {WORK_IDENTITIES.map((work) => {
              const isSelected = work.id === activeWorkId
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => setActiveWorkId(work.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shrink-0 active:scale-[0.97] ${
                    isSelected
                      ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-900 dark:text-teal-300 border-teal-300 dark:border-teal-500/60 shadow-sm font-black scale-102'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{work.icon}</span>
                  <span>{work.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. VISUAL CARD RENDERING */}
      {personaMode === 'life' ? (
        /* 🌿 LIFE MODE CARD: MULTI-MERCHANT APPLE WALLET PASS */
        <div className={`relative w-full rounded-3xl p-5 shadow-2xl overflow-hidden flex flex-col justify-between gap-5 text-white transition-all ${
          activePass.themeColor === 'amber'
            ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border border-amber-400/40'
            : activePass.themeColor === 'rose'
            ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-rose-950 border border-rose-400/40'
            : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-950 border border-indigo-400/40'
        }`}>
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          {/* CARD TOP HEADER */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{activePass.merchantLogo}</span>
                <span className="text-xs font-mono font-black uppercase tracking-widest text-white/90">
                  {activePass.merchantName}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Michael Chandra</h3>
              <span className="text-[11px] font-mono text-white/80">
                Member ID: {activePass.barcodeId}
              </span>
            </div>

            <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{activePass.memberTier}</span>
            </div>
          </div>

          {/* LOYALTY PROGRESS: STAMPS & VOUCHERS */}
          <div className="grid grid-cols-2 gap-3 relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-white/80">Stamp Loyalitas:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-mono text-amber-300">
                  {activePass.stampsCount}/{activePass.stampsMax}
                </span>
                <span className="text-[10px] text-white/90 font-medium">{activePass.stampsLabel}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-white/80">Voucher Promo:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-mono text-white">
                  {activePass.vouchersCount}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold">Kupon Aktif</span>
              </div>
            </div>
          </div>

          {/* HFE ECOSYSTEM POIN BADGE */}
          {activePass.isHfeNetworkSharing && (
            <div className="relative z-10 flex items-center justify-between p-2 rounded-xl bg-black/30 border border-amber-400/30 text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-amber-200 font-medium">Hfe Network Shared Points:</span>
              </div>
              <span className="font-mono font-black text-white text-sm">2.450 pts</span>
            </div>
          )}

          {/* BARCODE SECTION */}
          <div className="flex flex-col items-center gap-1.5 relative z-10 pt-2 border-t border-white/15">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-white/80 px-1">
              <span>SCAN SAAT ORDER DI KASIR POS</span>
              <button
                type="button"
                onClick={() => handleCopyBarcode(activePass.barcodeId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBarcode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBarcode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <div className="w-full bg-white/95 text-slate-950 p-2.5 rounded-xl flex flex-col items-center shadow-inner">
              <span className="font-mono font-black text-xs tracking-[0.25em]">▌│█║▌║▌║║▌█║</span>
              <span className="text-[10px] font-mono font-bold tracking-wider mt-0.5">{activePass.barcodeId}</span>
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
                  {activeWorkIdentity.workConfig?.branchName}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Michael Chandra</h3>
              <span className="text-[11px] font-mono text-slate-400">
                {activeWorkIdentity.workConfig?.companyName}
              </span>
            </div>

            <div className="bg-teal-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow">
              <Shield className="w-3.5 h-3.5" />
              <span className="uppercase">
                {activeWorkIdentity.workConfig?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* WORK DETAILS: SHIFT & ALLOWANCE */}
          <div className="grid grid-cols-2 gap-3 relative z-10 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3.5 border border-teal-500/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-teal-300">Presensi Shift:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white">
                  {activeWorkIdentity.workConfig?.activeShift?.clockInTime} ({activeWorkIdentity.workConfig?.activeShift?.shiftDuration})
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase text-teal-300">Jatah Kopi Staf:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-black font-mono text-amber-300">
                  {activeWorkIdentity.workConfig?.staffCoffeeQuotaRemaining} Cup Sisa
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
                onClick={() => handleCopyBarcode(activeWorkIdentity.workConfig?.qrPassCode || '')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBarcode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBarcode ? 'Tersalin!' : 'Salin Pass'}</span>
              </button>
            </div>

            <div className="w-full bg-slate-900 border border-teal-500/40 text-teal-200 p-2.5 rounded-xl flex flex-col items-center shadow-inner">
              <span className="font-mono font-black text-xs tracking-[0.25em]">▌│█║▌║▌║║▌█║</span>
              <span className="text-[10px] font-mono font-bold tracking-wider mt-0.5 text-white">
                {activeWorkIdentity.workConfig?.qrPassCode} (NIK: {activeWorkIdentity.workConfig?.employeeId})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. EMBEDDED MINI APPS ACTION GRID */}
      <div className="mt-1">
        <HfeCardMiniAppsGrid
          activeIdentity={currentActiveIdentity}
          onOpenMenu={onOpenMenu}
          onOpenTickets={onOpenTickets}
          onOpenVouchers={onOpenVouchers}
        />
      </div>
    </div>
  )
}
