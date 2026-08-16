import { describe, it, expect } from 'vitest'
import { OrderTicket, CartItem, StationConfig } from '../types/pos'

export interface KitchenWorkOrder {
  orderId: string
  tableNumber: string
  stationId: string
  stationName: string
  items: CartItem[]
  status: 'queued' | 'cooking' | 'ready' | 'served'
}

export const decomposeOrderToStations = (
  order: OrderTicket,
  stations: StationConfig[]
): KitchenWorkOrder[] => {
  const stationMap: Record<string, CartItem[]> = {}

  order.items.forEach((item) => {
    // Map category to station: Coffee -> Barista, Pastry/Food -> Kitchen, Beverage/Cocktail -> Bar
    let targetStationId = 'kitchen'
    if (item.category === 'Coffee' || item.category === 'Non-Coffee') {
      targetStationId = 'barista'
    } else if (item.category === 'Cocktail' || item.category === 'Mocktail') {
      targetStationId = 'bar'
    }

    if (!stationMap[targetStationId]) {
      stationMap[targetStationId] = []
    }
    stationMap[targetStationId].push(item)
  })

  return Object.entries(stationMap).map(([stationId, items]) => {
    const matchedStation = stations.find((s) => s.id === stationId)
    return {
      orderId: order.id,
      tableNumber: order.table,
      stationId,
      stationName: matchedStation ? matchedStation.name : stationId.toUpperCase(),
      items,
      status: 'queued',
    }
  })
}

export const advanceCourseStatus = (
  currentStatus: 'Holding' | 'Fired' | 'Served'
): 'Holding' | 'Fired' | 'Served' => {
  if (currentStatus === 'Holding') return 'Fired'
  if (currentStatus === 'Fired') return 'Served'
  return 'Served'
}

export interface BranchStockTransfer {
  transferId: string
  fromBranch: string
  toBranch: string
  sku: string
  quantity: number
  status: 'draft' | 'in_transit' | 'received'
}

export const processBranchStockTransfer = (
  transfer: BranchStockTransfer
): BranchStockTransfer => {
  return {
    ...transfer,
    status: transfer.status === 'draft' ? 'in_transit' : 'received',
  }
}

export interface SpoilageRecord {
  recordId: string
  sku: string
  itemName: string
  quantity: number
  unitCost: number
  reason: 'expired' | 'damaged' | 'preparation_error'
  totalLoss: number
  hfeGlAccount: string
}

export const recordInventorySpoilage = (
  sku: string,
  itemName: string,
  quantity: number,
  unitCost: number,
  reason: 'expired' | 'damaged' | 'preparation_error'
): SpoilageRecord => {
  return {
    recordId: `SPOIL-${Date.now()}`,
    sku,
    itemName,
    quantity,
    unitCost,
    reason,
    totalLoss: quantity * unitCost,
    hfeGlAccount: 'GL-5101', // Inventory Shrinkage / Spoilage Expense
  }
}

describe('Wave 3: Operations, KDS Multi-Station & Backoffice Suite', () => {
  const mockStations: StationConfig[] = [
    { id: 'barista', name: 'Barista Bar Station', icon: '☕', categories: ['Coffee', 'Non-Coffee'] },
    { id: 'kitchen', name: 'Hot Kitchen Station', icon: '🍳', categories: ['Main', 'Pastry', 'Snack'] },
    { id: 'bar', name: 'Sommelier & Bar', icon: '🍷', categories: ['Cocktail', 'Mocktail'] },
  ]

  describe('Pillar A: Kitchen Multi-Station Order Decomposition', () => {
    it('decomposes mixed food and coffee order into separate kitchen work orders', () => {
      const mixedOrder: OrderTicket = {
        id: 'ORD-MIXED-01',
        table: 'IND-04',
        customerName: 'Ahmad Dani',
        policy: 'open-tab',
        status: 'placed',
        timeElapsedMinutes: 5,
        createdAt: new Date().toISOString(),
        total: 155000,
        taxPB1Amount: 15500,
        serviceFeeAmount: 0,
        tipAmount: 0,
        items: [
          {
            id: 'PROD-COF-01',
            name: 'Double Espresso',
            category: 'Coffee',
            hfeCategoryCode: 'CAT-COF',
            price: 35000,
            quantity: 2,
            image: '/images/espresso.jpg',
            description: 'Double shot espresso',
          },
          {
            id: 'PROD-FOOD-01',
            name: 'Wagyu Burger',
            category: 'Main',
            hfeCategoryCode: 'CAT-FOOD',
            price: 85000,
            quantity: 1,
            image: '/images/burger.jpg',
            description: 'Juicy wagyu beef burger',
          },
        ],
      }

      const workOrders = decomposeOrderToStations(mixedOrder, mockStations)
      expect(workOrders.length).toBe(2)

      const baristaOrder = workOrders.find((w) => w.stationId === 'barista')
      const kitchenOrder = workOrders.find((w) => w.stationId === 'kitchen')

      expect(baristaOrder).toBeDefined()
      expect(baristaOrder?.items.length).toBe(1)
      expect(baristaOrder?.items[0].name).toBe('Double Espresso')

      expect(kitchenOrder).toBeDefined()
      expect(kitchenOrder?.items.length).toBe(1)
      expect(kitchenOrder?.items[0].name).toBe('Wagyu Burger')
    })
  })

  describe('Pillar B: Fine Dining Course Hold & Fire Progression', () => {
    it('advances course firing states correctly from Holding -> Fired -> Served', () => {
      expect(advanceCourseStatus('Holding')).toBe('Fired')
      expect(advanceCourseStatus('Fired')).toBe('Served')
      expect(advanceCourseStatus('Served')).toBe('Served')
    })
  })

  describe('Pillar C: Multi-Branch Stock Transfers & Spoilage Recording', () => {
    it('processes branch stock transfer state transitions accurately', () => {
      const initialTransfer: BranchStockTransfer = {
        transferId: 'TRF-001',
        fromBranch: 'Outlet Senopati',
        toBranch: 'Outlet PIK',
        sku: 'SKU-BEANS-ETHIOPIA',
        quantity: 10,
        status: 'draft',
      }

      const inTransit = processBranchStockTransfer(initialTransfer)
      expect(inTransit.status).toBe('in_transit')

      const received = processBranchStockTransfer(inTransit)
      expect(received.status).toBe('received')
    })

    it('generates double-entry compliant inventory spoilage loss record with GL-5101', () => {
      const spoilage = recordInventorySpoilage(
        'SKU-MILK-OAT',
        'Oat Milk Barista Edition',
        4,
        45000,
        'expired'
      )

      expect(spoilage.totalLoss).toBe(180000)
      expect(spoilage.hfeGlAccount).toBe('GL-5101')
      expect(spoilage.reason).toBe('expired')
    })
  })
})
