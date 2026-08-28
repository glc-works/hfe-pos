# Level 2 Implementation Plan: L2-POS-101 — BOARD Dual-CTA (Reservasi & Delivery/Pickup) & Online Table State Isolation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate in-store table context leakage (`OUT-04`) when online visitors navigate from public storefront (`BOARD.Hfeit`) to customer ordering (`ORDER.Hfeit`), provide distinct Dual-CTA on `BOARD` (`[ 🛵 Pesan Online (Antar & Ambil) ]` & `[ 📅 Reservasi Meja ]`), and support entering table number for on-premise diners.

**Architecture:** Route and context isolation in `App.tsx`, dual-CTA actions in `LandingPageView.tsx`, null-safe table headers and in-store switcher in `CustomerMobileView.tsx` & `CustomerHeader.tsx`, i18n support, and Playwright visual proof.

**Tech Stack:** React, TypeScript, Tailwind CSS, Playwright, Vitest.

**Spec:** `ARCHITECTURE.md`, `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Implementation Tasks

- [ ] **Task 1**: Update i18n dictionaries (`types.ts`, `id.ts`, `en.ts`) with Dual-CTA and online order labels.
- [ ] **Task 2**: Refactor `LandingPageView.tsx` to provide 2 distinct primary actions: `Pesan Online (Delivery/Takeaway)` & `Reservasi Meja`.
- [ ] **Task 3**: Update `CustomerHeader.tsx` and `CustomerMobileView.tsx` to render online order badges when `selectedTable === null` with a switcher to attach a table number.
- [ ] **Task 4**: Ensure `App.tsx` isolates navigation from `BOARD` (`selectedTable: null`) while preserving `?table=...` query param QR scanning.
- [ ] **Task 5**: Create unit test suite `src/tests/boardDualCtaAndOnlineTableIsolation.test.tsx`.
- [ ] **Task 6**: Capture visual verification screenshots with Playwright.
- [ ] **Task 7**: Run `./scripts/ci-local.sh` and `npm run test:flagship`.
- [ ] **Task 8**: Open PR, merge into `main`, and report results.
