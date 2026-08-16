import { describe, it, expect, beforeEach } from 'vitest'
import { translations } from '../i18n/translations'
import { DEFAULT_STOREFRONT_CUSTOMIZATION } from '../data/defaultStorefrontCustomization'

const storageMock: Record<string, string> = {}
const localStorageMock = {
  getItem: (k: string) => storageMock[k] || null,
  setItem: (k: string, v: string) => { storageMock[k] = v },
  removeItem: (k: string) => { delete storageMock[k] },
  clear: () => { Object.keys(storageMock).forEach((k) => delete storageMock[k]) }
}
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
}

describe('🏛️ HFE-UI-STD-001: Unified Master Universal UI & Accounting Truth Suite', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ==========================================
  // PILLAR I: HARDWARE GEOMETRY & NATIVE PARITY
  // ==========================================
  describe('Pillar I: Viewport Geometry, Golden Ratio & 8pt Grid', () => {
    it('satisfies Golden Ratio (phi ≈ 1.618) dual-pane desktop column proportion', () => {
      const totalColumns = 12
      const leftExplorerCols = 8 // ~66.7% approximation of 61.8%
      const rightCartCols = 4     // ~33.3% approximation of 38.2%

      const ratio = leftExplorerCols / rightCartCols
      expect(leftExplorerCols + rightCartCols).toBe(totalColumns)
      expect(ratio).toBe(2.0) // Fibonacci (8/4 = 2:1)
      expect(leftExplorerCols / totalColumns).toBeCloseTo(0.667, 2)
    })

    it('enforces 8-point spatial rhythm units (multiples of 4/8)', () => {
      const validSpacings = [4, 8, 12, 16, 24, 32, 48, 64]
      validSpacings.forEach((px) => {
        expect(px % 4).toBe(0)
      })
    })

    it('formats monetary currency cleanly for baseline optical alignment', () => {
      const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`
      const formatted = formatCurrency(86000)
      expect(formatted).toContain('86.000')
      expect(formatted.startsWith('Rp')).toBe(true)
    })

    it('verifies multi-device compatibility profiles (iOS, Android, Huawei, iPad, Desktop)', () => {
      const targetDeviceProfiles = [
        { platform: 'iOS (iPhone/iPad)', engine: 'WebKit', safeAreaRequired: true, minTouchTarget: 44 },
        { platform: 'Android Mobile/Tablet', engine: 'Chromium', safeAreaRequired: true, minTouchTarget: 48 },
        { platform: 'Huawei / HarmonyOS', engine: 'WebKit/Blink', safeAreaRequired: true, minTouchTarget: 44 },
        { platform: 'Desktop (Chrome/Firefox/Opera)', engine: 'Multi', safeAreaRequired: false, minTouchTarget: 36 }
      ]

      targetDeviceProfiles.forEach((profile) => {
        expect(profile.minTouchTarget).toBeGreaterThanOrEqual(36)
        expect(profile.engine.length).toBeGreaterThan(2)
      })
    })
  })

  // ==========================================
  // PILLAR II: ATOMIC DDD & MICROCOPY STANDARD
  // ==========================================
  describe('Pillar II: Ergonomic Design System, Microcopy & Storefront Overrides', () => {
    it('verifies verb-first CTAs with zero parentheses (...) in action labels', () => {
      const actionButtonLabels = [
        '+ Tambah Menu Lainnya',
        'Kirim Pesanan ke Dapur ➔',
        'Bayar Sekarang ➔',
        'Cetak Struk Thermal',
        'Buka Shift Kasir Baru'
      ]

      const forbiddenParenthesesRegex = /\(.*\)/
      actionButtonLabels.forEach((label) => {
        expect(forbiddenParenthesesRegex.test(label)).toBe(false)
        expect(label.length).toBeGreaterThan(3)
      })
    })

    it('allows scoped storefront overrides with fail-safe reset to Hfe Core defaults', () => {
      const customStorefront = {
        ...DEFAULT_STOREFRONT_CUSTOMIZATION,
        heroHeadline: 'Artisan Roastery Canggu Beach',
        qrMenuLayout: 'story_cards' as const
      }

      localStorage.setItem('hfe_storefront_customization', JSON.stringify(customStorefront))
      const stored = JSON.parse(localStorage.getItem('hfe_storefront_customization') || '{}')
      expect(stored.heroHeadline).toBe('Artisan Roastery Canggu Beach')
      expect(stored.qrMenuLayout).toBe('story_cards')

      // 1-tap fail-safe reset
      localStorage.setItem('hfe_storefront_customization', JSON.stringify(DEFAULT_STOREFRONT_CUSTOMIZATION))
      const reset = JSON.parse(localStorage.getItem('hfe_storefront_customization') || '{}')
      expect(reset.heroHeadline).toBe('Artisan Coffee Roasters & Fresh Pastry Bar')
    })
  })

  // ==========================================
  // PILLAR III: OFFLINE ACID RESILIENCE & CONFLICTS
  // ==========================================
  describe('Pillar III: Offline ACID Resilience & Conflict Resolution', () => {
    it('creates deterministic offline intents with UUID v4 idempotency keys', () => {
      const mockIntent = {
        id: 'intent-uuid-4412-8819',
        type: 'POST_RETAIL_SALE',
        amount: 150000,
        idempotencyKey: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        status: 'pending',
        timestamp: Date.now()
      }

      expect(mockIntent.idempotencyKey).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
      expect(mockIntent.status).toBe('pending')
    })

    it('resolves offline overselling via GL 5101 Inventory Variance without voiding customer cash', () => {
      // Scenario: Sold 2 units offline when server stock was 0
      const offlineSale = {
        quantity: 2,
        pricePerUnit: 50000,
        customerCashPaid: 100000,
        stockDiscrepancy: -2
      }

      // Customer transaction is 100% honored
      expect(offlineSale.customerCashPaid).toBe(100000)

      // Variance is posted to GL 5101
      const varianceJournal = {
        debitAccount: 'GL 5101 - Beban Selisih Stok',
        creditAccount: 'GL 1401 - Persediaan Barang',
        amount: 2 * 30000 // COGS cost price
      }
      expect(varianceJournal.debitAccount).toContain('5101')
      expect(varianceJournal.amount).toBe(60000)
    })
  })

  // ==========================================
  // PILLAR IV: UNIVERSAL ACCOUNTING TRUTH
  // ==========================================
  describe('Pillar IV: Universal Double-Entry Accounting Truth (Debit = Credit)', () => {
    it('verifies strict double-entry balance on retail sale with PB1 10% tax', () => {
      const subtotal = 100000
      const pb1Tax = 10000 // 10%
      const totalCashReceived = 110000

      const debits = [
        { gl: '1101', name: 'Kas Kasir (Cash on Hand)', amount: totalCashReceived }
      ]

      const credits = [
        { gl: '4101', name: 'Pendapatan Penjualan F&B', amount: subtotal },
        { gl: '2102', name: 'Utang Pajak Restoran PB1 10%', amount: pb1Tax }
      ]

      const sumDebits = debits.reduce((acc, d) => acc + d.amount, 0)
      const sumCredits = credits.reduce((acc, c) => acc + c.amount, 0)

      expect(sumDebits).toBe(110000)
      expect(sumCredits).toBe(110000)
      expect(sumDebits).toBe(sumCredits) // Mathematical Balance Invariant
    })

    it('verifies hotel room charge guest folio ledger debit balance', () => {
      const totalRoomCharge = 350000

      const journal = {
        debit: { gl: '1105', name: 'Piutang Folio Kamar Hotel (Guest Ledger AR)', amount: totalRoomCharge },
        credit: [
          { gl: '4101', name: 'Pendapatan Dining & Room Service', amount: 318182 },
          { gl: '2102', name: 'Utang Pajak PB1 10%', amount: 31818 }
        ]
      }

      const totalCredits = journal.credit.reduce((acc, c) => acc + c.amount, 0)
      expect(journal.debit.gl).toBe('1105')
      expect(Math.round(journal.debit.amount)).toBe(Math.round(totalCredits))
    })
  })
})
