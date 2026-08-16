import { describe, it, expect } from 'vitest'
import { TableStatus, OrderTicket, CartItem } from '../types/pos'
import { PRODUCT_CATALOG } from '../data/mockData'

describe('Table Bill Hydration & Payment Status Visibility (L2-POS-29)', () => {
  it('should distinguish unpaid open-tab tables from paid tables', () => {
    const tables: TableStatus[] = [
      { id: 'T1', name: 'MEJA-01', status: 'free', totalBill: 0, orderCount: 0 },
      { id: 'T2', name: 'MEJA-02', status: 'occupied', customerName: 'Sarah (Lunas)', totalBill: 0, orderCount: 0 },
      { id: 'T4', name: 'MEJA-04', status: 'occupied', customerName: 'Aldi', totalBill: 86000, orderCount: 2 }
    ]

    const unpaid = tables.filter(t => (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0)
    const paid = tables.filter(t => t.customerName?.includes('(Lunas)') || (t.status === 'occupied' && t.totalBill === 0))
    const available = tables.filter(t => t.status === 'free')

    expect(unpaid.length).toBe(1)
    expect(unpaid[0].name).toBe('MEJA-04')
    expect(unpaid[0].totalBill).toBe(86000)

    expect(paid.length).toBe(1)
    expect(paid[0].name).toBe('MEJA-02')

    expect(available.length).toBe(1)
    expect(available[0].name).toBe('MEJA-01')
  })

  it('should hydrate table order items from active orders when local cashier cart is empty', () => {
    const activeTable: TableStatus = {
      id: 'T4',
      name: 'MEJA-04',
      status: 'occupied',
      customerName: 'Aldi',
      totalBill: 86000,
      orderCount: 2
    }

    const activeOrders: OrderTicket[] = [
      {
        id: 'ORD-8801',
        table: 'MEJA-04',
        customerName: 'Aldi',
        items: [
          { ...PRODUCT_CATALOG[0], quantity: 1, price: 28000 },
          { ...PRODUCT_CATALOG[5], quantity: 1, price: 50000 }
        ],
        policy: 'open-tab',
        total: 86000,
        taxPB1Amount: 8000,
        serviceFeeAmount: 0,
        tipAmount: 0,
        status: 'served',
        timeElapsedMinutes: 12,
        createdAt: '09:00 WIB'
      }
    ]

    const localCartItems: CartItem[] = []

    // Extraction simulation
    const tableOrders = activeOrders.filter(o => o.table === activeTable.name)
    const extractedItems: CartItem[] = []
    tableOrders.forEach(ord => {
      if (ord.items) extractedItems.push(...ord.items)
    })

    const resolvedCartItems = localCartItems.length > 0 ? localCartItems : extractedItems

    expect(resolvedCartItems.length).toBe(2)
    expect(resolvedCartItems[0].name).toBe(PRODUCT_CATALOG[0].name)
    expect(resolvedCartItems[1].name).toBe(PRODUCT_CATALOG[5].name)

    const subtotal = resolvedCartItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
    expect(subtotal).toBe(78000)
  })
})
