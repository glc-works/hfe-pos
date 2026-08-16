---
okf_version: "0.2"
type: Development Plan Level 2
title: 3-Step Store Onboarding Wizard, Preset Auto-Configuration & Getting Started Experience
description: Implements 3-step store onboarding modal wizard (Store Type & Scale, Brand & Sosmed Profile, PB1 Tax & Kas Float) that auto-populates HCB background policies under a clean Getting Started interface.
tags: [development-plan, level-2, onboarding, getting-started, store-setup, preset-configuration]
parent_level_1: l1-12-store-onboarding-getting-started-wizard
github_issue: 14
status: Proposed
---

# Level 2 Implementation Plan: 3-Step Store Onboarding Wizard, Preset Auto-Configuration & Getting Started Experience

## 1. Outcome
Delivers the Store Onboarding & Getting Started Wizard module (`src/components/onboarding/StoreOnboardingWizard.tsx` & `src/hooks/useOnboarding.ts`) allowing new store owners to set up `hfe-pos` in under 2 minutes, auto-configuring `businessTypePolicy`, `operationScalePolicy`, and HCB Core REST API transport endpoints per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Onboarding State Hook (`src/hooks/useOnboarding.ts`)
- Implement `useOnboarding()` hook managing:
  - Setup completion flag (`isOnboardingCompleted: boolean`).
  - Current active step (Step 1: Store Type & Scale, Step 2: Brand & Social, Step 3: Tax & Float).
  - Preset Auto-Configuration Logic:
    - If `businessType === 'cafe_fnb'`: enables Table Floor Plan, Drink Modifiers, KDS Kanban, and Recipe BOM.
    - If `businessType === 'toko_kelontong'`: enables Barcode Scanner, Multi-UOM, Kasbon Ledger, and Scan & Go.
    - If `businessType === 'fine_dining'`: enables Course Firing, Sommelier Cellar, Maître d' VIP, and Table Floor Plan.
    - If `scaleMode === 'single_person'`: enables auto-bump on checkout and unified single-screen UI.

### Phase B: Onboarding Wizard Components (`src/components/onboarding/`)
- `src/components/onboarding/StoreOnboardingWizard.tsx` — Full-screen setup modal with progress steps (Step 1 of 3).
- `src/components/onboarding/Step1StoreTypeAndScale.tsx` — Visual cards selector for Business Type (Cafe ☕, Kelontong 🛒, Fine Dining 🍷) and Scale Mode (1 Person 👤, 2-3 Staff 👥, Enterprise 🏢).
- `src/components/onboarding/Step2BrandAndSocialProfile.tsx` — Input fields for Brand Name, Logo, Address, Instagram, WhatsApp Order Contact, WiFi SSID & Password.
- `src/components/onboarding/Step3TaxAndFloatSettings.tsx` — PB1 Tax Mode radio cards (Mode 0 Off, Mode 1 Exclude, Mode 2 Include) and Kas Float Awal Shift input.

### Phase C: Getting Started Quick Checklist (`src/components/onboarding/GettingStartedChecklist.tsx`)
- Collapsible widget on Cafe Settings view showing Getting Started completion status:
  - [x] Setup Store Type & Scale
  - [x] Configure Brand & Social Profile
  - [x] Set PB1 Tax & Kas Float
  - [ ] Perform First Test Sale
  - [ ] Connect Receipt Printer (Optional)

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Save setup configuration payload to HCB REST API: `PUT /v1/company-books/{book}/settings`.

### Phase E: Vitest Unit Testing (`src/tests/onboarding.test.ts`)
- Unit test coverage:
  - Verifies preset auto-configuration mapping (selecting `toko_kelontong` enables `enableBarcodeScanner`).
  - Verifies onboarding completion flag persistence in `localStorage`.

## 3. Explicit Exclusions
- Does not modify HCB server-side database schemas; operates strictly within the Experience Layer frontend state.

## 4. Verification Plan
- Completing wizard steps in test environment auto-configures `businessTypePolicy` correctly.
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/onboarding/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
