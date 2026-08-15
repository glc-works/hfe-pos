# ARCHITECTURE.md — Technical Contract for `hfe-pos`

## Overview
`hfe-pos` provides a responsive, offline-first Point of Sale cashier interface and customer QR mobile self-ordering experience that connects strictly via **`Hfe` REST APIs**.

The Experience Layer is completely agnostic to backend subledger storage mechanisms, database engines, or financial kernel internals. It interacts exclusively through published `Hfe` REST API contracts (`/v1/company-books/...`).

## Architectural Layers

1. **Customer & Cashier UI (Presentation Layer):**
   - Customer Smartphone QR Table Self-Ordering Web App (`src/mobile/`).
   - Barista & Cashier Touch POS Station (`src/pos/`).
   - Kitchen Display System (KDS) & ESC/POS Thermal Printer (`src/kds/`).
2. **Offline-First Resilience Buffer (Persistence Layer):**
   - Persists un-synced orders in client `IndexedDB` with SHA-256 integrity checksums during network outages.
   - Automatically flushes buffered sales payloads to `Hfe` REST APIs upon connection recovery.
3. **Hfe REST API Client (Transport Layer):**
   - Product Master API (`GET /v1/company-books/{book}/products`).
   - Contact Master API (`POST /v1/company-books/{book}/contacts`).
   - Transaction & Checkout API (`POST /v1/company-books/{book}/transactions`).

## Strict Boundary Rules
1. **API Abstraction Boundary:** `hfe-pos` must NEVER contain internal backend database code, subledger engine logic, or low-level kernel dependencies. All financial transactions, stock depletions, and tax calculations are processed strictly via `Hfe` REST APIs.
2. **Idempotent Payload Contract:** Every completed checkout payload MUST include a client-generated UUID idempotency key.
