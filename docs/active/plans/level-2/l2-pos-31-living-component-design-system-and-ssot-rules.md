---
okf_version: "0.2"
type: Development Plan Level 2
title: Living Component Design System & Single Source of Truth (SSOT) Rules Showcase
description: Establish an in-app Living Component Showcase and Design System Rulebook (?app=design-system) as the Single Source of Truth (SSOT) for all UI components, Do's & Don'ts, and anti-bleeding heuristics.
tags: [development-plan, level-2, design-system, storybook, component-showcase, ssot-rules]
parent_level_1: l1-pos-suite-modernization
github_issue: 31
status: Proposed
---

# Living Component Design System & Single Source of Truth (SSOT) Rules Showcase

## Outcome

Delivers an interactive, in-app Living Component Showcase & Design System Rulebook serving as the **Single Source of Truth (SSOT)** for all F&B POS and Customer UI components:
1. **SSOT Rulebook & Showcase (`?app=design-system`):** Interactive sandbox displaying live components in isolation with Do's & Don'ts, mobile responsive simulator (380px), props explorer, and rule citations.
2. **Duplication Detection & Protocol:** Establishes the rule that component specifications live exclusively in the living showcase, while markdown documents act solely as thin reference routers.
3. **Core Component Inventory:**
   - `PaymentMethodGrid` (Single-line, no multi-line wrapping)
   - `ProductCard` (Anti-bleeding, currency non-wrap)
   - `TableStatusCard` (Amber Unpaid, Blue Paid, Green Available)
   - `FloatingCartDock` (iOS Safe-Area protection, 100dvh compliance)
   - `CardSettlementEdc` (Auto-detection, no redundant network buttons)
   - `ThemePresetCard` (Miniature mobile mockup preview)
   - `VoucherDrawer` (Multi-voucher stacking)
4. **DevMode Pack Quick Access:** Instant 1-tap navigation button `[ 📚 Design System & Rules ]` in the developer toolbar.

## Scope

- `src/types/pos.ts` (Add `'design-system'` to `PrimaryDomainApp`)
- `src/views/ComponentShowcaseView.tsx` (Living Component Showcase & Rulebook)
- `src/components/dev/DevModePack.tsx` (Add Design System navigation tab)
- `src/App.tsx` (Route `'design-system'`)
- `src/tests/designSystemShowcase.test.ts` (Vitest test suite verifying showcase rendering and SSOT integrity)

## Explicit exclusions

- External heavy npm storybook dependencies (built-in lightweight native Vite React showcase).

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 127+ Vitest unit tests, and production build).
2. Visiting `http://localhost:5173/?app=design-system` renders the full interactive component catalogue with Do's & Don'ts tabs and mobile sandbox.
3. Tapping `[ 📚 Design System & Rules ]` from any view switches seamlessly to the Design System app.
