const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || require('path').join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'default-captures');

  console.log('Capturing Smartphone Framed CustomerMobileView (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:6006/?path=/story/customer-customermobileview--mobile-qr-scan-catalog');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: `${brainDir}/storybook_verified_mobile_phone_frame.png` });

  await page.close();
  await browser.close();
  console.log('SMARTPHONE FRAME SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
