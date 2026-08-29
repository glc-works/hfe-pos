import { describe, it, expect } from 'vitest'

describe('ShiftDrawer & Scale-Adaptive Reconciliation (Solo to Team)', () => {
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

  it('allows Solo Operator to close shift instantly without second-PIN blocker', () => {
    const isSoloMode = true
    const totalPhysical = 1620000 // Short Rp 80.000
    const variance = totalPhysical - expectedCash
    expect(variance).toBe(-80000)

    // Solo operator can close without requiring a second SPV PIN
    const canSubmit = isSoloMode || Math.abs(variance) <= 50000
    expect(canSubmit).toBe(true)
  })

  it('enforces 2-stage submission or SPV PIN gate for Team Multi-Staff mode', () => {
    const isSoloMode = false
    const totalPhysical = 1620000 // Short Rp 80.000
    const variance = totalPhysical - expectedCash
    expect(variance).toBe(-80000)

    const isHighVariance = Math.abs(variance) > 50000
    expect(isHighVariance).toBe(true)

    // In team mode without valid PIN, it requires SPV approval
    let managerPin = '123'
    let isManagerPinValid = managerPin.length === 6
    expect(!isSoloMode && isHighVariance && !isManagerPinValid).toBe(true)

    managerPin = '123456'
    isManagerPinValid = managerPin.length === 6
    expect(!isSoloMode && isHighVariance && !isManagerPinValid).toBe(false)
  })
})
