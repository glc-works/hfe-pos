const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || require('path').join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'default-captures');

  console.log('Capturing verified Storybook screens...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  // 1. CustomerMobileView in Storybook UI
  await page.goto('http://localhost:6006/?path=/story/customer-customermobileview--mobile-checkout-view');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${brainDir}/storybook_verified_customer_mobile.png` });

  // 2. BSD Cafe Split Bill Scenario in Storybook UI
  await page.goto('http://localhost:6006/?path=/story/scenarios-scn-01-01-01-bsd-cafe-split-bill--multi-state-split-bill');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${brainDir}/storybook_verified_bsd_split_bill.png` });

  // 3. Unified Settings Hub in Storybook UI
  await page.goto('http://localhost:6006/?path=/story/onboarding-unifiedsettingshub--unified-settings-hub-showcase');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${brainDir}/storybook_verified_unified_settings.png` });

  await page.close();
  await browser.close();
  console.log('ALL VERIFIED SCREENSHOTS CAPTURED SUCCESSFULLY!');
})();
