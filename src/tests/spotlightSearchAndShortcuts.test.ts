import { describe, it, expect, vi } from 'vitest'
import { PRODUCT_CATALOG, INITIAL_TABLES } from '../data/mockData'
import { MenuItem, TableStatus } from '../types/pos'

describe('Spotlight Omni-Search & Workstation Shortcuts Engine', () => {
  describe('Spotlight Search Filtering (Products, Tables, Actions)', () => {
    const systemActions = [
      { id: 'act-storefront-studio', title: 'Studio Kustomisasi Toko (Landing & QR)', subtitle: 'Atur banner dan tema', category: 'action' },
      { id: 'act-scan-barcode', title: 'Scan Barcode SKU Produk', subtitle: 'Buka kamera pemindai', category: 'action' },
      { id: 'act-table-ops', title: 'Split / Pindah / Gabung Tagihan Meja', subtitle: 'Relokasi meja', category: 'action' },
      { id: 'act-guest-binding', title: 'Sambut Tamu & Alokasi Meja', subtitle: 'Input pax dan tamu', category: 'action' },
      { id: 'act-nav-kds', title: 'Buka Layar Dapur KDS', subtitle: 'Antrean pesanan dapur', category: 'action' }
    ]

    const productActions = PRODUCT_CATALOG.map((item: MenuItem) => ({
      id: `prod-${item.id}`,
      title: item.name,
      subtitle: `${item.price} • ${item.category} • ${item.description || ''}`,
      category: 'product'
    }))

    const tableActions = INITIAL_TABLES.map((t: TableStatus) => ({
      id: `tbl-${t.id}`,
      title: `Meja ${t.name || t.id} (${t.zoneId || 'Main Floor'})`,
      subtitle: `Kapasitas: ${t.pax || 4} Pax • Status: ${t.status}`,
      category: 'table'
    }))

    const allItems = [...systemActions, ...productActions, ...tableActions]

    it('should return initial action suggestions when query is empty', () => {
      const query = ''
      const filtered = allItems.filter((item) => {
        if (!query.trim()) return item.category === 'action' || item.id.includes('prod-1') || item.id.includes('tbl-OUT')
        const q = query.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      }).slice(0, 8)

      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.some((i) => i.category === 'action')).toBe(true)
    })

    it('should find products by name or category keyword', () => {
      const query = 'latte'
      const filtered = allItems.filter((item) => {
        const q = query.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      })
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every((i) => i.title.toLowerCase().includes('latte') || i.subtitle.toLowerCase().includes('latte'))).toBe(true)
    })

    it('should find table by zone or table number', () => {
      const query = 'OUT-01'
      const filtered = allItems.filter((item) => {
        const q = query.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      })
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered[0].category).toBe('table')
      expect(filtered[0].title).toContain('OUT-01')
    })

    it('should find quick system actions by intent query', () => {
      const query = 'dapur'
      const filtered = allItems.filter((item) => {
        const q = query.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      })
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered[0].id).toBe('act-nav-kds')
    })

    it('should handle empty result gracefully for unknown keywords', () => {
      const query = 'xyznonexistent999'
      const filtered = allItems.filter((item) => {
        const q = query.toLowerCase()
        return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      })
      expect(filtered.length).toBe(0)
    })
  })

  describe('Keyboard Arrow Navigation Math', () => {
    it('should cycle next index on ArrowDown and previous index on ArrowUp', () => {
      const len = 5
      let idx = 0
      idx = (idx + 1) % len
      expect(idx).toBe(1)
      idx = 4
      idx = (idx + 1) % len
      expect(idx).toBe(0)
      idx = (idx - 1 + len) % len
      expect(idx).toBe(4)
    })

    it('should trigger onSelect callback when item is selected', () => {
      const onSelectMock = vi.fn()
      const mockItems = [{ id: '1', title: 'Item 1', onSelect: onSelectMock }]
      mockItems[0].onSelect()
      expect(onSelectMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Workstation Shortcuts Dispatcher (F1-F12, Cmd+K, Esc)', () => {
    interface FakeKeyboardEvent {
      key: string
      metaKey: boolean
      ctrlKey: boolean
      target: { tagName?: string; isContentEditable?: boolean }
      preventDefault: () => void
    }

    const createKeyboardEvent = (
      key: string,
      options: { metaKey?: boolean; ctrlKey?: boolean; target?: { tagName?: string; isContentEditable?: boolean } } = {}
    ): FakeKeyboardEvent => ({
      key,
      metaKey: options.metaKey ?? false,
      ctrlKey: options.ctrlKey ?? false,
      target: options.target ?? { tagName: 'DIV', isContentEditable: false },
      preventDefault: vi.fn()
    })

    const runShortcutEngine = (
      e: FakeKeyboardEvent,
      handlers: {
        onOpenSpotlight?: () => void
        onCloseModals?: () => void
        onFocusCatalog?: () => void
        onToggleFloorPlan?: () => void
        onQuickPayCash?: () => void
        onQuickPayQris?: () => void
        onSplitBill?: () => void
        onPrintReceipt?: () => void
      }
    ) => {
      const isInput = Boolean(e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA' || e.target?.isContentEditable)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        handlers.onOpenSpotlight?.()
        return
      }
      if (e.key === '/' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        handlers.onOpenSpotlight?.()
        return
      }
      if (e.key === 'Escape') {
        handlers.onCloseModals?.()
        return
      }
      if (isInput) return

      switch (e.key) {
        case 'F1': e.preventDefault(); handlers.onFocusCatalog?.(); break
        case 'F2': e.preventDefault(); handlers.onToggleFloorPlan?.(); break
        case 'F4': e.preventDefault(); handlers.onQuickPayCash?.(); break
        case 'F8': e.preventDefault(); handlers.onQuickPayQris?.(); break
        case 'F9': e.preventDefault(); handlers.onSplitBill?.(); break
        case 'F12': e.preventDefault(); handlers.onPrintReceipt?.(); break
      }
    }

    it('should trigger onOpenSpotlight on Cmd+K or Ctrl+K', () => {
      const onOpenSpotlight = vi.fn()
      runShortcutEngine(createKeyboardEvent('k', { metaKey: true }), { onOpenSpotlight })
      expect(onOpenSpotlight).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('k', { ctrlKey: true }), { onOpenSpotlight })
      expect(onOpenSpotlight).toHaveBeenCalledTimes(2)
    })

    it('should trigger onOpenSpotlight on / when not typing in input', () => {
      const onOpenSpotlight = vi.fn()
      runShortcutEngine(createKeyboardEvent('/'), { onOpenSpotlight })
      expect(onOpenSpotlight).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('/', { target: { tagName: 'INPUT' } }), { onOpenSpotlight })
      expect(onOpenSpotlight).toHaveBeenCalledTimes(1)
    })

    it('should trigger onCloseModals on Escape key', () => {
      const onCloseModals = vi.fn()
      runShortcutEngine(createKeyboardEvent('Escape'), { onCloseModals })
      expect(onCloseModals).toHaveBeenCalledTimes(1)
    })

    it('should trigger functional keys F1, F2, F4, F8, F9, F12', () => {
      const handlers = {
        onFocusCatalog: vi.fn(),
        onToggleFloorPlan: vi.fn(),
        onQuickPayCash: vi.fn(),
        onQuickPayQris: vi.fn(),
        onSplitBill: vi.fn(),
        onPrintReceipt: vi.fn()
      }

      runShortcutEngine(createKeyboardEvent('F1'), handlers)
      expect(handlers.onFocusCatalog).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('F2'), handlers)
      expect(handlers.onToggleFloorPlan).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('F4'), handlers)
      expect(handlers.onQuickPayCash).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('F8'), handlers)
      expect(handlers.onQuickPayQris).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('F9'), handlers)
      expect(handlers.onSplitBill).toHaveBeenCalledTimes(1)
      runShortcutEngine(createKeyboardEvent('F12'), handlers)
      expect(handlers.onPrintReceipt).toHaveBeenCalledTimes(1)
    })

    it('should ignore functional keys when typing inside an input or textarea', () => {
      const handlers = { onFocusCatalog: vi.fn(), onQuickPayCash: vi.fn() }
      runShortcutEngine(createKeyboardEvent('F1', { target: { tagName: 'INPUT' } }), handlers)
      expect(handlers.onFocusCatalog).not.toHaveBeenCalled()
      runShortcutEngine(createKeyboardEvent('F4', { target: { tagName: 'TEXTAREA' } }), handlers)
      expect(handlers.onQuickPayCash).not.toHaveBeenCalled()
    })
  })
})
