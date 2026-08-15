---
okf_version: "0.2"
type: Strategic Plan Level 0
title: Hfe POS & Cafe Mobile Order Suite — Master Strategic Plan
description: Master product vision for the Cafe & F&B Experience Layer, delivering a dual-surface cashier station and smartphone QR table self-ordering web app powered by the Hfe Headless Financial Engine.
tags: [master-plan, level-0, pos, cafe, mobile-qr-order, f-and-b, hfe-connect, experience-layer]
status: Proposed
---

# Level 0 Strategic Plan: Hfe POS & Cafe Mobile Order Suite

## 1. Executive Summary & Vision

The **Hfe POS & Cafe Mobile Order Suite** (`glc-works/hfe-pos`) is the dedicated **Cafe & F&B Experience Layer** built for modern coffee shops, cafes, and restaurants.

It provides a seamless **Dual-Surface Experience**:
1. **Customer Smartphone QR Ordering (Self-Service Web App):** Customers scan a QR code at their table, browse rich visual coffee & food menus, customize modifiers (e.g. sugar level, oat milk upgrade), pay instantly via QRIS/VA, and receive real-time order status updates without installing any app.
2. **Barista & Cashier Touch POS (POS & Kitchen Display):** Baristas and cashiers manage table orders, print kitchen tickets, handle offline cash/QRIS checkouts, and reconcile daily shift cash drawers.

All financial transactions, ingredient COGS inventory depletions (coffee beans, milk volume), biller revenue splits, and DJP taxes are delegated to the **Hfe Headless Financial Engine**.

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
│ L1-01: Customer QR   │ │ L1-02: Barista Touch │               │ L1-03: QRIS & Instant│ │ L1-04: Kitchen Ticket│
│ Mobile Self-Order    │ │ POS & Table Engine   │               │ Payment Checkout     │ │ & Barista Display    │
└──────────────────────┘ └──────────────────────┘               └──────────────────────┘ └──────────────────────┘
                                 │
                                 ▼ (Delegates Financial Subledger, Stock & Taxes)
                     ┌─────────────────────────────────────────────────────────────┐
                     │             Hfe Headless Financial Engine Core               │
                     └─────────────────────────────────────────────────────────────┘
```

### Pillar 1: Customer QR Mobile Self-Ordering (`L1-01`)
- **Zero App Install:** Web app loaded instantly upon scanning table QR code (`hfe-pos.togrow.id/table/{id}`).
- **Interactive Cafe Menu:** High-res coffee & food photos, drink customizer (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
- **Real-Time Order Tracker:** Live status tracking (Order Placed ➔ Brewing ➔ Ready for Pickup / Served).

### Pillar 2: Barista & Cashier Touch POS (`L1-02`)
- Touch-optimized order matrix organized by Table Numbers and Takeaway queues.
- Walk-in cash/card manual order entry by cashier.
- Shift float management and cash drawer reconciliation (`1010-Cash Drawer`).

### Pillar 3: Dynamic QRIS & Instant Payment Checkout (`L1-03`)
- Direct in-app QRIS payment modal on customer's phone upon order placement.
- Automated payment confirmation webhook unlocking instant order submission to kitchen.
- Biller fee split breakdown (20% platform share / 80% merchant payout via TigerBeetle subledger).

### Pillar 4: Kitchen & Barista Ticket Display (`L1-04`)
- Real-time Kitchen Display System (KDS) showing pending drinks and food orders.
-ESC/POS thermal printer integration for printing order chits to espresso bar and kitchen.

---

## 3. Delegation Boundary — Engine vs Cafe Experience Layer

| Concern | `hfe-pos` (Cafe Experience Layer) | `Hfe` Core (Financial Engine) |
|---|---|---|
| **Table QR Scan & Mobile Menu Web App** | ✅ Owns Customer Phone UI | ❌ Not concerned |
| **Barista Touch POS & Kitchen Display** | ✅ Owns Barista & Cashier UX | ❌ Not concerned |
| **Ingredient COGS Depletion (Beans/Milk)**| 👁️ Tracks recipe modifiers | ✅ Posts Inventory Subledger |
| **QRIS & VA Settlement** | ✅ Triggers payment modal | ✅ Verifies money & posts double-entry |
| **DJP PPN Tax & E-Faktur Compliance** | 👁️ Displays PPN preview | ✅ Enforces DJP tax accounting |

---

## 4. Verification & Quality Standards

- **Mobile Scan Performance:** Page load < 1 second on 4G connection; cart interaction < 30ms.
- **Kitchen Ticket Sync:** Order transmission from customer phone to Barista screen < 500ms.
- **Hfe API Compliance:** All checkout payloads match `Hfe` OpenAPI specifications.
