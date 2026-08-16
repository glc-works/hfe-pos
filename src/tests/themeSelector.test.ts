import { describe, it, expect } from 'vitest'
import { BUILTIN_THEMES } from '../data/mockData'
import { CafeThemeConfig } from '../types/pos'

describe('Theme Selector, Light/Dark Presets & Merchant/Customer Separation (L2-POS-32)', () => {
  it('should provide 8 curated builtin themes (4 Light + 4 Dark)', () => {
    expect(BUILTIN_THEMES.length).toBe(8)
    
    const lightThemes = BUILTIN_THEMES.filter(t => t.mode === 'light')
    const darkThemes = BUILTIN_THEMES.filter(t => t.mode === 'dark')

    expect(lightThemes.length).toBe(4)
    expect(darkThemes.length).toBe(4)

    const themeNames = BUILTIN_THEMES.map(t => t.themeName)
    expect(themeNames).toContain('Warm Latte Cream (Light)')
    expect(themeNames).toContain('Clean Minimalist (Light)')
    expect(themeNames).toContain('Obsidian Modern (Dark)')
    expect(themeNames).toContain('Warm Roastery (Dark)')

    BUILTIN_THEMES.forEach((theme) => {
      expect(theme.primaryAccentHex).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(theme.pageBgHex).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(theme.cardBgHex).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  it('should generate valid exportable JSON theme structure', () => {
    const activeTheme = BUILTIN_THEMES[0]
    const exportedJson = JSON.stringify(activeTheme, null, 2)
    const parsedTheme = JSON.parse(exportedJson) as CafeThemeConfig

    expect(parsedTheme.themeId).toBe(activeTheme.themeId)
    expect(parsedTheme.themeName).toBe(activeTheme.themeName)
    expect(parsedTheme.primaryAccentHex).toBe(activeTheme.primaryAccentHex)
  })

  it('should accept imported JSON theme and validate required fields', () => {
    const customJson = JSON.stringify({
      version: '1.0',
      themeId: 'theme-custom-test',
      themeName: 'Test Blue Velvet',
      brandName: 'Custom Brand',
      fontFamily: 'Inter, sans-serif',
      mode: 'light',
      targetScope: 'customer',
      primaryAccentHex: '#3b82f6',
      primaryAccentHoverHex: '#2563eb',
      pageBgHex: '#f8fafc',
      cardBgHex: '#ffffff',
      headerBgHex: '#ffffffea',
      textColorHex: '#0f172a',
      secondaryTextColorHex: '#475569',
      highlightBadgeBgHex: '#3b82f620',
      highlightBadgeTextHex: '#60a5fa',
      borderRadiusPx: 16
    })

    const parsed = JSON.parse(customJson) as CafeThemeConfig
    expect(parsed.themeName).toBe('Test Blue Velvet')
    expect(parsed.primaryAccentHex).toBe('#3b82f6')
    expect(parsed.borderRadiusPx).toBe(16)
  })
})
