# Level 2 Implementation Plan: L2-POS-96 — Storefront Resolver Fail-Closed Protection (Issue #60)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the BOARD merchant storefront resolver (`packages/storefront-astro/src/lib/merchantDataResolver.ts`) strictly fails closed in production when merchant account data is not available, avoiding assumed backend routes and preventing false storefront rendering.

**Architecture:** Fail-closed resolver returning `null` in production when merchant accounts or API endpoints are unreachable/absent. Demo/preview mode explicitly provides isolated benchmark fixtures for UI testing only.

**Tech Stack:** TypeScript, Vitest, Astro Storefront Suite.

**Spec:** Issue #60, `ARCHITECTURE.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `00528886a61a951a2bf06801035256f473591096`.
2. All added files must stay under the 500-line modularity limit.
3. In production, unverified or missing merchant slugs must return `null` (404).
4. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Add unit test `src/tests/storefrontResolverFailClosed.test.ts` testing production fail-closed behavior, invalid slug handling, and preview fallback.
- [ ] **Task 2**: Verify `packages/storefront-astro/src/lib/merchantDataResolver.ts` against all edge cases.
- [ ] **Task 3**: Run `./scripts/ci-local.sh` and full test suite.
