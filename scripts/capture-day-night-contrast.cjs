const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture for Day Mode Express Checkout & Address Modal on port ${port}...`);

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const page = await mobileContext.newPage();

  // Explicitly initialize localStorage with clean Day Mode state
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
  });

  // 1. Navigate to Customer QR / Online App in Delivery Mode (Clean Day Mode)
  await page.goto(`http://localhost:${port}/?app=customer&fulfillment=delivery`);
  await page.waitForTimeout(1000);

  // Add 1 item to cart if empty
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

  // Click the floating bottom cart dock to go to checkout
  const cartDock = page.locator('.min-h-\\[64px\\]').first();
  if (await cartDock.isVisible()) {
    await cartDock.click();
    await page.waitForTimeout(1000);
  }

  const dayModeCheckoutPath = path.join(brainDir, 'day_mode_express_checkout_verified.png');
  await page.screenshot({ path: dayModeCheckoutPath });
  console.log(`✓ Day Mode Express Checkout captured: ${dayModeCheckoutPath}`);

  // 2. Click "Ubah" on Address Summary Card to open Dedicated Address Modal
  const editAddressBtn = page.locator('button:has-text("Ubah")').first();
  if (await editAddressBtn.isVisible()) {
    await editAddressBtn.click();
    await page.waitForTimeout(600);

    const addressModalPath = path.join(brainDir, 'day_mode_detailed_address_modal_verified.png');
    const modalContent = page.locator('div.fixed.inset-0.z-50 > div.w-full').first();
    if (await modalContent.isVisible()) {
      await modalContent.screenshot({ path: addressModalPath });
    } else {
      await page.screenshot({ path: addressModalPath });
    }
    console.log(`✓ Day Mode Detailed Address Modal captured: ${addressModalPath}`);
  }

  // 3. Capture POS Workstation in Day Mode
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
  });
  await desktopPage.goto(`http://localhost:${port}/?app=cafe`);
  await desktopPage.waitForTimeout(1000);

  const posDayModePath = path.join(brainDir, 'day_mode_pos_workstation_verified.png');
  await desktopPage.screenshot({ path: posDayModePath });
  console.log(`✓ Day Mode POS Workstation captured: ${posDayModePath}`);

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();
  console.log('All Day Mode visual captures completed!');
})();
