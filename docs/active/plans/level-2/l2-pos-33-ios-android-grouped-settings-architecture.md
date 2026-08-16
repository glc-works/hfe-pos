---
okf_version: "0.2"
type: Development Plan Level 2
title: Native iOS/Android Inset Grouped Settings Architecture & Drill-Down Navigation
description: Redesign CafeSettingsView into a native iOS/Android Settings app paradigm with Profile Banner, search bar, Inset Grouped list rows with status values and chevrons, and smooth drill-down sub-pages with "< Back" header navigation.
tags: [development-plan, level-2, settings, ios-design, android-settings, inset-grouped, drill-down-navigation]
parent_level_1: l1-pos-suite-modernization
github_issue: 33
status: Proposed
---

# Native iOS/Android Inset Grouped Settings Architecture & Drill-Down Navigation

## Outcome

Delivers an authentic, high-ergonomics iOS/Android Settings app experience for `CafeSettingsView`:
1. **Apple ID-Style Profile Banner Header:** Top card displaying merchant logo, brand name, PT legal entity, and HFE cloud synchronization badge.
2. **Settings Search Bar:** Instant interactive filter for searching settings rows.
3. **Inset Grouped Settings List (Master View):**
   - **🎨 Tampilan & Bahasa (Appearance & Language):** Themes (`activeTheme.themeName`), Language (`Bahasa Indonesia / English`).
   - **💰 Keuangan & Pembukuan (Finance & Accounting):** PB1 Tax Mode, Cash Float, PO Supplier & Kas Kecil Expense.
   - **🏢 Operasional Resto (Store Operations):** Profil PT & NPWP, Tim Staf & Roster, Kebijakan Reservasi Meja, Database CRM.
   - **📊 Diagnostik & Sistem (System Diagnostics):** HFE Operational Insights, Getting Started Checklist.
4. **Smooth Drill-Down Sub-Page Navigation:**
   - Tapping any row opens the dedicated sub-page with a top bar: `[ < Pengaturan ]` `[ Sub-Page Title ]` `[ Simpan ]`.
   - Desktop and Mobile both support clean back navigation.

## Scope

- `src/views/CafeSettingsView.tsx` (Refactor to Master Inset Grouped List + Drill-Down Detail Sub-Views)
- `src/tests/iosSettingsView.test.ts` (Vitest test suite verifying navigation, search filter, and sub-page rendering)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 130+ Vitest unit tests, and production build).
2. Visiting `http://localhost:5173/?app=cafe` -> Settings displays the iOS Inset Grouped list.
3. Clicking a row (e.g. `🎨 Tema & Tampilan`) opens the sub-page, and clicking `< Pengaturan` returns to the main list.
