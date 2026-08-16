---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS iOS/Android Modular Widget Matrix Floor Plan
description: Implements a unified iOS/Android Home Screen Widget Grid Matrix (1x1 standard cards, 2x1 wide cards, continuous grid tracks with col-span-full section banners), eliminating all asymmetrical container boxing, baseline shift, and layout misalignments.
tags: [development-plan, level-2, pos, widget-matrix, ios-grid, modular-floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 63
status: In progress
---

# Hfe POS iOS/Android Modular Widget Matrix Floor Plan (L2-POS-63)

## Outcome

Transforms the floor plan into a pure, unified iOS/Android Widget Grid Matrix:

1. **Continuous Master Grid Matrix**:
   - Entire floor plan lives on a single, continuous CSS Grid with inviolable column and row tracks:
     - **Grid View**: 4 generous columns across (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`).
     - **Compact View**: 6 columns across (`grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5`).
2. **Modular 1x1 and 2x1 Widget Blueprint**:
   - **Standard Table**: 1x1 Modular Widget (`col-span-1 min-h-[110px]`).
   - **VIP Table**: 2x1 Modular Widget in Grid View (`col-span-1 sm:col-span-2 min-h-[110px]`) or 1x1 Gold Widget in Compact View.
   - **Atomic Component Unity**: 100% identical typographic hierarchy, left-aligned tabular price, and top right timer/capacity anchors.
3. **Full-Width Section Banners (`col-span-full`)**:
   - Eliminates nested border containers that cause baseline shifts.
   - Zone metadata is presented as clean, sleek horizontal section headers (`col-span-full`) that span across all columns without interrupting grid tracks.
4. **Pixel-Perfect Alignment**:
   - 100% of card top borders, bottom borders, and baseline rows align identically across every zone.

## Scope

### Pillar A: Floor Plan Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Refactor into unified continuous iOS Widget Matrix with `col-span-full` zone banners and standardized atomic `<TableCard>` rendering.

### Pillar B: Verification & Testing
- `src/tests/iosWidgetMatrixFloorPlan.test.ts`: Automated test suite asserting:
  1. Continuous grid track alignment without nested container offsets.
  2. 1x1 and 2x1 modular widget sizing invariants.
  3. Strict baseline and horizontal alignment parity.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.
- Invariant Rule #16: Mathematical Proportion & 8-Point Spatial Grid.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 73+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that all table cards align on identical row and column tracks with zero baseline shift.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
