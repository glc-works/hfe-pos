---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Hfe POS Real-Time Insights & Comprehensive UX Purification Suite (L1-22)
description: Strategic plan for embedding Hfe Real-Time Operational & Financial Insights engine into POS, purifying mobile customer checkout UX, consolidating double headers, unifying KDS work orders, integrating back-office purchase/expense capabilities, hybrid barcode overlays, sub-folio credit line accounting, and partial seat early checkout.
tags: [plan, level-1, pos, hfe-insights, ux-purification, multi-tender, hfe-pos]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Hfe POS Real-Time Insights & Comprehensive UX Purification Suite

## 1. Domain Outcome
Delivers the **Hfe POS Real-Time Insights & Comprehensive UX Purification Suite** for `hfe-pos` (`glc-works/hfe-pos`).

Empowers merchants with:
- 📊 **Hfe Real-Time Operational & Financial Insights (Manager Dashboard)**: Demand rush hour forecasting, low-stock auto-PO alerts, gross profit margin leaders, VIP guest personalization, HCB cash shortage GL alerts (`6-5300-CASH-SHORTAGE`), and recipe BOM inventory shrinkage/theft alerts.
- ⌨️ **Hybrid POS Sensor & Contextual Memory**: Contextual barcode quick-add overlay allowing hardware USB barcode scanning directly on Table Floor Plan views without manual tab switching.
- 📱 **Purified Customer Mobile UX**: Consolidated single floating top header, `+ Tambah Menu` checkout wording, interactive active voucher selection drawer (with multi-voucher stacking), per-item custom notes, payment method selection, and history-based reorder visibility.
- 💵 **Kasir POS & Table Management Workstation**: Unified POS naming, manager-locked Pinned Favorites (8 items) with cashier personal slots (4 items), direct numeric quantity keypad editing, 1-tap item deletion, quick cash buttons (`Rp 20k`, `Rp 50k`, `Rp 100k`, `Uang Pas`), multi-tender split payments, `TableGuestBindingDrawer` (empty table), and `TableDetailDrawer` (occupied table with sub-folio credit lines & partial seat early checkout).
- 🍳 **Unified Staff Surfaces & Back-Office**: Unified KDS with Kanban vs Work Order List toggles, consolidated staff workstation view, mobile-first settings tabs, direct PO/Expense back-office integration, and system-verified Getting Started checklist aligned with HCB Core.

---

## 2. Capability Scope

```
 📊 HFE POS INSIGHTS & PURIFIED UX LIFECYCLE
 ├─ 📊 1. Hfe Real-Time Operational Insights (Manager Dashboard: Theft/Shrinkage Alert, Cash Shortage GL)
 ├─ ⌨️ 2. Hybrid POS Sensor & Contextual Memory (Barcode Quick-Add Overlay on Table View)
 ├─ 📱 3. Purified Customer Mobile View (Single Header, + Tambah Menu, Active Voucher Drawer)
 ├─ 💵 4. Kasir POS Workstation (Quick Cash, Direct Qty Keypad, Sub-Folio Credit Line, Partial Seat Un-Join)
 ├─ 🍳 5. Unified Staff Surfaces & KDS (Kanban vs Work Order List toggle, Staff Workstation View)
 └─ 👔 6. Mobile Settings & Back-Office (Tabs, PO Supplier & Expense Claims, System Verified Setup)
```

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-27-ux-repair-and-hfe-insights-engine.md`

---

## 4. Verification & Acceptance Criteria
- Hfe Insights Engine computes demand forecasts, cash shortage GL alerts, and inventory shrinkage alerts cleanly.
- Hybrid POS Sensor overlay auto-opens when hardware barcode scanner fires during Table Floor Plan view.
- TableDetailDrawer supports partial seat un-join for early departures without breaking table balances.
- Voucher selection drawer allows selecting active vouchers and manual codes with multi-voucher stacking.
- Automated Vitest test suites (`userJourneys.test.ts`, `userJourneyLoop.test.ts`) pass 100% clean.
