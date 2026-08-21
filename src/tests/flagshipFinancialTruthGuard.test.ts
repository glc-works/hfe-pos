import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

import {
  fetchProductCatalog,
  settleUniversalMultiTender,
  UniversalMultiTenderRequest,
} from '../services/hfeCoreApi'

describe('P0 flagship financial truth guard', () => {
  it('fails closed when legacy settlement transport cannot reach Hfe CORE', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('CORE unavailable'))

    const request: UniversalMultiTenderRequest = {
      document_reference_id: 'ORDER-FLAGSHIP-001',
      total_obligation_minor: 57_500,
      tenders: [
        {
          tender_type: 'qris',
          amount_minor: 57_500,
          reference_id: 'QRIS-FLAGSHIP-001',
        },
      ],
    }

    await expect(settleUniversalMultiTender(request)).rejects.toThrow(
      'Accounting sync unavailable — transaction not marked posted'
    )
  })

  it('does not claim CORE posting from the local QRIS completion handler', () => {
    const source = readFileSync(new URL('../hooks/useCart.ts', import.meta.url), 'utf8')

    expect(source).not.toContain('Terposting ke Hfe Engine')
    expect(source).not.toContain('Terkoneksi dengan Hfe Ledger')
    expect(source).toContain('Status pembukuan: menunggu verifikasi Hfe CORE')
    expect(source).toContain('Status pembukuan: belum dimulai')
    expect(source).toContain("financialState: createPendingFinancialState(orderId, `POS-${orderId}`)")
    expect(source).toContain("status: 'not_started'")
  })

  it('does not send CORE requests to an untrusted origin', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await fetchProductCatalog('BOOK-FLAGSHIP-001', 'http://169.254.169.254')

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
