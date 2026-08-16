---
okf_version: "0.2"
type: Development Plan Level 2
title: App Monolith Decomposing, Hfe REST API Transport & Vitest Suite
description: Modularizes the 4,299-line monolithic src/App.tsx into domain views, abstracts the Hfe Core REST API Client layer with UUID idempotency, and installs a Vitest testing harness for financial calculations.
tags: [development-plan, level-2, refactoring, api-transport, vitest, idempotency, modularity]
parent_level_1: l1-03-policy-based-payment-checkout
github_issue: 5
status: Proposed
---

# Level 2 Implementation Plan: App Monolith Decomposing, Hfe REST API Transport & Vitest Suite

## 1. Outcome
Decomposes the 4,299-line monolithic `src/App.tsx` into clean, maintainable domain view modules under `src/views/`, extracts custom state hooks (`src/hooks/`), abstracts the `Hfe` REST API transport layer with client-generated UUID idempotency keys (`src/services/hfeApi.ts`), and installs **Vitest** for unit testing cart math, tax (PB1), and service charge calculations.

## 2. Scope

### Phase A: View Modularization (`src/views/`)
- Extract domain views out of `src/App.tsx`:
  - `src/views/LandingView.tsx` — Official cafe landing page & brand profile view.
  - `src/views/CustomerMobileView.tsx` — Customer QR phone/guest login, menu catalog, and cart drawer.
  - `src/views/BaristaPosView.tsx` — Barista touch floor plan grid, open tabs, and walk-in ordering.
  - `src/views/KdsKanbanView.tsx` — KDS kitchen queue, preparation timers, bump buttons, and BOM drawer.
  - `src/views/CafeSettingsView.tsx` — Owner PB1 tax mode (0/1/2), service charge, cash drawer float, and theme configuration.
- Reduce `src/App.tsx` to a lightweight router shell (< 250 lines).

### Phase B: Custom Hooks & State Extraction (`src/hooks/`)
- `src/hooks/useCart.ts` — Cart state, modifiers, line item pricing, and PB1 tax / service charge / tip calculations.
- `src/hooks/useTableState.ts` — Visual floor plan status (free, occupied, open-tab), table transfers, and billing tabs.
- `src/hooks/useHfeSync.ts` — Hfe Core Company Book sync status, multi-branch outlet state, and offline IndexedDB buffer listener.

### Phase C: Hfe REST API Transport Layer (`src/services/hfeApi.ts`)
- Implement typed API client targeting `Hfe` Core endpoints strictly per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md):
  - Table Resolution: `GET /v1/company-books/{book}/tables/{id}`
  - Contact Resolution: `POST /v1/company-books/{book}/contacts/resolve`
  - Product Catalog: `GET /v1/company-books/{book}/products`
  - Transaction Submission: `POST /v1/company-books/{book}/transactions`
  - Loyalty Check & Claim: `GET /v1/company-books/{book}/contacts/{id}/loyalty` and `POST /v1/loyalty/vouchers/claim`
  - QRIS Generation: `POST /v1/company-books/{book}/payments/qris/generate`
  - KDS Status Bump: `PATCH /v1/company-books/{book}/kds/orders/{order_id}/bump`
- Client-side UUID v4 generator for mandatory `X-Idempotency-Key` headers on all transaction POSTs.
- Graceful fallback to local mock data & IndexedDB buffer when Hfe API is offline.

### Phase D: Automated Test Harness (`Vitest`)
- Add `vitest` and `@testing-library/react` to `package.json`.
- Create unit test suite:
  - `src/tests/cartMath.test.ts` — Verifies Subtotal, PB1 Tax (Exclude mode vs Include mode), 5% Service Charge, and Voucher Discount calculations.
  - `src/tests/idempotency.test.ts` — Verifies UUID v4 generation and non-duplication across retries.
  - `src/tests/hfeApi.test.ts` — Verifies REST payload shape compliance with HCB OpenAPI specifications.

## 3. Explicit Exclusions
- Does not modify HCB backend Rust crates (`crates/`, `v2/`); operates strictly within the `hfe-pos` Experience Layer.

## 4. Verification Plan
- `npm run test` executes clean with 100% passing tests for cart math and idempotency keys.
- `npm run build` (`tsc && vite build`) compiles clean with zero TypeScript errors.
- `src/App.tsx` line count reduced from 4,299 lines to < 250 lines.
