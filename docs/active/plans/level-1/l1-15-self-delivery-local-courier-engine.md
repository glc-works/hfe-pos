---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Self-Delivery & Local Store Courier Engine (Delivery Toko Sendiri Radius Sekitar)
description: Strategic plan for zero-commission local store self-delivery fulfilled by internal store staff/runners, featuring customer address delivery input, staff runner dispatch assignment, and automated WhatsApp delivery tracking alerts via HCB REST APIs.
tags: [plan, level-1, pos, self-delivery, local-courier, runner-dispatch, whatsapp-tracking]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Self-Delivery & Local Store Courier Engine

## 1. Domain Outcome
Expands the **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) to support **Zero-Commission Self-Delivery (Delivery Toko Sendiri)** for neighborhood customers, residential complexes, and office towers within a 1-5 KM radius.

Merchants eliminate high 20-30% third-party aggregator commissions by assigning internal store runners (e.g. Budi the Runner), capturing delivery addresses, calculating flat/distance-based delivery fees, and sending automated WhatsApp delivery tracking links resolved through HCB Core REST APIs (`/v1/deliveries`).

---

## 2. Capability Scope

```
 🛵 SELF-DELIVERY OPERATIONAL LIFECYCLE
 ├─ 📍 1. Order Entry (Select "Kurir Toko", Address, Delivery Notes, Delivery Fee Rp 5.000)
 ├─ 🍱 2. Kitchen Packing (KDS Packaging chit printer tag)
 ├─ 🚚 3. Staff Runner Dispatch (Assign available store runner: Budi)
 ├─ 📱 4. WhatsApp In-Transit Alert ("Halo Kak Aldi, pesanan sedang diantar oleh Budi")
 └─ ✅ 5. Delivery Confirmation (COD Cash Collection / QRIS Verification ➔ Status `Delivered`)
```

### Pillar A: Customer Delivery Checkout Experience
1. **Fulfillment Mode Selector**: Customer selects `Dine-In`, `Takeaway`, or `Kurir Toko (Delivery Sekitar)`.
2. **Delivery Address & Notes**: Input street address, block/unit number, landmark notes (*"Titip di satpam pos depan"*), and WhatsApp contact.
3. **Delivery Fee Calculation**: Flat fee (e.g. Rp 5.000) OR free delivery threshold (e.g. Free for orders > Rp 50.000).

### Pillar B: Pluggable Delivery Provider Adapter Architecture (`useSelfDelivery.ts`)

```
 🛵 HFE POS PLUGGABLE DELIVERY PROVIDER ARCHITECTURE
 ├─ 🏃 1. Internal Store Runner (Staf Kurir Toko Sendiri - Gratis Komisi 0%)
 ├─ 🛵 2. 3PL Express Courier Adapters (GoSend, GrabExpress, Lalamove, Paxel, Borzo)
 └─ 🎛️ 3. Dynamic Provider Switcher (Manual Selector OR Auto-Fallback by Distance/Radius)
```

1. **Provider Type Interface**: Supports `internal_runner`, `gosend`, `grabexpress`, `lalamove`, `paxel`, and generic `third_party_aggregate`.
2. **Dynamic Provider Selection**: Store owner can set the default provider (e.g. Internal Runner for 0-3 KM, GoSend/GrabExpress for > 3 KM).
3. **Unified Tracking Webhook Interface**: Standardized status updates across all providers (`dispatched` ➔ `driver_assigned` ➔ `in_transit` ➔ `delivered`).

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-18-local-courier-dispatch-self-delivery-engine.md`

---

## 4. Verification & Acceptance Criteria
- Order checkout with `self_delivery` calculates subtotal + delivery fee correctly in `cartMath.ts`.
- Dispatching runner updates delivery ticket status to `In-Transit` in `< 100ms`.
- Runner completing delivery records COD cash in shift float reconciliation.
