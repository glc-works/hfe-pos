import { describe, it, expect } from 'vitest'
import { FIVE_CORE_APPS } from '../components/common/StaffAppDrawerModal'

describe('App Drawer Launchpad Grid Navigation (L2-POS-35 & L2-POS-36)', () => {
  it('should contain 5 consolidated core apps', () => {
    expect(FIVE_CORE_APPS.length).toBe(5)

    const appNames = FIVE_CORE_APPS.map((c) => c.name)
    expect(appNames).toContain('Kasir POS (Commerce Hub)')
    expect(appNames).toContain('Dapur & Expediter (KDS Workstation)')
    expect(appNames).toContain('📈 HFE Real-Time Insights & Analitik')
    expect(appNames).toContain('Gudang, Inventori & Multi-Cabang')
    expect(appNames).toContain('Pengaturan Toko & Tim (Management)')
  })

  it('should include core workstation IDs in the app launcher', () => {
    const allAppIds = FIVE_CORE_APPS.map((a) => a.id)
    expect(allAppIds).toContain('barista-pos')
    expect(allAppIds).toContain('kds-screen')
    expect(allAppIds).toContain('hfe-insights')
    expect(allAppIds).toContain('warehouse-mgmt')
    expect(allAppIds).toContain('cafe-config')
  })

  it('should have valid metadata, icons, and colors for all app tiles', () => {
    FIVE_CORE_APPS.forEach((app) => {
      expect(app.name).toBeDefined()
      expect(app.subtitle).toBeDefined()
      expect(app.color).toMatch(/from-/)
    })
  })
})
