import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  completeSocialSignIn,
  configuredSocialProviders,
  prepareSocialSignIn,
  validateSocialCallback,
} from '../services/toGrowSocialSignIn'

const SOCIAL_ATTEMPT_STORAGE_KEY = 'hfe_pos_togrow_social_attempt'

const SOCIAL_SESSION = {
  access_token: 'opaque-access-session',
  refresh_token: 'opaque-refresh-session',
  access_expires_at: '2026-08-25T12:00:00Z',
  refresh_expires_at: '2026-09-01T12:00:00Z',
}

function installSessionStorage() {
  const values = new Map<string, string>()
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  })
  return values
}

describe('ToGrow social sign-in bridge', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows only explicitly provisioned Google and Apple providers in connected mode', () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    vi.stubEnv('VITE_TOGROW_SOCIAL_PROVIDERS', 'google,unknown,apple,google')

    expect(configuredSocialProviders()).toEqual(['google', 'apple'])

    vi.stubEnv('VITE_HFE_RUNTIME_MODE', '')
    expect(configuredSocialProviders()).toEqual([])
  })

  it('builds a PKCE start URL owned by ToGrow without putting a bearer in the URL', async () => {
    const prepared = await prepareSocialSignIn(
      'google',
      'client-demo-1',
      'https://prv-pos.hfeit.app/auth/callback',
    )

    const url = new URL(prepared.url, 'https://prv-pos.hfeit.app')
    expect(url.pathname).toBe('/id/v1/auth/external/google/spa-start')
    expect(url.searchParams.get('client_id')).toBe('client-demo-1')
    expect(url.searchParams.get('redirect_uri')).toBe('https://prv-pos.hfeit.app/auth/callback')
    expect(url.searchParams.get('code_challenge')).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(url.searchParams.get('state')).toBe(prepared.attempt.state)
    expect(prepared.attempt.verifier).toMatch(/^[A-Za-z0-9_-]{64}$/)
    expect(prepared.url).not.toContain('token')
    expect(prepared.url).not.toContain(prepared.attempt.verifier)
  })

  it('rejects callback errors, missing codes, and state mismatch before exchange', () => {
    const attempt = { provider: 'apple' as const, verifier: 'verifier', state: 'expected' }

    expect(validateSocialCallback('?error=unknown_provider&state=expected', attempt)).toEqual({
      kind: 'error',
      reason: 'unknown_provider',
    })
    expect(validateSocialCallback('?state=expected', attempt)).toEqual({
      kind: 'error',
      reason: 'missing_code',
    })
    expect(validateSocialCallback('?code=once&state=wrong', attempt)).toEqual({
      kind: 'error',
      reason: 'state_mismatch',
    })
    expect(validateSocialCallback('?code=once&state=expected', attempt)).toEqual({
      kind: 'exchange',
      code: 'once',
      verifier: 'verifier',
    })
  })

  it('consumes one attempt, sends the exact PKCE verifier, and rejects callback replay', async () => {
    const storage = installSessionStorage()
    storage.set(SOCIAL_ATTEMPT_STORAGE_KEY, JSON.stringify({
      provider: 'google',
      verifier: 'stored-verifier',
      state: 'expected-state',
    }))
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      JSON.stringify(SOCIAL_SESSION),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ))

    await expect(completeSocialSignIn(
      '?code=one-time-code&state=expected-state',
      '/id',
    )).resolves.toEqual({ kind: 'session', session: SOCIAL_SESSION })
    expect(storage.has(SOCIAL_ATTEMPT_STORAGE_KEY)).toBe(false)
    expect(fetchSpy).toHaveBeenCalledWith('/id/v1/auth/external/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'one-time-code', code_verifier: 'stored-verifier' }),
    })

    await expect(completeSocialSignIn(
      '?code=one-time-code&state=expected-state',
      '/id',
    )).resolves.toEqual({ kind: 'error', reason: 'missing_attempt' })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('consumes a mismatched-state attempt without contacting ToGrow', async () => {
    const storage = installSessionStorage()
    storage.set(SOCIAL_ATTEMPT_STORAGE_KEY, JSON.stringify({
      provider: 'apple',
      verifier: 'stored-verifier',
      state: 'expected-state',
    }))
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await expect(completeSocialSignIn(
      '?code=one-time-code&state=wrong-state',
      '/id',
    )).resolves.toEqual({ kind: 'error', reason: 'state_mismatch' })
    expect(storage.has(SOCIAL_ATTEMPT_STORAGE_KEY)).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
