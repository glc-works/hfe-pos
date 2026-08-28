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

  // 2. Capture POS with Speed Keys
  const posScreenshotPath = path.join(brainDir, 'pos_track_order_dock_verified.png');
  await page.screenshot({ path: posScreenshotPath });
  console.log(`✓ POS Speed Keys / Workstation captured: ${posScreenshotPath}`);

  // 3. Switch to Lacak Dapur Tab in PosFavoritesBar
  const trackBtn = page.getByRole('button', { name: /Lacak Dapur/i });
  if (await trackBtn.count() > 0) {
    await trackBtn.first().click();
    await page.waitForTimeout(500);
    const posTrackScreenshotPath = path.join(brainDir, 'pos_in_place_track_orders_verified.png');
    await page.screenshot({ path: posTrackScreenshotPath });
    console.log(`✓ POS In-Place Track Orders tab captured: ${posTrackScreenshotPath}`);
  }

  await context.close();
  await browser.close();
  console.log('All visual verification captures completed!');
})();
