// --- HFE REST API TRANSPORT LAYER & OFFLINE BUFFER SERVICE (CORE) ---
import { MenuItem, TeamMember, InviteStaffPayload } from '../types/pos'
import { PRODUCT_CATALOG } from '../data/mockData'

const DEFAULT_BASE_URL = 'http://localhost:8080'
const DB_NAME = 'HfePosOfflineBufferDB'
const DB_VERSION = 1
const STORE_NAME = 'pending_transactions'
const HFE_API_ALLOWED_ORIGINS = new Set([
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'https://api.staging.hfeit.com',
  'https://api.hfeit.com',
])

export function buildHfeUrl(baseUrl: string, path: string): string {
  const url = new URL(path, `${baseUrl.replace(/\/$/, '')}/`)
  if (!HFE_API_ALLOWED_ORIGINS.has(url.origin)) {
    throw new Error('Hfe API base URL must use an approved HFE origin')
  }
  if (url.username || url.password) {
    throw new Error('Hfe API base URL must not contain credentials')
  }
  return url.toString()
}

// --- UUID V4 GENERATOR FOR IDEMPOTENCY KEY ---
export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// --- INTERFACES FOR API ENDPOINT CONTRACTS ---
export interface ResolveContactResponse {
  contact_id: string
  loyalty_tier: string
  loyalty_points: number
  active_vouchers_count: number
}

export interface TransactionItemPayload {
  product_id: string
  hfe_gl_account: string
  qty: number
  price: number
  modifiers?: Record<string, string>
}

export interface SubmitTransactionPayload {
  table_id: string
  contact_id: string
  policy: 'pay-first' | 'open-tab'
  items: TransactionItemPayload[]
  subtotal: number
  tax_pb1_amount: number
  service_fee_amount: number
  applied_voucher_code?: string
  discount_amount: number
  grand_total: number
  idempotency_key?: string
}

export interface SubmitTransactionResponse {
  tx_id: string
  status: string
  created_at: string
  grand_total: number
  idempotency_key: string
}

export interface QrisResponse {
  payment_id: string
  qris_string: string
  qr_image_url: string
  expires_at: string
}

export interface BumpKdsOrderResponse {
  order_id: string
  status: string
  bumped_at: string
}

export type PaymentTenderType =
  | 'cash'
  | 'qris'
  | 'card_debit'
  | 'card_credit'
  | 'hotel_room_folio'
  | 'voucher_credit'
  | 'bank_transfer'

export interface TenderItemPayload {
  tender_type: PaymentTenderType
  amount_minor: number
  reference_id?: string
  gl_account_override?: string
}

export interface DiscrepancyItemPayload {
  discrepancy_type: 'rounding_adjustment' | 'tip_income' | 'merchant_discount_fee' | 'cash_shortage' | 'cash_overage'
  amount_minor: number
  reason?: string
}

export interface UniversalMultiTenderRequest {
  document_reference_id: string
  total_obligation_minor: number
  tenders: TenderItemPayload[]
  discrepancies?: DiscrepancyItemPayload[]
  notes?: string
}

export interface UniversalMultiTenderResponse {
  settlement_id: string
  document_reference_id: string
  total_obligation_minor: number
  total_tendered_minor: number
  total_discrepancy_minor: number
  status: string
  settled_at: string
  journal_posting_id: string
}

export interface BarcodeLookupResponse {
  barcode: string
  productId: string
  product_id?: string
  name: string
  category: string
  retailPrice: number
  retail_price?: number
  wholesalePrice: number
  wholesale_price?: number
  wholesaleMinQty: number
  wholesale_min_qty?: number
  uom: 'Pcs' | 'Pack' | 'Karton' | 'Dus'
  stockLevel: number
  stock_level?: number
}

// --- INDEXEDDB OFFLINE BUFFER HELPERS ---
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB not supported in this environment'))
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveToOfflineBuffer(payload: SubmitTransactionPayload): Promise<void> {
  const db = await openOfflineDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  store.add({ timestamp: new Date().toISOString(), payload, idempotency_key: payload.idempotency_key || generateUUIDv4() })
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'))
  })
}

// --- REST CLIENT IMPLEMENTATIONS ---

