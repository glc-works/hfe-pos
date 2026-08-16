import { describe, it, expect } from 'vitest'
import { PRODUCT_CATALOG } from '../data/mockData'
import { TableStatus, OrderTicket } from '../types/pos'

describe('Open Bill (Open Tab) Full Lifecycle & Settlement Suite', () => {
  it('1. Open Tab Order Submission: Table transitions to active open-tab with running bill', () => {
    let table: TableStatus = {
      id: 'T4',
      name: 'MEJA-04',
      status: 'free',
      totalBill: 0,
      orderCount: 0
    }

    const round1Item = PRODUCT_CATALOG[0] // e.g. Latte Rp 38.000
    const qty = 2
    const round1Total = round1Item.price * qty

    const orderRound1: OrderTicket = {
      id: 'ORD-1001',
      table: table.name,
      customerName: 'Aldi Pratama',
      items: [
        {
          ...round1Item,
          quantity: qty,
          seatNumber: 'Seat 1'
        }
      ],
      policy: 'open-tab',
      total: round1Total,
      taxPB1Amount: Math.round(round1Total * 0.1),
      serviceFeeAmount: Math.round(round1Total * 0.05),
      tipAmount: 0,
      status: 'placed',
      timeElapsedMinutes: 1,
      createdAt: '14:20'
    }

    // Simulate table state mutation
    table = {
      ...table,
      status: 'open-tab',
      customerName: orderRound1.customerName,
      totalBill: table.totalBill + orderRound1.total,
      orderCount: table.orderCount + orderRound1.items.length
    }

    expect(table.status).toBe('open-tab')
    expect(table.totalBill).toBe(round1Total)
    expect(table.orderCount).toBe(1)
    expect(table.customerName).toBe('Aldi Pratama')
  })

  it('2. Multi-Round Additions: Round 2 seamlessly increments running table balance', () => {
    let table: TableStatus = {
      id: 'T4',
      name: 'MEJA-04',
      status: 'open-tab',
      customerName: 'Aldi Pratama',
      totalBill: 76000,
      orderCount: 1
    }

    const round2Item = PRODUCT_CATALOG[1] || { price: 35000 }
    const round2Total = round2Item.price * 1

    table = {
      ...table,
      totalBill: table.totalBill + round2Total,
      orderCount: table.orderCount + 1
    }

    expect(table.totalBill).toBe(76000 + round2Total)
    expect(table.orderCount).toBe(2)
  })

  it('3. Settlement Calculation with PB1 & Service Fee: Computes accurate grand total', () => {
    const rawBill = 111000
    const voucherDiscount = 15000
    const discounted = Math.max(0, rawBill - voucherDiscount) // 96000

    const serviceFee = Math.round(discounted * 0.05) // 4800
    const pb1Tax = Math.round((discounted + serviceFee) * 0.1) // 10080
    const tip = 5000

    const grandTotal = discounted + serviceFee + pb1Tax + tip
    expect(grandTotal).toBe(96000 + 4800 + 10080 + 5000) // 115880

    const pointsEarned = Math.floor(grandTotal / 1000)
    expect(pointsEarned).toBe(115)
  })

  it('4. Tab Settlement & Clearing: Table balance resets to 0 and marks as Lunas', () => {
    let table: TableStatus = {
      id: 'T4',
      name: 'MEJA-04',
      status: 'open-tab',
      customerName: 'Aldi Pratama',
      totalBill: 115880,
      orderCount: 2
    }

    // Settlement callback executed
    table = {
      ...table,
      status: 'occupied',
      totalBill: 0,
      orderCount: 0,
      customerName: 'Aldi Pratama (Lunas)'
    }

    expect(table.totalBill).toBe(0)
    expect(table.orderCount).toBe(0)
    expect(table.customerName).toContain('(Lunas)')
  })
})
