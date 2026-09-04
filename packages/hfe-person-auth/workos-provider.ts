import { WorkOS } from "@workos-inc/node";
import type { AuthEnv, IdentityProvider } from "./auth-bff";

export function createWorkosProvider(env: AuthEnv): IdentityProvider {
  const workos = new WorkOS(env.WORKOS_API_KEY!, { clientId: env.WORKOS_CLIENT_ID! });
  const load = (sealedSession: string) => workos.userManagement.loadSealedSession({ sessionData: sealedSession, cookiePassword: env.WORKOS_COOKIE_PASSWORD! });
  return {
    async start() {
      const result = await workos.userManagement.getAuthorizationUrlWithPKCE({
        provider: "authkit", redirectUri: `${env.AUTH_ORIGIN}/auth/callback`, clientId: env.WORKOS_CLIENT_ID!,
      });
      return { url: result.url, state: result.state, verifier: result.codeVerifier };
    },
    async exchange(code, verifier) {
      const result = await workos.userManagement.authenticateWithCode({ code, codeVerifier: verifier,
        clientId: env.WORKOS_CLIENT_ID!, session: { sealSession: true, cookiePassword: env.WORKOS_COOKIE_PASSWORD! } });
      if (!result.sealedSession) throw new Error("missing_sealed_session");
      return { sealedSession: result.sealedSession };
    },
    async authenticate(sealedSession) {
      const result = await load(sealedSession).authenticate();
      if (!result.authenticated) return null;
      // SDK verifies signature and expiry. Bind the verified token to this deployment
      // as well; an environment signing key can otherwise serve several applications.
      const encoded = result.accessToken.split(".")[1];
      const claims = JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
      if (claims.iss !== env.WORKOS_ISSUER || claims.client_id !== env.WORKOS_CLIENT_ID
        || claims.sub !== result.user.id || typeof claims.sid !== "string" || !claims.sid
        || typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now()) return null;
      return { accessToken: result.accessToken, user: {
        displayName: [result.user.firstName, result.user.lastName].filter(Boolean).join(" ") || null,
        email: result.user.email, emailVerified: result.user.emailVerified,
      } };
    },
    async refresh(sealedSession) {
      const result = await load(sealedSession).refresh();
      return result.authenticated && result.sealedSession ? { sealedSession: result.sealedSession } : null;
    },
    logoutUrl: (sealedSession, returnTo) => load(sealedSession).getLogoutUrl({ returnTo }),
  };
}
