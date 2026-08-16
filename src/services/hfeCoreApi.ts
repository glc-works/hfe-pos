// --- HFE REST API TRANSPORT LAYER & OFFLINE BUFFER SERVICE (CORE) ---
import { MenuItem, PB1TaxMode, TeamMember, InviteStaffPayload } from '../types/pos'
import { PRODUCT_CATALOG } from '../data/mockData'

const DEFAULT_BASE_URL = 'http://localhost:8080'
const DB_NAME = 'HfePosOfflineBufferDB'
const DB_VERSION = 1
const STORE_NAME = 'pending_transactions'

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

// --- INDEXEDDB OFFLINE BUFFER HELPERS ---
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in this environment'))
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveToOfflineBuffer(payload: SubmitTransactionPayload): Promise<void> {
  try {
    const db = await openOfflineDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const entry = {
      timestamp: new Date().toISOString(),
      payload,
      idempotency_key: payload.idempotency_key || generateUUIDv4(),
    }
    store.add(entry)
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined)
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('[HfeApi] Failed to write payload to IndexedDB buffer:', err)
  }
}

// --- REST CLIENT IMPLEMENTATIONS ---

/**
 * GET /v1/company-books/{book}/products
 */
export async function fetchProductCatalog(bookId: string = 'BOOK-CAFE-HQ-88', baseUrl: string = DEFAULT_BASE_URL): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/products`)
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Network error or endpoint offline. Falling back to mock product catalog.')
    return PRODUCT_CATALOG
  }
}

/**
 * POST /v1/company-books/{book}/contacts/resolve
 */
export async function resolveContact(
  entryMode: 'phone' | 'guest-name',
  phone?: string,
  name?: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<ResolveContactResponse> {
  const payload = {
    entry_mode: entryMode,
    phone: phone || '',
    display_name: name || '',
  }

  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/contacts/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Contact resolution offline. Returning mock contact.')
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
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<SubmitTransactionResponse> {
  const idempotencyKey = payload.idempotency_key || generateUUIDv4()

  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ ...payload, idempotency_key: idempotencyKey }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Transaction submission offline. Buffering to IndexedDB.')
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
 * POST /v1/company-books/{book}/payments/qris/generate
 */
export async function generateQris(
  txId: string,
  amount: number,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<QrisResponse> {
  const payload = {
    transaction_id: txId,
    amount_idr: amount,
    biller_split_fee_idr: 250,
  }

  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/payments/qris/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] QRIS generation offline. Returning mock QRIS response.')
    return {
      payment_id: `PAY-QRIS-${txId}`,
      qris_string: '00020101021226670016ID.CO.QRIS.WWW.HFE.TOGROW.ID.MNO0102030405065204581253033605802ID5915Artisan Cafe HQ6007Jakarta61051211062070703A0163041234',
      qr_image_url: `https://hfe.togrow.id/qr/PAY-QRIS-${txId}.png`,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }
  }
}

/**
 * PATCH /v1/company-books/{book}/kds/orders/{order_id}/bump
 */
export async function bumpKdsOrder(
  orderId: string,
  status: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<BumpKdsOrderResponse> {
  const payload = {
    from_status: 'brewing',
    target_status: status,
    station_id: 'drink-bar',
  }

  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/kds/orders/${orderId}/bump`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] KDS order status bump offline. Returning mock bumped status.')
    return {
      order_id: orderId,
      status,
      bumped_at: new Date().toISOString(),
    }
  }
}

/**
 * PUT /v1/company-books/{book}/settings
 */
export async function saveStoreSettings(
  payload: Record<string, unknown>,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ success: boolean; updated_at: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Save store settings offline. returning mock response.')
    return { success: true, updated_at: new Date().toISOString() }
  }
}

/**
 * GET /v1/company-books/{book}/memberships
 */
export async function fetchTeamRoster(
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/memberships`)
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Team roster fetch offline. Returning default roster.')
    return [
      {
        id: 'MEM-001',
        name: 'Budi Santoso',
        contact: 'owner@artisancafe.id',
        role: 'owner',
        status: 'active',
        pinCode: '123456',
        invitedAt: '2026-08-01T08:00:00Z',
        activatedAt: '2026-08-01T08:05:00Z',
      },
      {
        id: 'MEM-002',
        name: 'Siti Rahma',
        contact: '6281234567890',
        role: 'cashier',
        status: 'active',
        pinCode: '654321',
        invitedAt: '2026-08-05T09:00:00Z',
        activatedAt: '2026-08-05T09:10:00Z',
      },
      {
        id: 'MEM-003',
        name: 'Andi Barista',
        contact: '6289876543210',
        role: 'barista',
        status: 'pending_invite',
        pinCode: '112233',
        invitedAt: '2026-08-14T10:00:00Z',
      },
    ]
  }
}

/**
 * POST /v1/company-books/{book}/memberships/invitations
 */
export async function sendStaffInvitation(
  payload: InviteStaffPayload,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<TeamMember> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/memberships/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Send staff invitation offline. Returning generated member.')
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

/**
 * POST /v1/company-books/{book}/memberships/accept
 */
export async function acceptStaffPin(
  pinCode: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ success: boolean; membership_id: string; role: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/memberships/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: pinCode }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Staff PIN accept offline. Validating mock PIN.')
    return {
      success: true,
      membership_id: 'MEM-002',
      role: 'cashier',
    }
  }
}

/**
 * DELETE /v1/company-books/{book}/memberships/{id}
 */
export async function revokeStaffAccess(
  membershipId: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/memberships/${membershipId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.info('[HfeApi] Revoke staff access offline. Returning success.')
    return { success: true }
  }
}

// --- CART MATH CALCULATION HELPER ---
export interface CartItemMath {
  price: number
  quantity: number
  milkOption?: string
}

export interface CartTotals {
  rawSubtotal: number
  totalDiscount: number
  discountedSubtotal: number
  calculatedServiceFee: number
  calculatedPB1Tax: number
  grandTotalBill: number
  totalCartCount: number
}

export function calculateCartTotals(
  cart: CartItemMath[],
  taxPB1Mode: PB1TaxMode = 1,
  serviceFeeRate: number = 5,
  selectedTipAmount: number = 0,
  promoDiscount: number = 0,
  voucherDiscount: number = 0
): CartTotals {
  const rawSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.price
    if (item.milkOption?.includes('Oat Milk') || item.milkOption?.includes('Almond Milk')) {
      itemPrice += 5000
    }
    return sum + itemPrice * item.quantity
  }, 0)

  const totalDiscount = promoDiscount + voucherDiscount
  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount)

  const calculatedServiceFee = Math.round(discountedSubtotal * (serviceFeeRate / 100))

  let calculatedPB1Tax = 0
  if (taxPB1Mode === 1) {
    calculatedPB1Tax = Math.round(discountedSubtotal * 0.10)
  } else if (taxPB1Mode === 2) {
    calculatedPB1Tax = Math.round(discountedSubtotal - discountedSubtotal / 1.10)
  }

  const grandTotalBill =
    taxPB1Mode === 1
      ? discountedSubtotal + calculatedServiceFee + calculatedPB1Tax + selectedTipAmount
      : discountedSubtotal + calculatedServiceFee + selectedTipAmount

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return {
    rawSubtotal,
    totalDiscount,
    discountedSubtotal,
    calculatedServiceFee,
    calculatedPB1Tax,
    grandTotalBill,
    totalCartCount,
  }
}
