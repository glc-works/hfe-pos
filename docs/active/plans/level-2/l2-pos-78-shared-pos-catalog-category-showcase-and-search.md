---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Shared Category Showcase Pills and In-Page Search in POS Catalog
description: Unifies the POS Cashier Catalog Explorer with the Customer QR Order Space by integrating 1-Tap Category Showcase Pills, in-page search bar, and SKU filter directly above the catalog grid, eliminating component silos and achieving 100% parity.
tags: [development-plan, level-2, pos, catalog-explorer, category-pills, in-page-search, shared-components, ssot]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 78
status: In progress
---

# Hfe POS Shared Category Showcase Pills and In-Page Search in POS Catalog (L2-POS-78)

## Outcome

Achieves 100% UI and UX component sharing parity between POS Cashier and Customer QR Order:
1. **In-Page Live Search & SKU Filter**:
   - Integrated directly at the top of `PosCatalogGrid.tsx` for instantaneous `<16ms` keyword and SKU barcode filtering without modal delays.
2. **1-Tap Horizontal Category Showcase Pills (Etalase Kategori)**:
   - Replaces hidden dropdowns with fast-touch horizontal category pills (`[☕ Semua]`, `[⭐ Populer]`, `[☕ Coffee]`, `[🥐 Pastry]`, `[🍟 Snacks]`, `[🍵 Non-Coffee]`) equipped with category glyphs and SKU count badges.
3. **Multi-Density Grid Preservation**:
   - Preserves Grid View (Large Photos), Compact View (High-Density Tiles), and List View (Retail Barcode Rows).

## Scope

### Pillar A: POS Catalog Grid Refactoring
- `src/components/pos/PosCatalogGrid.tsx`:
  - Render active `searchQuery` and `setSearchQuery` in a streamlined in-page search input.
  - Render active `categories`, `selectedCategory`, and `setSelectedCategory` in horizontal quick-filter pills with glyphs and badges.

### Pillar B: Automated Verification & Unit Tests
- `src/tests/sharedPosCatalogCategoryShowcase.test.ts`:
  - Asserts in-page search filtering by item name and SKU.
  - Asserts 1-tap category pill switching and category-scoped catalog filtering.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.
- Invariant Rule #21: State Management Separation & Universal Component Reuse Protocol.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Multi-device browser screenshot verification of POS Catalog view with active category pills and in-page search.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
