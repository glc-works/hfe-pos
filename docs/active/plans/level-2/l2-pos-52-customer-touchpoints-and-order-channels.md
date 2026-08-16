---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Customer Touchpoints and Order Channels Cutover
description: Wave 2 upgrade enhancing Dine-In Customer QR Order Space with modifier transparency, table/zone context hydration, tactile floating cart dock, 1-tap re-order, Apple Wallet digital member card passbook, and public storefront spotlight search.
tags: [development-plan, level-2, pos, customer-qr, order-channels, member-portal]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 52
status: In progress
---

# Hfe POS Customer Touchpoints & Order Channels Cutover (Wave 2)

## Outcome

Delivers a cohesive customer-facing experience upgrade across three primary touchpoints:

1. **Dine-In Customer Mobile QR Order Space**:
   - **Modifier Transparency**: Detailed modifier breakdown and add-on pricing (`🥛 Oat Milk (+Rp 5.000) • 🍬 Gula 50%`) with tabular price calculations.
   - **Table & Zone Context Hydration**: Automatic binding and prominent visual badge (`🍽️ Meja IND-02 • ❄️ Indoor AC`) from URL parameters.
   - **Tactile Floating Cart Dock**: Single-thumb ergonomics with spring animation, gold count pill, and bottom safe-area spacing.
   - **Smart Recommendations & 1-Tap Re-Order**: Instant re-ordering from past orders and pastry pairing upsell.

2. **Customer Member Portal & Digital Card Pass**:
   - Apple Wallet passbook-inspired digital member card with barcode ID, tier styling, point balance, and stamp card tracker (`8/10 Stamp`).
   - Unified customer preferences (dietary notes, favorite milk, vehicle plate) synchronized to POS cashier lookup.

3. **Public Storefront & Spotlight Search**:
   - Omnichannel Spotlight Search (`⌘K` / `/`) and event ticket pass wallet.

## Scope

### Pillar A: Customer QR Order Enhancements
- `src/components/customer/CustomerCatalogView.tsx`: Integrate smart upsell bar and 1-tap re-order actions.
- `src/components/customer/CustomerCheckoutView.tsx`: Render transparent modifier badges and recalculate subtotal with add-on prices.
- `src/components/customer/ActiveOpenBillDrawer.tsx`: Render modifier details in active order tickets and waiter call chits.
- `src/components/customer/CustomerHeader.tsx`: Render hydrated Table ID and Zone badges.

### Pillar B: Customer Member Portal & Passbook
- `src/components/customer-portal/DigitalMemberCard.tsx`: Apple Wallet passbook styling with live stamp progress.
- `src/components/customer-portal/HfeCardIdentityPassbook.tsx`: Customer identity overview and QR barcode for POS scanning.
- `src/views/CustomerPortalView.tsx`: Integrated multi-tab portal shell (`100dvh`, single scroll owner).

### Pillar C: Verification & Testing
- `src/tests/customerOrderChannelsWave2.test.ts`: Automated test suite asserting:
  1. Modifier pricing and subtotal calculation transparency.
  2. Table ID and zone hydration from URL parameters.
  3. 1-Tap re-order state mutation without card duplication.
  4. Member tier threshold and stamp card progress calculations.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Modifying POS cashier session/shift endpoints (handled in Wave 1).
- Non-customer backoffice operations (scheduled for Wave 3).

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #9: Mandatory Multi-Device & Mobile Viewport Stress-Testing.
- Invariant Rule #10: Apple HIG & Nielsen Norman Microcopy Standard.
- Invariant Rule #13: Universal Viewport Single Source of Truth & 3-Zone Header Budget.
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy & React Aria Engine.
- Invariant Rule #20: The 4 Core Experience Pillars (POS, CARD, BOARD, ORDER).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 64+ Vitest Suites, Vite Build).
2. Mobile Ergonomics Proof: Verified safe-area padding and single-thumb touch interactions on 360px–430px mobile screens.
3. Modifier Transparency Proof: All added modifiers render explicit itemized pricing in checkout and active bill drawers.
4. Member Pass Proof: Barcode scanner formats match POS cashier customer lookup specifications.

## Stop Conditions

- Any hardcoded viewport checks (`isMobile = window.innerWidth < 768`) bypassing `useViewport()`.
- Modifying files exceeding the 500-line modularity threshold.
- CI gate failure.
