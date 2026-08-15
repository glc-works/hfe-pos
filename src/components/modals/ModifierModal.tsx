import React from 'react'
import { MenuItem } from '../../types/pos'
import { X, Coffee, UserCheck, AlertTriangle, Heart } from 'lucide-react'

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
  if (!show || !selectedItemForModifier) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <img 
            src={selectedItemForModifier.image} 
            alt={selectedItemForModifier.name} 
            className="w-12 h-12 rounded-xl object-cover border border-slate-800"
          />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-500" /> {selectedItemForModifier.name}
            </h3>
            <p className="text-[11px] text-amber-400 font-mono font-bold">Rp {selectedItemForModifier.price.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* SEAT NUMBER SELECTION (SEAT 1-4) */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <label className="text-xs font-bold text-indigo-400 flex items-center justify-between">
            <span>🪑 Penandaan Nomor Kursi (Seat Level):</span>
            <span className="text-[10px] font-mono text-slate-400">Pramusaji Antar Presisi</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'].map(seat => (
              <button
                key={seat}
                onClick={() => setModSeatNumber(seat)}
                className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  modSeatNumber === seat ? 'bg-indigo-500 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {seat}
              </button>
            ))}
          </div>

          {/* SEAT CUSTOMER CONTACT PREFERENCE FORM */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Profil Tamu di {modSeatNumber} (Opsional):
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={modSeatCustomerName}
                onChange={(e) => setModSeatCustomerName(e.target.value)}
                placeholder="Nama Tamu (cth: Budi)"
                className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
              <input
                type="tel"
                value={modSeatCustomerPhone}
                onChange={(e) => setModSeatCustomerPhone(e.target.value)}
                placeholder="No HP / WA Tamu"
                className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[9px] text-emerald-400/80">✓ Preferensi susu & gula otomatis tersimpan ke profil kontak ini.</p>
          </div>
        </div>

        {/* ALLERGEN NOTES */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-rose-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Catatan Alergen / Pantangan (Opsional):
          </label>
          <input
            type="text"
            value={modAllergen}
            onChange={(e) => setModAllergen(e.target.value)}
            placeholder="cth: Alergi Lactose, No Truffle Oil"
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 text-rose-200 font-medium"
          />
        </div>

        {/* TEMPERATURE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Suhu Minuman:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setModTemp('Iced')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                modTemp === 'Iced' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              🧊 Iced
            </button>
            <button
              onClick={() => setModTemp('Hot')}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                modTemp === 'Hot' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              ☕ Hot
            </button>
          </div>
        </div>

        {/* SUGAR LEVEL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Tingkat Manis / Sugar:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['0%', '50%', '100%'] as const).map(s => (
              <button
                key={s}
                onClick={() => setModSugar(s)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  modSugar === s ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* MILK OPTION */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Pilihan Susu / Dairy:</label>
          <div className="flex flex-col gap-1.5">
            {(['Whole Milk', 'Oat Milk (+Rp 5.000)', 'Almond Milk (+Rp 5.000)'] as const).map(m => (
              <button
                key={m}
                onClick={() => setModMilk(m)}
                className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                  modMilk === m ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onConfirmModifier}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-slate-950" /> Konfirmasi & Profilkan Preferensi Tamu
        </button>
      </div>
    </div>
  )
}
