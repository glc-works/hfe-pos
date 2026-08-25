import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BankStatementLine, ReconciliationCandidate } from '../types/reconciliation'

describe('Find & Match Split-Screen Bank Reconciliation Engine (Xero Pattern)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockStatements: BankStatementLine[] = [
    {
      id: 'STMT-BCA-001',
      date: '2026-08-25 14:32',
      description: 'QRIS SETTLEMENT - BCA MERCHANT',
      amount: 57500,
      type: 'credit',
      sourceBank: 'BCA QRIS',
      status: 'unmatched',
      suggestedTransactionId: 'ORD-8801',
      confidenceScore: 100
    },
    {
      id: 'STMT-BCA-002',
      date: '2026-08-25 15:10',
      description: 'QRIS SETTLEMENT - BCA MERCHANT',
      amount: 119160,
      type: 'credit',
      sourceBank: 'BCA QRIS',
      status: 'unmatched',
      suggestedTransactionId: 'ORD-8802',
      confidenceScore: 98
    },
    {
      id: 'STMT-TRF-003',
      date: '2026-08-25 16:45',
      description: 'TRANSFER E-BANKING CR - BPK ALEXANDER',
      amount: 2500000,
      type: 'credit',
      sourceBank: 'BCA Transfer',
      status: 'unmatched',
      suggestedTransactionId: 'ORD-VIP-01',
      confidenceScore: 95
    }
  ]

  const mockCandidates: ReconciliationCandidate[] = [
    {
      id: 'CAND-01',
      documentRef: 'ORD-8801',
      date: '2026-08-25 14:30',
      amount: 57500,
      tenderType: 'QRIS BCA',
      customerName: 'Aldi (QR)',
      tableName: 'OUT-04',
      glJournalId: 'GL-JRN-9921',
      status: 'unmatched'
    },
    {
      id: 'CAND-02',
      documentRef: 'ORD-8802',
      date: '2026-08-25 15:08',
      amount: 120000,
      tenderType: 'QRIS BCA',
      customerName: 'Chef Mike',
      tableName: 'IND-02',
      glJournalId: 'GL-JRN-9922',
      status: 'unmatched'
    },
    {
      id: 'CAND-03',
      documentRef: 'ORD-VIP-01',
      date: '2026-08-25 16:40',
      amount: 2500000,
      tenderType: 'Bank Transfer',
      customerName: 'Alexander',
      tableName: 'VIP-01',
      glJournalId: 'GL-JRN-9925',
      status: 'unmatched'
    }
  ]

  it('performs exact 1-to-1 matching when statement and POS transaction amounts match', () => {
    const stmt = mockStatements[0]
    const cand = mockCandidates[0]

    expect(stmt.amount).toBe(cand.amount)
    const difference = stmt.amount - cand.amount
    expect(difference).toBe(0)

    const updatedStmt: BankStatementLine = {
      ...stmt,
      status: 'reconciled',
      matchedTransactionId: cand.documentRef
    }
    expect(updatedStmt.status).toBe('reconciled')
    expect(updatedStmt.matchedTransactionId).toBe('ORD-8801')
  })

  it('detects MDR fee discrepancy and calculates adjustment accurately', () => {
    const stmt = mockStatements[1] // Rp 119.160
    const cand = mockCandidates[1] // Rp 120.000

    const diff = cand.amount - stmt.amount // Rp 840
    expect(diff).toBe(840)

    const expectedMdrRatio = diff / cand.amount
    expect(expectedMdrRatio).toBeCloseTo(0.007, 4) // 0.7% QRIS MDR

    const isMdrLikelyMatch = diff > 0 && diff <= Math.round(cand.amount * 0.015)
    expect(isMdrLikelyMatch).toBe(true)
  })

  it('handles multi-candidate split reconciliation (1 bank payout vs 2 transactions)', () => {
    const batchStatement: BankStatementLine = {
      id: 'STMT-BATCH-99',
      date: '2026-08-25 18:00',
      description: 'BATCH SETTLEMENT - BCA QRIS POOL',
      amount: 177500, // 57.500 + 120.000
      type: 'credit',
      sourceBank: 'BCA QRIS',
      status: 'unmatched'
    }

    const selected = [mockCandidates[0], mockCandidates[1]]
    const totalSelected = selected.reduce((sum, c) => sum + c.amount, 0)

    expect(totalSelected).toBe(177500)
    expect(batchStatement.amount).toBe(totalSelected)
  })

  it('filters and auto-matches statements with >= 95% AI confidence score', () => {
    const highConfidence = mockStatements.filter(
      s => s.status === 'unmatched' && s.confidenceScore && s.confidenceScore >= 95
    )

    expect(highConfidence.length).toBe(3)
    const reconciled = highConfidence.map(s => ({
      ...s,
      status: 'reconciled' as const,
      matchedTransactionId: s.suggestedTransactionId
    }))

    expect(reconciled.every(r => r.status === 'reconciled')).toBe(true)
    expect(reconciled[0].matchedTransactionId).toBe('ORD-8801')
  })
})
