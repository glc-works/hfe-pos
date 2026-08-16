---
okf_version: "0.2"
type: Technical Specification Standard
title: POS-API-MAPPING — Experience Layer Screen to HCB Core REST API Mapping Reference
description: Authoritative mapping reference specifying the mandatory HCB REST API endpoint contracts for every UI screen, modal, and drawer in hfe-pos.
tags: [standard, pos-api-mapping, rest-contract, experience-layer, idempotency]
status: Approved
effective_date: 2026-08-15
---

# POS-API-MAPPING: Experience Layer Screen to HCB Core REST API Mapping Reference

## 1. Scope & Core Architecture Rules

`hfe-pos` is strictly an **Experience Layer** within the Headless Company Books (HCB) ecosystem (`glc-works/hfe-pos`). It possesses zero database authority, subledger storage, or accounting logic.

All business legality, product master data, financial postings, inventory depletions, loyalty accruals, and tax calculations are resolved exclusively through published **`Hfe` Core REST APIs** (`http://localhost:8080/v1/company-books/{book}/...`).

### Mandatory Rules for Experience Layer Integration:
1. **Single Source of Accounting Truth**: UI screens must project data returned by HCB REST APIs. Frontend components must NEVER manufacture or calculate standalone subledger balances.
2. **Mandatory Idempotency Key**: Every financial transaction submission (`POST /v1/company-books/{book}/transactions`) MUST include a client-generated UUID v4 header:
   ```http
   X-Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
   ```
3. **Offline Resilience Fallback**: If HCB REST APIs are unreachable, pending payloads are buffered in client `IndexedDB` with SHA-256 integrity checksums and flushed automatically upon connection recovery.

---

## 2. Comprehensive Screen-to-API Mapping Matrix

