# Level 2 Implementation Plan: L2-POS-87 Admin Mode (Multi-Merchant & User RBAC Management Hub)

## 1. Metadata
- **Plan ID**: `L2-POS-87`
- **Title**: Admin Mode (Multi-Merchant & User RBAC Management Hub)
- **Status**: `In-Progress`
- **Owner**: `Agent Antigravity`
- **Scope**: `glc-works/hfe-pos`
- **Standard**: `POS-ENG-STD-001`, `HFE-UI-STD-001`, `HFE-OMBOK-STD-001`

---

## 2. Executive Summary & Problem Statement
Operasional multi-tenant di `hfe-pos` membutuhkan antarmuka administrasi platform terdedikasi untuk mengelola siklus hidup merchant (tenancy, kuota outlet, paket langganan SaaS, dan fitur toko) serta tata kelola pengguna/staf toko (Role-Based Access Control, pembuatan/reset 6-digit PIN kasir, dan penugasan cabang).

Sesuai aturan arsitektur, antarmuka Admin ini dibangun **di dalam repositori `hfe-pos` namun terpisah secara modular (*domain-decoupled*)** tanpa mencemari logika kasir atau keranjang belanja.

---

## 3. Architecture & Domain Separation
```text
src/
├── types/
│   └── admin.ts                       <-- Tipe data khusus Admin, Merchant, & User
├── components/admin/                  <-- Komponen presentasional terisolasi
│   ├── MerchantListSection.tsx        <-- Tabel & Grid Merchant (Tier, Subdomain)
│   ├── UserRbacSection.tsx            <-- Roster Staf, Role RBAC & 6-Digit PIN
│   ├── MerchantDetailModal.tsx        <-- Edit Paket Langganan & Toggle Fitur Toko
│   └── InviteUserModal.tsx            <-- Form Pendaftaran Staf Baru via WA/Email
├── views/admin/                       <-- Smart View Terisolasi
│   └── AdminMerchantUserView.tsx      <-- Master View Admin Hub
├── tests/
│   └── adminMerchantAndUserManagement.test.ts <-- Unit Test Suite
└── stories/admin/
    └── AdminMerchantUserView.stories.tsx      <-- Storybook 4-Quadrant Visual Suite
```

---

## 4. Verification Criteria
- [x] Modularity Guard (<500 lines per file).
- [x] Typecheck clean (`npx tsc --noEmit`).
- [x] Unit test suite (`adminMerchantAndUserManagement.test.ts`) 100% pass.
- [x] Playwright Storybook crawler 100% pass.
- [x] Production build success.
