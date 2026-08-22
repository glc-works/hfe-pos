import { test, expect } from '@playwright/test'

test.describe('Visual Regression & Spatial Snapshot Suite (HFE-UI-STD-001)', () => {
  test.describe.configure({ mode: 'parallel' })

  test('visual: Customer Mobile QR Order View (390px Viewport)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/?app=customer&table=OUT-04')
    await page.waitForLoadState('networkidle')

    const customerCanvas = page.locator('.theme-customer-container').first()
    await expect(customerCanvas).toBeVisible()

    // Assert visual pixel comparison with 5% antialiasing tolerance
    await expect(page).toHaveScreenshot('customer-mobile-qr-order.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })

  test('visual: POS Cashier Workstation (Desktop 1280px Dark Mode)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/?app=cafe&surface=barista-pos')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()

    await expect(page).toHaveScreenshot('pos-workstation-dark.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })

  test('visual: POS Cashier Workstation (Desktop 1280px Day/Light Mode)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/?app=cafe&surface=barista-pos')
    await page.waitForLoadState('networkidle')

    // Click theme toggle button to switch to Day Mode
    const themeToggleBtn = page.locator('button:has-text("☀️"), button:has-text("🌙"), button[title*="Theme"]').first()
    if (await themeToggleBtn.isVisible()) {
      await themeToggleBtn.click()
    }

    await expect(page.locator('body')).toBeVisible()

    await expect(page).toHaveScreenshot('pos-workstation-day.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })

  test('visual: Merchant Hub Executive Insights (Realtime Business Truth Card)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/?app=cafe&surface=merchant-hub')
    await page.waitForLoadState('networkidle')

    // Unlock PIN if prompted
    const pinInput = page.locator('input[type="password"]').first()
    if (await pinInput.isVisible()) {
      await pinInput.fill('8888')
      const submitPinBtn = page.locator('button:has-text("Buka Akses Hub"), button:has-text("Masuk")').first()
      if (await submitPinBtn.isVisible()) {
        await submitPinBtn.click()
      }
    }

    // Switch to Executive Insights Tab
    const insightsTabBtn = page.locator('button:has-text("Executive Insights"), button:has-text("Kinerja & Laba")').first()
    if (await insightsTabBtn.isVisible()) {
      await insightsTabBtn.click()
    }

    await expect(page).toHaveScreenshot('hub-executive-insights.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    })
  })
})
