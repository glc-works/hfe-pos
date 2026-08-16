---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Multi-Warehouse Operations Suite (Goods Receiving, Stock Transfer, Waste Spoilage & Barcode Audit)
description: Strategic plan for dedicated warehouse operations mode, multi-warehouse location tracking (Central vs Storefront), goods receiving from suppliers, internal stock transfers, waste/spoilage adjustments, and mobile barcode stocktake audits via HCB REST APIs.
tags: [plan, level-1, pos, warehouse, multi-warehouse, stock-transfer, goods-receiving, waste-spoilage]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Multi-Warehouse Operations Suite

## 1. Domain Outcome
Delivers the **Dedicated Warehouse Operations Suite (Mode Gudang)** for `hfe-pos` (`glc-works/hfe-pos`).

Enables store managers, stock clerks, and warehouse operators to manage multi-warehouse locations (e.g. `WH-CENTRAL-HQ`, `WH-SENOPATI-STORE`, `WH-RESERVE-01`), execute goods receiving from suppliers, perform internal stock transfers between warehouses, log waste/spoilage adjustments, and execute mobile barcode stocktake audits resolved through HCB Core REST APIs (`/v1/warehouses`, `/v1/inventory`).

---

## 2. Capability Scope

```
 📦 MULTI-WAREHOUSE OPERATIONAL LIFECYCLE
 ├─ 🏢 1. Multi-Warehouse Location Management (Central HQ vs Storefront Warehouse)
 ├─ 📥 2. Goods Receiving from Suppliers (`POST /v1/inventory/receive` with PO target & Expiry dates)
 ├─ 🚚 3. Internal Stock Transfer (`POST /v1/inventory/transfer` from Central to Storefront)
 ├─ 🗑️ 4. Waste & Spoilage Adjustment (`POST /v1/inventory/adjust` with reason Spoilage/Expired/Breakage)
 └─ 📱 5. Mobile Barcode Stocktake Audit (Barcode scanner inventory reconciliation)
```

### Pillar A: Multi-Warehouse & Goods Receiving
1. **Multi-Warehouse Location Selector**: Switch view between Storefront Warehouse (`WH-SENOPATI-STORE`) and Storage/Central Warehouse (`WH-CENTRAL-HQ`).
2. **Goods Receiving Workflow (`GoodsReceivingModal.tsx`)**: Receive shipments from suppliers or purchase orders, scan carton barcodes, log batch numbers, and record expiry dates for perishable dairy/produce.

### Pillar B: Stock Transfer & Spoilage Adjustments
1. **Internal Stock Transfer (`StockTransferModal.tsx`)**: Request or execute stock transfer from Central HQ to Storefront warehouse. State machine: `Requested` ➔ `In-Transit` ➔ `Received`.
2. **Waste & Spoilage Adjustment (`WasteAdjustmentModal.tsx`)**: Record spilled coffee beans, expired milk cartons, or broken bottles with subledger expense GL posting (`Dr Spoilage Expense / Cr Inventory`).
3. **Dedicated Warehouse Workstation View (`WarehouseManagementView.tsx`)**: Workstation surface tailored for warehouse operators with large barcode scanner focus.

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-21-warehouse-management-view-transfer-spoilage-engine.md`

---

## 4. Verification & Acceptance Criteria
- Executing internal stock transfer updates source warehouse stock (-qty) and destination warehouse stock (+qty) atomically.
- Spoilage adjustment posts COGS waste expense entry to HCB Core Subledger.
- Goods receiving updates SKU stock levels and batch expiry records cleanly.
