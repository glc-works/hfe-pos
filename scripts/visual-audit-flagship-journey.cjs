const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting comprehensive Flagship Journey visual audit on port ${port}...`);

  const mockStaff = {
    employeeId: 'EMP-001',
    staffName: 'Budi Santoso',
    role: 'cashier',
    branchId: 'BRANCH-HQ-01'
  };

  const ownerStaff = {
    employeeId: 'OWNER-001',
    staffName: 'Alexander (Owner)',
    role: 'owner',
    branchId: 'BRANCH-HQ-01'
  };

  // --- 1. ORDER PILAR (Mobile 390px) - DAY MODE ---
  const mobileDayContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobileDayPage = await mobileDayContext.newPage();
  await mobileDayPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
  });

  // 1A. Customer Catalog in Day Mode
  await mobileDayPage.goto(`http://localhost:${port}/?app=customer`);
  await mobileDayPage.waitForTimeout(1000);
  const catalogDayPath = path.join(brainDir, 'journey_1_order_catalog_day.png');
  await mobileDayPage.screenshot({ path: catalogDayPath });
  console.log(`✓ 1A. Order Catalog Day Mode captured: ${catalogDayPath}`);

  // Add 1 item to cart
  const addBtn = mobileDayPage.getByTitle(/Tambah/i).first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await mobileDayPage.waitForTimeout(400);
    const confirmBtn = mobileDayPage.getByRole('button', { name: /Masukkan ke Keranjang|Tambah ke Pesanan/i }).first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await mobileDayPage.waitForTimeout(400);
    }
  }

  // Go to Express Checkout
  const cartDock = mobileDayPage.locator('.min-h-\\[64px\\]').first();
  if (await cartDock.isVisible()) {
    await cartDock.click();
    await mobileDayPage.waitForTimeout(800);
  }
  const checkoutDayPath = path.join(brainDir, 'journey_1_order_checkout_day.png');
  await mobileDayPage.screenshot({ path: checkoutDayPath });
  console.log(`✓ 1B. Order Checkout Day Mode captured: ${checkoutDayPath}`);

  // --- 2. POS PILAR (Desktop 1280px) - DAY MODE ---
  const desktopDayContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const desktopDayPage = await desktopDayContext.newPage();
  await desktopDayPage.addInitScript((staff) => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
    localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify(staff));
  }, mockStaff);

  await desktopDayPage.goto(`http://localhost:${port}/?app=cafe&surface=barista-pos`);
  await desktopDayPage.waitForTimeout(1200);
  const posDayPath = path.join(brainDir, 'journey_2_pos_workstation_day.png');
  await desktopDayPage.screenshot({ path: posDayPath });
  console.log(`✓ 2. POS Workstation Day Mode captured: ${posDayPath}`);

  // --- 3. POS PILAR (Desktop 1280px) - NIGHT MODE ---
  const desktopNightContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const desktopNightPage = await desktopNightContext.newPage();
  await desktopNightPage.addInitScript((staff) => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'dark');
    localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify(staff));
  }, mockStaff);

  await desktopNightPage.goto(`http://localhost:${port}/?app=cafe&surface=barista-pos`);
  await desktopNightPage.waitForTimeout(1200);
  const posNightPath = path.join(brainDir, 'journey_2_pos_workstation_night.png');
  await desktopNightPage.screenshot({ path: posNightPath });
  console.log(`✓ 3. POS Workstation Night Mode captured: ${posNightPath}`);

  // --- 4. KDS PILAR (Kitchen Display 1280px) ---
  const kdsContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const kdsPage = await kdsContext.newPage();
  await kdsPage.addInitScript((staff) => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
    localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify(staff));
  }, mockStaff);
  await kdsPage.goto(`http://localhost:${port}/?app=cafe&surface=kds-screen`);
  await kdsPage.waitForTimeout(1200);
  const kdsPath = path.join(brainDir, 'journey_3_kds_kitchen_screen.png');
  await kdsPage.screenshot({ path: kdsPath });
  console.log(`✓ 4. KDS Screen captured: ${kdsPath}`);

  // --- 5. BOARD / HUB PILAR (Executive Insights 1280px) ---
  const hubContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const hubPage = await hubContext.newPage();
  await hubPage.addInitScript((owner) => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'light');
    localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify(owner));
  }, ownerStaff);
  await hubPage.goto(`http://localhost:${port}/?app=cafe&surface=admin-hub`);
  await hubPage.waitForTimeout(1200);
  const hubPath = path.join(brainDir, 'journey_4_executive_hub_day.png');
  await hubPage.screenshot({ path: hubPath });
  console.log(`✓ 5. Executive Hub captured: ${hubPath}`);

  await mobileDayContext.close();
  await desktopDayContext.close();
  await desktopNightContext.close();
  await kdsContext.close();
  await hubContext.close();
  await browser.close();

  console.log('✨ All Flagship Journey visual audit screenshots completed successfully!');
})();
