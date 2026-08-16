import React, { useState } from 'react'
import { 
  Coffee, Calendar, Ticket, Car, Gift, Navigation, Clock, ShieldCheck, 
  PackageCheck, BarChart3, Footprints, Sparkles, CheckCircle2 
} from 'lucide-react'
import { HfeUserIdentity } from '../../types/pos'
import { MiniAppCourierRunnerModal } from './MiniAppCourierRunnerModal'
import { MiniAppManagerApprovalModal } from './MiniAppManagerApprovalModal'
import { MiniAppTableBookingModal } from './MiniAppTableBookingModal'
import { MiniAppValetCallModal } from './MiniAppValetCallModal'

export interface HfeCardMiniAppsGridProps {
  activeIdentity: HfeUserIdentity
  onOpenMenu?: () => void
  onOpenTickets?: () => void
  onOpenVouchers?: () => void
}

export const HfeCardMiniAppsGrid: React.FC<HfeCardMiniAppsGridProps> = ({
  activeIdentity,
  onOpenMenu,
  onOpenTickets,
  onOpenVouchers
}) => {
  // Modal States
  const [isCourierOpen, setIsCourierOpen] = useState(false)
  const [isApprovalOpen, setIsApprovalOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isValetOpen, setIsValetOpen] = useState(false)

  // Action feedback
  const [clockInStatus, setClockInStatus] = useState(false)
  const [coffeeClaimed, setCoffeeClaimed] = useState(false)
  const [flashMsg, setFlashMsg] = useState<string | null>(null)

  const handleClockInToggle = () => {
    setClockInStatus(prev => !prev)
    setFlashMsg(!clockInStatus ? '🟢 Presensi Masuk Shift Aktif (08:30 WIB)' : '🔴 Presensi Pulang Shift Dicatat')
    setTimeout(() => setFlashMsg(null), 3000)
  }

  const handleClaimStaffCoffee = () => {
    setCoffeeClaimed(true)
    setFlashMsg('☕ Kuota 1 Cup Kopi Barista Berhasil Diklaim!')
    setTimeout(() => setFlashMsg(null), 3000)
  }

  const isLife = activeIdentity.type === 'life'
  const role = activeIdentity.workConfig?.role || 'cashier'

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {isLife ? '🧩 Mini Apps & Layanan Mandiri' : `🧩 Mini Apps Operasional (${activeIdentity.workConfig?.branchName})`}
        </span>
        <span className="text-[10px] font-mono bg-slate-900 text-amber-300 px-2 py-0.5 rounded-full border border-slate-800">
          1-Ketuk Jalan
        </span>
      </div>

      {flashMsg && (
        <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{flashMsg}</span>
        </div>
      )}

      {/* LIFE MODE MINI APPS */}
      {isLife ? (
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={onOpenMenu}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 group-hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-400 transition-colors">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Pesan Menu</span>
            <span className="text-[9px] text-slate-400 font-mono">Order & Pay QR</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 group-hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Reservasi</span>
            <span className="text-[9px] text-slate-400 font-mono">VIP / Table Booking</span>
          </button>

          <button
            type="button"
            onClick={onOpenTickets}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 group-hover:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center text-rose-400 transition-colors">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Tiket Event</span>
            <span className="text-[9px] text-slate-400 font-mono">Workshop / Class</span>
          </button>

          <button
            type="button"
            onClick={() => setIsValetOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 group-hover:bg-blue-500/25 border border-blue-500/30 flex items-center justify-center text-blue-400 transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Panggil Valet</span>
            <span className="text-[9px] text-slate-400 font-mono">Mobil Plat B</span>
          </button>

          <button
            type="button"
            onClick={onOpenVouchers}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-colors">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Tukar Poin</span>
            <span className="text-[9px] text-slate-400 font-mono">Voucher Promo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCourierOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 group-hover:bg-teal-500/25 border border-teal-500/30 flex items-center justify-center text-teal-400 transition-colors">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Lacak Kurir</span>
            <span className="text-[9px] text-slate-400 font-mono">Live Tracking</span>
          </button>
        </div>
      ) : (
        /* WORK MODE MINI APPS */
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleClockInToggle}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
              clockInStatus ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-teal-500/15 border-teal-500/30 text-teal-400'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">
              {clockInStatus ? 'Presensi: Aktif' : 'Clock-In Shift'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">Scan Masuk / Pulang</span>
          </button>

          <button
            type="button"
            onClick={() => setIsApprovalOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer relative"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 group-hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-400 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Baki Approval</span>
            <span className="text-[9px] text-amber-400 font-mono">Void & Refund Kasir</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </button>

          <button
            type="button"
            onClick={() => setIsCourierOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 group-hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 transition-colors">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Kurir Runner</span>
            <span className="text-[9px] text-slate-400 font-mono">Navigasi & POD</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFlashMsg('📦 Scan Surat Jalan GRN Terbuka: Stok Roastery Cilandak Siap Dimutasi')
              setTimeout(() => setFlashMsg(null), 3000)
            }}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-stone-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-500/15 group-hover:bg-stone-500/25 border border-stone-500/30 flex items-center justify-center text-stone-400 transition-colors">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Terima GRN</span>
            <span className="text-[9px] text-slate-400 font-mono">Barang Supplier / HQ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFlashMsg('📊 Sales Flash Senopati: Rp 14.850.000 (42 Transaksi • 85% Meja Terisi)')
              setTimeout(() => setFlashMsg(null), 3500)
            }}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 group-hover:bg-blue-500/25 border border-blue-500/30 flex items-center justify-center text-blue-400 transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Sales Flash</span>
            <span className="text-[9px] text-slate-400 font-mono">Live Omset Cabang</span>
          </button>

          <button
            type="button"
            onClick={handleClaimStaffCoffee}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 flex flex-col items-center gap-1.5 text-center transition-all group shadow cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 group-hover:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center text-rose-400 transition-colors">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">
              {coffeeClaimed ? 'Kopi: Diklaim' : 'Jatah Kopi Staf'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1 Free Coffee/Shift</span>
          </button>
        </div>
      )}

      {/* MODALS */}
      <MiniAppCourierRunnerModal isOpen={isCourierOpen} onClose={() => setIsCourierOpen(false)} />
      <MiniAppManagerApprovalModal isOpen={isApprovalOpen} onClose={() => setIsApprovalOpen(false)} />
      <MiniAppTableBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <MiniAppValetCallModal isOpen={isValetOpen} onClose={() => setIsValetOpen(false)} />
    </div>
  )
}
