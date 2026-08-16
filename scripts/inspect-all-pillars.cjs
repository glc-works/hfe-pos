const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(600);

  const openFloatKit = async () => {
    const floatBtn = page.locator('button:has-text("Dev")').first();
    if (await floatBtn.isVisible()) {
      await floatBtn.click();
      await page.waitForTimeout(300);
    }
  };

  const closeFloatKit = async () => {
    const closeBtn = page.locator('button[title*="Tutup"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  };

  // 1. POS Cashier View
  console.log('Capturing POS Cashier...');
  await openFloatKit();
  const posAppBtn = page.locator('button:has-text("POS & Resto")').first();
  if (await posAppBtn.isVisible()) await posAppBtn.click();
  await page.waitForTimeout(200);
  const kasirRoleBtn = page.locator('button:has-text("Kasir")').first();
  if (await kasirRoleBtn.isVisible()) await kasirRoleBtn.click();
  await closeFloatKit();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656/screenshot_pos_cashier.png' });

  // 2. KDS Kitchen View
  console.log('Capturing KDS Kitchen...');
  await openFloatKit();
  const kdsRoleBtn = page.locator('button:has-text("Dapur")').first();
  if (await kdsRoleBtn.isVisible()) await kdsRoleBtn.click();
  await closeFloatKit();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656/screenshot_kds_kitchen.png' });

  // 3. Member Portal
  console.log('Capturing Member Portal...');
  await openFloatKit();
  const memberBtn = page.locator('button:has-text("Member Portal")').first();
  if (await memberBtn.isVisible()) await memberBtn.click();
  await closeFloatKit();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656/screenshot_customer_portal.png' });

  // 4. Landing Page
  console.log('Capturing Landing Page...');
  await openFloatKit();
  const landingBtn = page.locator('button:has-text("Landing Page")').first();
  if (await landingBtn.isVisible()) await landingBtn.click();
  await closeFloatKit();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656/screenshot_landing_page.png' });

  await browser.close();
  console.log('Done capturing all screenshots!');
})();
