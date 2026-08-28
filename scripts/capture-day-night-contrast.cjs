const { chromium } = require('playwright');
const path = require('path');
const demoAccess = require('../fixtures/demo/access.json');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture on port ${port}...`);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // 1. Login as demo staff
  await page.goto(`http://localhost:${port}/?app=cafe`);
  await page.waitForTimeout(800);

  const pinText = page.getByText('Masukkan 6 Digit PIN Kasir');
  if (await pinText.isVisible()) {
    try {
      await page.locator('select').selectOption(demoAccess.branchId);
    } catch (e) {}
    for (const digit of demoAccess.staff.pin) {
      await page.getByRole('button', { name: digit, exact: true }).click();
      await page.waitForTimeout(40);
    }
    await page.getByRole('button', { name: 'Masuk ke Kasir POS ➔' }).click();
    await page.waitForTimeout(1000);
  }

  // 2. Expand Track Order Dock on POS
  try {
    const trackBtn = page.getByRole('button', { name: /Lacak Pesanan Dapur/i });
    if (await trackBtn.count() > 0) {
      await trackBtn.first().click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('Track dock button toggle skipped');
  }

  const posScreenshotPath = path.join(brainDir, 'pos_track_order_dock_verified.png');
  await page.screenshot({ path: posScreenshotPath });
  console.log(`✓ POS Track Order Dock captured: ${posScreenshotPath}`);

  // 3. Navigate to Merchant Hub & Unlock PIN
  await page.goto(`http://localhost:${port}/?app=cafe&surface=merchant-hub`);
  await page.waitForTimeout(1000);

  const pinInput = page.locator('input[type="password"]');
  if (await pinInput.isVisible()) {
    await pinInput.fill('8888');
    await page.getByRole('button', { name: /Buka Akses Hub/i }).click();
    await page.waitForTimeout(1000);
  }

  // Click on Executive Insights Tab
  const insightsTab = page.locator('button:has-text("Executive Insights")').first();
  if (await insightsTab.count() > 0) {
    await insightsTab.click();
    await page.waitForTimeout(1000);
  }

  // Scroll to Favorite Products Leaderboard
  const leaderboard = page.locator('text=Menu Terlaris (Favorite Products)').first();
  if (await leaderboard.count() > 0) {
    await leaderboard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  } else {
    await page.evaluate(() => {
      const scrollable = document.querySelector('.overflow-y-auto') || document.querySelector('main');
      if (scrollable) scrollable.scrollTop = 650;
    });
    await page.waitForTimeout(600);
  }

  const hubScreenshotPath = path.join(brainDir, 'hub_favorite_products_verified.png');
  await page.screenshot({ path: hubScreenshotPath });
  console.log(`✓ HUB Favorite Products captured: ${hubScreenshotPath}`);

  await context.close();
  await browser.close();
  console.log('All visual verification captures completed!');
})();
