---
okf_version: "0.2"
type: Development Plan Level 2
title: "Production Truth Hardening — connected settlement e2e, offline requalification, and required checks"
description: "Close the three remaining production-readiness gaps in order: (1) wire the real-money settlement round-trip and first live-core activation proof, (2) adversarially requalify the offline stack, (3) enforce required status checks on main, then batch-wire hub surfaces to live CORE data."
tags: [development-plan, level-2, production-readiness, financial-truth, offline, ci]
parent_level_1: l1-pos-storefront
github_issue: 35
status: Approved
---

# Level 2 Implementation Plan: L2-POS-92 — Production Truth Hardening

## 0. Session Goal (one line for /goal)

> Tutup jalan-uang nyata: implement settlement connected-mode POS→CORE→read-back→live-core dengan e2e staging bukti, re-kualifikasi offline stack secara adversarial, lalu kunci main dengan required status checks.

## 1. Outcome

`hfe-pos` berubah dari **demo-yang-jujur** menjadi **siap menerima uang sungguhan**: satu perjalanan checkout tersambung penuh yang membuktikan order → posting CORE → read-back `applied` → badge `LIVE • Verified Core`, offline queue yang tuntas diuji chaos, dan main yang tidak bisa lagi menerima commit tanpa gerbang CI.

Peta fondasi yang WAJIB dipakai (jangan dibangun ulang):

| Fondasi | Lokasi | Status |
|---|---|---|
| Governed CORE posting | `headless-company-books#856` | ✅ closed |
| Read-back validator fail-closed | `src/services/financial/HfePostingReadbackValidator.ts` (L2-POS-91) | ✅ teruji |
| Jembatan aktivasi | `src/services/financial/liveCoreActivation.ts` + `useLiveCoreActivation()` (`b9d9b95`) | ✅ teruji, nol pemanggil runtime |
| Kanal kebenaran SSOT | `DataTruthContext` + `TruthChannelBadge` + CI Step 10 (`75f73d5`) | ✅ |

Fakta audit kunci: `port.submitRetailTransaction` saat ini **nol pemanggil runtime** — fase 1 adalah pekerjaan pertama yang benar-benar mengalirkan uang.

## 2. Phase 1 — Connected Settlement Round-Trip (#35)

Implement alur connected-mode di belakang `VITE_HFE_CORE_URL` (+ runtime contract check yang sudah ada):

```
checkout settle
 → port.submitRetailTransaction(payload)            // X-Idempotency-Key wajib
 → fetch raw posting by id                          // read-back
 → HfePostingReadbackValidator.validate(expectedCtx, raw)
 → useLiveCoreActivation(validation, posting.id)    // GAGAL = throw → Dead-Letter drawer, kanal tetap demo/pending
 → UI menampilkan LIVE hanya dari rantai ini
```

Aturan keras:
- Tidak boleh menyentuh jalur simulasi QR/alert; dua dunia tetap terpisah.
- Kegagalan di titik mana pun bersifat fail-closed yang sama dengan transport sekarang (zero fake success).
- Idempotency disimpan bersama antrean offline supaya retry jaringan tidak double-posting.

Acceptance:
- [ ] Satu e2e Playwright connected-mode (pola `test:connected-auth`) yang mengklaim badge live HANYA setelah rantai penuh, dan tetap demo bila CORE dimatikan di tengah jalan.
- [ ] Unit: setiap cabang validator memetakan ke throw/proof sesuai kontrak bridge.
- [ ] `ci-local.sh` 10 langkah hijau; issue #35 diberi komentar bukti + close.

## 3. Phase 2 — Offline Requalification (#61)

Adversarial suite untuk stack yang sudah ada (`offlineStorage.ts`, `OfflineIntentQueue`, `navigator.storage.persist()`, `beforeunload` guard):
- [ ] Putus koneksi saat QRIS mid-settlement → pesanan sah tetap terkirim saat pulih, zero duplikat (idempotency terbukti).
- [ ] Dua perangkat menjual SKU sama simultan offline → konflik stok masuk GL Selisih (Rule 19), bukan pembatalan uang pelanggan.
- [ ] Dead-Letter & Conflict Resolution Drawer menerima kasus ambigu + ekspor JSON/CSV berfungsi.
- [ ] Eviction test: tab ditabrak + storage penuh → data mutasi tak hilang.

Bench-mark: standar chaos-checkout Toast/Square.

## 4. Phase 3 — Required Status Checks (#52)

Ruleset GitHub siap-aplikasi (detail final di komentar #52): PR ke `main` wajib lolos job CI kanonik; push langsung diblokir. Terapkan SAAT KOORDINASI aman — ada beberapa sesi agent paralel yang masih push langsung; jatuhkan di momen papan PR kosong atau setelah difinalkan founder. Acceptance: ruleset aktif + 1 PR percobaan terbukti terblokir saat CI merah.

## 5. Phase 4 — Live-Wiring Batch (#85–#88, #44)

Dengan Phase 1 hidup, sambungkan tiap surface ke sumber CORE nyata ATAU flag-OFF di build produksi (dua pilihan keras, tanpa mode ketiga): reconciliation, eliminasi inter-company, financial gauge, go-live readiness, truth card event-level.

## 6. Verification Loop Wajib per Fase

`./scripts/ci-local.sh` exit 0 (10 langkah) + bukti visual/e2e spesifik fase + komentar status jujur di issue terkait sebelum lanjut fase berikutnya.
