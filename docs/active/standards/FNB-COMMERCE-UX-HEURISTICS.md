# F&B Commerce & POS UX Heuristics & Design Standard (GLC-FNB-UX-001)

**Status:** APPROVED NORMATIVE CONTRACT  
**Target Applications:** `Customer Mobile QR App`, `Unified POS Workstation`, `Unified KDS`, `Staff Surfaces`, `Merchant Settings`  
**Consulted Personas:** 🤖 Aibo, 🛵 Jack (UberFood UI/UX), 🍏 Sir Jony Ive (Apple CDO), 🍳 Bang ESB (F&B Ops Veteran)

---

## 💎 CORE HEURISTICS & GENERAL PRINCIPLES

### 1. ⚡ The 1-Tap Direct Add & Modifier Hierarchy Principle
- **Anti-Bikin-Repot Kitchen Rule:** Produk makanan/minuman yang memiliki resep pasti (Snack, Pastry, Makanan Ringan, Air Mineral Botol) **WAJIB 1-Tap Langsung Masuk Keranjang** (`handleAddToCart`), TANPA memunculkan modal popup yang mengganggu.
- **Hierarki Resolusi Modifier:**
  1. *Item-Level Policy (`modifierPolicy: 'always' | 'never'`)*: Mengontrol apakah item wajib membuka modal atau langsung masuk cart.
  2. *Explicit Item Flag (`hasModifiers: boolean`)*: Override per item.
  3. *Etalase / Category Default*: Kategori minuman (`Coffee`, `Non-Coffee`) default membuka modifier sheet; kategori makanan padat (`Pastry`, `Snack`) default 1-tap direct add.
- **Smart Recipe Consistency:**
  - Jika nama produk mencantumkan bahan spesifik (contoh: *"Uji Matcha Oat Latte"*), bahan tersebut (`Oatside`) otomatis menjadi **Default (Rp 0 Upcharge)**, bukan Fresh Milk sapi yang dicharge ekstra!

---

### 2. 🚫 Zero Free-Text Note Pollution (Anti-Ngemis Dapur)
- **Larangan Mendorong Catatan Bebas pada Menu Baku:**
  - Jangan memunculkan kotak input teks bebas pada menu gorengan/snack/pastry yang tidak memiliki varian.
  - Teks bebas hanya boleh aktif jika `shouldAllowItemCustomNotes(item)` bernilai `true`.
- **Contextual Station Placeholders:**
  - Minuman/Barista: `"Contoh: Less ice..."`
  - Dapur/Kitchen: `"Tulis instruksi khusus..."`
  - Larang placeholder minuman pada makanan padat.

---

### 3. 📸 Expansive Hero Visual Canvas (No Tiny Contact Avatars)
- **Modal Kustomisasi Wajib Menggunakan Hero Image Banner:**
  - Foto produk membentang penuh di bagian atas sheet modal (`w-full h-48 sm:h-52 object-cover relative rounded-t-3xl`).
  - Dilengkapi tombol tutup melayang semi-transparan `(✕)` di sudut kanan atas (`top-3 right-3 backdrop-blur-md`).
  - Dilarang keras menyusutkan foto produk menjadi thumbnail kecil 56px di samping judul seperti avatar kontak WhatsApp.

---

### 4. 🛒 Clean Cart Breakdown & "Add More" Positioning (GoFood / Uber Eats Benchmark)
- **Posisi Tombol "+ Tambah Menu Lainnya (Add more items)":**
  - Diletakkan **tepat di bawah baris item keranjang terakhir** dengan border putus-putus (*dashed border*) yang elegan.
- **Layout 2-Sisi Seimbang pada Setiap Baris Item:**
  - **Sisi Kiri:** Nama Menu Tebal, Sub-variasi (Iced, Less Sugar), Harga Subtotal terhitung (`Rp 56.000 (x2)`), serta trigger catatan ringkas `✏️ Tambah Catatan`.
  - **Sisi Kanan:** Stepper Kapsul Kuantitas `[ - ] [ Qty ] [ + ]` yang sejajar presisi.
- **Zero Redundant Headers:**
  - Jika tombol Add More sudah ada di bawah daftar item dan judul Ringkasan Pesanan sudah ada di body, **hapus baris ketiga header navigasi di halaman checkout** untuk menghemat ruang vertikal layar.