```
                      ┌────────────────────────────────────────────────────────┐
                      │              Hfe POS Experience Layer                  │
                      │   (Customer QR • Barista POS • Kitchen KDS Kanban)    │
                      └───────────────────────────┬────────────────────────────┘
                                                  │ (100% REST APIs + UUID v4)
                                                  ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   Hfe Core REST API Endpoints                                  │
 ├────────────────────────────────┬────────────────────────────────────────┬──────────────────────┤
 │ Domain Screen / Modal          │ Action / Flow                          │ HCB REST API Endpoint│
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 📱 Customer Mobile QR          │ 1. Scan Meja & Outlet Resolution       │ GET /v1/company-books/{book}/tables/{id}
 │ (`CustomerMobileView.tsx`)     │ 2. Identifikasi Guest / Phone Login    │ POST /v1/company-books/{book}/contacts/resolve
 │                                │ 3. Fetch Produk Catalog & Kategori     │ GET /v1/company-books/{book}/products
 │                                │ 4. Check Poin Loyalty & Voucher Wallet │ GET /v1/company-books/{book}/contacts/{id}/loyalty
 │                                │ 5. Redeem & Apply Voucher Diskon       │ POST /v1/loyalty/vouchers/claim
 │                                │ 6. Update Allergen & Taste Preferences │ POST /v1/company-books/{book}/contacts/{id}/preferences
 │                                │ 7. Universal toGrow History (All Resto)│ GET /v1/togrow/users/{account_id}/transactions
 │                                │ 8. Submit Checkout Transaction         │ POST /v1/company-books/{book}/transactions
 │                                │ 9. Live Order Progress Tracker         │ GET /v1/company-books/{book}/orders/{order_id}/status
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ ☕ Barista & Cashier Touch POS │ 1. Login Barista / Cashier PIN         │ POST /v1/company-books/{book}/auth/employee-login
 │ (`BaristaPosView.tsx`)         │ 2. Status Meja 1-20 (Free/Occupied/Tab)│ GET /v1/company-books/{book}/tables/status
 │                                │ 3. Pindah Meja (Table Transfer)        │ POST /v1/company-books/{book}/tables/{id}/reassign
 │                                │ 4. Split Bill per Seat                 │ POST /v1/company-books/{book}/tables/{id}/split-tab
 │                                │ 5. Join / Merge Meja                   │ POST /v1/company-books/{book}/tables/{id}/merge-tabs
 │                                │ 6. Shift Drawer Float Reconciliation  │ POST /v1/company-books/{book}/shifts/reconcile
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 💳 Payment Checkout Modal      │ 1. Dynamic QRIS / VA Generation        │ POST /v1/company-books/{book}/payments/qris/generate
 │ (`QrisModal.tsx`)              │ 2. Payment Polling / Webhook Listener  │ GET /v1/company-books/{book}/payments/{tx_id}/status
 │                                │ 3. Settlement & Biller Split Fee       │ POST /v1/company-books/{book}/transactions/settle
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🍳 Kitchen Display (KDS)       │ 1. Fetch Order Chit Queue (Active)     │ GET /v1/company-books/{book}/kds/orders?status=active
 │ (`KdsKanbanView.tsx`)          │ 2. Status Bump (Brewing ➔ Ready)       │ PATCH /v1/company-books/{book}/kds/orders/{order_id}/bump
 │                                │ 3. Fetch Recipe BOM & SOP Steps Drawer │ GET /v1/company-books/{book}/products/{id}/bom
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🍷 Fine Dining Gastronomy      │ 1. Fire Next Course (Course 1-7)       │ POST /v1/company-books/{book}/kds/fire-course
 │ (`FineDiningKdsView.tsx`,      │ 2. Sommelier Cellar & Bottle Pour Log  │ GET /v1/company-books/{book}/cellar/bottles
 │  `SommelierView.tsx`,          │ 3. Maître d' VIP History & Concierge   │ GET /v1/company-books/{book}/vip-guests/{id}
 │  `MaitreDView.tsx`)            │                                        │
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🛒 Toko Kelontong & Retail     │ 1. Scan Barcode EAN-13 / SKU Lookup    │ POST /v1/company-books/{book}/barcodes/lookup
 │ (`RetailPosView.tsx` &         │ 2. Mobile Scan & Go (Kamera HP)        │ POST /v1/company-books/{book}/scan-and-go/checkout
 │  `ScanAndGoView.tsx`)          │ 3. Check Saldo & Limit Kasbon          │ GET /v1/company-books/{book}/contacts/{id}/receivables
 │                                │ 4. Pelunasan Kasbon (Cash/QRIS)        │ POST /v1/company-books/{book}/contacts/{id}/kasbon/pay
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 👥 Tim & Keanggotaan Staf      │ 1. Fetch Roster Anggota Tim & Peran    │ GET /v1/company-books/{book}/memberships
 │ (`TeamRosterSection.tsx` &     │ 2. Kirim Undangan Staf & PIN 6-Digit   │ POST /v1/company-books/{book}/memberships/invitations
 │  `InviteStaffModal.tsx`)       │ 3. Aktivasi Tablet PIN 6-Digit Staf    │ POST /v1/company-books/{book}/memberships/accept
 │                                │ 4. Revoke / Hapus Akses Staf           │ DELETE /v1/company-books/{book}/memberships/{id}
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🔄 Workflows Operasional Toko  │ 1. Rekonsiliasi Kas Shift Float        │ POST /v1/company-books/{book}/shifts/reconcile
 │ (`ShiftDrawerModal.tsx`,       │ 2. Void / Refund Pesanan (Otorisasi PIN│ POST /v1/company-books/{book}/transactions/{id}/refund
 │  `ManagerVoidModal.tsx`,       │    Manager)                            │
 │  `StocktakeAuditModal.tsx`)    │ 3. Audit Stok Opname Fisik Gudang      │ POST /v1/company-books/{book}/inventory/stocktake
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🛵 Delivery Toko (Kurir Toko)  │ 1. Fetch Queue Delivery Sekitar Toko   │ GET /v1/company-books/{book}/deliveries
 │ (`DeliveryAddressModal.tsx` &  │ 2. Penugasan Kurir Staf Toko (Dispatch)│ POST /v1/company-books/{book}/deliveries/{id}/dispatch
 │  `DeliveryDispatchModal.tsx`)  │ 3. Selesaikan Delivery & COD           │ POST /v1/company-books/{book}/deliveries/{id}/complete
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🧾 Resi & Struk Thermal/Digital│ 1. Generate No. Resi AWB & Label QR    │ POST /v1/company-books/{book}/deliveries/{id}/generate-resi
 │ (`ResiTrackingView.tsx` &      │ 2. Check Status Live Resi Tracking     │ GET /v1/company-books/{book}/deliveries/resi/{resiCode}
 │  `PackageResiLabel.tsx`)       │ 3. Kirim Struk Digital / Cetak Thermal │ POST /v1/company-books/{book}/transactions/{id}/receipt
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 📦 Mode Gudang (Warehouse Ops) │ 1. Fetch Daftar Gudang Cabang/Pusat    │ GET /v1/company-books/{book}/warehouses
 │ (`WarehouseManagementView.tsx` │ 2. Penerimaan Barang Masuk (Supplier)  │ POST /v1/company-books/{book}/inventory/receive
 │  `StockTransferModal.tsx`)     │ 3. Transfer Stok Antar-Gudang          │ POST /v1/company-books/{book}/inventory/transfer
 │                                │ 4. Catat Waste / Kadaluarsa / Rusak    │ POST /v1/company-books/{book}/inventory/adjust
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🏢 Manajemen Cabang (Branches) │ 1. Fetch Daftar Cabang Outlet Toko     │ GET /v1/company-books/{book}/branches
 │ (`BranchManagementView.tsx` &  │ 2. Registrasi Cabang Outlet Baru       │ POST /v1/company-books/{book}/branches
 │  `BranchConfigModal.tsx`)      │ 3. Update Profil & Jam Buka Cabang     │ PUT /v1/company-books/{book}/branches/{id}
 │                                │ 4. Laporan Omzet Komparatif Multi-Cabang│ GET /v1/company-books/{book}/branches/sales-comparison
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🌍 ESG & Keberlanjutan Toko    │ 1. Fetch Metrik Penghematan Kertas/CO2 │ GET /v1/company-books/{book}/esg/metrics
 │ (`EcoImpactDashboardWidget.tsx`│ 2. Distribusi Tip Elektronik Staf      │ POST /v1/company-books/{book}/shifts/distribute-tips
 │  `EmployeeTipDistributionModal`)│                                       │
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🏬 Operasional RL (Real-World)│ 1. Route Cetak Printer Stasiun (Bar/Kitchen)│ POST /v1/company-books/{book}/printers/route-print
 │ (`printerRouter.ts` &          │ 2. Retur & Tukar Barang Retail         │ POST /v1/company-books/{book}/returns
 │  `gs1BarcodeParser.ts`)        │ 3. Pencatatan Complimentary / Treat VIP│ POST /v1/company-books/{book}/transactions/comp
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 🚀 POS 2026 Next-Gen Suite     │ 1. Fetch AI Smart Upsell Suggestions   │ GET /v1/company-books/{book}/ai/upsell-suggestions
 │ (`AiSmartUpsellModal.tsx` &    │ 2. Staff Timeclock Clock-In/Clock-Out  │ POST /v1/company-books/{book}/shifts/clock-in
 │  `PayAtTableQrView.tsx`)       │ 3. Dynamic Currency Conversion (DCC)   │ GET /v1/company-books/{book}/rates/dcc
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ 👤 Master Kontak Pelanggan     │ 1. Fetch Direktori Master Kontak       │ GET /v1/company-books/{book}/contacts
 │ (`CustomerContactsView.tsx` &  │ 2. Registrasi Kontak Pelanggan Baru    │ POST /v1/company-books/{book}/contacts
 │  `ContactDetailModal.tsx`)     │ 3. Update Limit Kasbon & Alergen Kontak│ PUT /v1/company-books/{book}/contacts/{id}
 ├────────────────────────────────┼────────────────────────────────────────┼──────────────────────┤
 │ ⚙️ Cafe Settings & Config      │ 1. Fetch Profil PT, NPWP, Branch Mode │ GET /v1/company-books/{book}/settings
 │ (`CafeSettingsView.tsx`)       │ 2. Check Merchant Subscription (Free/Pay)│ GET /v1/company-books/{book}/subscription
 │                                │ 3. Update Mode Tax PB1 & Service Fee % │ PUT /v1/company-books/{book}/settings
 │                                │ 4. Owner Loyalty Tier Settings Policy  │ PUT /v1/loyalty/settings
 └────────────────────────────────┴────────────────────────────────────────┴──────────────────────┘
```

