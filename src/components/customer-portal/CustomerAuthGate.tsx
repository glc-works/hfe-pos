import React, { useState, useRef, useEffect } from 'react'
import { Phone, User, ArrowRight, Sparkles, ChevronLeft, ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react'

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
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [guestName, setGuestName] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (authStep === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [authStep, countdown])

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.trim().length < 8) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setAuthStep('otp')
      setCountdown(60)
      setOtpError(false)
      // Focus first OTP box
      setTimeout(() => otpInputRefs[0].current?.focus(), 100)
    }, 400)
  }

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1)
    const newDigits = [...otpDigits]
    newDigits[index] = cleanVal
    setOtpDigits(newDigits)
    setOtpError(false)

    // Auto-advance to next input
    if (cleanVal && index < 3) {
      otpInputRefs[index + 1].current?.focus()
    }

    // Auto-verify if all 4 digits are filled
    if (index === 3 && cleanVal && newDigits.every(d => d !== '')) {
      const fullCode = newDigits.join('')
      verifyOtpCode(fullCode)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  const verifyOtpCode = (code: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Accept '1234' or any 4-digit code in test/demo mode
      if (code.length === 4) {
        onLoginSuccess(phoneNumber.trim() || '081288889999', guestName.trim() || undefined)
      } else {
        setOtpError(true)
      }
    }, 450)
  }

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = otpDigits.join('')
    if (fullCode.length === 4) {
      verifyOtpCode(fullCode)
    } else {
      setOtpError(true)
    }
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
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center gap-5">
        
        {/* BRAND EMBLEM */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {brandName} • Member Pass
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {authStep === 'phone' ? 'Masuk / Daftar Member' : 'Verifikasi Kode OTP'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {authStep === 'phone'
              ? 'Dapatkan poin cashback, akses kupon eksklusif, dan simpan struk belanja digital Anda.'
              : `Kode 4-digit telah dikirim via WhatsApp ke +62 ${phoneNumber}`}
          </p>
        </div>

        {/* STEP 1: PHONE & NAME INPUT */}
        {authStep === 'phone' && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-3.5 text-left">
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
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer mt-1"
            >
              {isLoading ? (
                <span className="animate-pulse">Mengirim Kode OTP...</span>
              ) : (
                <>
                  <span>Kirim Kode OTP via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* SOCIAL & PASSKEY FAST LOGIN VIA HFAUTH */}
            <div className="flex items-center gap-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span>atau masuk instan</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                    onLoginSuccess('081288889999', guestName || 'Member Passkey')
                  }, 400)
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <KeyRound className="w-4 h-4 text-indigo-500" />
                <span>Masuk dengan Passkey / Face ID (hfauth)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => {
                      setIsLoading(false)
                      onLoginSuccess('081299998888', guestName || 'Google Member')
                    }, 400)
                  }}
                  className="min-h-[40px] py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <span className="font-black text-rose-500">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => {
                      setIsLoading(false)
                      onLoginSuccess('081277776666', guestName || 'Apple Member')
                    }, 400)
                  }}
                  className="min-h-[40px] py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <span className="font-black">●</span>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: 4-DIGIT OTP PIN INPUT */}
        {authStep === 'otp' && (
          <form onSubmit={handleManualVerify} className="w-full flex flex-col gap-4 text-center">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center font-mono font-black text-xl sm:text-2xl rounded-2xl bg-slate-50 dark:bg-slate-950 border transition-all ${
                    otpError
                      ? 'border-rose-500 text-rose-500 ring-2 ring-rose-500/20'
                      : digit
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                  }`}
                />
              ))}
            </div>

            {/* OTP SIMULATION HELPER FOR EASY TESTING */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-700 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Kode Simulasi OTP: <strong>1234</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtpDigits(['1', '2', '3', '4'])
                  verifyOtpCode('1234')
                }}
                className="font-bold underline cursor-pointer hover:text-amber-500"
              >
                Isi Otomatis
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.some(d => d === '')}
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-pulse">Memverifikasi...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verifikasi & Buka Kartu</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setAuthStep('phone')}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition-colors cursor-pointer"
              >
                ‹ Ubah No HP
              </button>
              <button
                type="button"
                disabled={countdown > 0}
                onClick={() => {
                  setCountdown(60)
                  setOtpDigits(['', '', '', ''])
                }}
                className="text-amber-600 dark:text-amber-400 disabled:text-slate-400 font-bold transition-colors cursor-pointer"
              >
                {countdown > 0 ? `Kirim Ulang (${countdown}s)` : 'Kirim Ulang OTP'}
              </button>
            </div>
          </form>
        )}

        {/* QUICK DEMO LOGIN BUTTON */}
        <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Masuk Cepat Demo (0812-8888-9999)</span>
          </button>

          {(onBackToLanding || onBackToMenu) && (
            <button
              type="button"
              onClick={onBackToLanding || onBackToMenu}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold py-2 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ➔ Kembali ke Beranda
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