---

### 5. 📱 3-Layer Independent Viewport & iOS Safari Safe-Area Standard
- **Larangan Monolithic Scrolling Body di Mobile:**
  - Jangan menggabungkan seluruh aplikasi mobile ke dalam 1 window scroll context karena akan membuat header atas terpotong dan dock bawah tersembunyi/tertutup oleh Safari Address Bar.
- **Standar 3-Layer Independent Flexbox (`100dvh`):**
  1. **Top Header (`shrink-0 z-30`)**: Memiliki `pt-[max(env(safe-area-inset-top,8px),8px)]` sehingga selalu utuh dan berada di bawah notch / Dynamic Island iPhone.
  2. **Middle Menu Content (`flex-1 overflow-y-auto no-scrollbar`)**: Area katalog/checkout bergerak independen dengan buffer padding bawah `pb-12`.
  3. **Persistent Floating Cart Dock (`shrink-0 z-40`)**: Terpasang langsung di bawah viewport dengan `pb-[max(env(safe-area-inset-bottom,16px),16px)]` sehingga **LANGSUNG MELAYANG SEJAK DETIK PERTAMA** ada item di keranjang dan bebas dari bar URL Safari.

---

### 6. 🏛️ Radical Tri-Zone Header & Merchant Hub Architecture
- **Penyederhanaan 3 Touch Zone Atas:**
  - **Zone 1 (Kiri): Merchant & Table Hub (Large Touch Area)**: Logo + Nama Brand + Status Meja menjadi 1 tombol empuk yang membuka `MerchantDetailDrawer` (Tab Sesi Meja & Tab Profil Outlet).
  - **Zone 2 (Kanan): Customer Identity & Loyalty**: Avatar 40x40px membuka drawer Poin Loyalty, Kupon Saya, dan Riwayat Kunjungan.
  - **Zone 3 (Bawah): Etalase Kategori Scrollspy**: Pill kategori menu yang responsif terhadap jempol.
- **Social & Share Single-Row Action Bar:**
  - Format 4 kolom simetris: `[ 📸 Instagram ] [ 💬 WhatsApp ] [ 📍 Lokasi ] [ 🔗 Bagikan ]`.
  - Tombol Bagikan memicu Native Web Share API (`navigator.share`) dengan target Landing Page Merchant.
- **Anti-Stress Timestamp Policy:**
  - Tampilkan waktu mulai netral (`Mulai: 14:15 WIB`) dan **DILARANG** menampilkan durasi hitungan menit (`Durasi: 45 Menit`) yang menimbulkan stress/kepanikan bagi customer.
- **Merchant-Owned Payment Policy:**
  - Pilihan kebijakan pembayaran (`Pay-First` vs `Open-Tab`) adalah domain Back-Office Merchant dan Dev Mode Toolbar, **DILARANG** memunculkan opsi kebijakan internal kepada customer di halaman checkout.

---

### 7. 📱 Thumb-Zone Safety & Touch Targets
- Seluruh tombol dan kontrol interaktif wajib memiliki dimensi sentuh minimal **44px × 44px**.
- Sticky floating action sheet melayang di bawah layar (`bottom-4 inset-x-3`) untuk memudahkan pemesanan dengan jempol satu tangan.
- Frame containment `max-w-md w-full mx-auto` agar tampilan mobile sempurna baik di smartphone maupun monitor desktop lebar.

---

## 9. RULE 9: STRICT ANTI-BLEEDING & SINGLE-LINE TYPOGRAPHY HEURISTIC (GLC-FNB-UX-009)

1. **Harga Haram Terbelah Baris (`whitespace-nowrap font-mono shrink-0`):**
   - Semua label harga (misal `Rp 35.000`) **DILARANG KERAS** terbelah menjadi 2 baris (`Rp` di atas, `35.000` di bawah). Selalu gunakan `whitespace-nowrap font-mono font-bold shrink-0`.
2. **Komponen Header & Tombol Aksi Wajib 1 Baris Tegas:**
   - Tombol segment/metode bayar di layar 380px tidak boleh membengkak tingginya akibat teks terbelah (misal: gunakan `Kartu` daripada `Kartu (CC/Debit)`).
   - Jika judul menu panjang, pilih kata yang lebih ringkas dan elegan (misal `Dark Chocolate 70%` daripada `Belgian Dark Chocolate 70%`) atau gunakan `truncate`.
