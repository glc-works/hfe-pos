/**
 * Universal Pluggable Identity Port (Factory & Exports)
 */

import type { HfeIdentityPort, IdentityProviderConfig, SocialAuthProvider } from './types'
import { OidcIdentityAdapter } from './OidcIdentityAdapter'
import { MockIdentityAdapter } from './MockIdentityAdapter'
import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'

export * from './types'
export { OidcIdentityAdapter } from './OidcIdentityAdapter'
export { MockIdentityAdapter } from './MockIdentityAdapter'

const SUPPORTED_SOCIAL: SocialAuthProvider[] = ['google', 'apple']

function resolveConfiguredSocialProviders(): SocialAuthProvider[] {
  const envProviders = (
    import.meta.env.VITE_AUTH_SOCIAL_PROVIDERS ||
    import.meta.env.VITE_HFAUTH_SOCIAL_PROVIDERS ||
    import.meta.env.VITE_TOGROW_SOCIAL_PROVIDERS ||
    'google,apple'
  ).split(',')

  const list = envProviders
    .map((p: string) => p.trim().toLowerCase())
    .filter((p: string): p is SocialAuthProvider => SUPPORTED_SOCIAL.includes(p as SocialAuthProvider))

  return list.length > 0 ? list : ['google', 'apple']
}

export function createIdentityPort(overrideConfig?: Partial<IdentityProviderConfig>): HfeIdentityPort {
  const isConnected = isConnectedFirstPartyRuntime()

  const providerId =
    overrideConfig?.providerId ||
    import.meta.env.VITE_AUTH_PROVIDER ||
    import.meta.env.VITE_HFAUTH_PROVIDER ||
    (isConnected ? 'hfauth' : 'mock-identity')

  const displayName =
    overrideConfig?.displayName ||
    (providerId === 'hfauth' ? 'hfauth' : providerId === 'workos' ? 'WorkOS SSO' : 'Hfe Auth')

  const issuerUrl =
    overrideConfig?.issuerUrl ||
    import.meta.env.VITE_AUTH_ISSUER_URL ||
    import.meta.env.VITE_HFAUTH_URL ||
    import.meta.env.VITE_TOGROW_URL ||
    '/id'

  const clientId =
    overrideConfig?.clientId ||
    import.meta.env.VITE_AUTH_CLIENT_ID ||
    import.meta.env.VITE_HFAUTH_CLIENT_ID ||
    import.meta.env.VITE_TOGROW_CLIENT_ID ||
    'flagship-pos-client'

  const audience =
    overrideConfig?.audience ||
    import.meta.env.VITE_AUTH_AUDIENCE ||
    import.meta.env.VITE_HFAUTH_AUDIENCE

  const supportedSocialProviders =
    overrideConfig?.supportedSocialProviders || resolveConfiguredSocialProviders()

  const config: IdentityProviderConfig = {
    providerId,
    displayName,
    issuerUrl,
    clientId,
    audience,
    supportedSocialProviders,
    ...overrideConfig,
  }

  if (!isConnected && providerId === 'mock-identity') {
    return new MockIdentityAdapter(config)
  }

  return new OidcIdentityAdapter(config)
}

/** Singleton default identity port for the application */
export const defaultIdentityPort: HfeIdentityPort = createIdentityPort()
