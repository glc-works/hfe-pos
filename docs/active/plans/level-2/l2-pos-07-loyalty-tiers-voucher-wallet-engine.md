---
okf_version: "0.2"
type: Development Plan Level 2
title: Loyalty Tiers Badge, Voucher Wallet Drawer & Promo Code Engine
description: Implements customer loyalty tier badge display, active voucher wallet drawer, point redemption modal, promo code cart validation, and HCB REST API client integration.
tags: [development-plan, level-2, loyalty, vouchers, wallet, promo-code, REST-api]
parent_level_1: l1-05-universal-loyalty-and-voucher-engine
github_issue: 7
status: Proposed
---

# Level 2 Implementation Plan: Loyalty Tiers Badge, Voucher Wallet Drawer & Promo Code Engine

## 1. Outcome
Delivers the Customer Loyalty & Voucher UI module (`src/components/loyalty/`) and state hook (`src/hooks/useLoyalty.ts`) supporting 4-tier loyalty status badges (Bronze, Silver, Gold, Platinum), active voucher wallet drawers, point redemption modals, and promo code cart discounts integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Custom Loyalty State Hook (`src/hooks/useLoyalty.ts`)
- Implement `useLoyalty(contactId: string)` managing:
  - Customer current loyalty tier, total points, lifetime spend IDR, and point multiplier (1.0x to 2.0x).
  - Active claimable vouchers wallet array (`VOUCHER-BIRTHDAY`, `VOUCHER-DISC10PCT`, `VOUCHER-FREEUPGRADE`).
  - Applied promo code discount state in cart (`appliedVoucher`, `discountAmountIdr`).
  - Integration with REST API transport helper `src/services/hfeApi.ts`.

### Phase B: UI Components & Drawers (`src/components/loyalty/`)
- `src/components/loyalty/LoyaltyTierBadge.tsx` — Displays customer tier level badge with visual icon (Bronze 🥉, Silver 🥈, Gold 🥇, Platinum 💎) and progress bar to next tier threshold.
- `src/components/loyalty/VoucherWalletDrawer.tsx` — Bottom sheet drawer displaying active vouchers, expiration dates, minimum spend requirements, and "Gunakan Voucher" cart action.
- `src/components/loyalty/PointRedeemModal.tsx` — Modal for redeeming accumulated loyalty points to claim new vouchers (`POST /v1/loyalty/vouchers/claim`).

### Phase C: Hfe REST API Transport Integration
- Wire API calls to HCB Core endpoints:
  - Fetch Loyalty Status: `GET /v1/company-books/{book}/contacts/{id}/loyalty`
  - Fetch Voucher Wallet: `GET /v1/company-books/{book}/contacts/{id}/vouchers`
  - Claim Voucher: `POST /v1/loyalty/vouchers/claim`
  - Validate Promo Code: `POST /v1/loyalty/vouchers/validate`
  - Accrue Points on Settlement: `POST /v1/company-books/{book}/loyalty/accrue`

### Phase D: Vitest Unit Testing (`src/tests/loyalty.test.ts`)
- Unit test coverage:
  - Verifies tier threshold progression logic (Bronze -> Silver -> Gold -> Platinum).
  - Verifies 10% discount calculation for `VOUCHER-DISC10PCT`.
  - Verifies minimum spend validation rules.

## 3. Explicit Exclusions
- Does not store loyalty point authority locally; all accruals, balances, and voucher validity are governed by HCB Core Loyalty REST APIs.

## 4. Verification Plan
- `npm run test` passes clean with 100% assertion success on loyalty tier progression and voucher discounts.
- All new component files in `src/components/loyalty/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- `npm run build` compiles clean with zero TypeScript errors.
