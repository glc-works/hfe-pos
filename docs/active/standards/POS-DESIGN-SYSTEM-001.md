# 🎨 HFE POS & COMMERCE: MASTER DESIGN SYSTEM SPECIFICATION (`POS-DESIGN-SYSTEM-001`)

---

## 🏛️ 1. Struktur & Hirarki Sistem Desain

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       HFE POS DESIGN SYSTEM TOKENS                                     │
├──────────────────────────┬──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 🎨 COLOR & SURFACES      │ 🔤 TYPOGRAPHY & NUMBERS  │ 🔘 RADII & ELEVATION     │ 🧩 CORE COMPONENTS    │
├──────────────────────────┼──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • Canvas: slate-950      │ • Header: Inter/Sans     │ • Shell: rounded-3xl     │ • <PosButton>         │
│ • Surface: slate-900     │ • Body: text-xs/text-sm  │ • Card: rounded-2xl      │ • <PosBadge>          │
│ • Border: slate-800      │ • Numbers: font-mono     │ • Button: rounded-xl     │ • <PosPriceTag>       │
│ • Brand: amber-500       │ • Micro: text-[10px]     │ • Chip: rounded-full     │ • <PosModal/Drawer>   │
│ • Success: emerald-500   │ • Badges: uppercase bold │ • Shadow: shadow-2xl     │ • <PosNumpadKeypad>   │
└──────────────────────────┴──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 🎨 2. Token Warna & Semantik Status

| Kategori Token | Kelas Tailwind / Hex | Semantik Penggunaan |
|---|---|---|
| **Canvas Background** | `bg-slate-950` (`#020617`) | Latar belakang dasar aplikasi. |
| **Card / Surface** | `bg-slate-900` (`#0f172a`) | Wadah kartu utama, keranjang kasir, modal. |
| **Sub-Card / Inset** | `bg-slate-950/80` (`#020617cc`) | Item pesanan di dalam keranjang, baris riwayat. |
| **Border / Divider** | `border-slate-800` (`#1e293b`) | Garis pembatas halus antar komponen. |
| **Primary Accent** | `bg-amber-500` (`#f59e0b`) | Aksi utama kasir, branding, tombol checkout. |
| **Success / Paid** | `bg-emerald-500` (`#10b981`) | Status meja lunas, transaksi berhasil, pesanan siap. |
| **Warning / Tagihan** | `bg-amber-500/20 text-amber-300` | Meja terisi tagihan aktif, status pending sync. |
| **Danger / Void** | `bg-rose-500` (`#f43f5e`) | Hapus item, batalkan transaksi, peringatan selisih kas. |
| **Info / Electronic** | `bg-blue-500` (`#3b82f6`) | QRIS, scanner barcode, koneksi hardware printer. |

---

## 🔤 3. Token Tipografi & Ketelitian Finansial

1. **Aturan Wajib Font Monospace (`font-mono`):**
   - Setiap nominal uang (`formatPrice`), jumlah kuantiti (`2x`), nomor meja (`OUT-04`), PIN kasir, dan ID transaksi **wajib menggunakan kelas `font-mono`**.
   - Alasan: Mencegah pergeseran lebar angka (*tabular layout jitter*) saat angka berubah dinamis.
2. **Skala Hirarki Teks:**
   - **Judul Layar / Total Tagihan:** `text-base` s/d `text-lg font-black text-white`.
   - **Nama Menu & Label Tombol:** `text-xs font-bold text-slate-100`.
   - **Harga Satuan & Deskripsi:** `text-[11px] font-mono text-slate-400`.
   - **Badge Status & Durasi:** `text-[10px] uppercase font-bold tracking-wider`.

---

## 🔘 4. Token Bentuk & Elevasi (*Radii & Shadows*)

| Komponen | Border Radius | Elevasi / Efek |
|---|---|---|
| **App Shell / Pinned Column** | `rounded-3xl` (24px) | `shadow-2xl border border-slate-800` |
| **Kartu Meja / Kartu Menu** | `rounded-2xl` (16px) | `border transition-all active:scale-[0.98]` |
| **Tombol Aksi / Input / Selector** | `rounded-xl` (12px) | `shadow-md active:scale-95 touch-manipulation` |
| **Badge Status / Filter Chips** | `rounded-full` (9999px) | `border backdrop-blur-md` |

---

## 🧩 5. Komponen Primitif Standar (*Core Reusable Components*)

1. **`<PosButton>`**:
   - `variant="primary"`: `bg-amber-500 text-slate-950 font-black hover:bg-amber-400`
   - `variant="success"`: `bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400`
   - `variant="secondary"`: `bg-slate-800 text-white font-bold hover:bg-slate-700`
   - `variant="outline"`: `border border-slate-700 text-slate-300 hover:text-white`
   - `variant="danger"`: `bg-rose-500/20 text-rose-300 border border-rose-500/40`
2. **`<PosBadge>`**:
   - `status="occupied"`: `bg-amber-500/20 text-amber-300 border-amber-500/40`
   - `status="vacant"`: `bg-emerald-500/20 text-emerald-300 border-emerald-500/40`
   - `status="paid"`: `bg-blue-500/20 text-blue-300 border-blue-500/40`
3. **`<PosPriceTag>`**:
   - Menjamin seluruh angka terformat secara konsisten melalui `formatPrice(amount)` dengan tipografi `font-mono`.
