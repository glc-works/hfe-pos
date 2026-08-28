# Level 2 Implementation Plan: L2-POS-98 — EXP.Hfeit Positioning: 'A System That Grows With You' (Issue #93)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the EXP.Hfeit landing experience with the approved positioning narrative: **"A system that grows with you • Satu Sistem untuk Setiap Tahap Bisnismu"**, avoiding awkward jargon like "replatforming", and highlighting the growth journey from single store to enterprise network on one unified engine.

**Architecture:** Update Astro storefront translations (`packages/storefront-astro/src/i18n/translations.ts`) and React in-app EXP landing views (`ExpSuiteLandingView.tsx`), with full i18n support in ID and EN.

**Tech Stack:** Astro 7.2, React, Tailwind CSS, TypeScript, Vitest.

**Spec:** Issue #93, `ARCHITECTURE.md`, `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `466dbd6d53211bef571f4cb57d96ede9c07fb83d`.
2. All modified files must stay under the 500-line modularity limit.
3. No unverified TPS numbers or premature certification claims.
4. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Update `packages/storefront-astro/src/i18n/translations.ts` hero badge, title parts, and subtitle for ID and EN.
- [ ] **Task 2**: Update `src/views/ExpSuiteLandingView.tsx` hero badge, title, and subtitle.
- [ ] **Task 3**: Update unit tests in `src/tests/expSuiteLandingAndProductSextet.test.ts`.
- [ ] **Task 4**: Run `./scripts/ci-local.sh` and Playwright flagship test suite.
