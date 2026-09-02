---
okf_version: "0.2"
type: Development Plan Level 2
title: Universal Service Economy, Appointment Booking & Event Ticketing Commerce Engine (L2-POS-46)
description: Expands Hfe POS beyond traditional retail/FnB into the modern service economy (Lawyers, Personal Trainers, Auto Detailing/Car Wash, Workshops/Repair, Clinics, Event Ticketing, and Workshop Classes) using universal commerce primitives.
tags: [development-plan, level-2, service-economy, booking, work-order, appointments, event-ticketing, universal-commerce, hfe-pos]
parent_level_1: l1-27-universal-service-commerce-and-booking
github_issue: 46
status: Implemented
---

> **AUTHORITY NOTE (2026-09-02):** Semantics here are pending extraction into Product Canon (glc-works/hfeit-product). Until extracted, Product Canon wins any conflict. This file is implementation coordination only.
> The "Outcome & Specification Authority" claim over other repositories (including headless-company-books) is withdrawn: CORE owns product truth; this file coordinates implementation only.


# Level 2 Implementation Plan: Universal Service Economy, Appointment Booking & Event Ticketing Engine (L2-POS-46)

## 1. Outcome & Specification Authority
This specification codifies the expansion of `hfe-pos` and `headless-company-books` into a **Universal Commerce, Booking & Event Ticketing Suite** serving both traditional retail/F&B and the modern service economy:
- ⚖️ **Lawyers & Legal Consultations:** Billable hours, retainer packages, consultation room bookings.
- 🏋️ **Personal Trainers & Fitness Studios:** 1-on-1 coaching packages, boot camp class bookings.
- 🚗 **Car Wash & Auto Detailing:** Washing bay occupancy, chemical inventory depletion, subscription fleet washing.
- 🔧 **Auto / Motorcycle Repair Workshops:** Job-card work-orders, mechanic labor jasa + sparepart BOM.
- 🩺 **Clinics & Wellness Spas:** Appointment schedule, practitioner assignment, treatment rooms.
- 🎟️ **Event Ticketing & Workshop Masterclasses:** Paid/Free tickets, quota tracking, instant QRIS settlement, e-ticket issuance with QR barcode, and 1-tap WhatsApp delivery.
- 🏷️ **Promotion & Coupon Voucher Gateway:** 1-tap coupon copying with minimum spend gating and instant application at checkout.

---

## 2. Mathematical Domain Abstraction Matrix (Rule #12 Compliance)

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ UNIVERSAL PRIMITIVE     │ F&B & RESTAURANT        │ AUTO WORKSHOP / CUCI    │ LAWYER / PT / CLINIC    │
├─────────────────────────┼─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ 1. Sellable Item (SKU)  │ Makanan & Minuman       │ Jasa Cuci / Servis Oli  │ Billable Hour / Sesi PT │
│ 2. Spatial Resource     │ Meja (Table 1-20)       │ Bay Cuci / Stall Lift   │ Ruang Konsultasi / Bed  │
│ 3. BOM & Depletion      │ Biji Kopi, Susu, Sirup  │ Oli Mesin, Busi, Shampo │ Waktu Staff + Suplemen  │
│ 4. Kitchen / Dispatch   │ KDS Dapur (Hot/Cold)    │ Job-Card KDS Mekanik    │ Task Board / Antrian Dr │
│ 5. Session State        │ Open-Tab / Running Bill │ Work-Order Pengerjaan   │ Retainer / Paket Sesi   │
│ 6. Landing Page Hub     │ Brand Story & Promo Hub │ Booking Jadwal Servis   │ Profil Lawyer / Book PT │
│ 7. Event & Class        │ Cupping Masterclass     │ Coaching Clinic Mobil   │ Seminar Hukum / Yoga    │
│ 8. Accounting Ledger    │ Kasir ➔ HPP ➔ PB1       │ Kasir ➔ Jasa ➔ PPN      │ Piutang ➔ Jasa ➔ Tiket  │
└─────────────────────────┴─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 3. Implemented Components & Code Artifacts

### 3.1. Types & Data Structures (`src/types/pos.ts`)
- `EventTicketItem`: Definition of event/class with category, date, location, quota, instructor, and price.
- `PurchasedEventTicket`: Issued e-ticket payload with unique ticket code, QR barcode payload, participant details, and payment verification.

### 3.2. User Experience Components
- `src/components/landing/EventTicketPurchaseModal.tsx`:
  - Step 1: Participant count & registration form (Nama, No. WA, Email).
  - Step 2: Instant payment selection (QRIS, E-Wallet, VA).
  - Step 3: E-Ticket generation with copyable ticket code, QR display, and 1-tap WhatsApp sharing (`wa.me`).
- `src/components/landing/LandingPageView.tsx`:
  - Top announcement banner.
  - Promo vouchers section with 1-tap copy (`handleCopyVoucher`).
  - Upcoming events & workshops grid with quota badges and direct purchase triggers (`setSelectedEventForTicket`).

### 3.3. Double-Entry Accounting General Ledger Mapping
- `1102 - Bank QRIS Settlement` (Debit on ticket purchase settlement).
- `4101 - Pendapatan Penjualan Barang` (Credit on physical retail/F&B goods).
- `4102 - Pendapatan Jasa & Layanan Profesional` (Credit on labor/consultation/service items).
- `4103 - Pendapatan Tiket Event & Kelas` (Credit on event tickets and workshop class bookings).

---

## 4. Verification Evidence & Quality Proof
- **Unit Tests:** `src/tests/eventTicketingAndClassBooking.test.ts` (4/4 tests passed).
- **Comprehensive Suite:** 42 test files, 221/221 tests passed (100%).
- **Modularity:** 218/218 TypeScript files strictly under the 500-line ceiling.
- **CI Gate:** `./scripts/ci-local.sh` exited with code `0`.
