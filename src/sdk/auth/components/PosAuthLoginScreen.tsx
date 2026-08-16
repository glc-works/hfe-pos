import React, { useState } from 'react'
import { KeyRound, ShieldAlert, Store, UserPlus, Mail, Lock, Building, ArrowRight } from 'lucide-react'
import { usePosAuth } from '../PosAuthProvider'
import { EmployeePinKeypad } from './EmployeePinKeypad'
import { WaVerificationButton } from './WaVerificationButton'
import { forgotPassword, resetPassword } from '../../../services/hfeAuthApi'

export interface PosAuthLoginScreenProps {
  defaultTab?: 'pin' | 'login' | 'register' | 'forgot'
  onSuccess?: () => void
  branchId?: string
}

export const PosAuthLoginScreen: React.FC<PosAuthLoginScreenProps> = ({
  defaultTab = 'pin',
  onSuccess,
  branchId = 'BRANCH-SENOPATI',
}) => {
  const { loginWithPin, loginOwner, registerOwner, rateLimitState, apiEndpoint } = usePosAuth()
  const [activeTab, setActiveTab] = useState<'pin' | 'login' | 'register' | 'forgot'>(defaultTab)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [brandName, setBrandName] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotStep, setForgotStep] = useState<'request' | 'confirm'>('request')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePinComplete = async (pin: string) => {
    setErrorMessage(null)
    setLoading(true)
    try {
      await loginWithPin(branchId, pin)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err.message || 'PIN tidak valid')
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)
    try {
      await loginOwner(email, password)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)
    try {
      await registerOwner(brandName, email, password)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMessage(err.message || 'Pendaftaran gagal')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)
    try {
      const res = await forgotPassword(email, apiEndpoint)
      setInfoMessage(res.message)
      setForgotStep('confirm')
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirimkan instruksi reset')
    } finally {
      setLoading(false)
    }
  }

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)
    try {
      const res = await resetPassword(resetToken, newPassword, apiEndpoint)
      setInfoMessage(res.message)
      setTimeout(() => {
        setActiveTab('login')
        setForgotStep('request')
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('pin'); setErrorMessage(null); }}
          className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'pin' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Staff PIN</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
          className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'login' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Owner Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
          className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'register' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftar</span>
        </button>
      </div>

      {/* Rate limit warning banner */}
      {rateLimitState.isLocked && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs font-medium">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>Akses Terkunci. Terlalu banyak percobaan gagal. Silakan tunggu {rateLimitState.remainingCooldownSeconds}s.</span>
        </div>
      )}

      {/* Error / Info messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {errorMessage}
        </div>
      )}
      {infoMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
          {infoMessage}
        </div>
      )}

      {/* TAB 1: Staff PIN */}
      {activeTab === 'pin' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Masukan 6-Digit PIN Kasir</h3>
            <p className="text-xs text-slate-500">Cabang: <span className="font-semibold text-slate-700">{branchId}</span></p>
          </div>
          <EmployeePinKeypad
            onPinComplete={handlePinComplete}
            disabled={loading || rateLimitState.isLocked}
          />
          <div className="pt-2">
            <WaVerificationButton apiEndpoint={apiEndpoint} />
          </div>
        </div>
      )}

      {/* TAB 2: Owner Login */}
      {activeTab === 'login' && (
        <form onSubmit={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Owner</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@artisancafe.id"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('forgot')}
              className="text-amber-600 hover:underline font-medium"
            >
              Lupa Password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || rateLimitState.isLocked}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Masuk Owner Workstation'}
          </button>
        </form>
      )}

      {/* TAB 3: Owner Register */}
      {activeTab === 'register' && (
        <form onSubmit={handleOwnerRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama Brand / Toko</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Kopitiam Senopati HQ"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Registrasi</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@artisancafe.id"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password Baru</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 Karakter"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Daftar Akun Baru'}
          </button>
        </form>
      )}

      {/* TAB 4: Forgot Password */}
      {activeTab === 'forgot' && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Reset Password Owner</h3>
          {forgotStep === 'request' ? (
            <form onSubmit={handleForgotRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Terdaftar</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@artisancafe.id"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>Kirim OTP Reset</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kode OTP Token</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Kode OTP"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                Simpan Password Baru
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="w-full mt-3 text-xs text-slate-500 hover:text-slate-700 text-center block font-medium"
          >
            Kembali ke Login
          </button>
        </div>
      )}
    </div>
  )
}
