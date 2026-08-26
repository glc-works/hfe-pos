// --- HFE SDK PRODUCTION ADAPTER (POS-ENG-STD-001) ---
// Official REST API Transport Layer powered by @hfe/sdk (Strict Fail-Closed)

import { HfeClient, HfeApiError as SdkApiError, type Int64String } from '@hfe/sdk'
import {
  HfePosFinancialPort,
  CompanyBookSettingsResponse,
  ResolveContactResponse,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
  RetailPostingContext,
  UniversalMultiTenderRequest,
  UniversalMultiTenderResponse,
  GenerateQrisPayload,
  QrisPaymentResponse,
  CashierShiftResponse,
  CashierShiftCloseResponse,
} from './HfePosFinancialPort'
import { MenuItem } from '../../types/pos'
import {
  HfePostingReadbackValidator,
  generateUUIDv4,
  assertCanonicalCashOrderPayload,
} from './HfePostingReadbackValidator'

export class HfeNetworkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'HfeNetworkError'
  }
}

export class HfeApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(`Hfe Core API Error (${status}): ${message}`)
    this.name = 'HfeApiError'
  }
}

export interface HfeSdkAdapterOptions {
  baseUrl?: string
  defaultBookId?: string
  timeoutMs?: number
  token?: string
}

export class HfeSdkAdapter implements HfePosFinancialPort {
  readonly isSimulated = false
  readonly adapterName = 'HfeSdkAdapter'

  private readonly client: HfeClient
  private readonly defaultBookId: string
  private readonly timeoutMs: number

  constructor(options?: HfeSdkAdapterOptions) {
    const baseUrl = options?.baseUrl || 'http://localhost:8080'
    this.defaultBookId = options?.defaultBookId || ''
    this.timeoutMs = options?.timeoutMs || 10000

    this.client = new HfeClient({
      baseUrl,
      token: options?.token,
      fetchFn: (...args) => globalThis.fetch(...args),
    })
  }

  private resolveTargetBook(bookId?: string): string {
    const book = bookId || this.defaultBookId
    if (!book || book.trim() === '') {
      throw new Error(
        'companyBookId is required for ledger operations. Fail-closed: zero fallback default allowed.'
      )
    }
    return book
  }

  private async request<T>(
    method: string,
    path: string,
    options: { params?: Record<string, any>; body?: any; idempotencyKey?: string; headers?: Record<string, string> } = {}
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      return await this.client.request<T>(method, path, options)
    } catch (err: unknown) {
      if (err instanceof SdkApiError) {
        let detailMsg = err.message
        if (err.rawBody) {
          try {
            const parsed = JSON.parse(err.rawBody)
            if (parsed.message) {
              detailMsg = parsed.message
            }
          } catch {
            // ignore
          }
        }
        const finalMsg = `Hfe Core API Error (${err.status}): ${detailMsg}`
        throw new HfeApiError(err.status, finalMsg, err.details || err.rawBody)
      }
      if (err instanceof HfeApiError) {
        throw err
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new HfeNetworkError(
          `Request timed out after ${this.timeoutMs}ms to ${this.client.baseUrl}${path}`,
          err
        )
      }
      throw new HfeNetworkError(
        `Network failure connecting to Hfe Core at ${this.client.baseUrl}${path}`,
        err
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async fetchProductCatalog(bookId?: string): Promise<MenuItem[]> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<MenuItem[]>('GET', `/v1/company-books/${targetBook}/products`)
  }

  async resolveContact(
    entryMode: 'phone' | 'guest-name',
    phone?: string,
    name?: string,
    bookId?: string
  ): Promise<ResolveContactResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    const payload = {
      entry_mode: entryMode,
      phone: phone || '',
      display_name: name || '',
    }
    return this.request<ResolveContactResponse>(
      'POST',
      `/v1/company-books/${targetBook}/contacts/resolve`,
      { body: payload }
    )
  }

  async submitRetailTransaction(
    payload: SubmitRetailTransactionPayload,
    bookId?: string
  ): Promise<SubmitRetailTransactionResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    const idempotencyKey = payload.idempotency_key || generateUUIDv4()

