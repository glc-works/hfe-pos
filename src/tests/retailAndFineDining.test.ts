import { describe, it, expect } from 'vitest'
import { convertUomQty, evaluateItemPrice, parseBarcodeSyntax } from '../hooks/useRetailPricing'
import { settleKasbon, fireCourse, pourWineBottle } from '../services/hfeApi'

describe('Retail Suite - Wholesale UOM & Barcode Parser', () => {
  it('correctly parses rapid barcode multiplier syntax (10*8999901 & 5x8999902)', () => {
    const res1 = parseBarcodeSyntax('10*8999901')
    expect(res1.qty).toBe(10)
    expect(res1.barcode).toBe('8999901')

    const res2 = parseBarcodeSyntax('5x8999902')
    expect(res2.qty).toBe(5)
    expect(res2.barcode).toBe('8999902')

    const res3 = parseBarcodeSyntax('8999903')
    expect(res3.qty).toBe(1)
    expect(res3.barcode).toBe('8999903')
  })

  it('converts UOM quantities correctly between Pcs, Pack, and Karton', () => {
    // 1 Karton = 40 Pcs
    expect(convertUomQty(1, 'Karton', 'Pcs')).toBe(40)
    // 40 Pcs = 1 Karton
    expect(convertUomQty(40, 'Pcs', 'Karton')).toBe(1)
    // 1 Pack = 10 Pcs
    expect(convertUomQty(1, 'Pack', 'Pcs')).toBe(10)
    // 4 Packs = 1 Karton (40 Pcs)
    expect(convertUomQty(4, 'Pack', 'Karton')).toBe(1)
  })

  it('evaluates wholesale pricing tier automatically when quantity threshold is met (>= 40 Pcs)', () => {
    const retailPrice = 22000
    const wholesalePrice = 19500
    const wholesaleThreshold = 40

    // Eceran (below threshold 40)
    const ecerEval = evaluateItemPrice(10, retailPrice, wholesalePrice, wholesaleThreshold)
    expect(ecerEval.isWholesaleApplied).toBe(false)
    expect(ecerEval.effectiveUnitPrice).toBe(22000)
    expect(ecerEval.totalItemAmount).toBe(220000)

    // Grosir (at or above threshold 40)
    const grosirEval = evaluateItemPrice(40, retailPrice, wholesalePrice, wholesaleThreshold)
    expect(grosirEval.isWholesaleApplied).toBe(true)
    expect(grosirEval.effectiveUnitPrice).toBe(19500)
    expect(grosirEval.totalItemAmount).toBe(780000)
  })
})

describe('Retail Suite - Kasbon Receivables Ledger', () => {
  it('correctly calculates remaining Kasbon balance on partial and full settlements', async () => {
    // Partial Settlement of Rp 200.000 out of Rp 450.000 active balance
    const partialRes = await settleKasbon('CUST-01', 200000, 'cash')
    expect(partialRes.success).toBe(true)
    expect(partialRes.paidAmount).toBe(200000)
    expect(partialRes.remainingBalance).toBe(250000)

    // Full Settlement of Rp 450.000
    const fullRes = await settleKasbon('CUST-01', 450000, 'qris')
    expect(fullRes.success).toBe(true)
    expect(fullRes.paidAmount).toBe(450000)
    expect(fullRes.remainingBalance).toBe(0)
  })
})

describe('Fine Dining Suite - Course Firing & Wine Pouring', () => {
  it('executes course firing API trigger with correct course metadata', async () => {
    const res = await fireCourse('FD-101', 2, 'Pan-Seared Foie Gras')
    expect(res.orderId).toBe('FD-101')
    expect(res.courseNumber).toBe(2)
    expect(res.courseName).toBe('Pan-Seared Foie Gras')
    expect(res.status).toBe('Fired')
    expect(res.timestamp).toBeDefined()
  })

  it('deducts bottle stock correctly for glass vs bottle pours (1 bottle = 5 glasses)', async () => {
    // Pouring 1 glass deducts 0.2 bottle
    const glassPour = await pourWineBottle('WINE-001', 'glass', 1)
    expect(glassPour.bottleId).toBe('WINE-001')
    expect(glassPour.pourType).toBe('glass')
    expect(glassPour.remainingBottles).toBe(9.8)
    expect(glassPour.remainingGlasses).toBe(49)

    // Pouring 1 full bottle deducts 1.0 bottle
    const bottlePour = await pourWineBottle('WINE-001', 'bottle', 1)
    expect(bottlePour.pourType).toBe('bottle')
    expect(bottlePour.remainingBottles).toBe(9.0)
    expect(bottlePour.remainingGlasses).toBe(45)
  })
})
