import { afterEach, describe, expect, it, vi } from 'vitest'
import { saveOfflineTransaction } from '../services/offlineStorage'
import { buildHfeUrl, submitTransaction } from '../services/hfeCoreApi'
import { HfeSdkAdapter } from '../services/financial/HfeSdkAdapter'
import type { SubmitTransactionPayload } from '../services/hfeApi'

const transaction: SubmitTransactionPayload = {
  table_id: 'TABLE-01',
  contact_id: 'CUST-01',
  policy: 'pay-first',
  items: [{ product_id: 'ITEM-01', hfe_gl_account: 'GL-4101', qty: 1, price: 50_000 }],
  subtotal: 50_000,
  tax_pb1_amount: 5_000,
  service_fee_amount: 0,
  discount_amount: 0,
  grand_total: 55_000,
}

describe('offline financial durability', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('rejects instead of confirming an offline entry when IndexedDB is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined)

    await expect(saveOfflineTransaction(transaction)).rejects.toThrow(
      'IndexedDB not supported in current runtime environment',
    )
  })

  it('does not return buffered_offline when the durable write fails', async () => {
    vi.stubGlobal('indexedDB', undefined)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')))

    await expect(submitTransaction(transaction, 'BOOK-MERCHANT-100')).rejects.toThrow(
      'IndexedDB not supported in this environment',
    )
  })
})

describe('production tenant context', () => {
  it('rejects construction without an explicit company book', () => {
    expect(() => new HfeSdkAdapter()).toThrow('defaultBookId is required')
  })

  it('rejects insecure remote API base URLs', () => {
    expect(() => buildHfeUrl('http://169.254.169.254', '/v1/company-books/BOOK-01/products')).toThrow(
      'Hfe API base URL must use an approved HFE origin',
    )
  })
})
