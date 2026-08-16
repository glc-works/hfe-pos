---
okf_version: "0.2"
type: Development Plan Level 2
title: Allergen Menu Filter, Cross-Merchant toGrow History & Pay-Tier Feature Entitlements
description: Implements customer allergen menu filtering (grey-out vs hide), cross-merchant toGrow account transaction history drawer, and Merchant Pay-Tier feature entitlement guards.
tags: [development-plan, level-2, allergen-filter, togrow-account, merchant-tiering, feature-guard]
parent_level_1: l1-09-customer-preferences-togrow-account-and-merchant-tiering
github_issue: 11
status: Proposed
---

# Level 2 Implementation Plan: Allergen Menu Filter, Cross-Merchant toGrow History & Pay-Tier Feature Entitlements

## 1. Outcome
Delivers the Customer Preference Allergen Filter module (`src/components/customer/AllergenFilter.tsx`), Universal `toGrow` Account Transaction History Drawer (`src/components/customer/ToGrowHistoryDrawer.tsx`), and Merchant Pay-Tier Feature Entitlement Guard (`src/hooks/useSubscriptionTier.ts`) integrated with HCB REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Customer Allergen Preference Engine (`src/components/customer/`)
- Extend `CustomerProfile` interface in `src/types/pos.ts` with `allergenFlags` array (`lactose`, `nuts`, `gluten`, `seafood`) and `allergenDisplayMode` (`grey-out` | `hide`).
- Implement `src/components/customer/AllergenFilterToggle.tsx`:
  - Toggle between **Grey-Out Mode** (menu item card rendered with 50% opacity, allergen warning badge, and disabled add button) and **Hide Mode** (item removed from menu list).
- Implement allergen badge indicator on `MenuItem` cards.

### Phase B: Universal toGrow Account History Drawer (`src/components/customer/`)
- Implement `src/components/customer/ToGrowHistoryDrawer.tsx`:
  - Fetches cross-merchant transaction history via `GET /v1/togrow/users/{account_id}/transactions`.
  - Displays merchant brand name, logo, order items, total IDR, and timestamp across all `toGrow` ecosystem cafes/restos.
  - Shows customer taste pattern insights (e.g. *"Total 18 Kopi Dipesan Bulan Ini di 3 Cafe toGrow"*).

### Phase C: Merchant Pay-Tier Feature Entitlement Guard (`src/hooks/useSubscriptionTier.ts`)
- Implement `useSubscriptionTier()` hook fetching `GET /v1/company-books/{book}/subscription`:
  - Returns `tierMode`: `'free'` | `'pay_tier'`.
  - Feature Guard checks:
    - `canAccessLoyaltyAndVouchers`: `false` in Free (shows upgrade modal), `true` in Pay Tier.
    - `canOptOutPrivateContacts`: `false` in Free, `true` in Pay Tier.
    - `canAccessReservations`: `false` in Free (shows upgrade modal), `true` in Pay Tier.
    - `canManageWarehouses`: `false` in Free (single store), `true` in Pay Tier.
    - `canCreateBomRecipe`: `false` in Free, `true` in Pay Tier.
- Implement `src/components/modals/SubscriptionUpgradeModal.tsx` for locked Pay-Tier features in Free mode.

### Phase D: Hfe REST API Transport Updates (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `updateCustomerPreferences(contactId, preferences)` ➔ `POST /v1/company-books/{book}/contacts/{id}/preferences`
  - `fetchToGrowHistory(accountId)` ➔ `GET /v1/togrow/users/{account_id}/transactions`
  - `fetchMerchantSubscription(bookId)` ➔ `GET /v1/company-books/{book}/subscription`

### Phase E: Vitest Unit Testing (`src/tests/allergenAndTiering.test.ts`)
- Unit test coverage:
  - Verifies menu filter logic: `grey-out` disables item, `hide` filters array length.
  - Verifies feature guard entitlement check for Free vs Pay Tier.

## 3. Explicit Exclusions
- Does not modify HCB server-side billing engines; handles client-side UI feature guards and REST API mapping.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/` and `src/hooks/` remain under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
