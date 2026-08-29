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
  Store,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useMerchantConfig } from '@/context/MerchantConfigContext'
import { GlobalSpotlightCommandPalette, SpotlightRole } from '../common/GlobalSpotlightCommandPalette'

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
      label: 'Kasir POS',
      sublabel: 'Front of House',
      icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
      desc: 'Penjualan, Meja Dine-in & Takeaway'
    },
    {
      id: 'kds-screen',
      label: 'Dapur KDS',
      sublabel: 'Kitchen & Barista',
      icon: <ChefHat className="w-4 h-4 text-emerald-500" />,
      desc: 'Antrean Pesanan & Routing Masak'
    },
    {
      id: 'warehouse-mgmt',
      label: 'Gudang & Logistik',
      sublabel: 'Supply Chain',
      icon: <Package className="w-4 h-4 text-blue-400" />,
      desc: 'Stok Bahan Baku, PO & Surat Jalan'
    },
    {
      id: 'merchant-hub',
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
        {/* Left: Mobile Monogram Avatar [ ☕ ▾ ] vs Desktop Full Breadcrumb */}
        <div className="relative">
          {/* Mobile Icon Trigger (< sm) */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border transition-all cursor-pointer min-h-[38px]"
            title="Pilih Cabang & Ruang Kerja"
          >
            <span className="text-sm">☕</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Tablet & Desktop Expanded Capsule (>= sm) */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border transition-all cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold text-xs">
              {activeSurface === 'kds-screen' ? '🍳' : activeSurface === 'warehouse-mgmt' ? '📦' : activeSurface === 'merchant-hub' ? '📊' : '🛒'}
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

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Notifikasi & Attention Center"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card animate-pulse" />
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="fixed sm:absolute inset-x-4 top-16 sm:inset-auto sm:top-full sm:right-0 sm:mt-1.5 w-auto sm:w-80 bg-card rounded-3xl sm:rounded-2xl border border-border shadow-2xl p-3.5 space-y-2.5 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-bold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Attention Center (2)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Stok Menipis: Biji Kopi Gayo</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Tersisa 1.8 kg di Gudang Pusat (Batas aman: 3.0 kg).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Domain &amp; DNS Live</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Domain kopinusantara.id aktif melayani QR order.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleThemeMode}
            className="hidden sm:flex p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Ganti Tema (Day/Night)"
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Shift Status Capsule */}
          <div className="px-2 sm:px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
