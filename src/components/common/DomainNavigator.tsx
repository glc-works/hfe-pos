import React from 'react'
import { PrimaryDomainApp, StaffSurfaceMode, PaymentPolicy } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'
import {
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Store,
  CreditCard,
  Receipt
} from 'lucide-react'

export type ViewportModeType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'tablet' | 'responsive'

interface DomainNavigatorProps {
  activeApp: PrimaryDomainApp
  cafeUsername: string
  onSwitchDomain: (app: PrimaryDomainApp) => void
  activeStaffSurface?: StaffSurfaceMode
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void
  viewportMode?: ViewportModeType
  onSetViewportMode?: (mode: ViewportModeType) => void
  paymentPolicy?: PaymentPolicy
  onSetPaymentPolicy?: (policy: PaymentPolicy) => void
}

export const DomainNavigator: React.FC<DomainNavigatorProps> = ({
  activeApp,
  onSwitchDomain,
  viewportMode = 'responsive',
  onSetViewportMode,
  paymentPolicy = 'pay-first',
  onSetPaymentPolicy
}) => {
  const { language, setLanguage } = useTranslation()

  return (
    <header className="shrink-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 shadow-md z-50 overflow-x-auto no-scrollbar whitespace-nowrap">
      {/* 1-TAP APP DOMAIN SWITCHER (ENGLISH DEV TOOLBAR) */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onSwitchDomain('landing')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              activeApp === 'landing'
                ? 'bg-white text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Landing Page
          </button>

          <button
            type="button"
            onClick={() => onSwitchDomain('customer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              activeApp === 'customer'
                ? 'bg-white text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Customer QR
          </button>

          <button
            type="button"
            onClick={() => onSwitchDomain('cafe')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              activeApp === 'cafe'
                ? 'bg-white text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Cashier & Staff
          </button>
        </div>

        {/* QUICK PAYMENT POLICY SWITCHER (MERCHANT POLICY DEV TESTING) */}
        {onSetPaymentPolicy && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 text-xs">
            <span className="text-[10px] text-slate-400 font-mono pl-1">Policy:</span>
            <button
              type="button"
              onClick={() => onSetPaymentPolicy('pay-first')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                paymentPolicy === 'pay-first'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pay-First (Pre-Paid): Bayar Dulu Baru Diproses"
            >
              <CreditCard className="w-3 h-3" /> Pay-First (Pre)
            </button>
            <button
              type="button"
              onClick={() => onSetPaymentPolicy('open-tab')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                paymentPolicy === 'open-tab'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Open-Tab (Post-Paid): Pesan Dulu, Bayar Saat Pulang"
            >
              <Receipt className="w-3 h-3" /> Open-Tab (Post)
            </button>
          </div>
        )}
      </div>

      {/* RIGHT CONTROLS: VIEWPORT SIMULATION (MOBILE, TAB PORTRAIT, TAB LANDSCAPE, DESKTOP) + LANG */}
      <div className="flex items-center gap-2 shrink-0">
        {onSetViewportMode && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onSetViewportMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'mobile'
                  ? 'bg-white text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390x844)"
            >
              <Smartphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => onSetViewportMode('tablet-portrait')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'tablet-portrait'
                  ? 'bg-white text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet Portrait / Kiosk / Waiter (640x840)"
            >
              <Tablet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tab Portrait</span>
            </button>
            <button
              type="button"
              onClick={() => onSetViewportMode('tablet-landscape')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'tablet-landscape' || viewportMode === 'tablet'
                  ? 'bg-white text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet Landscape / Counter POS (1024x640)"
            >
              <Tablet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tab Landscape</span>
            </button>
            <button
              type="button"
              onClick={() => onSetViewportMode('responsive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'responsive'
                  ? 'bg-white text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop / Native Fluid Layout"
            >
              <Monitor className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>
        )}

        {/* BILINGUAL SELECTOR */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setLanguage('id')}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              language === 'id'
                ? 'bg-white text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇩 ID
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              language === 'en'
                ? 'bg-white text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>
    </header>
  )
}
