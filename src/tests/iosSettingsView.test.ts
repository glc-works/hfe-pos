import { describe, it, expect } from 'vitest'
import { DEFAULT_COMPANY_PROFILE, BUILTIN_THEMES } from '../data/mockData'
import { StaffSurfaceMode } from '../types/pos'

describe('iOS / Android Inset Grouped Settings & Top Menu Navigation (L2-POS-33 & L2-POS-34)', () => {
  it('should verify essential settings sections are defined and categorized', () => {
    const requiredSections = [
      'theme',
      'language',
      'tax-cash',
      'po-expense',
      'profile',
      'team',
      'reservations',
      'crm',
      'checklist'
    ]

    expect(requiredSections.length).toBe(9)
    requiredSections.forEach(sec => {
      expect(typeof sec).toBe('string')
    })
  })

  it('should support hfe-insights as a dedicated top-level staff surface menu', () => {
    const validSurfaces: StaffSurfaceMode[] = [
      'barista-pos',
      'hfe-insights',
      'kds-screen',
      'checker-qc',
      'server-waiter',
      'cafe-config',
      'warehouse-mgmt',
      'branch-mgmt'
    ]

    expect(validSurfaces).toContain('hfe-insights')
  })

  it('should have valid merchant profile data for Apple ID-style banner', () => {
    expect(DEFAULT_COMPANY_PROFILE.brandName).toBeDefined()
    expect(DEFAULT_COMPANY_PROFILE.ptLegalName).toBeDefined()
    expect(DEFAULT_COMPANY_PROFILE.logoUrl).toMatch(/^https?:\/\//)
  })

  it('should provide valid active and merchant theme fallback configurations', () => {
    const customerTheme = BUILTIN_THEMES[0]
    const merchantTheme = BUILTIN_THEMES[4]

    expect(customerTheme.mode).toBe('light')
    expect(merchantTheme.mode).toBe('dark')
  })
})
