import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Coffee,
  Table,
  ShoppingBag,
  TrendingUp,
  Landmark,
  Building2,
  Calendar,
  Ticket,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Lock,
  DollarSign,
  Printer,
  Package,
  Layers
} from 'lucide-react'

export type SpotlightRole = 'cashier' | 'warehouse' | 'owner'

export interface SpotlightItem {
  id: string
  title: string
  subtitle: string
  category: 'menu_product' | 'table_order' | 'quick_action' | 'warehouse' | 'backoffice_owner'
  requiredRole: SpotlightRole
  shortcut?: string
  action: () => void
}

interface GlobalSpotlightProps {
  isOpen: boolean
  onClose: () => void
  currentRole?: SpotlightRole
  onSelectSurface?: (surface: string) => void
  onTriggerAction?: (actionName: string) => void
}

export const GlobalSpotlightCommandPalette: React.FC<GlobalSpotlightProps> = ({
  isOpen,
  onClose,
  currentRole = 'cashier',
  onSelectSurface,
  onTriggerAction
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Catalog of indexable actions
  const allItems: SpotlightItem[] = useMemo(() => [
    // 🛒 POS & Menu (Cashier + Owner)
    {
      id: 'prd-espr',
      title: 'Espresso Aren Latte (Rp 28.000)',
      subtitle: 'Menu Minuman Kopi • Tambah ke Keranjang',
      category: 'menu_product',
      requiredRole: 'cashier',
      shortcut: '↵',
      action: () => {
        onSelectSurface?.('barista-pos')
        onTriggerAction?.('add-aren-latte')
        onClose()
      }
    },
    {
      id: 'prd-jap',
      title: 'Japanese Iced Drip Coffee (Rp 35.000)',
      subtitle: 'Manual Brew Single Origin • Tambah ke Keranjang',
      category: 'menu_product',
      requiredRole: 'cashier',
      shortcut: '↵',
      action: () => {
        onSelectSurface?.('barista-pos')
        onTriggerAction?.('add-japanese-drip')
        onClose()
      }
    },
    {
      id: 'tbl-out-04',
      title: 'Meja OUT-04 (Sedang Terisi)',
      subtitle: 'Tagihan Rp 58.300 • 2 Pesanan Aktif',
      category: 'table_order',
      requiredRole: 'cashier',
      action: () => {
        onSelectSurface?.('barista-pos')
        onClose()
      }
    },
    {
      id: 'act-drawer',
      title: 'Buka Laci Kasir (Cash Drawer Kick)',
      subtitle: 'Perangkat Keras • Printer Thermal Cash Drawer',
      category: 'quick_action',
      requiredRole: 'cashier',
      shortcut: 'F1',
      action: () => {
        onTriggerAction?.('cash-drawer-kick')
        onClose()
      }
    },
    {
      id: 'act-reprint',
      title: 'Cetak Ulang Struk Terakhir',
      subtitle: 'Thermal Receipt 80mm • Reprint Last Transaction',
      category: 'quick_action',
      requiredRole: 'cashier',
      shortcut: 'F2',
      action: () => {
        onTriggerAction?.('reprint-receipt')
        onClose()
      }
    },
    // 📦 Warehouse (Warehouse + Owner)
    {
      id: 'wh-stock',
      title: 'Kesehatan Stok Bahan Baku',
      subtitle: 'Biji Kopi Gayo (1.8 kg - Reorder) & Oat Milk',
      category: 'warehouse',
      requiredRole: 'warehouse',
      action: () => {
        onSelectSurface?.('warehouse-mgmt')
        onClose()
      }
    },
    {
      id: 'wh-grn',
      title: 'Penerimaan Barang Masuk (GRN)',
      subtitle: 'Catat Surat Jalan dari Supplier / Roastery HQ',
      category: 'warehouse',
      requiredRole: 'warehouse',
      action: () => {
        onSelectSurface?.('warehouse-mgmt')
        onClose()
      }
    },
    // 👑 Owner & Backoffice (Strict Owner Role)
    {
      id: 'own-insights',
      title: 'Executive Insights & Laba Kotor',
      subtitle: 'Omzet Hari Ini Rp 4.850.000 • Margin 64%',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {
        onSelectSurface?.('merchant-hub')
        onClose()
      }
    },
    {
      id: 'own-payouts',
      title: 'Payouts & Rekonsiliasi Bank BCA',
      subtitle: 'Pencairan Dana QRIS & Settlement Kasir',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {
        onSelectSurface?.('merchant-hub')
        onClose()
      }
    },
    {
      id: 'own-tax',
      title: 'Kepatuhan Pajak PB1 & Bapenda',
      subtitle: 'Laporan Setoran Pajak Daerah 10%',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {
        onSelectSurface?.('merchant-hub')
        onClose()
      }
    },
    {
      id: 'own-events',
      title: 'Pengelolaan Event & Nobar',
      subtitle: 'Jadwal Live Music, Tiket FDC & Gate-in',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {
        onSelectSurface?.('merchant-hub')
        onClose()
      }
    }
  ], [onSelectSurface, onTriggerAction, onClose])

  // RBAC Filtering: Cashier only sees cashier items; Warehouse sees cashier+warehouse; Owner sees all
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Role match check
      if (currentRole === 'cashier' && item.requiredRole !== 'cashier') return false
      if (currentRole === 'warehouse' && item.requiredRole === 'owner') return false

      if (!searchQuery.trim()) return true

      const query = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
      )
    })
  }, [allItems, searchQuery, currentRole])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80dvh]">
        {/* Spotlight Search Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-border flex items-center gap-3 bg-muted/20">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder={
              currentRole === 'owner'
                ? 'Spotlight Owner: Cari menu, laba, pajak, event, stok...'
                : 'Spotlight Kasir: Cari menu, meja, aksi cepat...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-lg bg-muted text-[10px] font-bold font-mono text-muted-foreground hidden sm:inline-block">
              {currentRole === 'owner' ? '👑 Owner Mode' : '🛒 Kasir Mode'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <Search className="w-6 h-6 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-semibold text-foreground">Tidak ada hasil ditemukan untuk "{searchQuery}"</p>
              <p className="text-[11px]">Coba cari nama menu, nomor meja, atau fungsi kasir.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 text-foreground border border-amber-500/30'
                      : 'hover:bg-muted/40 text-foreground border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        item.category === 'menu_product'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : item.category === 'table_order'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : item.category === 'quick_action'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : item.category === 'warehouse'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}
                    >
                      {item.category === 'menu_product' ? (
                        <Coffee className="w-4 h-4" />
                      ) : item.category === 'table_order' ? (
                        <Table className="w-4 h-4" />
                      ) : item.category === 'quick_action' ? (
                        <Printer className="w-4 h-4" />
                      ) : item.category === 'warehouse' ? (
                        <Package className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground font-bold">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="p-2.5 bg-muted/20 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground px-4">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] mr-1">↑↓</kbd> Navigasi
            </span>
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] mr-1">↵</kbd> Pilih
            </span>
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] mr-1">ESC</kbd> Tutup
            </span>
          </div>

          <span className="text-[10px] font-mono text-amber-500 font-semibold">
            {currentRole === 'owner' ? '🛡️ RBAC: Full Access' : '🛡️ RBAC: Cashier Scoped'}
          </span>
        </div>
      </div>
    </div>
  )
}
