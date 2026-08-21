import { describe, expect, it, vi } from 'vitest'
import { runFlagshipStatefulProof } from '../../scripts/flagship-stateful-proof'

describe('flagship stateful proof command', () => {
  it('returns secret-free canonical posting evidence', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          settlement_id: 'SETTLEMENT-001',
          document_reference_id: 'ORDER-001',
          total_obligation_minor: 150000,
          total_tendered_minor: 150000,
          total_discrepancy_minor: 0,
          status: 'settled',
          settled_at: '2026-08-21T06:00:00.000Z',
          journal_posting_id: 'POSTING-001',
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          book_id: 'BOOK-001',
          finality: 'final',
          financial_date: '2026-08-21',
          functional_currency: 'IDR',
          id: 'POSTING-001',
          source_capability: 'pos',
          source_object_id: 'ORDER-001',
          source_version: 1,
          stable_effect_key: 'IDEMPOTENCY-001',
          state_revision: 8,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          settlement_id: 'SETTLEMENT-001',
          document_reference_id: 'ORDER-001',
          total_obligation_minor: 150000,
          total_tendered_minor: 150000,
          total_discrepancy_minor: 0,
          status: 'settled',
          settled_at: '2026-08-21T06:00:00.000Z',
          journal_posting_id: 'POSTING-001',
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          book_id: 'BOOK-001',
          finality: 'final',
          financial_date: '2026-08-21',
          functional_currency: 'IDR',
          id: 'POSTING-001',
          source_capability: 'pos',
          source_object_id: 'ORDER-001',
          source_version: 1,
          stable_effect_key: 'IDEMPOTENCY-001',
          state_revision: 8,
        }),
      } as Response)

    const evidence = await runFlagshipStatefulProof({
      HFE_CORE_ENVIRONMENT: 'staging',
      HFE_CORE_BASE_URL: 'https://stg-api.hfeit.app',
      HFE_CORE_COMPANY_BOOK_ID: 'BOOK-001',
      HFE_CORE_AUTHORITY_CONTEXT_ID: 'AUTHORITY-001',
      HFE_CORE_ACCESS_TOKEN: 'must-not-appear',
      HFE_CORE_ADMISSION_RECEIPT_ID: 'ADMISSION-001',
      HFE_CORE_ADMISSION_PARTICIPANT_ID: 'PARTICIPANT-001',
      HFE_CORE_ADMISSION_SCOPE: 'flagship-pos-demo',
      HFE_CORE_ADMISSION_APPROVED_BY: 'founder@hfeit.com',
      HFE_CORE_ADMISSION_APPROVED_AT: '2026-08-20T00:00:00.000Z',
      HFE_CORE_ADMISSION_EXPIRES_AT: '2026-08-30T00:00:00.000Z',
      HFE_POS_DOCUMENT_REFERENCE_ID: 'ORDER-001',
      HFE_POS_TOTAL_OBLIGATION_MINOR: '150000',
      HFE_POS_IDEMPOTENCY_KEY: 'IDEMPOTENCY-001',
    }, new Date('2026-08-21T06:01:00.000Z'), fetchFn)

    expect(evidence.result).toBe('pass')
    expect(evidence.postingId).toBe('POSTING-001')
    expect(evidence.postingStateRevision).toBe('8')
    expect(evidence.sourceObjectId).toBe('ORDER-001')
    expect(evidence.stableEffectKey).toBe('IDEMPOTENCY-001')
    expect(evidence.idempotencyReplayVerified).toBe(true)
    expect(evidence.admissionParticipantId).toBe('PARTICIPANT-001')
    expect(evidence.admissionScope).toBe('flagship-pos-demo')
    expect(fetchFn).toHaveBeenCalledTimes(4)
    expect(JSON.stringify(evidence)).not.toContain('must-not-appear')
  })
})
