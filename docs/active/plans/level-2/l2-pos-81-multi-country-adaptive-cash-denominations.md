---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Multi-Country Adaptive Cash Banknote Denominations Engine
description: Implements a pure Tier 1 multi-currency and multi-country cash banknote denomination engine that computes realistic, localized physical banknote presets across IDR, USD, SGD, MYR, JPY, EUR, AUD, and GBP, eliminating fractional button swarms and locking the cashier cash tender UI to exactly 1 clean row (5 columns).
tags: [development-plan, level-2, pos, multi-currency, cash-denominations, banknotes, tier-1-utility, cashier-ergonomics]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 81
status: In progress
---

# Hfe POS Multi-Country Adaptive Cash Banknote Denominations Engine (L2-POS-81)

## Outcome

Delivers a robust, country-aware cashier cash tender experience:

1. **Multi-Country Banknote Presets Engine (`src/utils/countryCashDenominations.ts`)**:
   - Pure Tier 1 algorithm calculating realistic banknotes based on ISO 4217 Currency and statutory cash circulation:
     - **IDR (Indonesia)**: Rp 10k, 20k, 50k, 100k, 200k, 500k, 1M, 2M, 5M (Zero decimal fractions).
     - **USD (United States)**: $1, $5, $10, $20, $50, $100, $200.
     - **SGD (Singapore)**: S$2, S$5, S$10, S$50, S$100, S$200.
     - **MYR (Malaysia)**: RM1, RM5, RM10, RM20, RM50, RM100.
     - **JPY (Japan)**: ¥1,000, ¥2,000, ¥5,000, ¥10,000.
     - **EUR (Eurozone)**: €5, €10, €20, €50, €100, €200.
2. **Fixed 1-Row Grid Layout (Strict 5 Columns)**:
   - Eliminates UI explosions and duplicate button accumulations.
   - Column 1: `[ Uang Pas / Exact Cash ]`
   - Columns 2-5: `[ 4 Real Banknote Presets ]`
3. **Multi-Device & POS Cart Section Parity**:
   - Synchronized across desktop `PosCartSection.tsx` and mobile `PosMobileCartDrawer.tsx`.

## Scope

### Pillar A: Cash Denominations Utility
- `src/utils/countryCashDenominations.ts`: Core pure function `getCountryCashPresets()`.

### Pillar B: Cashier Payment Component Refactoring
- `src/components/pos/PosCartSection.tsx`: Replace old dynamic loop with `getCountryCashPresets()`.

### Pillar C: Automated Verification & Unit Tests
- `src/tests/countryCashDenominations.test.ts`:
  - Asserts exact 4 clean presets for IDR micro, standard, and million-tier bills (e.g. Rp 1.530.100).
  - Asserts exact 4 clean presets for USD ($14.50, $120.00).
  - Asserts exact 4 clean presets for SGD, MYR, JPY, and EUR.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation & Tabular Presentation.
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Multi-device browser screenshot verification demonstrating clean 1-row cash presets on large bills (Rp 1.530.100).

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
