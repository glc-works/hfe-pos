---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Native SVG Fillet Path Surface Engine
description: Replaces fragile CSS clip-path with a native SVG path generator featuring smooth convex outer corners and concave inner turns (fillet arcs), rendering continuous, seamless interlocking area backdrop islands behind the 4-column master grid.
tags: [development-plan, level-2, pos, svg-fillet, smooth-perimeter, interlocking-tetris, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 68
status: In progress
---

# Hfe POS Native SVG Fillet Path Surface Engine (L2-POS-68)

## Outcome

Delivers mathematically smooth, unbroken interlocking area backdrop islands:

1. **Native SVG Path Generation with Fillet Arcs**:
   - Replaces brittle `clip-path: polygon(...)` with pure SVG `<path>` elements using precise arc commands:
     - **Convex Outer Corners**: Rounded arcs (`A 20 20 0 0 1 ...`) at external perimeter boundaries.
     - **Concave Inner Turns**: Inverted fillet arcs (`A 16 16 0 0 0 ...`) at the $180^\circ$ Tetris interlocking notch between Outdoor and Indoor on Row 2.
   - Eliminates all razor-sharp $90^\circ$ jagged corners, broken border cuts, and coordinate drifting.
2. **Normalized Vector Precision (`vectorEffect="non-scaling-stroke"`)**:
   - SVG paths scale smoothly across viewport sizes while maintaining a uniform, crisp 1.5px border stroke.
   - Matte, low-opacity fills (`0.05` opacity) provide subtle territorial grouping without visual noise.
3. **Rigid Invariants Maintained**:
   - Rigid 4-column master grid (`grid-cols-4`) for interactive table widgets.
   - Identical row alignment: `A5.top === A6.top === B1.top === B2.top`.
   - Uniform responsive gutters across same-area and cross-area boundaries.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/AreaSurfaceOverlay.tsx`: Implement native SVG fillet path generator with convex/concave arc math.
- `src/components/pos/PosTableFloorPlanSection.tsx`: Bind `AreaSurfaceOverlay` as clean SVG underlay.

### Pillar B: Verification & Testing
- `src/tests/svgFilletAreaSurface.test.ts`: Automated test suite asserting:
  1. SVG path generation contains both convex (`0 0 1`) and concave (`0 0 0`) arc commands.
  2. Smooth fillet radius invariants ($r \ge 16\text{px}$).
  3. Continuous non-scaling stroke styling.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 77+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that the interlocking notch between Outdoor and Indoor displays a smooth, unbroken fillet curve.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
