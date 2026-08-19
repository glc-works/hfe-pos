# HFE-OMBOK-STD-001 — Standar Rekayasa Operasi Bisnis & Disiplin Alur Kerja Agen

Versi: 1.0  
Status: Approved  
Tanggal Berlaku: 2026-08-19  
Pemilik Kontrak: Engineering & Operations Governance  
Pilar Acuan: APICS / ASCM Operations Management Body of Knowledge (OMBOK)  

---

## 1. Ruang Lingkup & Batas Arsitektur (Frontend vs Core SSOT)

Standar ini menetapkan batasan normatif penerapan sains manajemen operasi (**APICS/ASCM OMBOK**) pada **`glc-works/hfe-pos`** (Frontend & Commerce Suite) dan interaksinya dengan **`glc-works/headless-company-books`** (HFE Core Engine).

### 1.1 Invariant Pemisahan Tanggung Jawab (Zero Logic Spill)
1. **HFE Core adalah Single Source of Truth (SSOT)**: Seluruh kebenaran akuntansi berpasangan (*double-entry GL*), kalkulasi HPP (*Cost of Goods Manufactured / COGM*), penyusutan massa bahan (*yield loss shrinkage*), valuasi persediaan (*FIFO periodic/perpetual*), dan mutasi piutang kamar hotel wajib berada secara eksklusif di backend HFE Core.
2. **Frontend `hfe-pos` adalah Konsumen UI Murni**: `hfe-pos` bertanggung jawab atas ergonomi antarmuka pengguna (*touch ergonomics*), penyajian rasio kapasitas visual, pemecahan tiket pesanan (*work-order decomposition UI*), perlindungan salah input kasir (*Poka-Yoke input guards*), dan durabilitas penyimpanan offline (*fail-closed ACID IndexedDB*). Dilarang keras menulis mesin akuntansi bayangan atau tabel stok tiruan di frontend.
3. **Protokol Eskalasi Upstream (Aturan 26)**: Jika ditemukan kekurangan field, skema, atau endpoint di `@hfe/sdk`, agen/developer **DILARANG** membuat adapter penambal lokal (*local workaround shim*). Agen wajib membuat tiket Issue terstruktur untuk diselesaikan oleh sesi HFE Core.

---

## 2. Standar Operasional Komersial (F&B, Ritel & Hospitality)

### 2.1 Bill of Materials (BOM) & Yield Shrinkage (OMBOK Domain II)
* **Prinsip**: Setiap konversi bahan baku (*raw materials*) menjadi barang jadi (*finished goods*) yang mengalami penyusutan massa/kelembaban (misal: 15% *moisture loss* pada roasting biji kopi `SCN-01-02-01`) wajib disajikan secara transparan di UI.
* **Standar UI**:
  - UI kartu BOM wajib menampilkan rasio input bahan vs output barang jadi beserta persentase susut (*yield efficiency*).
  - Nilai moneter COGM/COGS diambil murni dari endpoint `@hfe/sdk`, bukan dihitung manual di browser.

### 2.2 Utilisasi Kapasitas Spasial (*Spatial Capacity Management* - OMBOK Domain III)
* **Prinsip**: Dalam bisnis perhotelan dan F&B, kapasitas meja/kursi yang menganggur (*idle capacity*) adalah pendapatan yang hilang permanen (*perishable capacity*).
* **Standar UI**:
  - Kartu status meja terisi **WAJIB** menampilkan rasio utilisasi kapasitas kursi aktual (**`👥 seatedGuests/maxCapacity Kursi`**, e.g. **`👥 3/4 Kursi`**), bukan hanya kapasitas statis (*4 Pax*).
  - Meja VIP wajib menyajikan indikator progres komitmen minimum pembelanjaan (*Minimum Spend Progress Bar*) untuk memantau optimalisasi *Revenue Per Available Seat Hour (RevPASH)*.

### 2.3 Work-Order Decomposition & Multi-Fulfillment Dispatch (OMBOK Domain III & TOC)
* **Prinsip**: Menerapkan *Theory of Constraints (TOC)* untuk mencegah kemacetan (*bottleneck*) pada stasiun kerja terpadu.
* **Standar UI**:
  - Ketika pesanan multi-kategori diproses (makanan dapur + minuman barista), UI kasir dan KDS wajib memecah chit pesanan secara deterministik ke stasiun pemenuhan masing-masing (*Kitchen Display vs Barista Display*).

