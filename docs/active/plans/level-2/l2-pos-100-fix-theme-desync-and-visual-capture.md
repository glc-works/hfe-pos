# Level 2 Implementation Plan: L2-POS-100 — Theme Desynchronization Repair & Mandatory Visual Proof Protocol

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate dark-on-dark text contrast in Customer QR views caused by desynchronization between `themeMode` and `customerTheme`, enforce mathematical contrast fail-safes in `ProductCard` and `CustomerMobileView`, and execute mandatory Playwright visual screenshot verification in both Day and Night modes.

**Architecture:** Sync logic in `MerchantConfigContext.tsx`, contrast guards in `CustomerMobileView.tsx`, `CustomerHeader.tsx`, and `ProductCard.tsx`, and visual verification script in `scripts/capture-day-night-contrast.cjs`.

**Tech Stack:** React, Tailwind CSS, TypeScript, Playwright, Vitest.

**Spec:** `ARCHITECTURE.md`, `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Implementation Tasks

- [ ] **Task 1**: Synchronize `customerTheme` state with `themeMode` in `src/context/MerchantConfigContext.tsx`.
- [ ] **Task 2**: Harden contrast fallback in `src/views/CustomerMobileView.tsx`, `CustomerHeader.tsx`, and `src/components/shared/ProductCard.tsx`.
- [ ] **Task 3**: Create and run Playwright visual capture script `scripts/capture-day-night-contrast.cjs` to save screenshots of Day Mode and Night Mode.
- [ ] **Task 4**: Run `./scripts/ci-local.sh` and Playwright flagship test suite.
- [ ] **Task 5**: Verify screenshots visually before handover.
