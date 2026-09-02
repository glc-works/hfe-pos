import { describe, it, expect } from 'vitest'
import { MARKETPLACE_THEMES } from '../data/marketplaceThemesData'
import { CONCEPT_THEME_TEMPLATES } from '../data/defaultStorefrontCustomization'

describe('Theme Customization, Vault & Marketplace Suite (L2-POS-42)', () => {
  it('should verify marketplace themes have valid shadcn tokens, ratings and categories', () => {
    expect(MARKETPLACE_THEMES.length).toBeGreaterThanOrEqual(5)
    MARKETPLACE_THEMES.forEach((item) => {
      expect(item.id).toBeDefined()
      expect(item.title).toBeDefined()
      expect(item.creator).toBeDefined()
      expect(item.rating).toBeGreaterThanOrEqual(4.0)
      expect(item.theme.primaryAccentHex).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(item.theme.pageBgHex).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(item.theme.cardBgHex).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  it('should verify curated concept theme templates for storefront studio', () => {
    expect(CONCEPT_THEME_TEMPLATES.length).toBeGreaterThanOrEqual(4)
    CONCEPT_THEME_TEMPLATES.forEach((tmpl) => {
      expect(tmpl.id).toBeDefined()
      expect(tmpl.name).toBeDefined()
      expect(tmpl.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(['light', 'dark']).toContain(tmpl.mode)
      expect(tmpl.bannerUrl).toContain('https://')
      expect(tmpl.icon).toBeDefined()
    })
  })

  it('should generate valid shadcn CSS variables format', () => {
    const sampleTheme = MARKETPLACE_THEMES[0].theme
    const css = `:root {
  --background: ${sampleTheme.pageBgHex};
  --card: ${sampleTheme.cardBgHex};
  --primary: ${sampleTheme.primaryAccentHex};
  --foreground: ${sampleTheme.textColorHex};
}`

    expect(css).toContain('--background: #062016')
    expect(css).toContain('--primary: #10b981')
    expect(css).toContain('--card: #0c2e22')
  })
})
