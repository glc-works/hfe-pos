---
okf_version: "0.2"
type: Development Plan Level 2
title: Deterministic Smart Upsell Engine, Self-Service Kiosk View, Pay-at-Table Tip Slider & Staff Timeclock Engine (L2-POS-28)
description: Implements deterministic smart upsell modal (AI-Ready, zero 1st-party API key cost), self-service ordering kiosk view, optional contactless QR Pay-at-Table folio with tip slider, staff timeclock attendance modal, and multi-currency tourist pay converter integrated with HCB REST APIs.
tags: [development-plan, level-2, pos-2026, deterministic-upsell, pay-at-table, self-kiosk, timeclock, multi-currency]
parent_level_1: l1-23-pos-2026-next-gen-capabilities-suite
github_issue: 28
status: Approved
---

# Level 2 Implementation Plan: Deterministic Smart Upsell Engine, Self-Service Kiosk View, Pay-at-Table Tip Slider & Staff Timeclock Engine

## 1. Outcome
Delivers the POS 2026 Next-Gen module (`src/components/pos2026/`, `src/views/KioskSelfServiceView.tsx`, `src/views/PayAtTableQrView.tsx`, `src/hooks/useDeterministicUpsell.ts`) supporting deterministic basket cross-selling (AI-Ready schema, $0 API key cost), self-service kiosk mode, optional contactless pay-at-table folios with tip sliders, staff timeclock attendance, and multi-currency tourist pay integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Deterministic Smart Upsell Engine (`src/hooks/useDeterministicUpsell.ts` & `src/components/pos2026/DeterministicUpsellModal.tsx`)
- Implement `useDeterministicUpsell()` hook and `DeterministicUpsellModal.tsx`:
  - Uses co-occurrence frequency matrices and rule-based pairing logic (e.g. *Sirloin Steak* ➔ *Pinot Noir Wine*, *Burger* ➔ *Truffle Fries*).
  - ZERO 1st-party LLM API key cost or LLM server dependency.
  - AI-Ready schema interface allows optional merchant BYO-Key integration.

### Phase B: Self-Service Kiosk Workstation Mode (`src/views/KioskSelfServiceView.tsx`)
- Implement `KioskSelfServiceView.tsx` (`/kiosk` route):
  - 15-inch/21-inch touchscreen self-ordering UI with large category tiles.
  - Generates sequential queue number ticket (`Nomor Antrean A-042`).
  - Integrated QRIS payment checkout screen.

### Phase C: Optional Contactless Pay-at-Table Folio & Tip Slider (`src/views/PayAtTableQrView.tsx`)
- Implement `PayAtTableQrView.tsx` (`/pay-at-table/:tableId` route):
  - Renders itemized table folio on customer's phone as an optional feature.
  - Interactive Tip Slider (`0%`, `10%`, `15%`, `20%`, or custom Rp amount).
  - Direct QRIS / Apple Pay / Card checkout.

### Phase D: Staff Timeclock Attendance & Multi-Currency (`src/components/pos2026/`)
- `StaffTimeclockModal.tsx` — PIN/Selfie Clock-In & Clock-Out modal logging shift hours worked.
- `MultiCurrencyPayModal.tsx` — Dynamic Currency Conversion (DCC) calculator supporting IDR, USD, SGD, and AUD.

### Phase E: Vitest Unit Testing (`src/tests/pos2026Capabilities.test.ts`)
- Unit test coverage:
  - Verifies deterministic smart upsell pairing recommendations ($0 API cost).
  - Verifies Pay-at-Table tip slider math.
  - Verifies Kiosk queue number sequence generation.
  - Verifies Multi-Currency exchange rate conversions (IDR, USD, SGD, AUD).

## 3. Explicit Exclusions
- Does not invoke any 1st-party AI API key or incur LLM API token costs; operates 100% deterministically with HCB Core rules.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
