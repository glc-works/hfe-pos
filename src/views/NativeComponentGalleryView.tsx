import React, { useState, useMemo } from 'react'
import {
  Layers, Search, Moon, Sun, Globe, Smartphone, Tablet, Monitor,
  Sparkles, CheckCircle2, ChevronRight, Copy, Check, ArrowRight,
  CreditCard, QrCode, Banknote, Coffee, Tag, ShieldCheck
} from 'lucide-react'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { Badge } from '../ui/Badge'
import { PriceTag } from '../ui/PriceTag'
import { TextInput } from '../ui/TextInput'
import { SegmentedControl } from '../ui/SegmentedControl'
import { ToggleSwitch } from '../ui/ToggleSwitch'
import { CapacityBadge } from '../ui/CapacityBadge'
import { TimerPill } from '../ui/TimerPill'
import { MinSpendPill } from '../ui/MinSpendPill'
import { ProductCard } from '../components/shared/ProductCard'
import { TableCard } from '../components/shared/TableCard'
import { useMerchantConfig } from '../context/MerchantConfigContext'
import { useTranslation } from '../context/LanguageContext'
import { useViewport } from '../context/ViewportContext'
import { PRODUCT_CATALOG, INITIAL_TABLES } from '../data/mockData'

export type GalleryCategory = 'all' | 'tokens' | 'atoms' | 'widgets'

export const NativeComponentGalleryView: React.FC = () => {
  const { themeMode, toggleThemeMode } = useMerchantConfig()
  const { language: currentLanguage, setLanguage, t } = useTranslation()
  const { isMobile } = useViewport()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [demoToggle, setDemoToggle] = useState<boolean>(true)
  const [demoSegment, setDemoSegment] = useState<string>('dine_in')

  const isLight = themeMode === 'light'

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const sampleProduct = PRODUCT_CATALOG[0]
  const sampleTable = INITIAL_TABLES[0]

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* 1. TOP COMMAND BAR */}
      <header className={`shrink-0 z-30 border-b px-4 py-3 flex items-center justify-between gap-3 sticky top-0 backdrop-blur-xl ${
        isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black truncate">
                Native Component Gallery
              </h1>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shrink-0">
                ZERO-DRIFT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
              Living design system, Tier 1 tokens, Tier 2 atoms & domain widgets in real runtime.
            </p>
          </div>
        </div>

        {/* Global Playground Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleThemeMode}
            className="flex items-center gap-1.5 font-bold"
            title="Toggle Light / Dark Mode"
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isLight ? 'Dark Mode' : 'Day Mode'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(currentLanguage === 'id' ? 'en' : 'id')}
            className="flex items-center gap-1.5 font-bold"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>{currentLanguage.toUpperCase()}</span>
          </Button>
        </div>
      </header>

      {/* 2. CATEGORY TABS & SEARCH BAR */}
      <div className={`shrink-0 border-b px-4 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Semua Komponen' },
            { id: 'tokens', label: 'Tier 1: Tokens' },
            { id: 'atoms', label: 'Tier 2: Atoms' },
            { id: 'widgets', label: 'Tier 3: Widgets' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={selectedCategory === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(tab.id as GalleryCategory)}
              className="shrink-0 text-xs font-bold"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari atom, token, widget..."
            className={`w-full text-xs font-medium pl-9 pr-3 py-1.5 rounded-xl border outline-none transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* 3. GALLERY CONTENT CANVAS */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto flex flex-col gap-8">
        {/* SECTION 1: TIER 1 TOKENS */}
        {(selectedCategory === 'all' || selectedCategory === 'tokens') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>🎨 Tier 1: Design Tokens & Micro-Glyphs</span>
                <Badge variant="emerald">Tokens</Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Token Card 1: Glyphs */}
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Semantic Micro-Glyphs</h3>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">👥 3/4 Kursi</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">⏱️ 45m</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">🍽️ 4 Menu</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">👑 74% Min Spend</span>
                </div>
              </div>

              {/* Token Card 2: Monetary Numbers */}
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tabular Currency Figures</h3>
                <div className="flex flex-col gap-1.5">
                  <PriceTag amount={120000} size="lg" />
                  <PriceTag amount={1850000000} size="md" />
                  <PriceTag amount={42500} size="sm" />
                </div>
              </div>

              {/* Token Card 3: Status Colors */}
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Semantic Color Accents</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="emerald">Emerald (Success/Paid)</Badge>
                  <Badge variant="amber">Amber (Open Bill)</Badge>
                  <Badge variant="destructive">Rose (Shortage/Alert)</Badge>
                  <Badge variant="indigo">Indigo (QRIS/Card)</Badge>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: TIER 2 ATOMS */}
        {(selectedCategory === 'all' || selectedCategory === 'atoms') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>⚛️ Tier 2: React Aria Atoms & Primitives</span>
                <Badge variant="emerald">Atoms</Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Atom Card: Buttons */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Button Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="md">Primary</Button>
                  <Button variant="emerald" size="md">Emerald Pay</Button>
                  <Button variant="secondary" size="md">Secondary</Button>
                  <Button variant="amber" size="md">Amber Warning</Button>
                  <Button variant="danger" size="md">Danger</Button>
                  <Button variant="ghost" size="md">Ghost</Button>
                </div>
              </div>

              {/* Atom Card: Badges & Pills */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pills & Badges</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <CapacityBadge seatedGuests={3} maxCapacity={4} />
                  <TimerPill elapsedMinutes={25} />
                  <MinSpendPill currentBill={1850000} minimumSpend={2500000} />
                </div>
              </div>

              {/* Atom Card: Controls */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Segmented Control & Toggle</h3>
                <SegmentedControl
                  options={[
                    { value: 'dine_in', label: '🍽️ Dine-in' },
                    { value: 'takeaway', label: '🛍️ Takeaway' },
                    { value: 'delivery', label: '🛵 Delivery' }
                  ]}
                  value={demoSegment}
                  onChange={setDemoSegment}
                />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold">Auto-Print Thermal Struk</span>
                  <ToggleSwitch checked={demoToggle} onChange={setDemoToggle} />
                </div>
              </div>

              {/* Atom Card: TextInput */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Text Input</h3>
                <TextInput
                  label="No. WhatsApp Pelanggan"
                  placeholder="0812-3456-7890"
                  defaultValue="081234567890"
                />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: TIER 3 DOMAIN WIDGETS */}
        {(selectedCategory === 'all' || selectedCategory === 'widgets') && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>🧩 Tier 3: Domain Widgets</span>
                <Badge variant="indigo">Widgets</Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Card Showcase */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ProductCard (Customer QR Variant)</h3>
                <ProductCard
                  product={sampleProduct}
                  quantityInCart={2}
                  variant="customer-card"
                />
              </div>

              {/* Table Card Showcase */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">TableCard (Dining Floor Plan)</h3>
                <TableCard
                  table={sampleTable}
                  slotSpan={1}
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
