# Hfe POS early-access staging runbook

**Lifecycle:** pre-production moving toward invite-only, manually approved early access  
**Environment:** development and staging only  
**Production:** explicitly excluded until a separate founder declaration is recorded in reviewed authority

This runbook is a deployment gate, not deployment authority and not evidence that the flagship is
ready. Every observation must be refreshed immediately before an infrastructure change or demo.

## Observed baseline — 2026-08-21

- AWS account `682603094049`, region `ap-southeast-1` contains running instance
  `hcb-staging` (`i-020b5a6c4bfef0586`, `t3.large`).
- AWS Systems Manager reports the instance online through profile `hcb-staging-ssm`.
- HTTPS and direct port `8080` health endpoints respond. This proves network reachability only.
- The presented certificate covers `api-hcb.togrow.id` and `hcb.togrow.id`.
- The connected Cloudflare account contains active `hfecore.com` and `hfeit.com` zones. It did not
  return a `hfeit.app` zone or existing `dev-`/`stg-` records in the two visible zones.
- Hostinger domain enumeration was rate-limited, so registrar ownership and nameserver authority
  for `hfeit.app` were not re-proved.
- Security group `sg-0cb2a0331865adf40` allows ports `22` and `8080` from `0.0.0.0/0`.
- Root volume `vol-09ef240f22af6d2a1` is a 30 GiB unencrypted `gp3` volume.

These identifiers are operational evidence, not permanent architecture. Do not copy them into
application defaults or expose them to a browser client.

## Required design decisions

Record these decisions in the deployment Issue before mutation:

1. Exact staging experience hostname using the approved `stg-` prefix.
2. Exact staging CORE API hostname. An experience hostname and engine API hostname must not be
   silently treated as the same trust boundary.
3. Authoritative DNS account and nameservers for `hfeit.app`.
4. Immutable Hfe POS revision, immutable generated SDK revision/artifact, and immutable Hfe CORE
   revision or image digest.
5. Staging Company Book, tenant, OIDC application/membership, authority context, terminal, cashier,
   and bounded manual-admission receipt.
6. Secret references and rotation owner. Tokens and secret values must never enter Git, deployment
   evidence, shell history, application diagnostics, or client bundles.
7. Encrypted storage migration method, maintenance window, rollback owner, and evidence retention.

## Infrastructure preconditions

All must be true before the flagship is exposed to an early-access participant:

- `hfeit.app` DNS authority is proved from registrar through authoritative nameservers.
- Staging has a valid hostname-matched TLS certificate; direct IP is not a supported client URL.
- Public ingress is limited to the reviewed HTTPS path. Direct public SSH and application port
  `8080` are removed; operator access uses SSM.
- The replacement root/data storage is encrypted. The original unencrypted volume is not reused
  for early-access data.
- Backup/restore is tested against the exact staging release and retention is recorded.
- Development and staging use separate Book, tenant, identity application, credentials, admission
  receipts, databases, and evidence paths.
- Application configuration passes `resolveCoreDemoEnvironment`; production and implicit fallback
  are rejected.
- No real-user/customer data is accepted until reviewed lifecycle authority records data handling,
  support, export, retention, incident response, and rollback controls.

## Deployment sequence

Each step produces a timestamped, secret-free receipt. Stop on any mismatch.

1. Capture the pre-change AWS, DNS, certificate, application revision, storage, security-group,
   backup, and health snapshot.
2. Create or select encrypted replacement storage from a controlled snapshot/copy; verify restore
   before switching the instance. Preserve the prior volume only for the approved rollback window.
3. Restrict ingress to HTTPS and verify SSM operator access before removing public SSH/`8080`.
4. Bind the reviewed staging hostname and certificate; verify DNS and TLS from an external client.
5. Deploy the exact Hfe CORE and Hfe POS revisions with secret references resolved at runtime.
6. Create the bounded invite-only admission receipt and backend membership/authority grants.
7. Run local/full CI and security evidence for the exact deployed revisions.
8. Run `npm run proof:flagship` against staging. A pass must prove settlement, canonical
   `Posting.id`, independent `getPosting` lineage, and same-key replay to the same Posting.
9. Complete the remaining stateful proofs: balanced posting, tenant/Book isolation, authorization,
   closed-period refusal, approval-state truth, reversal, audit/meter/report read-back, and export.
10. Record operator, participant, revisions, timestamps, request/evidence IDs, result, and support
    contact. Never record access tokens or raw secret-bearing responses.

## Fail-closed release gates

Do not start or continue an early-access demo when any condition is true:

- financial mutation returns success without canonical durable Posting read-back;
- posting source, effect key, Book, tenant, or revision differs from the originating POS sale;
- replay creates or resolves to a second Posting;
- authorization, membership, admission, closed-period, or cross-tenant negative proof fails;
- staging depends on a mutable sibling SDK checkout or an unreviewed artifact;
- direct public SSH/`8080`, unencrypted early-access storage, secret leakage, or hostname/TLS mismatch
  remains;
- rollback/restore or participant export cannot be demonstrated.

## Rollback and financial recovery

Rollback is versioned restoration, not deletion of financial history.

1. Stop new admissions and financial submissions; preserve read-only support and export where safe.
2. Capture the failing request/evidence IDs, application revisions, configuration digest, and
   health state without secrets.
3. Revert Hfe POS and Hfe CORE to the last reviewed compatible revision pair. Do not combine an old
   client with an incompatible generated SDK or API contract.
4. Restore infrastructure configuration from the reviewed pre-change snapshot. Storage rollback is
   allowed only when it cannot discard accepted financial events; otherwise repair forward.
5. Resolve posted financial errors through governed reversal/correction. Never delete or rewrite a
   durable Posting to make the demo appear clean.
6. Re-run tenant/auth/idempotency/closed-period/read-back proofs before reopening admission.
7. Notify affected early-access participants directly, provide export/support, and record the
   incident and corrective action in the governed delivery record.

## Minimum deployment receipt

- environment and hostname;
- Hfe POS, Hfe CORE, OpenAPI, and generated SDK immutable revisions;
- infrastructure identifiers and encrypted-storage evidence;
- DNS/TLS and ingress evidence;
- secret-reference identifiers and rotation owner, never values;
- admission receipt ID, approver, approval/expiry timestamps, participant scope;
- exact CI/security/stateful-proof commands with exit status;
- canonical POS source, Posting ID, state revision, idempotency replay result, and evidence IDs;
- backup/restore and rollback drill result;
- known gaps, support owner, export path, and go/no-go decision.
