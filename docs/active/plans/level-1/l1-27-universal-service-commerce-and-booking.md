---
okf_version: "0.2"
type: Development Plan Level 1
title: Universal Service Economy, Appointment Booking & Event Ticketing Suite (L1-27)
description: Expands Hfe POS and Core Ledger into the comprehensive modern service economy (Legal Consultations, Personal Trainers, Workshops/Garages, Car Wash & Detailing, Clinics, Event Ticketing, and Educational Classes).
tags: [development-plan, level-1, service-economy, booking, event-ticketing, universal-commerce, hfe-pos]
status: Implemented
---

# Level 1 Strategic Plan: Universal Service Economy, Appointment Booking & Event Ticketing Suite (L1-27)

## 1. Executive Summary & Intent
Modern commerce extends far beyond static retail and food items. Service businesses, professional appointments, work orders, educational workshops, and community events comprise a dominant share of modern commercial transactions.

This plan formalizes the **Universal Service & Experience Commerce Architecture** across the 3 Pillars of HFE:
1. **Pillar 1: 📱 Customer QR Experience** (In-store work-order tracking, appointment status, session check-in).
2. **Pillar 2: 🌐 Merchant Landing Page Hub** (Promotion coupons, event calendar, paid event ticketing, and class bookings).
3. **Pillar 3: 🏪 POS Cashier, KDS & Enterprise Backoffice** (Labor/service SKU billing, sparepart BOM consumption, double-entry ledger journals).

---

## 2. Universal Domain Mapping Matrix (Rule #12 Compliance)

| Universal Primitive | F&B / Restaurant | Auto Workshop & Detailing | Professional (Lawyer / PT / Clinic) |
|---|---|---|---|
| **Sellable Item (SKU)** | Makanan / Minuman | Jasa Servis + Oli/Part | Sesi Konsultasi / Kelas / Tiket Event |
| **Spatial Resource** | Meja 1 – 20 | Bay Cuci 1-4 / Pit Stall | Ruang Konsultasi / Bed / Studio |
| **BOM & Depletion** | Biji Kopi, Susu, Sirup | Oli 4L, Busi, Shampo Wax | Waktu Staff, Kit Workshop, Materi |
| **KDS / Dispatch Queue** | KDS Dapur (Hot/Cold) | Job-Card KDS Mekanik | Task Board / Antrian Sesi |
| **Session Billing** | Open-Tab / Running Bill | Work-Order Pengerjaan | Retainer Contract / Paket Sesi |
| **Accounting Revenue** | `4101 - Penjualan Barang` | `4102 - Pendapatan Jasa` | `4103 - Tiket Event & Kelas` |

---

## 3. Child Level 2 Plans
- [`L2-POS-46: Universal Service Economy, Appointment Booking & Event Ticketing Engine`](../level-2/l2-pos-46-universal-services-and-appointment-commerce.md) (`Status: Implemented`)

---

## 4. Verification Evidence
- 100% Modularity Guard (< 500 lines per file).
- 42 test files passing (221/221 unit tests).
- Clean production build with Vite.
