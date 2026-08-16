---
okf_version: "0.2"
type: Development Plan Level 2
title: UX Repair & Hfe Real-Time Operational Insights Engine (L2-POS-27)
description: Development plan executing all UX repairs, Hfe Real-Time Operational & Financial Insights on Manager Dashboard (Theft/Shrinkage Alert, Cash Shortage GL), Hybrid POS Barcode Overlay, Sub-Folio Credit Line Accounting, and Partial Seat Early Checkout.
tags: [development-plan, level-2, hfe-insights, ux-repair, pos-analytics, sub-folio, hfe-pos]
parent_level_1: l1-22-hfe-pos-insights-and-ux-purification-suite
github_issue: 27
status: Approved
---

# Level 2 Implementation Plan: UX Repair & Hfe Real-Time Operational Insights Engine

## 1. Outcome
Delivers the complete UX repair (resolving all review points, screenshot visual bugs, & loop test findings) and embeds the **Hfe Real-Time Operational & Financial Insights Engine** (`src/components/insights/HfeInsightWidget.tsx`, `src/hooks/useHfeInsights.ts`) on the Manager Dashboard per [`POS-ENG-STD-001.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-ENG-STD-001.md).

---

## 2. Scope

### 📊 Module A: Hfe Real-Time Operational Insights Engine (Manager Dashboard)
- Implement `useHfeInsights.ts` and `HfeInsightWidget.tsx`:
  - 📈 **Demand & Rush Hour Forecast Insight**: Predicts upcoming peak hour order volume and suggests ingredient prep.
  - 📦 **Low-Stock & Auto-PO Supplier Alert**: Detects SKUs near reorder point and suggests 1-tap PO creation.
  - 💰 **Profit Margin Leaders Insight**: Identifies highest gross-margin SKUs for Pinned Favorites placement.
  - 👤 **VIP Customer Personalization Insight**: Detects returning VIP guests at tables with order history & allergen warnings.
  - 💵 **Shift Cash Shortage GL Alert**: Flags cash drawer variance > Rp 50k and posts to `6-5300-CASH-SHORTAGE`.
  - 🔍 **Inventory Shrinkage & Theft Alert**: Calculates actual vs BOM recipe bean usage and alerts on >20% shrinkage.

### ⌨️ Module B: Hybrid POS Barcode Sensor Overlay & Pinned Favorites
- Implement `useWorkstationMemory.ts` & `src/views/PosView.tsx`:
  - Barcode Quick-Add Overlay auto-opens when hardware USB barcode scanner fires while on Table Floor Plan view.
  - 8 Locked Manager Presets + 4 Cashier Personal Slots for Pinned Favorites bar.
  - `✏️ Edit Pinned Menu` toggle button directly on cashier favorites bar.

### 🔀 Module C: Table Detail Drawer & Sub-Folio Credit Line Accounting
- Implement `TableDetailDrawer.tsx`:
  - Renders occupied table status, joined tables (Table 04 + Table 05), and seat breakdowns.
  - Sub-Folio Credit Line Accounting: Tracks pre-paid QRIS credits and tax integrity when joining/un-joining tables.
  - **Partial Seat Un-Join & Early Checkout**: Allows extracting Seat 2 (Budi) for early departure checkout while leaving Seats 1, 3, 4 active on the table.

### 🎨 Module D: Customer Mobile & Staff Surface Purification
1. **Catalog Image CSS Repair**: Render proper `<img src="..." className="w-full h-32 object-cover rounded-t-xl" />` tags.
2. **Hero Bar & Header Consolidation**: Consolidate double top header bars into **ONE sleek top floating bar** with 1-tap `"🌐 Lihat Landing Page"` button.
3. **Customer Mobile View Repairs**:
   - Replace `< Kembali Tambah Menu` with `+ Tambah Menu`.
   - Create `VoucherSelectionDrawer.tsx` for active voucher list selection + manual promo codes (multi-voucher stacking: 1 Primary Discount + 1 Perk Voucher).
   - Add payment method selector, per-item notes editor ("Less ice"), and hide Reorder section when `previousOrders.length === 0`.
4. **Staff Surfaces & Back-Office**:
   - Combine KDS Kanban and Work Order List into `UnifiedKdsView.tsx`.
   - Consolidate duplicate Barista/Checker/Server into `StaffWorkstationView.tsx`.
   - Clean up double outer cards in `CafeSettingsView.tsx` and embed Purchase Orders (PO) & Expense Claims into `[ 🛒 PO & Expense ]` tab.
   - Align Getting Started checklist with HCB system-verified setup steps.

### 🧪 Module E: Vitest Test Suite (`src/tests/userJourneyLoop.test.ts`)
- Run unit & loop integration tests covering all 5 loop topics (`12 test files, 96/96 tests passing clean`).

---

## 3. Verification Plan
- `python3 scripts/check-modularity.py` confirms all 124+ files remain under 500 lines.
- `npx tsc --noEmit` compiles clean with 0 TypeScript errors.
- `npm run test` passes all 12 Vitest test files (96 unit tests) cleanly.
- `vite build` builds clean for production.
