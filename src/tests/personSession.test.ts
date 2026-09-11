import { afterEach, describe, expect, it, vi } from 'vitest'
import { readPersonSession, logoutPersonSession } from '../services/auth/personSession'
import { ownerLogin, ownerRegister, exchangeToGrowSession, renewFirstPartyAuth } from '../services/hfeAuthApi'

describe('person login transport', () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })

  it('retires connected password, registration, token exchange and browser refresh entrypoints', async () => {
    vi.stubEnv('VITE_HFE_RUNTIME_MODE', 'connected')
    const fetcher = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network should not run'))
    for (const operation of [
      () => ownerLogin('owner@example.test', 'not-a-password'),
      () => ownerRegister('Shop', 'owner@example.test', 'not-a-password'),
      () => exchangeToGrowSession('old-session'),
      () => renewFirstPartyAuth({ accessToken: 'old', refreshToken: 'old', accessExpiresAt: '', refreshExpiresAt: '', hcbExpiresAt: 0 }),
    ]) await expect(operation()).rejects.toThrow('hosted_person_login_required')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('does not promote a provider profile into a staff role or Core principal', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({
      authenticated: true,
      user: { displayName: 'Owner', email: 'owner@example.test', emailVerified: true },
      csrfToken: 'csrf-fixture',
      accessToken: 'must-not-escape',
      role: 'owner',
    }))
    expect(await readPersonSession()).toEqual({
      authenticated: true,
      user: { displayName: 'Owner', email: 'owner@example.test', emailVerified: true },
      csrfToken: 'csrf-fixture',
    })
  })

  it('refuses a failed session request rather than restoring browser credentials', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }))
    await expect(readPersonSession()).rejects.toThrow()
  })

  it('renews once on an explicit expired-session challenge, using server-held credentials', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ authenticated: false, code: 'session_expired', csrfToken: 'csrf-fixture' }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ authenticated: true, user: { displayName: null, email: 'owner@example.test', emailVerified: true }, csrfToken: 'csrf-next' }))
    expect((await readPersonSession()).authenticated).toBe(true)
    expect(fetcher).toHaveBeenLastCalledWith('/auth/refresh', expect.objectContaining({ method: 'POST', headers: expect.objectContaining({ 'X-CSRF-Token': 'csrf-fixture' }) }))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('does not loop when renewal is refused', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ authenticated: false, code: 'session_expired', csrfToken: 'csrf-fixture' }, { status: 401 }))
    await expect(readPersonSession()).rejects.toThrow()
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('waits for an in-flight session read before local logout', async () => {
    let release!: (response: Response) => void
    const fetcher = vi.spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => new Promise<Response>(resolve => { release = resolve }))
      .mockResolvedValueOnce(Response.json({ redirectTo: '/auth' }))
    const read = readPersonSession()
    const logout = logoutPersonSession('csrf-fixture')
    await Promise.resolve()
    const requestsBeforeReadCompletes = fetcher.mock.calls.length
    release(Response.json({ authenticated: false }))
    await Promise.all([read, logout])
    expect(requestsBeforeReadCompletes).toBe(1)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('does not follow an arbitrary logout redirect from the session endpoint', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ redirectTo: 'https://attacker.example' }))
    await expect(logoutPersonSession('csrf-fixture')).rejects.toThrow()
  })
})
