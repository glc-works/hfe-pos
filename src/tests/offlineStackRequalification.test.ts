import { describe, it, expect, beforeEach } from 'vitest'
import { isIndexedDbConstraintError, OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import {
  deriveGovernedCheckoutPhaseKey,
} from '../services/financial/GovernedPosCheckout'
import { HfePostingReadbackValidator } from '../services/financial/HfePostingReadbackValidator'
import type { CheckoutAttemptRecord } from '../services/financial/CafeCheckoutAttemptCoordinator'
import type { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'

describe('Offline Stack Re-Qualification & Idempotent Reconnect Gating (Issue #61)', () => {
  let queue: OfflineIntentQueue<SubmitRetailTransactionPayload>

  beforeEach(() => {
    queue = new OfflineIntentQueue<SubmitRetailTransactionPayload>()
  })

  it('recognizes structural ConstraintError values across browser realms', () => {
    expect(isIndexedDbConstraintError({ name: 'ConstraintError' })).toBe(true)
    expect(isIndexedDbConstraintError(Object.assign(new Error('duplicate'), { name: 'ConstraintError' }))).toBe(true)
    expect(isIndexedDbConstraintError({ name: 'QuotaExceededError' })).toBe(false)
    expect(isIndexedDbConstraintError(null)).toBe(false)
  })

  it('persists and retrieves checkout attempt records across store instances', async () => {
    const rootKey = 'ROOT-TEST-PERSISTED-IDENTITY'
    const record: CheckoutAttemptRecord<SubmitRetailTransactionPayload> = {
      checkoutKey: 'TABLE-04-123456',
      idempotencyKey: rootKey,
      bookId: 'BOOK-CAFE-HQ-88',
      payloadFingerprint: 'fp-123456',
      createdAt: '2026-08-25T00:00:00.000Z',
      updatedAt: '2026-08-25T00:00:00.000Z',
      status: 'prepared',
      payload: {
        table_id: '04',
        contact_id: 'CUST-ANON',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [{ product_id: 'ITEM-01', name: 'Espresso', price: 28000, qty: 1, hfe_gl_account: '4101' }],
        subtotal: 86000,
        tax_pb1_amount: 0,
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: 86000,
      },
    }

    await queue.put(record)

    // Simulate re-instantiating the queue (e.g. after page refresh)
    const freshQueue = new OfflineIntentQueue<SubmitRetailTransactionPayload>()
    const retrieved = await freshQueue.get('TABLE-04-123456')

    expect(retrieved).not.toBeNull()
    expect(retrieved?.idempotencyKey).toBe(rootKey)
    expect(retrieved?.status).toBe('prepared')
  })

  it('atomically creates one checkout root across two offline-store instances', async () => {
    const checkoutKey = `TABLE-CONCURRENT-${crypto.randomUUID()}`
    const candidate = (idempotencyKey: string): CheckoutAttemptRecord<SubmitRetailTransactionPayload> => ({
      checkoutKey, idempotencyKey, bookId: 'BOOK-CAFE-HQ-88', payloadFingerprint: 'fp-concurrent',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'prepared',
      payload: { ...({} as SubmitRetailTransactionPayload), idempotency_key: idempotencyKey },
    })
    const first = new OfflineIntentQueue<SubmitRetailTransactionPayload>()
    const second = new OfflineIntentQueue<SubmitRetailTransactionPayload>()

    const [a, b] = await Promise.all([
      first.createIfAbsent(candidate('ROOT-A')),
      second.createIfAbsent(candidate('ROOT-B')),
    ])

    expect(a.idempotencyKey).toBe(b.idempotencyKey)
    expect((await first.get(checkoutKey))?.idempotencyKey).toBe(a.idempotencyKey)
  })

  it('strictly derives deterministic phase keys from the exact root idempotency key', () => {
    const rootKey = '550e8400-e29b-41d4-a716-446655440000'

    const quoteKey = deriveGovernedCheckoutPhaseKey(rootKey, 'quote')
    const acceptKey = deriveGovernedCheckoutPhaseKey(rootKey, 'accept')
    const confirmKey = deriveGovernedCheckoutPhaseKey(rootKey, 'confirm')

    expect(quoteKey).toBe(`${rootKey}:quote`)
    expect(acceptKey).toBe(`${rootKey}:accept`)
    expect(confirmKey).toBe(`${rootKey}:confirm`)
  })

  it('guarantees that retry on reconnect reuses the same root idempotency key without mutation drift', async () => {
    const rootKey = 'ROOT-TEST-RECONNECT-IDENTITY'
    const record: CheckoutAttemptRecord<SubmitRetailTransactionPayload> = {
      checkoutKey: 'TABLE-04-RETRY',
      idempotencyKey: rootKey,
      bookId: 'BOOK-CAFE-HQ-88',
      payloadFingerprint: 'fp-retry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'outcome_unknown',
      payload: {
        table_id: '04',
        contact_id: 'CUST-ANON',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [{ product_id: 'ITEM-02', name: 'Latte', price: 35000, qty: 1, hfe_gl_account: '4101' }],
        subtotal: 57500,
        tax_pb1_amount: 0,
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: 57500,
      },
    }

    await queue.put(record)

    // On network reconnect, retrieving the attempt reuses the root key
    const retrieved = await queue.get('TABLE-04-RETRY')
    expect(retrieved?.idempotencyKey).toBe(rootKey)

    // Derived confirmation key on retry matches the original lineage
    const confirmKey = deriveGovernedCheckoutPhaseKey(retrieved!.idempotencyKey, 'confirm')
    expect(confirmKey).toBe(`${rootKey}:confirm`)
  })

  it('fails closed and refuses to advance to posted without valid CORE read-back evidence', () => {
    // Unbalanced/mismatched receipt should fail
    const invalidReceipt = {
      id: 'POSTING-SYNTHETIC-001',
      book_id: 'BOOK-CAFE-HQ-88',
      finality: 'applied',
      source_capability: 'pos_tender_sale',
      source_object_id: 'TENDER-001',
      stable_effect_key: 'e'.repeat(64),
      lines: [
        { account_code: '1101', debit_minor: '86000', credit_minor: '0' },
        { account_code: '4101', debit_minor: '0', credit_minor: '50000' }, // Unbalanced!
      ],
    }

    const result = HfePostingReadbackValidator.validate(
      {
        postingId: 'POSTING-SYNTHETIC-001',
        expectedBookId: 'BOOK-CAFE-HQ-88',
        sourceCapability: 'pos_tender_sale',
        sourceObjectId: 'TENDER-001',
        stableEffectKey: 'e'.repeat(64),
      },
      invalidReceipt
    )

    expect(result.isValid).toBe(false)
    expect(result.isMismatch).toBe(true)
    expect(result.mismatchReason).toContain('unbalanced')
  })

  it('cleans up attempt storage upon confirmed durable finality', async () => {
    const record: CheckoutAttemptRecord<SubmitRetailTransactionPayload> = {
      checkoutKey: 'TABLE-CLEANUP',
      idempotencyKey: '01a035df-clean-01',
      bookId: 'BOOK-CAFE-HQ-88',
      payloadFingerprint: 'fp-clean',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'posted',
      payload: {
        table_id: '04',
        contact_id: 'CUST-ANON',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [],
        subtotal: 86000,
        tax_pb1_amount: 0,
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: 86000,
      },
    }

    await queue.put(record)
    expect(await queue.get('TABLE-CLEANUP')).not.toBeNull()

    await queue.remove('TABLE-CLEANUP')
    expect(await queue.get('TABLE-CLEANUP')).toBeNull()
  })
})
