import { afterEach, expect, it, vi } from 'vitest'
import { proxyPersonCoreRequest } from '../../cloudflare/personCoreProxy'
import { sealData } from 'iron-session'
import type { IdentityProvider } from '../../packages/hfe-person-auth/auth-bff'

afterEach(() => vi.restoreAllMocks())
it('rejects browser-supplied bearer credentials before contacting Core', async () => {
  const fetcher = vi.spyOn(globalThis, 'fetch')
  const response = await proxyPersonCoreRequest(new Request('https://pos.hfeit.app/core/v1/company-books', { headers: { authorization: 'Bearer injected' } }), {}, ['v1', 'company-books'], ['https://api.hfecore.com'])
  expect(response.status).toBe(401)
  expect(fetcher).not.toHaveBeenCalled()
})
it('does not forward an unauthenticated cookie as authority', async () => {
  const fetcher = vi.spyOn(globalThis, 'fetch')
  const response = await proxyPersonCoreRequest(new Request('https://pos.hfeit.app/core/v1/company-books'), { HFE_CORE_ORIGIN: 'https://api.hfecore.com' }, ['v1', 'company-books'], ['https://api.hfecore.com'])
  expect(response.status).toBe(401)
  expect(fetcher).not.toHaveBeenCalled()
})

it('uses only server-held bearer and excludes app cookies from Core requests and responses', async () => {
  const env = { AUTH_ORIGIN: 'https://pos.hfeit.app', WORKOS_CLIENT_ID: 'client_fixture', WORKOS_API_KEY: 'fixture', WORKOS_COOKIE_PASSWORD: 'fixture-only-password-longer-than-32-characters', WORKOS_ISSUER: 'https://api.workos.com/', HFE_CORE_ORIGIN: 'https://api.hfecore.com' }
  const sealed = await sealData({ sealedSession: 'saved', csrf: 'a'.repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 })
  const provider: IdentityProvider = {
    authenticate: async () => ({ accessToken: 'server-only', user: { displayName: null, email: 'owner@example.test', emailVerified: true } }),
    start: async () => { throw new Error('unexpected login') },
    exchange: async () => { throw new Error('unexpected exchange') },
    refresh: async () => { throw new Error('unexpected refresh') },
    logoutUrl: async () => { throw new Error('unexpected logout') },
  }
  const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"company_books":[]}', { headers: { 'set-cookie': 'upstream=secret', 'access-control-allow-origin': '*', 'cache-control': 'public' } }))
  const response = await proxyPersonCoreRequest(new Request('https://pos.hfeit.app/core/v1/company-books?limit=5', { headers: { cookie: `__Host-hfe-person=${sealed}; unrelated=secret` } }), env, ['v1', 'company-books'], ['https://api.hfecore.com'], provider)
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ company_books: [] })
  const [url, init] = fetcher.mock.calls[0]
  expect(String(url)).toBe('https://api.hfecore.com/v1/company-books?limit=5')
  expect(new Headers(init?.headers).get('authorization')).toBe('Bearer server-only')
  expect(new Headers(init?.headers).has('cookie')).toBe(false)
  expect(init?.redirect).toBe('manual')
  expect(response.headers.has('set-cookie')).toBe(false)
  expect(response.headers.has('access-control-allow-origin')).toBe(false)
  expect(response.headers.get('cache-control')).toContain('no-store')
})
