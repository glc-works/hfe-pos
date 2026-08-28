import type {
  GovernedRetailCheckoutPayload,
  PersistedRetailCheckoutPayload,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'
import type {
  GovernedCheckoutDurability,
  GovernedCheckoutEvidence,
  GovernedCheckoutPhase,
} from './GovernedCheckoutDurability'
import { generatePayloadChecksum } from '../../utils/cryptoHasher'
import {
  canonicalCleanupEvidence,
  CHECKOUT_ATTEMPT_SCHEMA_VERSION,
  checkoutAttemptKind,
  type CheckoutAttemptKind,
} from './CheckoutCleanupEvidence'

export type CheckoutAttemptStatus = GovernedCheckoutPhase

export interface CheckoutAttemptRecord<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> {
  recordKind?: CheckoutAttemptKind
  schemaVersion?: number
  checkoutKey: string
  bookId: string
  idempotencyKey: string
  payloadFingerprint: string
  scopeFingerprint?: string
  payload: TPayload
  status: CheckoutAttemptStatus
  createdAt: string
  updatedAt: string
  mutationSentAt?: string
  lastError?: string
  response?: SubmitRetailTransactionResponse
  quote?: GovernedCheckoutEvidence['quote']
  qrisIntent?: GovernedCheckoutEvidence['qrisIntent']
  acceptedOrder?: GovernedCheckoutEvidence['acceptedOrder']
  cashConfirm?: GovernedCheckoutEvidence['cashConfirm']
  cleanupEvidenceFingerprint?: string
}

export interface PostedDeleteExpectation {
  bookId: string
  scopeFingerprint?: string
  idempotencyKey: string
  canonicalEvidence: string
}

export interface CheckoutAttemptStore<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> {
  get(checkoutKey: string): Promise<CheckoutAttemptRecord<TPayload> | null>
  createIfAbsent(record: CheckoutAttemptRecord<TPayload>): Promise<CheckoutAttemptRecord<TPayload>>
  put(record: CheckoutAttemptRecord<TPayload>): Promise<void>
  remove(checkoutKey: string): Promise<void>
  compareAndDeletePosted(checkoutKey: string, expected: PostedDeleteExpectation): Promise<boolean>
  findPosted(bookId: string, scopeFingerprint: string): Promise<CheckoutAttemptRecord<TPayload>[]>
}

export interface CheckoutAttemptScope {
  organizationId: string
  authorityContext: string
  cashierId: string
  actorPrincipalId: string
}

export type CheckoutAttemptResult<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> =
  | { kind: 'posted'; response: SubmitRetailTransactionResponse }
  | { kind: 'pending'; response: SubmitRetailTransactionResponse }
  | { kind: 'outcome_unknown'; message: string }
  | { kind: 'validation_failed'; message: string }
  | { kind: 'operator_action_required'; attempt: CheckoutAttemptRecord<TPayload> }
  | { kind: 'already_in_progress' }

interface ExecuteCheckoutAttempt<TPayload extends PersistedRetailCheckoutPayload> {
  checkoutKey: string
  bookId: string
  payload: TPayload
  scope?: CheckoutAttemptScope
  post: (
    payload: TPayload,
    attempt: CheckoutAttemptRecord<TPayload>,
    markMutationSent: () => Promise<void>,
  ) => Promise<SubmitRetailTransactionResponse>
  reconcile?: (
    payload: TPayload,
    attempt: CheckoutAttemptRecord<TPayload>,
  ) => Promise<SubmitRetailTransactionResponse>
  resumeExisting?: boolean
}

export class CafeCheckoutAttemptCoordinator<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> {
  private readonly inFlight = new Set<string>()

  constructor(
    private readonly store: CheckoutAttemptStore<TPayload>,
    private readonly createIdempotencyKey: () => string = () => crypto.randomUUID(),
  ) {}

  async acknowledgePosted(checkoutKey: string, bookId?: string, scope?: CheckoutAttemptScope): Promise<void> {
    const attempt = await this.store.get(checkoutKey)
    if (!attempt || attempt.status !== 'posted') {
      throw new Error('Only a durably posted checkout attempt can be acknowledged.')
    }
    const governed = checkoutAttemptKind(attempt) === 'governed'
    if (governed && (!bookId || !scope)) {
      throw new Error('Governed posted acknowledgement requires exact book and scope binding.')
    }
    const scopeFingerprint = scope ? await checkoutScopeFingerprint(scope) : undefined
    if (bookId && attempt.bookId !== bookId) throw new Error('Posted acknowledgement book binding mismatch.')
    if (scope && attempt.scopeFingerprint !== scopeFingerprint) throw new Error('Posted acknowledgement scope binding mismatch.')
    await assertDurablePostedEvidence(attempt)
    const deleted = await this.store.compareAndDeletePosted(checkoutKey, {
      bookId: attempt.bookId, scopeFingerprint: attempt.scopeFingerprint,
      idempotencyKey: attempt.idempotencyKey, canonicalEvidence: canonicalCleanupEvidence(attempt),
    })
    if (!deleted) throw new Error('Durable posted acknowledgement changed before atomic cleanup; record retained.')
  }

  async findPostedForAcknowledgement(
    bookId: string,
    scope: CheckoutAttemptScope,
  ): Promise<CheckoutAttemptRecord<TPayload> | null> {
    const scopeFingerprint = await checkoutScopeFingerprint(scope)
    const attempts = await this.store.findPosted(bookId, scopeFingerprint)
    if (attempts.length > 1) {
      throw new Error('Multiple durable posted checkout attempts require explicit operator resolution.')
    }
    const attempt = attempts[0]
    if (!attempt) return null
    if (attempt.bookId !== bookId || attempt.scopeFingerprint !== scopeFingerprint) {
      throw new Error('Durable posted checkout attempt organization or authority scope changed. Fail-closed.')
    }
    await assertDurablePostedEvidence(attempt)
    return attempt
  }

  /** Persist the one logical attempt before its first quote request. */
  async prepare(
    checkoutKey: string,
    bookId: string,
    payload: TPayload,
    scope?: CheckoutAttemptScope,
  ): Promise<CheckoutAttemptRecord<TPayload>> {
    requireGovernedScope(payload, scope)
    const payloadFingerprint = await generatePayloadChecksum({ ...payload, idempotency_key: undefined })
    const scopeFingerprint = scope ? await checkoutScopeFingerprint(scope) : undefined
    const existing = await this.store.get(checkoutKey)
    if (existing) {
      assertAttemptIdentity(existing, bookId, payloadFingerprint, scopeFingerprint)
      return existing
    }
    const now = new Date().toISOString()
    const idempotencyKey = payload.idempotency_key || this.createIdempotencyKey()
    const attempt: CheckoutAttemptRecord<TPayload> = {
      recordKind: 'outlet_id' in payload ? 'governed' : 'legacy',
      schemaVersion: CHECKOUT_ATTEMPT_SCHEMA_VERSION,
      checkoutKey,
      bookId,
      idempotencyKey,
      payloadFingerprint,
      scopeFingerprint,
      payload: { ...payload, idempotency_key: idempotencyKey } as TPayload,
      status: 'prepared',
      createdAt: now,
      updatedAt: now,
    }
    const winner = await this.store.createIfAbsent(attempt)
    assertAttemptIdentity(winner, bookId, payloadFingerprint, scopeFingerprint)
    return winner
  }

  async retirePrepared(checkoutKey: string): Promise<void> {
    const attempt = await this.store.get(checkoutKey)
    if (!attempt || !['prepared', 'quote_requested', 'quote_ready'].includes(attempt.status)) {
      throw new Error('Only a pre-accept checkout attempt may be retired.')
    }
    await this.store.remove(checkoutKey)
  }

  durability(checkoutKey: string): GovernedCheckoutDurability {
    return {
      load: async () => {
        const attempt = await this.store.get(checkoutKey)
        if (!attempt) throw new Error('Durable checkout attempt is missing.')
        return {
          phase: attempt.status,
          quote: attempt.quote,
          qrisIntent: attempt.qrisIntent,
          acceptedOrder: attempt.acceptedOrder,
          cashConfirm: attempt.cashConfirm,
        }
      },
      transition: async (phase, evidence = {}) => {
        const attempt = await this.store.get(checkoutKey)
        if (!attempt) throw new Error('Durable checkout attempt is missing.')
        if (!canAdvanceGovernedPhase(attempt.status, phase)) {
          throw new Error(`Invalid governed checkout phase transition: ${attempt.status} -> ${phase}.`)
        }
        Object.assign(attempt, evidence, { status: phase, updatedAt: new Date().toISOString() })
        await this.store.put(attempt)
      },
    }
  }

  async execute({ checkoutKey, bookId, payload, scope, post, reconcile, resumeExisting = false }: ExecuteCheckoutAttempt<TPayload>): Promise<CheckoutAttemptResult<TPayload>> {
    if (this.inFlight.has(checkoutKey)) return { kind: 'already_in_progress' }
    this.inFlight.add(checkoutKey)

    try {
      requireGovernedScope(payload, scope)
      const payloadWithoutIdentity = { ...payload, idempotency_key: undefined }
      const payloadFingerprint = await generatePayloadChecksum(payloadWithoutIdentity)
      const scopeFingerprint = scope ? await checkoutScopeFingerprint(scope) : undefined
      const existing = await this.store.get(checkoutKey)
      if (existing) {
        assertAttemptIdentity(existing, bookId, payloadFingerprint, scopeFingerprint)
        if (existing.status === 'posted' && existing.response) {
          return { kind: 'posted', response: existing.response }
        }
        const directPhases: CheckoutAttemptStatus[] = ['prepared', 'quote_requested', 'quote_ready', 'qris_intent_requested', 'qris_intent_ready']
        if (!directPhases.includes(existing.status) && (!resumeExisting || !reconcile)) {
          return { kind: 'operator_action_required', attempt: existing }
        }
      }

      const recoverExisting = existing?.status !== undefined && ['accept_requested', 'accepted', 'confirm_requested', 'pending', 'outcome_unknown'].includes(existing.status)
      const now = new Date().toISOString()
      const attempt: CheckoutAttemptRecord<TPayload> = existing ?? (() => {
        const idempotencyKey = payload.idempotency_key || this.createIdempotencyKey()
        const identifiedPayload = { ...payload, idempotency_key: idempotencyKey } as TPayload
        return {
          recordKind: 'outlet_id' in payload ? 'governed' : 'legacy',
          schemaVersion: CHECKOUT_ATTEMPT_SCHEMA_VERSION,
          checkoutKey,
          bookId,
          idempotencyKey,
          payloadFingerprint,
          scopeFingerprint,
          payload: identifiedPayload,
          status: 'prepared',
          createdAt: now,
          updatedAt: now,
        }
      })()
      const durableAttempt = existing ?? await this.store.createIfAbsent(attempt)
      if (!existing) assertAttemptIdentity(durableAttempt, bookId, payloadFingerprint, scopeFingerprint)

      try {
        // A prepared record is durable pre-quote lineage, not evidence that an
        // acceptance mutation was sent. Only an unresolved post-accept record
        // may use the read-only recovery path.
        const response = recoverExisting
          ? await reconcile!(durableAttempt.payload, durableAttempt)
          : await post(durableAttempt.payload, durableAttempt, async () => {
              if (durableAttempt.mutationSentAt) return
              durableAttempt.mutationSentAt = new Date().toISOString()
              durableAttempt.updatedAt = durableAttempt.mutationSentAt
              await this.store.put(durableAttempt)
            })
        const current = await this.store.get(checkoutKey) ?? durableAttempt
        if (response.status !== 'posted') {
          current.status = 'pending'
          current.response = response
          current.updatedAt = new Date().toISOString()
          await this.store.put(current)
          return { kind: 'pending', response }
        }

        current.status = 'posted'
        current.response = response
        current.cleanupEvidenceFingerprint = await assertDurablePostedEvidence(current, true)
        current.updatedAt = new Date().toISOString()
        await this.store.put(current)
        return { kind: 'posted', response }
      } catch (error) {
        const current = await this.store.get(checkoutKey) ?? durableAttempt
        current.lastError = error instanceof Error ? error.message : String(error)
        current.updatedAt = new Date().toISOString()
        const mutationMayHaveBeenSent = Boolean(current.mutationSentAt) || [
          'quote_requested', 'qris_intent_requested', 'accept_requested', 'confirm_requested',
        ].includes(current.status)
        if (!mutationMayHaveBeenSent) {
          await this.store.put(current)
          return { kind: 'validation_failed', message: current.lastError }
        }
        current.status = 'outcome_unknown'
        await this.store.put(current)
        return { kind: 'outcome_unknown', message: current.lastError }
      }
    } finally {
      this.inFlight.delete(checkoutKey)
    }
  }
}

async function checkoutScopeFingerprint(scope: CheckoutAttemptScope): Promise<string> {
  if (!scope.organizationId.trim() || !scope.authorityContext.trim() || !scope.cashierId.trim() || !scope.actorPrincipalId.trim()) {
    throw new Error('Governed checkout organization, authority, cashier, and actor scope is required.')
  }
  return generatePayloadChecksum(scope)
}

function requireGovernedScope<TPayload extends PersistedRetailCheckoutPayload>(
  payload: TPayload,
  scope?: CheckoutAttemptScope,
): void {
  if ('outlet_id' in payload && !scope) {
    throw new Error('Governed checkout organization, authority, cashier, and actor scope is required.')
  }
}

function assertAttemptIdentity<TPayload extends PersistedRetailCheckoutPayload>(
  existing: CheckoutAttemptRecord<TPayload>,
  bookId: string,
  payloadFingerprint: string,
  scopeFingerprint?: string,
): void {
  if (existing.bookId !== bookId) {
    throw new Error('Checkout Company Book changed while an unresolved financial attempt exists. Manager resolution is required.')
  }
  if (existing.payloadFingerprint !== payloadFingerprint) {
    throw new Error('Checkout payload changed while an unresolved financial attempt exists. Manager resolution is required.')
  }
  if (existing.scopeFingerprint !== scopeFingerprint) {
    throw new Error('Checkout organization or authority scope changed while an unresolved financial attempt exists. Manager resolution is required.')
  }
}

async function assertDurablePostedEvidence<TPayload extends PersistedRetailCheckoutPayload>(
  attempt: CheckoutAttemptRecord<TPayload>,
  allowUnpersistedFingerprint = false,
): Promise<string> {
  const response = attempt.response
  if (attempt.status !== 'posted' || !response || response.status !== 'posted') {
    throw new Error('Durable posted response evidence is missing or has a non-posted status.')
  }
  if (response.idempotency_key !== attempt.idempotencyKey) {
    throw new Error('Durable posted response evidence has an idempotency identity mismatch.')
  }
  if (!response.tx_id.trim()) {
    throw new Error('Durable posted response evidence is missing its exact transaction identity.')
  }
  if (response.posting_id && response.ledger_journal_id && response.posting_id !== response.ledger_journal_id) {
    throw new Error('Durable posted response posting identity mismatch.')
  }
  if (response.readback_validation && (
    !response.readback_validation.isValid || !response.readback_validation.isApplied || response.readback_validation.isMismatch
  )) {
    throw new Error('Durable posted response read-back evidence is not exact and applied.')
  }
  const governed = checkoutAttemptKind(attempt) === 'governed'
  if (governed) {
    const governedPayload = attempt.payload as GovernedRetailCheckoutPayload
    if (!attempt.acceptedOrder || response.tx_id !== attempt.acceptedOrder.order_id) {
      throw new Error('Governed durable posted response transaction identity does not match the accepted order.')
    }
    if (!response.posting_id || !response.ledger_journal_id || response.posting_id !== response.ledger_journal_id) {
      throw new Error('Governed durable posted response requires one exact canonical posting identity.')
    }
    if (!response.readback_validation) {
      throw new Error('Governed durable posted response requires exact applied read-back validation evidence.')
    }
    if (attempt.acceptedOrder.quote.currency !== governedPayload.currency) {
      throw new Error('Governed durable posted response currency does not match the accepted order and checkout intent.')
    }
  }
  const fingerprint = await generatePayloadChecksum(JSON.parse(canonicalCleanupEvidence(attempt)))
  if (governed && !allowUnpersistedFingerprint && !attempt.cleanupEvidenceFingerprint) {
    throw new Error('Governed durable posted response is missing its cleanup evidence fingerprint.')
  }
  if (attempt.cleanupEvidenceFingerprint && attempt.cleanupEvidenceFingerprint !== fingerprint) {
    throw new Error('Durable posted cleanup evidence fingerprint mismatch.')
  }
  return fingerprint
}

function canAdvanceGovernedPhase(from: CheckoutAttemptStatus, to: CheckoutAttemptStatus): boolean {
  if (from === to) return true
  const next: Partial<Record<CheckoutAttemptStatus, CheckoutAttemptStatus[]>> = {
    prepared: ['quote_requested'],
    quote_requested: ['quote_ready'],
    quote_ready: ['qris_intent_requested', 'accept_requested'],
    qris_intent_requested: ['qris_intent_ready'],
    qris_intent_ready: ['accept_requested'],
    accept_requested: ['accepted'],
    accepted: ['confirm_requested', 'pending', 'posted'],
    confirm_requested: ['pending', 'posted'],
    pending: ['posted'],
  }
  return next[from]?.includes(to) ?? false
}
