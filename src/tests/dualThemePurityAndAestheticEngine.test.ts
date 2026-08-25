import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Dual-Theme Purity & Aesthetic Engine (Anti-Belang Standard)', () => {
  const rootDir = path.resolve(__dirname, '../..')

  it('should define foundational semantic tokens for .light and .dark in index.css', () => {
    const cssPath = path.join(rootDir, 'src/index.css')
    const cssContent = fs.readFileSync(cssPath, 'utf8')

    expect(cssContent).toContain('.light {')
    expect(cssContent).toContain('.dark {')
    expect(cssContent).toContain('--bg-canvas')
    expect(cssContent).toContain('--bg-surface')
    expect(cssContent).toContain('--text-primary')
    expect(cssContent).toContain('--border-subtle')
    expect(cssContent).toContain('.frosted-glass')
    expect(cssContent).toContain('.tactile-press')
  })

  it('should verify Tier 2 Atoms (button, card, badge) have dual-theme classes', () => {
    const buttonPath = path.join(rootDir, 'src/components/ui/button.tsx')
    const cardPath = path.join(rootDir, 'src/components/ui/card.tsx')
    const badgePath = path.join(rootDir, 'src/components/ui/badge.tsx')

    const buttonContent = fs.readFileSync(buttonPath, 'utf8')
    const cardContent = fs.readFileSync(cardPath, 'utf8')
    const badgeContent = fs.readFileSync(badgePath, 'utf8')

    // Button should support tactile press and dual-theme outline
    expect(buttonContent).toContain('active:scale-[0.97]')
    expect(buttonContent).toContain('dark:border-slate-800')

    // Card should use dual-theme surface
    expect(cardContent).toContain('bg-white dark:bg-slate-900')
    expect(cardContent).toContain('border-slate-200')

    // Badge should support high-contrast light mode variants
    expect(badgeContent).toContain('text-amber-800 dark:text-amber-300')
    expect(badgeContent).toContain('text-emerald-800 dark:text-emerald-300')
    expect(badgeContent).toContain('text-indigo-800 dark:text-indigo-300')
  })

  it('should verify Tier 3 & 4 Widgets in POS and Tables do not have un-prefixed dark container backgrounds', () => {
    const componentsToCheck = [
      'src/components/shared/TableCard.tsx',
      'src/components/pos/RoomChargeModal.tsx',
      'src/components/pos/ReceiptModal.tsx',
      'src/components/tables/TableDetailDrawer.tsx',
      'src/components/tables/TableGuestBindingDrawer.tsx',
      'src/components/customer-portal/CustomerOrdersHistoryTab.tsx',
      'src/components/customer-portal/CustomerPreferencesTab.tsx',
      'src/components/customer/TableSessionDrawer.tsx',
      'src/components/book/BiologicalAssetRegistry.tsx',
      'src/components/book/JournalEntryTable.tsx',
      'src/components/tables/TableLiveStatusDrawer.tsx',
    ]

    componentsToCheck.forEach((relPath) => {
      const filePath = path.join(rootDir, relPath)
      expect(fs.existsSync(filePath), `File ${relPath} should exist`).toBe(true)
      const content = fs.readFileSync(filePath, 'utf8')

      // Must support light & dark backgrounds
      expect(content).toMatch(/bg-white\s+dark:bg-|bg-slate-50\s+dark:bg-|bg-slate-100\s+dark:bg-/)
    })
  })
})