/** GET /v1/company-books/{book}/products */
export async function fetchProductCatalog(bookId = 'BOOK-CAFE-HQ-88'): Promise<MenuItem[]> {
  try {
    const response = await fetch(`http://localhost:8080/v1/company-books/${bookId}/products`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return PRODUCT_CATALOG
  }
}

/** POST /v1/company-books/{book}/contacts/resolve */
export async function resolveContact(
  entryMode: 'phone' | 'guest-name',
  phone?: string,
  name?: string,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<ResolveContactResponse> {
  const payload = { entry_mode: entryMode, phone: phone || '', display_name: name || '' }
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/contacts/resolve`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return {
      contact_id: phone ? `CUST-${phone}` : `CUST-GUEST-${name || '01'}`,
      loyalty_tier: 'Gold',
      loyalty_points: 450,
      active_vouchers_count: 2,
    }
  }
}

/**
 * POST /v1/company-books/{book}/transactions
 * MANDATORY HEADER: X-Idempotency-Key (UUID v4)
 */
export async function submitTransaction(
  payload: SubmitTransactionPayload,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<SubmitTransactionResponse> {
  const idempotencyKey = payload.idempotency_key || generateUUIDv4()
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/transactions`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ ...payload, idempotency_key: idempotencyKey }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    await saveToOfflineBuffer({ ...payload, idempotency_key: idempotencyKey })
    return {
      tx_id: `TX-OFFLINE-${Date.now()}`,
      status: 'buffered_offline',
      created_at: new Date().toISOString(),
      grand_total: payload.grand_total,
      idempotency_key: idempotencyKey,
    }
  }
}

/**
 * POST /v1/company-books/{book}/settlements/multi-tender
 * MANDATORY HEADER: X-Idempotency-Key (UUID v4)
 */
export async function settleUniversalMultiTender(
  payload: UniversalMultiTenderRequest,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<UniversalMultiTenderResponse> {
  const idempotencyKey = generateUUIDv4()
  const totalTendered = payload.tenders.reduce((sum, t) => sum + t.amount_minor, 0)
  const totalDiscrepancy = (payload.discrepancies || []).reduce((sum, d) => sum + d.amount_minor, 0)
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/settlements/multi-tender`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return {
      settlement_id: `SETTLE-${generateUUIDv4().slice(0, 8)}`,
      document_reference_id: payload.document_reference_id,
      total_obligation_minor: payload.total_obligation_minor,
      total_tendered_minor: totalTendered,
      total_discrepancy_minor: totalDiscrepancy,
      status: 'settled',
      settled_at: new Date().toISOString(),
      journal_posting_id: `POST-${generateUUIDv4().slice(0, 8)}`,
    }
  }
}

/** POST /v1/company-books/{book}/payments/qris/generate */
export async function generateQris(
  txId: string,
  amount: number,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<QrisResponse> {
  const payload = { transaction_id: txId, amount_idr: amount, biller_split_fee_idr: 250 }
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/payments/qris/generate`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return {
      payment_id: `PAY-QRIS-${txId}`,
      qris_string: '00020101021226670016ID.CO.QRIS.WWW.HFE.TOGROW.ID.MNO0102030405065204581253033605802ID5915Artisan Cafe HQ6007Jakarta61051211062070703A0163041234',
      qr_image_url: `https://hfe.togrow.id/qr/PAY-QRIS-${txId}.png`,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }
  }
}

