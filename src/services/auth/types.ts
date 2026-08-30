/**
 * Universal Pluggable Identity Port Types (SSOT)
 * Standard OpenID Connect (OIDC) Relying Party & Provider-Agnostic Interface
 */

export type SocialAuthProvider = 'google' | 'apple' | 'email' | 'oidc' | 'passkey'

export interface AuthAccountProfile {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  provider: string
  issuer?: string
  organizationId?: string
  metadata?: Record<string, unknown>
}

export interface AuthLoginSession {
  sessionToken: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  profile: AuthAccountProfile
}

export interface IdentityProviderConfig {
  providerId: string
  displayName: string
  issuerUrl: string
  clientId: string
  audience?: string
  supportedSocialProviders: SocialAuthProvider[]
  authorizationEndpoint?: string
  tokenEndpoint?: string
  userinfoEndpoint?: string
}

export interface SocialAuthAttempt {
  provider: SocialAuthProvider
  verifier: string
  state: string
  redirectUri: string
}

export type ValidatedAuthCallback =
  | { kind: 'exchange'; code: string; verifier: string; provider: SocialAuthProvider }
  | { kind: 'error'; reason: string }

export interface HfeIdentityPort {
  /** Returns the active identity provider metadata and configuration */
  getProviderConfig(): IdentityProviderConfig

  /** Prepares PKCE authorization URL for a social or OIDC login attempt */
  prepareSocialAuth(
    provider: SocialAuthProvider,
    redirectUri: string
  ): Promise<{ url: string; attempt: SocialAuthAttempt }>

  /** Initiates full-page redirect to identity provider */
  startSocialAuth(provider: SocialAuthProvider, redirectUri?: string): Promise<void>

  /** Completes OAuth/OIDC code exchange callback */
  completeSocialAuth(
    search: string
  ): Promise<{ kind: 'session'; session: AuthLoginSession } | { kind: 'error'; reason: string }>

  /** Exchanges a raw session token or API key for a verified account profile */
  exchangeSessionToken(sessionToken: string): Promise<AuthAccountProfile>

  /** Terminates active identity session */
  logout(): Promise<void>
}
