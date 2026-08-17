---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS KISS Multi-Currency Cashier Tender and Language Decoupling Engine
description: Implements a clean, KISS-compliant multi-currency cash tender selector that completely decouples cashier UI language from store base currency, enabling merchants to accept multiple currencies (IDR, USD, SGD, MYR, EUR, JPY) with instant 1-tap conversion and localized banknote presets.
tags: [development-plan, level-2, pos, kiss-multi-currency, cash-tender, fx-conversion, cashier-ergonomics]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 82
status: In progress
---

# Hfe POS KISS Multi-Currency Cashier Tender & Language Decoupling Engine (L2-POS-82)

## Outcome

Delivers a streamlined, KISS-compliant multi-currency cashier payment experience:

1. **Complete Language vs Base Currency Decoupling**:
   - Store base currency remains strictly `merchantTheme?.currency || 'IDR'`.
   - Changing UI language (`en` / `id`) translates interface copy without altering store currency into US dollars.
2. **KISS Multi-Currency Tender Selector**:
   - 1-Tap currency selector chips (`[ 🇮🇩 IDR ] [ 🇺🇸 USD ] [ 🇸🇬 SGD ] [ 🇲🇾 MYR ] [ 🇪🇺 EUR ] [ 🇯🇵 JPY ]`).
   - Instant calculation of equivalent total bill in chosen foreign tender currency using standard daily FX rates.
3. **Adaptive Banknote Presets & Dual-Currency Change Return**:
   - Banknote preset buttons adapt to the selected tender currency (`[ Exact $5.38 ] [ $10 ] [ $20 ] [ $50 ]`).
   - Change calculation displayed cleanly with local currency equivalent.

## Scope

### Pillar A: Multi-Currency & FX Conversion Engine
- `src/utils/countryCashDenominations.ts`: Add `convertCurrency()` and `getCurrencySymbol()` pure helpers.

### Pillar B: Cashier Payment Component Enhancement
- `src/components/pos/PosCartSection.tsx`: Add tender currency selector and decoupled currency resolution (<500 lines).

### Pillar C: Automated Verification & Unit Tests
- `src/tests/kissMultiCurrencyCashTender.test.ts`:
  - Asserts language decoupling (English UI with IDR currency produces IDR presets).
  - Asserts foreign tender conversion and banknote presets.
  - Asserts dual-currency change calculations.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Browser screenshot verification demonstrating clean English UI with IDR currency presets and multi-currency tender selection.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
