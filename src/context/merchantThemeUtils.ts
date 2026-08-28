import { CafeThemeConfig } from '../types/pos'
import { BUILTIN_THEMES } from '../data/mockData'

export type ThemeModeType = 'light' | 'dark' | 'system'

export function resolveThemeForMode(
  mode: ThemeModeType,
  storedJson: string | null,
  isMerchant = false
): CafeThemeConfig {
  const isDark = mode === 'dark'
  if (storedJson) {
    try {
      const parsed = JSON.parse(storedJson) as CafeThemeConfig
      if (isDark && parsed.mode === 'dark') return parsed
      if (!isDark && parsed.mode === 'light') return parsed
    } catch {}
  }
  if (isMerchant) {
    return isDark ? (BUILTIN_THEMES[4] || BUILTIN_THEMES[0]) : BUILTIN_THEMES[0]
  }
  return isDark ? (BUILTIN_THEMES[4] || BUILTIN_THEMES[0]) : BUILTIN_THEMES[0]
}

export function applyThemeToDocument(mode: ThemeModeType): void {
  let isDark = mode === 'dark'
  if (mode === 'system') {
    isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const root = document.documentElement
  const body = document.body
  if (isDark) {
    root.classList.add('dark')
    root.classList.remove('light')
    body?.classList.add('dark')
    body?.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
    body?.classList.add('light')
    body?.classList.remove('dark')
  }
}
