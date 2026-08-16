import React, { useState } from 'react'
import { usePosAuth } from '../hooks/usePosAuth'
import { Keyboard, UserCheck, UserPlus, HelpCircle, Eye, EyeOff, Store, Lock, Mail, ShieldAlert, CheckCircle, MapPin } from 'lucide-react'

export interface PosAuthLoginViewProps {
  onSuccess?: () => void
}

type AuthTab = 'pin' | 'owner-login' | 'owner-register' | 'forgot-password'

const BRANCHES = [
  { id: 'BRANCH-HQ-01', name: 'Artisan Cafe HQ (Sudirman)' },
  { id: 'BRANCH-SENOPATI-02', name: 'Artisan Cafe (Senopati)' },
  { id: 'BRANCH-BANDUNG-03', name: 'Artisan Cafe (Bandung Dago)' },
]

export const PosAuthLoginView: React.FC<PosAuthLoginViewProps> = ({ onSuccess }) => {
  const {
    activeBranchId, setActiveBranchId, cooldownSeconds, isCooldownActive,
    loginWithPin, loginWithOwner, registerOwner, requestPasswordReset, confirmPasswordReset
  } = usePosAuth()

  const [activeTab, setActiveTab] = useState<AuthTab>('pin')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pin, setPin] = useState<string>('')
  const [ownerEmail, setOwnerEmail] = useState<string>('')
  const [ownerPassword, setOwnerPassword] = useState<string>('')
  const [showOwnerPassword, setShowOwnerPassword] = useState<boolean>(false)
  const [regBrand, setRegBrand] = useState<string>('')
  const [regEmail, setRegEmail] = useState<string>('')
  const [regPassword, setRegPassword] = useState<string>('')
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false)
  const [resetStep, setResetStep] = useState<1 | 2>(1)

  const [resetEmail, setResetEmail] = useState<string>('')
  const [resetToken, setResetToken] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)

  const getPasswordStrength = (pwd: string) =>
    (pwd.length >= 8 ? 1 : 0) + (/[A-Z]/.test(pwd) ? 1 : 0) + (/[0-9]/.test(pwd) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pwd) ? 1 : 0)

  // Handle PIN Keypad entry
  const handleKeypadPress = (val: string) => {
    if (isCooldownActive || loading) return
    setErrorMessage(null)
    if (val === 'DEL') setPin((prev) => prev.slice(0, -1))
    else if (val === 'CLR') setPin('')
    else if (pin.length < 6) {
      const nextPin = pin + val
      setPin(nextPin)
      if (nextPin.length === 6) submitPin(nextPin)
    }
  }

  const submitPin = async (pinToSubmit: string) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      await loginWithPin(activeBranchId, pinToSubmit)
      setSuccessMessage('Login berhasil! Mengalihkan...')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login gagal. Periksa PIN staf Anda.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCooldownActive || loading) return
    setLoading(true)
    setErrorMessage(null)
    try {
      await loginWithOwner(ownerEmail, ownerPassword)
      setSuccessMessage('Login owner berhasil!')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (getPasswordStrength(regPassword) < 3) {
      setErrorMessage('Password minimal 8 karakter dengan 1 huruf besar dan 1 angka/simbol.')
      return
    }
    setLoading(true)
    setErrorMessage(null)
    try {
      await registerOwner(regBrand, regEmail, regPassword)
      setSuccessMessage('Pendaftaran outlet berhasil!')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err?.message || 'Pendaftaran gagal.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      const msg = await requestPasswordReset(resetEmail)
      setSuccessMessage(msg)
      setResetStep(2)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal mengirim instruksi reset.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      const msg = await confirmPasswordReset(resetToken, newPassword)
      setSuccessMessage(msg)
      setTimeout(() => setActiveTab('owner-login'), 1500)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memperbarui password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950/60 p-6 text-center border-b border-slate-700/50">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-3">
            <Store className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Hfe POS Workstation</h1>
          <p className="text-xs text-slate-400 mt-1">Point of Sale & Retail Cashier Portal</p>
        </div>

        {/* Integrated Outlet Branch Selector (Directly on Login Screen) */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-700/50 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cabang Outlet Active Workstation</label>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
            >
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cooldown Alert Banner */}
        {isCooldownActive && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 p-3 text-center text-xs font-semibold text-rose-300 flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>Terlalu banyak percobaan gagal. Silakan tunggu {cooldownSeconds} detik.</span>
          </div>
        )}

        {/* Global Error/Success Messages */}
        {errorMessage && !isCooldownActive && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2 text-xs text-rose-400 text-center font-medium">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-400 text-center font-medium flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 4 Mode Authentication Tabs */}
        <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-700/50 p-1 gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('pin'); setErrorMessage(null); }}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'pin' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>PIN Staf</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('owner-login'); setErrorMessage(null); }}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'owner-login' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('owner-register'); setErrorMessage(null); }}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'owner-register' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('forgot-password'); setErrorMessage(null); }}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'forgot-password' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Lupa Pass</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: STAFF 6-DIGIT PIN */}
          {activeTab === 'pin' && (
            <div className="space-y-5">
              {/* 6-Digit Mask Dots */}
              <div className="flex justify-center gap-2 py-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-xl border flex items-center justify-center text-xl font-bold transition-all ${
                      pin.length > idx
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-sm'
                        : 'border-slate-700 bg-slate-900 text-slate-600'
                    }`}
                  >
                    {pin.length > idx ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* 3x4 Touch Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    disabled={isCooldownActive || loading}
                    onClick={() => handleKeypadPress(btn)}
                    className={`h-12 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center ${
                      btn === 'CLR' || btn === 'DEL'
                        ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs'
                        : 'bg-slate-900 hover:bg-slate-700 text-white border border-slate-700/60'
                    } disabled:opacity-40`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OWNER SIGN IN */}
          {activeTab === 'owner-login' && (
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Owner</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@cafe.id"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot-password')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showOwnerPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showOwnerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCooldownActive || loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Memproses...' : 'Sign In Owner'}
              </button>
            </form>
          )}

          {/* TAB 3: OWNER SIGN UP */}
          {activeTab === 'owner-register' && (
            <form onSubmit={handleOwnerRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Brand Cafe / Outlet</label>
                <input
                  type="text"
                  required
                  value={regBrand}
                  onChange={(e) => setRegBrand(e.target.value)}
                  placeholder="Kopi Kenangan Senopati"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Pendaftaran</label>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="owner@cafe.id"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-all ${
                            getPasswordStrength(regPassword) >= step
                              ? step <= 2 ? 'bg-rose-500' : step === 3 ? 'bg-amber-500' : 'bg-emerald-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Kekuatan: Min 8 karakter, 1 kapital, 1 angka/simbol.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Daftar...' : 'Daftar Outlet Baru'}
              </button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD & OTP RESET */}
          {activeTab === 'forgot-password' && (
            <div>
              {resetStep === 1 ? (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Masukkan email terdaftar untuk menerima instruksi kode OTP reset password.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Terdaftar</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="owner@cafe.id"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Kirim...' : 'Minta Kode OTP Reset'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetConfirm} className="space-y-4">
                  <p className="text-xs text-slate-400">Masukkan kode OTP dan password baru Anda.</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kode OTP Reset Token</label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="KODE-123456"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password Baru</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Memperbarui...' : 'Simpan Password Baru'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
