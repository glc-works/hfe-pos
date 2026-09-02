import React, { useState } from 'react'
import {
  ChevronDown,
  Search,
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
  ChefHat,
  Package,
  Globe,
  X,
  MapPin,
  Plus
} from 'lucide-react'
import { useMerchantConfig } from '@/context/MerchantConfigContext'
import { GlobalSpotlightCommandPalette, SpotlightRole } from '../common/GlobalSpotlightCommandPalette'
import { UnifiedAttentionCenterPopOver } from '../common/UnifiedAttentionCenterPopOver'

export interface UniversalAppShellProps {
  activeSurface: string
  onSelectSurface: (surface: string) => void
  storeName?: string
  branchName?: string
  isShiftActive?: boolean
  shiftNumber?: string
  ownerModeActive?: boolean
  children: React.ReactNode
}

export const UniversalAppShell: React.FC<UniversalAppShellProps> = ({
  activeSurface,
  onSelectSurface,
  storeName = 'Kopi Nusantara',
  branchName = 'Cabang Senopati (HQ)',
  isShiftActive = true,
  shiftNumber = '#12',
  ownerModeActive = false,
  children
}) => {
  const { themeMode, toggleThemeMode } = useMerchantConfig()
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Determine current spotlight role
  const spotlightRole: SpotlightRole = ownerModeActive
    ? 'owner'
    : activeSurface === 'warehouse-mgmt'
    ? 'warehouse'
    : 'cashier'

  const surfaces = [
    {
      id: 'barista-pos',
      shortLabel: 'Kasir',
      glyph: '🛒',
      label: 'Kasir POS',
      sublabel: 'Front of House',
      icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
      desc: 'Penjualan, Meja Dine-in & Takeaway'
    },
    {
      id: 'kds-screen',
      shortLabel: 'Dapur',
      glyph: '🍳',
      label: 'Dapur KDS',
      sublabel: 'Kitchen & Barista',
      icon: <ChefHat className="w-4 h-4 text-emerald-500" />,
      desc: 'Antrean Pesanan & Routing Masak'
    },
    {
      id: 'warehouse-mgmt',
      shortLabel: 'Gudang',
      glyph: '📦',
      label: 'Gudang & Logistik',
      sublabel: 'Supply Chain',
      icon: <Package className="w-4 h-4 text-blue-400" />,
      desc: 'Stok Bahan Baku, PO & Surat Jalan'
    },
    {
      id: 'merchant-hub',
      shortLabel: 'Hub',
      glyph: '📊',
      label: 'Merchant Hub',
      sublabel: 'Backoffice Owner',
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      desc: 'Insights, Payouts, Pajak, Produk & Promo'
    }
  ]

  const activeSurfaceObj = surfaces.find((s) => s.id === activeSurface) || surfaces[0]

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* LAYER 1: PERSISTENT PLATFORM TOP BAR */}
      <header className="shrink-0 z-30 h-12 sm:h-13 border-b border-border bg-card/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left: Mobile Mode Name [ 🛒 Kasir ▾ ] vs Desktop Full Breadcrumb */}
        <div className="relative">
          {/* Mobile Strict Mode Name (< sm) */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border transition-all cursor-pointer min-h-[38px]"
            title="Ganti Mode / Ruang Kerja"
          >
            <span className="text-xs">{activeSurfaceObj.glyph}</span>
            <span className="text-xs font-bold text-foreground">{activeSurfaceObj.shortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Tablet & Desktop Expanded Capsule (>= sm) */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border transition-all cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold text-xs">
              {activeSurfaceObj.glyph}
            </div>
            <div className="leading-tight pr-1">
              <span className="text-xs font-bold text-foreground block truncate max-w-[140px] md:max-w-[200px]">
                {storeName}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate max-w-[140px] md:max-w-[200px]">
                {branchName} • {activeSurfaceObj.label}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </button>

          {/* Switcher Dropdown & Bottom Sheet Drawer */}
          {isSwitcherOpen && (
            <div className="fixed sm:absolute inset-x-4 bottom-4 sm:inset-auto sm:top-full sm:left-0 sm:mt-1.5 w-auto sm:w-80 bg-card rounded-3xl sm:rounded-2xl border border-border shadow-2xl p-4 sm:p-2 space-y-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>☕</span> {storeName}
                  </h4>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-500" /> {branchName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="sm:hidden p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                Pilih Ruang Kerja (Workspace):
              </div>

              <div className="space-y-1">
                {surfaces.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSurface(s.id)
                      setIsSwitcherOpen(false)
                    }}
                    className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      activeSurface === s.id
                        ? 'bg-amber-500/10 text-foreground border border-amber-500/30 font-bold'
                        : 'hover:bg-muted/40 text-foreground border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-muted shrink-0">{s.icon}</div>
                      <div>
                        <h5 className="text-xs">{s.label}</h5>
                        <p className="text-[10px] text-muted-foreground font-normal">{s.desc}</p>
                      </div>
                    </div>
                    {activeSurface === s.id && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Global Spotlight Command Bar (>= sm) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            type="button"
            onClick={() => setIsSpotlightOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border text-muted-foreground text-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span>Cari menu, nomor meja, transaksi...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-foreground font-semibold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Search Mobile, Notifications, Theme, Shift Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Spotlight Trigger */}
          <button
            type="button"
            onClick={() => setIsSpotlightOpen(true)}
            className="sm:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground bg-muted/40 border border-border min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Search Spotlight"
          >
            <Search className="w-4 h-4 text-amber-500" />
          </button>

          {/* Quick Action [+] Omni Dropdown (Plan #825a) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => onSelectSurface('merchant-hub')}
              className="h-10 px-2.5 sm:px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 text-xs transition-all shadow-xs cursor-pointer"
              title="Aksi Cepat (+)"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Aksi Cepat</span>
            </button>
          </div>

          {/* 2-Tier Attention & Notification Center (Plan #825c) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-all cursor-pointer flex items-center justify-center"
              title="Attention Center (Notifikasi)"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card animate-pulse" />
            </button>

            {/* 2-Tier Attention Center PopOver */}
            <UnifiedAttentionCenterPopOver
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onNavigateToHub={() => onSelectSurface('merchant-hub')}
            />
          </div>

          {/* Shift Status Capsule */}
          <div className="h-10 px-2.5 sm:px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-1.5 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Shift</span>
            <span className="font-mono">{shiftNumber}</span>
          </div>
        </div>
      </header>

      {/* LAYER 2 & CONTENT CANVAS: SINGLE SCROLL OWNER */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
        {children}
      </main>

      {/* GLOBAL SPOTLIGHT COMMAND PALETTE */}
      <GlobalSpotlightCommandPalette
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        currentRole={spotlightRole}
        onSelectSurface={onSelectSurface}
      />
    </div>
  )
}
