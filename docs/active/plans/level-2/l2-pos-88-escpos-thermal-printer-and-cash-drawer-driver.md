# Level 2 Implementation Plan: L2-POS-88 Direct ESC/POS Thermal Printer & Cash Drawer Driver

## 1. Metadata
- **Plan ID**: `L2-POS-88`
- **Title**: Direct ESC/POS Thermal Printer & Cash Drawer Driver
- **Status**: `In-Progress`
- **Owner**: `Agent Antigravity`
- **Scope**: `glc-works/hfe-pos`
- **Standard**: `POS-ENG-STD-001`, `HFE-UI-STD-001`, `HFE-OMBOK-STD-001`

---

## 2. Executive Summary & Problem Statement
Kasir toko fisik membutuhkan kemampuan mencetak struk thermal (58mm / 80mm) secara instan tanpa dialog pop-up browser print (`window.print()`), serta memicu pembukaan laci kasir otomatis (*RJ11 cash drawer kick*) saat transaksi tunai selesai.

Rencana ini membangun modul driver **ESC/POS Binary Encoder**, **ThermalPrinterService** (WebBluetooth / WebUSB / Simulated Driver), dan antarmuka pengaturan perangkat keras printer kasir.

---

## 3. Architecture & Domain Separation
```text
src/
├── services/hardware/
│   ├── EscPosEncoder.ts                    <-- Binary ESC/POS Byte Encoder (58mm & 80mm)
│   └── ThermalPrinterService.ts            <-- WebBluetooth & WebUSB Printer Connection Manager
├── components/hardware/
│   └── ThermalPrinterSettingsModal.tsx     <-- Modal Pengaturan Printer & Uji Laci Kasir
├── components/modals/
│   └── ReceiptModal.tsx                    <-- Integrasi tombol cetak ESC/POS instan
├── tests/
│   └── escPosThermalPrinterAndDrawer.test.ts <-- Unit test suite validasi binary byte commands
└── stories/hardware/
    └── ThermalPrinterSettingsModal.stories.tsx <-- Storybook visual suite
```

---

## 4. Verification Criteria
- [x] Modularity Guard (<500 lines per file).
- [x] Typecheck clean (`npx tsc --noEmit`).
- [x] Unit test suite (`escPosThermalPrinterAndDrawer.test.ts`) 100% pass.
- [x] Production build success.
