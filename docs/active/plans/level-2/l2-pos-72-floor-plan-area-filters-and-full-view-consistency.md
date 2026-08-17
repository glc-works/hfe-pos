---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Floor Plan Area Filters and Full View Consistency
description: Repairs and activates the interactive area filter dropdown and status pills across all floor plan view modes (Grid, Compact, and Single Zone), synchronizing parent and local zone states and ensuring 100% chromatic and behavioral consistency across the entire floor plan suite.
tags: [development-plan, level-2, pos, area-filters, zone-dropdown, view-consistency, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 72
status: In progress
---

# Hfe POS Floor Plan Area Filters and Full View Consistency (L2-POS-72)

## Outcome

Delivers fully functional, reactive area filtering and complete view consistency:

1. **Reactive Area Filter Dropdown & Status Pills**:
   - The area selector dropdown (`Semua Area ▾`) opens an interactive popover listing all property zones (`Semua Area`, `Outdoor Garden`, `Indoor AC Dining`, `VIP Private Rooms`, `Poolside Cabana`, `Rooftop Sky Bar`).
   - Selecting a zone instantly filters the displayed table roster across Grid View, Compact View, and List View.
   - Status pills (`Semua`, `Tagihan`, `Kosong`) reactively combine with area filtering for multi-criteria table discovery.
2. **Product-Wide Floor Plan Consistency**:
   - **Grid View (4-Col Master Grid)**: Clean chromatic zone surfaces (`bg-emerald-950/40`, `bg-cyan-950/40`, `bg-amber-950/45`), 0px shifting, 1-tap direct modal action.
   - **Compact View (6-Col Master Grid)**: Inherits identical chromatic zone surfaces, zero selection ring overrides, tactile touch, direct modal pop-up.
   - **Single Filtered Zone View**: Clean 4-column layout dedicated to the selected zone with full operational metrics and identical card styling.
3. **SSOT State Synchronization**:
   - Eliminates state desynchronization between `UnifiedPosView` parent props and `PosTableFloorPlanSection` internal state.

## Scope

### Pillar A: Layout & Filtering Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Synchronize zone filtering state, activate interactive area dropdown, and unify card styling across Compact View and Filtered View.

### Pillar B: Verification & Testing
- `src/tests/floorPlanAreaFilters.test.ts`: Automated test suite asserting:
  1. Area filter accurately narrows table roster (All = 22, Outdoor = 6, Indoor = 6, VIP = 2).
  2. Multi-criteria filtering (Area + Status).
  3. Style uniformity across all 3 view modes.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 81+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that clicking area filter items immediately filters the floor plan in both Grid and Compact views.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
