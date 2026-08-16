---
okf_version: "0.2"
type: Development Plan Level 2
title: True Single Unified Top Bar Architecture & DevKit v2.0 Suite
description: Eliminate the 2-tier stacked header completely by fusing Staff Surface App Switcher into the Unified POS Command Bar (Single 48px Header with App Drawer + View Switcher + Quick Actions). Upgrade DevKit with Global ViewportContext, Collapsible Floating DevBar, and 1-Tap State Reseed.
tags: [development-plan, level-2, true-single-top-bar, devkit-v2, viewport-context, fnb-ergonomics]
parent_level_1: l1-pos-suite-modernization
github_issue: 40
status: Proposed
---

# True Single Unified Top Bar Architecture & DevKit v2.0 Suite

## Outcome

1. **True Single Top Bar on Cashier Screen (Zero Secondary Bars):**
   - Eliminate external `StaffSubNavigator` when in POS view.
   - Fuse App Switcher `[ 🎛️ Kasir POS ▾ ]` directly into `PosCommandHeader.tsx` on the far left.
   - Entire screen height is 85%+ dedicated to Table Floor Plan and Catalog, with zero stacked bars.
2. **Global Viewport Context Provider (`src/context/ViewportContext.tsx`):**
   - Provide explicit `isMobile`, `isTablet`, `isDesktop`, `viewportMode` down the React tree so child components in the device simulator frame are 100% container-aware and never tricked by laptop browser window widths.
3. **DevKit v2.0 Upgrades (`DevModePack.tsx`):**
   - Add Collapsible/Minimizable DevBar: click `[ 🗜️ ]` to collapse the dev bar into a floating `[ 🛠️ DevKit ]` pill for 100% pristine full-screen device presentation.
   - Add `[ 🔄 Reset State ]` button to restore clean initial mock orders and table statuses in 1 click.

## Scope

- `src/context/ViewportContext.tsx` (NEW: Viewport Context & custom hook `useViewport`)
- `src/components/dev/DevModePack.tsx` (DevKit v2.0 with collapsible floating pill, state reset trigger, and ViewportProvider)
- `src/components/pos/PosCommandHeader.tsx` (Integrated with App Drawer selector `[ 🎛️ Kasir POS ▾ ]` on the left)
- `src/views/UnifiedPosView.tsx` (Wired with App Drawer modal and single top command bar)
- `src/App.tsx` (Skip standalone `StaffSubNavigator` in POS mode to guarantee strictly 1 top bar)
- `src/tests/trueSingleTopBarAndDevkit.test.ts` (Vitest test suite verifying single top bar architecture and ViewportContext)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001 & GLC-FNB-UX-002)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 146+ Vitest unit tests, and production build).
2. POS view displays exactly ONE top bar across all viewports (mobile simulator, tablet, desktop).
3. DevBar can be collapsed/expanded seamlessly with zero layout jump.
