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
- **Public API Contract**: All master data (Products, Contacts), transactions, table states, and loyalty points must be resolved strictly through published `Hfe` Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).
- **Mandatory Idempotency**: Every transaction submission (`POST /v1/company-books/{book}/transactions`) **MUST** include a client-generated UUID v4 header (`X-Idempotency-Key`).

### Rule 3: Connector Manifest Integrity
- **Manifest Governance**: The connector configuration file `connector.manifest.json` defines the official metadata, permissions, monetization, and endpoints for `hfe-pos`.
- **Schema Validation**: Must pass automated JSON schema validation via `scripts/validate-connector.py`.
- **Permission Scoping**: Permitted scope strings are limited to:
  - `subledger.post_transaction`
  - `biller.create_split`
  - `tax.calculate_ppn`
  - `inventory.sync_stock`

### Rule 4: Mobile-First & Tablet-Second Ergonomics (Touch & Performance Priority)
- **Mobile Viewport Primary Focus**: 100% of UI surfaces (Customer QR Mobile, Barista Touch POS, KDS Kanban) **MUST** be designed with **Mobile Viewport (360px – 430px width)** as the primary target. Every modal, drawer, order cart, and catalog grid must support single-thumb ergonomic touch interaction.
- **Tablet Experience Second**: Adaptive fluid layouts must expand naturally to tablet viewports (768px – 1024px width) as a secondary option without layout shifts, overflow clipping, or broken touch targets.
- **Touch Interaction Priority**: Touch feedback response latency must be **< 30ms**. Every tap, swipe, modifier selection, and status bump must trigger instantaneous visual/tactile state updates.
- **60fps Performance Priority**: Zero cumulative layout shifts (CLS = 0), smooth 60fps transitions, and optimized bundle delivery (< 150KB core JS bundle) to guarantee lightning-fast rendering even on low-end cashier/customer mobile devices.

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

### Rule 7: Single Source of Truth (SSOT) Everywhere & Zero State Drift
- **Single-Door Store Governance**: Every store configuration, payment policy, theme customization token, custom vault template, and runtime domain app **MUST** be managed through **ONE authoritative Single-Door Context (`MerchantConfigContext.tsx`)**.
- **DevTools Pure Shortcut Rule**: Developer tooling (`DevModePack`) operates strictly as an ergonomic shortcut caller into the single-door API and must never maintain duplicate, isolated, or shadow states.
- **Bi-Directional State Synchronization**: Any mutation initiated via settings or dev shortcuts must immediately and reactively reflect across all active consumer views without requiring page reloads or polling loops.

### Rule 8: Primary Pilot Consumer & Engine Purity Invariant
- **Pilot Co-Evolution**: `hfe-pos` operates as the primary benchmark pilot consumer for `headless-company-books` (Hfe Core). Gaps identified during live POS operations must drive direct improvements to backend contracts.
- **Zero Domain Leakage**: All feedback, new endpoints, and schema extensions pushed to Hfe Core **MUST be abstracted into universal, industry-agnostic accounting primitives** (e.g. `cost_center_id`, generic `metadata`, multi-UOM `Bill of Materials`, and `Accounts Receivable`). Hardcoding cafe-specific or retail-specific vocabulary into core accounting subledgers is strictly prohibited.

### Rule 9: Pure Viewport App Shell (`100dvh`) & Single Scroll Owner Governance
- **Dynamic Viewport Unit**: The root application container must use `h-[100dvh] w-full flex flex-col overflow-hidden` to avoid layout shifts when mobile browser UI elements toggle.
- **Single Scroll Owner Invariant**: Every active view must designate exactly ONE scrollable container (`<main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">`). Ancestor layout wrappers must strictly use `overflow-hidden` or `overflow-clip` to eliminate scroll-trapping and ensure seamless scrolling across standalone and dev simulator environments.
- **Touch Action Ergonomics**: All interactive elements must declare `touch-manipulation` (`touch-action: manipulation`) and overscroll containment (`overscroll-behavior: contain`).

