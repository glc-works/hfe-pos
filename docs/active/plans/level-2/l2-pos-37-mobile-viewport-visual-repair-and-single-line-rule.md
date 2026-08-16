---
okf_version: "0.2"
type: Development Plan Level 2
title: Mobile Viewport Visual Polish, Zero-Overlap Top Bar & Strict Single-Line Badge Rule
description: Repair mobile visual bugs including StaffSubNavigator overlap, multi-line badge bleed in table cards (MEJA-04), truncated floor plan headers, and filter horizontal scroll padding.
tags: [development-plan, level-2, mobile-ux, visual-repair, single-line-badge, no-overlap]
parent_level_1: l1-pos-suite-modernization
github_issue: 37
status: In-Progress
---

# Mobile Viewport Visual Polish, Zero-Overlap Top Bar & Strict Single-Line Badge Rule

## Outcome

1. **Clean Responsive Top Sub-Navigator (`StaffSubNavigator.tsx`):**
   - On mobile viewports (< 640px): Render a single, non-clashing interactive app pill `[ 🎛️ Barista Touch POS ▾ ]` that triggers the 5 Core App Drawer.
   - Prevent any double-button crowding or background text poking through.
2. **Strict Single-Line No-Bleed Badges on Table Cards:**
   - Enforce single-line concise wording: `[ 🟢 Kosong ]`, `[ ⏳ Tagihan ]`, `[ ✅ Lunas ]` with `whitespace-nowrap shrink-0 text-[10px]`.
   - Use `flex justify-between items-center gap-2` on card headers so table titles (`MEJA-04`) and status badges never overlap.
3. **Streamlined Section Headers & Filter Tabs:**
   - Shorten `"Status Floor Plan Meja"` to punchy `"Peta Meja"` to prevent truncation.
   - Add generous horizontal scroll padding (`px-4 pr-6`) to status filter pills.

## Scope

- `src/components/common/StaffSubNavigator.tsx`
- `src/views/UnifiedPosView.tsx`
- `src/views/BaristaPosView.tsx` (if applicable)
- `src/tests/mobileVisualRepair.test.ts` (Vitest test suite verifying mobile responsive rendering and single-line badge compliance)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 140+ Vitest unit tests, and production build).
2. Mobile simulator (375px width) renders cleanly without top bar overlap, zero badge text wrapping, and zero truncated headers.
