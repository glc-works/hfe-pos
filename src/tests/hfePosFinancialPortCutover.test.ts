import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  HfeSdkAdapter,
  HfeNetworkError,
  HfeApiError,
  MockHfeAdapter,
  OfflineIntentQueue,
  createFinancialPort,
  getFinancialPort,
  setSharedFinancialPort,
  SubmitRetailTransactionPayload
} from '../services/financial'
import { verifyPayloadIntegrity } from '../utils/cryptoHasher'

describe('Hfe POS Financial Port & SDK Adapter Cutover Suite (L2-POS-50)', () => {
  const samplePayload: SubmitRetailTransactionPayload = {
    table_id: 'TBL-04',
    contact_id: 'CUST-081234567890',
    policy: 'pay-first',
    payment_method: 'qris',
    items: [
      {
        product_id: 'PRD-01',
        name: 'Kopi Susu Senopati',
        hfe_gl_account: '4010-Pendapatan Penjualan',
        qty: 2,
        price: 25000,
      },
    ],
    subtotal: 50000,
    tax_pb1_amount: 5000,
    service_fee_amount: 2500,
    discount_amount: 0,
    grand_total: 57500,
  }

  describe('1. HfeSdkAdapter — Strict Fail-Closed Verification', () => {
    let adapter: HfeSdkAdapter
    const originalFetch = global.fetch

    beforeEach(() => {
      adapter = new HfeSdkAdapter({ baseUrl: 'http://localhost:8080', defaultBookId: 'BOOK-CAFE-HQ-88' })
    })

    afterEach(() => {
      global.fetch = originalFetch
      vi.restoreAllMocks()
    })

    it('should have isSimulated=false and adapterName=HfeSdkAdapter', () => {
      expect(adapter.isSimulated).toBe(false)
      expect(adapter.adapterName).toBe('HfeSdkAdapter')
    })

    it('FAIL-CLOSED: should throw HfeNetworkError when backend is disconnected (zero fake success)', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Failed to connect to localhost:8080 (ECONNREFUSED)'))

      await expect(adapter.submitRetailTransaction(samplePayload)).rejects.toThrow(HfeNetworkError)
      await expect(adapter.fetchProductCatalog()).rejects.toThrow(HfeNetworkError)
      await expect(adapter.fetchCompanyBookSettings()).rejects.toThrow(HfeNetworkError)
    })

    it('FAIL-CLOSED: should throw HfeApiError with exact status code when server returns 4xx or 5xx', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ message: 'Invalid COA account mapping for item PRD-01' }),
      } as Response)

      await expect(adapter.submitRetailTransaction(samplePayload)).rejects.toThrow(HfeApiError)

      try {
        await adapter.submitRetailTransaction(samplePayload)
      } catch (err: any) {
        expect(err).toBeInstanceOf(HfeApiError)
        expect(err.status).toBe(422)
        expect(err.message).toContain('Invalid COA account mapping')
      }
    })

    it('should include mandatory X-Idempotency-Key header on transaction submission', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tx_id: 'TX-LIVE-1001',
          status: 'posted',
          created_at: new Date().toISOString(),
          grand_total: 57500,
          idempotency_key: 'custom-idemp-key-123',
        }),
      } as Response)
      global.fetch = mockFetch

      const customPayload = { ...samplePayload, idempotency_key: 'custom-idemp-key-123' }
      const res = await adapter.submitRetailTransaction(customPayload)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>

      expect(headers['X-Idempotency-Key']).toBe('custom-idemp-key-123')
      expect(res.tx_id).toBe('TX-LIVE-1001')
      expect(res.status).toBe('posted')
    })

    it('should fetch authoritative Company Book settings and accounting topology', async () => {
      const mockSettings = {
        company_book_id: 'BOOK-CAFE-HQ-88',
        legal_entity_name: 'PT Kopi Karya Nusantara',
        brand_name: 'Kopitiam Senopati',
        currency: 'IDR',
        accounting_topology: {
          mode: 'dimensional',
          default_sales_gl_account: '4010',
          default_cogs_gl_account: '5010',
          default_cash_gl_account: '1010',
          default_tax_gl_account: '2050',
          cost_centers: [{ id: 'CC-01', name: 'Senopati', code: 'BR-01' }],
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSettings,
      } as Response)

      const settings = await adapter.fetchCompanyBookSettings('BOOK-CAFE-HQ-88')
      expect(settings.company_book_id).toBe('BOOK-CAFE-HQ-88')
      expect(settings.accounting_topology.mode).toBe('dimensional')
      expect(settings.accounting_topology.cost_centers?.length).toBe(1)
    })
  })

  describe('2. MockHfeAdapter — Isolated Simulation & GL Integrity', () => {
    let mockAdapter: MockHfeAdapter

    beforeEach(() => {
      mockAdapter = new MockHfeAdapter()
    })

    it('should have isSimulated=true and mark all responses with isSimulated metadata', async () => {
      expect(mockAdapter.isSimulated).toBe(true)
      expect(mockAdapter.adapterName).toBe('MockHfeAdapter')

      const contact = await mockAdapter.resolveContact('phone', '081234567890')
      expect(contact.isSimulated).toBe(true)

      const tx = await mockAdapter.submitRetailTransaction(samplePayload)
      expect(tx.isSimulated).toBe(true)

      const qris = await mockAdapter.generateQrisPayment({ transaction_id: 'TX-01', amount_idr: 50000 })
      expect(qris.isSimulated).toBe(true)
    })

    it('should produce balanced double-entry GL ledger postings (Debit Sum == Credit Sum)', async () => {
      const tx = await mockAdapter.submitRetailTransaction(samplePayload)

      expect(tx.gl_entries_posted).toBeDefined()
      expect(tx.gl_entries_posted?.length).toBeGreaterThanOrEqual(2)

      const totalDebit = tx.gl_entries_posted!.reduce((sum, e) => sum + e.debit, 0)
      const totalCredit = tx.gl_entries_posted!.reduce((sum, e) => sum + e.credit, 0)

      expect(totalDebit).toBe(samplePayload.grand_total)
      expect(totalCredit).toBe(samplePayload.grand_total)
      expect(totalDebit).toBe(totalCredit)
    })

    it('should manage cashier shift open/close with variance calculation', async () => {
      const shift = await mockAdapter.openCashierShift('CASHIER-01', 300000)
      expect(shift.status).toBe('open')
      expect(shift.initial_float).toBe(300000)

      // Post cash sale linked to cashier
      const cashPayload: SubmitRetailTransactionPayload = {
        ...samplePayload,
        payment_method: 'cash',
        cashier_id: 'CASHIER-01',
        grand_total: 100000,
      }
      await mockAdapter.submitRetailTransaction(cashPayload)

      // Close shift with reported cash
      const closeRes = await mockAdapter.closeCashierShift(shift.shift_id, 400000)
      expect(closeRes.status).toBe('closed')
      expect(closeRes.initial_float).toBe(300000)
      expect(closeRes.expected_cash).toBe(400000)
      expect(closeRes.reported_cash).toBe(400000)
      expect(closeRes.cash_variance).toBe(0)
    })
  })

  describe('3. OfflineIntentQueue — Non-Financial Buffer Governance', () => {
    let queue: OfflineIntentQueue

    beforeEach(async () => {
      queue = new OfflineIntentQueue()
      await queue.clearQueue()
    })

    it('should enqueue transaction as pending_sync with SHA-256 checksum and UUID', async () => {
      const intent = await queue.enqueueIntent(samplePayload, 'BOOK-CAFE-HQ-88')

      expect(intent.status).toBe('pending_sync')
      expect(intent.idempotencyKey).toBeDefined()
      expect(intent.checksum).toHaveLength(64)
      expect(intent.retryCount).toBe(0)

      const isValid = await verifyPayloadIntegrity(intent.payload, intent.checksum)
      expect(isValid).toBe(true)
    })

    it('should retrieve pending intents and update lifecycle status without fake ledger confirmation', async () => {
      const intent = await queue.enqueueIntent(samplePayload, 'BOOK-CAFE-HQ-88')

      let pending = await queue.getPendingIntents()
      expect(pending.length).toBe(1)
      expect(pending[0].status).toBe('pending_sync')

      // Mark syncing
      await queue.markIntentSyncing(intent.idempotencyKey)
      const syncing = await queue.getIntent(intent.idempotencyKey)
      expect(syncing?.status).toBe('syncing')
      expect(syncing?.retryCount).toBe(1)

      // Mark failed
      await queue.markIntentFailed(intent.idempotencyKey, 'Network timeout')
      const failed = await queue.getIntent(intent.idempotencyKey)
      expect(failed?.status).toBe('failed')
      expect(failed?.lastError).toBe('Network timeout')

      // Remove after eventual sync
      await queue.removeIntent(intent.idempotencyKey)
      const afterRemoval = await queue.getPendingIntents()
      expect(afterRemoval.length).toBe(0)
    })
  })

  describe('4. Financial Port Resolver & Factory', () => {
    beforeEach(() => {
      setSharedFinancialPort(null)
    })

    it('should resolve MockHfeAdapter when mode is explicitly set to mock', () => {
      const port = createFinancialPort({ mode: 'mock' })
      expect(port.isSimulated).toBe(true)
      expect(port.adapterName).toBe('MockHfeAdapter')
    })

    it('should resolve HfeSdkAdapter when mode is explicitly set to production', () => {
      const port = createFinancialPort({ mode: 'production' })
      expect(port.isSimulated).toBe(false)
      expect(port.adapterName).toBe('HfeSdkAdapter')
    })

    it('should reuse shared singleton port from getFinancialPort', () => {
      const port1 = getFinancialPort({ mode: 'mock' })
      const port2 = getFinancialPort()
      expect(port1).toBe(port2)
    })
  })
})
