import { test, expect } from '@playwright/test'
import { switchPillar, switchStaffRole } from './helpers/navigationHelpers'

test.describe('POS Suite Canonical Smoke Gate (Issue #55)', () => {
  test('Landing Page (BOARD) boots and renders merchant hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#root')).toBeAttached()
    const brandHeading = page.locator('text=Kopitiam').or(page.locator('text=POS')).or(page.locator('h1, h2')).first()
    await expect(brandHeading).toBeVisible({ timeout: 10000 })
  })

  test('Customer QR view (ORDER) renders catalog and order flow', async ({ page }) => {
    await page.goto('/')
    await switchPillar(page, 'customer')
    await expect(page.locator('#root')).toBeAttached()
    const customerHeader = page.locator('text=Daftar Menu').or(page.locator('text=Kopitiam')).or(page.locator('button:has-text("Keranjang")')).first()
    await expect(customerHeader).toBeVisible({ timeout: 10000 })
  })

  test('Customer Member Portal (CARD) renders digital passbook', async ({ page }) => {
    await page.goto('/')
    await switchPillar(page, 'customer-portal')
    await expect(page.locator('#root')).toBeAttached()
    const memberElement = page.locator('text=Member').or(page.locator('text=Poin')).or(page.locator('text=Voucher')).or(page.locator('text=Kartu')).first()
    await expect(memberElement).toBeVisible({ timeout: 10000 })
  })

  test('Cashier POS Workstation (POS) renders catalog and cart dock', async ({ page }) => {
    await page.goto('/')
    await switchStaffRole(page, 'barista-pos')
    await expect(page.locator('#root')).toBeAttached()
    const posElement = page.locator('input[placeholder*="Cari"]').or(page.locator('button:has-text("Bayar")')).or(page.locator('text=OUT-01')).or(page.locator('text=Kasir')).first()
    await expect(posElement).toBeVisible({ timeout: 10000 })
  })
})
