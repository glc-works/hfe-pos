const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = process.env.BRAIN_DIR || require('path').join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'default-captures');

  console.log('Capturing Storybook StoreOnboardingWizard (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:6006/?path=/story/onboarding-storeonboardingwizard--default');
  await page.waitForTimeout(3500);

  await page.screenshot({ path: `${brainDir}/screenshot_storybook_onboarding.png` });

  await page.close();
  await browser.close();
  console.log('STORYBOOK ONBOARDING SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
