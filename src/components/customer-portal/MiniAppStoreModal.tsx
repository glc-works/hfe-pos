import React, { useState } from 'react'
import { 
  X, Search, Sparkles, Check, Plus, Coffee, Calendar, Ticket, Car, 
  Gift, Navigation, PackageCheck, BarChart3, ShieldCheck, Printer, 
  QrCode, Scale, Truck, Tag, ClipboardList, Wallet
} from 'lucide-react'

export interface MiniAppStoreModalProps {
  isOpen: boolean
  onClose: () => void
  currentMode: 'life' | 'work'
  onLaunchMiniApp?: (appId: string) => void
}

export interface MiniAppItem {
  id: string
  title: string
  category: 'life' | 'logistics' | 'cashier' | 'tools'
  categoryLabel: string
  description: string
  icon: any
  color: string
  badge?: string
  isInstalled: boolean
}

const STORE_CATALOG: MiniAppItem[] = [
  {
    id: 'app-menu-qr',
    title: 'Pesan Menu QR',
    category: 'life',
    categoryLabel: 'Layanan Konsumen',
    description: 'Order & bayar instan dari meja kafe dengan QRIS.',
    icon: Coffee,
    color: 'amber',
    badge: 'Populer',
    isInstalled: true
  },
  {
    id: 'app-table-booking',
    title: 'Reservasi Meja VIP',
    category: 'life',
    categoryLabel: 'Layanan Konsumen',
    description: 'Booking meja private, meeting room, dan pre-order menu.',
    icon: Calendar,
    color: 'indigo',
    isInstalled: true
  },
  {
    id: 'app-event-tickets',
    title: 'Tiket Event & Workshop',
    category: 'life',
    categoryLabel: 'Layanan Konsumen',
    description: 'Beli tiket cupping, barista class, dan simpan QR Pass.',
    icon: Ticket,
    color: 'rose',
    isInstalled: true
  },
  {
    id: 'app-valet-car',
    title: 'Panggil Valet Mobil',
    category: 'life',
    categoryLabel: 'Layanan Konsumen',
    description: 'Kirim notifikasi pengambilan mobil plat nomor ke valet booth.',
    icon: Car,
    color: 'blue',
    isInstalled: true
  },
  {
    id: 'app-loyalty-rewards',
    title: 'Tukar Poin & Voucher',
    category: 'life',
    categoryLabel: 'Layanan Konsumen',
    description: 'Katalog reward potongan harga dan voucher merchant Hfe.',
    icon: Gift,
    color: 'emerald',
    isInstalled: true
  },
  {
    id: 'app-wms-grn',
    title: 'Terima GRN Supplier',
    category: 'logistics',
    categoryLabel: 'Gudang & Logistik',
    description: 'Scan surat jalan supplier & mutasi karung biji kopi masuk.',
    icon: PackageCheck,
    color: 'stone',
    badge: 'WMS',
    isInstalled: true
  },
  {
    id: 'app-wms-stocktake',
    title: 'Stocktake & Opname Fisik',
    category: 'logistics',
    categoryLabel: 'Gudang & Logistik',
    description: 'Audit fisik karung green beans & rekonsiliasi selisih stok.',
    icon: Scale,
    color: 'teal',
    badge: 'WMS',
    isInstalled: true
  },
  {
    id: 'app-wms-transfer',
    title: 'Transfer Stok Antar-Cabang',
    category: 'logistics',
    categoryLabel: 'Gudang & Logistik',
    description: 'Kirim mutasi stok roasted beans ke outlet Senopati & SCBD.',
    icon: Truck,
    color: 'cyan',
    isInstalled: true
  },
  {
    id: 'app-wms-barcode',
    title: 'Cetak Label Barcode Lot',
    category: 'logistics',
    categoryLabel: 'Gudang & Logistik',
    description: 'Generator barcode kemasan ritel & lot sangrai roastery.',
    icon: Tag,
    color: 'purple',
    isInstalled: true
  },
  {
    id: 'app-courier-runner',
    title: 'Kurir Toko & Bukti POD',
    category: 'logistics',
    categoryLabel: 'Gudang & Logistik',
    description: 'Antaran pesanan mandiri kafe, link Google Maps, dan foto bukti POD.',
    icon: Navigation,
    color: 'indigo',
    badge: 'Kurir',
    isInstalled: true
  },
  {
    id: 'app-manager-approval',
    title: 'Baki Approval Void/Refund',
    category: 'cashier',
    categoryLabel: 'Operasional Kasir',
    description: 'Otorisasi pembatalan bill dan koreksi transaksi kasir POS.',
    icon: ShieldCheck,
    color: 'amber',
    badge: 'Manager',
    isInstalled: true
  },
  {
    id: 'app-sales-flash',
    title: 'Sales Flash Live Omset',
    category: 'cashier',
    categoryLabel: 'Operasional Kasir',
    description: 'Pantau omset real-time, transaksi meja, dan target cabang.',
    icon: BarChart3,
    color: 'blue',
    isInstalled: true
  },
  {
    id: 'app-bluetooth-printer',
    title: 'Bluetooth Thermal Printer Tool',
    category: 'tools',
    categoryLabel: 'Perangkat & Alat',
    description: 'Uji koneksi printer 58mm/80mm dan cetak struk uji coba.',
    icon: Printer,
    color: 'orange',
    isInstalled: false
  },
  {
    id: 'app-qr-table-generator',
    title: 'QR Meja Table Stand Generator',
    category: 'tools',
    categoryLabel: 'Perangkat & Alat',
    description: 'Cetak stiker QR meja akrilik siap pasang di area dine-in.',
    icon: QrCode,
    color: 'emerald',
    isInstalled: false
  },
  {
    id: 'app-kitchen-checklist',
    title: 'Daily Kitchen Closing Checklist',
    category: 'tools',
    categoryLabel: 'Perangkat & Alat',
    description: 'Form checklist sanitasi mesin espresso dan suhu kulkas susu.',
    icon: ClipboardList,
    color: 'rose',
    isInstalled: false
  }
]