---

## 3. Detailed Endpoint Contracts by Domain Screen

### 3.1. Customer Mobile QR Self-Ordering (`src/views/CustomerMobileView.tsx`)

#### A. Table & Outlet Resolution
- **HTTP Method & URI:** `GET /v1/company-books/{book}/tables/{id}`
- **Query Params:** `?table=MEJA-04&outlet=OUTLET-SENOPATI-01`
- **Response Shape:**
  ```json
  {
    "table_id": "MEJA-04",
    "outlet_id": "OUTLET-SENOPATI-01",
    "area_name": "Indoor Lounge",
    "status": "free",
    "active_order_id": null
  }
  ```

#### B. Customer Contact Resolution (Phone vs Pure Guest)
- **HTTP Method & URI:** `POST /v1/company-books/{book}/contacts/resolve`
- **Payload Shape:**
  ```json
  {
    "entry_mode": "phone",
    "phone": "081298765432",
    "display_name": "Aldi"
  }
  ```
- **Response Shape:**
  ```json
  {
    "contact_id": "CUST-081298765432",
    "loyalty_tier": "Gold",
    "loyalty_points": 450,
    "active_vouchers_count": 2
  }
  ```

#### C. Checkout Transaction Submission
- **HTTP Method & URI:** `POST /v1/company-books/{book}/transactions`
- **Mandatory Header:** `X-Idempotency-Key: <UUID-v4>`
- **Payload Shape:**
  ```json
  {
    "table_id": "MEJA-04",
    "contact_id": "CUST-081298765432",
    "policy": "pay-first",
    "items": [
      {
        "product_id": "PRD-01",
        "hfe_gl_account": "4010-Beverage Sales",
        "qty": 2,
        "price": 28000,
        "modifiers": { "temperature": "Iced", "sugar": "50%", "milk": "Oat Milk" }
      }
    ],
    "subtotal": 56000,
    "tax_pb1_amount": 5600,
    "service_fee_amount": 2800,
    "applied_voucher_code": "VOUCHER-DISC10PCT",
    "discount_amount": 5600,
    "grand_total": 58800
  }
  ```

