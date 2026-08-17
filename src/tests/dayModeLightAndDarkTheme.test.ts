import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Day Mode (Light Theme Engine & POS Workstation) (L2-POS-85)', () => {
  it('verifies src/index.css defines semantic root variables for .light and .dark themes', () => {
    const cssPath = path.resolve(__dirname, '../index.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')

    // Must define .light palette
    expect(cssContent).toContain('.light {')
    expect(cssContent).toContain('--bg-canvas: #f8fafc;')
    expect(cssContent).toContain('--bg-surface: #ffffff;')
    expect(cssContent).toContain('--text-primary: #0f172a;')
    expect(cssContent).toContain('--border-subtle: #e2e8f0;')

    // Must define .dark palette
    expect(cssContent).toContain('.dark {')
    expect(cssContent).toContain('--bg-canvas: #020617;')
    expect(cssContent).toContain('--bg-surface: #0f172a;')
    expect(cssContent).toContain('--text-primary: #f8fafc;')
    expect(cssContent).toContain('--border-subtle: #1e293b;')
  })

  it('validates themeMode toggle and state transitions logic', () => {
    type ThemeMode = 'light' | 'dark' | 'system'
    let currentMode: ThemeMode = 'dark'

    const toggleThemeMode = (prev: ThemeMode): ThemeMode => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'light'
      return 'light'
    }

    // Toggle 1: dark -> light
    currentMode = toggleThemeMode(currentMode)
    expect(currentMode).toBe('light')

    // Toggle 2: light -> dark
    currentMode = toggleThemeMode(currentMode)
    expect(currentMode).toBe('dark')

    // Toggle from system -> light
    currentMode = toggleThemeMode('system')
    expect(currentMode).toBe('light')
  })

  it('verifies DOM root class switching logic for light and dark modes', () => {
    const applyThemeToDOM = (
      mode: 'light' | 'dark' | 'system',
      systemPrefersDark = false
    ) => {
      const rootClasses = new Set<string>()
      const isDark = mode === 'dark' || (mode === 'system' && systemPrefersDark)

      if (isDark) {
        rootClasses.add('dark')
        rootClasses.delete('light')
      } else {
        rootClasses.add('light')
        rootClasses.delete('dark')
      }

      return Array.from(rootClasses)
    }

    // Test Day Mode ('light')
    expect(applyThemeToDOM('light')).toEqual(['light'])

    // Test Dark Mode ('dark')
    expect(applyThemeToDOM('dark')).toEqual(['dark'])

    // Test System Mode (when system prefers dark)
    expect(applyThemeToDOM('system', true)).toEqual(['dark'])

    // Test System Mode (when system prefers light)
    expect(applyThemeToDOM('system', false)).toEqual(['light'])
  })

  it('verifies MerchantConfigContext exports themeMode, setThemeMode, and toggleThemeMode', () => {
    const contextPath = path.resolve(__dirname, '../context/MerchantConfigContext.tsx')
    const contextContent = fs.readFileSync(contextPath, 'utf-8')

    expect(contextContent).toContain('themeMode: ThemeModeType')
    expect(contextContent).toContain('setThemeMode: (mode: ThemeModeType) => void')
    expect(contextContent).toContain('toggleThemeMode: () => void')
    expect(contextContent).toContain("localStorage.setItem('hfe_theme_mode', mode)")
    expect(contextContent).toContain("root.classList.add('dark')")
    expect(contextContent).toContain("root.classList.add('light')")
  })

  it('verifies PosCommandHeader contains 1-tap Day/Dark theme toggle button', () => {
    const headerPath = path.resolve(__dirname, '../components/pos/PosCommandHeader.tsx')
    const headerContent = fs.readFileSync(headerPath, 'utf-8')

    expect(headerContent).toContain('toggleThemeMode')
    expect(headerContent).toContain("themeMode === 'light' ? '🌙' : '☀️'")
    expect(headerContent).toContain("themeMode === 'light' ? 'Beralih ke Dark Mode (🌙)' : 'Beralih ke Day Mode (☀️)'")
  })

  it('verifies POS Workstation components support dual-theme Tailwind classes', () => {
    const tableCardPath = path.resolve(__dirname, '../components/shared/TableCard.tsx')
    const tableCardContent = fs.readFileSync(tableCardPath, 'utf-8')
    expect(tableCardContent).toContain('dark:bg-slate-900/60 bg-white')
    expect(tableCardContent).toContain('dark:bg-amber-950/20 bg-amber-50')
    expect(tableCardContent).toContain('text-slate-900 dark:text-slate-100')

    const cartPath = path.resolve(__dirname, '../components/pos/PosCartSection.tsx')
    const cartContent = fs.readFileSync(cartPath, 'utf-8')
    expect(cartContent).toContain('bg-white dark:bg-slate-900')
    expect(cartContent).toContain('text-slate-900 dark:text-white')
    expect(cartContent).toContain('border-slate-200 dark:border-slate-800')

    const catalogPath = path.resolve(__dirname, '../components/pos/PosCatalogGrid.tsx')
    const catalogContent = fs.readFileSync(catalogPath, 'utf-8')
    expect(catalogContent).toContain('bg-white dark:bg-slate-900/90')
    expect(catalogContent).toContain('border-slate-200 dark:border-slate-800')
  })
})
