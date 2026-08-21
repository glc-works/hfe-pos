import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Native Component Gallery In-App Design System (L2-POS-Gallery)', () => {
  const galleryViewPath = path.resolve(__dirname, '../views/NativeComponentGalleryView.tsx')
  const appPath = path.resolve(__dirname, '../App.tsx')
  const merchantConfigPath = path.resolve(__dirname, '../context/MerchantConfigContext.tsx')

  it('declares and exports NativeComponentGalleryView cleanly under 500 lines', () => {
    const content = fs.readFileSync(galleryViewPath, 'utf-8')
    const lines = content.split('\n').length
    expect(lines).toBeLessThan(500)
    expect(content).toContain('export const NativeComponentGalleryView')
  })

  it('covers Tier 1 Tokens, Tier 2 Atoms, and Tier 3 Domain Widgets', () => {
    const content = fs.readFileSync(galleryViewPath, 'utf-8')
    expect(content).toContain('Tier 1: Design Tokens')
    expect(content).toContain('Tier 2: React Aria Atoms')
    expect(content).toContain('Tier 3: Domain Widgets')
    expect(content).toContain('PriceTag')
    expect(content).toContain('SegmentedControl')
    expect(content).toContain('ToggleSwitch')
    expect(content).toContain('ProductCard')
    expect(content).toContain('TableCard')
  })

  it('mounts gallery surface cleanly in App.tsx and MerchantConfigContext.tsx', () => {
    const appContent = fs.readFileSync(appPath, 'utf-8')
    const configContent = fs.readFileSync(merchantConfigPath, 'utf-8')
    expect(appContent).toContain('NativeComponentGalleryView')
    expect(appContent).toContain("activeStaffSurface === 'gallery'")
    expect(configContent).toContain("surfaceParam === 'gallery'")
  })
})
