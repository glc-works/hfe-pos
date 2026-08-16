---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Offline-First IndexedDB Resilience Buffer & SHA-256 Flush Manager
description: Experience Layer resilience framework for buffering un-synced POS transactions in client IndexedDB with SHA-256 integrity checksums and automatic flush queue recovery upon network restoration.
tags: [plan, level-1, pos, offline-first, indexeddb, integrity-checksum, resilience]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Offline-First IndexedDB Resilience Buffer & SHA-256 Flush Manager

## 1. Domain Outcome
Delivers a bulletproof **Offline-First Resilience Framework** for `hfe-pos` ensuring that cashier transactions, open tab orders, and customer QR checkouts are never lost during peak cafe hours when internet connectivity is interrupted.

When HCB REST APIs are offline or unreachable, completed checkouts are instantly serialized and persisted in client-side **IndexedDB** (`hfe_pos_offline_db`) with SHA-256 integrity checksums. Once network connectivity is restored, the buffer queue automatically flushes all pending transactions idempotently to `POST /v1/company-books/{book}/transactions` using exponential backoff retry management.

---

## 2. Capability Scope

### A. Persistent Client IndexedDB Storage (`hfe_pos_offline_db`)
- **Store 1 — `unSyncedTransactions`**: Stores full JSON transaction payloads, client timestamp, cashier ID, and SHA-256 integrity hash.
- **Store 2 — `masterDataCache`**: Local cache of Product Catalog, Contact Master, and Price List for offline menu rendering.

### B. SHA-256 Integrity Checksum & Tamper Protection
- **Checksum Hash Generation**: Every offline transaction payload generates a Web Crypto API SHA-256 hash string (`crypto.subtle.digest('SHA-256', payload)`).
- **Tamper Inspection**: Before flushing to HCB Core, the SHA-256 hash is re-calculated. Tampered or corrupted payloads are quarantined in `quarantinedTransactions` store with error logging.

### C. Connection Recovery & Flush Manager (`FlushManager`)
- **Network Listener**: Listens to browser `online`/`offline` events and polls HCB health ping endpoint (`GET /v1/company-books/{book}/health`).
- **Idempotent Queue Flushing**: Flushes pending checkouts sequentially while preserving original client-generated `X-Idempotency-Key` (UUID v4) headers.
- **Exponential Backoff**: Manages network retries (1s ➔ 2s ➔ 4s ➔ 8s ➔ max 30s) to prevent server overload upon connection restoration.

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-08-offline-indexeddb-resilience-buffer.md`

---

## 4. Verification & Acceptance Criteria
- Disabling network in browser DevTools allows cashiers to continue placing orders without UI blocking.
- Inspecting `IndexedDB` shows transaction record with valid 64-character hex SHA-256 checksum string.
- Re-enabling network flushes all pending checkouts to HCB Core REST API with 0 duplicate ledger postings.
