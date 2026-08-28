# Level 2 Implementation Plan: L2-POS-95 — Offline Stack Re-Qualification & Idempotency Gating

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-qualify the offline cashier queue (`OfflineIntentQueue`) and checkout coordinator (`GovernedPosCheckout`) to guarantee that idempotency identities survive browser reloads/reconnects, that offline intents never act as a secondary financial authority, and that state flips to `Posted` only upon authentic Hfe CORE read-back.

**Architecture:** IndexedDB-backed intent queue with dual-store (`financial_intents` and `checkout_attempts`). Phase keys (`:quote`, `:accept`, `:confirm`) are deterministically derived from `rootIdempotencyKey`. Offline state remains fail-closed; reconnection resumes existing attempt records and converges only through `HfePostingReadbackValidator`.

**Tech Stack:** TypeScript, IndexedDB, Vitest, Playwright E2E, Hfe CORE Posting Contracts.

**Spec:** Issue #61, `ARCHITECTURE.md`, `DEVELOPMENT.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `96167ac5b9c536265d8fa4aa562857b19be72cf6`.
2. All added files must stay under the 500-line modularity limit.
3. Offline intent must not create fake Posting IDs or manipulate GL balances locally.
4. All 10 local CI verification steps (`./scripts/ci-local.sh`) and E2E flagship suite must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Implement comprehensive test suite `src/tests/offlineStackRequalification.test.ts`.
- [ ] **Task 2**: Harden `OfflineIntentQueue.ts` storage fallback and attempt retrieval.
- [ ] **Task 3**: Verify offline resilience via `npm run test:flagship` and unit tests.
- [ ] **Task 4**: Full 10-step local CI gate certification (`./scripts/ci-local.sh`).
