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

export function connectedRuntimeConfigurationError(): string | null {
  const connectedSignals = [
    import.meta.env.VITE_HFE_CORE_URL,
    import.meta.env.VITE_TOGROW_URL,
    import.meta.env.VITE_HFE_BOOK_ID,
    import.meta.env.VITE_HFE_AUTHORITY_CONTEXT_ID,
    import.meta.env.VITE_HFE_CASHIER_SESSION_ID,
    import.meta.env.VITE_HFE_FLAGSHIP_PRODUCT_ID,
  ]
  if (!isConnectedFirstPartyRuntime()) {
    return connectedSignals.some(Boolean)
      ? 'Connected configuration requires VITE_HFE_RUNTIME_MODE=connected'
      : null
  }

  try {
    requiredRuntimeValue('VITE_TOGROW_URL')
    requiredRuntimeValue('VITE_HFE_CORE_URL')
    requiredRuntimeUuid('VITE_TOGROW_ORGANIZATION_ID')
    requiredRuntimeValue('VITE_TOGROW_CLIENT_ID')
    requiredRuntimeUuid('VITE_HFE_BOOK_ID')
    requiredRuntimeUuid('VITE_HFE_AUTHORITY_CONTEXT_ID')
    requiredRuntimeValue('VITE_HFE_BRANCH_ID')
    requiredRuntimeUuid('VITE_HFE_CASHIER_SESSION_ID')
    requiredRuntimeUuid('VITE_HFE_FLAGSHIP_PRODUCT_ID')
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Hfe POS first-party runtime is misconfigured'
  }
}
