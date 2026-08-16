---
okf_version: "0.2"
type: Development Plan Level 2
title: Theme Selector Miniature Preview & Merchant Settings UI Cleanup
description: Replace cramped theme pills with visual miniature mobile mockups, instant live CSS variable binding, 100% offline-first local color engine, and declutter CafeSettingsView.
tags: [development-plan, level-2, theme-selector, pos-ux, merchant-settings, offline-first]
parent_level_1: l1-pos-suite-modernization
github_issue: 28
status: Proposed
---

# Theme Selector Miniature Preview & Merchant Settings UI Cleanup

## Outcome

Delivers a high-fidelity Apple/Shopify-grade Theme Selection suite in `CafeSettingsView.tsx` with:
1. **Interactive Miniature Mobile Mockup Cards** displaying actual visual previews (Header, Product Card, Price, and Cart Dock) along with 3-color palette swatches and non-truncated theme names.
2. **Instant Live Real-Time Canvas Feedback** updating root CSS variables (`--brand-primary`, `--brand-header-bg`, `--brand-card-bg`, etc.) upon 1-tap selection.
3. **100% Local Offline-First Color Engine** (Zero external AI API calls, 0 token costs, runs completely offline via local deterministic color algorithms).
4. **Decluttering `CafeSettingsView.tsx`** removing wall-of-text instructions and nested card boxes.

## Scope

- `src/components/settings/ThemeSelectorSection.tsx` (New modular component encapsulating Theme cards and local mood color picker)
- `src/components/settings/AiThemePromptModal.tsx` (New clean modal with 1-tap mood chips running on 100% local color engine)
- `src/views/CafeSettingsView.tsx` (Clean integration of `ThemeSelectorSection.tsx`, removal of legacy cluttered boxes)
- `src/data/mockData.ts` (Enriched theme preset metadata including swatch colors & preview styles)
- `src/tests/themeSelector.test.ts` (Unit test verifying theme switching, CSS variable generation, and fallback resilience)

## Explicit exclusions

- Back-office POS backend database mutations (pre-production in-memory state).
- External LLM / AI API integration (strictly 0 token consumption, 100% offline-first).
- Changes to Customer QR ordering workflow (stays intact).
- Changes to KDS cooking ticket lifecycle (stays intact).

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)
- DevMode Pack Standard: `docs/active/standards/DEVMODE-PACK-SPEC.md` (GLC-DEV-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 120+ Vitest unit tests, and production build).
2. Zero network requests made to any external AI API endpoints (verified in unit tests).
3. Theme cards render with full readable titles (zero `Mo...` truncation) and clear mobile miniature mockups.
4. Tapping a theme immediately applies the new palette across the app and offers a 1-tap "Lihat di Layar Pelanggan" button.

## Stop conditions

- Scope creep into untouched back-office modules (Warehouse, Branch Sync).
- Any TypeScript compilation failure or modularity threshold violation (>500 lines).
