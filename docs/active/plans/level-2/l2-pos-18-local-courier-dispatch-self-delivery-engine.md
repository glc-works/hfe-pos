---
okf_version: "0.2"
type: Development Plan Level 2
title: Local Courier Dispatcher, Address Pinpoint & Self-Delivery Order Lifecycle UI
description: Implements self-delivery checkout selector, delivery address input modal, store runner dispatch assignment drawer, and WhatsApp delivery tracking link generator integrated with HCB REST APIs.
tags: [development-plan, level-2, self-delivery, local-courier, runner-dispatch, whatsapp-tracking]
parent_level_1: l1-15-self-delivery-local-courier-engine
github_issue: 18
status: Proposed
---

> **AUTHORITY NOTE (2026-09-02):** Semantics here are pending extraction into Product Canon (glc-works/hfeit-product). Until extracted, Product Canon wins any conflict. This file is implementation coordination only.


# Level 2 Implementation Plan: Local Courier Dispatcher, Address Pinpoint & Self-Delivery Order Lifecycle UI

## 1. Outcome
Delivers the Self-Delivery & Local Courier module (`src/components/delivery/`, `src/hooks/useSelfDelivery.ts`) supporting store self-delivery checkout, internal runner dispatch assignment, delivery fee math, and WhatsApp delivery tracking notifications integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Customer Delivery Checkout Component (`src/components/delivery/DeliveryAddressModal.tsx`)
- Implement `DeliveryAddressModal.tsx`:
  - Fulfillment Mode Switcher: `Dine-In`, `Takeaway`, `Kurir Toko (Delivery Sekitar)`.
  - Delivery Address Form: Recipient Name, Delivery Address, Unit/Block Notes, WhatsApp Number.
  - Delivery Fee Evaluator: Adds delivery fee (e.g. Rp 5.000) or applies Free Delivery if order subtotal >= threshold.

### Phase B: Store Runner Dispatch Management (`src/components/delivery/DeliveryDispatchModal.tsx`)
- Implement `DeliveryDispatchModal.tsx`:
  - Active Delivery Queue (Orders waiting for dispatch vs In-Transit).
  - Runner Roster Selector (Select from active store team members with `runner` / `waiter` role).
  - 1-Tap "Assign & Dispatch" button.
  - WhatsApp Tracking Link Generator (`wa.me/62812...` notification message to customer).

### Phase C: Delivery Provider Adapter Hook (`src/hooks/useSelfDelivery.ts`)
- Implement `useSelfDelivery()` hook:
  - Supports pluggable delivery provider type (`internal_runner` | `gosend` | `grabexpress` | `lalamove` | `paxel`).
  - Provider Config Switcher: Allows store owner to select default courier provider or fallback to 3PL express APIs for long distances.
  - Runner & Driver Status Update: Standardized state machine (`dispatched` ➔ `driver_assigned` ➔ `in_transit` ➔ `delivered`).

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fetchDeliveryQueue(bookId)` ➔ `GET /v1/company-books/{book}/deliveries`
  - `dispatchRunner(deliveryId, runnerId)` ➔ `POST /v1/company-books/{book}/deliveries/{id}/dispatch`
  - `completeDelivery(deliveryId, paymentStatus)` ➔ `POST /v1/company-books/{book}/deliveries/{id}/complete`

### Phase E: Vitest Unit Testing (`src/tests/selfDelivery.test.ts`)
- Unit test coverage:
  - Verifies delivery fee calculation and free delivery threshold math in `cartMath.ts`.
  - Verifies runner state transition logic (`dispatched` ➔ `delivered`).

## 3. Explicit Exclusions
- Does not integrate third-party 3PL APIs (e.g. GoSend / GrabExpress); operates strictly for internal store staff runners.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/delivery/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
