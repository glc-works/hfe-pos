---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Unified Single Canvas 6-Column Compact View
description: Eliminates legacy outer zone container boxes (double-boxing) in Compact View and renders table cards directly on a unified 6-column master canvas with native territorial surfaces, completely resolving text collisions and truncated zone headers.
tags: [development-plan, level-2, pos, compact-view, single-canvas, zero-collision, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 73
status: In progress
---

# Hfe POS Unified Single Canvas 6-Column Compact View (L2-POS-73)

## Outcome

Delivers a clean, unconstrained, zero-collision 6-column master canvas for Compact View:

1. **Elimination of Legacy Outer Zone Double-Boxes**:
   - Removes nested `renderZoneCard` wrappers in Compact View that caused double padding and compressed table card widths below $85\text{px}$.
   - Renders table cards directly as first-class children of the 6-column master grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 pb-20`).
2. **Defensive Zero-Collision Typography & Card Geometry**:
   - Card width is unconstrained and spacious ($\ge 110\text{px}$).
   - **Row 1**: `displayTableName` (e.g. `🌿 OUT-01`) on the left (`truncate flex-1`) $\longleftrightarrow$ Headcount ratio (`👥 3/4`) on the right (`shrink-0 font-mono`). Zero text overlap.
   - **Row 2**: Full-width monetary amount centered with tabular figures (`font-mono tabular-nums`).
   - Compact height: `min-h-[72px] sm:min-h-[76px]`.
3. **Product-Wide Structural Uniformity**:
   - **Grid View**: Direct children of 4-column master canvas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
   - **Compact View**: Direct children of 6-column master canvas (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`).
   - Both modes share identical chromatic zone palettes (`bg-emerald-950/40`, `bg-cyan-950/40`, `bg-amber-950/45`), zero selection ring overrides, and direct 1-tap modal action.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Update Compact View to render tables directly into the 6-column grid without outer zone wrapper cards.

### Pillar B: Verification & Testing
- `src/tests/unified6ColCompactView.test.ts`: Automated test suite asserting:
  1. Compact View direct children count matches total effective tables.
  2. Bounding box and spacing guarantees ($\ge 110\text{px}$ width allocation).
  3. Non-overlapping text bounding box layout.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant ($\ge 105\text{px}$).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 82+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that Compact View renders cleanly on the 6-column grid with zero text collisions.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
