---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Direct Modal Action and Clean Selection Rollback
description: Rolls back persistent selection ring overrides on table cards in the floor plan, ensuring cards permanently reflect their genuine operational status and chromatic zone surface while direct touch actions immediately open table operations pop-up modals.
tags: [development-plan, level-2, pos, table-card, direct-modal, rollback, floor-plan]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 71
status: In progress
---

# Hfe POS Direct Modal Action and Clean Selection Rollback (L2-POS-71)

## Outcome

Delivers touch-first operational purity by eliminating persistent selection ring overrides:

1. **Clean Card Presentation (Zero Lingering Selection Overrides)**:
   - Removes `selectedPOSTable?.id === table.id` persistent highlight rings from table cards.
   - Table cards strictly preserve their authentic operational states and chromatic zone backdrops:
     - **Available Tables**: Rich zone chromatic surface (`bg-emerald-950/40`, `bg-cyan-950/40`, `bg-amber-950/45`).
     - **Unpaid Tables**: High-priority billing alert state (`bg-amber-500/10 border-amber-500/60`).
     - **Paid Tables**: Order settled state (`bg-indigo-500/10 border-indigo-500/50`).
2. **Direct Touch-to-Modal Action Flow**:
   - Tapping/clicking a table immediately triggers the table operations action flow (`handleTableClick` / `onOpenTableOpsModal`), opening the operational drawer/modal without leaving behind artificial visual rings.
3. **Instant Tactile Feedback (`active:scale-[0.98]`)**:
   - Provides immediate sub-16ms tactile micro-interaction feedback on tap without state distortion.

## Scope

### Pillar A: Layout Component Architecture
- `src/components/pos/PosTableFloorPlanSection.tsx`: Roll back `selectedPOSTable?.id === table.id` class override on table cards and ensure clean direct modal invocation.

### Pillar B: Verification & Testing
- `src/tests/directModalActionCleanCards.test.ts`: Automated test suite asserting:
  1. Elimination of persistent selection ring class overrides.
  2. Pure operational state hierarchy: Unpaid > Paid > Zone Surface.
  3. Direct click handler binding.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying cash drawer or payment processing logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation (Zero Text Collision).
- Invariant Rule #17: Browser-to-Native App Parity Invariant (Haptic Tactility).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 80+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that table cards maintain clean territorial surfaces without lingering selection rings.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