3. **Anti-Bleeding Dock & Safe-Area Padding:**
   - Floating cart dock bawah wajib memiliki ruang vertikal yang cukup (`min-h-[72px]` dengan `pb-[max(env(safe-area-inset-bottom,16px),16px)]`) sehingga angka harga `Rp 124.600` tidak pernah terpotong oleh Safari URL pill atau Android gesture bar.

---

## 10. RULE 10: INTRINSIC COMPONENT ARCHITECTURE & SELF-CONTAINED PRODUCTION STANDARD (GLC-FNB-UX-010)

1. **The `min-w-0` + `shrink-0` Invariant (Anti-Flex Collision):**
   - Semua baris flex horizontal yang memuat teks di kiri dan badge/tombol di kanan **WAJIB** menerapkan:
     - Parent: `flex items-center justify-between gap-2 min-w-0`
     - Sisi Kiri (Teks): `truncate min-w-0 flex-1`
     - Sisi Kanan (Badge/Action): `whitespace-nowrap shrink-0`
   - *Catatan Kritis:* Tanpa `min-w-0`, CSS flex item menolak menyusut dan memicu overflow/pemotongan badge.

2. **Self-Contained Production Isolation (DevTools Scaffolding Zero-Reliance):**
   - DevKit (`DevModePack`) adalah scaffolding development yang di-strip saat build production.
   - Komponen produksi DILARANG berasumsi DevKit tersedia. Setiap tampilan wajib mandiri (*self-contained*).
   - Navigasi sekunder di mobile wajib dibungkus dalam **Compact Action Overflow (`[ ↗️ ▾ ]` / 36px)**, bukan tombol teks melebar yang memakan 220px lebar layar.

3. **Container Viewport Awareness (`useViewport()`):**
   - Komponen DILARANG mengandalkan media queries `md:` mentah jika berada di dalam simulator.
   - Wajib menggunakan `useViewport()` (`isMobile`, `isTablet`, `isDesktop`) agar adaptif 100% terhadap container device.

---

## 11. RULE 11: SINGLE SOURCE OF TRUTH (SSOT) EVERYWHERE & ZERO-DRIFT SINGLE-DOOR ARCHITECTURE (GLC-FNB-UX-011)

1. **Single Source of Truth Invariant (Zero State Drift):**
   - Seluruh status konfigurasi toko (Billing/Payment Policy, Customer Theme Tokens, POS Theme, Custom Vault, Tenant Context, Cart State, Table Allocations) **WAJIB** dikelola melalui **1 Pintu Tunggal (Single-Door Authoritative Store / Context)**.
   - DILARANG KERAS membuat duplikasi state paralel atau shadow state di komponen lokal yang dapat memicu *state drift* atau ketidaksinkronan data.

2. **Scaffolding As Pure Shortcut (DevTools Purity):**
   - DevKit / DevModePack / Simulators / QA Overlays **DILARANG MEMILIKI MUTATOR TERSENDIRI**.
   - DevTools bertindak **MURNI SEBAGAI SHORTCUT ERGONOMIS** yang memanggil mutator API yang sama persis dengan yang dipanggil oleh Pengaturan Resmi Back-Office (`CafeSettingsView`).

3. **Bi-Directional Instant Synchronization:**
   - Perubahan state di mana pun (baik dari Pengaturan Toko, DevMode Toolbar, Customer QR Menu, maupun Kasir POS) harus seketika tersinkronisasi secara reaktif ke seluruh tampilan aktif tanpa reload halaman atau polling.

4. **Production Independence & Resilient Fallbacks:**
   - Ketika DevMode di-strip pada build produksi, seluruh fungsionalitas aplikasi harus tetap 100% mandiri, utuh, dan beroperasi normal tanpa ketergantungan atau error reference yang tertinggal.

---

## 12. RULE 12: PURE VIEWPORT APP SHELL (`100dvh`) & SINGLE SCROLL OWNER INVARIANT (GLC-FNB-UX-012)

