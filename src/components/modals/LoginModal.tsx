import React, { useRef } from 'react'
import { CustomerLoginType } from '../../types/pos'
import { X, UserCheck, Phone, User, Camera, Sparkles } from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

const PRESET_AVATARS = [
  { id: 'coffee', icon: '☕', label: 'Coffee Lover' },
  { id: 'sultan', icon: '👑', label: 'VIP Sultan' },
  { id: 'cool', icon: '🕶️', label: 'Cool Guest' },
  { id: 'cat', icon: '🐱', label: 'Cat Lover' },
  { id: 'dog', icon: '🐶', label: 'Doggo' },
  { id: 'croissant', icon: '🥐', label: 'Pastry Chef' },
  { id: 'foodie', icon: '🥑', label: 'Foodie' },
  { id: 'astronaut', icon: '🚀', label: 'Astronaut' },
  { id: 'flower', icon: '🌸', label: 'Sakura' },
  { id: 'fox', icon: '🦊', label: 'Kitsune' }
]

interface LoginModalProps {
  show: boolean
  onClose: () => void
  loginType: CustomerLoginType
  setLoginType: (v: CustomerLoginType) => void
  customerPhone: string
  setCustomerPhone: (v: string) => void
  guestName: string
  setGuestName: (v: string) => void
  customerAvatar?: string
  setCustomerAvatar?: (v: string) => void
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
  customerAvatar = '☕',
  setCustomerAvatar = () => {},
  loyaltyPoints,
  isCustomerSessionActive,
  onSaveLogin,
  onClearSession
}) => {
  const { customerTheme } = useMerchantConfig()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'
  const inputBg = isLight ? '#ffffff' : '#020617'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'
  const tabBg = isLight ? '#f1f5f9' : '#020617'

  if (!show) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomerAvatar(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const isCustomUploadedPhoto = customerAvatar.startsWith('data:image') || customerAvatar.startsWith('http')

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="border rounded-3xl max-w-sm w-full p-5 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: cardBorder }}>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: textColor }}>Profil Pelanggan & Avatar</h3>
            <p className="text-[11px]" style={{ color: secondaryTextColor }}>1x Masuk tersimpan di perangkat ini</p>
          </div>
        </div>

        {/* AVATAR CHOOSER: UPLOAD FOTO SENDIRI / PILIH PRESET */}
        <div 
          className="border rounded-2xl p-3 flex flex-col gap-3"
          style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: textColor }}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Foto Profil / Avatar Tamu:
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all border"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#1e293b',
                color: customerTheme.primaryAccentHex,
                borderColor: subCardBorder
              }}
            >
              <Camera className="w-3 h-3" />
              <span>Unggah Foto Saya</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* ACTIVE AVATAR PREVIEW + PRESET SELECTION */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 border-2 border-amber-400 flex items-center justify-center font-black text-2xl shrink-0 overflow-hidden shadow-lg relative group">
              {isCustomUploadedPhoto ? (
                <img src={customerAvatar} alt="Custom Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{customerAvatar}</span>
              )}
            </div>

            {/* PRESET CHIPS GRID */}
            <div className="flex-1 flex flex-wrap gap-1.5 max-h-16 overflow-y-auto no-scrollbar">
              {PRESET_AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setCustomerAvatar(avatar.icon)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm border transition-all ${
                    customerAvatar === avatar.icon
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-110 shadow'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  style={customerAvatar !== avatar.icon ? { backgroundColor: modalBg } : undefined}
                  title={avatar.label}
                >
                  {avatar.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TAB TYPE SWITCHER */}
        <div 
          className="grid grid-cols-2 gap-2 p-1 rounded-xl border text-xs"
          style={{ backgroundColor: tabBg, borderColor: subCardBorder }}
        >
          <button
            onClick={() => setLoginType('phone')}
            className={`py-1.5 rounded-lg font-bold transition-all ${
              loginType === 'phone' ? 'shadow font-black' : 'hover:opacity-80'
            }`}
            style={
              loginType === 'phone'
                ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }
                : { color: secondaryTextColor }
            }
          >
            📱 No HP (Loyalty)
          </button>
          <button
            onClick={() => setLoginType('guest-name')}
            className={`py-1.5 rounded-lg font-bold transition-all ${
              loginType === 'guest-name' ? 'shadow font-black' : 'hover:opacity-80'
            }`}
            style={
              loginType === 'guest-name'
                ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }
                : { color: secondaryTextColor }
            }
          >
            👤 Guest Name
          </button>
        </div>

        {loginType === 'phone' ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold" style={{ color: textColor }}>Nomor WhatsApp / HP Pelanggan:</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3" style={{ color: secondaryTextColor }} />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="081298765432"
                className="w-full font-mono text-sm rounded-xl pl-9 pr-3 py-2.5 font-bold focus:outline-none focus:border-amber-500 border"
                style={{ backgroundColor: inputBg, color: customerTheme.primaryAccentHex, borderColor: inputBorder }}
              />
            </div>
            {isCustomerSessionActive && (
              <div 
                className="border rounded-xl p-2.5 text-xs font-mono font-bold flex justify-between items-center"
                style={{
                  backgroundColor: `${customerTheme.primaryAccentHex}15`,
                  borderColor: `${customerTheme.primaryAccentHex}30`,
                  color: customerTheme.primaryAccentHex
                }}
              >
                <span>Poin Cashback Loyalty:</span>
                <span className="text-sm">{loyaltyPoints} Pts</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold" style={{ color: textColor }}>Nama Panggilan Tamu (Tanpa Login):</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3" style={{ color: secondaryTextColor }} />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth: Mas Budi / Kak Siti"
                className="w-full text-sm rounded-xl pl-9 pr-3 py-2.5 font-bold focus:outline-none focus:border-amber-500 border"
                style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onSaveLogin}
          className="w-full font-bold text-xs py-3 rounded-xl shadow-lg mt-1 transition-all active:scale-[0.98]"
          style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
        >
          ✓ Simpan Identitas & Mulai Order
        </button>

        {isCustomerSessionActive && (
          <button
            onClick={onClearSession}
            className="w-full text-rose-500 text-xs font-semibold py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
          >
            Hapus Identitas Tersimpan (Logout)
          </button>
        )}
      </div>
    </div>
  )
}
