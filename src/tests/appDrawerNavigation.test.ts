import { describe, it, expect } from 'vitest'
import { FIVE_CORE_APPS } from '../components/common/StaffAppDrawerModal'

describe('App Drawer Launchpad Grid Navigation (L2-POS-35 & L2-POS-36)', () => {
  it('should contain consolidated core apps including connect hub and admin mode', () => {
    expect(FIVE_CORE_APPS.length).toBe(9)

    const appNames = FIVE_CORE_APPS.map((c) => c.name)
    expect(appNames).toContain('POS.Hfeit (Commerce Workstation)')
    expect(appNames).toContain('Dapur & Expediter (KDS Workstation)')
    expect(appNames).toContain('📈 HFE Real-Time Insights & Analitik')
    expect(appNames).toContain('📚 BOOK.Hfeit (Financial Ledger)')
    expect(appNames).toContain('🧩 CORE.Hfeit Connect Hub')
    expect(appNames).toContain('Gudang, Inventori & Multi-Cabang')
    expect(appNames).toContain('Pengaturan Toko & Tim (Management)')
    expect(appNames).toContain('🛡️ Mode Admin (Merchant & User Hub)')
    expect(appNames).toContain('🏠 Merchant Home / Hub (Pusat Bisnis)')
  })

  it('should include core workstation IDs in the app launcher', () => {
    const allAppIds = FIVE_CORE_APPS.map((a) => a.id)
    expect(allAppIds).toContain('barista-pos')
    expect(allAppIds).toContain('kds-screen')
    expect(allAppIds).toContain('hfe-insights')
    expect(allAppIds).toContain('hfe-company-book')
    expect(allAppIds).toContain('hfe-connect-hub')
    expect(allAppIds).toContain('warehouse-mgmt')
    expect(allAppIds).toContain('cafe-config')
    expect(allAppIds).toContain('admin-hub')
    expect(allAppIds).toContain('merchant-hub')
  })

  it('should have valid metadata, icons, and colors for all app tiles', () => {
    FIVE_CORE_APPS.forEach((app) => {
      expect(app.name).toBeDefined()
      expect(app.subtitle).toBeDefined()
      expect(app.color).toMatch(/from-/)
    })
  })
})

