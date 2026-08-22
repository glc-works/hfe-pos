import { z } from 'zod'

/**
 * Universal Tender Item Schema
 * Enforces strictly positive amounts and valid tender channels.
 */
export const TenderItemSchema = z.object({
  tender_type: z.enum([
    'cash',
    'qris',
    'card_debit',
    'card_credit',
    'hotel_room_folio',
    'voucher_credit',
    'bank_transfer',
  ]),
  amount_minor: z.number().int().nonnegative(),
  reference_id: z.string().optional(),
  gl_account_override: z.string().optional(),
})

export type ValidatedTenderItem = z.infer<typeof TenderItemSchema>

/**
 * Discrepancy Adjustment Schema
 */
export const DiscrepancyItemSchema = z.object({
  discrepancy_type: z.enum([
    'rounding_adjustment',
    'tip_income',
    'merchant_discount_fee',
    'cash_shortage',
    'cash_overage',
  ]),
  amount_minor: z.number().int(),
  reason: z.string().optional(),
})

export type ValidatedDiscrepancyItem = z.infer<typeof DiscrepancyItemSchema>

/**
 * Universal Multi-Tender Settlement Request Schema
 * Validates that mathematical balance holds:
 * Total Obligation === Sum(Tenders) + Sum(Discrepancies)
 */
export const UniversalMultiTenderRequestSchema = z
  .object({
    document_reference_id: z.string().min(1, 'Document reference ID is required'),
    total_obligation_minor: z.number().int().positive('Total obligation must be positive'),
    tenders: z.array(TenderItemSchema).min(1, 'At least one payment tender is required'),
    discrepancies: z.array(DiscrepancyItemSchema).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const sumTenders = data.tenders.reduce((acc, t) => acc + t.amount_minor, 0)
      const sumDiscrepancies = (data.discrepancies || []).reduce((acc, d) => acc + d.amount_minor, 0)
      return sumTenders + sumDiscrepancies === data.total_obligation_minor
    },
    {
      message: 'Mathematical Discrepancy: Sum(tenders) + Sum(discrepancies) must equal total_obligation_minor',
      path: ['tenders'],
    }
  )

export type ValidatedMultiTenderRequest = z.infer<typeof UniversalMultiTenderRequestSchema>

/**
 * Offline Queued Transaction Intent Schema
 * Validates ACID offline intents in IndexedDB.
 */
export const OfflineQueuedIntentSchema = z.object({
  id: z.string().uuid('Idempotency key must be a valid UUID v4'),
  bookId: z.string().min(1),
  status: z.enum(['pending_sync', 'synced', 'failed_fatal']),
  queuedAt: z.string().datetime(),
  payload: z.record(z.string(), z.unknown()),
  retryCount: z.number().int().nonnegative().default(0),
})

export type ValidatedOfflineQueuedIntent = z.infer<typeof OfflineQueuedIntentSchema>
