export type CheckoutAttemptKind = 'governed' | 'legacy'
export const CHECKOUT_ATTEMPT_SCHEMA_VERSION = 1 as const

interface CleanupRecord {
  recordKind?: CheckoutAttemptKind
  schemaVersion?: number
  bookId: string
  scopeFingerprint?: string
  idempotencyKey: string
  payload: unknown
  response?: unknown
  acceptedOrder?: unknown
}

function inferredKind(record: CleanupRecord): CheckoutAttemptKind {
  const payload = record.payload as Record<string, unknown>
  const items = Array.isArray(payload.items) ? payload.items as Array<Record<string, unknown>> : []
  return record.acceptedOrder || 'outlet_id' in payload || 'terminal_id' in payload || 'currency' in payload ||
    'promotion_codes' in payload || items.some((item) => 'quantity' in item)
    ? 'governed'
    : 'legacy'
}

export function checkoutAttemptKind(record: CleanupRecord): CheckoutAttemptKind {
  const inferred = inferredKind(record)
  if (record.recordKind) {
    if (record.schemaVersion !== CHECKOUT_ATTEMPT_SCHEMA_VERSION) throw new Error('Unsupported checkout attempt schema version.')
    if (record.recordKind === 'legacy' && inferred === 'governed') {
      throw new Error('Checkout attempt discriminator conflicts with governed evidence.')
    }
    return record.recordKind
  }
  return inferred
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? '"__undefined__"'
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  return `{${Object.keys(value as object).sort().map((key) => (
    `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`
  )).join(',')}}`
}

export function canonicalCleanupEvidence(record: CleanupRecord): string {
  const recordKind = checkoutAttemptKind(record)
  return canonical({
    schemaVersion: record.schemaVersion ?? CHECKOUT_ATTEMPT_SCHEMA_VERSION,
    recordKind,
    bookId: record.bookId,
    scopeFingerprint: record.scopeFingerprint,
    idempotencyKey: record.idempotencyKey,
    payload: record.payload,
    response: record.response,
    acceptedOrder: record.acceptedOrder,
  })
}
