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

## 2. Strict Boundary Rules

1. **API Abstraction Boundary:** `hfe-pos` must **NEVER** contain internal backend database code, subledger engine logic, direct SQL, or low-level kernel dependencies. All financial transactions, stock depletions, and tax calculations are processed strictly via `Hfe` REST APIs.
2. **Idempotent Payload Contract:** Every completed transaction payload submitted to `POST /v1/company-books/{book}/transactions` **MUST** include a client-generated UUID v4 header (`X-Idempotency-Key`). Retries from network dropouts or cashier double-taps must reuse the exact same idempotency key to prevent double posting.
3. **Modularity Constraint:** No hand-maintained TS/TSX file in `src/` may exceed 500 lines of code (`scripts/check-modularity.py`).
4. **Financial Precision:** Money calculations must use integer IDR precision (`Math.round()`) to avoid floating-point rounding errors.

---

## 3. Financial & Tax Calculation Protocol

### PB1 Cafe Tax Calculation Modes:
- **Mode 0 (Disabled):** `taxAmount = 0`
- **Mode 1 (Exclude Tax):** `taxAmount = Math.round(subtotal * 0.10)`
- **Mode 2 (Include Tax):** `taxAmount = Math.round(subtotal - (subtotal / 1.10))`

### Service Fee Calculation:
- `serviceFeeAmount = Math.round(subtotal * (serviceFeeRate / 100))` (Default: 5%)

### Biller Split Settlement:
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
