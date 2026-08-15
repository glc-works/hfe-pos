# CLAUDE.md — Contributor Quickstart & Command Reference for `hfe-pos`

## Repository Purpose
`glc-works/hfe-pos` is the official **Point of Sale (POS) & Retail Cashier Frontend Suite** for Headless Company Books (`Hfe`).

## Key Technology Stack
- **Frontend Core:** HTML5, Modern Vanilla JavaScript (ES2024), Vanilla CSS (TailwindCSS for rapid component layout).
- **Offline Storage:** IndexedDB / LocalStorage for offline-first cashier resilience.
- **Hfe Backend API:** Connects to `Hfe` REST endpoints (`POST /v1/pos/checkout`, `POST /v1/pos/shifts/reconcile`).

## Essential Commands
- **Run Local Server:** `python3 -m http.server 8085` or `npx vite`
- **Lint / Check:** `npm test` or `npx eslint`
- **Build Production:** `npm run build`

## Code Conventions
- 2 spaces indent for HTML/CSS/JS.
- Clean component modularity without over-abstraction.
- Use explicit error handling for network offline states (cashier resilience).
