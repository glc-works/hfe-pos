import { authenticateRequest, type AuthEnv, type IdentityProvider } from '../packages/hfe-person-auth/auth-bff'

export async function proxyPersonCoreRequest(request: Request, env: AuthEnv & { HFE_CORE_ORIGIN?: string }, path: string[], allowed: readonly string[], provider?: IdentityProvider): Promise<Response> {
  const refuse = (status: number) => Response.json({ error: status === 401 ? 'person_login_required' : 'core_unavailable' }, { status, headers: { 'Cache-Control': 'private, no-store' } })
  if (request.headers.has('authorization')) return refuse(401)
  try {
    const session = await authenticateRequest(request, env, provider)
    if (!session) return refuse(401)
    if (!env.HFE_CORE_ORIGIN || !allowed.includes(env.HFE_CORE_ORIGIN) || path[0] !== 'v1' || path.some(part => part === '.' || part === '..')) return refuse(503)
    const upstream = new URL(`/${path.map(encodeURIComponent).join('/')}`, env.HFE_CORE_ORIGIN)
    upstream.search = new URL(request.url).search
    const headers = new Headers({ Authorization: `Bearer ${session.accessToken}` })
    for (const name of ['accept', 'content-type', 'x-cbook-authority-context', 'x-idempotency-key', 'idempotency-key', 'if-match']) {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    }
    const response = await fetch(upstream, { method: request.method, headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body, redirect: 'manual' })
    if (response.status >= 300 && response.status < 400) return refuse(502)
    const output = new Headers({ 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    for (const name of ['content-type', 'retry-after', 'etag', 'x-request-id']) {
      const value = response.headers.get(name)
      if (value) output.set(name, value)
    }
    return new Response(response.body, { status: response.status, headers: output })
  } catch { return refuse(503) }
}
