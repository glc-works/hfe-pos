const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';
  const port = process.env.PORT || '3000';

  console.log(`Starting visual capture for Day and Night Mode on port ${port}...`);

  // 1. Mobile Day Mode Checkout
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
  await mobileDayPage.goto(`http://localhost:${port}/?app=customer&fulfillment=delivery`);
  await mobileDayPage.waitForTimeout(800);
  const addBtnDay = mobileDayPage.getByTitle(/Tambah/i).first();
  if (await addBtnDay.isVisible()) {
    await addBtnDay.click();
    await mobileDayPage.waitForTimeout(400);
    const confirmAdd = mobileDayPage.getByRole('button', { name: /Masukkan ke Keranjang|Tambah ke Pesanan/i }).first();
    if (await confirmAdd.isVisible()) await confirmAdd.click();
  }
  const cartDockDay = mobileDayPage.locator('.min-h-\\[64px\\]').first();
  if (await cartDockDay.isVisible()) {
    await cartDockDay.click();
    await mobileDayPage.waitForTimeout(800);
  }
  await mobileDayPage.screenshot({ path: path.join(brainDir, 'day_mode_express_checkout_verified.png') });

  // 2. Mobile Night Mode Checkout
  const mobileNightContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobileNightPage = await mobileNightContext.newPage();
  await mobileNightPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'dark');
  });
  await mobileNightPage.goto(`http://localhost:${port}/?app=customer&fulfillment=delivery`);
  await mobileNightPage.waitForTimeout(800);
  const addBtnNight = mobileNightPage.getByTitle(/Tambah/i).first();
  if (await addBtnNight.isVisible()) {
    await addBtnNight.click();
    await mobileNightPage.waitForTimeout(400);
    const confirmAdd = mobileNightPage.getByRole('button', { name: /Masukkan ke Keranjang|Tambah ke Pesanan/i }).first();
    if (await confirmAdd.isVisible()) await confirmAdd.click();
  }
  const cartDockNight = mobileNightPage.locator('.min-h-\\[64px\\]').first();
  if (await cartDockNight.isVisible()) {
    await cartDockNight.click();
    await mobileNightPage.waitForTimeout(800);
  }
  const nightCheckoutPath = path.join(brainDir, 'night_mode_express_checkout_verified.png');
  await mobileNightPage.screenshot({ path: nightCheckoutPath });
  console.log(`✓ Night Mode Express Checkout captured: ${nightCheckoutPath}`);

  // 3. Desktop POS Workstation Night Mode
  const desktopNightContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const desktopNightPage = await desktopNightContext.newPage();
  await desktopNightPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hfe_theme_mode', 'dark');
    localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
    localStorage.setItem('hfe_pos_auth_user', JSON.stringify({ employeeId: 'EMP-001', staffName: 'Budi (Kasir)', role: 'cashier', branchId: 'BRANCH-HQ-01' }));
  });
  await desktopNightPage.goto(`http://localhost:${port}/?app=cafe&surface=barista-pos`);
  await desktopNightPage.waitForTimeout(1200);
  const nightPosPath = path.join(brainDir, 'night_mode_pos_workstation_verified.png');
  await desktopNightPage.screenshot({ path: nightPosPath });
  console.log(`✓ Night Mode POS Workstation captured: ${nightPosPath}`);

  await mobileDayContext.close();
  await mobileNightContext.close();
  await desktopNightContext.close();
  await browser.close();
  console.log('✨ All Day and Night Mode captures finished successfully!');
})();
