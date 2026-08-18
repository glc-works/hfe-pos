// --- HFE PLATFORM THEME CONTEXT (TIER 1 / LAYER 2) ---
// Neutral Platform Appearance Engine (Light / Dark Mode SSOT)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  themeMode: ThemeMode
  effectiveTheme: 'light' | 'dark'
  setThemeMode: (mode: ThemeMode) => void
  toggleThemeMode: () => void
}

export const THEME_STORAGE_KEY = 'hfe_theme_mode'

/**
 * Pure theme resolver: resolves effective theme ('light' or 'dark') given mode and system preference.
 */
export function resolveEffectiveTheme(mode: ThemeMode, systemPrefersDark: boolean): 'light' | 'dark' {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light'
  }
  return mode
}

/**
 * Pure DOM synchronizer: applies .light or .dark classes to DOM elements.
 */
export function syncThemeDOM(
  effectiveTheme: 'light' | 'dark',
  rootElement?: HTMLElement | null,
  bodyElement?: HTMLElement | null
) {
  const root = rootElement || (typeof document !== 'undefined' ? document.documentElement : null)
  const body = bodyElement || (typeof document !== 'undefined' ? document.body : null)

  if (!root) return

  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
    if (body) {
      body.classList.add('dark')
      body.classList.remove('light')
    }
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
    if (body) {
      body.classList.add('light')
      body.classList.remove('dark')
    }
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved
      }
    } catch {}
    return 'dark'
  })

  // Determine system theme preference
  const isSystemDark = (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    return false
  }

  const effectiveTheme = resolveEffectiveTheme(themeMode, isSystemDark())

  // Synchronize DOM classes with effective theme
  useEffect(() => {
    syncThemeDOM(effectiveTheme)
  }, [effectiveTheme])

  // Listen for OS system theme changes when mode is 'system'
  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setThemeModeState('system')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {}
  }

  const toggleThemeMode = () => {
    const nextMode: ThemeMode = effectiveTheme === 'dark' ? 'light' : 'dark'
    setThemeMode(nextMode)
  }

  return (
    <ThemeContext.Provider value={{ themeMode, effectiveTheme, setThemeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
