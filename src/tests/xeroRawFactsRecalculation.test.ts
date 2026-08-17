import { describe, it, expect } from 'vitest'

/**
 * Pure Deterministic Raw Facts Recalculation Engine
 * Invariant: Never trust external calculated fields; derive everything from raw facts!
 */
export interface RawLineFact {
  description: string
  quantity: number
  unitPriceMinor: number // in minor currency units (cents/sen)
  discountPct: number // 0 to 100
  taxRateBps: number // Basis points: 900 for 9% GST, 1000 for 10% PB1, 1100 for 11% PPN
  accountCode: string
}

export interface RawInvoiceFact {
  invoiceNumber: string
  contactId: string
  currency: string
  exchangeRate: number // e.g. 1.3450 for USD to SGD
  rawLines: RawLineFact[]
}

export interface RecomputedInvoice {
  invoiceNumber: string
  recomputedSubtotalMinor: number
  recomputedTaxMinor: number
  recomputedGrandTotalMinor: number
  recomputedBaseCurrencyTotalMinor: number
  recomputedDebits: Array<{ account: string; amountMinor: number }>
  recomputedCredits: Array<{ account: string; amountMinor: number }>
  isBalanced: boolean
}

export function recomputeFromRawFacts(raw: RawInvoiceFact): RecomputedInvoice {
  let subtotalMinor = 0
  let taxMinor = 0
  const credits: Array<{ account: string; amountMinor: number }> = []

  for (const line of raw.rawLines) {
    const grossLineMinor = Math.round(line.quantity * line.unitPriceMinor)
    const discountAmountMinor = Math.round((grossLineMinor * line.discountPct) / 100)
    const netLineMinor = grossLineMinor - discountAmountMinor
    const lineTaxMinor = Math.round((netLineMinor * line.taxRateBps) / 10000)

    subtotalMinor += netLineMinor
    taxMinor += lineTaxMinor

    credits.push({
      account: line.accountCode,
      amountMinor: netLineMinor
    })
  }

  const grandTotalMinor = subtotalMinor + taxMinor
  const baseCurrencyTotalMinor = Math.round(grandTotalMinor * raw.exchangeRate)

  // Tax credit allocation
  if (taxMinor > 0) {
    credits.push({
      account: '2140_TAX_PAYABLE',
      amountMinor: taxMinor
    })
  }

  // Debit is Accounts Receivable or Bank
  const debits = [
    {
      account: '1200_ACCOUNTS_RECEIVABLE',
      amountMinor: grandTotalMinor
    }
  ]

  const totalDebits = debits.reduce((acc, d) => acc + d.amountMinor, 0)
  const totalCredits = credits.reduce((acc, c) => acc + c.amountMinor, 0)

  return {
    invoiceNumber: raw.invoiceNumber,
    recomputedSubtotalMinor: subtotalMinor,
    recomputedTaxMinor: taxMinor,
    recomputedGrandTotalMinor: grandTotalMinor,
    recomputedBaseCurrencyTotalMinor: baseCurrencyTotalMinor,
    recomputedDebits: debits,
    recomputedCredits: credits,
    isBalanced: totalDebits === totalCredits
  }
}

export function reconcileWithXero(
  recomputed: RecomputedInvoice,
  xeroStatedTotalMinor: number
): { status: 'MATCH' | 'ROUNDING_ADJUSTED' | 'DISCREPANCY'; varianceMinor: number } {
  const diff = Math.abs(recomputed.recomputedGrandTotalMinor - xeroStatedTotalMinor)
  if (diff === 0) {
    return { status: 'MATCH', varianceMinor: 0 }
  } else if (diff <= 5) {
    return { status: 'ROUNDING_ADJUSTED', varianceMinor: diff }
  } else {
    return { status: 'DISCREPANCY', varianceMinor: diff }
  }
}

describe('Xero Raw Facts Recalculation & 3-Way Reconciliation Invariant', () => {
  it('correctly calculates single-line invoice from raw qty and unit price', () => {
    const rawInvoice: RawInvoiceFact = {
      invoiceNumber: 'INV-2026-001',
      contactId: 'contact-xero-01',
      currency: 'SGD',
      exchangeRate: 1.0,
      rawLines: [
        {
          description: 'Specialty Coffee Beans (1kg)',
          quantity: 10,
          unitPriceMinor: 3500, // $35.00 SGD
          discountPct: 0,
          taxRateBps: 900, // 9% GST
          accountCode: '4110_SALES'
        }
      ]
    }

    const recomputed = recomputeFromRawFacts(rawInvoice)

    expect(recomputed.recomputedSubtotalMinor).toBe(35000) // $350.00
    expect(recomputed.recomputedTaxMinor).toBe(3150) // $31.50 (9%)
    expect(recomputed.recomputedGrandTotalMinor).toBe(38150) // $381.50
    expect(recomputed.isBalanced).toBe(true)

    const recon = reconcileWithXero(recomputed, 38150)
    expect(recon.status).toBe('MATCH')
    expect(recon.varianceMinor).toBe(0)
  })

  it('correctly recalculates multi-line mixed discount and handles penny rounding variance', () => {
    const rawInvoice: RawInvoiceFact = {
      invoiceNumber: 'INV-2026-002',
      contactId: 'contact-xero-02',
      currency: 'USD',
      exchangeRate: 1.345, // USD to SGD
      rawLines: [
        {
          description: 'Espresso Blend 5kg',
          quantity: 3,
          unitPriceMinor: 4550, // $45.50
          discountPct: 15, // 15% discount
          taxRateBps: 900, // 9% GST
          accountCode: '4110_SALES'
        },
        {
          description: 'Barista Training Session',
          quantity: 1,
          unitPriceMinor: 12000, // $120.00
          discountPct: 0,
          taxRateBps: 0, // Tax exempt
          accountCode: '4120_SERVICES'
        }
      ]
    }

    const recomputed = recomputeFromRawFacts(rawInvoice)

    expect(recomputed.recomputedSubtotalMinor).toBe(23602)
    expect(recomputed.recomputedTaxMinor).toBe(1044)
    expect(recomputed.recomputedGrandTotalMinor).toBe(24646)
    expect(recomputed.isBalanced).toBe(true)

    expect(recomputed.recomputedBaseCurrencyTotalMinor).toBe(33149)

    const reconWith1CentVariance = reconcileWithXero(recomputed, 24647)
    expect(reconWith1CentVariance.status).toBe('ROUNDING_ADJUSTED')
    expect(reconWith1CentVariance.varianceMinor).toBe(1)
  })

  it('rejects large discrepancy exceeding 5 cents', () => {
    const rawInvoice: RawInvoiceFact = {
      invoiceNumber: 'INV-2026-003',
      contactId: 'contact-xero-03',
      currency: 'SGD',
      exchangeRate: 1.0,
      rawLines: [
        {
          description: 'Consulting Fee',
          quantity: 1,
          unitPriceMinor: 100000,
          discountPct: 0,
          taxRateBps: 900,
          accountCode: '4120_SERVICES'
        }
      ]
    }

    const recomputed = recomputeFromRawFacts(rawInvoice)
    const recon = reconcileWithXero(recomputed, 100000)
    expect(recon.status).toBe('DISCREPANCY')
    expect(recon.varianceMinor).toBe(9000)
  })
})
