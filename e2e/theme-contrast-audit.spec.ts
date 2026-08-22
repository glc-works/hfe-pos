import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('WCAG 2.2 Day & Night Theme Contrast Audit (HFE-UI-STD-001)', () => {
  test('audit: Customer Mobile QR View (Day & Night Mode Contrast)', async ({ page }) => {
    // 1. Audit Night Mode
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/?app=customer&table=OUT-04')
    await page.waitForLoadState('networkidle')

    const nightAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const nightContrastViolations = nightAudit.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    expect(nightContrastViolations).toHaveLength(0)

    // 2. Audit Day Mode (Simulated Light Theme)
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body?.classList.remove('dark')
      document.body?.classList.add('light')
    })
    await page.waitForTimeout(300)

    const dayAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const dayContrastViolations = dayAudit.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    expect(dayContrastViolations).toHaveLength(0)
  })

  test('audit: POS Cashier Workstation (Day & Night Mode Contrast)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/?app=cafe&surface=barista-pos')
    await page.waitForLoadState('networkidle')

    // 1. Audit Dark Theme
    const darkAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const darkViolations = darkAudit.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    expect(darkViolations).toHaveLength(0)

    // 2. Audit Day Theme
    const themeBtn = page.locator('button:has-text("☀️"), button:has-text("🌙")').first()
    if (await themeBtn.isVisible()) {
      await themeBtn.click()
      await page.waitForTimeout(300)
    } else {
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        document.body?.classList.remove('dark')
        document.body?.classList.add('light')
      })
    }

    const lightAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const lightViolations = lightAudit.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    expect(lightViolations).toHaveLength(0)
  })
})
