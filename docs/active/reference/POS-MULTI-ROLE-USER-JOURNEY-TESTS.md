---
okf_version: "0.2"
type: Reference Document
title: POS-MULTI-ROLE-USER-JOURNEY-TESTS — End-to-End Multi-Role Operational Test Journeys
description: Authoritative test matrix detailing step-by-step user journeys and verification checkpoints for all 7 primary operational roles in Hfe POS & Commerce Suite.
tags: [reference, test-journeys, user-journey, rbac, qa, validation, hfe-pos]
status: Approved
effective_date: 2026-08-15
---

# POS-MULTI-ROLE-USER-JOURNEY-TESTS: Multi-Role End-to-End Operational Test Matrix

## 1. Executive Summary

This document defines the official **Multi-Role End-to-End Test User Journeys** for **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`). It serves as the primary verification matrix for QA, automated end-to-end integration tests, and operational walk-throughs across 7 primary roles.

---

## 🎭 2. The 7 Multi-Role Test User Journeys

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │         Hfe POS 7 Core Role Test Journeys               │
                                  └───────────┬───────────────────┬───────────────────┬─────┘
                                              │                   │                   │
               ┌──────────────────────────────┘                   │                   └──────────────────────────────┐
               ▼                                                  ▼                                                  ▼
 📱 1. Customer (QR Mobile Order)                 💼 STORE OPERATIONAL ROLES                        👔 STORE OWNERSHIP & MANAGEMENT
 🛒 5. Retail Customer (Scan & Go)                💵 2. Kasir POS (Touch Cashier Workstation)       👔 7. Store Owner / Manager
                                                  🍳 3. Chef & Barista (Unified KDS Kitchen)
                                                  🤵 4. Waiter / Server (Table & Floor Plan)
                                                  📦 6. Operator Gudang (Warehouse & Logistics)
```

---

### 📱 Journey 1: Pelanggan F&B Walk-In / Scan QR (`Customer (QR Order)`)

- **Role Context**: Smartphone User (Web App 360px-430px Viewport)
- **Step-by-Step Test Execution**:
  1. **Scan QR Table**: Customer scans Table 04 QR code ➔ App opens `CustomerMobileView.tsx` with Table 04 seat binding.
  2. **Catalog & Customizer**: Selects *Espresso Aren Latte* ➔ Adds custom notes: *"Oatside Milk, Sugar 50%, Less Ice"*.
  3. **Voucher Selection**: Taps `"🎟️ Lihat & Pilih Voucher Available"` ➔ Applies *Voucher Eco Tumbler Rp 2.000* + *Diskon Ultah Rp 25.000* (Multi-Voucher Stacking).
  4. **Checkout & Payment**: Taps `+ Tambah Menu` if adding items ➔ Selects *QRIS Dynamic Payment* ➔ Simulates QR payment confirmation.
  5. **Live Status Tracking**: Screen shifts to live order progress tracker (`Accepted` ➔ `Brewing` ➔ `Served`).
  6. **Digital Receipt**: Receives digital PDF receipt link via WhatsApp.
- **Verification Checkpoint**: Subtotal, PB1 tax (10%), multi-voucher discount, and WhatsApp receipt URL payload verify 100% clean.

---

### 💵 Journey 2: Staf Kasir POS (`Touch Cashier Workstation`)

- **Role Context**: Desktop / Tablet Cashier Terminal (1024px+ Viewport)
- **Step-by-Step Test Execution**:
  1. **Auth & Shift Open**: Logs in via 6-Digit Staff PIN `123456` ➔ Selects `Cabang Senopati HQ` ➔ Verifies opening cash float Rp 500.000 (carried over from yesterday).
  2. **Walk-In Order Input**: Taps Pinned Favorites (*Espresso Aren*, *Croissant*) ➔ Types direct numeric qty `10` via `DirectQtyInputModal`.
  3. **Multi-Tender Payment**: Selects Split Payment ➔ Inputs Rp 100.000 Cash via Quick Cash Button `[ Rp 100.000 ]` + Rp 150.000 QRIS.
  4. **Printing & Shift Close**: Triggers ESC/POS 80mm thermal receipt printer ➔ Closes shift float with cash count reconciliation (*Balanced*).
- **Verification Checkpoint**: Shift float ledger balances, quick cash change calculator, and ESC/POS byte array format clean.

---

### 🍳 Journey 3: Chef Dapur & Barista (`Unified KDS Kitchen Workstation`)

