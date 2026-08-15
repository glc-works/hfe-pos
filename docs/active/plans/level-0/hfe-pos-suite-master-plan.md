---
okf_version: "0.2"
type: Strategic Plan Level 0
title: Hfe POS & Commerce Suite — Experience Layer Master Plan
description: Master product vision and architectural blueprint for the Hfe POS & Commerce Suite experience layer, delivering a responsive, offline-first cashier interface powered by the Hfe Headless Financial Engine.
tags: [master-plan, level-0, pos, cashier-experience, hfe-connect, frontend-suite]
status: Proposed
---

# Level 0 Strategic Plan: Hfe POS & Commerce Suite (Experience Layer)

## 1. Executive Summary & Vision

The **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) is the dedicated **Cashier & Retail Experience Layer** designed to interface directly with the **Headless Company Books (`Hfe`)** core engine.

Because `Hfe` owns all subledger journal postings, TigerBeetle double-entry invariants, tax calculations, and biller revenue sharing, `hfe-pos` focuses **100% on Cashier UX Excellence**:
- Sub-millisecond touchscreen cart responsiveness & hardware barcode scanning.
- Complete offline-first resilience with local transaction buffering (`IndexedDB`).
- Seamless cashier checkout experiences supporting QRIS, Virtual Account modals, and cash drawer shift reconciliations.

---

## 2. Strategic Experience Pillars (Level 1 Domain Mapping)

```
                 ┌─────────────────────────────────────────────────────────────┐
                 │       Hfe POS Suite — Cashier Experience Layer (L0)         │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
         ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
         │                      │                               │                      │
┌────────▼─────────────┐ ┌──────▼──────────────┐       ┌────────▼─────────────┐ ┌──────▼──────────────┐
│ L1-01: Cashier & Cart│ │ L1-02: Offline-First│       │ L1-03: Dynamic Payment│ │ L1-04: Cash Shift    │
│ Touch Experience     │ │ Client Sync Buffer  │       │ Checkout Modals      │ │ Drawer Reconciliation│
└──────────────────────┘ └─────────────────────┘       └──────────────────────┘ └──────────────────────┘
                                 │
                                 ▼ (Delegates Subledger & Ledger Postings)
                 ┌─────────────────────────────────────────────────────────────┐
                 │             Hfe Headless Financial Engine Core               │
                 └─────────────────────────────────────────────────────────────┘
```

### Pillar 1: Touchscreen Cashier & Cart UX (`L1-01`)
- Fast hardware barcode scanner listener (<10ms item insertion).
- Touch-optimized cart layout (item search, line item discounts, quantity adjustments, tax preview).
- Thermal receipt preview and direct browser ESC/POS printing.

### Pillar 2: Offline-First Client Sync Buffer (`L1-02`)
- Zero-downtime sales processing during internet disconnects.
- Local cryptographic payload persistence in `IndexedDB` with SHA-256 integrity checksums.
- Background sync manager pushing buffered sales to `Hfe` API upon network recovery.

### Pillar 3: Dynamic Payment Checkout Modals (`L1-03`)
- Dynamic ASPI QRIS code display modal with real-time WebSocket payment completion alerts.
- Cashier Virtual Account payment modal for instant customer checkout.
- Multi-pay splitting (e.g. partial cash + partial QRIS).

### Pillar 4: Cash Drawer & Shift Reconciliation UX (`L1-04`)
- Cashier shift opening and closing cash float verification (`1010-Cash Drawer`).
- Cash drawer overage/shortage variance input modal.
- End-of-shift cash drawer balance report generation.

---

## 3. Delegation Boundary — Engine vs Experience Layer

| Concern | `hfe-pos` (Experience Layer) | `Hfe` Core (Financial Engine) |
|---|---|---|
| **Cashier Touchscreen & Barcode Scan** | ✅ Owns UI & Keyboard Listener | ❌ Not concerned |
| **Offline Cart State & Local Storage** | ✅ Persists in `IndexedDB` | ❌ Not concerned |
| **Double-Entry Journal & Subledger** | ❌ Sends REST payload | ✅ Owns TigerBeetle posting |
| **Tax Calculation (PPN Kode 01/08)** | 👁️ Pre-calculates preview | ✅ Enforces DJP XML & ledger rules |
| **Biller Fee Split (20% / 80%)** | 👁️ Displays split breakdown | ✅ Executes money routing & ledger split |

---

## 4. Verification & Quality Standards

- **Touch Responsiveness:** Cart item addition < 50ms per scan.
- **Offline Resilience:** 100% data persistence test (browser crash recovery during offline sale).
- **Hfe API Compliance:** All outbound payloads must match `Hfe` OpenAPI specifications.
