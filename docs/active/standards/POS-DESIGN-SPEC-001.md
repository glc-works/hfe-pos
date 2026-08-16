# 📱 HFE POS & COMMERCE: MASTER DESIGN RULES & MULTI-VIEWPORT SPECIFICATION (`POS-DESIGN-SPEC-001`)

---

## 🏛️ 1. Filosofi & Tinjauan Pakar (*Expert Synthesis*)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       4-PILLAR DESIGN PHILOSOPHY                                       │
├──────────────────────────┬──────────────────────────┬──────────────────────────┬───────────────────────┤
│  🍎 Jony Ive (Apple)     │  🧠 Nielsen Norman (UX)  │  🍽️ ESB POS (Enterprise)│  🛵 Uber Eats / Toast │
│  "Less, but better"      │  "Ergonomics & Fitts"   │  "Rush-Hour Speed"       │  "Consumer Delight"   │
├──────────────────────────┼──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • Materialitas bersih    │ • Tap target >= 44px     │ • Split bill dlm 2 tap   │ • Floating cart dock  │
│ • Flat header bottom     │ • Thumb-zone terjangkau  │ • Course Fire/Hold instan│ • Modifier chips rapi │
│ • Tipografi optik        │ • Single scroll owner    │ • Blind count kasir rapi │ • Allergen badges     │
│ • Zero visual clutter    │ • Zero cognitive fatigue │ • High-contrast status   │ • Micro-interactions  │
└──────────────────────────┴──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 📐 2. Matriks Aturan Desain 3 Viewport Utama

```
┌─────────────────────────┬───────────────────────────────────┬───────────────────────────────────┬───────────────────────────────────┐
│ ASPEK DESAIN            │ 📱 COMPACT MOBILE (360 - 430px)   │ 📟 TABLET PORTRAIT (768 - 834px)  │ 🖥️ TABLET LANDSCAPE/DESKTOP (1024+)│
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 1. Layout Shell         │ Single-Column Stack (100dvh)      │ Hybrid Adaptive Stack (100dvh)    │ Fixed Dual-Pane Grid (100dvh)     │
│                         │ Main scrollable with bottom pad   │ Grid 2/3 kolom + slide-over drawer│ Left: Catalog/Tables, Right: Cart │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 2. Window Scroll Owner  │ Single scroll <main>              │ Single scroll <main>              │ 🚫 ZERO Window Scroll             │
│                         │ overscroll-contain pb-36          │ overscroll-contain pb-24          │ Internal pane scrollbars ONLY     │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 3. Header Budget        │ Max 340px width                   │ Max 720px width                   │ Full Width Container (1280px)     │
│                         │ Left (<= 100px), Center Switcher  │ Left: Brand/Outlet info           │ Left: Launcher, Switcher, Notif   │
│                         │ Right (<= 80px, max 2 icons)      │ Right: Full Action Toolbar        │ Right: Cashier Session & Time     │
│                         │ Flat bottom (border-radius: 0)    │ Subtle rounded bottom (rounded-2xl│ Flat header border                │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 4. Katalog / Meja Grid  │ 2 Kolom Grid (Mobile Optimized)   │ 3 Kolom Grid                      │ 4 - 5 Kolom Grid (Dense/Fast)     │
│                         │ Touch target >= 48px              │ Touch target >= 52px              │ Compact cards with high info density│
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 5. Keranjang Kasir      │ Floating Bottom Dock              │ Slide-Over Modal / Bottom Sheet   │ Pinned Full-Height Right Column   │
│                         │ [ 2x Rp 86k ] [ Bayar ➔ ]         │ Expandable drawer with fast pay   │ Header + Items + Pinned Pay Panel │
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 6. Menu Favorit (Keys)  │ Inside "Katalog" tab only         │ Bottom Strip or Drawer            │ Fixed Bottom Dock (12 Speed Keys) │
│                         │ (Prevents table plan clutter)     │ (1-tap quick add to open tab)     │ (Instant 1-tap add to active cart)│
├─────────────────────────┼───────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ 7. Floating Dev Widget  │ Anchored top-16 left-3            │ Anchored top-16 left-3            │ Anchored top-16 left-3            │
│    (FloatKit)           │ Zero collision with bottom dock   │ Zero collision with slide drawers │ Discreet non-obtrusive icon       │
└─────────────────────────┴───────────────────────────────────┴───────────────────────────────────┴───────────────────────────────────┘
```

---

## 🎯 3. Spesifikasi Detail Per Viewport

### 📱 A. Mobile View (360px – 430px) — *The Thumb-Zone Standard*
1. **Aturan 3-Zone Header Budget:**
   - Total lebar header mobile tidak boleh melebihi 340px.
   - **Zona Kiri:** Launcher role / menu kasir (<= 100px).
   - **Zona Tengah:** Switcher tab `[ Peta Meja | Katalog ]` (<= 125px).
   - **Zona Kanan:** Maksimal **2 tombol aksi** (Lonceng Notifikasi + Scanner Kamera). Tombol sekunder seperti Sambut Tamu dan Split Bill dipindahkan ke drawer menu.
