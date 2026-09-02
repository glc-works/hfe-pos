# Level 2 Implementation Plan: L2-POS-99 — QR Order Scrollbar and Universal Theme Contrast Hardening

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate native horizontal scrollbars obstructing category buttons across customer QR ordering and POS surfaces by registering universal `.no-scrollbar` / `.scrollbar-none` utilities in CSS, and refactor search bars and customer drawers to use dynamic theme tokens, preventing dark box contrast clashing on light/cream themes.

**Architecture:** Global CSS enhancements in `src/index.css`, customer domain widget hardening in `src/components/customer/`, and automated regression test expansion in `src/tests/themeContrastAudit.test.ts`.

**Tech Stack:** React, Tailwind CSS, TypeScript, Vitest.

**Spec:** `ARCHITECTURE.md`, `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `e43599c4e6865cae7578515d22eb3c5468b7ee20`.
2. All modified files must stay under the 500-line modularity limit.
3. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Add universal `.no-scrollbar` and `.scrollbar-none` CSS rules to `src/index.css`.
- [ ] **Task 2**: Update `src/components/customer/CustomerCatalogView.tsx` search bar to use dynamic `activeTheme` styling.
- [ ] **Task 3**: Update `src/components/customer/TableSessionDrawer.tsx`, `ActiveOpenBillDrawer.tsx`, `MerchantDetailDrawer.tsx`, and `CustomerProfileDrawer.tsx` to use cohesive theme tokens.
- [ ] **Task 4**: Expand `src/tests/themeContrastAudit.test.ts` to assert CSS scrollbar rule existence and theme-cohesive inputs.
- [ ] **Task 5**: Verify modularity (< 500 lines) and run `./scripts/ci-local.sh` and Playwright flagship test suite.
