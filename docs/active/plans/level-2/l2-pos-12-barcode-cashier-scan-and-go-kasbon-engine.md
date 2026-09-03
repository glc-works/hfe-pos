---
okf_version: "0.2"
type: Development Plan Level 2
title: Barcode POS Cashier, Mobile Scan & Go, UOM Conversion & Kasbon Engine
description: Implements rapid barcode scanner POS cashier view, smartphone camera Scan & Go web app, wholesale UOM unit price tiering, and Customer Kasbon credit ledger tracking integrated with HCB REST APIs.
tags: [development-plan, level-2, toko-kelontong, barcode-scanner, scan-and-go, uom, kasbon, retail]
parent_level_1: l1-10-toko-kelontong-retail-suite
github_issue: 12
status: Proposed
---

> **AUTHORITY NOTE (2026-09-02):** Semantics here are pending extraction into Product Canon (glc-works/hfeit-product). Until extracted, Product Canon wins any conflict. This file is implementation coordination only.


# Level 2 Implementation Plan: Barcode POS Cashier, Mobile Scan & Go, UOM Conversion & Kasbon Engine

## 1. Outcome
Delivers the Toko Kelontong & General Retail extension (`src/views/RetailPosView.tsx` & `src/views/ScanAndGoView.tsx`) supporting rapid barcode scanner entry, wholesale UOM price conversions (Pcs ➔ Pack ➔ Dus), customer Kasbon credit ledgers, and smartphone camera barcode scanning integrated with HCB REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Barcode Scanner POS View (`src/views/RetailPosView.tsx`)
- Implement `RetailPosView.tsx`:
  - Barcode input field auto-focus handler with key listener (`Ctrl+B`).
  - Fast quantity multiplier parser (e.g. `10*8999901` adds 10 units instantly).
  - Quick product search modal with stock level badge (`src/components/retail/ProductSearchModal.tsx`).
  - Change calculator modal for cash transactions.

### Phase B: Customer Mobile Scan & Go (`src/views/ScanAndGoView.tsx`)
- Implement `ScanAndGoView.tsx`:
  - HTML5 / WebRTC camera barcode scanner stream component (`src/components/retail/CameraBarcodeScanner.tsx`).
  - Scan-to-Cart drawer with instant price lookup.
  - QRIS Checkout with digital exit pass passkey generation (`ExitPassModal.tsx`).

### Phase C: Wholesale UOM Conversion Engine (`src/hooks/useRetailPricing.ts`)
- Implement `useRetailPricing()` hook:
  - UOM Conversion Matrix: Pcs (1), Pack (10), Dus/Karton (40).
  - Wholesale Tier Evaluator: Automatically switches item price from `retailPrice` to `wholesalePrice` when cart quantity crosses threshold.

### Phase D: Customer Kasbon Receivables Ledger (`src/components/retail/`)
- Implement `KasbonManagementModal.tsx`:
  - Displays customer credit limit, current active Kasbon balance, and due date.
  - Partial or full payment settlement via Cash or QRIS (`POST /v1/company-books/{book}/contacts/{id}/kasbon/pay`).

### Phase E: Hfe REST API Transport Updates (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `lookupBarcode(barcodeString)` ➔ `POST /v1/company-books/{book}/barcodes/lookup`
  - `fetchKasbonBalance(contactId)` ➔ `GET /v1/company-books/{book}/contacts/{id}/receivables`
  - `settleKasbon(contactId, amount)` ➔ `POST /v1/company-books/{book}/contacts/{id}/kasbon/pay`

### Phase F: Vitest Unit Testing (`src/tests/retailAndKasbon.test.ts`)
- Unit test coverage:
  - Verifies UOM price conversion math (40 pcs switches to wholesale price).
  - Verifies barcode string parser (`10*8999901` ➔ qty 10, barcode `8999901`).
  - Verifies Kasbon balance deduction calculation.

## 3. Explicit Exclusions
- Does not modify HCB server-side inventory ledgers; operates strictly within the `hfe-pos` Experience Layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/views/` and `src/components/` remain under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
