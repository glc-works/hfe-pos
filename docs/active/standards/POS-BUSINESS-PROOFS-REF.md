---
okf_version: "0.2"
type: Standard Reference Document
title: POS-BUSINESS-PROOFS-REF — Authoritative POS Business Test Scenarios & Operational Proof Matrix
description: Authoritative inventory of business cases, roleplay user journeys, proof sentinels, and accounting verification criteria for Hfe POS & Commerce Suite (SCN-01 to SCN-09).
tags: [standard, reference, business-cases, user-journeys, proof-matrix, hfe-pos]
status: Approved
effective_date: 2026-08-16
---

# POS-BUSINESS-PROOFS-REF: Authoritative POS Business Test Scenarios & Proof Matrix

## 1. Executive Summary & Authority

This document defines the **Authoritative Business Test Scenarios (SCN-01 to SCN-09)** for **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`). It records every real-world business case, roleplay journey, expected financial outcome, and HCB GL journal mapping.

---

## 🎭 Master Business Scenario Matrix (SCN-01 to SCN-09)

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │      POS BUSINESS TEST SCENARIO MATRIX (SCN-01 to SCN-09)   │
                                  └───────────┬───────────────────┬───────────────────┬─────────┘
                                              │                   │                   │
               ┌──────────────────────────────┘                   │                   └──────────────────────────────┐
               ▼                                                  ▼                                                  ▼
 📱 CUSTOMER & WALK-IN JOURNEYS                  💵 CASHIER & TABLE JOURNEYS                       👔 STORE MANAGEMENT & HCB AUDIT
 - SCN-01: Direct Takeaway Pay-First             - SCN-04: Hybrid Barcode & Table View             - SCN-07: HCB Cash Shortage GL (`6-5300`)
 - SCN-02: Walk-In Open-Tab Pay-Later            - SCN-05: Sub-Folio Credit Line Join/Split        - SCN-08: Recipe Shrinkage & Theft Alert
 - SCN-03: Customer QR Mobile Checkout           - SCN-06: Partial Seat Early Checkout             - SCN-09: Direct Cashier Entry (No QR)
```

---

## 📜 Detailed Business Cases & Verification Sentinels

### 🛍️ SCN-01: Direct Walk-In Takeaway Checkout (Pay-First)
* **Actor**: Walk-in Customer & Cashier.
* **Business Context**: Customer orders 2x Iced Aren Latte (Rp 28.000) + 1x Almond Croissant (Rp 32.000) at counter for immediate takeaway.
* **Financial Calculations**:
  - `Subtotal`: Rp 88.000
  - `PB1 Tax (10%)`: Rp 8.800
  - `Grand Total`: Rp 96.800
  - `Cash Given`: Rp 100.000
  - `Change Returned`: Rp 3.200
* **Proof Sentinel**: Struk `#REC-2026-0816-001` issued with status `PAID`, dispatched to KDS Dapur as `Takeaway`.

---

### ☕ SCN-02: Walk-In Open-Tab Pay-Later Settlement
* **Actor**: Walk-in Customer (Erick) & Cashier.
* **Business Context**: Customer sits in open seating, orders without fixed pre-assigned table, pays when leaving.
* **Financial Calculations**:
  - `Tab ID`: `TAB-104` (Guest: Erick)
  - `Total Bill`: Rp 125.000
* **Proof Sentinel**: Cashier searches "Erick", settles `TAB-104`, updates status from `open-tab` to `PAID`.

---

### 📱 SCN-03: Customer QR Mobile Multi-Voucher Checkout
* **Actor**: Mobile Customer (Scan QR Meja 04).
* **Business Context**: Customer scans table QR, selects active voucher (Diskon Utama 15% + Perks Voucher Free Coffee), picks payment method (QRIS).
* **Proof Sentinel**: Stacker allows 1 Primary Discount + 1 Perk Voucher without coupon fraud.

---

### ⌨️ SCN-04: Hybrid POS Barcode Hardware & Table Floor Overlay
* **Actor**: Cashier (Retail & Cafe Hybrid Store).
* **Business Context**: Cashier is looking at Table Floor Plan view when customer brings retail coffee bean package (`SKU-8999901`). Sensor scanner fires barcode.
* **Proof Sentinel**: `Barcode Quick-Add Overlay` opens automatically on table screen, adds item to cart without losing table context.

