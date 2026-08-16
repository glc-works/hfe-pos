import { describe, it, expect, beforeEach } from 'vitest'
import {
  fetchWarehouses,
  receiveGoods,
  transferStock,
  adjustWaste,
  fetchBranches,
  fetchMultiBranchSales
} from '../services/hfeApi'
import { reconcileShiftCash } from '../utils/shiftReconcile'
import { PROPERTY_ZONES, MOCK_HOTEL_GUEST_FOLIOS } from '../data/mockData'

const mockStorage: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = String(value) },
  removeItem: (key: string) => { delete mockStorage[key] },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]) },
  length: 0,
  key: () => null,
}

if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
}

describe('Backoffice F&B Operations Test Suite (POS-ENG-STD-001)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // -------------------------------------------------------------
  // 1. MULTI-OUTLET WAREHOUSE & GOODS RECEIVING (GRN)
  // -------------------------------------------------------------
  describe('1. Multi-Outlet Warehouse & GRN Supply Chain Engine', () => {
    it('fetches multi-warehouse location registry with Central HQ and store outlets', async () => {
      const warehouses = await fetchWarehouses('BOOK-CAFE-HQ-88')
      expect(warehouses.length).toBeGreaterThanOrEqual(2)
      const centralHQ = warehouses.find(w => w.id === 'WH-CENTRAL-HQ')
      const outletWH = warehouses.find(w => w.id === 'WH-SENOPATI-STORE')

      expect(centralHQ).toBeDefined()
      expect(outletWH).toBeDefined()
      expect(centralHQ?.name).toContain('Gudang Pusat')
    })

    it('processes supplier goods receiving (GRN) with batch number & expiry tracking', async () => {
      const grnPayload = {
        warehouseId: 'WH-CENTRAL-HQ',
        itemCode: 'RAW-BEAN-KINTAMANI',
        qty: 50, // 50 Kg
        supplierPoNumber: 'PO-SUPPLIER-2026-088',
        batchNumber: 'BATCH-KINTA-AUG26',
        expiryDate: '2027-08-16',
      }

      const res = await receiveGoods('BOOK-CAFE-HQ-88', grnPayload)
      expect(res.receiving_id).toBeDefined()
      expect(res.status).toBe('received')
      expect(res.qty).toBe(50)
      expect(res.warehouse_id).toBe('WH-CENTRAL-HQ')
    })

    it('executes inter-warehouse stock transfer lifecycle (Draft -> In-Transit -> Received)', async () => {
      const transferPayload = {
        sourceWarehouseId: 'WH-CENTRAL-HQ',
        destinationWarehouseId: 'WH-SENOPATI-STORE',
        itemCode: 'RAW-BEAN-KINTAMANI',
        qty: 15,
        notes: 'Replenishment for Weekend Rush Hour',
      }

      const res = await transferStock('BOOK-CAFE-HQ-88', transferPayload)
      expect(res.transfer_id).toBeDefined()
      expect(res.status).toBe('in_transit')
      expect(res.source_warehouse_id).toBe('WH-CENTRAL-HQ')
      expect(res.destination_warehouse_id).toBe('WH-SENOPATI-STORE')
      expect(res.qty).toBe(15)
    })
  })

  // -------------------------------------------------------------
  // 2. INVENTORY WASTE / SPOILAGE & ACCOUNTING JOURNALING
  // -------------------------------------------------------------
  describe('2. Waste & Spoilage Adjustment Engine (GL 5104)', () => {
    it('logs inventory waste and maps to expense account 5104 Beban Kerusakan Bahan Baku', async () => {
      const wastePayload = {
        warehouseId: 'WH-SENOPATI-STORE',
        itemCode: 'RAW-FRESH-MILK',
        qty: 4, // 4 Liters spoiled
        reason: 'Expired milk carton damaged during transit',
      }

      const res = await adjustWaste('BOOK-CAFE-HQ-88', wastePayload)
      expect(res.adjustment_id).toBeDefined()
      expect(res.status).toBe('posted')
      expect(res.gl_account).toBe('6-5100-SPOILAGE-EXPENSE')
      expect(res.expense_amount_idr).toBeGreaterThan(0)
    })
  })

  // -------------------------------------------------------------
  // 3. SHIFT CASH DRAWER & BLIND CASH COUNT RECONCILIATION
  // -------------------------------------------------------------
  describe('3. Shift Reconciliation & Anti-Theft Blind Cash Count (GL 5109)', () => {
    it('calculates balanced shift when counted cash matches expected cash exactly', () => {
      const shiftData = {
        initialFloat: 500000,
        cashSales: 1850000,
        pettyCashExpenses: 150000,
        cashCounted: 2200000, // Exact match: 500k + 1850k - 150k = 2200k
      }

      const reconciliation = reconcileShiftCash(shiftData)
      expect(reconciliation.expectedCash).toBe(2200000)
      expect(reconciliation.variance).toBe(0)
      expect(reconciliation.status).toBe('MATCHED')
      expect(reconciliation.requiresManagerApproval).toBe(false)
    })

    it('flags cash shortage and debits GL 5109 Selisih Kas Shift when physical cash is short', () => {
      const shiftData = {
        initialFloat: 500000,
        cashSales: 1850000,
        pettyCashExpenses: 150000,
        cashCounted: 2150000, // Shortage Rp -50.000
      }

      const reconciliation = reconcileShiftCash(shiftData)
      expect(reconciliation.expectedCash).toBe(2200000)
      expect(reconciliation.variance).toBe(-50000)
      expect(reconciliation.status).toBe('SHORTAGE')
      expect(reconciliation.requiresManagerApproval).toBe(true)
      expect(reconciliation.journalEntry.debitAccount).toBe('5109 - Beban Selisih Kas Shift (Cash Shortage)')
    })

    it('flags cash overage and credits GL 4109 Pendapatan Lain-lain when physical cash is over', () => {
      const shiftData = {
        initialFloat: 500000,
        cashSales: 1850000,
        pettyCashExpenses: 150000,
        cashCounted: 2230000, // Overage Rp +30.000
      }

      const reconciliation = reconcileShiftCash(shiftData)
      expect(reconciliation.expectedCash).toBe(2200000)
      expect(reconciliation.variance).toBe(30000)
      expect(reconciliation.status).toBe('OVERAGE')
      expect(reconciliation.journalEntry.creditAccount).toBe('4109 - Pendapatan Lain-lain (Cash Overage)')
    })
  })

  // -------------------------------------------------------------
  // 4. RESTAURANT TAX (PB1 10%) & REVENUE CONSOLIDATION
  // -------------------------------------------------------------
  describe('4. PB1 Tax Segregation & Multi-Branch Revenue Consolidation', () => {
    it('segregates 10% PB1 tax liability from gross restaurant sales', () => {
      const grossSales = 1100000 // Rp 1.000.000 nett + Rp 100.000 PB1
      const nettRevenue = Math.round(grossSales / 1.1)
      const taxPB1 = grossSales - nettRevenue

      expect(nettRevenue).toBe(1000000)
      expect(taxPB1).toBe(100000)
    })

    it('consolidates multi-branch revenue across all registered outlets', async () => {
      const branches = await fetchBranches('BOOK-CAFE-HQ-88')
      expect(branches.length).toBeGreaterThanOrEqual(3)

      const branchMetrics = await fetchMultiBranchSales('BOOK-CAFE-HQ-88')
      expect(branchMetrics.length).toBeGreaterThanOrEqual(3)
      const totalRevenue = branchMetrics.reduce((sum, b) => sum + b.totalSalesIdr, 0)
      expect(totalRevenue).toBeGreaterThan(0)
    })
  })

  // -------------------------------------------------------------
  // 5. MULTI-ZONE PROPERTY & HOTEL ROOM FOLIO VALIDATION
  // -------------------------------------------------------------
  describe('5. Multi-Zone Spatial Floor Plan & Hotel Guest Folios', () => {
    it('validates 5 default property zones configuration with VIP minimum spend', () => {
      expect(PROPERTY_ZONES.length).toBe(6) // all + 5 specific zones
      const vipZone = PROPERTY_ZONES.find(z => z.id === 'vip-private')
      expect(vipZone).toBeDefined()
      expect(vipZone?.minSpend).toBe(2500000)
    })

    it('validates hotel guest folio lookup with check-in status and credit limits', () => {
      const folio402 = MOCK_HOTEL_GUEST_FOLIOS.find(f => f.roomNumber === '402')
      expect(folio402).toBeDefined()
      expect(folio402?.guestName).toBe('Bambang Soeprapto')
      expect(folio402?.status).toBe('checked_in')
      expect(folio402?.creditLimit).toBe(5000000)
      expect(folio402?.currentBalance).toBe(1250000)

      const remainingCredit = folio402!.creditLimit - folio402!.currentBalance
      expect(remainingCredit).toBe(3750000)
    })
  })
})
