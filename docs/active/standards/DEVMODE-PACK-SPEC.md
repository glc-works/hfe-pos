# DevMode Pack — Reusable Developer QA & Multi-Device Viewport Suite (GLC-DEV-001)

**Status:** APPROVED REUSABLE FRONTEND SPECIFICATION  
**Target:** React / TypeScript / Vite / TailwindCSS Applications  
**Module Location:** [`src/components/dev/DevModePack.tsx`](file:///Users/aldi/claudefiles/hfe-pos/src/components/dev/DevModePack.tsx)

---

## 🎯 PURPOSE & PROBLEM SOLVED

Saat membangun aplikasi Web / POS / Commerce multi-surface (Customer Mobile QR, Cashier Touch POS, Kitchen KDS, Back-Office Settings):
1. **Physical Testing Friction:** Membuka browser DevTools Chrome untuk mengubah mode responsive sering kali merepotkan dan tidak memberikan simulasi hardware yang akurat (notch, bezels, safe-area).
2. **Policy / Business Rule Testing:** Mengubah skenario bisnis (misal: *Pay-First Pre-paid* vs *Open-Tab Post-paid*, atau *Tax PB1 ON/OFF*) sering kali membutuhkan login ulang ke Back-Office yang lambat.
3. **Production Leakage Risk:** Dev toolbar sering kali tidak sengaja bocor ke pengguna akhir di perangkat mobile produksi.

**`DevModePack`** memecahkan masalah ini dengan menyediakan suite modular **1-Tap Developer Toolbar & Physical Viewport Simulator** yang siap di-plug ke aplikasi frontend mana pun dengan **Zero-Production Leakage**.

---

## 📦 COMPONENT ARCHITECTURE & FEATURES

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 🛠️ DEVMODE TOOLBAR (Visible on Dev Mode, 100% Tree-shaken/Hidden on Production Preview) │
 │ [ 🌐 Landing ] [ 📱 Customer QR ] [ 🏪 Cashier POS ] │ Policy: [ 💳 Pre ] [ 📋 Post ] │
 │ [ 📱 Mobile 390 ] [ 📱 Tab Port 640 ] [ 💻 Tab Land 1024 ] [ 🖥️ Desktop ] │ [ 🇮🇩 ID | 🇬🇧 EN ] │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │                                                                                        │
 │      ┌──────────────────────────────────────────────────────────┐                      │
 │      │ 📱 PHYSICAL DEVICE FRAME SIMULATOR                       │                      │
 │      │  - Top Speaker Notch (Mobile) / Camera Dot (Tablet)      │                      │
 │      │  - Realistic Titanium/Slate Bezels & Smooth Radii        │                      │
 │      │  - Independent Nested Scroll Container                   │                      │
 │      │                                                          │                      │
 │      │       [ CHILD APPLICATION VIEW ENGINE ]                  │                      │
 │      │                                                          │                      │
 │      └──────────────────────────────────────────────────────────┘                      │
 │                                                                                        │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. 🌐 1-Tap App Surface Switcher
- Tombol berpindah antar domain/surface aplikasi secara instan tanpa reload halaman:
  - `Landing Page` (B2C Showcase)
  - `Customer QR` (Mobile Dining & Ordering)
  - `Cashier & Staff POS` (General Touchscreen Workstation & KDS)

### 2. ⚡ Instant Business Rule & Policy Switcher
- Tombol 1-klik untuk beralih mode bisnis secara reaktif:
  - `[ 💳 Pay-First (Pre-Paid) ]`: Customer bayar terlebih dahulu sebelum tiket diteruskan ke Barista/Kitchen.
  - `[ 📋 Open-Tab (Post-Paid) ]`: Pesanan langsung ditembak ke Barista/Kitchen, tagihan dibayar belakangan saat checkout di kasir.

### 3. 📱 Hardware Viewport Simulation
- Menyediakan 4 mode viewport presisi:
  - **`📱 Mobile`**: `380px × 660px` dengan rounded corner 38px & speaker notch.
  - **`📱 Tab Portrait`**: `500px × 660px` dengan camera bezel.
  - **`💻 Tab Landscape`**: `880px × 560px` dengan widescreen layout.
  - **`🖥️ Desktop Fluid`**: Edge-to-edge full width.

### 4. 🛡️ Zero-Production Leakage Guard
- Memeriksa `import.meta.env.DEV` dan port testing (`window.location.port !== '4173'`).
- Pada device customer riil / production build preview, `DevModePack` langsung me-render `children` secara utuh tanpa membungkus frame atau menampilkan toolbar apa pun.

---

## 💻 CONTOH CARA PAKAI DI PROJECT BARU

```tsx
import React, { useState } from 'react'
import { DevModePack, ViewportModeType } from './components/dev/DevModePack'

export default function App() {
  const [activeApp, setActiveApp] = useState<'landing' | 'customer' | 'cafe'>('customer')
  const [viewportMode, setViewportMode] = useState<ViewportModeType>('responsive')
  const [paymentPolicy, setPaymentPolicy] = useState<'pay-first' | 'open-tab'>('pay-first')

  return (
    <DevModePack
      activeApp={activeApp}
      onSwitchDomain={setActiveApp}
      viewportMode={viewportMode}
      onSetViewportMode={setViewportMode}
      paymentPolicy={paymentPolicy}
      onSetPaymentPolicy={setPaymentPolicy}
    >
      {activeApp === 'customer' && <CustomerApp paymentPolicy={paymentPolicy} />}
      {activeApp === 'cafe' && <CashierApp />}
      {activeApp === 'landing' && <LandingPage />}
    </DevModePack>
  )
}
```
