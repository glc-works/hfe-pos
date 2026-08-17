---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS 4-Column Continuous Interlocking Tetris Rotation Engine
description: Implements a continuous 4-column master grid for Grid View, allowing adjacent zones (Outdoor 4+2 and Indoor 2+4) to interlock seamlessly in 180-degree rotation across 6 full rows (24 total slots for 22 tables), completely eliminating all empty slot gaps while preserving 100% uniform 1x1 standard cards and 2x1 VIP cards.
tags: [development-plan, level-2, pos, interlocking-tetris, 4-column-grid, rotation-engine]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 65
status: In progress
---

# Hfe POS 4-Column Continuous Interlocking Tetris Rotation Engine (L2-POS-65)

## Outcome

Implements the continuous 4-column interlocking Tetris engine across the floor plan in Grid View:

1. **Continuous 4-Column Interlocking Matrix in Grid View (`viewMode === 'grid'`)**:
   - All 22 tables across all 5 zones flow into a **single continuous 4-column master canvas** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`).
   - **Zero Empty Space ($0\%$ Remainder across Entire Canvas)**:
     - **Row 1**: 4 Outdoor tables (`OUT-01`, `OUT-02`, `OUT-03`, `OUT-04`).
     - **Row 2**: 2 Outdoor tables (`OUT-05`, `OUT-06`) + 2 Indoor tables (`IND-01`, `IND-02`) ➔ **Interlocking 180°! 4 tables full!**
     - **Row 3**: 4 Indoor tables (`IND-03`, `IND-04`, `IND-05`, `IND-06`).
     - **Row 4**: 2 VIP tables with 2x1 wide span (`VIP-01`, `VIP-02`) ➔ **4 slots full!**
     - **Row 5**: 4 Poolside tables (`POOL-01`, `POOL-02`, `POOL-03`, `POOL-04`).
     - **Row 6**: 4 Rooftop tables (`ROOF-01`, `ROOF-02`, `ROOF-03`, `ROOF-04`).
     - **Total Mathematics**: $20\text{ standard tables} \times 1\text{ slot} + 2\text{ VIP tables} \times 2\text{ slots} = 24\text{ slots} = 6\text{ rows} \times 4\text{ columns}$ ($100\%$ filled, $0\%$ wasted space!).
2. **Zone Identification & Spatial Clarity**:
   - Each table card features a crisp zone icon/badge (`🌿 OUT-01`, `❄️ IND-02`, `👑 VIP-01`, `🏊 POOL-01`, `🍸 ROOF-01`) for instantaneous cashier cognitive recognition.
3. **Preserved Compact View ($6$-Slot Canvas)**:
   - High-density Tetris canvas ($3+3=6, 2+4=6$) remains active for compact mode.

## Scope

### Pillar A: Floor Plan Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Implement continuous 4-column interlocking layout for Grid View when viewing all zones.

### Pillar B: Verification & Testing
- `src/tests/interlockingTetris4ColGrid.test.ts`: Automated test suite asserting:
  1. 24 total slots across 6 complete rows with 0 remainder.
  2. Outdoor & Indoor 180° interlocking on Row 2.
  3. VIP 2x1 slot allocation on Row 4.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #16: Mathematical Proportion & 8-Point Spatial Grid.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 75+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that Row 2 seamlessly houses `OUT-05`, `OUT-06`, `IND-01`, `IND-02` with zero empty slots.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
