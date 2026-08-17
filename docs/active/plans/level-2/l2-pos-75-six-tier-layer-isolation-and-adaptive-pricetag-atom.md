---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS 6-Tier Layer Isolation and Adaptive PriceTag Atom
description: Enforces strict Single Source of Truth (SSOT) 6-Tier Domain Layer Isolation by elevating adaptive currency formatting into Tier 2 React Aria Atom (<PriceTag />) and Tier 1 LanguageContext, completely removing ad-hoc formatting logic from Tier 4 layout assemblies.
tags: [development-plan, level-2, pos, 6-tier-matrix, layer-isolation, pricetag-atom, adaptive-currency]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 75
status: In progress
---

# Hfe POS 6-Tier Layer Isolation and Adaptive PriceTag Atom (L2-POS-75)

## Outcome

Enforces the 6-Tier Atomic Domain Hierarchy with strict layer isolation:

1. **Tier 1 (Design Tokens & Language Context)**:
   - `LanguageContext.tsx` provides authoritative `formatPrice` and `formatCompactPrice` utilities.
2. **Tier 2 (React Aria Atoms - `src/ui/PriceTag.tsx`)**:
   - Enhances `<PriceTag />` with `mode?: 'full' | 'compact' | 'adaptive'` and `isVipSpan?: boolean`.
   - In `mode="adaptive"`: Automatically renders full price when fitting or compact price (`24.5M`, `48M`, `1.85B` / `24,5 Jt`, `48 Jt`, `1,85 Bio`) when exceeding 10 characters in narrow 1-slot containers.
   - Pure props, tabular figures (`font-mono tabular-nums`), zero domain logic.
3. **Tier 4 (Widget Assemblies - `PosTableFloorPlanSection.tsx`)**:
   - Replaces inline price formatting with the Tier 2 `<PriceTag />` atom.
   - Table cards and zone headers consume `<PriceTag />` without maintaining private `if-else` formatting math.

## Scope

### Pillar A: Tier 2 Atom Enhancement
- `src/ui/PriceTag.tsx`: Add `mode="full" | "compact" | "adaptive"` and bind to `useTranslation()`.

### Pillar B: Tier 4 Assembly Consumption
- `src/components/pos/PosTableFloorPlanSection.tsx`: Consume `<PriceTag />` atom across Compact View, Grid View, and VIP Min Spend pills.

### Pillar C: Verification & Testing
- `src/tests/sixTierPriceTagAtom.test.ts`: Automated test suite asserting:
  1. `<PriceTag mode="adaptive" />` behavior across small and large sums.
  2. Zero inline formatting logic in assembly components.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.
- Modifying cash drawer drivers.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy & React Aria Engine.
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 84+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that Compact View displays `24.5M` and `48M` cleanly via `<PriceTag />` atom without clipping.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
