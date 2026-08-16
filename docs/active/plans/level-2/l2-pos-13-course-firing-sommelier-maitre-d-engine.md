---
okf_version: "0.2"
type: Development Plan Level 2
title: Course Firing KDS, Sommelier Cellar Pairing & Maître d' VIP Concierge Engine
description: Implements course-by-course kitchen firing controls (Course 1-7), Sommelier digital wine list pairing & cellar tracking, and Maître d' VIP guest history concierge views integrated with HCB REST APIs.
tags: [development-plan, level-2, fine-dining, course-firing, sommelier, maitre-d, vip-concierge]
parent_level_1: l1-11-fine-dining-course-pacing-suite
github_issue: 13
status: Proposed
---

# Level 2 Implementation Plan: Course Firing KDS, Sommelier Cellar Pairing & Maître d' VIP Concierge Engine

## 1. Outcome
Delivers the Fine Dining Gastronomy extension (`src/views/FineDiningKdsView.tsx`, `src/views/SommelierView.tsx`, `src/views/MaitreDView.tsx`) supporting course-by-course kitchen firing, Sommelier cellar bottle pairing, and Maître d' VIP guest history concierge integrated with HCB REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Executive Chef Course Firing KDS (`src/views/FineDiningKdsView.tsx`)
- Implement `FineDiningKdsView.tsx`:
  - Course Matrix View (Amuse-Bouche, Appetizer, Soup, Sorbet, Main Course, Dessert, Digestif).
  - Status indicators per course: `Holding`, `Fired`, `Plating`, `Served`.
  - "Fire Next Course" action button sending real-time trigger to kitchen prep stations.

### Phase B: Sommelier Digital Wine List & Cellar (`src/views/SommelierView.tsx`)
- Implement `SommelierView.tsx`:
  - Digital Wine Catalog with vintage ratings, flavor profiles, and pairing recommendations per tasting menu item.
  - Cellar bottle inventory lookup (`GET /v1/cellar/bottles`) and decanting timer notification.
  - Glass vs Bottle pour deduction helper (`POST /v1/cellar/pour`).

### Phase C: Maître d' VIP Concierge Surface (`src/views/MaitreDView.tsx`)
- Implement `MaitreDView.tsx`:
  - VIP Floor Plan Grid with guest name tags, preferred seating indicators, and anniversary/birthday badges.
  - Guest History Modal (`src/components/finedining/GuestHistoryModal.tsx`) showing visit history, favorite vintage, dietary allergies, and preferred sommelier.

### Phase D: Hfe REST API Transport Updates (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fireCourse(orderId, courseNumber)` ➔ `POST /v1/company-books/{book}/kds/fire-course`
  - `fetchCellarBottles(bookId)` ➔ `GET /v1/company-books/{book}/cellar/bottles`
  - `fetchVipGuestHistory(contactId)` ➔ `GET /v1/company-books/{book}/vip-guests/{id}`

### Phase E: Vitest Unit Testing (`src/tests/fineDining.test.ts`)
- Unit test coverage:
  - Verifies course firing state transition sequence (`Course 1 Served` ➔ `Course 2 Fired`).
  - Verifies wine bottle pour conversion (1 bottle = 5 glasses).

## 3. Explicit Exclusions
- Does not modify HCB server-side kitchen engines; operates strictly within the `hfe-pos` Experience Layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/views/` and `src/components/` remain under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
