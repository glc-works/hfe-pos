---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Restore Spacious 4-Column Grid View & Decouple from 6-Slot Compact Mode
description: Decouples Grid View (spacious 4-column layout for relaxed cashier reading with zero text bleeding) from Compact View (high-density 6-slot 2D Tetris packing for 1-screen multi-table operations).
tags: [development-plan, level-2, pos, grid-view, spacious-mode, 4-columns, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 60
status: In progress
---

# Hfe POS Restore Spacious 4-Column Grid View (L2-POS-60)

## Outcome

Strictly separates and decouples the two floor plan presentation modes:

1. **Spacious Grid View (`viewMode === 'grid'`)**:
   - Master Canvas: Standard full-width zone surface containers.
   - Internal Table Grid: Generous 4-Column layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
   - Card Dimensions: Comfortable width ($\ge 200\text{px}$ per card) and height (`min-h-[118px] sm:min-h-[126px]`).
   - VIP Cards: 2-column wide spacious presentation (`col-span-1 sm:col-span-2`).
   - Zero Text Bleeding: Generous padding, relaxed typography, and full guest name visibility.
2. **High-Density Compact View (`viewMode === 'compact'`)**:
   - Master Canvas: 6-Slot 2D Tetris Master Canvas (`grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 grid-flow-dense`).
   - Proportional Tetris Zone Pairing ($3+3=6, 2+4=6$).
   - Compact Micro-Glyph Layout for rush-hour cashier throughput without scrolling.
3. **Tabular List View (`viewMode === 'list'`)**:
   - Clean tabular layout for administrative and audit oversight.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Decouple Grid View master canvas and internal column allocation from Compact View Tetris canvas.

### Pillar B: Verification & Testing
- `src/tests/restoreSpacious4ColGridView.test.ts`: Automated test suite asserting:
  1. 4-column constraint in Grid View.
  2. 6-column Tetris constraint in Compact View.
  3. Zero bleeding across both view modes.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 71+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that Grid View renders spacious 4-column cards with zero text bleeding, while Compact View retains dense 6-slot Tetris packing.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
