import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Step1StoreTypeAndScale } from '../../components/onboarding/Step1StoreTypeAndScale'
import { Step2BrandAndSocialProfile } from '../../components/onboarding/Step2BrandAndSocialProfile'
import { Step3TaxAndFloatSettings } from '../../components/onboarding/Step3TaxAndFloatSettings'
import { Step4VerificationPreview } from '../../components/onboarding/Step4VerificationPreview'
import { DEFAULT_ONBOARDING_DATA, PERSONA_KAFE_BSD } from '../../hooks/useOnboarding'
import { OnboardingData } from '../../types/pos'
import { Button, Badge } from '@/ui'
import { Store, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'

// Standalone Stepper Container for Storybook
interface OnboardingContainerProps {
  initialStep?: 1 | 2 | 3 | 4
  initialData?: OnboardingData
}

export const OnboardingWizardShowcase: React.FC<OnboardingContainerProps> = ({
  initialStep = 1,
  initialData = DEFAULT_ONBOARDING_DATA,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(initialStep)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isCompleted, setIsCompleted] = useState(false)

  const stepTitles = [
    { num: 1 as const, label: 'Identitas & Jalur' },
    { num: 2 as const, label: 'Brand & Kapasitas' },
    { num: 3 as const, label: 'Pajak & Kas Float' },
    { num: 4 as const, label: 'Pratinjau Sistem' },
  ]

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-amber-50 dark:bg-amber-950/95 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col max-h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100">
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
                  3+1 Stepper
                </Badge>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Konfigurasi otomatis preset bisnis, CoA 18 akun & integrasi HCB Core
              </p>
            </div>
          </div>
        </div>

        {/* Progress Stepper Bar (Strict 3+1 Stepper) */}
        <div className="px-6 py-2.5 bg-amber-500/5 border-b border-amber-900/10 grid grid-cols-4 gap-2 shrink-0">
          {stepTitles.map((st) => {
            const isActive = activeStep === st.num
            const isDone = activeStep > st.num
            return (
              <button
                key={st.num}
                type="button"
                data-testid={`step-tab-${st.num}`}
                onClick={() => setActiveStep(st.num)}
                className={`flex items-center gap-2 text-xs transition-colors text-left ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-900/40 dark:text-amber-100/40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-900/10 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-4 h-4" /> : st.num}
                </div>
                <span className="truncate hidden sm:inline">{st.label}</span>
              </button>
            )
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeStep === 1 && (
            <Step1StoreTypeAndScale
              selectedCluster={data.cluster || 'CLUSTER_FNB'}
              migrationSource={data.migrationSource || 'fresh'}
              country={data.country || 'ID'}
              currency={data.currency || 'IDR'}
              onSelectCluster={(cluster) => updateData({ cluster })}
              onSelectMigrationSource={(source) => updateData({ migrationSource: source })}
              onSelectCountryCurrency={(country, currency) => updateData({ country, currency })}
              onApplyPersona={(persona) => {
                if (persona === 'bsd') updateData(PERSONA_KAFE_BSD)
              }}
            />
          )}

          {activeStep === 2 && (
            <Step2BrandAndSocialProfile data={data} onChange={updateData} />
          )}

          {activeStep === 3 && (
            <Step3TaxAndFloatSettings data={data} onChange={updateData} />
          )}

          {activeStep === 4 && (
            <Step4VerificationPreview data={data} />
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-amber-900/10 bg-amber-500/10 flex items-center justify-between shrink-0">
          <div>
            {activeStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="btn-wizard-back"
                onClick={() => setActiveStep((s) => ((s - 1) as 1 | 2 | 3 | 4))}
                className="text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
              </Button>
            ) : (
              <span className="text-xs text-amber-800/60 dark:text-amber-300/60">
                Langkah 1 dari 4
              </span>
            )}
          </div>

          <div>
            {activeStep < 4 ? (
              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="btn-wizard-next"
                onClick={() => setActiveStep((s) => ((s + 1) as 1 | 2 | 3 | 4))}
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
                data-testid="btn-wizard-finish"
                onClick={() => setIsCompleted(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {isCompleted ? 'Tenancy Siap!' : 'Aktifkan Outlet & Selesaikan Setup ✨'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof OnboardingWizardShowcase> = {
  title: 'Onboarding/StoreOnboardingWizard',
  component: OnboardingWizardShowcase,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof OnboardingWizardShowcase>

// Step 1: Fresh Setup vs Migration
export const Step1FreshVsMigration: Story = {
  args: {
    initialStep: 1,
    initialData: {
      ...DEFAULT_ONBOARDING_DATA,
      migrationSource: 'fresh',
    },
  },
}

// Step 2: Brand & Social Profile
export const Step2BrandProfile: Story = {
  args: {
    initialStep: 2,
    initialData: {
      ...DEFAULT_ONBOARDING_DATA,
      brandName: 'BSD Specialty Coffee & Eatery',
      address: 'Ruko BSD Boulevard No. 12, Tangerang Selatan',
      instagram: '@bsdcoffee.id',
    },
  },
}

// Step 3: Tax & Cash Float Settings
export const Step3TaxAndFloat: Story = {
  args: {
    initialStep: 3,
    initialData: {
      ...DEFAULT_ONBOARDING_DATA,
      pb1TaxMode: 1, // PB1 Exclude 10%
      initialKasFloat: 500000,
    },
  },
}

// Step 4: System Verification Preview
export const Step4VerificationPreviewStory: Story = {
  name: 'Step 4: System Verification Preview',
  args: {
    initialStep: 4,
    initialData: {
      ...DEFAULT_ONBOARDING_DATA,
      ...PERSONA_KAFE_BSD,
    },
  },
}

// Interactive Full Stepper Flow
export const InteractiveWizardFlow: Story = {
  args: {
    initialStep: 1,
    initialData: DEFAULT_ONBOARDING_DATA,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nextBtn1 = await canvas.findByTestId('btn-wizard-next')
    await userEvent.click(nextBtn1)

    const nextBtn2 = await canvas.findByTestId('btn-wizard-next')
    await userEvent.click(nextBtn2)

    const nextBtn3 = await canvas.findByTestId('btn-wizard-next')
    await userEvent.click(nextBtn3)

    const finishBtn = await canvas.findByTestId('btn-wizard-finish')
    expect(finishBtn).toBeDefined()
  },
}
