import React, { useState } from 'react'
import { usePosAuth } from '../hooks/usePosAuth'
import { Keyboard, UserCheck, UserPlus, HelpCircle, Store } from 'lucide-react'
import { PosPinKeypadSection } from '../components/auth/PosPinKeypadSection'
import { PosOwnerAuthForms } from '../components/auth/PosOwnerAuthForms'
import { firstPartyAuthEntryPolicy } from '../config/firstPartyRuntime'
import {
  configuredSocialProviders,
  startSocialSignIn,
  type ToGrowSocialProvider,
} from '../services/toGrowSocialSignIn'

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

  const authPolicy = firstPartyAuthEntryPolicy()
  const socialProviders = configuredSocialProviders()
  const [activeTab, setActiveTab] = useState<AuthTab>(authPolicy.initialTab)
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

  const handleKeypadPress = (val: string) => {
    if (isCooldownActive || loading) return
    setErrorMessage(null)
    if (val === 'DEL') setPin((prev) => prev.slice(0, -1))
    else if (val === 'CLR') setPin('')
    else if (pin.length < 6) setPin((prev) => prev + val)
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length < 6 || loading || isCooldownActive) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const user = await loginWithPin(activeBranchId, pin)
      setSuccessMessage(`Selamat datang, ${user.name || 'Kasir'}!`)
      setTimeout(() => onSuccess?.(), 1000)
    } catch (err: any) {
      setErrorMessage(err.message || 'PIN tidak valid.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      await loginWithOwner(ownerEmail, ownerPassword)
      setSuccessMessage('Login Pemilik Berhasil!')
      setTimeout(() => onSuccess?.(), 1000)
    } catch (err: any) {
      setErrorMessage(err.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = (provider: ToGrowSocialProvider) => {
    setLoading(true)
    setErrorMessage(null)
    void startSocialSignIn(provider).catch((error) => {
      setLoading(false)
      setErrorMessage(error instanceof Error ? error.message : 'Login sosial tidak tersedia.')
    })
  }

  const handleOwnerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      await registerOwner(regBrand, regEmail, regPassword)
      setSuccessMessage('Registrasi Berhasil! Silakan masuk.')
      setActiveTab('owner-login')
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      const msg = await requestPasswordReset(resetEmail)
      setSuccessMessage(msg || 'Token reset berhasil dikirim!')
      setResetStep(2)
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirim token.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    try {
      const msg = await confirmPasswordReset(resetToken, newPassword)
      setSuccessMessage(msg || 'Password berhasil direset! Silakan login.')
      setActiveTab('owner-login')
      setResetStep(1)
    } catch (err: any) {
      setErrorMessage(err.message || 'Token salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-slate-950 p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-scaleUp">
        {/* BRAND LOGO */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white">Hfe POS Terminal</h2>
          <span className="text-xs text-slate-400">Point of Sale & Backoffice Authentication</span>
        </div>

        {/* TAB SELECTOR */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          {[
            { id: 'pin', label: 'PIN Kasir', icon: Keyboard },
            { id: 'owner-login', label: 'Owner', icon: UserCheck },
            { id: 'owner-register', label: 'Daftar', icon: UserPlus },
            { id: 'forgot-password', label: 'Bantuan', icon: HelpCircle }
          ].filter(t => (
            (t.id !== 'pin' || authPolicy.allowSyntheticStaffPin)
            && (t.id !== 'owner-register' || authPolicy.allowLocalRegistration)
          )).map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setActiveTab(t.id as AuthTab); setErrorMessage(null); setSuccessMessage(null) }}
                className={`py-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* ACTIVE FORM RENDERER */}
        {activeTab === 'pin' ? (
          <PosPinKeypadSection
            pin={pin}
            onKeypadPress={handleKeypadPress}
            onLoginSubmit={handlePinSubmit}
            loading={loading}
            isCooldownActive={isCooldownActive}
            cooldownSeconds={cooldownSeconds}
            activeBranchId={activeBranchId}
            setActiveBranchId={setActiveBranchId}
            branches={BRANCHES}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        ) : (
          <PosOwnerAuthForms
            activeTab={activeTab}
            ownerEmail={ownerEmail}
            setOwnerEmail={setOwnerEmail}
            ownerPassword={ownerPassword}
            setOwnerPassword={setOwnerPassword}
            showOwnerPassword={showOwnerPassword}
            setShowOwnerPassword={setShowOwnerPassword}
            regBrand={regBrand}
            setRegBrand={setRegBrand}
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            regPassword={regPassword}
            setRegPassword={setRegPassword}
            showRegPassword={showRegPassword}
            setShowRegPassword={setShowRegPassword}
            resetStep={resetStep}
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            resetToken={resetToken}
            setResetToken={setResetToken}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            loading={loading}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onOwnerLoginSubmit={handleOwnerLogin}
            onOwnerRegisterSubmit={handleOwnerRegister}
            onRequestResetSubmit={handleRequestReset}
            onConfirmResetSubmit={handleConfirmReset}
            getPasswordStrength={getPasswordStrength}
            socialProviders={socialProviders}
            onSocialSignIn={handleSocialSignIn}
          />
        )}
      </div>
    </div>
  )
}
export default PosAuthLoginView
