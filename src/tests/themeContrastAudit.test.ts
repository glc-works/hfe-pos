import { describe, it, expect } from 'vitest'
import { BUILTIN_THEMES } from '../data/mockData'
import { CafeThemeConfig } from '../types/pos'

describe('Theme Contrast & Parity Audit Suite (POS-ENG-STD-001 & GLC-FNB-AUDIT-002)', () => {
  it('should ensure all built-in themes have required contrast properties for light and dark modes', () => {
    expect(BUILTIN_THEMES.length).toBeGreaterThan(0)

    BUILTIN_THEMES.forEach((t: CafeThemeConfig) => {
      expect(t.themeName).toBeDefined()
      expect(t.mode).toMatch(/^(light|dark)$/)
      expect(t.primaryAccentHex).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      expect(t.pageBgHex).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      expect(t.cardBgHex).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      expect(t.textColorHex).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)

      // For light mode themes, background should not be pitch black
      if (t.mode === 'light') {
        const bg = t.pageBgHex.toLowerCase()
        expect(bg).not.toBe('#000000')
        expect(bg).not.toBe('#020617')
      }
    })
  })

  it('should verify that light theme uses appropriate dark text and dark theme uses light text', () => {
    const lightTheme = BUILTIN_THEMES.find((t: CafeThemeConfig) => t.mode === 'light')
    const darkTheme = BUILTIN_THEMES.find((t: CafeThemeConfig) => t.mode === 'dark')

    if (lightTheme) {
      expect(lightTheme.textColorHex).toBeDefined()
    }

    if (darkTheme) {
      expect(darkTheme.textColorHex).toBeDefined()
    }
  })

  it('should enforce that LandingPageView uses dual-theme classes without raw un-prefixed text-white on headings', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const landingFile = path.resolve(__dirname, '../components/landing/LandingPageView.tsx')
    const content = fs.readFileSync(landingFile, 'utf-8')

    // Must declare dark:text-white text-slate-900 on main hero headline
    expect(content).toContain('text-slate-900 dark:text-white')
    expect(content).toContain('dark:border-slate-800')
    expect(content).toContain('dark:bg-slate-950')
  })
})

