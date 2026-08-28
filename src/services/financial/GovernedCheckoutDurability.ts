import type {
  AcceptedOrderReceipt,
  ConfirmCashTenderAcceptedResponse,
  ConfirmCashTenderRequest,
  PosSaleQuoteView,
  QrisGenerateResponse,
} from '@hfe/sdk'

export type GovernedCheckoutPhase =
  | 'prepared'
  | 'quote_requested'
  | 'quote_ready'
  | 'qris_intent_requested'
  | 'qris_intent_ready'
  | 'accept_requested'
  | 'accepted'
  | 'confirm_requested'
  | 'pending'
  | 'posted'
  | 'outcome_unknown'

export interface GovernedCashConfirmEvidence {
  idempotencyKey: string
  tenderId: string
  body: ConfirmCashTenderRequest
  response?: ConfirmCashTenderAcceptedResponse
}

export interface GovernedCheckoutEvidence {
  phase: GovernedCheckoutPhase
  quote?: PosSaleQuoteView
  qrisIntent?: QrisGenerateResponse
  acceptedOrder?: AcceptedOrderReceipt
  cashConfirm?: GovernedCashConfirmEvidence
}

export interface GovernedCheckoutDurability {
  load(): Promise<GovernedCheckoutEvidence>
  transition(
    phase: GovernedCheckoutPhase,
    evidence?: Partial<Omit<GovernedCheckoutEvidence, 'phase'>>,
  ): Promise<void>
}