1. **Root Height Invariant (`100dvh` Everywhere):**
   - Root application shell **WAJIB** menggunakan `h-[100dvh] w-full flex flex-col overflow-hidden` (Dynamic Viewport Height).
   - DILARANG menggunakan `min-h-screen` atau `100vh` mentah yang memicu layout jumps saat address bar mobile browser muncul/hilang atau meruntuhkan anak `h-full` menjadi `height: auto`.
   - DILARANG menggunakan `100vw` yang mengabaikan lebar scrollbar dan memicu horizontal overflow; gunakan `w-full` atau `100%`.

2. **Single Scroll Owner Invariant (Zero Nested Trapping):**
   - Di setiap tampilan (baik Customer QR, POS Kasir, KDS, maupun Settings), hanya boleh ada **SATU TEPAT Elemen Scroll Owner (`<main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">`)**.
   - Seluruh container leluhur (App, DevModePack, Frame Wrapper) **DILARANG** memiliki `overflow-y-auto` yang bertumpuk. Gunakan `overflow-hidden` atau `overflow-clip` pada leluhur agar mouse wheel/trackpad 100% diteruskan ke scroll owner tanpa macet/membeku.

3. **Intrinsic Pinned Header & Bottom Dock Guarantee:**
   - Header aplikasi wajib `shrink-0 z-30` di atas.
   - Floating Bottom Dock (Cart Summary, Checkout CTA) wajib `shrink-0` atau `absolute bottom-0 inset-x-0 z-40` di dalam frame container dengan padding bawah `pb-32` pada scroll area agar item paling bawah tidak pernah tertutup.

---

## 13. RULE 13: TOUCH ACTION & SCROLL CHAINING CONTAINMENT (GLC-FNB-UX-013)

1. **Overscroll Containment (`overscroll-behavior: contain`):**
   - Semua elemen scrollable wajib memiliki `overscroll-behavior: contain` (atau `none`) untuk mencegah scroll chaining memantul (*rubber-banding*) ke window browser.

2. **Touch Action Ergonomics (`touch-action: manipulation`):**
   - Seluruh elemen interaktif, tombol, stepper qty, dan chip kategori wajib memiliki `touch-manipulation` (`touch-action: manipulation`) untuk mengeliminasi delay ketukan 300ms dan mencegah accidental double-tap zoom di layar sentuh HP/tablet kasir.

---

## 🎯 MANDATORY AUDIT & REVIEW PROTOCOL UNTUK SEMUA TAMPILAN (GLC-FNB-AUDIT-002)

Sebelum menyajikan user journey atau tampilan apa pun ke User, Tim Developer & QA wajib memverifikasi:
- [ ] **Pure Viewport App Shell (`100dvh`):** Apakah root terkunci `100dvh` dan identik perilakunya di mode Standalone maupun DevMode?
- [ ] **Single Scroll Owner:** Apakah hanya ada 1 elemen scroll owner tanpa nested trapping di seluruh hierarki DOM?
- [ ] **Single Source of Truth Everywhere:** Apakah seluruh state & konfigurasi dikelola lewat 1 pintu tanpa duplikasi state lokal?
- [ ] **Zero Redundant Actions:** Apakah ada elemen/tombol yang menduplikasi fungsi yang sama di 2 tempat?
- [ ] **380px Boundary Stress-Test:** Apakah header dan baris teks mematuhi Rule 10 (`min-w-0` + `shrink-0`) tanpa tabrakan di lebar 380px?
- [ ] **Self-Contained Production:** Apakah halaman tetap utuh dan memiliki navigasi mandiri tanpa DevKit?
- [ ] **Modal & Drawer Sub-Screen Stress-Test:** Apakah seluruh modal/drawer (Profile, Voucher, Modifier Sheet) diperiksa dalam frame 380px dengan `shrink-0` pada kartu, tombol aksi 100% utuh tanpa terpotong, dan multi-item quantity indicator jelas?
- [ ] **3-Tier Upstream Data Authority Resolution:** Apakah data point dicek terlebih dahulu di Hfe Core (`headless-company-books`), lalu POS context, dan jika tidak ada diklarifikasi terlebih dahulu tanpa asal membuat field baru?
- [ ] **CI & Test Integrity:** Apakah seluruh unit test & CI build 100% lulus?




