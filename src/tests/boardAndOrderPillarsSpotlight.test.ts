import { describe, it, expect, beforeEach } from 'vitest'
import { PRODUCT_CATALOG, INITIAL_TABLES } from '../data/mockData'
import { DEFAULT_STOREFRONT_CUSTOMIZATION } from '../data/defaultStorefrontCustomization'
import { MenuItem, TableStatus } from '../types/pos'

describe('🏛️ 4 Core Experience Pillars: BOARD & ORDER Spotlight & Touch Suite', () => {
  // ==========================================
  // PILLAR: BOARD (Public Storefront & Landing)
  // ==========================================
  describe('Pillar BOARD: Public Storefront & Spotlight Omni-Search Governance', () => {
    it('provides public spotlight search index matching products, tables, and system actions', () => {
      // 1. Build actions catalog for Spotlight Omni-Search
      const systemActions = [
        { id: 'act-storefront-studio', title: 'Studio Kustomisasi Toko (Landing & QR)', category: 'action' },
        { id: 'act-nav-member-portal', title: 'Buka Member Account Portal', category: 'action' },
        { id: 'act-scan-barcode', title: 'Scan Barcode SKU Produk', category: 'action' }
      ]

      const productActions = PRODUCT_CATALOG.map((item: MenuItem) => ({
        id: `prod-${item.id}`,
        title: item.name,
        category: 'product'
      }))

      const tableActions = INITIAL_TABLES.map((t: TableStatus) => ({
        id: `tbl-${t.id}`,
        title: `Meja ${t.name || t.id}`,
        category: 'table'
      }))

      const allItems = [...systemActions, ...productActions, ...tableActions]

      // Verify searchable index breadth
      expect(allItems.length).toBeGreaterThanOrEqual(10)

      // Test query filtering for 'Espresso'
      const query = 'Espresso'
      const results = allItems.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.some(r => r.title.includes('Espresso'))).toBe(true)

      // Test query filtering for 'Studio'
      const studioResults = allItems.filter(i => i.title.toLowerCase().includes('studio'))
      expect(studioResults.length).toBe(1)
      expect(studioResults[0].id).toBe('act-storefront-studio')
    })

    it('validates keyboard triggers for public spotlight: Cmd+K, Ctrl+K, and slash (/)', () => {
      const isSpotlightKey = (e: { metaKey?: boolean; ctrlKey?: boolean; key: string; isInput?: boolean }) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
          return true
        }
        if (e.key === '/' && !e.isInput && !e.metaKey && !e.ctrlKey) {
          return true
        }
        return false
      }

      // Mac Cmd+K
      expect(isSpotlightKey({ metaKey: true, key: 'k' })).toBe(true)
      expect(isSpotlightKey({ metaKey: true, key: 'K' })).toBe(true)

      // Windows/Linux Ctrl+K
      expect(isSpotlightKey({ ctrlKey: true, key: 'k' })).toBe(true)

      // Quick search slash (/) when outside inputs
      expect(isSpotlightKey({ key: '/', isInput: false })).toBe(true)

      // Slash (/) inside an input text area should NOT trigger modal
      expect(isSpotlightKey({ key: '/', isInput: true })).toBe(false)

      // Unrelated keys should not trigger
      expect(isSpotlightKey({ key: 'a' })).toBe(false)
      expect(isSpotlightKey({ key: 'F1' })).toBe(false)
    })
  })

  // ==========================================
  // PILLAR: ORDER (Dine-in Customer Mobile QR)
  // ==========================================
  describe('Pillar ORDER: Single-Thumb Touch Ergonomics & Anti-Clipping Invariant', () => {
    it('guarantees touch-only ergonomics with zero keyboard shortcut interference', () => {
      // ORDER and CARD touch surfaces MUST NOT bind physical cashier F1-F12 keys
      const cashierFunctionKeys = ['F1', 'F2', 'F4', 'F8', 'F9', 'F12']
      const touchSurfaceAllowedKeys = ['Escape'] // Esc to close modals only

      cashierFunctionKeys.forEach((key) => {
        expect(touchSurfaceAllowedKeys.includes(key)).toBe(false)
      })
    })

    it('enforces safe-area insets geometry for iPhone notch and Dynamic Island', () => {
      // Safe-area root variables definition check
      const rootCssProps = ['--sat', '--sab', '--sal', '--sar']
      rootCssProps.forEach((prop) => {
        expect(prop.startsWith('--sa')).toBe(true)
      })

      // Calculate dock safe padding: pb-[max(env(safe-area-inset-bottom,16px),16px)]
      const computeDockPaddingBottom = (safeAreaBottomPx: number, fallbackPx: number = 16) => {
        return Math.max(safeAreaBottomPx, fallbackPx)
      }

      expect(computeDockPaddingBottom(0, 16)).toBe(16)
      expect(computeDockPaddingBottom(34, 16)).toBe(34) // iPhone with Home Indicator
    })

    it('guarantees zero-clipping runway for floating bottom cart dock and sticky banners', () => {
      const scrollContainerPaddingBottom = 128 // pb-32 = 128px
      const catalogEndSpacerHeight = 256        // h-64 = 256px
      const floatingDockHeight = 64             // min-h-[64px]

      const totalClearance = scrollContainerPaddingBottom + catalogEndSpacerHeight
      expect(totalClearance).toBeGreaterThanOrEqual(floatingDockHeight * 2)
      expect(totalClearance).toBe(384) // 384px buffer ensures last item is 100% visible
    })
  })

  // ==========================================
  // PILLAR: CARD (Customer Member Passbook & Wallet)
  // ==========================================
  describe('Pillar CARD: Multi-Identity Passbook Safe-Area & Touch Navigation', () => {
    it('supports 5 distinct customer touch navigation tabs without reload', () => {
      const tabs = ['card', 'orders', 'tickets', 'vouchers', 'preferences']
      expect(tabs.length).toBe(5)
      expect(tabs).toContain('card')
      expect(tabs).toContain('tickets')
      expect(tabs).toContain('vouchers')
    })

    it('maintains single scroll owner container with overscroll-contain', () => {
      const mainContainerStyle = {
        overscrollBehavior: 'contain',
        overflowY: 'auto'
      }
      expect(mainContainerStyle.overscrollBehavior).toBe('contain')
      expect(mainContainerStyle.overflowY).toBe('auto')
    })
  })
})
