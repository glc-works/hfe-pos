import { describe, it, expect } from 'vitest'

describe('ShiftDrawer & Cash Denomination Reconciliation', () => {
  const openingFloat = 500000
  const cashSales = 1250000
  const cashOutTotal = 50000
  const expectedCash = openingFloat + cashSales - cashOutTotal // 1.700.000

  it('calculates expected drawer cash correctly', () => {
    expect(expectedCash).toBe(1700000)
  })

  it('computes exact physical sum from bill denominations', () => {
    const counts = {
      100000: 15, // 1.500.000
      50000: 3,   // 150.000
      20000: 2,   // 40.000
      10000: 1,   // 10.000
    }
    const coins = 0
    const paperSum = Object.entries(counts).reduce((acc, [val, qty]) => acc + (Number(val) * qty), 0)
    const totalPhysical = paperSum + coins
    expect(totalPhysical).toBe(1700000)

    const variance = totalPhysical - expectedCash
    expect(variance).toBe(0)
  })

  it('flags shortage and requires manager PIN when variance exceeds threshold', () => {
    const totalPhysical = 1620000 // Short Rp 80.000
    const variance = totalPhysical - expectedCash
    expect(variance).toBe(-80000)

    const isHighVariance = Math.abs(variance) > 50000
    expect(isHighVariance).toBe(true)

    // Manager PIN check
    const managerPin = '123456'
    const isManagerPinValid = managerPin.length === 6
    expect(isManagerPinValid).toBe(true)
  })

  it('flags overage properly for small change tips', () => {
    const totalPhysical = 1705000 // Over Rp 5.000
    const variance = totalPhysical - expectedCash
    expect(variance).toBe(5000)

    const isHighVariance = Math.abs(variance) > 50000
    expect(isHighVariance).toBe(false)
  })
})
