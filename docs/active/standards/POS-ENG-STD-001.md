---
okf_version: "0.2"
type: Engineering Standard
title: POS-ENG-STD-001 — Hfe POS Engineering & Modularity Standard
description: Normative technical engineering standard governing code modularity, Experience Layer API boundaries, connector manifest validation, mobile-first viewports, and local CI verification for hfe-pos.
tags: [standard, pos-engineering, modularity, api-boundary, mobile-first, ci-gate]
status: Approved
effective_date: 2026-08-15
---

# POS-ENG-STD-001: Hfe POS Engineering & Modularity Standard

## 1. Scope & Authority

This engineering standard defines the mandatory technical contracts, quality boundaries, code modularity triggers, and local verification gates for the **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`).

It binds all contributors, automated coding agents, and subagents operating on `hfe-pos`. Where conflict arises between informal comments or private chats and this standard, this standard prevails.

---

## 2. Normative Engineering Rules

### Rule 1: Modularity Threshold (500-Line Limit)
- **Threshold**: No hand-maintained first-party TypeScript (`.ts`) or React component (`.tsx`) file in `src/` may exceed **500 lines of code**.
- **Enforcement**: Any PR introducing or modifying a file over 500 lines triggers a mandatory **Modularity Review Trigger**. The file must be split into focused domain units or custom hooks before merging.
- **Automated Check**: Enforced via `scripts/check-modularity.py`.
- **Exclusions**: Lockfiles (`package-lock.json`), generated OpenAPI types, and vendored third-party dependencies are excluded.

### Rule 2: Pure Experience Layer API Boundary
- **REST-Only Transport**: `hfe-pos` operates strictly as an Experience Layer. It must **NEVER** contain backend database ORM logic, subledger storage mechanisms, or direct SQL execution.
- **Public API Contract**: All master data (Products, Contacts), transactions, and loyalty points must be resolved through `Hfe` Core REST APIs (`http://localhost:8080/v1/company-books/{book}/...`).
- **Mandatory Idempotency**: Every transaction submission (`POST /v1/company-books/{book}/transactions`) **MUST** include a client-generated UUID v4 header (`X-Idempotency-Key`).

### Rule 3: Connector Manifest Integrity
- **Manifest Governance**: The connector configuration file `connector.manifest.json` defines the official metadata, permissions, monetization, and endpoints for `hfe-pos`.
- **Schema Validation**: Must pass automated JSON schema validation via `scripts/validate-connector.py`.
- **Permission Scoping**: Permitted scope strings are limited to:
  - `subledger.post_transaction`
  - `biller.create_split`
  - `tax.calculate_ppn`
  - `inventory.sync_stock`

### Rule 4: Mobile Viewport Primary Focus (60fps Touch Ergonomics)
- **Primary Viewport (Smartphone)**: 100% of UI screens (Customer QR Order, Barista POS, KDS Kanban) must be designed with **Mobile Viewport (360px – 430px width)** as the primary layout target.
- **Ergonomics**: Buttons, drawers, and touch targets must support single-thumb navigation with a response latency `< 30ms`.
- **Secondary Viewport (Tablet)**: Fluid grid expansion for tablet displays (768px – 1024px width) without layout shifts or horizontal clipping.

### Rule 5: Financial Calculation Integrity
- **Subtotal & PB1 Tax Modes**:
  - `Mode 0`: PB1 Tax Disabled (0%).
  - `Mode 1`: Exclude Tax (10% PB1 added on top of subtotal).
  - `Mode 2`: Include Tax (10% PB1 embedded inside item prices).
- **Service Charge**: Cafe-configurable service fee percentage (default 5%).
- **Biller Split Fee**: Rp 250 per transaction fee deducted for split biller settlement.
- **Precision**: Money values must be rounded to nearest integer IDR (`Math.round()`) without floating point drift.

### Rule 6: Pre-Commit Local CI Verification
- **1-Command Gate**: Before opening a PR or merging work, contributors must execute `./scripts/ci-local.sh`.
- **Clean Pass Required**: The script must return exit code `0` with all checks passing:
  1. Modularity check (`scripts/check-modularity.py`)
  2. Connector manifest check (`scripts/validate-connector.py`)
  3. TypeScript typecheck (`npx tsc --noEmit`)
  4. ESLint check (`npm run lint`)
  5. Unit tests (`npm run test`)
  6. Production build (`npm run build`)

---

## 3. Compliance Matrix

| Rule | Metric / Threshold | Enforcement Mechanism |
|---|---|---|
| Modularity | `< 500 lines` per file | `python3 scripts/check-modularity.py` |
| Idempotency | `UUID v4` on POSTs | `src/tests/idempotency.test.ts` |
| Manifest | Valids against HCB v1 schema | `python3 scripts/validate-connector.py` |
| Type Safety | `0` TypeScript errors | `npx tsc --noEmit` |
| Local CI | `0` exit code | `./scripts/ci-local.sh` |
