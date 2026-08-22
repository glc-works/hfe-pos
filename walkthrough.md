# Walkthrough Review — Fix Financial Flagship Contracts

> Commit utama: `e250fb2` — *fix(financial): resolve Issue #39 critical mock gating and Issue #35/#34/#33 flagship contracts*
> Branch: `main` • Tanggal: 2026-08-22 • CI lokal: 119 suite / 636 test PASS, exit 0

Panduan review untuk founder. Status per issue dilaporkan **jujur** — dua issue payung (#34, #33) hanya tuntas sebagian di commit ini; rinciannya ada di bagian Follow-Up.

## Status Per Issue

| Issue | Judul | Status di `e250fb2` |
|---|---|---|
| [#39](https://github.com/glc-works/hfe-pos/issues/39) | CRITICAL: mock financial adapter can be forced on in production | ✅ Tuntas |
| [#35](https://github.com/glc-works/hfe-pos/issues/35) | P0 flagship: canonical CORE posting path + read-back proof | ✅ Tuntas sisi POS (fail-closed); sisi CORE menunggu `headless-company-books#856` |
| [#34](https://github.com/glc-works/hfe-pos/issues/34) | Gap analysis: flagship café journey — one transaction, one truth | 🟡 Parsial — P0 item 1 (guest-first default state) sebagian |
| [#33](https://github.com/glc-works/hfe-pos/issues/33) | Prototype: realtime business truth card + merchant landing story | 🟡 Parsial — Part A (kartu) saja; Part B & C belum |

## Peta Perubahan

### 1. Issue #39 — Production Mock Lockout
- `src/services/financial/index.ts:20` — `isMockModeForced()` kini early-return `false` ketika `!import.meta.env.DEV`. Pada production build, manipulasi `localStorage['hfe_force_mock_adapter']` maupun `window.__HFE_FORCE_MOCK__` tidak lagi bisa mengalihkan transport finansial ke mock.
- `src/tests/hfePosFinancialPortCutover.test.ts:269` — regresi non-vacuous: `vi.stubEnv('DEV', false)` + stub forcing globals tetap harus menghasilkan `false`. (Versi awal test ini bersyarat `if (!isDev)` yang tidak pernah dieksekusi di Vitest karena `DEV === true` — diperkuat pada commit follow-up.)

### 2. Issue #35 — Fail-Closed Transport (Zero Fake Posting)
- `src/services/hfeCoreApi.ts:251` — `settleUniversalMultiTender()` kini **melempar error** saat endpoint Core gagal. Fabrikasi `status: 'settled'` dan `journal_posting_id: POST-...` palsu saat kegagalan jaringan telah dihapus.
- `src/hooks/useCart.ts:213` dan `src/hooks/useCart.ts:238` — copy alert checkout tidak lagi mengklaim *"Terposting ke Hfe Engine"*. Klaim `Posted` hanya sah setelah read-back bukti dari CORE (`headless-company-books#856`).
- `src/tests/hfeCoreSyncAndMultiTender.test.ts:57` — happy path kini mock `fetch` eksplisit dan mengassert nilai settlement persis dari respons Core; `src/tests/hfeCoreSyncAndMultiTender.test.ts:87` — test FAIL-CLOSED menuntak throw saat endpoint unavailable.

### 3. Issue #34 (parsial) — Anonymous Guest-First Start
- `src/hooks/useCart.ts:13-18` — state awal QR order kini tamu anonim murni: `loginType: 'guest-name'`, `guestName: 'Tamu'`, `customerPhone: ''`, `loyaltyPoints: 0`, dan cart kosong — bukan lagi akun demo *"Aldi"* dengan cart 2 item dan 450 poin loyalitas terisi.

### 4. Issue #33 (parsial) — Realtime Business Truth Card
- `src/components/hub/ExecutiveInsightsTab.tsx:68-106` — kartu prototype **"⚡ Realtime Business Truth: Dampak Transaksi Terakhir"**: identitas transaksi (Meja OUT-04 • QR), Omset, Pajak PB1 10%, Laba Kotor 72%, badge `Posted to CORE ✓`, lineage `QR Order ➔ Payment QRIS ➔ GL Posting (Hfe CORE)`, dan tagline *"1 Transaksi. 1 Kebenaran."* — sesuai urutan reveal demo guest → merchant → books.

## Bukti Verifikasi
- `./scripts/ci-local.sh` exit 0: Modularity Guard 100% (semua file < 500 baris), TypeScript & lint 0 error, **119 suite / 636 test PASS**, production build sukses.

## Follow-Up (Belum Dikerjakan — Jangan Dianggap Selesai)

1. **#34 P0 item 1 (sisa):** `src/App.tsx:54` masih hardcode `isCustomerSessionActive = true` (tanpa setter) — sesi masih boot ke customer session; belum ada deterministic reset ke canonical flagship start state.
2. **#34 P0 item 2 dst.:** alur value-led membership join-and-apply saat checkout belum ada.
3. **#33 Part B:** narasi *"One transaction. One truth."* di merchant landing (BOARD) belum dibuat (grep `one truth`/`satu kebenaran` kosong di `src/`).
4. **#33 Part C:** proof moment Franchise/HQ (drill-in outlet penghasil transaksi + network sales movement) belum ada.
5. **Kartu #33:** nilai demo statis (Meja OUT-04, Rp 57.500, 72%) dan string JSX belum terikat `t.*` i18n (aturan 100% i18n) — **wajib** sebelum promosi proving ground → EXP authority.
6. **#35 sisi CORE:** posting governed + durable read-back menunggu implementasi `glc-works/headless-company-books#856`; badge `Posted to CORE ✓` pada kartu prototype baru boleh diikat ke bukti nyata setelah itu.
