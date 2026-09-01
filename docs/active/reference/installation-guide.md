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

# 4. Sinkronisasi & Audit Skenario Storybook
python3 scripts/radar/story_sync.py --audit
```

---

## 📦 4. Build Produksi & Optimasi Bundle

```bash
# Compile bundle produksi dengan tree-shaking otomatis
npm run build

# Preview build lokal
npm run preview
```

## 5. Company Book handoff configuration

After CORE independently confirms an applied POS posting, the cashier status bar can open the
same posting in `cb-client`. Local synthetic development defaults to `http://localhost:8081`.
Connected preview or production builds have no fallback and require this non-secret variable:

```text
VITE_HFE_COMPANY_BOOK_URL=https://<environment-specific-cb-client-host>
```

Provision `HFE_COMPANY_BOOK_URL` as a GitHub Environment variable for each deployment environment;
the deploy workflow maps it to the Vite variable. Use HTTPS outside localhost, omit credentials,
and bind it to the cb-client environment that shares the same Hfeit IAM organization and Hfe CORE
Company Book. The handoff carries `organizationId`, `companyBookId`, `postingId`, and POS `orderId`;
cb-client must reject the read unless its active IAM session and observed HCB resource token match
that originating organization.

## 6. Cloudflare Pages deployment map

Preview and production use separate Pages projects. A project must never own domains from both
environments.

| Environment | Surface | Pages project | Custom domain | Trigger |
|---|---|---|---|---|
| Preview | POS app | `pos-app-preview` | `prv-pos.hfeit.app` | Every green push to `main` |
| Preview | Landing | `pos-landing-preview` | `prv-pos.hfeit.com` | Every green push to `main` |
| Production | POS app | `pos-app-production` | `pos.hfeit.app` | Manual production dispatch from `main` |
| Production | Landing | `pos-landing-production` | `pos.hfeit.com` | Manual production dispatch from `main` |

All four projects use `main` as their Cloudflare production branch. Environment isolation comes
from the project boundary, not from attaching preview and production domains to different branches
of one project. The deployment isolation test rejects reused project names and branch drift before
the workflow can ship.
