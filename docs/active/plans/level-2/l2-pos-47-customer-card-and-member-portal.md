---
okf_version: "0.2"
type: Development Plan Level 2
title: Digital Customer Card, Member Portal & Omnichannel Loyalty Hub (L2-POS-47)
description: Introduces the Customer Portal & Digital Member Card experience in Hfe POS, enabling customer login, member barcode scanning, points/stamp ledger, e-ticket wallet, and order/service history.
tags: [development-plan, level-2, customer-portal, member-card, loyalty, crm, hfe-pos]
parent_level_1: l1-24-customer-contact-master-and-crm-suite
github_issue: 47
status: Implemented
---

# Level 2 Implementation Plan: Digital Customer Card, Member Portal & Omnichannel Loyalty Hub (L2-POS-47)

## 1. Outcome & User Experience Vision
Expands the Hfe Experience Suite to provide a dedicated **Customer Portal & Digital Member Card (`Customer Card & Profile Hub`)** accessible directly from the Landing Page navbar, Customer QR menu, or standalone link (`/portal` / `/my-card`).

### Key Capabilities:
1. 💳 **Digital Member Card (Apple Wallet / Passbook Aesthetics):**
   - High-contrast visual card with Brand Logo, Member Name, and Tier Badge (`Bronze`, `Silver`, `Gold VIP`, `Platinum`).
   - Dynamic **Customer QR / Barcode ID** for 1-tap cashier scanning at POS workstation.
   - Live **Loyalty Points & Stamp Card** progress (e.g. `8/10 Cups - 2 more for a Free Latte!`).
2. 🔐 **Customer Login & Identity Verification:**
   - 1-Tap Phone / WhatsApp OTP simulation or Togrow ID fast pass.
   - Saved Profile: Favorite customizations (e.g. *Oat Milk, Less Sugar*), saved delivery address, and vehicle plate number (for auto workshop/car wash).
3. 📜 **Omnichannel Customer Activity Hub & Smart Preferences:**
   - **🧾 Riwayat Pesanan & E-Receipts:** Searchable history of dine-in, takeaway, and delivery orders with 1-tap PDF receipt download.
   - **🌱 Go-Green Paperless Eco-Receipts (`paperlessReceipts: true`):** Eliminates toxic BPA thermal paper waste; orders automatically deliver digital e-receipts to the customer's member card with eco-points rewards.
   - **⚠️ Universal Identity, Alergi & Preferensi Makanan:** Menyimpan preferensi profil global universal (Oat Milk, 50% Sugar, Plat Valet, Alamat Kirim) dan bendera bahaya alergi (`kacang`, `laktosa`, `gluten`, `seafood`, `telur`) yang berlaku lintas merchant Hfe di seluruh Indonesia.
   - **⭐ Ulasan & Rating Berbasis Pesanan (Order-Bound Feedback):** Pelanggan dapat memberikan rating bintang dan kritik/saran spesifik per nomor pesanan di tab Riwayat Pesanan (`CustomerOrdersHistoryTab.tsx`), langsung terhubung ke tiket manajer merchant terkait (+ reward loyalty points).
   - **📱 Pesan Online / Delivery Langsung dari Kartu:** Tombol 1-ketuk untuk memulai pemesanan online/takeaway dengan alamat dan preferensi makanan terisi otomatis.
   - **🎟️ Dompet Tiket Event & Kelas (E-Ticket Wallet):** Active event tickets with check-in QR codes.
   - **🏷️ Voucher & Kupon Tersimpan:** Claimed promo vouchers ready for 1-tap checkout.
   - **🚗 Riwayat Servis / Sesi Jasa:** Logbook of past oil changes, detailing services, or remaining Personal Trainer coaching sessions.
4. 🏪 **POS Workstation Scanner Integration:**
   - Cashier scans customer's Member Barcode to immediately attach customer profile, apply VIP tier discount, alert kitchen of guest allergies, and respect paperless receipt preference.

---

## 2. Proposed Architecture & Component Structure

```
src/
├── types/
│   └── pos.ts                                # [MODIFY] Add CustomerProfile, MemberTier, DigitalCardData
├── components/
│   └── customer-portal/                      # [NEW DIRECTORY]
│       ├── DigitalMemberCard.tsx              # Luxury Passbook Member Card with QR Barcode (< 250 lines)
│       ├── CustomerPortalHeader.tsx           # Profile avatar, points balance, tier status (< 150 lines)
│       ├── CustomerOrdersHistoryTab.tsx       # Past orders list & e-receipt drawer (< 250 lines)
│       ├── CustomerTicketsWalletTab.tsx       # E-tickets collection with check-in QR (< 200 lines)
│       ├── CustomerVouchersTab.tsx            # My active coupons with 1-tap use (< 180 lines)
│       └── CustomerPreferencesTab.tsx         # Saved dietary, address & vehicle info (< 200 lines)
├── views/
│   └── CustomerPortalView.tsx                 # [NEW] Root Customer Account Portal View (< 350 lines)
├── context/
│   └── CustomerAuthContext.tsx                # [NEW] Customer session state & points ledger (< 200 lines)
└── tests/
    └── customerPortalAndMemberCard.test.ts    # [NEW] Unit test suite for member card & portal
```

---

## 3. Data Flow & Upstream Hfe Core Alignment (Zero Drift Invariant)

```
┌───────────────────────────────┐          ┌───────────────────────────────┐
│     CUSTOMER PORTAL VIEW      │          │        POS WORKSTATION        │
│  (Digital Card, Points, Tix)  │          │    (UnifiedPosView.tsx)       │
└──────────────┬────────────────┘          └───────────────┬───────────────┘
               │                                           │
               │ Customer Barcode: CUST-8829               │ Scans Barcode
               └───────────────────────┬───────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │     Hfe Core CRM Engine       │
                       │  (Contact Master, Loyalty &   │
                       │   Double-Entry Points Ledger) │
                       └───────────────────────────────┘
```

---

## 4. Verification Plan

### Automated Tests:
- `src/tests/customerPortalAndMemberCard.test.ts`:
  - Verify member tier calculation based on total lifetime spend.
  - Verify points accumulation and stamp card progress.
  - Verify barcode generation format (`CUST-UID-XXX`).
  - Verify e-ticket wallet filtering for upcoming vs past events.

### Multi-Device UI Inspection:
- Compact mobile viewport (360px – 390px) for Apple Wallet passbook card responsiveness.
- Tablet & desktop viewports for dual-column portal navigation.
- Local CI Gate (`./scripts/ci-local.sh`) exit code 0.
