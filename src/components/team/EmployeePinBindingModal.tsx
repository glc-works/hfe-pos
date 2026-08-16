import React, { useState } from 'react'
import { Keyboard, ShieldCheck, X, Delete, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onBindPin: (pinCode: string) => Promise<{ success: boolean; message?: string }>
}

export const EmployeePinBindingModal: React.FC<Props> = ({ isOpen, onClose, onBindPin }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num
      setPin(nextPin)
      setError(null)
      if (nextPin.length === 6) {
        submitPin(nextPin)
      }
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(null)
  }

  const handleClear = () => {
    setPin('')
    setError(null)
  }

  const submitPin = async (codeToSubmit: string) => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const res = await onBindPin(codeToSubmit)
      if (res.success) {
        setSuccessMessage('PIN Berhasil Divalidasi! Tablet Teraktivasi ✨')
        setTimeout(() => {
          setPin('')
          setSuccessMessage(null)
          onClose()
        }, 1200)
      } else {
        setError(res.message || 'PIN tidak valid atau belum terdaftar')
        setPin('')
      }
    } catch {
      setError('Gagal memproses validasi PIN tablet')
      setPin('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-amber-50 dark:bg-amber-950 rounded-3xl shadow-2xl border border-amber-900/20 p-6 text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-600/15 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-extrabold text-amber-950 dark:text-amber-100">
          Aktivasi PIN Staf Tablet
        </h3>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-5">
          Masukkan 6-digit PIN unik anggota tim untuk membuka workstation.
        </p>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* PIN Indicators Dots */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = pin.length > idx
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-amber-600 scale-110 shadow-md ring-4 ring-amber-500/20'
                    : 'border-2 border-amber-900/20 bg-amber-500/5'
                }`}
              />
            )
          })}
        </div>

        {/* Keyboard Grid */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-900/15 text-lg font-bold text-amber-950 dark:text-amber-100 active:scale-95 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
            >
              {num}
            </button>
          ))}

          {/* Bottom Row */}
          <button
            type="button"
            onClick={handleClear}
            className="w-full h-14 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 active:scale-95 transition-all flex items-center justify-center"
          >
            C
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-900/15 text-lg font-bold text-amber-950 dark:text-amber-100 active:scale-95 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full h-14 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-900/15 text-amber-800 dark:text-amber-200 active:scale-95 transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-amber-800/60 dark:text-amber-300/60 mt-4">
          PIN default demo: <strong>123456</strong> (Owner) atau <strong>654321</strong> (Cashier)
        </p>

      </div>
    </div>
  )
}
