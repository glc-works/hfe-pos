import React, { createContext, useContext, useState, useRef, ReactNode } from 'react'
import { PaymentPolicy, CafeThemeConfig, PrimaryDomainApp, Voucher, PartnerContact } from '../types/pos'
import { BUILTIN_THEMES } from '../data/mockData'
import { MARKETPLACE_THEMES } from '../data/marketplaceThemesData'
import { DEFAULT_AVAILABLE_VOUCHERS } from '../components/pos/VoucherCard'
import { INITIAL_PARTNER_CONTACTS } from '../data/mockContacts'

export type ViewportModeType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'tablet' | 'responsive'

export interface MerchantConfigContextType {
  // 1. BILLING & PAYMENT POLICY
  paymentPolicy: PaymentPolicy
  setPaymentPolicy: (policy: PaymentPolicy) => void

  // 2. THEME & VISUAL IDENTITY
  customerTheme: CafeThemeConfig
  setCustomerTheme: (theme: CafeThemeConfig) => void
  merchantTheme: CafeThemeConfig
  setMerchantTheme: (theme: CafeThemeConfig) => void
  savedThemes: CafeThemeConfig[]
  saveCustomTheme: (name: string, theme: CafeThemeConfig) => void
  deleteSavedTheme: (name: string) => void
  allAvailableThemes: CafeThemeConfig[]

  // 3. RUNTIME APP & VIEWPORT
  activeApp: PrimaryDomainApp | 'cfd'
  setActiveApp: (app: PrimaryDomainApp | 'cfd') => void
  viewportMode: ViewportModeType
  setViewportMode: (mode: ViewportModeType) => void

  // 4. VOUCHERS & PROMO MANAGEMENT (SSOT)
  vouchers: Voucher[]
  partnerContacts: PartnerContact[]
  addVoucher: (voucher: Voucher) => void
  updateVoucher: (code: string, voucher: Partial<Voucher>) => void
  deleteVoucher: (code: string) => void
  toggleVoucherStatus: (code: string) => void
  addPartnerContact: (contact: PartnerContact) => void

  // 5. MOCK RESEED / RESET TRIGGER
  onResetMockState?: () => void
  setOnResetMockState: (fn: () => void) => void
}

const MerchantConfigContext = createContext<MerchantConfigContextType | undefined>(undefined)

