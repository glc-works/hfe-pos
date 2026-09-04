import { sealData, unsealData } from "iron-session";
import { createWorkosProvider } from "./workos-provider";

export interface AuthEnv {
  AUTH_ORIGIN?: string;
  WORKOS_CLIENT_ID?: string;
  WORKOS_API_KEY?: string;
  WORKOS_COOKIE_PASSWORD?: string;
  WORKOS_ISSUER?: string;
}
export interface ProviderSession {
  user: { displayName: string | null; email: string; emailVerified: boolean };
  accessToken: string;
}
export interface IdentityProvider {
  start(): Promise<{ url: string; state: string; verifier: string }>;
  exchange(code: string, verifier: string): Promise<{ sealedSession: string }>;
  authenticate(sealedSession: string): Promise<ProviderSession | null>;
  refresh(sealedSession: string): Promise<{ sealedSession: string } | null>;
  logoutUrl(sealedSession: string, returnTo: string): Promise<string>;
}
const SESSION = "__Host-hfe-person";
const TRANSACTION = "__Host-hfe-login";
const TTL = 8 * 60 * 60;
interface SessionEnvelope { sealedSession: string; csrf: string; expiresAt: number; origin: string }
interface Transaction { state: string; verifier: string; next: string; origin: string }
const ownedRoutes = ["/auth/login", "/auth/callback", "/auth/session", "/auth/refresh", "/auth/logout"];

