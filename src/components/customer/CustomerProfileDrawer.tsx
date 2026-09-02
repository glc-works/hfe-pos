import React, { useState, useRef } from 'react'
import { 
  X, Award, Coins, Ticket, History, LogOut, ChevronRight,
  Camera, Sparkles, ArrowLeft, RefreshCw, CheckCircle2, MapPin, CreditCard
} from 'lucide-react'
import { CustomerLoginType } from '../../types/pos'
import { VoucherCard, Voucher } from '../pos/VoucherCard'
import { VoucherDetailModal } from '../pos/VoucherDetailModal'
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

const PERSONAL_VISITS_MOCK = [
  {
    visitNo: 5,
    orderId: 'ORD-8821',
    date: 'Hari ini, 14:30',
    venue: 'Outlet Pusat (Meja 04)',
    pointsEarned: 70,
    status: 'Selesai',
    items: [
      { name: 'Caffe Latte (Less Ice)', qty: 1, price: 38000 },
      { name: 'Pain au Chocolat', qty: 1, price: 32000 }
    ],
    total: 70000
  },
  {
    visitNo: 4,
    orderId: 'ORD-8710',
    date: '12 Agu 2026, 10:15',
    venue: 'Outlet Pusat (Meja 02)',
    pointsEarned: 74,
    status: 'Selesai',
    items: [
      { name: 'Espresso Romano', qty: 2, price: 50000 },
      { name: 'Butter Croissant', qty: 1, price: 24000 }
    ],
    total: 74000
  }
]

