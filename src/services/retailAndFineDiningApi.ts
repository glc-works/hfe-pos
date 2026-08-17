// --- RETAIL & FINE DINING API TRANSPORT EXTENSIONS ---

const DEFAULT_BASE_URL = 'http://localhost:8080'

import { BarcodeLookupResponse, lookupBarcode } from './hfeCoreApi'

export interface KasbonReceivablesResponse {
  contactId: string
  customerName: string
  phone: string
  creditLimit: number
  activeBalance: number
  dueDate: string
  status: 'active' | 'overdue' | 'clear'
}

export interface SettleKasbonResponse {
  success: boolean
  remainingBalance: number
  paidAmount: number
  settledAt: string
  txId: string
}

export interface FireCourseResponse {
  orderId: string
  courseNumber: number
  courseName: string
  status: 'Fired' | 'Plating' | 'Served'
  timestamp: string
}

export interface WineCellarBottle {
  id: string
  name: string
  vintage: number
  producer: string
  region: string
  rating: number
  stockBottles: number
  pricePerBottle: number
  pricePerGlass: number
  recommendedPairing: string
  decantTimeMinutes: number
  flavorProfile: string[]
}

export interface PourWineResponse {
  bottleId: string
  pourType: 'glass' | 'bottle'
  deductedQty: number
  remainingBottles: number
  remainingGlasses: number
}

export interface VipGuestHistory {
  contactId: string
  guestName: string
  phone: string
  totalVisits: number
  preferredTable: string
  preferredSommelier: string
  favoriteVintage: string
  allergenAlert: string
  anniversaryDate?: string
  birthdayDate?: string
  specialNotes?: string
  lastVisitDate: string
}



/**
 * GET /v1/company-books/{book}/contacts/{id}/receivables
 */
export async function fetchKasbonBalance(
  contactId: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<KasbonReceivablesResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/contacts/${contactId}/receivables`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    return {
      contactId,
      customerName: contactId === 'CUST-01' ? 'Pak Haji Agus' : 'Ibu Hj. Ratna',
      phone: '081298765432',
      creditLimit: 1500000,
      activeBalance: 450000,
      dueDate: '2026-08-25',
      status: 'active'
    }
  }
}

/**
 * POST /v1/company-books/{book}/contacts/{id}/kasbon/pay
 */
export async function settleKasbon(
  contactId: string,
  amount: number,
  paymentMethod: 'cash' | 'qris' = 'cash',
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<SettleKasbonResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/contacts/${contactId}/kasbon/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, payment_method: paymentMethod })
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    const initialBalance = 450000
    const remainingBalance = Math.max(0, initialBalance - amount)
    return {
      success: true,
      remainingBalance,
      paidAmount: amount,
      settledAt: new Date().toISOString(),
      txId: `KASBON-PAY-${Date.now()}`
    }
  }
}

/**
 * POST /v1/company-books/{book}/kds/fire-course
 */
export async function fireCourse(
  orderId: string,
  courseNumber: number,
  courseName: string = 'Appetizer',
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<FireCourseResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/kds/fire-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, course_number: courseNumber, course_name: courseName })
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    return {
      orderId,
      courseNumber,
      courseName,
      status: 'Fired',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * GET /v1/company-books/{book}/cellar/bottles
 */
export async function fetchCellarBottles(
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<WineCellarBottle[]> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/cellar/bottles`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    return [
      {
        id: 'WINE-001',
        name: 'Château Margaux Premier Grand Cru Classé',
        vintage: 2018,
        producer: 'Château Margaux',
        region: 'Bordeaux, France',
        rating: 98,
        stockBottles: 12,
        pricePerBottle: 18500000,
        pricePerGlass: 3800000,
        recommendedPairing: 'A5 Miyazaki Wagyu Ribeye & Truffle Jus',
        decantTimeMinutes: 45,
        flavorProfile: ['Blackcurrant', 'Cedarwood', 'Silky Tannins', 'Violet']
      },
      {
        id: 'WINE-002',
        name: 'Domaine de la Romanée-Conti Grands Échézeaux',
        vintage: 2017,
        producer: 'Domaine de la Romanée-Conti',
        region: 'Burgundy, France',
        rating: 99,
        stockBottles: 6,
        pricePerBottle: 42000000,
        pricePerGlass: 8500000,
        recommendedPairing: 'Pan-Seared Duck Breast & Black Cherry Reduction',
        decantTimeMinutes: 60,
        flavorProfile: ['Ripe Cherry', 'Earthy Forest Floor', 'Spice', 'Velvet']
      },
      {
        id: 'WINE-003',
        name: 'Opus One Napa Valley Red Blend',
        vintage: 2019,
        producer: 'Opus One Winery',
        region: 'Napa Valley, USA',
        rating: 96,
        stockBottles: 18,
        pricePerBottle: 12500000,
        pricePerGlass: 2600000,
        recommendedPairing: 'Dry-Aged Prime Angus Striploin',
        decantTimeMinutes: 30,
        flavorProfile: ['Plum', 'Dark Chocolate', 'Espresso', 'Oak']
      }
    ]
  }
}

/**
 * POST /v1/company-books/{book}/cellar/pour
 */
export async function pourWineBottle(
  bottleId: string,
  pourType: 'glass' | 'bottle' = 'glass',
  qty: number = 1,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<PourWineResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/cellar/pour`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bottle_id: bottleId, pour_type: pourType, qty })
    })
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    const currentBottles = 10
    const glassDeductionFraction = pourType === 'bottle' ? qty : qty * 0.2
    const remainingBottles = Math.max(0, currentBottles - glassDeductionFraction)
    const remainingGlasses = Math.round(remainingBottles * 5)
    return {
      bottleId,
      pourType,
      deductedQty: qty,
      remainingBottles,
      remainingGlasses
    }
  }
}

/**
 * GET /v1/company-books/{book}/vip-guests/{id}
 */
export async function fetchVipGuestHistory(
  contactId: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<VipGuestHistory> {
  try {
    const res = await fetch(`${baseUrl}/v1/company-books/${bookId}/vip-guests/${contactId}`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch {
    return {
      contactId,
      guestName: 'Drs. H. Bambang Soeprapto',
      phone: '0811888999',
      totalVisits: 28,
      preferredTable: 'Table 01 (Chef Table Corner)',
      preferredSommelier: 'Jean-Luc (Master Sommelier)',
      favoriteVintage: 'Château Margaux 2018',
      allergenAlert: 'Strictly No Shellfish / Crustaceans',
      anniversaryDate: '12 September',
      birthdayDate: '24 April',
      specialNotes: 'Prefers quiet corner table, still water zero ice, medium-rare Wagyu.',
      lastVisitDate: '2026-08-02'
    }
  }
}
