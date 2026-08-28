import type { HfeClient, Int64String } from '@hfe/sdk'
import type {
  ExactMinorString,
  GovernedAcceptedTenderEvidence,
  GovernedRetailCheckoutPayload,
  GovernedTenderType,
  RetailPostingContext,
  ReviewedPosQuote,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'
import { HfePostingReadbackValidator } from './HfePostingReadbackValidator'
import type { GovernedCheckoutEvidence } from './GovernedCheckoutDurability'
import type { GovernedCheckoutDurability } from './GovernedCheckoutDurability'

function requireGovernedDurability(context: RetailPostingContext): GovernedCheckoutDurability {
  if (!context.governedAttempt) throw new Error('Durable governed phase evidence is required before any governed financial operation.')
  return context.governedAttempt
}

export function exactMinor(value: string, field: string): ExactMinorString {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error(`CORE ${field} is not a canonical non-negative minor-unit string.`)
  }
  return value
}

function requiredMinor(value: string | null | undefined, field: string): ExactMinorString {
  if (typeof value !== 'string') throw new Error(`CORE ${field} is required.`)
  return exactMinor(value, field)
}

export function deriveGovernedCheckoutPhaseKey(
  rootKey: string,
  phase: 'quote' | 'qris-intent' | 'accept' | 'confirm'
): string {
  return `${rootKey}:${phase}`
}

export function requireText(value: string | null | undefined, field: string): string {
  if (!value?.trim()) throw new Error(`CORE ${field} is required.`)
  return value
}

export function requireIdentifier(value: string | null | undefined, field: string): string {
  if (!value || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) {
    throw new Error(`CORE ${field} must be a nonempty canonical identifier.`)
  }
  return value
}

export function requireSha256(value: string | null | undefined, field: string): string {
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) throw new Error(`CORE ${field} must be a SHA-256 digest.`)
  return value
}

export function requirePositiveRevision(value: unknown, field: string): string {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
  if (!/^[1-9][0-9]*$/.test(text)) throw new Error(`CORE ${field} must be a positive canonical integer.`)
  return text
}

function requireFutureTimestamp(value: string, field: string): void {
  requireTimestamp(value, field)
  const expiresAt = Date.parse(value)
  if (expiresAt <= Date.now()) {
    throw new Error(`CORE ${field} has an invalid or expired value.`)
  }
}

export function requireTimestamp(value: string | null | undefined, field: string): string {
  const match = value?.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/)
  const lastDay = match ? new Date(Date.UTC(Number(match[1]), Number(match[2]), 0)).getUTCDate() : 0
  if (!value || !match || Number(match[3]) > lastDay || !Number.isFinite(Date.parse(value))) {
    throw new Error(`CORE ${field} must be a canonical RFC3339 timestamp.`)
  }
  return value
}

function lineKey(itemId: string, quantity: string, modifierIds: string[]): string {
  return `${itemId}\u0000${quantity}\u0000${[...modifierIds].sort().join('\u0000')}`
}

function assertQuoteLines(
  items: GovernedRetailCheckoutPayload['items'],
  lines: Array<{ item_id?: string; itemId?: string; quantity: unknown; modifier_ids?: string[]; modifierIds?: string[] }>,
): void {
  const expected = new Set(items.map((item) => lineKey(item.product_id, String(item.quantity), item.modifier_ids || [])))
  if (expected.size !== items.length || lines.length !== expected.size) {
    throw new Error('CORE quote lines do not completely match the requested intent.')
  }
  for (const line of lines) {
    const key = lineKey(line.item_id || line.itemId || '', String(line.quantity), line.modifier_ids || line.modifierIds || [])
    if (!expected.delete(key)) throw new Error('CORE quote contains duplicate or unknown line evidence.')
  }
  if (expected.size) throw new Error('CORE quote omitted requested line evidence.')
}

export function governedIntentFingerprint(
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): string {
  return JSON.stringify({
    book: targetBook, organization: context.organizationId, authority: context.authorityContext, cashier: payload.cashier_id,
    actor: context.handover.actorPrincipalId, outlet: payload.outlet_id, terminal: payload.terminal_id,
    currency: payload.currency, table: payload.table_id || '', contact: payload.contact_id,
    policy: payload.policy, tender: payload.payment_method, promotions: [...(payload.promotion_codes || [])].sort(),
    lines: payload.items.map((item) => ({
      product: item.product_id, quantity: item.quantity, modifiers: [...(item.modifier_ids || [])].sort(),
    })),
  })
}

