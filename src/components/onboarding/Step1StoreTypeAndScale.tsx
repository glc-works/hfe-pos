import React from 'react'
import { BusinessCluster, MigrationSource, SupportedCountry, SupportedCurrency } from '../../types/pos'
import { Button } from '@/ui'
import { Coffee, Flame, Sprout, Ship, ShoppingCart, Sliders, CheckCircle2, Sparkles, Globe, ArrowRightLeft } from 'lucide-react'

interface Props {
  selectedCluster: BusinessCluster
  migrationSource: MigrationSource
  country: SupportedCountry
  currency: SupportedCurrency
  onSelectCluster: (cluster: BusinessCluster) => void
  onSelectMigrationSource: (source: MigrationSource) => void
  onSelectCountryCurrency: (country: SupportedCountry, currency: SupportedCurrency) => void
  onApplyPersona: (persona: 'bsd' | 'roastery') => void
}

export const Step1StoreTypeAndScale: React.FC<Props> = ({
  selectedCluster,
  migrationSource,
  country,
  currency,
  onSelectCluster,
  onSelectMigrationSource,
  onSelectCountryCurrency,
  onApplyPersona,
}) => {
  const clusters = [
    {
      id: 'CLUSTER_FNB' as BusinessCluster,
      title: 'Kafe & Resto F&B',
      emoji: '☕',
      icon: Coffee,
      badge: 'Table Floor Plan & Modifiers',
      description: 'Dirancang untuk Cafe, Bistro, & Eatery. Dilengkapi Table Floor Plan, KDS Kanban & Recipe BOM.',
    },
    {
      id: 'CLUSTER_ROASTERY' as BusinessCluster,
      title: 'Roasting & Manufaktur',
      emoji: '🔥',
      icon: Flame,
      badge: 'BOM & Green Bean Shrinkage',
      description: 'Spesialis Roastery & Manufaktur Kopi. Dilengkapi Batch Roaster BOM & Invoice Grosir B2B.',
    },
    {
      id: 'CLUSTER_PLANTATION' as BusinessCluster,
      title: 'Perkebunan Agrikultur',
      emoji: '🌱',
      icon: Sprout,
      badge: 'PSAK 69 Biological Asset',
      description: 'Manajemen Kebun Kopi & Lahan. Dilengkapi Penilaian Aset Biologis & Hasil Panen Multi-Plot.',
    },
    {
      id: 'CLUSTER_TRADING' as BusinessCluster,
      title: 'Ekspor & Cross-Border',
      emoji: '🚢',
      icon: Ship,
      badge: 'Multi-Currency & Container',
      description: 'Perdagangan Ekspor & Distribusi Global. Dilengkapi Valuta Asing & Eliminasi Antar-Entitas.',
    },
    {
      id: 'CLUSTER_RETAIL' as BusinessCluster,
      title: 'Retail & Toko Kelontong',
      emoji: '🛒',
      icon: ShoppingCart,
      badge: 'Barcode & Multi-UOM',
      description: 'Retail & Minimarket. Dilengkapi Barcode Scanner, Multi-UOM Grosir, & Kasbon Ledger.',
    },
    {
      id: 'CLUSTER_OTHER' as BusinessCluster,
      title: 'Kustom & Usaha Lainnya',
      emoji: '⚙️',
      icon: Sliders,
      badge: 'Custom CoA & Workflows',
      description: 'Untuk jenis usaha komersial lainnya. Menyesuaikan bagan akun & alur kerja kustom.',
    },
  ]

  const migrationOptions = [
    { id: 'fresh' as MigrationSource, title: 'Fresh Start (Mulai Baru)', icon: '✨', desc: 'Setup dari awal tanpa migrasi' },
    { id: 'xero' as MigrationSource, title: 'Xero Cloud', icon: '🟢', desc: 'Sync Akun & Kontak' },
    { id: 'moka' as MigrationSource, title: 'Moka POS', icon: '🟣', desc: 'Katalog & Riwayat' },
    { id: 'jurnal' as MigrationSource, title: 'Mekari Jurnal', icon: '🔵', desc: 'CoA & Saldo Awal' },
    { id: 'accurate' as MigrationSource, title: 'Accurate Online', icon: '🔴', desc: 'Master Barang & GL' },
    { id: 'csv' as MigrationSource, title: 'File CSV / Excel', icon: '📄', desc: 'Import massal template' },
  ]

  const countries = [
    { code: 'ID' as SupportedCountry, currency: 'IDR' as SupportedCurrency, flag: '🇮🇩', label: 'Indonesia (IDR - Rp)' },
    { code: 'SG' as SupportedCountry, currency: 'SGD' as SupportedCurrency, flag: '🇸🇬', label: 'Singapore (SGD - S$)' },
    { code: 'MY' as SupportedCountry, currency: 'MYR' as SupportedCurrency, flag: '🇲🇾', label: 'Malaysia (MYR - RM)' },
    { code: 'HK' as SupportedCountry, currency: 'HKD' as SupportedCurrency, flag: '🇭🇰', label: 'Hong Kong (HKD - HK$)' },
  ]

  return (
    <div className="space-y-5">
      {/* Quick Persona Presets */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
            Quick Persona 1-Click Preset:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={() => onApplyPersona('bsd')}
            className="text-xs h-7 px-2.5 font-bold shadow-sm"
          >
            ⚡ 1-Click Persona: Kafe BSD
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onApplyPersona('roastery')}
            className="text-xs h-7 px-2.5 font-bold bg-amber-600/20 text-amber-900 dark:text-amber-100 hover:bg-amber-600/30 border border-amber-900/20"
          >
            ⚡ Persona: Roastery
          </Button>
        </div>
      </div>

      {/* Jalur Onboarding (Fresh vs Migration Bridge) */}
      <div>
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          1. Jalur Onboarding & 1-Click Migration Bridge
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {migrationOptions.map((opt) => {
            const isSelected = migrationSource === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectMigrationSource(opt.id)}
                className={`p-2.5 text-left rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/15 shadow-sm ring-1 ring-amber-500/30'
                    : 'border-amber-900/15 bg-amber-500/5 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                  <span>{opt.icon}</span>
                  <span className="truncate">{opt.title}</span>
                </div>
                <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 mt-0.5 truncate">
                  {opt.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5 Specialist Clusters + CLUSTER_OTHER */}
      <div>
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          2. Pilih 5 Specialist Business Clusters (+ Other)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {clusters.map((c) => {
            const isSelected = selectedCluster === c.id
            const IconComp = c.icon
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCluster(c.id)}
                className={`relative p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/15 shadow-sm ring-2 ring-amber-500/30'
                    : 'border-amber-900/15 bg-amber-500/5 hover:border-amber-500/40'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-amber-600/15 text-amber-700 dark:text-amber-300">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-950 dark:text-amber-100">
                      {c.title}
                    </h5>
                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 block">
                      {c.badge}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70 leading-snug">
                  {c.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Negara & Mata Uang */}
      <div>
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          3. Negara & Mata Uang Operasional
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {countries.map((ct) => {
            const isSelected = country === ct.code && currency === ct.currency
            return (
              <button
                key={ct.code}
                type="button"
                onClick={() => onSelectCountryCurrency(ct.code, ct.currency)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                    : 'border-amber-900/15 bg-amber-500/5 text-amber-950 dark:text-amber-100 hover:bg-amber-500/10'
                }`}
              >
                <span className="text-base">{ct.flag}</span>
                <span className="truncate">{ct.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
