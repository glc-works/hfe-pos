# 115 — Provider-neutral person login

Authority: [POS #115](https://github.com/glc-works/hfe-pos/issues/115) and
[Product #150](https://github.com/glc-works/hfeit-product/issues/150).

## Contract

The connected owner entry uses `/auth/login` and a server callback. The browser
receives only presentation identity and CSRF through `/auth/session`. WorkOS
access/refresh credentials remain in a sealed, Secure, HttpOnly, host-only cookie;
the provider implementation is isolated in `packages/hfe-person-auth`.

`GET /auth/session` may return an explicit expired-session challenge. The client
renews once with CSRF via `POST /auth/refresh` when loading/focusing the app;
there is no polling timer or automatic replay of business mutations.

`POST /auth/logout` with `scope=local` clears the application session. Provider
scope ends only the current provider session, not every device. The POS UI uses
local logout. The old `/id/*` forwarding route returns 410.

## Authority boundary and impact

- Financial: no posting, payment, inventory or offline-intent behavior changes.
- Tenancy: login creates no book, membership, role or authority context. `/core`
  forwards the verified server-held credential; Hfe CORE authorizes every request.
- Security: no browser credential restoration in connected mode; old session
  snapshots are discarded. The profile is not converted into `StaffUserSession`.
- Performance: login/renewal is request-triggered; no new background financial or
  database operations. No schema changes.

An authenticated person without an actual staff session sees that operational
access is unavailable. This is not a cashier PIN or shift bypass. Existing
local synthetic cashier entry and PIN/shift code remain separate and unchanged.
Core currently has no public current-principal/grants endpoint that supplies
the required cashier UUID. Do not substitute a WorkOS user ID or infer owner
authority from the profile.

## Runtime configuration

This change does not mutate cloud settings or WorkOS applications. Before rollout,
configure each Pages deployment with Node.js compatibility (`nodejs_compat`) and:

- `AUTH_ORIGIN`: exact HTTPS application origin; no wildcard and no cross-host callback.
- `WORKOS_CLIENT_ID`, `WORKOS_ISSUER`: exact application client and verified token issuer.
- `WORKOS_API_KEY`, `WORKOS_COOKIE_PASSWORD`: server secrets; never `VITE_*` values.
- Existing `HFE_CORE_ORIGIN`: existing exact environment-specific Core origin.

Register `<AUTH_ORIGIN>/auth/callback` and `<AUTH_ORIGIN>/auth` in the WorkOS
application redirect/logout configuration. All required configuration is checked
fail-closed. A missing configuration response is 503, not successful login.

Plain Vite does not execute Pages Functions; `/auth` UI fixtures are not provider
proof. Use the Pages runtime for full local BFF execution. The identity front door
works independently of the separate POS operational runtime configuration.

The existing preview Core-origin allowlist is unchanged. Before deployment,
reconcile its configured `HFE_CORE_ORIGIN` with the shared-backend topology:
preview currently allows `https://prv-api.hfecore.com`, not `https://api.hfecore.com`.
No live configuration was verified or changed in this login implementation.

## Verification

- `npm run ci`: repository canonical local gate, including person transport and BFF tests.
- `npx tsc -p tsconfig.pages.json`: include Pages server modules in type checking.
- `npm run test:connected-auth`: isolated browser fixtures, including 360/768/1280px,
  hosted entry, token-free projection, local logout, refusal and legacy-storage rejection.
- `npm exec --package=wrangler@4.129.0 -- wrangler pages functions build functions --outdir .wrangler/auth-proof` (uses the checked-in minimal compatibility configuration).
- Full-content Aikido scan of every added/modified first-party source.

These fixtures prove application contracts, not a live WorkOS callback, issuer
admission, Core membership, or a completed operational cashier session.
