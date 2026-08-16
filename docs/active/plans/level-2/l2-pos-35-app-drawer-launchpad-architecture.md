---
okf_version: "0.2"
type: Development Plan Level 2
title: Native App Drawer & Launchpad Grid Architecture for Merchant Apps
description: Replace the cluttered 11-button horizontal staff sub-navigator with a sleek iOS/Android App Drawer & Launchpad Grid launcher (9-dot App Switcher).
tags: [development-plan, level-2, app-drawer, launchpad, navigation-redesign, pos-hub]
parent_level_1: l1-pos-suite-modernization
github_issue: 35
status: Proposed
---

# Native App Drawer & Launchpad Grid Architecture for Merchant Apps

## Outcome

1. **Elimination of Horizontal Button Clutter:**
   - Replace the cramped 11-button horizontal scrolling strip with a clean, high-ergonomics top bar.
2. **Top Navigation Header:**
   - Displays the current active app with an interactive switcher: `[ 🎛️ Aplikasi: ☕ Barista Touch POS ▾ ]` or `[ 🎛️ Buka App Drawer ]`.
   - Quick status indicator (e.g. `Cabang: Senopati HQ 🟢`).
3. **Native iOS/Android App Drawer Modal (Launchpad Grid):**
   - Tapping the switcher opens a categorized App Launcher Grid with rich icons, subtitles, and badges:
     - **Kasir & Point of Sale:** `Barista Touch POS`, `Retail Barcode POS`, `Scan & Go Mobile`.
     - **Dapur & Produksi (KDS):** `Kitchen KDS`, `Chef Course KDS`, `Checker QC`, `Server / Waiter`.
     - **Spesialisasi Hospitality:** `Sommelier Wine`, `Maître d' VIP Table`.
     - **Manajemen & Back-Office:** `📈 HFE Insights Engine`, `Gudang & Inventori`, `Multi-Cabang`, `Owner Settings`.
   - Instant search bar inside App Drawer for filtering apps.
   - 1-tap fast switching that smoothly closes the drawer and transitions the workstation.

## Scope

- `src/components/common/StaffAppDrawerModal.tsx` (New: Categorized Launchpad Modal Grid with Search)
- `src/components/common/StaffSubNavigator.tsx` (Redesign: Clean top bar with Active App Pill + App Drawer Trigger)
- `src/tests/appDrawerNavigation.test.ts` (Vitest test suite verifying launchpad categories, search filtering, and app switching)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 134+ Vitest unit tests, and production build).
2. Visiting `http://localhost:5173/?app=cafe` shows a clean single-line bar with `[ 🎛️ Apps: Barista Touch POS ▾ ]`.
3. Clicking the button opens the App Drawer Launchpad with 4 categories, search filter, and instant switching.