---

### 3.2. Barista Touch POS Station (`src/views/BaristaPosView.tsx`)

#### A. Table Operations (Pindah Meja, Split Bill, Join Meja)
- **Table Reassign:** `POST /v1/company-books/{book}/tables/{id}/reassign`
  ```json
  { "from_table": "MEJA-04", "target_table": "MEJA-08", "reason": "Customer moved to window seat" }
  ```
- **Split Bill per Seat:** `POST /v1/company-books/{book}/tables/{id}/split-tab`
  ```json
  { "table_id": "MEJA-04", "seat_number": "Seat 2", "item_ids": ["PRD-01"] }
  ```

#### B. Cash Float Shift Reconciliation
- **HTTP Method & URI:** `POST /v1/company-books/{book}/shifts/reconcile`
- **Payload Shape:**
  ```json
  {
    "cashier_contact_id": "EMP-BARISTA-01",
    "opening_float_idr": 500000,
    "cash_collected_idr": 1450000,
    "closing_count_idr": 1950000,
    "variance_idr": 0
  }
  ```

---

### 3.3. Payment Checkout Modal (`src/components/modals/QrisModal.tsx`)

#### Dynamic QRIS Payment Generation
- **HTTP Method & URI:** `POST /v1/company-books/{book}/payments/qris/generate`
- **Payload Shape:**
  ```json
  { "transaction_id": "TX-901", "amount_idr": 58800, "biller_split_fee_idr": 250 }
  ```
- **Response Shape:**
  ```json
  {
    "payment_id": "PAY-QRIS-901",
    "qris_string": "00020101021226670016ID.CO.QRIS.WWW...",
    "qr_image_url": "https://hfe.togrow.id/qr/PAY-QRIS-901.png",
    "expires_at": "2026-08-15T22:00:00Z"
  }
  ```

---

### 3.4. Kitchen Display System (`src/views/KdsKanbanView.tsx`)