export async function prepareGovernedRetailQuote(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): Promise<ReviewedPosQuote> {
  const durability = requireGovernedDurability(context)
  if (!context.authorityContext.trim()) {
    throw new Error('authorityContext is required for governed POS posting. Fail-closed: zero fallback allowed.')
  }
  if (context.companyBookId !== targetBook || !context.organizationId?.trim() || !payload.cashier_id?.trim() || payload.cashier_id !== context.handover.actorPrincipalId) {
    throw new Error('Governed quote scope requires matching organization, Company Book, cashier, and authority evidence.')
  }
  if (!payload.idempotency_key) {
    throw new Error('idempotency_key is required for governed POS posting and retry stability.')
  }
  if (!payload.outlet_id.trim() || !payload.terminal_id.trim() || !payload.currency.trim()) {
    throw new Error('outlet_id, terminal_id, and currency are required for governed POS quoting.')
  }
  if (payload.items.length === 0 || payload.items.some((item) => (
    !item.product_id || !Number.isInteger(item.quantity) || item.quantity <= 0
  ))) {
    throw new Error('Governed POS quoting requires active item identities and positive whole quantities.')
  }

  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  const stored = await durability.load()
  let body = stored?.quote
  const needsQuoteRequest = !body
  if (!body) {
    await durability.transition('quote_requested')
    const quoted = await client.operations.calculatePosSaleQuote({
      path: { book: targetBook },
      headers: { ...authorityHeaders, 'Idempotency-Key': deriveGovernedCheckoutPhaseKey(payload.idempotency_key, 'quote') },
      body: {
        currency: payload.currency,
        lines: payload.items.map((item) => ({
          item_id: item.product_id,
          modifier_ids: item.modifier_ids || [],
          quantity: String(item.quantity) as Int64String,
        })),
        outlet_id: payload.outlet_id,
        promotion_codes: payload.promotion_codes || [],
        terminal_id: payload.terminal_id,
      },
    })
    body = quoted.body
  }
  if (body.currency !== payload.currency) {
    throw new Error(`CORE quote returned currency '${body.currency}' which differs from requested '${payload.currency}'.`)
  }
  requireFutureTimestamp(body.expires_at, 'quote expires_at')

  requireText(body.quote_id, 'quote_id')
  requirePositiveRevision(body.revision, 'revision')
  requireSha256(body.digest_sha256, 'digest_sha256')
  requireText(body.preset_id, 'preset_id')
  requirePositiveRevision(body.preset_version, 'preset_version')
  assertQuoteLines(payload.items, body.lines)

  const tenderEligibility = body.tender_eligibility.map((entry) => ({
    tenderType: entry.tender_type as GovernedTenderType,
    eligible: entry.eligible,
    reasonCode: entry.reason_code ?? undefined,
  }))

  if (tenderEligibility.length !== 2 || tenderEligibility.some((entry) => entry.tenderType !== 'cash' && entry.tenderType !== 'qris')) {
    throw new Error('CORE quote contains an unknown tender eligibility.')
  }
  if (new Set(tenderEligibility.map((entry) => entry.tenderType)).size !== tenderEligibility.length) {
    throw new Error('CORE quote contains duplicate tender eligibility evidence.')
  }

  const selectedEligibility = tenderEligibility.filter(
    (entry) => entry.tenderType === payload.payment_method,
  )
  if (selectedEligibility.length !== 1 || !selectedEligibility[0].eligible) {
    const reason = selectedEligibility[0]?.reasonCode || `missing_or_ambiguous_${payload.payment_method}_eligibility`
    throw new Error(`${payload.payment_method.toUpperCase()} tender is not eligible for this authoritative quote: ${reason}.`)
  }

  const reviewed: ReviewedPosQuote = {
    quoteId: body.quote_id,
    revision: String(body.revision),
    digestSha256: body.digest_sha256,
    currency: body.currency,
    subtotalMinor: requiredMinor(body.subtotal_minor, 'subtotal_minor'),
    amountDueMinor: requiredMinor(body.amount_due_minor, 'amount_due_minor'),
    discountTotalMinor: requiredMinor(body.discount_total_minor, 'discount_total_minor'),
    taxTotalMinor: requiredMinor(body.tax_total_minor, 'tax_total_minor'),
    serviceChargeTotalMinor: requiredMinor(body.service_charge_total_minor, 'service_charge_total_minor'),
    tipTotalMinor: requiredMinor(body.tip_total_minor, 'tip_total_minor'),
    roundingTotalMinor: requiredMinor(body.rounding_total_minor, 'rounding_total_minor'),
    presetId: body.preset_id,
    presetVersion: String(body.preset_version),
    lines: body.lines.map((line, idx) => ({
      ordinal: line.ordinal ?? idx,
      itemId: line.item_id,
      quantity: String(line.quantity),
      modifierIds: line.modifier_ids,
      discountAllocatedMinor: requiredMinor(line.discount_allocated_minor, 'discount_allocated_minor'),
    })),
    expiresAt: body.expires_at,
    tenderEligibility,
    intentFingerprint: governedIntentFingerprint(payload, context, targetBook),
    source: 'hfe-core',
  }
  if (needsQuoteRequest) await durability.transition('quote_ready', { quote: body })
  return reviewed
}

