---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Symmetric Othello Grid and Zone Territorial Surfaces
description: Eliminates floating SVG wireframe strokes and implements native, robust chromatic zone surfaces across the strict 4-column Othello master grid, guaranteeing zero-collision boundaries between area islands and pixel-perfect baseline symmetry across all rows.
tags: [development-plan, level-2, pos, othello-grid, zone-surfaces, zero-collision, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 69
status: In progress
---

# Hfe POS Symmetric Othello Grid and Zone Territorial Surfaces (L2-POS-69)

## Outcome

Delivers a pixel-perfect, clean, wire-free Othello floor plan layout:

1. **Strict Symmetrical Othello Grid Coordinates**:
   - Single responsive 4-column master grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, uniform responsive `gap-2.5 sm:gap-3`).
   - Normal tables occupy exactly $1 \times 1$ slot.
   - VIP tables occupy exactly $2 \times 1$ slots.
   - 100% identical row height and `top` baseline alignment across all cards in each row (Row 2: `OUT-05.top === OUT-06.top === IND-01.top === IND-02.top`).
2. **Zero-Collision Territorial Island Surfaces**:
   - Eliminates all floating SVG stroke wireframes and coordinate drift.
   - Area islands are expressed through cohesive, luxury matte chromatic surfaces:
     - **Outdoor Garden**: Emerald ambient surface (`bg-emerald-950/25 border-emerald-500/25`).
     - **Indoor AC Dining**: Frost Cyan ambient surface (`bg-cyan-950/25 border-cyan-500/25`).
     - **VIP Private Rooms**: Imperial Amber ambient surface (`bg-amber-950/30 border-amber-500/35`).
     - **Poolside Cabana**: Teal ambient surface (`bg-teal-950/25 border-teal-500/25`).
     - **Rooftop Sky Bar**: Indigo ambient surface (`bg-indigo-950/25 border-indigo-500/25`).
   - Clean neutral channels between distinct area islands (e.g. Row 2 frontier between `OUT-06` and `IND-01` is separated cleanly by the native grid gap with zero wire crossing or color bleeding).

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/AreaSurfaceOverlay.tsx`: Clean up floating wireframe strokes.
- `src/components/pos/PosTableFloorPlanSection.tsx`: Apply native chromatic zone surface styles to cards in continuous grid mode while preserving all operational state badges (unpaid amber, paid indigo, selected glow).

### Pillar B: Verification & Testing
- `src/tests/symmetricOthelloGrid.test.ts`: Automated test suite asserting:
  1. Othello symmetry: 1x1 normal vs 2x1 VIP slot allocation.
  2. Zero wireframe stroke collisions.
  3. Strict zone chromatic assignment.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 78+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that the floor plan renders as a clean, wire-free Othello board with distinct territorial islands.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
