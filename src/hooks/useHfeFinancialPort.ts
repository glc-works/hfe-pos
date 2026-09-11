import { useMemo } from 'react'
import { createFinancialPort } from '../services/financial'
import { isConnectedFirstPartyRuntime } from '../config/firstPartyRuntime'

export function useHfeFinancialPort(token?: string | null) {
  const connectedBearer = isConnectedFirstPartyRuntime()
    ? import.meta.env.VITE_HFE_BEARER_TOKEN?.trim()
    : ''
  return useMemo(() => createFinancialPort({
    mode: isConnectedFirstPartyRuntime() ? 'production' : 'auto',
    baseUrl: import.meta.env.VITE_HFE_CORE_URL || 'http://localhost:8080',
    token: token || connectedBearer || undefined,
  }), [token, connectedBearer])
}
