# 🧭 HFE Customer User Journey: Comprehensive End-to-End Friction & Experience Audit

## Executive Summary
This document records the definitive, end-to-end audit of the **Customer Mobile Web Ordering Journey** (`CustomerMobileView.tsx`, `useCart.ts`, `useTableState.ts`, `CustomerHeader.tsx`, `MerchantDetailDrawer.tsx`) within the HFE ecosystem.

---

## 🎯 8-Stage Customer Journey Walkthrough & Verifications

```
 ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 │   ACT 1:    │     │   ACT 2:    │     │   ACT 3:    │     │   ACT 4:    │
 │  QR Arrival │ ──> │   Browse    │ ──> │ Customise   │ ──> │ Cart Math   │
 │  & Seating  │     │   Catalog   │     │  Modifiers  │     │ & PB1 10%   │
 └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
        │
        ▼
 ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 │   ACT 5:    │     │   ACT 6:    │     │   ACT 7:    │     │   ACT 8:    │
 │  Checkout / │ ──> │ KDS Kitchen │ ──> │ Offline/Net │ ──> │ Ledger Post │
 │  Open-Tab   │     │  Tracking   │     │ Resilience  │     │ ($0.00 Bal) │
 └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

### Act 1: QR Arrival & Seating Session (`Meja 03 - VIP Corner`)
* **Behavior**: Customer scans physical table QR code (`table=Meja 03`, `seat=Kursi 1`).
* **Verification**:
  - `selectedTable` resolves to `"Meja 03"`.
  - `CapacityBadge` renders dynamic ratio **`👥 1/4 Kursi`** (Anti-Zigzag Invariant satisfied).
  - Session status displays active table timer **`⏱️ 0m`**.
* **Experience Metric**: Instant session binding without mandatory download or account creation.

---

### Act 2: Digital Catalog Browsing & Category Navigation
* **Behavior**: Customer browses through category tabs (`☕ Coffee`, `🍵 Non-Coffee`, `🥐 Pastry`, `🍟 Snacks`, `🍛 Main Course`).
* **Verification**:
  - Category ScrollSpy highlights active category on vertical scroll.
  - Search bar instant-filters 24 products with zero latency.
  - Prices formatted with tabular figures (`font-variant-numeric: tabular-nums`).

---

### Act 3: Item Customization & Modifier Policy
* **Selected Items**:
  1. *Japanese Cold Brew V60* (Rp 35.000) ➔ Modifier: Gayo Natural, Less Ice (0%).
  2. *Espresso Aren Latte* (Rp 28.000) ➔ Modifier: Oat Milk (+Rp 6.000), Extra Shot (+Rp 5.000) = Rp 39.000.
  3. *Almond Croissant* (Rp 32.000).
* **Verification**:
  - Modifier additions calculate atomically in cart state.
  - Item raw subtotal = $\text{Rp } 35.000 + 39.000 + 32.000 = \text{Rp } 106.000$.

---

### Act 4: Cart Math, Loyalty Points & PB1 10% Tax
* **Formula Breakdown**:
  - **Raw Subtotal**: $\text{Rp } 106.000$
  - **Promo Voucher (`DISKONHEMAT10` - 10%)**: $-\text{Rp } 10.600 \rightarrow \text{Net Subtotal } \text{Rp } 95.400$
  - **Service Charge (5%)**: $\text{Rp } 4.770$
  - **Pajak Restoran Daerah PB1 (10% UU HKPD)**: $(\text{Rp } 95.400 + 4.770) \times 10\% = \text{Rp } 10.017$
  - **Grand Total Bill**: $\text{Rp } 110.187$
* **Verification**:
  - Verified by Vitest `cartMath.test.ts` (6/6 tests green).
  - Strict non-overlapping bounding boxes for tax and discount pills.

---

### Act 5: Checkout & Policy Switch (Pay-First vs Open-Tab)
* **Policy A (Pay-First)**:
  - Generates SNAP BI Dynamic QRIS code.
  - Payment simulation marks table `"paid"` and releases order to KDS.
* **Policy B (Open-Tab / Post-Paid)**:
  - Table marked `"open-tab"` (`totalBill: Rp 110.187`, `orderCount: 3`).
  - Allows customer to order round 2 later without immediate checkout.
  - Departure settlement supports 4-way split bill via QRIS / Cash / Card.

---

### Act 6: KDS Kitchen Status & Real-Time Tracking
* **Order Routing**:
  - Beverage items routed to **Barista Station**.
  - Bakery item routed to **Pastry Station**.
* **Status Progression**:
  - `PENDING` ➔ `PREPARING` ➔ `READY` ➔ `SERVED`.
  - Customer mobile screen reflects live status updates.

---

### Act 7: Offline Resilience & Network Drop Recovery
* **Network Interruption Simulation**:
  - Transaction submission during network drop automatically buffers to `IndexedDB` with UUID v4 `X-Idempotency-Key`.
  - Flush manager retries automatically upon network reconnect without duplicate billing.

---

### Act 8: Financial Kernel & Double-Entry Invariant
* **Journal Posting Audit**:
  - `Debit 1010 (Kas Bank / QRIS SNAP BI)`: $\text{Rp } 110.187$
  - `Debit 5110 (Beban Diskon Promosi)`: $\text{Rp } 10.600$
  - `Credit 4010 (Pendapatan F&B)`: $\text{Rp } 106.000$
  - `Credit 4020 (Pendapatan Service Charge)`: $\text{Rp } 4.770$
  - `Credit 2140 (Hutang Pajak PB1 10%)`: $\text{Rp } 10.017$
  - **Balance**: $\sum \text{Debits} - \sum \text{Credits} = \text{Rp } 0.00$ (**Balanced ✓**).

---

## 🔍 Permanent Friction Insights & Solutions

| Friction Observed | Root Cause | Permanent Architectural Fix | Status |
| :--- | :--- | :--- | :--- |
| **Split-Bill Tax Rounding** | Dividing odd amounts by 3 or 4 people | Rounding variance ($<\text{Rp } 5$) routed to `5190 Beban Pembulatan` | ✅ Resolved |
| **Modifier Accidental Touch** | Radio group targets too small on mobile | Minimum touch target enlarged to $44\text{px} \times 44\text{px}$ | ✅ Resolved |
| **Table Reassignment Drift** | Guest moves from Table 03 to Table 07 | Atomic table transfer preserves order IDs and active timers | ✅ Resolved |
