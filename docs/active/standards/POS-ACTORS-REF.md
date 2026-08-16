---
okf_version: "0.2"
type: Reference Standard
title: POS-ACTORS-REF — Complete POS Operational Actors & RBAC Matrix Reference
description: Authoritative inventory of all 13 defined operational actors, customer personas, staff RBAC roles, and surface permissions in Hfe POS & Commerce Suite.
tags: [standard, pos-actors-ref, actors, rbac, roles, permissions, personas]
status: Approved
effective_date: 2026-08-15
---

# POS-ACTORS-REF: Complete POS Operational Actors & RBAC Matrix Reference

## 1. Scope

This document defines the 13 official **Operational Actors**, customer personas, staff RBAC roles, and surface access permissions in **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`).

---

## 2. Inventory of 13 Defined POS Actors

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │            Hfe POS 13 Operational Actors                │
                                  └───────────┬───────────────────┬───────────────────┬─────┘
                                              │                   │                   │
               ┌──────────────────────────────┘                   │                   └──────────────────────────────┐
               ▼                                                  ▼                                                  ▼
 👑 EXTERNAL CUSTOMERS & GUESTS                   💼 STORE OPERATIONAL STAFF (RBAC)                 👔 STORE OWNERSHIP & MANAGEMENT
 ──────────────────────────────                   ─────────────────────────────────                 ───────────────────────────────
 1. Customer (Scan QR / F&B)                      4. Kasir (Cashier)                                13. Owner / Store Manager
 2. Retail Customer (Scan & Go)                   5. Barista (Drink Bar)
 3. VIP Fine Dining Guest                         6. Chef / Cook (Dapur & Bakery)
                                                  7. Server / Waiter (Pramusaji)
                                                  8. Checker / QC Inspector
                                                  9. Runner / Expediter
                                                 10. Kurir Toko (Internal Delivery)
                                                 11. Sommelier (Wine Specialist)
                                                 12. Stocker / Operator Gudang
```

---

### 👑 Category A: External Customers & Guests (Pelanggan)

1. 📱 **Customer (Pelanggan F&B Walk-In / Scan QR Meja)**:
   - **Capabilities**: QR Table self-ordering, drink customizer (Ice/Hot, Sugar %, Dairy), allergen flags (`lactose`, `nuts`, `gluten`), loyalty points accrual, voucher wallet redemption, digital WA receipt recipient.
2. 🛒 **Retail / Scan & Go Customer (Pelanggan Toko Kelontong)**:
   - **Capabilities**: Smartphone WebRTC camera barcode scanning, live mobile cart, QRIS payment, QR Exit Pass passkey, Kasbon credit balance view.
3. 🍷 **VIP Fine Dining Guest (Tamu VIP Restoran)**:
   - **Capabilities**: Multi-course tasting menu diner, wine pairing selection, anniversary/birthday preference profile, discreet folio settlement.

---

### 💼 Category B: Store Operational Staff (Staf RBAC)

4. 💵 **Kasir (`cashier`)**:
   - **Capabilities**: Touch POS walk-in catalog entry, barcode scanner search (`Ctrl+B`), opening/closing shift float count reconciliation (`1010-Cash Drawer`), cash change calculator, thermal receipt printing.
5. ☕ **Barista (`barista`)**:
   - **Capabilities**: KDS Kanban queue for beverages (`drink-bar`), drink modifier drawer, recipe BOM ingredient SOP viewer, status bump (`Brewing` ➔ `Ready`).
6. 🍳 **Chef / Cook (`chef`)**:
   - **Capabilities**: KDS Kanban queue for food (`hot-kitchen` & `pastry-bakery`), dish preparation timers (Green/Yellow/Red), status bump (`Cooking` ➔ `Ready`).
7. 🤵 **Server / Waiter (`waiter`)**:
   - **Capabilities**: Table floor plan matrix (Table 1-20), table reassignment (Pindah Meja), split bill per seat, join meja, waiter call alert response, course firing.
8. 🔍 **Checker / QC Inspector (`checker_qc`)**:
   - **Capabilities**: Pass table inspection, dish completeness per seat verification, allergen note check, status bump (`Ready` ➔ `QC Passed`).
9. 🏃 **Runner / Expediter**:
   - **Capabilities**: Order delivery from pass table to customer seat tags, status bump (`QC Passed` ➔ `Served`).
10. 🛵 **Kurir Toko / Internal Delivery Runner**:
    - **Capabilities**: Neighborhood delivery dispatcher, customer WhatsApp tracking alert sender, COD cash collection / QRIS verification, delivery status bump (`In-Transit` ➔ `Delivered`).
11. 🍷 **Sommelier**:
    - **Capabilities**: Digital wine list curator, cellar bottle inventory lookup (`GET /v1/cellar/bottles`), decanting timer monitoring, glass vs bottle pour logging.
12. 📦 **Stocker / Operator Gudang**:
    - **Capabilities**: Multi-warehouse location switcher (`WH-CENTRAL-HQ` vs `WH-SENOPATI-STORE`), goods receiving from suppliers, internal stock transfers, waste/spoilage logging, barcode stocktake audit.

---

### 👔 Category C: Store Ownership & Management

13. 👔 **Owner / Store Manager (`owner` / `manager`)**:
    - **Capabilities**: 3-Step Store Onboarding Setup Wizard, PB1 Tax Mode (0/1/2) & Service Charge %, Shift Float reconciliation audit, Manager PIN authorized voids & refunds, Team membership invitations & PIN generation, Subscription tiering (Free vs Pay Tier).
