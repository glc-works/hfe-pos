import { describe, it, expect } from 'vitest'
import { FIVE_CORE_APPS } from '../components/common/StaffAppDrawerModal'

describe('5 Core Apps Consolidation & Modular Features Suite (L2-POS-36)', () => {
  it('should consolidate the system into exactly 5 cohesive Core Workstation Apps', () => {
    expect(FIVE_CORE_APPS.length).toBe(5)

    const appIds = FIVE_CORE_APPS.map((a) => a.id)
    expect(appIds).toContain('barista-pos')
    expect(appIds).toContain('kds-screen')
    expect(appIds).toContain('hfe-insights')
    expect(appIds).toContain('warehouse-mgmt')
    expect(appIds).toContain('cafe-config')
  })

  it('should embed modular features inside each core app', () => {
    const posApp = FIVE_CORE_APPS.find((a) => a.id === 'barista-pos')
    expect(posApp).toBeDefined()
    expect(posApp?.features).toContain('Peta Meja & Dine-In')
    expect(posApp?.features).toContain('Barcode Scanner Retail')

    const kdsApp = FIVE_CORE_APPS.find((a) => a.id === 'kds-screen')
    expect(kdsApp).toBeDefined()
    expect(kdsApp?.features).toContain('Kitchen Kanban')
    expect(kdsApp?.features).toContain('Chef Course Firing')
    expect(kdsApp?.features).toContain('Checker QC Expediter')

    const insightsApp = FIVE_CORE_APPS.find((a) => a.id === 'hfe-insights')
    expect(insightsApp).toBeDefined()
    expect(insightsApp?.features).toContain('Demand Rush Forecast')
    expect(insightsApp?.features).toContain('Low-Stock Auto-PO')

    const warehouseApp = FIVE_CORE_APPS.find((a) => a.id === 'warehouse-mgmt')
    expect(warehouseApp).toBeDefined()
    expect(warehouseApp?.features).toContain('Stok Bahan Baku BOM')
    expect(warehouseApp?.features).toContain('Dimensional Multi-Outlet')
  })

  it('should have valid metadata, gradients, and badges for all 5 core apps', () => {
    FIVE_CORE_APPS.forEach((app) => {
      expect(app.name).toBeDefined()
      expect(app.subtitle).toBeDefined()
      expect(app.color).toMatch(/from-/)
      expect(app.features.length).toBeGreaterThanOrEqual(4)
    })
  })
})
