---
okf_version: "0.2"
type: Development Plan Level 2
title: Team Invitation Modal, Staff Role RBAC & Employee PIN Binding Engine
description: Implements Team Invitation modal, staff active roster management, Role-Based Access Control (RBAC) surface guards, and 6-digit Employee PIN workstation activation integrated with HCB REST APIs.
tags: [development-plan, level-2, team-invitation, membership, rbac, employee-pin, staff-roles]
parent_level_1: l1-13-team-membership-and-staff-invitation
github_issue: 15
status: Proposed
---

# Level 2 Implementation Plan: Team Invitation Modal, Staff Role RBAC & Employee PIN Binding Engine

## 1. Outcome
Delivers the Team Membership & Staff RBAC module (`src/components/team/` & `src/hooks/useTeamMembership.ts`) enabling store owners to send team invitations, assign staff roles, manage 6-digit Employee PIN activations, and enforce role surface guards integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Team Membership State Hook & RBAC Guard (`src/hooks/useTeamMembership.ts`)
- Implement `useTeamMembership()` hook:
  - Fetches active team members roster (`GET /v1/company-books/{book}/memberships`).
  - Active logged-in staff role state (`currentStaffRole`: `'owner'` | `'cashier'` | `'barista'` | `'chef'` | `'waiter'` | `'checker_qc'`).
  - Surface Access Evaluator:
    - `canAccessSettings`: `true` for Owner/Manager, `false` for others.
    - `canAccessPos`: `true` for Owner/Manager, Cashier, Waiter.
    - `canAccessKds`: `true` for Owner/Manager, Barista, Chef.
    - `canAccessShiftReconcile`: `true` for Owner/Manager, Cashier.

### Phase B: UI Components & Modals (`src/components/team/`)
- `src/components/team/TeamRosterSection.tsx` — Roster list on Cafe Settings view showing active team members, assigned roles, status badges (Active, Pending Invite), and "Undang Staf Baru" button.
- `src/components/team/InviteStaffModal.tsx` — Modal form for entering Staff Name, Email/WhatsApp, and selecting Staff Role from RBAC cards.
- `src/components/team/EmployeePinBindingModal.tsx` — Modal keypad for staff members entering 6-digit PIN to activate their workstation tablet (`POST /v1/memberships/accept`).

### Phase C: Hfe REST API Transport Integration (`src/services/hfeApi.ts`)
- Add API client endpoints:
  - `fetchTeamRoster(bookId)` ➔ `GET /v1/company-books/{book}/memberships`
  - `sendStaffInvitation(bookId, payload)` ➔ `POST /v1/company-books/{book}/memberships/invitations`
  - `acceptStaffPin(bookId, pinCode)` ➔ `POST /v1/company-books/{book}/memberships/accept`
  - `revokeStaffAccess(bookId, membershipId)` ➔ `DELETE /v1/company-books/{book}/memberships/{id}`

### Phase D: Vitest Unit Testing (`src/tests/teamMembership.test.ts`)
- Unit test coverage:
  - Verifies RBAC surface evaluator logic for all 5 staff roles.
  - Verifies 6-digit PIN validation rules.

## 3. Explicit Exclusions
- Does not modify HCB server-side security authorization layers; operates strictly within the Experience Layer RBAC guards and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/components/team/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
