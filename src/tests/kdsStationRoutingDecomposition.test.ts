import { describe, it, expect } from 'vitest'
import { resolveItemKdsStation, decomposeOrderToKdsStations } from '../utils/kdsRouting'
import { OrderTicket, CartItem } from '../types/pos'

describe('KDS Station Routing & Order Decomposition Engine', () => {
  const sampleItems: CartItem[] = [
    {
      id: 'ITEM-BEV-01',
      name: 'Double Espresso Gayo',
      category: 'Coffee',
      hfeCategoryCode: 'BEV_COFFEE',
      price: 24000,
      image: '',
      description: '',
      quantity: 2,
      kdsStation: 'Barista Station'
    },
    {
      id: 'ITEM-BEV-02',
      name: 'V60 Geisha Pour Over',
      category: 'Coffee',
      hfeCategoryCode: 'BEV_COFFEE',
      price: 65000,
      image: '',
      description: '',
      quantity: 1,
      kdsStation: 'Manual Brew Bar'
    },
    {
      id: 'ITEM-FOOD-01',
      name: 'Wagyu Smash Burger',
      category: 'Food',
      hfeCategoryCode: 'FOOD_MAIN',
      price: 85000,
      image: '',
      description: '',
      quantity: 2,
      kdsStation: 'Kitchen Station'
    },
    {
      id: 'ITEM-PAS-01',
      name: 'Pain Au Chocolat',
      category: 'Pastry',
      hfeCategoryCode: 'FOOD_PASTRY',
      price: 32000,
      image: '',
      description: '',
      quantity: 1,
      kdsStation: 'Pastry / Dessert'
    },
    {
      id: 'ITEM-RET-01',
      name: 'Whole Bean Gayo 250g',
      category: 'Retail',
      hfeCategoryCode: 'RET_COFFEE',
      price: 120000,
      image: '',
      description: '',
      quantity: 1,
      kdsStation: 'Retail Station'
    }
  ]

  const mockOrderTicket: OrderTicket = {
    id: 'ORD-TABLE-12',
    table: 'Table 12 (Garden View)',
    customerName: 'Bpk. Hendra Gunawan',
    phone: '08123456789',
    items: sampleItems,
    policy: 'pay-first',
    total: 350000,
    taxPB1Amount: 35000,
    serviceFeeAmount: 17500,
    tipAmount: 0,
    status: 'placed',
    timeElapsedMinutes: 4,
    createdAt: '2026-08-30T10:15:00.000Z'
  }

  it('resolves station target from explicit kdsStation property', () => {
    expect(resolveItemKdsStation(sampleItems[0])).toBe('Barista Station')
    expect(resolveItemKdsStation(sampleItems[1])).toBe('Manual Brew Bar')
    expect(resolveItemKdsStation(sampleItems[2])).toBe('Kitchen Station')
    expect(resolveItemKdsStation(sampleItems[3])).toBe('Pastry / Dessert')
    expect(resolveItemKdsStation(sampleItems[4])).toBe('Retail Station')
  })

  it('falls back to category-based heuristic routing when kdsStation is omitted', () => {
    const itemNoStation1: CartItem = {
      id: 'X-1', name: 'Hot Cappuccino', category: 'Coffee & Beverages', hfeCategoryCode: 'BEV',
      price: 30000, image: '', description: '', quantity: 1
    }
    const itemNoStation2: CartItem = {
      id: 'X-2', name: 'Almond Danish', category: 'Pastry & Bakery', hfeCategoryCode: 'BAKERY',
      price: 28000, image: '', description: '', quantity: 1
    }
    const itemNoStation3: CartItem = {
      id: 'X-3', name: 'Nasi Goreng Wagyu', category: 'Makanan Utama', hfeCategoryCode: 'FOOD',
      price: 65000, image: '', description: '', quantity: 1
    }

    expect(resolveItemKdsStation(itemNoStation1)).toBe('Barista Station')
    expect(resolveItemKdsStation(itemNoStation2)).toBe('Pastry / Dessert')
    expect(resolveItemKdsStation(itemNoStation3)).toBe('Kitchen Station')
  })

  it('decomposes a single order ticket into 5 dedicated station work orders', () => {
    const stationOrders = decomposeOrderToKdsStations(mockOrderTicket)
    const stationKeys = Object.keys(stationOrders)

    expect(stationKeys).toHaveLength(5)
    expect(stationKeys).toContain('barista-station')
    expect(stationKeys).toContain('manual-brew-bar')
    expect(stationKeys).toContain('kitchen-station')
    expect(stationKeys).toContain('pastry---dessert')
    expect(stationKeys).toContain('retail-station')
  })

  it('preserves order metadata and aggregates item quantities per station', () => {
    const stationOrders = decomposeOrderToKdsStations(mockOrderTicket)

    const baristaOrder = stationOrders['barista-station']
    expect(baristaOrder).toBeDefined()
    expect(baristaOrder.orderId).toBe('ORD-TABLE-12')
    expect(baristaOrder.tableNumber).toBe('Table 12 (Garden View)')
    expect(baristaOrder.customerName).toBe('Bpk. Hendra Gunawan')
    expect(baristaOrder.items).toHaveLength(1)
    expect(baristaOrder.totalItemsCount).toBe(2) // 2x Double Espresso
    expect(baristaOrder.status).toBe('pending')

    const kitchenOrder = stationOrders['kitchen-station']
    expect(kitchenOrder.items[0].name).toBe('Wagyu Smash Burger')
    expect(kitchenOrder.totalItemsCount).toBe(2)
  })

  it('supports independent state progression across station work orders', () => {
    const stationOrders = decomposeOrderToKdsStations(mockOrderTicket)

    // Barista station finishes drinks fast
    stationOrders['barista-station'].status = 'ready'
    // Kitchen is still preparing burger
    stationOrders['kitchen-station'].status = 'in_prep'

    expect(stationOrders['barista-station'].status).toBe('ready')
    expect(stationOrders['kitchen-station'].status).toBe('in_prep')
    expect(stationOrders['pastry---dessert'].status).toBe('pending')
  })
})
