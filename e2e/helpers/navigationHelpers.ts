import { Page, expect } from '@playwright/test'

export async function openFloatKit(page: Page) {
  // If drawer already open, return
  if (await page.locator('text=A. Domain & Pilar Pengalaman').isVisible()) {
    return
  }
  // Click floatkit toggle button
  const toggleBtn = page.locator('button[title*="FloatKit"], button:has-text("DevKit"), button:has-text("⚙️")').first()
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click()
  } else {
    // Fallback shortcut Alt+D
    await page.keyboard.press('Alt+KeyD')
  }
}

export async function switchPillar(page: Page, pillar: 'customer' | 'cafe' | 'landing' | 'customer-portal') {
  await openFloatKit(page)
  const pillarMap: Record<string, string> = {
    customer: '📱 Customer (ORDER)',
    cafe: '🏪 Merchant (POS / Core)',
    landing: '🌐 Landing (BOARD)',
    'customer-portal': '💳 Card / Member Pass',
  }
  const btn = page.locator(`button:has-text("${pillarMap[pillar] || pillar}")`).first()
  if (await btn.isVisible()) {
    await btn.click()
  }
}

export async function switchStaffRole(page: Page, role: 'barista-pos' | 'kds-screen' | 'hfe-insights' | 'branch-mgmt') {
  await switchPillar(page, 'cafe')
  await openFloatKit(page)
  const roleMap: Record<string, string> = {
    'barista-pos': '🏪 Kasir',
    'kds-screen': '🍳 Dapur',
    'hfe-insights': '📈 Insights',
    'branch-mgmt': '🏢 Cabang',
  }
  const btn = page.locator(`button:has-text("${roleMap[role] || role}")`).first()
  if (await btn.isVisible()) {
    await btn.click()
  }
}
