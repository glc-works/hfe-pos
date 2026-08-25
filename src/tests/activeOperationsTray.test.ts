import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CartItem, ParkedOperationTab } from '../types/pos'

describe('Active Operations Tray Engine (ClickUp Task Tray Pattern)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockCartItem: CartItem = {
    id: 'MENU-ESP-01',
    name: 'Espresso Single Origin',
    category: 'Coffee',
    hfeCategoryCode: 'CAT-COFFEE',
    price: 35000,
    quantity: 2,
    image: '/images/espresso.jpg',
    description: 'Double shot espresso'
  }

  // Pure state transition tester mirroring useOperationsTray logic
  const createTrayEngine = (onShowToast?: (msg: string) => void) => {
    let parkedTabs: ParkedOperationTab[] = []

    const parkCurrentCart = (params: {
      items: CartItem[]
      fulfillmentMode: 'dine_in' | 'takeaway' | 'delivery'
      tableName?: string
      customerName?: string
      rawSubtotal: number
      packagingFee?: number
    }) => {
      if (params.items.length === 0) {
        if (onShowToast) onShowToast('⚠️ Keranjang masih kosong, tidak ada yang diparkir.')
        return null
      }
      const packaging = params.packagingFee || 0
      const total = params.rawSubtotal + packaging
      const id = `PARK-${Date.now().toString(36).toUpperCase()}`

      let label = '🛍️ Pesanan Baru'
      if (params.fulfillmentMode === 'dine_in') {
        label = `🍽️ ${params.tableName || 'Meja'}`
      } else if (params.fulfillmentMode === 'takeaway') {
        label = `🛍️ Bungkus (${params.items.reduce((s, i) => s + i.quantity, 0)})`
      } else if (params.fulfillmentMode === 'delivery') {
        label = `🛵 Antar: ${params.customerName || 'Pelanggan'}`
      }

      const newTab: ParkedOperationTab = {
        id,
        label,
        fulfillmentMode: params.fulfillmentMode,
        tableName: params.tableName,
        customerName: params.customerName,
        items: [...params.items],
        rawSubtotal: params.rawSubtotal,
        packagingFee: packaging,
        totalAmount: total,
        parkedAt: new Date().toISOString()
      }

      parkedTabs = [newTab, ...parkedTabs]
      if (onShowToast) onShowToast(`📥 Transaksi [${label}] berhasil diparkir ke Tray Bawah.`)
      return newTab
    }

    const discardParkedTab = (tabId: string) => {
      parkedTabs = parkedTabs.filter(t => t.id !== tabId)
      if (onShowToast) onShowToast('🗑️ Tab parkir dihapus.')
    }

    const clearAllParkedTabs = () => {
      parkedTabs = []
      if (onShowToast) onShowToast('🧹 Seluruh tab parkir dibersihkan.')
    }

    return {
      getTabs: () => parkedTabs,
      getCount: () => parkedTabs.length,
      parkCurrentCart,
      discardParkedTab,
      clearAllParkedTabs
    }
  }

  it('initializes with empty parked tabs', () => {
    const engine = createTrayEngine()
    expect(engine.getTabs()).toEqual([])
    expect(engine.getCount()).toBe(0)
  })

  it('parks an active cart with dine-in fulfillment mode into tray', () => {
    const onToast = vi.fn()
    const engine = createTrayEngine(onToast)

    const tab = engine.parkCurrentCart({
      items: [mockCartItem],
      fulfillmentMode: 'dine_in',
      tableName: 'OUT-04',
      rawSubtotal: 70000,
      packagingFee: 0
    })

    expect(tab).not.toBeNull()
    expect(tab?.label).toBe('🍽️ OUT-04')
    expect(tab?.totalAmount).toBe(70000)
    expect(engine.getCount()).toBe(1)
    expect(onToast).toHaveBeenCalledWith(expect.stringContaining('berhasil diparkir'))
  })

  it('parks a takeaway cart and includes packaging fee in total amount', () => {
    const engine = createTrayEngine()

    const tab = engine.parkCurrentCart({
      items: [mockCartItem],
      fulfillmentMode: 'takeaway',
      rawSubtotal: 70000,
      packagingFee: 2000
    })

    expect(tab?.label).toBe('🛍️ Bungkus (2)')
    expect(tab?.totalAmount).toBe(72000)
    expect(engine.getCount()).toBe(1)
  })

  it('rejects parking when active cart has 0 items', () => {
    const onToast = vi.fn()
    const engine = createTrayEngine(onToast)

    const tab = engine.parkCurrentCart({
      items: [],
      fulfillmentMode: 'takeaway',
      rawSubtotal: 0
    })

    expect(tab).toBeNull()
    expect(engine.getCount()).toBe(0)
    expect(onToast).toHaveBeenCalledWith(expect.stringContaining('Keranjang masih kosong'))
  })

  it('discards a specific parked tab by id', () => {
    const engine = createTrayEngine()

    const tab = engine.parkCurrentCart({
      items: [mockCartItem],
      fulfillmentMode: 'delivery',
      customerName: 'Bapak Alexander',
      rawSubtotal: 70000
    })

    expect(engine.getCount()).toBe(1)
    engine.discardParkedTab(tab?.id || '')
    expect(engine.getCount()).toBe(0)
  })

  it('clears all parked tabs simultaneously', () => {
    const engine = createTrayEngine()

    engine.parkCurrentCart({
      items: [mockCartItem],
      fulfillmentMode: 'dine_in',
      tableName: 'IND-01',
      rawSubtotal: 70000
    })
    engine.parkCurrentCart({
      items: [mockCartItem],
      fulfillmentMode: 'dine_in',
      tableName: 'VIP-02',
      rawSubtotal: 140000
    })

    expect(engine.getCount()).toBe(2)
    engine.clearAllParkedTabs()
    expect(engine.getCount()).toBe(0)
  })
})
