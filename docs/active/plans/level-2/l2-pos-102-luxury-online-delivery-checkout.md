# Level 2 Implementation Plan: Luxury Online Delivery Checkout & Precision Address Architecture (L2-POS-102)

## 📌 Context & Objectives
Mengadaptasi pola keunggulan checkout dari benchmark **GrabFood** untuk pilar *ORDER* & *BOARD* (`Pesan Antar / Delivery`):
1. **3-Tier Precision Delivery Address**: Titik alamat utama $\longleftrightarrow$ Detail lantai/unit $\longleftrightarrow$ Opsi drop-off (*Titip Satpam*, *Depan Pintu*, *Bertemu Langsung*) + catatan kurir.
2. **Kalkulasi Ongkir Dinamis Berbasis Jarak**: Ongkos kirim proporsional radius km dari outlet + Biaya Kemasan Delivery Thermal Bag.
3. **Interactive Payment Card Selector (Anti-Radio Button)**: Selector kartu pembayaran interaktif yang membuka detail/sheet modern, mengunci pembayaran lunas di depan (*Pay-First*) via QRIS Instan dengan arsitektur modular yang siap untuk aktivasi metode lainnya.
4. **Kepatuhan Mutlak Modularity & Quality**: Seluruh file $\le 500$ baris, 100% lulus CI 10-langkah.

---

## 🛠️ Proposed Changes

### 1. Types & State (`src/types/pos.ts`)
- Tambahkan interface `DeliveryDropOffOption = 'leave_at_lobby_guard' | 'meet_at_door' | 'meet_in_person'`.
- Tambahkan interface `DeliveryAddressInfo`.

### 2. UI Components (`src/components/customer/`)
- `CustomerDeliveryAddressCard.tsx` (< 200 baris): Form alamat presisi 3-tingkat dan segmented pills drop-off.
- `CustomerDeliveryPaymentSelector.tsx` (< 200 baris): Kartu sentuh pembayaran interaktif + modal sheet opsi pembayaran (Zero raw radio buttons).
- `CustomerCheckoutView.tsx` (< 500 baris): Integrasi mulus saat mode pemenuhan pesanan adalah `delivery`.

### 3. Testing & Verification
- Unit test: `src/tests/customerDeliveryCheckoutPrecision.test.tsx`.
- Local CI: `./scripts/ci-local.sh` & Playwright E2E.
