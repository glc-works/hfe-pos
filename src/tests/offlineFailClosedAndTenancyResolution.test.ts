import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  saveOfflineTransaction,
  requestPersistentStorage,
  registerOfflineBeforeUnloadGuard,
} from '../services/offlineStorage'
import { OfflineIntentQueue } from '../services/financial/OfflineIntentQueue'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import { FlushManager } from '../services/flushManager'

describe('Offline Fail-Closed Durability & Strict Tenancy Resolution Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Pillar III: Offline ACID Resilience & Fail-Closed Durability', () => {
    it('throws explicit error when physical storage persistence fails (zero silent RAM fallback)', async () => {
      const originalIndexedDB = globalThis.indexedDB
      // @ts-ignore
      globalThis.indexedDB = {
        open: vi.fn().mockImplementation(() => {
          const req: any = {}
          setTimeout(() => {
            req.error = new Error('Disk quota exceeded')
            if (req.onerror) req.onerror({ target: req })
          }, 0)
          return req
        }),
      }

      await expect(
        saveOfflineTransaction({
          table_id: 'MEJA-01',
          contact_id: 'C-01',
          policy: 'pay-first',
          items: [],
          subtotal: 50000,
          tax_pb1_amount: 5000,
          service_fee_amount: 0,
          discount_amount: 0,
          grand_total: 55000,
        })
      ).rejects.toThrow(/Failed to persist offline transaction to disk storage/)

      globalThis.indexedDB = originalIndexedDB
    })

    it('requests persistent storage using navigator.storage.persist()', async () => {
      const mockPersist = vi.fn().mockResolvedValue(true)
      const originalNavigator = globalThis.navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: {
          storage: {
            persist: mockPersist,
          },
        },
        configurable: true,
        writable: true,
      })

      const result = await requestPersistentStorage()
      expect(result).toBe(true)
      expect(mockPersist).toHaveBeenCalledOnce()

      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
      })
    })

    it('registers beforeunload guard when pending un-synced transactions exist', () => {
      const addEventSpy = vi.fn()
      const removeEventSpy = vi.fn()
      const originalWindow = globalThis.window

      Object.defineProperty(globalThis, 'window', {
        value: {
          addEventListener: addEventSpy,
          removeEventListener: removeEventSpy,
        },
        configurable: true,
        writable: true,
      })

      const unregister = registerOfflineBeforeUnloadGuard(() => 5)
      expect(addEventSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

      const handler = addEventSpy.mock.calls[0][1]
      const mockEvent = {
        preventDefault: vi.fn(),
        returnValue: '',
      }

      handler(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.returnValue).toContain('5 transaksi kasir offline')

      unregister()
      expect(removeEventSpy).toHaveBeenCalledWith('beforeunload', handler)

      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      })
    })

    it('OfflineIntentQueue throws error when bookId is empty or storage fails', async () => {
      const queue = new OfflineIntentQueue()
      // @ts-ignore
      await expect(queue.enqueueIntent({
        table_id: 'MEJA-01',
        contact_id: 'C-01',
        policy: 'pay-first',
        payment_method: 'cash',
        items: [],
        subtotal: 10000,
        tax_pb1_amount: 1000,
        service_fee_amount: 0,
        discount_amount: 0,
        grand_total: 11000,
        cashier_id: 'K-01',
        branch_id: 'B-01',
        cost_center_id: 'CC-01',
      }, '')).rejects.toThrow(/companyBookId is required for ledger mutations/)
    })
  })

  describe('Pillar IV: Strict Tenancy Resolution (Zero Default Book Fallback)', () => {
    it('HfeSdkAdapter throws error when companyBookId is missing and no default is set', async () => {
      const adapter = new HfeSdkAdapter()
      await expect(adapter.fetchProductCatalog('')).rejects.toThrow(
        /companyBookId is required for ledger operations/
      )
    })

    it('FlushManager fails closed when companyBookId is empty', async () => {
      const manager = new FlushManager('')
      const result = await manager.flushPendingQueue()
      expect(result.syncedCount).toBe(0)
      expect(result.failedCount).toBe(0)
      expect(manager.getStatus().lastError).toContain('Missing companyBookId')
    })
  })
})
