---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Customer Preference Profiles, Universal toGrow Account & Merchant Subscription Tiering
description: Experience Layer specification for customer allergen filtering/grey-out options, cross-merchant toGrow user transaction history, and Merchant Subscription Tiering (Free Tier Contact Master vs Pay Tier Reservations, Warehouses & BOM Creation).
tags: [plan, level-1, pos, customer-preferences, allergen-filter, togrow-account, merchant-tiering, pay-tier]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Customer Preference Profiles, Universal toGrow Account & Merchant Subscription Tiering

## 1. Domain Outcome
Delivers a personalized customer experience and merchant monetization framework for `hfe-pos` integrated with Headless Company Books (`glc-works/hfe-pos`).

Logged-in customers enjoy personalized allergen safety (grey-out or hide unsafe menu items), taste pattern insights, and unified cross-merchant transaction history via their **Universal toGrow User Account**.

Merchants operate under a clear **Subscription Tiering Model**: Free Tier stores save all contacts into HCB Contact Master, while Paid Tier merchants unlock private contact isolation, table reservation page activation, multi-warehouse management, and recipe BOM ingredient creation.

---

## 2. Capability Scope

### Pillar A: Logged-in Customer Benefits & Personalization
1. **Saved Preferences & Allergen Protection Engine**:
   - Customer profile stores allergen alerts (e.g. `lactose_intolerant`, `nut_allergy`, `gluten_free`) and preferred drink defaults (`preferred_milk`, `preferred_sugar`).
   - **Dynamic Menu Filter Options**: Cafe UI provides toggle settings to **Grey-Out** (disabled with allergen badge) OR **Completely Hide** menu items containing customer-flagged allergens.
2. **Purchase History & Taste Pattern Insights**:
   - Displays customer order history, frequent items, and personalized drink recommendations (e.g., *"Kopi Favoritmu: Espresso Aren Latte - Oat Milk - 50% Sugar"*).
3. **Universal toGrow User Account Integration**:
   - Single Sign-On (`toGrow Account`) enabling customers to view their total transaction history across **ALL merchants** in the `toGrow` commerce ecosystem (`GET /v1/togrow/users/{account_id}/transactions`).

---

### Pillar B: Merchant / Cafe Subscription Tiering & Feature Entitlements

| Capability / Feature Surface | **Free Tier Merchant** 🆓 | **Paid Tier Merchant (Pay Tier)** 💳 |
|---|---|---|
| **Contact Master (`/v1/contacts`)** | All customer contacts saved into shared HCB Contact Master. | **Private Contact Opt-Out**: Option to isolate customer contacts exclusively to merchant's private book. |
| **Loyalty, Points & Vouchers** | Disabled (Basic digital receipts only). | **Activated**: Universal Loyalty Tiers (Bronze/Silver/Gold/Platinum), Point Accruals, and Hfe Voucher Perks. |
| **Table Reservation Page** | Disabled (Returns Subscription Upgrade Prompt). | **Activated**: Customer table reservation engine, slot management & DP QRIS billing. |
| **Multi-Warehouse Management** | Single default store inventory. | **Activated**: Multi-warehouse tracking (`WH-SENOPATI-01`, `WH-BSD-02`). |
| **Recipe BOM & Stock Depletion** | Manual product stock count. | **Activated**: Ingredient Bill of Materials (BOM) creation and automated COGS stock depletion. |

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-11-allergen-filter-togrow-account-merchant-tiering.md`

---

## 4. Verification & Acceptance Criteria
- Customer with `lactose_intolerant` allergen profile sees dairy-based drinks greyed out or hidden based on cafe filter toggle.
- `toGrow` account login returns transaction history spanning multiple distinct merchant books.
- Free Tier merchant attempting to access Table Reservation configuration receives `402 Payment Required` or feature entitlement guard error.