#### Order Status Bump Action
- **HTTP Method & URI:** `PATCH /v1/company-books/{book}/kds/orders/{order_id}/bump`
- **Payload Shape:**
  ```json
  { "from_status": "brewing", "target_status": "ready", "station_id": "drink-bar" }
  ```

---

### 3.5. Customer Portal & Digital Member Card (`src/views/CustomerPortalView.tsx`)

#### A. Fetch Member Card Passbook
- **HTTP Method & URI:** `GET /v1/company-books/{book}/contacts/{contact_id}/card`
- **Response Shape:**
  ```json
  {
    "cardNumber": "CUST-8829-01",
    "customerName": "Michael Chandra",
    "tier": "Gold",
    "pointsBalance": 2450,
    "stampCount": 8,
    "stampMax": 10,
    "barcodeData": "CUST-8829-01-GOLD",
    "qrData": "HFE-PASS:CUST-8829-01:GOLD"
  }
  ```

#### B. Submit Private Feedback & Rating
- **HTTP Method & URI:** `POST /v1/company-books/{book}/contacts/{contact_id}/feedback`
- **Payload Shape:**
  ```json
  {
    "contactId": "CUST-8829-01",
    "rating": 5,
    "category": "food_quality",
    "comments": "Kopi V60 Flores mantap sekali, barista ramah!"
  }
  ```

---

### 3.6. Event Ticketing & Workshop Class Booking (`src/components/landing/EventTicketPurchaseModal.tsx`)

#### Purchase Event / Masterclass Ticket
- **HTTP Method & URI:** `POST /v1/company-books/{book}/events/{event_id}/tickets`
- **Payload Shape:**
  ```json
  {
    "ticketCode": "TKT-EVT-WORKSHOP-02-8829",
    "participantName": "Michael Chandra",
    "participantPhone": "081234567890",
    "quantity": 2,
    "totalAmountPaid": 500000,
    "paymentMethod": "QRIS"
  }
  ```

---

### 3.7. Hotel Resto Multi-Zone & Room Charge Folio (`src/components/pos/RoomChargeModal.tsx`)

#### Charge Bill to Guest Room Folio
- **HTTP Method & URI:** `POST /v1/company-books/{book}/folios/charge`
- **Payload Shape:**
  ```json
  {
    "roomNumber": "402",
    "guestName": "Pak Gunawan",
    "orderId": "ORD-2026-0816-092",
    "amount": 750000
  }
  ```

---

### 3.8. ESG Sustainability Reporting (`src/components/insights/EsgReportModal.tsx`)

#### Fetch Aggregate ESG Sustainability Report
- **HTTP Method & URI:** `GET /v1/company-books/{book}/esg/report`
- **Response Shape:**
  ```json
  {
    "environmental": {
      "paperlessAdoptionRatePercent": 92.2,
      "thermalPaperSheetsSaved": 4830,
      "carbonCo2SavedKg": 96.6,
      "byocSingleUseCupsSaved": 1240,
      "surplusFoodRescuedPortions": 380
    },
    "social": {
      "totalEmployeeTipsDistributedRp": 18450000,
      "averageTipPerStaffRp": 1537500,
      "allergenIncidentRatePercent": 0,
      "guestSatisfactionScore": 4.83
    },
    "governance": {
      "pb1TaxComplianceRp": 48200000,
      "shiftBlindCountAccuracyPercent": 99.4,
      "auditTrailIntegrityStatus": "COMPLIANT"
    }
  }
  ```

---

## 4. Cross-Reference in Architecture Documents

This document binds all Level 2 implementation plans:
- Cross-referenced in [`POS-ENG-STD-001.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-ENG-STD-001.md)
- Cross-referenced in [`ARCHITECTURE.md`](file:///Users/aldi/claudefiles/hfe-pos/ARCHITECTURE.md)
- Cross-referenced in [`HFE-POS-PENTA-EXPERIENCE.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/HFE-POS-PENTA-EXPERIENCE.md)
- Cross-referenced in [`l2-pos-47-customer-card-and-member-portal.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/plans/level-2/l2-pos-47-customer-card-and-member-portal.md)

