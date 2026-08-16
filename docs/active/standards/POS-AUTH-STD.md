---
okf_version: "0.2"
type: Engineering Standard
title: POS-AUTH-STD — Authentication & User Identity Best Practice Standard
description: Mandatory security, accessibility, and UX best practices governing Sign In, Sign Up, Forgot Password, WhatsApp OTP, 6-digit Employee PIN, and Session Management in hfe-pos.
tags: [standard, pos-auth-std, authentication, signup, signin, forgot-password, otps, rbac]
status: Approved
effective_date: 2026-08-15
---

# POS-AUTH-STD: Authentication & User Identity Best Practice Standard

## 1. Scope & Authority

This engineering standard defines the mandatory UX, accessibility (WCAG 2.1), and security (OWASP) best practices for all Authentication flows in **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`).

It covers 3 distinct authentication personas:
1. **Customer Identity** (Phone/WhatsApp OTP, Guest Name Mode, Magic Links)
2. **Staff Workstation Identity** (6-Digit Employee PIN Keypad)
3. **Merchant Owner Identity** (Email + Password Sign In, Sign Up, Forgot Password & Password Reset)

---

## 2. Normative Authentication Best Practice Rules

### Rule 1: Sign In & Sign Up Best Practices (Merchant Owner)
- **Accessible HTML5 Forms**: Every auth screen must use semantic `<form>` containers with proper `<label>`, `htmlFor`, and standard `autocomplete` attributes (`autocomplete="username"`, `autocomplete="current-password"`, `autocomplete="new-password"`).
- **Show/Hide Password Toggle**: Password input fields **MUST** include an accessible visual eye icon toggle (`lucide-react` `Eye` / `EyeOff`) to allow users to verify typed passwords.
- **Real-Time Input Validation**:
  - Email format validation using RFC 5322 regex before form submission.
  - Phone numbers formatted automatically to E.164 standard (`+6281298765432`).
- **Real-Time Password Strength Meter**: Sign Up forms must display visual password strength indicators (Minimum 8 characters, at least 1 uppercase letter, 1 number, and 1 special symbol).

### Rule 2: Forgot Password & Reset Flow (Merchant Owner)
- **2-Step Reset Sequence**:
  1. **Request Reset Token (`POST /v1/auth/forgot-password`)**: User inputs registered email/phone. System sends a 6-digit Reset OTP or Magic Link token.
  2. **Reset Password Confirmation (`POST /v1/auth/reset-password`)**: User enters the 6-digit token and sets a new password with instant strength feedback.
- **Discreet Error Messages**: To prevent email enumeration attacks, forgot password requests must respond with generic success messages (e.g. *"Jika email terdaftar, instruksi reset password telah dikirimkan"*).

### Rule 3: Customer Frictionless WhatsApp Verification (100% Free / Rp 0 Policy)
- **User-Initiated WA Verification (Rp 0 Free Cost)**: To eliminate expensive Meta WhatsApp API OTP fees (~Rp 500/OTP), verification **MUST** use inbound user-initiated WhatsApp links:
  1. Customer inputs WhatsApp number `081298765432` on the web app.
  2. UI displays 1-tap button: **"📱 Verifikasi via WhatsApp (Gratis)"**.
  3. Tapping the button opens WhatsApp with pre-filled text: `VERIFIKASI MEJA-04 KODE 882194` sent to store's WhatsApp number.
  4. Store's automated webhook detects inbound message sender and activates session instantly (`POST /v1/auth/wa-inbound/verify`).
- **Pure Guest Mode Default**: Scanning table QR defaults to name-only entry (e.g. "Aldi") without forcing upfront phone verification. Phone numbers are requested optionally for digital receipt or loyalty point accrual.

### Rule 4: Staff Workstation 6-Digit Employee PIN
- **Tactile Keypad**: POS Cashier tablets feature a large, touch-friendly 3x4 numeric keypad for 6-digit Employee PIN entry.
- **Auto-Submit on 6th Digit**: Automatically validates PIN against `POST /v1/company-books/{book}/auth/employee-login` once the 6th digit is typed.

### Rule 5: Security & Anti-Bruteforce Rate Limiting
- **Rate Limiting Guard**: Maximum **5 failed attempts** per IP/Device within 5 minutes. Upon 5 consecutive failures, the UI triggers a **60-second cooldown timer** with a disabled submit button.
- **Secure Token Storage**: Auth tokens stored in `localStorage` (`hfe_pos_auth_token`) must be cleared cleanly upon logout (`usePosAuth().logout()`).

---

## 3. Auth API Endpoint Contracts Reference

| Auth Action | HTTP Method & URI | Payload / Parameters |
|---|---|---|
| **Owner Sign In** | `POST /v1/auth/login` | `{ "email": "...", "password": "..." }` |
| **Owner Sign Up** | `POST /v1/auth/register` | `{ "brand_name": "...", "email": "...", "password": "..." }` |
| **Forgot Password Request** | `POST /v1/auth/forgot-password` | `{ "email": "..." }` |
| **Reset Password Confirm** | `POST /v1/auth/reset-password` | `{ "token": "...", "new_password": "..." }` |
| **WhatsApp OTP Send** | `POST /v1/auth/otp/send` | `{ "phone": "+6281298765432" }` |
| **WhatsApp OTP Verify** | `POST /v1/auth/otp/verify` | `{ "phone": "+6281298765432", "otp_code": "882194" }` |
| **Employee PIN Login** | `POST /v1/company-books/{book}/auth/employee-login` | `{ "branch_id": "...", "pin_code": "882194" }` |
