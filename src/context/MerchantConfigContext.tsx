import React, { createContext, useContext, useState, useRef, ReactNode } from 'react'
import { PaymentPolicy, CafeThemeConfig, PrimaryDomainApp, Voucher, PartnerContact, StorefrontCustomizationConfig, BusinessOperatingArchetype, PosWorkflowToggles, PB1TaxMode, SupportedCurrency } from '../types/pos'
import { CashierAudioService } from '../services/hardware/CashierAudioService'
import { BUILTIN_THEMES } from '../data/mockData'
import { MARKETPLACE_THEMES } from '../data/marketplaceThemesData'
import { DEFAULT_AVAILABLE_VOUCHERS } from '../data/mockVouchers'
import { INITIAL_PARTNER_CONTACTS } from '../data/mockContacts'
import { DEFAULT_STOREFRONT_CUSTOMIZATION } from '../data/defaultStorefrontCustomization'

export type ViewportModeType = 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'tablet' | 'responsive'
export type ThemeModeType = 'light' | 'dark' | 'system'

export interface MerchantConfigContextType {
  // 1. BILLING & FINANCIAL POLICY
  paymentPolicy: PaymentPolicy
  setPaymentPolicy: (policy: PaymentPolicy) => void
  pb1TaxMode: PB1TaxMode
  setPb1TaxMode: (mode: PB1TaxMode) => void
  takeawaySurcharge: number
  setTakeawaySurcharge: (fee: number) => void
  primaryCurrency: SupportedCurrency
  setPrimaryCurrency: (currency: SupportedCurrency) => void
  initialCashFloat: number
  setInitialCashFloat: (amt: number) => void

  // 2. HARDWARE & CASHIER WORKSTATION
  soundBeeperEnabled: boolean
  setSoundBeeperEnabled: (enabled: boolean) => void

  // 3. THEME & VISUAL IDENTITY
  themeMode: ThemeModeType
  setThemeMode: (mode: ThemeModeType) => void
  toggleThemeMode: () => void
  customerTheme: CafeThemeConfig
  setCustomerTheme: (theme: CafeThemeConfig) => void
  merchantTheme: CafeThemeConfig
  setMerchantTheme: (theme: CafeThemeConfig) => void
  savedThemes: CafeThemeConfig[]
  saveCustomTheme: (name: string, theme: CafeThemeConfig) => void
  deleteSavedTheme: (name: string) => void
  allAvailableThemes: CafeThemeConfig[]

  // 4. STOREFRONT CUSTOMIZATION (LANDING PAGE & QR ORDER)
  storeName: string
  storefrontSubdomain: string
  storefrontCustomDomain: string
  storefrontConfig: StorefrontCustomizationConfig
  updateStorefrontConfig: (delta: Partial<StorefrontCustomizationConfig>) => void
  resetStorefrontConfig: () => void

  // 5. RUNTIME APP & VIEWPORT
  activeApp: PrimaryDomainApp | 'cfd'
  setActiveApp: (app: PrimaryDomainApp | 'cfd') => void
  viewportMode: ViewportModeType
  setViewportMode: (mode: ViewportModeType) => void

  // 6. OPERATING ARCHETYPE & POS WORKFLOW MODES (SSOT)
  operatingArchetype: BusinessOperatingArchetype
  setOperatingArchetype: (archetype: BusinessOperatingArchetype) => void
  workflowToggles: PosWorkflowToggles
  updateWorkflowToggles: (delta: Partial<PosWorkflowToggles>) => void

  // 7. VOUCHERS & PROMO MANAGEMENT (SSOT)
  vouchers: Voucher[]
  partnerContacts: PartnerContact[]
  addVoucher: (voucher: Voucher) => void
  updateVoucher: (code: string, voucher: Partial<Voucher>) => void
  deleteVoucher: (code: string) => void
  toggleVoucherStatus: (code: string) => void
  addPartnerContact: (contact: PartnerContact) => void

  // 8. MOCK RESEED / RESET TRIGGER
  onResetMockState?: () => void
  setOnResetMockState: (fn: () => void) => void
}

const MerchantConfigContext = createContext<MerchantConfigContextType | undefined>(undefined)

