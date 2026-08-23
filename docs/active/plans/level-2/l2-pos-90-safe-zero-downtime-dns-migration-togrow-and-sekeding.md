---
okf_version: "0.2"
type: Development Plan Level 2
title: "Safe Zero-Downtime DNS Migration (togrow.id & sekeding.com to Cloudflare)"
description: "Migrate DNS management and edge security for togrow.id and sekeding.com from Hostinger to Cloudflare with pre-population, RFC-compliant mail routing, and rollback safety."
tags: [development-plan, level-2, dns-migration, cloudflare, hostinger, devops]
parent_level_1: l1-pos-platform-infrastructure
github_issue: 49
status: Proposed
---

# Level 2 Implementation Plan: Safe Zero-Downtime DNS Migration (`togrow.id` & `sekeding.com` to Cloudflare)

## 1. Outcome
Consolidate ecosystem domain management by safely delegating nameservers for `togrow.id` (Hostinger Domain ID `33119828`) and `sekeding.com` (Hostinger Domain ID `32933460`) to Cloudflare (`kanye.ns.cloudflare.com`, `raina.ns.cloudflare.com`), preserving 100% of existing Hostinger Mail (MX, SPF, DKIM, DMARC), Google Search Console verifications, and backend routing without a single second of service downtime.

---

## 2. Scope & Technical Invariants

### 2.1 Expert-Reviewed Technical Invariants
1. **Zero Email Interruption (Grey Cloud Invariant)**:
   - All Mail Exchange (MX) and DKIM (`hostingermail-a/b/c._domainkey`) records MUST declare `proxied: false` (DNS-only) to strictly comply with RFC 5321 and RFC 6376.
2. **Backend Node Direct Routing**:
   - Subdomains pointing to raw IP nodes (`47.131.239.95` for `api-hcb`, `ping`, `leap-hcb`, `hcb`) MUST declare `proxied: false` during initial phase to preserve low-level non-HTTP/gRPC connectivity.
3. **Web Acceleration & Edge Protection (Orange Cloud)**:
   - Root `@` and `www` records for public storefronts declare `proxied: true` to enable Cloudflare L3/L4 DDoS mitigation, Web Application Firewall, and HTTP/3 QUIC acceleration.
4. **Pre-population Gate**:
   - Zero nameserver updates occur at Hostinger until all 25 DNS records across both domains are verified active in Cloudflare DNS tables.

---

## 3. Step-by-Step Execution Plan

### Step 1: Pre-populate DNS Records in Cloudflare API
- Create Zone `sekeding.com` and `togrow.id` in Cloudflare Account `4ed931bcc90e5fa93e153c6b73165d26`.
- Populate `sekeding.com`:
  - `A @ -> 16.78.241.22` (proxied: true)
  - `CNAME www -> sekeding.com` (proxied: true)
  - `MX @ -> mx1.hostinger.com (priority: 5)`, `mx2.hostinger.com (priority: 10)` (proxied: false)
  - `TXT @ -> "v=spf1 include:_spf.mail.hostinger.com ~all"` (proxied: false)
  - `TXT _dmarc -> "v=DMARC1; p=none"` (proxied: false)
  - `CNAME hostingermail-a/b/c._domainkey -> *.dkim.mail.hostinger.com.` (proxied: false)
  - `CNAME autoconfig/autodiscover -> *.mail.hostinger.com.` (proxied: false)
- Populate `togrow.id`:
  - `A @ -> 16.78.241.22` (proxied: true)
  - `CNAME www -> togrow.id` (proxied: true)
  - `TXT @ -> "google-site-verification=DEINM21FHQTCosq1DxceX7PXM2yg11aS69qcyECtR4c"`
  - `A subdomains (account, vault, cool, companybook, book, storybook-ui, ui) -> 16.78.241.22`
  - `A backend nodes (ping, leap-hcb, api-hcb, hcb) -> 47.131.239.95` (proxied: false)

### Step 2: Edge Security Hardening
- Enforce SSL/TLS: Full (Strict).
- Enable Always Use HTTPS & Minimum TLS 1.2.

### Step 3: Hostinger Nameserver Delegation Cutover
- Execute `domains_updateDomainNameserversV1` on Hostinger API:
  - `sekeding.com` -> `['kanye.ns.cloudflare.com', 'raina.ns.cloudflare.com']`
  - `togrow.id` -> `['kanye.ns.cloudflare.com', 'raina.ns.cloudflare.com']`

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
