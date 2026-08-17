const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing POS Catalog Explorer View (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000/?app=cafe');
  await page.waitForTimeout(800);

  // Click on "Katalog Menu" tab button
  const catalogTabButton = await page.getByRole('button', { name: /Katalog Menu/i });
  if (catalogTabButton) {
    await catalogTabButton.click();
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: `${brainDir}/screenshot_pos_catalog.png` });
  await page.close();
  await browser.close();
  console.log('POS CATALOG VIEW CAPTURED SUCCESSFULLY!');
})();
