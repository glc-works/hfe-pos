import { useState, useMemo } from 'react'
import { BusinessType, OperationScale, BusinessTypePolicy, OperationScalePolicy, OnboardingData } from '../types/pos'
import { saveStoreSettings } from '../services/hfeApi'

const STORAGE_KEY_COMPLETED = 'hfe_onboarding_completed'
const STORAGE_KEY_DATA = 'hfe_onboarding_data'
const STORAGE_KEY_CHECKLIST = 'hfe_onboarding_checklist'

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  businessType: 'cafe_fnb',
  operationScale: 'small_team',
  cluster: 'CLUSTER_FNB',
  migrationSource: 'fresh',
  country: 'ID',
  currency: 'IDR',
  capacityScale: '20 Meja (👥 3/4)',
  brandName: 'Artisan Coffee & Eatery',
  logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
  address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
  instagram: '@artisancoffee.id',
  whatsappOrder: '6281298765432',
  wifiSsid: 'Artisan_Guest_WiFi',
  wifiPassword: 'kopiuenak2026',
  wifiAccessPolicy: 'after_payment',
  pb1TaxMode: 1,
  initialKasFloat: 500000,
  tenancyUuid: 'cb-tenancy-7f8a9b2c-0100-hfe',
}

export const PERSONA_KAFE_BSD: Partial<OnboardingData> = {
  businessType: 'cafe_fnb',
  operationScale: 'small_team',
  cluster: 'CLUSTER_FNB',
  migrationSource: 'fresh',
  country: 'ID',
  currency: 'IDR',
  capacityScale: '20 Meja (👥 3/4)',
  brandName: 'BSD Specialty Coffee & Eatery',
  logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop',
  address: 'Ruko BSD Boulevard No. 12, Tangerang Selatan',
  instagram: '@bsdcoffee.id',
  whatsappOrder: '628119876543',
  wifiSsid: 'BSDCoffee_Free',
  wifiPassword: 'kopibsd2026',
  wifiAccessPolicy: 'after_payment',
  pb1TaxMode: 1,
  initialKasFloat: 500000,
  tenancyUuid: 'cb-tenancy-bsd-0102-hfe',
}

export const PERSONA_ROASTERY: Partial<OnboardingData> = {
  businessType: 'cafe_fnb',
  operationScale: 'enterprise',
  cluster: 'CLUSTER_ROASTERY',
  migrationSource: 'fresh',
  country: 'ID',
  currency: 'IDR',
  capacityScale: '20kg Batch Oven',
  brandName: 'PT Nusantara Sangrai Kopi',
  logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop',
  address: 'Kawasan Industri Gading Serpong Blok R-8, Tangerang',
  instagram: '@nusantararoastery',
  whatsappOrder: '6281234567890',
  wifiSsid: 'NusantaraRoastery_Staff',
  wifiPassword: 'roastmaster2026',
  wifiAccessPolicy: 'always_visible',
  pb1TaxMode: 2,
  initialKasFloat: 1000000,
  tenancyUuid: 'cb-tenancy-roastery-0103-hfe',
}

export interface ChecklistState {
  wizardCompleted: boolean
  brandConfigured: boolean
  taxConfigured: boolean
  testSaleDone: boolean
  printerConnected: boolean
}

export const DEFAULT_CHECKLIST: ChecklistState = {
  wizardCompleted: false,
  brandConfigured: false,
  taxConfigured: false,
  testSaleDone: false,
  printerConnected: false,
}

