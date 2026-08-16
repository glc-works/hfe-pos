---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Symmetric 3x2 Tetris Zone Pairing
description: Eliminates horizontal and vertical 4+2 wrapping gaps in 6-table zones (Outdoor and Indoor) by partitioning them into symmetric 3x2 modular blocks (3 columns wide x 2 rows tall) that pair together into a 100% full 6-slot master canvas ($3 + 3 = 6$).
tags: [development-plan, level-2, pos, tetris-grid, symmetric-3x2, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 58
status: In progress
---

# Hfe POS Symmetric 3x2 Tetris Zone Pairing (L2-POS-58)

## Outcome

Eliminates the $4 + 2$ asymmetrical table wrapping gap in 6-table zones by implementing Symmetric $3 \times 2$ Tetris Zone Pairing:

1. **Symmetric $3 \times 2$ Multi-Row Zone Blocks**:
   - 6-Table Zones (`Outdoor Garden`, `Indoor AC Dining`): Partitioned as `col-span-3 row-span-2 h-full` with an internal `grid-cols-3` arrangement ($3\text{ tables wide} \times 2\text{ tables tall} = 6\text{ tables}$).
2. **Horizontal $3 + 3 = 6$ Side-by-Side Pairing**:
   - `Outdoor Garden (3x2)` sits in Columns 1–3 across Rows 1–2.
   - `Indoor AC Dining (3x2)` sits in Columns 4–6 across Rows 1–2.
   - Sum: $\mathbf{3\text{ slots}} + \mathbf{3\text{ slots}} = \mathbf{6\text{ slots full row}}$ spanning 2 vertical rows with **ZERO EMPTY CELLS**!
3. **Harmonious Global Floor Plan Composition**:
   - Rows 1 & 2: `[ Outdoor Garden (3x2) ] + [ Indoor AC Dining (3x2) ]` = $3 + 3 = 6$ slots ($100\%$ filled).
   - Rows 3 & 4: `[ VIP Private Rooms (2x2) ] + [ Poolside Cabana (4x1) ] + [ Rooftop Sky Bar (4x1) ]` = $2 + 4 = 6$ slots ($100\%$ filled).

## Scope

### Pillar A: Floor Plan Layout & Tetris Sizing
- `src/components/pos/PosTableFloorPlanSection.tsx`: Configure 6-table zones to use `lg:col-span-3 lg:row-span-2` with `grid-cols-3` internal packing.

### Pillar B: Verification & Testing
- `src/tests/symmetric3x2TetrisZonePairing.test.ts`: Automated test suite asserting:
  1. 6-table factorization ($3 \times 2 = 6$).
  2. $3 + 3 = 6$ master canvas row sum pairing with zero empty slots.
  3. Total floor plan area utilization ($100\%$).

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #22: The Proportional Tetris Grid Slicing & Zero-Empty Space Rule.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 69+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that `Outdoor Garden` and `Indoor AC Dining` form two symmetric $3\times2$ blocks sitting side-by-side ($3+3=6$) with zero empty cells on Row 2.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
