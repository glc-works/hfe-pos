---
okf_version: "0.2"
type: Development Plan Level 2
title: AWB Resi Generator, QR Package Label Printer, ESC/POS Thermal Chit & Digital Receipt Engine
description: Implements AWB Resi code generator, printable QR code package label component, public delivery tracking view, ESC/POS thermal chit printer driver (58mm/80mm), and digital WhatsApp receipt folio integrated with HCB REST APIs.
tags: [development-plan, level-2, resi, awb-tracking, receipt-printer, esc-pos, qrcode-label]
parent_level_1: l1-16-unified-resi-awb-and-receipt-engine
github_issue: 19
status: Proposed
---

# Level 2 Implementation Plan: AWB Resi Generator, QR Package Label Printer, ESC/POS Thermal Chit & Digital Receipt Engine

## 1. Outcome
Delivers the Unified Resi & Receipt module (`src/views/ResiTrackingView.tsx`, `src/components/resi/`, `src/utils/escPosDriver.ts`) supporting unique AWB Resi generation, printable QR delivery package labels, public tracking web view, ESC/POS thermal chit printing, and digital WhatsApp PDF receipt folios integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: AWB Resi & QR Package Labeling (`src/components/resi/PackageResiLabel.tsx`)
- Implement `PackageResiLabel.tsx`:
  - AWB Resi Generator Format: `RESI-<STORE_SLUG>-<YYYYMMDD>-<4DIGIT_SEQ>` (e.g. `RESI-SENOPATI-20260815-0042`).
  - Printable Shipping Label Component: QR Code resi, recipient address, WhatsApp contact, delivery notes, runner assignment, and item packing checklist.
  - Print trigger for ESC/POS thermal label printer or browser print dialog.

### Phase B: Public Resi Delivery Tracking View (`src/views/ResiTrackingView.tsx`)
- Implement `ResiTrackingView.tsx`:
  - Public route `/resi/:resiCode` (Zero login required).
  - Real-time status progress timeline: `Pesanan Dibuat` ➔ `Dipacking Dapur` ➔ `Dalam Pengiriman (Budi)` ➔ `Tiba di Lokasi`.
  - 1-Tap "Hubungi Kurir" WhatsApp button.

### Phase C: ESC/POS Thermal Receipt Driver & Digital Folio (`src/utils/escPosDriver.ts` & `ReceiptModal.tsx`)
- Implement `escPosDriver.ts`:
  - ESC/POS Command Generator for 58mm (32 chars) & 80mm (48 chars) thermal receipt paper.
  - WebBluetooth & WebUSB connection helpers.
  - Statutory Receipt Header: Legal PT Name, Store Address, NPWP, Cashier PIN Name, Itemized List, Subtotal, PB1 Tax (10%), Service Charge (5%), QRIS Ref, and IDR tabular formatting.
- Implement `ReceiptModal.tsx`:
  - Preview digital receipt folio on screen.
  - "Cetak Struk Thermal" button & "Kirim Struk via WA" 1-tap action.

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `generateResi(deliveryId)` ➔ `POST /v1/company-books/{book}/deliveries/{id}/generate-resi`
  - `fetchResiStatus(resiCode)` ➔ `GET /v1/company-books/{book}/deliveries/resi/{resiCode}`
  - `sendDigitalReceipt(txId, phone)` ➔ `POST /v1/company-books/{book}/transactions/{id}/receipt`

### Phase E: Vitest Unit Testing (`src/tests/resiAndReceipt.test.ts`)
- Unit test coverage:
  - Verifies AWB Resi code format generator (`RESI-SENOPATI-20260815-0042`).
  - Verifies ESC/POS string formatter character alignment (58mm vs 80mm).

## 3. Explicit Exclusions
- Does not modify HCB server-side delivery ledger tables; operates strictly within the Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/resi/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
