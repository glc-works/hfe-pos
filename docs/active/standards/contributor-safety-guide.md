# 🛡️ HFE-POS Contributor Safety Guide & SOP: Anti-Drift Standards

Panduan resmi keamanan kontribusi kode, protokol anti-drift, dan Standard Operating Procedure (SOP) untuk seluruh kontributor di repositori **HFE-POS**.

---

## 🚫 1. What NOT To Do (Dilarang Keras)

1. ❌ **Dilarang Membuat Data Dummy Palsu**: Jangan membuat array/objek lokal buatan sendiri di dalam `.stories.tsx` atau unit test. Selalu import data resmi dari `src/data/presets/` atau `src/data/mockData.ts`.
2. ❌ **Dilarang Menulis Fallback Diam-Diam**: Jangan menulis `props.tax_rate ?? 0.1` atau `order.total || 0` untuk menyembunyikan error. Biarkan sistem gagal secara eksplisit (*Fail-Closed*) sesuai kontrak OpenAPI 3.1.
3. ❌ **Dilarang Bypass Git Hook (`--no-verify`)**: Jangan pernah mengetik `git commit --no-verify`. Jika pre-commit hook gagal, perbaiki masalahnya, bukan mematikan alarmnya.
4. ❌ **Dilarang Meninggalkan Workspace Kotor**: Jangan mengakhiri sesi dengan status file *uncommitted* atau *unstaged*.
5. ❌ **Dilarang Membuat File Raksasa (>500 Baris)**: Setiap file kode wajib tetap modular (target `<400 baris`, batas mutlak `<500 baris`).
6. ❌ **Dilarang Menimpa Kode Visual Manusia**: Skrip otomasi dilarang menghapus area `[HUMAN WORKSPACE: PROTECTED REGION]` di Storybook.

---

## ✅ 2. What To Do (SOP Praktis Kontributor Ketika Bekerja)

1. 🎨 **Saat Membuat / Mengubah Komponen UI (Storybook First)**:
   - Jalankan Storybook: `npm run storybook`.
   - Buat variasi story memenuhi **Matriks 4 Kuadran** (`Q1: Empty/Rp 0`, `Q2: Short`, `Q3: Overflow 1.8Miliar IDR`, `Q4: Multi-State/Split-Bill`).
   - Gunakan selalu komponen atom Tier 2 dari `@/ui` (`Button`, `Badge`, `PriceTag`, `CapacityBadge`).
2. 🔄 **Saat Menyelaraskan Cerita & Dokumen Skenario**:
   - Jalankan skrip audit storybook: `python3 scripts/radar/story_sync.py --audit`.
3. 🧪 **Sebelum Melakukan Commit**:
   - Jalankan audit radar: `python3 scripts/hfex-rad0.py` dan `npm test`.
   - Pastikan seluruh 10 pilar berstatus **`0 Critical Gaps / 100% Healthy`**.
4. 🚀 **Saat Mengakhiri Sesi Kerja**:
   - Lakukan commit bersih dengan conventional commits dan push ke remote: `git push origin main`.
5. 🔬 **Saat Mengajukan Saran / Perubahan Desain Arsitektur (Implementation-First & Global Benchmarking)**:
   - Wajib selalu mengidentifikasi implementasi aktual di codebase saat ini terlebih dahulu (*Zero-Guessing Rule*).
   - Sajikan perbandingan 3-arah: **[Kondisi Kode Saat Ini] vs [Standar Pemimpin Global (Stripe, AWS, Toast, NetSuite)] vs [Target Usulan Perubahan]**.
