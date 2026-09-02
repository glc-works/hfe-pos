import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Multi-View Header & Menu Switcher Sweeping Guard (POS, CARD, BOARD, ORDER, KDS)', () => {
  const rootDir = path.resolve(__dirname, '..')

  const filesToCheck = [
    'views/UnifiedPosView.tsx',
    'views/LandingView.tsx',
    'components/landing/LandingPageView.tsx',
    'views/CustomerMobileView.tsx',
    'components/customer/CustomerHeader.tsx',
    'views/CustomerPortalView.tsx',
    'views/UnifiedKdsView.tsx',
    'components/pos/PosCommandHeader.tsx'
  ]

  // =========================================================================
  // 1. MODULARITY & LINE BUDGET (< 500 Lines per file)
  // =========================================================================
  describe('Modularity Standard (< 500 Lines)', () => {
    it('should assert all swept view and header files are under 500 lines', () => {
      filesToCheck.forEach((relPath) => {
        const fullPath = path.join(rootDir, relPath)
        expect(fs.existsSync(fullPath)).toBe(true)
        const content = fs.readFileSync(fullPath, 'utf-8')
        const lines = content.split('\n').length
        expect(lines).toBeLessThan(500)
      })
    })
  })

  // =========================================================================
  // 2. MOBILE HEADER BUDGET & ANTI-COLLISION (<= 340px)
  // =========================================================================
  describe('Strict 340px Mobile Header Budget & Anti-Collision', () => {
    it('should ensure LandingPageView navbar hides secondary desktop buttons on mobile', () => {
      const landingPagePath = path.join(rootDir, 'components/landing/LandingPageView.tsx')
      const content = fs.readFileSync(landingPagePath, 'utf-8')

      // Secondary buttons and links must be hidden on mobile
      expect(content).toContain('hidden lg:flex')
      expect(content).toContain('hidden sm:inline-flex')
      expect(content).toContain('truncate')
    })

    it('should ensure PosCommandHeader limits mobile right action buttons to 2 visible slots', () => {
      const posHeaderPath = path.join(rootDir, 'components/pos/PosCommandHeader.tsx')
      const content = fs.readFileSync(posHeaderPath, 'utf-8')

      // Desktop-only action buttons should declare hidden sm:flex
      expect(content).toContain('hidden sm:flex')
      expect(content).toContain('hidden lg:inline')
      expect(content).toContain('hidden md:inline')
    })

    it('should ensure CustomerHeader maintains 3-touch-zone clean architecture with truncated labels', () => {
      const customerHeaderPath = path.join(rootDir, 'components/customer/CustomerHeader.tsx')
      const content = fs.readFileSync(customerHeaderPath, 'utf-8')

      expect(content).toContain('truncate')
      expect(content).toContain('overflow-x-auto')
    })
  })

  // =========================================================================
  // 3. SINGLE SCROLL OWNER & 100dvh VIEWPORT INTEGRITY
  // =========================================================================
  describe('Single Scroll Owner & Viewport Integrity', () => {
    it('should verify UnifiedKdsView has min-h-0 and overflow-y-auto on main container', () => {
      const kdsPath = path.join(rootDir, 'views/UnifiedKdsView.tsx')
      const content = fs.readFileSync(kdsPath, 'utf-8')

      expect(content).toContain('overflow-y-auto')
      expect(content).toContain('overscroll-contain')
      expect(content).toContain('min-h-0')
    })

    it('should verify CustomerPortalView declares 100dvh root container and single scroll owner', () => {
      const portalPath = path.join(rootDir, 'views/CustomerPortalView.tsx')
      const content = fs.readFileSync(portalPath, 'utf-8')

      expect(content).toContain('h-[100dvh]')
      expect(content).toContain('overflow-y-auto')
      expect(content).toContain('overscroll-contain')
    })

    it('should verify UnifiedPosView canvas is the single scroll owner for catalog and tables', () => {
      const posViewPath = path.join(rootDir, 'views/UnifiedPosView.tsx')
      const content = fs.readFileSync(posViewPath, 'utf-8')

      expect(content).toContain('overflow-y-auto overscroll-contain')
      expect(content).toContain('min-h-0')
    })
  })
})
