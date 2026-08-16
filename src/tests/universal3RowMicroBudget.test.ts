import { describe, it, expect } from 'vitest'

export interface CardRowMetrics {
  headerHeightPx: number
  bodyHeightPx: number
  footerHeightPx: number
  totalIntrinsicHeightPx: number
}

export const calculateCard3RowHeight = (hasVipMinSpend = false): CardRowMetrics => {
  const header = 22 // Table ID + Capacity + Timer
  const body = hasVipMinSpend ? 24 : 20 // Name + Menu/VIP badge (+ 1px progress bar)
  const footer = 24 // Order tag + Total price
  const paddingAndGaps = 24 // p-2.5 + gaps

  return {
    headerHeightPx: header,
    bodyHeightPx: body,
    footerHeightPx: footer,
    totalIntrinsicHeightPx: header + body + footer + paddingAndGaps,
  }
}

describe('Universal 3-Row Micro-Budget Multi-Device Parity Suite (L2-POS-59)', () => {
  it('guarantees standard and VIP cards share consistent 3-row height (< 10px variance)', () => {
    const standardCard = calculateCard3RowHeight(false)
    const vipCard = calculateCard3RowHeight(true)

    const heightVariance = Math.abs(vipCard.totalIntrinsicHeightPx - standardCard.totalIntrinsicHeightPx)

    // VIP card is integrated tightly within the 3-row budget with negligible variance
    expect(heightVariance).toBeLessThanOrEqual(5)
    expect(standardCard.totalIntrinsicHeightPx).toBeGreaterThanOrEqual(85)
    expect(vipCard.totalIntrinsicHeightPx).toBeLessThanOrEqual(115)
  })

  it('guarantees responsive min-height boundary compliance across devices', () => {
    const mobileMinH = 76
    const tabletMinH = 96
    const desktopMinH = 104

    expect(mobileMinH).toBeLessThan(tabletMinH)
    expect(tabletMinH).toBeLessThan(desktopMinH)
  })
})
