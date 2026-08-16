export interface ShiftCashInput {
  initialFloat: number
  cashSales: number
  pettyCashExpenses: number
  cashCounted: number
}

export interface ShiftReconciliationResult {
  initialFloat: number
  cashSales: number
  pettyCashExpenses: number
  expectedCash: number
  cashCounted: number
  variance: number
  status: 'MATCHED' | 'SHORTAGE' | 'OVERAGE'
  requiresManagerApproval: boolean
  journalEntry: {
    debitAccount: string
    creditAccount: string
    amount: number
  }
}

/**
 * Reconciles cashier shift end blind cash count against expected drawer cash.
 * Follows strict double-entry ledger posting rules for Hfe Core.
 */
export function reconcileShiftCash(input: ShiftCashInput): ShiftReconciliationResult {
  const expectedCash = input.initialFloat + input.cashSales - input.pettyCashExpenses
  const variance = input.cashCounted - expectedCash

  let status: 'MATCHED' | 'SHORTAGE' | 'OVERAGE' = 'MATCHED'
  let requiresManagerApproval = false
  let debitAccount = '1101 - Kas Kasir (Cash on Hand)'
  let creditAccount = '4101 - Pendapatan Penjualan F&B'

  if (variance < 0) {
    status = 'SHORTAGE'
    requiresManagerApproval = Math.abs(variance) > 25000
    debitAccount = '5109 - Beban Selisih Kas Shift (Cash Shortage)'
    creditAccount = '1101 - Kas Kasir (Cash on Hand)'
  } else if (variance > 0) {
    status = 'OVERAGE'
    requiresManagerApproval = variance > 50000
    debitAccount = '1101 - Kas Kasir (Cash on Hand)'
    creditAccount = '4109 - Pendapatan Lain-lain (Cash Overage)'
  }

  return {
    initialFloat: input.initialFloat,
    cashSales: input.cashSales,
    pettyCashExpenses: input.pettyCashExpenses,
    expectedCash,
    cashCounted: input.cashCounted,
    variance,
    status,
    requiresManagerApproval,
    journalEntry: {
      debitAccount,
      creditAccount,
      amount: Math.abs(variance)
    }
  }
}