2. **Zona Aman Bawah (*Bottom Safe Zone*):**
   - Area 0 sampai 128px dari bawah layar dikhususkan **100% eksklusif untuk Floating Cart Bar (`PosMobileCartDock`)**.
   - Widget tambahan (seperti `FloatKit`) dilarang keras berada di `bottom-*` untuk mencegah tabrakan hitbox.
3. **Pemisahan Tab Murni (*Pure Tab Isolation*):**
   - Tab Denah Meja tidak boleh memuat shortcut menu kopi yang mengambang agar tampilan denah meja tetap lapang dan tidak terpotong.

---

### 📟 B. Tablet Portrait View (768px – 834px) — *The Waiter Handheld Standard*
1. **Navigasi 1-Ketuk (*One-Tap Quick Actions*):**
   - Header menampilkan seluruh 4 tombol aksi (Notifikasi, Scan QR, Sambut Tamu, Meja Ops).
   - Filter zona area meja (`Outdoor`, `Indoor`, `VIP`, `Rooftop`) ditampilkan horizontal dengan scroll samping (*horizontal chip slider*).
2. **Drawer Keranjang Mengambang (*Floating Sheet*):**
   - Keranjang kasir muncul sebagai drawer bawah atau slide-over 50% lebar layar, memberikan waiter ruang visual yang luas untuk melihat denah meja sambil memverifikasi item pesanan.

---

### 🖥️ C. Tablet Landscape & Desktop View (1024px – 1440px) — *The Pinned Cashier Terminal*
1. **Zero Window Scroll (*App-Pinned Invariant*):**
   - Tidak boleh ada scrollbar pada jendela luar browser (`h-[100dvh] overflow-hidden`).
   - Sisi kiri (Katalog/Meja) dan sisi kanan (Keranjang Kasir) memiliki scrollbar internal independen (`min-h-0 overflow-y-auto custom-scrollbar`).
2. **Panel Pembayaran Selalu Terkunci di Bawah (*Pinned Payment Section*):**
   - Rincian Subtotal, PB1 Tax 10%, Total Tagihan, Pilihan Cash/QRIS/Kartu, dan Tombol Hijau Proses Bayar **selalu terkunci di dasar layar kanan**, tidak pernah terdorong ke bawah layar.
3. **12 Speed Keys Favorit Selalu Siap di Bawah Meja:**
   - Kasir stasioner dapat mengklik Meja `OUT-04`, lalu langsung 1-ketuk tombol `Espresso Aren Latte` di bagian bawah kiri tanpa perlu bolak-balik tab.

---

## 🚫 4. Standar Mikro-Copy & Tombol Aksi (Anti-Parentheses Invariant)

1. **Kata Kerja Langsung (*Verb-First*):**
   - ✅ `+ Tambah Menu Lainnya`
   - ✅ `Kirim Pesanan ke Dapur ➔`
   - ✅ `Bayar Sekarang Rp 86.000 ➔`
   - ❌ `Bayar (OUT-04)`
   - ❌ `Kirim (KDS Mode)`
2. **Format Finansial Standar:**
   - Semua nominal uang wajib dibungkus fungsi `formatPrice(amount)` (misal `Rp 86.000`) dengan font monospace (`font-mono`) agar angka rata dan mudah dibaca kasir dalam hitungan detik.

---

## 📐 5. Golden Ratio ($\phi \approx 1.618$) & Irama Spasial 8-Point Grid

1. **Golden Ratio Dual-Pane Split ($61.8\% : 38.2\%$):**
   - Layar Desktop/Landscape dibagi secara proporsional: **$61.8\%$** (`lg:col-span-8`) untuk Eksplorasi Menu/Denah vs **$38.2\%$** (`lg:col-span-4`) untuk Panel Aksi & Keranjang Kasir.
2. **Vertical Mobile Golden Section:**
   - Pembagian tinggi layar ponsel ($100\text{dvh}$): Top Header Identitas (~12%), Focal Body Content (~61.8%), dan Bottom Thumb Action Dock (~26.2%–38.2%).
3. **8-Point & 4-Point Spatial Grid:**
   - Seluruh padding (`p-2: 8px`, `p-3: 12px`, `p-4: 16px`, `p-6: 24px`), gaps (`gap-2: 8px`, `gap-3: 12px`), dan radii (`rounded-xl: 12px`, `rounded-2xl: 16px`, `rounded-3xl: 24px`) wajib kelipatan 4px/8px untuk mengeliminasi blur pixel.
4. **Modular Typographic Scale:**
   - Skala geometris ($r = 1.125 \dots 1.200$): Micro (`10px`), Detail (`11px`), Body (`12px-13px`), Section/Price (`14px-16px`), Hero Title (`24px-32px`). Nominal uang wajib `font-mono`.
