# 🔄 HFE Legacy Migration Guide: Xero, Moka, Accurate & Mekari Jurnal

Panduan resmi migrasi data historis, neraca saldo awal, master produk, dan buku rekanan (*Contacts*) dari software legacy ke ekosistem **Headless Company Books (HFE)**.

---

## 🧭 1. Prinsip Dasar Migrasi HFE

Migrasi di HFE dirancang dengan prinsip **Dual-Phase Non-Blocking**:
1. **Day-0 Fast Launch**: Toko baru dapat langsung berjualan di kasir POS dalam $<60$ detik dengan saldo awal kas laci tanpa harus menunggu seluruh data migrasi 5 tahun selesai dibersihkan.
2. **Day-1+ Asynchronous Reconciliation**: Seluruh transaksi historis, persediaan awal, dan piutang/hutang dimigrasikan secara asinkron melalui modul rekonsiliasi.

---

## 📑 2. Format Template CSV Baku HFE

Sistem HFE menyediakan template standar CSV untuk import data:

### A. Template Master Produk & Bahan Baku (`products_import.csv`)
```csv
sku,name,category,unit_price_minor,cost_price_minor,tax_profile,is_inventory_tracked,station_routing
COF-BEANS-01,Arabica Gayo 250g,COFFEE_BEANS,85000,45000,TAX_ID_PB1_PPN,true,BARISTA
HOT-CAP-01,Hot Cappuccino,BEVERAGE,35000,12000,TAX_ID_PB1_PPN,false,BARISTA
CROIS-BUT-01,Butter Croissant,PASTRY,28000,11000,TAX_ID_PB1_PPN,true,KITCHEN
```

### B. Template Kontak & Buku Rekanan (`contacts_import.csv`)
```csv
name,contact_type,phone,email,labels,tax_id_npwp,opening_balance_minor
Budi Santoso,EMPLOYEE,+6281234567890,budi@kafe.com,ACTOR:BARISTA;SURFACE:POS_CASHIER,,0
Koperasi Petani Gayo,VENDOR,+6281198765432,sales@gayo.co.id,ACTOR:SUPPLIER_AGRI;CLUSTER:AGRI,01.234.567.8-001.000,-15000000
PT Maju Sukses,CUSTOMER,+6281311223344,finance@majusukses.com,ACTOR:GUEST_VIP;TIER:CORPORATE,02.345.678.9-002.000,5000000
```

### C. Template Neraca Saldo Awal (`beginning_trial_balance.csv`)
```csv
account_code,account_name,debit_minor,credit_minor
1110,Kas di Tangan & Kas Laci,2500000,0
1120,Bank BCA Operasional,45000000,0
1130,Piutang Usaha (AR),5000000,0
1210,Persediaan Biji Kopi & Bahan,12500000,0
2110,Hutang Usaha (AP),0,15000000
3110,Modal Pemilik Awal,0,50000000
```
> ⚠️ **Catatan Kritis**: Total Debet WAJIB sama persis dengan Total Kredit ($\text{Total Debet} == \text{Total Kredit}$).

---

## 🛠️ 3. Pemetaan Khusus Software Legacy

### 1. Migrasi dari Moka POS / Pawoon
- **Yang Dimigrasikan**: Master Item, Kategori, Modifier (Extra Shot, Oat Milk), Riwayat Struk, dan Akun Kasir Staf.
- **Cara Export dari Moka**: Masuk ke Backoffice Moka ➔ `Library` ➔ `Item Library` ➔ Klik `Export`.
- **Import ke HFE**: Masuk ke Portal HFE ➔ `Getting Started Hub` ➔ `Migrasi Moka POS` ➔ Upload CSV.

### 2. Migrasi dari Xero / QuickBooks (The Raw Facts Ingestion Invariant)
- **Prinsip Raw Facts**: HFE DILARANG mengimpor field kalkulasi ringkasan (`TotalAmount`, `TaxAmount`, `DiscountAmount`, `EndingBalance`). HFE HANYA mengimpor fakta mentah:
  * `Quantity`, `Unit Price`, `Discount %`, `Tax Identifier (GST 9% / PB1 10%)`, `Exchange Rate`.
- **Kalkulasi Deterministik**: Seluruh subtotal, beban pajak, dan jurnal debet-kredit dihitung ulang secara independen oleh Kernel Deterministik HFE.
- **Protokol Rekonsiliasi 3-Arah (3-Way Recon)**:
  1. *Trial Balance Recon*: Membandingkan saldo akhir akun HFE vs Neraca Saldo Xero ($\Delta == \$0.00$).
  2. *Bank Account Currency Mapping*: Rekening bank Xero dipetakan ke akun bank HFE dengan atribut `account.currency` masing-masing (DBS SGD ➔ `SGD`, DBS USD ➔ `USD`).
  3. *Penny Rounding Buffer*: Selisih pembulatan bawaan $\le \$0.05$ dialokasikan ke akun penyeimbang `4390 (Rounding Adjustment)`.

### 3. Migrasi dari Accurate Online / Mekari Jurnal
- **Yang Dimigrasikan**: Master Barang & Nomor Seri, Daftar Vendor B2B, Faktur Pajak DJP e-Faktur, dan Jurnal Memorial.

---

## 🔍 4. Verifikasi Pasca Migrasi (*The 3-Way Reconciliation Audit Gate*)

Setelah proses upload atau sinkronisasi API selesai, jalankan validasi integritas melalui CLI atau API:
```bash
# Validasi integritas keseimbangan & audit 10-pilar radar
python3 scripts/hfex-rad0.py
```
Sistem akan memastikan bahwa:
1. Tidak ada saldo akun yang menggantung (*Zero Floating Imbalance*).
2. $\sum \text{Debits} == \sum \text{Credits}$ terbukti 100% seimbang hingga digit desimal terkecil.
3. Seluruh stok terikat kuat pada `company_book_id` yang sah.
4. Seluruh kontak staf telah memiliki PIN kasir yang terenkripsi aman.