---

### 🔀 SCN-05: Sub-Folio Credit Line Accounting on Join & Split
* **Actor**: Waiter & Cashier.
* **Business Context**: Table 04 (Rp 300k) joins Table 05 (Rp 200k with Rp 100k QRIS DP pre-paid). Later un-joins back.
* **Financial Calculations**:
  - `Group Bill`: Rp 500.000
  - `Pre-Paid Credit`: -Rp 100.000
  - `Remaining Payable`: Rp 400.000
* **Proof Sentinel**: Un-joining Table 05 restores Rp 100k credit line & PB1 tax integrity to Table 05 subledger without journal variance.

---

### 🔓 SCN-06: Partial Seat Un-Join & Early Departure Checkout
* **Actor**: Waiter & Seat 2 Guest (Budi).
* **Business Context**: 3 guests at Table 04. Seat 2 (Budi) departs early after drinking 1 Craft Beer (Rp 50.000). Seats 1 & 3 stay.
* **Financial Calculations**:
  - `Seat 2 Subtotal`: Rp 50.000
  - `Seat 2 PB1 Tax`: Rp 5.000
  - `Seat 2 Early Total`: Rp 55.000
* **Proof Sentinel**: Seat 2 is detached & settled; Seats 1 & 3 remain active on Table 04 without disturbing remaining orders.

---

### 💵 SCN-07: HCB Cash Shortage GL Entry (`6-5300-CASH-SHORTAGE`)
* **Actor**: Cashier & Store Manager.
* **Business Context**: Shift 1 closes with expected cash Rp 500.000, but drawer contains Rp 430.000 (-Rp 70.000 variance).
* **Financial Calculations**:
  - `Variance`: -Rp 70.000 (> Rp 50.000 anomaly threshold)
* **Proof Sentinel**: System flags anomaly, requires Manager PIN, posts GL journal `6-5300-CASH-SHORTAGE`.

---

### 🔍 SCN-08: Recipe BOM Inventory Shrinkage & Theft Warning
* **Actor**: Store Manager & Kitchen Chef.
* **Business Context**: 50 cups of espresso sold (BOM standard 900g coffee beans), but inventory record shows 1.500g deducted (66.6% shrinkage).
* **Proof Sentinel**: Manager Dashboard triggers `Inventory Shrinkage & Theft Warning Alert` with 1-tap stock adjustment.

---

### 💁‍♂️ SCN-09: Cashier Direct Table Order Entry (Tanpa QR Code)
* **Actor**: Waiter / Cashier (Direct Face-to-Face Order).
* **Business Context**: Customer sits at Table 04 and orders in person. Cashier enters order directly on POS screen without QR scanning.
* **Proof Sentinel**: Order channel is flagged as `cashier-pos`, items sent directly to KDS Dapur (`Order #108`).

---

## 🧪 Test Suite Traceability Matrix

| Scenario ID | Business Case Description | Primary Component | Automated Vitest File |
|---|---|---|---|
| **`SCN-01`** | Direct Walk-In Takeaway Checkout | `PosCartSection.tsx` | `userJourneyLoop.test.ts` |
| **`SCN-02`** | Walk-In Open-Tab Pay-Later | `TableGuestBindingDrawer.tsx` | `userJourneyLoop.test.ts` |
| **`SCN-03`** | Customer Mobile Multi-Voucher | `VoucherSelectionDrawer.tsx` | `userJourneys.test.ts` |
| **`SCN-04`** | Hybrid Barcode Scanner Overlay | `PosCatalogGrid.tsx` | `userJourneyLoop.test.ts` |
| **`SCN-05`** | Sub-Folio Credit Line Join/Split | `TableOperationsModal.tsx` | `userJourneyLoop.test.ts` |
| **`SCN-06`** | Partial Seat Early Checkout | `TableDetailDrawer.tsx` | `userJourneyLoop.test.ts` |
| **`SCN-07`** | HCB Cash Shortage GL Entry | `useHfeInsights.ts` | `userJourneyLoop.test.ts` |
| **`SCN-08`** | Recipe Shrinkage & Theft Alert | `useHfeInsights.ts` | `userJourneyLoop.test.ts` |
| **`SCN-09`** | Cashier Direct Order (No QR) | `UnifiedPosView.tsx` | `userJourneyLoop.test.ts` |
