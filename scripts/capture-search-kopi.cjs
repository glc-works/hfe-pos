const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || require('path').join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'default-captures');

  console.log('Capturing POS Catalog Search "kopi" View (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:5173/?app=cafe');
  await page.waitForTimeout(800);

  // Click on "Katalog Menu" tab button
  const catalogTabButton = await page.getByRole('button', { name: /Katalog Menu/i });
  if (catalogTabButton) {
    await catalogTabButton.click();
    await page.waitForTimeout(400);
  }

  // Type "kopi" in the in-page search bar
  const searchInput = await page.getByPlaceholder(/Cari nama menu/i);
  if (searchInput) {
    await searchInput.fill('kopi');
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: `${brainDir}/screenshot_pos_search_kopi.png` });
  await page.close();
  await browser.close();
  console.log('SEARCH KOPI SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
