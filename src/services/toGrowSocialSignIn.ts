import { isConnectedFirstPartyRuntime, requiredRuntimeValue } from '../config/firstPartyRuntime'
import type { ToGrowLoginSession } from './hfeAuthApi'
import type { SocialAuthProvider } from './auth'

export type ToGrowSocialProvider = SocialAuthProvider

export interface SocialSignInAttempt {
  provider: SocialAuthProvider
  verifier: string
  state: string
}

const ATTEMPT_KEY = 'hfe_pos_togrow_social_attempt'
const SUPPORTED_PROVIDERS: readonly SocialAuthProvider[] = ['google', 'apple', 'email', 'oidc', 'passkey']

function isSupportedProvider(value: string): value is SocialAuthProvider {
  return SUPPORTED_PROVIDERS.includes(value as SocialAuthProvider)
}

export function configuredSocialProviders(): SocialAuthProvider[] {
  if (!isConnectedFirstPartyRuntime()) return []
  const configured = String(
    import.meta.env.VITE_AUTH_SOCIAL_PROVIDERS ||
    import.meta.env.VITE_HFAUTH_SOCIAL_PROVIDERS ||
    import.meta.env.VITE_TOGROW_SOCIAL_PROVIDERS ||
    ''
  ).split(',')
  const supported = configured.map(value => value.trim().toLowerCase()).filter(isSupportedProvider)
  return [...new Set<SocialAuthProvider>(supported)]
}

function base64url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function prepareSocialSignIn(
  provider: ToGrowSocialProvider,
  clientId: string,
  redirectUri: string,
): Promise<{ url: string; attempt: SocialSignInAttempt }> {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const state = base64url(crypto.getRandomValues(new Uint8Array(16)))
  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge: base64url(new Uint8Array(digest)),
    state,
  })
  return {
    url: `/id/v1/auth/external/${provider}/spa-start?${query.toString()}`,
    attempt: { provider, verifier, state },
  }
}

export async function startSocialSignIn(provider: ToGrowSocialProvider): Promise<void> {
  if (!configuredSocialProviders().includes(provider)) {
    throw new Error('Social sign-in provider is not configured')
  }
  const prepared = await prepareSocialSignIn(
    provider,
    requiredRuntimeValue('VITE_TOGROW_CLIENT_ID'),
    `${window.location.origin}/auth/callback`,
  )
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(prepared.attempt))
  window.location.assign(prepared.url)
}

export type ValidatedSocialCallback =
  | { kind: 'exchange'; code: string; verifier: string }
  | { kind: 'error'; reason: string }

export function validateSocialCallback(
  search: string,
  attempt: SocialSignInAttempt,
): ValidatedSocialCallback {
  const params = new URLSearchParams(search)
  const error = params.get('error')
  if (error) return { kind: 'error', reason: error }
  const code = params.get('code')
  if (!code) return { kind: 'error', reason: 'missing_code' }
  if (params.get('state') !== attempt.state) return { kind: 'error', reason: 'state_mismatch' }
  return { kind: 'exchange', code, verifier: attempt.verifier }
}

function consumeAttempt(): SocialSignInAttempt | null {
  const raw = sessionStorage.getItem(ATTEMPT_KEY)
  sessionStorage.removeItem(ATTEMPT_KEY)
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<SocialSignInAttempt>
    if (!value.provider || !isSupportedProvider(value.provider)) return null
    if (typeof value.verifier !== 'string' || !value.verifier) return null
    if (typeof value.state !== 'string' || !value.state) return null
    return value as SocialSignInAttempt
  } catch {
    return null
  }
}

export async function completeSocialSignIn(
  search: string,
  baseUrl: string = import.meta.env.VITE_TOGROW_URL || '/id',
): Promise<{ kind: 'session'; session: ToGrowLoginSession } | { kind: 'error'; reason: string }> {
  const attempt = consumeAttempt()
  if (!attempt) return { kind: 'error', reason: 'missing_attempt' }
  const validated = validateSocialCallback(search, attempt)
  if (validated.kind === 'error') return validated

  try {
    const response = await fetch(`${baseUrl}/v1/auth/external/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: validated.code,
        code_verifier: validated.verifier,
      }),
    })
    if (!response.ok) return { kind: 'error', reason: 'exchange_failed' }
    return { kind: 'session', session: await response.json() as ToGrowLoginSession }
  } catch {
    return { kind: 'error', reason: 'exchange_failed' }
  }
}
