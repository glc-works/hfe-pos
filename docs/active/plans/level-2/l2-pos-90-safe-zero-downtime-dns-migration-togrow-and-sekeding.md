---
okf_version: "0.2"
type: Development Plan Level 2
title: "Safe Zero-Downtime DNS Migration (togrow.id & sekeding.com to Cloudflare)"
description: "Historical implementation plan for the reported togrow.id and sekeding.com DNS migration; current deployment truth is owned by deployment governance."
tags: [development-plan, level-2, dns-migration, cloudflare, hostinger, devops]
parent_level_1: l1-pos-platform-infrastructure
github_issue: 49
status: Superseded
---

# Level 2 Implementation Plan: Safe Zero-Downtime DNS Migration (`togrow.id` & `sekeding.com` to Cloudflare)

> **Superseded / historical implementation provenance.**
>
> This plan must not be used as current DNS/deployment authority or as an executable cutover instruction. Execution evidence was recorded in `glc-works/hfe-pos#49`, which was closed completed after reporting phases 0–4. Current observed domain/DNS/deployment state belongs in `glc-works/hfe-deployment-governance`; fresh reconciliation is tracked by `glc-works/hfe-deployment-governance#22`.
>
> Future DNS/provider changes require fresh provider/DNS evidence and the owning deployment-governance review. Product/domain meaning remains governed by `glc-works/hfeit-product` where applicable. The material below is retained only to preserve implementation provenance and the historical safety reasoning used during the migration.

## 1. Outcome
Consolidate ecosystem domain management by safely delegating nameservers for `togrow.id` (Hostinger Domain ID `33119828`) and `sekeding.com` (Hostinger Domain ID `32933460`) to Cloudflare (`kanye.ns.cloudflare.com`, `raina.ns.cloudflare.com`), preserving 100% of existing Hostinger Mail (MX, SPF, DKIM, DMARC), Google Search Console verifications, and backend routing without a single second of service downtime.

---

## 2. Scope & Technical Invariants

### 2.1 Expert-Reviewed Technical Invariants
1. **Zero Email Interruption (Grey Cloud Invariant)**:
   - All Mail Exchange (MX) and DKIM (`hostingermail-a/b/c._domainkey`), SPF, DMARC, autoconfig, and autodiscover records MUST declare `proxied: false` (DNS-only) to comply with RFC 5321 and RFC 6376. Stale provider records (e.g. SES) must be audited before cutover.
2. **Granular Protocol & Listener Classification**:
   - Classification is determined strictly per hostname + protocol/port listener (`WEB_HTTP_PROXY` vs `DNS_ONLY_NON_HTTP` vs `MAIL` vs `VERIFICATION`), never crude per-IP sweeping.
3. **Pre-Cutover Origin TLS Probe (Anti-526 Gate)**:
   - Mode SSL *Full (Strict)* requires pre-verifying origin certificate validity and SAN match on port 443 before enabling Cloudflare proxying (`Orange Cloud`).
4. **DNSSEC Staged Lifecycle**:
   - Check and disable legacy registrar DS records before changing nameservers; activate Cloudflare DNSSEC only during post-propagation stabilization.
5. **Twin-Zone Parity & Realistic Rollback**:
   - Maintain identical authoritative zone records in Hostinger and Cloudflare during transition. Never promise instant NS rollback due to TLD caching; use Cloudflare proxy toggle as first-line break-glass.

---

## 3. The 6-Phase Execution Protocol

- **Phase 0 — Preflight**:
  1. Export authoritative DNS from Hostinger.
  2. Check status of DNSSEC/DS at registrar.
  3. Inventory each hostname by service + protocol + port listener.
  4. Probe TLS origin certificate port 443 for each target web origin.
  5. Audit mail flow requirements and SES custom MAIL FROM relevance.
- **Phase 1 — Cloudflare Staging**:
  1. Create zone in Cloudflare.
  2. Reproduce all required DNS records with explicit classification (`WEB_HTTP_PROXY` | `DNS_ONLY_NON_HTTP` | `MAIL` | `VERIFICATION`).
  3. Keep Hostinger authoritative DNS unchanged.
- **Phase 2 — Pre-cutover Validation**:
  1. Compare Cloudflare staged answers against Hostinger authoritative zone byte-for-byte.
  2. Test proxied origin TLS for Full Strict eligibility.
- **Phase 3 — Delegation Cutover**:
  1. Disable old DNSSEC first if currently active at registrar.
  2. Change nameservers to `kanye.ns.cloudflare.com` & `raina.ns.cloudflare.com`.
  3. Observe propagation from multiple public resolvers (`1.1.1.1`, `8.8.8.8`, `9.9.9.9`).
- **Phase 4 — Service Validation**:
  1. Validate Web HTTP/HTTPS & API response.
  2. Test Inbound & Outbound email + DKIM/SPF/DMARC alignment.
  3. Test mail client autoconfig/autodiscover.
  4. Validate Google site verification TXT record.
- **Phase 5 — Stabilization & Hardening**:
  1. After full propagation stability ($24-48\text{h}$), enable Cloudflare DNSSEC and publish DS at registrar.
  2. Enforce Authenticated Origin Pulls (AOP) if applicable.

---

## 4. Verification Plan

```bash
# Verify authoritative NS delegation
dig +short NS sekeding.com @1.1.1.1
dig +short NS togrow.id @1.1.1.1

# Verify Hostinger Mail MX continuity
dig +short MX sekeding.com @1.1.1.1

# Verify Google Verification TXT
dig +short TXT togrow.id @1.1.1.1

# Verify HTTPS SSL handshake
curl -s -I https://sekeding.com/ | head -n 5
curl -s -I https://togrow.id/ | head -n 5
```