export interface CustomerProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  customerPhone: string
  guestName: string
  customerAvatar?: string
  setCustomerAvatar?: (v: string) => void
  loginType: CustomerLoginType
  loyaltyPoints: number
  onLogout: () => void
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  isOpen,
  onClose,
  customerPhone,
  guestName,
  customerAvatar = '☕',
  setCustomerAvatar = () => {},
  loginType,
  loyaltyPoints,
  onLogout
}) => {
  const { vouchers, customerTheme, setActiveApp } = useMerchantConfig()
  const activeVouchers = vouchers.filter(v => v.isActive !== false)
  const [activeTab, setActiveTab] = useState<'profile' | 'vouchers' | 'history'>('profile')
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedVoucherForDetails, setSelectedVoucherForDetails] = useState<Voucher | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'

  if (!isOpen) return null

  const displayName = loginType === 'phone' ? `Member ${customerPhone}` : (guestName || 'Tamu Meja')
  const formattedPhone = customerPhone ? `+62 ${customerPhone.replace(/^0/, '')}` : 'Belum terhubung nomor'
  const isCustomUploadedPhoto = customerAvatar.startsWith('data:image') || customerAvatar.startsWith('http')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomerAvatar(reader.result)
          setShowAvatarPicker(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm transition-all animate-fadeIn">
      <div 
        className="w-full max-w-md border-t rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto no-scrollbar animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        {/* DRAG HANDLE BAR (TOUCH AFFORDANCE) */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-1 shrink-0" />

        {/* HEADER TOP BAR */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: cardBorder }}>
          {activeTab === 'profile' ? (
            <div className="flex items-center gap-3 min-w-0">
              {/* AVATAR WITH CAMERA BADGE */}
              <div 
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 border-2 border-amber-400 flex items-center justify-center font-black text-xl shadow overflow-hidden shrink-0 cursor-pointer relative group transition-transform hover:scale-105"
                title="Ketuk untuk Ganti Foto / Avatar"
              >
                {isCustomUploadedPhoto ? (
                  <img src={customerAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{customerAvatar}</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="font-extrabold text-sm tracking-tight leading-tight truncate" style={{ color: textColor }}>
                  {displayName}
                </h3>
                <p className="text-[11px] font-mono" style={{ color: secondaryTextColor }}>{formattedPhone}</p>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-0.5"
                >
                  <Camera className="w-2.5 h-2.5" />
                  <span>{showAvatarPicker ? 'Tutup Pilihan' : 'Ganti Avatar / Foto'}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl transition-all border"
              style={{ backgroundColor: subCardBg, color: textColor, borderColor: subCardBorder }}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
              <span>Kembali ke Profil</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= VIEW 1: PROFIL & MENU UTAMA ================= */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* EXPANDABLE AVATAR PICKER */}
            {showAvatarPicker && (
              <div 
                className="border border-amber-500/40 rounded-2xl p-3.5 flex flex-col gap-3 shadow-inner"
                style={{ backgroundColor: subCardBg }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: textColor }}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Pilih Avatar atau Foto Sendiri:
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-black bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Unggah Foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AVATARS.map(avatar => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setCustomerAvatar(avatar.icon)
                        setShowAvatarPicker(false)
                      }}
                      className={`py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                        customerAvatar === avatar.icon
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold scale-105 shadow'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                      style={customerAvatar !== avatar.icon ? { backgroundColor: modalBg, color: textColor } : undefined}
                    >
                      <span className="text-lg">{avatar.icon}</span>
                      <span className="text-[9px] truncate max-w-[50px]">{avatar.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LOYALTY POINTS & MEMBER TIER CARD */}
            <div 
              className="border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg"
              style={{
                background: isLight 
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(255,255,255,0.9))' 
                  : 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(15,23,42,0.9))'
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Member VIP Loyalty
                </span>
                <div className="flex items-baseline gap-1.5">
                  <h4 className="text-2xl font-black font-mono" style={{ color: textColor }}>{loyaltyPoints}</h4>
                  <span className="text-xs text-amber-500 font-semibold">Poin</span>
                </div>
                <p className="text-[10px]" style={{ color: secondaryTextColor }}>Senilai Rp {(loyaltyPoints * 10).toLocaleString('id-ID')} diskon checkout</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            {/* PROFILE MENU ACTIONS (INTERAKTIF & BISA DIKLIK) */}
            <div className="flex flex-col gap-2.5">
              {/* TOMBOL MEMBER PASS DIGITAL CARD */}
              <button
                type="button"
                onClick={() => {
                  onClose()
                  setActiveApp('customer-portal')
                }}
                className="w-full border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between text-left transition-all group shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      Kartu Digital & Member Portal
                    </h4>
                    <p className="text-[10px]" style={{ color: secondaryTextColor }}>Apple Wallet Passbook, Stamp Card, E-Tickets</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* TOMBOL VOUCHER */}
              <button
                type="button"
                onClick={() => setActiveTab('vouchers')}
                className="w-full border hover:border-amber-500/50 rounded-2xl p-3.5 flex items-center justify-between text-left transition-all group shadow"
                style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold group-hover:text-amber-500 transition-colors" style={{ color: textColor }}>
                      Voucher & Kupon Saya
                    </h4>
                    <p className="text-[10px]" style={{ color: secondaryTextColor }}>Promo Bank, Partner & Merchant</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                    {activeVouchers.length} Tersedia
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>

              {/* TOMBOL RIWAYAT KUNJUNGAN PRIBADI */}
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="w-full border hover:border-amber-500/50 rounded-2xl p-3.5 flex items-center justify-between text-left transition-all group shadow"
                style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold group-hover:text-amber-500 transition-colors" style={{ color: textColor }}>
                      Riwayat Kunjungan & Belanja Saya
                    </h4>
                    <p className="text-[10px]" style={{ color: secondaryTextColor }}>Daftar kunjungan, perolehan poin & repeat order</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>
                    {PERSONAL_VISITS_MOCK.length} Kunjungan
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            </div>

            {/* LOGOUT / GANTI AKUN */}
            <button
              type="button"
              onClick={() => {
                onLogout()
                onClose()
              }}
              className="mt-1 w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Akun / Keluar</span>
            </button>
          </div>
        )}

        {/* ================= VIEW 2: DAFTAR VOUCHER & KUPON SAYA ================= */}
        {activeTab === 'vouchers' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black flex items-center gap-1.5" style={{ color: textColor }}>
                <Ticket className="w-4 h-4 text-amber-500" /> Voucher & Kupon Aktif Milik Anda
              </h4>
              <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>{activeVouchers.length} Kupon</span>
            </div>

            <div className="flex flex-col gap-3 pb-8">
              {activeVouchers.map((v: Voucher) => (
                <VoucherCard
                  key={v.code}
                  voucher={v}
                  mode="copyable"
                  isCopied={copiedCode === v.code}
                  onCopy={handleCopyCode}
                  onViewDetails={(voucher) => setSelectedVoucherForDetails(voucher)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: RIWAYAT KUNJUNGAN & BELANJA SAYA ================= */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black flex items-center gap-1.5" style={{ color: textColor }}>
                <History className="w-4 h-4 text-amber-500" /> Riwayat Kunjungan & Belanja Saya
              </h4>
              <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>{PERSONAL_VISITS_MOCK.length} Kunjungan</span>
            </div>

            <div className="flex flex-col gap-3 pb-8">
              {PERSONAL_VISITS_MOCK.map(visit => (
                <div 
                  key={visit.orderId}
                  className="border rounded-2xl p-3.5 flex flex-col gap-2.5 shadow"
                  style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
                >
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: subCardBorder }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Kunjungan #{visit.visitNo}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: secondaryTextColor }}>
                        {visit.date}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {visit.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-[11px] flex items-center gap-1" style={{ color: secondaryTextColor }}>
                      <MapPin className="w-3 h-3 text-amber-500" /> {visit.venue}
                    </span>
                    <div className="flex flex-col gap-0.5 mt-1 border-t pt-1" style={{ borderColor: subCardBorder }}>
                      {visit.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]" style={{ color: textColor }}>
                          <span>{it.qty}x {it.name}</span>
                          <span className="font-mono" style={{ color: secondaryTextColor }}>Rp {it.price.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2 mt-1" style={{ borderColor: subCardBorder }}>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Coins className="w-3 h-3" /> +{visit.pointsEarned} Poin
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        alert(`Pesanan kunjungan #${visit.visitNo} (${visit.orderId}) telah dimasukkan ke keranjang belanja Anda!`)
                        onClose()
                      }}
                      className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Beli Menu Ini Lagi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED TERMS & CONDITIONS MODAL SHEET */}
      <VoucherDetailModal
        voucher={selectedVoucherForDetails}
        isOpen={!!selectedVoucherForDetails}
        onClose={() => setSelectedVoucherForDetails(null)}
        mode="copyable"
        isCopied={copiedCode === selectedVoucherForDetails?.code}
        onCopy={handleCopyCode}
      />
    </div>
  )
}
