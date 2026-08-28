import type { HfeClient } from '@hfe/sdk'
import type {
  GovernedAcceptedTenderEvidence,
  GovernedRetailCheckoutPayload,
  GovernedTenderOutcomeQuery,
  RetailPostingContext,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'
import {
  completeGovernedCashTender,
  deriveGovernedCheckoutPhaseKey,
  exactMinor,
  requireIdentifier,
  requirePositiveRevision,
  requireSha256,
  requireText,
  requireTimestamp,
} from './GovernedPosCheckout'
import { HfePostingReadbackValidator } from './HfePostingReadbackValidator'

export async function recoverGovernedPosCheckout(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): Promise<SubmitRetailTransactionResponse> {
  if (!payload.idempotency_key) throw new Error('idempotency_key is required for governed POS recovery.')
  const durability = context.governedAttempt
  if (!durability) throw new Error('Durable governed phase evidence is required for recovery.')
  let stored = await durability.load()
  let accepted = stored.acceptedOrder
  const acceptKey = deriveGovernedCheckoutPhaseKey(payload.idempotency_key, 'accept')
  if (!accepted) {
    if (stored.phase !== 'accept_requested') {
      throw new Error(`Governed recovery cannot infer an accepted order from phase ${stored.phase}.`)
    }
    try {
      accepted = (await client.operations.getAcceptedPosOrderByIdempotencyKey({
        path: { book: targetBook, idempotency_key: acceptKey },
      })).body
    } catch {
      throw new Error('Accepted-order recovery lookup is unavailable; outcome recovery stopped without acceptance replay.')
    }
  }
  const quote = accepted.quote
  const tender = accepted.tender
  if (accepted.acceptance_idempotency_key !== acceptKey) {
    throw new Error('Recovered acceptance idempotency key does not match the durable checkout attempt.')
  }
  if (!quote || !tender || quote.currency !== payload.currency || tender.tender_type !== payload.payment_method) {
    throw new Error('Accepted order recovery receipt does not match the governed request.')
  }
  if (stored.quote && (
    quote.quote_id !== stored.quote.quote_id || quote.digest_sha256 !== stored.quote.digest_sha256 ||
    quote.amount_due_minor !== stored.quote.amount_due_minor || String(quote.revision) !== String(stored.quote.revision)
  )) throw new Error('Recovered accepted quote does not match the durably reviewed quote.')
  const expectedProvider = stored.qrisIntent?.payment_id
  if (payload.payment_method === 'qris' && (!expectedProvider || tender.provider_intent_reference !== expectedProvider)) {
    throw new Error('Recovered QRIS provider intent reference does not match durable intent evidence.')
  }
  if (payload.payment_method === 'cash' && tender.provider_intent_reference != null) {
    throw new Error('Recovered cash tender contains an unexpected provider intent reference.')
  }
  const evidence: GovernedAcceptedTenderEvidence = {
    orderId: requireIdentifier(accepted.order_id, 'recovered order_id'),
    acceptedAt: requireTimestamp(accepted.accepted_at, 'recovered accepted_at'),
    tenderId: requireIdentifier(tender.tender_id, 'recovered tender_id'),
    acceptanceEffectKey: requireSha256(tender.acceptance_effect_key, 'recovered acceptance_effect_key'),
    tenderType: payload.payment_method,
    amountMinor: exactMinor(tender.amount_minor, 'recovered amount_minor'),
    quote: {
      quoteId: requireText(quote.quote_id, 'recovered quote_id'),
      revision: requirePositiveRevision(quote.revision, 'recovered quote revision'),
      digestSha256: requireSha256(quote.digest_sha256, 'recovered quote digest'),
      currency: quote.currency,
      amountDueMinor: exactMinor(quote.amount_due_minor, 'recovered amount_due_minor'),
      presetId: requireText(quote.preset_id, 'recovered preset_id'),
      presetVersion: requirePositiveRevision(quote.preset_version, 'recovered preset_version'),
    },
  }
  if (evidence.amountMinor !== evidence.quote.amountDueMinor) throw new Error('Recovered accepted tender amount does not match its quote.')
  if (stored.phase === 'accept_requested') await durability.transition('accepted', { acceptedOrder: accepted })
  stored = await durability.load()
  if (payload.payment_method === 'cash') {
    return completeGovernedCashTender(client, payload, context, targetBook, evidence)
  }
  const result = await reconcileGovernedTenderOutcome(client, {
    orderId: evidence.orderId, tenderId: evidence.tenderId,
    acceptedTenderEffectKey: evidence.acceptanceEffectKey,
    amountMinor: evidence.amountMinor, currency: evidence.quote.currency,
  }, context, targetBook)
  if (result.status === 'pending' && stored.qrisIntent) {
    result.idempotency_key = payload.idempotency_key
    result.qris_payment = { ...stored.qrisIntent, tender_id: evidence.tenderId }
  }
  return result
}

export async function reconcileGovernedTenderOutcome(
  client: HfeClient,
  query: GovernedTenderOutcomeQuery,
  _context: RetailPostingContext,
  targetBook: string,
): Promise<SubmitRetailTransactionResponse> {
  const body = (await client.operations.getGovernedPosTenderOutcome({
    path: { book: targetBook, tender_id: query.tenderId },
  })).body
  if (body.tender_id !== query.tenderId) throw new Error(`Tender outcome mismatch: expected ${query.tenderId} but got ${body.tender_id}.`)
  if (body.order_id !== query.orderId) throw new Error(`Order outcome mismatch: expected ${query.orderId} but got ${body.order_id}.`)
  if (body.amount_minor !== query.amountMinor) throw new Error(`Amount outcome mismatch: expected ${query.amountMinor} but got ${body.amount_minor}.`)
  if (body.currency !== query.currency) throw new Error(`Currency outcome mismatch: expected ${query.currency} but got ${body.currency}.`)
  if (body.accepted_tender_effect_key !== query.acceptedTenderEffectKey) throw new Error('Accepted tender effect key mismatch.')

  if (body.outcome === 'pending') {
    return {
      tx_id: query.orderId, status: 'pending', created_at: new Date().toISOString(),
      grand_total: exactMinor(query.amountMinor, 'outcome.amount_minor'), idempotency_key: query.tenderId,
    }
  }
  if (body.outcome === 'failed') throw new Error('Governed tender outcome reported failed by provider.')
  if (body.outcome === 'applied') {
    if (!body.posting_id) throw new Error('Applied governed tender outcome missing posting_id.')
    if (body.posting_finality !== 'applied') throw new Error(`Applied governed tender outcome posting finality mismatch: ${body.posting_finality || 'missing'}.`)
    if (body.posting_source_capability !== 'pos_tender_sale') throw new Error(`Applied governed tender outcome source capability mismatch: ${body.posting_source_capability || 'missing'}.`)
    if (body.posting_source_object_id !== query.tenderId) throw new Error(`Applied governed tender outcome source object mismatch: ${body.posting_source_object_id || 'missing'}.`)
    if (body.posting_stable_effect_key !== query.acceptedTenderEffectKey) throw new Error('Applied governed tender outcome stable effect key mismatch.')
    const durable = await client.operations.getPosting({ path: { book: targetBook, posting: body.posting_id } })
    const validation = HfePostingReadbackValidator.validate({
      postingId: body.posting_id, expectedBookId: targetBook, sourceCapability: 'pos_tender_sale',
      sourceObjectId: query.tenderId, stableEffectKey: query.acceptedTenderEffectKey, expectedCurrency: query.currency,
    }, durable.body as any)
    if (!validation.isValid) throw new Error(`Durable tender outcome read-back mismatch: ${validation.mismatchReason || 'lineage mismatch'}`)
    return {
      tx_id: query.orderId, status: 'posted', created_at: new Date().toISOString(),
      grand_total: exactMinor(query.amountMinor, 'outcome.amount_minor'), idempotency_key: query.tenderId,
      ledger_journal_id: body.posting_id, posting_id: body.posting_id, readback_validation: validation,
    }
  }
  throw new Error(`Unknown tender outcome state: ${body.outcome}`)
}
