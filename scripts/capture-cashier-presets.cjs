const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing Cashier Clean Cash Presets View...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(800);

  // Switch to POS app if needed
  const posTab = await page.locator('text=POS').first();
  if (posTab) await posTab.click();

  // Add 10 items
  const addBtn = await page.locator('button:has-text("+")').first();
  if (addBtn) {
    for (let i = 0; i < 6; i++) {
      await addBtn.click();
      await page.waitForTimeout(100);
    }
  }

  // Click Cash button
  const cashBtn = await page.locator('button:has-text("Cash")').first();
  if (cashBtn) await cashBtn.click();

  await page.waitForTimeout(500);
  await page.screenshot({ path: `${brainDir}/screenshot_pos_cashier_clean_presets.png` });

  await page.close();
  await browser.close();
  console.log('CASHIER PRESETS VIEW CAPTURED SUCCESSFULLY!');
})();
