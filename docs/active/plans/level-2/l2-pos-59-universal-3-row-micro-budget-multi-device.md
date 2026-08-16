---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Universal 3-Row Micro-Budget Multi-Device Parity
description: Enforces a universal 3-row layout structure across both standard and VIP table cards, eliminating vertical aspect-ratio disparity, text truncation, and multi-device clipping across mobile (375px), tablet (768px), and desktop POS (1024px+).
tags: [development-plan, level-2, pos, responsive-grid, 3-row-budget, multi-device]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 59
status: In progress
---

# Hfe POS Universal 3-Row Micro-Budget Multi-Device Parity (L2-POS-59)

## Outcome

Harmonizes table card dimensions and text layout across all device viewports:

1. **Universal 3-Row Micro-Budget Layout**:
   - **Row 1 (Header)**: Table Identifier + Occupancy/Capacity Utilization (`👥 2/4` or `👥 8/10`) + Elapsed Timer (`⏱️ 30m` or `⏱️ 75m`).
   - **Row 2 (Body)**: Guest Name with defensive flexbox allocation (`flex-[3] truncate`) + Menu micro-badge (`🍽️ 3`) + VIP compact progress indicator (`👑 74% • Sisa 650k`).
   - **Row 3 (Footer)**: Order / Dine-In Tag + Tabular Price (`font-mono tabular-nums`).
2. **Multi-Device Responsive Parity**:
   - Mobile ($375 \times 812$): `min-h-[76px]` fluid flex container.
   - Tablet ($768 \times 1024$): `min-h-[96px]` balanced grid.
   - Desktop / POS ($1024\text{px}+$): `min-h-[112px]` symmetric $3\times2$ Tetris blocks.
3. **Zero Text Truncation**:
   - Eliminates single-character truncation (`"A"`, `"Je..."`) through defensive sub-container isolation and glyph-first micro-badges.

## Scope

### Pillar A: Layout Component Updates
- `src/components/pos/PosTableFloorPlanSection.tsx`: Harmonize occupied card rendering into unified 3-row layout for both standard and VIP cards.

### Pillar B: Verification & Testing
- `src/tests/universal3RowMicroBudget.test.ts`: Automated test suite asserting:
  1. 3-row budget compliance across standard and VIP cards.
  2. Multi-device responsive height token constraints.
  3. Text truncation safety with long guest names.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #9: The Glyph-First Micro-Budget Invariant.
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 70+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection across Desktop (1280x800) and Mobile (375x812) that card heights are uniform and guest names render cleanly.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
