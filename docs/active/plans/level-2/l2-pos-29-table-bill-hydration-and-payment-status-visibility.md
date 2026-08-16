---
okf_version: "0.2"
type: Development Plan Level 2
title: Table Bill Hydration & Floor Plan Payment Status Visibility
description: Hydrate active table orders into cashier cart drawer and implement high-visibility payment status badges (Unpaid Open-Tab vs Paid Pre-Paid) on floor plan table cards.
tags: [development-plan, level-2, pos-cashier, floor-plan, table-status, payment-visibility]
parent_level_1: l1-pos-suite-modernization
github_issue: 29
status: Proposed
---

# Table Bill Hydration & Floor Plan Payment Status Visibility

## Outcome

Delivers accurate table bill reconciliation and unmistakable payment status visibility across the POS Cashier workstation:
1. **Live Table Bill Hydration in Drawer:** When tapping an active table (e.g. `MEJA-04`) or clicking the bottom floating `[ 🛒 Bayar ➔ ]` bar, the cashier cart drawer correctly displays all active order items, modifiers, subtotal, PB1 tax, and total bill amount (`Rp 86.000`) instead of showing an empty cart.
2. **Floor Plan Payment Status Badges:** Table cards feature bold, high-contrast color badges:
   - 🟡 `⏳ Belum Bayar • Rp 86.000` (Open-Tab / Unpaid)
   - 🔵 `✅ Sudah Lunas • Rp 54.000` (Pre-Paid / Paid)
   - 🟢 `🟢 Meja Kosong` (Available / Ready to Seat)
   - 🔴 `🔔 Minta Bill` (Customer Bill Request)
3. **1-Tap Table Quick Filter Pills:** Cashiers can instantly filter tables via `[ Semua (8) ] [ ⏳ Belum Bayar (2) ] [ ✅ Lunas (3) ] [ 🟢 Kosong (3) ]`.
4. **Clean Checkout Transition:** Completing tender immediately transitions table status to `paid` or releases it to `available`.

## Scope

- `src/views/UnifiedPosView.tsx` (Table bill item resolution, table status filter pills, and bottom bar state sync)
- `src/components/pos/PosCartSection.tsx` (Hydration of active table order items when local ad-hoc cart is empty)
- `src/hooks/useTableState.ts` (Table state transition helpers for mark-as-paid and clean checkout)
- `src/tests/tablePaymentStatus.test.ts` (Unit test verifying bill hydration, payment status calculations, and floor plan filters)

## Explicit exclusions

- Changes to customer-facing QR catalog views.
- Changes to KDS cooking ticket lifecycle (orders stay visible on kitchen stations).
- Real payment gateway API integrations (in-memory mock tender engine).

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 120+ Vitest unit tests, and production build).
2. Tapping `MEJA-04` and opening the cashier drawer displays `1x Espresso Aren Latte`, `1x Truffle Fries`, and `Total Tagihan: Rp 86.000` without any empty state.
3. Every table card on the floor plan displays its exact payment status badge with color coding (Amber for Unpaid, Blue for Paid, Green for Available).
4. Table filter pills filter the floor plan grid accurately.

## Stop conditions

- Scope creep into untouched back-office modules (Warehouse, Branch Sync).
- Any TypeScript compilation failure or modularity threshold violation (>500 lines).
