import React, { useState } from 'react'
import { useOnboarding } from '../../hooks/useOnboarding'
import { Step1StoreTypeAndScale } from './Step1StoreTypeAndScale'
import { Step2BrandAndSocialProfile } from './Step2BrandAndSocialProfile'
import { Step3TaxAndFloatSettings } from './Step3TaxAndFloatSettings'
import { Step4VerificationPreview } from './Step4VerificationPreview'
import { Button, Badge } from '@/ui'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Store, X, ShieldCheck } from 'lucide-react'

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
    applyPersona,
    completeOnboarding,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-hide wizard after onboarding setup is completed
  if (!isOpen || isOnboardingCompleted) return null

  const handleNext = () => {
    if (activeStep === 1) updateStep(2)
    else if (activeStep === 2) updateStep(3)
    else if (activeStep === 3) updateStep(4)
  }

  const handleBack = () => {
    if (activeStep === 2) updateStep(1)
    else if (activeStep === 3) updateStep(2)
    else if (activeStep === 4) updateStep(3)
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
    { num: 1 as const, label: 'Identitas & Jalur' },
    { num: 2 as const, label: 'Brand & Kapasitas' },
    { num: 3 as const, label: 'Pajak & Kas Float' },
    { num: 4 as const, label: 'Pratinjau Sistem' },
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950 dark:text-amber-100">
                  Wizard Penyiapan Toko & Onboarding Terpadu
                </h2>
                <Badge variant="default" className="text-[10px] py-0">
                  2 Menit Setup
                </Badge>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Konfigurasi otomatis preset bisnis, CoA 18 akun & integrasi HCB Core API
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Stepper Bar (Strict 4-Step Stepper) */}
        <div className="px-6 py-2.5 bg-amber-500/5 border-b border-amber-900/10 grid grid-cols-4 gap-2 shrink-0">
          {stepTitles.map((st) => {
            const isActive = activeStep === st.num
            const isCompleted = activeStep > st.num

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => updateStep(st.num)}
                className={`flex items-center gap-2 text-xs transition-colors text-left ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-900/40 dark:text-amber-100/40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-900/10 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : st.num}
                </div>
                <span className="truncate hidden sm:inline">{st.label}</span>
                <span className="sm:hidden text-[10px]">L{st.num}</span>
              </button>
            )
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeStep === 1 && (
            <Step1StoreTypeAndScale
              selectedCluster={onboardingData.cluster || 'CLUSTER_FNB'}
              migrationSource={onboardingData.migrationSource || 'fresh'}
              country={onboardingData.country || 'ID'}
              currency={onboardingData.currency || 'IDR'}
              onSelectCluster={(cluster) => updateOnboardingData({ cluster })}
              onSelectMigrationSource={(source) => updateOnboardingData({ migrationSource: source })}
              onSelectCountryCurrency={(country, currency) => updateOnboardingData({ country, currency })}
              onApplyPersona={applyPersona}
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

          {activeStep === 4 && (
            <Step4VerificationPreview
              data={onboardingData}
            />
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div>
            {activeStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali
              </Button>
            ) : (
              <span className="text-xs text-amber-800/60 dark:text-amber-300/60">
                Langkah 1 dari 4
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 4 ? (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleNext}
                className="text-xs"
              >
                Lanjut Ke Langkah {activeStep + 1}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1.5 animate-pulse" />
                {isSubmitting ? 'Menerbitkan Tenancy...' : 'Aktifkan Outlet & Selesaikan Setup ✨'}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
