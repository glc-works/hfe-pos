import React, { useState, useEffect } from 'react'
import {
  Users,
  Kanban,
  Sparkles,
  Settings,
  Warehouse,
  Search,
  X,
  CheckCircle2,
  Grid,
  ChevronRight,
  ShieldCheck,
  Check,
  Globe,
  BookOpen,
  Gamepad2
} from 'lucide-react'
import { StaffSurfaceMode } from '../../types/pos'

export interface CoreAppTile {
  id: StaffSurfaceMode
  name: string
  subtitle: string
  features: string[]
  icon: React.ReactNode
  color: string
  badge?: string
}

export const FIVE_CORE_APPS: CoreAppTile[] = [
  {
    id: 'barista-pos',
    name: 'Kasir POS (Commerce Hub)',
    subtitle: 'Layanan kasir terpadu kafe, resto meja dine-in, takeaway, & barcode retail',
    features: ['Peta Meja & Dine-In', 'Takeaway & Delivery', 'Barcode Scanner Retail', 'Split Payment & EDC'],
    icon: <Users className="w-6 h-6" />,
    color: 'from-indigo-500 via-indigo-600 to-blue-700',
    badge: 'Utama'
  },
  {
    id: 'kds-screen',
    name: 'Dapur & Expediter (KDS Workstation)',
    subtitle: 'Satu layar produksi pesanan: antrian dapur, fine-dining course firing, QC, & server',
    features: ['Kitchen Kanban', 'Chef Course Firing', 'Checker QC Expediter', 'Server / Waiter Runner'],
    icon: <Kanban className="w-6 h-6" />,
    color: 'from-sky-500 via-blue-600 to-indigo-700',
    badge: 'Dapur & Lantai'
  },
  {
    id: 'hfe-insights',
    name: '📈 HFE Real-Time Insights & Analitik',
    subtitle: 'Kecerdasan buatan untuk prediksi rush hour, alert stok menipis, margin menu, & float kasir',
    features: ['Demand Rush Forecast', 'Low-Stock Auto-PO', 'Profit Margin Leaders', 'Shift Cash Integrity (100%)'],
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-amber-500 via-orange-600 to-purple-700',
    badge: 'AI Live 99.8%'
  },
  {
    id: 'hfe-company-book',
    name: '📚 Company Books & Financial Ledger',
    subtitle: 'Buku besar akuntansi, Bagan Akun SAK, Neraca, Laba Rugi, & Kepatuhan Pajak Resto PB1',
    features: ['Chart of Accounts SAK', 'TigerBeetle Double-Entry', 'Balance Sheet & P&L', 'Pajak Resto PB1 & e-Billing'],
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-emerald-600 via-teal-700 to-slate-900',
    badge: 'Pillar 6 BOOK'
  },
  {
    id: 'hfe-connect-hub',
    name: '🧩 HFE Connect Hub (Ecosystem & Open Banking)',
    subtitle: 'Open Banking SNAP BI, Cloud Accounting Bridges, POS Terminals, & Beta Allowlist',
    features: ['SNAP BI Bank Feeds', 'ERP / Accounting Bridge', 'Hardware POS Integrations', 'Beta Tenant Gating'],
    icon: <Globe className="w-6 h-6" />,
    color: 'from-sky-500 via-blue-600 to-cyan-700',
    badge: 'Ecosystem'
  },
  {
    id: 'warehouse-mgmt',
    name: 'Gudang, Inventori & Multi-Cabang',
    subtitle: 'Pencatatan stok bahan baku BOM, PO supplier, cellar wine, & sentralisasi outlet',
    features: ['Stok Bahan Baku BOM', 'PO Supplier & Inbound', 'Wine & Beverage Cellar', 'Dimensional Multi-Outlet'],
    icon: <Warehouse className="w-6 h-6" />,
    color: 'from-amber-600 via-amber-700 to-orange-800',
    badge: 'Supply Chain'
  },
  {
    id: 'cafe-config',
    name: 'Pengaturan Toko & Tim (Management)',
    subtitle: 'Konfigurasi profil PT legal, pajak resto PB1 (10%), tema visual, staf PIN, & CRM',
    features: ['Profil PT & Legalitas', 'Pajak PB1 (10%) & Service', 'Preset Light / Dark Mode', 'Roster Staf & PIN Kasir'],
    icon: <Settings className="w-6 h-6" />,
    color: 'from-slate-700 via-slate-800 to-slate-900',
    badge: 'Back-Office'
  },
  {
    id: 'hfe-agent-town',
    name: '🎮 Coffee Tycoon Game & Living Testbed',
    subtitle: 'Simulasi real-time kafe, pergerakan pelanggan virtual, stress testing rush hour & AI Agent living testbed',
    features: ['Simulasi Rush-Hour', 'Virtual Guest AI Agents', 'Financial Stress Test', 'Living Testbed & Gamification'],
    icon: <Gamepad2 className="w-6 h-6" />,
    color: 'from-purple-600 via-pink-600 to-amber-600',
    badge: 'World Simulation'
  }
]

export interface StaffAppDrawerModalProps {
  isOpen: boolean
  onClose: () => void
  activeStaffSurface: StaffSurfaceMode
  onSelectSurface: (surface: StaffSurfaceMode) => void
}

export const StaffAppDrawerModal: React.FC<StaffAppDrawerModalProps> = ({
  isOpen,
  onClose,
  activeStaffSurface,
  onSelectSurface
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredApps = FIVE_CORE_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                HFE Commerce Suite — Workstations &amp; Connect Hub
                <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full">
                  {FIVE_CORE_APPS.length} Suites
                </span>
              </h2>
              <p className="text-xs text-slate-400">Pusat aplikasi terpadu operasional kasir, produksi dapur, ekosistem &amp; manajemen</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul atau kapabilitas (Kasir, KDS, Course Firing, Gudang, Pajak, Insights...)"
              autoFocus
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 5 CORE APPS GRID */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => {
              const isActive =
                activeStaffSurface === app.id ||
                (app.id === 'kds-screen' &&
                  ['fine-dining-kds', 'checker-qc', 'server-waiter'].includes(activeStaffSurface)) ||
                (app.id === 'barista-pos' && ['retail-pos', 'scan-go'].includes(activeStaffSurface))

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    onSelectSurface(app.id)
                    onClose()
                  }}
                  className={`p-4 sm:p-5 rounded-3xl border text-left flex flex-col justify-between gap-4 transition-all group relative overflow-hidden ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/30 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      {app.icon}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 justify-between">
                        <h3
                          className={`text-sm font-black truncate ${
                            isActive ? 'text-amber-300' : 'text-slate-100 group-hover:text-white'
                          }`}
                        >
                          {app.name}
                        </h3>
                        {app.badge && (
                          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full shrink-0">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{app.subtitle}</p>
                    </div>
                  </div>

                  {/* EMBEDDED MODULAR FEATURES LIST */}
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                    {app.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1"
                      >
                        <span className="text-amber-400">✓</span> {feat}
                      </span>
                    ))}
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      <Check className="w-3 h-3 stroke-[3]" /> Aktif
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
