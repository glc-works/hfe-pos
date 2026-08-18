# Post-Mortem & Lessons Learned Index

Knowledge base permanen untuk mencegah pengulangan pola kegagalan.
Setiap entri mencatat apa yang salah, mengapa, dan invariant permanen
yang mencegah pengulangan.

---

## PM-001: Script Engine Disalin ke Experience Tanpa Adaptasi

**Tanggal:** 2026-08-18
**Ditemukan oleh:** Audit independen 3-auditor (Markdown, TypeScript, Scripts)
**Commit:** `dcf68cd` (`origin/main`)

### Pola Kegagalan

Script `hfe.py` dan `agent-state.py` dari repository Engine
(`headless-company-books`) disalin verbatim ke repository Experience
(`hfe-pos`) tanpa mengadaptasi:
- Path filesystem (`hcb2/service/src/`, `v2/service/migrations/`)
- File extension target (`*.rs` instead of `*.ts`/`*.tsx`)
- Subcommand yang membutuhkan Engine-only dependencies (`e2e-master-runner.py`,
  `agent_town/world_sim.py`, `radar.story_sync`)
- Persona files yang tidak ada di Experience repo

### Dampak

- **26 broken references** di tooling — script gagal diam-diam saat dijalankan
- **7 agent skills** mengarahkan ke perintah yang tidak ada
- **16 Playwright scripts** menulis ke conversation ID lama dan port yang salah
- Radar sentinel (`hfex-rad0.py`) melaporkan "9/9 green" tanpa memvalidasi
  bahwa script tooling itu sendiri bisa dijalankan

### Root Cause

1. Copy-paste tanpa checklist adaptasi
2. Tidak ada gate yang memvalidasi bahwa script yang direferensikan benar-benar
   ada dan bisa dijalankan
3. Naming convention `hfe-*` vs `hfex-*` belum ditegakkan saat itu

### Invariant Permanen

1. **Naming enforcement:** Script di `hfe-pos` HARUS menggunakan prefix `hfex-*`.
   Keberadaan file `hfe-*` (tanpa `x`) di repo Experience adalah red flag.
2. **No blind copy:** Saat menyalin script dari repo lain, contributor WAJIB
   menjalankan `grep -r 'hcb2\|v2/service\|\.rs"' <file>` dan mengadaptasi
   semua path yang ditemukan.
3. **Script existence gate:** Setiap path yang direferensikan di `SKILL.md`
   atau `start.sh` harus divalidasi keberadaannya di repo lokal.

### PR Perbaikan

- `fix/hfex-tooling-broken-link-remediation` (L2-pos-86)
