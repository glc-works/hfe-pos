const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const brainDir = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

  console.log('Capturing Storybook POS Workstation in Day Mode (1280x800)...');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:6006/?path=/story/scenarios-scn-01-01-01-bsd-cafe-split-bill--bsd-cafe-scenario-view');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: `${brainDir}/storybook_verified_pos_daymode.png` });

  await page.close();
  await browser.close();
  console.log('POS DAYMODE SCREENSHOT CAPTURED SUCCESSFULLY!');
})();
