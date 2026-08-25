import type {
  HfePosFinancialPort,
  RetailPostingContext,
  SubmitRetailTransactionPayload,
  SubmitRetailTransactionResponse,
} from './HfePosFinancialPort'

export interface CafeSettlementCommand {
  port: HfePosFinancialPort
  payload: SubmitRetailTransactionPayload
  context: RetailPostingContext
  commitPaidState: () => void
}

export async function settleCafeOrder({
  port,
  payload,
  context,
  commitPaidState,
}: CafeSettlementCommand): Promise<SubmitRetailTransactionResponse> {
  const result = await port.postRetailOrder(payload, context)
  if (result.status === 'posted') {
    commitPaidState()
  }
  return result
}
