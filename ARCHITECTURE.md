# ARCHITECTURE.md — Technical Contract for `hfe-pos`

## Overview
`hfe-pos` provides a responsive, offline-first Point of Sale cashier interface that connects directly to the `Hfe` Financial Subledger.

## Architectural Layers

1. **Cashier UI & Product Catalog (Presentation Layer):**
   - Quick barcode scan & grid product selection.
   - Real-time cart calculation (PPN 11%/12%, discounts, line totals).
2. **Offline Transaction Buffer (Persistence Layer):**
   - Stores transactions in `IndexedDB` when network connection drops.
   - Auto-syncs buffered sales to `Hfe` backend upon network restoration.
3. **Biller & Payment Split Gateway (Integration Layer):**
   - Instant QRIS & BCA Virtual Account payment modal generation.
   - Biller fee split calculations (e.g. 20% platform share, 80% merchant payout).
4. **Hfe Subledger API Client (Core Transport Layer):**
   - Integrates with `POST /v1/company-books/{book}/transactions` for double-entry subledger posting.

## Binding Rules
1. Every completed checkout MUST record an immutable transaction payload with unique idempotency key.
2. Cashier shift opening and closing balances MUST balance against cash drawer counts (`1010-Cash Bank`).
