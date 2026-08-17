---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Bar Operations, Billion Monetary Stress-Test, and Language-Aware Compact Formatter
description: Stress-tests the POS cashier system against high-value bar and nightclub operations with billion-scale IDR bills (Rp 1.850.000.000+), introduces language-aware zero-ambiguity compact currency formatting (Bio/Jt vs B/M), and guarantees absolute spatial containment across all views.
tags: [development-plan, level-2, pos, bar-operations, billion-stress-test, currency-formatting, zero-ambiguity]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 74
status: In progress
---

# Hfe POS Bar Operations, Billion Monetary Stress-Test, and Language-Aware Compact Formatter (L2-POS-74)

## Outcome

Delivers bulletproof spatial, mathematical, and linguistic integrity for luxury bar and nightclub operations with multi-million and billion IDR tabs:

1. **High-Value Bar & Luxury Hospitality Stress-Test Data**:
   - `VIP-01`: Rp 1.850.000.000 (Dom Pérignon Magnum Bottle Service & VIP Lounge Tab, Min Spend Rp 2.500.000.000, 74%).
   - `ROOF-01`: Rp 48.000.000 (Rooftop Bar Open Tab).
   - `POOL-01`: Rp 24.500.000 (Poolside Cabana Daybed Tab).
2. **Language-Aware Zero-Ambiguity Compact Currency Formatter**:
   - Solves the Indonesian vs International "M" ambiguity (Miliar vs Million):
     - **Indonesian (`id`)**: `rb` ($10^3$), `Jt` / `Mio` ($10^6$), `Bio` / `Mld` ($10^9$), `T` ($10^{12}$). Zero risk of confusing 1.85 Miliar with 1.85 Juta.
     - **English (`en`)**: `K` ($10^3$), `M` ($10^6$), `B` ($10^9$), `T` ($10^{12}$).
3. **Full Tabular Monetary Presentation for Primary Truth**:
   - All transaction cards, cashier cart totals, taxes (PB1 10%), and invoices strictly render full integer tabular numbers (`Rp 1.850.000.000`) with defensive `tabular-nums` formatting to eliminate layout jitter and digit clipping.
4. **Spatial Integrity Across All Resolutions**:
   - Desktop 1280px, Tablet 768px, and Mobile 375px bounding boxes verified for 12+ digit amounts without wrapping or overlapping adjacent elements.

## Scope

### Pillar A: Currency Utilities & Context
- `src/context/LanguageContext.tsx`: Implement `formatCompactPrice(amount, language)` helper alongside standard `formatPrice`.

### Pillar B: Mock Data & Floor Plan Containment
- `src/data/mockData.ts`: Configure billion-scale luxury bar tabs and minimum spend thresholds.
- `src/components/pos/PosTableFloorPlanSection.tsx`: Verify non-clipping typography on high monetary numbers.

### Pillar C: Verification & Testing
- `src/tests/barOperationsAndBillionStressTest.test.ts`: Automated test suite asserting:
  1. `formatCompactPrice` accuracy across ID and EN locales ($10^3$, $10^6$, $10^9$, $10^{12}$).
  2. Mathematical precision for 10-12 digit integer arithmetic (PB1, min spend shortfall).
  3. Bounding box non-collision for 14-character currency strings.

## Explicit Exclusions

- Modifying core TigerBeetle database tables in `headless-company-books`.
- Altering physical cash drawer hardware drivers.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #2: Tabular Monetary Presentation (`font-variant-numeric: tabular-nums`).
- Invariant Rule #3: Mandatory 4-Quadrant Dynamic Content Stress Matrix (Q3 Extreme Overflow).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 83+ Vitest Suites, Vite Build).
2. Visual Inspection Proof: Verified in Playwright browser inspection that Rp 1.850.000.000 displays cleanly without truncation across Grid View, Compact View, and Cashier Cart.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- CI gate failure.