- **Role Context**: Kitchen Touch KDS Monitor (1920x1080 Viewport)
- **Step-by-Step Test Execution**:
  1. **Ticket Arrival**: New order ticket arrives from Table 04 ➔ Renders on `UnifiedKdsView.tsx` with prep timer (Green badge).
  2. **Beverage Bump**: Barista taps `[ Brewing ]` ➔ Timer turns Yellow ➔ Taps `[ Ready ]` ➔ Ticket moves to Pass table.
  3. **Fine Dining Course Firing**: Executive Chef views Course 1 (Appetizer) served ➔ Taps `[ Fire Next Course (Main) ]` ➔ KDS triggers Waiter alert notification.
- **Verification Checkpoint**: Ticket state transitions (`Pending` ➔ `Brewing` ➔ `Ready` ➔ `Served`) and course firing timestamps verify clean.

---

### 🤵 Journey 4: Server / Waiter (`Table Floor Plan & Guest Binding`)

- **Role Context**: Handheld Mobile Tablet (768px Viewport)
- **Step-by-Step Test Execution**:
  1. **Floor Plan Audit**: Opens `TableFloorPlanGrid.tsx` ➔ Table 04 displays Yellow (*Occupied*) with guest name *Aldi Pratama* and *Lactose Allergy* alert banner.
  2. **Table Live Status Inspection**: Taps Table 04 ➔ Opens **Table Live Status Drawer** ➔ Reviews pending kitchen items (*Truffle Fries - Cooking*).
  3. **Table Reassignment**: Customer requests move to Table 08 ➔ Taps *Pindah Meja (Table 04 ➔ Table 08)* ➔ Order tab rebinds atomically.
  4. **N-Way Bill Split**: Taps *Split Bill Sub-Tabs* ➔ Splits bill into Seat 1 & Seat 2 separate folios.
- **Verification Checkpoint**: Table state reassignment and N-way seat bill split folios verify clean.

---

### 🛒 Journey 5: Kasir Toko Kelontong Retail (`Retail Barcode Cashier`)

- **Role Context**: Retail Barcode Counter Terminal
- **Step-by-Step Test Execution**:
  1. **Workstation Launch**: Opens `UnifiedPosView.tsx` (Retail Mode: Table Floor Plan tab automatically hidden).
  2. **Rapid Barcode Scan**: Scans SKU barcode via USB scanner (`Ctrl+B`) or types rapid syntax `10*8999901` (10 Pcs Indomie).
  3. **Wholesale Pricing Tier**: Quantity reaches 40 Pcs ➔ `useRetailPricing` automatically applies wholesale price tier (Dus/Karton rate).
  4. **Kasbon Credit Ledger**: Customer requests Kasbon payment ➔ Opens **Kasbon Ledger Modal** ➔ Checks credit limit ➔ Records Kasbon debt transaction.
- **Verification Checkpoint**: Multiplier barcode syntax parsing, wholesale UOM conversion, and Kasbon credit ledger balances verify clean.

---

### 📦 Journey 6: Operator Gudang (`Warehouse & Logistics`)

- **Role Context**: Warehouse Workstation Terminal
- **Step-by-Step Test Execution**:
  1. **Warehouse Location Switch**: Opens `WarehouseManagementView.tsx` ➔ Switches active location to `WH-CENTRAL-HQ`.
  2. **Goods Receiving**: Opens *Goods Receiving Modal* ➔ Scans carton barcodes from supplier delivery ➔ Logs Batch No. & Expiry Dates.
  3. **Stock Transfer**: Opens *Stock Transfer Modal* ➔ Transfers 50 cartons of Oatside Milk from `WH-CENTRAL-HQ` to `WH-SENOPATI-STORE`.
  4. **Waste Adjustment**: Logs 2 broken syrup bottles via *Waste Adjustment Modal* ➔ Subledger posts `6-5200-SPOILAGE-EXPENSE`.
- **Verification Checkpoint**: Source warehouse (-qty) and destination warehouse (+qty) balances update atomically.

---

### 👔 Journey 7: Store Owner / Manager (`Branch & Back-Office Manager`)

- **Role Context**: Smartphone / Tablet Executive Dashboard
- **Step-by-Step Test Execution**:
  1. **Mobile Settings Navigation**: Opens `CafeSettingsView.tsx` on mobile ➔ Navigates via tabs (`[ 🏪 Profil ]` | `[ 💰 Pajak ]` | `[ 👥 Tim ]` | `[ 🛒 PO & Expense ]`).
  2. **Multi-Branch Overview**: Opens `BranchManagementView.tsx` ➔ Reviews comparative real-time sales revenue between Senopati, BSD, and Kemang outlets.
  3. **Back-Office PO & Expense**: Submits supplier Purchase Order (PO) and logs petty cash expense claim.
  4. **Staff Invitation**: Invites new Barista staff member ➔ Generates 6-Digit Staff PIN for tablet login.
- **Verification Checkpoint**: Multi-branch sales comparative metrics and RBAC PIN generation verify clean.
