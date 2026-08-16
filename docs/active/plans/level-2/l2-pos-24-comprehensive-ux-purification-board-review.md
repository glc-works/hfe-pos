---
okf_version: "0.2"
type: Development Plan Level 2
title: Comprehensive UX Purification & Unified Architecture Refinement (15 Board Review Improvements)
description: Comprehensive implementation plan addressing all 15 Board Review points, delivering unified POS cashier workstation, customer facing display (CFD), multi-table join/split, multi-tender split payment, onboarding wizard state persistence, mobile settings tabs, unified KDS course sequence, and purchase/expense capability modes.
tags: [development-plan, level-2, board-review, unified-pos, cfd, split-payment, multi-table, esg, rbac]
parent_level_1: hfe-pos-suite-master-plan
github_issue: 24
status: Proposed
---

# Level 2 Implementation Plan: Comprehensive UX Purification & Unified Architecture Refinement

## 1. Outcome
Delivers a complete, unified frontend architecture for `hfe-pos` (`glc-works/hfe-pos`) addressing all 15 Board Review items. Unifies POS Cashier Views, KDS Kanban Screens, Table Floor Plans, Customer Facing Display (CFD), Multi-Tender Split Payments, Direct Numeric Quantity Inputs, Carried-Over Shift Floats, and Mobile Tabbed Settings per [`POS-ENG-STD-001.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-ENG-STD-001.md).

---

## 2. Detailed 15-Point Implementation Matrix

### 🗺️ Module A: Unified Workstation & Floor Plan Architecture (Poin 1, 3, 12, 14, 15)
1. **Multi-Table Join & Multi-Split (Poin 1)**:
   - `TableOperationsModal.tsx`: Select multiple tables (e.g. Table 4 + 5 + 6) for N-way table merge. Split bill into custom N-sub-tabs (Seat 1..N).
2. **Unified Touch POS Workstation (`UnifiedPosView.tsx`) (Poin 3, 12)**:
   - Replaces duplicate POS views with **ONE Unified POS View**.
   - Mode Switcher Bar: `[ 🗺️ Peta Meja ]` vs `[ 📚 Katalog Full / Favorites Pin ]`.
   - Main POS Grid displays Pinned / Frequently Ordered Favorites (Quick Pin). Full catalog available via search modal.
   - If `enableTableFloorPlan === false` (Retail Mode), hides table tab automatically.
   - **Direct Numeric Quantity Edit (Poin 12)**: Quantity badge opens a numeric keypad modal or direct text input (typing `1000` directly).
3. **Unified KDS Kanban with Course Sequence (`UnifiedKdsView.tsx`) (Poin 14)**:
   - Unifies F&B KDS and Fine Dining KDS into **ONE KDS View**.
   - Course Sequence Badge & `Fire Course` control button rendered dynamically when Fine Dining mode is active.
4. **Unified Floor Plan & VIP Profiling (`TableFloorPlanGrid.tsx`) (Poin 15)**:
   - Shared table tile rendering for all business types.
   - Displays guest avatar, VIP badge, anniversary notes, and allergen alerts directly on table tile when guest profile is bound.

### 💻 Module B: Customer Facing Display & Camera Scanner (Poin 4, 13)
1. **Customer Facing Display View (`CustomerFacingDisplayView.tsx`) (Poin 4)**:
   - Secondary screen view (`/cfd` route) synced via `BroadcastChannel` API.
   - Facing Customer: Displays real-time cart items, subtotal, PB1 tax, discount, QRIS payment QR, and thank-you animation.
2. **Cashier Camera Barcode Scanner Modal (`CashierCameraScannerModal.tsx`) (Poin 13)**:
   - Camera scan button on cashier screen opening WebRTC camera scanner modal for tablets without hardware scanners.

### 💰 Module C: Payment, Points & Cash Reconciliation (Poin 5, 6, 7)
1. **Multi-Tender Split Payment Modal (`MultiTenderPaymentModal.tsx`) (Poin 5)**:
   - Supports splitting 1 bill into multiple payment tenders (e.g. Rp 500.000 Cash + Rp 1.000.000 QRIS/Card).
2. **Loyalty Points Payment Redemption (Poin 6)**:
   - Customer loyalty points redemption toggle at checkout (e.g. Redeem 500 points = Rp 50.000 discount).
3. **Carried-Over Opening Shift Float (Poin 7)**:
   - `ShiftDrawerModal.tsx`: Opening shift float auto-suggests previous shift's closing cash balance.

### ⚙️ Module D: Onboarding, Mobile Settings & Branch Selection (Poin 8, 9, 11)
1. **Onboarding State Persistence & Auto-Hide (Poin 8)**:
   - `useOnboarding.ts`: Onboarding wizard runs ONLY ONCE. Once completed (`isOnboardingCompleted = true`), modal hides permanently.
2. **Mobile Tabbed Settings Navigation (Poin 9)**:
   - `CafeSettingsView.tsx`: Converted from 1 long page into Mobile-First Tabs:
     - `[ 🏪 Profil Toko ]` | `[ 💰 Pajak & Kas ]` | `[ 👥 Tim Staf ]` | `[ 📦 Capability Modes ]`
3. **Branch Selection at Login (`PosAuthLoginView.tsx`) (Poin 11)**:
   - Branch outlet dropdown selector integrated directly into Login Screen.

### 📦 Module E: Back-Office Capability Modes (Poin 10)
1. **Purchase, Expense & Product Inventory Management (`BackOfficeCapabilitiesModal.tsx`) (Poin 10)**:
   - Adds Purchase Order (PO) entry, Expense Claim recording, and Product Master CRUD interfaces connected to HCB Core APIs (`/v1/purchases`, `/v1/expenses`).

---

## 3. Explicit Exclusions
- Does not alter HCB server-side double-entry subledgers; operates strictly within the `hfe-pos` Experience Layer.

## 4. Verification Plan
- `python3 scripts/check-modularity.py` confirms all 65+ files remain under 500 lines.
- `npx tsc --noEmit` compiles clean with 0 TypeScript errors.
- `npm run test` passes all Vitest unit tests cleanly.
