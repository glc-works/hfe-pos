import { describe, it, expect } from 'vitest'
import {
  createIdentityPort,
  MockIdentityAdapter,
  OidcIdentityAdapter,
  type IdentityProviderConfig,
} from '../services/auth'

describe('Pluggable Identity Port & Swappable Auth Provider Suite (OIDC Standard)', () => {
  it('should instantiate MockIdentityAdapter with default test credentials in offline/demo mode', () => {
    const port = createIdentityPort({
      providerId: 'mock-identity',
      displayName: 'Simulasi Identitas Lokal',
    })

    expect(port).toBeInstanceOf(MockIdentityAdapter)
    const config = port.getProviderConfig()
    expect(config.providerId).toBe('mock-identity')
    expect(config.displayName).toBe('Simulasi Identitas Lokal')
    expect(config.supportedSocialProviders).toContain('google')
  })

  it('should instantiate OidcIdentityAdapter for hfauth with custom issuer and client_id', () => {
    const hfAuthConfig: IdentityProviderConfig = {
      providerId: 'hfauth',
      displayName: 'hfauth Identity',
      issuerUrl: 'https://auth.hfeit.com',
      clientId: 'pos-senopati-prod',
      audience: 'https://core.hfeit.com',
      supportedSocialProviders: ['google', 'apple', 'passkey'],
    }

    const port = new OidcIdentityAdapter(hfAuthConfig)
    expect(port).toBeInstanceOf(OidcIdentityAdapter)
    const config = port.getProviderConfig()
    expect(config.providerId).toBe('hfauth')
    expect(config.issuerUrl).toBe('https://auth.hfeit.com')
    expect(config.clientId).toBe('pos-senopati-prod')
    expect(config.audience).toBe('https://core.hfeit.com')
  })

  it('should generate valid PKCE S256 code challenge and attempt state for social auth', async () => {
    const port = new OidcIdentityAdapter({
      providerId: 'hfauth',
      displayName: 'hfauth',
      issuerUrl: 'https://auth.hfeit.com',
      clientId: 'pos-client-123',
      supportedSocialProviders: ['google', 'apple'],
    })

    const prepared = await port.prepareSocialAuth('google', 'https://pos.hfeit.app/auth/callback')
    expect(prepared.url).toContain('https://auth.hfeit.com/v1/auth/external/google/spa-start')
    expect(prepared.url).toContain('client_id=pos-client-123')
    expect(prepared.url).toContain('code_challenge=')
    expect(prepared.url).toContain('code_challenge_method=S256')
    expect(prepared.attempt.provider).toBe('google')
    expect(prepared.attempt.verifier).toBeTruthy()
    expect(prepared.attempt.state).toBeTruthy()
  })

  it('should seamlessly allow swapping provider to WorkOS or custom enterprise OIDC without code changes', () => {
    const workOsPort = createIdentityPort({
      providerId: 'workos',
      displayName: 'WorkOS Enterprise SSO',
      issuerUrl: 'https://api.workos.com/sso',
      clientId: 'client_workos_9988',
      supportedSocialProviders: ['oidc'],
    })

    expect(workOsPort.getProviderConfig().providerId).toBe('workos')
    expect(workOsPort.getProviderConfig().displayName).toBe('WorkOS Enterprise SSO')
    expect(workOsPort.getProviderConfig().clientId).toBe('client_workos_9988')
  })
})
