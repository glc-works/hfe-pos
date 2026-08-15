import React from 'react'
import { CustomerLoginType } from '../../types/pos'
import { X, UserCheck, Phone, User } from 'lucide-react'

interface LoginModalProps {
  show: boolean
  onClose: () => void
  loginType: CustomerLoginType
  setLoginType: (v: CustomerLoginType) => void
  customerPhone: string
  setCustomerPhone: (v: string) => void
  guestName: string
  setGuestName: (v: string) => void
  loyaltyPoints: number
  isCustomerSessionActive: boolean
  onSaveLogin: () => void
  onClearSession: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  show,
  onClose,
  loginType,
  setLoginType,
  customerPhone,
  setCustomerPhone,
  guestName,
  setGuestName,
  loyaltyPoints,
  isCustomerSessionActive,
  onSaveLogin,
  onClearSession
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Profil Pelanggan & Loyalty</h3>
            <p className="text-[11px] text-slate-400">1x Masuk tersimpan di perangkat ini</p>
          </div>
        </div>

        {/* TAB TYPE SWITCHER */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setLoginType('phone')}
            className={`py-1.5 rounded-lg font-bold transition-all ${
              loginType === 'phone' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            📱 No HP (Loyalty)
          </button>
          <button
            onClick={() => setLoginType('guest-name')}
            className={`py-1.5 rounded-lg font-bold transition-all ${
              loginType === 'guest-name' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            👤 Guest Name
          </button>
        </div>

        {loginType === 'phone' ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp / HP Pelanggan:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="081298765432"
                className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono text-sm rounded-xl pl-9 pr-3 py-2.5 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            {isCustomerSessionActive && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-400 font-mono font-bold flex justify-between items-center">
                <span>Poin Cashback Loyalty:</span>
                <span className="text-sm">{loyaltyPoints} Pts</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Nama Panggilan Tamu (Tanpa Login):</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth: Mas Budi / Kak Siti"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl pl-9 pr-3 py-2.5 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={onSaveLogin}
          className="w-full theme-customer-btn-primary font-bold text-xs py-3 rounded-xl shadow-lg mt-1"
        >
          ✓ Simpan Identitas & Mulai Order
        </button>

        {isCustomerSessionActive && (
          <button
            onClick={onClearSession}
            className="w-full bg-slate-950 hover:bg-slate-800 text-rose-400 text-xs font-semibold py-2 rounded-xl border border-slate-800"
          >
            Hapus Identitas Tersimpan (Logout)
          </button>
        )}
      </div>
    </div>
  )
}
