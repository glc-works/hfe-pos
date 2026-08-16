import React, { useState } from 'react'
import { 
  Wrench, Globe, Smartphone, Store, Layers, CreditCard, Palette, RotateCcw, X, ChevronRight, Check
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
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
  const isDevMode = Boolean(import.meta.env?.DEV && typeof window !== 'undefined' && window.location.port !== '4173')
  const { language, setLanguage } = useTranslation()
  const config = useMerchantConfig()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Only render in local development mode
  if (!isDevMode) {
    return null
  }

  const activeApp = config.activeApp as PrimaryDomainApp
  const paymentPolicy = config.paymentPolicy
  const activeTheme = config.customerTheme
  const allThemes = config.allAvailableThemes

  return (
    <>
      {/* 1. FLOATING ACTION PILL (BOTTOM-LEFT CORNER) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 px-3.5 py-2 bg-slate-900/95 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2 font-bold text-xs transition-all hover:scale-105 active:scale-95 group select-none ring-1 ring-black/40"
        title="Buka FloatKit Quick Settings"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <Wrench className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform shrink-0" />
        <span className="font-extrabold tracking-wide text-slate-100">FloatKit</span>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded uppercase">
          {activeApp === 'customer-app' ? 'QR' : activeApp === 'cafe' ? 'POS' : activeApp}
        </span>
      </button>

      {/* 2. QUICK SETTINGS MODAL DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-start p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideUp text-slate-100 font-sans">
            
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
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                  title="Tutup FloatKit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE SETTINGS BODY */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">

              {/* SECTION 1: PRIMARY DOMAIN APP SWITCHER */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-amber-400" />
                  1. Domain Surface Aktif
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'customer-app', label: '📱 Customer QR Menu' },
                    { id: 'cafe', label: '🏪 POS & Resto Kasir' },
                    { id: 'landing', label: '🌐 Landing Page Cafe' },
                    { id: 'design-system', label: '🎨 Design System Lab' }
                  ].map((dom) => (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => config.setActiveApp(dom.id as PrimaryDomainApp)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                        activeApp === dom.id
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{dom.label}</span>
                      {activeApp === dom.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: RESTO STAFF ROLE SWITCHER (WHEN IN CAFE DOMAIN) */}
              {activeApp === 'cafe' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Store className="w-3 h-3 text-emerald-400" />
                    2. Resto Staff Role Surface
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'barista-pos', label: '🏪 Kasir POS' },
                      { id: 'kds-screen', label: '🍳 Dapur KDS' },
                      { id: 'checker-qc', label: '🔍 Checker' },
                      { id: 'server-waiter', label: '🍽️ Server' },
                      { id: 'hfe-insights', label: '📈 Insights' },
                      { id: 'cafe-config', label: '⚙️ Settings' }
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setActiveStaffSurface?.(role.id as StaffSurfaceMode)}
                        className={`p-2 rounded-xl text-[11px] font-bold text-center border transition-all truncate ${
                          activeStaffSurface === role.id
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: PAYMENT SETTLEMENT POLICY */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-indigo-400" />
                  3. Payment Policy Setting
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'pay-first', label: '⚡ Pay-First' },
                    { id: 'open-tab', label: '📑 Open-Tab' },
                    { id: 'split-bill', label: '👥 Split-Bill' }
                  ].map((pol) => (
                    <button
                      key={pol.id}
                      type="button"
                      onClick={() => config.setPaymentPolicy(pol.id as PaymentPolicy)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition-all truncate ${
                        paymentPolicy === pol.id
                          ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {pol.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4: CUSTOMER THEME SELECTOR */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-pink-400" />
                  4. Tema Visual Pelanggan
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {allThemes.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => config.setCustomerTheme(th)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                        activeTheme.id === th.id
                          ? 'bg-pink-500/15 border-pink-500/50 text-pink-300 shadow font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                        style={{ backgroundColor: th.primaryAccentHex }}
                      />
                      <span className="truncate">{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: BILINGUAL LANGUAGE SWITCHER */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  5. Bahasa Tampilan (i18n)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      language === 'id'
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
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
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    🇬🇧 English (EN)
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