export async function acceptGovernedRetailQuote(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  reviewed: ReviewedPosQuote,
  context: RetailPostingContext,
  targetBook: string,
  providerIntentReference?: string,
): Promise<GovernedAcceptedTenderEvidence> {
  const durability = requireGovernedDurability(context)
  validateReviewedAcceptance(payload, reviewed, context, targetBook)
  const stored = await durability.load()
  assertDurableReviewedQuote(stored, reviewed)
  if (stored?.phase === 'accept_requested' && !stored.acceptedOrder) {
    throw new Error('Acceptance outcome is unknown; use the read-only accepted-order recovery lookup.')
  }
  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  const acceptKey = deriveGovernedCheckoutPhaseKey(payload.idempotency_key!, 'accept')
  if (!stored?.acceptedOrder) await durability.transition('accept_requested')
  const acceptedBody = stored?.acceptedOrder ?? (await client.operations.acceptGovernedPosOrder({
    path: { book: targetBook },
    headers: { ...authorityHeaders, 'Idempotency-Key': acceptKey },
    body: {
      quote_digest_sha256: reviewed.digestSha256,
      quote_id: reviewed.quoteId,
      quote_revision: reviewed.revision as Int64String,
      tender: {
        amount_minor: reviewed.amountDueMinor,
        ...(providerIntentReference ? { provider_intent_reference: providerIntentReference } : {}),
        tender_type: payload.payment_method,
      },
    },
  })).body

  const acceptedQuote = acceptedBody.quote
  const acceptedTender = acceptedBody.tender
  if (acceptedBody.acceptance_idempotency_key !== acceptKey) {
    throw new Error('CORE acceptance idempotency key does not match the durable checkout attempt.')
  }
  if (
    acceptedQuote?.quote_id !== reviewed.quoteId ||
    String(acceptedQuote?.revision) !== reviewed.revision ||
    acceptedQuote?.digest_sha256 !== reviewed.digestSha256 ||
    acceptedQuote?.currency !== reviewed.currency ||
    acceptedQuote?.amount_due_minor !== reviewed.amountDueMinor
  ) {
    throw new Error('CORE accepted quote evidence does not match the reviewed quote.')
  }
  if (
    acceptedTender.tender_type !== payload.payment_method ||
    exactMinor(acceptedTender.amount_minor, 'accepted_tender.amount_minor') !== reviewed.amountDueMinor
  ) {
    throw new Error('CORE accepted tender evidence mismatch with the reviewed quote.')
  }
  if (payload.payment_method === 'qris' && acceptedTender.provider_intent_reference !== providerIntentReference) {
    throw new Error('CORE accepted tender provider intent reference does not match the generated QRIS intent.')
  }
  if (payload.payment_method === 'cash' && acceptedTender.provider_intent_reference != null) {
    throw new Error('CORE cash acceptance returned an unexpected provider intent reference.')
  }
  const orderId = requireIdentifier(acceptedBody.order_id, 'accepted order_id')
  const acceptedAt = requireTimestamp(acceptedBody.accepted_at, 'accepted_at')
  const tenderId = requireIdentifier(acceptedTender.tender_id, 'accepted tender_id')
  const acceptanceEffectKey = requireSha256(acceptedTender.acceptance_effect_key, 'accepted acceptance_effect_key')
  await durability.transition('accepted', { acceptedOrder: acceptedBody })

  return {
    orderId, acceptedAt, tenderId, acceptanceEffectKey,
    tenderType: payload.payment_method as GovernedTenderType,
    amountMinor: exactMinor(acceptedTender.amount_minor, 'amount_minor'),
    quote: {
      quoteId: reviewed.quoteId,
      revision: reviewed.revision,
      digestSha256: reviewed.digestSha256,
      currency: reviewed.currency,
      amountDueMinor: reviewed.amountDueMinor,
      presetId: reviewed.presetId,
      presetVersion: reviewed.presetVersion,
    },
  }
}

