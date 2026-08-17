const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing Storybook StoreOnboardingWizard (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:6006/?path=/story/onboarding-storeonboardingwizard--default');
  await page.waitForTimeout(3500);

  await page.screenshot({ path: `${brainDir}/screenshot_storybook_onboarding.png` });

  await page.close();
  await browser.close();
  console.log('STORYBOOK ONBOARDING SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
