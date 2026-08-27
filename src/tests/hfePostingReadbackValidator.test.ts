import { describe, it, expect } from 'vitest'
import {
  HfePostingReadbackValidator,
  generateUUIDv4,
  assertCanonicalCashOrderPayload,
  type ExpectedPostingContext,
  type RawCorePosting,
} from '../services/financial/HfePostingReadbackValidator'

describe('L2-POS-91: HfePostingReadbackValidator & Cash Order Payload Invariants', () => {
  const validContext: ExpectedPostingContext = {
    postingId: 'post-001',
    expectedBookId: 'BOOK-CAFE-HQ-88',
    sourceCapability: 'pos_order',
    sourceObjectId: 'order-001',
    stableEffectKey: 'key-post-001',
  }

  const validPosting: RawCorePosting = {
    id: 'post-001',
    book_id: 'BOOK-CAFE-HQ-88',
    source_capability: 'pos_order',
    source_object_id: 'order-001',
    stable_effect_key: 'key-post-001',
    finality: 'applied',
    posted_at: '2026-08-27T00:00:00Z',
    lines: [
      { account_code: '1101', debit_minor: 50000, credit_minor: 0, description: 'Cash Float' },
      { account_code: '4101', debit_minor: 0, credit_minor: 50000, description: 'Sales' },
    ],
  }

  it('validates exact applied posting with balanced journal lines', () => {
    const result = HfePostingReadbackValidator.validate(validContext, validPosting)
    expect(result.isValid).toBe(true)
    expect(result.isApplied).toBe(true)
    expect(result.isMismatch).toBe(false)
    expect(result.journalLinesCount).toBe(2)
  })

  it('fails fail-closed if posting ID does not match expected ID', () => {
    const invalidPosting = { ...validPosting, id: 'post-999' }
    const result = HfePostingReadbackValidator.validate(validContext, invalidPosting)
    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Posting ID mismatch')
  })

  it('fails fail-closed if finality is pending rather than applied', () => {
    const pendingPosting = { ...validPosting, finality: 'pending' }
    const result = HfePostingReadbackValidator.validate(validContext, pendingPosting)
    expect(result.isValid).toBe(false)
    expect(result.isApplied).toBe(false)
    expect(result.mismatchReason).toContain('Posting is not finalized')
  })

  it.each([
    ['book_id', 'Company Book'],
    ['source_capability', 'Source capability'],
    ['source_object_id', 'Source object ID'],
    ['stable_effect_key', 'Stable effect key'],
  ] as const)('fails fail-closed if required %s is missing', (field, reason) => {
    const postingWithoutRequiredField = { ...validPosting }
    delete postingWithoutRequiredField[field]

    const result = HfePostingReadbackValidator.validate(validContext, postingWithoutRequiredField)

    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain(reason)
  })

  it('fails fail-closed if the Posting belongs to a foreign Company Book', () => {
    const foreignPosting = { ...validPosting, book_id: 'BOOK-FOREIGN-99' }
    const result = HfePostingReadbackValidator.validate(validContext, foreignPosting)

    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Company Book mismatch')
  })

  it('fails fail-closed if source capability differs from pos_order', () => {
    const mismatchPosting = { ...validPosting, source_capability: 'invoice' }
    const result = HfePostingReadbackValidator.validate(validContext, mismatchPosting)
    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Source capability mismatch')
  })

  it('fails fail-closed if source object ID differs from order ID', () => {
    const mismatchPosting = { ...validPosting, source_object_id: 'order-999' }
    const result = HfePostingReadbackValidator.validate(validContext, mismatchPosting)
    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Source object ID mismatch')
  })

  it('fails fail-closed if stable effect key differs', () => {
    const mismatchPosting = { ...validPosting, stable_effect_key: 'key-other' }
    const result = HfePostingReadbackValidator.validate(validContext, mismatchPosting)
    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Stable effect key mismatch')
  })

  it('fails fail-closed if debit and credit lines are unbalanced', () => {
    const unbalancedPosting: RawCorePosting = {
      ...validPosting,
      lines: [
        { account_code: '1101', debit_minor: 50000, credit_minor: 0 },
        { account_code: '4101', debit_minor: 0, credit_minor: 40000 },
      ],
    }
    const result = HfePostingReadbackValidator.validate(validContext, unbalancedPosting)
    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('Double-entry unbalanced')
  })

  it('generates valid UUID v4 string', () => {
    const uuid = generateUUIDv4()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('assertCanonicalCashOrderPayload enforces fail-closed checks', () => {
    const validPayload = {
      idempotency_key: 'key-123',
      payment_method: 'cash',
      tax_pb1_amount: 0,
      service_fee_amount: 0,
      discount_amount: 0,
      items: [{ price: 35000, qty: 1 }],
      subtotal: 35000,
      grand_total: 35000,
    }
    const validAuth = { authorityContext: 'AUTH-VALID-88' }

    expect(() => assertCanonicalCashOrderPayload(validPayload, validAuth, 'posting')).not.toThrow()

    expect(() =>
      assertCanonicalCashOrderPayload(validPayload, { authorityContext: '' }, 'posting')
    ).toThrow('authorityContext is required')

    expect(() =>
      assertCanonicalCashOrderPayload({ ...validPayload, idempotency_key: '' }, validAuth, 'posting')
    ).toThrow('idempotency_key is required')

    expect(() =>
      assertCanonicalCashOrderPayload({ ...validPayload, payment_method: 'qris' }, validAuth, 'posting')
    ).toThrow('cash-only')
  })
})