### Rule 10: 3-Tier Data Authority & Zero-Drift Precedence Resolution (Anti-Duplication Invariant)
- **Tier 1 (Check Upstream Hfe Core First)**: Before adding or modifying any data points, metadata, CRM contacts, or transaction fields in `hfe-pos`, developers/agents **MUST FIRST** search and inspect `glc-works/headless-company-books` (`src/crm/`, `src/financial_kernel/`, `src/company_settings/`, and `docs/active/reference/generated-schema-semantics.md`) to verify if an authoritative upstream primitive already exists.
- **Tier 2 (Check Existing POS Single Source of Truth)**: If the capability is absent in Hfe Core (or in pre-production simulation), check existing POS domain contexts (`MerchantConfigContext`, `types/pos.ts`, `connector.manifest.json`) to reuse existing definitions without creating duplicate shadow arrays.
- **Tier 3 (Clarify Intent Before Inventing Fields)**: Developers/agents are **STRICTLY PROHIBITED** from silently inventing arbitrary new fields, ad-hoc state keys, or shadow data models. When the data origin or business intent is ambiguous, the agent must halt and ask the user/founder for clarification, ensuring all proposed fields map cleanly to universal accounting and CRM primitives before modifying code.

### Rule 11: Multi-Device Viewport Stress-Testing & Non-Clipping Governance
- **Narrow Viewport Audit (360px – 390px)**: All components must be stress-tested on compact mobile widths (iPhone SE / Galaxy compact) to guarantee zero horizontal scrollbar leaks, zero text jamming/collisions, and clean button wrapping.
- **Flat Header Bottom Invariant**: Fixed and sticky app headers must strictly use flat bottom edges (`border-radius: 0`) with subtle `border-b` dividers to prevent floating rounded corners from clipping and obscuring scrolled content underneath.
### Rule 12: Apple HIG & Nielsen Norman Microcopy & Interaction Standard
- **Action Button Microcopy (Verb-First & Zero-Parentheses Invariant)**: Every interactive button and CTA must strictly use direct, concise, action-oriented verbs (e.g. `+ Tambah Menu Lainnya`, `Kirim Pesanan ke Dapur ➔`, `Bayar Sekarang ➔`). **Cramming conversational explanations or navigation hints inside parentheses `(...)` in button labels is strictly forbidden.** Secondary explanations belong in helper text, informational cards, or pill badges above the button.
- **Multi-Language (i18n) Purity Invariant**: Hardcoding raw UI strings directly in JSX without localization binding is strictly prohibited. All customer and cashier facing buttons, headers, error states, and legal warnings **MUST** be bound through `useTranslation()` (`t.*`) in `src/i18n/translations.ts`.
- **Touch Target & Ergonomics (Apple HIG 44px)**: All primary interactive targets must maintain a minimum height/width of 44px with `touch-manipulation` and tactile active scale transitions (`active:scale-[0.98]`).

### Rule 13: Mandatory Live Browser Inspection & Multi-Device Switcher Protocol
- **Active Browser Multi-Device Switching**: Contributors and agents must directly inspect the live UI across all primary hardware viewport modes before finalizing delivery:
  - **Compact Mobile (360px – 390px)**: Audit iPhone SE & compact screens for zero text truncation, zero button overflow, flat header bottoms, and sticky floating cart visibility.
  - **Tablet Portrait (768px)**: Audit 2/3 column layout and touch drawer expansion.
  - **Tablet Landscape / Desktop (1024px – 1440px)**: Audit responsive grid, dual-pane POS workstation layout (catalog left + cart right), and absence of mobile floating overlays.
- **Dual-Port Validation (Port 5173 vs Port 4173)**: All UI workflows must be validated on both **Port 5173 (DevMode simulated canvas)** and **Port 4173 (Vite standalone production preview)** to ensure zero discrepancy between simulator frames and native responsive viewports.
- **Automated Runtime Verification**: Directly inspect DOM computed dimensions, scroll container hierarchy, and visual element bounds.

---

## 3. Compliance Matrix

| Rule | Metric / Threshold | Enforcement Mechanism |
|---|---|---|
| Modularity | `< 500 lines` per file | `python3 scripts/check-modularity.py` |
| Idempotency | `UUID v4` on POSTs | `src/tests/idempotency.test.ts` |
| Manifest | Valids against HCB v1 schema | `python3 scripts/validate-connector.py` |
| Type Safety | `0` TypeScript errors | `npx tsc --noEmit` |
| Viewport Shell | `h-[100dvh]` root & 1 scroll owner | `src/tests/viewportShell.test.ts` |
| Data Authority | 3-Tier Upstream Resolution Gate | Peer Review & Precedence Audit |
| Multi-Device Stress | 360px - 1280px zero clipping | Step 2 Multi-Point Self-Audit |
| Apple HIG / NN/g Microcopy | Zero-parentheses CTAs & 100% i18n | Lint & UI Heuristic Audit |
| Browser Device Switch Inspection | Dual-port 5173 & 4173 validation across 360px–1440px | Pre-Delivery Browser Inspection Gate |
| Local CI | `0` exit code | `./scripts/ci-local.sh` |





