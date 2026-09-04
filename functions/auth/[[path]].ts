import { handleAuthRequest, type AuthEnv } from '../../packages/hfe-person-auth/auth-bff'

export async function onRequest(context: { request: Request; env: AuthEnv; next: () => Promise<Response> }): Promise<Response> {
  return await handleAuthRequest(context.request, context.env) ?? context.next()
}
