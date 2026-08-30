import React from 'react'
import { Mail, Lock, Store, Eye, EyeOff, ShieldAlert, CheckCircle } from 'lucide-react'
import type { SocialAuthProvider } from '../../services/auth'
import { AuthSocialProviderButtons } from './AuthSocialProviderButtons'

export interface PosOwnerAuthFormsProps {
  activeTab: 'owner-login' | 'owner-register' | 'forgot-password'
  ownerEmail: string
  setOwnerEmail: (val: string) => void
  ownerPassword: string
  setOwnerPassword: (val: string) => void
  showOwnerPassword: boolean
  setShowOwnerPassword: (val: boolean) => void
  regBrand: string
  setRegBrand: (val: string) => void
  regEmail: string
  setRegEmail: (val: string) => void
  regPassword: string
  setRegPassword: (val: string) => void
  showRegPassword: boolean
  setShowRegPassword: (val: boolean) => void
  resetStep: 1 | 2
  resetEmail: string
  setResetEmail: (val: string) => void
  resetToken: string
  setResetToken: (val: string) => void
  newPassword: string
  setNewPassword: (val: string) => void
  showNewPassword: boolean
  setShowNewPassword: (val: boolean) => void
  loading: boolean
  errorMessage: string | null
  successMessage: string | null
  onOwnerLoginSubmit: (e: React.FormEvent) => void
  onOwnerRegisterSubmit: (e: React.FormEvent) => void
  onRequestResetSubmit: (e: React.FormEvent) => void
  onConfirmResetSubmit: (e: React.FormEvent) => void
  getPasswordStrength: (pwd: string) => number
  socialProviders: SocialAuthProvider[]
  onSocialSignIn: (provider: SocialAuthProvider) => void
}

export const PosOwnerAuthForms: React.FC<PosOwnerAuthFormsProps> = ({
  activeTab,
  ownerEmail,
  setOwnerEmail,
  ownerPassword,
  setOwnerPassword,
  showOwnerPassword,
  setShowOwnerPassword,
  regBrand,
  setRegBrand,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  showRegPassword,
  setShowRegPassword,
  resetStep,
  resetEmail,
  setResetEmail,
  resetToken,
  setResetToken,
  newPassword,
  setNewPassword,
  showNewPassword,
  setShowNewPassword,
  loading,
  errorMessage,
  successMessage,
  onOwnerLoginSubmit,
  onOwnerRegisterSubmit,
  onRequestResetSubmit,
  onConfirmResetSubmit,
  getPasswordStrength,
  socialProviders,
  onSocialSignIn,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. OWNER LOGIN FORM */}
      {activeTab === 'owner-login' && (
        <form onSubmit={onOwnerLoginSubmit} className="flex flex-col gap-3.5">
          <AuthSocialProviderButtons
            providers={socialProviders}
            disabled={loading}
            onSelect={onSocialSignIn}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="owner-email" className="text-[11px] text-slate-300 font-medium">Email Pemilik Usaha:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                id="owner-email"
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@cafe.id"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="owner-password" className="text-[11px] text-slate-300 font-medium">Kata Sandi Akun:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                id="owner-password"
                type={showOwnerPassword ? 'text' : 'password'}
                required
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showOwnerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-1"
          >
            {loading ? 'Memproses...' : 'Masuk sebagai Owner ➔'}
          </button>
        </form>
      )}

      {/* 2. OWNER REGISTER FORM */}
      {activeTab === 'owner-register' && (
        <form onSubmit={onOwnerRegisterSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300 font-medium">Nama Brand / Usaha:</label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                value={regBrand}
                onChange={(e) => setRegBrand(e.target.value)}
                placeholder="Kopitiam Senopati"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300 font-medium">Email Pemilik Usaha:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="owner@cafe.id"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-300 font-medium">Kata Sandi Baru:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type={showRegPassword ? 'text' : 'password'}
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min 8 karakter, huruf & angka"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-1"
          >
            {loading ? 'Mendaftarkan...' : 'Daftarkan Usaha Sekarang ➔'}
          </button>
        </form>
      )}

      {/* 3. FORGOT PASSWORD FORM */}
      {activeTab === 'forgot-password' && (
        <form onSubmit={resetStep === 1 ? onRequestResetSubmit : onConfirmResetSubmit} className="flex flex-col gap-3.5">
          {resetStep === 1 ? (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300 font-medium">Email Akun:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="owner@cafe.id"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium">Token Reset (6 Digit):</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300 font-medium">Kata Sandi Baru:</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 karakter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-1"
          >
            {loading ? 'Memproses...' : resetStep === 1 ? 'Kirim Token Reset ➔' : 'Simpan Kata Sandi Baru ➔'}
          </button>
        </form>
      )}
    </div>
  )
}
