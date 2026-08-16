import React, { useState, useEffect, useRef } from 'react'
import { Search, Coffee, Users, Zap, UserCheck, ArrowRight, X, Sparkles, Command } from 'lucide-react'
import { MenuItem, TableStatus } from '../../types/pos'
import { PRODUCT_CATALOG, INITIAL_TABLES } from '../../data/mockData'
import { useTranslation } from '../../context/LanguageContext'

export interface SpotlightActionItem {
  id: string
  title: string
  subtitle: string
  category: 'product' | 'table' | 'action' | 'customer'
  icon: React.ReactNode
  onSelect: () => void
}

export interface SpotlightOmniSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct?: (item: MenuItem) => void
  onSelectTable?: (tableId: string) => void
  onOpenStorefrontStudio?: () => void
  onOpenScanner?: () => void
  onOpenTableOps?: () => void
  onOpenGuestBinding?: () => void
  onOpenNotifications?: () => void
  onNavigateApp?: (appId: string) => void
}

export const SpotlightOmniSearchModal: React.FC<SpotlightOmniSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectTable,
  onOpenStorefrontStudio,
  onOpenScanner,
  onOpenTableOps,
  onOpenGuestBinding,
  onOpenNotifications,
  onNavigateApp
}) => {
  const { formatPrice } = useTranslation()
  const [query, setQuery] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  // 1. Build Searchable Actions
  const systemActions: SpotlightActionItem[] = [
    {
      id: 'act-storefront-studio',
      title: 'Studio Kustomisasi Toko (Landing & QR)',
      subtitle: 'Atur banner, cerita merek, dan tata letak menu QR',
      category: 'action',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      onSelect: () => { onClose(); onOpenStorefrontStudio?.() }
    },
    {
      id: 'act-scan-barcode',
      title: 'Scan Barcode SKU Produk',
      subtitle: 'Buka kamera pemindai barcode kasir',
      category: 'action',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      onSelect: () => { onClose(); onOpenScanner?.() }
    },
    {
      id: 'act-table-ops',
      title: 'Split / Pindah / Gabung Tagihan Meja',
      subtitle: 'Relokasi meja dan merge multi-bill',
      category: 'action',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      onSelect: () => { onClose(); onOpenTableOps?.() }
    },
    {
      id: 'act-guest-binding',
      title: 'Sambut Tamu & Alokasi Meja',
      subtitle: 'Input jumlah pax dan nama tamu walk-in',
      category: 'action',
      icon: <UserCheck className="w-4 h-4 text-cyan-400" />,
      onSelect: () => { onClose(); onOpenGuestBinding?.() }
    },
    {
      id: 'act-notifications',
      title: 'Pusat Notifikasi & Service Tickets',
      subtitle: 'Buka drawer chits waiter dan panggilan pelanggan',
      category: 'action',
      icon: <Zap className="w-4 h-4 text-rose-400" />,
      onSelect: () => { onClose(); onOpenNotifications?.() }
    },
    {
      id: 'act-nav-kds',
      title: 'Buka Layar Dapur KDS',
      subtitle: 'Masuk ke antrean pesanan masak dan barista bar',
      category: 'action',
      icon: <Coffee className="w-4 h-4 text-amber-400" />,
      onSelect: () => { onClose(); onNavigateApp?.('kds') }
    },
    {
      id: 'act-nav-insights',
      title: 'Buka Laporan Owner Insights & ESG',
      subtitle: 'Analisis omzet, margin produk, dan ringkasan shift',
      category: 'action',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      onSelect: () => { onClose(); onNavigateApp?.('insights') }
    },
    {
      id: 'act-nav-member-portal',
      title: 'Buka Member Account Portal',
      subtitle: 'Apple Wallet pass, voucher aktif, dan riwayat struk',
      category: 'action',
      icon: <UserCheck className="w-4 h-4 text-blue-400" />,
      onSelect: () => { onClose(); onNavigateApp?.('customer-portal') }
    }
  ]

  // 2. Build Product Items
  const productActions: SpotlightActionItem[] = PRODUCT_CATALOG.map((item: MenuItem) => ({
    id: `prod-${item.id}`,
    title: item.name,
    subtitle: `${formatPrice(item.price)} • ${item.category} • ${item.description || 'Artisan item'}`,
    category: 'product',
    icon: <Coffee className="w-4 h-4 text-amber-400" />,
    onSelect: () => { onClose(); onSelectProduct?.(item) }
  }))

  // 3. Build Table Items
  const tableActions: SpotlightActionItem[] = INITIAL_TABLES.map((t: TableStatus) => ({
    id: `tbl-${t.id}`,
    title: `Meja ${t.name || t.id} (${t.zoneId || 'Main Floor'})`,
    subtitle: `Kapasitas: ${t.pax || 4} Pax • Status: ${t.status} ${t.seatedDurationMinutes ? `• ⏱️ ${t.seatedDurationMinutes}m` : ''}`,
    category: 'table',
    icon: <Users className="w-4 h-4 text-cyan-400" />,
    onSelect: () => { onClose(); onSelectTable?.(t.id) }
  }))

  const allItems = [...systemActions, ...productActions, ...tableActions]

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return item.category === 'action' || item.id.includes('prod-1') || item.id.includes('tbl-OUT')
    const q = query.toLowerCase()
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
  }).slice(0, 8)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP SEARCH BAR */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Cari menu, meja, aksi cepat, atau buka modul..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 font-medium focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono font-bold text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
          >
            Tutup
          </button>
        </div>

        {/* RESULTS LIST */}
        <div className="max-h-80 min-h-48 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-bold">Tidak ada hasil untuk "{query}"</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Coba ketik kata kunci seperti 'Kopi', 'Meja', atau 'Studio'</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.category === 'action' ? 'bg-indigo-500/20' : item.category === 'table' ? 'bg-cyan-500/20' : 'bg-amber-500/20'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      item.category === 'action'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : item.category === 'table'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* FOOTER HINTS */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigasi</span>
            <span>↵ Pilih</span>
            <span>Esc Keluar</span>
          </div>
          <span className="text-amber-400 font-bold">Hfe Spotlight Omni-Search</span>
        </div>
      </div>
    </div>
  )
}
