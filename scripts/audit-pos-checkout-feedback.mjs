import { chromium } from 'playwright'
import path from 'node:path'

const ARTIFACT_DIR = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656'
const BASE_URL = 'http://localhost:5173'

async function runCheckoutFeedbackAudit() {
  console.log('🚀 Running POS Checkout Feedback Visual Audit...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  try {
    // 1. Go to POS and login with demo PIN
    await page.goto(`${BASE_URL}/?app=cafe`, { waitUntil: 'networkidle' })
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(600)

    for (const num of ['1', '2', '3', '4', '5', '6']) {
      const btn = page.locator(`button:has-text("${num}")`).first()
      if (await btn.isVisible()) await btn.click()
    }
    const loginSubmitBtn = page.locator('button:has-text("Masuk Kasir"), button:has-text("Masuk")').first()
    if (await loginSubmitBtn.isVisible()) await loginSubmitBtn.click()
    await page.waitForTimeout(800)

    // Handle any alert dialogs automatically
    page.on('dialog', async dialog => {
      console.log(`🔔 Dialog popup detected: "${dialog.message()}"`)
      await dialog.accept()
    })

    // 2. Select a table OUT-04 and add item from Speed Keys
    const tableCard = page.locator('div:has-text("OUT-04")').first()
    if (await tableCard.isVisible()) await tableCard.click()
    await page.waitForTimeout(400)

    // Click Speed Key item "Espresso Aren Latte" to put it in cart
    const speedKeyItem = page.locator('button:has-text("Espresso Aren Latte")').first()
    if (await speedKeyItem.isVisible()) {
      await speedKeyItem.click()
      await page.waitForTimeout(400)
    }

    // Click cash denomination button 100rb
    const cash100rb = page.locator('button:has-text("100rb")').first()
    if (await cash100rb.isVisible()) {
      await cash100rb.click()
      await page.waitForTimeout(300)
    }

    // Capture pre-checkout state
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pos_01_pre_checkout.png'),
    })
    console.log('✅ Captured pos_01_pre_checkout.png')

    // 3. Click the checkout button once (Step 1: Request Quote)
    console.log('🖱️ Clicking Checkout Button (Step 1: Request Quote)...')
    const step1Btn = page.locator('button:has-text("Quote"), button:has-text("Bayar")').last()
    if (await step1Btn.isVisible()) {
      await step1Btn.click()
      await page.waitForTimeout(800)
    }

    // Step 2: Click the confirmed button (Terima Quote Tertinjau / Bayar)
    console.log('🖱️ Clicking Checkout Button (Step 2: Settle & Post)...')
    const step2Btn = page.locator('button:has-text("Quote"), button:has-text("Bayar"), button:has-text("Terima")').last()
    if (await step2Btn.isVisible()) {
      await step2Btn.click()
      await page.waitForTimeout(1500)
    }

    // 4. Capture post-checkout success feedback state
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pos_02_post_checkout_success.png'),
    })
    console.log('✅ Captured pos_02_post_checkout_success.png')

    // 5. Test QRIS Dynamic Payment Modal
    // Add item again
    const plusBtn = page.locator('button[title="Tambah"], button:has-text("+")').first()
    if (await plusBtn.isVisible()) {
      await plusBtn.click()
      await page.waitForTimeout(400)
    }

    // Switch tender to QRIS
    const qrisTenderBtn = page.locator('button:has-text("QRIS")').first()
    if (await qrisTenderBtn.isVisible()) {
      await qrisTenderBtn.click()
      await page.waitForTimeout(400)
    }

    // Click Pay with QRIS
    const qrisPayBtn = page.locator('button:has-text("Tinjau Quote CORE"), button:has-text("Bayar")').first()
    if (await qrisPayBtn.isVisible()) {
      await qrisPayBtn.click()
      await page.waitForTimeout(800)
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pos_03_qris_modal_feedback.png'),
    })
    console.log('✅ Captured pos_03_qris_modal_feedback.png')

    console.log('🎉 POS Checkout Visual Feedback Audit Completed!')
  } catch (err) {
    console.error('❌ Error during checkout audit:', err)
  } finally {
    await browser.close()
  }
}

runCheckoutFeedbackAudit()
