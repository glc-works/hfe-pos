import React, { useState } from 'react'
import { 
  Wrench, Globe, Smartphone, Store, Layers, CreditCard, Palette, RotateCcw, X, ChevronRight, Check, Bell
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useNotification } from '../../context/NotificationContext'
import { PrimaryDomainApp, StaffSurfaceMode, PaymentPolicy, CafeThemeConfig } from '../../types/pos'

export interface FloatKitProps {
  activeStaffSurface?: StaffSurfaceMode
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void
}

/**
 * FloatKit v3.0 — Pure Floating Dev Quick-Settings (Single-Door SSOT Consumer)
 * 
 * Replaces cumbersome simulated iframe wrappers with a non-intrusive floating action widget.
 * Relies 100% on Native Browser DevTools for responsive testing.
 * Automatically stripped in production builds (!import.meta.env.DEV).
 */
export const FloatKit: React.FC<FloatKitProps> = ({
  activeStaffSurface,
  setActiveStaffSurface
}) => {
  const isDevMode = Boolean(
    import.meta.env?.DEV ||
    (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174' || window.location.hostname === 'localhost'))
  )
  const { language, setLanguage } = useTranslation()
  const config = useMerchantConfig()
  const { addNotification, createServiceTicket } = useNotification()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  // Quick toggle via Option+D / Alt+D
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Only render in local development mode
  if (!isDevMode) {
    return null
  }

  const activeApp = config.activeApp as PrimaryDomainApp
  const paymentPolicy = config.paymentPolicy
  const activeTheme = config.customerTheme
  const allThemes = config.allAvailableThemes

  const isHighlighted = isOpen || isHovered

  return (
    <>
      {/* 1. FLOATING ACTION PILL (D悵CKED AT BOTTOM-2 LEFT-2, UNOBTRUSIVE WITH OPTION+D SHORTCUT) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-2 left-2 z-[99999] px-2 py-1 rounded-full flex items-center gap-1 font-black text-[10px] transition-all duration-200 ease-out select-none cursor-pointer shadow-lg ${
          isHighlighted
            ? 'bg-slate-900 text-amber-300 border border-amber-400 ring-2 ring-black/70 opacity-100 scale-100 shadow-2xl backdrop-blur-xl'
            : 'bg-slate-950/30 text-amber-400/50 border border-amber-500/10 opacity-25 hover:opacity-100 shadow-none backdrop-blur-[2px]'
        }`}
        title={isOpen ? 'Tutup FloatKit (⌥D)' : 'Buka FloatKit (⌥D)'}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-lg transition-all ${isHighlighted ? 'bg-amber-400 animate-pulse' : 'bg-amber-400/40'}`} />
        <Wrench className={`w-2.5 h-2.5 transition-transform shrink-0 ${isOpen ? 'rotate-90 text-amber-300' : isHovered ? 'rotate-45 text-amber-300' : ''}`} />
        <span className={`font-extrabold tracking-wide text-[9px] transition-colors ${isHighlighted ? 'text-white' : 'text-white/60'}`}>Dev</span>
        <span className={`text-[7px] font-mono px-1 py-0.2 rounded uppercase font-bold border transition-all ${
          isHighlighted
            ? 'text-amber-300 bg-slate-800 border-amber-400/60'
            : 'text-amber-300/60 bg-slate-900/40 border-slate-700/40'
        }`}>
          {activeApp === 'customer' ? 'QR' : activeApp === 'cafe' ? 'POS' : activeApp === 'customer-portal' ? 'CARD' : activeApp}
        </span>
      </button>

      {/* 2. QUICK SETTINGS MODAL DRAWER */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-start p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideUp text-slate-100 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* MODAL HEADER */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    FloatKit Quick Settings
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Single Source of Truth (SSOT) Control Panel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    config.onResetMockState?.()
                    setIsOpen(false)
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-all text-xs flex items-center gap-1"
                  title="Reset Semua State Mock Data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all cursor-pointer"
                  title="Tutup FloatKit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE SETTINGS BODY */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">

              {/* GROUP A: SURFACE & ROLE NAVIGATION */}
              <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  A. Navigasi Surface & Domain
                </label>
                
                {/* 1. Primary App */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'customer', label: '📱 Customer QR' },
                    { id: 'customer-portal', label: '💳 Member Portal' },
                    { id: 'cafe', label: '🏪 POS & Resto' },
                    { id: 'landing', label: '🌐 Landing Page' },
                    { id: 'design-system', label: '🎨 Design Lab' }
                  ].map((dom) => (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => config.setActiveApp(dom.id as PrimaryDomainApp)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                        activeApp === dom.id
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{dom.label}</span>
                      {activeApp === dom.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* 2. Staff Roles (Conditional when in Cafe domain) */}
                {activeApp === 'cafe' && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 animate-fadeIn">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Store className="w-3 h-3" /> Peran Staf Kasir / Dapur:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'barista-pos', label: '🏪 Kasir' },
                        { id: 'hfe-company-book', label: '📚 Books' },
                        { id: 'kds-screen', label: '🍳 Dapur' },
                        { id: 'checker-qc', label: '🔍 Checker' },
                        { id: 'server-waiter', label: '🍽️ Server' },
                        { id: 'hfe-insights', label: '📈 Insights' },
                        { id: 'hfe-connect-hub', label: '🧩 Connect' },
                        { id: 'cafe-config', label: '⚙️ Settings' }
                      ].map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setActiveStaffSurface?.(role.id as StaffSurfaceMode)}
                          className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all truncate ${
                            activeStaffSurface === role.id
                              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow font-black'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* GROUP B: OPERATIONAL SETTINGS & POLICY */}
              <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  B. Kebijakan Operasional Kasir
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'pay-first', label: '⚡ Pay-First (Langsung Bayar)' },
                    { id: 'open-tab', label: '📑 Open-Tab (Buka Tagihan Meja)' }
                  ].map((pol) => (
                    <button
                      key={pol.id}
                      type="button"
                      onClick={() => config.setPaymentPolicy(pol.id as PaymentPolicy)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition-all truncate ${
                        paymentPolicy === pol.id
                          ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {pol.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GROUP C: THEME & LANGUAGE */}
              <div className="flex flex-col gap-2.5 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  C. Tema Visual & Bahasa
                </label>

                {/* Tema Selector Dropdown / Pills */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-mono">Pilih Preset Tema Pelanggan:</span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1 no-scrollbar">
                    {allThemes.map((th, idx) => {
                      const themeDisplayName = th.themeName || (th as any).name || th.brandName || `Theme ${idx + 1}`
                      const isCurrentActive = (activeTheme.themeName && activeTheme.themeName === th.themeName) || (activeTheme.themeId && activeTheme.themeId === th.themeId)

                      return (
                        <button
                          key={th.themeId || th.themeName || idx}
                          type="button"
                          onClick={() => config.setCustomerTheme(th)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 text-left ${
                            isCurrentActive
                              ? 'bg-pink-500/15 border-pink-500/50 text-pink-300 shadow font-black'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                            style={{ backgroundColor: th.primaryAccentHex || '#d97706' }}
                          />
                          <span className="truncate">{themeDisplayName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Language Selector */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3 text-cyan-400" /> Bahasa (i18n):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLanguage('id')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        language === 'id'
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      🇮🇩 Bahasa Indonesia (ID)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        language === 'en'
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow font-black'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      🇬🇧 English (EN)
                    </button>
                  </div>
                </div>
              </div>

              {/* GROUP D: SIMULASI NOTIFIKASI & SERVICE CHITS */}
              <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  D. Simulasi Alert & Panggilan
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      createServiceTicket({
                        tableNumber: 'OUT-04',
                        type: 'bill_request',
                        notes: 'Simulasi Minta Tagihan Kasir'
                      })
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-amber-400 text-left transition-all active:scale-95"
                  >
                    🛎️ Panggil Waiter
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addNotification({
                        title: '⚠️ Peringatan Alergen',
                        message: 'Tamu Meja VIP-01 memiliki alergi Seafood & Kacang.',
                        category: 'safety_allergen',
                        priority: 'urgent',
                        tableNumber: 'VIP-01'
                      })
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-rose-400 text-left transition-all active:scale-95"
                  >
                    ⚠️ Alert Alergen
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addNotification({
                        title: '🎟️ Tiket Event Terjual',
                        message: 'Tiket Roasting Workshop #2026-099 berhasil diverifikasi.',
                        category: 'tickets',
                        priority: 'normal'
                      })
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-sky-400 text-left transition-all active:scale-95"
                  >
                    🎟️ Tiket Gate-In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addNotification({
                        title: '💰 Rekon Shift Kasir',
                        message: 'Shift Siang: Kas tercatat Rp 2.800.000 cocok 100%.',
                        category: 'financial_shifts',
                        priority: 'normal'
                      })
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-emerald-400 text-left transition-all active:scale-95"
                  >
                    💰 Alert Keuangan
                  </button>
                </div>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>🚀 Pure Native Viewport</span>
              <span className="text-amber-400/80">Use Chrome DevTools (Cmd+Option+I)</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
