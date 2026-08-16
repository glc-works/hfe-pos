---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Toko Kelontong & General Retail Suite (Barcode Cashier, Mobile Scan & Go, UOM Conversion & Kasbon)
description: Experience Layer expansion for Toko Kelontong / Retail, delivering rapid barcode scanner cashier POS, customer smartphone Scan & Go, UOM unit conversions (Pcs/Pack/Dus), wholesale price tiering, and Customer Kasbon credit ledger tracking via HCB REST APIs.
tags: [plan, level-1, pos, toko-kelontong, retail, barcode-scanner, scan-and-go, uom, kasbon]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Toko Kelontong & General Retail Suite

## 1. Domain Outcome
Expands the **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) to support **Toko Kelontong, Minimarket, and General Retail** businesses alongside the Cafe & F&B Suite.

Delivers rapid hardware Barcode Scanner POS cashiering (`EAN-13` / `UPC` / `SKU`), Customer Smartphone **Scan & Go** (scan shelf barcodes via phone camera), multi-unit UOM conversions (Pcs, Pack, Dus/Karton), wholesale pricing tiers (Eceran vs Grosir), and Customer Credit / **Kasbon Receivables Ledger Tracking** resolved through HCB Core REST APIs (`/v1/barcodes`, `/v1/inventory`, `/v1/receivables`).

---

## 2. Capability Scope

### Pillar A: Customer User Journey (Toko Kelontong)
1. **Mobile Scan & Go (Self-Checkout)**:
   - Customer scans shelf barcodes using phone camera (`hfe-pos.togrow.id/scan-and-go?outlet=KELONTONG-01`).
   - Live cart totals update in real-time. Customer pays via QRIS and receives a digital exit pass token (`QR Exit Pass`).
2. **Pesan Ambil & Kirim Kurir Toko (Click & Collect)**:
   - Customer orders grocery staples (Sembako: Beras, Minyak, Gula, Mie Instant) via smartphone.
   - Selects pickup time slot OR local store delivery (`Kurir Toko / Ojek`).
3. **Pencatatan & Pelunasan Kasbon (Customer Credit Ledger)**:
   - Logged-in customer checks active Kasbon balance (`GET /v1/company-books/{book}/contacts/{id}/receivables`).
   - Pays partial or full Kasbon settlement via QRIS or Cashier desk (`POST /v1/contacts/{id}/kasbon/pay`).

---

### Pillar B: Store Operational User Journey (Toko Kelontong - Owner, Kasir, Stocker)

```
 🏪 TOKO KELONTONG OPERATIONAL SUITE
 ├─ 💵 Kasir Barcode Rapid POS (Hardware USB/Bluetooth Scanner, Fast Quantity Multiplier *10)
 ├─ 🚚 Stocker / Gudang (Barcode Stocktake, Price Tag Printing, Penerimaan Barang Dus/Karton)
 ├─ 📝 Pengelola Kasbon (Limit Hutang Pelanggan, Jatuh Tempo Kasbon, Pelunasan Parsial)
 └─ 👔 Owner Dashboard (Margin Kotor per SKU, Tiering Harga Grosir vs Eceran, Tax PPN 11%)
```

1. **Kasir Toko (Hardware Barcode Scanner POS)**:
   - Rapid item search focused automatically on barcode input field (`Ctrl+B`).
   - Quick quantity multiplier syntax (e.g. typing `10*8999901` adds 10 pcs Mie Instant instantly).
   - Multi-UOM Tiered Pricing: Automatically applies wholesale price when quantity reaches Dus/Karton threshold.
   - Dual Payment Policy: Cash/QRIS OR **Simpan ke Kasbon** (for trusted regular customers).
2. **Stocker & Gudang (Penerimaan Barang & Barcode Shelf Tags)**:
   - Barcode Goods Receiving from supplier (`POST /v1/inventory/receive`).
   - Shelf barcode tag printer generator (`ESC/POS` label printer).
3. **Owner / Toko Manager (Buku Kasbon & Margin SKU)**:
   - Manages customer credit limit thresholds (e.g., Max Kasbon Rp 500.000).
   - Tracks gross profit margin percentage per SKU category (Sembako, Minuman, Snacking, Sabun/Detergen).

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-12-barcode-cashier-scan-and-go-kasbon-engine.md`

---

## 4. Verification & Acceptance Criteria
- Hardware barcode scanner input (`EAN-13` string) resolves product SKU in `< 15ms`.
- Purchasing 40 pcs automatically converts unit price from Eceran (Rp 3.500) to Grosir Karton (Rp 3.100).
- Kasbon checkout updates customer receivable balance in HCB Core Subledger (`/v1/receivables`).
