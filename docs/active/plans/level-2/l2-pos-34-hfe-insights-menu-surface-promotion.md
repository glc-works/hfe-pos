---
okf_version: "0.2"
type: Development Plan Level 2
title: Promote HFE Operational & Financial Insights to Top-Level Menu Navigation
description: Promote the HFE Real-Time Operational & Financial Insights engine from inside Settings into a dedicated top-level staff workstation menu tab [ 📈 HFE Insights ].
tags: [development-plan, level-2, navigation, insights, operational-analytics, menu-hierarchy]
parent_level_1: l1-pos-suite-modernization
github_issue: 34
status: Proposed
---

# Promote HFE Operational & Financial Insights to Top-Level Menu Navigation

## Outcome

1. **Top-Level Navigation Promotion:**
   - Move the HFE Operational & Financial Insights Engine out of the Settings sub-page into a **dedicated, first-class top navigation tab: `[ 📈 HFE Insights ]`** in `StaffSubNavigator.tsx`.
2. **Dedicated Insights Workstation View (`src/views/HfeInsightsView.tsx`):**
   - Clean, full-width management & operational dashboard with:
     - 📈 **Demand Rush Hour Forecast** (Predicted peak orders & kitchen prep recommendations)
     - 📦 **Low-Stock Auto-PO Supplier Alert** (1-tap PO creation)
     - 💰 **Profit Margin Leaders** (Top gross margin SKU ranking)
     - 👤 **VIP Guest Personalization** (Seated VIP alerts with order history & allergens)
     - 💵 **Shift Cash Integrity Gauge** (100% real-time float audit score)
3. **Clean Settings Scope:**
   - Remove the insights card from the settings sub-list to eliminate duplicate nesting and maintain clear information hierarchy.

## Scope

- `src/types/pos.ts` (Add `'hfe-insights'` to `StaffSurfaceMode`)
- `src/components/common/StaffSubNavigator.tsx` (Add `[ 📈 HFE Insights ]` tab button)
- `src/views/HfeInsightsView.tsx` (Dedicated full-screen Insights Workstation)
- `src/App.tsx` (Route `activeStaffSurface === 'hfe-insights'`)
- `src/components/settings/IosSettingsMasterList.tsx` (Remove insights from Settings list)
- `src/views/CafeSettingsView.tsx` (Update settings routes)
- `src/tests/hfeInsightsNavigation.test.ts` (Vitest test suite verifying top-level menu routing and component rendering)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 130+ Vitest unit tests, and production build).
2. Clicking **`[ 📈 HFE Insights ]`** on the top staff navigation bar immediately opens the full-screen Real-Time Insights workstation.
3. Settings page is clean without duplicate insights sub-page.
