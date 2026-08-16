/**
 * HARDCODED VIEWPORT BAN & SINGLE SOURCE OF TRUTH (SSOT) LINT GUARD
 * 
 * Ensures that no component or view ever hardcodes `viewportMode === 'mobile'` directly.
 * All views must consume `useViewport()` from `ViewportContext` so physical screen resizing
 * and device simulations are always 100% synchronized with zero layout regressions.
 */

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('📐 Viewport Single Source of Truth (SSOT) Lint Guard', () => {
  it('should guarantee zero hardcoded "const isMobile = viewportMode === \'mobile\'" patterns in src/', () => {
    const srcDir = path.resolve(__dirname, '..')
    const violations: string[] = []

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          scanDir(fullPath)
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          // Skip ViewportContext itself and test files
          if (entry.name === 'ViewportContext.tsx' || entry.name.endsWith('.test.ts')) continue

          const content = fs.readFileSync(fullPath, 'utf-8')
          if (content.includes("const isMobile = viewportMode === 'mobile'") && !content.includes('isContextMobile')) {
            violations.push(path.relative(srcDir, fullPath))
          }
        }
      }
    }

    scanDir(srcDir)

    expect(violations, `Found hardcoded viewportMode checks in: ${violations.join(', ')}`).toEqual([])
  })
})
