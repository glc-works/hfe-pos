// --- HFE SDK PRODUCTION ADAPTER (POS-ENG-STD-001) ---
// Official REST API Transport Layer for Hfe Core (Strict Fail-Closed)

import {
  HfePosFinancialPort,
  CompanyBookSettingsResponse,
  ResolveContactResponse,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
  GenerateQrisPayload,
  QrisPaymentResponse,
  CashierShiftResponse,
  CashierShiftCloseResponse
} from './HfePosFinancialPort'
import { MenuItem } from '../../types/pos'

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

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface HfeSdkAdapterOptions {
  baseUrl?: string
  defaultBookId?: string
  timeoutMs?: number
}

export class HfeSdkAdapter implements HfePosFinancialPort {
  readonly isSimulated = false
  readonly adapterName = 'HfeSdkAdapter'

  private readonly baseUrl: string
  private readonly defaultBookId: string
  private readonly timeoutMs: number

  constructor(options?: HfeSdkAdapterOptions) {
    this.baseUrl = options?.baseUrl || 'http://localhost:8080'
    this.defaultBookId = options?.defaultBookId || ''
    this.timeoutMs = options?.timeoutMs || 10000
  }

  private resolveTargetBook(bookId?: string): string {
    const book = bookId || this.defaultBookId
    if (!book || book.trim() === '') {
      throw new Error('companyBookId is required for ledger operations. Fail-closed: zero fallback default allowed.')
    }
    return book
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...init?.headers,
        },
      })

      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch {
          errorData = await response.text()
        }
        const errorMsg =
          typeof errorData === 'object' && errorData?.message
            ? errorData.message
            : `Request failed with HTTP status ${response.status}`
        throw new HfeApiError(response.status, errorMsg, errorData)
      }

      return (await response.json()) as T
    } catch (err: unknown) {
      if (err instanceof HfeApiError) {
        throw err
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new HfeNetworkError(`Request timed out after ${this.timeoutMs}ms to ${url}`, err)
      }
      throw new HfeNetworkError(`Network failure connecting to Hfe Core at ${url}`, err)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async fetchProductCatalog(bookId?: string): Promise<MenuItem[]> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<MenuItem[]>(`/v1/company-books/${targetBook}/products`, {
      method: 'GET',
    })
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
    return this.request<ResolveContactResponse>(`/v1/company-books/${targetBook}/contacts/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
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

    return this.request<SubmitRetailTransactionResponse>(`/v1/company-books/${targetBook}/transactions`, {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(bodyPayload),
    })
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

    return this.request<QrisPaymentResponse>(`/v1/company-books/${targetBook}/payments/qris/generate`, {
      method: 'POST',
      body: JSON.stringify(bodyPayload),
    })
  }

  async openCashierShift(
    cashierId: string,
    initialFloat: number,
    bookId?: string
  ): Promise<CashierShiftResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CashierShiftResponse>(`/v1/company-books/${targetBook}/shifts/open`, {
      method: 'POST',
      body: JSON.stringify({
        cashier_id: cashierId,
        initial_float: initialFloat,
      }),
    })
  }

  async closeCashierShift(
    shiftId: string,
    reportedCash: number,
    bookId?: string
  ): Promise<CashierShiftCloseResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CashierShiftCloseResponse>(`/v1/company-books/${targetBook}/shifts/${shiftId}/close`, {
      method: 'POST',
      body: JSON.stringify({
        reported_cash: reportedCash,
      }),
    })
  }

  async fetchCompanyBookSettings(bookId?: string): Promise<CompanyBookSettingsResponse> {
    const targetBook = this.resolveTargetBook(bookId)
    return this.request<CompanyBookSettingsResponse>(`/v1/company-books/${targetBook}/settings`, {
      method: 'GET',
    })
  }
}
