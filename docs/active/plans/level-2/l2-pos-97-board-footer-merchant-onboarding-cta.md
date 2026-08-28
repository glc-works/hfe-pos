# Level 2 Implementation Plan: L2-POS-97 — BOARD Merchant Storefront Footer Onboarding CTA

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated merchant onboarding CTA in the footer of BOARD (Merchant Public Storefront) across both the React SPA (`LandingPageView.tsx`) and Astro layout (`MerchantStorefrontLayout.astro`), inviting business owners to create their own storefront and integrated POS system by redirecting to `https://pos.hfeit.com`.

**Architecture:** Responsive CTA banner above footer with full i18n support (`useTranslation()`), zero text collision, accessible link markup (`target="_blank" rel="noopener noreferrer"`), and strict adherence to 500-line modularity.

**Tech Stack:** React, Tailwind CSS, Astro 7.2, i18n dictionary, Vitest.

**Spec:** User directive, `ARCHITECTURE.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline is `origin/main` commit `a6686a57289004d9b172053881c69345e10dd19e`.
2. All modified files must stay under the 500-line modularity limit.
3. 100% i18n bound (`t.landing.merchantCta*`).
4. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Implementation Tasks

- [ ] **Task 1**: Add i18n keys for merchant CTA in `src/i18n/types.ts`, `src/i18n/id.ts`, and `src/i18n/en.ts`.
- [ ] **Task 2**: Add CTA banner to `src/components/landing/LandingPageView.tsx`.
- [ ] **Task 3**: Add CTA banner to `packages/storefront-astro/src/layouts/MerchantStorefrontLayout.astro`.
- [ ] **Task 4**: Create unit test `src/tests/boardFooterMerchantCta.test.ts` to assert CTA rendering, URL redirection to `pos.hfeit.com`, and i18n strings.
- [ ] **Task 5**: Run `./scripts/ci-local.sh` and full test suite.
