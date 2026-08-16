import { describe, it, expect } from 'vitest'
import { WifiAccessPolicy, HfeCompanyProfile, OnboardingData } from '../types/pos'
import { DEFAULT_COMPANY_PROFILE } from '../data/mockData'
import { DEFAULT_ONBOARDING_DATA } from '../hooks/useOnboarding'

/**
 * Pure helper function to evaluate WiFi Display state according to POS-ENG-STD-001
 */
export function resolveWifiAccessState(params: {
  policy?: WifiAccessPolicy
  hasPaidOrder: boolean
  ssid?: string
  password?: string
}): {
  isVisible: boolean
  isPasswordRevealed: boolean
  displaySsid: string
  displayPassword?: string
  lockNotice?: string
} {
  const policy = params.policy || 'after_payment'
  const ssid = params.ssid || 'Kopitiam_Senopati_Guest'
  const password = params.password || 'kopiuenak2026'

  if (policy === 'disabled') {
    return {
      isVisible: false,
      isPasswordRevealed: false,
      displaySsid: ssid,
    }
  }

  if (policy === 'always_visible') {
    return {
      isVisible: true,
      isPasswordRevealed: true,
      displaySsid: ssid,
      displayPassword: password,
    }
  }

  // policy === 'after_payment'
  if (params.hasPaidOrder) {
    return {
      isVisible: true,
      isPasswordRevealed: true,
      displaySsid: ssid,
      displayPassword: password,
    }
  }

  return {
    isVisible: true,
    isPasswordRevealed: false,
    displaySsid: ssid,
    lockNotice: `🔒 WiFi: ${ssid} (Password terbuka setelah pesanan lunas)`
  }
}

describe('WiFi Access Policy & Storefront Settings Suite (POS-ENG-STD-001)', () => {
  it('1. Default Company Profile Contract: Initial storefrontInfo contains correct defaults', () => {
    expect(DEFAULT_COMPANY_PROFILE.storefrontInfo).toBeDefined()
    expect(DEFAULT_COMPANY_PROFILE.storefrontInfo?.wifiAccessPolicy).toBe('after_payment')
    expect(DEFAULT_COMPANY_PROFILE.storefrontInfo?.wifiSsid).toBe('Kopitiam_Senopati_Guest')
    expect(DEFAULT_COMPANY_PROFILE.storefrontInfo?.wifiPassword).toBe('kopiuenak2026')
  })

  it('2. Default Onboarding Data Contract: Initial onboarding data contains wifiAccessPolicy', () => {
    expect(DEFAULT_ONBOARDING_DATA.wifiAccessPolicy).toBe('after_payment')
    expect(DEFAULT_ONBOARDING_DATA.wifiSsid).toBe('Artisan_Guest_WiFi')
    expect(DEFAULT_ONBOARDING_DATA.wifiPassword).toBe('kopiuenak2026')
  })

  it('3. Policy: always_visible - SSID and Password are fully visible before payment', () => {
    const state = resolveWifiAccessState({
      policy: 'always_visible',
      hasPaidOrder: false,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(state.isVisible).toBe(true)
    expect(state.isPasswordRevealed).toBe(true)
    expect(state.displaySsid).toBe('Kopitiam_Senopati_Guest')
    expect(state.displayPassword).toBe('kopiuenak2026')
    expect(state.lockNotice).toBeUndefined()
  })

  it('4. Policy: always_visible - SSID and Password remain visible after payment', () => {
    const state = resolveWifiAccessState({
      policy: 'always_visible',
      hasPaidOrder: true,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(state.isVisible).toBe(true)
    expect(state.isPasswordRevealed).toBe(true)
    expect(state.displayPassword).toBe('kopiuenak2026')
  })

  it('5. Policy: after_payment - Password is locked before payment is settled', () => {
    const state = resolveWifiAccessState({
      policy: 'after_payment',
      hasPaidOrder: false,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(state.isVisible).toBe(true)
    expect(state.isPasswordRevealed).toBe(false)
    expect(state.displayPassword).toBeUndefined()
    expect(state.lockNotice).toBe('🔒 WiFi: Kopitiam_Senopati_Guest (Password terbuka setelah pesanan lunas)')
  })

  it('6. Policy: after_payment - Password is unlocked after order is settled / paid', () => {
    const state = resolveWifiAccessState({
      policy: 'after_payment',
      hasPaidOrder: true,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(state.isVisible).toBe(true)
    expect(state.isPasswordRevealed).toBe(true)
    expect(state.displayPassword).toBe('kopiuenak2026')
    expect(state.lockNotice).toBeUndefined()
  })

  it('7. Policy: disabled - WiFi row is completely hidden', () => {
    const stateBeforePay = resolveWifiAccessState({
      policy: 'disabled',
      hasPaidOrder: false,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(stateBeforePay.isVisible).toBe(false)
    expect(stateBeforePay.isPasswordRevealed).toBe(false)

    const stateAfterPay = resolveWifiAccessState({
      policy: 'disabled',
      hasPaidOrder: true,
      ssid: 'Kopitiam_Senopati_Guest',
      password: 'kopiuenak2026'
    })

    expect(stateAfterPay.isVisible).toBe(false)
  })

  it('8. Dynamic Policy Mutation in Company Profile and Onboarding', () => {
    const profile: HfeCompanyProfile = {
      ...DEFAULT_COMPANY_PROFILE,
      storefrontInfo: {
        ...DEFAULT_COMPANY_PROFILE.storefrontInfo,
        wifiAccessPolicy: 'disabled'
      }
    }
    expect(profile.storefrontInfo?.wifiAccessPolicy).toBe('disabled')

    const onboarding: OnboardingData = {
      ...DEFAULT_ONBOARDING_DATA,
      wifiAccessPolicy: 'always_visible',
      wifiSsid: 'Custom_Cafe_WiFi',
      wifiPassword: 'customsecret2026'
    }
    expect(onboarding.wifiAccessPolicy).toBe('always_visible')
    expect(onboarding.wifiSsid).toBe('Custom_Cafe_WiFi')
    expect(onboarding.wifiPassword).toBe('customsecret2026')
  })
})
