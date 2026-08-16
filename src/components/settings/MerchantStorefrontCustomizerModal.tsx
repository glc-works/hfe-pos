import React, { useState } from 'react'
import {
  X, Sparkles, Image, Palette, Store, Smartphone, Globe, RotateCcw,
  Check, Instagram, MessageCircle, MapPin, Wifi, FileText, LayoutGrid, List
} from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { BANNER_PRESETS } from '../../data/defaultStorefrontCustomization'
import { StorefrontCustomizationConfig, WifiAccessPolicy, QrMenuLayoutMode } from '../../types/pos'

interface MerchantStorefrontCustomizerModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'landing' | 'qr' | 'theme'
}

export const MerchantStorefrontCustomizerModal: React.FC<MerchantStorefrontCustomizerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'landing'
}) => {
  const {
    storefrontConfig,
    updateStorefrontConfig,
    resetStorefrontConfig,
    customerTheme,
    setCustomerTheme
  } = useMerchantConfig()

  const [activeTab, setActiveTab] = useState<'landing' | 'qr' | 'theme'>(initialTab)
  const [formData, setFormData] = useState<StorefrontCustomizationConfig>(storefrontConfig)
  const [primaryColor, setPrimaryColor] = useState(customerTheme.primaryAccentHex || '#f59e0b')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(customerTheme.mode || 'dark')
  const [isSaved, setIsSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    updateStorefrontConfig(formData)
    setCustomerTheme({
      ...customerTheme,
      primaryAccentHex: primaryColor,
      mode: themeMode
    })
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 800)
  }

  const handleReset = () => {
    if (confirm('Kembalikan kustomisasi Landing Page & QR Order ke standar bawaan Hfe Ecosystem?')) {
      resetStorefrontConfig()
      setFormData(storefrontConfig)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Studio Kustomisasi Ruang Toko</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Merchant Scope
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Atur tampilan publik Landing Page & Menu QR Order tanpa merubah governance ledger pusat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 border-b border-slate-800 flex gap-2 bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'landing'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌐 Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 QR Order Pelanggan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'theme'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎨 Warna & Tema Merek</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {/* TAB 1: LANDING PAGE STUDIO */}
          {activeTab === 'landing' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Header & Banner Hero
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline Utama Hero</label>
                  <input
                    type="text"
                    value={formData.heroHeadline}
                    onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                    placeholder="Contoh: Artisan Coffee Roasters & Fresh Pastry Bar"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Tagline & Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.heroTagline}
                    onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none resize-none"
                    placeholder="Ceritakan keunggulan tempat Anda..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Preset Foto Banner Hero</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {BANNER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, heroBannerUrl: preset.url })}
                        className={`p-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          formData.heroBannerUrl === preset.url
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{preset.label}</span>
                        {formData.heroBannerUrl === preset.url && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Kustom URL Banner (Opsional)</label>
                  <input
                    type="url"
                    value={formData.heroBannerUrl}
                    onChange={(e) => setFormData({ ...formData, heroBannerUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:border-amber-400 outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {/* ANNOUNCEMENT BAR & STORY */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" /> Bar Pengumuman & Cerita Merek
                </h4>

                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Aktifkan Bar Promo Atas</span>
                  <input
                    type="checkbox"
                    checked={formData.announcementBarActive}
                    onChange={(e) => setFormData({ ...formData, announcementBarActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {formData.announcementBarActive && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Teks Pengumuman Promo</label>
                    <input
                      type="text"
                      value={formData.announcementBarText}
                      onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Cerita Merek (*About Us*)</label>
                  <textarea
                    rows={2}
                    value={formData.brandStoryText}
                    onChange={(e) => setFormData({ ...formData, brandStoryText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Instagram (@handle)</label>
                    <input
                      type="text"
                      value={formData.socialLinks.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      placeholder="@kopitiam_senopati"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">WhatsApp Order</label>
                    <input
                      type="text"
                      value={formData.socialLinks.whatsapp || ''}
                      onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, whatsapp: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR ORDER CUSTOMER SPACE STUDIO */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-400" /> Sambutan & Tata Letak Menu QR
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Pesan Sambutan Pelanggan</label>
                  <input
                    type="text"
                    value={formData.greetingMessage}
                    onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Gaya Tata Letak Katalog Menu QR</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, qrMenuLayout: 'grid_2col' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        formData.qrMenuLayout === 'grid_2col'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>Grid 2-Kolom</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, qrMenuLayout: 'list_compact' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        formData.qrMenuLayout === 'list_compact'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>Daftar Ramping</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, qrMenuLayout: 'story_cards' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        formData.qrMenuLayout === 'story_cards'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Kartu Visual</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Kebijakan Password WiFi Pelanggan</label>
                  <select
                    value={formData.wifiAccessPolicy}
                    onChange={(e) => setFormData({ ...formData, wifiAccessPolicy: e.target.value as WifiAccessPolicy })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value="after_payment">🔒 Terbuka Otomatis Setelah Pesanan Lunas</option>
                    <option value="always_visible">🌐 Selalu Terlihat di Halaman Menu</option>
                    <option value="disabled">🚫 Sembunyikan Info WiFi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Pesan Footer E-Receipt (Struk Digital)</label>
                  <input
                    type="text"
                    value={formData.receiptCustomFooter}
                    onChange={(e) => setFormData({ ...formData, receiptCustomFooter: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRAND THEME & COLOR PALETTE */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-400" /> Warna Aksen & Mode Tampilan
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Pilihan Warna Aksen Merek</label>
                  <div className="flex items-center gap-3">
                    {['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryColor(color)}
                        className={`w-8 h-8 rounded-xl border-2 transition-all cursor-pointer ${
                          primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-xl bg-transparent border border-slate-700 cursor-pointer"
                      title="Pilih warna custom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Mode Tampilan Ruang Pelanggan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setThemeMode('dark')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        themeMode === 'dark'
                          ? 'bg-slate-950 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>🌙 Dark Mode (OLED Premium)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode('light')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        themeMode === 'light'
                          ? 'bg-white border-amber-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>☀️ Light Mode (Clean Warm)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Default Hfe</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-4 h-4 text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Kustomisasi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
