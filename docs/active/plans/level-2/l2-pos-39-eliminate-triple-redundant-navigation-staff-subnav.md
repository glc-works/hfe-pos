---
okf_version: "0.2"
type: Development Plan Level 2
title: Eliminate Triple Redundant Navigation in Staff Sub-Navigator (Clean Adaptive Gold Standard)
description: Eliminate the 3-way navigation redundancy in StaffSubNavigator where left drawer pill, center tabs, and right drawer button all performed the exact same action. Implement clean adaptive navigation (direct 5-tab bar on desktop/tablet, single compact app selector pill on mobile, zero flank duplicates).
tags: [development-plan, level-2, navigation-cleanup, zero-redundancy, fnb-ergonomics, apple-ui-purity]
parent_level_1: l1-pos-suite-modernization
github_issue: 39
status: Proposed
---

# Eliminate Triple Redundant Navigation in Staff Sub-Navigator (Clean Adaptive Gold Standard)

## Outcome

1. **Zero Redundancy Navigation Hierarchy:**
   - Remove redundant right-hand button `[ App Drawer (5 Suites) ]` completely.
   - On Desktop/Tablet: Present the 5 direct workstation tabs (`Kasir POS`, `Dapur KDS`, `Insights`, `Gudang & Cabang`, `Pengaturan`) without duplicate flanking buttons.
   - On Mobile: Present a single, sleek App Selector Pill `[ 🎛️ Kasir POS ▾ ]` triggering the launchpad, paired with a right status badge.
2. **Crystal-Clear Mental Model for Cashiers & Staff:**
   - No conflicting buttons, no duplicate paths, 100% intuitive and clutter-free.

## Scope

- `src/components/common/StaffSubNavigator.tsx` (Adopt clean adaptive layout, remove duplicate drawer button)
- `src/tests/staffSubNavZeroRedundancy.test.ts` (Vitest test suite verifying zero-redundancy navigation logic)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 144+ Vitest unit tests, and production build).
2. Desktop view shows 5 direct tabs with zero duplicate flank buttons.
3. Mobile view shows 1 clean app selector pill.
