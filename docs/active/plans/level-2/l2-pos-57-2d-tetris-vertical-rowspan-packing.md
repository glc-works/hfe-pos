---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS 2D Tetris Vertical RowSpan Packing
description: Implements explicit 2D vertical row-span (`row-span-2`) packing on multi-row floor plan zone containers (such as tall VIP rooms), allowing subsequent 4-slot single-row zones (e.g. Rooftop Sky Bar) to automatically slip into the horizontal gap beneath Poolside Cabana, achieving 100% full rectangular packing across two rows ($6 \times 2$).
tags: [development-plan, level-2, pos, tetris-grid, vertical-rowspan, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 57
status: In progress
---

# Hfe POS 2D Tetris Vertical RowSpan Packing (L2-POS-57)

## Outcome

Achieves true multi-dimensional 2D Tetris packing across floor plan zones by adding explicit `row-span-2` support:

1. **Tall Multi-Row Zone Spanning**:
   - `VIP PRIVATE ROOMS` (containing vertically stacked VIP cards): Declared as `col-span-2 row-span-2 h-full` on large screens.
2. **Horizontal Single-Row Zone Ingress**:
   - `POOLSIDE CABANA` (4 tables in 1 row): Declared as `col-span-4 row-span-1` (sits on Row 1, right of VIP).
   - `ROOFTOP SKY BAR` (4 tables in 1 row): Declared as `col-span-4 row-span-1` (automatically slips into Row 2, beneath Poolside Cabana and to the right of VIP).
3. **100% Rectangular $6 \times 2$ Dense Grid Composition**:
   - Eliminates all vertical and horizontal gaps, locking the three zones into a unified $6\text{ slots} \times 2\text{ rows}$ block.

## Scope

### Pillar A: Layout Component Updates
- `src/components/pos/PosTableFloorPlanSection.tsx`: Declare `row-span-2 h-full` on multi-row/VIP zones and `row-span-1` on single-row zones with `grid-flow-dense`.

### Pillar B: Verification & Testing
- `src/tests/tetrisVerticalRowspanPacking.test.ts`: Automated test suite asserting:
  1. $2\text{D}$ Tetris cell allocation across rows ($\text{Row 1: } 2 + 4 = 6, \text{Row 2: } 2 + 4 = 6$).
  2. Total cell area calculation ($12\text{ unit blocks} = 100\%$ filled).

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #22: The Proportional Tetris Grid Slicing & Zero-Empty Space Rule.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 68+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that `Rooftop Sky Bar` sits directly below `Poolside Cabana` next to `VIP Rooms` without empty gaps.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
