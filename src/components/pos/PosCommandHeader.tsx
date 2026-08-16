import React from 'react'
import { Users, Store, BookOpen, Camera, ArrowRightLeft, ChevronDown } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useViewport } from '../../context/ViewportContext'

export interface PosCommandHeaderProps {
  posModeTab: 'tables' | 'catalog'
  enableTableFloorPlan?: boolean
  setPosModeTab: (tab: 'tables' | 'catalog') => void
  onOpenAppDrawer: () => void
  onOpenGuestBinding: () => void
  onOpenScanner: () => void
  onOpenTableOps: () => void
}

export const PosCommandHeader: React.FC<PosCommandHeaderProps> = ({
  posModeTab,
  enableTableFloorPlan = true,
  setPosModeTab,
  onOpenAppDrawer,
  onOpenGuestBinding,
  onOpenScanner,
  onOpenTableOps
}) => {
  const { t } = useTranslation()
  const { isMobile } = useViewport()

  return (
    <header className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-md shrink-0 select-none">
      {/* 1. LEFT: SINGLE-DOOR APP SUITE LAUNCHER */}
      <button
        type="button"
        onClick={onOpenAppDrawer}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-800 hover:from-amber-500/30 hover:to-slate-750 border border-amber-500/40 hover:border-amber-400/80 rounded-xl text-white transition-all shadow-sm group shrink-0"
        title="Buka 5 Core App Suites (Dapur KDS, Insights, Gudang, Pengaturan)"
      >
        <div className="w-5 h-5 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <Store className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span className="text-xs font-black text-white truncate">
          Kasir POS
        </span>
        <ChevronDown className="w-3 h-3 text-amber-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
      </button>

      {/* 2. CENTER: VIEW SWITCHER (PETA MEJA / KATALOG MENU) */}
      <div className="flex items-center gap-1 bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800 shrink-0">
        {enableTableFloorPlan && (
          <button
            type="button"
            onClick={() => setPosModeTab('tables')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
              posModeTab === 'tables' ? 'bg-white text-slate-950 shadow font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{isMobile ? 'Meja' : 'Peta Meja'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setPosModeTab('catalog')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
            posModeTab === 'catalog' ? 'bg-white text-slate-950 shadow font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>{isMobile ? 'Menu' : 'Katalog Menu'}</span>
        </button>
      </div>

      {/* 3. RIGHT: ACTION SHORTCUT BUTTONS (ICON-ONLY ON MOBILE TO PREVENT TEXT CLIPPING) */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenGuestBinding}
          className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
          title="Sambut Tamu & Alokasi Meja"
        >
          <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {!isMobile && <span>Sambut Tamu</span>}
        </button>

        <button
          type="button"
          onClick={onOpenScanner}
          className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
          title="Scan Barcode Produk SKU"
        >
          <Camera className="w-3.5 h-3.5 shrink-0" />
          {!isMobile && <span>Scan</span>}
        </button>

        {posModeTab === 'tables' && (
          <button
            type="button"
            onClick={onOpenTableOps}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
            title="Split / Pindah / Gabung Meja"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!isMobile && <span>Split / Join</span>}
          </button>
        )}
      </div>
    </header>
  )
}
