import type { PB1TaxMode } from '../types/pos'
import demoAccess from '../../fixtures/demo/access.json'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isConnectedFirstPartyRuntime(): boolean {
  return import.meta.env.VITE_HFE_RUNTIME_MODE === 'connected'
}

export function firstPartyAuthEntryPolicy(): {
  initialTab: 'pin' | 'owner-login'
  allowSyntheticStaffPin: boolean
  allowLocalRegistration: boolean
} {
  const connected = isConnectedFirstPartyRuntime()
  return {
    initialTab: connected ? 'owner-login' : 'pin',
    allowSyntheticStaffPin: !connected,
    allowLocalRegistration: !connected,
  }
}

export function requiredRuntimeValue(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`Hfe POS first-party runtime is missing ${name}`)
  }
  return value.trim()
}

export function requiredRuntimeUuid(name: keyof ImportMetaEnv): string {
  const value = requiredRuntimeValue(name)
  if (!UUID_PATTERN.test(value)) throw new Error(`${name} must be a UUID`)
  return value
}

/** Exact Hfeit IAM organization for the connected runtime or canonical synthetic local demo. */
export function resolveHfeitOrganizationId(): string {
  if (!isConnectedFirstPartyRuntime()) return demoAccess.organizationId
  const org =
    import.meta.env.VITE_AUTH_ORGANIZATION_ID ||
    import.meta.env.VITE_HFAUTH_ORGANIZATION_ID ||
    import.meta.env.VITE_TOGROW_ORGANIZATION_ID
  if (org && UUID_PATTERN.test(org.trim())) return org.trim()
  return requiredRuntimeUuid('VITE_TOGROW_ORGANIZATION_ID')
}

export function resolveGovernedQuoteContext(): {
  outletId: string
  terminalId: string
  currency: string
} {
  if (!isConnectedFirstPartyRuntime()) return demoAccess.quoteContext
  return {
    outletId: requiredRuntimeValue('VITE_HFE_OUTLET_ID'),
    terminalId: requiredRuntimeValue('VITE_HFE_TERMINAL_ID'),
    currency: requiredRuntimeValue('VITE_HFE_CURRENCY'),
  }
}

export function resolveInitialPb1TaxMode(stored: string | null): PB1TaxMode {
  if (isConnectedFirstPartyRuntime()) return 0
  const parsed = stored === null ? 1 : Number(stored)
  return parsed === 0 || parsed === 1 || parsed === 2 ? parsed : 1
}

export function connectedRuntimeConfigurationError(): string | null {
  const connectedSignals = [
    import.meta.env.VITE_HFE_CORE_URL,
    import.meta.env.VITE_HFE_COMPANY_BOOK_URL,
    import.meta.env.VITE_AUTH_ISSUER_URL,
    import.meta.env.VITE_HFAUTH_URL,
    import.meta.env.VITE_TOGROW_URL,
    import.meta.env.VITE_HFE_BOOK_ID,
    import.meta.env.VITE_HFE_AUTHORITY_CONTEXT_ID,
    import.meta.env.VITE_HFE_CASHIER_SESSION_ID,
    import.meta.env.VITE_HFE_FLAGSHIP_PRODUCT_ID,
    import.meta.env.VITE_HFE_OUTLET_ID,
    import.meta.env.VITE_HFE_TERMINAL_ID,
    import.meta.env.VITE_HFE_CURRENCY,
  ]
  if (!isConnectedFirstPartyRuntime()) {
    return connectedSignals.some(Boolean)
      ? 'Connected configuration requires VITE_HFE_RUNTIME_MODE=connected'
      : null
  }

  try {
    const authUrl = import.meta.env.VITE_AUTH_ISSUER_URL || import.meta.env.VITE_HFAUTH_URL || import.meta.env.VITE_TOGROW_URL
    if (!authUrl) requiredRuntimeValue('VITE_TOGROW_URL')
    requiredRuntimeValue('VITE_HFE_CORE_URL')
    requiredRuntimeValue('VITE_HFE_COMPANY_BOOK_URL')
    resolveHfeitOrganizationId()
    const clientId = import.meta.env.VITE_AUTH_CLIENT_ID || import.meta.env.VITE_HFAUTH_CLIENT_ID || import.meta.env.VITE_TOGROW_CLIENT_ID
    if (!clientId) requiredRuntimeValue('VITE_TOGROW_CLIENT_ID')
    requiredRuntimeUuid('VITE_HFE_BOOK_ID')
    requiredRuntimeUuid('VITE_HFE_AUTHORITY_CONTEXT_ID')
    requiredRuntimeValue('VITE_HFE_BRANCH_ID')
    requiredRuntimeValue('VITE_HFE_OUTLET_ID')
    requiredRuntimeValue('VITE_HFE_TERMINAL_ID')
    requiredRuntimeValue('VITE_HFE_CURRENCY')
    requiredRuntimeUuid('VITE_HFE_CASHIER_SESSION_ID')
    requiredRuntimeUuid('VITE_HFE_FLAGSHIP_PRODUCT_ID')
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Hfe POS first-party runtime is misconfigured'
  }
}
