---
okf_version: "0.2"
type: Development Plan Level 2
title: Barista Touch POS Station & Table Floor Plan Grid
description: Touchscreen Barista POS station interface managing visual table floor plans, active open tabs, walk-in manual orders, and cash float shift drawer count reconciliations.
tags: [development-plan, level-2, barista-pos, table-floor-plan, cash-drawer]
parent_level_1: l1-02-barista-touch-pos-table-engine
github_issue: 2
status: Proposed
---

# Level 2 Implementation Plan: Barista Touch POS Station & Table Floor Plan Grid

## 1. Outcome
## 1. Outcome
Delivers a Barista Touch POS station view (`src/views/BaristaPosView.tsx`) for cashiers and baristas to view active table occupancy, open/close billing tabs, enter manual walk-in orders, and perform cash drawer float reconciliations.

## 2. Scope
- Deliver `src/views/BaristaPosView.tsx` and associated sub-components:
  - Visual Table Floor Plan Grid (`src/components/pos/TableFloorPlanGrid.tsx` for Table 1-20 status: Free, Occupied, Open Tab).
  - Touch-Optimized Walk-In Quick Catalog Grid (`src/components/pos/TouchQuickCatalog.tsx`).
  - Table Operations Modal (`src/components/modals/TableOperationsModal.tsx` for table transfer, merge, and tab closing).
  - Cashier Shift Drawer Modal (`src/components/modals/ShiftDrawerModal.tsx` for float opening/closing count input).

## 3. Explicit Exclusions
- Financial subledgers are delegated to `Hfe` REST endpoints.

## 4. Verification Plan
- Touch interaction response < 30ms.
- Table status toggle & shift float input test.