export const MiniAppStoreModal: React.FC<MiniAppStoreModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onLaunchMiniApp
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(
    STORE_CATALOG.filter(a => a.isInstalled).map(a => a.id)
  )

  if (!isOpen) return null

  const handleToggleInstall = (appId: string) => {
    setInstalledAppIds(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    )
  }

  const filteredApps = STORE_CATALOG.filter(app => {
    const matchCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'life' && app.category === 'life') ||
      (selectedCategory === 'logistics' && app.category === 'logistics') ||
      (selectedCategory === 'cashier' && app.category === 'cashier') ||
      (selectedCategory === 'tools' && app.category === 'tools')

    const matchQuery =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

    return matchCat && matchQuery
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden text-slate-100 animate-scaleUp">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>🛍️ Hfe Mini App Store</span>
                <span className="text-[10px] font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded-full border border-slate-800">
                  Ekosistem Mini Program
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Jelajahi, aktifkan, dan pasang modul mandiri ke dashboard kartu Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="flex flex-col gap-2.5 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari modul mini app (WMS, Kurir, Valet, Reservasi, Printer)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/60 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: '✨ Semua Modul' },
              { id: 'life', label: '🌿 Layanan Konsumen' },
              { id: 'logistics', label: '📦 Gudang & Logistik' },
              { id: 'cashier', label: '💼 Operasional Kasir' },
              { id: 'tools', label: '🛠️ Alat & Utilitas' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* APP GRID */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
          {filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Search className="w-8 h-8 text-slate-600 mb-1" />
              <p className="text-sm font-bold text-slate-300">Mini App tidak ditemukan</p>
              <p className="text-xs text-slate-500">Coba gunakan kata kunci pencarian lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredApps.map(app => {
                const Icon = app.icon
                const isInstalled = installedAppIds.includes(app.id)

                return (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{app.title}</h4>
                          {app.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                              {app.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {app.categoryLabel}
                        </span>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleInstall(app.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isInstalled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Terpasang</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pasang</span>
                          </>
                        )}
                      </button>

                      {onLaunchMiniApp && (
                        <button
                          type="button"
                          onClick={() => {
                            onLaunchMiniApp(app.id)
                            onClose()
                          }}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Buka ➔</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
