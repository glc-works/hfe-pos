import React, { useState } from 'react'
import { Sliders, Coffee, Milk, Droplets, ShieldAlert, Car, MapPin, Save, Check, Leaf, UserCheck, ShieldCheck } from 'lucide-react'
import { CustomerPreferences } from '../../types/pos'

export interface CustomerPreferencesTabProps {
  initialPreferences?: CustomerPreferences
  onSavePreferences?: (prefs: CustomerPreferences) => void
}

const DEFAULT_PREFERENCES: CustomerPreferences = {
  favoriteDrink: 'Espresso Aren Latte',
  preferredMilk: 'Oat Milk (+Rp 5.000)',
  preferredSugar: '50%',
  dietaryNotes: 'Lebih dingin / less ice jika memungkinkan',
  vehiclePlateNumber: 'B 1234 XYZ',
  deliveryAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
  allergens: ['lactose'],
  paperlessReceipts: true,
  ecoPointsEarned: 30
}

export const CustomerPreferencesTab: React.FC<CustomerPreferencesTabProps> = ({
  initialPreferences = DEFAULT_PREFERENCES,
  onSavePreferences
}) => {
  const [preferences, setPreferences] = useState<CustomerPreferences>(initialPreferences)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  const toggleAllergen = (allergen: 'lactose' | 'nuts' | 'gluten' | 'seafood' | 'eggs') => {
    const current = preferences.allergens || []
    const updated = current.includes(allergen)
      ? current.filter(a => a !== allergen)
      : [...current, allergen]
    setPreferences(prev => ({ ...prev, allergens: updated }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSavePreferences) onSavePreferences(preferences)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4 w-full text-slate-900 dark:text-slate-100">
      {/* 1. UNIVERSAL PROFILE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Preferensi Akun Universal Hfe
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Profil identitas keselamatan, alergi makanan, dan data valet Anda berlaku di seluruh jaringan merchant Hfe.
          </p>
        </div>
        {saveSuccess && (
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 animate-fadeIn">
            <Check className="w-3.5 h-3.5" /> Tersimpan!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* 🌱 GO-GREEN PAPERLESS TOGGLE */}
        <div className="bg-emerald-500/[0.08] dark:bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">🌱 Go-Green Paperless Receipts</span>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono leading-tight mt-0.5">
                Hemat kertas struk thermal, simpan E-Receipt digital ke member passbook Anda (+10 Eco-Points).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPreferences(prev => ({ ...prev, paperlessReceipts: !prev.paperlessReceipts }))}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              preferences.paperlessReceipts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              preferences.paperlessReceipts ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* SECTION 1: GLOBAL ALLERGEN & DIETARY SAFETY */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Coffee className="w-3.5 h-3.5" /> 1. Default Selera & Peringatan Keselamatan Alergen
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                <Milk className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Pilihan Susu Standar:
              </label>
              <select
                value={preferences.preferredMilk || 'Fresh Milk'}
                onChange={(e) => setPreferences(prev => ({ ...prev, preferredMilk: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Fresh Milk">Fresh Milk (Standar)</option>
                <option value="Whole Milk">Whole Milk (Creamy)</option>
                <option value="Oat Milk (+Rp 5.000)">Oatside Barista Oat Milk (+Rp 5.000)</option>
                <option value="Almond Milk (+Rp 5.000)">Almond Milk (+Rp 5.000)</option>
                <option value="Tanpa Susu">Tanpa Susu (Black Coffee)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Level Kemanisan Standar:
              </label>
              <select
                value={preferences.preferredSugar || '100%'}
                onChange={(e) => setPreferences(prev => ({ ...prev, preferredSugar: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="0%">0% Sugar (No Sugar)</option>
                <option value="50%">50% Sugar (Less Sweet)</option>
                <option value="100%">100% Sugar (Normal)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Peringatan Alergi Makanan (Otomatis Proteksi Semua Dapur):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'lactose', label: '🥛 Alergi Laktosa' },
                { id: 'nuts', label: '🥜 Alergi Kacang' },
                { id: 'gluten', label: '🌾 Alergi Gluten' },
                { id: 'seafood', label: '🦐 Alergi Seafood' },
                { id: 'eggs', label: '🥚 Alergi Telur' }
              ].map((alg) => {
                const isSelected = (preferences.allergens || []).includes(alg.id as any)
                return (
                  <button
                    key={alg.id}
                    type="button"
                    onClick={() => toggleAllergen(alg.id as any)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-700 dark:text-rose-300 font-bold shadow'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {alg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: VEHICLE & ADDRESS */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> 2. Kendaraan Valet & Alamat Pengiriman
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Plat Nomor Kendaraan (Valet Parkir):</label>
              <input
                type="text"
                value={preferences.vehiclePlateNumber || ''}
                onChange={(e) => setPreferences(prev => ({ ...prev, vehiclePlateNumber: e.target.value.toUpperCase() }))}
                placeholder="e.g. B 1234 XYZ"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none uppercase"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Alamat Pengiriman Utama:</label>
              <input
                type="text"
                value={preferences.deliveryAddress || ''}
                onChange={(e) => setPreferences(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                placeholder="Alamat rumah / kantor"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Akun Universal Hfe</span>
        </button>
      </form>
    </div>
  )
}
