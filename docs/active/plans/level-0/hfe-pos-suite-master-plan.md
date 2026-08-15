---
okf_version: "0.2"
type: Strategic Plan Level 0
title: Hfe POS & Cafe Mobile Order Suite — Master Strategic Plan
description: Master product vision for the Cafe & F&B Experience Layer, delivering a dual-surface cashier station and smartphone QR table self-ordering web app powered by Hfe REST APIs.
tags: [master-plan, level-0, pos, cafe, mobile-qr-order, f-and-b, phone-login, guest-mode, open-tab, loyalty-points, owner-settings]
status: Proposed
---

# Level 0 Strategic Plan: Hfe POS & Cafe Mobile Order Suite

## 1. Executive Summary & Vision

The **Hfe POS & Cafe Mobile Order Suite** (`glc-works/hfe-pos`) is the dedicated **Cafe & F&B Experience Layer** built for modern coffee shops, cafes, and restaurants.

It provides a seamless **Dual-Surface Experience**:
1. **Customer Smartphone QR Ordering (Self-Service Web App):** Customers scan a QR code at their table, select their preferred login mode (**Phone/WhatsApp Login with Loyalty Points** OR **Pure Guest Mode with Name only**), browse visual coffee & food menus, customize modifiers, redeem loyalty points for drink discounts, and order under cafe-configurable payment policies (**Pay-First** vs **Open Tab Billing**).
2. **Barista & Cashier Touch POS (POS & Kitchen Display):** Baristas and cashiers manage table billing tabs, print kitchen tickets, handle offline cash/QRIS checkouts, and reconcile daily shift cash drawers.

Cafe Owners configure loyalty rules (accrual rate, point valuation, expiry) via **Owner Loyalty Policy Settings** and monitor customer point metrics on a **per-contact basis** (`GET /v1/contacts/{id}/loyalty`). All **Customers, Employee Profiles, and Loyalty Point Balances** are resolved via `Hfe` Contact Master & Loyalty REST APIs (`/v1/contacts`, `/v1/loyalty`). Product master data, financial subledgers, ingredient COGS depletions, biller splits, and DJP taxes are executed behind **Hfe REST APIs**.

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
│ Loyalty & Guest Order│ │ POS & Table Engine   │               │ Checkout (Pay/Tab)   │ │ & Barista Display    │
└──────────────────────┘ └──────────────────────┘               └──────────────────────┘ └──────────────────────┘
                                 │
                                 ▼ (100% REST API Transport Layer)
                     ┌─────────────────────────────────────────────────────────────┐
                     │  Hfe Core REST APIs (Contacts, Products, Loyalty & Ledger)  │
                     └─────────────────────────────────────────────────────────────┘
```

### Pillar 1: Customer Phone / Guest Name Mobile QR Self-Ordering (`L1-01`)
- **Zero App Install & Flexible Customer Entry:**
  - **Option A (Phone/WhatsApp Login with Loyalty Points):** Customer enters Phone Number for digital receipts and automatic **Loyalty Points Earning & Redemption** (`GET /v1/contacts/{id}/loyalty`).
  - **Option B (Pure Guest Mode):** Customer simply enters a display Name (e.g. "Aldi") for instant table delivery identification without disclosing a phone number.
- **Product Master Menu Fetch:** Dynamic menu rendering fetched from `Hfe` Product Master API (`GET /v1/products`).
- **Drink & Food Customizer:** Interactive modifiers (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
- **Real-Time Order Tracker:** Live status tracking (Order Placed ➔ Brewing ➔ Ready for Pickup / Served).

### Pillar 2: Barista & Cashier Touch POS (`L1-02`)
- **Employee Contact Authentication:** Baristas & Cashiers authenticate shift openings using their `employee` record via `Hfe` Contact Master API.
- **Table Matrix & Queue Grid:** Touch-optimized order matrix organized by Table Numbers and Takeaway queues.
- **Shift Drawer Float Reconciliation:** Opening and closing cash drawer count verification with variance logging via `Hfe` REST APIs.

### Pillar 3: Policy-Based Payment Checkout (`L1-03`)
- **Pay-First Policy (Pre-Paid):** Customer pays immediately via QRIS/VA before order is sent to Barista/Kitchen.
- **Open Tab / Pay-at-End Policy (Post-Paid):** Customer adds multiple round orders to their table tab and settles total bill upon departure (Pay via Phone or Cashier).
- **Automated Settlement & Loyalty Accrual:** Outbound checkout payloads submitted to `Hfe` REST Transaction & Loyalty APIs (`POST /v1/transactions`, `POST /v1/loyalty/accrue`).

### Pillar 4: Kitchen & Barista Ticket Display (`L1-04`)
- Real-time Kitchen Display System (KDS) showing pending drinks and food orders.
- ESC/POS thermal printer integration for printing order chits to espresso bar and kitchen.

---

## 3. Strict Abstraction Boundary — Experience Layer vs Hfe REST API Backend

| Concern | `hfe-pos` (Experience Layer) | `Hfe` Backend (REST API Platform) |
|---|---|---|
| **Owner Loyalty Policy Settings** | 👁️ Config UI Widget in Settings | ✅ `PUT /v1/loyalty/settings` (Per Company Book) |
| **Per-Contact Loyalty Monitoring** | 👁️ Displays Point Balance per Contact | ✅ `GET /v1/contacts/{id}/loyalty` (Audit log) |
| **Phone Login vs Guest Name Mode** | 👁️ Captures Phone OR Display Name UI | ✅ `POST /v1/contacts` (`type: customer`) |
| **Payment Policy (Pay-First vs Open Tab)** | ✅ Enforces Policy Workflow UI | ❌ Not concerned |
| **Product Master Data & Menu Catalog** | 👁️ Consumes API & Renders UI | ✅ `GET /v1/products` |
| **Barista Touch POS & Kitchen Display** | ✅ Owns Barista & Cashier UX | ❌ Not concerned |
| **Accounting, Subledger & Stock Depletion**| 👁️ Sends REST checkout payload | ✅ `POST /v1/transactions` (All accounting & taxes) |

---

## 4. Verification & Quality Standards

- **Owner Settings Response:** Policy updates propagate to checkout calculation < 1 second.
- **Loyalty Resolution Speed:** Customer loyalty balance query < 1 second.
- **Guest Entry Speed:** Phone login or Guest Name entry < 1 second.
- **Mobile Scan Performance:** Page load < 1 second on 4G connection; cart interaction < 30ms.
- **Kitchen Ticket Sync:** Order transmission from customer phone to Barista screen < 500ms.
- **Hfe API Compliance:** All checkout payloads match `Hfe` OpenAPI specifications.
