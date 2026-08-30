import React, { useState } from 'react'
import { Phone, User, ArrowRight, Sparkles, ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface CustomerAuthGateProps {
  brandName: string
  onLoginSuccess: (phone: string, name?: string) => void
  onBackToLanding?: () => void
  onBackToMenu?: () => void
}

export const CustomerAuthGate: React.FC<CustomerAuthGateProps> = ({
  brandName,
  onLoginSuccess,
  onBackToLanding,
  onBackToMenu
}) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.trim().length < 8) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(phoneNumber.trim(), guestName.trim() || undefined)
    }, 400)
  }

  const handleQuickDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess('081288889999', 'Bpk. Alexander')
    }, 250)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-md mx-auto animate-fadeIn">
      {/* CARD EMBLEM & BRAND TITLE */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {brandName} • Member Pass
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Masuk / Daftar Member
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Dapatkan poin cashback, akses kupon eksklusif, dan simpan struk belanja digital Anda.
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-3.5 text-left">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Nomor WhatsApp / HP</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                +62
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="812-3456-7890"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Nama Lengkap (Opsional)</span>
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Bpk. Alexander"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneNumber.length < 8}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer mt-1"
          >
            {isLoading ? (
              <span className="animate-pulse">Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk / Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* QUICK DEMO LOGIN BUTTON */}
        <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Masuk Cepat Demo (0812-8888-9999)</span>
          </button>

          {(onBackToLanding || onBackToMenu) && (
            <button
              type="button"
              onClick={onBackToLanding || onBackToMenu}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold py-1.5 transition-colors cursor-pointer"
            >
              ➔ Kembali ke Beranda
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
