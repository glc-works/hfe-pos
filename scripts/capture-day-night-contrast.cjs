const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture for Luxury Delivery Checkout on port ${port}...`);

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const page = await mobileContext.newPage();

  // 1. Navigate to Customer QR / Online App in Delivery Mode
  await page.goto(`http://localhost:${port}/?app=customer&fulfillment=delivery`);
  await page.waitForTimeout(1000);

  // Click the plus button to add item
  const addBtn = page.getByTitle(/Tambah/i).first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await page.waitForTimeout(500);

    const confirmAddBtn = page.getByRole('button', { name: /Masukkan ke Keranjang|Tambah ke Pesanan/i }).first();
    if (await confirmAddBtn.isVisible()) {
      await confirmAddBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // Click the floating bottom cart dock
  const cartDock = page.locator('.min-h-\\[64px\\]').first();
  if (await cartDock.isVisible()) {
    await cartDock.click();
    await page.waitForTimeout(1000);
  }

  const deliveryCheckoutPath = path.join(brainDir, 'delivery_checkout_precision_verified.png');
  await page.screenshot({ path: deliveryCheckoutPath, fullPage: false });
  console.log(`✓ Mobile Delivery Checkout captured: ${deliveryCheckoutPath}`);

  // 2. Click "Ubah" on Payment Selector to open rich payment methods modal
  const changePaymentBtn = page.locator('button:has-text("Ubah")').first();
  if (await changePaymentBtn.isVisible()) {
    await changePaymentBtn.click();
    await page.waitForTimeout(600);
    const paymentModalPath = path.join(brainDir, 'delivery_payment_selector_modal_verified.png');
    
    // Screenshot of the active modal sheet card
    const modalContent = page.locator('div.fixed.inset-0.z-50 > div.w-full').first();
    if (await modalContent.isVisible()) {
      await modalContent.screenshot({ path: paymentModalPath });
    } else {
      await page.screenshot({ path: paymentModalPath });
    }
    console.log(`✓ Delivery Payment Methods Modal captured: ${paymentModalPath}`);
  }

  await mobileContext.close();
  await browser.close();
  console.log('All visual captures completed!');
})();
