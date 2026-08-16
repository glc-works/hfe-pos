---
okf_version: "0.2"
type: Development Plan Level 2
title: Custom Theme Template Vault & F&B Theme Marketplace Showcase (shadcn-compatible)
description: Implement personal custom theme template saving, local vault persistence, shadcn CSS variables export, and an interactive F&B Theme Marketplace gallery with 1-tap install for customer mobile QR menus and POS workstations.
tags: [development-plan, level-2, theme-customization, shadcn-tokens, theme-marketplace, template-vault, fnb-commerce]
parent_level_1: l1-pos-suite-modernization
github_issue: 42
status: Proposed
---

# Custom Theme Template Vault & F&B Theme Marketplace Showcase (shadcn-compatible)

## Outcome

1. **Save Custom Theme Templates:**
   - Merchants can save their active fine-tuned colors, typography, and card tokens as personal named templates (e.g. "Kopi Senopati Autumn V2") into their local vault (`hfe_custom_saved_templates`).
2. **Interactive Theme Marketplace Gallery:**
   - Tabbed gallery inside Theme Settings: `[ 📦 Bawaan ] [ 💾 Template Saya ] [ 🛒 Marketplace ]`.
   - Curated community/creator themes (Tokyo Minimalist Matcha, Cyberpunk Boba, Nordic Roastery, Sunset Bar, etc.) with ratings, install counts, and 1-tap install.
3. **Bi-Directional shadcn CSS Variables & JSON Export/Import:**
   - 1-click copy shadcn `:root { --background; --primary; --card; ... }` CSS tokens alongside standard JSON stylesheet.
4. **Immediate Dynamic Application to Customer Mobile View (`CustomerMobileView.tsx`)**:
   - Customer QR menu dynamically renders with active theme tokens.

## Scope

- `src/data/marketplaceThemesData.ts` (NEW: Curated community theme catalog < 500 lines)
- `src/components/settings/ThemeConfigSection.tsx` (Add 3-tab switcher, Save Modal, Marketplace Grid, and shadcn CSS export)
- `src/tests/themeMarketplaceAndCustomTemplates.test.ts` (Vitest test suite verifying template saving, persistence, and marketplace installation)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-010)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 155+ Vitest unit tests, and production build).
2. Saving a custom template persists to localStorage and appears in "Template Saya".
3. Installing a marketplace theme instantly updates customer QR menu and POS theme tokens.
