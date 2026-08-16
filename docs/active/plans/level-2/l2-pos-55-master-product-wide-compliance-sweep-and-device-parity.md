---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Master Product-Wide Compliance Sweep and Device Parity
description: Final repository-wide compliance sweep standardizing all secondary screens, auth login, owner insights, and dialog modals to 100% Tier 2 React Aria Atoms and tabular monetary presentation.
tags: [development-plan, level-2, pos, compliance-sweep, device-parity, price-tag]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 55
status: In progress
---

# Hfe POS Master Product-Wide Compliance Sweep & Device Parity

## Outcome

Achieves 100% absolute repository-wide compliance with `POS-ENG-STD-001` and `HFE-UI-STD-001` across all primary and secondary surfaces:

1. **Repowide Adoption of Tier 2 Atoms**:
   - Replaces all legacy ad-hoc currency string concatenations (`Rp ${amount.toLocaleString()}`) with the canonical `<PriceTag amount={...} />` atom.
   - Standardizes duration and capacity indicators with `<TimerPill>` and `<CapacityBadge>`.

2. **Secondary Screen & Modal Purification**:
   - Standardizes `PosAuthLoginView.tsx` with haptic feedback keypad buttons and tabular security PIN masks.
   - Standardizes `HfeInsightsView.tsx` with tabular financial indicators and double-entry revenue reconciliations.
   - Standardizes `DynamicSplitBillModal.tsx` and `CorporateInvoiceModal.tsx` with slot budgets and tabular figure allocations.

3. **Automated Zero-Drift Certification**:
   - Passes all 7 CI Gate verification steps including the automated HFE-UI-STD-001 auditor and 66+ Vitest test suites.

## Scope

### Pillar A: Modals & Secondary Screens
- `src/views/PosAuthLoginView.tsx`: Integrate tabular PIN display and tactile keypad.
- `src/views/HfeInsightsView.tsx`: Replace manual price strings with `<PriceTag>`.
- `src/components/pos/DynamicSplitBillModal.tsx`: Integrate `<PriceTag>` for split tab amounts.
- `src/components/pos/CorporateInvoiceModal.tsx`: Integrate `<PriceTag>` for invoice totals and tax PB1.

### Pillar B: Verification & Testing
- `src/tests/masterComplianceSweepWave4.test.ts`: Automated test suite asserting 100% repowide compliance and price formatting consistency.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying previously certified Wave 1, Wave 2, or Wave 3 components.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- UI Standard: `docs/active/standards/HFE-UI-STD-001.md`
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy & React Aria Engine.
- Invariant Rule #16: Mathematical Proportion, Golden Ratio & 8-Point Spatial Grid.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 66+ Vitest Suites, Vite Build).
2. Repowide Compliance Proof: 100% of scanned UI screens render tabular figures without raw unformatted currency numbers.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
