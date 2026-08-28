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
  if (record.scopeFingerprint) return 'governed'
  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) return 'governed'
  const payload = record.payload as Record<string, unknown>
  const items = Array.isArray(payload.items) ? payload.items as Array<Record<string, unknown>> : []
  return record.acceptedOrder || 'outlet_id' in payload || 'terminal_id' in payload || 'currency' in payload ||
    'promotion_codes' in payload || items.some((item) => 'quantity' in item)
    ? 'governed'
    : 'legacy'
}

export function checkoutAttemptKind(record: CleanupRecord): CheckoutAttemptKind {
  if (record.schemaVersion !== undefined && !record.recordKind) {
    throw new Error('Versioned checkout attempt is missing its record kind discriminator.')
  }
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
  if (value === null) return 'N;'
  if (typeof value === 'string') return `S${value.length}:${value}`
  if (typeof value === 'boolean') return value ? 'B1;' : 'B0;'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Cleanup evidence contains a non-finite number.')
    return Object.is(value, -0) ? 'D-0;' : `D${value};`
  }
  if (value === undefined) throw new Error('Cleanup evidence contains undefined.')
  if (Array.isArray(value)) return `A${value.length}:${value.map(canonical).join('')}`
  if (typeof value !== 'object' || (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
    throw new Error('Cleanup evidence contains an unsupported value.')
  }
  const keys = Object.keys(value).sort()
  return `O${keys.length}:${keys.map((key) => `K${key.length}:${key}${canonical((value as Record<string, unknown>)[key])}`).join('')}`
}

export function canonicalCleanupEvidence(record: CleanupRecord): string {
  const recordKind = checkoutAttemptKind(record)
  return canonical({
    schemaVersion: record.schemaVersion ?? CHECKOUT_ATTEMPT_SCHEMA_VERSION,
    recordKind,
    bookId: record.bookId,
    scopeFingerprint: record.scopeFingerprint ?? null,
    idempotencyKey: record.idempotencyKey,
    payload: record.payload,
    response: record.response ?? null,
    acceptedOrder: record.acceptedOrder ?? null,
  })
}
