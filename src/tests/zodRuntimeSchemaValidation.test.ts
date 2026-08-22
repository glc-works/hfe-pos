import { describe, it, expect } from 'vitest'
import {
  UniversalMultiTenderRequestSchema,
  TenderItemSchema,
  OfflineQueuedIntentSchema,
} from '../schemas/financialSchemas'

describe('Zod Runtime Schema Validation & Anti-Crash Guard Suite', () => {
  it('successfully validates a mathematically sound multi-tender request', () => {
    const validPayload = {
      document_reference_id: 'DOC-TX-10029',
      total_obligation_minor: 100000,
      tenders: [
        { tender_type: 'cash', amount_minor: 50000 },
        { tender_type: 'qris', amount_minor: 50000, reference_id: 'QRIS-REF-99' },
      ],
      discrepancies: [],
      notes: 'Split payment cash and QRIS',
    }

    const result = UniversalMultiTenderRequestSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects an unbalanced multi-tender request where sum of tenders does not equal total obligation', () => {
    const invalidPayload = {
      document_reference_id: 'DOC-TX-10030',
      total_obligation_minor: 100000,
      tenders: [
        { tender_type: 'cash', amount_minor: 40000 }, // Total = 40.000, expected 100.000
      ],
    }

    const result = UniversalMultiTenderRequestSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Mathematical Discrepancy')
    }
  })

  it('rejects negative tender amounts', () => {
    const invalidTender = {
      tender_type: 'cash',
      amount_minor: -5000,
    }

    const result = TenderItemSchema.safeParse(invalidTender)
    expect(result.success).toBe(false)
  })

  it('validates offline queued intents with strict UUID v4 idempotency keys and ISO timestamps', () => {
    const validIntent = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      bookId: 'BOOK-CAFE-HQ-88',
      status: 'pending_sync',
      queuedAt: new Date().toISOString(),
      payload: { total_obligation_minor: 50000 },
      retryCount: 0,
    }

    const result = OfflineQueuedIntentSchema.safeParse(validIntent)
    expect(result.success).toBe(true)
  })

  it('rejects offline queued intents with invalid UUID or malformed timestamp', () => {
    const invalidIntent = {
      id: 'not-a-valid-uuid',
      bookId: 'BOOK-CAFE-HQ-88',
      status: 'pending_sync',
      queuedAt: 'invalid-date-string',
      payload: {},
      retryCount: 0,
    }

    const result = OfflineQueuedIntentSchema.safeParse(invalidIntent)
    expect(result.success).toBe(false)
  })
})