function validateReviewedAcceptance(
  payload: GovernedRetailCheckoutPayload,
  reviewed: ReviewedPosQuote,
  context: RetailPostingContext,
  targetBook: string,
): void {
  if (!context.authorityContext.trim()) {
    throw new Error('authorityContext is required for governed POS posting. Fail-closed: zero fallback allowed.')
  }
  if (reviewed.intentFingerprint !== governedIntentFingerprint(payload, context, targetBook)) {
    throw new Error('Reviewed quote intent or authority scope no longer matches the acceptance request.')
  }
  if (!payload.idempotency_key) {
    throw new Error('idempotency_key is required for governed POS posting and retry stability.')
  }
  requireFutureTimestamp(reviewed.expiresAt, 'reviewed quote expires_at')
  if (reviewed.currency !== payload.currency) {
    throw new Error(`Reviewed quote currency mismatch: ${reviewed.currency} vs ${payload.currency}.`)
  }
  requireText(reviewed.quoteId, 'reviewed quote_id')
  requireSha256(reviewed.digestSha256, 'reviewed quote digest_sha256')
  requirePositiveRevision(reviewed.revision, 'reviewed quote revision')
  requireText(reviewed.presetId, 'reviewed preset_id')
  requirePositiveRevision(reviewed.presetVersion, 'reviewed preset_version')
  assertQuoteLines(payload.items, reviewed.lines)
  const selectedEligibility = reviewed.tenderEligibility.filter(
    (entry) => entry.tenderType === payload.payment_method,
  )
  if (selectedEligibility.length !== 1 || !selectedEligibility[0].eligible) {
    throw new Error('Reviewed quote tender eligibility is missing, ambiguous, or ineligible.')
  }

}

function assertDurableReviewedQuote(stored: GovernedCheckoutEvidence | undefined, reviewed: ReviewedPosQuote): void {
  if (!stored?.quote || stored.quote.quote_id !== reviewed.quoteId ||
    stored.quote.digest_sha256 !== reviewed.digestSha256 || String(stored.quote.revision) !== reviewed.revision ||
    stored.quote.amount_due_minor !== reviewed.amountDueMinor
  ) throw new Error('Durable reviewed quote evidence does not match the acceptance request.')
}

export async function postGovernedPosCheckout(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
  reviewedQuote: ReviewedPosQuote,
): Promise<SubmitRetailTransactionResponse> {
  const durability = requireGovernedDurability(context)
  const reviewed = reviewedQuote
  if (!reviewed) {
    throw new Error('A reviewed CORE quote is required; governed completion cannot create or accept a fresh quote.')
  }

  validateReviewedAcceptance(payload, reviewed, context, targetBook)
  const stored = await durability.load()
  assertDurableReviewedQuote(stored, reviewed)
  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  let qrisIntent = stored?.qrisIntent
  let generatedQrisIntent = false
  if (payload.payment_method === 'qris' && !qrisIntent) {
    await durability.transition('qris_intent_requested')
    qrisIntent = (await client.operations.generatePosQris({
        path: { book: targetBook },
        headers: { ...authorityHeaders, 'Idempotency-Key': deriveGovernedCheckoutPhaseKey(payload.idempotency_key!, 'qris-intent') },
        body: { amount_idr: reviewed.amountDueMinor as Int64String, transaction_id: reviewed.quoteId },
      })).body
    generatedQrisIntent = true
  }
  if (payload.payment_method === 'qris') {
    requireText(qrisIntent?.payment_id, 'QRIS payment_id')
    requireText(qrisIntent?.qris_string, 'QRIS qris_string')
    requireText(qrisIntent?.qr_image_url, 'QRIS qr_image_url')
    requireFutureTimestamp(qrisIntent!.expires_at, 'QRIS expires_at')
    if (generatedQrisIntent) await durability.transition('qris_intent_ready', { qrisIntent })
  }
  const evidence = await acceptGovernedRetailQuote(
    client, payload, reviewed, context, targetBook, qrisIntent?.payment_id,
  )

  const idempotencyKey = payload.idempotency_key!

  if (payload.payment_method === 'qris') {
    return pendingResponse(
      { order_id: evidence.orderId, accepted_at: evidence.acceptedAt, tender: { tender_id: evidence.tenderId } },
      evidence.amountMinor,
      idempotencyKey,
      qrisIntent,
    )
  }

  return completeGovernedCashTender(client, payload, context, targetBook, evidence)
}

