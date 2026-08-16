const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  const captures = [
    {
      name: 'POS Cashier Workstation (Desktop 1280x800)',
      file: 'screenshot_pos_cashier.png',
      url: 'http://localhost:3000/?app=cafe',
      width: 1280,
      height: 800,
    },
    {
      name: 'Customer Member Passbook (Mobile 375x812)',
      file: 'screenshot_customer_portal.png',
      url: 'http://localhost:3000/?app=customer-portal',
      width: 375,
      height: 812,
    },
    {
      name: 'Public Landing Storefront (Desktop 1280x800)',
      file: 'screenshot_landing_page.png',
      url: 'http://localhost:3000/?app=landing',
      width: 1280,
      height: 800,
    },
    {
      name: 'Customer QR Menu & Cart (Mobile 375x812)',
      file: 'screenshot_customer_qr_mobile.png',
      url: 'http://localhost:3000/?app=customer',
      width: 375,
      height: 812,
    },
  ];

  for (const item of captures) {
    console.log(`Capturing ${item.name}...`);
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
    await page.goto(item.url);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${brainDir}/${item.file}` });
    await page.close();
  }

  await browser.close();
  console.log('ALL PRIMARY VIEWS CAPTURED SUCCESSFULLY VIA QUERY PARAMS!');
})();
