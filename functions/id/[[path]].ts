/** Legacy identity forwarding is retired; person login is owned by /auth. */
export function onRequest(): Response {
  return Response.json({ error: 'legacy_identity_route_retired' }, { status: 410, headers: { 'Cache-Control': 'no-store' } })
}
