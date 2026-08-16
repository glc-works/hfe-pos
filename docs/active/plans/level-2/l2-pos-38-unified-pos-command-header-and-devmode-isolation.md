---
okf_version: "0.2"
type: Development Plan Level 2
title: Unified POS Single Command Header & DevMode Frame Isolation (Industry Gold Standard)
description: Eliminate the 3-tier stacked header trap in POS cashier workstation by unifying App Switcher, View Switcher (Meja/Katalog), and Quick Actions into a single 44px command strip, removing redundant intermediate floor plan headers, and isolating DevMode toolbar outside the device simulator canvas.
tags: [development-plan, level-2, layout-redesign, single-command-bar, fnb-ergonomics, toast-esb-benchmark]
parent_level_1: l1-pos-suite-modernization
github_issue: 38
status: Proposed
---

# Unified POS Single Command Header & DevMode Frame Isolation (Industry Gold Standard)

## Outcome

1. **Elimination of the 3-Tier "Stacked Header Trap":**
   - Combine View Switcher (`🗺️ Peta Meja` / `📚 Katalog Menu`) and Quick Action Buttons (`🛎️ Sambut`, `📷 Scan`, `⇄ Split`) into **ONE sleek, unified 44px POS Command Header** in `UnifiedPosView.tsx`.
   - Remove redundant duplicate intermediate card `Status Floor Plan Meja` from `PosTableFloorPlanSection.tsx`.
2. **Maximum Cashier Screen Efficiency (80%+ Working Viewport):**
   - Free up 120px+ of vertical space on mobile and tablet screens, allowing 6-8 table cards to be visible simultaneously without vertical crowding.
3. **Strict DevMode Toolbar Isolation (`DevModePack.tsx`):**
   - Keep DevMode toolbar strictly on a single 38px outer bar that never overflows or leaks into the simulated mobile frame canvas.
   - Enforce `overflow-hidden` on simulator frames and viewports.

## Scope

- `src/components/dev/DevModePack.tsx` (Single 38px compact dev bar + strict frame canvas boundary)
- `src/components/common/StaffSubNavigator.tsx` (Compact 40px single-row staff surface bar)
- `src/views/UnifiedPosView.tsx` (Consolidate view switcher & action buttons into 1 unified command bar)
- `src/components/pos/PosTableFloorPlanSection.tsx` (Remove duplicate header card, starting directly with clean filter pills)
- `src/tests/unifiedPosCommandHeader.test.ts` (Vitest test suite verifying single command header architecture and no-overlap layout)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 142+ Vitest unit tests, and production build).
2. Mobile simulator displays exactly 1 compact top bar, 1 segmented view switcher, and immediately transitions into table cards with 80% screen space.
3. Zero double-stacked headers, zero text clipping.