/** PATCH /v1/company-books/{book}/kds/orders/{order_id}/bump */
export async function bumpKdsOrder(
  orderId: string,
  status: string,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<BumpKdsOrderResponse> {
  const payload = { from_status: 'brewing', target_status: status, station_id: 'drink-bar' }
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/kds/orders/${orderId}/bump`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return { order_id: orderId, status, bumped_at: new Date().toISOString() }
  }
}

/** POST /v1/company-books/{book}/barcodes/lookup */
export async function lookupBarcode(
  barcodeString: string,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<BarcodeLookupResponse | null> {
  try {
    const res = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/barcodes/lookup`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: barcodeString }),
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    return {
      ...data,
      productId: data.productId || data.product_id || '',
      product_id: data.product_id || data.productId || '',
      retailPrice: data.retailPrice ?? data.retail_price ?? 0,
      retail_price: data.retail_price ?? data.retailPrice ?? 0,
      wholesalePrice: data.wholesalePrice ?? data.wholesale_price ?? 0,
      wholesale_price: data.wholesale_price ?? data.wholesalePrice ?? 0,
      wholesaleMinQty: data.wholesaleMinQty ?? data.wholesale_min_qty ?? 1,
      wholesale_min_qty: data.wholesale_min_qty ?? data.wholesaleMinQty ?? 1,
      stockLevel: data.stockLevel ?? data.stock_level ?? 0,
      stock_level: data.stock_level ?? data.stockLevel ?? 0,
      uom: data.uom || 'Pcs',
    }
  } catch {
    const MOCK_BARCODES: Record<string, BarcodeLookupResponse> = {
      '8999901': { barcode: '8999901', productId: 'RET-001', product_id: 'RET-001', name: 'Minyak Goreng Rose Brand 1L', category: 'Sembako', retailPrice: 22000, retail_price: 22000, wholesalePrice: 19500, wholesale_price: 19500, wholesaleMinQty: 40, wholesale_min_qty: 40, uom: 'Karton', stockLevel: 120, stock_level: 120 },
      '8999902': { barcode: '8999902', productId: 'RET-002', product_id: 'RET-002', name: 'Beras Pandan Wangi 5kg', category: 'Sembako', retailPrice: 78000, retail_price: 78000, wholesalePrice: 72000, wholesale_price: 72000, wholesaleMinQty: 10, wholesale_min_qty: 10, uom: 'Pack', stockLevel: 45, stock_level: 45 },
      '8999903': { barcode: '8999903', productId: 'RET-003', product_id: 'RET-003', name: 'Gula Pasir Gulaku 1kg', category: 'Sembako', retailPrice: 17500, retail_price: 17500, wholesalePrice: 15800, wholesale_price: 15800, wholesaleMinQty: 24, wholesale_min_qty: 24, uom: 'Karton', stockLevel: 80, stock_level: 80 },
      '8999904': { barcode: '8999904', productId: 'RET-004', product_id: 'RET-004', name: 'Indomie Goreng Original 85g', category: 'Mie Instant', retailPrice: 3200, retail_price: 3200, wholesalePrice: 2850, wholesale_price: 2850, wholesaleMinQty: 40, wholesale_min_qty: 40, uom: 'Karton', stockLevel: 400, stock_level: 400 },
    }
    return MOCK_BARCODES[barcodeString] || null
  }
}

/** PUT /v1/company-books/{book}/settings */
export async function saveStoreSettings(
  payload: Record<string, unknown>,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<{ success: boolean; updated_at: string }> {
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/settings`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return { success: true, updated_at: new Date().toISOString() }
  }
}

/** GET /v1/company-books/{book}/memberships */
export async function fetchTeamRoster(bookId = 'BOOK-CAFE-HQ-88'): Promise<TeamMember[]> {
  try {
    const response = await fetch(`http://localhost:8080/v1/company-books/${bookId}/memberships`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return [
      { id: 'MEM-001', name: 'Budi Santoso', contact: 'owner@artisancafe.id', role: 'owner', status: 'active', pinCode: '123456', invitedAt: '2026-08-01T08:00:00Z', activatedAt: '2026-08-01T08:05:00Z' },
      { id: 'MEM-002', name: 'Siti Rahma', contact: '6281234567890', role: 'cashier', status: 'active', pinCode: '654321', invitedAt: '2026-08-05T09:00:00Z', activatedAt: '2026-08-05T09:10:00Z' },
      { id: 'MEM-003', name: 'Andi Barista', contact: '6289876543210', role: 'barista', status: 'pending_invite', pinCode: '112233', invitedAt: '2026-08-14T10:00:00Z' },
    ]
  }
}

/** POST /v1/company-books/{book}/memberships/invitations */
export async function sendStaffInvitation(
  payload: InviteStaffPayload,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<TeamMember> {
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/memberships/invitations`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      name: payload.name,
      contact: payload.contact,
      role: payload.role,
      status: 'pending_invite',
      pinCode: Math.floor(100000 + Math.random() * 900000).toString(),
      invitedAt: new Date().toISOString(),
    }
  }
}

/** POST /v1/company-books/{book}/memberships/accept */
export async function acceptStaffPin(
  pinCode: string,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<{ success: boolean; membership_id: string; role: string }> {
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/memberships/accept`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: pinCode }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return { success: true, membership_id: 'MEM-002', role: 'cashier' }
  }
}

/** DELETE /v1/company-books/{book}/memberships/{id} */
export async function revokeStaffAccess(
  membershipId: string,
  bookId = 'BOOK-CAFE-HQ-88',
  baseUrl = DEFAULT_BASE_URL
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(buildHfeUrl(baseUrl, `/v1/company-books/${bookId}/memberships/${membershipId}`), {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch {
    return { success: true }
  }
}

// --- CART MATH CALCULATION HELPER (DELEGATED TO CARTMATHSERVICE) ---
export { calculateCartTotals } from './cartMathService'
export type { CartItemMath, CartTotals } from './cartMathService'
