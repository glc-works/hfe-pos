import { CartItem, MenuItem, OrderTicket } from '../types/pos'

export type KdsStationType = 
  | 'Barista Station' 
  | 'Kitchen Station' 
  | 'Manual Brew Bar' 
  | 'Pastry / Dessert' 
  | 'Retail Station' 
  | 'Roastery Lab' 
  | string

export interface StationWorkOrder {
  stationId: string
  stationName: string
  orderId: string
  tableNumber: string
  customerName: string
  items: CartItem[]
  totalItemsCount: number
  createdAt: string
  status: 'pending' | 'in_prep' | 'ready' | 'completed'
}

/**
 * Resolves the target KDS station for a given item based on:
 * 1. Explicit item `kdsStation`
 * 2. Category mapping fallback
 */
export function resolveItemKdsStation(item: Partial<MenuItem | CartItem>): string {
  if (item.kdsStation && item.kdsStation.trim().length > 0) {
    return item.kdsStation
  }
  const category = (item.category || '').toLowerCase()
  if (
    category.includes('coffee') || 
    category.includes('beverage') || 
    category.includes('minuman') || 
    category.includes('tea') ||
    category.includes('latte') ||
    category.includes('espresso')
  ) {
    return 'Barista Station'
  }
  if (
    category.includes('pastry') || 
    category.includes('bakery') || 
    category.includes('dessert') || 
    category.includes('cake') ||
    category.includes('croissant')
  ) {
    return 'Pastry / Dessert'
  }
  if (
    category.includes('food') || 
    category.includes('makanan') || 
    category.includes('main') || 
    category.includes('snack') ||
    category.includes('dine')
  ) {
    return 'Kitchen Station'
  }
  if (
    category.includes('bean') || 
    category.includes('roast') || 
    category.includes('bijikopi')
  ) {
    return 'Roastery Lab'
  }
  if (
    category.includes('retail') || 
    category.includes('merchandise') || 
    category.includes('gear')
  ) {
    return 'Retail Station'
  }
  return 'Kitchen Station'
}

/**
 * Decomposes an OrderTicket into station-specific sub-tickets (Record<string, StationWorkOrder>).
 * Each kitchen/bar workstation receives only the items routed to its specific station.
 */
export function decomposeOrderToKdsStations(
  order: OrderTicket
): Record<string, StationWorkOrder> {
  const stationMap: Record<string, StationWorkOrder> = {}

  for (const item of order.items) {
    const stationName = resolveItemKdsStation(item)
    const stationId = stationName.toLowerCase().replace(/[^a-z0-9]/g, '-')

    if (!stationMap[stationId]) {
      stationMap[stationId] = {
        stationId,
        stationName,
        orderId: order.id,
        tableNumber: order.table,
        customerName: order.customerName,
        items: [],
        totalItemsCount: 0,
        createdAt: order.createdAt || new Date().toISOString(),
        status: 'pending',
      }
    }
    stationMap[stationId].items.push(item)
    stationMap[stationId].totalItemsCount += item.quantity || 1
  }

  return stationMap
}
