import { FlagshipFinancialState, PostingReadBackEvidence } from '../../types/financial'

export function createPendingFinancialState(
  sourceOrderId: string,
  idempotencyKey: string
): FlagshipFinancialState {
  return {
    status: 'pending',
    sourceOrderId,
    idempotencyKey,
    displayLabel: 'Pending verification',
  }
}

export function verifyPostingReadBack(
  pending: FlagshipFinancialState,
  evidence: PostingReadBackEvidence
): FlagshipFinancialState {
  if (!evidence.postingId.trim()) {
    return {
      ...pending,
      status: 'failed',
      displayLabel: 'Accounting verification failed',
      failureReason: 'missing_posting_identity',
    }
  }
  if (evidence.sourceObjectId !== pending.sourceOrderId) {
    return {
      ...pending,
      status: 'failed',
      displayLabel: 'Accounting verification failed',
      failureReason: 'posting_source_mismatch',
    }
  }
  if (evidence.stableEffectKey !== pending.idempotencyKey) {
    return {
      ...pending,
      status: 'failed',
      displayLabel: 'Accounting verification failed',
      failureReason: 'stable_effect_mismatch',
    }
  }
  if (!evidence.stateRevision?.trim()) {
    return {
      ...pending,
      status: 'failed',
      displayLabel: 'Accounting verification failed',
      failureReason: 'missing_posting_revision',
    }
  }
  return {
    ...pending,
    status: 'posted',
    displayLabel: 'Posted to CORE',
    postingId: evidence.postingId,
    postingStateRevision: evidence.stateRevision,
    failureReason: undefined,
  }
}
