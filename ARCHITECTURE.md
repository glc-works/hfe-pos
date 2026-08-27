# ARCHITECTURE.md — Technical Contract for `hfe-pos`

> **Version:** 1.0.0  
> **Status:** Active Normative Contract  
> **Governing Standard:** `docs/active/standards/POS-ENG-STD-001.md`

---

## 1. System Overview & Layering

`hfe-pos` provides a responsive, offline-first Point of Sale cashier interface, barista touch station, kitchen display system (KDS), and customer smartphone QR table self-ordering experience that connects strictly via **`Hfe` REST APIs**.

The Experience Layer is completely agnostic to backend subledger storage mechanisms, database engines, or financial kernel internals. It interacts exclusively through published `Hfe` REST API contracts (`http://localhost:8080/v1/company-books/{book}/...`).

```
+-------------------------------------------------------------------------+
|                  Customer & Cashier Presentation Layer                  |
|  - Customer Smartphone QR Web App (src/views/CustomerMobileView.tsx)    |
|  - Barista & Cashier Touch POS (src/views/BaristaPosView.tsx)           |
|  - Kitchen Display System (KDS) (src/views/KdsKanbanView.tsx)           |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    Offline Resilience & Local State                     |
|  - Custom React State Hooks (src/hooks/useCart.ts, useTableState.ts)    |
|  - Client IndexedDB Buffer with SHA-256 integrity checksums             |
+-------------------------------------------------------------------------+
                                     |
                                     v (Hfe REST API Transport Layer)
+-------------------------------------------------------------------------+
|                      Hfe Core REST API Endpoints                        |
|  - Product Catalog:  GET  /v1/company-books/{book}/products             |
|  - Contact Master:   POST /v1/company-books/{book}/contacts             |
|  - Transactions:     POST /v1/company-books/{book}/transactions         |
|  - Loyalty & Perks:  GET  /v1/company-books/{book}/contacts/{id}/loyalty |
|  - Voucher Claim:    POST /v1/loyalty/vouchers/claim                   |
+-------------------------------------------------------------------------+
```

---

## 2. Core Design Principles: Mobile-First, Tablet-Second & Touch Performance Priority

1. **Mobile Viewport Primary Focus (Primary Target):** All 3 surface interfaces (**Customer QR Mobile Self-Ordering**, **Barista Touch POS**, and **Kitchen KDS Kanban**) are engineered with **Mobile Viewport (360px – 430px width)** as the primary target. Components, drawers, bottom sheets, and catalog grids are optimized for single-thumb touch ergonomics.
2. **Tablet Experience Second (Secondary Option):** Interfaces expand fluidly to tablet displays (768px – 1024px width) without layout breaking, horizontal scrolling, or broken touch targets.
3. **Touch & Performance Priority Principle:**
   - **Touch Response Latency:** `< 30ms` instant tactile feedback on touch/tap events.
   - **60fps Smooth Transitions:** Zero cumulative layout shifts (CLS = 0) and smooth 60fps animations.
   - **Lightweight Core Bundle:** Core JS bundle footprint strictly `< 150KB gzip` for instant load on low-end smartphone devices.

## 3. Strict Boundary Rules

1. **API Abstraction Boundary:** `hfe-pos` must **NEVER** contain internal backend database code, subledger engine logic, direct SQL, or low-level kernel dependencies. All financial transactions, stock depletions, and tax calculations are processed strictly via `Hfe` REST APIs.
2. **Idempotent Payload Contract:** Every completed transaction payload submitted to `POST /v1/company-books/{book}/transactions` **MUST** include a client-generated UUID v4 header (`X-Idempotency-Key`). Retries from network dropouts or cashier double-taps must reuse the exact same idempotency key to prevent double posting.
3. **Modularity Constraint:** No hand-maintained TS/TSX file in `src/` may exceed 500 lines of code (`scripts/check-modularity.py`).
4. **Financial Precision:** Money calculations must use integer IDR precision (`Math.round()`) to avoid floating-point rounding errors.
5. **Single Source of Truth (SSOT) Everywhere & Zero State Drift:** All business configurations (Payment Policy, Theme Tokens, Custom Vaults, Domain Apps, Viewports) must be managed through one authoritative single-door Context (`useMerchantConfig()`). DevTools and debug overlays act strictly as ergonomic shortcut callers and must never maintain duplicate, isolated, or shadow states.
6. **Primary Pilot Consumer & Engine Purity Invariant:** `hfe-pos` acts as the primary pilot consumer for `headless-company-books` (Hfe Core). Any missing capabilities, gaps, or feedback discovered during POS frontline operations must be abstracted into universal, industry-agnostic double-entry financial primitives (e.g. `cost_center_id`, generic `metadata`, `Bill of Materials`, `Accounts Receivable`) before submitting enhancements to Hfe Core. Industry-specific domain leakage into core accounting tables is strictly forbidden.
7. **Pure Viewport App Shell (`100dvh`) & Single Scroll Owner Invariant:** The root application layout must strictly use `h-[100dvh] w-full flex flex-col overflow-hidden`. In both standalone production and dev simulator modes, each view contains exactly ONE designated scroll owner (`<main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">`). Ancestor layout wrappers must never maintain competing `overflow-y-auto` layers that cause scroll-trapping or sticky header displacement.

---

## Financial and Tax Authority Protocol

In connected mode, HFE POS submits governed identities, quantities, modifiers,
promotion intent, and tender intent. Hfe CORE is the sole authority for price,
discount/funding allocation, tax/PB1, service charge, rounding, amount due,
semantic accounts, and Posting outcome. The cashier must review the exact CORE
quote revision and digest before acceptance; HFE POS must not recalculate or
override a returned monetary component.

The PB1 and service-fee formulas below apply only to explicit local synthetic
simulation. Simulation output is non-authoritative and must never be serialized
into a connected mutation.

### PB1 Cafe Tax Calculation Modes (Simulation Only):
- **Mode 0 (Disabled):** `taxAmount = 0`
- **Mode 1 (Exclude Tax):** `taxAmount = Math.round(subtotal * 0.10)`
- **Mode 2 (Include Tax):** `taxAmount = Math.round(subtotal - (subtotal / 1.10))`

### Service Fee Calculation (Simulation Only):
- `serviceFeeAmount = Math.round(subtotal * (serviceFeeRate / 100))` (Default: 5%)

### Biller Split Settlement (Simulation Only):
- Transaction fee Rp 250 per transaction for split biller settlement (`biller.create_split`).

---

## 4. Offline Resilience Buffer State Machine

```
   Network Online
         │
         ▼
   Submit Checkout ──(Network Drops)──► Buffer in IndexedDB
         │                                    │
   201 Created                                │ (SHA-256 Checksum Logged)
         │                                    ▼
   Store Receipt ◄──(Network Restored)── Flush Queue via REST
```

During network outages, un-synced order payloads are buffered in client `IndexedDB` with SHA-256 integrity checksums. Upon reconnection, the buffer queue flushes idempotently to `Hfe` REST APIs.
