const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing HfeCard Portal Views (Mobile 375x812)...');
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3000/?app=customer-portal');
  await page.waitForTimeout(800);

  // 1. Capture LIFE Mode
  await page.screenshot({ path: `${brainDir}/screenshot_card_life_mode.png` });

  // 2. Click WORK Mode
  const workButton = await page.getByRole('button', { name: /Personal \(LIFE\)/i }).locator('..').getByRole('button', { name: /Kantor \/ Staf \(WORK\)/i });
  if (workButton) {
    await workButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${brainDir}/screenshot_card_work_mode.png` });
  }

  // 3. Open Mini App Store Modal
  const appStoreButton = await page.getByRole('button', { name: /Mini App Store/i }).first();
  if (appStoreButton) {
    await appStoreButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${brainDir}/screenshot_card_app_store.png` });
  }

  await page.close();
  await browser.close();
  console.log('HFECARD MODES CAPTURED SUCCESSFULLY!');
})();
