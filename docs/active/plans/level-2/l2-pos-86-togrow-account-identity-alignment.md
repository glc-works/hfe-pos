# Level 2 Implementation Plan: L2-POS-86 ToGrow Account Identity Alignment

**Document Status:** Approved  
**Related Issue:** [#38](https://github.com/glc-works/hfe-pos/issues/38)  
**Parent Product Authority:** `glc-works/hfeit-product/product/level-1/identity-federation-entitlements.md`  

---

## 1. Executive Summary & Problem Statement

Saat ini, `hfe-pos` memelihara sistem autentikasi lokal (*bespoke POS-local auth stack*) di `src/hooks/usePosAuth.ts` dan `src/sdk/auth/PosAuthProvider.tsx` (`ownerLogin`, `ownerRegister`, token lokal di `localStorage`). Hal ini melanggar batas kewenangan identitas canonical ekosistem Hfe IT, di mana identitas person/pemilik bisnis **WAJIB bermuara ke ToGrow Account**, bukan membuat otoritas identitas tersendiri di dalam aplikasi kasir.

Rencana ini menyelaraskan arsitektur autentikasi POS dengan memisahkan secara tegas antara **Identitas Orang (ToGrow Account)** dan **Sesi Operasional Kasir/Shift Terminal (Device Shift & PIN Attestation)**.

---

## 2. 5-Tier Canonical Identity & Authorization Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       5-TIER CANONICAL IDENTITY & AUTHORIZATION HIERARCHY                  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  [TIER 1: PERSON IDENTITY]         ➔ ToGrow Account (Single Identity Authority)             │
│                                      (sub, email, phone, avatar, mfa_verified)             │
│                                                                                             │
│  [TIER 2: COMPANY MEMBERSHIP]      ➔ Hfe Company Book Authorization Matrix                 │
│                                      (company_book_id, tenant_id, roles: ['owner','staff'])│
│                                                                                             │
│  [TIER 3: POS TERMINAL REGISTER]   ➔ Device / Workstation Session Identity                  │
│                                      (terminal_id, station_id: 'BAR-01', branch_id)         │
│                                                                                             │
│  [TIER 4: CASHIER SHIFT SESSION]   ➔ Terminal Operational Attestation                       │
│                                      (cashier_shift_id, active_staff_id, 4-digit PIN gate)  │
│                                                                                             │
│  [TIER 5: FINANCIAL TRUTH]         ➔ Hfe CORE Posting Service with Authority Context        │
│                                      (X-CBook-Authority-Context, Idempotency-Key)           │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Boundary Rules & Invariants

1. **Zero Bespoke Auth Stacks**: POS dilarang keras membuat sistem registrasi email/password sendiri. Seluruh login pemilik dan pendaftaran akun bisnis dialihkan ke ToGrow Account.
2. **Terminal PIN is Not Person Identity**: Kode PIN 4-digit kasir adalah *terminal shift attestation* lokal untuk perpindahan antar barista/kasir di satu iPad, bukan identitas akun global.
3. **Session-Scoped Storage**: Token autentikasi personal disimpan dalam `sessionStorage` yang kedaluwarsa saat tab/sesi browser ditutup, tidak dibiarkan sebagai objek JSON mentah yang rentan di `localStorage`.
4. **Fail-Closed on Session Expiry**: Jika sesi ToGrow Account habis masa berlakunya (*expired/revoked*), mutasi pembukuan dan mutasi kas otomatis ditolak dengan pesan kesalahan yang jelas (*clear & bounded error*).

---

## 4. Rencana Perubahan Komponen

### A. Refactoring `src/hooks/usePosAuth.ts` & `src/types/auth.ts`
- Tambahkan interface `ToGrowPersonProfile` (`id`, `email`, `displayName`, `avatarUrl`, `isToGrowAuthenticated`).
- Pisahkan state `toGrowSession` (Personal Owner/Manager) dari `cashierShiftSession` (Terminal Operational).
- Hapus fungsi mock registrasi lokal (`ownerRegister`, `forgotPassword`).

### B. Penyederhanaan `PosAuthLoginView.tsx` & `PosAuthProvider.tsx`
- Sediakan tombol delegasi resmi: `[ 🔑 Masuk dengan ToGrow Account ]`.
- Sediakan mode cepat kasir: `[ 🔢 Masuk Cepat dengan PIN Kasir ]` untuk staf yang sudah terdaftar di Company Book.

### C. Pembuatan Unit Test Suite Baru
- Buat `src/tests/toGrowAccountIdentityAlignment.test.ts` untuk memverifikasi pemisahan identitas 5-tier, penolakan token palsu, dan manajemen cooldown PIN.

---

## 5. Verification Plan

1. **Automated Unit Tests**:
   - `npx vitest run src/tests/toGrowAccountIdentityAlignment.test.ts` $\rightarrow$ 100% Pass.
2. **Local CI Pipeline**:
   - `./scripts/ci-local.sh` $\rightarrow$ 8/8 Stage Passed.
3. **E2E & Playwright Verification**:
   - `npm run test:e2e` $\rightarrow$ Semua 8 test suites lulus tanpa regresi visual.
