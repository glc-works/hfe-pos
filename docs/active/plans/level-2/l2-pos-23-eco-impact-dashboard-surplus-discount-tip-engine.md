---
okf_version: "0.2"
type: Development Plan Level 2
title: Eco-Impact Dashboard, Paperless WhatsApp Default, Happy Hour Surplus Discount & Tip Distribution Engine
description: Implements Eco-Impact metrics dashboard, paperless digital WhatsApp receipt default, Bring-Your-Own-Cup (BYOC) eco discount, happy-hour surplus food waste reduction, and transparent employee tip distribution engine integrated with HCB REST APIs.
tags: [development-plan, level-2, esg, sustainability, eco-impact, paperless-receipt, surplus-food, tip-distribution]
parent_level_1: l1-20-esg-sustainability-commerce-engine
github_issue: 23
status: Proposed
---

# Level 2 Implementation Plan: Eco-Impact Dashboard, Paperless WhatsApp Default, Happy Hour Surplus Discount & Tip Distribution Engine

## 1. Outcome
Delivers the ESG & Sustainability Commerce module (`src/components/esg/`, `src/hooks/useEsgSustainability.ts`) supporting eco-impact metrics calculation, default paperless digital WhatsApp receipt folios, Bring-Your-Own-Cup (BYOC) eco perks, happy-hour surplus food waste reduction, and transparent employee tip distribution integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Eco-Impact Metrics Dashboard (`src/components/esg/EcoImpactDashboardWidget.tsx`)
- Implement `EcoImpactDashboardWidget.tsx`:
  - Thermal Paper Saved Metric (e.g. 1,250 paper rolls saved / 4 trees preserved).
  - CO2 Carbon Footprint Avoided calculation (from paperless receipts + BYOC tumblers).
  - Food Waste Rescued Weight Metric (e.g. 45 kg surplus bakery sold via happy hour discounts instead of thrown away).

### Phase B: BYOC Eco Perk & Happy Hour Surplus Discount (`src/hooks/useEsgSustainability.ts`)
- Implement `useEsgSustainability()` hook:
  - `VOUCHER-BYOC-ECO`: Applies Rp 2.000 discount when customer uses reusable tumbler/bag.
  - Happy Hour Surplus Discount Engine: Automatically applies 50% discount to perishable bakery items after store-configured time (e.g. 20:00).

### Phase C: Transparent Employee Tip Distribution Engine (`src/components/esg/EmployeeTipDistributionModal.tsx`)
- Implement `EmployeeTipDistributionModal.tsx`:
  - Displays total electronic tips collected via QRIS/VA (`2120-Employee Tips Payable`).
  - Fair Tip Allocator: Calculates tip distribution per shift staff member based on hours worked.
  - Submits tip payout journal to HCB Core (`POST /v1/company-books/{book}/shifts/distribute-tips`).

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fetchEsgMetrics(bookId)` ➔ `GET /v1/company-books/{book}/esg/metrics`
  - `distributeEmployeeTips(bookId, payload)` ➔ `POST /v1/company-books/{book}/shifts/distribute-tips`

### Phase E: Vitest Unit Testing (`src/tests/esgSustainability.test.ts`)
- Unit test coverage:
  - Verifies BYOC discount application in `cartMath.ts`.
  - Verifies paper savings calculation and tip distribution allocation.

## 3. Explicit Exclusions
- Does not modify HCB server-side carbon offset registry databases; operates strictly within the Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/esg/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
