/**
 * Legacy SPA PKCE adapter for HfAuth-shaped endpoints.
 * Connected person login uses the server-side IdentityProvider contract instead.
 * Setting provider metadata here does not implement another provider's protocol.
 */

import type {
  HfeIdentityPort,
  IdentityProviderConfig,
  SocialAuthProvider,
  SocialAuthAttempt,
  ValidatedAuthCallback,
  AuthLoginSession,
  AuthAccountProfile,
} from './types'

const ATTEMPT_STORAGE_KEY = 'hfe_pos_auth_attempt'

function base64url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export class OidcIdentityAdapter implements HfeIdentityPort {
  private config: IdentityProviderConfig

  constructor(config: IdentityProviderConfig) {
    this.config = { ...config }
  }

  getProviderConfig(): IdentityProviderConfig {
    return { ...this.config }
  }

  async prepareSocialAuth(
    provider: SocialAuthProvider,
    redirectUri: string
  ): Promise<{ url: string; attempt: SocialAuthAttempt }> {
    const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)))
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const state = base64url(crypto.getRandomValues(new Uint8Array(16)))

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      code_challenge: base64url(new Uint8Array(digest)),
      code_challenge_method: 'S256',
      state,
      response_type: 'code',
      scope: 'openid email profile',
    })

    if (this.config.audience) {
      params.set('audience', this.config.audience)
    }

    const base = this.config.issuerUrl.replace(/\/+$/, '')
    const authPath = this.config.authorizationEndpoint || `${base}/v1/auth/external/${provider}/spa-start`
    const url = authPath.includes('?') ? `${authPath}&${params.toString()}` : `${authPath}?${params.toString()}`

    return {
      url,
      attempt: { provider, verifier, state, redirectUri },
    }
  }

  async startSocialAuth(provider: SocialAuthProvider, redirectUri?: string): Promise<void> {
    const targetRedirect = redirectUri || `${window.location.origin}/auth/callback`
    const prepared = await this.prepareSocialAuth(provider, targetRedirect)
    sessionStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(prepared.attempt))
    window.location.assign(prepared.url)
  }

  async completeSocialAuth(
    search: string
  ): Promise<{ kind: 'session'; session: AuthLoginSession } | { kind: 'error'; reason: string }> {
    const raw = sessionStorage.getItem(ATTEMPT_STORAGE_KEY)
    sessionStorage.removeItem(ATTEMPT_STORAGE_KEY)
    if (!raw) return { kind: 'error', reason: 'missing_attempt' }

    let attempt: SocialAuthAttempt
    try {
      attempt = JSON.parse(raw) as SocialAuthAttempt
    } catch {
      return { kind: 'error', reason: 'corrupted_attempt' }
    }

    const params = new URLSearchParams(search)
    const error = params.get('error')
    if (error) return { kind: 'error', reason: error }
    const code = params.get('code')
    if (!code) return { kind: 'error', reason: 'missing_code' }
    if (params.get('state') !== attempt.state) return { kind: 'error', reason: 'state_mismatch' }

    const base = this.config.issuerUrl.replace(/\/+$/, '')
    const tokenUrl = this.config.tokenEndpoint || `${base}/v1/auth/external/${attempt.provider}/spa-complete`

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          code_verifier: attempt.verifier,
          redirect_uri: attempt.redirectUri,
          client_id: this.config.clientId,
        }),
      })

      if (!response.ok) {
        return { kind: 'error', reason: `token_exchange_failed_${response.status}` }
      }

      const data = await response.json()
      const profile: AuthAccountProfile = {
        id: data.profile?.id || data.person?.id || data.sub || data.id,
        email: data.profile?.email || data.person?.primary_email || data.email,
        name: data.profile?.name || data.person?.display_name || data.name,
        avatarUrl: data.profile?.avatarUrl || data.person?.avatar_url || data.picture,
        provider: this.config.providerId,
        issuer: this.config.issuerUrl,
        organizationId: data.organizationId || data.org_id,
        metadata: data,
      }

      return {
        kind: 'session',
        session: {
          sessionToken: data.sessionToken || data.session_token || data.token,
          accessToken: data.accessToken || data.access_token,
          refreshToken: data.refreshToken || data.refresh_token,
          expiresAt: data.expiresAt || (data.expires_in ? Date.now() + data.expires_in * 1000 : undefined),
          profile,
        },
      }
    } catch (err) {
      return { kind: 'error', reason: err instanceof Error ? err.message : 'network_error' }
    }
  }

  async exchangeSessionToken(sessionToken: string): Promise<AuthAccountProfile> {
    const base = this.config.issuerUrl.replace(/\/+$/, '')
    const url = this.config.userinfoEndpoint || `${base}/v1/auth/sessions/exchange`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ session_token: sessionToken }),
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange identity session token: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.person?.id || data.profile?.id || data.id || data.sub,
      email: data.person?.primary_email || data.profile?.email || data.email,
      name: data.person?.display_name || data.profile?.name || data.name,
      avatarUrl: data.person?.avatar_url || data.profile?.avatarUrl || data.picture,
      provider: this.config.providerId,
      issuer: this.config.issuerUrl,
      organizationId: data.organizationId || data.org_id,
      metadata: data,
    }
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem(ATTEMPT_STORAGE_KEY)
  }
}
