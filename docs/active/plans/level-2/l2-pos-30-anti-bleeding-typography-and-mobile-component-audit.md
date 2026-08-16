---
okf_version: "0.2"
type: Development Plan Level 2
title: Anti-Bleeding Typography & Mobile Component Surface Audit
description: Comprehensive audit and repair of all mobile widgets and components to enforce strict single-line typography, zero text bleeding, and resilient flexbox layouts.
tags: [development-plan, level-2, mobile-ux, typography, anti-bleeding, cashier-audit]
parent_level_1: l1-pos-suite-modernization
github_issue: 30
status: Proposed
---

# Anti-Bleeding Typography & Mobile Component Surface Audit

## Outcome

Eliminates all typography collisions, multi-line button breaks, and viewport clipping across all mobile widgets and customer/cashier surfaces:
1. **Normative UX Standard Codification:** Author Rule 9 (*Strict Anti-Bleeding & Single-Line Typography Heuristic*) in `FNB-COMMERCE-UX-HEURISTICS.md`.
2. **Compact Payment Method Buttons:** Replace multi-line breaks like `Kartu (CC/Debit)` with clean single-line high-clarity pills (`[ 💵 Tunai ] [ 🔲 QRIS ] [ 💳 Kartu ]`).
3. **Resilient Product Catalog Card Layout:** Ensure product titles and prices never collide or split currency units (`whitespace-nowrap font-mono shrink-0` on all prices, concise titles, truncated descriptions).
4. **Elevated Floating Cart Dock:** Prevent bottom browser navigation clipping with reinforced vertical breathing room and safe-area insets.
5. **Comprehensive Mobile Surface Audit:** Audit all drawers, modals, table cards, and KDS tickets to guarantee zero multi-line breaking.

## Scope

- `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (Codify Rule 9 Anti-Bleeding & Single-Line Typography Standard)
- `src/i18n/translations.ts` (Concise button labels: `Kartu` instead of `Kartu (CC/Debit)`)
- `src/components/pos/PosCartSection.tsx` (Single-line payment method buttons & quick cash layout)
- `src/views/CustomerMobileView.tsx` (Product card layout & bottom floating cart dock height/padding)
- `src/components/pos/PosCatalogGrid.tsx` (POS product card layout)
- `src/data/mockData.ts` (Concise menu item titles like `Dark Chocolate 70%`)
- `src/tests/antiBleedingTypography.test.ts` (Vitest test verifying single-line typography integrity)

## Explicit exclusions

- Back-end REST API alterations.
- Database schema changes.

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, Typecheck, ESLint, 125+ Vitest tests, Production build).
2. Product cards on iPhone mobile viewport (380px) render title, price (`Rp 35.000`), and `+ Tambah` without any two-line price splitting.
3. Payment method buttons in cashier drawer render on exactly 1 line each (`Tunai`, `QRIS`, `Kartu`) with identical pill heights.
4. Floating cart dock renders `Rp 124.600` and `Checkout (3) ➔` with ample margin above the Safari URL bar / Home Indicator.
