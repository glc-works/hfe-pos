import { proxyFirstPartyRequest } from '../../cloudflare/pagesProxy'

interface Env {
  TOGROW_ORIGIN?: string
}

interface PagesContext {
  request: Request
  env: Env
  params: { path?: string[] }
}

export function onRequest(context: PagesContext): Promise<Response> {
  return proxyFirstPartyRequest(
    context.request,
    context.env.TOGROW_ORIGIN,
    context.params.path || [],
    ['https://account.togrow.id'],
  )
}
