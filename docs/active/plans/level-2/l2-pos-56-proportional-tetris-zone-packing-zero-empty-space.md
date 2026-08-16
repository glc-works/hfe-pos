---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Proportional Tetris Zone Packing and Zero Empty Space
description: Eliminates horizontal empty space waste in floor plan zones by packing zone containers proportionally into a 6-slot master canvas with 2D dense grid auto-flow pairing (e.g. 4-slot Poolside Cabana + 2-slot VIP Rooms = 6 slots full row).
tags: [development-plan, level-2, pos, tetris-grid, floor-plan, zero-empty-space]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 56
status: In progress
---

# Hfe POS Proportional Tetris Zone Packing & Zero Empty Space (L2-POS-56)

## Outcome

Eliminates asymmetrical blank space across floor plan zones by implementing Proportional Tetris Zone Packing:

1. **Proportional Container Sizing**:
   - Replaces rigid full-width (`w-full`) zone containers with dynamic column allocations matching table capacities:
     - 6-Table Zones (`Outdoor Garden`, `Indoor AC`): `col-span-6` (Full 6-Slot Row).
     - 4-Table Zones (`Poolside Cabana`, `Rooftop Skybar`): `col-span-4` (4-Slot Container).
     - 2-Table Zones (`VIP Private Rooms`): `col-span-2` (2-Slot Container).
2. **Dense 2D Tetris Auto-Flow (`grid-flow-dense`)**:
   - Automatically packs compatible containers side-by-side in the same row:
     - Row: `Poolside Cabana (4 slots)` + `VIP Rooms (2 slots)` = `6 slots full row` ($0\%$ wasted space).
3. **Internal Zone Grid Sizing**:
   - Internal tables within each zone fill their allocated container columns ($100\%$) without arbitrary right-hand gaps.

## Scope

### Pillar A: Floor Plan Layout & Tetris Sizing
- `src/components/pos/PosTableFloorPlanSection.tsx`: Configure zone wrapper containers with dynamic Tetris column spans (`col-span-4`, `col-span-2`, `col-span-6`) and `grid-cols-6 grid-flow-dense`.
- `src/types/pos.ts`: Ensure `PropertyZoneConfig` supports optional `colSpan` and `rowSpan`.

### Pillar B: Verification & Testing
- `src/tests/tetrisZonePackingZeroEmptySpace.test.ts`: Automated test suite asserting:
  1. Tetris slot sum pairing ($4 + 2 = 6, 3 + 3 = 6$).
  2. Zero empty slot wastage across all multi-zone configurations.
  3. Minimum readable child slot budget ($\ge 105\text{px}$).

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #22: The Proportional Tetris Grid Slicing & Zero-Empty Space Rule.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 67+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that `Poolside Cabana` (4) and `VIP Rooms` (2) sit side-by-side in a single 6-slot row with zero right-hand blank space.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
