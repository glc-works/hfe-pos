import React from 'react'
import { OnboardingData, OperationScale } from '../../types/pos'
import { Input, Badge, CapacityBadge } from '@/ui'
import { Store, Image, MapPin, Instagram, PhoneCall, Wifi, KeyRound, Layers, Users, User, Building2 } from 'lucide-react'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export const Step2BrandAndSocialProfile: React.FC<Props> = ({ data, onChange }) => {
  const getCapacityPresets = () => {
    switch (data.cluster) {
      case 'CLUSTER_ROASTERY':
        return ['5kg Micro-Roaster', '20kg Batch Oven', '60kg Industrial Roaster']
      case 'CLUSTER_PLANTATION':
        return ['10 Ha Kebun Plasma', '50 Ha Lahan Gayo', '200 Ha Perkebunan Inti']
      case 'CLUSTER_TRADING':
        return ['2 Kontainer / Bulan', '10 Kontainer / Bulan', '50 Kontainer Cross-Border']
      case 'CLUSTER_RETAIL':
        return ['1 Kasir Standar', '3 Kasir POS + Scanner', '10 Kasir Minimarket']
      case 'CLUSTER_OTHER':
        return ['Skala Mikro', 'Skala Menengah', 'Skala Korporat Enterprise']
      case 'CLUSTER_FNB':
      default:
        return ['10 Meja', '20 Meja (👥 3/4)', '50 Meja (Multi-Lantai)']
    }
  }

  const scaleOptions = [
    { id: 'single_person' as OperationScale, label: 'Solo Operator', icon: User, desc: '1 orang, auto-bump checkout' },
    { id: 'small_team' as OperationScale, label: 'Tim Kecil (2-5)', icon: Users, desc: 'PIN autentikasi per tablet' },
    { id: 'enterprise' as OperationScale, label: 'Enterprise Multi-Shift', icon: Building2, desc: 'Multi-stasiun KDS & role khusus' },
  ]

  return (
    <div className="space-y-4">
      {/* Profil Brand */}
      <div>
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          1. Profil Brand & Informasi Outlet
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Nama Brand / Toko <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={data.brandName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ brandName: e.target.value })}
              placeholder="Artisan Coffee & Eatery"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
              <Image className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              URL Logo Brand (Opsional)
            </label>
            <Input
              type="text"
              value={data.logoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ logoUrl: e.target.value })}
              placeholder="https://domain.id/logo.png"
              className="h-9 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Alamat Lengkap Usaha
            </label>
            <Input
              type="text"
              value={data.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ address: e.target.value })}
              placeholder="Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
              <Instagram className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Instagram Handle
            </label>
            <Input
              type="text"
              value={data.instagram}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ instagram: e.target.value })}
              placeholder="@artisancoffee.id"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              WhatsApp Kontak Pemesanan
            </label>
            <Input
              type="text"
              value={data.whatsappOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ whatsappOrder: e.target.value })}
              placeholder="6281298765432"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Skala Kapasitas Operasional */}
      <div className="border-t border-amber-900/10 pt-3">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            2. Skala Kapasitas Unit Operasional
          </h4>
          {data.cluster === 'CLUSTER_FNB' && (
            <CapacityBadge seatedGuests={3} maxCapacity={4} isOccupied={true} />
          )}
        </div>
        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mb-2">
          Pilih preset kapasitas unit atau masukkan skala operasional khusus Anda.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {getCapacityPresets().map((preset) => {
            const isSelected = data.capacityScale === preset
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ capacityScale: preset })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                    : 'border-amber-900/15 bg-amber-500/5 text-amber-950 dark:text-amber-100 hover:bg-amber-500/15'
                }`}
              >
                {preset}
              </button>
            )
          })}
        </div>
        <Input
          type="text"
          value={data.capacityScale || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ capacityScale: e.target.value })}
          placeholder="Atau ketik kustom, misal: 20 Meja (👥 3/4), 20kg Batch Oven, 50 Ha Lahan..."
          className="h-8 text-xs"
        />
      </div>

      {/* Skala Tim & Auth PIN */}
      <div className="border-t border-amber-900/10 pt-3">
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          3. Skala Tim & Otorisasi PIN
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {scaleOptions.map((sc) => {
            const isSelected = data.operationScale === sc.id
            const IconC = sc.icon
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onChange({ operationScale: sc.id })}
                className={`p-2.5 text-left rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/15 shadow-sm ring-1 ring-amber-500/30'
                    : 'border-amber-900/15 bg-amber-500/5 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                  <IconC className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{sc.label}</span>
                </div>
                <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 mt-0.5">
                  {sc.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* WiFi Guest Settings */}
      <div className="border-t border-amber-900/10 pt-3">
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          4. Pengaturan WiFi Pelanggan / Outlet
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
              WiFi SSID
            </label>
            <Input
              type="text"
              value={data.wifiSsid}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ wifiSsid: e.target.value })}
              placeholder="Artisan_Guest_WiFi"
              className="h-9 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              WiFi Password
            </label>
            <Input
              type="text"
              value={data.wifiPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ wifiPassword: e.target.value })}
              placeholder="kopiuenak2026"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
