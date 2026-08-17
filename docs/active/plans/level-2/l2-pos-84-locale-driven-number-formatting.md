---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Locale-Driven Number and Money Field Formatter Engine
description: Implements authoritative internationalization (i18n & Unicode CLDR / ECMA-402) standards where thousand and decimal punctuation separators are strictly dictated by UI language/locale (id-ID uses dot for thousands and comma for decimals; en-US uses comma for thousands and dot for decimals), fully decoupled from currency symbols and decimal precisions.
tags: [development-plan, level-2, pos, locale-formatting, thousand-separators, i18n, money-fields]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 84
status: In progress
---

# Hfe POS Locale-Driven Number & Money Field Formatter Engine (L2-POS-84)

## Outcome

Delivers accurate internationalized money field formatting:

1. **Locale-Driven Punctuation Separation (Unicode CLDR / ECMA-402 Standard)**:
   - `language === 'id'`: Thousand separator is `.` (dot) (e.g. `1.000.000`), decimal separator is `,` (comma) (e.g. `5,38`).
   - `language === 'en'`: Thousand separator is `,` (comma) (e.g. `1,000,000`), decimal separator is `.` (dot) (e.g. `5.38`).
   - Currency symbol prefix (`Rp`, `$`, `S$`, `¥`, `€`) and minor fractional units are decoupled from punctuation rules.
2. **Live Formatted Money Field in Cashier Register (`PosCartSection.tsx`)**:
   - Cash input field displays live thousand delimiters (e.g. `Rp 100.000` / `Rp 1.000.000`).
   - Eliminates cash register misreading and human error.
   - Smoothly updates when typing or clicking Speed Keys (`+000`, `+00`, `+10rb`, `+50rb`, `⌫`).

## Scope

### Pillar A: Tier 1 Locale Formatter Utility
- `src/utils/localeNumberFormat.ts`: Pure functions `formatLocaleNumber()`, `formatMoneyInputDisplay()`, and `parseMoneyInput()`.

### Pillar B: Cashier Cart Component Integration
- `src/components/pos/PosCartSection.tsx`: Integrate live locale formatting on the cash tender input field (<500 lines).

### Pillar C: Automated Verification & Unit Tests
- `src/tests/localeNumberFormatting.test.ts`: Unit tests verifying Indonesian vs English formatting across integers and decimal currencies.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #2: Tabular Monetary Presentation & Locale Formatting.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Browser screenshot verification demonstrating clean formatted money inputs (`100.000`, `1.000.000`).

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
