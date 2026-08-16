---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Multi-Branch Outlet Management Suite (Branch Switcher, Multi-Outlet Dashboard & Inter-Branch Sync)
description: Strategic plan for managing multi-branch store outlets (e.g. Senopati, BSD, Kemang), featuring active branch workspace switcher, multi-outlet sales overview dashboard, branch-specific operating hours/WiFi configs, and inter-branch stock transfers via HCB REST APIs.
tags: [plan, level-1, pos, multi-branch, outlet-management, branch-switcher, multi-outlet-dashboard]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Multi-Branch Outlet Management Suite

## 1. Domain Outcome
Delivers the **Multi-Branch Outlet Management Suite** for `hfe-pos` (`glc-works/hfe-pos`).

Empowers store owners and multi-store managers to manage multiple branch outlets (e.g. `OUTLET-SENOPATI-01`, `OUTLET-BSD-02`, `OUTLET-KEMANG-03`), switch active workstation branch contexts dynamically, compare multi-outlet real-time sales performance, configure branch-specific operating hours and WiFi credentials, and coordinate inter-branch stock transfers resolved through HCB Core REST APIs (`/v1/branches`).

---

## 2. Capability Scope

```
 🏢 MULTI-BRANCH OUTLET MANAGEMENT LIFECYCLE
 ├─ 🔄 1. Active Branch Workstation Switcher (`OUTLET-SENOPATI-01` ➔ `OUTLET-BSD-02`)
 ├─ 📊 2. Multi-Outlet Performance Overview Dashboard (Comparative sales, active shift float, order volume)
 ├─ ⚙️ 3. Branch-Specific Storefront Configs (Operating hours, Instagram handle, WiFi SSID/Pass per branch)
 ├─ 👥 4. Branch Staff Roster Allocation (Assigning cashiers/baristas to specific branch outlets)
 └─ 🚚 5. Inter-Branch Stock Transfer (Transferring stock from Senopati Branch to BSD Branch)
```

### Pillar A: Workstation Branch Switching & Multi-Outlet Dashboard
1. **Branch Workspace Switcher**: Quick-switch active branch context in header bar. All POS catalog, table floor plan, and cashier shift float data instantly re-bind to the selected branch outlet.
2. **Multi-Outlet Overview Dashboard (`BranchManagementView.tsx`)**: Owner views side-by-side sales performance, active cashier shift float status, and top-selling SKUs across all branches in 1 screen.

### Pillar B: Branch Storefront Configs & Inter-Branch Logistics
1. **Branch Storefront Settings**: Edit branch address, Google Maps pin link, operating hours, and guest WiFi credentials per branch outlet.
2. **Inter-Branch Stock Transfer**: Coordinate stock movements between branch storefront warehouses (`POST /v1/company-books/{book}/inventory/transfer`).

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-22-branch-management-view-outlet-switcher-engine.md`

---

## 4. Verification & Acceptance Criteria
- Switching active branch updates cart, catalog, and shift float context cleanly in `< 50ms`.
- Multi-outlet sales dashboard fetches comparative performance metrics from HCB Core REST APIs (`/v1/branches/sales-comparison`).
- Creating a new branch outlet registers the branch entity in HCB Core book settings.
