---
okf_version: "0.2"
type: Development Plan Level 2
title: IndexedDB Storage Adapter, SHA-256 Checksum & Offline Flush Manager
description: Implements IndexedDB persistent storage adapter, Web Crypto SHA-256 payload integrity hasher, online/offline network listener, and exponential backoff retry flush manager for hfe-pos.
tags: [development-plan, level-2, indexeddb, offline-buffer, sha256-checksum, flush-manager]
parent_level_1: l1-06-offline-indexeddb-resilience-buffer
github_issue: 8
status: Proposed
---

# Level 2 Implementation Plan: IndexedDB Storage Adapter, SHA-256 Checksum & Offline Flush Manager

## 1. Outcome
Delivers the Offline-First Storage & Network Resilience module (`src/services/offlineStorage.ts` & `src/services/flushManager.ts`) enabling `hfe-pos` to store offline transactions in IndexedDB with SHA-256 integrity checksums and automatically flush them to HCB REST APIs upon connection recovery per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: IndexedDB Storage Adapter (`src/services/offlineStorage.ts`)
- Implement lightweight IndexedDB wrapper using browser native IDB API (`hfe_pos_offline_db` v1):
  - Object Store `unSyncedTransactions` (Key: `idempotencyKey`).
  - Object Store `masterDataCache` (Key: `cacheKey`).
  - Methods: `saveOfflineTransaction()`, `getPendingTransactions()`, `removeSyncedTransaction()`, `cacheMasterData()`, `getทุกMasterData()`.

### Phase B: Web Crypto SHA-256 Integrity Hasher (`src/utils/cryptoHasher.ts`)
- Implement `generatePayloadChecksum(payload: object): Promise<string>` using `crypto.subtle.digest('SHA-256', ...)`:
  - Generates 64-character hex checksum string for payload integrity verification.
  - Verification method `verifyPayloadIntegrity(payload: object, expectedHash: string): Promise<boolean>`.

### Phase C: Exponential Backoff Flush Manager (`src/services/flushManager.ts`)
- Implement `FlushManager` class:
  - Listens to `window.addEventListener('online')` and `window.addEventListener('offline')`.
  - Background polling timer checking `GET /v1/company-books/{book}/health` every 15 seconds.
  - Flush queue execution: iterates over `getPendingTransactions()`, re-verifies SHA-256 hash, and calls `submitTransaction()` with original `X-Idempotency-Key` (UUID v4).
  - Exponential backoff retry logic (1s ➔ 2s ➔ 4s ➔ 8s ➔ max 30s) on server 5xx errors.

### Phase D: Offline Indicator Component (`src/components/common/OfflineStatusBanner.tsx`)
- UI banner displaying offline mode notification, pending un-synced transactions count badge (e.g. "⚡ 3 Transaksi Offline Tersimpan"), and manual "Flush Sekarang" button.

### Phase E: Vitest Unit Tests (`src/tests/offlineBuffer.test.ts`)
- Test cases:
  - Verifies SHA-256 hash generation and tamper detection.
  - Verifies IndexedDB CRUD operations.
  - Verifies retry backoff calculations.

## 3. Explicit Exclusions
- Does not modify HCB Core server-side database; operates entirely in browser client-side storage and REST transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/services/` and `src/components/` remain under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
