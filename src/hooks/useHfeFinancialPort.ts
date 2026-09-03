import { useMemo } from 'react'
import { createFinancialPort } from '../services/financial'
import { isConnectedFirstPartyRuntime } from '../config/firstPartyRuntime'

export function useHfeFinancialPort(token?: string | null) {
  return useMemo(() => createFinancialPort({
    mode: isConnectedFirstPartyRuntime() ? 'production' : 'auto',
    baseUrl: import.meta.env.VITE_HFE_CORE_URL || 'http://localhost:8080',
    token: token || undefined,
  }), [token])
}
