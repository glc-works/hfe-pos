import { describe, expect, it, vi } from "vitest";
import { authenticateRequest, handleAuthRequest, type IdentityProvider } from "../../packages/hfe-person-auth/auth-bff";
import { sealData } from "iron-session";

const env = {
  AUTH_ORIGIN: "https://book.hfeit.com",
  WORKOS_CLIENT_ID: "client_fixture",
  WORKOS_API_KEY: "fixture-not-a-real-key",
  WORKOS_COOKIE_PASSWORD: "fixture-only-password-32-characters-long",
  WORKOS_ISSUER: "https://api.workos.com/",
};
const req = (path: string, init?: RequestInit) => new Request(`${env.AUTH_ORIGIN}${path}`, init);
const provider: IdentityProvider = {
  start: async () => ({ url: "https://api.workos.com/user_management/authorize?state=fixture-state", state: "fixture-state", verifier: "fixture-verifier" }),
  exchange: vi.fn(async () => ({ sealedSession: "sealed-provider-credential" })),
  authenticate: vi.fn(async () => null),
  refresh: vi.fn(async () => null),
  logoutUrl: async () => "https://api.workos.com/user_management/sessions/logout?session_id=fixture",
};

describe("application-owned auth boundary", () => {
  it("leaves non-auth application paths to the consumer router", async () => {
    expect(await handleAuthRequest(req("/auth/books"), env, provider)).toBeNull();
  });
  it("fails closed when server configuration is absent", async () => {
    const result = await handleAuthRequest(req("/auth/session"), {}, provider);
    expect(result?.status).toBe(503);
  });
  it("rejects callback code without its browser-bound transaction before exchange", async () => {
    const result = await handleAuthRequest(req("/auth/callback?code=one-use-code&state=fixture-state"), env, provider);
    expect(result?.status).toBe(400);
    expect(provider.exchange).not.toHaveBeenCalled();
  });
  it("never caches anonymous session responses", async () => {
    const result = await handleAuthRequest(req("/auth/session"), env, provider);
    expect(await result?.json()).toMatchObject({ authenticated: false });
    expect(result?.headers.get("cache-control")).toContain("no-store");
  });
  it("refuses cross-origin state-changing requests", async () => {
    const result = await handleAuthRequest(req("/auth/logout", { method: "POST", headers: { origin: "https://attacker.example" } }), env, provider);
    expect(result?.status).toBe(403);
  });
  it("does not implement logout as GET", async () => {
    expect((await handleAuthRequest(req("/auth/logout"), env, provider))?.status).toBe(405);
  });
  it("binds the transaction to one HTTPS host and never exposes its PKCE verifier", async () => {
    const result = await handleAuthRequest(req("/auth/login?next=https://attacker.example"), env, provider);
    expect(result?.status).toBe(302);
    const cookie = result?.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).not.toContain("Domain=");
    expect(cookie).not.toContain("fixture-verifier");
    expect(result?.headers.get("location")).not.toContain("attacker.example");
  });
  it("returns only presentation identity and CSRF after a verified callback and reload", async () => {
    const active: IdentityProvider = { ...provider, authenticate: async () => ({
      accessToken: "must-never-reach-browser", user: { displayName: "Person", email: "person@example.com", emailVerified: true },
    }) };
    const login = await handleAuthRequest(req("/auth/login?next=/auth/books"), env, active);
    const transaction = login!.headers.get("set-cookie")!.split(";")[0];
    const callback = await handleAuthRequest(req("/auth/callback?code=single-use&state=fixture-state", { headers: { cookie: transaction } }), env, active);
    expect(callback?.status).toBe(303);
    expect(callback?.headers.get("location")).toBe("/auth/books");
    const sessionCookie = callback!.headers.getSetCookie().find((c) => c.startsWith("__Host-hfe-person="))!.split(";")[0];
    const reloaded = await handleAuthRequest(req("/auth/session", { headers: { cookie: sessionCookie } }), env, active);
    const body = await reloaded!.json() as Record<string, unknown>;
    expect(body).toEqual({ authenticated: true, user: { displayName: "Person", email: "person@example.com", emailVerified: true }, csrfToken: expect.any(String) });
    expect(JSON.stringify(body)).not.toContain("must-never-reach-browser");
  });
  it("an expired access token supplies CSRF for deliberate renewal without exposing tokens", async () => {
    const sealed = await sealData({ sealedSession: "expired", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const result = await handleAuthRequest(req("/auth/session", { headers: { cookie: `__Host-hfe-person=${sealed}` } }), env, provider);
    expect(result?.status).toBe(401);
    expect(await result!.json()).toEqual({ authenticated: false, code: "session_expired", csrfToken: "a".repeat(32) });
  });
  it("never supplies a server bearer to a cross-origin business mutation", async () => {
    const saved = await sealData({ sealedSession: "saved", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const active: IdentityProvider = { ...provider, authenticate: async () => ({ accessToken: "secret", user: { displayName: null, email: "a@example.com", emailVerified: true } }) };
    expect(await authenticateRequest(req("/books/v1/company-books", { method: "POST", headers: { cookie: `__Host-hfe-person=${saved}`, origin: "https://attacker.example" } }), env, active)).toBeNull();
  });
  it("local logout clears only the application cookies and does not visit the provider", async () => {
    const saved = await sealData({ sealedSession: "saved", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const logoutUrl = vi.fn(provider.logoutUrl);
    const result = await handleAuthRequest(req("/auth/logout", { method: "POST", headers: { cookie: `__Host-hfe-person=${saved}`, origin: env.AUTH_ORIGIN, "x-csrf-token": "a".repeat(32), "content-type": "application/json" }, body: JSON.stringify({ scope: "local" }) }), env, { ...provider, logoutUrl });
    expect(await result!.json()).toEqual({ redirectTo: "/auth" });
    expect(result!.headers.getSetCookie().every((c) => c.includes("Max-Age=0"))).toBe(true);
    expect(logoutUrl).not.toHaveBeenCalled();
  });
  it("provider logout returns only the current provider session URL", async () => {
    const saved = await sealData({ sealedSession: "saved", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const logoutUrl = vi.fn(provider.logoutUrl);
    const result = await handleAuthRequest(req("/auth/logout", { method: "POST", headers: { cookie: `__Host-hfe-person=${saved}`, origin: env.AUTH_ORIGIN, "x-csrf-token": "a".repeat(32), "content-type": "application/json" }, body: JSON.stringify({ scope: "provider" }) }), env, { ...provider, logoutUrl, authenticate: async () => ({ accessToken: "private", user: { displayName: null, email: "person@example.com", emailVerified: true } }) });
    expect(result?.status).toBe(200);
    expect(await result!.json()).toEqual({ redirectTo: "https://api.workos.com/user_management/sessions/logout?session_id=fixture" });
    expect(logoutUrl).toHaveBeenCalledWith("saved", "https://book.hfeit.com/auth");
  });
  it("renews expired access for current-provider logout and clears local cookies even when renewal fails", async () => {
    const saved = await sealData({ sealedSession: "expired", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const request = () => req("/auth/logout", { method: "POST", headers: { cookie: `__Host-hfe-person=${saved}`, origin: env.AUTH_ORIGIN, "x-csrf-token": "a".repeat(32), "content-type": "application/json" }, body: JSON.stringify({ scope: "provider" }) });
    const logoutUrl = vi.fn(provider.logoutUrl);
    const rotating: IdentityProvider = { ...provider, logoutUrl,
      authenticate: async (value) => value === "renewed" ? { accessToken: "private", user: { displayName: null, email: "a@example.com", emailVerified: true } } : null,
      refresh: async () => ({ sealedSession: "renewed" }),
    };
    const result = await handleAuthRequest(request(), env, rotating);
    expect(result?.status).toBe(200);
    expect(logoutUrl).toHaveBeenCalledWith("renewed", "https://book.hfeit.com/auth");
    for (const refresh of [async () => null, async () => { throw new Error("provider offline"); }]) {
      const failed = await handleAuthRequest(request(), env, { ...rotating, refresh });
      expect(failed?.status).toBe(503);
      expect(await failed!.json()).toEqual({ code: "provider_logout_unavailable", localSessionEnded: true });
      expect(failed!.headers.getSetCookie()).toHaveLength(2);
      expect(failed!.headers.getSetCookie().every((value) => value.includes("Max-Age=0"))).toBe(true);
    }
  });
  it("renews expired credentials server-side and returns a rotated cookie, never a token", async () => {
    const saved = await sealData({ sealedSession: "expired", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const rotating: IdentityProvider = { ...provider,
      authenticate: async (value) => value === "renewed" ? { accessToken: "private-new-access", user: { displayName: null, email: "a@example.com", emailVerified: true } } : null,
      refresh: async () => ({ sealedSession: "renewed" }),
    };
    const result = await handleAuthRequest(req("/auth/refresh", { method: "POST", headers: { cookie: `__Host-hfe-person=${saved}`, origin: env.AUTH_ORIGIN, "x-csrf-token": "a".repeat(32) } }), env, rotating);
    expect(result?.status).toBe(200);
    expect(result!.headers.get("set-cookie")).toContain("HttpOnly");
    expect(await result!.json()).toEqual({ authenticated: true, user: { displayName: null, email: "a@example.com", emailVerified: true }, csrfToken: "a".repeat(32) });
  });
  it("never refreshes on missing CSRF or a duplicate session cookie", async () => {
    const saved = await sealData({ sealedSession: "expired", csrf: "a".repeat(32), expiresAt: Date.now() + 60000, origin: env.AUTH_ORIGIN }, { password: env.WORKOS_COOKIE_PASSWORD, ttl: 28800 });
    const refresh = vi.fn(provider.refresh);
    for (const cookies of [`__Host-hfe-person=${saved}`, `__Host-hfe-person=${saved}; __Host-hfe-person=${saved}`]) {
      expect((await handleAuthRequest(req("/auth/refresh", { method: "POST", headers: { cookie: cookies, origin: env.AUTH_ORIGIN } }), env, { ...provider, refresh }))?.status).toBe(403);
    }
    expect(refresh).not.toHaveBeenCalled();
  });
});
