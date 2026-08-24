import { describe, expect, it, vi } from 'vitest'
import type {
  HfePosFinancialPort,
  RetailPostingContext,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
} from '../services/financial/HfePosFinancialPort'
import { settleCafeOrder } from '../services/financial/CafeSettlementOrchestrator'

const payload = { idempotency_key: 'stable-key' } as SubmitRetailTransactionPayload
const context = { companyBookId: 'BOOK-1', authorityContext: 'AUTH-1' } as RetailPostingContext

function portReturning(result: SubmitRetailTransactionResponse): HfePosFinancialPort {
  return { postRetailOrder: vi.fn().mockResolvedValue(result) } as unknown as HfePosFinancialPort
}

describe('flagship cafe settlement orchestration', () => {
  it('commits paid UI state only after durable posted read-back', async () => {
    const commitPaidState = vi.fn()
    const port = portReturning({ status: 'posted', tx_id: 'ORDER-1' } as SubmitRetailTransactionResponse)

    const result = await settleCafeOrder({ port, payload, context, commitPaidState })

    expect(result.status).toBe('posted')
    expect(commitPaidState).toHaveBeenCalledOnce()
  })

  it('keeps the order unsettled when CORE posting remains pending', async () => {
    const commitPaidState = vi.fn()
    const port = portReturning({ status: 'pending', tx_id: 'ORDER-1' } as SubmitRetailTransactionResponse)

    const result = await settleCafeOrder({ port, payload, context, commitPaidState })

    expect(result.status).toBe('pending')
    expect(commitPaidState).not.toHaveBeenCalled()
  })

  it('keeps the order unsettled when CORE or read-back fails', async () => {
    const commitPaidState = vi.fn()
    const port = { postRetailOrder: vi.fn().mockRejectedValue(new Error('lineage mismatch')) } as unknown as HfePosFinancialPort

    await expect(settleCafeOrder({ port, payload, context, commitPaidState })).rejects.toThrow('lineage mismatch')
    expect(commitPaidState).not.toHaveBeenCalled()
  })
})
