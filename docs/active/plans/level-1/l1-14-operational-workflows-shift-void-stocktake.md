---
okf_version: "0.2"
type: Strategic Plan Level 1
title: End-to-End Operational Workflows — Shift Reconciliation, Void & Refund, Stocktake Audit
description: Strategic plan for store operational workflows covering cashier shift opening/closing float reconciliation, manager-authorized voids & refunds, and BOM inventory low-stock alerts & stocktake audits via HCB REST APIs.
tags: [plan, level-1, pos, operational-workflows, shift-reconciliation, void-refund, stocktake]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: End-to-End Operational Workflows

## 1. Domain Outcome
Expands the **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) to complete the **End-to-End Store Operational Lifecycle Workflows**.

Delivers cashier shift float opening & variance closing reconciliation (`POST /v1/shifts/reconcile`), manager-authorized order voids and payment refunds (`POST /v1/transactions/{id}/refund`), recipe BOM ingredient stock depletion tracking, and real-time low-stock alerts with stocktake audit logging resolved through HCB Core REST APIs (`/v1/shifts`, `/v1/transactions`, `/v1/inventory`).

---

## 2. The 4 Operational Workflows

```
 🔄 1. SHIFT RECONCILIATION WORKFLOW
 ────────────────────────────────────────────────────────────────────────────────────────
 [Open Shift] ──► Count Physical Float (Rp 500k) ──► Record Cash Out (Beli Es) ──► [Close Shift & Variance Audit]

 🧾 2. ORDER TICKET STATE TRANSITION WORKFLOW
 ────────────────────────────────────────────────────────────────────────────────────────
 [Placed / Queued] ──► [Brewing / Cooking] ──► [Ready / QC Pending] ──► [QC Passed] ──► [Served] ──► [Settled]

 🛡️ 3. MANAGER VOID & REFUND WORKFLOW
 ────────────────────────────────────────────────────────────────────────────────────────
 Order Cancellation Request ──► Manager PIN Authorization ──► HCB Reversal Posting ──► Re-stock BOM

 📦 4. STOCKTAKE & LOW-STOCK ALERT WORKFLOW
 ────────────────────────────────────────────────────────────────────────────────────────
 Recipe BOM Stock Depletion ──► Low-Stock Alert Badge (< 5L Susu) ──► Physical Stocktake Audit Log
```

---

## 3. Capability Scope

### A. Cashier Shift Opening & Variance Closing Reconciliation
1. **Shift Opening**: Cashier inputs starting physical cash float (default: Rp 500.000) in Cash Drawer (`1010-Cash Drawer`).
2. **Mid-Shift Cash Out**: Record petty cash expenses (e.g. purchasing ice bags Rp 20.000) with receipt upload notes.
3. **Shift Closing & Variance Audit**: Calculates Expected Cash vs Actual Physical Cash. Logs variance (`Over` / `Short`) to HCB Subledger (`POST /v1/shifts/reconcile`).

### B. Manager Void & Refund Engine
1. **Void Before Preparation**: Cashier voids placed order. Releasing held BOM inventory items.
2. **Payment Refund (Full/Partial)**: Manager PIN authorization required. Reverses journal entry in HCB Core (`POST /v1/transactions/{id}/refund`).

### C. Low-Stock Alerts & Physical Stocktake Audit
1. **Low-Stock Alert Badge**: Displays warning badge on KDS & POS catalog when raw ingredients fall below safety threshold.
2. **Stocktake Audit UI**: Allows store manager to perform periodic physical stock counts and log variance (`POST /v1/inventory/stocktake`).

---

## 4. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-17-shift-reconcile-void-refund-stocktake-engine.md`

---

## 5. Verification & Acceptance Criteria
- Shift closing variance calculation matches `Actual Cash - (Opening Float + Cash Sales - Cash Out)` exactly.
- Voiding an order requires valid Manager PIN authorization.
- Stocktake audit logs inventory variance to HCB Core inventory subledger cleanly.
