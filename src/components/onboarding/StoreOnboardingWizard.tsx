import React, { useState } from 'react'
import { useOnboarding } from '../../hooks/useOnboarding'
import { Step1StoreTypeAndScale } from './Step1StoreTypeAndScale'
import { Step2BrandAndSocialProfile } from './Step2BrandAndSocialProfile'
import { Step3TaxAndFloatSettings } from './Step3TaxAndFloatSettings'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Store, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onComplete?: () => void
}

export const StoreOnboardingWizard: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const {
    activeStep,
    onboardingData,
    isOnboardingCompleted,
    updateStep,
    updateOnboardingData,
    completeOnboarding,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-hide wizard after onboarding setup is completed
  if (!isOpen || isOnboardingCompleted) return null

  const handleNext = () => {
    if (activeStep === 1) updateStep(2)
    else if (activeStep === 2) updateStep(3)
  }

  const handleBack = () => {
    if (activeStep === 2) updateStep(1)
    else if (activeStep === 3) updateStep(2)
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      await completeOnboarding()
      if (onComplete) onComplete()
      if (onClose) onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepTitles = [
    { num: 1, label: 'Jenis & Skala Toko' },
    { num: 2, label: 'Brand & Profil' },
    { num: 3, label: 'Pajak & Kas Float' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 dark:bg-amber-950/95 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                Wizard Penyiapan Toko Barista POS
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold">
                  2 Menit Setup
                </span>
              </h2>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Konfigurasi otomatis preset bisnis & integrasi HCB Core API
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Stepper Bar */}
        <div className="px-6 py-3 bg-amber-500/5 border-b border-amber-900/10 flex items-center justify-between shrink-0">
          {stepTitles.map((st) => {
            const isActive = activeStep === st.num
            const isCompleted = activeStep > st.num

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => updateStep(st.num as 1 | 2 | 3)}
                className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-900/40 dark:text-amber-100/40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-900/10 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : st.num}
                </div>
                <span>{st.label}</span>
              </button>
            )
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeStep === 1 && (
            <Step1StoreTypeAndScale
              businessType={onboardingData.businessType}
              operationScale={onboardingData.operationScale}
              onSelectBusinessType={(type) => updateOnboardingData({ businessType: type })}
              onSelectOperationScale={(scale) => updateOnboardingData({ operationScale: scale })}
            />
          )}

          {activeStep === 2 && (
            <Step2BrandAndSocialProfile
              data={onboardingData}
              onChange={updateOnboardingData}
            />
          )}

          {activeStep === 3 && (
            <Step3TaxAndFloatSettings
              data={onboardingData}
              onChange={updateOnboardingData}
            />
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div>
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-amber-900/20 bg-amber-500/10 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            ) : (
              <span className="text-xs text-amber-800/60 dark:text-amber-300/60">
                Langkah 1 dari 3
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-all flex items-center gap-1.5"
              >
                Lanjut Ke Langkah {activeStep + 1}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                {isSubmitting ? 'Menyimpan...' : 'Selesaikan Penyiapan Toko ✨'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
