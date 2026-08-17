const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing Storybook TableCard & PriceTag (Desktop 1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:6006/?path=/story/tier-3-widgets-tablecard--occupied-table');
  await page.waitForTimeout(3500);

  await page.screenshot({ path: `${brainDir}/screenshot_storybook_clean.png` });

  await page.close();
  await browser.close();
  console.log('STORYBOOK TABLECARD SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
