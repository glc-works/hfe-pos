import React, { useState, ReactNode } from 'react'
import { 
  Globe, Smartphone, Tablet, Monitor, Store, CreditCard, Receipt, Wrench, Layers, Minimize2, Maximize2, RotateCcw, Search, ChevronDown, Palette
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { ViewportProvider } from '../../context/ViewportContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { DevInspectorHud, HoveredElementInfo } from './DevInspectorHud'
import { PrimaryDomainApp, StaffSurfaceMode, PaymentPolicy, CafeThemeConfig } from '../../types/pos'

export type ViewportModeType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'tablet' | 'responsive'

export interface DevModePackProps {
  activeApp?: PrimaryDomainApp
  onSwitchDomain?: (app: PrimaryDomainApp) => void
  viewportMode?: ViewportModeType
  onSetViewportMode?: (mode: ViewportModeType) => void
  paymentPolicy?: PaymentPolicy
  onSetPaymentPolicy?: (policy: PaymentPolicy) => void
  activeTheme?: CafeThemeConfig
  onSelectTheme?: (theme: CafeThemeConfig) => void
  allThemes?: CafeThemeConfig[]
  activeStaffSurface?: StaffSurfaceMode
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void
  onResetMockState?: () => void
  children: ReactNode
}

/**
 * DevModePack v2.4 — Pure Ergonomic Shortcut Hub (Single-Door Consumer)
 * 
 * Interacts with the frontend strictly as a convenience shortcut connected to
 * the authoritative Single Door (`useMerchantConfig()`).
 */
export const DevModePack: React.FC<DevModePackProps> = ({
  activeApp: propActiveApp,
  onSwitchDomain: propOnSwitchDomain,
  viewportMode: propViewportMode,
  onSetViewportMode: propOnSetViewportMode,
  paymentPolicy: propPaymentPolicy,
  onSetPaymentPolicy: propOnSetPaymentPolicy,
  activeTheme: propActiveTheme,
  onSelectTheme: propOnSelectTheme,
  allThemes: propAllThemes,
  onResetMockState: propOnResetMockState,
  children
}) => {
  const { language, setLanguage } = useTranslation()
  const config = useMerchantConfig()

  // Resolve Single-Door Config values
  const activeApp = propActiveApp || (config.activeApp as PrimaryDomainApp)
  const onSwitchDomain = propOnSwitchDomain || ((app: PrimaryDomainApp) => config.setActiveApp(app))
  const viewportMode = propViewportMode || config.viewportMode
  const onSetViewportMode = propOnSetViewportMode || config.setViewportMode
  const paymentPolicy = propPaymentPolicy || config.paymentPolicy
  const onSetPaymentPolicy = propOnSetPaymentPolicy || config.setPaymentPolicy
  const activeTheme = propActiveTheme || config.customerTheme
  const onSelectTheme = propOnSelectTheme || config.setCustomerTheme
  const allThemes = propAllThemes || config.allAvailableThemes
  const onResetMockState = propOnResetMockState || config.onResetMockState

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false)
  const [hoveredInfo, setHoveredInfo] = useState<HoveredElementInfo | null>(null)
  const lastTargetRef = React.useRef<HTMLElement | null>(null)
  const isDevMode = Boolean(import.meta.env?.DEV && typeof window !== 'undefined' && window.location.port !== '4173')

  // Zero-Lag Hover Inspector with Target Caching & rAF Guard
  const handleContainerMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInspectMode) return
    const target = e.target as HTMLElement
    if (!target || target === e.currentTarget || target === lastTargetRef.current) return
    lastTargetRef.current = target

    requestAnimationFrame(() => {
      if (!isInspectMode) return
      const rect = target.getBoundingClientRect()
      const classes = typeof target.className === 'string' 
        ? target.className.split(/\s+/).filter(Boolean).slice(0, 15)
        : []

      const attributes: Record<string, string> = {}
      Array.from(target.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-') || attr.name === 'role' || attr.name === 'title' || attr.name === 'aria-label') {
          attributes[attr.name] = attr.value
        }
      })

      const textSnippet = target.innerText?.trim()?.slice(0, 45) || undefined
      const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button' || target.onclick !== null || classes.some(c => c.includes('cursor-pointer'))

      let componentHint = target.getAttribute('data-component') || undefined
      if (!componentHint) {
        if (target.closest('[data-component]')) {
          componentHint = target.closest('[data-component]')?.getAttribute('data-component') || undefined
        } else if (classes.some(c => c.includes('card') || c.includes('table'))) {
          componentHint = 'Card / Table Node'
        } else if (target.tagName === 'BUTTON') {
          componentHint = 'Action Button'
        }
      }

      setHoveredInfo({
        tagName: target.tagName,
        componentHint,
        textPreview: textSnippet,
        dimensions: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top),
          left: Math.round(rect.left)
        },
        classes,
        attributes,
        isClickable
      })
    })
  }

  // If in pure production build or user device standalone mode, render children directly with ViewportProvider
  if (!isDevMode) {
    return (
      <ViewportProvider viewportMode={viewportMode}>
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950">
          {children}
        </div>
      </ViewportProvider>
    )
  }

  return (
    <ViewportProvider viewportMode={viewportMode}>
      <div className="h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
        {/* ================= 1. DEV SHORTCUT TOOLBAR (SINGLE-DOOR CALLER) ================= */}
        {!isCollapsed ? (
          <header className="shrink-0 h-10 bg-slate-950 border-b border-slate-800 px-3 py-1 flex items-center justify-between gap-2 shadow-md z-30 select-none">
            {/* LEFT: ROLE SELECTOR & DEDICATED THEME SWITCHER */}
            <div className="flex items-center gap-2 shrink-0">
              {/* 1. ROLE / APP DOMAIN SELECTION DROPDOWN */}
              <div className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800 transition-all shadow-sm">
                {activeApp === 'customer' && <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                {activeApp === 'cafe' && <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                {activeApp === 'landing' && <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                {activeApp === 'design-system' && <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <select
                  value={activeApp}
                  onChange={(e) => onSwitchDomain(e.target.value as PrimaryDomainApp)}
                  aria-label="Pilih Role Pengguna"
                  className="bg-transparent text-xs font-black text-white outline-none cursor-pointer appearance-none pr-4"
                >
                  <optgroup label="👤 Peran / Role Pengguna" className="bg-slate-900 text-slate-400 font-normal">
                    <option value="customer" className="bg-slate-900 text-white font-bold">📱 Customer QR (Tamu)</option>
                    <option value="cafe" className="bg-slate-900 text-white font-bold">🏪 Kasir POS (Staf)</option>
                    <option value="landing" className="bg-slate-900 text-white font-bold">🌐 Landing Page (Publik)</option>
                  </optgroup>
                  <optgroup label="🛠️ Developer Tools" className="bg-slate-900 text-slate-400 font-normal">
                    <option value="design-system" className="bg-slate-900 text-white font-bold">📚 Design System (SSOT)</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3.5" />
              </div>

              {/* 2. DEDICATED THEME SWITCHER DROPDOWN */}
              {allThemes && allThemes.length > 0 && onSelectTheme && (
                <div className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800 transition-all shadow-sm">
                  <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={activeTheme?.themeName || allThemes[0].themeName}
                    onChange={(e) => {
                      const found = allThemes.find((t) => t.themeName === e.target.value)
                      if (found) onSelectTheme(found)
                    }}
                    aria-label="Pilih Tema Visual"
                    className="bg-transparent text-xs font-bold text-amber-300 outline-none cursor-pointer appearance-none pr-4 max-w-[160px] truncate"
                  >
                    <optgroup label="🎨 Preset Tema & Marketplace" className="bg-slate-900 text-slate-400 font-normal">
                      {allThemes.map((t) => (
                        <option key={t.themeName} value={t.themeName} className="bg-slate-900 text-white font-bold">
                          {t.themeName}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3.5" />
                </div>
              )}

              {/* 3. BUSINESS POLICY DROPDOWN */}
              {onSetPaymentPolicy && (
                <div className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800 transition-all shadow-sm">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={paymentPolicy}
                    onChange={(e) => onSetPaymentPolicy(e.target.value as PaymentPolicy)}
                    aria-label="Pilih Billing Policy"
                    className="bg-transparent text-xs font-bold text-amber-300 outline-none cursor-pointer appearance-none pr-4"
                  >
                    <option value="pay-first" className="bg-slate-900 text-white font-bold">💳 Pre-Paid (Pay First)</option>
                    <option value="open-tab" className="bg-slate-900 text-white font-bold">🧾 Post-Paid (Open Tab)</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3.5" />
                </div>
              )}

              {/* 4. HARDWARE VIEWPORT SELECTION DROPDOWN */}
              <div className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800 transition-all shadow-sm">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <select
                  value={viewportMode}
                  onChange={(e) => onSetViewportMode(e.target.value as ViewportModeType)}
                  aria-label="Pilih Frame Device Viewport"
                  className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none pr-4"
                >
                  <option value="mobile" className="bg-slate-900 text-white font-bold">📱 Mobile (380×660)</option>
                  <option value="tablet-portrait" className="bg-slate-900 text-white font-bold">📱 Tab Portrait (500×660)</option>
                  <option value="tablet-landscape" className="bg-slate-900 text-white font-bold">💻 Tab Landscape (880×560)</option>
                  <option value="responsive" className="bg-slate-900 text-white font-bold">🖥️ Desktop Fluid</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3.5" />
              </div>
            </div>

            {/* RIGHT: QUICK TOOLS CLUSTER */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* 1-TAP RESET BUTTON */}
              {onResetMockState && (
                <button
                  type="button"
                  onClick={onResetMockState}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-all shadow-sm shrink-0"
                  title="Reset Data Meja & Pesanan"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {/* LIVE HOVER INSPECTOR TOGGLE */}
              <button
                type="button"
                onClick={() => setIsInspectMode(!isInspectMode)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm border shrink-0 ${
                  isInspectMode 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-black' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Toggle Live Element Inspector on Hover"
              >
                <Search className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Inspect:</span> {isInspectMode ? 'ON' : 'OFF'}
              </button>

              {/* BILINGUAL LANGUAGE SELECTOR */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="px-2 py-1 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-sm transition-all shrink-0"
                title="Ganti Bahasa (ID / EN)"
              >
                {language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
              </button>

              {/* MINIMIZE DEV TOOLBAR BUTTON */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-all shadow-sm shrink-0"
                title="Sembunyikan Dev Toolbar (Mode Presentasi Bersih)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>
        ) : (
          /* FLOATING RESTORE BUTTON WHEN COLLAPSED */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="absolute top-2 right-2 z-50 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full text-xs font-bold text-amber-400 shadow-2xl flex items-center gap-1.5 backdrop-blur-md transition-all group hover:scale-105"
            title="Buka kembali Dev Toolbar"
          >
            <Wrench className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            <span>DevKit</span>
            <Maximize2 className="w-3 h-3 text-slate-400" />
          </button>
        )}

        {/* ================= 2. DEVICE FRAME VIEWPORT SIMULATOR WRAPPER & LIVE INSPECTOR ================= */}
        <div className={`flex-1 min-h-0 flex gap-4 transition-all ${
          viewportMode !== 'responsive' 
            ? 'p-2 overflow-hidden items-center justify-center' 
            : 'w-full h-full overflow-hidden items-stretch justify-start'
        }`}>
          {/* SIMULATED HARDWARE DEVICE FRAME */}
          <div className={`transition-all ${
            viewportMode === 'mobile'
              ? 'max-w-[380px] w-full h-full max-h-[660px] border-[8px] border-slate-800 rounded-[38px] shadow-2xl bg-slate-950 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50 my-auto mx-auto'
              : viewportMode === 'tablet-portrait'
              ? 'max-w-[500px] w-full h-full max-h-[660px] border-[10px] border-slate-800 rounded-[28px] shadow-2xl bg-slate-950 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50 my-auto mx-auto'
              : viewportMode === 'tablet-landscape' || viewportMode === 'tablet'
              ? 'max-w-[880px] w-full h-full max-h-[560px] border-[10px] border-slate-800 rounded-[24px] shadow-2xl bg-slate-950 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50 my-auto mx-auto'
              : 'w-full h-full flex-1 min-h-0 flex flex-col'
          }`}>
            {/* TOP NOTCH SPEAKER FOR SIMULATED MOBILE DEVICE */}
            {viewportMode === 'mobile' && (
              <div className="w-28 h-3.5 bg-slate-900 rounded-b-xl mx-auto z-50 shrink-0 border-b border-x border-slate-800 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>
            )}

            {/* TOP CAMERA BEZEL FOR TABLET PORTRAIT */}
            {viewportMode === 'tablet-portrait' && (
              <div className="w-2 h-2 bg-slate-700 rounded-full mx-auto mt-1.5 mb-1 shrink-0" title="Front Camera (Tablet Portrait)" />
            )}

            {/* TOP CAMERA BEZEL FOR TABLET LANDSCAPE */}
            {(viewportMode === 'tablet-landscape' || viewportMode === 'tablet') && (
              <div className="w-2 h-2 bg-slate-700 rounded-full mx-auto mt-1 mb-0.5 shrink-0" title="Front Camera (Tablet Landscape)" />
            )}

            {/* INNER CONTAINER WITH HOVER INSPECTION DELEGATION */}
            <div 
              className="flex-1 min-h-0 h-full flex flex-col relative overflow-hidden"
              onMouseOver={handleContainerMouseOver}
            >
              {children}
            </div>
          </div>

          {/* RIGHT SIDEBAR LIVE INSPECTOR HUD (MOUNTED OUTSIDE DEVICE CANVAS) */}
          {isInspectMode && viewportMode !== 'responsive' && (
            <div className="hidden lg:flex shrink-0">
              <DevInspectorHud
                hoveredElementInfo={hoveredInfo}
                isInspectMode={isInspectMode}
                onToggleInspectMode={() => setIsInspectMode(false)}
                onClose={() => setIsInspectMode(false)}
              />
            </div>
          )}
        </div>
      </div>
    </ViewportProvider>
  )
}
