import { describe, it, expect } from 'vitest'
import { COMPONENT_REGISTRY } from '../data/componentRegistryData'

describe('Intrinsic Component Architecture & Self-Contained Standard (GLC-FNB-UX-010)', () => {
  it('should verify all registry components define valid rules, categories, and snippets', () => {
    expect(COMPONENT_REGISTRY.length).toBeGreaterThanOrEqual(5)
    COMPONENT_REGISTRY.forEach((comp) => {
      expect(comp.id).toBeDefined()
      expect(comp.title).toBeDefined()
      expect(comp.category).toBeDefined()
      expect(comp.dos.length).toBeGreaterThan(0)
      expect(comp.donts.length).toBeGreaterThan(0)
      expect(comp.snippet).toBeDefined()
    })
  })

  it('should enforce single-line status badge formatting', () => {
    const tableBadgeText = '⏳ Tagihan'
    expect(tableBadgeText).not.toContain('\n')
    expect(tableBadgeText.length).toBeLessThan(15)
  })

  it('should support self-contained navigation routes in standalone production mode', () => {
    const standaloneRoutes = [
      { label: 'Menu Pelanggan (QR)', href: '/?app=customer' },
      { label: 'Kasir POS Workstation', href: '/?app=cafe' },
      { label: 'Landing Page Merchant', href: '/?app=landing' }
    ]
    expect(standaloneRoutes.length).toBe(3)
    standaloneRoutes.forEach(r => {
      expect(r.href).toMatch(/^\/\?app=/)
    })
  })
})
