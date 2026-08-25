import { proxyFirstPartyRequest } from '../../cloudflare/pagesProxy'

interface Env {
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
    return ['https://prv-core.hfeit.com']
  }
  if (hostname === 'pos.hfeit.app' || hostname === 'pos.hfeit.com') {
    return ['https://core.hfeit.com']
  }
  return []
}

export function onRequest(context: PagesContext): Promise<Response> {
  return proxyFirstPartyRequest(
    context.request,
    context.env.HFE_CORE_ORIGIN,
    context.params.path || [],
    allowedCoreOrigins(context.request),
  )
}