### 2.4 Poka-Yoke (Anti-Salah Input) pada Kasir (OMBOK Domain IV: Lean Quality)
* **Prinsip**: Desain workstation wajib menerapkan proteksi mekanis untuk mencegah kesalahan manusia (*mistake-proofing*).
* **Standar UI**:
  - Input uang tunai kasir wajib menyediakan tombol nominal cepat (*Speed Keys*) yang otomatis menyesuaikan ceiling pecahan uang kertas rupiah (Rp 50.000 / Rp 100.000 / Uang Pas) guna mengeliminasi salah ketik kembalian.
  - Angka nominal moneter wajib menggunakan tipografi tabular (`font-mono tabular-nums`) untuk mencegah pergeseran layout.

---

## 3. Standar Disiplin Rekayasa & Alur Kerja Agen (Agent Engineering Rigor)

Prinsip OMBOK diterapkan secara ketat pada alur kerja kontributor dan agen AI:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                         OMBOK AGENT ENGINEERING RIGOR MATRIX                                     │
├─────────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ Pilar OMBOK             │ Mekanisme Penegakan Mesin di Codebase                                  │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 1. Poka-Yoke            │ • Hard Zero-Write Gate pada turn diskusi (mencegah salah spekulasi).   │
│    (Mistake-Proofing)   │ • Modularity Guard <500 baris per file (`check-modularity.py`).        │
│                         │ • 6 Physical Quality Gates sebelum commit git.                         │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 2. Andon Cord           │ • Jika 1 dari 6 gate CI gagal, agen WAJIB berhenti dan memperbaiki.   │
│    (Stop-the-Line)      │ • Circuit Breaker: Jika tes gagal 3x berturut-turut, minta alignment.  │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 3. Theory of            │ • Memecah task besar menjadi unit mikro-iterasi Level 2 yang teruji.   │
│    Constraints (TOC)    │ • Menghindari 'Big-Bang Rewrite' yang menyebabkan context exhaustion.  │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 4. Kaizen               │ • Setiap koreksi anti-pattern memicu `/learn` untuk mengabadikan       │
│    (Continuous Imprv)   │   invariant baru ke `AGENTS.md` (Zero Regression).                     │
├─────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 5. Supply Chain SSOT    │ • Mengharamkan pembuatan shim/adapter lokal penambal di frontend.      │
│    & Zero Shadow Logic  │ • Jika SDK kurang, eskalasikan via filing Issue terstruktur ke CORE.   │
└─────────────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 6 Pagar Pembatas Kualitas Fisik (The 6 Physical Quality Gates)

Setiap perubahan kode di `hfe-pos` sebelum di-commit **WAJIB** memenuhi 6 gate fisik berikut dengan exit code 0:

1. **Gate 1 (Modularity Guard)**: `python3 scripts/check-modularity.py` (Semua file `src/` < 500 baris).
2. **Gate 2 (Connector Manifest)**: `python3 scripts/validate-connector.py` (`connector.manifest.json` valid).
3. **Gate 3 (Standards Auditor)**: `python3 scripts/audit-hfe-ui-standards.py` (Pillars I–IV lulus 100%).
4. **Gate 4 (Typecheck)**: `npx tsc --noEmit` (0 type error).
5. **Gate 5 (Behavioral Tests)**: `npx vitest run` (Seluruh unit & integration tests lulus).
6. **Gate 6 (Playwright Storybook Crawler)**: `node scripts/audit-storybook-playwright.cjs` (64/64 stories lulus 100% di Chromium headless).

---

## 5. Matriks Kepatuhan & Audit Otomatis

Kepatuhan terhadap standar ini diaudit secara berkelanjutan melalui perintah CLI internal:
* `python3 scripts/hfex.py ombok` — Memeriksa panduan operasional OMBOK & pemetaan UI.
* `python3 scripts/hfex.py rules` — Menampilkan seluruh 26 aturan invariant aktif.
* `bash scripts/ci-local.sh` — Menjalankan verifikasi 6 gate fisik secara terpadu.
