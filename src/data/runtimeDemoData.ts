import { isConnectedFirstPartyRuntime } from '../config/firstPartyRuntime'
import type { Order, TableInfo } from '../types/pos'
import {
  INITIAL_ORDERS,
  INITIAL_TABLES,
  createRuntimeProductCatalog,
} from './mockData'

export function createRuntimeInitialOrders(): Order[] {
  if (!isConnectedFirstPartyRuntime()) return INITIAL_ORDERS
  const product = createRuntimeProductCatalog()[0]
  const flagshipOrder = INITIAL_ORDERS.find((order) => order.id === 'ORD-8801')
  if (!flagshipOrder) throw new Error('Connected flagship runtime is missing ORD-8801')
  return [{
    ...flagshipOrder,
    table: 'OUT-04',
    items: [{ ...product, quantity: 1, seatNumber: 'Seat 1' }],
    total: product.price,
    totalPrice: product.price,
    taxPB1Amount: 0,
    serviceFeeAmount: 0,
    tipAmount: 0,
  }]
}

export function createRuntimeInitialTables(orders: Order[] = createRuntimeInitialOrders()): TableInfo[] {
  if (!isConnectedFirstPartyRuntime()) return INITIAL_TABLES
  const flagshipOrder = orders.find((order) => order.id === 'ORD-8801')
  if (!flagshipOrder) throw new Error('Connected flagship runtime is missing ORD-8801')
  return INITIAL_TABLES.map((table) => {
    if (table.name === 'OUT-04') {
      return {
        ...table,
        totalBill: flagshipOrder.total,
        orderCount: flagshipOrder.items.length,
        orderIds: [flagshipOrder.id],
      }
    }
    if (table.status !== 'free') {
      return { ...table, status: 'free', totalBill: 0, orderCount: 0, orderIds: [], customerName: undefined }
    }
    return table
  })
}
