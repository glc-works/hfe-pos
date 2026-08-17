---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Continuous Interlocking Area Surface Engine
description: Implements a decoupled 3-tier floor plan architecture (Rigid Master Grid Coordinates -> Smooth Irregular Area Surface Geometry -> Interactive Table Widgets), rendering continuous interlocking area backdrop islands with smooth convex/concave transitions underneath uniform grid gutters without shifting any table coordinates or row heights.
tags: [development-plan, level-2, pos, area-surface, interlocking-tetris, svg-backdrop, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 67
status: In progress
---

# Hfe POS Continuous Interlocking Area Surface Engine (L2-POS-67)

## Outcome

Implements the decoupled 3-tier Floor Plan Area-Group Geometry:

1. **Decoupled 3-Tier Layer Architecture**:
   - **Layer 0 (Master Grid Coordinate Geometry)**: Strict 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with completely uniform responsive gutters across all boundaries (`A ↔ A === A ↔ B === B ↔ B`).
   - **Layer 1 (Smooth Irregular Area Surface Geometry)**: Continuous area backdrop islands rendered behind same-area widgets. The shared surface flows seamlessly underneath same-area gaps (`[A] gap [A]`) and terminates precisely at cross-area boundaries (`[A] gap [B]`). Smooth convex and concave corners with clean fillet transitions.
   - **Layer 2 (Interactive Table Widgets)**: Normal tables occupy $1 \times 1$ slot, VIP tables occupy $2 \times 1$ slots. Unaltered table card component contracts, high-contrast dark surfaces, zero neon border clutter.
2. **Canonical Interlocking Area Footprint**:
   - **Area A (`Outdoor Garden`)**: Occupies $[(0,0), (1,0), (2,0), (3,0), (0,1), (1,1)]$ (4 + 2 slots).
   - **Area B (`Indoor AC Dining`)**: Occupies $[(2,1), (3,1), (0,2), (1,2), (2,2), (3,2)]$ (2 + 4 slots).
   - **Area C (`VIP Private Rooms`)**: Occupies $[(0,3..1,3), (2,3..3,3)]$ ($2 \times 2$-slots = 4 slots total).
   - **Area D (`Poolside Cabana`)**: Occupies $[(0,4), (1,4), (2,4), (3,4)]$ (4 slots).
   - **Area E (`Rooftop Sky Bar`)**: Occupies $[(0,5), (1,5), (2,5), (3,5)]$ (4 slots).
   - Total: Exactly 24 slots across 6 full rows ($100\%$ filled, $0\%$ wasted space).
3. **Rigid Invariants**:
   - Perfect row alignment: `A5.top === A6.top === B1.top === B2.top` and `A5.height === B1.height`.
   - Area labels do not add header rows or shift grid tracks.
   - 100% spatial stability: operational state mutations (payment, timer, min-spend, name) cause zero table movement or layout reflow.

## Scope

### Pillar A: Layout & Surface Architecture
- `src/components/pos/AreaSurfaceOverlay.tsx`: Dedicated module calculating smooth polygon/SVG area surfaces with convex/concave fillet transitions.
- `src/components/pos/PosTableFloorPlanSection.tsx`: Integrate `AreaSurfaceOverlay` beneath the 4-column master grid in Grid View.

### Pillar B: Verification & Testing
- `src/tests/continuousInterlockingAreaSurface.test.ts`: Automated test suite asserting:
  1. Gutter uniformity across same-area and cross-area boundaries.
  2. Cross-area row alignment parity on row 2 (`A5`, `A6`, `B1`, `B2`).
  3. $1 \times 1$ normal and $2 \times 1$ VIP slot footprint allocations.
  4. Spatial stability under operational state changes.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #11: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 76+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that continuous backdrop surfaces unify each area with smooth corners while preserving the rigid master grid.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
