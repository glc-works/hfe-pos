---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Pure CSS Territorial Area Classification Engine
description: Implements 100% zero-shift territorial area classification on the single 4-column master Othello grid using native CSS chromatic card surfaces and explicit area micro-badges, eliminating all SVG overhead and guaranteeing 0px table movement.
tags: [development-plan, level-2, pos, area-classification, zero-shift, othello-grid, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 70
status: In progress
---

# Hfe POS Pure CSS Territorial Area Classification Engine (L2-POS-70)

## Outcome

Guarantees 100% zero-shift spatial stability and crystal-clear area classification:

1. **0px Movement & Single Rigid 4-Column Grid**:
   - The master floor plan resides in a single, unbroken CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, uniform responsive `gap-2.5 sm:gap-3`).
   - Normal tables occupy exactly $1 \times 1$ slot (`col-span-1 min-h-[114px] sm:min-h-[122px]`).
   - VIP tables occupy exactly $2 \times 1$ slots (`col-span-1 sm:col-span-2 min-h-[114px] sm:min-h-[122px]`).
   - Absolute horizontal row alignment: `OUT-05.top === OUT-06.top === IND-01.top === IND-02.top` on Row 2 with zero row-splitting header bars.
2. **Instant Area Classification (Territorial Zone Badges & Chromatic Surfaces)**:
   - Every card in Continuous Grid View displays its prominent territorial micro-badge:
     - **Outdoor Garden (`OUT-01..06`)**: `🌿 OUTDOOR` badge with `bg-emerald-950/30 border-emerald-500/30`.
     - **Indoor AC Dining (`IND-01..06`)**: `❄️ INDOOR AC` badge with `bg-cyan-950/30 border-cyan-500/30`.
     - **VIP Private Suites (`VIP-01..02`)**: `👑 VIP SUITE` badge with `bg-amber-950/35 border-amber-500/35`.
     - **Poolside Cabana (`POOL-01..04`)**: `🏊 POOLSIDE` badge with `bg-teal-950/30 border-teal-500/30`.
     - **Rooftop Sky Bar (`ROOF-01..04`)**: `🍸 ROOFTOP` badge with `bg-indigo-950/30 border-indigo-500/30`.
   - Cashiers can identify and classify area boundaries within 0.1 seconds without visual clutter or broken SVG lines.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Render prominent territorial area badges and native chromatic surfaces directly on cards in continuous grid mode.
- `src/components/pos/AreaSurfaceOverlay.tsx`: Maintain lightweight token definitions.

### Pillar B: Verification & Testing
- `src/tests/territorialAreaClassification.test.ts`: Automated test suite asserting:
  1. 0px movement: 4-column master grid direct child invariants.
  2. Strict territorial badge presence for each zone.
  3. Symmetrical 1x1 vs 2x1 slot allocations.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 79+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that every table card clearly shows its area classification with 0px shifting on the master grid.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
