# 📦 HFE-POS Installation & Deployment Guide: Experience Layer & Edge Terminals

Panduan resmi instalasi, deployment, dan konfigurasi antarmuka kasir POS, KDS Dapur, Storybook visual, dan edge runtime untuk repositori **HFE-POS**.

---

## 🚀 1. Persyaratan Lingkungan
- **Node.js**: v20.x atau v22.x LTS
- **Package Manager**: `npm` (atau `pnpm`)
- **Browser Target**: Chromium 110+, Safari 16.4+, Firefox 115+ (Mobile, Tablet, Desktop POS)

---

## 💻 2. Instalasi Lokal & Development Server

```bash
# 1. Clone repository
git clone https://github.com/glc-works/hfe-pos.git
cd hfe-pos

# 2. Install dependencies
npm install

# 3. Jalankan Vite Development Server (<100ms HMR)
npm run dev

# 4. Jalankan Storybook Living Component Workspace
npm run storybook
```

---

## 🧪 3. Menjalankan Suite Audit & Pengujian

```bash
# 1. Menjalankan 9-Pillar Radar & Audit Gap Sentinel (hfex-rad0)
python3 scripts/hfex-rad0.py

# 2. Menjalankan 92 Vitest Test Suites
npm test

# 3. Menjalankan Typecheck TypeScript Mandatori
npm run typecheck

# 4. Sinkronisasi Skenario Storybook & Living Spec
python3 scripts/hfe.py story sync
```

---

## 📦 4. Build Produksi & Optimasi Bundle

```bash
# Compile bundle produksi dengan tree-shaking otomatis
npm run build

# Preview build lokal
npm run preview
```
