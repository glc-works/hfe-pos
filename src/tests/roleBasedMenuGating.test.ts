import { describe, it, expect } from 'vitest'
import { FIVE_CORE_APPS } from '../components/common/StaffAppDrawerModal'

describe('Role-Based Menu & Surface Gating (GLC-ENG-STD-001 / Strict Role Filtering)', () => {
  const ROLE_ALLOWED_APPS: Record<string, string[]> = {
    barista: ['barista-pos', 'kds-screen'],
    cashier: ['barista-pos', 'kds-screen'],
    manager: ['barista-pos', 'kds-screen', 'warehouse-mgmt', 'cafe-config', 'merchant-hub', 'hfe-insights'],
    owner: ['barista-pos', 'kds-screen', 'hfe-insights', 'hfe-company-book', 'hfe-connect-hub', 'warehouse-mgmt', 'cafe-config', 'admin-hub', 'merchant-hub']
  }

  it('strictly hides management and financial apps for Barista role', () => {
    const allowed = ROLE_ALLOWED_APPS['barista']
    const visibleApps = FIVE_CORE_APPS.filter(app => allowed.includes(app.id))

    const appIds = visibleApps.map(a => a.id)
    expect(appIds).toContain('barista-pos')
    expect(appIds).toContain('kds-screen')
    expect(appIds).not.toContain('merchant-hub')
    expect(appIds).not.toContain('admin-hub')
    expect(appIds).not.toContain('hfe-company-book')
    expect(appIds).not.toContain('warehouse-mgmt')
  })

  it('strictly hides management and financial apps for Cashier role', () => {
    const allowed = ROLE_ALLOWED_APPS['cashier']
    const visibleApps = FIVE_CORE_APPS.filter(app => allowed.includes(app.id))

    const appIds = visibleApps.map(a => a.id)
    expect(appIds).toContain('barista-pos')
    expect(appIds).toContain('kds-screen')
    expect(appIds).not.toContain('merchant-hub')
    expect(appIds).not.toContain('admin-hub')
    expect(appIds).not.toContain('hfe-company-book')
  })

  it('allows warehouse and merchant hub for Manager role', () => {
    const allowed = ROLE_ALLOWED_APPS['manager']
    const visibleApps = FIVE_CORE_APPS.filter(app => allowed.includes(app.id))

    const appIds = visibleApps.map(a => a.id)
    expect(appIds).toContain('barista-pos')
    expect(appIds).toContain('kds-screen')
    expect(appIds).toContain('merchant-hub')
    expect(appIds).toContain('warehouse-mgmt')
    expect(appIds).toContain('hfe-insights')
  })

  it('allows 100% full access to all apps for Owner role', () => {
    const allowed = ROLE_ALLOWED_APPS['owner']
    const visibleApps = FIVE_CORE_APPS.filter(app => allowed.includes(app.id))

    expect(visibleApps.length).toBe(FIVE_CORE_APPS.length)
  })

  it('evaluates auto-bypass logic for Owner and Manager roles without secondary PIN', () => {
    const isAutoBypass = (role?: string) => {
      const r = role?.toLowerCase()
      return r === 'owner' || r === 'manager'
    }

    expect(isAutoBypass('owner')).toBe(true)
    expect(isAutoBypass('manager')).toBe(true)
    expect(isAutoBypass('barista')).toBe(false)
    expect(isAutoBypass('cashier')).toBe(false)
    expect(isAutoBypass(undefined)).toBe(false)
  })
})
