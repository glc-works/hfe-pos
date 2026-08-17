---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Smart Semantic Search and Multilingual Thesaurus Engine
description: Implements a high-speed, client-side Smart Search & Multilingual Semantic Thesaurus engine (ID <-> EN synonym dictionary, category cross-matching, typo tolerance, and 1-tap smart recommendations) across POS Cashier and Customer QR Order without backoffice data leakage.
tags: [development-plan, level-2, pos, smart-search, semantic-thesaurus, cmdk-pattern, multilingual, fuzzy-search]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 79
status: In progress
---

# Hfe POS Smart Semantic Search and Multilingual Thesaurus Engine (L2-POS-79)

## Outcome

Eliminates zero-result friction when cashiers or customers search for items using localized, colloquial, or translated terms (e.g., searching `"kopi"` will seamlessly return all `"Coffee"` category items like `Espresso Aren Latte`, `Japanese Cold Brew`, etc.):

1. **Bilingual Semantic Thesaurus (`src/utils/searchThesaurus.ts`)**:
   - Maps Indonesian and English colloquial terms to formal categories and product groups:
     - `kopi`, `coffee`, `coffe`, `caffe`, `espresso`, `latte`, `brew` ➔ `Coffee` category.
     - `teh`, `tea`, `matcha`, `hojicha`, `cokelat`, `chocolate` ➔ `Non-Coffee` category.
     - `roti`, `kue`, `pastry`, `bakery`, `croissant`, `chocolat` ➔ `Pastry` category.
     - `cemilan`, `snack`, `gorengan`, `kentang`, `fries`, `bites` ➔ `Snack` category.
     - `makan`, `makanan`, `food`, `nasi`, `meal`, `main` ➔ `Main Course` category.
2. **Cross-Field Match & Typo Tolerance**:
   - Searches across item `name`, `category`, `description`, `hfeCategoryCode`, and synonym tokens.
3. **Smart Empty State Recommendations ("Did You Mean")**:
   - When a search query yields no exact string match, provides 1-tap suggested category chips (e.g. `[ 💡 Buka Kategori: ☕ Coffee ]`).
4. **Strict Security Scoping**:
   - Client-side pure search algorithms with zero exposure of ledger subledgers, shift reconciliations, or staff PINs.

## Scope

### Pillar A: Search Thesaurus Utility
- `src/utils/searchThesaurus.ts`: Core search engine functions (`smartSearchFilter`, `getSmartSearchSuggestion`).

### Pillar B: POS & QR Catalog Integration
- `src/views/UnifiedPosView.tsx`: Integrate `smartSearchFilter` into `filteredCatalog`.
- `src/components/pos/PosCatalogGrid.tsx`: Render 1-tap category recommendation chips on empty states.

### Pillar C: Automated Verification & Unit Tests
- `src/tests/smartSearchThesaurus.test.ts`:
  - Asserts `"kopi"` query returns all Coffee items.
  - Asserts `"roti"` query returns Pastry items.
  - Asserts smart recommendation suggestions on partial typos.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.
- Invariant Rule #21: Universal Component Reuse Protocol.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Multi-device browser screenshot verification demonstrating that searching `"kopi"` produces active Coffee items.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
