---
okf_version: "0.2"
type: Development Plan Level 2
title: Warehouse Management View, Internal Stock Transfer Engine & Spoilage Adjustment UI
description: Implements dedicated Warehouse Management view, multi-warehouse location switcher, supplier goods receiving modal, internal warehouse stock transfer engine, and waste/spoilage adjustment UI integrated with HCB REST APIs.
tags: [development-plan, level-2, warehouse, multi-warehouse, stock-transfer, goods-receiving, waste-spoilage]
parent_level_1: l1-18-multi-warehouse-operations-suite
github_issue: 21
status: Proposed
---

# Level 2 Implementation Plan: Warehouse Management View, Internal Stock Transfer Engine & Spoilage Adjustment UI

## 1. Outcome
Delivers the Warehouse Operations module (`src/views/WarehouseManagementView.tsx`, `src/components/warehouse/`, `src/hooks/useWarehouse.ts`) supporting multi-warehouse location tracking, supplier goods receiving, internal stock transfers, waste/spoilage adjustments, and barcode inventory audits integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Warehouse Management Workstation View (`src/views/WarehouseManagementView.tsx`)
- Implement `WarehouseManagementView.tsx`:
  - Warehouse Location Selector Dropdown (`WH-SENOPATI-STORE`, `WH-CENTRAL-HQ`, `WH-RESERVE-01`).
  - Inventory Stock List Table with stock level badges (High, Low-Stock Warning, Out-of-Stock).
  - Quick action toolbar: `Penerimaan Barang (Receiving)`, `Transfer Stok`, `Catat Waste/Kadaluarsa`, `Opname Barcode`.

### Phase B: Goods Receiving & Stock Transfer Modals (`src/components/warehouse/`)
- `GoodsReceivingModal.tsx` — Form for receiving goods from supplier/PO with barcode scanner input, received quantity, batch number, and expiry date inputs.
- `StockTransferModal.tsx` — Form for transferring stock between warehouses (Source Warehouse ➔ Destination Warehouse), item list, and transfer notes.
- `WasteAdjustmentModal.tsx` — Form for recording waste/spoilage/breakage with reason selector (*Spilled Coffee Beans*, *Expired Milk*, *Broken Bottle*).

### Phase C: Warehouse Session State Hook (`src/hooks/useWarehouse.ts`)
- Implement `useWarehouse()` hook:
  - Manages active warehouse location, stock levels, pending transfer requests, and receiving logs.
  - Stock Transfer State Machine: `requested` ➔ `in_transit` ➔ `received`.

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fetchWarehouses(bookId)` ➔ `GET /v1/company-books/{book}/warehouses`
  - `receiveGoods(bookId, payload)` ➔ `POST /v1/company-books/{book}/inventory/receive`
  - `transferStock(bookId, payload)` ➔ `POST /v1/company-books/{book}/inventory/transfer`
  - `adjustWaste(bookId, payload)` ➔ `POST /v1/company-books/{book}/inventory/adjust`

### Phase E: Vitest Unit Testing (`src/tests/warehouse.test.ts`)
- Unit test coverage:
  - Verifies stock transfer state transitions.
  - Verifies waste/spoilage adjustment payload formatting.

## 3. Explicit Exclusions
- Does not modify HCB server-side inventory subledger posting logic; operates strictly within the Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/warehouse/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
