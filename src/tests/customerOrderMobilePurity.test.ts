import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Customer Mobile QR View & Standards Compliance (HFE-UI-STD-001 Pillar VI)', () => {
  const customerMobileViewPath = path.resolve(__dirname, '../views/CustomerMobileView.tsx')
  const customerHeaderPath = path.resolve(__dirname, '../components/customer/CustomerHeader.tsx')
  const customerCatalogPath = path.resolve(__dirname, '../components/customer/CustomerCatalogView.tsx')
  const customerCheckoutPath = path.resolve(__dirname, '../components/customer/CustomerCheckoutView.tsx')

  it('enforces pb-36 bottom clearance in CustomerMobileView for zero floating cart collision', () => {
    const content = fs.readFileSync(customerMobileViewPath, 'utf-8')
    expect(content).toContain('pb-36')
    expect(content).toContain('overflow-y-auto')
  })

  it('enforces flat bottom header structure in CustomerHeader without disruptive drop shadows', () => {
    const content = fs.readFileSync(customerHeaderPath, 'utf-8')
    expect(content).toContain('border-b')
    expect(content).not.toContain('boxShadow: isLight')
  })

  it('enforces high-contrast search input in CustomerCatalogView', () => {
    const content = fs.readFileSync(customerCatalogPath, 'utf-8')
    expect(content).toContain('bg-white dark:bg-slate-900')
    expect(content).toContain('border-slate-200 dark:border-slate-800')
  })

  it('enforces Tier 2 Button atom adoption in CustomerCheckoutView', () => {
    const content = fs.readFileSync(customerCheckoutPath, 'utf-8')
    expect(content).toContain("import { Button } from '../../ui/Button'")
    expect(content).toContain('<Button')
  })

  it('guarantees modularity under 500 lines for all customer components', () => {
    const files = [customerMobileViewPath, customerHeaderPath, customerCatalogPath, customerCheckoutPath]
    for (const f of files) {
      const lines = fs.readFileSync(f, 'utf-8').split('\n').length
      expect(lines).toBeLessThan(500)
    }
  })
})
