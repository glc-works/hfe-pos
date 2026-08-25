function unavailable(): Response {
  return Response.json(
    { error: 'first_party_upstream_unavailable' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function proxyFirstPartyRequest(
  request: Request,
  configuredOrigin: string | undefined,
  path: string[],
  allowedOrigins: readonly string[],
): Promise<Response> {
  if (!configuredOrigin || !allowedOrigins.includes(configuredOrigin)) return unavailable()

  let origin: URL
  switch (configuredOrigin) {
    case 'https://account.togrow.id':
      origin = new URL('https://account.togrow.id')
      break
    case 'https://prv-core.hfeit.com':
      origin = new URL('https://prv-core.hfeit.com')
      break
    case 'https://core.hfeit.com':
      origin = new URL('https://core.hfeit.com')
      break
    default:
      return unavailable()
  }

  const incoming = new URL(request.url)
  const upstream = new URL(`/${path.map(encodeURIComponent).join('/')}`, origin)
  upstream.search = incoming.search

  try {
    const upstreamRequest = new Request(upstream, request)
    // nosemgrep: AIK_js_ssrf -- the switch above resolves only three exact, HTTPS origins and redirects stay disabled.
    return await fetch(new Request(upstreamRequest, { redirect: 'manual' }))
  } catch {
    return unavailable()
  }
}
