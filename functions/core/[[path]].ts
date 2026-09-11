import { proxyFirstPartyRequest } from '../../cloudflare/pagesProxy'
import { proxyPersonCoreRequest } from '../../cloudflare/personCoreProxy'
import type { AuthEnv } from '../../packages/hfe-person-auth/auth-bff'

interface Env extends AuthEnv {
  HFE_CORE_ORIGIN?: string
}

interface PagesContext {
  request: Request
  env: Env
  params: { path?: string[] }
}

function allowedCoreOrigins(request: Request): string[] {
  const hostname = new URL(request.url).hostname
  if (hostname === 'prv-pos.hfeit.app' || hostname === 'prv-pos.hfeit.com') {
    return ['https://prv-api.hfecore.com']
  }
  if (hostname === 'pos.hfeit.app' || hostname === 'pos.hfeit.com') {
    return ['https://api.hfecore.com']
  }
  return []
}

export function onRequest(context: PagesContext): Promise<Response> {
  if (context.params.path?.join('/') !== 'health') {
    return proxyPersonCoreRequest(context.request, context.env, context.params.path || [], allowedCoreOrigins(context.request))
  }
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return Promise.resolve(new Response(null, { status: 405 }))
  }
  return proxyFirstPartyRequest(
    new Request(context.request.url, { method: context.request.method }),
    context.env.HFE_CORE_ORIGIN,
    context.params.path || [],
    allowedCoreOrigins(context.request),
  )
}
