import React from 'react'
import { OnboardingData } from '../../types/pos'
import { Store, Image, MapPin, Instagram, PhoneCall, Wifi, KeyRound } from 'lucide-react'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export const Step2BrandAndSocialProfile: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 mb-1">
          Identitas Brand & Profil Resto / Toko
        </h3>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-4">
          Informasi ini akan ditampilkan pada struk belanja, landing page pelanggan, & QR Meja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Name */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Nama Brand Toko / Resto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            placeholder="Contoh: Artisan Coffee & Eatery"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            URL Logo Brand (Opsional)
          </label>
          <input
            type="text"
            value={data.logoUrl}
            onChange={(e) => onChange({ logoUrl: e.target.value })}
            placeholder="https://domain.id/logo.png"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Alamat Lengkap Outlet Toko
          </label>
          <textarea
            rows={2}
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Instagram Handle
          </label>
          <input
            type="text"
            value={data.instagram}
            onChange={(e) => onChange({ instagram: e.target.value })}
            placeholder="@artisancoffee.id"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* WhatsApp Order */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            WhatsApp Order Contact
          </label>
          <input
            type="text"
            value={data.whatsappOrder}
            onChange={(e) => onChange({ whatsappOrder: e.target.value })}
            placeholder="6281298765432"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* WiFi SSID */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            WiFi SSID Pelanggan
          </label>
          <input
            type="text"
            value={data.wifiSsid}
            onChange={(e) => onChange({ wifiSsid: e.target.value })}
            placeholder="Artisan_Guest_WiFi"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* WiFi Password */}
        <div>
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Password WiFi Pelanggan
          </label>
          <input
            type="text"
            value={data.wifiPassword}
            onChange={(e) => onChange({ wifiPassword: e.target.value })}
            placeholder="kopiuenak2026"
            className="w-full px-3 py-2 text-sm rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
          />
        </div>
      </div>
    </div>
  )
}