export function getBusinessTypePolicy(businessType: BusinessType): BusinessTypePolicy {
  switch (businessType) {
    case 'toko_kelontong':
      return {
        enableTableFloorPlan: false,
        enableDrinkModifiers: false,
        enableKdsKanban: false,
        enableRecipeBom: false,
        enableBarcodeScanner: true,
        enableMultiUom: true,
        enableKasbonLedger: true,
        enableScanAndGo: true,
        enableCourseFiring: false,
        enableSommelierCellar: false,
        enableMaitreDVip: false,
      }
    case 'fine_dining':
      return {
        enableTableFloorPlan: true,
        enableDrinkModifiers: false,
        enableKdsKanban: true,
        enableRecipeBom: true,
        enableBarcodeScanner: false,
        enableMultiUom: false,
        enableKasbonLedger: false,
        enableScanAndGo: false,
        enableCourseFiring: true,
        enableSommelierCellar: true,
        enableMaitreDVip: true,
      }
    case 'cafe_fnb':
    default:
      return {
        enableTableFloorPlan: true,
        enableDrinkModifiers: true,
        enableKdsKanban: true,
        enableRecipeBom: true,
        enableBarcodeScanner: false,
        enableMultiUom: false,
        enableKasbonLedger: false,
        enableScanAndGo: false,
        enableCourseFiring: false,
        enableSommelierCellar: false,
        enableMaitreDVip: false,
      }
  }
}

export function getOperationScalePolicy(operationScale: OperationScale): OperationScalePolicy {
  switch (operationScale) {
    case 'single_person':
      return {
        enableAutoBumpOnCheckout: true,
        enableUnifiedSingleScreen: true,
        requireStaffPinAuth: false,
        enableMultiStationKds: false,
      }
    case 'enterprise':
      return {
        enableAutoBumpOnCheckout: false,
        enableUnifiedSingleScreen: false,
        requireStaffPinAuth: true,
        enableMultiStationKds: true,
      }
    case 'small_team':
    default:
      return {
        enableAutoBumpOnCheckout: false,
        enableUnifiedSingleScreen: false,
        requireStaffPinAuth: true,
        enableMultiStationKds: false,
      }
  }
}

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_COMPLETED) === 'true'
    }
    return false
  })

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)

  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_DATA)
      if (saved) {
        try {
          return { ...DEFAULT_ONBOARDING_DATA, ...JSON.parse(saved) }
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_ONBOARDING_DATA
  })

  const [checklist, setChecklist] = useState<ChecklistState>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_CHECKLIST
  })

  const businessTypePolicy = useMemo(() => {
    return getBusinessTypePolicy(onboardingData.businessType)
  }, [onboardingData.businessType])

  const operationScalePolicy = useMemo(() => {
    return getOperationScalePolicy(onboardingData.operationScale)
  }, [onboardingData.operationScale])

  const updateStep = (step: 1 | 2 | 3 | 4) => {
    setActiveStep(step)
  }

  const updateOnboardingData = (partial: Partial<OnboardingData>) => {
    setOnboardingData((prev) => {
      const updated = { ...prev, ...partial }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(updated))
      }
      return updated
    })
  }

  const applyPersona = (persona: 'bsd' | 'roastery') => {
    const template = persona === 'bsd' ? PERSONA_KAFE_BSD : PERSONA_ROASTERY
    updateOnboardingData(template)
  }

  const completeOnboarding = async () => {
    const payload = {
      onboarding: onboardingData,
      businessTypePolicy,
      operationScalePolicy,
      completedAt: new Date().toISOString(),
    }

    await saveStoreSettings(payload)

    setIsOnboardingCompleted(true)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COMPLETED, 'true')
    }

    setChecklist((prev) => {
      const updated = {
        ...prev,
        wizardCompleted: true,
        brandConfigured: Boolean(onboardingData.brandName),
        taxConfigured: true,
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(updated))
      }
      return updated
    })
  }

  const resetOnboarding = () => {
    setIsOnboardingCompleted(false)
    setActiveStep(1)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_COMPLETED)
    }
  }

  const toggleChecklistItem = (key: keyof ChecklistState) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(updated))
      }
      return updated
    })
  }

  return {
    isOnboardingCompleted,
    activeStep,
    onboardingData,
    businessTypePolicy,
    operationScalePolicy,
    checklist,
    updateStep,
    updateOnboardingData,
    applyPersona,
    completeOnboarding,
    resetOnboarding,
    toggleChecklistItem,
  }
}
