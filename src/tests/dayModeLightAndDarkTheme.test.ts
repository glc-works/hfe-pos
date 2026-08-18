import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  resolveEffectiveTheme,
  syncThemeDOM,
  THEME_STORAGE_KEY,
} from '../context/ThemeContext'

// Lightweight DOM mock for Node.js test environment
class MockDOMElement {
  classList = {
    classes: new Set<string>(),
    add: (c: string) => { this.classList.classes.add(c) },
    remove: (c: string) => { this.classList.classes.delete(c) },
    contains: (c: string) => this.classList.classes.has(c),
  }
  constructor(initialClass = '') {
    if (initialClass) {
      initialClass.split(' ').forEach(c => this.classList.classes.add(c))
    }
  }
}

describe('Production Behavioral Suite: ThemeProvider & Layer-1 Semantic Theme Engine (L2-POS-85)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. Pure Theme Mode Resolution & OS Sync', () => {
    it('resolves explicit light and dark modes regardless of OS preference', () => {
      expect(resolveEffectiveTheme('light', true)).toBe('light')
      expect(resolveEffectiveTheme('light', false)).toBe('light')
      expect(resolveEffectiveTheme('dark', true)).toBe('dark')
      expect(resolveEffectiveTheme('dark', false)).toBe('dark')
    })

    it('resolves system mode based on OS preference', () => {
      expect(resolveEffectiveTheme('system', true)).toBe('dark')
      expect(resolveEffectiveTheme('system', false)).toBe('light')
    })
  })

  describe('2. Pure DOM Class Synchronizer (Anti-Leak)', () => {
    it('applies dark class and removes light class from root and body', () => {
      const mockRoot = new MockDOMElement('light some-other-class') as any
      const mockBody = new MockDOMElement('light') as any

      syncThemeDOM('dark', mockRoot, mockBody)

      expect(mockRoot.classList.contains('dark')).toBe(true)
      expect(mockRoot.classList.contains('light')).toBe(false)
      expect(mockRoot.classList.contains('some-other-class')).toBe(true)
      expect(mockBody.classList.contains('dark')).toBe(true)
      expect(mockBody.classList.contains('light')).toBe(false)
    })

    it('applies light class (Day Mode) and removes dark class from root and body', () => {
      const mockRoot = new MockDOMElement('dark') as any
      const mockBody = new MockDOMElement('dark') as any

      syncThemeDOM('light', mockRoot, mockBody)

      expect(mockRoot.classList.contains('light')).toBe(true)
      expect(mockRoot.classList.contains('dark')).toBe(false)
      expect(mockBody.classList.contains('light')).toBe(true)
      expect(mockBody.classList.contains('dark')).toBe(false)
    })
  })

  describe('3. Local Storage Persistence & Key Governance', () => {
    it('uses canonical storage key hfe_theme_mode', () => {
      expect(THEME_STORAGE_KEY).toBe('hfe_theme_mode')
    })
  })
})
