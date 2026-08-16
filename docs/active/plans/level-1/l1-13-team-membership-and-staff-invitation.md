---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Team Membership, Staff Role Authorization & Invite Flow
description: Experience Layer integration for cafe/store team invitations, Role-Based Access Control (RBAC), and 6-digit Employee PIN binding via HCB Core Membership REST APIs.
tags: [plan, level-1, pos, team-invitation, membership, rbac, staff-roles, employee-pin]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Team Membership, Staff Role Authorization & Invite Flow

## 1. Domain Outcome
Delivers the **Team Membership & Staff Invitation Flow** for `hfe-pos` (`glc-works/hfe-pos`).

Store Owners and Managers can invite staff members (Cashier, Barista, Chef, Waiter, Checker QC, Sommelier), assign Role-Based Access Control (RBAC) permissions, generate 6-digit Employee Join PINs, and manage active team memberships resolved through HCB Core Membership REST APIs (`/v1/company-books/{book}/memberships`).

---

## 2. Capability Scope

### A. Staff Role Hierarchy (RBAC Matrix)

| Role | Access Surfaces | Permitted Actions |
|---|---|---|
| **`owner` / `manager`** | All Surfaces & Settings | Full access, PB1 tax settings, shift float reconciliation, team invitations, financial reports. |
| **`cashier`** | Barista POS & Checkout | Cashier POS workstation, shift float opening/closing count, walk-in orders, receipt printing. |
| **`barista` / `chef`** | KDS Screen | KDS Kanban queue, station preparation timers, bump actions (`Brewing` ➔ `Ready`), BOM recipe viewer. |
| **`waiter` / `runner`** | Table Grid & Service | Table floor plan matrix, table transfer (Pindah Meja), split bill per seat, waiter call response. |
| **`checker_qc`** | QC Pass Surface | Quality control inspection surface, allergen verification, bump actions (`Ready` ➔ `QC Passed`). |

### B. Team Invitation & Join PIN Flow
1. **Send Staff Invite**: Owner inputs Staff Name, Email/WhatsApp, and selects Staff Role (`POST /v1/company-books/{book}/memberships/invitations`).
2. **6-Digit Employee Join PIN Generation**: Server generates a secure 6-digit PIN (e.g. `882194`) and invitation link token.
3. **Staff Workstation Activation**: Staff member enters the 6-digit PIN on the workstation tablet to instantly bind their staff profile to the store (`POST /v1/memberships/accept`).
4. **Active Team Roster Management**: Owner can view active team members, revoke staff access, or update roles (`GET /v1/company-books/{book}/memberships`).

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-15-team-invitation-staff-rbac-pin-engine.md`

---

## 4. Verification & Acceptance Criteria
- Sending staff invitation generates a 6-digit PIN and records pending invitation in HCB Core Membership.
- Entering invalid 6-digit PIN returns `401 Unauthorized` with clear error feedback.
- Cashier staff attempting to open Owner Cafe Settings is blocked by RBAC feature entitlement guard.
