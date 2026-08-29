import React, { useState } from 'react'
import { StaffSurfaceMode } from '../../types/pos'
import {
  Grid,
  ChevronDown,
  Users,
  Kanban,
  Sparkles,
  Settings,
  Store,
  Warehouse,
  ShieldCheck,
  Globe,
  BookOpen
} from 'lucide-react'
import { StaffAppDrawerModal } from './StaffAppDrawerModal'

export interface StaffSubNavigatorProps {
  activeStaffSurface: StaffSurfaceMode
  setActiveStaffSurface: (surface: StaffSurfaceMode) => void
}

const SURFACE_NAMES: Record<StaffSurfaceMode, { name: string; icon: React.ReactNode; color: string }> = {
  'barista-pos': { name: 'Barista Touch POS', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-indigo-500' },
  'retail-pos': { name: 'Retail Barcode POS', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-amber-500' },
  'scan-go': { name: 'Scan & Go Mobile', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-emerald-500' },
  'kds-screen': { name: 'Kitchen KDS', icon: <Kanban className="w-3.5 h-3.5" />, color: 'bg-sky-500' },
  'fine-dining-kds': { name: 'Chef Course KDS', icon: <Kanban className="w-3.5 h-3.5" />, color: 'bg-rose-500' },
  'checker-qc': { name: 'Checker QC', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-teal-500' },
  'server-waiter': { name: 'Server / Waiter', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-purple-500' },
  'sommelier': { name: 'Sommelier Wine', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-red-600' },
  'maitre-d': { name: "Maître d' VIP", icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-yellow-500' },
  'hfe-insights': { name: '📈 HFE Insights', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-gradient-to-r from-amber-400 to-purple-600' },
  'hfe-company-book': { name: '📚 Company Books (Ledger)', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-emerald-600' },
  'warehouse-mgmt': { name: 'Gudang & Stok', icon: <Warehouse className="w-3.5 h-3.5" />, color: 'bg-amber-600' },
  'branch-mgmt': { name: 'Multi-Cabang', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-emerald-600' },
  'cafe-config': { name: 'Owner Settings', icon: <Settings className="w-3.5 h-3.5" />, color: 'bg-slate-600' },
  'customer-crm': { name: 'Customer CRM', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-blue-600' },
  'hfe-connect-hub': { name: '🧩 HFE Connect Hub', icon: <Globe className="w-3.5 h-3.5" />, color: 'bg-sky-500' },
  'admin-hub': { name: '🛡️ Mode Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-indigo-600' },
  'merchant-hub': { name: '🏠 Merchant Hub (Owner)', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-purple-600' },
  'gallery': { name: '🎨 Living Component Gallery', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-emerald-600' }
}

export const StaffSubNavigator: React.FC<StaffSubNavigatorProps> = ({
  activeStaffSurface,
  setActiveStaffSurface
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const currentApp = SURFACE_NAMES[activeStaffSurface] || {
    name: 'Aplikasi Staff',
    icon: <Grid className="w-3.5 h-3.5" />,
    color: 'bg-slate-700'
  }

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 shadow-md">
        {/* MOBILE VIEW (< md): 1 SINGLE APP SELECTOR PILL */}
        <div className="flex md:hidden items-center justify-between w-full gap-2">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-800 hover:from-amber-500/30 hover:to-slate-750 border border-amber-500/40 hover:border-amber-400/80 rounded-2xl text-white transition-all shadow-sm group min-w-0"
          >
            <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Grid className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-white truncate">{currentApp.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Shift Aktif
          </div>
        </div>

        {/* DESKTOP / TABLET VIEW (>= md): 6 DIRECT WORKSTATION TABS (ZERO FLANK DUPLICATES) */}
        <div className="hidden md:flex items-center justify-between w-full gap-2">
          {/* LEFT: 4 UNIFIED ROLE PILLARS (ZERO CLUTTER) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveStaffSurface('barista-pos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStaffSurface === 'barista-pos' || ['retail-pos', 'scan-go'].includes(activeStaffSurface)
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Kasir POS
            </button>

            <button
              type="button"
              onClick={() => setActiveStaffSurface('kds-screen')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStaffSurface === 'kds-screen' || ['fine-dining-kds', 'checker-qc', 'server-waiter'].includes(activeStaffSurface)
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Dapur KDS
            </button>

            <button
              type="button"
              onClick={() => setActiveStaffSurface('warehouse-mgmt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStaffSurface === 'warehouse-mgmt' || activeStaffSurface === 'branch-mgmt'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" /> Gudang & Logistik
            </button>

            <button
              type="button"
              onClick={() => setActiveStaffSurface('merchant-hub')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                ['merchant-hub', 'hfe-connect-hub', 'hfe-insights', 'hfe-company-book', 'cafe-config', 'admin-hub'].includes(activeStaffSurface)
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Merchant Hub (Backoffice)
            </button>
          </div>

          {/* RIGHT: STORE & SHIFT STATUS */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Shift Kasir Aktif
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL APP DRAWER LAUNCHPAD */}
      <StaffAppDrawerModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeStaffSurface={activeStaffSurface}
        onSelectSurface={setActiveStaffSurface}
      />
    </>
  )
}
