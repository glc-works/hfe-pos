import React from 'react'
import { BusinessType, OperationScale } from '../../types/pos'
import { Coffee, ShoppingCart, Wine, User, Users, Building2, CheckCircle2 } from 'lucide-react'

interface Props {
  businessType: BusinessType
  operationScale: OperationScale
  onSelectBusinessType: (type: BusinessType) => void
  onSelectOperationScale: (scale: OperationScale) => void
}

export const Step1StoreTypeAndScale: React.FC<Props> = ({
  businessType,
  operationScale,
  onSelectBusinessType,
  onSelectOperationScale,
}) => {
  const storeTypes = [
    {
      id: 'cafe_fnb' as BusinessType,
      title: 'Cafe & Resto F&B',
      emoji: '☕',
      icon: Coffee,
      badge: 'Table Floor Plan & Modifiers',
      description: 'Cocok untuk Coffee Shop, Bistro, & Cafe dengan pesanan meja & varian minuman.',
      features: ['Table Floor Plan', 'Drink Modifiers', 'KDS Kanban', 'Recipe BOM'],
    },
    {
      id: 'toko_kelontong' as BusinessType,
      title: 'Toko Kelontong & Minimarket',
      emoji: '🛒',
      icon: ShoppingCart,
      badge: 'Barcode Scanner & Kasbon Ledger',
      description: 'Cocok untuk Toko Kelontong, Retail, Minimarket dengan barcode scanner & transaksi cepat.',
      features: ['Barcode Scanner', 'Multi-UOM Grosir', 'Kasbon Ledger', 'Scan & Go Mobile'],
    },
    {
      id: 'fine_dining' as BusinessType,
      title: 'Fine Dining & Lounge',
      emoji: '🍷',
      icon: Wine,
      badge: 'Course Firing & VIP Concierge',
      description: 'Cocok untuk Fine Dining, Steakhouse & High-End Bar dengan alur course & reservasi VIP.',
      features: ['Course Firing Stage', 'Sommelier Cellar', 'Maître d\' VIP', 'Table Floor Plan'],
    },
  ]

  const scaleModes = [
    {
      id: 'single_person' as OperationScale,
      title: 'Solo Cashier (1 Orang)',
      emoji: '👤',
      icon: User,
      badge: 'Auto-Bump Checkout',
      description: 'Dikelola 1 orang. Transaksi selesai otomatis menutup tiket tanpa KDS terpisah.',
    },
    {
      id: 'small_team' as OperationScale,
      title: 'Tim Kecil (2-3 Staf)',
      emoji: '👥',
      icon: Users,
      badge: 'Workstation PIN Auth',
      description: 'Kasir & Barista terpisah dengan autentikasi PIN 6-digit pada tablet.',
    },
    {
      id: 'enterprise' as OperationScale,
      title: 'Multi-Station / Enterprise',
      emoji: '🏢',
      icon: Building2,
      badge: 'Multi-Station KDS',
      description: 'Banyak stasiun (Bar, Dapur, Checker, Cashier) terhubung secara realtime.',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 mb-1">
          1. Pilih Jenis Usaha Toko Anda
        </h3>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-3">
          Sistem akan mengonfigurasi preset fitur & modul otomatis sesuai jenis toko.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {storeTypes.map((st) => {
            const isSelected = businessType === st.id
            const IconComponent = st.icon

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectBusinessType(st.id)}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                    : 'border-amber-900/15 hover:border-amber-500/50 bg-amber-500/5'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block">
                      {st.emoji} {st.badge}
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                      {st.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-amber-900/70 dark:text-amber-200/70 mb-3 leading-relaxed">
                  {st.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {st.features.map((ft) => (
                    <span
                      key={ft}
                      className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-amber-600 text-white font-medium'
                          : 'bg-amber-900/10 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      ✓ {ft}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-amber-900/10 pt-4">
        <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 mb-1">
          2. Pilih Skala Operasional Usaha
        </h3>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-3">
          Mengatur alur otorisasi PIN tablet staf & stasiun layar kerja.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scaleModes.map((sc) => {
            const isSelected = operationScale === sc.id
            const IconComponent = sc.icon

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectOperationScale(sc.id)}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                    : 'border-amber-900/15 hover:border-amber-500/50 bg-amber-500/5'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block">
                      {sc.emoji} {sc.badge}
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                      {sc.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-amber-900/70 dark:text-amber-200/70 leading-relaxed">
                  {sc.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
