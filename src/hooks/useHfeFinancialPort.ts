import { useMemo } from 'react'
import { createFinancialPort } from '../services/financial'

export function useHfeFinancialPort(token?: string | null) {
  return useMemo(() => createFinancialPort({
    mode: 'production',
    baseUrl: import.meta.env.VITE_HFE_CORE_URL || 'http://localhost:8080',
    token: token || undefined,
  }), [token])
}
