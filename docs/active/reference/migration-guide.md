# 🔄 HFE-POS Migration Guide: Data Import & UI Component Alignment

Panduan resmi migrasi data antarmuka kasir, katalog produk, konfigurasi meja, dan penyesuaian komponen UI ke standar **HFE 6-Tier Experience Layer**.

---

## 🧭 1. Prinsip Migrasi UI & Data
1. **Zero Text Collision Invariant**: Seluruh komponen tabel, struk kasir, dan kartu pesanan wajib menerapkan isolasi spasial (`min-w-0`, `truncate`, `tabular-nums`).
2. **6-Tier Architecture Monotonic Boundary**:
   - Tier 1: Tokens (`src/index.css`)
   - Tier 2: React Aria Primitives (`src/ui/`)
   - Tier 3: Domain Slot Widgets (`src/components/shared/`)
   - Tier 4: Widget Clusters (`src/components/tables/`, `src/components/book/`)
   - Tier 5: Layouts (`src/layouts/`)
   - Tier 6: Smart Views (`src/views/`)

---

## 📑 2. Template Import Data Kasir

Gunakan format CSV standar untuk memigrasikan data ke HFE-POS:
- `products_import.csv`: Master SKU, Kategori, Harga, Station Routing (`BARISTA` / `KITCHEN`).
- `contacts_import.csv`: Staf Kasir (dengan PIN hash), Pelanggan VIP, dan Vendor.
- `tables_floorplan.json`: Konfigurasi denah meja dan rasio kapasitas dinamis (`seatedGuests/maxCapacity`).

---

## 🔍 3. Verifikasi Pasca Migrasi
```bash
# Validasi paritas UI & AST anti-collision
python3 scripts/hfex-rad0.py
```
