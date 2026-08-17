---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Banknote Ceiling Dynamic Presets and Speed Keys 000 Numpad Engine
description: Implements a realistic statutory banknote ceiling algorithm (86k -> 100k, 760k -> 800k, 860k -> 900k) alongside ergonomic Cashier Speed Multiplier Keys (000, 00, +10k, and Clear) for lightning-fast odd-amount and round-change cash entries.
tags: [development-plan, level-2, pos, banknote-ceiling, speed-keys-000, numpad-ergonomics, cash-tender]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 83
status: In progress
---

# Hfe POS Banknote Ceiling Dynamic Presets & Speed Keys 000 Engine (L2-POS-83)

## Outcome

Delivers a lightning-fast, highly ergonomic cashier payment experience:

1. **Statutory Banknote Ceiling Algorithm (`src/utils/countryCashDenominations.ts`)**:
   - Bill $\le 20\text{k}$ $\rightarrow$ Next 20k ceiling (14k $\rightarrow$ 20k).
   - Bill $21\text{k} - 50\text{k}$ $\rightarrow$ Next 50k ceiling (35k $\rightarrow$ 50k).
   - Bill $> 50\text{k}$ $\rightarrow$ Next 100k ceiling (86k $\rightarrow$ 100k, 760k $\rightarrow$ 800k, 860k $\rightarrow$ 900k, 1.530k $\rightarrow$ 1.6 Jt).
   - Followed by clean next hundred-thousand and million multiples (Zero arbitrary 90k/150k fractions).
2. **Ergonomic Speed Keys (`000`, `00`, `+10k`, `⌫`)**:
   - Allows instant entry of custom odd amounts (e.g. typing `870` + `[ 000 ]` = `870.000`).
   - Supports 1-tap increments for coin-avoidance round-change transactions (e.g. Rp 86k bill paid with Rp 106k).

## Scope

### Pillar A: Banknote Ceiling Engine
- `src/utils/countryCashDenominations.ts`: Update IDR banknote ceiling formula.

### Pillar B: Cashier Payment Component Enhancement
- `src/components/pos/PosCartSection.tsx`: Add Speed Multiplier Keys (`000`, `00`, `+10k`, `⌫`) beside manual cash input (<500 lines).

### Pillar C: Automated Verification & Unit Tests
- `src/tests/banknoteCeilingAndSpeedKeys.test.ts`:
  - Asserts exact banknote ceiling outputs across 14k, 35k, 86k, 760k, 860k, and 1.530k.
  - Asserts speed keys multiplier logic.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Defensive Spatial Isolation & Tabular Presentation.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Browser screenshot verification demonstrating clean Banknote Ceiling buttons and Speed Keys `000` in action.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
