---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Strict 4-Slot Grid View and 6-Slot Compact View Canvas
description: Locks the Floor Plan spatial architecture to a strict 4-column canvas for Grid View (uniform 1x1 standard cards and 2x1 VIP cards) and a strict 6-column canvas for Compact View (dense Tetris zero-scroll packing).
tags: [development-plan, level-2, pos, grid-view, compact-view, 4-slot, 6-slot]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 64
status: In progress
---

# Hfe POS Strict 4-Slot Grid View & 6-Slot Compact View Canvas (L2-POS-64)

## Outcome

Enforces the definitive dual-canvas spatial rule across the entire floor plan:

1. **Grid View (`viewMode === 'grid'`) ➔ Strict 4-Slot Canvas (`grid-cols-4`)**:
   - All zones without exception render on a **strict 4-column grid** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`).
   - Every standard table card occupies **exactly 1x1 slot ($25\%$ width)**, guaranteeing $100\%$ uniform width across the entire restaurant.
   - VIP table cards occupy **2x1 slots (`col-span-2`, $50\%$ width)** in Grid View, matching executive prominence.
   - Zero unnatural 3-column stretching.
2. **Compact View (`viewMode === 'compact'`) ➔ Strict 6-Slot Canvas (`grid-cols-6`)**:
   - Master layout renders on a **strict 6-column Tetris canvas** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3`).
   - Proportional Tetris packing ($3+3=6, 2+4=6$) packs all 22+ tables on a single screen without scrolling.
3. **Atomic Component Parity**:
   - Standard and VIP cards share identical typographic hierarchy, left-aligned tabular price, and top anchors.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Enforce `grid-cols-4` strictly for all zones in Grid View, and preserve `grid-cols-6` in Compact View.

### Pillar B: Verification & Testing
- `src/tests/strict4ColGrid6ColCompactCanvas.test.ts`: Automated test suite asserting:
  1. Grid View strict 4-column invariant across all zones.
  2. Compact View strict 6-column Tetris invariant.
  3. Uniform $25\%$ card width in Grid View.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 74+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection across Grid View (4 slots) and Compact View (6 slots).

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
