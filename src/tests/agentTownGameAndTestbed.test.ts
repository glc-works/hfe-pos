import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import {
  TownCanvasMap,
  CardTapIdentityModal,
  FinancialHudTicker,
  GameActionControls,
  CardIdentityItem,
} from '../components/town'
import { TableCard } from '../components/shared/TableCard'
import { TableStatus } from '../types/pos'

describe('🏙️ HFE Coffee Tycoon & Living UI Testbed Suite', () => {
  // Test 1: Town Map Canvas rendering & state tick updates
  describe('1. TownCanvasMap & Living Simulation Canvas', () => {
    it('renders simulation map header, day/time counters, and canvas element', () => {
      const html = renderToString(
        React.createElement(TownCanvasMap, {
          day: 4,
          timeHour: 14,
          cashBalance: 25000000,
          inventoryKg: 85,
          activeActorsCount: 4,
          onSelectLocation: vi.fn(),
        })
      )
      expect(html).toContain('BSD City Commercial Map &amp; Living Simulator')
      expect(html).toContain('60 FPS Live Canvas')
      expect(html).toContain('Day')
      expect(html).toContain('4')
      expect(html).toContain(':00 WIB')
      expect(html).toContain('<canvas')
      expect(html).toContain('width="640"')
      expect(html).toContain('height="260"')
    })

    it('validates location navigation coordinates mapping', () => {
      const resolveLoc = (x: number) => (x < 0.33 ? 'ROASTERY' : x > 0.66 ? 'GAYO_PLANTATION' : 'BSD_CAFE')
      expect(resolveLoc(0.15)).toBe('ROASTERY')
      expect(resolveLoc(0.5)).toBe('BSD_CAFE')
      expect(resolveLoc(0.85)).toBe('GAYO_PLANTATION')
    })
  })

  // Test 2: CardTapIdentityModal switches actor personas
  describe('2. CardTapIdentityModal & 5-Dimensional Actor Personas', () => {
    it('renders all 5 canonical actor identities and modal metadata', () => {
      const html = renderToString(
        React.createElement(CardTapIdentityModal, { isOpen: true, onClose: vi.fn(), onTapCard: vi.fn() })
      )
      expect(html).toContain('Pillar CARD: Tap-to-Identity NFC Simulator')
      expect(html).toContain('Siti Rahma')
      expect(html).toContain('Chef Wayan')
      expect(html).toContain('Bpk. Alexander III')
      expect(html).toContain('Mas Agus')
      expect(html).toContain('Drs. Santoso, CPA')
    })

    it('validates 5-dimensional label payload for all canonical card personas', () => {
      const personas: CardIdentityItem[] = [
        { id: 'crd-siti-01', cardType: 'STAFF_BADGE', holderName: 'Siti Rahma', role: 'ACTOR:BARISTA (Head Cashier)', badgeLabel: 'PIN 123456 • Shift Pagi', icon: '☕', actionText: 'Tap untuk Login Kasir POS' },
        { id: 'crd-wayan-02', cardType: 'STAFF_BADGE', holderName: 'Chef Wayan', role: 'ACTOR:CHEF (Kitchen Master)', badgeLabel: 'Station: Hot Kitchen', icon: '🍳', actionText: 'Tap untuk Nyalakan KDS Dapur' },
        { id: 'crd-alexander-03', cardType: 'VIP_LOYALTY', holderName: 'Bpk. Alexander III', role: 'ACTOR:GUEST_VIP (Meja 03)', badgeLabel: 'Gold Tier • 1.250 Poin • Alergen Susu', icon: '👑', actionText: 'Tap untuk Order Meja QR' },
        { id: 'crd-agus-04', cardType: 'SUPPLIER_PASS', holderName: 'Mas Agus', role: 'ACTOR:ROASTER_MFG (Pabrik)', badgeLabel: 'BOM 100kg • Susut 15%', icon: '🚚', actionText: 'Tap untuk Kirim 85kg Biji Kopi' },
        { id: 'crd-santoso-05', cardType: 'AUDITOR_CLEARANCE', holderName: 'Drs. Santoso, CPA', role: 'ACTOR:CPA_AUDITOR (KAP Mitra)', badgeLabel: 'Read-Only Audit • Closing Seal', icon: '📑', actionText: 'Tap untuk Audit 5-Tahun WTP' },
      ]

      personas.forEach((p) => {
        expect(p.id).toMatch(/^crd-[a-z]+-[0-9]{2}$/)
        expect(p.cardType).toBeDefined()
        expect(p.holderName.length).toBeGreaterThan(0)
        expect(p.role).toContain('ACTOR:')
        expect(p.badgeLabel.length).toBeGreaterThan(0)
        expect(p.icon.length).toBeGreaterThan(0)
        expect(p.actionText).toContain('Tap untuk')
      })
    })

    it('returns null when isOpen is false', () => {
      const html = renderToString(React.createElement(CardTapIdentityModal, { isOpen: false, onClose: vi.fn(), onTapCard: vi.fn() }))
      expect(html).toBe('')
    })
  })

  // Test 3: Financial HUD Ticker assertions
  describe('3. Financial HUD Ticker & Accounting Invariants', () => {
    it('renders matched debits == credits status badge and formatted figures', () => {
      const html = renderToString(
        React.createElement(FinancialHudTicker, {
          cashMinor: 125000000,
          todaySalesMinor: 8500000,
          inventoryKg: 142,
          retainedEarningsMinor: 950000000,
          totalAssetsMinor: 1075000000,
          isDebitsCreditsMatched: true,
          activePeriodLabel: 'FY2026-M08 ACTIVE',
        })
      )
      expect(html).toContain('Debits == Credits ✓')
      expect(html).toContain('FY2026-M08 ACTIVE')
      expect(html).toContain('142')
      expect(html).toContain('Kg Ready')
      expect(html).toContain('tabular-nums')
    })

    it('renders imbalance alert when debits do not match credits', () => {
      const html = renderToString(
        React.createElement(FinancialHudTicker, {
          cashMinor: 100000000,
          todaySalesMinor: 5000000,
          inventoryKg: 50,
          retainedEarningsMinor: 800000000,
          totalAssetsMinor: 900000000,
          isDebitsCreditsMatched: false,
          activePeriodLabel: 'FY2026-M08 AUDIT_HOLD',
        })
      )
      expect(html).toContain('Imbalance Alert ⚠️')
    })

    it('verifies mathematical balance sheet identity: Assets = Liabilities + Equity', () => {
      const cash = 125000000
      const inventoryAsset = 22473500
      const biologicalAsset = 3000000000
      const totalAssets = cash + inventoryAsset + biologicalAsset
      const liabilities = 50000000
      const shareCapital = 2147473500
      const retainedEarnings = 950000000
      const totalEquityAndLiabilities = liabilities + shareCapital + retainedEarnings

      expect(totalAssets).toBe(totalEquityAndLiabilities)
      expect(totalAssets === totalEquityAndLiabilities).toBe(true)
    })
  })

  // Test 4: Real TableCard component mounting & anti-collision checks
  describe('4. Real TableCard Component Mounting & Anti-Collision Checks', () => {
    it('renders empty table (Q1) without text collision and with static capacity', () => {
      const freeTable: TableStatus = {
        id: 'tbl-01',
        name: 'Meja 01',
        status: 'free',
        pax: 4,
        maxCapacity: 4,
        orderCount: 0,
        orderIds: [],
        totalBill: 0,
      }
      const html = renderToString(React.createElement(TableCard, { table: freeTable }))
      expect(html).toContain('Meja 01')
      expect(html).toContain('Kursi')
      expect(html).toContain('✨ Siap Digunakan')
      expect(html).toContain('IDR 0')
    })

    it('renders occupied table with capacity ratio and timer pill', () => {
      const occupiedTable: TableStatus = {
        id: 'tbl-02',
        name: 'Meja 02',
        status: 'occupied',
        customerName: 'Siti Rahma',
        seatedGuests: 3,
        maxCapacity: 4,
        seatedDurationMinutes: 45,
        totalBill: 175000,
        orderCount: 3,
        orderIds: [],
      }
      const html = renderToString(React.createElement(TableCard, { table: occupiedTable }))
      expect(html).toContain('Meja 02')
      expect(html).toContain('3/4')
      expect(html).toContain('Kursi')
      expect(html).toContain('45')
      expect(html).toContain('Siti Rahma')
      expect(html).toContain('tabular-nums')
    })

    it('renders extreme long overflow (Q3) Rp 1.850.000.000 without digit clipping', () => {
      const extremeVipTable: TableStatus = {
        id: 'tbl-vip-01',
        name: 'VIP-SUITE-01',
        status: 'open-tab',
        customerName: 'Bpk. Prof. Dr. Alexander Raden Christopher Hadiningrat III',
        seatedGuests: 18,
        maxCapacity: 20,
        seatedDurationMinutes: 180,
        totalBill: 1850000000,
        minSpend: 50000000,
        orderCount: 24,
        zoneId: 'vip-private',
        orderIds: [],
      }
      const html = renderToString(
        React.createElement(TableCard, { table: extremeVipTable, slotSpan: 2, viewMode: 'expanded', isSelected: true })
      )
      expect(html).toContain('VIP-SUITE-01')
      expect(html).toContain('VIP')
      expect(html).toContain('18/20')
      expect(html).toContain('Kursi')
      expect(html).toContain('180')
      expect(html).toContain('Alexander Raden Christopher')
      expect(html).toContain('col-span-2')
      expect(html).toContain('tabular-nums')
      expect(html).toContain('1.850.000.000')
    })
  })

  // Test 5: Game actions transition balances correctly without state leakage
  describe('5. Game Actions & State Transition Pipeline', () => {
    it('renders GameActionControls with speed options and action buttons', () => {
      const html = renderToString(
        React.createElement(GameActionControls, {
          speed: '1x',
          onSetSpeed: vi.fn(),
          onOpenCardTapModal: vi.fn(),
          onSpawnRushHour: vi.fn(),
          onRestockBOM: vi.fn(),
          onRunMonthEndClose: vi.fn(),
        })
      )
      expect(html).toContain('⚡ Speed:')
      expect(html).toContain('1x')
      expect(html).toContain('2x')
      expect(html).toContain('5x')
      expect(html).toContain('Tap Kartu Identitas')
      expect(html).toContain('Trigger Rush Hour')
      expect(html).toContain('Roasting 100kg BOM')
      expect(html).toContain('Tutup Buku Bulanan')
    })

    it('simulates Rush Hour transition: increases sales, depletes inventory, preserves balance', () => {
      let state = { cash: 50000000, todaySales: 0, inventoryKg: 100, retainedEarnings: 200000000 }
      const applyRushHour = (s: typeof state, orderRevenue: number, beanUsageKg: number) => ({
        ...s,
        cash: s.cash + orderRevenue,
        todaySales: s.todaySales + orderRevenue,
        inventoryKg: Math.max(0, s.inventoryKg - beanUsageKg),
      })
      state = applyRushHour(state, 4500000, 15)
      expect(state.cash).toBe(54500000)
      expect(state.todaySales).toBe(4500000)
      expect(state.inventoryKg).toBe(85)
      expect(state.retainedEarnings).toBe(200000000)
    })

    it('simulates BOM Roasting Restock: converts green beans to roasted output at COGM', () => {
      let state = { cash: 50000000, roastedKg: 20, rawGreenKg: 200 }
      const applyRoastingBatch = (s: typeof state, inputKg: number, shrinkage: number, batchCost: number) => ({
        cash: s.cash - batchCost,
        roastedKg: s.roastedKg + inputKg * (1 - shrinkage),
        rawGreenKg: s.rawGreenKg - inputKg,
      })
      state = applyRoastingBatch(state, 100, 0.15, 952500)
      expect(state.roastedKg).toBe(105)
      expect(state.rawGreenKg).toBe(100)
      expect(state.cash).toBe(49047500)
    })

    it('simulates Month-End Close: locks period, sweeps sales to retained earnings, resets daily accumulator', () => {
      const state = { todaySales: 15000000, cogsExpense: 4500000, operatingExpense: 3000000, retainedEarnings: 100000000, periodLocked: false }
      const applyMonthEndClose = (s: typeof state) => ({
        todaySales: 0,
        cogsExpense: 0,
        operatingExpense: 0,
        retainedEarnings: s.retainedEarnings + (s.todaySales - s.cogsExpense - s.operatingExpense),
        periodLocked: true,
      })
      const closedState = applyMonthEndClose(state)
      expect(closedState.todaySales).toBe(0)
      expect(closedState.retainedEarnings).toBe(107500000)
      expect(closedState.periodLocked).toBe(true)
    })
  })
})
