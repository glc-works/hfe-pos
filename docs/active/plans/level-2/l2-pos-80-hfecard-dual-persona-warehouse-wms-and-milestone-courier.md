---
okf_version: "0.2"
type: Development Plan Level 2
title: HfeCard Dual-Persona Passbook, Role-Pure Warehouse WMS, and Milestone Store Courier Engine
description: Implements the Dual-Persona (Mode LIFE and Mode WORK) architecture on HfeCard Passbook, Multi-Merchant Apple Wallet pass stack, Role-Pure Warehouse Keeper WMS tools, Milestone-Driven In-House Store Courier module, and interactive Mini App Store.
tags: [development-plan, level-2, pos, hfecard, dual-persona, apple-wallet-passbook, warehouse-wms, store-courier, mini-app-store]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 80
status: In progress
---

# HfeCard Dual-Persona Passbook, Role-Pure Warehouse WMS, and Milestone Store Courier Engine (L2-POS-80)

## Outcome

Delivers a state-of-the-art dual-identity passbook and in-house fulfillment architecture:

1. **Dual-Persona Architecture (Mode LIFE 🌿 ⟷ Mode WORK 💼)**:
   - **Mode LIFE**: Customer multi-merchant loyalty pass stack (Apple Wallet style), individual store stamp cards, vouchers, and optional Hfe Network cross-brand points sharing.
   - **Mode WORK**: Staff NIK badge, shift clock-in, daily coffee quota, and role-pure operational mini apps.
2. **Role-Pure Warehouse Keeper WMS**:
   - Replaces unrelated cashier void/sales flash menus with dedicated WMS tools: Goods Receipt Note (GRN), Stocktake Opname, Inter-Branch Stock Transfer, Barcode Lot Generator, and Courier Dispatch.
3. **Milestone-Driven Store Courier Module**:
   - Frictionless delivery workflow: Task details, 1-tap Google Maps external direction URL (`maps.google.com`), WhatsApp chat link, and 3-step progress milestones (`1. Ambil di Toko` ➔ `2. Tiba di Lokasi` ➔ `3. Selesai & Upload Foto POD`).
4. **Mini App Store Modal**:
   - Dedicated modal accessed via `[ ➕ Jelajahi Mini App Store ]` to discover, filter, and launch extensions across consumer lifestyle, logistics, and store management.

## Scope

### Pillar A: Customer Portal & HfeCard Refactoring
- `src/views/CustomerPortalView.tsx`: Implement Dual-Persona switcher, multi-merchant passes, role-pure warehouse tools, and courier milestone drawer.
- `src/components/common/MiniAppStoreModal.tsx`: Create interactive Mini App marketplace modal.

### Pillar B: Automated Verification & Unit Tests
- `src/tests/hfeCardDualPersonaAndCourier.test.ts`:
  - Asserts LIFE mode multi-merchant pass isolation.
  - Asserts WORK mode role-based mini app rendering (Warehouse vs Manager vs Courier).
  - Asserts Store Courier 3-milestone progress transition.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #5: Single Source of Truth (SSOT) Everywhere.
- Invariant Rule #20: The 4 Core Experience Pillars (BOARD, ORDER, CARD, POS).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Multi-device browser screenshot verification demonstrating Mode LIFE, Mode WORK, Warehouse Keeper WMS, and Courier Milestones.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
