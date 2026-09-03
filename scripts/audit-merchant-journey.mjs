import { chromium } from 'playwright'
import path from 'node:path'

const ARTIFACT_DIR = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656'
const BASE_URL = 'http://localhost:5173'

async function runMerchantJourneyAudit() {
  console.log('🚀 Running Complete Automated Merchant Journey Audit...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  try {
    // -------------------------------------------------------------
    // STAGE 1: AUTH & LOGIN VIEW (POS Staff PIN / Owner Auth)
    // -------------------------------------------------------------
    await page.goto(`${BASE_URL}/?app=cafe`, { waitUntil: 'networkidle' })
    // Ensure clean state (logout if logged in)
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_01_auth_login.png'),
    })
    console.log('✅ Stage 1: Auth & Login View captured.')

    // -------------------------------------------------------------
    // STAGE 2: LOGIN VIA CANONICAL DEMO PIN (123456)
    // -------------------------------------------------------------
    // Click keypad numbers: 1, 2, 3, 4, 5, 6
    for (const num of ['1', '2', '3', '4', '5', '6']) {
      const btn = page.locator(`button:has-text("${num}")`).first()
      if (await btn.isVisible()) {
        await btn.click()
        await page.waitForTimeout(50)
      }
    }
    const loginSubmitBtn = page.locator('button:has-text("Masuk Kasir"), button:has-text("Masuk")').first()
    if (await loginSubmitBtn.isVisible()) {
      await loginSubmitBtn.click()
      await page.waitForTimeout(1000)
    }

    // -------------------------------------------------------------
    // STAGE 3: POS CASHIER WORKSTATION (FLOOR PLAN & TABLES)
    // -------------------------------------------------------------
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_02_pos_floorplan.png'),
    })
    console.log('✅ Stage 2: POS Cashier Floor Plan captured.')

    // -------------------------------------------------------------
    // STAGE 4: CATALOG & CART TRANSACTION IN POS
    // -------------------------------------------------------------
    // Switch to Catalog mode or click table
    const tableCard = page.locator('div:has-text("IND-01"), div:has-text("OUT-04")').first()
    if (await tableCard.isVisible()) {
      await tableCard.click()
      await page.waitForTimeout(600)
    }

    // Click on a product to add to cart
    const addProductBtn = page.locator('button[title="Tambah"], button:has-text("+")').first()
    if (await addProductBtn.isVisible()) {
      await addProductBtn.click()
      await page.waitForTimeout(500)
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_03_pos_cart_and_catalog.png'),
    })
    console.log('✅ Stage 3: POS Cart & Catalog captured.')

    // -------------------------------------------------------------
    // STAGE 5: MERCHANT HUB & EXECUTIVE INSIGHTS
    // -------------------------------------------------------------
    await page.goto(`${BASE_URL}/?app=cafe&surface=admin-hub`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_04_hub_overview.png'),
    })
    console.log('✅ Stage 4: Merchant Hub Overview captured.')

    // -------------------------------------------------------------
    // STAGE 6: KDS MULTI-STATION ROUTING SCREEN
    // -------------------------------------------------------------
    await page.goto(`${BASE_URL}/?app=cafe&surface=kds-screen`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_05_kds_routing.png'),
    })
    console.log('✅ Stage 5: KDS Multi-Station Routing captured.')

    // -------------------------------------------------------------
    // STAGE 7: STOREFRONT BOARD & CUSTOMER QR VIEW
    // -------------------------------------------------------------
    await page.goto(`${BASE_URL}/?app=landing`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'merchant_06_storefront_board.png'),
    })
    console.log('✅ Stage 6: Storefront BOARD Landing captured.')

    console.log('🎉 All merchant journey screenshots saved successfully!')
  } catch (err) {
    console.error('❌ Audit error:', err)
  } finally {
    await browser.close()
  }
}

runMerchantJourneyAudit()
