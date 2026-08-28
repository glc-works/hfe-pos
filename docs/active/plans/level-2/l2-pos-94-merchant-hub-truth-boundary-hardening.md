# Level 2 Implementation Plan: L2-POS-94 — Merchant Hub & Financial Reports Truth Boundary Hardening

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all misleading "fake-green" states and unverified ledger mutation claims across Merchant Hub surfaces (#44, #85, #86, #87, #88), ensuring clear `[ DEMO / SAMPLE ]` vs `[ LIVE POSTED ]` visual channels, honest hardware status, and 100% i18n purity.

**Architecture:** Bind all 5 Merchant Hub reporting surfaces to `useDataTruth()` and `TruthChannelBadge`, explicitly labeling demo data and non-mutating mock handlers as simulation-only when `channel !== 'live-core'`. Require live read-back verification before presenting any transaction or elimination as durable CORE truth.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Vitest, i18n dictionaries.

**Spec:** Issues #44, #85, #86, #87, #88, `ARCHITECTURE.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `45f8019ddaf1b401f7448e5d08674fa63879a95b`.
2. Every file must adhere to the 500-line modularity threshold.
3. 100% i18n dictionary purity (`t.*`); zero raw hardcoded Indonesian/English strings.
4. All financial numbers must use `font-mono tabular-nums`.
5. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Update i18n dictionaries (`types.ts`, `id.ts`, `en.ts`) with clear simulation/demo disclaimers.
- [ ] **Task 2**: Hardening `ExecutiveInsightsTab.tsx` (#44) with honest demo badge & i18n bindings.
- [ ] **Task 3**: Hardening `FindAndMatchReconciliationModal.tsx` (#85) with explicit simulation disclaimer and localized match feedback.
- [ ] **Task 4**: Hardening `MultiEntityHoldingTab.tsx` (#86) with demonstrative elimination indicators.
- [ ] **Task 5**: Hardening `UniversalFinancialHealthGauge.tsx` (#87) with sample timestamp and provenance banner.
- [ ] **Task 6**: Hardening `CafeGoLiveReadinessModal.tsx` (#88) with simulated vs physical hardware separation.
- [ ] **Task 7**: Create unit test suite `src/tests/hubTruthBoundaryHardening.test.ts`.
- [ ] **Task 8**: Full CI certification (`./scripts/ci-local.sh`).
