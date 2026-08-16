---
okf_version: "0.2"
type: Development Plan Level 2
title: WiFi Access Policy, Guest Payment Gating & Storefront Security Engine (L2-POS-44)
description: Specifies the architecture and implementation for merchant-configurable WiFi Access Policy (always_visible, after_payment, disabled), 1-tap clipboard copy, and dynamic guest order status gating.
tags: [development-plan, level-2, wifi-policy, payment-gating, storefront-info, customer-qr, hfe-pos]
parent_level_1: l1-25-storefront-profile-and-customer-engagement
github_issue: 44
status: In Progress
---

# Level 2 Implementation Plan: WiFi Access Policy, Guest Payment Gating & Storefront Security Engine (L2-POS-44)

## 1. Outcome
Delivers a merchant-configurable **WiFi Access Control Policy** within `hfe-pos` allowing F&B owners to control when and how guest WiFi credentials (SSID & Password) are revealed to visitors on Customer Mobile QR ordering surfaces (`CustomerHeader.tsx`, `MerchantDetailDrawer.tsx`, `CustomerCheckoutView.tsx`, `ActiveOpenBillDrawer.tsx`).

## 2. Technical Specification & Policy Model

### 2.1. Domain Data Contract (`src/types/pos.ts`)
```typescript
export type WifiAccessPolicy = 'always_visible' | 'after_payment' | 'disabled'

export interface HfeStorefrontInfo {
  tagline?: string
  storyDescription?: string
  operatingHours?: string
  wifiSsid?: string
  wifiPassword?: string
  wifiAccessPolicy?: WifiAccessPolicy // Default: 'after_payment'
  heroBannerUrl?: string
}
```

### 2.2. Policy Behavior Matrix

| Policy Option | Guest Pre-Payment State | Guest Post-Payment / Active Bill State | Merchant Settings Use-Case |
|---|---|---|---|
| **`always_visible`** | Shows SSID & Password with 1-Tap Copy button | Shows SSID & Password with 1-Tap Copy button | Casual cafes, waiting rooms, family restaurants. |
| **`after_payment`** *(Default)* | Displays `🔒 WiFi Kafe Terkunci (Terbuka setelah pesanan lunas)` | Displays Celebratory Card: `🎉 WiFi Terbuka: SSID • Password [📋 Salin]` | High-traffic roasteries, co-working cafes, rush hours. |
| **`disabled`** | WiFi section completely hidden | WiFi section completely hidden | Takeaway-only outlets, express retail counters. |

---

## 3. Scope & Component Breakdown

### Phase A: Core Domain Types & Mock Seed (`src/types/pos.ts` & `src/data/mockData.ts`)
- Add `WifiAccessPolicy` to `HfeCompanyProfile.storefrontInfo` and `OnboardingData`.
- Seed `DEFAULT_COMPANY_PROFILE.storefrontInfo` with `wifiAccessPolicy: 'after_payment'`.

### Phase B: Customer QR View Integration (`src/components/customer/`)
- `CustomerHeader.tsx`: Displays subtle WiFi status indicator matching active policy.
- `MerchantDetailDrawer.tsx`: Renders locked placeholder or full credentials with 1-tap copy.
- `CustomerCheckoutView.tsx`: Displays celebratory unlocked WiFi banner when `hasPaidOrder === true`.
- `ActiveOpenBillDrawer.tsx`: Displays unlocked WiFi card for active dining tables with running tabs.

### Phase C: Merchant Settings & Onboarding Controls (`src/components/settings/` & `onboarding/`)
- `Step2BrandAndSocialProfile.tsx`: Adds 3-way radio/pill selector for onboarding setup.
- `HfeSyncSettingsSection.tsx`: Allows merchant to change policy at runtime via `CafeSettingsView.tsx`.

### Phase D: Unit Test Suite (`src/tests/wifiAccessPolicy.test.ts`)
- Verifies behavior across `always_visible`, `after_payment` (before vs after checkout), and `disabled` modes.

---

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- Modularity check passes (< 500 lines per file).
- Production build succeeds without TypeScript or Vite compilation errors (`./scripts/ci-local.sh`).
