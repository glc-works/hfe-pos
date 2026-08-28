// --- HFE POSTING READ-BACK VALIDATOR (POS-ENG-STD-001 / L2-POS-91) ---
// Pure TypeScript verification module asserting cryptographic and lineage truth of CORE postings

export interface ExpectedPostingContext {
  postingId: string
  expectedBookId: string
  sourceCapability?: string
  sourceObjectId?: string
  stableEffectKey?: string
  expectedCurrency?: string
  expectedAmountMinor?: number
}

export interface ReadbackJournalLine {
  account_code: string
  debit_minor: number | string
  credit_minor: number | string
  description?: string
}

export interface RawCorePosting {
  id: string
  book_id?: string
  source_capability?: string
  source_object_id?: string
  stable_effect_key?: string
  functional_currency?: string
  finality: 'applied' | 'pending' | 'rejected' | 'voided' | string
  posted_at?: string
  lines?: ReadbackJournalLine[]
}

export interface ReadbackValidationResult {
  isValid: boolean
  finality: string
  isApplied: boolean
  isMismatch: boolean
  mismatchReason?: string
  journalLinesCount: number
}

export class HfePostingReadbackValidator {
  /**
   * Validate raw CORE posting against expected context.
   * STRICT FAIL-CLOSED: Fails on any lineage, ID, or finality mismatch.
   */
  static validate(
    expected: ExpectedPostingContext,
    actualPosting: RawCorePosting
  ): ReadbackValidationResult {
    const journalLinesCount = actualPosting?.lines?.length || 0
    const invalid = (mismatchReason: string, isMismatch = true): ReadbackValidationResult => ({
      isValid: false,
      finality: actualPosting?.finality || 'unknown',
      isApplied: false,
      isMismatch,
      mismatchReason,
      journalLinesCount,
    })

    if (!actualPosting || !actualPosting.id || actualPosting.id !== expected.postingId) {
      return invalid(`Posting ID mismatch: expected ${expected.postingId}, got ${actualPosting?.id || 'null'}`)
    }

    const finality = actualPosting.finality?.toLowerCase()
    if (finality !== 'applied') {
      return invalid(`Posting is not finalized. Current finality: ${actualPosting.finality}`, false)
    }

    if (!actualPosting.book_id || actualPosting.book_id !== expected.expectedBookId) {
      return invalid(`Company Book mismatch: expected ${expected.expectedBookId}, got ${actualPosting.book_id || 'missing'}`)
    }

    if (expected.sourceCapability && actualPosting.source_capability !== expected.sourceCapability) {
      return invalid(`Source capability mismatch: expected ${expected.sourceCapability}, got ${actualPosting.source_capability || 'missing'}`)
    }

    if (expected.sourceObjectId && actualPosting.source_object_id !== expected.sourceObjectId) {
      return invalid(`Source object ID mismatch: expected ${expected.sourceObjectId}, got ${actualPosting.source_object_id || 'missing'}`)
    }

    if (expected.stableEffectKey && actualPosting.stable_effect_key !== expected.stableEffectKey) {
      return invalid(`Stable effect key mismatch: expected ${expected.stableEffectKey}, got ${actualPosting.stable_effect_key || 'missing'}`)
    }

    if (expected.expectedCurrency && actualPosting.functional_currency !== expected.expectedCurrency) {
      return invalid(`Functional currency mismatch: expected ${expected.expectedCurrency}, got ${actualPosting.functional_currency || 'missing'}`)
    }

    if (expected.expectedCurrency && !journalLinesCount) {
      return invalid('Posting journal evidence requires positive balanced lines.')
    }
    if (actualPosting.lines?.length) {
      let totalDebit = 0n
      let totalCredit = 0n
      for (const line of actualPosting.lines) {
        const parseMinor = (value: number | string): bigint => {
          const text = String(value)
          if (!/^(0|[1-9][0-9]*)$/.test(text) || (typeof value === 'number' && !Number.isSafeInteger(value))) {
            throw new Error('non-canonical minor-unit value')
          }
          return BigInt(text)
        }
        let debit: bigint
        let credit: bigint
        try {
          debit = parseMinor(line.debit_minor)
          credit = parseMinor(line.credit_minor)
        } catch {
          return invalid('Posting journal lines contain a non-canonical minor-unit value.')
        }
        if (debit === 0n && credit === 0n) {
          return invalid('Posting journal lines must contain a positive debit or credit value.')
        }
        totalDebit += debit
        totalCredit += credit
      }
      if (totalDebit !== totalCredit) {
        return invalid(`Double-entry unbalanced in read-back: debit=${totalDebit} != credit=${totalCredit}`)
      }
    }

    return {
      isValid: true,
      finality: 'applied',
      isApplied: true,
      isMismatch: false,
      journalLinesCount,
    }
  }
}

export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function assertCanonicalCashOrderPayload(
  payload: {
    idempotency_key?: string
    payment_method: string
    tax_pb1_amount: number
    service_fee_amount: number
    discount_amount: number
    items: Array<{ price: number; qty: number }>
    subtotal: number
    grand_total: number
  },
  context: { authorityContext: string },
  action: string
): void {
  if (!context.authorityContext.trim()) {
    throw new Error(`authorityContext is required for POS ${action}. Fail-closed: zero fallback allowed.`)
  }
  if (!payload.idempotency_key) {
    throw new Error(`idempotency_key is required for canonical POS ${action} and retry stability.`)
  }
  if (payload.payment_method !== 'cash') {
    throw new Error(`Canonical CORE POS ${action} is cash-only until governed tender semantics are available.`)
  }
  if (payload.tax_pb1_amount !== 0 || payload.service_fee_amount !== 0 || payload.discount_amount !== 0) {
    throw new Error(`Canonical CORE POS ${action} does not yet support tax, fee, or discount amounts.`)
  }
  if (payload.items.length === 0) {
    throw new Error(`Canonical CORE POS ${action} requires at least one real order item.`)
  }
  const itemSubtotal = payload.items.reduce((total, item) => total + item.price * item.qty, 0)
  if (itemSubtotal !== payload.subtotal || itemSubtotal !== payload.grand_total) {
    throw new Error(`POS amount mismatch: item subtotal, subtotal, and grand total must be identical for ${action}.`)
  }
}
