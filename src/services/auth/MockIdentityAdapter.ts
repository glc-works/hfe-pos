/**
 * Mock Identity Adapter for Local Demo & Offline Testing
 */

import type {
  HfeIdentityPort,
  IdentityProviderConfig,
  SocialAuthProvider,
  SocialAuthAttempt,
  AuthLoginSession,
  AuthAccountProfile,
} from './types'

export class MockIdentityAdapter implements HfeIdentityPort {
  private config: IdentityProviderConfig

  constructor(config?: Partial<IdentityProviderConfig>) {
    this.config = {
      providerId: 'mock-identity',
      displayName: 'Simulasi Identitas Lokal',
      issuerUrl: 'https://demo-auth.local',
      clientId: 'pos-mock-client',
      supportedSocialProviders: ['google', 'apple', 'email'],
      ...config,
    }
  }

  getProviderConfig(): IdentityProviderConfig {
    return { ...this.config }
  }

  async prepareSocialAuth(
    provider: SocialAuthProvider,
    redirectUri: string
  ): Promise<{ url: string; attempt: SocialAuthAttempt }> {
    const attempt: SocialAuthAttempt = {
      provider,
      verifier: 'mock-verifier',
      state: 'mock-state',
      redirectUri,
    }
    return {
      url: `${redirectUri}?code=mock-auth-code&state=${attempt.state}`,
      attempt,
    }
  }

  async startSocialAuth(provider: SocialAuthProvider, redirectUri?: string): Promise<void> {
    const targetRedirect = redirectUri || `${window.location.origin}/auth/callback`
    const { url } = await this.prepareSocialAuth(provider, targetRedirect)
    window.location.assign(url)
  }

  async completeSocialAuth(
    search: string
  ): Promise<{ kind: 'session'; session: AuthLoginSession } | { kind: 'error'; reason: string }> {
    const params = new URLSearchParams(search)
    const error = params.get('error')
    if (error) return { kind: 'error', reason: error }

    const profile: AuthAccountProfile = {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'owner@senopati-roastery.com',
      name: 'Aldi (Owner Senopati)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
      provider: this.config.providerId,
      issuer: this.config.issuerUrl,
      organizationId: '00000000-0000-4000-8000-000000000001',
    }

    return {
      kind: 'session',
      session: {
        sessionToken: 'mock-session-token-998811',
        accessToken: 'mock-access-token-998811',
        profile,
      },
    }
  }

  async exchangeSessionToken(sessionToken: string): Promise<AuthAccountProfile> {
    return {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'owner@senopati-roastery.com',
      name: 'Aldi (Owner Senopati)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
      provider: this.config.providerId,
      issuer: this.config.issuerUrl,
      organizationId: '00000000-0000-4000-8000-000000000001',
      metadata: { sessionToken },
    }
  }

  async logout(): Promise<void> {
    // No-op for mock
  }
}
