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

const SURFACE_NAMES: Record<StaffSurfaceMode, { name: string; shortName: string; icon: React.ReactNode; color: string }> = {
  'barista-pos': { name: 'Kasir POS', shortName: 'Kasir', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-indigo-500' },
  'retail-pos': { name: 'Retail POS', shortName: 'Kasir', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-amber-500' },
  'scan-go': { name: 'Scan & Go', shortName: 'Kasir', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-emerald-500' },
  'kds-screen': { name: 'Dapur KDS', shortName: 'Dapur', icon: <Kanban className="w-3.5 h-3.5" />, color: 'bg-sky-500' },
  'fine-dining-kds': { name: 'Chef KDS', shortName: 'Dapur', icon: <Kanban className="w-3.5 h-3.5" />, color: 'bg-rose-500' },
  'checker-qc': { name: 'Checker QC', shortName: 'Checker', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-teal-500' },
  'server-waiter': { name: 'Server / Waiter', shortName: 'Waiter', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-purple-500' },
  'sommelier': { name: 'Sommelier', shortName: 'Sommelier', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-red-600' },
  'maitre-d': { name: "Maître d'", shortName: 'VIP', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-yellow-500' },
  'hfe-insights': { name: 'HFE Insights', shortName: 'Insights', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-gradient-to-r from-amber-400 to-purple-600' },
  'hfe-company-book': { name: 'Company Books', shortName: 'Books', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-emerald-600' },
  'warehouse-mgmt': { name: 'Gudang & Logistik', shortName: 'Gudang', icon: <Warehouse className="w-3.5 h-3.5" />, color: 'bg-amber-600' },
  'branch-mgmt': { name: 'Multi-Cabang', shortName: 'Cabang', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-emerald-600' },
  'cafe-config': { name: 'Pengaturan Toko', shortName: 'Setting', icon: <Settings className="w-3.5 h-3.5" />, color: 'bg-slate-600' },
  'customer-crm': { name: 'Customer CRM', shortName: 'CRM', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-blue-600' },
  'hfe-connect-hub': { name: 'Connect Hub', shortName: 'Hub', icon: <Globe className="w-3.5 h-3.5" />, color: 'bg-sky-500' },
  'admin-hub': { name: 'Mode Admin', shortName: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-indigo-600' },
  'merchant-hub': { name: 'Merchant Hub', shortName: 'Hub', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-purple-600' },
  'gallery': { name: 'Component Gallery', shortName: 'Gallery', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-emerald-600' }
}

export const StaffSubNavigator: React.FC<StaffSubNavigatorProps> = ({
  activeStaffSurface,
  setActiveStaffSurface
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const currentApp = SURFACE_NAMES[activeStaffSurface] || {
    name: 'Kasir POS',
    shortName: 'Kasir',
    icon: <Users className="w-3.5 h-3.5" />,
    color: 'bg-amber-500'
  }

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between z-20 shrink-0 select-none">
        {/* MOBILE VIEW (< md): COMPACT MODE NAME */}
        <div className="flex md:hidden items-center justify-between w-full gap-2">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-white transition-all shadow-xs cursor-pointer min-w-0"
          >
            <div className="w-4 h-4 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Grid className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-white truncate">{currentApp.shortName}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
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