export async function completeGovernedCashTender(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
  evidence: GovernedAcceptedTenderEvidence,
): Promise<SubmitRetailTransactionResponse> {
  const durability = requireGovernedDurability(context)
  const idempotencyKey = payload.idempotency_key!
  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  const confirmKey = deriveGovernedCheckoutPhaseKey(idempotencyKey, 'confirm')
  const confirmBody = { accepted_tender_effect_key: evidence.acceptanceEffectKey }
  const persistedConfirm = (await durability.load()).cashConfirm
  if (persistedConfirm && (
    persistedConfirm.idempotencyKey !== confirmKey || persistedConfirm.tenderId !== evidence.tenderId ||
    persistedConfirm.body.accepted_tender_effect_key !== confirmBody.accepted_tender_effect_key
  )) throw new Error('Persisted cash confirmation evidence does not match the accepted tender.')
  if (!persistedConfirm) await durability.transition('confirm_requested', {
    cashConfirm: { idempotencyKey: confirmKey, tenderId: evidence.tenderId, body: confirmBody },
  })
  const needsConfirmRequest = !persistedConfirm?.response || !('posting_id' in persistedConfirm.response)
  const confirmed = needsConfirmRequest
    ? await client.operations.confirmGovernedPosCashTender({
        path: { book: targetBook, tender_id: evidence.tenderId },
        headers: { ...authorityHeaders, 'Idempotency-Key': confirmKey },
        body: confirmBody,
      })
    : { status: 200 as const, body: persistedConfirm.response }
  if (needsConfirmRequest) {
    const phase = (await durability.load()).phase
    await durability.transition(phase, {
      cashConfirm: { idempotencyKey: confirmKey, tenderId: evidence.tenderId, body: confirmBody, response: confirmed.body },
    })
  }

  if (!confirmed.body || !('posting_id' in confirmed.body)) {
    return pendingResponse(
      { order_id: evidence.orderId, accepted_at: evidence.acceptedAt, tender: { tender_id: evidence.tenderId } },
      evidence.amountMinor,
      idempotencyKey,
    )
  }

  const postingId = (confirmed.body as { posting_id: string }).posting_id

  const durable = await client.operations.getPosting({
    path: { book: targetBook, posting: postingId },
  })
  const validation = HfePostingReadbackValidator.validate({
    postingId,
    expectedBookId: targetBook,
    sourceCapability: 'pos_tender_sale',
    sourceObjectId: evidence.tenderId,
    stableEffectKey: evidence.acceptanceEffectKey,
    expectedCurrency: evidence.quote.currency,
  }, durable.body as any)

  if (!validation.isValid) {
    throw new Error(
      `Durable governed tender read-back mismatch: ${validation.mismatchReason || 'exact tender lineage and applied finality are required.'}`,
    )
  }

  return {
    tx_id: evidence.orderId,
    status: 'posted',
    created_at: evidence.acceptedAt,
    grand_total: evidence.amountMinor,
    idempotency_key: idempotencyKey,
    ledger_journal_id: postingId,
    posting_id: postingId,
    readback_validation: validation,
  }
}

function pendingResponse(
  accepted: { order_id: string; accepted_at: string; tender?: { tender_id: string } },
  amountDue: ExactMinorString,
  idempotencyKey: string,
  qrisIntent?: {
    payment_id: string
    qris_string: string
    qr_image_url: string
    expires_at: string
  },
): SubmitRetailTransactionResponse {
  return {
    tx_id: accepted.order_id,
    status: 'pending',
    created_at: accepted.accepted_at,
    grand_total: amountDue,
    idempotency_key: idempotencyKey,
    ...(qrisIntent && accepted.tender ? {
      qris_payment: {
        ...qrisIntent,
        tender_id: accepted.tender.tender_id,
      },
    } : {}),
  }
}
