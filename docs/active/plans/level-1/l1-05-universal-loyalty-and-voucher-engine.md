---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Universal HFE Loyalty Tiers, Point Accruals & Voucher Perk Engine
description: Experience Layer integration for customer loyalty tier tracking, point accruals, tier multiplier benefits, active voucher wallet redemption, and Owner Loyalty Policy settings via HCB Core REST APIs.
tags: [plan, level-1, pos, cafe, loyalty, vouchers, tier-multiplier, contact-master]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Universal HFE Loyalty Tiers, Point Accruals & Voucher Perk Engine

## 1. Domain Outcome
Delivers a complete Customer Loyalty & Voucher Experience Layer for cafes and F&B outlets operating under **Merchant Pay Tier Subscription** connected to Headless Company Books (`glc-works/hfe-pos`).

When activated by a Pay-Tier merchant, customers scanning table QR codes or cashiers at the Barista Touch POS can resolve customer loyalty tiers (Bronze, Silver, Gold, Platinum), track accumulated lifetime spend, earn tiered point multipliers (1.0x to 2.0x), view active voucher wallets, claim tier perks (`VOUCHER-BIRTHDAY`, `VOUCHER-DISC10PCT`, `VOUCHER-FREEUPGRADE`), and apply promo codes for instant cart discounts—all resolved through HCB Core Loyalty REST APIs (`/v1/loyalty`, `/v1/vouchers`). Free Tier merchants default to standard digital receipts with Loyalty/Voucher features locked.

---

## 2. Capability Scope

### A. Universal Loyalty Tier Matrix (4-Tier Threshold Model)
- **Tier 1 — Bronze**: Rp 0 – Rp 999.999 lifetime spend | **1.0x** point multiplier | Default Perk: Digital Receipts & Base Points.
- **Tier 2 — Silver**: Rp 1.000.000 – Rp 4.999.999 lifetime spend | **1.25x** point multiplier | Default Perk: `VOUCHER-BIRTHDAY` (Free 1 Shot Espresso).
- **Tier 3 — Gold**: Rp 5.000.000 – Rp 14.999.999 lifetime spend | **1.5x** point multiplier | Default Perk: `VOUCHER-DISC10PCT` (10% Coffee Bean Discount).
- **Tier 4 — Platinum**: Rp 15.000.000+ lifetime spend | **2.0x** point multiplier | Default Perk: `VOUCHER-FREEUPGRADE` (Free Size Upgrade).

### B. Customer Voucher Wallet & Promo Code Application
- **Voucher Wallet Fetch**: Resolves customer active claimable vouchers (`GET /v1/company-books/{book}/contacts/{id}/vouchers`).
- **Cart Promo Code Application**: Validates promo code expiration, minimum cart spend, and calculates monetary discount (`POST /v1/loyalty/vouchers/validate`).
- **Instant Voucher Claim**: Allows customers to redeem accumulated points to claim new vouchers (`POST /v1/loyalty/vouchers/claim`).

### C. Owner Loyalty Policy Settings Portal
- **Policy Customization**: Cafe owners can customize tier names, spend thresholds, linked voucher perk templates, and point accrual ratios (`PUT /v1/loyalty/settings`).

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-07-loyalty-tiers-voucher-wallet-engine.md`

---

## 4. Verification & Acceptance Criteria
- Customer contact lookup (`POST /v1/company-books/{book}/contacts/resolve`) returns accurate tier status and point balance.
- Applying `VOUCHER-DISC10PCT` in cart reduces subtotal by exact 10% monetary amount without floating point drift.
- Transaction settlement triggers point accrual payload to `POST /v1/company-books/{book}/loyalty/accrue`.
