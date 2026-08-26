---
okf_version: "0.2"
type: Development Plan Level 2
title: Live CORE Plumbing, Authoritative Read-Back Gating and End-to-End Flagship Journey Proof
description: Implements authoritative live plumbing between hfe-pos and headless-company-books (HCB @ 98fd5b60), enforcing 7-point cryptographic read-back verification, fail-closed offline intent reconciliation on network drops, and modular extraction of HfePostingReadbackValidator.
tags: [development-plan, level-2, pos, hfe-core, live-plumbing, authoritative-readback, offline-intent, flagship-proof]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 91
status: In progress
---

# Live CORE Plumbing, Authoritative Read-Back Gating and End-to-End Flagship Journey Proof (L2-POS-91)

## Outcome

Closes the trust and production readiness gap in `glc-works/hfe-pos` by establishing **Authoritative Live Plumbing** to `glc-works/headless-company-books` (Hfe CORE @ `98fd5b60`):

1. **Canonical POS Operations Pipeline (`src/services/financial/HfeSdkAdapter.ts`)**:
   - Binds canonical `@hfe/sdk` operations: `processPosRetailOrder`, `submitPosOrder`, `postPosOrder`, and `getPosting`.
   - Strictly scopes all operations by `companyBookId` and JWT bearer token.

2. **Authoritative 7-Point Read-Back Validator (`src/services/financial/HfePostingReadbackValidator.ts`)**:
   - Encapsulates cryptographic verification asserting:
     - `finality === 'applied'`
     - `posting.id === posted.posting_id`
     - `source_capability === 'pos_order'`
     - `source_object_id === order_id`
     - `stable_effect_key === postKey`
   - Keeps `HfeSdkAdapter.ts` strictly below the 500-line modularity threshold.

3. **Reconciliation on Network Drop**:
   - If `postPosOrder` succeeds or returns `202 Accepted` but the read-back query drops, enters `AWAITING_RECONCILIATION` via `CafeCheckoutAttemptCoordinator` to prevent phantom failures or duplicate postings.

4. **Replay Processor in Offline Intent Queue (`src/services/financial/OfflineIntentQueue.ts`)**:
   - Flushes offline intents with UUID v4 idempotency keys and verifies read-back upon reconnect.

5. **End-to-End Flagship Journey Verification (`e2e/flagship-one-transaction-one-truth.spec.ts`)**:
   - Validates the complete guest-to-ledger cycle adhering to Issue #34.

---

## Scope

### Pillar A: Modularity Refactoring & Read-Back Validator
- Create `src/services/financial/HfePostingReadbackValidator.ts` (< 180 lines).
- Refactor `src/services/financial/HfeSdkAdapter.ts` (< 400 lines).

### Pillar B: Offline Replay & Asynchronous Gating
- Update `src/services/financial/OfflineIntentQueue.ts`.
- Update `src/hooks/useCart.ts` with asynchronous payment state machine.

### Pillar C: E2E Verification & Test Suite
- Extend `e2e/flagship-one-transaction-one-truth.spec.ts`.
- Add unit tests in `src/tests/hfePostingReadbackValidator.test.ts`.

---

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Hfe Core is the Single Source of Truth (SSOT).
- Invariant Rule #18: Hfe Core Endpoints & Universal Accounting Truth Invariant.
- Upstream Core Reference: `headless-company-books` Commit `98fd5b60` / Issues #856, #880, #973.
