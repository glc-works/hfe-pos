---
okf_version: "0.2"
type: Development Plan Level 2
title: Light & Dark Mode Presets with Independent Merchant & Customer Theme Engine
description: Deliver curated Light and Dark mode presets, fix live theme application, and establish independent theme customization for Customer QR Menu and Merchant Cashier POS.
tags: [development-plan, level-2, themes, light-mode, dark-mode, merchant-theme, customer-theme]
parent_level_1: l1-pos-suite-modernization
github_issue: 32
status: Proposed
---

# Light & Dark Mode Presets with Independent Merchant & Customer Theme Engine

## Outcome

1. **Curated Light & Dark Mode Theme Presets:**
   - ☀️ **4 Light Mode Presets:** Warm Latte Cream (`#faf8f5`), Clean Minimalist (`#ffffff`), Kyoto Matcha (`#f2f8f4`), Sakura Rose (`#fff5f7`).
   - 🌙 **4 Dark Mode Presets:** Obsidian Espresso (`#090d16`), Warm Charcoal (`#0f172a`), Cyberpunk Neon (`#09090b`), Forest Emerald (`#022c22`).
2. **Independent Customization for Merchant & Customer:**
   - **Customer Theme:** Applied dynamically to Customer Mobile QR View (`CustomerMobileView`, `CustomerHeader`, `CustomerCatalogView`, `CustomerCheckoutView`).
   - **Merchant Theme:** Applied dynamically to Cashier POS (`UnifiedPosView`), Staff Workstations, and Back-Office Settings.
3. **Fix Live Theme Switching & Persistence:**
   - Eliminate hardcoded `bg-slate-950` overlays that previously blocked theme background colors.
   - Persist both themes to `localStorage` (`hfe_customer_theme` and `hfe_merchant_theme`) for immediate and permanent visual updates.
4. **Enhanced Theme Settings Section (`ThemeConfigSection.tsx`):**
   - 1-Tap Scope Switcher: `[ 📱 Tema Pelanggan (QR) ]` vs `[ 🖥️ Tema Kasir (POS) ]`.
   - 1-Tap Mode Filter: `[ ✨ Semua ]` `[ ☀️ Light Mode ]` `[ 🌙 Dark Mode ]`.

## Scope

- `src/data/mockData.ts` (Add curated Light & Dark theme presets)
- `src/types/pos.ts` (Add `mode?: 'light' | 'dark'` and `targetScope?: 'customer' | 'merchant' | 'both'` to `CafeThemeConfig`)
- `src/App.tsx` (Manage separate `customerTheme` & `merchantTheme` state, localStorage persistence, and dynamic CSS root injection)
- `src/views/CustomerMobileView.tsx` (Clean hardcoded backgrounds to allow active theme background to shine)
- `src/components/settings/ThemeConfigSection.tsx` (Add Scope selector, Light/Dark filters, and instant reactive switcher)
- `src/views/CafeSettingsView.tsx` (Wire props for both customer and merchant theme setters)
- `src/tests/themeEngine.test.ts` (Vitest test suite verifying Light/Dark presets and independent theme separation)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-001)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 130+ Vitest unit tests, and production build).
2. Changing theme in Settings immediately updates Customer view when opening `?app=customer` and Cashier POS when opening `?app=cafe`.
3. Selecting a Light Mode theme switches the background to bright clean tones with crisp dark typography.
