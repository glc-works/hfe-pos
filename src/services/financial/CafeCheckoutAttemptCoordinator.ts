import type {
  PersistedRetailCheckoutPayload,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'
import { generatePayloadChecksum } from '../../utils/cryptoHasher'

export type CheckoutAttemptStatus = 'prepared' | 'outcome_unknown' | 'pending' | 'posted'

export interface CheckoutAttemptRecord<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> {
  checkoutKey: string
  bookId: string
  idempotencyKey: string
  payloadFingerprint: string
  payload: TPayload
  status: CheckoutAttemptStatus
  createdAt: string
  updatedAt: string
  lastError?: string
  response?: SubmitRetailTransactionResponse
}

export interface CheckoutAttemptStore<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> {
  get(checkoutKey: string): Promise<CheckoutAttemptRecord<TPayload> | null>
  put(record: CheckoutAttemptRecord<TPayload>): Promise<void>
  remove(checkoutKey: string): Promise<void>
}

export type CheckoutAttemptResult<TPayload extends PersistedRetailCheckoutPayload = SubmitRetailTransactionPayload> =
  | { kind: 'posted'; response: SubmitRetailTransactionResponse }
  | { kind: 'pending'; response: SubmitRetailTransactionResponse }
  | { kind: 'outcome_unknown'; message: string }
  | { kind: 'operator_action_required'; attempt: CheckoutAttemptRecord<TPayload> }
  | { kind: 'already_in_progress' }

interface ExecuteCheckoutAttempt<TPayload extends PersistedRetailCheckoutPayload> {
  checkoutKey: string
  bookId: string
  payload: TPayload
  post: (
    payload: TPayload,
    attempt: CheckoutAttemptRecord<TPayload>,
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

  async acknowledgePosted(checkoutKey: string): Promise<void> {
    const attempt = await this.store.get(checkoutKey)
    if (!attempt || attempt.status !== 'posted') {
      throw new Error('Only a durably posted checkout attempt can be acknowledged.')
    }
    await this.store.remove(checkoutKey)
  }

  async execute({ checkoutKey, bookId, payload, post, reconcile, resumeExisting = false }: ExecuteCheckoutAttempt<TPayload>): Promise<CheckoutAttemptResult<TPayload>> {
    if (this.inFlight.has(checkoutKey)) return { kind: 'already_in_progress' }
    this.inFlight.add(checkoutKey)

    try {
      const payloadWithoutIdentity = { ...payload, idempotency_key: undefined }
      const payloadFingerprint = await generatePayloadChecksum(payloadWithoutIdentity)
      const existing = await this.store.get(checkoutKey)
      if (existing) {
        if (existing.payloadFingerprint !== payloadFingerprint) {
          throw new Error('Checkout payload changed while an unresolved financial attempt exists. Manager resolution is required.')
        }
        if (existing.status === 'posted' && existing.response) {
          return { kind: 'posted', response: existing.response }
        }
        if (!resumeExisting || !reconcile) {
          return { kind: 'operator_action_required', attempt: existing }
        }
      }

      const now = new Date().toISOString()
      const attempt: CheckoutAttemptRecord<TPayload> = existing ?? (() => {
        const idempotencyKey = this.createIdempotencyKey()
        const identifiedPayload = { ...payload, idempotency_key: idempotencyKey } as TPayload
        return {
          checkoutKey,
          bookId,
          idempotencyKey,
          payloadFingerprint,
          payload: identifiedPayload,
          status: 'prepared',
          createdAt: now,
          updatedAt: now,
        }
      })()
      if (!existing) await this.store.put(attempt)

      attempt.status = 'outcome_unknown'
      attempt.updatedAt = new Date().toISOString()
      await this.store.put(attempt)

      try {
        const response = existing
          ? await reconcile!(attempt.payload, attempt)
          : await post(attempt.payload, attempt)
        if (response.status !== 'posted') {
          attempt.status = 'pending'
          attempt.response = response
          attempt.updatedAt = new Date().toISOString()
          await this.store.put(attempt)
          return { kind: 'pending', response }
        }

        attempt.status = 'posted'
        attempt.response = response
        attempt.updatedAt = new Date().toISOString()
        await this.store.put(attempt)
        return { kind: 'posted', response }
      } catch (error) {
        attempt.lastError = error instanceof Error ? error.message : String(error)
        attempt.updatedAt = new Date().toISOString()
        await this.store.put(attempt)
        return { kind: 'outcome_unknown', message: attempt.lastError }
      }
    } finally {
      this.inFlight.delete(checkoutKey)
    }
  }
}
