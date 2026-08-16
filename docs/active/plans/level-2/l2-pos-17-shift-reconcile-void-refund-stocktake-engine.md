---
okf_version: "0.2"
type: Development Plan Level 2
title: Shift Reconciliation Modal, Manager Void & Refund Engine, Stocktake Audit UI
description: Implements Shift Drawer opening/closing reconciliation modal, Manager PIN authorized voids & refunds, and physical stocktake audit interface integrated with HCB REST APIs.
tags: [development-plan, level-2, operational-workflows, shift-reconcile, void-refund, stocktake]
parent_level_1: l1-14-operational-workflows-shift-void-stocktake
github_issue: 17
status: Proposed
---

# Level 2 Implementation Plan: Shift Reconciliation Modal, Manager Void & Refund Engine, Stocktake Audit UI

## 1. Outcome
Delivers the Store Operational Workflows module (`src/components/shifts/`, `src/components/refunds/`, `src/components/inventory/`) supporting shift float reconciliation, manager PIN authorized order voids and refunds, and physical stocktake audits integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Shift Drawer Reconciliation (`src/components/shifts/ShiftDrawerModal.tsx`)
- Implement `ShiftDrawerModal.tsx`:
  - Opening Float Input (Default: Rp 500.000).
  - Mid-Shift Cash Out Form (Nominal & Notes).
  - Closing Physical Cash Count & Variance Calculator (`Expected` vs `Actual`).
  - Shift summary report printer generator (`POST /v1/company-books/{book}/shifts/reconcile`).

### Phase B: Manager Void & Refund Engine (`src/components/refunds/ManagerVoidModal.tsx`)
- Implement `ManagerVoidModal.tsx`:
  - Manager PIN authorization keypad.
  - Reason Selector for Void/Refund (*Pesanan Salah*, *Pelanggan Batal*, *Kualitas Tidak Sesuai*).
  - Full vs Partial Refund toggle.
  - Triggers reversal journal entry in HCB Core (`POST /v1/company-books/{book}/transactions/{id}/refund`).

### Phase C: Physical Stocktake Audit UI (`src/components/inventory/StocktakeAuditModal.tsx`)
- Implement `StocktakeAuditModal.tsx`:
  - Ingredient / SKU list with current system stock.
  - Physical count input field with auto-calculated variance badge.
  - Submits stock adjustment to HCB Core (`POST /v1/company-books/{book}/inventory/stocktake`).

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `reconcileShift(bookId, payload)` ➔ `POST /v1/company-books/{book}/shifts/reconcile`
  - `refundTransaction(txId, managerPin, reason)` ➔ `POST /v1/company-books/{book}/transactions/{id}/refund`
  - `submitStocktake(bookId, items)` ➔ `POST /v1/company-books/{book}/inventory/stocktake`

### Phase E: Vitest Unit Testing (`src/tests/shiftAndRefund.test.ts`)
- Unit test coverage:
  - Verifies shift cash variance math (`Actual - (Opening + Sales - CashOut)`).
  - Verifies manager PIN authorization check for refund requests.

## 3. Explicit Exclusions
- Does not modify HCB server-side transaction reversal logic; operates strictly within the Experience Layer UI modals and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
