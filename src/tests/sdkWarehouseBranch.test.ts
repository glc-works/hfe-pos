import { afterEach, describe, it, expect, beforeEach, vi } from 'vitest'
import {
  fetchWarehouses,
  receiveGoods,
  transferStock,
  adjustWaste,
  fetchBranches,
  createBranch,
  updateBranch,
  fetchMultiBranchSales,
} from '../services/hfeApi'
import { employeeLogin, ownerLogin } from '../services/hfeAuthApi'
import demoAccess from '../../fixtures/demo/access.json'

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

describe('@hfe/pos-auth-starterkit SDK & Authentication Engine', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('local demo has no Hfe Core'))
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('authenticates valid employee PIN successfully', async () => {
    const res = await employeeLogin(demoAccess.branchId, demoAccess.staff.pin, demoAccess.bookId)
    expect(res.token).toContain('JWT-LOCAL-DEMO-')
    expect(res.user.name).toBe(demoAccess.staff.name)
    expect(res.user.role).toBe(demoAccess.staff.role)
    expect(res.user.branch_id).toBe(demoAccess.branchId)
  })

  it('does not fabricate an owner session when first-party runtime identity is unconfigured', async () => {
    await expect(ownerLogin('owner@artisancafe.id', 'password123'))
      .rejects.toThrow('Hfe POS first-party runtime is missing VITE_TOGROW_ORGANIZATION_ID')
  })

  it('throws error for invalid PIN', async () => {
    await expect(employeeLogin('BRANCH-SENOPATI', '999999')).rejects.toThrow('PIN Staff tidak valid')
  })

  it('persists session token to localStorage', () => {
    const mockToken = 'JWT-MOCK-TOKEN-123'
    localStorage.setItem('hfe_pos_auth_token', mockToken)
    expect(localStorage.getItem('hfe_pos_auth_token')).toBe(mockToken)
  })
})

describe('Multi-Warehouse Operations & Stock Transfer Engine', () => {
  it('fetches multi-warehouse location registry correctly', async () => {
    const warehouses = await fetchWarehouses('BOOK-CAFE-HQ-88')
    expect(warehouses).toHaveLength(3)
    expect(warehouses[0].id).toBe('WH-CENTRAL-HQ')
    expect(warehouses[1].id).toBe('WH-SENOPATI-STORE')
    expect(warehouses[2].id).toBe('WH-RESERVE-01')
  })

  it('processes supplier goods receiving with batch & expiry dates', async () => {
    const payload = {
      warehouseId: 'WH-CENTRAL-HQ',
      itemCode: 'ING-CF-BEANS-01',
      qty: 25,
      supplierPoNumber: 'PO-TEST-100',
      batchNumber: 'BATCH-2026-X1',
      expiryDate: '2026-12-31',
    }
    const res = await receiveGoods('BOOK-CAFE-HQ-88', payload)
    expect(res.receiving_id).toBeDefined()
    expect(res.status).toBe('received')
    expect(res.qty).toBe(25)
  })

  it('executes inter-warehouse stock transfer with status state machine', async () => {
    const payload = {
      sourceWarehouseId: 'WH-CENTRAL-HQ',
      destinationWarehouseId: 'WH-SENOPATI-STORE',
      itemCode: 'ING-CF-BEANS-01',
      qty: 10,
      notes: 'Testing inter-warehouse transfer',
    }
    const res = await transferStock('BOOK-CAFE-HQ-88', payload)
    expect(res.transfer_id).toBeDefined()
    expect(res.status).toBe('in_transit')
    expect(res.source_warehouse_id).toBe('WH-CENTRAL-HQ')
    expect(res.destination_warehouse_id).toBe('WH-SENOPATI-STORE')
  })

  it('records waste/spoilage adjustment and generates expense GL posting', async () => {
    const payload = {
      warehouseId: 'WH-SENOPATI-STORE',
      itemCode: 'ING-MILK-OAT-01',
      qty: 2,
      reason: 'Susu Kadaluarsa / Expired Milk',
      expenseGlAccount: '6-5100-SPOILAGE-EXPENSE',
    }
    const res = await adjustWaste('BOOK-CAFE-HQ-88', payload)
    expect(res.adjustment_id).toBeDefined()
    expect(res.status).toBe('posted')
    expect(res.gl_account).toBe('6-5100-SPOILAGE-EXPENSE')
    expect(res.expense_amount_idr).toBe(90000)
  })
})

describe('Multi-Branch Outlet Suite & Active Workspace Switcher', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('fetches multi-branch outlet list and comparative sales metrics', async () => {
    const branches = await fetchBranches('BOOK-CAFE-HQ-88')
    const sales = await fetchMultiBranchSales('BOOK-CAFE-HQ-88')

    expect(branches.length).toBeGreaterThanOrEqual(3)
    expect(branches[0].id).toBe('BRANCH-SENOPATI')

    expect(sales).toHaveLength(3)
    expect(sales[0].branchId).toBe('BRANCH-SENOPATI')
    expect(sales[0].totalSalesIdr).toBeGreaterThan(0)
  })

  it('registers a new outlet branch under company book', async () => {
    const newBranchPayload = {
      code: 'KMG-04',
      name: 'Kopitiam Kemang Outlet',
      address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
      initialFloat: 500000,
    }
    const res = await createBranch('BOOK-CAFE-HQ-88', newBranchPayload)
    expect(res.id).toBe('BRANCH-KMG-04')
    expect(res.code).toBe('KMG-04')
    expect(res.name).toBe('Kopitiam Kemang Outlet')
  })

  it('updates branch storefront config (WiFi & operating hours)', async () => {
    const updatePayload = {
      wifiSsid: 'Kopitiam_Kemang_Free',
      wifiPassword: 'not-a-secret-demo-value',
      operatingHours: '07:00 - 23:00 WIB',
    }
    const res = await updateBranch('BOOK-CAFE-HQ-88', 'BRANCH-KEMANG', updatePayload)
    expect(res.id).toBe('BRANCH-KEMANG')
    expect(res.wifiSsid).toBe('Kopitiam_Kemang_Free')
    expect(res.wifiPassword).toBe('not-a-secret-demo-value')
  })

  it('persists active branch workstation switcher state in localStorage', () => {
    const selectedBranch = 'BRANCH-BSD'
    localStorage.setItem('hfe_pos_active_branch', selectedBranch)
    expect(localStorage.getItem('hfe_pos_active_branch')).toBe('BRANCH-BSD')
  })
})
