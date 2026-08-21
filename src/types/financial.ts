export type FlagshipFinancialStatus =
  | 'not_started'
  | 'pending'
  | 'approval_required'
  | 'posted'
  | 'failed'

export interface FlagshipFinancialState {
  status: FlagshipFinancialStatus
  sourceOrderId: string
  idempotencyKey: string
  displayLabel: string
  postingId?: string
  postingStateRevision?: string
  failureReason?: 'missing_posting_identity' | 'missing_posting_revision' | 'posting_source_mismatch' | 'stable_effect_mismatch'
}

export interface PostingReadBackEvidence {
  postingId: string
  sourceObjectId: string
  stableEffectKey: string
  stateRevision: string
}