export const MerchantConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Payment & Financial Policy
  const [paymentPolicy, setPaymentPolicyState] = useState<PaymentPolicy>(() => {
    try {
      const stored = localStorage.getItem('hfe_payment_policy')
      return stored === 'pay-first' || stored === 'open-tab' ? stored : 'pay-first'
    } catch { return 'pay-first' }
  })

  const [pb1TaxMode, setPb1TaxModeState] = useState<PB1TaxMode>(() => {
    try {
      const stored = localStorage.getItem('hfe_pb1_tax_mode')
      return stored !== null ? (Number(stored) as PB1TaxMode) : 1
    } catch { return 1 }
  })

  const [takeawaySurcharge, setTakeawaySurchargeState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('hfe_takeaway_surcharge')
      return stored !== null ? Number(stored) : 2000
    } catch { return 2000 }
  })

  const [primaryCurrency, setPrimaryCurrencyState] = useState<SupportedCurrency>(() => {
    try {
      const stored = localStorage.getItem('hfe_primary_currency') as SupportedCurrency
      return stored || 'IDR'
    } catch { return 'IDR' }
  })

  const [initialCashFloat, setInitialCashFloatState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('hfe_initial_cash_float')
      return stored !== null ? Number(stored) : 500000
    } catch { return 500000 }
  })

  // 2. Hardware Beeper
  const [soundBeeperEnabled, setSoundBeeperEnabledState] = useState<boolean>(() => {
    return CashierAudioService.getInstance().isEnabled()
  })

  // 2. Theme Mode ('light' | 'dark' | 'system')
  const [themeMode, setThemeModeState] = useState<ThemeModeType>(() => {
    try {
      const stored = localStorage.getItem('hfe_theme_mode') as ThemeModeType
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
      return 'dark'
    } catch {
      return 'dark'
    }
  })

  // Synchronize .light and .dark classes on documentElement and body dynamically
  React.useEffect(() => {
    const applyTheme = (mode: ThemeModeType) => {
      let isDark = mode === 'dark'
      if (mode === 'system') {
        isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      }

      const root = document.documentElement
      const body = document.body
      if (isDark) {
        root.classList.add('dark')
        root.classList.remove('light')
        body?.classList.add('dark')
        body?.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
        body?.classList.add('light')
        body?.classList.remove('dark')
      }
    }

    applyTheme(themeMode)

    if (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [themeMode])

  const setThemeMode = (mode: ThemeModeType) => {
    setThemeModeState(mode)
    try {
      localStorage.setItem('hfe_theme_mode', mode)
    } catch {}
  }

  const toggleThemeMode = () => {
    setThemeModeState(prev => {
      const next: ThemeModeType = prev === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('hfe_theme_mode', next)
      } catch {}
      return next
    })
  }

  // 3. Customer & Merchant Themes
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

  // 4. Storefront Customization (Landing Page & QR Order)
  const [storefrontConfig, setStorefrontConfigState] = useState<StorefrontCustomizationConfig>(() => {
    try {
      const stored = localStorage.getItem('hfe_storefront_customization')
      return stored ? { ...DEFAULT_STOREFRONT_CUSTOMIZATION, ...JSON.parse(stored) } : DEFAULT_STOREFRONT_CUSTOMIZATION
    } catch {
      return DEFAULT_STOREFRONT_CUSTOMIZATION
    }
  })

  // 5. Vouchers & Partner Contacts (SSOT)
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

  // 6. Runtime App & Viewport
  const [activeApp, setActiveApp] = useState<PrimaryDomainApp | 'cfd'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('app') as PrimaryDomainApp
      if (p && ['landing', 'customer', 'cafe', 'cfd', 'design-system', 'customer-portal'].includes(p)) {
        return p
      }
      const host = window.location.hostname.toLowerCase()
      if (host.startsWith('order.')) return 'customer'
      if (host.startsWith('board.')) return 'landing'
      if (host.startsWith('card.')) return 'customer-portal'
      if (host.startsWith('pos.') || host.startsWith('book.') || host.startsWith('admin.')) return 'cafe'
    }
    return 'cafe'
  })

  const [viewportMode, setViewportMode] = useState<ViewportModeType>('responsive')
  const resetHandlerRef = useRef<(() => void) | null>(null)

  // --- 5. OPERATING ARCHETYPE & POS WORKFLOW MODES ---
  const [operatingArchetype, setOperatingArchetypeState] = useState<BusinessOperatingArchetype>(() => {
    try {
      const saved = localStorage.getItem('hfe_pos_operating_archetype')
      if (saved === 'quick-service-stall' || saved === 'casual-dine-in' || saved === 'full-service-resto') return saved
    } catch {}
    return 'casual-dine-in'
  })

  const [workflowToggles, setWorkflowToggles] = useState<PosWorkflowToggles>(() => {
    try {
      const saved = localStorage.getItem('hfe_pos_workflow_toggles')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      enableMenuCatalog: true,
      enableTableFloorPlan: true,
      enableBookingReservations: false,
      defaultPosMode: 'tables'
    }
  })

  const setOperatingArchetype = (archetype: BusinessOperatingArchetype) => {
    setOperatingArchetypeState(archetype)
    let newToggles: PosWorkflowToggles
    if (archetype === 'quick-service-stall') {
      newToggles = {
        enableMenuCatalog: true,
        enableTableFloorPlan: false,
        enableBookingReservations: false,
        defaultPosMode: 'catalog'
      }
    } else if (archetype === 'casual-dine-in') {
      newToggles = {
        enableMenuCatalog: true,
        enableTableFloorPlan: true,
        enableBookingReservations: false,
        defaultPosMode: 'tables'
      }
    } else {
      newToggles = {
        enableMenuCatalog: true,
        enableTableFloorPlan: true,
        enableBookingReservations: true,
        defaultPosMode: 'tables'
      }
    }
    setWorkflowToggles(newToggles)
    try {
      localStorage.setItem('hfe_pos_operating_archetype', archetype)
      localStorage.setItem('hfe_pos_workflow_toggles', JSON.stringify(newToggles))
    } catch {}
  }

  const updateWorkflowToggles = (delta: Partial<PosWorkflowToggles>) => {
    setWorkflowToggles(prev => {
      const updated = { ...prev, ...delta }
      try {
        localStorage.setItem('hfe_pos_workflow_toggles', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // --- SINGLE DOOR MUTATORS ---
  const updateStorefrontConfig = (delta: Partial<StorefrontCustomizationConfig>) => {
    setStorefrontConfigState(prev => {
      const updated = {
        ...prev,
        ...delta,
        socialLinks: {
          ...prev.socialLinks,
          ...(delta.socialLinks || {})
        }
      }
      try {
        localStorage.setItem('hfe_storefront_customization', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const resetStorefrontConfig = () => {
    setStorefrontConfigState(DEFAULT_STOREFRONT_CUSTOMIZATION)
    try {
      localStorage.setItem('hfe_storefront_customization', JSON.stringify(DEFAULT_STOREFRONT_CUSTOMIZATION))
    } catch {}
  }
  const setPaymentPolicy = (policy: PaymentPolicy) => {
    setPaymentPolicyState(policy)
    try { localStorage.setItem('hfe_payment_policy', policy) } catch {}
  }
  const setPb1TaxMode = (mode: PB1TaxMode) => {
    setPb1TaxModeState(mode)
    try { localStorage.setItem('hfe_pb1_tax_mode', String(mode)) } catch {}
  }
  const setTakeawaySurcharge = (fee: number) => {
    setTakeawaySurchargeState(fee)
    try { localStorage.setItem('hfe_takeaway_surcharge', String(fee)) } catch {}
  }
  const setPrimaryCurrency = (curr: SupportedCurrency) => {
    setPrimaryCurrencyState(curr)
    try { localStorage.setItem('hfe_primary_currency', curr) } catch {}
  }
  const setInitialCashFloat = (amt: number) => {
    setInitialCashFloatState(amt)
    try { localStorage.setItem('hfe_initial_cash_float', String(amt)) } catch {}
  }
  const setSoundBeeperEnabled = (enabled: boolean) => {
    setSoundBeeperEnabledState(enabled)
    CashierAudioService.getInstance().setEnabled(enabled)
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
    const updated = [...savedThemes.filter(t => t.themeId !== theme.themeId), { ...theme, themeName: name, isCustomTheme: true }]
    setSavedThemes(updated)
    try { localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated)) } catch {}
  }

  const deleteSavedTheme = (themeId: string) => {
    const updated = savedThemes.filter(t => t.themeId !== themeId)
    setSavedThemes(updated)
    try { localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated)) } catch {}
  }

  // --- VOUCHER CRUD MUTATORS ---
  const addVoucher = (voucher: Voucher) => {
    const updated = [voucher, ...vouchers.filter(v => v.code !== voucher.code)]
    setVouchers(updated)
    try { localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated)) } catch {}
  }

  const updateVoucher = (code: string, delta: Partial<Voucher>) => {
    const updated = vouchers.map(v => v.code === code ? { ...v, ...delta } : v)
    setVouchers(updated)
    try { localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated)) } catch {}
  }

  const deleteVoucher = (code: string) => {
    const updated = vouchers.filter(v => v.code !== code)
    setVouchers(updated)
    try { localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated)) } catch {}
  }

  const toggleVoucherStatus = (code: string) => {
    const updated = vouchers.map(v => v.code === code ? { ...v, isActive: !v.isActive } : v)
    setVouchers(updated)
    try { localStorage.setItem('hfe_merchant_vouchers', JSON.stringify(updated)) } catch {}
  }

  const addPartnerContact = (contact: PartnerContact) => {
    const updated = [contact, ...partnerContacts.filter(c => c.id !== contact.id)]
    setPartnerContacts(updated)
    try { localStorage.setItem('hfe_partner_contacts', JSON.stringify(updated)) } catch {}
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
        paymentPolicy, setPaymentPolicy,
        pb1TaxMode, setPb1TaxMode,
        takeawaySurcharge, setTakeawaySurcharge,
        primaryCurrency, setPrimaryCurrency,
        initialCashFloat, setInitialCashFloat,
        soundBeeperEnabled, setSoundBeeperEnabled,
        themeMode, setThemeMode, toggleThemeMode,
        customerTheme, setCustomerTheme,
        merchantTheme, setMerchantTheme,
        savedThemes, saveCustomTheme, deleteSavedTheme,
        allAvailableThemes,
        storeName: storefrontConfig.storeName || 'Kopi Nusantara',
        storefrontSubdomain: storefrontConfig.storefrontSubdomain || 'kopinusantara',
        storefrontCustomDomain: storefrontConfig.storefrontCustomDomain || '',
        storefrontConfig, updateStorefrontConfig, resetStorefrontConfig,
        activeApp, setActiveApp,
        viewportMode, setViewportMode,
        operatingArchetype, setOperatingArchetype,
        workflowToggles, updateWorkflowToggles,
        vouchers, partnerContacts,
        addVoucher, updateVoucher, deleteVoucher, toggleVoucherStatus,
        addPartnerContact,
        onResetMockState, setOnResetMockState
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
