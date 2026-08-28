# Level 2 Implementation Plan: L2-POS-103 — Live Track Order Dock & HUB Favorite Products Leaderboard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a collapsible ambient Live Track Order Dock at the bottom of the POS cashier workstation for real-time kitchen ticket status visibility, and add a Favorite Products Leaderboard in the Executive Analytics HUB.

**Architecture:** `PosTrackOrderDock.tsx` component in `src/components/pos/`, integration in `UnifiedPosView.tsx`, `FavoriteProductsLeaderboard.tsx` in `src/components/hub/`, full i18n support, and Playwright visual verification.

**Tech Stack:** React, TypeScript, Tailwind CSS, Playwright, Vitest.

**Spec:** `ARCHITECTURE.md`, `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Implementation Tasks

- [ ] **Task 1**: Create `src/components/pos/PosTrackOrderDock.tsx` (< 200 lines) with expandable ticket rail.
- [ ] **Task 2**: Integrate `PosTrackOrderDock` into `src/views/UnifiedPosView.tsx` (preserving < 500 line limit).
- [ ] **Task 3**: Create `src/components/hub/FavoriteProductsLeaderboard.tsx` (< 200 lines) and embed in `src/components/hub/ExecutiveInsightsTab.tsx`.
- [ ] **Task 4**: Add i18n dictionary keys in `types.ts`, `id.ts`, and `en.ts`.
- [ ] **Task 5**: Create unit test suite `src/tests/posTrackOrderDockAndHubFavoriteProducts.test.tsx`.
- [ ] **Task 6**: Capture visual verification screenshots with Playwright.
- [ ] **Task 7**: Run `./scripts/ci-local.sh` and `npm run test:flagship`.
- [ ] **Task 8**: Open PR, merge into `main`, and report results.