    const bodyPayload = {
      table_id: payload.table_id || '',
      contact_id: payload.contact_id,
      policy: payload.policy,
      payment_method: payload.payment_method,
      items: payload.items.map((item) => ({
        product_id: item.product_id,
        hfe_gl_account: item.hfe_gl_account,
        qty: item.qty,
        price: item.price,
        modifiers: item.modifiers,
        cost_price: item.cost_price,
      })),
      subtotal: payload.subtotal,
      tax_pb1_amount: payload.tax_pb1_amount,
      service_fee_amount: payload.service_fee_amount,
      discount_amount: payload.discount_amount,
      grand_total: payload.grand_total,
      card_metadata: payload.card_metadata,
      cashier_id: payload.cashier_id,
      branch_id: payload.branch_id,
      cost_center_id: payload.cost_center_id,
      idempotency_key: idempotencyKey,
    }

    return this.request<SubmitRetailTransactionResponse>(
      'POST',
      `/v1/company-books/${targetBook}/transactions`,
      {
        body: bodyPayload,
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
        idempotencyKey,
      }
    )
  }

  async postRetailOrder(
    payload: SubmitRetailTransactionPayload,
    context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse> {
    const targetBook = this.resolveTargetBook(context.companyBookId)
    assertCanonicalCashOrderPayload(payload, context, 'posting')

    const authorityHeaders = {
      'X-CBook-Authority-Context': context.authorityContext,
    }
    const processKey = `${payload.idempotency_key}:process`
    const submitKey = `${payload.idempotency_key}:submit`
    const postKey = `${payload.idempotency_key}:post`
    const processed = await this.client.operations.processPosRetailOrder({
      path: { book: targetBook },
      headers: { ...authorityHeaders, 'Idempotency-Key': processKey },
      body: {
        customer_contact_id: payload.contact_id || null,
        items: payload.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.qty,
          unit_price_minor: String(item.price) as Int64String,
        })),
        payment_method: payload.payment_method,
        session_id: context.sessionId,
      },
    })
    if (
      processed.body.subtotal_minor !== String(payload.subtotal) ||
      processed.body.tax_amount_minor !== '0' ||
      processed.body.discount_amount_minor !== '0' ||
      processed.body.final_total_minor !== String(payload.grand_total)
    ) {
      throw new Error('CORE amount mismatch: computed POS order totals do not match the cashier amount.')
    }

    const submitted = await this.client.operations.submitPosOrder({
      path: { book: targetBook, order: processed.body.id },
      headers: { ...authorityHeaders, 'Idempotency-Key': submitKey },
      body: {
        financial_date: context.financialDate,
        handover: {
          control_transferred: true,
          evidence_reference: context.handover.evidenceReference,
          occurred_at: context.handover.occurredAt,
        },
      },
    })
    const sourceToken = submitted.body.content_sha256
    if (!sourceToken) {
      throw new Error('Submitted CORE POS order omitted its stable source token; posting stopped fail-closed.')
    }
    const posted = await this.client.operations.postPosOrder({
      path: { book: targetBook, order: processed.body.id },
      headers: { ...authorityHeaders, 'Idempotency-Key': postKey },
      body: { expected_source_token: sourceToken },
    })

    if (posted.status === 202 || !('posting_id' in posted.body)) {
      return {
        tx_id: processed.body.id,
        status: 'pending',
        created_at: processed.body.created_at,
        grand_total: payload.grand_total,
        idempotency_key: payload.idempotency_key!,
      }
    }

    const durable = await this.client.operations.getPosting({
      path: { book: targetBook, posting: posted.body.posting_id },
    })
    const validation = HfePostingReadbackValidator.validate(
      {
        postingId: posted.body.posting_id,
        sourceCapability: 'pos_order',
        sourceObjectId: processed.body.id,
        stableEffectKey: postKey,
      },
      durable.body as any
    )

    if (!validation.isValid) {
      throw new Error(
        `Durable posting read-back mismatch: ${validation.mismatchReason || 'exact posting ID, POS source lineage, and applied finality are required.'}`
      )
    }

    const postingId = (durable.body as any).id || posted.body.posting_id
    return {
      tx_id: processed.body.id,
      status: 'posted',
      created_at: processed.body.created_at,
      grand_total: payload.grand_total,
      idempotency_key: payload.idempotency_key!,
      ledger_journal_id: postingId,
      posting_id: postingId,
    }
  }

  async reconcileRetailOrder(
    payload: SubmitRetailTransactionPayload,
    context: RetailPostingContext
  ): Promise<SubmitRetailTransactionResponse> {
    const targetBook = this.resolveTargetBook(context.companyBookId)
    assertCanonicalCashOrderPayload(payload, context, 'reconciliation')

    const processKey = `${payload.idempotency_key}:process`
    const postKey = `${payload.idempotency_key}:post`
    const discovered = await this.client.operations.processPosRetailOrder({
      path: { book: targetBook },
      headers: {
        'X-CBook-Authority-Context': context.authorityContext,
        'Idempotency-Key': processKey,
      },
      body: {
        customer_contact_id: payload.contact_id || null,
        items: payload.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.qty,
          unit_price_minor: String(item.price) as Int64String,
        })),
        payment_method: payload.payment_method,
        session_id: context.sessionId,
      },
    })
    if (
      discovered.body.subtotal_minor !== String(payload.subtotal) ||
      discovered.body.tax_amount_minor !== '0' ||
      discovered.body.discount_amount_minor !== '0' ||
      discovered.body.final_total_minor !== String(payload.grand_total)
    ) {
      throw new Error('CORE amount mismatch: discovered POS order totals do not match the unresolved cashier attempt.')
    }

    const current = await this.client.operations.getPosOrder({
      path: { book: targetBook, order: discovered.body.id },
    })
    if (
      current.body.id !== discovered.body.id ||
      current.body.company_book_id !== targetBook
    ) {
      throw new Error('CORE order reconciliation mismatch: exact order and Company Book are required.')
    }
    if (current.body.status !== 'posted' || !current.body.posting_id) {
      return {
        tx_id: current.body.id,
        status: 'pending',
        created_at: current.body.created_at,
        grand_total: payload.grand_total,
        idempotency_key: payload.idempotency_key!,
      }
    }

    const durable = await this.client.operations.getPosting({
      path: { book: targetBook, posting: current.body.posting_id },
    })
    const validation = HfePostingReadbackValidator.validate(
      {
        postingId: current.body.posting_id,
        sourceCapability: 'pos_order',
        sourceObjectId: current.body.id,
        stableEffectKey: postKey,
      },
      durable.body as any
    )

    if (!validation.isValid) {
      throw new Error(
        `Durable posting reconciliation mismatch: ${validation.mismatchReason || 'exact posting ID, POS source lineage, and applied finality are required.'}`
      )
    }

    const postingId = (durable.body as any).id || current.body.posting_id
    return {
      tx_id: current.body.id,
      status: 'posted',
      created_at: current.body.created_at,
      grand_total: payload.grand_total,
      idempotency_key: payload.idempotency_key!,
      ledger_journal_id: postingId,
      posting_id: postingId,
    }
  }

  async settleUniversalMultiTender(
    payload: UniversalMultiTenderRequest,
    bookId?: string
  ): Promise<UniversalMultiTenderResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    const idempotencyKey = payload.idempotency_key || generateUUIDv4()

    const bodyPayload = {
      document_reference_id: payload.document_reference_id,
      total_obligation_minor: payload.total_obligation_minor,
      tenders: payload.tenders,
      discrepancies: payload.discrepancies || [],
      cashier_id: payload.cashier_id,
      notes: payload.notes,
      idempotency_key: idempotencyKey,
    }

    return this.request<UniversalMultiTenderResponse>(
      'POST',
      `/v1/company-books/${targetBook}/settlements/multi-tender`,
      {
        body: bodyPayload,
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
        idempotencyKey,
      }
    )
  }

  async generateQrisPayment(
    payload: GenerateQrisPayload,
    bookId?: string
  ): Promise<QrisPaymentResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    const bodyPayload = {
      transaction_id: payload.transaction_id,
      amount_idr: payload.amount_idr,
      biller_split_fee_idr: payload.biller_split_fee_idr ?? 250,
      merchant_name: payload.merchant_name,
    }

    return this.request<QrisPaymentResponse>(
      'POST',
      `/v1/company-books/${targetBook}/payments/qris/generate`,
      { body: bodyPayload }
    )
  }

  async openCashierShift(
    cashierId: string,
    initialFloat: number,
    bookId?: string
  ): Promise<CashierShiftResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CashierShiftResponse>(
      'POST',
      `/v1/company-books/${targetBook}/shifts/open`,
      {
        body: {
          cashier_id: cashierId,
          initial_float: initialFloat,
        },
      }
    )
  }

  async closeCashierShift(
    shiftId: string,
    reportedCash: number,
    bookId?: string
  ): Promise<CashierShiftCloseResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CashierShiftCloseResponse>(
      'POST',
      `/v1/company-books/${targetBook}/shifts/${shiftId}/close`,
      {
        body: {
          reported_cash: reportedCash,
        },
      }
    )
  }

  async fetchCompanyBookSettings(bookId?: string): Promise<CompanyBookSettingsResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CompanyBookSettingsResponse>(
      'GET',
      `/v1/company-books/${targetBook}/settings`
    )
  }
}
