import { chromium } from 'playwright'
import path from 'node:path'

const ARTIFACT_DIR = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656'

async function auditCardTender() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  await page.goto('http://localhost:5173/?app=cafe', { waitUntil: 'networkidle' })

  // Login PIN 123456
  for (const n of ['1', '2', '3', '4', '5', '6']) {
    const btn = page.locator(`button:has-text("${n}")`).first()
    if (await btn.isVisible()) await btn.click()
  }
  const loginSubmitBtn = page.locator('button:has-text("Masuk")').first()
  if (await loginSubmitBtn.isVisible()) await loginSubmitBtn.click()
  await page.waitForTimeout(600)

  // Click Table OUT-04
  await page.locator('div:has-text("OUT-04")').first().click()
  await page.waitForTimeout(400)

  // Click Kartu button
  const cardBtn = page.locator('button:has-text("Kartu"), [data-testid="tender-card"]').first()
  if (await cardBtn.isVisible() && !await cardBtn.isDisabled()) {
    await cardBtn.click()
    await page.waitForTimeout(500)
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'pos_04_card_tender_view.png')
  })
  console.log('✅ Captured pos_04_card_tender_view.png')
  await browser.close()
}

auditCardTender()
