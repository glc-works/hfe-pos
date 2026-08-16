---
okf_version: "0.2"
type: Development Plan Level 2
title: Branch Management View, Multi-Outlet Switcher & Inter-Branch Performance Engine
description: Implements Multi-Branch Overview dashboard view, active branch workspace switcher, branch storefront config modal, and inter-branch performance engine integrated with HCB REST APIs.
tags: [development-plan, level-2, multi-branch, outlet-management, branch-switcher, multi-outlet-dashboard]
parent_level_1: l1-19-multi-branch-outlet-management-suite
github_issue: 22
status: Proposed
---

# Level 2 Implementation Plan: Branch Management View, Multi-Outlet Switcher & Inter-Branch Performance Engine

## 1. Outcome
Delivers the Multi-Branch Management module (`src/views/BranchManagementView.tsx`, `src/components/branches/`, `src/hooks/useBranch.ts`) supporting multi-outlet performance dashboards, active branch workspace switching, branch-specific storefront config modals, and inter-branch stock transfers integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Multi-Branch Management View (`src/views/BranchManagementView.tsx`)
- Implement `BranchManagementView.tsx`:
  - Multi-Branch Performance Cards (Senopati, BSD, Kemang) showing real-time sales revenue, order count, and active cashier shift float.
  - Multi-Outlet Comparative Chart & Top Selling SKUs per branch.
  - "Tambah Cabang Baru" button opening `CreateBranchModal.tsx`.

### Phase B: Branch Workstation Switcher & Config Modals (`src/components/branches/`)
- `BranchSwitcherDropdown.tsx` — Header bar component allowing cashiers/managers to switch active branch context.
- `BranchConfigModal.tsx` — Modal form for editing branch-specific address, Google Maps link, operating hours, and WiFi credentials.
- `CreateBranchModal.tsx` — Modal form for registering a new branch outlet under the company book.

### Phase C: Branch Session State Hook (`src/hooks/useBranch.ts`)
- Implement `useBranch()` hook:
  - Manages active branch ID (`activeBranchId`: string), branch list (`branches: BranchInfo[]`), and branch comparative metrics.
  - Context persistence in `localStorage` (`hfe_pos_active_branch`).

### Phase D: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fetchBranches(bookId)` ➔ `GET /v1/company-books/{book}/branches`
  - `createBranch(bookId, payload)` ➔ `POST /v1/company-books/{book}/branches`
  - `updateBranch(bookId, branchId, payload)` ➔ `PUT /v1/company-books/{book}/branches/{id}`
  - `fetchMultiBranchSales(bookId)` ➔ `GET /v1/company-books/{book}/branches/sales-comparison`

### Phase E: Vitest Unit Testing (`src/tests/branch.test.ts`)
- Unit test coverage:
  - Verifies active branch switcher state updates.
  - Verifies context persistence and branch comparative metrics parsing.

## 3. Explicit Exclusions
- Does not modify HCB server-side company book multi-tenant schemas; operates strictly within the Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/branches/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
