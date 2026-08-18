const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || require('path').join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'default-captures');

  console.log('Capturing Foreign USD Tender View (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:5173/?app=cafe');
  await page.waitForTimeout(800);

  // Click on USD tender chip
  const usdChip = await page.getByRole('button', { name: /USD/i }).first();
  if (usdChip) {
    await usdChip.click();
    await page.waitForTimeout(400);
  }

  // Click on $10 preset button
  const usd10Btn = await page.getByRole('button', { name: /\$10/i }).first();
  if (usd10Btn) {
    await usd10Btn.click();
    await page.waitForTimeout(300);
  }

  await page.screenshot({ path: `${brainDir}/screenshot_pos_cashier_usd_tender.png` });

  await page.close();
  await browser.close();
  console.log('FOREIGN USD TENDER VIEW CAPTURED SUCCESSFULLY!');
})();
