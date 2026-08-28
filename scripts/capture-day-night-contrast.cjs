const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture on port ${port}...`);

  // 1. BOARD Public Storefront with Dual-CTA (Desktop & Mobile)
  const boardContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const boardPage = await boardContext.newPage();
  await boardPage.goto(`http://localhost:${port}/?app=landing`);
  await boardPage.waitForTimeout(800);
  const boardScreenshotPath = path.join(brainDir, 'board_dual_cta_verified.png');
  await boardPage.screenshot({ path: boardScreenshotPath });
  console.log(`✓ BOARD Dual-CTA captured: ${boardScreenshotPath}`);
  await boardContext.close();

  // 2. Online Customer Order (No Table Leakage)
  const onlineOrderContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const onlineOrderPage = await onlineOrderContext.newPage();
  await onlineOrderPage.goto(`http://localhost:${port}/?app=customer`);
  await onlineOrderPage.waitForTimeout(800);
  const onlineOrderScreenshotPath = path.join(brainDir, 'online_order_no_table_leakage_verified.png');
  await onlineOrderPage.screenshot({ path: onlineOrderScreenshotPath });
  console.log(`✓ Online Order (No Table) captured: ${onlineOrderScreenshotPath}`);
  await onlineOrderContext.close();

  // 3. In-Store Table QR Scan (With Table OUT-04)
  const inStoreContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const inStorePage = await inStoreContext.newPage();
  await inStorePage.goto(`http://localhost:${port}/?app=customer&table=OUT-04&seat=Seat%201`);
  await inStorePage.waitForTimeout(800);
  const inStoreScreenshotPath = path.join(brainDir, 'in_store_table_qr_verified.png');
  await inStorePage.screenshot({ path: inStoreScreenshotPath });
  console.log(`✓ In-Store Table QR captured: ${inStoreScreenshotPath}`);
  await inStoreContext.close();

  await browser.close();
  console.log('All visual verification captures completed!');
})();
