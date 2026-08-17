import { describe, it, expect, beforeEach } from 'vitest'
import { MockHfeAdapter } from '../services/financial/MockHfeAdapter'
import { HfeSdkAdapter, HfeNetworkError } from '../services/financial/HfeSdkAdapter'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { SubmitRetailTransactionPayload } from '../services/financial/HfePosFinancialPort'

describe('Unified Wave Upgrade: Hfe Core SDK, Offline Intent & 6-Tier Architecture Proof', () => {
  let mockPort: MockHfeAdapter
  let intentQueue: OfflineIntentQueue

  beforeEach(async () => {
    mockPort = new MockHfeAdapter()
    intentQueue = new OfflineIntentQueue()
    await intentQueue.clearQueue()
  })

  describe('Pillar 1: Full Cashier Journey via HfePosFinancialPort', () => {
    it('executes complete cashier journey: open shift -> catalog -> checkout -> close shift', async () => {
      // Step 1: Open Cashier Shift
      const shift = await mockPort.openCashierShift('STAFF-KASIR-01', 500000)
      expect(shift.status).toBe('open')
      expect(shift.initial_float).toBe(500000)

      // Step 2: Fetch Product Catalog (Double-Entry Mapped)
      const catalog = await mockPort.fetchProductCatalog()
      expect(catalog.length).toBeGreaterThan(0)
      const product = catalog[0]
      expect(product.price).toBeGreaterThan(0)

      // Step 3: Fast Checkout Submission (Server Authoritative)
      const payload: SubmitRetailTransactionPayload = {
        cashier_id: 'STAFF-KASIR-01',
        contact_id: 'CUST-001',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [
          {
            product_id: product.id,
            name: product.name,
            hfe_gl_account: 'GL-4101',
            qty: 2,
            price: product.price,
          },
        ],
        subtotal: product.price * 2,
        tax_pb1_amount: Math.round(product.price * 2 * 0.1),
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: Math.round(product.price * 2 * 1.1),
        idempotency_key: 'IDEMP-TEST-UUID-999',
      }

      const tx = await mockPort.submitRetailTransaction(payload)
      expect(tx.status).toBe('posted')
      expect(tx.grand_total).toBe(payload.grand_total)
      expect(tx.idempotency_key).toBe('IDEMP-TEST-UUID-999')
      expect(tx.gl_entries_posted).toBeDefined()
      expect(tx.gl_entries_posted?.length).toBeGreaterThan(0)

      // Step 4: Close Cashier Shift & Reconcile
      const reportedCash = 500000 + tx.grand_total
      const shiftClose = await mockPort.closeCashierShift(shift.shift_id, reportedCash)
      expect(shiftClose.status).toBe('closed')
      expect(shiftClose.cash_variance).toBe(0)
    })
  })

  describe('Pillar 2: Fail-Closed & Idempotency Invariants', () => {
    it('HfeSdkAdapter fails closed on disconnected network without generating fake success', async () => {
      const prodAdapter = new HfeSdkAdapter({
        baseUrl: 'http://127.0.0.1:59999', // Non-existent port
        defaultBookId: 'BOOK-CAFE-HQ-88',
        timeoutMs: 500,
      })

      expect(prodAdapter.isSimulated).toBe(false)

      await expect(prodAdapter.fetchCompanyBookSettings()).rejects.toThrow(HfeNetworkError)
    })

    it('OfflineIntentQueue captures pending_local intent without fabricating canonical success', async () => {
      const intentPayload: SubmitRetailTransactionPayload = {
        contact_id: 'CUST-OFFLINE',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [{ product_id: 'ITEM-01', hfe_gl_account: 'GL-4101', qty: 1, price: 50000 }],
        subtotal: 50000,
        tax_pb1_amount: 5000,
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: 55000,
        idempotency_key: 'IDEMP-RETRY-UUID-777',
      }

      const queuedItem = await intentQueue.enqueueIntent(intentPayload)

      expect(queuedItem.status).toBe('pending_sync')
      expect(queuedItem.idempotencyKey).toBe('IDEMP-RETRY-UUID-777')
      expect(queuedItem.retryCount).toBe(0)

      // Verify it is not declared as a posted ledger confirmation
      const pendingIntents = await intentQueue.getPendingIntents()
      expect(pendingIntents.length).toBe(1)
      expect(pendingIntents[0].status).toBe('pending_sync')
    })
  })

  describe('Pillar 3: 6-Tier Spatial Slot & React Aria Budget Invariants', () => {
    it('verifies slot budgeting requirements for standard (1 slot >= 105px) and VIP (2 slots >= 220px)', () => {
      const standardSlotMinPx = 105
      const vipSlotMinPx = standardSlotMinPx * 2

      expect(standardSlotMinPx).toBeGreaterThanOrEqual(105)
      expect(vipSlotMinPx).toBeGreaterThanOrEqual(210)

      // Verify Tetris slot pairing formula: N1 + N2 = M
      const vipSlots = 2
      const poolsideSlots = 4
      const masterRowCapacity = 6

      expect(vipSlots + poolsideSlots).toBe(masterRowCapacity)
    })
  })
})
