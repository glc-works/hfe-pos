---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Adaptive Factor Grid Columns Zero Empty Space
description: Replaces static hardcoded grid columns in Grid View with mathematical adaptive factor column allocation (6 tables -> grid-cols-3, 4 tables -> grid-cols-4, 2 tables -> grid-cols-2), completely eliminating row 2 empty slot gaps while maximizing spacious card width and readability.
tags: [development-plan, level-2, pos, adaptive-factor, grid-columns, zero-empty-space, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 61
status: In progress
---

# Hfe POS Adaptive Factor Grid Columns Zero Empty Space (L2-POS-61)

## Outcome

Eliminates the recurring $4 + 2$ empty space gap in Grid View through dynamic mathematical factor column allocation:

1. **Mathematical Factor Column Partitioning in Grid View (`viewMode === 'grid'`)**:
   - 6-Table Zones (`Outdoor Garden`, `Indoor AC Dining`): Partitioned as `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` ($3\text{ tables} \times 2\text{ rows} = 6\text{ tables}$, $0\text{ remainder/gaps}$).
   - 4-Table Zones (`Poolside Cabana`, `Rooftop Sky Bar`): Partitioned as `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` ($4\text{ tables} \times 1\text{ row} = 4\text{ tables}$, $0\text{ remainder/gaps}$).
   - 2-Table / VIP Zones (`VIP Private Rooms`): Partitioned as `grid-cols-1 sm:grid-cols-2` ($2\text{ tables} \times 1\text{ row} = 2\text{ tables}$, $0\text{ remainder/gaps}$).
2. **Dual-Benefit Delivery**:
   - **Zero Wasted Space ($0\%$ Gap)**: Every row in every zone is completely filled without empty trailing cells.
   - **Maximum Card Breadth & Legibility**: In a 6-table zone, `grid-cols-3` grants each card $33.3\%$ width (significantly more spacious and relaxed than `grid-cols-4`).
3. **Preserved Compact View ($6$-Slot Tetris Canvas)**:
   - Compact mode remains untouched, offering high-density 2D Tetris packing ($3+3=6, 2+4=6$).

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Implement dynamic mathematical factor column resolution for Grid View.

### Pillar B: Verification & Testing
- `src/tests/adaptiveFactorGridColumns.test.ts`: Automated test suite asserting:
  1. Factorization parity ($6 \rightarrow 3, 4 \rightarrow 4, 2 \rightarrow 2$).
  2. Zero row-2 remainder cells across all zone sizes.
  3. Preservation of 6-slot Tetris canvas in Compact View.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 72+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that `Outdoor Garden` and `Indoor AC Dining` render 3 columns by 2 rows with zero empty slots on row 2.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
