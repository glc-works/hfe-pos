import React from 'react'
import { MenuItem } from '../../types/pos'
import { X, Coffee, UserCheck, AlertTriangle, Heart } from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

interface ModifierModalProps {
  show: boolean
  onClose: () => void
  selectedItemForModifier: MenuItem | null
  modSeatNumber: string
  setModSeatNumber: (v: string) => void
  modSeatCustomerName: string
  setModSeatCustomerName: (v: string) => void
  modSeatCustomerPhone: string
  setModSeatCustomerPhone: (v: string) => void
  modAllergen: string
  setModAllergen: (v: string) => void
  modTemp: 'Iced' | 'Hot'
  setModTemp: (v: 'Iced' | 'Hot') => void
  modSugar: '0%' | '50%' | '100%'
  setModSugar: (v: '0%' | '50%' | '100%') => void
  modMilk: 'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)'
  setModMilk: (v: 'Whole Milk' | 'Oat Milk (+Rp 5.000)' | 'Almond Milk (+Rp 5.000)') => void
  onConfirmModifier: () => void
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  show,
  onClose,
  selectedItemForModifier,
  modSeatNumber,
  setModSeatNumber,
  modSeatCustomerName,
  setModSeatCustomerName,
  modSeatCustomerPhone,
  setModSeatCustomerPhone,
  modAllergen,
  setModAllergen,
  modTemp,
  setModTemp,
  modSugar,
  setModSugar,
  modMilk,
  setModMilk,
  onConfirmModifier
}) => {
  const { customerTheme } = useMerchantConfig()
  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'
  const inputBg = isLight ? '#ffffff' : '#020617'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'
  const buttonInactiveBg = isLight ? '#ffffff' : '#020617'
  const buttonInactiveBorder = isLight ? '#cbd5e1' : '#1e293b'

  if (!show || !selectedItemForModifier) return null

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="border rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: cardBorder }}>
          <img 
            src={selectedItemForModifier.image} 
            alt={selectedItemForModifier.name} 
            className="w-12 h-12 rounded-xl object-cover border"
            style={{ borderColor: cardBorder }}
          />
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: textColor }}>
              <Coffee className="w-4 h-4 text-amber-500" /> {selectedItemForModifier.name}
            </h3>
            <p className="text-[11px] font-mono font-bold text-amber-500">Rp {selectedItemForModifier.price.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* SEAT NUMBER SELECTION (SEAT 1-4) */}
        <div 
          className="p-3 rounded-2xl border flex flex-col gap-2"
          style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
        >
          <label className="text-xs font-bold text-indigo-500 flex items-center justify-between">
            <span>🪑 Penandaan Nomor Kursi (Seat Level):</span>
            <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>Pramusaji Antar Presisi</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'].map(seat => (
              <button
                key={seat}
                onClick={() => setModSeatNumber(seat)}
                className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                  modSeatNumber === seat 
                    ? 'bg-indigo-500 text-white shadow border-indigo-500' 
                    : ''
                }`}
                style={modSeatNumber !== seat ? { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder } : undefined}
              >
                {seat}
              </button>
            ))}
          </div>

          {/* SEAT CUSTOMER CONTACT PREFERENCE FORM */}
          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: subCardBorder }}>
            <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Profil Tamu di {modSeatNumber} (Opsional):
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={modSeatCustomerName}
                onChange={(e) => setModSeatCustomerName(e.target.value)}
                placeholder="Nama Tamu (cth: Budi)"
                className="text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-emerald-500 border"
                style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
              />
              <input
                type="tel"
                value={modSeatCustomerPhone}
                onChange={(e) => setModSeatCustomerPhone(e.target.value)}
                placeholder="No HP / WA Tamu"
                className="text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-emerald-500 border"
                style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
              />
            </div>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400">✓ Preferensi susu & gula otomatis tersimpan ke profil kontak ini.</p>
          </div>
        </div>

        {/* ALLERGEN NOTES */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-rose-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Catatan Alergen / Pantangan (Opsional):
          </label>
          <input
            type="text"
            value={modAllergen}
            onChange={(e) => setModAllergen(e.target.value)}
            placeholder="cth: Alergi Lactose, No Truffle Oil"
            className="text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 text-rose-600 dark:text-rose-200 font-medium border"
            style={{ backgroundColor: inputBg, borderColor: inputBorder }}
          />
        </div>

        {/* TEMPERATURE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: secondaryTextColor }}>Suhu Minuman:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setModTemp('Iced')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                modTemp === 'Iced' ? 'bg-amber-500 text-slate-950 border-amber-500' : ''
              }`}
              style={modTemp !== 'Iced' ? { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder } : undefined}
            >
              🧊 Iced
            </button>
            <button
              onClick={() => setModTemp('Hot')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                modTemp === 'Hot' ? 'bg-amber-500 text-slate-950 border-amber-500' : ''
              }`}
              style={modTemp !== 'Hot' ? { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder } : undefined}
            >
              ☕ Hot
            </button>
          </div>
        </div>

        {/* SUGAR LEVEL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: secondaryTextColor }}>Level Gula (Sugar):</label>
          <div className="grid grid-cols-3 gap-2">
            {(['0%', '50%', '100%'] as const).map(sugar => (
              <button
                key={sugar}
                onClick={() => setModSugar(sugar)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  modSugar === sugar ? 'bg-amber-500 text-slate-950 border-amber-500' : ''
                }`}
                style={modSugar !== sugar ? { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder } : undefined}
              >
                {sugar === '0%' ? 'No Sugar (0%)' : sugar === '50%' ? 'Less (50%)' : 'Normal (100%)'}
              </button>
            ))}
          </div>
        </div>

        {/* MILK OPTION */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: secondaryTextColor }}>Pilihan Susu (Dairy / Plant-Based):</label>
          <div className="grid grid-cols-1 gap-1.5">
            {[
              { label: '🥛 Whole Milk (Standard)', val: 'Whole Milk' },
              { label: '🌾 Oat Milk Oatside (+Rp 5.000)', val: 'Oat Milk (+Rp 5.000)' },
              { label: '🌰 Almond Milk Barista (+Rp 5.000)', val: 'Almond Milk (+Rp 5.000)' }
            ].map(m => (
              <button
                key={m.val}
                onClick={() => setModMilk(m.val as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                  modMilk === m.val ? 'bg-amber-500 text-slate-950 border-amber-500' : ''
                }`}
                style={modMilk !== m.val ? { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder } : undefined}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          onClick={onConfirmModifier}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-1.5"
        >
          <Heart className="w-4 h-4 fill-slate-950" /> Simpan Modifikasi & Masukkan Menu
        </button>
      </div>
    </div>
  )
}
