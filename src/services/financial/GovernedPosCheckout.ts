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

export function exactMinor(value: string, field: string): ExactMinorString {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error(`CORE ${field} is not a canonical non-negative minor-unit string.`)
  }
  return value
}

export async function prepareGovernedRetailQuote(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): Promise<ReviewedPosQuote> {
  if (!context.authorityContext.trim()) {
    throw new Error('authorityContext is required for governed POS posting. Fail-closed: zero fallback allowed.')
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
  const quoted = await client.operations.calculatePosSaleQuote({
    path: { book: targetBook },
    headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:quote` },
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

  const body = quoted.body
  if (body.currency !== payload.currency) {
    throw new Error(`CORE quote returned currency '${body.currency}' which differs from requested '${payload.currency}'.`)
  }
  if (new Date(body.expires_at).getTime() <= Date.now()) {
    throw new Error('CORE quote is expired upon receipt.')
  }

  const tenderEligibility = (body.tender_eligibility || []).map((entry) => ({
    tenderType: entry.tender_type as GovernedTenderType,
    eligible: entry.eligible,
    reasonCode: entry.reason_code ?? undefined,
  }))

  const selectedEligibility = tenderEligibility.filter(
    (entry) => entry.tenderType === payload.payment_method,
  )
  if (selectedEligibility.length !== 1 || !selectedEligibility[0].eligible) {
    const reason = selectedEligibility[0]?.reasonCode || `missing_or_ambiguous_${payload.payment_method}_eligibility`
    throw new Error(`${payload.payment_method.toUpperCase()} tender is not eligible for this authoritative quote: ${reason}.`)
  }

  return {
    quoteId: body.quote_id,
    revision: String(body.revision),
    digestSha256: body.digest_sha256,
    currency: body.currency,
    subtotalMinor: exactMinor(body.subtotal_minor || body.amount_due_minor, 'subtotal_minor'),
    amountDueMinor: exactMinor(body.amount_due_minor, 'amount_due_minor'),
    discountTotalMinor: exactMinor(body.discount_total_minor || '0', 'discount_total_minor'),
    taxTotalMinor: exactMinor(body.tax_total_minor || '0', 'tax_total_minor'),
    serviceChargeTotalMinor: exactMinor(body.service_charge_total_minor || '0', 'service_charge_total_minor'),
    tipTotalMinor: exactMinor(body.tip_total_minor || '0', 'tip_total_minor'),
    roundingTotalMinor: exactMinor(body.rounding_total_minor || '0', 'rounding_total_minor'),
    presetId: body.preset_id,
    presetVersion: String(body.preset_version),
    lines: (body.lines || []).map((line, idx) => ({
      ordinal: line.ordinal ?? idx,
      itemId: line.item_id,
      quantity: String(line.quantity),
      modifierIds: line.modifier_ids || [],
      discountAllocatedMinor: exactMinor(line.discount_allocated_minor || '0', 'discount_allocated_minor'),
    })),
    expiresAt: body.expires_at,
    tenderEligibility,
    source: 'hfe-core',
  }
}

export async function acceptGovernedRetailQuote(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  reviewed: ReviewedPosQuote,
  context: RetailPostingContext,
  targetBook: string,
  providerIntentReference?: string,
): Promise<GovernedAcceptedTenderEvidence> {
  if (!context.authorityContext.trim()) {
    throw new Error('authorityContext is required for governed POS posting. Fail-closed: zero fallback allowed.')
  }
  if (!payload.idempotency_key) {
    throw new Error('idempotency_key is required for governed POS posting and retry stability.')
  }
  if (new Date(reviewed.expiresAt).getTime() <= Date.now()) {
    throw new Error('Reviewed CORE quote has expired before acceptance.')
  }
  if (reviewed.currency !== payload.currency) {
    throw new Error(`Reviewed quote currency mismatch: ${reviewed.currency} vs ${payload.currency}.`)
  }

  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  const accepted = await client.operations.acceptGovernedPosOrder({
    path: { book: targetBook },
    headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:accept` },
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
  })

  return {
    orderId: accepted.body.order_id,
    acceptedAt: accepted.body.accepted_at,
    tenderId: accepted.body.tender.tender_id,
    acceptanceEffectKey: accepted.body.tender.acceptance_effect_key,
    tenderType: payload.payment_method as GovernedTenderType,
    amountMinor: exactMinor(accepted.body.quote?.amount_due_minor || reviewed.amountDueMinor, 'amount_minor'),
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

export async function postGovernedPosCheckout(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): Promise<SubmitRetailTransactionResponse> {
  const reviewed = await prepareGovernedRetailQuote(client, payload, context, targetBook)
  const amountDue = Number(reviewed.amountDueMinor)

  const authorityHeaders = { 'X-CBook-Authority-Context': context.authorityContext }
  const qrisIntent = payload.payment_method === 'qris'
    ? await client.operations.generatePosQris({
        path: { book: targetBook },
        headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:qris-intent` },
        body: {
          amount_idr: reviewed.amountDueMinor as Int64String,
          transaction_id: reviewed.quoteId,
        },
      })
    : null

  const evidence = await acceptGovernedRetailQuote(
    client,
    payload,
    reviewed,
    context,
    targetBook,
    qrisIntent?.body.payment_id,
  )

  const idempotencyKey = payload.idempotency_key!

  if (payload.payment_method === 'qris') {
    return pendingResponse(
      { order_id: evidence.orderId, accepted_at: evidence.acceptedAt, tender: { tender_id: evidence.tenderId } },
      amountDue,
      idempotencyKey,
      qrisIntent?.body,
    )
  }

  const confirmed = await client.operations.confirmGovernedPosCashTender({
    path: { book: targetBook, tender_id: evidence.tenderId },
    headers: { ...authorityHeaders, 'Idempotency-Key': `${idempotencyKey}:confirm` },
    body: { accepted_tender_effect_key: evidence.acceptanceEffectKey },
  })

  if (confirmed.status === 202 || !('posting_id' in confirmed.body)) {
    return pendingResponse(
      { order_id: evidence.orderId, accepted_at: evidence.acceptedAt, tender: { tender_id: evidence.tenderId } },
      amountDue,
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
    grand_total: amountDue,
    idempotency_key: idempotencyKey,
    ledger_journal_id: postingId,
    posting_id: postingId,
    readback_validation: validation,
  }
}

function pendingResponse(
  accepted: { order_id: string; accepted_at: string; tender?: { tender_id: string } },
  amountDue: number,
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

