---
okf_version: "0.2"
type: Strategic Plan Level 0
title: Hfe POS & Cafe Mobile Order Suite — Master Strategic Plan
description: Master product vision for the Cafe & F&B Experience Layer, delivering a dual-surface cashier station and smartphone QR table self-ordering web app powered by the Hfe Headless Financial Engine.
tags: [master-plan, level-0, pos, cafe, mobile-qr-order, f-and-b, guest-login, open-tab, hfe-connect, contact-master]
status: Proposed
---

# Level 0 Strategic Plan: Hfe POS & Cafe Mobile Order Suite

## 1. Executive Summary & Vision

The **Hfe POS & Cafe Mobile Order Suite** (`glc-works/hfe-pos`) is the dedicated **Cafe & F&B Experience Layer** built for modern coffee shops, cafes, and restaurants.

It provides a seamless **Dual-Surface Experience**:
1. **Customer Smartphone QR Ordering (Self-Service Web App):** Customers scan a QR code at their table, complete a quick **Guest Login** (Name & WhatsApp), browse visual coffee & food menus, customize modifiers, and order under cafe-configurable payment policies (**Pay-First** vs **Open Tab Billing**).
2. **Barista & Cashier Touch POS (POS & Kitchen Display):** Baristas and cashiers manage table billing tabs, print kitchen tickets, handle offline cash/QRIS checkouts, and reconcile daily shift cash drawers.

All **Customers and Employees/Staff Profiles** are linked directly to the central **`Hfe` Contact Master Subledger** (`/v1/contacts`). Product master data, financial subledgers, ingredient COGS depletions, biller splits, and DJP taxes are executed by the **Hfe Headless Financial Engine**.

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
│ L1-01: Guest Login & │ │ L1-02: Barista Touch │               │ L1-03: Policy Payment│ │ L1-04: Kitchen Ticket│
│ Mobile QR Self-Order │ │ POS & Table Engine   │               │ Checkout (Pay/Tab)   │ │ & Barista Display    │
└──────────────────────┘ └──────────────────────┘               └──────────────────────┘ └──────────────────────┘
                                 │
                                 ▼ (Resolves Contacts & Delegates Financial Subledger/Stock)
                     ┌─────────────────────────────────────────────────────────────┐
                     │ Hfe Contact Master, Product Service & Headless Engine Core │
                     └─────────────────────────────────────────────────────────────┘
```

### Pillar 1: Guest Login & Customer Mobile QR Self-Ordering (`L1-01`)
- **Zero App Install & Guest Contact Resolution:** Customer scans table QR code (`hfe-pos.togrow.id/table/{id}`) and enters Name & WhatsApp number, creating/linking a `customer` record in `Hfe` Contact Master.
- **Product Master Menu Fetch:** Dynamic menu rendering fetched from `Hfe` Product Service (`/v1/company-books/{book}/products`).
- **Drink & Food Customizer:** Interactive modifiers (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
- **Real-Time Order Tracker:** Live status tracking (Order Placed ➔ Brewing ➔ Ready for Pickup / Served).

### Pillar 2: Barista & Cashier Touch POS (`L1-02`)
- **Employee Contact Authentication:** Baristas & Cashiers authenticate shift openings using their `employee` record in `Hfe` Contact Master.
- **Table Matrix & Queue Grid:** Touch-optimized order matrix organized by Table Numbers and Takeaway queues.
- **Shift Drawer Float Reconciliation:** Opening and closing cash drawer count verification (`1010-Cash Drawer`) with overage/shortage variance logging.

### Pillar 3: Policy-Based Payment Checkout (`L1-03`)
- **Pay-First Policy (Pre-Paid):** Customer pays immediately via QRIS/VA before order is sent to Barista/Kitchen.
- **Open Tab / Pay-at-End Policy (Post-Paid):** Customer adds multiple round orders to their table tab and settles total bill upon departure (Pay via Phone or Cashier).
- **Biller Split Breakdown:** Automatic 20% platform share / 80% merchant payout via TigerBeetle subledger.

### Pillar 4: Kitchen & Barista Ticket Display (`L1-04`)
- Real-time Kitchen Display System (KDS) showing pending drinks and food orders.
- ESC/POS thermal printer integration for printing order chits to espresso bar and kitchen.

---

## 3. Delegation Boundary — Engine vs Cafe Experience Layer

| Concern | `hfe-pos` (Cafe Experience Layer) | `Hfe` Core (Contact Master & Financial Engine) |
|---|---|---|
| **Customer & Employee Profiles** | 👁️ Captures Name/WA & Employee Pin | ✅ **Central `Contact` Master Subledger (`type: customer/employee`)** |
| **Guest Login & Table QR Web App** | ✅ Owns Phone UI & Session Token | ❌ Not concerned |
| **Payment Policy (Pay-First vs Open Tab)** | ✅ Enforces Policy Workflow | ❌ Not concerned |
| **Product Master Data & Menu Catalog** | 👁️ Consumes API & Renders UI | ✅ Central Product Master & Price Catalog |
| **Barista Touch POS & Kitchen Display** | ✅ Owns Barista & Cashier UX | ❌ Not concerned |
| **Ingredient COGS Depletion (Beans/Milk)**| 👁️ Tracks recipe modifiers | ✅ Posts Inventory Subledger |
| **QRIS & VA Settlement** | ✅ Triggers payment modal | ✅ Verifies money & posts double-entry |

---

## 4. Verification & Quality Standards

- **Contact Resolution Speed:** Guest/Employee `Contact` creation & verification < 1.5 seconds.
- **Guest Login Speed:** Guest authentication < 3 seconds.
- **Mobile Scan Performance:** Page load < 1 second on 4G connection; cart interaction < 30ms.
- **Kitchen Ticket Sync:** Order transmission from customer phone to Barista screen < 500ms.
- **Hfe API Compliance:** All checkout payloads match `Hfe` OpenAPI specifications.
