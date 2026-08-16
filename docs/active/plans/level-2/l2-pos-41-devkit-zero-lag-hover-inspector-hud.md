---
okf_version: "0.2"
type: Development Plan Level 2
title: DevKit Zero-Lag Live Hover Inspector HUD (External Device Canvas Sidebar)
description: Implement high-performance, 60/120 FPS Hover Inspector HUD for DevKit mounted on the right flank outside the device frame. Uses event delegation and requestAnimationFrame batching to display active component tag, text, dimensions, and styling tokens in real-time with zero POS re-render overhead.
tags: [development-plan, level-2, devkit-inspector, hover-hud, performance, zero-lag, fnb-qa]
parent_level_1: l1-pos-suite-modernization
github_issue: 41
status: Proposed
---

# DevKit Zero-Lag Live Hover Inspector HUD (External Device Canvas Sidebar)

## Outcome

1. **Real-Time Hover Inspection Outside Device Viewport:**
   - Mount a clean, sleek 260px Dev Inspector Sidebar on the right side of the canvas (outside the phone/tablet frame).
   - Instantly displays:
     - 🏷️ **Component / Tag Name**: e.g., `<button (Peta Meja)>`, `<div (TableCard)>`, `<header (PosCommandHeader)>`
     - 📐 **Pixel Dimensions**: e.g., `174px × 128px`
     - 📝 **Live Content / Text**: Preview of the inner text
     - 🎨 **Color & Theme Tokens**: Background, text, border
     - ⚡ **Interactive Attributes**: `role`, `data-testid`, `data-*`
2. **100% Zero-Lag Architecture (60/120 FPS):**
   - Uses `mouseover` top-level event delegation on the simulator container (no raw continuous `mousemove`).
   - Batches bounding rect reads via `requestAnimationFrame`.
   - Isolated HUD render pipeline: moving the mouse outside or inside the phone does NOT re-render the POS or KDS application.
3. **1-Tap Inspect Toggle (`[ 🔍 Inspect: ON/OFF ]`):**
   - Can be toggled on/off or closed via `[ ✕ ]` at any time.

## Scope

- `src/components/dev/DevInspectorHud.tsx` (NEW: Standalone Inspector HUD component < 500 lines)
- `src/components/dev/DevModePack.tsx` (Wire inspect toggle, event delegation, and HUD sidebar)
- `src/tests/devInspectorHud.test.ts` (Vitest test suite verifying inspector data extractor & HUD logic)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 148+ Vitest unit tests, and production build).
2. Hovering any element in the simulated mobile frame instantly reflects its tag name, text, and dimensions in the right HUD panel.
3. Zero input lag when tapping POS cards.
