// --- HFE POS FINANCIAL PORT EXPORTS & FACTORY RESOLVER (POS-ENG-STD-001) ---

import { HfePosFinancialPort } from './HfePosFinancialPort'
import { HfeSdkAdapter, HfeSdkAdapterOptions } from './HfeSdkAdapter'
import { MockHfeAdapter } from './MockHfeAdapter'

export * from './HfePosFinancialPort'
export * from './HfeSdkAdapter'
export * from './MockHfeAdapter'
export * from './OfflineIntentQueue'

export type FinancialPortMode = 'production' | 'mock' | 'auto'

export interface FinancialPortFactoryOptions extends HfeSdkAdapterOptions {
  mode?: FinancialPortMode
}

let sharedFinancialPortInstance: HfePosFinancialPort | null = null

export function isMockModeForced(): boolean {
  // In production builds, forcing mock mode via browser globals or localStorage is strictly forbidden
  if (!import.meta.env.DEV) {
    return false
  }
  if (typeof window !== 'undefined') {
    if ((window as any).__HFE_FORCE_MOCK__ === true) return true
    try {
      if (localStorage.getItem('hfe_force_mock_adapter') === 'true') return true
    } catch {}
  }
  return false
}

export function createFinancialPort(options?: FinancialPortFactoryOptions): HfePosFinancialPort {
  const mode = options?.mode || 'auto'

  if (mode === 'mock') {
    return new MockHfeAdapter()
  }

  if (mode === 'production') {
    return new HfeSdkAdapter(options)
  }

  // Auto mode: default to Mock if in test or explicitly requested, else HfeSdkAdapter
  if (isMockModeForced()) {
    return new MockHfeAdapter()
  }

  return new HfeSdkAdapter(options)
}

export function getFinancialPort(options?: FinancialPortFactoryOptions): HfePosFinancialPort {
  if (!sharedFinancialPortInstance) {
    sharedFinancialPortInstance = createFinancialPort(options)
  }
  return sharedFinancialPortInstance
}

export function setSharedFinancialPort(port: HfePosFinancialPort | null): void {
  sharedFinancialPortInstance = port
}
