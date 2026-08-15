---
okf_version: "0.2"
type: Strategic Plan Level 0
title: Hfe POS & Cafe Mobile Order Suite — Master Strategic Plan
description: Master product vision for the Cafe & F&B Experience Layer, delivering a dual-surface cashier station and smartphone QR table self-ordering web app powered by Hfe REST APIs.
tags: [master-plan, level-0, pos, cafe, mobile-qr-order, f-and-b, phone-login, guest-mode, open-tab, universal-hfe-loyalty, promo-discounts, referral-program, owner-settings]
status: Proposed
---

# Level 0 Strategic Plan: Hfe POS & Cafe Mobile Order Suite

## 1. Executive Summary & Vision

The **Hfe POS & Cafe Mobile Order Suite** (`glc-works/hfe-pos`) is the dedicated **Cafe & F&B Experience Layer** built for modern coffee shops, cafes, and restaurants.

It provides a seamless **Dual-Surface Experience**:
1. **Customer Smartphone QR Ordering (Self-Service Web App):** Customers scan a QR code at their table, select their preferred login mode (**Phone/WhatsApp Login with Universal HFE Loyalty Tiers & Referral Program** OR **Pure Guest Mode with Name only**), browse visual coffee & food menus, customize modifiers, redeem promo discount codes, share referral codes, redeem loyalty points for drink discounts, and order under cafe-configurable payment policies (**Pay-First** vs **Open Tab Billing**).
2. **Barista & Cashier Touch POS (POS & Kitchen Display):** Baristas and cashiers manage table billing tabs, print kitchen tickets, apply cashier promo discounts, handle offline cash/QRIS checkouts, and reconcile daily shift cash drawers.

`hfe-pos` leverages the **Universal HFE Customer Loyalty, Promo & Referral Engine** (`/v1/loyalty`, `/v1/promos`, `/v1/referrals`, `/v1/vouchers`). Business Owners can create custom promo discount codes (e.g. `HAPPYHOUR`, `WEEKEND20`), set up Customer Referral dual-bonus rewards, customize loyalty tier names, thresholds, and perks via **Owner Loyalty Policy Settings** (`PUT /v1/loyalty/settings`), and monitor customer point/referral metrics on a **per-contact basis** (`GET /v1/contacts/{id}/loyalty`). All **Customers, Employee Profiles, Loyalty Point Balances, and Referral Logs** are resolved via `Hfe` REST APIs (`/v1/contacts`, `/v1/loyalty`, `/v1/promos`, `/v1/referrals`). Product master data, financial subledgers, ingredient COGS depletions, biller splits, and DJP taxes are executed behind **Hfe REST APIs**.

---

## 2. Strategic Experience Pillars (Level 1 Domain Mapping)

```
                     ┌─────────────────────────────────────────────────────────────┐
                     │    Hfe Cafe POS & Mobile Order Experience Layer (L0)       │
                     └──────────────────────────────┬──────────────────────────────┘
                                                    │
         ┌──────────────────────┬───────────────────┴───────────────────┬──────────────────────┐
         │                      │                                       │                      │
┌────────▼─────────────┐ ┌──────▼──────────────┐               ┌────────▼─────────────┐ ┌──────▼──────────────┐
│ L1-01: Phone Login,  │ │ L1-02: Barista Touch │               │ L1-03: Policy Payment│ │ L1-04: Kitchen Ticket│
│ Promos, Referrals &QR│ │ POS & Table Engine   │               │ Checkout (Pay/Tab)   │ │ & Barista Display    │
└──────────────────────┘ └──────────────────────┘               └──────────────────────┘ └──────────────────────┘
                                 │
                                 ▼ (100% REST API Transport Layer)
                     ┌─────────────────────────────────────────────────────────────┐
                     │ Hfe Core REST APIs (Contacts, Products, Promos & Referrals) │
                     └─────────────────────────────────────────────────────────────┘
```

### Pillar 1: Customer Phone / Guest Name Mobile QR Self-Ordering (`L1-01`)
- **Zero App Install & Flexible Customer Entry:**
  - **Option A (Phone/WhatsApp Login with Loyalty & Referrals):** Customer enters Phone Number for digital receipts, **Loyalty Tier Status**, unique **Referral Code Sharing** (e.g. `ALDI-CAFE10`), and active **Promo Discount Code input**.
  - **Option B (Pure Guest Mode):** Customer simply enters a display Name (e.g. "Aldi") for instant table delivery identification without disclosing a phone number.
- **Product Master Menu Fetch:** Dynamic menu rendering fetched from `Hfe` Product Master API (`GET /v1/products`).
- **Drink & Food Customizer:** Interactive modifiers (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
- **Promo & Referral Apply:** Customers can enter owner promo codes (`HAPPYHOUR`) and claim friend referral codes for instant dual bonus points.
- **Real-Time Order Tracker:** Live status tracking (Order Placed ➔ Brewing ➔ Ready for Pickup / Served).

### Pillar 2: Barista & Cashier Touch POS (`L1-02`)
- **Employee Contact Authentication:** Baristas & Cashiers authenticate shift openings using their `employee` record via `Hfe` Contact Master API.
- **Table Matrix & Queue Grid:** Touch-optimized order matrix organized by Table Numbers and Takeaway queues.
- **Manual Promo Override:** Cashiers can apply owner promo discount codes manually at the POS touchscreen.
- **Shift Drawer Float Reconciliation:** Opening and closing cash drawer count verification with variance logging via `Hfe` REST APIs.

### Pillar 3: Policy-Based Payment Checkout (`L1-03`)
- **Pay-First Policy (Pre-Paid):** Customer pays immediately via QRIS/VA before order is sent to Barista/Kitchen.
- **Open Tab / Pay-at-End Policy (Post-Paid):** Customer adds multiple round orders to their table tab and settles total bill upon departure (Pay via Phone or Cashier).
- **Automated Settlement & Referral Accrual:** Outbound checkout payloads submitted to `Hfe` REST APIs.

### Pillar 4: Kitchen & Barista Ticket Display (`L1-04`)
- Real-time Kitchen Display System (KDS) showing pending drinks and food orders.
- ESC/POS thermal printer integration for printing order chits to espresso bar and kitchen.

---

## 3. Owner Marketing & Growth Suite

| Marketing Feature | Owner Capability | Hfe REST API Endpoint | Customer / POS Experience |
|---|---|---|---|
| **Promo Discount Codes** | Create fixed IDR or % discount codes (e.g. `HAPPYHOUR`, `WEEKEND20`) | `POST /v1/promos` | Input promo code at checkout cart for instant discount |
| **Referral Program** | Set dual bonus points for referrer & friend | `POST /v1/referrals/claim` | Share unique code (`ALDI-CAFE10`); both get bonus points |
| **Tier Perk Linking** | Link Hfe Voucher templates to loyalty tiers | `PUT /v1/loyalty/settings` | Auto-unlocks free vouchers upon reaching tier thresholds |

---

## 4. Verification & Quality Standards

- **Promo Validation Speed:** Promo code validation & cart discount recalculation < 150ms.
- **Referral Bonus Accrual:** Dual bonus point credit to both referrer and referee < 1 second.
- **Universal Core Integration:** Leverages generic Hfe Loyalty, Promo, and Referral REST APIs (`/v1/loyalty`, `/v1/promos`, `/v1/referrals`).
- **Kitchen Ticket Sync:** Order transmission from customer phone to Barista screen < 500ms.
- **Hfe API Compliance:** All checkout payloads match `Hfe` OpenAPI specifications.
