const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture on port ${port}...`);

  // 1. Day Mode Customer QR Order
  const dayContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const dayPage = await dayContext.newPage();
  
  // Set localStorage explicitly for clean day mode
  await dayPage.goto(`http://localhost:${port}/?app=customer`);
  await dayPage.evaluate(() => {
    localStorage.setItem('hfe_theme_mode', 'light');
    localStorage.removeItem('hfe_customer_theme');
  });
  await dayPage.reload();
  await dayPage.waitForTimeout(1000);
  
  const dayScreenshotPath = path.join(brainDir, 'customer_qr_daymode_verified.png');
  await dayPage.screenshot({ path: dayScreenshotPath });
  console.log(`✓ Day Mode captured: ${dayScreenshotPath}`);
  await dayContext.close();

  // 2. Night Mode Customer QR Order
  const nightContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const nightPage = await nightContext.newPage();
  await nightPage.goto(`http://localhost:${port}/?app=customer`);
  await nightPage.evaluate(() => {
    localStorage.setItem('hfe_theme_mode', 'dark');
    localStorage.removeItem('hfe_customer_theme');
  });
  await nightPage.reload();
  await nightPage.waitForTimeout(1000);
  
  const nightScreenshotPath = path.join(brainDir, 'customer_qr_nightmode_verified.png');
  await nightPage.screenshot({ path: nightScreenshotPath });
  console.log(`✓ Night Mode captured: ${nightScreenshotPath}`);
  await nightContext.close();

  await browser.close();
  console.log('Visual verification capture completed!');
})();
