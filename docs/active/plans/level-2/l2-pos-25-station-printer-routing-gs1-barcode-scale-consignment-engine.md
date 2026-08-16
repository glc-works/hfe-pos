---
okf_version: "0.2"
type: Development Plan Level 2
title: Station Printer Routing, GS1 Barcode Scale Parser, Equal N-Way Split & Consignment Inventory Engine
description: Implements multi-station thermal printer router, GS1 EAN-13 price-embedded barcode scale parser, equal N-way bill split modal, complimentary item logging with subledger expense, retail return/exchange workflow, and consignment inventory tracking integrated with HCB REST APIs.
tags: [development-plan, level-2, rl-ops, printer-routing, gs1-barcode, equal-split, complimentary, consignment]
parent_level_1: l1-21-real-world-rl-operations-suite
github_issue: 25
status: Proposed
---

# Level 2 Implementation Plan: Station Printer Routing, GS1 Barcode Scale Parser, Equal N-Way Split & Consignment Inventory Engine

## 1. Outcome
Delivers the Real-World RL Operations module (`src/services/printerRouter.ts`, `src/utils/gs1BarcodeParser.ts`, `src/components/rlops/`, `src/views/PriceCheckerView.tsx`) supporting multi-station thermal printer routing, GS1 EAN-13 price-embedded barcode scale parsing, equal N-way bill splitting, complimentary item logging, retail returns/exchanges, and consignment inventory tracking integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Station Thermal Printer Router (`src/services/printerRouter.ts`)
- Implement `printerRouter.ts`:
  - Category to Printer Target Mapping:
    - Beverages ➔ `Bar Printer (58mm/80mm)`
    - Main Dishes & Hot Food ➔ `Kitchen Impact Printer (80mm)`
    - Bakery & Pastry ➔ `Pastry Printer`
  - Formats itemized station chits and dispatches print jobs to respective thermal/impact printer endpoints.

### Phase B: GS1 Barcode Scale Parser (`src/utils/gs1BarcodeParser.ts`)
- Implement `gs1BarcodeParser.ts`:
  - Parses EAN-13 price-embedded barcodes starting with prefix `20` (e.g. `2000123012504`).
  - Extracts SKU ID (`00123`), Weight in KG (`1.250 kg`), and Item Total Price (`Rp 12.500`).
  - Binds item seamlessly into active cart with exact parsed weight.

### Phase C: Equal N-Way Split & Complimentary Item Modals (`src/components/rlops/`)
- `EqualSplitModal.tsx` — Divides total bill equally by N guests (e.g. Rp 400.000 / 4 = Rp 100.000 per guest) with rounding remainder handling.
- `ComplimentaryItemModal.tsx` — Allows cashier/manager to mark item as "Complimentary / House Treat" with reason selection (*VIP Comp*, *Service Recovery*, *Owner Family*) and subledger expense GL posting (`6-5200-COMPLIMENTARY-EXPENSE`).

### Phase D: Retail Returns, Consignment & Price Check (`src/views/PriceCheckerView.tsx` & `src/components/rlops/`)
- `RetailReturnModal.tsx` — Handles item returns & exchanges with receipt lookup, issuing store credit or cash refund.
- `ConsignmentTaggingModal.tsx` — Tags items as supplier consignment stock with payout tracking on sale.
- `PriceCheckerView.tsx` — Full-screen customer price checking terminal mode (`/price-check` route).

### Phase E: Vitest Unit Testing (`src/tests/rlOps.test.ts`)
- Unit test coverage:
  - Verifies GS1 barcode scale parsing math.
  - Verifies printer station routing logic.
  - Verifies equal N-way bill split rounding math.

## 3. Explicit Exclusions
- Does not modify third-party hardware USB drivers; operates strictly through standard WebBluetooth, WebUSB, and HTTP ESC/POS network print queues.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
