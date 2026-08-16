---
okf_version: "0.2"
type: Development Plan Level 2
title: Comprehensive 17-Point UX & Catalog Repair Plan (Design, Layout & Feature Alignment)
description: Implementation plan resolving all 17 review points and fixing screenshot visual bugs, including catalog image CSS fixes, header consolidation, + Tambah Menu button, voucher selection drawer, table order status drawer, general Kasir POS workstation, persistent pinned favorites, quick cash amounts, unified staff surfaces, background HCB connection, HCB-aligned getting started, and direct purchase/expense back-office integration.
tags: [development-plan, level-2, ux-repair, catalog-fix, layout-repair, hfe-pos]
parent_level_1: hfe-pos-suite-master-plan
github_issue: 26
status: Proposed
---

# Level 2 Implementation Plan: Comprehensive 17-Point UX & Catalog Repair Plan

## 1. Outcome
Delivers a complete design, layout, and functional repair for `hfe-pos` (`glc-works/hfe-pos`), fixing all catalog image rendering bugs, double headers, duplicate menus, and aligning 17 operational review points per [`POS-ENG-STD-001.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-ENG-STD-001.md).

---

## 2. Detailed 17-Point Resolution Plan

### 🎨 Visual & Layout Fixes (Screenshot Audits)
1. **Catalog Image & Layout Fix (Poin 9 - Screenshot 3)**:
   - Fix broken CSS rendering in catalog product cards. Render proper `<img src="..." className="w-full h-36 object-cover rounded-t-xl" />` tags instead of raw URL text overlays.
2. **Hero Bar & Header Consolidation (Poin 1 - Screenshot 1 & Poin 17)**:
   - Consolidate double top header bars into **ONE sleek top navigation bar** in `App.tsx`.
   - Add a 1-tap "🌐 Lihat Landing Page Merchant" button.
3. **Clean Up Settings & Capability Cards (Poin 16 - Screenshot 4 & Poin 17)**:
   - Remove redundant outer wrapper cards in `CafeSettingsView.tsx`.
   - Embed **Purchase Orders (PO Supplier)** and **Expense Claims (Kas Kecil)** directly into the Merchant Management tabs (`[ 🏪 Profil ]` | `[ 💰 Pajak & Kas ]` | `[ 👥 Tim Staf ]` | `[ 🛒 PO & Expense ]`).

### 📱 Customer Mobile & Checkout Enhancements (Poin 2, 3, 4, 5)
4. **Button Wording (Poin 2)**: Replace `< Kembali Tambah Menu` with `+ Tambah Menu` (Add More Items).
5. **Voucher Selection Drawer (Poin 3)**:
   - Replace raw text input with a clickable **"🎟️ Pilih / Lihat Voucher Available"** drawer allowing users to select active vouchers OR type manual promo codes, supporting multi-voucher stacking.
6. **Checkout Page Features (Poin 4)**:
   - Add payment method selector (QRIS, Cash, Card, Open Tab) directly on customer checkout drawer.
   - Add per-item notes editor modal/input ("Less ice", "Extra hot").
   - Remove leftover category pills from checkout drawer.
7. **Reorder Section Visibility (Poin 5)**: Render Reorder section ONLY if `previousOrders.length > 0`.

### 💵 Kasir POS Workstation & Table Management (Poin 6, 7, 8, 10, 11)
8. **General Kasir POS Naming & Table Guest Binding (Poin 7)**:
   - Rename "Barista Touch POS" to **"Kasir POS Workstation"** (General Touch POS).
   - Clicking a table tile opens **Table Guest Binding Drawer** allowing cashier to bind an existing Customer Contact, assign a New Walk-in Guest, or process a Manual Reservation.
9. **Table Live Status Drawer (Poin 6)**:
   - Clicking an occupied table tile opens **Table Live Status Drawer** displaying: Active Guest Name & Contact (`Aldi Pratama`), Ordered Items list, Item preparation status (`Brewing`, `Cooking`, `Served`), and waiting timer.
10. **Persistent Pinned Favorites Bar (Poin 8)**:
    - Pinned Favorites bar remains persistently visible even when Peta Meja tab is active.
11. **Easy Item Removal (Poin 10)**: Add a 1-tap **`🗑️` Delete Trash Button** on every cart line item.
12. **Quick Cash Amounts & Split Payment on Cashier (Poin 11)**:
    - Add **Quick Cash Buttons** (`Rp 20.000`, `Rp 50.000`, `Rp 100.000`, `Uang Pas`) and Split Payment trigger directly on the Cashier Checkout Panel.

### 🍳 Staff Surfaces, KDS & System Integration (Poin 12, 13, 14, 15)
13. **Unified KDS Work Order & Kanban (Poin 12)**:
    - Combine Kanban columns and Work Order ticket view into `UnifiedKdsView.tsx` with seamless tab toggles (`[ 📋 Kanban ] [ 📄 Work Order List ]`).
14. **Consolidate Redundant Staff Surfaces (Poin 13 & 17)**:
    - Consolidate duplicate Barista, Checker, and Server views into **ONE Staff Workstation View (`StaffWorkstationView.tsx`)**.
15. **Background HCB Connection (Poin 14)**:
    - HCB REST API endpoint is automatically bound and connected in the background. Remove manual HCB URL inputs from user-facing screens.
16. **HCB-Aligned Getting Started (Poin 15)**:
    - Align Getting Started checklist with HCB Core concept: items are **system-verified setup steps** (e.g. `1. Atur Profil PT`, `2. Tambah Minimum 1 Staf Kasir`, `3. Buka Shift Floating Awal`) that auto-complete based on actual system state.

---

## 3. Explicit Exclusions
- Does not modify HCB Core server schemas; operates strictly within `hfe-pos` UI views, components, and hooks.

## 4. Verification Plan
- `python3 scripts/check-modularity.py` confirms all files remain under 500 lines.
- `npx tsc --noEmit` compiles clean with 0 TypeScript errors.
- `npm run test` passes all Vitest unit tests cleanly.
- `vite build` builds clean for production.