function headers(): Headers {
  return new Headers({ "cache-control": "private, no-store", "cdn-cache-control": "no-store",
    "cloudflare-cdn-cache-control": "no-store", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" });
}
function json(value: unknown, status = 200, responseHeaders = headers()): Response {
  return Response.json(value, { status, headers: responseHeaders });
}
function cookie(name: string, value: string, seconds: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`;
}
function readCookie(request: Request, name: string): string {
  const matches = (request.headers.get("cookie") ?? "").split(";").map((part) => part.trim()).filter((part) => part.startsWith(`${name}=`));
  return matches.length === 1 ? matches[0].slice(name.length + 1) : "";
}
export function configured(env: AuthEnv): boolean {
  try {
    const origin = new URL(env.AUTH_ORIGIN ?? "");
    const issuer = new URL(env.WORKOS_ISSUER ?? "");
    return origin.protocol === "https:" && origin.origin === env.AUTH_ORIGIN && !origin.username
      && issuer.protocol === "https:" && !issuer.username && !issuer.password && !issuer.search && !issuer.hash
      && Boolean(env.WORKOS_CLIENT_ID?.startsWith("client_") && env.WORKOS_API_KEY && (env.WORKOS_COOKIE_PASSWORD?.length ?? 0) >= 32);
  } catch { return false; }
}
async function envelope(request: Request, env: AuthEnv): Promise<SessionEnvelope | null> {
  const value = readCookie(request, SESSION);
  if (!value) return null;
  try {
    const parsed = await unsealData<SessionEnvelope>(value, { password: env.WORKOS_COOKIE_PASSWORD!, ttl: TTL });
    return typeof parsed.sealedSession === "string" && typeof parsed.csrf === "string"
      && parsed.csrf.length >= 32 && parsed.origin === env.AUTH_ORIGIN && parsed.expiresAt > Date.now() ? parsed : null;
  } catch { return null; }
}
async function setSession(responseHeaders: Headers, session: SessionEnvelope, env: AuthEnv): Promise<void> {
  const value = await sealData(session, { password: env.WORKOS_COOKIE_PASSWORD!, ttl: TTL });
  // Browser cookie limits must fail closed, not produce an apparently successful login.
  if (value.length > 3800) throw new Error("session_cookie_too_large");
  responseHeaders.append("set-cookie", cookie(SESSION, value, Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000))));
}
function safeNext(value: string | null): string {
  // Consumer landing is fixed; no open redirects or server/API replay destinations.
  return value === "/auth/books" ? value : "/auth";
}
function sameOrigin(request: Request, env: AuthEnv): boolean {
  return request.headers.get("origin") === env.AUTH_ORIGIN
    && !["cross-site", "same-site"].includes(request.headers.get("sec-fetch-site") ?? "");
}
export async function authenticateRequest(request: Request, env: AuthEnv, provider?: IdentityProvider): Promise<ProviderSession | null> {
  if (!configured(env) || new URL(request.url).origin !== env.AUTH_ORIGIN) return null;
  const saved = await envelope(request, env);
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)
    && (!sameOrigin(request, env) || !saved || request.headers.get("x-csrf-token") !== saved.csrf)) return null;
  return saved ? (provider ?? createWorkosProvider(env)).authenticate(saved.sealedSession) : null;
}
export async function handleAuthRequest(request: Request, env: AuthEnv, provider?: IdentityProvider): Promise<Response | null> {
  const url = new URL(request.url);
  if (!ownedRoutes.includes(url.pathname)) return null;
  if (!configured(env)) return json({ code: "auth_not_configured" }, 503);
  if (url.origin !== env.AUTH_ORIGIN) return json({ code: "auth_origin_mismatch" }, 403);
  const post = url.pathname === "/auth/refresh" || url.pathname === "/auth/logout";
  if (request.method !== (post ? "POST" : "GET")) return json({ code: "method_not_allowed" }, 405);
  if (post && !sameOrigin(request, env)) return json({ code: "csrf_rejected" }, 403);
  const identity = provider ?? createWorkosProvider(env);
  const responseHeaders = headers();
  try {
    if (url.pathname === "/auth/login") {
      const started = await identity.start();
      const transaction = await sealData({ state: started.state, verifier: started.verifier,
        next: safeNext(url.searchParams.get("next")), origin: env.AUTH_ORIGIN! }, { password: env.WORKOS_COOKIE_PASSWORD!, ttl: 600 });
      responseHeaders.append("set-cookie", cookie(TRANSACTION, transaction, 600));
      responseHeaders.set("location", started.url);
      return new Response(null, { status: 302, headers: responseHeaders });
    }
    if (url.pathname === "/auth/callback") {
      responseHeaders.append("set-cookie", cookie(TRANSACTION, "", 0));
      const transaction = await unsealData<Transaction>(readCookie(request, TRANSACTION), { password: env.WORKOS_COOKIE_PASSWORD!, ttl: 600 });
      const code = url.searchParams.get("code");
      if (!code || url.searchParams.getAll("code").length !== 1 || url.searchParams.getAll("state").length !== 1
        || !transaction.state || transaction.state !== url.searchParams.get("state") || !transaction.verifier
        || transaction.origin !== env.AUTH_ORIGIN || url.searchParams.has("error")) return json({ code: "invalid_login_transaction" }, 400, responseHeaders);
      const result = await identity.exchange(code, transaction.verifier);
      if (!await identity.authenticate(result.sealedSession)) return json({ code: "invalid_provider_session" }, 401, responseHeaders);
      await setSession(responseHeaders, { sealedSession: result.sealedSession, csrf: crypto.randomUUID(),
        expiresAt: Date.now() + TTL * 1000, origin: env.AUTH_ORIGIN! }, env);
      responseHeaders.set("location", safeNext(transaction.next));
      return new Response(null, { status: 303, headers: responseHeaders });
    }
    const saved = await envelope(request, env);
    if (post && (!saved || request.headers.get("x-csrf-token") !== saved.csrf)) return json({ code: "csrf_rejected" }, 403);
    if (url.pathname === "/auth/logout") {
      const input = await request.json() as { scope?: unknown };
      if (input.scope !== "local" && input.scope !== "provider") return json({ code: "invalid_logout_scope" }, 400);
      responseHeaders.append("set-cookie", cookie(SESSION, "", 0));
      responseHeaders.append("set-cookie", cookie(TRANSACTION, "", 0));
      let redirectTo = "/auth";
      if (input.scope === "provider") {
        // Provider scope ends the current provider session only, not all devices.
        // Local termination must not depend on provider reachability or token age.
        try {
          let sealedSession = saved!.sealedSession;
          if (!await identity.authenticate(sealedSession)) {
            const renewed = await identity.refresh(sealedSession);
            if (!renewed || !await identity.authenticate(renewed.sealedSession)) throw new Error("provider_session_unavailable");
            sealedSession = renewed.sealedSession;
          }
          redirectTo = await identity.logoutUrl(sealedSession, `${env.AUTH_ORIGIN}/auth`);
        } catch {
          return json({ code: "provider_logout_unavailable", localSessionEnded: true }, 503, responseHeaders);
        }
      }
      return json({ redirectTo }, 200, responseHeaders);
    }
    if (!saved) return json({ authenticated: false }, 200, responseHeaders);
    let verified = await identity.authenticate(saved.sealedSession);
    if (url.pathname === "/auth/refresh" && !verified) {
      const renewed = await identity.refresh(saved.sealedSession);
      if (renewed) {
        saved.sealedSession = renewed.sealedSession;
        verified = await identity.authenticate(saved.sealedSession);
        if (verified) await setSession(responseHeaders, saved, env);
      }
    }
    if (!verified) return json({ authenticated: false, code: "session_expired", csrfToken: saved.csrf }, 401, responseHeaders);
    return json({ authenticated: true, user: verified.user, csrfToken: saved.csrf }, 200, responseHeaders);
  } catch {
    return json({ code: "auth_unavailable" }, 503, responseHeaders);
  }
}
