import React, { useState, useEffect } from 'react'
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
  X
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
      label: 'Kasir POS (Front of House)',
      icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
      desc: 'Penjualan, Meja Dine-in & Takeaway'
    },
    {
      id: 'kds-screen',
      label: 'Dapur KDS (Kitchen & Barista)',
      icon: <ChefHat className="w-4 h-4 text-emerald-500" />,
      desc: 'Antrean Pesanan & Routing Masak'
    },
    {
      id: 'warehouse-mgmt',
      label: 'Gudang & Logistik (Supply Chain)',
      icon: <Package className="w-4 h-4 text-blue-400" />,
      desc: 'Stok Bahan Baku, PO & Surat Jalan'
    },
    {
      id: 'merchant-hub',
      label: 'Merchant Hub (Backoffice)',
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      desc: 'Insights, Payouts, Pajak, Produk & Promo'
    }
  ]

  const activeSurfaceObj = surfaces.find((s) => s.id === activeSurface) || surfaces[0]

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* LAYER 1: PERSISTENT PLATFORM TOP BAR */}
      <header className="shrink-0 z-30 h-13 border-b border-border bg-card/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2.5">
        {/* Left: Monolithic Surface Switcher Capsule */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border transition-all cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold text-xs">
              {activeSurface === 'kds-screen' ? '🍳' : activeSurface === 'warehouse-mgmt' ? '📦' : activeSurface === 'merchant-hub' ? '📊' : '🛒'}
            </div>
            <div className="leading-tight pr-1">
              <span className="text-xs font-bold text-foreground block truncate max-w-[130px] sm:max-w-[180px]">
                {storeName}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate max-w-[130px] sm:max-w-[180px]">
                {activeSurfaceObj.label.split('(')[0].trim()}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </button>

          {/* Switcher Dropdown */}
          {isSwitcherOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-card rounded-2xl border border-border shadow-2xl p-1.5 space-y-1 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Pindah Peran / Aplikasi
              </div>
              {surfaces.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSurface(s.id)
                    setIsSwitcherOpen(false)
                  }}
                  className={`p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeSurface === s.id
                      ? 'bg-amber-500/10 text-foreground border border-amber-500/30'
                      : 'hover:bg-muted/40 text-foreground border border-transparent'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-muted shrink-0">{s.icon}</div>
                  <div>
                    <h5 className="text-xs font-bold">{s.label}</h5>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Global Spotlight Bar Trigger (⌘K) */}
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

        {/* Right: Actions, Notifications, Theme, Shift Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Spotlight Icon Trigger */}
          <button
            type="button"
            onClick={() => setIsSpotlightOpen(true)}
            className="sm:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground bg-muted/40 border border-border"
            title="Search Spotlight"
          >
            <Search className="w-4 h-4 text-amber-500" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
              title="Notifikasi & Attention Center"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card animate-pulse" />
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-80 bg-card rounded-2xl border border-border shadow-2xl p-3 space-y-2 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-bold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Attention Center (2)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Stok Menipis (Biji Kopi Gayo)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Tersisa 1.8 kg di Gudang Pusat (Batas aman: 3.0 kg).
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Domain &amp; DNS Aktif</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Domain kopinusantara.id terverifikasi melayani QR order.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 1-Tap Theme Toggle */}
          <button
            type="button"
            onClick={toggleThemeMode}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Ganti Tema (Day/Night)"
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Shift Status Capsule */}
          <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-1.5 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Shift</span>
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
