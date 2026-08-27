import type { HfeClient, Int64String } from '@hfe/sdk'
import type {
  GovernedRetailCheckoutPayload,
  RetailPostingContext,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'
import { HfePostingReadbackValidator } from './HfePostingReadbackValidator'

export async function postGovernedPosCheckout(
  client: HfeClient,
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
  targetBook: string,
): Promise<SubmitRetailTransactionResponse> {
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
  const amountDue = Number(quoted.body.amount_due_minor)
  if (!Number.isSafeInteger(amountDue) || amountDue < 0) {
    throw new Error('CORE quote amount is outside the POS exact minor-unit range.')
  }
  const tenderEligibility = quoted.body.tender_eligibility.filter(
    (entry) => entry.tender_type === payload.payment_method,
  )
  if (tenderEligibility.length !== 1 || !tenderEligibility[0].eligible) {
    const reason = tenderEligibility[0]?.reason_code || `missing_or_ambiguous_${payload.payment_method}_eligibility`
    throw new Error(`${payload.payment_method.toUpperCase()} tender is not eligible for this authoritative quote: ${reason}.`)
  }

  const qrisIntent = payload.payment_method === 'qris'
    ? await client.operations.generatePosQris({
        path: { book: targetBook },
        headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:qris-intent` },
        body: {
          amount_idr: quoted.body.amount_due_minor as Int64String,
          transaction_id: quoted.body.quote_id,
        },
      })
    : null
  const accepted = await client.operations.acceptGovernedPosOrder({
    path: { book: targetBook },
    headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:accept` },
    body: {
      quote_digest_sha256: quoted.body.digest_sha256,
      quote_id: quoted.body.quote_id,
      quote_revision: quoted.body.revision,
      tender: {
        amount_minor: quoted.body.amount_due_minor,
        ...(qrisIntent ? { provider_intent_reference: qrisIntent.body.payment_id } : {}),
        tender_type: payload.payment_method,
      },
    },
  })

  if (payload.payment_method === 'qris') {
    return pendingResponse(accepted.body, amountDue, payload.idempotency_key, qrisIntent?.body)
  }
  const confirmed = await client.operations.confirmGovernedPosCashTender({
    path: { book: targetBook, tender_id: accepted.body.tender.tender_id },
    headers: { ...authorityHeaders, 'Idempotency-Key': `${payload.idempotency_key}:confirm` },
    body: { accepted_tender_effect_key: accepted.body.tender.acceptance_effect_key },
  })
  if (confirmed.status === 202 || !('posting_id' in confirmed.body)) {
    return pendingResponse(accepted.body, amountDue, payload.idempotency_key)
  }

  const durable = await client.operations.getPosting({
    path: { book: targetBook, posting: confirmed.body.posting_id },
  })
  const validation = HfePostingReadbackValidator.validate({
    postingId: confirmed.body.posting_id,
    expectedBookId: targetBook,
    sourceCapability: 'pos_tender_sale',
    sourceObjectId: accepted.body.tender.tender_id,
    stableEffectKey: accepted.body.tender.acceptance_effect_key,
  }, durable.body as any)
  if (!validation.isValid) {
    throw new Error(
      `Durable governed tender read-back mismatch: ${validation.mismatchReason || 'exact tender lineage and applied finality are required.'}`,
    )
  }
  return {
    tx_id: accepted.body.order_id,
    status: 'posted',
    created_at: accepted.body.accepted_at,
    grand_total: amountDue,
    idempotency_key: payload.idempotency_key,
    ledger_journal_id: confirmed.body.posting_id,
    posting_id: confirmed.body.posting_id,
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
