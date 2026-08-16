---
okf_version: "0.2"
type: Implementation Plan (Level 2)
title: L2-POS-55 — Master Product-Wide Compliance Sweep & Universal Device Parity
description: Comprehensive sweep and harmonization across all screens, widgets, and components in Hfe POS to strictly enforce HFE-UI-STD-001 (Pillars I-IV, Golden Ratio, Native App Glitch-Free, Offline ACID Resilience & Accounting Truth).
issue: POS-55
status: Ready to build
risk: M
budget: M
runtime_slot: implementation1
---

# L2-POS-55: Master Product-Wide Compliance Sweep & Universal Device Parity

## 1. Problem & Business Context

With the codification of **`HFE-UI-STD-001`**, all legacy screens and newly built modules must undergo an exhaustive sweep to guarantee **100% adherence** to:
1. **Pillar I (Physical Viewport & Native App Parity)**: Target compatibility across iOS (Safari Safe-Areas), Android (Chromium & Gesture Insets), Huawei (HarmonyOS & Fallback fonts), Portable Touch Tablets (iPadOS Portrait/Landscape), and Desktop Browsers (Chrome, Firefox, Safari, Opera).
2. **Pillar II (Ergonomic Design System & Atomic DDD)**: Verb-first microcopy, zero parentheses `(...)`, 100% `t.*` localization, `< 500 lines` modularity, and scoped storefront customization overrides.
3. **Pillar III (Offline ACID Resilience & Data Handling)**: IndexedDB physical disk queue, `navigator.storage.persist()`, `beforeunload` guard, and deterministic conflict resolution (GL 5101 inventory variance).
4. **Pillar IV (Universal Accounting Truth)**: $\sum \text{Debit} = \sum \text{Credit}$ balance verification, `X-Idempotency-Key` UUID v4 header, and single source of financial truth in Hfe Core.

---

## 2. Target Scope & 4 Experience Pillars Breakdown

### A. The 4 Experience Pillars
1. **`POS` (Cashier & Barista Workstation)**:
   - Views: `src/views/UnifiedPosView.tsx`, `src/views/KdsView.tsx`.
   - Organisms: `PosCartSection`, `PosCatalogGrid`, `PosFavoritesBar`, `PosTableFloorPlanSection`, `TableOpsModal`, `RoomChargeModal`.
   - Interaction: **Full Spotlight (`⌘K`) + Workstation Shortcuts (`F1-F12`, `Esc`, `Enter`)**.
2. **`CARD` (Customer Member Passbook & Wallet)**:
   - Views: `src/views/CustomerPortalView.tsx`.
   - Organisms: `DigitalMemberCard` (Apple Wallet style), `CustomerOrdersHistoryTab`, `CustomerTicketsWalletTab`, `CustomerVouchersTab`.
   - Interaction: Member ID lookup via phone/name at POS; touch interface on consumer phone.
3. **`BOARD` (Public Storefront & Landing Page)**:
   - Views: `src/views/LandingPageView.tsx`.
   - Organisms: `MerchantStorefrontCustomizerModal`, announcement hero, event ticket showcase.
   - Interaction: **Public Spotlight Omni-Search (`⌘K` / `/`)** on desktop; touch search on mobile.
4. **`ORDER` (Dine-in Customer QR Space)**:
   - Views: `src/views/CustomerMobileView.tsx`, `src/components/customer/CustomerCheckoutView.tsx`.
   - Organisms: `ActiveOpenBillDrawer`, `MerchantDetailDrawer`, `CustomerHeader`.
   - Interaction: **In-Page Touch Filter Bar**, keyboard shortcuts 100% disabled for single-thumb ergonomics.

### B. Global Components & Styling
- `src/components/common/SpotlightOmniSearchModal.tsx`: Spotlight omni-search modal.
- `src/hooks/useSpotlightShortcuts.ts`: Global keyboard shortcut hook.
- `src/index.css`: `overscroll-none`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, safe-area insets, Firefox thin scrollbars.

---

## 3. 4-Pillar Sweep Checklist

| Pillar | Verification Criteria | Target Result |
|---|---|---|
| **I: Hardware & Parity** | `100dvh`, no window scroll, safe-areas, Golden Ratio 61.8%:38.2%, 8pt grid, $\ge 44\text{px}$ touch | 100% Compliant |
| **II: Design & Microcopy** | Verb-first CTAs, zero parentheses `(...)`, 100% `t.*`, `< 500 lines` | 100% Compliant |
| **III: Offline ACID** | IndexedDB disk storage, OS low memory guard, GL 5101 variance, emergency CSV/JSON export | 100% Compliant |
| **IV: Ledger & Core** | $\sum \text{Debit} = \sum \text{Credit}$, UUID Idempotency Key, Hfe SDK fail-closed | 100% Compliant |

---

## 4. Verification Plan

1. **Local CI Gate**: Run `./scripts/ci-local.sh` and ensure exit code `0` (Modularity < 500 lines, Connector Manifest, TypeScript, ESLint, 100% Tests Pass, Production Build).
2. **Automated Unit Tests**: Execute `src/tests/hfeUniversalUiStandard.test.ts` (339+ tests passing).
3. **Multi-Device Inspection**: Audit on both **Port 5173** (DevMode) and **Port 4173** (Production Preview) across Compact Mobile (360px–390px), Tablet Portrait (768px), Tablet Landscape (1024px), and Desktop (1280px+).