export const MerchantConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Payment Policy
  const [paymentPolicy, setPaymentPolicyState] = useState<PaymentPolicy>(() => {
    try {
      const stored = localStorage.getItem('hfe_payment_policy')
      return stored === 'pay-first' || stored === 'open-tab' ? stored : 'pay-first'
    } catch {
      return 'pay-first'
    }
  })

  // 2. Customer & Merchant Themes
  const [customerTheme, setCustomerThemeState] = useState<CafeThemeConfig>(() => {
    try {
      const stored = localStorage.getItem('hfe_customer_theme')
      return stored ? JSON.parse(stored) : BUILTIN_THEMES[0]
    } catch {
      return BUILTIN_THEMES[0]
    }
  })

  const [merchantTheme, setMerchantThemeState] = useState<CafeThemeConfig>(() => {
    try {
      const stored = localStorage.getItem('hfe_merchant_theme')
      return stored ? JSON.parse(stored) : (BUILTIN_THEMES[4] || BUILTIN_THEMES[0])
    } catch {
      return BUILTIN_THEMES[4] || BUILTIN_THEMES[0]
    }
  })

  // 3. Saved Custom Templates Vault
  const [savedThemes, setSavedThemes] = useState<CafeThemeConfig[]>(() => {
    try {
      const stored = localStorage.getItem('hfe_custom_saved_templates')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // 4. Vouchers & Partner Contacts (SSOT)
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    try {
      const stored = localStorage.getItem('hfe_merchant_vouchers')
      return stored ? JSON.parse(stored) : DEFAULT_AVAILABLE_VOUCHERS
    } catch {
      return DEFAULT_AVAILABLE_VOUCHERS
    }
  })

  const [partnerContacts, setPartnerContacts] = useState<PartnerContact[]>(() => {
    try {
      const stored = localStorage.getItem('hfe_partner_contacts')
      return stored ? JSON.parse(stored) : INITIAL_PARTNER_CONTACTS
    } catch {
      return INITIAL_PARTNER_CONTACTS
    }
  })

  // 5. Runtime App & Viewport
  const [activeApp, setActiveApp] = useState<PrimaryDomainApp | 'cfd'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('app') as PrimaryDomainApp
      if (p && ['landing', 'customer', 'cafe', 'cfd', 'design-system'].includes(p)) {
        return p
      }
    }
    return 'customer'
  })

  const [viewportMode, setViewportMode] = useState<ViewportModeType>('responsive')
  const resetHandlerRef = useRef<(() => void) | null>(null)

  // --- SINGLE DOOR MUTATORS ---
  const setPaymentPolicy = (policy: PaymentPolicy) => {
    setPaymentPolicyState(policy)
    try {
      localStorage.setItem('hfe_payment_policy', policy)
    } catch {}
  }

  const setCustomerTheme = (theme: CafeThemeConfig) => {
    setCustomerThemeState(theme)
    try {
      localStorage.setItem('hfe_customer_theme', JSON.stringify(theme))
    } catch {}
  }

  const setMerchantTheme = (theme: CafeThemeConfig) => {
    setMerchantThemeState(theme)
    try {
      localStorage.setItem('hfe_merchant_theme', JSON.stringify(theme))
    } catch {}
  }

  const saveCustomTheme = (name: string, theme: CafeThemeConfig) => {
    const updated = [
      ...savedThemes.filter(t => t.themeId !== theme.themeId),
      { ...theme, themeName: name, isCustomTheme: true }
    ]
    setSavedThemes(updated)
    try {
      localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated))
    } catch {}
  }

  const deleteSavedTheme = (themeId: string) => {
    const updated = savedThemes.filter(t => t.themeId !== themeId)
    setSavedThemes(updated)
    try {
      localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated))
    } catch {}
  }

  // --- VOUCHER CRUD MUTATORS ---
  const addVoucher = (voucher: Voucher) => {
    const updated = [voucher, ...vouchers.filter(v => v.code !== voucher.code)]
    setVouchers(updated)
    try {
      localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated))
    } catch {}
  }

  const updateVoucher = (code: string, delta: Partial<Voucher>) => {
    const updated = vouchers.map(v => v.code === code ? { ...v, ...delta } : v)
    setVouchers(updated)
    try {
      localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated))
    } catch {}
  }

  const deleteVoucher = (code: string) => {
    const updated = vouchers.filter(v => v.code !== code)
    setVouchers(updated)
    try {
      localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated))
    } catch {}
  }

  const toggleVoucherStatus = (code: string) => {
    const updated = vouchers.map(v => v.code === code ? { ...v, isActive: !v.isActive } : v)
    setVouchers(updated)
    try {
      localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated))
    } catch {}
  }

  const addPartnerContact = (contact: PartnerContact) => {
    const updated = [contact, ...partnerContacts.filter(c => c.id !== contact.id)]
    setPartnerContacts(updated)
    try {
      localStorage.setItem('hfe_partner_contacts', JSON.stringify(updated))
    } catch {}
  }

  const setOnResetMockState = (fn: () => void) => {
    resetHandlerRef.current = fn
  }

  const onResetMockState = () => {
    if (resetHandlerRef.current) {
      resetHandlerRef.current()
    }
  }

  const allAvailableThemes: CafeThemeConfig[] = [
    ...BUILTIN_THEMES,
    ...MARKETPLACE_THEMES.map(m => m.theme),
    ...savedThemes
  ]

  return (
    <MerchantConfigContext.Provider
      value={{
        paymentPolicy,
        setPaymentPolicy,
        customerTheme,
        setCustomerTheme,
        merchantTheme,
        setMerchantTheme,
        savedThemes,
        saveCustomTheme,
        deleteSavedTheme,
        allAvailableThemes,
        activeApp,
        setActiveApp,
        viewportMode,
        setViewportMode,
        vouchers,
        partnerContacts,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        toggleVoucherStatus,
        addPartnerContact,
        onResetMockState,
        setOnResetMockState
      }}
    >
      {children}
    </MerchantConfigContext.Provider>
  )
}

export const useMerchantConfig = (): MerchantConfigContextType => {
  const context = useContext(MerchantConfigContext)
  if (!context) {
    throw new Error('useMerchantConfig must be used within a MerchantConfigProvider')
  }
  return context
}
