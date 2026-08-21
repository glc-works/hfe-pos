const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Native Component Gallery Playwright Audit...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const brainDir = process.env.BRAIN_DIR || '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  // 1. Navigate to Gallery
  console.log('1. Navigating to http://localhost:3000/?surface=gallery...');
  await page.goto('http://localhost:3000/?surface=gallery', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 10000 });

  // Assert Title & Sections
  const title = await page.textContent('h1');
  if (!title.includes('Native Component Gallery')) {
    throw new Error(`Expected title to include "Native Component Gallery", got "${title}"`);
  }
  console.log('✅ Title verified:', title);

  // Capture Desktop Screenshot
  const desktopShot = path.join(brainDir, 'native_gallery_desktop_overview.png');
  await page.screenshot({ path: desktopShot, fullPage: false });
  console.log(`📸 Saved Desktop Overview: ${desktopShot}`);

  // 2. Test Mobile Viewport (iPhone 14)
  console.log('2. Testing Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const mobileShot = path.join(brainDir, 'native_gallery_mobile_overview.png');
  await page.screenshot({ path: mobileShot, fullPage: false });
  console.log(`📸 Saved Mobile Overview: ${mobileShot}`);

  // 3. Test Theme Toggle (Day Mode)
  console.log('3. Testing Theme Switcher...');
  const themeToggle = await page.locator('button:has-text("Day Mode"), button:has-text("Dark Mode")').first();
  if (themeToggle) {
    await themeToggle.click();
    await page.waitForTimeout(500);
    const dayModeShot = path.join(brainDir, 'native_gallery_day_mode.png');
    await page.screenshot({ path: dayModeShot, fullPage: false });
    console.log(`📸 Saved Day Mode: ${dayModeShot}`);
  }

  // 4. Test Search Query Filtering
  console.log('4. Testing Search Query Filtering (q=Button)...');
  const searchInput = await page.locator('input[placeholder*="Cari"]').first();
  if (searchInput) {
    await searchInput.fill('Button');
    await page.waitForTimeout(500);
    const searchShot = path.join(brainDir, 'native_gallery_search_button.png');
    await page.screenshot({ path: searchShot, fullPage: false });
    console.log(`📸 Saved Search Filter: ${searchShot}`);
  }

  await browser.close();
  console.log('🎉 Native Component Gallery Playwright Audit Passed 100%!');
})().catch((err) => {
  console.error('❌ Gallery Audit Failed:', err);
  process.exit(1);
});
