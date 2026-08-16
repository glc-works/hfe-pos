---
okf_version: "0.2"
type: Development Plan Level 2
title: Consolidate 13 Dispersed Workstations into 5 Cohesive Core Merchant Apps with Modular Features
description: Streamline the merchant app suite from 13 fragmented tiles into 5 cohesive, high-powered Core Apps while integrating specific capabilities (Course Firing, Checker QC, Server Runner, Retail Barcode, Wine/VIP, and Multi-Branch) as seamless sub-features and configurable modes.
tags: [development-plan, level-2, app-consolidation, 5-core-apps, modular-features, pos-architecture]
parent_level_1: l1-pos-suite-modernization
github_issue: 36
status: Proposed
---

# Consolidate 13 Dispersed Workstations into 5 Cohesive Core Merchant Apps with Modular Features

## Outcome

1. **5 Cohesive Core Merchant Apps (App Drawer & Top Nav):**
   - **`☕ Kasir POS (Commerce Hub)`** (`barista-pos`): Table Map POS, Retail Quick Barcode, & Scan-and-Go.
   - **`🍳 Dapur & Expediter (KDS Workstation)`** (`kds-screen`): Standard KDS, Fine-Dining Course Firing, Checker QC Expediter, & Server Runner.
   - **`📈 HFE Insights & Analitik`** (`hfe-insights`): Demand Rush Hour, Auto-PO Supplier, Profit Margin Leaders, & Float Integrity.
   - **`📦 Gudang, Inventori & Cabang`** (`warehouse-mgmt`): BOM Ingredient Stocks, PO Supplier, Wine Cellar Inventory, & Dimensional Multi-Branch.
   - **`🏪 Pengaturan Toko & Tim`** (`cafe-config`): PT Legal Profile, PB1 Tax (10%), Light/Dark Themes, Staff Roster, Table Policy, & CRM.
2. **Modular Features Embedded Inside Core Apps:**
   - In KDS: Direct switcher between `[ 📋 Kanban Dapur ]`, `[ 🍽️ Course Firing ]`, `[ 🔍 Checker QC ]`, `[ 🏃 Server Runner ]`.
   - In Gudang: Direct tabs for `[ 📦 Stok Bahan BOM ]`, `[ 🛒 PO Supplier ]`, `[ 🏢 Multi-Cabang ]`.
3. **Ergonomic Top Navigation & App Launcher:**
   - Top Bar displays active Core App + quick 5-app switcher pills.
   - App Drawer displays the 5 clean, distinct, richly categorized Core Apps.

## Scope

- `src/components/common/StaffAppDrawerModal.tsx` (Consolidate tiles into 5 Core Suites)
- `src/components/common/StaffSubNavigator.tsx` (Streamline top bar to 5 Core Apps)
- `src/views/UnifiedKdsView.tsx` (Integrate Course Firing, Checker QC, and Server Runner toggles seamlessly)
- `src/views/WarehouseManagementView.tsx` (Ensure Warehouse, PO, and Branch sub-tabs are unified)
- `src/tests/fiveCoreAppsSuite.test.ts` (Vitest test suite verifying 5 core apps, modular feature sub-modes, and navigation)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 136+ Vitest unit tests, and production build).
2. App Drawer opens with 5 distinct, high-impact Core App cards.
3. KDS switching between Kanban, Course Firing, Checker QC, and Server Runner operates within 1 tap.
