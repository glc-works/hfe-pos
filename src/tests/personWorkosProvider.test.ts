import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createWorkosProvider } from "../../packages/hfe-person-auth/workos-provider";
import { handleAuthRequest } from "../../packages/hfe-person-auth/auth-bff";

const config = { AUTH_ORIGIN: "https://book.hfeit.com", WORKOS_CLIENT_ID: "client_fixture", WORKOS_ISSUER: "https://api.workos.com/", WORKOS_API_KEY: "fixture-only", WORKOS_COOKIE_PASSWORD: "fixture-only-password-32-characters-long" };
const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const jsonPart = (value: unknown) => encode(new TextEncoder().encode(JSON.stringify(value)));
const keys = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
const jwk = await crypto.subtle.exportKey("jwk", keys.publicKey);
const outbound = vi.spyOn(globalThis, "fetch");
beforeEach(() => { outbound.mockReset(); });
afterEach(() => { outbound.mockReset(); });

async function providerWithClaims(overrides: Record<string, unknown> = {}) {
  const claims = { iss: config.WORKOS_ISSUER, client_id: config.WORKOS_CLIENT_ID, sub: "user_fixture", sid: "session_fixture", exp: Math.floor(Date.now() / 1000) + 300, ...overrides };
  const unsigned = `${jsonPart({ alg: "RS256", kid: "fixture-key" })}.${jsonPart(claims)}`;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keys.privateKey, new TextEncoder().encode(unsigned));
  const accessToken = `${unsigned}.${encode(new Uint8Array(signature))}`;
  outbound.mockImplementation(async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith("/sso/jwks/client_fixture")) return Response.json({ keys: [{ ...jwk, kid: "fixture-key", alg: "RS256", use: "sig" }] });
    if (url.endsWith("/user_management/authenticate")) return Response.json({ access_token: accessToken, refresh_token: "fixture-refresh", user: {
      object: "user", id: "user_fixture", email: "person@example.com", email_verified: true, first_name: "First", last_name: "Person", profile_picture_url: null,
      last_sign_in_at: null, locale: null, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", metadata: {}, external_id: null,
    } });
    throw new Error(`unexpected fixture request ${url}`);
  });
  const provider = createWorkosProvider(config);
  const result = await provider.exchange("fixture-code", "fixture-verifier");
  return { provider, sealedSession: result.sealedSession, accessToken };
}

describe("WorkOS adapter with real SDK sealing and signed JWT validation", () => {
  it("accepts only a verified matching application identity and excludes roles from its projection", async () => {
    const { provider, sealedSession, accessToken } = await providerWithClaims({ role: "admin", org_id: "org_provider" });
    expect(await provider.authenticate(sealedSession)).toEqual({ accessToken, user: { displayName: "First Person", email: "person@example.com", emailVerified: true } });
  });
  it.each([{ iss: "https://wrong.example" }, { client_id: "another-client" }, { sub: "another-user" }, { sid: "" }, { exp: 1 }])("refuses valid signatures with wrong binding or expiry %j", async (claims) => {
    const { provider, sealedSession } = await providerWithClaims(claims);
    expect(await provider.authenticate(sealedSession)).toBeNull();
  });
  it("refuses a modified sealed cookie", async () => {
    const { provider, sealedSession } = await providerWithClaims();
    expect(await provider.authenticate(sealedSession.slice(0, 60) + "X" + sealedSession.slice(61))).toBeNull();
  });
  it("completes a real SDK PKCE callback and fits the protected application cookie", async () => {
    const { provider } = await providerWithClaims();
    const login = await handleAuthRequest(new Request(`${config.AUTH_ORIGIN}/auth/login`), config, provider);
    const url = new URL(login!.headers.get("location")!);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    const transaction = login!.headers.get("set-cookie")!.split(";")[0];
    const callback = await handleAuthRequest(new Request(`${config.AUTH_ORIGIN}/auth/callback?code=fixture&state=${url.searchParams.get("state")}`, { headers: { cookie: transaction } }), config, provider);
    expect(callback?.status).toBe(303);
    const cookie = callback!.headers.getSetCookie().find((c) => c.startsWith("__Host-hfe-person="))!;
    expect(cookie.length).toBeLessThan(4096);
    const session = await handleAuthRequest(new Request(`${config.AUTH_ORIGIN}/auth/session`, { headers: { cookie: cookie.split(";")[0] } }), config, provider);
    expect(await session!.json()).toMatchObject({ authenticated: true, user: { email: "person@example.com" } });
  });
});
