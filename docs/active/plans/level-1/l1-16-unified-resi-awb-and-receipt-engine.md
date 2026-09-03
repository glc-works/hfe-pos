---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Unified Resi Engine — Shipping AWB Tracking Number & Thermal/Digital Receipt Generator
description: Strategic plan for generating unique shipping AWB Resi tracking codes, QR barcode delivery package labels, ESC/POS thermal chit printing (58mm/80mm), and statutory digital receipt folios via HCB REST APIs.
tags: [plan, level-1, pos, resi, awb-tracking, receipt-printer, esc-pos, qrcode-label]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

> **AUTHORITY NOTE (2026-09-02):** Semantics here are pending extraction into Product Canon (glc-works/hfeit-product). Until extracted, Product Canon wins any conflict. This file is implementation coordination only.


# Level 1 Strategic Plan: Unified Resi Engine

## 1. Domain Outcome
Delivers the **Unified Resi Engine** for `hfe-pos` (`glc-works/hfe-pos`).

Covers both **Shipping AWB Tracking Resi** (for Self-Delivery & 3PL Aggregators) and **Statutory Thermal/Digital Transaction Receipts** (DJP Tax / PB1 compliant).

Generates unique AWB Resi tracking codes (e.g. `RESI-SENOPATI-20260815-0042`), renders scannable QR Code delivery package labels, handles ESC/POS thermal chit printing (58mm/80mm Bluetooth/USB/Network), and generates WhatsApp digital PDF receipts resolved through HCB Core REST APIs (`/v1/deliveries/resi`, `/v1/transactions/{id}/receipt`).

---

## 2. The Dual Resi Capabilities

```
 🧾 UNIFIED RESI ENGINE
 ├─ 🚚 1. RESI PENGIRIMAN / AWB TRACKING NUMBER (Self-Delivery & 3PL)
 │     - Unique AWB Resi Generator (`RESI-SENOPATI-20260815-0042` / 3PL `GK-882194`)
 │     - QR Code Package Label Printer (Stiker Tempel Dus/Plastik Delivery)
 │     - Live WhatsApp Resi Tracking Link (`hfe.togrow.id/resi/RESI-...`)
 │     - Webhook Status Sync (Dispatched ➔ In-Transit ➔ Delivered)
 │
 └─ 🖨️ 2. RESI / STRUK TRANSAKSI DIGITAL & THERMAL
       - ESC/POS Chit Printer (58mm / 80mm Bluetooth, USB, Network LAN)
       - Statutori Pajak PB1 10% / DJP Compliant (Nama PT, NPWP, Ref QRIS ASPI)
       - Digital WhatsApp & Email PDF Resi Folio
       - Re-print & Re-send Resi Capability
```

---

## 3. Capability Scope

### Pillar A: Resi Pengiriman & AWB Package Labeling
1. **AWB Resi Code Generator**: Generates immutable, unique AWB tracking code for every delivery order.
2. **QR Code Package Label Component (`PackageResiLabel.tsx`)**: Renders printable shipping label sticker with barcode/QR code, recipient address, item checklist, and runner assignment.
3. **Public Resi Tracking Surface (`ResiTrackingView.tsx`)**: Public web page allowing customers to track delivery progress in real-time (`/resi/{resi_code}`).

### Pillar B: Resi / Struk Transaksi Thermal & Digital
1. **ESC/POS Thermal Chit Driver (`escPosDriver.ts`)**: Formats 58mm (32 chars/line) & 80mm (48 chars/line) thermal receipts via WebUSB, Web Bluetooth, or Network TCP.
2. **Statutory Tax Compliance**: Includes Legal PT Name, Store Address, NPWP, Cashier PIN Name, Itemized List, Subtotal, PB1 Tax (10%), Service Fee (5%), QRIS Ref, and IDR Currency formatting.
3. **Digital WhatsApp Resi Folio**: Generates digital receipt image/PDF link sent automatically to customer WhatsApp (`POST /v1/transactions/{id}/receipt`).

---

## 4. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-19-awb-resi-and-thermal-receipt-engine.md`

---

## 5. Verification & Acceptance Criteria
- Scanning package QR code resi opens public tracking page (`ResiTrackingView.tsx`) accurately.
- Thermal receipt formatter outputs clean 58mm & 80mm character alignment without wrapping defects.
- Generating digital resi posts receipt record to HCB Core transaction ledger.
